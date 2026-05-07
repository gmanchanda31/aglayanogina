import type { StructureBuilder } from "sanity/structure";

/**
 * Custom desk structure for Aglaya. Pinned at top:
 *   - Homepage (singleton)
 *   - Artist (singleton — bio, CV, contact)
 * Below: lists of all the regular content types.
 *
 * The two singletons are list-items pointing to a fixed document id, so
 * there's only ever one of each — Aglaya never sees a "+ New" for these.
 */
export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // ── Singletons ──────────────────────────────────────────────
      S.listItem()
        .title("Homepage")
        .id("homePicks")
        .child(
          S.document()
            .schemaType("homePicks")
            .documentId("homePicks")
            .title("Homepage"),
        ),
      S.listItem()
        .title("Artist · Bio + CV")
        .id("artist")
        .child(
          S.document()
            .schemaType("artist")
            .documentId("artist")
            .title("Artist"),
        ),

      S.divider(),

      // ── Lists ───────────────────────────────────────────────────
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("exhibition").title("Exhibitions"),
      S.documentTypeListItem("illustration").title("Illustration series"),
      S.documentTypeListItem("photographSet").title("Photograph archives"),
      S.documentTypeListItem("writing").title("Writings"),
    ]);
