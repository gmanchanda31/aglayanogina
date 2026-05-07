import parsedRaw from "@/_scrape/scripts/parsed.json";
import imagePlanRaw from "@/_scrape/scripts/image_plan.json";
import type {
  About,
  Contact,
  CVRow,
  Entry,
  ExhibitionEntry,
  Home,
  IllustrationEntry,
  ImageRef,
  MetadataLine,
  PhotographSet,
  ProjectEntry,
  ProjectKind,
  Section,
  WritingEntry,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                                Raw types                                   */
/* -------------------------------------------------------------------------- */

type Block =
  | [kind: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "blockquote", text: string]
  | [kind: "ul" | "ol", items: string[]]
  | [kind: "listing-item", text: string];

interface ParsedPage {
  file: string;
  title: string;
  blocks: Block[];
  images: string[];
  listing: Array<{ title: string; href: string | null; image: string | null }>;
}

interface PlanEntry {
  url: string;
  local: string;
  name: string;
}

const parsed = parsedRaw as unknown as ParsedPage[];
const imagePlan = imagePlanRaw as unknown as Record<string, PlanEntry[]>;

/* -------------------------------------------------------------------------- */
/*                                  Site data                                 */
/* -------------------------------------------------------------------------- */

export const contact: Contact = {
  email: "aglaya.nn.art@gmail.com",
  emailHref: "mailto:aglaya.nn.art@gmail.com",
  instagramHandle: "@aglaya.nn",
  instagramUrl: "https://www.instagram.com/aglaya.nn",
  whatsappNumber: "+49 175 6252702",
  whatsappUrl: "https://wa.me/491756252702",
  patreonUrl: "https://patreon.com/aglayann",
};

export const navSections: Array<{ title: string; href: string; section: Section }> = [
  { title: "Projects", href: "/projects", section: "projects" },
  { title: "Exhibitions", href: "/exhibitions", section: "exhibitions" },
  { title: "Illustrations", href: "/illustrations", section: "illustrations" },
  { title: "Photographs", href: "/photographs", section: "photographs" },
  { title: "Writings", href: "/writings", section: "writings" },
];

export const aboutNav = { title: "About", href: "/about" } as const;

export const siteName = "Aglaya Nogina";
export const siteCity = "Düsseldorf, Germany";
export const siteTagline =
  "Visual artist · Luhansk → Kyiv → Düsseldorf · b. 1996";

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const ZWJ = /‍/g;

function clean(text: string): string {
  return text.replace(ZWJ, "").trim();
}

/**
 * Some scraped metadata strings are accidentally glued from list items
 * (e.g. "SculpturesPerformancePhotographyGraphics"). Split them at
 * CamelCase boundaries so the UI can wrap them naturally.
 */
function splitCamelRuns(text: string): string {
  // Only act on long runs of letters with no spaces — leaves normal text alone.
  if (text.includes(" ") || text.length < 14) return text;
  return text.replace(/([a-z])([A-Z])/g, "$1 · $2");
}

/**
 * Trailing-hyphen slugs ("ceramic-", "vinyl-", "schmalgauzen-covers-")
 * are scrape artefacts. Trim them for routing.
 */
function normalizeRouteSlug(slug: string): string {
  return slug.replace(/-+$/, "");
}

function lookupPlan(section: string, slug: string): PlanEntry[] {
  return imagePlan[`${section}/${slug}`] ?? [];
}

/**
 * Map a single page's image URLs to local refs using image_plan.json,
 * in the original page order, falling back to the plan's order.
 */
function imagesFor(
  page: ParsedPage,
  section: string,
  slug: string,
  altPrefix: string,
  altContext?: string,
): ImageRef[] {
  const plan = lookupPlan(section, slug);
  if (plan.length === 0) return [];
  const byUrl = new Map(plan.map((p) => [p.url, p]));

  const ordered: PlanEntry[] = [];
  const seen = new Set<string>();
  for (const url of page.images) {
    const entry = byUrl.get(url);
    if (entry && !seen.has(entry.local)) {
      ordered.push(entry);
      seen.add(entry.local);
    }
  }
  // Append any plan entries that didn't match (defensive — shouldn't happen)
  for (const entry of plan) {
    if (!seen.has(entry.local)) {
      ordered.push(entry);
      seen.add(entry.local);
    }
  }

  return ordered.map((p, i) => ({
    src: `/${p.local}`, // image_plan stores "assets/..." → prepend "/"
    name: p.name,
    // Hero image (first one) gets the richer descriptor; subsequent images
    // include the index for screen-reader users navigating the gallery.
    alt:
      i === 0
        ? altContext
          ? `${altPrefix} — ${altContext}`
          : altPrefix
        : `${altPrefix}${altContext ? `, ${altContext}` : ""} (${i + 1})`,
  }));
}

/**
 * Pulls paragraphs out of blocks, dropping zero-width-only entries.
 * Unwraps listing-item / heading kinds where appropriate.
 */
function paragraphs(blocks: Block[]): string[] {
  const out: string[] = [];
  for (const block of blocks) {
    const [kind, val] = block;
    if (kind === "p" || kind === "blockquote") {
      const txt = clean(val as string);
      if (txt) out.push(txt);
    }
  }
  return out;
}

/**
 * Heuristic: short leading paragraphs (≤80 chars) are metadata
 * (medium / dimensions / year / location). Stop at the first long paragraph.
 */
function splitMetadataAndDescription(paras: string[]): {
  metadata: MetadataLine[];
  description: string[];
} {
  const metadata: MetadataLine[] = [];
  const description: string[] = [];
  let inDescription = false;
  for (const para of paras) {
    if (inDescription) {
      description.push(para);
      continue;
    }
    if (para.length <= 80 && !looksLikeQuote(para)) {
      metadata.push(labelMetadata(splitCamelRuns(para)));
    } else {
      inDescription = true;
      description.push(para);
    }
  }
  return { metadata, description };
}

const KNOWN_CITIES =
  /\b(Düsseldorf|Dusseldorf|Berlin|Kyiv|Lviv|Kharkiv|Cologne|Barcelona|Istanbul|Goa|Munich|Madrid|Paris|Rome|Vienna|Luhansk|Carpathians|Düssel|Germany|Ukraine|Spain|France|Italy|Turkey|India|USA|Austria|Netherlands|Poland)\b/i;

function labelMetadata(value: string): MetadataLine {
  const v = value.trim();
  // Year or year range: 2024 / 2023-2025 / 2023—2025
  if (/^(?:19|20)\d{2}\s*[-–—]?\s*(?:(?:19|20)\d{2}|ongoing)?$/.test(v)) {
    return { label: "Year", value: v };
  }
  // Explicit dimensions
  if (/^(size|dimensions|format)\s*[:\-]/i.test(v) || /\d+\s*[x×]\s*\d+/i.test(v)) {
    return { label: "Dimensions", value: v.replace(/^(size|dimensions|format)\s*[:\-]\s*/i, "") };
  }
  // Location
  if (KNOWN_CITIES.test(v)) {
    return { label: "Location", value: v };
  }
  // Default — first metadata line is usually the medium
  return { label: "Medium", value: v };
}

function looksLikeQuote(text: string): boolean {
  return /^[“"„«]/.test(text) || /[”"]\s*$/.test(text);
}

/**
 * Detect a paragraph that's primarily a quote (starts and ends with quotation marks)
 * and lift it as the entry's pullQuote.
 */
function extractPullQuote(description: string[]): {
  description: string[];
  pullQuote?: string;
  quoteAttribution?: string;
} {
  const remaining: string[] = [];
  let pullQuote: string | undefined;
  let quoteAttribution: string | undefined;

  for (let i = 0; i < description.length; i++) {
    const para = description[i];
    if (!pullQuote && looksLikeQuote(para) && para.length > 60) {
      pullQuote = para.replace(/^[“"„«]/, "").replace(/[”"»]\s*$/, "").trim();
      // Check next paragraph for attribution like "— Aglaya."
      const next = description[i + 1];
      if (next && /^[—–-]\s*\w/.test(next) && next.length < 60) {
        quoteAttribution = next.replace(/^[—–-]\s*/, "").replace(/\.$/, "").trim();
        i++;
      }
      continue;
    }
    remaining.push(para);
  }

  return { description: remaining, pullQuote, quoteAttribution };
}

/* -------------------------------------------------------------------------- */
/*                          Page lookups (memoised)                           */
/* -------------------------------------------------------------------------- */

const pageByPath = new Map<string, ParsedPage>();
for (const p of parsed) pageByPath.set(p.file, p);

function getPage(section: string, slug: string): ParsedPage | undefined {
  const path = section ? `_raw/${section}/${slug}.html` : `_raw/${slug}.html`;
  return pageByPath.get(path);
}

function listingFor(section: Section): Array<{
  title: string;
  rawSlug: string;
  routeSlug: string;
}> {
  const page = getPage("", section);
  if (!page) return [];
  return page.listing
    .filter((it) => it.href && it.title)
    .map((it) => {
      const rawSlug = (it.href as string).replace(/^\/[^/]+\//, "");
      return {
        title: clean(it.title),
        rawSlug,
        routeSlug: normalizeRouteSlug(rawSlug),
      };
    })
    .filter((it) => {
      // Drop the broken webflow.io writing slug
      return !it.rawSlug.includes("webflow-io");
    });
}

/* -------------------------------------------------------------------------- */
/*                              Entry builders                                */
/* -------------------------------------------------------------------------- */

function buildEntry<S extends Section>(
  section: S,
  rawSlug: string,
  routeSlug: string,
  listingTitle: string,
): (Entry & { section: S }) | null {
  const page = getPage(section, rawSlug);
  if (!page) return null;

  const title = listingTitle || clean(page.title);
  const allParas = paragraphs(page.blocks);
  const { metadata, description: rawDesc } = splitMetadataAndDescription(allParas);
  const { description, pullQuote, quoteAttribution } = extractPullQuote(rawDesc);

  const medium = metadata.find((m) => m.label === "Medium")?.value;
  const year = metadata.find((m) => m.label === "Year")?.value;
  const altContext = [medium, year].filter(Boolean).join(", ");
  const imgs = imagesFor(page, section, rawSlug, title, altContext || undefined);

  return {
    section,
    slug: rawSlug,
    routeSlug,
    title,
    href: `/${section}/${routeSlug}`,
    hero: imgs[0],
    images: imgs,
    metadata,
    description,
    pullQuote,
    quoteAttribution,
  };
}

function buildPhotographSet(
  rawSlug: string,
  routeSlug: string,
  listingTitle: string,
): PhotographSet | null {
  const page = getPage("photographs", rawSlug);
  if (!page) return null;
  const title = listingTitle || clean(page.title);
  const imgs = imagesFor(page, "photographs", rawSlug, title);
  return {
    section: "photographs",
    slug: rawSlug,
    routeSlug,
    title,
    href: `/photographs/${routeSlug}`,
    hero: imgs[0],
    images: imgs,
  };
}

function buildWriting(
  rawSlug: string,
  routeSlug: string,
  listingTitle: string,
): WritingEntry | null {
  const page = getPage("writings", rawSlug);
  if (!page) return null;
  const title = listingTitle || clean(page.title);
  const paras = paragraphs(page.blocks).filter(
    (p) => clean(p) && p !== title,
  );
  // Drop the leading h1 as plain p if the parser captured it
  const cleaned = paras[0] === title ? paras.slice(1) : paras;
  const excerpt = (cleaned[0] ?? "").slice(0, 200);
  return {
    section: "writings",
    slug: rawSlug,
    routeSlug,
    title,
    href: `/writings/${routeSlug}`,
    images: [],
    paragraphs: cleaned,
    excerpt,
  };
}

/* -------------------------------------------------------------------------- */
/*                                  Exports                                   */
/* -------------------------------------------------------------------------- */

/* Map a project's medium / metadata / slug onto the filter chip set */
const KIND_MATCHERS: Array<[ProjectKind, RegExp]> = [
  ["Print", /xerography|relief print|engrav|graphic|print|paper/i],
  ["Painting", /paint/i],
  ["Ceramic", /ceramic/i],
  ["Sculpture", /sculpt/i],
  ["Photography", /photograph/i],
  ["Textile", /textile|fabric/i],
  ["Book", /\bbook\b/i],
];

function deriveKinds(entry: Entry): ProjectKind[] {
  const haystack = [
    entry.title,
    entry.slug,
    ...entry.metadata.map((m) => m.value),
    entry.description.slice(0, 2).join(" "),
  ].join(" ");
  const found: ProjectKind[] = [];
  for (const [kind, re] of KIND_MATCHERS) {
    if (re.test(haystack)) found.push(kind);
  }
  return found;
}

export const projects: ProjectEntry[] = listingFor("projects")
  .map((it) => buildEntry("projects", it.rawSlug, it.routeSlug, it.title))
  .filter((e): e is Entry & { section: "projects" } => e !== null)
  .map((entry) => ({ ...entry, kinds: deriveKinds(entry) }) as ProjectEntry);

export const exhibitions: ExhibitionEntry[] = listingFor("exhibitions")
  .map((it) =>
    buildEntry("exhibitions", it.rawSlug, it.routeSlug, it.title) as ExhibitionEntry | null,
  )
  .filter((e): e is ExhibitionEntry => e !== null);

export const illustrations: IllustrationEntry[] = listingFor("illustrations")
  .map((it) =>
    buildEntry("illustrations", it.rawSlug, it.routeSlug, it.title) as IllustrationEntry | null,
  )
  .filter((e): e is IllustrationEntry => e !== null);

export const photographSets: PhotographSet[] = listingFor("photographs")
  .map((it) => buildPhotographSet(it.rawSlug, it.routeSlug, it.title))
  .filter((e): e is PhotographSet => e !== null);

export const writings: WritingEntry[] = listingFor("writings")
  .map((it) => buildWriting(it.rawSlug, it.routeSlug, it.title))
  .filter((e): e is WritingEntry => e !== null);

/* -------------------------------------------------------------------------- */
/*                                 Lookups                                    */
/* -------------------------------------------------------------------------- */

export function getProject(slug: string) {
  return projects.find((p) => p.routeSlug === slug);
}
export function getExhibition(slug: string) {
  return exhibitions.find((e) => e.routeSlug === slug);
}
export function getIllustration(slug: string) {
  return illustrations.find((e) => e.routeSlug === slug);
}
export function getPhotographSet(slug: string) {
  return photographSets.find((e) => e.routeSlug === slug);
}
export function getWriting(slug: string) {
  return writings.find((e) => e.routeSlug === slug);
}

/* -------------------------------------------------------------------------- */
/*                                  Home                                      */
/* -------------------------------------------------------------------------- */

export const home: Home = (() => {
  const page = getPage("", "home");
  if (!page) return {};
  const plan = imagePlan["/home"] ?? [];
  if (plan.length === 0) return {};
  return {
    hero: {
      src: `/${plan[0].local}`,
      name: plan[0].name,
      alt: "Aglaya Nogina at work — featured artwork",
    },
  };
})();

/* -------------------------------------------------------------------------- */
/*                                  About                                     */
/* -------------------------------------------------------------------------- */

const CV_HEADERS = [
  "EDUCATION",
  "PUBLICATIONS",
  "SOLO EXHIBITIONS",
  "SELECTED EXHIBITIONS",
  "BIO",
] as const;

type CVHeader = (typeof CV_HEADERS)[number];

function parseCV(): About {
  const page = getPage("", "about");
  if (!page) {
    return {
      intro: "",
      paragraphs: [],
      cv: { education: [], publications: [], soloExhibitions: [], selectedExhibitions: [] },
    };
  }

  // CV section headers may arrive as h5/h6 (e.g., EDUCATION) or as plain
  // paragraphs whose text is the all-caps section title (PUBLICATIONS, SOLO
  // EXHIBITIONS, etc.). Capture both kinds, in order.
  const paras: string[] = [];
  for (const block of page.blocks) {
    const [kind, val] = block;
    if (kind === "p" || kind === "blockquote" || kind === "h2" || kind === "h3" || kind === "h4" || kind === "h5" || kind === "h6") {
      const txt = clean(val as string);
      if (txt) paras.push(txt);
    }
  }

  const sections: Record<CVHeader, string[]> = {
    EDUCATION: [],
    PUBLICATIONS: [],
    "SOLO EXHIBITIONS": [],
    "SELECTED EXHIBITIONS": [],
    BIO: [],
  };

  let current: CVHeader | null = null;
  for (const para of paras) {
    const upper = para.toUpperCase();
    const match = CV_HEADERS.find((h) => upper === h || upper.startsWith(h));
    if (match) {
      current = match;
      continue;
    }
    if (current) sections[current].push(para);
  }

  // Education comes as alternating year-line + entry-line pairs OR combined lines
  const education = pairCV(sections.EDUCATION);
  const publications = pairCV(sections.PUBLICATIONS);
  const soloExhibitions = parseDashCV(sections["SOLO EXHIBITIONS"]);
  const selectedExhibitions = parseDashCV(sections["SELECTED EXHIBITIONS"]);

  const bio = sections.BIO;
  const intro = bio[0] ?? "";
  const restParas = bio.slice(1);

  return {
    intro,
    paragraphs: restParas,
    cv: { education, publications, soloExhibitions, selectedExhibitions },
  };
}

/**
 * For sections like Education that arrive as alternating "2013 - 2017" / "Kharkiv Art College"
 * or some combined "2018 - 2022 Kyiv National Academy of Fine Arts and Architecture".
 */
function pairCV(lines: string[]): CVRow[] {
  const rows: CVRow[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const yearMatch = line.match(/^((?:19|20)\d{2}(?:\s*[-–—]\s*(?:(?:19|20)?\d{2,4}|ongoing))?)/);
    if (yearMatch && line === yearMatch[0]) {
      // Year on its own line — pair with next
      const next = lines[i + 1];
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
    } else {
      // Continuation paragraph — append to previous row's detail
      if (rows.length > 0) {
        rows[rows.length - 1].detail += ` ${line}`;
      } else {
        rows.push({ year: "", detail: line });
      }
    }
    i++;
  }
  return rows;
}

/**
 * For exhibitions sections: lines like "2025, October – \"Lost beauty\", curated by Daria Zhuravel at KUT Gallery, Kyiv"
 * Year is everything before the first em-dash / en-dash / hyphen separator.
 */
function parseDashCV(lines: string[]): CVRow[] {
  const rows: CVRow[] = [];
  for (const line of lines) {
    const match = line.match(/^([^—–-]+?)\s*[—–-]\s*(.+)$/);
    if (match) {
      rows.push({ year: match[1].trim(), detail: match[2].trim() });
    } else {
      rows.push({ year: "", detail: line });
    }
  }
  return rows;
}

export const about: About = parseCV();
