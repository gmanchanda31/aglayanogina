import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { PhotoMasonry } from "@/components/artwork/photo-masonry";
import { photographSets } from "@/lib/content";

export const metadata: Metadata = {
  title: "Photographs",
  description:
    "A film and digital archive — places lived in, places visited, faces returned to. Made between Kyiv, Berlin, Istanbul, Goa, and Düsseldorf.",
};

const TITLE_OVERRIDES: Record<string, string> = {
  "b-w": "Black & White",
  colour: "Colour",
  turkey: "Turkey",
  india: "India",
};

const ORDER = ["colour", "b-w", "turkey", "india"];

export default function PhotographsPage() {
  const sets = ORDER
    .map((slug) => photographSets.find((s) => s.routeSlug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const totalPhotos = sets.reduce((n, s) => n + s.images.length, 0);

  return (
    <>
      <Container className="pt-20 pb-12 md:pt-28 md:pb-16">
        <PageHeader
          eyebrow={`${totalPhotos} photographs · ${sets.length} archives`}
          title="Photographs"
          lede="A film and digital archive — places lived in, places visited, faces returned to. Made between Kyiv, Berlin, Istanbul, Goa, and Düsseldorf."
        />

        <nav
          aria-label="Photograph archives"
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3"
        >
          {sets.map((s) => (
            <Link
              key={s.routeSlug}
              href={`#${s.routeSlug}`}
              className="label-caps text-stone hover:text-ink transition-colors"
            >
              {TITLE_OVERRIDES[s.routeSlug] ?? s.title}
              <span className="ml-2 text-stone/60">({s.images.length})</span>
            </Link>
          ))}
        </nav>
      </Container>

      <Container>
        <div className="border-t border-mist" />
      </Container>

      <Container className="pt-16 md:pt-20">
        <div className="space-y-24 md:space-y-32">
          {sets.map((set, idx) => (
            <section
              key={set.slug}
              id={set.routeSlug}
              aria-labelledby={`${set.routeSlug}-heading`}
              className="scroll-mt-24"
            >
              <header className="mb-10 md:mb-12 flex items-end justify-between gap-6">
                <div>
                  <p className="label-caps text-stone">
                    Archive {String(idx + 1).padStart(2, "0")}
                  </p>
                  <h2
                    id={`${set.routeSlug}-heading`}
                    className="font-[family-name:var(--font-vollkorn)] mt-2 text-4xl md:text-5xl tracking-tight text-ink"
                  >
                    {TITLE_OVERRIDES[set.routeSlug] ?? set.title}
                  </h2>
                </div>
                <Link
                  href={set.href}
                  className="label-caps text-stone hover:text-ink border-b border-stone hover:border-ink pb-1 transition-colors"
                >
                  View archive
                </Link>
              </header>

              <PhotoMasonry images={set.images} eagerFirst={idx === 0} />
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
