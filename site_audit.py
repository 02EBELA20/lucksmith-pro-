# filename: site_audit.py
# Usage: python site_audit.py https://www.locksmith-pro.org
import asyncio
import sys
import time
import json
from urllib.parse import urljoin

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
    urls = []
    soup = BeautifulSoup(sitemap_text, "lxml")
    for loc in soup.find_all("loc"):
        u = loc.get_text().strip()
        if u:
            urls.append(u)
    if not urls:
        urls.append(base_url)
    return urls

def same_domain(base, other):
    be = tldextract.extract(base)
    oe = tldextract.extract(other)
    return be.domain == oe.domain and be.suffix == oe.suffix

def analyze_html(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    title = soup.title.string.strip() if soup.title and soup.title.string else ""
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

    # --- IMPROVED JSON-LD CHECK ---
    jsonld_found = False
    jsonld_types = []
    jsonld_problems = ""
    
    # Relevant schema types for a local service business
    RELEVANT_TYPES = ["LocalBusiness", "Locksmith", "Service", "Organization"]

    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string or "{}")
            items = data if isinstance(data, list) else [data]
            for item in items:
                item_type = item.get("@type", "")
                # Handle both string and list for @type
                types_in_item = item_type if isinstance(item_type, list) else [item_type]
                jsonld_types.extend(types_in_item)
                # Check if any of the item's types are relevant
                if any(t in RELEVANT_TYPES for t in types_in_item):
                    jsonld_found = True
        except json.JSONDecodeError:
            jsonld_problems = "JSON Decode Error"
            continue
    # --- END OF IMPROVEMENT ---

    internal_links = []
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if href.startswith(("#", "mailto:", "tel:")):
            continue
        full = urljoin(base_url, href)
        internal_links.append(full)
    
    images_total = len(soup.find_all("img", src=True))

    return {
        "title": title,
        "title_len": len(title),
        "meta_description": meta_description,
        "meta_description_len": len(meta_description),
        "viewport": viewport,
        "canonical": canonical,
        "robots_meta": robots_meta,
        "jsonld_found": jsonld_found, # Updated key
        "jsonld_types": ", ".join(filter(None, jsonld_types)), # New key to show what was found
        "jsonld_problems": jsonld_problems,
        "internal_links_count": len(internal_links),
        "images_total": images_total,
    }

async def worker(name, session, queue, results, base_host):
    while True:
        url = await queue.get()
        info = await fetch(session, url)
        
        row = {
            "url": url, "status": info["status"], "response_time": info["time"],
            "content_type": info["headers"].get("Content-Type", ""), "error": info["error"],
            "notes": ""
        }

        if info["status"] == 200 and "text/html" in row["content_type"]:
            parsed = analyze_html(info["text"], url)
            row.update(parsed)
            # Add notes for quick review
            if not parsed["title"]: row["notes"] += "no_title;"
            if parsed["meta_description_len"] < 50: row["notes"] += "short_meta;"
            if not parsed["viewport"]: row["notes"] += "no_viewport;"
            if not parsed["jsonld_found"]: row["notes"] += "no_relevant_jsonld;"
        elif info["status"] and info["status"] >= 400:
            row["notes"] += f"http_{info['status']};"

        results.append(row)
        queue.task_done()

async def main(domain):
    base = domain.rstrip("/")
    sitemap_url = urljoin(base + "/", "sitemap.xml")
    
    async with aiohttp.ClientSession(headers=HEADERS) as session:
        print("Fetching sitemap:", sitemap_url)
        sm = await fetch(session, sitemap_url)
        if sm["status"] != 200:
            print(f"Could not fetch sitemap.xml. Status: {sm['status']}. Falling back to base URL.")
            urls = [base]
        else:
            urls = parse_sitemap(sm["text"], base)

        seen = {u for u in urls if same_domain(base, u)}
        urls_to_check = list(seen)[:1000]
        print(f"Found {len(urls_to_check)} unique URLs to audit.")

        queue = asyncio.Queue()
        for url in urls_to_check:
            queue.put_nowait(url)

        results = []
        tasks = [asyncio.create_task(worker(f"w{i}", session, queue, results, base)) for i in range(CONCURRENCY)]

        # Progress bar
        for _ in tqdm(asyncio.as_completed(tasks), total=len(tasks)):
            await _

        await queue.join()

        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)

        df = pd.DataFrame(results)
        out = "site_audit_report.csv"
        df.to_csv(out, index=False, encoding="utf-8")
        print(f"\n✅ Audit complete. Report saved to {out}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python site_audit.py https://www.locksmith-pro.org")
        sys.exit(1)
    
    # To run this script, you may need to install libraries:
    # pip install asyncio aiohttp beautifulsoup4 pandas tldextract tqdm lxml
    domain = sys.argv[1]
    asyncio.run(main(domain))