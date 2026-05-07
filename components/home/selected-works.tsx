import Link from "next/link";
import { ArtworkCard } from "@/components/artwork/artwork-card";
import { Container } from "@/components/layout/container";
import { selectedWorks } from "@/lib/home";

/**
 * 4-tile staggered grid. Layout (desktop):
 *   Row 1: 7-col + 5-col, with the 5-col image dropped lower (mt-24)
 *   Row 2: 5-col + 7-col, with the 7-col image dropped lower (mt-12)
 * Mobile collapses to a single column with no offsets.
 */
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

      <Container className="space-y-20 md:space-y-32 pb-24 md:pb-32">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          {first.hero ? (
            <ArtworkCard
              href={first.href}
              image={first.hero}
              title={first.title}
              medium={first.metadata.find((m) => m.label === "Medium")?.value}
              year={first.metadata.find((m) => m.label === "Year")?.value}
              aspect="aspect-[4/5]"
              sizes="(min-width: 768px) 55vw, 100vw"
              size="lg"
              className="md:col-span-7"
            />
          ) : null}
          {second.hero ? (
            <ArtworkCard
              href={second.href}
              image={second.hero}
              title={second.title}
              medium={second.metadata.find((m) => m.label === "Medium")?.value}
              year={second.metadata.find((m) => m.label === "Year")?.value}
              aspect="aspect-[3/4]"
              sizes="(min-width: 768px) 38vw, 100vw"
              className="md:col-span-5 md:mt-24"
            />
          ) : null}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          {third.hero ? (
            <ArtworkCard
              href={third.href}
              image={third.hero}
              title={third.title}
              medium={third.metadata.find((m) => m.label === "Medium")?.value}
              year={third.metadata.find((m) => m.label === "Year")?.value}
              aspect="aspect-[4/5]"
              sizes="(min-width: 768px) 38vw, 100vw"
              className="md:col-span-5"
            />
          ) : null}
          {fourth.hero ? (
            <ArtworkCard
              href={fourth.href}
              image={fourth.hero}
              title={fourth.title}
              medium={fourth.metadata.find((m) => m.label === "Medium")?.value}
              year={fourth.metadata.find((m) => m.label === "Year")?.value}
              aspect="aspect-[3/2]"
              sizes="(min-width: 768px) 55vw, 100vw"
              className="md:col-span-7 md:mt-12"
            />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
