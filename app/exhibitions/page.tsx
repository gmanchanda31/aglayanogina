import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { WorkGrid } from "@/components/artwork/work-grid";
import { exhibitions, getSectionPage } from "@/lib/content";

const page = getSectionPage("exhibitions", {
  eyebrow: `${exhibitions.length} shows · 2021 — 2025`,
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

      <Container className="py-16 md:py-20">
        <WorkGrid entries={exhibitions} />
      </Container>
    </>
  );
}
