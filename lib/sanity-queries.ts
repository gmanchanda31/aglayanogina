/**
 * GROQ queries used by lib/content.ts to populate the site at build time.
 *
 * The shape of the returned data is intentionally close to the existing
 * `Entry`, `ProjectEntry`, `WritingEntry` types so the transform layer is thin.
 *
 * Image fields project the asset reference alongside `hotspot` / `crop` so
 * lib/content.ts can rebuild the URL through urlFor() and honour the crop
 * Aglaya sets in the Studio. `src` is the uncropped original, kept as a
 * fallback for the rare image with no asset reference. Intrinsic dimensions
 * come from Sanity's metadata sidecar and are adjusted for the crop.
 *
 * No list query sorts: `year` is free text, so order(year desc) sorts it as
 * a string. lib/content.ts orders every list with byRecency (lib/chrono.ts).
 */

/**
 * Fragment for an imageWithAlt.
 *
 * `hotspot` and `crop` live on the image object, not the asset — projecting
 * `asset->url` alone silently discards them, which is why Studio crops used
 * to have no effect on the site.
 */
const IMAGE_WITH_ALT = /* groq */ `{
  alt,
  caption,
  asset,
  hotspot,
  crop,
  "src": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

export const ARTIST_QUERY = /* groq */ `*[_type == "artist" && _id == "artist"][0]{
  name,
  tagline,
  intro,
  paragraphs,
  city,
  email,
  instagramUrl,
  whatsappUrl,
  patreonUrl,
  portrait ${IMAGE_WITH_ALT},
  education[]{ year, detail },
  publications[]{ year, detail },
  soloExhibitions[]{ year, detail },
  selectedExhibitions[]{ year, detail }
}`;

export const PROJECTS_QUERY = /* groq */ `*[_type == "project"] {
  _id,
  title,
  "slug": slug.current,
  year,
  sortDate,
  medium,
  location,
  dimensions,
  description,
  kinds,
  hero ${IMAGE_WITH_ALT},
  gallery[] ${IMAGE_WITH_ALT}
}`;

export const EXHIBITIONS_QUERY = /* groq */ `*[_type == "exhibition"] {
  _id,
  title,
  "slug": slug.current,
  kind,
  year,
  sortDate,
  venue,
  city,
  curator,
  description,
  hero ${IMAGE_WITH_ALT},
  gallery[] ${IMAGE_WITH_ALT}
}`;

export const ILLUSTRATIONS_QUERY = /* groq */ `*[_type == "illustration"] {
  _id,
  title,
  "slug": slug.current,
  year,
  sortDate,
  medium,
  client,
  description,
  hero ${IMAGE_WITH_ALT},
  gallery[] ${IMAGE_WITH_ALT}
}`;

export const PHOTOGRAPH_SETS_QUERY = /* groq */ `*[_type == "photographSet"] {
  _id,
  title,
  "slug": slug.current,
  year,
  sortDate,
  blurb,
  images[] ${IMAGE_WITH_ALT}
}`;

export const WRITINGS_QUERY = /* groq */ `*[_type == "writing"] {
  _id,
  title,
  "slug": slug.current,
  year,
  sortDate,
  excerpt,
  body
}`;

/**
 * The eyebrow / title / intro block at the top of each listing page.
 * One document per section, ids fixed as `sectionPage-<section>`.
 */
export const SECTION_PAGES_QUERY = /* groq */ `*[_type == "sectionPage"]{
  section,
  eyebrow,
  title,
  intro,
  metaDescription
}`;

export const HOME_PICKS_QUERY = /* groq */ `*[_type == "homePicks" && _id == "homePicks"][0]{
  heroItalic,
  heroTagline,
  featuredTeaser,
  featuredExhibitionLine,
  "featuredProject": featuredProject->{ _id, title, "slug": slug.current },
  "selectedWorks": selectedWorks[]->{ _id, title, "slug": slug.current },
  "journalPicks": journalPicks[]{ teaser, "writing": writing->{ _id, title, "slug": slug.current } }
}`;
