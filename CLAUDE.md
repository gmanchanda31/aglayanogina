# aglayanogina.art

Portfolio site for **Aglaya Nogina**, Ukrainian visual artist (Düsseldorf).
This file is the canonical reference for working on the codebase — read it
before making changes, and update it when conventions change.

---

## At a glance

- **Domain:** `aglayanogina.art` — registered on **Squarespace**
- **Hosting:** **Vercel** (auto-deploy on push to `main`)
- **Repo:** `https://github.com/gmanchanda31/aglayanogina`
- **Stack:** Next.js 16 App Router · TypeScript strict · Tailwind v4 · MDX
- **Rendering:** 100% static (SSG) — no runtime DB, no APIs, no auth
- **Production URL:** https://aglayanogina.art
- **Vercel preview host:** `aglaya.vercel.app` (or any `aglaya-*.vercel.app`)

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | `next dev` / `next build` |
| Language | TypeScript strict (`tsconfig.json`) | No `any`, no implicit `any` |
| Styling | Tailwind CSS v4 | Tokens declared in `app/globals.css` via `@theme` |
| Fonts | `next/font/google` — Vollkorn (serif) + Inter (sans) | Latin + Cyrillic subsets, weights 400/700/800 (Vollkorn), 300/400/500/600 (Inter) |
| Long-form | MDX (`@next/mdx`) | Writings live in `content/writings/*.mdx` |
| Images | `next/image` | AVIF/WebP, capped at 1920w device size |
| Icons | `lucide-react` | No Material Symbols, no FontAwesome |
| OG images | `next/og` `ImageResponse` | Bundled TTFs in `public/fonts/` |
| Analytics | `@vercel/analytics` + `@vercel/speed-insights` | Auto-wired in root layout |
| Deploy | Vercel | Fluid Compute / Node 24 default |

### Design tokens (memorise these)

| Token | Hex | Usage |
|---|---|---|
| `paper` | `#FAF7F2` | Background — warm off-white, like uncoated stock |
| `ink` | `#0F0E0D` | Foreground — near-black, slightly warm |
| `clay` | `#B5826A` | Accent (sparingly) — active nav underline, focus rings |
| `mist` | `#E8E2D8` | Hairlines, image borders, dividers |
| `stone` | `#6B655E` | Secondary text — captions, dates, metadata |

Headlines use **Vollkorn** (serif). Body uses **Inter** (sans). Labels are
all-caps with `.label-caps` (12-13px, tracked 0.12em).

**No drop shadows. No gradients. No saturated colors. No round-full pills.**

---

## Repository layout

```
/app                       # Next.js App Router routes
  /(routes)/page.tsx       # Each route's page (home, about, listings, details)
  /<section>/[slug]/       # Dynamic detail routes (statically generated)
  opengraph-image.tsx      # Per-route OG images (next/og)
  icon.tsx, apple-icon.tsx # Favicons (Vollkorn 'AN' wordmark)
  sitemap.ts, robots.ts    # SEO
  not-found.tsx, error.tsx # Error boundaries
  layout.tsx, globals.css  # Root shell + design tokens

/components
  /layout/                 # SiteHeader, SiteFooter, Container, Breadcrumbs, PageHeader
  /artwork/                # ArtworkCard, ArtworkImage, ArtworkCaption, AsymmetricGrid,
                           # PhotoMasonry, Lightbox
  /detail/                 # EntryDetail (shared template for projects/exhibitions/illustrations)
  /projects/               # ProjectsGrid (client filter)
  /mdx/                    # DropCap, PullQuote (used inside writings)
  /seo/json-ld.tsx         # Structured data helper
  patreon-appeal.tsx       # The Patreon CTA block

/content/writings/         # 11 essays as .mdx files
/lib                       # Typed content layer + helpers
  content.ts               # ★ Truth-source — exports projects, exhibitions, etc.
  types.ts                 # Section, Entry, ImageRef, ProjectKind, …
  writings-mdx.ts          # slug → MDX import registry
  site.ts                  # Resolves SITE_URL across environments
  utils.ts, og.tsx         # cn() helper, OG templates

/public
  /assets/<section>/<slug>/   # All artwork — committed to the repo (~110MB)
  /fonts/                  # TTFs used by ImageResponse (OG, favicon)

/data                      # ★ Content truth source — read at build time
  parsed.json              # The content tree (pages, blocks, listings)
  image_plan.json          # URL → local-asset map
  README.md                # Editing notes for this directory

/_scrape                   # Original scrape artifacts — gitignored
  /raw/                    # Original Webflow HTML (reference only)
  /previews/               # Stitch design previews (reference only)

mdx-components.tsx         # MDX component overrides (h2, p, em, DropCap, PullQuote)
next.config.ts             # MDX, image config, security headers
```

