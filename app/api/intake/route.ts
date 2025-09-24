// app/api/intake/route.ts
export async function POST(req: Request) {
  try {
    const FORMSPREE = process.env.NEXT_PUBLIC_FORMSPREE;
    if (!FORMSPREE) {
      return new Response(
        JSON.stringify({ error: "Formspree endpoint is missing (NEXT_PUBLIC_FORMSPREE)." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await req.formData();

    const res = await fetch(FORMSPREE, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
      // credentials არ გვჭირდება; Formspree არ მოითხოვს კუკებს
    });

    const contentType = res.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    return new Response(
      typeof payload === "string" ? payload : JSON.stringify(payload),
      {
        status: res.status,
        headers: { "Content-Type": contentType || "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Proxy error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
