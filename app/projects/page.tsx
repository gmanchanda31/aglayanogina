import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { getSectionPage, projects } from "@/lib/content";

const page = getSectionPage("projects", {
  eyebrow: `${projects.length} works · 2021 — 2025`,
  title: "Projects",
  intro:
    "Selected works in xerography, relief printing, painting, and ceramic — exploring memory, displacement, and the strength of friendship.",
  metaDescription:
    "Selected projects in xerography, relief printing, painting, ceramics, and sculpture by Aglaya Nogina — exploring memory, displacement, and friendship.",
});

export const metadata: Metadata = {
  title: page.title,
  description: page.metaDescription,
};

export default function ProjectsPage() {
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

      <Container className="py-12 md:py-16">
        <ProjectsGrid projects={projects} />
      </Container>
    </>
  );
}
