/**
 * Home-page data picks. Centralised here so each home component can be a
 * pure presentational unit — no content decisions baked into JSX.
 *
 * Everything resolves at module load (build time). All sources live in
 * `lib/content.ts` so swapping a featured project is a one-line change here.
 */

import {
  getProject,
  getWriting,
  photographSets,
  projects,
} from "./content";
import type { ImageRef, ProjectEntry, WritingEntry } from "./types";

/* -------------------------------------------------------------------------- */
/*                                 HERO                                       */
/* -------------------------------------------------------------------------- */

export const HERO_ITALIC =
  "I work with memory, displacement, and the shape of friendship across distance.";

export const HERO_TAGLINE =
  "Ukrainian visual artist working in xerography, painting, ceramic, and writing. Lives in Düsseldorf.";

/**
 * Studio portrait — the only photo we have of Aglaya in front of her work.
 * Dimensions copied from the measured value in `data/image_plan.json`.
 */
export const HERO_PORTRAIT: ImageRef = {
  src: "/assets/home/home/001_a2f83c866258b1c4ae29ff098079fb6ef408549a.jpg",
  name: "studio-portrait.jpg",
  alt: "Aglaya Nogina in her Düsseldorf studio, in front of a large monochrome xerography print on textile",
  width: 1254,
  height: 1672,
};

/* -------------------------------------------------------------------------- */
/*                          PRACTICE RIBBON (5 tiles)                         */
/* -------------------------------------------------------------------------- */

export interface PracticeTile {
  label: string;
  href: string;
  /** When `image` is null, the tile renders as a special card. */
  image: ImageRef | null;
  /** Optional copy used in the card variant (writing tile). */
  cardLine?: string;
  cardSubline?: string;
}

function tileImage(project: ProjectEntry | undefined, label: string): ImageRef | null {
  if (!project?.hero) return null;
  return { ...project.hero, alt: `${label} — ${project.title}` };
}

export const practiceTiles: PracticeTile[] = [
  {
    label: "Print",
    href: "/projects",
    image: tileImage(getProject("archipelago"), "Print"),
  },
  {
    label: "Painting",
    href: "/projects",
    image: tileImage(getProject("terra-memoria-mundi"), "Painting"),
  },
  {
    label: "Ceramic",
    href: "/projects/ceramic",
    image: tileImage(getProject("ceramic"), "Ceramic"),
  },
  {
    label: "Photography",
    href: "/photographs",
    image: photographSets[0]?.hero
      ? { ...photographSets[0].hero, alt: "Photography — colour archive" }
      : null,
  },
  {
    // The 5th tile is a typographic card, not an image tile.
    label: "Writing",
    href: "/writings",
    image: null,
    cardLine: "Words on paper",
    cardSubline: "11 essays",
  },
];

/* -------------------------------------------------------------------------- */
/*                               STATEMENT                                    */
/* -------------------------------------------------------------------------- */

export const STATEMENT_PARAGRAPH =
  "Aglaya was born in Luhansk in 1996 and lived in Kharkiv and Kyiv. After the full-scale war began, she moved to Düsseldorf, where she currently lives and studies at the Kunstakademie. She works with graphic media — relief printing, xerography, engraving — alongside painting, photography, ceramics, textiles, and text. In her work, she explores self-identification, memory, emigration, and relationships during the war.";

/* -------------------------------------------------------------------------- */
/*                            FEATURED PROJECT                                */
/* -------------------------------------------------------------------------- */

export interface FeaturedProject {
  project: ProjectEntry;
  /** Optional one-line italic teaser sitting under the title. */
  teaser: string;
  /** Optional supplementary metadata not derivable from project.metadata. */
  exhibitionLine?: string;
}

const lostBeauty = getProject("lost-beauty");

export const featuredProject: FeaturedProject | null = lostBeauty
  ? {
      project: lostBeauty,
      teaser: "Beauty as a process of recovery after loss.",
      exhibitionLine: "KUT Gallery, Kyiv · October 2025",
    }
  : null;

/* -------------------------------------------------------------------------- */
/*                            SELECTED WORKS                                  */
/* -------------------------------------------------------------------------- */

const SELECTED_SLUGS = [
  "archipelago",
  "terra-memoria-mundi",
  "nest",
  "archipelago-book",
] as const;

export const selectedWorks: ProjectEntry[] = SELECTED_SLUGS
  .map((slug) => projects.find((p) => p.routeSlug === slug))
  .filter((p): p is ProjectEntry => p !== undefined);

/* -------------------------------------------------------------------------- */
/*                              JOURNAL PAIR                                  */
/* -------------------------------------------------------------------------- */

const JOURNAL_SLUGS = ["afterlife", "5-2-richard-bach-street"] as const;

export interface JournalPick {
  writing: WritingEntry;
  /** Single-sentence teaser used on the home card — keep ≤ 110 chars. */
  teaser: string;
}

const teasers: Record<string, string> = {
  afterlife:
    "Standing in line at the gates, chewing gum with the flavor of afterlife.",
  "5-2-richard-bach-street":
    "Returning to the Luhansk apartment that lives now only in dreams.",
};

export const journalPicks: JournalPick[] = JOURNAL_SLUGS
  .map((slug) => {
    const writing = getWriting(slug);
    if (!writing) return null;
    return { writing, teaser: teasers[slug] ?? writing.excerpt };
  })
  .filter((p): p is JournalPick => p !== null);
