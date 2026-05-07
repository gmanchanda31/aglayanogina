import {
  CalendarIcon,
  CaseIcon,
  DocumentTextIcon,
  EditIcon,
  HomeIcon,
  ImagesIcon,
  UserIcon,
} from "@sanity/icons";
import type { StructureBuilder } from "sanity/structure";

/**
 * Custom desk structure for Aglaya. Layout:
 *
 *   ──────────── Pinned ──────────────
 *   Homepage       (singleton — what's featured on /)
 *   Artist · Bio   (singleton — about page + CV + contact)
 *   ─────────────────────────────────
 *   Projects       (8)
 *   Exhibitions    (9)
 *   Illustrations  (5)
 *   Photographs    (4)
 *   Writings       (11)
 *
 * Singletons render as a single document instead of a list — Aglaya never
 * sees a "+ New" for them.
 */
export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // ── Singletons ──────────────────────────────────────────────
      S.listItem()
        .title("Homepage")
        .icon(HomeIcon)
        .id("homePicks")
        .child(
          S.document()
            .schemaType("homePicks")
            .documentId("homePicks")
            .title("Homepage"),
        ),
      S.listItem()
        .title("Artist · Bio + CV")
        .icon(UserIcon)
        .id("artist")
        .child(
          S.document()
            .schemaType("artist")
            .documentId("artist")
            .title("Artist"),
        ),

      S.divider(),

      // ── Lists ───────────────────────────────────────────────────
      S.documentTypeListItem("project").title("Projects").icon(CaseIcon),
      S.documentTypeListItem("exhibition").title("Exhibitions").icon(CalendarIcon),
      S.documentTypeListItem("illustration")
        .title("Illustration series")
        .icon(EditIcon),
      S.documentTypeListItem("photographSet")
        .title("Photograph archives")
        .icon(ImagesIcon),
      S.documentTypeListItem("writing").title("Writings").icon(DocumentTextIcon),
    ]);
