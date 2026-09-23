import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { PhotoMasonry } from "@/components/artwork/photo-masonry";
import { getSectionPage, photographSets } from "@/lib/content";

/** The index previews each archive; the full set lives on its own page. */
const PREVIEW_COUNT = 9;

const sets = photographSets;

const totalPhotos = sets.reduce((n, s) => n + s.images.length, 0);

const page = getSectionPage("photographs", {
  eyebrow: `${totalPhotos} photographs · ${sets.length} archives`,
  title: "Photographs",
  intro:
    "A film and digital archive — places lived in, places visited, faces returned to. Made between Kyiv, Berlin, Istanbul, Goa, and Düsseldorf.",
  metaDescription:
    "A film and digital archive — places lived in, places visited, faces returned to. Made between Kyiv, Berlin, Istanbul, Goa, and Düsseldorf.",
});

export const metadata: Metadata = {
  title: page.title,
  description: page.metaDescription,
};

export default function PhotographsPage() {
  return (
    <>
      <Container className="pt-20 pb-12 md:pt-28 md:pb-16">
        <PageHeader
          eyebrow={page.eyebrow}
          title={page.title}
          lede={page.intro}
        />

        <nav
          aria-label="Photograph archives"
          className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-1 md:gap-y-3"
        >
          {sets.map((s) => (
            <Link
              key={s.routeSlug}
              href={`#${s.routeSlug}`}
              className="label-caps text-stone hover:text-ink transition-colors inline-flex items-center min-h-11 md:min-h-0"
            >
              {s.title}
              <span className="ml-2 text-stone/60 nums">{s.images.length}</span>
            </Link>
          ))}
        </nav>
      </Container>

      <Container>
        <div className="border-t border-mist" />
      </Container>

      <Container className="pt-12 md:pt-16">
        <div className="space-y-20 md:space-y-24">
          {sets.map((set, idx) => (
            <section
              key={set.slug}
              id={set.routeSlug}
              aria-labelledby={`${set.routeSlug}-heading`}
              className="scroll-mt-[calc(var(--header-h)+1.5rem)]"
            >
              <header className="mb-8 md:mb-10">
                <h2 id={`${set.routeSlug}-heading`} className="title-section text-ink">
                  <Link href={set.href} className="hover:text-stone">
                    {set.title}
                  </Link>
                  <span className="ml-3 label-caps text-stone nums">
                    {set.images.length}
                  </span>
                </h2>
              </header>

              <PhotoMasonry
                images={set.images.slice(0, PREVIEW_COUNT)}
                eagerFirst={idx === 0}
                label={set.title}
              />

              <div className="mt-6 md:mt-8 flex justify-center">
                <Link href={set.href} className="link-draw label-caps text-stone hover:text-ink">
                  {set.images.length > PREVIEW_COUNT
                    ? `View all ${set.images.length} photographs`
                    : "View archive"}
                </Link>
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
