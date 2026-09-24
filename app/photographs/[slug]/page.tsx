import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PrevNext } from "@/components/layout/prev-next";
import { PhotoMasonry } from "@/components/artwork/photo-masonry";
import { getPhotographSet, photographSets } from "@/lib/content";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return photographSets.map((s) => ({ slug: s.routeSlug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const set = getPhotographSet(slug);
  if (!set) return {};
  const title = set.title;
  return {
    title,
    description: `${set.images.length} photographs · ${title} · Aglaya Nogina`,
    openGraph: { title, description: `${set.images.length} photographs in the ${title} archive.` },
  };
}

export default async function PhotographSetPage({ params }: { params: Params }) {
  const { slug } = await params;
  const set = getPhotographSet(slug);
  if (!set) notFound();

  const title = set.title;
  const idx = photographSets.findIndex((s) => s.routeSlug === slug);
  const prev = idx > 0 ? photographSets[idx - 1] : undefined;
  const next = idx < photographSets.length - 1 ? photographSets[idx + 1] : undefined;

  return (
    <>
      <Container className="pt-block">
        <Breadcrumbs
          items={[
            { label: "Photographs", href: "/photographs" },
            { label: title },
          ]}
        />
      </Container>

      <Container className="pt-block pb-block">
        <h1 className="type-title">{title}</h1>
      </Container>

      <Container>
        <div className="border-t border-mist" />
      </Container>

      <Container className="pt-block">
        <PhotoMasonry images={set.images} eagerFirst label={title} />
      </Container>

      {prev || next ? (
        <PrevNext
          prev={prev ? { href: prev.href, title: prev.title } : undefined}
          next={next ? { href: next.href, title: next.title } : undefined}
          indexHref="/photographs"
          indexLabel="All photographs"
          label="More archives"
        />
      ) : null}
    </>
  );
}
