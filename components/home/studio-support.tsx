import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { contact } from "@/lib/content";

/**
 * Home variant of the Patreon CTA. Distinct from <PatreonAppeal> on /about
 * because the layout is materially different — full-width row, lighter
 * paper-tinted background, and the button takes the right column.
 */
export function StudioSupport() {
  return (
    <section
      aria-label="Studio support"
      className="bg-[#FBFAF7] border-y border-mist"
    >
      <Container className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        <p className="md:col-span-2 label-caps text-ink">Studio support</p>

        <div className="md:col-span-7">
          <p className="font-[family-name:var(--font-vollkorn)] italic text-xl md:text-[1.625rem] leading-[1.45] text-ink">
            Aglaya&apos;s practice is supported by readers and patrons.
          </p>
          <p className="text-stone text-base md:text-[1.0625rem] leading-[1.65] mt-4 max-w-2xl">
            The art diary on Patreon shares early sketches, studio notes, work-in-progress
            photographs, and writing — the slower side of the practice. Joining helps her
            keep making.
          </p>
        </div>

        <div className="md:col-span-3 md:flex md:justify-end">
          <a
            href={contact.patreonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-7 py-4 bg-clay text-paper label-caps hover:bg-ink transition-colors duration-300"
          >
            Join the diary
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </Container>
    </section>
  );
}
