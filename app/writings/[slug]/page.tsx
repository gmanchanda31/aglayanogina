import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PrevNext } from "@/components/layout/prev-next";
import { ReadingProgress } from "@/components/motion/reading-progress";
import { JsonLd } from "@/components/seo/json-ld";
import { ArticleBody } from "@/components/writing/article-body";
import { getWriting, writings } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return writings.map((w) => ({ slug: w.routeSlug }));
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

  const idx = writings.findIndex((w) => w.routeSlug === slug);
  const prev = idx > 0 ? writings[idx - 1] : undefined;
  const next = idx < writings.length - 1 ? writings[idx + 1] : undefined;

  // Three more essays, skipping the ones prev/next already link to
  const shown = new Set([slug, prev?.routeSlug, next?.routeSlug]);
  const more = writings.filter((w) => !shown.has(w.routeSlug)).slice(0, 3);

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
      <ReadingProgress />
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
          <p className="type-meta text-stone">Essay</p>
          <h1 className="type-title mt-2">
            {writing.title}
          </h1>
          <p className="type-meta text-stone mt-6">Aglaya Nogina</p>
        </header>
      </Container>

      <Container className="my-12 md:my-16">
        <div className="mx-auto h-px w-16 bg-mist" />
      </Container>

      {/* Article body */}
      <Container>
        <article className="max-w-[640px] mx-auto">
          <ArticleBody body={writing.body} />
        </article>
      </Container>

      {prev || next ? (
        <PrevNext
          prev={prev ? { href: prev.href, title: prev.title } : undefined}
          next={next ? { href: next.href, title: next.title } : undefined}
          indexHref="/writings"
          indexLabel="All writings"
          label="More writings"
        />
      ) : null}

      {/* More writings */}
      {more.length > 0 && (
        <Container className="border-t border-mist pt-16 md:pt-20">
          <p className="type-meta text-stone mb-10">More writings</p>
          <ul data-work-grid className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {more.map((w) => (
              <li key={w.slug} data-grid-item>
                <Link href={w.href} className="group block">
                  <h3 className="type-heading text-ink underline decoration-transparent decoration-1 underline-offset-4 group-hover:decoration-ink/40">
                    {w.title}
                  </h3>
                  <p className="type-body text-stone mt-3 line-clamp-3">
                    {w.excerpt}
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
