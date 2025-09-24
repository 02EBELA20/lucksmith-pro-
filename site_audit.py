# site_audit.py
# Usage: python site_audit.py https://www.locksmith-pro.org
import asyncio
import sys
import time
from urllib.parse import urljoin, urlparse

import aiohttp
from aiohttp import ClientTimeout
from bs4 import BeautifulSoup
import pandas as pd
import tldextract
from tqdm import tqdm

CONCURRENCY = 8
TIMEOUT = 20

HEADERS = {
    "User-Agent": "SiteAuditBot/1.0 (+https://www.locksmith-pro.org)"
}


async def fetch(session, url):
    start = time.time()
    try:
        async with session.get(url, timeout=ClientTimeout(total=TIMEOUT)) as resp:
            text = await resp.text(errors="ignore")
            elapsed = time.time() - start
            return {"url": url, "status": resp.status, "text": text, "headers": dict(resp.headers), "time": elapsed, "error": None}
    except Exception as e:
        return {"url": url, "status": None, "text": "", "headers": {}, "time": None, "error": str(e)}


def parse_sitemap(sitemap_text, base_url):
    # crude but practical parse for sitemap.xml urlset -> loc
    urls = []
    soup = BeautifulSoup(sitemap_text, "lxml")
    for loc in soup.find_all("loc"):
        u = loc.get_text().strip()
        if u:
            urls.append(u)
    # fallback: include base root
    if not urls:
        urls.append(base_url)
    return urls


def same_domain(base, other):
    be = tldextract.extract(base)
    oe = tldextract.extract(other)
    return (be.domain == oe.domain and be.suffix == oe.suffix)


def analyze_html(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    title = (soup.title.string.strip() if soup.title and soup.title.string else "")
    meta_description = ""
    md = soup.find("meta", attrs={"name": "description"})
    if md and md.get("content"):
        meta_description = md["content"].strip()
    viewport = bool(soup.find("meta", attrs={"name": "viewport"}))
    canonical = ""
    link_canon = soup.find("link", rel="canonical")
    if link_canon and link_canon.get("href"):
        canonical = link_canon["href"].strip()
    robots_meta = ""
    rmeta = soup.find("meta", attrs={"name": "robots"})
    if rmeta and rmeta.get("content"):
        robots_meta = rmeta["content"].strip()
    # JSON-LD: find <script type="application/ld+json">
    jsonld_localbusiness = False
    jsonld_problems = ""
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            import json
            data = json.loads(script.string or "{}")
            # if list, iterate
            items = data if isinstance(data, list) else [data]
            for it in items:
                t = it.get("@type") or it.get("type")
                if isinstance(t, list):
                    if "LocalBusiness" in t:
                        jsonld_localbusiness = True
                else:
                    if t and "LocalBusiness" in str(t):
                        jsonld_localbusiness = True
        except Exception:
            continue
    # links + images
    internal_links = []
    internal_broken = 0
    images_total = 0
    images_broken = 0
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        # normalize
        if href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:"):
            continue
        full = urljoin(base_url, href)
        internal_links.append(full)
    for img in soup.find_all("img", src=True):
        images_total += 1
        src = urljoin(base_url, img["src"])
        # we'll check status later in main fetch pass
    return {
        "title": title,
        "title_len": len(title or ""),
        "meta_description": meta_description,
        "meta_description_len": len(meta_description or ""),
        "viewport": viewport,
        "canonical": canonical,
        "robots_meta": robots_meta,
        "jsonld_localbusiness": jsonld_localbusiness,
        "jsonld_problems": jsonld_problems,
        "internal_links": internal_links,
        "internal_links_count": len(internal_links),
        "images_total": images_total,
        "images_broken": images_broken
    }


async def worker(name, session, queue, results, base_host):
    while True:
        item = await queue.get()
        if item is None:
            queue.task_done()
            break
        url = item
        info = await fetch(session, url)
        row = {
            "url": url,
            "status": info["status"],
            "response_time": info["time"],
            "content_type": info["headers"].get("Content-Type", ""),
            "error": info["error"],
            "title": "",
            "title_len": 0,
            "meta_description": "",
            "meta_description_len": 0,
            "viewport": False,
            "canonical": "",
            "robots_meta": "",
            "jsonld_localbusiness": False,
            "jsonld_problems": "",
            "internal_links_count": 0,
            "images_total": 0,
            "notes": ""
        }
        if info["status"] and info["status"] == 200 and info["text"]:
            parsed = analyze_html(info["text"], url)
            row.update({
                "title": parsed["title"],
                "title_len": parsed["title_len"],
                "meta_description": parsed["meta_description"],
                "meta_description_len": parsed["meta_description_len"],
                "viewport": parsed["viewport"],
                "canonical": parsed["canonical"],
                "robots_meta": parsed["robots_meta"],
                "jsonld_localbusiness": parsed["jsonld_localbusiness"],
                "jsonld_problems": parsed["jsonld_problems"],
                "internal_links_count": parsed["internal_links_count"],
                "images_total": parsed["images_total"]
            })
        # basic quick checks
        if info["status"] is None:
            row["notes"] += f"fetch_error:{info['error']};"
        elif info["status"] >= 400:
            row["notes"] += f"http_{info['status']};"
        if row["title_len"] == 0:
            row["notes"] += "no_title;"
        if row["meta_description_len"] < 50:
            row["notes"] += "short_meta;"
        if not row["viewport"]:
            row["notes"] += "no_viewport;"
        if not row["jsonld_localbusiness"]:
            row["notes"] += "no_jsonld_localbusiness;"
        results.append(row)
        queue.task_done()


async def main(domain):
    base = domain.rstrip("/")
    sitemap_url = urljoin(base + "/", "sitemap.xml")
    timeout = ClientTimeout(total=TIMEOUT)
    conn = aiohttp.TCPConnector(limit_per_host=CONCURRENCY, ssl=False)
    async with aiohttp.ClientSession(headers=HEADERS, timeout=timeout, connector=conn) as session:
        # fetch sitemap
        print("Fetching sitemap:", sitemap_url)
        sm = await fetch(session, sitemap_url)
        if sm["status"] != 200:
            print("Could not fetch sitemap.xml (status, error):", sm["status"], sm["error"])
            urls = [base]
        else:
            urls = parse_sitemap(sm["text"], base)
        # normalize unique and limit to reasonable amount initially (e.g., 1000)
        seen = []
        for u in urls:
            if u not in seen and same_domain(base, u):
                seen.append(u)
        urls = seen[:1000]
        print("URLs to check:", len(urls))

        queue = asyncio.Queue()
        results = []
        for u in urls:
            await queue.put(u)
        # start workers
        workers = [asyncio.create_task(worker(f"w{i}", session, queue, results, base)) for i in range(CONCURRENCY)]
        # add termination sentinels
        for _ in workers:
            await queue.put(None)
        # progress display (basic)
        with tqdm(total=len(urls)) as pbar:
            prev = 0
            while any(not w.done() for w in workers):
                await asyncio.sleep(0.5)
                done = len(results)
                if done != prev:
                    pbar.update(done - prev)
                    prev = done
            # final update
            done = len(results)
            if done != prev:
                pbar.update(done - prev)
        # wait for workers end
        await asyncio.gather(*workers, return_exceptions=True)
        # DataFrame and save
        df = pd.DataFrame(results)
        out = "site_audit_report.csv"
        df.to_csv(out, index=False, encoding="utf-8")
        print("Saved report to", out)
        return out


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python site_audit.py https://www.locksmith-pro.org")
        sys.exit(1)
    domain = sys.argv[1]
    asyncio.run(main(domain))
