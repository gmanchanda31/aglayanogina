import Link from "next/link";
import { ArtworkCard } from "@/components/artwork/artwork-card";
import { Container } from "@/components/layout/container";
import { selectedWorks } from "@/lib/home";

/**
 * 4 works in one even grid — same column width for every card, height
 * following each artwork's own proportions.
 */
const CARD_SIZES = "(min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw";

export function SelectedWorks() {
  const [first, second, third, fourth] = selectedWorks;
  if (!first || !second || !third || !fourth) return null;

  return (
    <section
      aria-labelledby="selected-works-heading"
      className="border-t border-mist"
    >
      <Container className="pt-16 md:pt-20 pb-12 md:pb-16">
        <header className="flex items-baseline justify-between gap-6">
          <h2 id="selected-works-heading" className="type-meta text-stone">
            Selected works
          </h2>
          <Link
            href="/projects"
            className="link-draw type-ui text-stone hover:text-ink"
          >
            All projects
          </Link>
        </header>
      </Container>

      <Container className="pb-20 md:pb-24">
        <div
          data-work-grid
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 md:gap-x-10 gap-y-14 items-start"
        >
          {[first, second, third, fourth].map((work) =>
            work.hero ? (
              <div key={work.slug} data-grid-item>
                <ArtworkCard
                  href={work.href}
                  image={work.hero}
                  title={work.title}
                  medium={work.metadata.find((m) => m.label === "Medium")?.value}
                  year={work.metadata.find((m) => m.label === "Year")?.value}
                  sizes={CARD_SIZES}
                />
              </div>
            ) : null,
          )}
        </div>
      </Container>
    </section>
  );
}
