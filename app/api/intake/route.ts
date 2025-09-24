// Edge-ზე ლამაზი და სწრაფი POST proxy -> Formspree
export const runtime = "edge";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mldprazw"; // შენი form ID

export async function POST(req: Request) {
  try {
    const inData = await req.formData();

    // ჰონიპოტი, თუ ბოტმა შეავსო — ჩავშალოთ
    const gotcha = (inData.get("_gotcha") || "").toString().trim();
    if (gotcha) {
      return new Response(JSON.stringify({ ok: true, spam: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    // გადავწეროთ page_url/referrer — ვაიძულოთ production დომენი
    const out = new FormData();
    inData.forEach((v, k) => out.append(k, v));
    out.set("page_url", "https://www.locksmith-pro.org/");
    out.set("referrer", "https://www.locksmith-pro.org/");

    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: out,
      headers: {
        Accept: "application/json",
        // ზოგი ანტი-სპამისთვის კარგია რეალური დომენის მითითება:
        Origin: "https://www.locksmith-pro.org",
        Referer: "https://www.locksmith-pro.org/",
      },
    });

    if (!res.ok) {
      const txt = await res.text();
      return new Response(JSON.stringify({ ok: false, error: txt }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ ok: false, error: e?.message || "proxy failed" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
