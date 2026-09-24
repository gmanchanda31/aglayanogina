import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { WorkGrid } from "@/components/artwork/work-grid";
import { getSectionPage, illustrations } from "@/lib/content";

const page = getSectionPage("illustrations", {
  eyebrow: `${illustrations.length} series`,
  title: "Illustrations",
  intro:
    "Pen-and-ink series and album covers — Schmalgauzen, The Eustomes, The Winter Sea — patterned, intricate, and quiet.",
  metaDescription:
    "Pen and ink illustrations, album covers, and editorial commissions by Aglaya Nogina.",
});

export const metadata: Metadata = {
  title: page.title,
  description: page.metaDescription,
};

export default function IllustrationsPage() {
  return (
    <>
      <Container className="pt-section pb-block">
        <PageHeader
          eyebrow={page.eyebrow}
          title={page.title}
          lede={page.intro}
        />
      </Container>

      <Container>
        <div className="border-t border-mist" />
      </Container>

      <Container className="pt-block">
        <WorkGrid entries={illustrations} section="illustrations" />
      </Container>
    </>
  );
}
