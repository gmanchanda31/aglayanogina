import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { getSectionPage, projects } from "@/lib/content";
import { yearSpan } from "@/lib/utils";

const span = yearSpan(projects.map((p) => p.metadata.find((m) => m.label === "Year")?.value));

const page = getSectionPage("projects", {
  eyebrow: [`${projects.length} works`, span].filter(Boolean).join(" · "),
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

      <Container className="pt-12 md:pt-16">
        <ProjectsGrid projects={projects} />
      </Container>
    </>
  );
}
