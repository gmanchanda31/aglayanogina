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
      <Container className="py-24 md:py-32">
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
              className="flex flex-col items-center text-center px-2 md:px-6"
            >
              <h3 className="font-[family-name:var(--font-vollkorn)] text-3xl md:text-[2.25rem] leading-tight">
                <Link
                  href={writing.href}
                  className="hover:text-clay transition-colors"
                >
                  {writing.title}
                </Link>
              </h3>
              <p className="font-[family-name:var(--font-vollkorn)] italic text-stone text-lg md:text-xl leading-[1.5] mt-6 max-w-sm">
                {teaser}
              </p>
              <Link
                href={writing.href}
                className="mt-8 label-caps text-stone hover:text-ink border-b border-stone hover:border-ink pb-1 transition-colors"
              >
                Read essay
              </Link>
            </article>
          ))}
        </div>

        <div className="text-center mt-16 md:mt-20">
          <Link
            href="/writings"
            className="label-caps text-stone hover:text-ink border-b border-stone hover:border-ink pb-1 transition-colors"
          >
            All writings
          </Link>
        </div>
      </Container>
    </section>
  );
}
