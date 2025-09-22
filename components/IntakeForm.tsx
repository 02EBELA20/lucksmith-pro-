"use client";
import { useMemo, useState } from "react";

type ProblemType = "House Lockout" | "Car Lockout" | "Rekey" | "Lock Change" | "Car Key" | "Other";

export default function IntakeForm({ initialCity = "" }: { initialCity?: string }) {
  const [status, setStatus] = useState("");
  const [problem, setProblem] = useState<ProblemType>("House Lockout");
  const [asap, setAsap] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState(initialCity);
  const [zip, setZip] = useState("");
  const [details, setDetails] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoNote, setGeoNote] = useState("");

  const smsHref = useMemo(() => {
    const to = process.env.NEXT_PUBLIC_SMS_E164 || "";
    const text = encodeURIComponent(
      [
        `Locksmith request: ${problem}`,
        name && `Name: ${name}`,
        phone && `Phone: ${phone}`,
        (address || city || zip) && `Location: ${[address, city, zip].filter(Boolean).join(", ")}`,
        coords && `GPS: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`,
        details && `Details: ${details}`
      ].filter(Boolean).join(" • ")
    );
    return `sms:${to}?&body=${text}`;
  }, [problem, name, phone, address, city, zip, coords, details]);

  async function useMyLocation() {
    if (!navigator.geolocation) { setGeoNote("Geolocation not supported."); return; }
    setGeoNote("Locating…");
    navigator.geolocation.getCurrentPosition(async (p) => {
      const lat = p.coords.latitude, lng = p.coords.longitude;
      setCoords({ lat, lng });
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (res.ok) {
          const j = await res.json();
          const a = j.address || {};
          const streetLine = [a.house_number, a.road].filter(Boolean).join(" ");
          if (streetLine) setAddress(streetLine);
          setCity((a.city || a.town || a.village || a.hamlet || city || "").toString());
          setZip((a.postcode || zip || "").toString());
          setGeoNote("Location filled ✔");
        } else setGeoNote("GPS captured. Type address.");
      } catch { setGeoNote("GPS captured. Type address."); }
    }, (err) => setGeoNote(err.message || "Could not get location."), { enableHighAccuracy: true, timeout: 10000 });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending…");

    const data = new FormData();
    data.set("name", name);
    data.set("phone", phone);
    data.set("address", address);
    data.set("apt", apt);
    data.set("city", city);
    data.set("zip", zip);
    data.set("problem", problem);
    data.set("asap", asap ? "Yes" : "No");
    data.set("details", details);
    if (coords) data.set("coords", `${coords.lat},${coords.lng}`);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_FORMSPREE as string, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });
      if (res.ok) {
        setStatus("Request sent. We’ll call you back in minutes. ✅");
        // არ ვშლით სახელს/ტელეფონს, რომ მომხმარებელი შეცდომის გარეშე ისევ განაგრძოს
        setAddress(""); setApt(""); setZip(""); setDetails("");
      } else setStatus("Error sending request.");
    } catch { setStatus("Error sending request."); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 sm:mt-6">
      {/* slim badge (clean) */}
<div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 text-emerald-900 text-xs sm:text-sm shadow-sm">
  {/* check icon */}
  <svg viewBox="0 0 20 20" className="h-4 w-4 text-emerald-600" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.3a1 1 0 0 1-1.42-.005L3.29 9.996a1 1 0 1 1 1.42-1.41l3.072 3.066 6.493-6.59a1 1 0 0 1 1.43.228z" clipRule="evenodd" />
  </svg>
  <span>We’ll call you back <strong>in minutes</strong>. Just the basics — we’ll handle the rest.</span>
</div>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className="input" name="name" placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)} required/>
        <input className="input" name="phone" type="tel" inputMode="tel" placeholder="Best phone number" value={phone} onChange={e=>setPhone(e.target.value)} required/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="input md:col-span-2" name="address" placeholder="Address (street & number)" value={address} onChange={e=>setAddress(e.target.value)}/>
        <input className="input" name="apt" placeholder="Apt / Unit (optional)" value={apt} onChange={e=>setApt(e.target.value)}/>
        <input className="input" name="city" placeholder="City" value={city} onChange={e=>setCity(e.target.value)}/>
        <input className="input" name="zip" placeholder="ZIP" pattern="[0-9]{5}" title="5-digit ZIP" value={zip} onChange={e=>setZip(e.target.value)}/>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <button type="button" onClick={useMyLocation} className="btn btn-ghost w-full sm:w-auto">
          Use my location (auto-fill)
        </button>
        {geoNote && <span className="text-xs text-slate-600">{geoNote}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select name="problem" className="input" value={problem} onChange={e=>setProblem(e.target.value as ProblemType)}>
          <option>House Lockout</option><option>Car Lockout</option><option>Rekey</option>
          <option>Lock Change</option><option>Car Key</option><option>Other</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={asap} onChange={e=>setAsap(e.target.checked)} />
          ASAP / Emergency
        </label>
      </div>

      <textarea
        className="input h-36 sm:h-28"
        name="details"
        placeholder="Describe the issue (lock brand, door type, kids/pets inside, etc.)"
        value={details}
        onChange={e=>setDetails(e.target.value)}
      />

      <input type="hidden" name="coords" value={coords ? `${coords.lat},${coords.lng}` : ""} />

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <button type="submit" className="btn btn-primary w-full sm:w-auto">Send Request</button>
        <a href={smsHref} className="btn btn-ghost w-full sm:w-auto">Text (prefilled)</a>
        {status && <span className="text-xs sm:text-sm">{status}</span>}
      </div>
    </form>
  );
}