---

## Common commands

```bash
pnpm install               # First-time setup
pnpm dev                   # Local dev server  → http://localhost:3000
pnpm typecheck             # Strict type-check (no emit)
pnpm lint                  # ESLint
pnpm build                 # Production build (Turbopack)
pnpm start                 # Run the production build locally
```

`pnpm build` is the canonical "did I break anything" check. It compiles,
typechecks, and prerenders every route + every OG image.

---

## How the content flows

The site is **fully static** — every page is prerendered at build time from
data in `data/parsed.json` plus images in `public/assets/`.

```
data/parsed.json     ─┐
data/image_plan.json  ├─→  lib/content.ts  ──→  app/<route>/page.tsx
public/assets/...    ─┘                          (prerendered HTML)
```

**`lib/content.ts` is the single source of truth in code.** Pages import
typed data from here — never read JSON or filesystem directly inside a page.

```ts
import { projects, exhibitions, getProject, about, contact } from "@/lib/content";
```

`parsed.json` mirrors the structure of the original Webflow site:

```jsonc
[
  {
    "file": "_raw/projects.html",        // index pages list children
    "title": "Projects",
    "blocks": [],
    "images": [],
    "listing": [
      { "title": "Archipelago", "href": "/projects/archipelago", "image": "..." },
      …
    ]
  },
  {
    "file": "_raw/projects/archipelago.html",   // detail pages have content
    "title": "Archipelago",
    "blocks": [
      ["h1", "Archipelago"],
      ["p", "Paper, textile, ink, xerography"],
      ["p", "Size: 200 x 125, 22 pieces"],
      ["p", "Düsseldorf, Germany"],
      ["p", "2023-2025"],
      ["p", "An archipelago symbolizes a cluster of islands…"]
    ],
    "images": [ "https://cdn.../IMG_6239.jpeg", … ]
  }
]
```

`image_plan.json` maps each remote image URL → local path:

```jsonc
{
  "projects/archipelago": [
    {
      "url":  "https://cdn.prod.website-files.com/.../6934333e72af76ad83afd298_IMG_6239.jpeg",
      "local": "assets/projects/archipelago/001_IMG_6239.jpeg",
      "name":  "001_IMG_6239.jpeg"
    },
    …
  ]
}
```

---

## Adding new content — step by step

> **TL;DR.** New artwork goes into `public/assets/<section>/<slug>/`. New
> entries go into `data/parsed.json` + `data/image_plan.json`.
> New essays go into `content/writings/<slug>.mdx` + a registry entry.

### Add a new project

1. **Create the asset folder** (slug = lowercase-with-hyphens, no trailing
   hyphens):

   ```bash
   mkdir -p public/assets/projects/<slug>
   ```

   Drop the project's image files in there. Name them `NNN_<original>.jpeg`
   so order is stable (`001_IMG_1.jpeg`, `002_IMG_2.jpeg`, …). Keep originals
   under ~3 MB; `next/image` handles resizing.

