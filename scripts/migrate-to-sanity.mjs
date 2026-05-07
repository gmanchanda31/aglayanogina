/**
 * One-shot migration: data/parsed.json + image_plan.json → Sanity.
 *
 * Idempotent: re-running with the same SANITY_WRITE_TOKEN updates docs in
 * place (deterministic IDs) and skips images Sanity has seen (Sanity
 * deduplicates by SHA1).
 *
 * Run from repo root:
 *   node --env-file=.env.local scripts/migrate-to-sanity.mjs
 *
 * Or:
 *   SANITY_WRITE_TOKEN=sk... node scripts/migrate-to-sanity.mjs
 */

import { createClient } from "@sanity/client";
import { readFileSync, createReadStream } from "node:fs";
import { join } from "node:path";

// ─── Config ────────────────────────────────────────────────────────────────

const PROJECT_ID = process.env.SANITY_PROJECT_ID || "w6axlzhx";
const DATASET = process.env.SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_WRITE_TOKEN;

if (!TOKEN) {
  console.error("SANITY_WRITE_TOKEN missing. Set it in .env.local.");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2025-01-01",
  token: TOKEN,
  useCdn: false,
});

// ─── Truth sources ─────────────────────────────────────────────────────────

const parsed = JSON.parse(readFileSync("./data/parsed.json", "utf8"));
const plan = JSON.parse(readFileSync("./data/image_plan.json", "utf8"));

const pageByPath = new Map(parsed.map((p) => [p.file, p]));

const ZWJ = /‍/g;
const clean = (s) => (s ?? "").replace(ZWJ, "").trim();

function getPage(section, slug) {
  return pageByPath.get(section ? `_raw/${section}/${slug}.html` : `_raw/${slug}.html`);
}

