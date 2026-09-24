import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { PhotographArchives } from "@/components/photographs/photograph-archives";
import { getSectionPage, photographSets } from "@/lib/content";

const sets = photographSets;

const totalPhotos = sets.reduce((n, s) => n + s.images.length, 0);

const page = getSectionPage("photographs", {
  eyebrow: `${totalPhotos} photographs · ${sets.length} archives`,
  title: "Photographs",
  intro:
    "A film and digital archive — places lived in, places visited, faces returned to. Made between Kyiv, Berlin, Istanbul, Goa, and Düsseldorf.",
  metaDescription:
    "A film and digital archive — places lived in, places visited, faces returned to. Made between Kyiv, Berlin, Istanbul, Goa, and Düsseldorf.",
});

export const metadata: Metadata = {
  title: page.title,
  description: page.metaDescription,
};

export default function PhotographsPage() {
  return (
    <>
      <Container className="pt-section">
        <PageHeader
          title={page.title}
          lede={page.intro}
        />

        <div className="mt-block">
          <PhotographArchives sets={sets} />
        </div>
      </Container>
    </>
  );
}
