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
  getPhotographSet,
  getProject,
  homePicks,
  photographSets,
  portrait,
  siteTagline,
} from "./content";
import type { ImageRef, ProjectEntry, WritingEntry } from "./types";

/* -------------------------------------------------------------------------- */
/*                                 HERO                                       */
/* -------------------------------------------------------------------------- */

/** Hero italic line — comes from Sanity, may be empty. */
export const HERO_ITALIC: string = homePicks.heroItalic;

/** Hero tagline — comes from Sanity (with a sensible fallback). */
export const HERO_TAGLINE: string = homePicks.heroTagline;

/** Where the portrait was taken — shown under it until the Studio sets a caption. */
const PORTRAIT_FALLBACK_CAPTION = "In studio · Düsseldorf";

/** Studio portrait — Sanity-uploaded; falls back to the bundled studio shot. */
const portraitRef: ImageRef = portrait ?? {
  src: "/assets/home/home/001_a2f83c866258b1c4ae29ff098079fb6ef408549a.jpg",
  name: "studio-portrait.jpg",
  alt: "Aglaya Nogina in her Düsseldorf studio, in front of a large monochrome xerography print on textile",
  width: 1254,
  height: 1672,
};

export const HERO_PORTRAIT: ImageRef = {
  ...portraitRef,
  caption: portraitRef.caption ?? PORTRAIT_FALLBACK_CAPTION,
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

// The tile has always shown the black & white archive's first frame
const bwSet = getPhotographSet("b-w") ?? photographSets[0];

export const practiceTiles: PracticeTile[] = [
  { label: "Print",       href: "/projects",           image: tileImage(getProject("archipelago"),         "Print") },
  { label: "Painting",    href: "/projects",           image: tileImage(getProject("terra-memoria-mundi"), "Painting") },
  { label: "Ceramic",     href: "/projects/ceramic",   image: tileImage(getProject("ceramic"),             "Ceramic") },
  {
    label: "Photography",
    href: "/photographs",
    image: bwSet?.hero
      ? { ...bwSet.hero, alt: "Photography — black & white archive" }
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
 * Centered statement on the homepage — the real bio paragraphs from the
 * About page, kept separate so they read the way they were written.
 *
 * The intro paragraph is HERO_BIO: on desktop it sits beside the hero
 * portrait, so the statement only repeats it below lg (where the hero has
 * no room for it).
 */
export const STATEMENT_PARAGRAPHS: string[] = about.paragraphs.filter(Boolean);

/** Short bio — the artist doc's intro paragraph ("Aglaya Nogina was born…") */
export const HERO_BIO: string = about.intro;

/** Places line under the bio ("Luhansk → Kharkiv → Kyiv → Düsseldorf") */
export const HERO_META: string = siteTagline;

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
