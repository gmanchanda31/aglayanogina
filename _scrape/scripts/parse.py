#!/usr/bin/env python3
"""Parse scraped Webflow pages -> extract clean content + image URLs."""
import json
import os
import re
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "_raw"

NAV_TEXT = {
    "AGLAYA NOGINA", "Projects", "Exhibitions", "Illustrations",
    "Photographs", "Writings", "About", "Contacts", "MENU", "CLOSE",
    "Email", "Instagram", "Whatsapp",
    "Support me on Patreon  •  Access my art diary",
}

def is_chrome_link(a):
    """Is this a navigation/footer link that we should skip?"""
    txt = a.get_text(strip=True)
    if txt in NAV_TEXT:
        return True
    href = a.get("href", "")
    if href.startswith("mailto:") or href.startswith("https://wa.me") or "patreon.com" in href or "instagram.com" in href:
        return True
    return False

def get_largest_srcset_url(img):
    """Pick the highest-resolution URL from srcset, fallback to src."""
    srcset = img.get("srcset", "")
    if srcset:
        # Format: "url1 500w, url2 800w, ..."
        candidates = []
        for part in srcset.split(","):
            part = part.strip()
            m = re.match(r"(\S+)\s+(\d+)w", part)
            if m:
                candidates.append((int(m.group(2)), m.group(1)))
        if candidates:
            candidates.sort(reverse=True)
            return candidates[0][1]
    return img.get("src", "")

def extract_text_blocks(soup):
    """Extract meaningful text content (rich-text, headings, captions)."""
    blocks = []

    # Page title (h1) — from heading classes
    for h in soup.find_all(["h1"]):
        txt = h.get_text(strip=True)
        if txt and txt not in NAV_TEXT:
            blocks.append(("h1", txt))

    # Rich-text content (Webflow's main content blocks)
    for rt in soup.select(".rich-text-block, .w-richtext"):
        for el in rt.find_all(["h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "blockquote"]):
            tag = el.name
            txt = el.get_text(strip=True)
            if not txt:
                continue
            if tag == "ul":
                items = [li.get_text(strip=True) for li in el.find_all("li")]
                blocks.append(("ul", items))
            elif tag == "ol":
                items = [li.get_text(strip=True) for li in el.find_all("li")]
                blocks.append(("ol", items))
            else:
                blocks.append((tag, txt))

    # Project/listing item titles — for index pages
    for el in soup.select(".text-block-2, .proj-item__text, .heading"):
        txt = el.get_text(strip=True)
        if txt and ("h1", txt) not in blocks:
            blocks.append(("listing-item", txt))

    return blocks

def extract_images(soup, base_url="https://www.aglayanogina.com"):
    """Extract all content image URLs (not nav/icons)."""
    imgs = []
    for img in soup.find_all("img"):
        url = get_largest_srcset_url(img)
        if not url:
            continue
        if "favicon" in url or "webclip" in url:
            continue
        # skip duplicates
        if url not in imgs:
            imgs.append(url)
    return imgs

def extract_listing_items(soup):
    """For index pages (projects, exhibitions...), extract item title -> link/image pairs."""
    items = []
    for li in soup.select(".collection-item, .w-dyn-item"):
        a = li.find("a", href=True)
        title_el = li.find(class_=re.compile(r"text-block|proj-item__text"))
        title = title_el.get_text(strip=True) if title_el else (a.get_text(strip=True) if a else "")
        img = li.find("img")
        img_url = get_largest_srcset_url(img) if img else None
        href = a["href"] if a else None
        if title or img_url:
            items.append({"title": title, "href": href, "image": img_url})
    return items

def parse_file(path: Path):
    html = path.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "lxml")
    title_tag = soup.find("title")
    page_title = title_tag.get_text(strip=True) if title_tag else path.stem
    blocks = extract_text_blocks(soup)
    images = extract_images(soup)
    listing = extract_listing_items(soup)
    return {
        "file": str(path.relative_to(ROOT)),
        "title": page_title,
        "blocks": blocks,
        "images": images,
        "listing": listing,
    }

def main():
    pages = []
    for p in sorted(RAW.rglob("*.html")):
        pages.append(parse_file(p))
    out = ROOT / "_scripts" / "parsed.json"
    out.write_text(json.dumps(pages, indent=2, ensure_ascii=False))
    print(f"Parsed {len(pages)} pages -> {out}")
    # Summary
    total_imgs = sum(len(p["images"]) for p in pages)
    print(f"Total unique image URLs: {total_imgs}")

if __name__ == "__main__":
    main()
