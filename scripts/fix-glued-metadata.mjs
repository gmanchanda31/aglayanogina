/**
 * Un-glues metadata that the original Webflow scrape concatenated into a
 * single run-on string, and reshelves each part into its proper field.
 *
 * The scraper joined adjacent HTML elements with no separator, so
 * /exhibitions/lost-beauty renders its stand-first as:
 *
 *   "… at the artist-run space KutCurated by Daria Zhuravel2025"
 *
 * — venue, curator and year welded onto the end of a sentence. Nothing in
 * lib/content.ts joins these values (CLAUDE.md's `splitCamelRuns()` helper
 * does not exist in the codebase); the glue is in the stored text itself, so
 * this is a data repair, not a render fix.
 *
 * Every value below already appears verbatim in the dataset — this only moves
 * substrings into the right fields. Nothing is invented. In the
 * archipelago-book case the correct split already exists in that document's
 * own unpublished draft, and is copied from there.
 *
 * Run from repo root:
 *   node --env-file=.env.local scripts/fix-glued-metadata.mjs
 *
 * Idempotent and safe: each fix states the exact text it expects to find and
 * is skipped if the document no longer matches.
 */

import { createClient } from "@sanity/client";

const c = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "w6axlzhx",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const fixes = [
  {
    id: "exhibition-lost-beauty",
    why: '"…space KutCurated by Daria Zhuravel2025" — curator and year welded onto the stand-first.',
    block: {
      key: "b-0",
      span: "s-0",
      from:
        'Solo exhibition in Kyiv in collaboration with Maria Vasilyeva\'s project "Dreams of War" at the artist-run space KutCurated by Daria Zhuravel2025',
      to:
        'Solo exhibition in Kyiv in collaboration with Maria Vasilyeva\'s project "Dreams of War" at the artist-run space Kut',
    },
    // "Curated by Daria Zhuravel" and "2025" lifted out of the sentence above.
    set: { curator: "Daria Zhuravel", year: "2025" },
  },
  {
    id: "exhibition-landscapes-of-memory",
    why: '"…the Svitlo Gallery, Lviv2024" — year welded onto the stand-first.',
    block: {
      key: "b-0",
      span: "s-0",
      from:
        'Retrospective solo exhibition "Landscapes of Memory" at the Svitlo Gallery, Lviv2024',
      to:
        'Retrospective solo exhibition "Landscapes of Memory" at the Svitlo Gallery, Lviv',
    },
    // The curator already sits in its own paragraph ("Curated by Olena
    // Polishchuk"), so it is left where it is rather than duplicated into
    // the metadata stack.
    set: { year: "2024" },
  },
  {
    id: "project-archipelago-book",
    why: '"300 piecesPrinted in Kyiv, Ukraine2024-2025" — three fields in one.',
    // Values copied verbatim from drafts.project-archipelago-book, where this
    // split was already authored but never published.
    fieldFrom: { location: "300 piecesPrinted in Kyiv, Ukraine2024-2025" },
    set: {
      dimensions: "300 pieces",
      location: "Printed in Kyiv, Ukraine",
      year: "2024-2025",
    },
  },
];

let applied = 0;

for (const fix of fixes) {
  const doc = await c.getDocument(fix.id);
  if (!doc) {
    console.log(`  ! ${fix.id} — not found, skipped`);
    continue;
  }

  const patch = { ...fix.set };

  if (fix.block) {
    const block = (doc.description ?? []).find((b) => b._key === fix.block.key);
    const span = (block?.children ?? []).find((s) => s._key === fix.block.span);
    if (!span) {
      console.log(`  ! ${fix.id} — block ${fix.block.key} not found, skipped`);
      continue;
    }
    if (span.text === fix.block.to) {
      console.log(`  · ${fix.id} — already un-glued`);
      continue;
    }
    if (span.text !== fix.block.from) {
      console.log(`  ! ${fix.id} — text has changed since this fix was written, skipped`);
      continue;
    }
    // Key-addressed path so the rest of the description array is untouched.
    patch[`description[_key=="${fix.block.key}"].children[_key=="${fix.block.span}"].text`] =
      fix.block.to;
  }

  if (fix.fieldFrom) {
    const [field, expected] = Object.entries(fix.fieldFrom)[0];
    if (doc[field] !== expected) {
      console.log(
        doc[field] === fix.set[field]
          ? `  · ${fix.id} — already un-glued`
          : `  ! ${fix.id} — ${field} has changed since this fix was written, skipped`,
      );
      continue;
    }
  }

  await c.patch(fix.id).set(patch).commit();
  console.log(`  ✓ ${fix.id}`);
  console.log(`      ${fix.why}`);
  for (const [k, v] of Object.entries(fix.set)) console.log(`      ${k} → "${v}"`);
  applied++;
}

console.log(`\n${applied}/${fixes.length} documents repaired.`);
