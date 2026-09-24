import Link from "next/link";
import { Container } from "@/components/layout/container";
import { HERO_BIO, STATEMENT_PARAGRAPHS } from "@/lib/home";

export function StatementBlock() {
  if (STATEMENT_PARAGRAPHS.length === 0 && !HERO_BIO) return null;
  return (
    <Container as="section" className="py-24 md:py-32">
      <div className="max-w-[720px] mx-auto text-center space-y-5 md:space-y-6">
        <span
          aria-hidden
          data-reveal="line"
          className="block w-12 h-px bg-clay mx-auto mb-10 md:mb-12"
        />
        {/* Desktop shows the bio beside the hero portrait instead */}
        {HERO_BIO ? (
          <p
            data-reveal="text"
            className="lg:hidden type-lead text-ink"
          >
            {HERO_BIO}
          </p>
        ) : null}
        {STATEMENT_PARAGRAPHS.map((para, i) => (
          <p
            key={i}
            data-reveal="text"
            className="type-lead text-ink"
          >
            {para}
          </p>
        ))}
        <div className="pt-6">
          <Link
            href="/about"
            className="link-draw inline-block type-ui text-stone hover:text-ink"
          >
            More about Aglaya
          </Link>
        </div>
      </div>
    </Container>
  );
}
