import {
  CalendarIcon,
  CaseIcon,
  DocumentTextIcon,
  EditIcon,
  HomeIcon,
  ImagesIcon,
  TextIcon,
  UserIcon,
} from "@sanity/icons";
import type { StructureBuilder } from "sanity/structure";
import type { ComponentType } from "react";

/**
 * Custom desk structure for Aglaya. Layout:
 *
 *   ──────────── Pinned ──────────────
 *   Homepage       (singleton — what's featured on /)
 *   Artist · Bio   (singleton — about page + CV + contact)
 *   ─────────────────────────────────
 *   Projects       ─┬─ Page intro  (the copy at the top of /projects)
 *                   └─ All projects (8)
 *   Exhibitions    ─┬─ …
 *   …
 *
 * Singletons render as a single document instead of a list — Aglaya never
 * sees a "+ New" for them. Each section is a folder holding its "Page intro"
 * document next to the works themselves, because until now that intro copy
 * was hardcoded in the site and she had no way to reach it.
 */

/** One section folder: its Page intro document + the list of its documents. */
function section(
  S: StructureBuilder,
  {
    title,
    listTitle,
    sectionId,
    schemaType,
    icon,
  }: {
    title: string;
    listTitle: string;
    sectionId: string;
    schemaType: string;
    icon: ComponentType;
  },
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .id(`section-${sectionId}`)
    .child(
      S.list()
        .title(title)
        .items([
          S.listItem()
            .title("Page intro")
            .icon(TextIcon)
            .id(`intro-${sectionId}`)
            .child(
              S.document()
                .schemaType("sectionPage")
                .documentId(`sectionPage-${sectionId}`)
                .title(`${title} — page intro`),
            ),
          S.divider(),
          S.documentTypeListItem(schemaType).title(listTitle).icon(icon),
        ]),
    );
}

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

      // ── Sections ────────────────────────────────────────────────
      section(S, {
        title: "Projects",
        listTitle: "All projects",
        sectionId: "projects",
        schemaType: "project",
        icon: CaseIcon,
      }),
      section(S, {
        title: "Exhibitions",
        listTitle: "All exhibitions",
        sectionId: "exhibitions",
        schemaType: "exhibition",
        icon: CalendarIcon,
      }),
      section(S, {
        title: "Illustration series",
        listTitle: "All illustration series",
        sectionId: "illustrations",
        schemaType: "illustration",
        icon: EditIcon,
      }),
      section(S, {
        title: "Photograph archives",
        listTitle: "All archives",
        sectionId: "photographs",
        schemaType: "photographSet",
        icon: ImagesIcon,
      }),
      section(S, {
        title: "Writings",
        listTitle: "All writings",
        sectionId: "writings",
        schemaType: "writing",
        icon: DocumentTextIcon,
      }),
    ]);
