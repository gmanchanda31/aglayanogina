import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { AsymmetricGrid } from "@/components/artwork/asymmetric-grid";
import { illustrations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Illustrations",
  description:
    "Pen and ink illustrations, album covers, and editorial commissions by Aglaya Nogina.",
};

const PATTERN = [
  { colSpan: "md:col-span-7", aspect: "aspect-[3/4]" },
  { colSpan: "md:col-span-5", aspect: "aspect-[4/5]" },
  { colSpan: "md:col-span-4", aspect: "aspect-square" },
  { colSpan: "md:col-span-4", aspect: "aspect-[3/4]" },
  { colSpan: "md:col-span-4", aspect: "aspect-square" },
];

export default function IllustrationsPage() {
  return (
    <>
      <Container className="pt-20 pb-12 md:pt-28 md:pb-16">
        <PageHeader
          eyebrow={`${illustrations.length} series`}
          title="Illustrations"
          lede="Pen-and-ink series and album covers — Schmalgauzen, The Eustomes, The Winter Sea — patterned, intricate, and quiet."
        />
      </Container>

      <Container>
        <div className="border-t border-mist" />
      </Container>

      <Container className="py-16 md:py-20">
        <AsymmetricGrid entries={illustrations} pattern={PATTERN} />
      </Container>
    </>
  );
}
