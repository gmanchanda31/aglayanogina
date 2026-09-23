/**
 * Server-only typed content layer.
 *
 * Fetches everything from Sanity at module load time using top-level await.
 * Public exports (`projects`, `exhibitions`, `getProject`, etc.) keep the
 * synchronous shape pages have always used — pages don't need to be async.
 *
 * Static constants (siteName, navSections, contact, aboutNav) live in
 * lib/site-config.ts because client components can't import top-level-await
 * modules. They're re-exported from here for any server-side caller that
 * already imports from "@/lib/content".
 *
 * Writings still come from data/parsed.json + content/writings/*.mdx in
 * Phase 3a; Phase 3b swaps them to PortableText from Sanity.
 */

import { sanityClient, urlFor } from "./sanity-client";
import {
  ARTIST_QUERY,
  EXHIBITIONS_QUERY,
  HOME_PICKS_QUERY,
  ILLUSTRATIONS_QUERY,
  PHOTOGRAPH_SETS_QUERY,
  PROJECTS_QUERY,
  SECTION_PAGES_QUERY,
  WRITINGS_QUERY,
} from "./sanity-queries";
import type {
  About,
  Contact,
  CVRow,
  ExhibitionEntry,
  Home,
  IllustrationEntry,
  ImageRef,
  MetadataLine,
  PhotographSet,
  ProjectEntry,
  ProjectKind,
  Section,
  SectionPage,
  WritingEntry,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                       Re-exports of static config                          */
/* -------------------------------------------------------------------------- */

export {
  aboutNav,
  contact,
  navSections,
  siteName,
} from "./site-config";

/* -------------------------------------------------------------------------- */
/*                            Raw Sanity types                                */
/* -------------------------------------------------------------------------- */

/** Fractional insets (0-1) set by the Studio's "Edit hotspot and crop" tool. */
interface SanityCrop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface SanityHotspot {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SanityImage {
  alt?: string;
  caption?: string;
  asset?: { _ref: string; _type: "reference" } | null;
  hotspot?: SanityHotspot | null;
  crop?: SanityCrop | null;
  /** Uncropped original URL — fallback only; prefer the urlFor() build. */
  src: string | null;
  /** Intrinsic dimensions of the original asset, before any crop. */
  width: number | null;
  height: number | null;
}

interface PortableSpan {
  _type: "span";
  text: string;
  marks?: string[];
}

interface PortableBlock {
  _type: "block";
  style?: string;
  children?: PortableSpan[];
}

interface PortablePullQuote {
  _type: "pullQuote";
  text: string;
  attribution?: string;
}

type PortableNode = PortableBlock | PortablePullQuote;

interface SanityEntryDoc {
  _id: string;
  title: string;
  slug: string;
  year?: string;
  medium?: string;
  location?: string;
  dimensions?: string;
  hero?: SanityImage;
  gallery?: SanityImage[];
  description?: PortableNode[];
  kinds?: ProjectKind[];
  // Exhibition extras
  kind?: "Solo" | "Group";
  venue?: string;
  city?: string;
  curator?: string;
  // Illustration extras
  client?: string;
}

interface SanityArtistDoc {
  name?: string;
  tagline?: string;
  intro?: string;
  paragraphs?: string[];
  city?: string;
  email?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  patreonUrl?: string;
  portrait?: SanityImage;
  education?: CVRow[];
  publications?: CVRow[];
  soloExhibitions?: CVRow[];
  selectedExhibitions?: CVRow[];
}

interface SanityHomePicksDoc {
  heroItalic?: string;
  heroTagline?: string;
  featuredTeaser?: string;
  featuredExhibitionLine?: string;
  featuredProject?: { _id: string; title: string; slug: string };
  selectedWorks?: Array<{ _id: string; title: string; slug: string }>;
  journalPicks?: Array<{
    teaser?: string;
    writing?: { _id: string; title: string; slug: string };
  }>;
}

interface SanityPhotographSetDoc {
  _id: string;
  title: string;
  slug: string;
  blurb?: string;
  images?: SanityImage[];
}

interface SanitySectionPageDoc {
  section?: Section;
  eyebrow?: string;
  title?: string;
  intro?: string;
  metaDescription?: string;
}

interface SanityWritingDoc {
  _id: string;
  title: string;
  slug: string;
  year?: string;
  excerpt?: string;
  body?: PortableNode[];
}

/* -------------------------------------------------------------------------- */
/*                                Helpers                                     */
/* -------------------------------------------------------------------------- */

function normalizeSlug(slug: string): string {
  return slug.replace(/-+$/, "");
}

/**
 * Dimensions of the image *after* the Studio crop is applied.
 *
 * Mirrors the rounding @sanity/image-url uses to build the `rect=` param, so
 * the width/height we hand <Image> match the bytes the CDN actually returns.
 */
function croppedDimensions(
  width: number,
  height: number,
  crop: SanityCrop | null | undefined,
): { width: number; height: number } {
  if (!crop) return { width, height };
  const left = Math.round(crop.left * width);
  const top = Math.round(crop.top * height);
  return {
    width: Math.max(1, Math.round(width - crop.right * width - left)),
    height: Math.max(1, Math.round(height - crop.bottom * height - top)),
  };
}

/** Filename for sort stability — strips the `?rect=…` the crop adds. */
function fileNameFromSrc(src: string): string {
  return src.split("?")[0].split("/").pop() ?? "image";
}

function toImageRef(img: SanityImage | undefined, fallbackAlt: string): ImageRef | undefined {
  if (!img?.width || !img.height) return undefined;

  // Build through urlFor() so hotspot/crop reach the CDN. With no explicit
  // size the builder emits only `rect=`, i.e. the crop at its natural
  // proportions — no forced aspect ratio.
  const src = img.asset?._ref
    ? urlFor({
        asset: img.asset,
        ...(img.hotspot ? { hotspot: img.hotspot } : {}),
        ...(img.crop ? { crop: img.crop } : {}),
      }).url()
    : img.src;
  if (!src) return undefined;

  const { width, height } = croppedDimensions(img.width, img.height, img.crop);

  return {
    src,
    name: fileNameFromSrc(src),
    alt: img.alt || fallbackAlt,
    width,
    height,
  };
}

function toImageRefArray(
  imgs: SanityImage[] | undefined,
  altPrefix: string,
): ImageRef[] {
  if (!imgs) return [];
  return imgs
    .map((img, i) => toImageRef(img, `${altPrefix} (${i + 1})`))
    .filter((ref): ref is ImageRef => ref !== undefined);
}

/** Extract plain-text paragraphs from PortableText. Pull quotes lifted separately. */
function extractDescription(body: PortableNode[] | undefined): {
  description: string[];
  pullQuote?: string;
  quoteAttribution?: string;
} {
  if (!body) return { description: [] };

  const description: string[] = [];
  let pullQuote: string | undefined;
  let quoteAttribution: string | undefined;

  for (const node of body) {
    if (node._type === "pullQuote") {
      if (!pullQuote) {
        pullQuote = node.text;
        quoteAttribution = node.attribution;
      }
      continue;
    }
    if (node._type === "block") {
      const text = (node.children ?? [])
        .map((c) => c.text)
        .join("")
        .trim();
      if (text) description.push(text);
    }
  }

  return { description, pullQuote, quoteAttribution };
}

function buildMetadata(doc: SanityEntryDoc): MetadataLine[] {
  const lines: MetadataLine[] = [];
  if (doc.medium) lines.push({ label: "Medium", value: doc.medium });
  if (doc.year) lines.push({ label: "Year", value: doc.year });
  if (doc.dimensions) lines.push({ label: "Dimensions", value: doc.dimensions });
  if (doc.location) lines.push({ label: "Location", value: doc.location });
  return lines;
}

/* -------------------------------------------------------------------------- */
/*                          Fetch + transform                                 */
/* -------------------------------------------------------------------------- */

const [
  artistDoc,
  homePicksDoc,
  projectsDocs,
  exhibitionsDocs,
  illustrationsDocs,
  photographSetsDocs,
  writingsDocs,
  sectionPageDocs,
] = await Promise.all([
  sanityClient.fetch<SanityArtistDoc | null>(ARTIST_QUERY),
  sanityClient.fetch<SanityHomePicksDoc | null>(HOME_PICKS_QUERY),
  sanityClient.fetch<SanityEntryDoc[]>(PROJECTS_QUERY),
  sanityClient.fetch<SanityEntryDoc[]>(EXHIBITIONS_QUERY),
  sanityClient.fetch<SanityEntryDoc[]>(ILLUSTRATIONS_QUERY),
  sanityClient.fetch<SanityPhotographSetDoc[]>(PHOTOGRAPH_SETS_QUERY),
  sanityClient.fetch<SanityWritingDoc[]>(WRITINGS_QUERY),
  sanityClient.fetch<SanitySectionPageDoc[]>(SECTION_PAGES_QUERY),
]);

/* -------------------------------------------------------------------------- */
/*                         Public dynamic exports                             */
/* -------------------------------------------------------------------------- */

export const siteCity = artistDoc?.city ?? "Düsseldorf, Germany";
export const siteTagline = artistDoc?.tagline ?? "";

function buildEntry<S extends "projects" | "exhibitions" | "illustrations">(
  section: S,
  doc: SanityEntryDoc,
) {
  const slug = doc.slug;
  const routeSlug = normalizeSlug(slug);
  const altContext = [doc.medium, doc.year].filter(Boolean).join(", ");
  const hero = toImageRef(doc.hero, altContext ? `${doc.title} — ${altContext}` : doc.title);
  const gallery = toImageRefArray(doc.gallery, `${doc.title}${altContext ? `, ${altContext}` : ""}`);
  const { description, pullQuote, quoteAttribution } = extractDescription(doc.description);

  return {
    section,
    slug,
    routeSlug,
    title: doc.title,
    href: `/${section}/${routeSlug}`,
    hero,
    images: hero ? [hero, ...gallery] : gallery,
    metadata: buildMetadata(doc),
    description,
    pullQuote,
    quoteAttribution,
  };
}

export const projects: ProjectEntry[] = projectsDocs.map((doc) => ({
  ...buildEntry("projects", doc),
  kinds: doc.kinds ?? [],
}));

export const exhibitions: ExhibitionEntry[] = exhibitionsDocs.map((doc) => {
  const base = buildEntry("exhibitions", doc);
  // Fold venue/city/curator into the metadata stack
  const metadata = [...base.metadata];
  if (doc.venue) metadata.push({ label: "Venue", value: doc.venue });
  if (doc.city) metadata.push({ label: "City", value: doc.city });
  if (doc.curator) metadata.push({ label: "Curator", value: doc.curator });
  return { ...base, metadata } as ExhibitionEntry;
});

export const illustrations: IllustrationEntry[] = illustrationsDocs.map((doc) => {
  const base = buildEntry("illustrations", doc);
  const metadata = [...base.metadata];
  if (doc.client) metadata.push({ label: "Client", value: doc.client });
  return { ...base, metadata } as IllustrationEntry;
});

export const photographSets: PhotographSet[] = photographSetsDocs.map((doc) => {
  const slug = doc.slug;
  const routeSlug = normalizeSlug(slug);
  const images = toImageRefArray(doc.images, doc.title);
  return {
    section: "photographs",
    slug,
    routeSlug,
    title: doc.title,
    href: `/photographs/${routeSlug}`,
    hero: images[0],
    images,
  };
});

/* -------------------------------------------------------------------------- */
/*                              Lookups                                       */
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

/* -------------------------------------------------------------------------- */
/*                            Listing page copy                               */
/* -------------------------------------------------------------------------- */

const sectionPagesBySection = new Map<Section, SanitySectionPageDoc>(
  sectionPageDocs
    .filter((doc): doc is SanitySectionPageDoc & { section: Section } =>
      Boolean(doc.section),
    )
    .map((doc) => [doc.section, doc]),
);

/** Trimmed value, or undefined when the field is empty in the Studio. */
function filled(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Header copy for a listing page, read from its `sectionPage` document with
 * the page's own strings as fallbacks. Every field falls back independently,
 * so an empty eyebrow in the Studio restores the computed "N works · …" line
 * while the edited title and intro still apply.
 */
export function getSectionPage(
  section: Section,
  fallback: Omit<SectionPage, "section">,
): SectionPage {
  const doc = sectionPagesBySection.get(section);
  const intro = filled(doc?.intro) ?? fallback.intro;
  return {
    section,
    eyebrow: filled(doc?.eyebrow) ?? fallback.eyebrow,
    title: filled(doc?.title) ?? fallback.title,
    intro,
    metaDescription:
      filled(doc?.metaDescription) ?? intro ?? fallback.metaDescription,
  };
}

/* -------------------------------------------------------------------------- */
/*                                 About                                      */
/* -------------------------------------------------------------------------- */

export const about: About = {
  intro: artistDoc?.intro ?? "",
  paragraphs: artistDoc?.paragraphs ?? [],
  cv: {
    education: artistDoc?.education ?? [],
    publications: artistDoc?.publications ?? [],
    soloExhibitions: artistDoc?.soloExhibitions ?? [],
    selectedExhibitions: artistDoc?.selectedExhibitions ?? [],
  },
};

/**
 * Studio portrait. Lives on the artist doc; falls back to the static
 * file we shipped before the migration if the doc is missing.
 */
export const portrait: ImageRef | undefined = toImageRef(
  artistDoc?.portrait,
  `${artistDoc?.name ?? "Aglaya Nogina"} in studio`,
);

/**
 * Live contact info from the artist doc, if present. Pages prefer this
 * over the static `contact` re-exported above. Footer + studio CTAs use it.
 */
export const liveContact: Partial<Contact> = {
  email: artistDoc?.email,
  emailHref: artistDoc?.email ? `mailto:${artistDoc.email}` : undefined,
  instagramUrl: artistDoc?.instagramUrl,
  whatsappUrl: artistDoc?.whatsappUrl,
  patreonUrl: artistDoc?.patreonUrl,
};

/* -------------------------------------------------------------------------- */
/*                                  Home                                      */
/* -------------------------------------------------------------------------- */

export const home: Home = (() => {
  const portraitImage = portrait;
  if (!portraitImage) return {};
  return { hero: portraitImage };
})();

/* -------------------------------------------------------------------------- */
/*                                 Writings                                   */
/* -------------------------------------------------------------------------- */

/** Flatten PortableText body to plain paragraphs (used for excerpts/fallbacks). */
function bodyToParagraphs(body: PortableNode[] | undefined): string[] {
  if (!body) return [];
  const out: string[] = [];
  for (const node of body) {
    if (node._type === "block") {
      const text = (node.children ?? []).map((c) => c.text).join("").trim();
      if (text) out.push(text);
    } else if (node._type === "pullQuote") {
      out.push(node.text);
    }
  }
  return out;
}

export const writings: WritingEntry[] = writingsDocs.map((doc) => {
  const paragraphs = bodyToParagraphs(doc.body);
  const slug = doc.slug;
  const routeSlug = normalizeSlug(slug);
  return {
    section: "writings",
    slug,
    routeSlug,
    title: doc.title,
    href: `/writings/${routeSlug}`,
    images: [],
    paragraphs,
    excerpt: doc.excerpt ?? paragraphs[0]?.slice(0, 200) ?? "",
    body: (doc.body ?? []) as unknown[],
    year: doc.year,
  };
});

export function getWriting(slug: string) {
  return writings.find((w) => w.routeSlug === slug);
}

/* -------------------------------------------------------------------------- */
/*                              Home picks                                    */
/* -------------------------------------------------------------------------- */

/**
 * Studio-driven homepage selections. Each ref expanded to the resolved
 * project / writing entry so home components don't need to fetch separately.
 *
 * Falls back gracefully when fields are empty in Sanity.
 */
export interface HomePicks {
  heroItalic: string;
  heroTagline: string;
  featuredProject?: ProjectEntry;
  featuredTeaser: string;
  featuredExhibitionLine?: string;
  selectedWorks: ProjectEntry[];
  journalPicks: Array<{ writing: WritingEntry; teaser: string }>;
}

export const homePicks: HomePicks = (() => {
  const featuredSlug = homePicksDoc?.featuredProject
    ? normalizeSlug(homePicksDoc.featuredProject.slug)
    : undefined;
  const featuredProject = featuredSlug ? getProject(featuredSlug) : undefined;

  const selectedWorks = (homePicksDoc?.selectedWorks ?? [])
    .map((ref) => getProject(normalizeSlug(ref.slug)))
    .filter((p): p is ProjectEntry => p !== undefined);

  const journalPicks = (homePicksDoc?.journalPicks ?? [])
    .map((pick) => {
      if (!pick.writing) return null;
      const writing = getWriting(normalizeSlug(pick.writing.slug));
      if (!writing) return null;
      const teaser = pick.teaser?.trim() || writing.excerpt;
      return { writing, teaser };
    })
    .filter(
      (p): p is { writing: WritingEntry; teaser: string } => p !== null,
    );

  return {
    heroItalic: homePicksDoc?.heroItalic ?? "",
    heroTagline: homePicksDoc?.heroTagline ?? "",
    featuredProject,
    featuredTeaser: homePicksDoc?.featuredTeaser ?? "",
    featuredExhibitionLine: homePicksDoc?.featuredExhibitionLine,
    selectedWorks,
    journalPicks,
  };
})();
