import Link from "next/link";
import { ArtTile } from "@/components/artwork/art-tile";
import { Container } from "@/components/layout/container";
import { HERO_ITALIC, HERO_META, HERO_TAGLINE, homeIndex } from "@/lib/home";

/**
 * Every project as one text row, recent → past — an index, not a card grid.
 * On hover-capable screens the row's work appears in the empty right column
 * as a 4:5 tile (opacity only); on touch the rows are plain links.
 */
export function HomeIndex() {
  if (homeIndex.length === 0) return null;

  return (
    <Container as="section" aria-label="Works" className="pt-10 md:pt-14">
      <div className="relative md:grid md:grid-cols-12 md:gap-x-8">
        <ol data-work-grid className="md:col-span-8">
          {homeIndex.map((work) => {
            const medium = work.metadata.find((m) => m.label === "Medium")?.value;
            const year = work.metadata.find((m) => m.label === "Year")?.value;
            return (
              <li key={work.slug} data-grid-item className="group">
                <Link
                  href={work.href}
                  data-dir="next"
                  className="grid grid-cols-[1fr_auto] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_6rem] items-baseline gap-x-6 py-1"
                >
                  <span className="type-ui text-ink group-hover:text-clay transition-colors truncate">
                    {work.title}
                  </span>
                  <span className="hidden md:block type-meta text-stone truncate">{medium}</span>
                  <span className="type-meta text-stone nums text-right">{year}</span>
                </Link>

                {work.hero ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-0 hidden md:block md:w-[min(18rem,calc((100%-22rem)/3+6rem))] opacity-0 transition-opacity duration-[var(--dur-quick)] ease-[var(--ease-soft)] group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    <ArtTile image={{ ...work.hero, alt: "" }} sizes="288px" />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      {HERO_ITALIC || HERO_TAGLINE || HERO_META ? (
        <div data-reveal="text" className="mt-8 md:mt-10 max-w-[44ch]">
          {HERO_ITALIC ? <p className="type-ui text-ink">{HERO_ITALIC}</p> : null}
          {HERO_TAGLINE ? <p className="type-ui text-stone">{HERO_TAGLINE}</p> : null}
          {HERO_META ? <p className="type-meta text-stone mt-2">{HERO_META}</p> : null}
        </div>
      ) : null}
    </Container>
  );
}
