import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { WorkGrid } from "@/components/artwork/work-grid";
import { exhibitions, getSectionPage } from "@/lib/content";
import { yearSpan } from "@/lib/utils";

const span = yearSpan(exhibitions.map((e) => e.metadata.find((m) => m.label === "Year")?.value));

const page = getSectionPage("exhibitions", {
  eyebrow: [`${exhibitions.length} shows`, span].filter(Boolean).join(" · "),
  title: "Exhibitions",
  intro:
    "Solo and group exhibitions across Düsseldorf, Berlin, Kyiv, Lviv, the Carpathians, and the West Coast of the United States.",
  metaDescription:
    "Solo and group exhibitions by Aglaya Nogina — Düsseldorf, Berlin, Kyiv, Lviv, and beyond.",
});

export const metadata: Metadata = {
  title: page.title,
  description: page.metaDescription,
};

export default function ExhibitionsPage() {
  return (
    <>
      <Container className="pt-20 pb-12 md:pt-28 md:pb-16">
        <PageHeader
          eyebrow={page.eyebrow}
          title={page.title}
          lede={page.intro}
        />
      </Container>

      <Container>
        <div className="border-t border-mist" />
      </Container>

      <Container className="pt-12 md:pt-16">
        <WorkGrid entries={exhibitions} section="exhibitions" />
      </Container>
    </>
  );
}
