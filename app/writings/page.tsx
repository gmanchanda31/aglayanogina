import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getSectionPage, writings } from "@/lib/content";

const page = getSectionPage("writings", {
  eyebrow: `${writings.length} essays`,
  title: "Writings",
  intro:
    "Lyrical essays and short prose — sometimes companion pieces to the visual work, sometimes their own quiet thing.",
  metaDescription:
    "Essays and short prose by Aglaya Nogina — purgatory waiting rooms, botanical bridges, mirror diaries, the small physics of remembering.",
});

export const metadata: Metadata = {
  title: page.title,
  description: page.metaDescription,
};

export default function WritingsPage() {
  return (
    <>
      <Container className="pt-section pb-block">
        <PageHeader
          title={page.title}
          lede={page.intro}
        />
      </Container>

      <Container>
        <div className="border-t border-mist" />
      </Container>

      <Container>
        <ul className="divide-y divide-mist">
          {writings.map((w) => (
            <li key={w.slug}>
              <Link
                href={w.href}
                data-dir="next"
                className="group py-block grid grid-cols-1 md:grid-cols-12 gap-tight md:gap-x-block items-baseline"
              >
                <div className="md:col-span-10">
                  <h2 className="type-heading text-ink underline decoration-transparent decoration-1 underline-offset-4 group-hover:decoration-ink/40">
                    {w.title}
                  </h2>
                  <p className="type-body text-ink mt-tight max-w-2xl">
                    {w.excerpt}
                  </p>
                </div>
                <div className="md:col-span-2 flex md:justify-end">
                  <span className="type-ui text-ink inline-flex items-center gap-1.5">
                    Read
                    <span data-arrow className="inline-flex">
                      <ArrowRight className="size-3.5" aria-hidden />
                    </span>
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
