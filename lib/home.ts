/**
 * The studio portrait — shown on the home page and /about (via ArtistIntro)
 * and used by the root OG image. Sanity-uploaded; falls back to the bundled
 * studio shot.
 */

import { portrait } from "./content";
import type { ImageRef } from "./types";

export const HERO_PORTRAIT: ImageRef = portrait ?? {
  src: "/assets/home/home/001_a2f83c866258b1c4ae29ff098079fb6ef408549a.jpg",
  name: "studio-portrait.jpg",
  alt: "Aglaya Nogina in her Düsseldorf studio, in front of a large monochrome xerography print on textile",
  width: 1672,
  height: 2279,
};
