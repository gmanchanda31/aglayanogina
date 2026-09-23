# Aglaya's feedback — 23 Sep 2026

Source: 22 messages forwarded from Aglaya, WhatsApp, today 15:24.
She compares the new site **aglayanogina.art** against her old one
**aglayanogina.com**, and asks three questions about the CMS (Sanity Studio).

Everything below is traced to a specific file + line. Her words are quoted
verbatim; screenshots are described by what is on the laptop screen in each
photo she sent.

---

## Quick index

| # | Issue | Aglaya's Message | Type |
|---|---|---|---|
| 1 | Frames/borders drawn around every artwork | "this frames around photos" | Front-end |
| 2 | Cards forced into different shapes & sizes | "Also that they are different sizes and shapes" | Front-end |
| 3 | White space beside images inside their box | "annoying to see this random icons with a white space next to it" | Front-end |
| 4 | Hotspot/crop in the Studio changes nothing | "I can't really change the size and shape of the frame… Nothing happens when I'm trying" | Front-end + CMS |
| 5 | Her name dominates the homepage | "I don't want my huge name dominating so much" | Front-end |
| 6 | "Lost Beauty" title too big / wrongly placed | "maybe we can do it smaller and in the middle" | Front-end |
| 7 | Listing-page intro text not editable in the CMS | "I also don't see where I can change this" | CMS |
| 8 | Warning triangles on gallery images in the Studio | "And why there is a question sign?" | CMS / data |
| 9 | Remove the Patreon link | "to delete the patreon link" | Content |
| 10 | Type scale / menu proportions vs old site | "the sizes of the fronts… make it as similar as possible" | Front-end |

---

## 1 — Frames drawn around every artwork

> **Aglaya:** "Ok so I'll directly write here my comments about what I would
> like to correct, **this frames around photos**"
> *(photo: `aglayanogina.art/projects`, her finger on the "Nest" card — a
> portrait photo sitting inside a much larger boxed frame with a visible
> hairline border)*

**Cause —** `components/artwork/artwork-image.tsx:37-43`

```tsx
<div className={cn(
  "relative overflow-hidden bg-paper",
  aspect,
  !borderless && "border border-mist",   // ← the frame
  className,
)}>
```

Verified live on `aglayanogina.art/projects` — computed style of the wrapper is
`border: 1px rgb(232,226,216)`, `background: rgb(250,247,242)`.

The same treatment is applied again on detail pages:
`components/detail/entry-detail.tsx:80` (`border border-mist bg-mist/40`, hero)
and `:177` (gallery), and on the homepage portrait
`components/home/home-hero.tsx:13`.

**Old site for comparison —** images sit directly on white. No border, no box,
no background. (`aglayanogina.com/projects`)

**Fix —** drop the border + background box; render the image on the page
background.

---

## 2 — Cards forced into different shapes and sizes

> **Aglaya:** "**Also that they are different sizes and shapes**"
> and, pointing at her old site: "This will be **1 correction: let's try to do
> it all the same like in my previous website**"

**Cause —** `components/projects/projects-grid.tsx:8-17` and the identical
`DEFAULT_PATTERN` in `components/artwork/asymmetric-grid.tsx:24-33`:

```ts
const PATTERN = [
  { colSpan: "md:col-span-7",  aspect: "aspect-[4/5]"  },
  { colSpan: "md:col-span-5",  aspect: "aspect-square" },
  { colSpan: "md:col-span-4",  aspect: "aspect-[3/4]"  },
  { colSpan: "md:col-span-5",  aspect: "aspect-[4/5]"  },
  { colSpan: "md:col-span-3",  aspect: "aspect-square" },
  { colSpan: "md:col-span-6",  aspect: "aspect-[3/2]"  },
  { colSpan: "md:col-span-6",  aspect: "aspect-[3/2]"  },
  { colSpan: "md:col-span-12", aspect: "aspect-[16/9]" },
];
```

Every card gets a different column width *and* a different forced aspect ratio,
purely by its position in the list. Measured on the live page:

| Work | Rendered box | Actual image |
|---|---|---|
| Archipelago book | 644 × 806 | 472 × 590 |
| Archive of Dreams | 448 × 448 (square) | 534 × 949 (portrait) |
| Ceramic | 350 × 467 | 419 × 559 |
| Nest | 252 × 252 (square) | 317 × 430 (portrait) |
| Lost Beauty | 546 × 363 | 636 × 477 |

**Old site for comparison —** a plain 3-column grid. Every image is exactly one
column wide (371 px), height follows the image's own proportions. Nothing is
forced, nothing is cropped, and the result reads as one consistent system.

