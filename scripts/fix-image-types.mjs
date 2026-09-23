/**
 * Two structural fixes across the dataset:
 *
 * 1. Hero + gallery items have `_type: "image"` (raw image) instead of
 *    `imageWithAlt` (the schema-typed wrapper). Caused by the migration
 *    script's spread order — `_type: "imageWithAlt"` was overwritten
 *    by the `image` _type from the upload helper. The studio shows
 *    "Item of type image not valid for this list" because of this.
 *
 * 2. Exhibition docs have null `medium` / `location` fields (set by
 *    earlier fix script) — those fields aren't in the exhibition
 *    schema, so the studio shows them as "Unknown fields found".
 *    Need to unset, not nullset.
 *
 * Idempotent.
 */

import { createClient } from "@sanity/client";

const c = createClient({
  projectId: "w6axlzhx",
  dataset: "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// ─── 1. Retype hero + gallery items ────────────────────────────────────

function retype(image) {
  if (!image) return image;
  return { ...image, _type: "imageWithAlt" };
}

async function fixDocsOfType(type, hasGallery, hasImages = false) {
  const docs = await c.fetch(
    `*[_type == $type] { _id, hero, gallery, images }`,
    { type },
  );
  let patched = 0;
  for (const d of docs) {
    const setOps = {};
    if (d.hero?._type === "image") {
      setOps.hero = retype(d.hero);
    }
    if (hasGallery && Array.isArray(d.gallery)) {
      const fixedGallery = d.gallery.map((g) =>
        g?._type === "image" ? retype(g) : g,
      );
      const needsFix = fixedGallery.some(
        (g, i) => g._type !== d.gallery[i]._type,
      );
      if (needsFix) setOps.gallery = fixedGallery;
    }
    if (hasImages && Array.isArray(d.images)) {
      const fixedImages = d.images.map((img) =>
        img?._type === "image" ? retype(img) : img,
      );
      const needsFix = fixedImages.some(
        (g, i) => g._type !== d.images[i]._type,
      );
      if (needsFix) setOps.images = fixedImages;
    }

    if (Object.keys(setOps).length > 0) {
      await c.patch(d._id).set(setOps).commit();
      console.log(`  ✓ ${d._id}`);
      patched++;
    }
  }
  console.log(`  ${patched}/${docs.length} ${type} docs patched`);
}

console.log("→ Retype hero/gallery items to imageWithAlt:");
console.log(" projects:");
await fixDocsOfType("project", true);
console.log(" exhibitions:");
await fixDocsOfType("exhibition", true);
console.log(" illustrations:");
await fixDocsOfType("illustration", true);
console.log(" photographSets:");
await fixDocsOfType("photographSet", false, true);

// Also retype artist.portrait
const artist = await c.getDocument("artist");
if (artist?.portrait?._type === "image") {
  await c.patch("artist").set({ portrait: retype(artist.portrait) }).commit();
  console.log(" ✓ artist.portrait");
}

// ─── 2. Unset orphan fields on exhibitions ─────────────────────────────

console.log("\n→ Unset orphan medium / location on exhibitions:");
const exhibitions = await c.fetch(
  `*[_type == "exhibition"] { _id, "hasMedium": defined(medium), "hasLocation": defined(location) }`,
);
let unset = 0;
for (const e of exhibitions) {
  const unsetFields = [];
  if (e.hasMedium) unsetFields.push("medium");
  if (e.hasLocation) unsetFields.push("location");
  if (unsetFields.length > 0) {
    await c.patch(e._id).unset(unsetFields).commit();
    console.log(`  ✓ ${e._id} (unset ${unsetFields.join(", ")})`);
    unset++;
  }
}
console.log(`  ${unset}/${exhibitions.length} exhibitions cleaned`);

console.log("\nDone.");
