/**
 * Patches Sanity to correct content the migration parser mishandled.
 * Each fix preserves every line of text from the old site — none of this
 * is invention; we're just reshelving glued strings into the right fields.
 *
 * Run from repo root:
 *   node --env-file=.env.local scripts/fix-content.mjs
 *
 * Idempotent — re-running just sets the same values again.
 */

import { createClient } from "@sanity/client";

const c = createClient({
  projectId: "w6axlzhx",
  dataset: "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

/** Build a Portable Text body from plain paragraph strings. */
function paras(...strings) {
  return strings.filter(Boolean).map((text, i) => ({
    _type: "block",
    _key: `b-${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s-${i}`, text, marks: [] }],
  }));
}

const fixes = [
  // ───── PROJECTS ─────────────────────────────────────────────────────

  {
    id: "project-ceramic",
    set: {
      medium: "Baked clay",
      year: "2025",
      description: paras("Research in working with ceramics."),
    },
  },

  {
    id: "project-nest",
    set: {
      medium: "Branches, backpack straps",
      dimensions: "100 × 100 cm",
      year: "2025",
      description: paras(
        "Photo documentation from performance “Nest.” Analog photos by Anna Lunghini.",
        "…so I built myself a nest, one I can carry. In fact, my first “nest” was the small backpack I took with me on the first day of the war — a few things that suddenly became my whole life. They are still with me, quiet objects that turned into home, into an anchor, into my readiness to move again. I wanted to make this metaphor real, to weave an actual nest and turn it into a backpack. It is heavy, almost ten kilos, made of branches and sticks that press against my shoulders. Fragile and awkward, not comfortable to wear, just as emigration is not comfortable, just as the feeling of living with the knowledge that in my actual home there is always war. And still, I cannot simply take this nest off — it stays with me, like the experience itself. In these photos you see the documentation of a performance where I spend hours each day with the nest on my back, doing ordinary things in Neuss, the city where I have been living since the beginning of the full-scale invasion. This work is about home as I know it now — no longer a fixed place, no longer material things, but something I always carry with me. A home that has shifted into movement, into readiness, into memories and people, into the weight of what I cannot put down, and into the freedom to continue.",
      ),
    },
  },

  // ───── EXHIBITIONS ──────────────────────────────────────────────────

  {
    id: "exhibition-archipelago-berlin",
    set: {
      kind: "Solo",
      venue: "Kunststudio 16",
      city: "Berlin",
      year: "2024",
      medium: null,
      location: null,
      description: paras("Solo show — Archipelago."),
    },
  },

  {
    id: "exhibition-archipelago-dusseldorf",
    set: {
      kind: "Group",
      venue: "Kunstakademie Düsseldorf",
      city: "Düsseldorf",
      year: "2024",
      medium: null,
      location: null,
      description: paras("Rundgang 2024."),
    },
  },

  {
    id: "exhibition-aura-kunstraum-dusseldorf",
    set: {
      kind: "Group",
      venue: "Aura Kunstraum",
      city: "Düsseldorf",
      year: "2023",
      curator: "Andrei Dureika",
      medium: null,
      description: paras("Project “Terra, Memoria mundi.”"),
    },
  },

  {
    id: "exhibition-carpathians",
    set: {
      kind: "Solo",
      venue: "Residency MC6",
      city: "Carpathian Mountains",
      year: "2024",
      medium: null,
      description: paras("Solo show with textiles."),
    },
  },

  {
    id: "exhibition-kyiv",
    set: {
      kind: "Solo",
      venue: "Portal 11 Gallery",
      city: "Kyiv",
      year: "2024",
      medium: null,
      location: null,
      description: paras("Solo show — Archipelago."),
    },
  },

  {
    id: "exhibition-memories-of-the-future",
    set: {
      kind: "Group",
      venue: "Schönhausen Palace",
      city: "Berlin",
      year: "Spring – Autumn 2024",
      curator: "Anna Petrova",
      medium: null,
      description: paras("Group exhibition — Memories of the Future."),
    },
  },

  {
    id: "exhibition-schonhausen-palace-berlin",
    set: {
      kind: "Group",
      venue: "Schönhausen Palace",
      city: "Berlin",
      year: "2023",
      curator: "Anna Petrova",
      medium: null,
      description: paras("Participation in the group exhibition “Goldnarben.”"),
    },
  },

  // ───── ILLUSTRATIONS ────────────────────────────────────────────────

  {
    id: "illustration-the-winter-sea",
    set: {
      year: "2024",
      // Was misclassified as a pullQuote — it's the actual description.
      description: paras(
        '“The Winter Sea” is the first novel of the contemporary Georgian poet Gaga Nakhutsrishvili, which contains lyrical philosophical reflections on the basic questions of humanity: what is the meaning of human being? Who am I? What is love? As an artist, it was very interesting for me to dive into the atmosphere created by the author of this book. I tried to illustrate the whole essence and depth of the soul of this book.',
      ),
    },
  },
];

let applied = 0;
for (const fix of fixes) {
  try {
    await c.patch(fix.id).set(fix.set).commit({ autoGenerateArrayKeys: true });
    console.log(`✓ ${fix.id}`);
    applied++;
  } catch (e) {
    console.error(`✗ ${fix.id}: ${e.message}`);
  }
}
console.log(`\nApplied ${applied}/${fixes.length} fixes.`);
