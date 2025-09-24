"use client";

import { useEffect, useState } from "react";

type Props = { initialCity?: string };
type ReverseAddr = { street?: string; city?: string; state?: string; postcode?: string };

export default function IntakeForm({ initialCity }: Props) {
  const [sending, setSending] = useState(false);
  const [locating, setLocating] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});
  const [addr, setAddr] = useState<ReverseAddr>({ city: initialCity });

  const [meta, setMeta] = useState({
    page_url: "",
    referrer: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    const qs = url.searchParams;

    setMeta({
      page_url: url.href,
      referrer: document.referrer || "",
      utm_source: qs.get("utm_source") || "",
      utm_medium: qs.get("utm_medium") || "",
      utm_campaign: qs.get("utm_campaign") || "",
    });

    const qpCity = qs.get("city");
    const qpZip = qs.get("zip");
    const qLat = qs.get("lat");
    const qLng = qs.get("lng");

    setAddr((p) => ({ ...p, city: qpCity || p.city, postcode: qpZip || p.postcode }));
    if (qLat && qLng) {
      const lat = parseFloat(qLat);
      const lng = parseFloat(qLng);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) setCoords({ lat, lng });
    }
  }, []);

  async function reverseGeocode(lat: number, lng: number): Promise<ReverseAddr> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers: { "Accept-Language": "en-US,en;q=0.8" } });
    const a = (await res.json())?.address ?? {};
    const street = [a.house_number, a.road].filter(Boolean).join(" ").trim() || undefined;
    const city = a.city || a.town || a.village || a.hamlet || a.suburb || a.county || undefined;
    const state = a.state || undefined;
    const postcode = a.postcode || undefined;
    return { street, city, state, postcode };
  }

  async function useMyLocation() {
    setErr(null);
    setLocating(true);

    if (!("geolocation" in navigator)) {
      setErr("Geolocation is not supported.");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });
          const info = await reverseGeocode(latitude, longitude);
          setAddr((prev) => ({ ...prev, ...info }));
        } catch (e: any) {
          setErr(e?.message || "Failed to resolve address.");
        } finally {
          setLocating(false);
        }
      },
      (geoErr) => {
        setErr(geoErr.message || "Location permission denied.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setErr(null);

    try {
      const fd = new FormData(e.currentTarget);
      fd.set("_subject", `New Locksmith Lead — ${addr.city || initialCity || "Website"}`);
      fd.set("_gotcha", ""); // honeypot
      if (coords.lat) fd.set("lat", String(coords.lat));
      if (coords.lng) fd.set("lng", String(coords.lng));

      // meta
      fd.set("page_url", meta.page_url);
      fd.set("referrer", meta.referrer);
      fd.set("utm_source", meta.utm_source);
      fd.set("utm_medium", meta.utm_medium);
      fd.set("utm_campaign", meta.utm_campaign);

      // ENV წაიკითხე აქ – ბილდში ჩანაცვლდება სტრინგით
      const FORMSPREE = (process.env.NEXT_PUBLIC_FORMSPREE || "").trim();
      const endpoint = FORMSPREE || "/api/intake";
      const headers = endpoint.startsWith("http") ? { Accept: "application/json" } : undefined;

      const res = await fetch(endpoint, { method: "POST", body: fd, headers });

      const ct = res.headers.get("content-type") || "";
      const body = ct.includes("application/json") ? await res.json() : await res.text();

      if (!res.ok) {
        console.error("Submit failed:", res.status, body);
        let msg = `Submission failed (${res.status}).`;
        if (typeof body === "object" && body?.errors?.length) {
          msg += " " + body.errors.map((x: any) => x.message).join(" ");
        } else if (typeof body === "string" && body) {
          msg += " " + body.slice(0, 200);
        }
        setErr(msg);
        return;
      }

      (window as any).gtag?.("event", "lead_submit");
      window.location.href = "/thanks";
    } catch (e: any) {
      console.error("Submit exception:", e);
      setErr(e?.message || "Submission error.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      {/* hidden */}
      <input type="hidden" name="_gotcha" />
      <input type="hidden" name="_subject" />
      <input type="hidden" name="lat" value={coords.lat ?? ""} />
      <input type="hidden" name="lng" value={coords.lng ?? ""} />
      <input type="hidden" name="page_url" value={meta.page_url} />
      <input type="hidden" name="referrer" value={meta.referrer} />
      <input type="hidden" name="utm_source" value={meta.utm_source} />
      <input type="hidden" name="utm_medium" value={meta.utm_medium} />
      <input type="hidden" name="utm_campaign" value={meta.utm_campaign} />

      <div className="grid gap-2 md:grid-cols-2">
        <input name="name" placeholder="Full name" required className="input" />
        <input name="phone" placeholder="Phone" required className="input" />
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="flex gap-2">
          <input
            name="address"
            placeholder="Street address"
            value={addr.street ?? ""}
            onChange={(e) => setAddr((p) => ({ ...p, street: e.target.value }))}
            className="input flex-1"
          />
          <button type="button" onClick={useMyLocation} className="btn" disabled={locating}>
            {locating ? "Locating…" : "📍 Use my location"}
          </button>
        </div>

        <input
          name="city"
          placeholder="City"
          value={addr.city ?? ""}
          onChange={(e) => setAddr((p) => ({ ...p, city: e.target.value }))}
          className="input"
        />
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <input
          name="zip"
          placeholder="ZIP code"
          value={addr.postcode ?? ""}
          onChange={(e) => setAddr((p) => ({ ...p, postcode: e.target.value }))}
          className="input"
        />
        <select name="service" className="input" defaultValue="Car Lockout">
          <option>Car Lockout</option>
          <option>House Lockout</option>
          <option>Rekey</option>
          <option>Lock Change</option>
          <option>Car Key Replacement</option>
          <option>Commercial Service</option>
        </select>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <select name="urgency" className="input" defaultValue="Now (Emergency)">
          <option>Now (Emergency)</option>
          <option>Within 1–3 hours</option>
          <option>Today</option>
        </select>
        <input name="email" type="email" placeholder="Email (optional)" className="input" />
      </div>

      <textarea name="notes" placeholder="Details" className="input" rows={4} />

      {err && (
        <p className="text-sm text-red-500" aria-live="polite">
          {err}
        </p>
      )}

      <button type="submit" disabled={sending} className="btn btn-primary">
        {sending ? "Sending..." : "Send Request"}
      </button>

      <p className="text-xs text-slate-500 mt-1">
        By tapping “Use my location” you agree to share your approximate location to auto-fill the form.
      </p>
    </form>
  );
}
