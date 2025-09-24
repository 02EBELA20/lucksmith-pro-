"use client";

import { useState } from "react";
import { PHONE_DISPLAY, PHONE_E164 } from "../lib/seo";
import CallButton from "./CallButton";

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export default function SmartHero() {
  const [locating, setLocating] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function reverseGeocode(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers: { "Accept-Language": "en-US,en;q=0.8" } });
    const data = await res.json();
    const a = data?.address ?? {};
    const city = a.city || a.town || a.village || a.hamlet || a.suburb || a.county || "your-area";
    const zip = a.postcode || "";
    return { city, zip };
  }

  function go(url: string) {
    window.location.href = url;
  }

  async function useMyLocation() {
    setErr(null);
    setLocating(true);

    if (!("geolocation" in navigator)) {
      setErr("Geolocation is not supported on this device.");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const { city, zip } = await reverseGeocode(latitude, longitude);
          go(`/${slug(city)}?lat=${latitude}&lng=${longitude}&zip=${encodeURIComponent(zip)}&city=${encodeURIComponent(city)}#request`);
        } catch (e: any) {
          setErr(e?.message || "Failed to detect your location.");
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

  const telHref = `tel:${PHONE_E164}`;

  return (
    <section className="card-dark p-8">
      <h1 className="text-3xl md:text-4xl font-extrabold">
        LocksmithPro Express — <span className="text-cyan-300">Near you</span>
      </h1>
      <p className="mt-2 text-white/80">
        Fast, reliable 24/7 locksmith. One tap to use your location — we’ll take you to your local page and pre-fill the form.
      </p>

      <div className="mt-5 flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="btn"
          title="Use my location"
        >
          {locating ? "Locating…" : "📍 Use my location"}
        </button>

        <CallButton href={telHref} className="btn btn-primary">
          Call {PHONE_DISPLAY}
        </CallButton>
      </div>

      {err && <p className="text-sm text-red-300 mt-2">{err}</p>}
    </section>
  );
}
