import Link from "next/link";
import { Container } from "@/components/layout/container";
import { STATEMENT_PARAGRAPHS } from "@/lib/home";

export function StatementBlock() {
  if (STATEMENT_PARAGRAPHS.length === 0) return null;
  return (
    <Container as="section" className="py-24 md:py-32">
      <div className="max-w-[720px] mx-auto text-center space-y-5 md:space-y-6">
        <span
          aria-hidden
          className="block w-12 h-px bg-clay mx-auto mb-10 md:mb-12"
        />
        {STATEMENT_PARAGRAPHS.map((para, i) => (
          <p
            key={i}
            className="font-[family-name:var(--font-vollkorn)] text-[1.25rem] md:text-[1.375rem] leading-[1.55] text-ink"
          >
            {para}
          </p>
        ))}
        <div className="pt-6">
          <Link
            href="/about"
            className="inline-block label-caps text-stone hover:text-ink border-b border-stone hover:border-ink pb-1 transition-colors"
          >
            More about Aglaya
          </Link>
        </div>
      </div>
    </Container>
  );
}
