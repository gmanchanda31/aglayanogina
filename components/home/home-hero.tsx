import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { HERO_ITALIC, HERO_PORTRAIT, HERO_TAGLINE } from "@/lib/home";

export function HomeHero() {
  return (
    <Container className="py-20 md:py-28 lg:py-32">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
        {/* Portrait */}
        <figure className="md:col-span-5">
          <div className="relative aspect-[3/4] border border-mist bg-mist/40">
            <Image
              src={HERO_PORTRAIT.src}
              alt={HERO_PORTRAIT.alt}
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </figure>

        {/* Name + statement + CTAs */}
        <div className="md:col-span-7 flex flex-col items-start">
          <h1
            className="font-[family-name:var(--font-vollkorn)] text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] leading-[0.95] tracking-tight text-ink"
          >
            AGLAYA
            <br />
            NOGINA
          </h1>

          <p className="font-[family-name:var(--font-vollkorn)] italic text-stone text-xl md:text-2xl lg:text-[1.625rem] leading-[1.4] mt-8 max-w-[36ch]">
            {HERO_ITALIC}
          </p>

          <p className="label-caps text-stone mt-8 max-w-md leading-[1.6]">
            {HERO_TAGLINE}
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 px-7 py-3 bg-ink text-paper label-caps hover:bg-clay transition-colors duration-300"
            >
              View selected works
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/writings"
              className="inline-flex items-center px-7 py-3 border border-ink text-ink label-caps hover:bg-ink hover:text-paper transition-colors duration-300"
            >
              Read the writings
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
