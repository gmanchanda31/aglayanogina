import Link from "next/link";
import { Container } from "@/components/layout/container";
import { journalPicks } from "@/lib/home";

export function JournalPair() {
  if (journalPicks.length === 0) return null;

  return (
    <section
      aria-labelledby="journal-heading"
      className="border-t border-mist"
    >
      <Container className="pt-20 md:pt-24 pb-4">
        <h2
          id="journal-heading"
          className="label-caps text-ink text-center mb-16 md:mb-20"
        >
          From the journal
        </h2>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 relative
            md:before:content-[''] md:before:absolute md:before:left-1/2
            md:before:top-0 md:before:bottom-0 md:before:w-px md:before:bg-mist
            md:before:-translate-x-1/2`}
        >
          {journalPicks.map(({ writing, teaser }) => (
            <article
              key={writing.routeSlug}
              data-reveal="text"
              className="flex flex-col items-center text-center px-2 md:px-6"
            >
              <h3 className="title-section">
                <Link
                  href={writing.href}
                  className="hover:text-stone"
                >
                  {writing.title}
                </Link>
              </h3>
              <p className="font-[family-name:var(--font-vollkorn)] italic text-stone text-base leading-[1.55] mt-4 max-w-sm">
                {teaser}
              </p>
              <Link
                href={writing.href}
                className="link-draw mt-6 label-caps text-stone hover:text-ink"
              >
                Read essay
              </Link>
            </article>
          ))}
        </div>

        <div className="text-center mt-16 md:mt-20">
          <Link
            href="/writings"
            className="link-draw label-caps text-stone hover:text-ink"
          >
            All writings
          </Link>
        </div>
      </Container>
    </section>
  );
}