2. **Add the entry to `data/image_plan.json`**:

   ```jsonc
   "projects/<slug>": [
     { "url": "local-only", "local": "assets/projects/<slug>/001_hero.jpeg",   "name": "001_hero.jpeg" },
     { "url": "local-only", "local": "assets/projects/<slug>/002_detail.jpeg", "name": "002_detail.jpeg" }
   ]
   ```

   `url` can be the string `"local-only"` (or any unique placeholder) — it's
   used as a deduplication key, not fetched.

3. **Append the project page to `data/parsed.json`**:

   ```jsonc
   {
     "file": "_raw/projects/<slug>.html",
     "title": "<Title>",
     "blocks": [
       ["h1", "<Title>"],
       ["p", "<Medium — e.g. Paper, textile, ink, xerography>"],
       ["p", "<Optional dimensions — Size: 100 × 80 cm, 6 pieces>"],
       ["p", "<Optional location — Düsseldorf, Germany>"],
       ["p", "<Year or year range — 2024 / 2023-2025>"],
       ["p", "<Stand-first / first body paragraph — sets the tone>"],
       ["p", "<Additional paragraphs as needed>"],
       ["p", "<Optional pull-quote in curly quotes: “…”>"]
     ],
     "images": [ "local-only", "local-only" ],
     "listing": []
   }
   ```

   The content layer is forgiving:
   - **Short paragraphs (≤80 chars) before the first long one are treated as metadata** and labeled (Medium / Year / Dimensions / Location).
   - **A paragraph that starts with a curly opening quote is auto-extracted as the pull-quote.**
   - **A following short line starting with `—`** becomes the quote attribution.

4. **Add the project to the projects index listing** — find the entry whose
   `file` is `"_raw/projects.html"` and append:

   ```jsonc
   {
     "title":  "<Title>",
     "href":   "/projects/<slug>",
     "image":  "local-only"
   }
   ```

   The order in `listing` controls grid order on `/projects`.

5. **Build to verify** (catches typos and missing images):

   ```bash
   pnpm build
   ```

   You should see `/projects/<slug>` listed under "Generating static pages".

6. **Commit + push** — Vercel auto-deploys on push to `main`.

### Add a new exhibition / illustration / photo set

Same flow as projects, but use the right section path:

| Section | Asset folder | Listing file |
|---|---|---|
| Exhibition | `public/assets/exhibitions/<slug>/` | `_raw/exhibitions.html` listing |
| Illustration series | `public/assets/illustrations/<slug>/` | `_raw/illustrations.html` listing |
| Photo set | `public/assets/photographs/<slug>/` | `_raw/photographs.html` listing |

Photographs are slightly different: only `title` + `images` matter. No
description blocks needed (the photographs detail page just renders the
masonry of images with the lightbox).

### Add new photos to an existing set

The simplest content task. To add 5 new photos to `colour`:

1. Drop them into `public/assets/photographs/colour/` with sequential
   filenames (e.g. `025_IMG_NEW1.jpeg` continuing from the existing 24).
2. Append entries to `data/image_plan.json` under
   `"photographs/colour"` — one per file, same shape as existing entries.
3. Append the matching `"local-only"` entries to the `images` array of the
   colour page in `parsed.json` (`_raw/photographs/colour.html`).
4. `pnpm build` and push.

### Add a new writing essay

Writings use **MDX** so the literary typography (drop-cap, pull-quote) is
inline.

1. **Create the MDX file** at `content/writings/<slug>.mdx`:

   ```mdx
   ---
   title: 'Essay Title'
   slug: 'essay-slug'
   excerpt: 'A short hook — ~150 chars used in the listing and metadata.'
   ---

   <p><DropCap>F</DropCap>irst paragraph. The DropCap component wraps just the
   first letter — keep the rest of the paragraph in the same `<p>`.</p>

   <p>Subsequent paragraphs are plain `<p>`. MDX needs them wrapped because
   we override the default `p` styles in `mdx-components.tsx`.</p>

   <PullQuote>An italic clay-coloured pull-quote. One per essay is plenty.</PullQuote>

   <p>Continuing prose…</p>
   ```

