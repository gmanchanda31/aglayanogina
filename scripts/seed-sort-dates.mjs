/**
 * Set `sortDate` on exhibitions whose month is recorded in Aglaya's CV
 * (artist doc → soloExhibitions / selectedExhibitions, e.g. "2024, June").
 *
 * Several exhibitions share a year, and the Year field is too coarse to
 * order them; the CV already says which month each opened. Nothing is
 * inferred beyond that: an exhibition is only dated when its CV row is
 * found, the row names a month, and the row's year appears in the
 * exhibition's own Year field. Everything else is reported and skipped.
 *
 * Dry run by default. Writes only with --apply, and only after saving
 * every document it will touch to --backup=<path> (required with --apply).
 * Idempotent — rows already carrying the same sortDate are skipped.
 * An open Studio draft of a dated exhibition gets the same field, so
 * publishing that draft later doesn't drop the date.
 *
 *   node --env-file=.env.local scripts/seed-sort-dates.mjs
 *   node --env-file=.env.local scripts/seed-sort-dates.mjs --apply --backup=/tmp/backup.json
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { createClient } from "@sanity/client";

const apply = process.argv.includes("--apply");
const backupPath = process.argv.find((a) => a.startsWith("--backup="))?.slice(9);
if (apply && !backupPath) {
  console.error("--apply needs --backup=<path>");
  process.exit(1);
}

const c = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "w6axlzhx",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  perspective: "raw",
});

/** Exhibition slug → the CV row that records it. */
const LINKS = [
  { slug: "lost-beauty", list: "soloExhibitions", match: /Lost Beauty.*KUT Gallery/ },
  { slug: "landscapes-of-memory", list: "soloExhibitions", match: /Landscapes of the memories.*Svitlo/ },
  { slug: "kyiv", list: "soloExhibitions", match: /Archipelago.*Portal 11/ },
  { slug: "archipelago-berlin", list: "soloExhibitions", match: /Archipelago.*Kunststudio 16/ },
  { slug: "memories-of-the-future", list: "selectedExhibitions", match: /Memories of the future.*Schönhausen/ },
  { slug: "aura-kunstraum-dusseldorf", list: "selectedExhibitions", match: /Aura Kunstraum/ },
  { slug: "schonhausen-palace-berlin", list: "selectedExhibitions", match: /Goldnarben.*Schönhausen/ },
];

const MONTHS = ["january", "february", "march", "april", "may", "june", "july",
  "august", "september", "october", "november", "december"];

function cvDate(year) {
  const y = year.match(/\b(19|20)\d{2}\b/)?.[0];
  const m = MONTHS.findIndex((name) => year.toLowerCase().includes(name));
  if (!y || m === -1) return null;
  return `${y}-${String(m + 1).padStart(2, "0")}-01`;
}

const artist = await c.fetch(`*[_id == "artist"][0]{ soloExhibitions, selectedExhibitions }`);
const exhibitions = await c.fetch(`*[_type == "exhibition" && !(_id in path("drafts.**"))]`);
const bySlug = new Map(exhibitions.map((d) => [d.slug?.current, d]));

const plan = [];
for (const link of LINKS) {
  const doc = bySlug.get(link.slug);
  const row = (artist?.[link.list] ?? []).find((r) => link.match.test(r.detail));
  const date = row ? cvDate(row.year) : null;
  const why =
    !doc ? "no exhibition with this slug"
    : !row ? `no CV row matching ${link.match}`
    : !date ? `CV row "${row.year}" has no month`
    : !String(doc.year ?? "").includes(date.slice(0, 4)) ? `CV year ${date.slice(0, 4)} not in exhibition year "${doc.year}"`
    : doc.sortDate === date ? "already set"
    : null;
  console.log(`${why ? "skip" : "set "}  ${link.slug.padEnd(28)} ${String(doc?.year ?? "—").padEnd(22)} ${date ?? "—"}  ${why ?? `← CV "${row.year}": ${row.detail.slice(0, 50)}`}`);
  if (!why) plan.push({ doc, date });
}

const undated = exhibitions.filter((d) => !d.sortDate && !plan.some((p) => p.doc._id === d._id));
for (const d of undated) console.log(`none  ${d.slug?.current.padEnd(28)} ${String(d.year ?? "—")}  (no CV month — leave for Aglaya)`);

if (!apply) {
  console.log(`\nDry run: ${plan.length} to set. Re-run with --apply --backup=<path> to write.`);
  process.exit(0);
}

const draftIds = plan.map((p) => `drafts.${p.doc._id}`);
const drafts = await c.fetch(`*[_id in $ids]`, { ids: draftIds });
const touched = [...plan.map((p) => p.doc), ...drafts];

mkdirSync(dirname(backupPath), { recursive: true });
writeFileSync(backupPath, JSON.stringify(touched, null, 2));
console.log(`\nBacked up ${touched.length} documents → ${backupPath}`);

const tx = c.transaction();
for (const { doc, date } of plan) {
  tx.patch(doc._id, (p) => p.set({ sortDate: date }));
  if (drafts.some((d) => d._id === `drafts.${doc._id}`)) {
    tx.patch(`drafts.${doc._id}`, (p) => p.set({ sortDate: date }));
  }
}
const res = await tx.commit();
console.log(`Set sortDate on ${touched.length} documents: ${touched.map((d) => d._id).join(", ")} (tx ${res.transactionId}).`);
