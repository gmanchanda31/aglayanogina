import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryDetail } from "@/components/detail/entry-detail";
import { getProject, projects } from "@/lib/content";

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

  return (
    <EntryDetail
      entry={project}
      sectionLabel="Projects"
      sectionHref="/projects"
      metaLabel="Project"
      prev={prev ? { href: prev.href, label: "Previous", title: prev.title } : undefined}
      next={next ? { href: next.href, label: "Next", title: next.title } : undefined}
    />
  );
}