2. **Register the slug** in `lib/writings-mdx.ts`:

   ```ts
   const registry = {
     // existing entries…
     "essay-slug": () => import("@/content/writings/essay-slug.mdx"),
   };
   ```

3. **Add an entry to the writings listing** in `parsed.json` —
   find `"_raw/writings.html"` and append to its `listing`:

   ```jsonc
   { "title": "Essay Title", "href": "/writings/essay-slug", "image": null }
   ```

4. **Add a stub detail page entry** so the listing card has a real excerpt:

   ```jsonc
   {
     "file": "_raw/writings/essay-slug.html",
     "title": "Essay Title",
     "blocks": [
       ["h1", "Essay Title"],
       ["p", "First paragraph used as the listing excerpt — keep it engaging."]
     ],
     "images": [],
     "listing": []
   }
   ```

5. `pnpm build` and push.

### Update the bio / CV / exhibition history

The about page reads from the bio entry in `parsed.json`
(`_raw/about.html`). Block headings (`EDUCATION`, `PUBLICATIONS`,
`SOLO EXHIBITIONS`, `SELECTED EXHIBITIONS`, `BIO`) are recognised
automatically.

To add a new exhibition row:

1. Open `data/parsed.json`, find the about entry.
2. Inside `blocks`, add a new `["p", "<year>, <month> — <name> at <venue>, <city>"]`
   under the right section heading.
3. Build + push.

### Update the home page

The home page is content-driven, but the **hero quote and "Currently /
Recent" works are hand-picked** in `app/page.tsx`. To swap which projects
get featured, edit the `getProject(...)` calls there.

### Update site-wide details (contact, social, navigation)

`lib/content.ts` near the top:

```ts
export const contact = {
  email: "aglaya.nn.art@gmail.com",
  emailHref: "mailto:aglaya.nn.art@gmail.com",
  instagramHandle: "@aglaya.nn",
  instagramUrl: "https://www.instagram.com/aglaya.nn",
  whatsappNumber: "+49 175 6252702",
  whatsappUrl: "https://wa.me/491756252702",
  patreonUrl: "https://patreon.com/aglayann",
};
```

These flow into the footer and the Patreon CTAs.

---

## Conventions to follow

- **Don't read JSON directly inside a page.** Always go through `lib/content.ts`.
- **Don't add `dark:` classes.** The site is light-only by design.
- **Don't add drop shadows or gradients.** They break the editorial aesthetic.
- **Don't introduce new fonts.** Vollkorn + Inter only.
- **Don't add icons from outside `lucide-react`.**
- **Use `next/image` for every artwork.** Always pass an explicit `sizes` prop.
- **Keep `data/parsed.json` valid JSON.** A single trailing comma will
  break the build. Run `pnpm build` after edits before committing.
- **Slugs.** Lowercase, hyphenated, no trailing hyphens, no diacritics
  (URL: `lost-beauty`, asset folder: `lost-beauty/`). The content layer
  trims trailing hyphens for routes, so `ceramic-` (asset folder) →
  `/projects/ceramic` (URL) — fine to leave both untouched.
- **Long unbroken metadata strings get split automatically** by
  `splitCamelRuns()`. Don't rely on that for normal text — write spaces.

---

## Domain & DNS (Squarespace)

The domain is registered on **Squarespace**. DNS records point to Vercel:

| Type | Host | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Set in **Squarespace → Domains → aglayanogina.art → DNS Settings**.

If a record needs to change in the future, do it in Squarespace, then wait
for propagation (usually < 1 hour). Vercel re-issues the SSL cert
automatically.

**Don't change the nameservers** — Squarespace remains authoritative; we
just point the records at Vercel.

---

## Vercel project

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `pnpm build` (auto-detected) |
| Output directory | `.next` (auto-detected) |
| Node version | 24 (default) |
| Region | Auto / Fluid Compute |

### Environment variables

Set under **Vercel → Project → Settings → Environment Variables**:

| Variable | Value | Scope |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://aglayanogina.art` | Production |

