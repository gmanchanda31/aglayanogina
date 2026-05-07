import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { getWriting, writings } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { hasMdx, loadWritingMdx } from "@/lib/writings-mdx";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return writings.filter((w) => hasMdx(w.routeSlug)).map((w) => ({ slug: w.routeSlug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const writing = getWriting(slug);
  if (!writing) return {};
  return {
    title: writing.title,
    description: writing.excerpt,
    openGraph: {
      title: writing.title,
      description: writing.excerpt,
      type: "article",
    },
  };
}

export default async function WritingDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const writing = getWriting(slug);
  if (!writing) notFound();

  const Article = await loadWritingMdx(slug);
  if (!Article) notFound();

  const idx = writings.findIndex((w) => w.routeSlug === slug);
  const prev = idx > 0 ? writings[idx - 1] : undefined;
  const next = idx < writings.length - 1 ? writings[idx + 1] : undefined;

  // Other writings to surface at the bottom (3 random-ish: take 3 closest to current index)
  const more = writings
    .filter((w) => w.routeSlug !== slug && hasMdx(w.routeSlug))
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: writing.title,
    description: writing.excerpt,
    author: { "@type": "Person", name: "Aglaya Nogina" },
    publisher: { "@type": "Person", name: "Aglaya Nogina" },
    url: `${SITE_URL}${writing.href}`,
    inLanguage: "en",
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <Container className="pt-10 md:pt-12 pb-3">
        <Breadcrumbs
          items={[
            { label: "Writings", href: "/writings" },
            { label: writing.title },
          ]}
        />
      </Container>

      {/* Article header */}
      <Container className="pt-12 md:pt-16">
        <header className="max-w-[760px] mx-auto text-center">
          <p className="label-caps text-stone">Essay</p>
          <h1 className="font-[family-name:var(--font-vollkorn)] text-[3.5rem] sm:text-[5rem] md:text-[6rem] leading-[1.02] tracking-tight mt-4">
            {writing.title}
          </h1>
          <p className="font-[family-name:var(--font-vollkorn)] italic text-stone text-xl md:text-2xl leading-[1.4] mt-6 max-w-prose mx-auto">
            {writing.excerpt}
            {writing.excerpt.length === 200 ? "…" : ""}
          </p>
          <p className="label-caps text-stone mt-10">— Aglaya Nogina</p>
        </header>
      </Container>

      <Container className="my-12 md:my-16">
        <div className="mx-auto h-px w-16 bg-mist" />
      </Container>

      {/* Article body */}
      <Container className="pb-16 md:pb-24">
        <article className="max-w-[640px] mx-auto">
          <Article />
        </article>
      </Container>

      {/* Inline Patreon appeal at end of essay */}
      <Container className="pb-16 md:pb-24">
        <div className="max-w-[640px] mx-auto pt-12 border-t border-mist text-center">
          <p className="font-[family-name:var(--font-vollkorn)] italic text-stone text-lg md:text-xl">
            More writing, sketches, and studio notes are shared in the art diary.
          </p>
          <a
            href="https://patreon.com/aglayann"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center label-caps px-5 py-3 border border-ink text-ink hover:bg-ink hover:text-paper transition-colors duration-300"
          >
            Read the art diary on Patreon
          </a>
        </div>
      </Container>

      {/* Prev / Next */}
      {(prev || next) && (
        <Container className="border-t border-mist">
          <nav aria-label="More writings" className="py-12 grid grid-cols-2 gap-4">
            <div>
              {prev ? (
                <Link
                  href={prev.href}
                  className="group inline-flex flex-col gap-1 text-left hover:text-ink"
                >
                  <span className="label-caps text-stone inline-flex items-center gap-1.5">
                    <ArrowLeft className="size-3.5" /> Previous
                  </span>
                  <span className="font-[family-name:var(--font-vollkorn)] italic text-2xl text-stone group-hover:text-ink transition-colors">
                    {prev.title}
                  </span>
                </Link>
              ) : null}
            </div>
            <div className="flex justify-end">
              {next ? (
                <Link
                  href={next.href}
                  className="group inline-flex flex-col gap-1 text-right hover:text-ink"
                >
                  <span className="label-caps text-stone inline-flex items-center gap-1.5 self-end">
                    Next <ArrowRight className="size-3.5" />
                  </span>
                  <span className="font-[family-name:var(--font-vollkorn)] italic text-2xl text-stone group-hover:text-ink transition-colors">
                    {next.title}
                  </span>
                </Link>
              ) : null}
            </div>
          </nav>
        </Container>
      )}

      {/* More writings */}
      {more.length > 0 && (
        <Container className="border-t border-mist py-16 md:py-20">
          <p className="label-caps text-stone mb-10">More writings</p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {more.map((w) => (
              <li key={w.slug}>
                <Link href={w.href} className="group block">
                  <h3 className="font-[family-name:var(--font-vollkorn)] italic text-2xl leading-tight text-ink group-hover:text-clay transition-colors">
                    {w.title}
                  </h3>
                  <p className="text-stone text-sm leading-[1.6] mt-3 line-clamp-3">
                    {w.excerpt}
                    {w.excerpt.length === 200 ? "…" : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}
    </>
  );
}
