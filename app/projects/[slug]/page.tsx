import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryDetail } from "@/components/detail/entry-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { getProject, projects } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.routeSlug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const description =
    project.description[0]?.slice(0, 200) ??
    `${project.title} — ${project.metadata.map((m) => m.value).join(" · ")}`;
  return {
    title: project.title,
    description,
    openGraph: { title: project.title, description },
  };
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.routeSlug === slug);
  const prev = idx > 0 ? projects[idx - 1] : undefined;
  const next = idx < projects.length - 1 ? projects[idx + 1] : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    creator: { "@type": "Person", name: "Aglaya Nogina" },
    artMedium: project.metadata.find((m) => m.label === "Medium")?.value,
    dateCreated: project.metadata.find((m) => m.label === "Year")?.value,
    locationCreated: project.metadata.find((m) => m.label === "Location")?.value,
    description: project.description[0],
    url: `${SITE_URL}${project.href}`,
    image: project.hero ? `${SITE_URL}${project.hero.src}` : undefined,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <EntryDetail
        entry={project}
        sectionLabel="Projects"
        sectionHref="/projects"
        metaLabel="Project"
        prev={prev ? { href: prev.href, label: "Previous", title: prev.title } : undefined}
        next={next ? { href: next.href, label: "Next", title: next.title } : undefined}
      />
    </>
  );
}
