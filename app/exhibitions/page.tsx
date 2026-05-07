import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { AsymmetricGrid } from "@/components/artwork/asymmetric-grid";
import { exhibitions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Exhibitions",
  description:
    "Solo and group exhibitions by Aglaya Nogina — Düsseldorf, Berlin, Kyiv, Lviv, and beyond.",
};

const PATTERN = [
  { colSpan: "md:col-span-5", aspect: "aspect-[4/5]" },
  { colSpan: "md:col-span-7", aspect: "aspect-[3/2]" },
  { colSpan: "md:col-span-4", aspect: "aspect-square" },
  { colSpan: "md:col-span-4", aspect: "aspect-[3/4]" },
  { colSpan: "md:col-span-4", aspect: "aspect-square" },
  { colSpan: "md:col-span-7", aspect: "aspect-[16/9]" },
  { colSpan: "md:col-span-5", aspect: "aspect-[3/4]" },
  { colSpan: "md:col-span-6", aspect: "aspect-[4/5]" },
  { colSpan: "md:col-span-6", aspect: "aspect-[3/2]" },
];

export default function ExhibitionsPage() {
  return (
    <>
      <Container className="pt-20 pb-12 md:pt-28 md:pb-16">
        <PageHeader
          eyebrow={`${exhibitions.length} shows · 2021 — 2025`}
          title="Exhibitions"
          lede="Solo and group exhibitions across Düsseldorf, Berlin, Kyiv, Lviv, the Carpathians, and the West Coast of the United States."
        />
      </Container>

      <Container>
        <div className="border-t border-mist" />
      </Container>

      <Container className="py-16 md:py-20">
        <AsymmetricGrid
          entries={exhibitions}
          pattern={PATTERN}
          getMedium={(e) =>
            e.metadata.find((m) => !/^\d{4}/.test(m.value))?.value
          }
          getYear={(e) => e.metadata.find((m) => /^\d{4}/.test(m.value))?.value}
        />
      </Container>
    </>
  );
}
