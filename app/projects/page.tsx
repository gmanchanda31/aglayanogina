import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { FilterChips } from "@/components/layout/filter-chips";
import { AsymmetricGrid } from "@/components/artwork/asymmetric-grid";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects in xerography, relief printing, painting, ceramics, and sculpture by Aglaya Nogina — exploring memory, displacement, and friendship.",
};

const FILTERS = ["All", "Print", "Painting", "Ceramic", "Sculpture", "Photography"] as const;

const PATTERN = [
  { colSpan: "md:col-span-7", aspect: "aspect-[4/5]" },
  { colSpan: "md:col-span-5", aspect: "aspect-square" },
  { colSpan: "md:col-span-4", aspect: "aspect-[3/4]" },
  { colSpan: "md:col-span-5", aspect: "aspect-[4/5]" },
  { colSpan: "md:col-span-3", aspect: "aspect-square" },
  { colSpan: "md:col-span-6", aspect: "aspect-[3/2]" },
  { colSpan: "md:col-span-6", aspect: "aspect-[3/2]" },
  { colSpan: "md:col-span-12", aspect: "aspect-[16/9]" },
];

export default function ProjectsPage() {
  return (
    <>
      <Container className="pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <PageHeader
            eyebrow={`${projects.length} works · 2021 — 2025`}
            title="Projects"
            lede="Selected works in xerography, relief printing, painting, and ceramic — exploring memory, displacement, and the strength of friendship."
          />
          <FilterChips options={FILTERS} active="All" />
        </div>
      </Container>

      <Container>
        <div className="border-t border-mist" />
      </Container>

      <Container className="py-16 md:py-20">
        <AsymmetricGrid entries={projects} pattern={PATTERN} />
      </Container>
    </>
  );
}