**Fix —** one uniform grid, images at their natural aspect ratio.

---

## 3 — White space beside the images

> **Aglaya:** "That's why rn is a bit complicated to change the main pictures
> because I don't understand which size they have to be (horizontal, vertical,
> wherever we decide). But it's **annoying to see this random icons with a
> white space next to it**"

This is the consequence of #1 + #2. `artwork-image.tsx:51` uses
`object-contain`, so a portrait image dropped into a square box is letterboxed —
paper-coloured margins on the left and right, inside a visible border. Her
"Archive of Dreams" card is the clearest case: a 534 × 949 portrait in a
448 × 448 square.

**Fix —** same as #2. Once the box stops forcing a ratio, there is no leftover
space to fill.

---

## 4 — Hotspot / crop in the Studio does nothing

> **Aglaya:** "And here idk why but **I can't really change the size and shape
> of the frame**" … "**Nothing happens when I'm trying**, so maybe we can try to
> stick to the same sizes as in my previous post (there every hero image was
> vertical)"
> *(photo: Sanity Studio, "Nest" document, the "Edit hotspot and crop" dialog
> open with the 3:4 / Square / 16:9 / Panorama previews)*

She is using the right tool. The front-end ignores it.

**Cause —** `lib/sanity-queries.ts:12-18`

