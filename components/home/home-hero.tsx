import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { siteName } from "@/lib/site-config";
import { HERO_ITALIC, HERO_PORTRAIT, HERO_TAGLINE } from "@/lib/home";

export function HomeHero() {
  return (
    <Container className="py-16 md:py-20 lg:py-24">
      {/* The header wordmark carries the name visually; this keeps the
          document outline and SEO intact without a display-size heading. */}
      <h1 className="sr-only">{siteName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
        {/* Portrait — natural proportions, no frame, no crop */}
        <figure className="md:col-span-5">
          <Image
            src={HERO_PORTRAIT.src}
            alt={HERO_PORTRAIT.alt}
            width={HERO_PORTRAIT.width}
            height={HERO_PORTRAIT.height}
            priority
            sizes="(min-width: 768px) 40vw, 100vw"
            className="block w-full h-auto"
          />
        </figure>

        {/* Statement + CTAs */}
        <div className="md:col-span-7 flex flex-col items-start">
          {HERO_ITALIC ? (
            <p className="font-[family-name:var(--font-vollkorn)] italic text-ink text-lg md:text-xl leading-[1.5] max-w-[38ch]">
              {HERO_ITALIC}
            </p>
          ) : null}

          {HERO_TAGLINE ? (
            <p className={`label-caps text-stone max-w-md leading-[1.6] ${HERO_ITALIC ? "mt-6" : ""}`}>
              {HERO_TAGLINE}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-4 mt-8">
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
