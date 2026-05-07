/**
 * GROQ queries used by lib/content.ts to populate the site at build time.
 *
 * The shape of the returned data is intentionally close to the existing
 * `Entry`, `ProjectEntry`, `WritingEntry` types so the transform layer is thin.
 *
 * Image fields project to { src, width, height, alt } so we get dimensions
 * out of Sanity's metadata sidecar — no _ref parsing needed.
 */

/** Fragment for an imageWithAlt — resolves asset to a usable shape. */
const IMAGE_WITH_ALT = /* groq */ `{
  alt,
  caption,
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

const ENTRY_PROJECTION = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  year,
  medium,
  location,
  dimensions,
  description,
  hero ${IMAGE_WITH_ALT},
  gallery[] ${IMAGE_WITH_ALT}
}`;

export const PROJECTS_QUERY = /* groq */ `*[_type == "project"] | order(year desc) ${ENTRY_PROJECTION.replace(
  "}",
  ', kinds }',
)}`;

export const EXHIBITIONS_QUERY = /* groq */ `*[_type == "exhibition"] | order(year desc) {
  _id,
  title,
  "slug": slug.current,
  kind,
  year,
  venue,
  city,
  curator,
  description,
  hero ${IMAGE_WITH_ALT},
  gallery[] ${IMAGE_WITH_ALT}
}`;

export const ILLUSTRATIONS_QUERY = /* groq */ `*[_type == "illustration"] | order(year desc) {
  _id,
  title,
  "slug": slug.current,
  year,
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
  blurb,
  images[] ${IMAGE_WITH_ALT}
}`;

export const WRITINGS_QUERY = /* groq */ `*[_type == "writing"] | order(year desc) {
  _id,
  title,
  "slug": slug.current,
  year,
  excerpt,
  body
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
