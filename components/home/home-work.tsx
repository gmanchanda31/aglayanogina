import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SharedArt, artTransitionName } from "@/components/motion/shared-art";
import { homeWork } from "@/lib/home";
import { siteName } from "@/lib/site-config";

/**
 * One work on the wall — the page opens on the art, not on a name or a
 * sentence. Natural proportions (it's a single hero, not a grid tile), capped
 * so the wall label below it lands in the first screen. The image never
 * animates (it's the LCP); the label settles in behind it on first load.
 */
export function HomeWork() {
  if (!homeWork) return null;
  const { project, exhibitionLine } = homeWork;
  const hero = project.hero;
  const medium = project.metadata.find((m) => m.label === "Medium")?.value;
  const year = project.metadata.find((m) => m.label === "Year")?.value;

  return (
    <Container as="section" aria-label="Current work" className="pt-6 md:pt-8">
      {/* The header wordmark carries the name visually */}
      <h1 className="sr-only">{siteName}</h1>

      <Link href={project.href} data-dir="next" className="group block">
        {hero ? (
          <SharedArt name={artTransitionName(project.href)}>
            <Image
              src={hero.src}
              alt={hero.alt}
              width={hero.width}
              height={hero.height}
              priority
              sizes="(min-width: 1200px) 1100px, 92vw"
              // Width derived from the height budget × the image's own ratio,
              // so the box is reserved before the image loads (no layout shift)
              style={{ "--work-r": hero.width / hero.height } as React.CSSProperties}
              className="block h-auto max-w-full w-[min(100%,calc((100svh-var(--header-h)-8rem)*var(--work-r)))]"
            />
          </SharedArt>
        ) : null}

        <div className="mt-3">
          <p data-hero-step="1" className="type-ui text-ink group-hover:text-clay transition-colors">
            {project.title}
          </p>
          {medium || year ? (
            <p data-hero-step="2" className="type-meta text-stone">
              {[medium, year].filter(Boolean).join(", ")}
            </p>
          ) : null}
          {exhibitionLine ? (
            <p data-hero-step="3" className="type-meta text-stone">{exhibitionLine}</p>
          ) : null}
        </div>
      </Link>
    </Container>
  );
}
