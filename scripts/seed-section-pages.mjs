/**
 * Seeds the five `sectionPage` documents — the eyebrow / title / intro block
 * at the top of each listing page.
 *
 * Until now that copy was hardcoded in app/<section>/page.tsx, so Aglaya had
 * no way to reach it ("I also don't see where I can change this"). The values
 * below are exactly the strings that were in the code, so seeding changes
 * nothing visually — it just moves the copy into her hands.
 *
 * Eyebrows are seeded empty on purpose. The site falls back to the computed
 * "8 works · 2021 — 2025" line when the field is blank, so the pages render
 * exactly as before *and* the count stays right as Aglaya adds work. Typing
 * anything into the field overrides it.
 *
 * Run from repo root:
 *   node --env-file=.env.local scripts/seed-section-pages.mjs
 *
 * Idempotent — uses createOrReplace on fixed ids, so re-running restores the
 * seeded copy. Pass --if-missing to leave existing documents untouched.
 *
 * Ids are hyphenated, not dotted: Sanity's public read grant does not match
 * document ids containing a "." (the same rule that keeps `drafts.*` private),
 * and the site reads the dataset without a token at build time.
 */

import { createClient } from "@sanity/client";

const c = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "w6axlzhx",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const onlyIfMissing = process.argv.includes("--if-missing");

const pages = [
  {
    section: "projects",
    title: "Projects",
    intro:
      "Selected works in xerography, relief printing, painting, and ceramic — exploring memory, displacement, and the strength of friendship.",
    metaDescription:
      "Selected projects in xerography, relief printing, painting, ceramics, and sculpture by Aglaya Nogina — exploring memory, displacement, and friendship.",
  },
  {
    section: "exhibitions",
    title: "Exhibitions",
    intro:
      "Solo and group exhibitions across Düsseldorf, Berlin, Kyiv, Lviv, the Carpathians, and the West Coast of the United States.",
    metaDescription:
      "Solo and group exhibitions by Aglaya Nogina — Düsseldorf, Berlin, Kyiv, Lviv, and beyond.",
  },
  {
    section: "illustrations",
    title: "Illustrations",
    intro:
      "Pen-and-ink series and album covers — Schmalgauzen, The Eustomes, The Winter Sea — patterned, intricate, and quiet.",
    metaDescription:
      "Pen and ink illustrations, album covers, and editorial commissions by Aglaya Nogina.",
  },
  {
    section: "photographs",
    title: "Photographs",
    intro:
      "A film and digital archive — places lived in, places visited, faces returned to. Made between Kyiv, Berlin, Istanbul, Goa, and Düsseldorf.",
    metaDescription:
      "A film and digital archive — places lived in, places visited, faces returned to. Made between Kyiv, Berlin, Istanbul, Goa, and Düsseldorf.",
  },
  {
    section: "writings",
    title: "Writings",
    intro:
      "Lyrical essays and short prose — sometimes companion pieces to the visual work, sometimes their own quiet thing.",
    metaDescription:
      "Essays and short prose by Aglaya Nogina — purgatory waiting rooms, botanical bridges, mirror diaries, the small physics of remembering.",
  },
];

for (const page of pages) {
  const _id = `sectionPage-${page.section}`;
  const existing = await c.getDocument(_id);

  if (existing && onlyIfMissing) {
    console.log(`  · ${_id} already exists — left alone`);
    continue;
  }

  const doc = { _id, _type: "sectionPage", ...page };
  // Empty eyebrow means "let the site compute the count" — don't store "".
  if (!doc.eyebrow) delete doc.eyebrow;

  await c.createOrReplace(doc);
  console.log(`  ${existing ? "↻" : "✓"} ${_id}  "${page.title}"`);
}

console.log(`\n${pages.length} section page documents seeded.`);
