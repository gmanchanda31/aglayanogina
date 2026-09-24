/**
 * Thin home-page data layer. The home is one work on the wall, an index of
 * every project, and one closing line — all from Sanity via lib/content.ts.
 * Components hide a line gracefully when its Studio field is empty.
 *
 * The studio portrait lives here too: /about and the root OG image use it.
 */

import { homePicks, portrait, projects, siteTagline } from "./content";
import type { ImageRef, ProjectEntry } from "./types";

/* -------------------------------------------------------------------------- */
/*                                 HERO                                       */
/* -------------------------------------------------------------------------- */

/** Closing line, first half — comes from Sanity, may be empty. */
export const HERO_ITALIC: string = homePicks.heroItalic;

/** Closing line, second half — comes from Sanity, may be empty. */
export const HERO_TAGLINE: string = homePicks.heroTagline;

/** Where the portrait was taken — shown under it until the Studio sets a caption. */
const PORTRAIT_FALLBACK_CAPTION = "In studio · Düsseldorf";

/** Studio portrait — Sanity-uploaded; falls back to the bundled studio shot. */
const portraitRef: ImageRef = portrait ?? {
  src: "/assets/home/home/001_a2f83c866258b1c4ae29ff098079fb6ef408549a.jpg",
  name: "studio-portrait.jpg",
  alt: "Aglaya Nogina in her Düsseldorf studio, in front of a large monochrome xerography print on textile",
  width: 1672,
  height: 2279,
};

export const HERO_PORTRAIT: ImageRef = {
  ...portraitRef,
  caption: portraitRef.caption ?? PORTRAIT_FALLBACK_CAPTION,
};

/* -------------------------------------------------------------------------- */
/*                                  LINE                                      */
/* -------------------------------------------------------------------------- */

/** Places line under the closing sentence ("Luhansk → Kharkiv → Kyiv → Düsseldorf") */
export const HERO_META: string = siteTagline;

/* -------------------------------------------------------------------------- */
/*                               THE WORK                                     */
/* -------------------------------------------------------------------------- */

export interface HomeWork {
  project: ProjectEntry;
  /** Optional third wall-label line, e.g. "KUT Gallery, Kyiv · October 2025". */
  exhibitionLine?: string;
}

/** The one work the page opens on — Studio pick, else the most recent project. */
const workProject = homePicks.featuredProject ?? projects[0];

export const homeWork: HomeWork | null = workProject
  ? {
      project: workProject,
      exhibitionLine: homePicks.featuredProject ? homePicks.featuredExhibitionLine : undefined,
    }
  : null;

/* -------------------------------------------------------------------------- */
/*                                 INDEX                                      */
/* -------------------------------------------------------------------------- */

/** Every project, recent → past — `projects` is already sorted at the source. */
export const homeIndex: ProjectEntry[] = projects;
