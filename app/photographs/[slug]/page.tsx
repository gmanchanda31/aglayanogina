import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PhotoMasonry } from "@/components/artwork/photo-masonry";
import { getPhotographSet, photographSets } from "@/lib/content";

type Params = Promise<{ slug: string }>;

const TITLE_OVERRIDES: Record<string, string> = {
  "b-w": "Black & White",
  colour: "Colour",
  turkey: "Turkey",
  india: "India",
};

export function generateStaticParams() {
  return photographSets.map((s) => ({ slug: s.routeSlug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const set = getPhotographSet(slug);
  if (!set) return {};
  const title = TITLE_OVERRIDES[set.routeSlug] ?? set.title;
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

  const title = TITLE_OVERRIDES[set.routeSlug] ?? set.title;
  const idx = photographSets.findIndex((s) => s.routeSlug === slug);
  const prev = idx > 0 ? photographSets[idx - 1] : undefined;
  const next = idx < photographSets.length - 1 ? photographSets[idx + 1] : undefined;
  const prevTitle = prev ? TITLE_OVERRIDES[prev.routeSlug] ?? prev.title : null;
  const nextTitle = next ? TITLE_OVERRIDES[next.routeSlug] ?? next.title : null;

  return (
    <>
      <Container className="pt-10 md:pt-12 pb-3">
        <Breadcrumbs
          items={[
            { label: "Photographs", href: "/photographs" },
            { label: title },
          ]}
        />
      </Container>

      <Container className="pt-12 md:pt-16 pb-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="label-caps text-stone">{set.images.length} photographs</p>
            <h1 className="font-[family-name:var(--font-vollkorn)] text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] leading-[1] tracking-tight mt-3">
              {title}
            </h1>
          </div>
        </div>
      </Container>

      <Container>
        <div className="border-t border-mist" />
      </Container>

      <Container className="pt-12 md:pt-16">
        <PhotoMasonry images={set.images} eagerFirst />
      </Container>

      {(prev || next) && (
        <Container className="border-t border-mist mt-24 md:mt-32">
          <nav aria-label="More archives" className="py-12 grid grid-cols-2 gap-4">
            <div>
              {prev && prevTitle ? (
                <Link
                  href={prev.href}
                  className="group inline-flex flex-col gap-1 text-left hover:text-ink"
                >
                  <span className="label-caps text-stone inline-flex items-center gap-1.5">
                    <ArrowLeft className="size-3.5" /> Previous
                  </span>
                  <span className="font-[family-name:var(--font-vollkorn)] italic text-2xl text-stone group-hover:text-ink transition-colors">
                    {prevTitle}
                  </span>
                </Link>
              ) : null}
            </div>
            <div className="flex justify-end">
              {next && nextTitle ? (
                <Link
                  href={next.href}
                  className="group inline-flex flex-col gap-1 text-right hover:text-ink"
                >
                  <span className="label-caps text-stone inline-flex items-center gap-1.5 self-end">
                    Next <ArrowRight className="size-3.5" />
                  </span>
                  <span className="font-[family-name:var(--font-vollkorn)] italic text-2xl text-stone group-hover:text-ink transition-colors">
                    {nextTitle}
                  </span>
                </Link>
              ) : null}
            </div>
          </nav>
        </Container>
      )}
    </>
  );
}
