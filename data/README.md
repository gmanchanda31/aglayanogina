# /data — content database

Two JSON files that the site reads at build time. **This is the truth source
for every project, exhibition, illustration, photograph caption, writing,
and bio block on the site.**

| File | What it is |
|---|---|
| `parsed.json` | The full content tree — pages, blocks, listings. |
| `image_plan.json` | URL → local path map for every image (under `public/assets/`). |

`lib/content.ts` reads both at build time and exports typed helpers
(`projects`, `exhibitions`, `getProject(slug)`, `about`, etc.). Pages
import from `@/lib/content` — never from this directory directly.

## Editing safely

These are hand-edited JSON files. A single trailing comma will break the
build. After any edit:

```bash
pnpm build
```

If the build is green, the change is good.

## Structure

`parsed.json` is an array of pages. Two shapes:

```jsonc
// Index page (lists children)
{
  "file": "_raw/projects.html",
  "title": "Projects",
  "blocks": [],
  "images": [],
  "listing": [
    { "title": "Archipelago", "href": "/projects/archipelago", "image": "..." }
  ]
}

// Detail page (has content)
{
  "file": "_raw/projects/archipelago.html",
  "title": "Archipelago",
  "blocks": [
    ["h1", "Archipelago"],
    ["p", "Paper, textile, ink, xerography"],   // metadata: medium
    ["p", "Size: 200 x 125, 22 pieces"],          // metadata: dimensions
    ["p", "Düsseldorf, Germany"],                 // metadata: location
    ["p", "2023-2025"],                           // metadata: year
    ["p", "An archipelago symbolizes a cluster of islands…"],
    ["p", "“A pulled quote in curly quotes auto-extracts.”"]
  ],
  "images": [ "local-only", "local-only" ]
}
```

The legacy `_raw/...` prefix on `file` is just a routing key — it tells
`lib/content.ts` which section/slug a page belongs to.

`image_plan.json` is a flat map keyed by `<section>/<slug>`:

```jsonc
{
  "projects/archipelago": [
    { "url": "local-only", "local": "assets/projects/archipelago/001_x.jpeg", "name": "001_x.jpeg" }
  ]
}
```

The `url` field is just a deduplication key in current usage — the legacy
remote URLs from the original Webflow site can stay for reference, or
be replaced with `"local-only"` for new entries.

## Adding new content

See **CLAUDE.md** in the repo root — it has step-by-step recipes for
adding projects, exhibitions, illustrations, photo sets, and writings.
