#!/usr/bin/env python3
"""
1. Download every image referenced in parsed.json into assets/<section>/<slug>/
2. Compile content.md at project root with relative image paths
"""
import json
import os
import re
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PARSED = ROOT / "_scripts" / "parsed.json"
ASSETS = ROOT / "assets"
CONTENT_MD = ROOT / "content.md"

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"


def slug_from_file(file_path: str):
    """_raw/projects/archipelago.html -> ('projects', 'archipelago')
    _raw/home.html -> ('', 'home')
    """
    p = Path(file_path)
    parts = p.parts
    # parts[0] == '_raw'
    if len(parts) == 2:
        return ("", p.stem)
    return (parts[1], p.stem)


def safe_filename(url: str, idx: int) -> str:
    """Derive a clean filename from a CDN URL. Webflow URLs end with the original asset name."""
    parsed = urllib.parse.urlparse(url)
    name = urllib.parse.unquote(os.path.basename(parsed.path))
    # Strip Webflow's hash prefix (24 hex chars + '_') if present
    name = re.sub(r"^[0-9a-f]{24}_", "", name)
    # Remove any -p-NNN suffix (Webflow's responsive variants — we always took the largest)
    name = re.sub(r"-p-\d+(\.[a-zA-Z]+)$", r"\1", name)
    # Collapse weird whitespace and limit length
    name = re.sub(r"[\s]+", "_", name).strip("_")
    if not name or name.startswith("."):
        ext = os.path.splitext(parsed.path)[1] or ".jpg"
        name = f"image_{idx:03d}{ext}"
    # Prefix with index to keep deterministic ordering
    return f"{idx:03d}_{name}"


def download(url: str, dest: Path) -> tuple[bool, str]:
    if dest.exists() and dest.stat().st_size > 0:
        return True, "cached"
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        dest.write_bytes(data)
        return True, "ok"
    except Exception as e:
        return False, f"err: {e}"


def download_all(pages):
    jobs = []
    plan = {}  # (section, slug) -> list of (url, local_relative_path)
    for page in pages:
        section, slug = slug_from_file(page["file"])
        key = (section, slug)
        plan[key] = []
        # For listing pages, we keep their thumbnail URLs in the plan too
        urls = list(dict.fromkeys(page["images"]))  # dedupe preserving order
        for idx, url in enumerate(urls, start=1):
            sub = section if section else "home"
            dest = ASSETS / sub / slug / safe_filename(url, idx)
            rel = dest.relative_to(ROOT).as_posix()
            plan[key].append({"url": url, "local": rel, "name": dest.name})
            jobs.append((url, dest))
    print(f"Queued {len(jobs)} downloads...")
    ok, fail = 0, 0
    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = {pool.submit(download, u, d): (u, d) for u, d in jobs}
        for fut in as_completed(futures):
            success, msg = fut.result()
            if success:
                ok += 1
            else:
                fail += 1
                u, d = futures[fut]
                print(f"  FAIL {u} -> {msg}")
    print(f"Downloaded: {ok} ok, {fail} failed")
    return plan


# ----- Markdown compilation -----

PAGE_ORDER_TOP = ["home", "about", "projects", "exhibitions", "illustrations", "photographs", "writings"]


def md_for_blocks(blocks):
    out = []
    seen_h1 = False
    for kind, val in blocks:
        if kind == "h1":
            if seen_h1:
                continue  # avoid duplicate h1
            out.append(f"## {val}")
            seen_h1 = True
        elif kind in ("h2", "h3", "h4", "h5", "h6"):
            level = int(kind[1])
            out.append(f"{'#' * (level + 1)} {val}")
        elif kind == "p":
            txt = val.strip().replace("‍", "").strip()
            if txt:
                out.append(txt)
        elif kind == "ul":
            out.extend(f"- {item}" for item in val if item)
        elif kind == "ol":
            out.extend(f"{i+1}. {item}" for i, item in enumerate(val) if item)
        elif kind == "blockquote":
            out.append(f"> {val}")
        elif kind == "listing-item":
            # Skip; listings rendered separately
            pass
    return "\n\n".join(out)


def section_label(section: str) -> str:
    return section.replace("-", " ").title() if section else ""


def page_label(page) -> str:
    section, slug = slug_from_file(page["file"])
    title = ""
    for kind, val in page["blocks"]:
        if kind == "h1":
            title = val
            break
    if not title:
        title = slug.replace("-", " ").strip().title()
    return title


def compile_md(pages, plan):
    # Group pages by section
    by_section = {}
    top_level = {}
    for page in pages:
        section, slug = slug_from_file(page["file"])
        if section == "":
            top_level[slug] = page
        else:
            by_section.setdefault(section, {})[slug] = page

    out = []
    out.append("# Aglaya Nogina — Website Content Archive\n")
    out.append("Source: https://www.aglayanogina.com (scraped 2026-05-07)\n")
    out.append("---\n")

    # Home
    home = top_level.get("home")
    if home:
        out.append("# Home\n")
        out.append(md_for_blocks(home["blocks"]))
        for entry in plan.get(("", "home"), []):
            out.append(f"\n![]({entry['local']})\n")
        out.append("\n---\n")

    # About
    about = top_level.get("about")
    if about:
        out.append("# About\n")
        out.append(md_for_blocks(about["blocks"]))
        for entry in plan.get(("", "about"), []):
            out.append(f"\n![]({entry['local']})\n")
        out.append("\n---\n")

    # Sections with sub-pages: projects, exhibitions, illustrations, photographs, writings
    section_order = ["projects", "exhibitions", "illustrations", "photographs", "writings"]
    for section in section_order:
        out.append(f"# {section.title()}\n")
        # Index page intro (listing) — we just include its listing as TOC
        index_page = top_level.get(section)
        if index_page and index_page["listing"]:
            out.append(f"_Index_:\n")
            for it in index_page["listing"]:
                if it["title"]:
                    out.append(f"- {it['title']}")
            out.append("")
        # Each sub-page
        sub_pages = by_section.get(section, {})
        for slug in sorted(sub_pages.keys()):
            page = sub_pages[slug]
            title = page_label(page)
            out.append(f"\n## {title}\n")
            body = md_for_blocks([(k, v) for k, v in page["blocks"] if k != "h1"])
            if body:
                out.append(body)
            for entry in plan.get((section, slug), []):
                out.append(f"\n![]({entry['local']})\n")
        out.append("\n---\n")

    CONTENT_MD.write_text("\n".join(out), encoding="utf-8")
    print(f"Wrote {CONTENT_MD}")


def main():
    pages = json.loads(PARSED.read_text())
    plan = download_all(pages)
    # Save plan for later inspection
    (ROOT / "_scripts" / "image_plan.json").write_text(
        json.dumps({f"{s}/{sl}": v for (s, sl), v in plan.items()}, indent=2)
    )
    compile_md(pages, plan)


if __name__ == "__main__":
    main()
