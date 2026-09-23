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
          <h2 id="selected-works-heading" className="label-caps text-stone">
            Selected works
          </h2>
          <Link
            href="/projects"
            className="label-caps text-stone hover:text-ink border-b border-stone hover:border-ink pb-1 transition-colors"
          >
            All projects
          </Link>
        </header>
      </Container>

      <Container className="pb-24 md:pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 md:gap-x-10 gap-y-14 items-start">
          {[first, second, third, fourth].map((work) =>
            work.hero ? (
              <ArtworkCard
                key={work.slug}
                href={work.href}
                image={work.hero}
                title={work.title}
                medium={work.metadata.find((m) => m.label === "Medium")?.value}
                year={work.metadata.find((m) => m.label === "Year")?.value}
                sizes={CARD_SIZES}
              />
            ) : null,
          )}
        </div>
      </Container>
    </section>
  );
}
