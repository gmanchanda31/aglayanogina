/**
 * Fills in missing `alt` text on every image in the dataset.
 *
 * Why: `studio/schemas/objects/imageWithAlt.ts` declares
 *   rule.required().max(180).warning(...)
 * The trailing `.warning()` downgrades the whole chain, so an image with no
 * alt text raises a *warning* — which the Studio renders as a small triangle
 * badge in the corner of the image card. That badge is the "question sign"
 * Aglaya asked about on the Aura Kunstraum gallery (7 of its 8 gallery
 * images had no alt text).
 *
 * Alt strings follow the same convention the site already uses as a fallback
 * in lib/content.ts:
 *   hero    → "<Title> — <medium>, <year>"
 *   gallery → "<Title>, <medium>, <year> (<n>)"
 *
 * Only empty fields are written; existing alt text is never overwritten.
 * Drafts are patched alongside published documents so the badge clears in
 * the editor too.
 *
 * Run from repo root:
 *   node --env-file=.env.local scripts/fix-missing-alt.mjs
 *
 * Idempotent — a second run patches nothing.
 */

import { createClient } from "@sanity/client";

const c = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "w6axlzhx",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const MAX_ALT = 180;

/** Context parts that aren't already spelled out in the title. */
function context(doc) {
  const parts =
    doc._type === "exhibition"
      ? [doc.venue, doc.city, doc.year]
      : doc._type === "illustration"
        ? [doc.medium, doc.client, doc.year]
        : [doc.medium, doc.year];

  const title = (doc.title ?? "").toLowerCase();
  return parts
    .filter(Boolean)
    .filter((p) => !title.includes(String(p).toLowerCase()))
    .join(", ");
}

function altFor(doc, position) {
  const title = doc.title ?? "Artwork";
  const ctx = context(doc);
  const base =
    position === null
      ? ctx
        ? `${title} — ${ctx}`
        : title
      : ctx
        ? `${title}, ${ctx} (${position})`
        : `${title} (${position})`;
  return base.length > MAX_ALT ? `${base.slice(0, MAX_ALT - 1).trimEnd()}…` : base;
}

const docs = await c.fetch(
  `*[_type in ["project", "exhibition", "illustration", "photographSet", "artist"]]{
    _id, _type, title, year, medium, venue, city, client, name,
    hero, portrait, gallery, images
  }`,
);

let patchedDocs = 0;
let patchedImages = 0;

for (const doc of docs) {
  const set = {};

  // artist.portrait falls back to the artist's name; everything else to title.
  const labelled = doc._type === "artist" ? { ...doc, title: doc.name } : doc;

  if (doc.hero && !doc.hero.alt?.trim()) {
    set.hero = { ...doc.hero, alt: altFor(labelled, null) };
    patchedImages++;
  }
  if (doc.portrait && !doc.portrait.alt?.trim()) {
    set.portrait = {
      ...doc.portrait,
      alt: `${doc.name ?? "Aglaya Nogina"} in the studio`,
    };
    patchedImages++;
  }

  for (const field of ["gallery", "images"]) {
    const arr = doc[field];
    if (!Array.isArray(arr)) continue;
    let touched = false;
    const next = arr.map((img, i) => {
      if (!img || img.alt?.trim()) return img;
      touched = true;
      patchedImages++;
      return { ...img, alt: altFor(labelled, i + 1) };
    });
    if (touched) set[field] = next;
  }

  if (Object.keys(set).length === 0) continue;

  await c.patch(doc._id).set(set).commit();
  patchedDocs++;
  for (const [field, value] of Object.entries(set)) {
    if (Array.isArray(value)) {
      value.forEach((img, i) => {
        const before = doc[field][i];
        if (before?.alt !== img.alt) console.log(`  ${doc._id} ${field}[${i}] → "${img.alt}"`);
      });
    } else {
      console.log(`  ${doc._id} ${field} → "${value.alt}"`);
    }
  }
}

console.log(`\n${patchedImages} images across ${patchedDocs}/${docs.length} documents given alt text.`);
