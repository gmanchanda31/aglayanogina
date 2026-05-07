import Link from "next/link";
import { Container } from "@/components/layout/container";
import { STATEMENT_PARAGRAPH } from "@/lib/home";

export function StatementBlock() {
  return (
    <Container as="section" className="py-24 md:py-32">
      <div className="max-w-[720px] mx-auto text-center">
        <span
          aria-hidden
          className="block w-12 h-px bg-clay mx-auto mb-10 md:mb-12"
        />
        <p className="font-[family-name:var(--font-vollkorn)] text-[1.375rem] md:text-[1.5rem] leading-[1.55] text-ink">
          {STATEMENT_PARAGRAPH}
        </p>
        <Link
          href="/about"
          className="inline-block mt-10 md:mt-12 label-caps text-stone hover:text-ink border-b border-stone hover:border-ink pb-1 transition-colors"
        >
          More about Aglaya
        </Link>
      </div>
    </Container>
  );
}
