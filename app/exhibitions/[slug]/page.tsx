import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryDetail } from "@/components/detail/entry-detail";
import { exhibitions, getExhibition } from "@/lib/content";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return exhibitions.map((e) => ({ slug: e.routeSlug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getExhibition(slug);
  if (!entry) return {};
  const description =
    entry.description[0]?.slice(0, 200) ??
    `${entry.title} — ${entry.metadata.map((m) => m.value).join(" · ")}`;
  return {
    title: entry.title,
    description,
    openGraph: { title: entry.title, description },
  };
}

export default async function ExhibitionDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const entry = getExhibition(slug);
  if (!entry) notFound();

  const idx = exhibitions.findIndex((e) => e.routeSlug === slug);
  const prev = idx > 0 ? exhibitions[idx - 1] : undefined;
  const next = idx < exhibitions.length - 1 ? exhibitions[idx + 1] : undefined;

  return (
    <EntryDetail
      entry={entry}
      sectionLabel="Exhibitions"
      sectionHref="/exhibitions"
      metaLabel="Exhibition"
      prev={prev ? { href: prev.href, label: "Previous", title: prev.title } : undefined}
      next={next ? { href: next.href, label: "Next", title: next.title } : undefined}
    />
  );
}
