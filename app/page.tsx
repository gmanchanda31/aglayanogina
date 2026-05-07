import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ArtworkCard } from "@/components/artwork/artwork-card";
import { getProject, getWriting, home, siteTagline } from "@/lib/content";

export default function HomePage() {
  // Featured projects for the "Currently / Recent" row
  const archipelago = getProject("archipelago");
  const lostBeauty = getProject("lost-beauty");
  const terraMemoria = getProject("terra-memoria-mundi");

  // Featured writing pull-quote (real Aglaya line)
  const featuredWriting = getWriting("afterlife");

  return (
    <>
      {/* HERO */}
      <Container className="py-20 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          <div className="md:col-span-5 md:pt-8">
            <p className="label-caps text-stone">Selected works · 2021 — 2025</p>
            <blockquote className="font-[family-name:var(--font-vollkorn)] italic mt-6 text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.05] text-ink">
              An archipelago — closely connected, separated by short distances.
            </blockquote>
            <p className="text-stone text-base leading-[1.65] mt-8 max-w-md">
              {siteTagline}
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 mt-10 px-7 py-3 border border-ink label-caps text-ink hover:bg-ink hover:text-paper transition-colors duration-300 group"
            >
              View selected works
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="md:col-span-7">
            {home.hero ? (
              <figure>
                <div className="relative aspect-[3/4] sm:aspect-[4/5] border border-mist bg-mist/40">
                  <Image
                    src={home.hero.src}
                    alt={home.hero.alt}
                    fill
                    priority
                    sizes="(min-width: 768px) 56vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4">
                  <p className="font-[family-name:var(--font-vollkorn)] italic text-lg text-ink">
                    Archipelago, in studio
                  </p>
                  <p className="label-caps text-stone mt-1">
                    Paper · Textile · Ink · Xerography
                  </p>
                  <p className="text-stone text-sm mt-1">2023 — 2025</p>
                </figcaption>
              </figure>
            ) : null}
          </div>
        </div>
      </Container>

      {/* DIVIDER */}
      <Container>
        <div className="border-t border-mist" />
      </Container>

      {/* CURRENTLY / RECENT */}
      <Container className="py-20 md:py-28">
        <header className="mb-12 md:mb-16 flex items-baseline justify-between gap-6">
          <h2 className="label-caps text-stone">Currently / Recent</h2>
          <Link
            href="/projects"
            className="label-caps text-stone hover:text-ink transition-colors border-b border-stone hover:border-ink pb-1"
          >
            All projects
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          {/* Large left */}
          {archipelago?.hero ? (
            <ArtworkCard
              href={archipelago.href}
              image={archipelago.hero}
              title={archipelago.title}
              medium={archipelago.metadata[0]?.value}
              year={archipelago.metadata.find((m) => /\d{4}/.test(m.value))?.value}
              aspect="aspect-[4/5]"
              sizes="(min-width: 768px) 55vw, 100vw"
              size="lg"
              className="md:col-span-7"
            />
          ) : null}

          <div className="md:col-span-5 flex flex-col gap-12 md:gap-16">
            {lostBeauty?.hero ? (
              <ArtworkCard
                href={lostBeauty.href}
                image={lostBeauty.hero}
                title={lostBeauty.title}
                medium={lostBeauty.metadata[0]?.value}
                year={lostBeauty.metadata.find((m) => /\d{4}/.test(m.value))?.value}
                aspect="aspect-square"
                sizes="(min-width: 768px) 38vw, 100vw"
              />
            ) : null}
            {terraMemoria?.hero ? (
              <ArtworkCard
                href={terraMemoria.href}
                image={terraMemoria.hero}
                title={terraMemoria.title}
                medium={terraMemoria.metadata[0]?.value}
                year={terraMemoria.metadata.find((m) => /\d{4}/.test(m.value))?.value}
                aspect="aspect-[3/2]"
                sizes="(min-width: 768px) 38vw, 100vw"
              />
            ) : null}
          </div>
        </div>
      </Container>

      {/* PULL-QUOTE — JOURNAL */}
      <Container className="border-t border-mist">
        <section className="py-20 md:py-28 flex justify-center">
          <div className="max-w-[640px] text-center">
            <p className="label-caps text-stone mb-8">From the journal</p>
            <blockquote className="font-[family-name:var(--font-vollkorn)] italic text-[1.625rem] md:text-[2rem] leading-[1.5] text-ink">
              “Female friendship holds a special place in my heart, imbued with
              immense energy. Each reunion brings a sense of peace and belonging.”
            </blockquote>
            {featuredWriting ? (
              <Link
                href={featuredWriting.href}
                className="inline-block mt-10 label-caps text-stone hover:text-ink border-b border-stone hover:border-ink pb-1 transition-colors"
              >
                Read the full essay — {featuredWriting.title}
              </Link>
            ) : (
              <Link
                href="/writings"
                className="inline-block mt-10 label-caps text-stone hover:text-ink border-b border-stone hover:border-ink pb-1 transition-colors"
              >
                Read the writings
              </Link>
            )}
          </div>
        </section>
      </Container>
    </>
  );
}