function listingFor(section) {
  const page = getPage("", section);
  if (!page) return [];
  return page.listing
    .filter((it) => it.href && it.title && !it.href.includes("webflow-io"))
    .map((it) => {
      const rawSlug = it.href.replace(/^\/[^/]+\//, "");
      return {
        title: clean(it.title),
        rawSlug,
        routeSlug: rawSlug.replace(/-+$/, ""),
      };
    });
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const slugField = (s) => ({ _type: "slug", current: s });

/**
 * Convert paragraph strings to Portable Text blocks.
 * Heuristics:
 *  - Paragraph that starts with a curly quote → pullQuote object
 *  - First paragraph: first letter wrapped in a `dropCap` mark span (writings only)
 */
function toPortableText(paragraphs, { withDropCap = false } = {}) {
  const blocks = [];
  let pulledQuote = false;
  let droppedCap = !withDropCap; // true means we won't drop-cap

  for (const para of paragraphs) {
    const text = clean(para);
    if (!text) continue;

    // Pull quote: starts with curly opening quote and is reasonably long
    if (!pulledQuote && /^[“"„«]/.test(text) && text.length > 60) {
      const inner = text.replace(/^[“"„«]/, "").replace(/[”"»]\s*$/, "").trim();
      blocks.push({
        _type: "pullQuote",
        _key: `pq-${blocks.length}`,
        text: inner,
      });
      pulledQuote = true;
      continue;
    }

    if (!droppedCap) {
      const first = text.charAt(0);
      const rest = text.slice(1);
      blocks.push({
        _type: "block",
        _key: `b-${blocks.length}`,
        style: "normal",
        markDefs: [],
        children: [
          { _type: "span", _key: `s-1`, text: first, marks: ["dropCap"] },
          { _type: "span", _key: `s-2`, text: rest, marks: [] },
        ],
      });
      droppedCap = true;
      continue;
    }

    blocks.push({
      _type: "block",
      _key: `b-${blocks.length}`,
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: `s-${blocks.length}`, text, marks: [] }],
    });
  }
  return blocks;
}

// ─── Image upload (deduped by SHA1 in Sanity) ──────────────────────────────

/** Upload a single image and return a Sanity asset reference. */
async function uploadImage(localPath, label) {
  const abs = join("./public", localPath);
  const filename = localPath.split("/").pop();
  const stream = createReadStream(abs);
  const asset = await client.assets.upload("image", stream, { filename, label });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

/** Upload an array of images from the plan, attach alt text. */
async function uploadGallery(planEntries, altPrefix, altContext) {
  const out = [];
  for (let i = 0; i < planEntries.length; i++) {
    const p = planEntries[i];
    process.stdout.write(`    [${i + 1}/${planEntries.length}] ${p.name}\r`);
    const base = await uploadImage(p.local, `${altPrefix} ${i + 1}`);
    out.push({
      _type: "imageWithAlt",
      _key: `img-${i}`,
      ...base,
      alt:
        i === 0
          ? altContext
            ? `${altPrefix} — ${altContext}`
            : altPrefix
          : `${altPrefix}${altContext ? `, ${altContext}` : ""} (${i + 1})`,
    });
  }
  process.stdout.write("\n");
  return out;
}

// ─── Metadata extraction (mirrors lib/content.ts) ─────────────────────────

const KNOWN_CITIES =
  /\b(Düsseldorf|Berlin|Kyiv|Lviv|Kharkiv|Cologne|Barcelona|Istanbul|Goa|Munich|Madrid|Paris|Rome|Vienna|Luhansk|Carpathians|Germany|Ukraine|Spain|France|Italy|Turkey|India|USA|Austria|Netherlands|Poland)\b/i;

function splitCamelRuns(text) {
  if (text.includes(" ") || text.length < 14) return text;
  return text.replace(/([a-z])([A-Z])/g, "$1 · $2");
}

function classifyMetadata(value) {
  const v = value.trim();
  if (/^(?:19|20)\d{2}\s*[-–—]?\s*(?:(?:19|20)\d{2}|ongoing)?$/.test(v)) return { kind: "year", value: v };
  if (/^(size|dimensions|format)\s*[:\-]/i.test(v) || /\d+\s*[x×]\s*\d+/i.test(v))
    return { kind: "dimensions", value: v.replace(/^(size|dimensions|format)\s*[:\-]\s*/i, "") };
  if (KNOWN_CITIES.test(v)) return { kind: "location", value: v };
  return { kind: "medium", value: v };
}

function paragraphs(blocks) {
  return blocks.filter(([k]) => k === "p" || k === "blockquote").map(([, v]) => clean(v)).filter(Boolean);
}

function looksLikeQuote(t) {
  return /^[“"„«]/.test(t) && t.length > 60;
}

/**
 * Split entry paragraphs into:
 *   { medium, year, location, dimensions } (any may be undefined)
 *   description: paragraphs that follow the metadata
 *   pullQuote, quoteAttribution: optional
 */
function splitEntry(allParas) {
  const meta = { medium: undefined, year: undefined, location: undefined, dimensions: undefined };
  const description = [];
  let inDesc = false;
  for (const para of allParas) {
    if (inDesc) {
      description.push(para);
      continue;
    }
    if (para.length <= 80 && !looksLikeQuote(para)) {
      const cls = classifyMetadata(splitCamelRuns(para));
      if (!meta[cls.kind]) meta[cls.kind] = cls.value;
      continue;
    }
    inDesc = true;
    description.push(para);
  }

  // Lift first quote-shaped paragraph as pullQuote
  let pullQuote, quoteAttribution;
  const remaining = [];
  for (let i = 0; i < description.length; i++) {
    const p = description[i];
    if (!pullQuote && looksLikeQuote(p)) {
      pullQuote = p.replace(/^[“"„«]/, "").replace(/[”"»]\s*$/, "").trim();
      const next = description[i + 1];
      if (next && /^[—–-]\s*\w/.test(next) && next.length < 60) {
        quoteAttribution = next.replace(/^[—–-]\s*/, "").replace(/\.$/, "").trim();
        i++;
      }
      continue;
    }
    remaining.push(p);
  }
  return { ...meta, description: remaining, pullQuote, quoteAttribution };
}

// ─── About page → artist singleton ────────────────────────────────────────

function buildArtistDoc() {
  const page = getPage("", "about");
  if (!page) throw new Error("missing about page");

  // The about parser logic from lib/content.ts inlined.
  const lines = [];
  for (const [k, v] of page.blocks) {
    if (k === "p" || k === "h2" || k === "h3" || k === "h4" || k === "h5" || k === "h6") {
      const t = clean(v);
      if (t) lines.push(t);
    }
  }

  const sections = { EDUCATION: [], PUBLICATIONS: [], "SOLO EXHIBITIONS": [], "SELECTED EXHIBITIONS": [], BIO: [] };
  let current = null;
  for (const line of lines) {
    const upper = line.toUpperCase();
    const match = ["EDUCATION", "PUBLICATIONS", "SOLO EXHIBITIONS", "SELECTED EXHIBITIONS", "BIO"].find(
      (h) => upper === h || upper.startsWith(h),
    );
    if (match) {
      current = match;
      continue;
    }
    if (current) sections[current].push(line);
  }

  function pairCV(arr) {
    const rows = [];
    let i = 0;
    while (i < arr.length) {
      const line = arr[i];
      const yearMatch = line.match(/^((?:19|20)\d{2}(?:\s*[-–—]\s*(?:(?:19|20)?\d{2,4}|ongoing))?)/);
      if (yearMatch && line === yearMatch[0]) {
        const next = arr[i + 1];
        if (next) {
          rows.push({ year: yearMatch[0], detail: next });
          i += 2;
          continue;
        }
      }
      if (yearMatch) {
        const year = yearMatch[0];
        const detail = line.slice(year.length).trim();
        rows.push({ year, detail: detail || line });
      } else if (rows.length > 0) {
        rows[rows.length - 1].detail += ` ${line}`;
      } else {
        rows.push({ year: "", detail: line });
      }
      i++;
    }
    return rows;
  }

  function dashCV(arr) {
    return arr.map((line) => {
      const m = line.match(/^([^—–-]+?)\s*[—–-]\s*(.+)$/);
      return m ? { year: m[1].trim(), detail: m[2].trim() } : { year: "", detail: line };
    });
  }

  const cvKey = (rows) => rows.map((r, i) => ({ _key: `cv-${i}`, _type: "cvRow", ...r }));

  const bio = sections.BIO;

  return {
    _id: "artist",
    _type: "artist",
    name: "Aglaya Nogina",
    tagline: "Visual artist · Luhansk → Kyiv → Düsseldorf · b. 1996",
    intro: bio[0] ?? "",
    paragraphs: bio.slice(1),
    education: cvKey(pairCV(sections.EDUCATION)),
    publications: cvKey(pairCV(sections.PUBLICATIONS)),
    soloExhibitions: cvKey(dashCV(sections["SOLO EXHIBITIONS"])),
    selectedExhibitions: cvKey(dashCV(sections["SELECTED EXHIBITIONS"])),
    city: "Düsseldorf, Germany",
    email: "aglaya.nn.art@gmail.com",
    instagramUrl: "https://www.instagram.com/aglaya.nn",
    whatsappUrl: "https://wa.me/491756252702",
    patreonUrl: "https://patreon.com/aglayann",
  };
}

// ─── Detail-page builder (project / exhibition / illustration) ────────────

const KIND_MATCHERS = [
  ["Print", /xerography|relief print|engrav|graphic|print|paper/i],
  ["Painting", /paint/i],
  ["Ceramic", /ceramic/i],
  ["Sculpture", /sculpt/i],
  ["Photography", /photograph/i],
  ["Textile", /textile|fabric/i],
  ["Book", /\bbook\b/i],
];

function deriveKinds(title, slug, paras) {
  const haystack = [title, slug, ...paras.slice(0, 3)].join(" ");
  return KIND_MATCHERS.filter(([, re]) => re.test(haystack)).map(([k]) => k);
}

async function buildDetailDoc({ docType, idPrefix, section, item, extras = {} }) {
  const page = getPage(section, item.rawSlug);
  if (!page) {
    console.warn(`  skip ${section}/${item.rawSlug} — no parsed page`);
    return null;
  }
  const allParas = paragraphs(page.blocks);
  const split = splitEntry(allParas);

  const planEntries = plan[`${section}/${item.rawSlug}`] ?? [];
  const altContext = [split.medium, split.year].filter(Boolean).join(", ");
  const heroEntry = planEntries[0];
  const galleryEntries = planEntries.slice(1);

  let hero;
  if (heroEntry) {
    console.log(`  uploading hero for ${item.title}…`);
    const base = await uploadImage(heroEntry.local, item.title);
    hero = {
      _type: "imageWithAlt",
      ...base,
      alt: altContext ? `${item.title} — ${altContext}` : item.title,
    };
  }

  let gallery = [];
  if (galleryEntries.length > 0) {
    console.log(`  uploading ${galleryEntries.length} gallery images for ${item.title}…`);
    gallery = await uploadGallery(galleryEntries, item.title, altContext);
    // Adjust _key offsets so they don't clash with hero
    gallery = gallery.map((g, i) => ({ ...g, _key: `g-${i + 1}` }));
  }

  const description = toPortableText(split.description);
  if (split.pullQuote) {
    description.push({
      _type: "pullQuote",
      _key: `pq-final`,
      text: split.pullQuote,
      attribution: split.quoteAttribution,
    });
  }

  return {
    _id: `${idPrefix}-${item.routeSlug}`,
    _type: docType,
    title: item.title,
    slug: slugField(item.routeSlug),
    medium: split.medium,
    year: split.year,
    location: split.location,
    dimensions: split.dimensions,
    hero,
    description,
    gallery,
    kinds:
      docType === "project"
        ? deriveKinds(item.title, item.rawSlug, allParas)
        : undefined,
    ...extras,
  };
}

// ─── Photograph set ────────────────────────────────────────────────────────

async function buildPhotographSetDoc(item) {
  const planEntries = plan[`photographs/${item.rawSlug}`] ?? [];
  console.log(`  uploading ${planEntries.length} photographs for ${item.title}…`);
  const images = await uploadGallery(planEntries, item.title);
  return {
    _id: `photographSet-${item.routeSlug}`,
    _type: "photographSet",
    title: item.title,
    slug: slugField(item.routeSlug),
    images,
  };
}

// ─── Writing ───────────────────────────────────────────────────────────────

function buildWritingDoc(item) {
  const page = getPage("writings", item.rawSlug);
  if (!page) return null;
  const paras = paragraphs(page.blocks).filter((p) => p !== item.title);
  const excerpt = paras[0]?.slice(0, 200) ?? "";
  const body = toPortableText(paras, { withDropCap: true });
  return {
    _id: `writing-${item.routeSlug}`,
    _type: "writing",
    title: item.title,
    slug: slugField(item.routeSlug),
    excerpt,
    body,
  };
}

// ─── Home picks (singleton) ────────────────────────────────────────────────

function buildHomePicksDoc() {
  // Refs are deterministic — projects + writings already follow the same id pattern
  return {
    _id: "homePicks",
    _type: "homePicks",
    heroItalic: "",
    heroTagline: "Ukrainian visual artist working in xerography, painting, ceramic, and writing. Lives in Düsseldorf.",
    featuredProject: { _type: "reference", _ref: "project-lost-beauty" },
    featuredTeaser: "",
    featuredExhibitionLine: "KUT Gallery, Kyiv · October 2025",
    selectedWorks: [
      { _type: "reference", _key: "sw-0", _ref: "project-archipelago" },
      { _type: "reference", _key: "sw-1", _ref: "project-terra-memoria-mundi" },
      { _type: "reference", _key: "sw-2", _ref: "project-nest" },
      { _type: "reference", _key: "sw-3", _ref: "project-archipelago-book" },
    ],
    journalPicks: [
      {
        _type: "journalPick",
        _key: "jp-0",
        writing: { _type: "reference", _ref: "writing-afterlife" },
        teaser: "",
      },
      {
        _type: "journalPick",
        _key: "jp-1",
        writing: { _type: "reference", _ref: "writing-5-2-richard-bach-street" },
        teaser: "",
      },
    ],
  };
}

// ─── Run ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Migrating to project ${PROJECT_ID} / dataset ${DATASET}\n`);

  // 1. Artist
  console.log("→ artist (singleton)");
  await client.createOrReplace(buildArtistDoc());
  console.log("  ✓");

  // 2. Projects (8)
  console.log("\n→ projects");
  for (const item of listingFor("projects")) {
    console.log(` • ${item.title}`);
    const doc = await buildDetailDoc({
      docType: "project",
      idPrefix: "project",
      section: "projects",
      item,
    });
    if (doc) await client.createOrReplace(doc);
  }

  // 3. Exhibitions (9)
  console.log("\n→ exhibitions");
  for (const item of listingFor("exhibitions")) {
    console.log(` • ${item.title}`);
    const doc = await buildDetailDoc({
      docType: "exhibition",
      idPrefix: "exhibition",
      section: "exhibitions",
      item,
    });
    if (doc) await client.createOrReplace(doc);
  }

  // 4. Illustrations (5)
  console.log("\n→ illustrations");
  for (const item of listingFor("illustrations")) {
    console.log(` • ${item.title}`);
    const doc = await buildDetailDoc({
      docType: "illustration",
      idPrefix: "illustration",
      section: "illustrations",
      item,
    });
    if (doc) await client.createOrReplace(doc);
  }

  // 5. Photograph sets (4)
  console.log("\n→ photograph sets");
  for (const item of listingFor("photographs")) {
    console.log(` • ${item.title}`);
    const doc = await buildPhotographSetDoc(item);
    await client.createOrReplace(doc);
  }

  // 6. Writings (11)
  console.log("\n→ writings");
  for (const item of listingFor("writings")) {
    console.log(` • ${item.title}`);
    const doc = buildWritingDoc(item);
    if (doc) await client.createOrReplace(doc);
  }

  // 7. Home picks (last — references depend on projects + writings existing)
  console.log("\n→ homePicks (singleton)");
  await client.createOrReplace(buildHomePicksDoc());
  console.log("  ✓");

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("\nMigration failed:", err);
  process.exit(1);
});
