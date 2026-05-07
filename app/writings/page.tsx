import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { writings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writings",
  description:
    "Essays and short prose by Aglaya Nogina — purgatory waiting rooms, botanical bridges, mirror diaries, the small physics of remembering.",
};

export default function WritingsPage() {
  return (
    <>
      <Container className="pt-20 pb-12 md:pt-28 md:pb-16">
        <PageHeader
          eyebrow={`${writings.length} essays`}
          title="Writings"
        />
      </Container>

      <Container>
        <div className="border-t border-mist" />
      </Container>

      <Container className="py-12 md:py-16">
        <ul className="divide-y divide-mist">
          {writings.map((w) => (
            <li key={w.slug}>
              <Link
                href={w.href}
                className="group block py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 items-baseline"
              >
                <p className="md:col-span-2 label-caps text-stone">Essay</p>
                <div className="md:col-span-8">
                  <h2 className="font-[family-name:var(--font-vollkorn)] text-3xl md:text-4xl leading-[1.15] text-ink group-hover:text-clay transition-colors">
                    {w.title}
                  </h2>
                  <p className="mt-3 text-stone text-base md:text-[1.0625rem] leading-[1.6] max-w-2xl">
                    {w.excerpt}
                    {w.excerpt && w.paragraphs[0] && w.excerpt.length === 200 ? "…" : ""}
                  </p>
                </div>
                <div className="md:col-span-2 flex md:justify-end">
                  <span className="label-caps text-stone group-hover:text-ink transition-colors inline-flex items-center gap-1">
                    Read
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
