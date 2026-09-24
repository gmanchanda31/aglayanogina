import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { siteName } from "@/lib/site-config";
import { HERO_BIO, HERO_ITALIC, HERO_META, HERO_PORTRAIT, HERO_TAGLINE } from "@/lib/home";
import { cn } from "@/lib/utils";

/**
 * Portrait and statement composed as one unit that fills the first screen.
 *
 * The portrait's width is derived from the height available to it
 * (viewport − header − the copy it has to leave room for) times its own
 * ratio, so it is never cropped and always has a box before it loads.
 * Desktop (lg+): portrait left, a compact wall label beside it —
 * statement, tagline, bio, places, links — optically centred on the image.
 * Mobile + tablet: stacked, portrait capped so the statement and both links
 * land in the fold; the bio moves to the statement block below.
 *
 * First load only, the copy settles in behind the portrait via
 * `data-hero-step` (Motion block, globals.css). The portrait never animates.
 */
export function HomeHero() {
  const ratio = HERO_PORTRAIT.width / HERO_PORTRAIT.height;
  const caption = HERO_PORTRAIT.caption;

  return (
    <Container
      as="section"
      aria-label="Introduction"
      className="lg:min-h-[calc(100svh-var(--header-h))] flex flex-col justify-center pt-8 pb-12 md:pt-12 lg:py-12"
    >
      {/* The header wordmark carries the name visually; this keeps the
          document outline and SEO intact without a display-size heading. */}
      <h1 className="sr-only">{siteName}</h1>

      <div className="flex flex-col lg:flex-row gap-y-7 md:gap-y-9 lg:gap-x-20">
        {/* Portrait — natural proportions, no frame, no crop */}
        <figure className="lg:shrink-0 lg:max-w-[55%]">
          <Image
            src={HERO_PORTRAIT.src}
            alt={HERO_PORTRAIT.alt}
            width={HERO_PORTRAIT.width}
            height={HERO_PORTRAIT.height}
            priority
            sizes="(min-width: 1200px) 600px, (min-width: 1024px) 55vw, 80vw"
            style={{ "--hero-r": ratio } as React.CSSProperties}
            className={cn(
              "block h-auto",
              "w-[min(100%,calc((100svh-var(--header-h)-17rem)*var(--hero-r)))]",
              "md:w-[min(100%,calc((100svh-var(--header-h)-20rem)*var(--hero-r)))]",
              "lg:w-[calc((100svh-var(--header-h)-8.5rem)*var(--hero-r))] lg:max-w-full",
            )}
          />
          {caption ? (
            <figcaption data-hero-step="4" className="type-meta text-stone mt-3">{caption}</figcaption>
          ) : null}
        </figure>

        {/* Copy — one compact wall label. On desktop it is centred on the
            portrait, lifted slightly above true centre (the bottom padding) so
            it doesn't read as sagging; the bio + places line only appear there
            (below lg the statement block carries the bio). */}
        <div className="flex flex-col lg:flex-1 lg:justify-center lg:pb-[8vh] lg:max-w-[26rem]">
          {HERO_ITALIC ? (
            <p
              data-hero-step="1"
              className="type-lead text-ink max-w-[22ch] text-balance"
            >
              {HERO_ITALIC}
            </p>
          ) : null}

          {HERO_TAGLINE ? (
            <p
              data-hero-step="2"
              className={cn("type-lead text-stone max-w-[34ch] text-balance", HERO_ITALIC && "mt-3 md:mt-4")}
            >
              {HERO_TAGLINE}
            </p>
          ) : null}

          {HERO_BIO ? (
            <p
              data-hero-step="3"
              className={cn(
                "hidden lg:block type-body text-stone max-w-[42ch]",
                (HERO_ITALIC || HERO_TAGLINE) && "mt-6",
              )}
            >
              {HERO_BIO}
            </p>
          ) : null}

          {HERO_META ? (
            <p
              data-hero-step="3"
              className={cn("hidden lg:block type-meta text-stone/70", (HERO_ITALIC || HERO_TAGLINE || HERO_BIO) && "mt-4")}
            >
              {HERO_META}
            </p>
          ) : null}

          <div
            data-hero-step="4"
            className={cn(
              "flex flex-col items-start gap-y-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8",
              (HERO_ITALIC || HERO_TAGLINE) && "mt-7",
              (HERO_BIO || HERO_META) && "lg:mt-8",
            )}
          >
            <Link
              href="/projects"
              data-dir="next"
              className="link-draw inline-flex items-center gap-2 type-ui text-ink"
            >
              View selected works
              <span data-arrow className="inline-flex">
                <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </Link>
            <Link href="/writings" className="link-draw type-ui text-stone hover:text-ink">
              Read the writings
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
