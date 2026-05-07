export type Section =
  | "projects"
  | "exhibitions"
  | "illustrations"
  | "photographs"
  | "writings";

export interface ImageRef {
  /** Path relative to /public, e.g. "/assets/projects/archipelago/001_IMG_6239.jpeg" */
  src: string;
  /** Original filename, used for sort stability */
  name: string;
  /** Generated alt text */
  alt: string;
  /** Intrinsic width in pixels — read from the file at build time. */
  width: number;
  /** Intrinsic height in pixels — read from the file at build time. */
  height: number;
}

export interface BaseEntry {
  slug: string;
  /** Routing slug — may differ from raw scrape slug if we trimmed it */
  routeSlug: string;
  title: string;
  section: Section;
  href: string;
  /** First image, used for hero/thumbnail */
  hero?: ImageRef;
  /** All images in the order they appeared on the source page */
  images: ImageRef[];
}

/** A short metadata line displayed under a title — medium, dimensions, year, location, etc. */
export interface MetadataLine {
  /** Optional label like "MEDIUM", "YEAR", "DIMENSIONS" — undefined = no label */
  label?: string;
  value: string;
}

export interface Entry extends BaseEntry {
  /** Tight metadata lines (e.g., "Paper, textile, ink, xerography", "2024") */
  metadata: MetadataLine[];
  /** Long-form description paragraphs (post-metadata, pre-quote) */
  description: string[];
  /** Optional pull quote pulled from a paragraph that begins with curly opening quote */
  pullQuote?: string;
  /** Quote attribution line if separate (e.g., "— Aglaya") */
  quoteAttribution?: string;
}

export type ProjectKind =
  | "Print"
  | "Painting"
  | "Ceramic"
  | "Sculpture"
  | "Photography"
  | "Textile"
  | "Book";

export interface ProjectEntry extends Entry {
  section: "projects";
  /** Derived from medium / metadata — used by the projects filter */
  kinds: ProjectKind[];
}

export interface ExhibitionEntry extends Entry {
  section: "exhibitions";
}

export interface IllustrationEntry extends Entry {
  section: "illustrations";
}

export interface PhotographSet extends BaseEntry {
  section: "photographs";
  /** Photographs only have a title + images — no body */
}

export interface WritingEntry extends BaseEntry {
  section: "writings";
  /** Body paragraphs (excluding h1) */
  paragraphs: string[];
  /** First sentence/paragraph used as excerpt on listing */
  excerpt: string;
}

export interface CVRow {
  year: string;
  detail: string;
}

export interface About {
  intro: string;
  paragraphs: string[];
  cv: {
    education: CVRow[];
    publications: CVRow[];
    soloExhibitions: CVRow[];
    selectedExhibitions: CVRow[];
  };
}

export interface Home {
  hero?: ImageRef;
}

export interface Contact {
  email: string;
  emailHref: string;
  instagramHandle: string;
  instagramUrl: string;
  whatsappNumber: string;
  whatsappUrl: string;
  patreonUrl: string;
}
