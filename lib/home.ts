/**
 * Thin home-page data layer. All dynamic content (hero italic, featured
 * project, selected works, journal picks, statement paragraph, portrait)
 * comes from Sanity via lib/content.ts. The only thing static here is
 * the practice ribbon — that's route configuration, not content.
 *
 * Invented strings that lived in this file before (the homepage hero
 * italic, journal teasers, featured-project teaser) are removed. Aglaya
 * fills those in studio; components hide the line gracefully when empty.
 */

import {
  about,
  getProject,
  homePicks,
  photographSets,
  portrait,
} from "./content";
import type { ImageRef, ProjectEntry, WritingEntry } from "./types";

/* -------------------------------------------------------------------------- */
/*                                 HERO                                       */
/* -------------------------------------------------------------------------- */

/** Hero italic line — comes from Sanity, may be empty. */
export const HERO_ITALIC: string = homePicks.heroItalic;

/** Hero tagline — comes from Sanity (with a sensible fallback). */
export const HERO_TAGLINE: string = homePicks.heroTagline;

/** Studio portrait — Sanity-uploaded; falls back to the bundled studio shot. */
export const HERO_PORTRAIT: ImageRef = portrait ?? {
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
  /** When `image` is null, the tile renders as a special typographic card. */
  image: ImageRef | null;
  cardLine?: string;
  cardSubline?: string;
}

function tileImage(project: ProjectEntry | undefined, label: string): ImageRef | null {
  if (!project?.hero) return null;
  return { ...project.hero, alt: `${label} — ${project.title}` };
}

export const practiceTiles: PracticeTile[] = [
  { label: "Print",       href: "/projects",           image: tileImage(getProject("archipelago"),         "Print") },
  { label: "Painting",    href: "/projects",           image: tileImage(getProject("terra-memoria-mundi"), "Painting") },
  { label: "Ceramic",     href: "/projects/ceramic",   image: tileImage(getProject("ceramic"),             "Ceramic") },
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

/**
 * Centered statement on the homepage. Built from the artist's real bio:
 * intro paragraph + the body paragraphs joined.
 */
export const STATEMENT_PARAGRAPH: string = (() => {
  const parts = [about.intro, ...about.paragraphs].filter(Boolean);
  return parts.join(" ");
})();

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

export const featuredProject: FeaturedProject | null = homePicks.featuredProject
  ? {
      project: homePicks.featuredProject,
      teaser: homePicks.featuredTeaser,
      exhibitionLine: homePicks.featuredExhibitionLine,
    }
  : null;

/* -------------------------------------------------------------------------- */
/*                            SELECTED WORKS                                  */
/* -------------------------------------------------------------------------- */

export const selectedWorks: ProjectEntry[] = homePicks.selectedWorks;

/* -------------------------------------------------------------------------- */
/*                              JOURNAL PAIR                                  */
/* -------------------------------------------------------------------------- */

export interface JournalPick {
  writing: WritingEntry;
  /** Single-sentence teaser used on the home card. */
  teaser: string;
}

export const journalPicks: JournalPick[] = homePicks.journalPicks;