```groq
const IMAGE_WITH_ALT = `{
  alt,
  caption,
  "src": asset->url,        // ← raw asset URL
  "width":  asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`
```

`asset->url` is the original file. `hotspot` and `crop` live on the *image
object*, not on the asset, so they are never read. `urlFor()` exists in
`lib/sanity-client.ts:27` and is never called on these images.

The schema is correct — `studio/schemas/objects/imageWithAlt.ts:11` sets
`options: { hotspot: true }`. Only the query and the render path are wrong.

**Fix —** project `hotspot`, `crop` and `_ref` through the query and build URLs
with `urlFor()` so the Studio's crop is honoured. Note this becomes far less
important once #2 lands (no forced ratios = nothing to crop *to*), but her crop
edits should still take effect rather than silently doing nothing.

---

## 5 — Her name dominates the homepage

> **Aglaya:** "And I like the main page also more **when my name is little**" …
> "It's more accurate somehow than our new one, **I don't want my huge name
> dominating so much**"

**Cause —** `components/home/home-hero.tsx:28-34`

```tsx
<h1 className="… text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] …">
  AGLAYA<br />NOGINA
</h1>
```

7.5rem = 120 px. It is the single largest thing on the site.

**Old site for comparison —** the homepage is one vertical photograph, centred.
The name appears only as a 16 px wordmark in the top-left corner. Nav sits
top-right, contact links bottom-right. Nothing else.

**Fix —** remove the display-size name block; let the header wordmark carry the
name and let the artwork lead.

---

## 6 — "Lost Beauty" title size and placement

> **Aglaya:** "And maybe **the location of the Lost Beauty and the size**. It
> looks not very good, maybe we can do it **smaller and in the middle**"
> *(photo: `aglayanogina.art/exhibitions/lost-beauty`)*
>
> then, showing her old version: "**Or like here, I really like the visual part
> of my previous one**"

**Cause —** `components/detail/entry-detail.tsx:99`

```tsx
<h1 className="… text-[3.25rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] …">
```

7rem = 112 px, left-aligned in an 8-of-12 column, sitting *below* a hero image
that is itself boxed and bordered.

**Old site for comparison —** `Lost Beauty` is set at roughly 24 px, top-left,
with the medium/date lines directly under it, and the row of works immediately
below. The whole header occupies about 100 px of vertical space instead of 400.

**Fix —** much smaller title; centre it as she asked.

---

## 7 — Listing-page intro text is not editable in the CMS

> **Aglaya:** "**I also don't see where I can change this**"
> *(photo: `aglayanogina.art/projects`, finger on the "8 WORKS · 2021 — 2025 /
> Projects / Selected works in xerography, relief printing, painting, and
> ceramic — exploring memory, displacement, and the strength of friendship."
> block)*
>
> "**Because here I only see this all projects, but not the description**"
> *(photo: Sanity Studio — Content list showing Homepage, Artist · Bio + CV,
> Projects, Exhibitions, Illustration series, Photograph archives, Writings;
> clicking Projects shows only the eight project documents)*

She is right. That copy is hardcoded in the page component.

**Cause —** `app/projects/page.tsx:17-21`

```tsx
<PageHeader
  eyebrow={`${projects.length} works · 2021 — 2025`}
  title="Projects"
  lede="Selected works in xerography, relief printing, painting, and ceramic — exploring memory, displacement, and the strength of friendship."
/>
```

The same pattern exists on `app/exhibitions/page.tsx`,
`app/illustrations/page.tsx`, `app/photographs/page.tsx`,
`app/writings/page.tsx`. There is no document for any of them in the Studio —
`studio/desk/structure.ts:57-65` only registers the document *lists*.

**Fix —** add a `sectionPage` document type (eyebrow, title, intro) with one
document per section, pin them in the desk structure so each section shows
"Page intro" alongside its list, and read them in the listing pages.

---

## 8 — "Why is there a question sign?"

> **Aglaya:** "**And why there is a question sign?**"
> *(photo: Sanity Studio, "Aura Kunstraum, Düsseldorf" exhibition, Gallery
> field — 7 of the 8 image cards carry a small warning triangle in the
> bottom-left corner)*

**Cause —** the gallery and hero items in the dataset carry
`_type: "image"` instead of `_type: "imageWithAlt"`. The Studio cannot match
them to the array's declared member type and shows
*"Item of type image not valid for this list"* — the triangle she is asking
about. The 8th image has no triangle because she re-uploaded it herself through
the Studio, which typed it correctly.

This came from the original migration: `scripts/migrate-to-sanity.mjs` spread
the upload helper's result *after* setting `_type`, so `"imageWithAlt"` was
overwritten by `"image"`.

A repair script already exists — `scripts/fix-image-types.mjs` — and is
currently **untracked and never run**. It also unsets the orphan
`medium` / `location` fields that earlier fix scripts left on exhibition
documents (those show as "Unknown fields found" in the Studio).

**Fix —** run the script against the production dataset, verify in the Studio,
and commit it.

---

## 9 — Remove the Patreon link

> **Aglaya:** "**2: to delete the patreon link**"

Seven touchpoints:

| Place | File |
|---|---|
| "SUPPORT" button, desktop header | `components/layout/site-header.tsx:70-76` |
| "Support on Patreon" block, mobile menu | `components/layout/site-header.tsx:128-137` |
| Footer link | `components/layout/site-footer.tsx:65-71` |
| `<PatreonAppeal>` section on /about | `app/about/page.tsx:96`, `components/patreon-appeal.tsx` |
| "Studio support" section on the homepage | `components/home/studio-support.tsx` |
| Inline CTA at the end of every essay | `app/writings/[slug]/page.tsx:90-103` |
| `patreonUrl` in the Person JSON-LD | `app/about/page.tsx:53` |

Also present in the data layer — `lib/site-config.ts:35`, `lib/types.ts:122`,
`lib/content.ts:365`, `lib/sanity-queries.ts:29`, and as a field in
`studio/schemas/artist.ts:99`.

**Fix —** remove every user-facing Patreon link and the SUPPORT nav item. Leave
the `patreonUrl` field in the Sanity schema (unused, costs nothing, lets her
restore it later without a deploy).

> Worth noting for her: her **old** site does carry "Support me on Patreon" in
> the footer. She is asking to drop it from the new one, so that is what we do.

---

## 10 — Type scale and menu proportions

> **Aglaya:** "**3: to change the fronts** ["fonts"] **on the same ones as my
> old page, also maybe the colours** (I really like the way how menu is located
> and **the sizes of the fronts**, maybe you can take a look and try to make is
> as similar as possible?)"

Measured on her old site: `Arial, sans-serif`, 16 px nav, 16 px bold wordmark,
pure blue `rgb(0,0,255)` links, white background, body text `#333`.

The new site: Vollkorn (serif display) + Inter, warm paper `#FAF7F2`, ink
`#0F0E0D`, with page titles at 5.5rem and detail titles at 7rem.

What she is consistently complaining about across every message is **scale**,
not typeface — "my huge name", "the sizes of the fronts", "smaller and in the
middle". The literal request (swap to Arial, blue links, white) would discard
the whole editorial design system.

**Decision —** keep Vollkorn + Inter and the paper/ink palette; bring the type
scale down hard so the proportions read like her old site: small wordmark, small
nav, listing titles around 16-18 px, page titles around 28 px, no display-size
headings anywhere. This is documented as a deliberate partial answer in the Q&A
sheet for her.

Affected: `components/layout/page-header.tsx:21-33`,
`components/detail/entry-detail.tsx:99`, `components/home/home-hero.tsx:28`,
`components/artwork/artwork-caption.tsx`, `components/layout/site-header.tsx`.