That's the only env var the app needs. Without it, `lib/site.ts` falls back
to `VERCEL_PROJECT_PRODUCTION_URL`, which Vercel injects automatically — but
setting it explicitly is more robust and self-documenting.

> **OG images bake the URL at build time.** If you ever change
> `NEXT_PUBLIC_SITE_URL`, **redeploy** so the OG images and meta tags pick
> up the new host. (Empty commit + push works:
> `git commit --allow-empty -m "redeploy" && git push`.)

### Verify deployment

After a deploy:

1. Visit `https://aglayanogina.art` — confirm header, hero, footer render.
2. View source — `<meta property="og:image">` should reference
   `aglayanogina.art`.
3. Visit `https://aglayanogina.art/opengraph-image` directly — the brand
   line at the bottom should read **aglayanogina.art**.
4. Test social card preview: https://socialsharepreview.com/ →
   paste `https://aglayanogina.art`.
5. Refresh stale caches if needed:
   - Facebook / Instagram: https://developers.facebook.com/tools/debug/
   - LinkedIn: https://www.linkedin.com/post-inspector/

---

## Performance & SEO

- All routes are **statically prerendered** — no server work per request.
- **Sitemap** at `/sitemap.xml` (44 URLs), auto-generated from content.
- **Robots** at `/robots.txt` — production allows crawl; preview deploys
  block all crawlers (no leaking preview URLs into search).
- **Structured data** (JSON-LD): `Person` on `/about`, `CreativeWork` on
  every project page, `Article` on every writing.
- **Images**: AVIF/WebP via `next/image`, capped at 1920w device size.

Lighthouse should sit at 95+ across the board. Re-run after big changes.

---

## Things that will trip you up

- **Editing `parsed.json` is fragile.** It's hand-edited JSON. One typo
  breaks the build. Always run `pnpm build` after editing. Future cleanup:
  migrate to typed TS data files in `lib/data/`.
- **The mobile nav `<MobileNav>` is rendered as a sibling of `<header>`,
  not a child.** This is deliberate — `position: fixed` children get
  trapped if the parent has `backdrop-filter`, `transform`, or `filter`.
  Keep them apart.
- **OG images need TTF fonts**, not woff2. Don't switch the `lib/og.tsx`
  font loader to fetch Google Fonts CSS — it returns woff2 to modern UAs.
  The bundled TTFs in `public/fonts/` are the canonical path.
- **`overflow-x: clip` on `body`** is a defensive backstop — not a license
  to ship overflowing content. Fix the root cause.
- **`splitCamelRuns()`** rewrites accidentally-glued metadata strings. If
  you see `· ` separators where you didn't add them, that's why.
- **Image filenames matter for sort order.** Always prefix with `NNN_`.

---

## Sanity MCP for Claude

`.mcp.json` at the repo root configures the official Sanity MCP server.
When this project is opened in a Claude Code session, the MCP gives
Claude tools to search content, create / edit / delete documents, and
upload media — without leaving chat.

Setup is one-time:

1. Make sure `SANITY_API_TOKEN` is set in `.env.local` (same value as
   `SANITY_WRITE_TOKEN`). Already wired.
2. Restart the Claude Code session. The MCP server boots automatically;
   `/mcp` lists it.

Useful for:

- Bulk imports / cleanups ("rename all 'xerography' tags to lowercase")
- Schema-driven migrations
- Audit queries ("list every project missing a hero image")
- One-off content fixes

Aglaya's daily workflow stays in Sanity Studio — the MCP is for
developer-mode operations.

## When in doubt

1. Read `lib/content.ts` and `lib/types.ts`. They are the contract.
2. Look at how an existing entry (e.g. Archipelago project) is wired,
   end-to-end:
   - `data/parsed.json` (entry + listing reference)
   - `data/image_plan.json` (image map)
   - `public/assets/projects/archipelago/` (the actual files)
   - `app/projects/[slug]/page.tsx` (route)
   - `components/detail/entry-detail.tsx` (template)
3. Run `pnpm build`. If it builds, you didn't break anything structural.
