/**
 * Content audit — compare strings rendered on the new site against the
 * paragraphs scraped from aglayanogina.com (data/parsed.json).
 *
 * For each route, list:
 *   • Strings on the new page that DO appear in the old site (good)
 *   • Strings on the new page that do NOT appear in the old site (flagged)
 *
 * Ignored: navigation links, breadcrumbs, button labels, section headings,
 * year/medium metadata. We focus on prose — bio, descriptions, essays,
 * pull quotes, captions.
 *
 * Usage: node scripts/content-audit.mjs
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const parsed = JSON.parse(readFileSync("./data/parsed.json", "utf8"));

// All paragraph text from the old site, lowercased + normalised for comparison
const oldStrings = new Set();
for (const page of parsed) {
  for (const [kind, val] of page.blocks) {
    if (kind === "p" || kind === "h1" || kind === "blockquote") {
      const s = (val ?? "").toString().replace(/[‍\s]+/g, " ").trim();
      if (s.length >= 12) oldStrings.add(s.toLowerCase());
    }
  }
  for (const item of page.listing ?? []) {
    if (item?.title) oldStrings.add(item.title.toLowerCase());
  }
}

// Ignore patterns — UX chrome, not content
const IGNORE = [
  /^aglaya nogina$/i,
  /^projects?$/i,
  /^exhibitions?$/i,
  /^illustrations?$/i,
  /^photographs?$/i,
  /^writings?$/i,
  /^about$/i,
  /^support$/i,
  /^menu$|^close$/i,
  /^view( the| selected)? works?$/i,
  /^read( the)? writings?$/i,
  /^read essay$/i,
  /^all (writings|projects|archives)$/i,
  /^more (writings|about aglaya)/i,
  /^join the diary$/i,
  /^read the art diary on patreon$/i,
  /^support on patreon$/i,
  /^continue with google$/i,
  /^skip to content$/i,
  /^the practice$/i,
  /^currently on view$/i,
  /^selected works$/i,
  /^from the journal$/i,
  /^studio support$/i,
  /^connect$|^studio$|^location$|^archive$|^contact$/i,
  /^next$|^previous$|^read$/i,
  /^email$|^instagram$|^whatsapp$/i,
  /^words on paper$/i,
  /^essay$/i,
  /^visual artist · luhansk → kyiv → düsseldorf · b\. 1996$/i,
  /^[a-z]+$/i, // single words
  /^©|^aglayanogina\.art$|^view archive$|^all photographs?$/i,
  /^\d+ photographs?( · \d+ archives?)?$/i,
  /^\d+ works? · \d+ — \d+$/i, // eyebrows like "8 works · 2021 — 2025"
  /^\d+ shows? · \d+ — \d+$/i,
  /^\d+ series$/i,
  /^\d+ essays$/i,
  /^\d+ photographs · \d+ archives$/i,
  /^archive \d{2}$/i,
  /^medium|^year|^years|^location|^dimensions|^exhibition|^client|^venue|^city|^curator/i,
  /^publications?$/i,
  /^education$|^solo exhibitions?$|^selected exhibitions?$/i,
  /^black & white$|^colour$|^turkey$|^india$/i,
];

function isChrome(text) {
  return IGNORE.some((re) => re.test(text));
}

const ROUTES = [
  "/",
  "/about",
  "/projects",
  "/projects/archipelago",
  "/projects/lost-beauty",
  "/projects/nest",
  "/projects/terra-memoria-mundi",
  "/projects/archipelago-book",
  "/projects/archive-of-dreams",
  "/projects/ceramic",
  "/projects/invisibility",
  "/exhibitions",
  "/exhibitions/lost-beauty",
  "/exhibitions/landscapes-of-memory",
  "/exhibitions/memories-of-the-future",
  "/exhibitions/schonhausen-palace-berlin",
  "/exhibitions/aura-kunstraum-dusseldorf",
  "/exhibitions/archipelago-berlin",
  "/exhibitions/archipelago-dusseldorf",
  "/exhibitions/carpathians",
  "/exhibitions/kyiv",
  "/illustrations",
  "/illustrations/the-eustomes",
  "/illustrations/schmalgauzen-covers",
  "/illustrations/the-winter-sea",
  "/illustrations/vinyl",
  "/illustrations/illustrations-for-the-album-garden-of-loving-lilies",
  "/photographs",
  "/photographs/colour",
  "/photographs/b-w",
  "/photographs/turkey",
  "/photographs/india",
  "/writings",
  "/writings/afterlife",
  "/writings/botanical-bridge",
  "/writings/5-2-richard-bach-street",
  "/writings/3-stories-about-love",
  "/writings/instruction",
  "/writings/nest",
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const flagged = []; // strings on new pages not found in old
const routeBuckets = new Map();

for (const route of ROUTES) {
  try {
    await page.goto(`http://localhost:3331${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
  } catch (e) {
    console.error(`✗ ${route} — ${e.message}`);
    continue;
  }

  // Strings rendered on this route — paragraphs + headings + blockquotes
  const strings = await page.evaluate(() => {
    const out = [];
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    for (const el of document.querySelectorAll("p, h1, h2, h3, h4, blockquote")) {
      if (!visible(el)) continue;
      const text = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
      if (text.length >= 12) out.push(text);
    }
    return [...new Set(out)];
  });

  const newOnPage = strings.filter((s) => {
    if (isChrome(s)) return false;
    return !oldStrings.has(s.toLowerCase());
  });

  routeBuckets.set(route, newOnPage);
  for (const s of newOnPage) flagged.push({ route, text: s });
}

await browser.close();

// Build the report
const lines = [];
lines.push("# Content audit\n");
lines.push(
  `Compared every paragraph rendered on \`localhost:3331\` (the new site) `
  + `against \`data/parsed.json\` (every paragraph from aglayanogina.com).\n`,
);
lines.push(`**Routes audited:** ${ROUTES.length}`);
lines.push(`**Strings flagged as not in old site:** ${flagged.length}\n`);
lines.push("UX chrome (button labels, breadcrumbs, section headings, error pages) is auto-ignored.\n");
lines.push("---\n");

for (const route of ROUTES) {
  const items = routeBuckets.get(route) ?? [];
  if (items.length === 0) {
    lines.push(`### ✓ \`${route}\`  *(all content matches)*\n`);
  } else {
    lines.push(`### ✗ \`${route}\`  — ${items.length} flagged string(s)\n`);
    for (const text of items) {
      lines.push(`- ${text.length > 200 ? text.slice(0, 200) + "…" : text}`);
    }
    lines.push("");
  }
}

writeFileSync("./AUDIT.md", lines.join("\n"));
console.log(`\n${flagged.length} flagged strings written to AUDIT.md`);
