import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { practiceTiles } from "@/lib/home";

export function PracticeRibbon() {
  return (
    <section aria-labelledby="practice-heading" className="border-y border-mist">
      <Container className="py-12 md:py-14">
        <h2
          id="practice-heading"
          className="type-meta text-stone text-center mb-8 md:mb-10"
        >
          The practice
        </h2>

        {/* Every tile shares one baseline and one maximum height; each image
            keeps its own proportions — nothing cropped, nothing boxed. */}
        <ul
          data-work-grid
          className="grid grid-cols-2 md:grid-cols-5 gap-x-4 md:gap-x-6 gap-y-8"
        >
          {practiceTiles.map((tile) => (
            <li key={tile.label} data-grid-item>
              <Link href={tile.href} className="group block">
                <div className={`flex items-end ${tile.image ? "h-32" : "min-h-0"} md:h-40`}>
                  {tile.image ? (
                    <Image
                      src={tile.image.src}
                      alt={tile.image.alt}
                      width={tile.image.width}
                      height={tile.image.height}
                      sizes="(min-width: 768px) 18vw, 45vw"
                      className="block w-auto h-auto max-w-full max-h-full transition-opacity duration-300 group-hover:opacity-90"
                    />
                  ) : (
                    <div>
                      <p className="type-lead text-ink">
                        {tile.cardLine}
                      </p>
                      {tile.cardSubline ? (
                        <p className="type-meta text-stone mt-1 nums">{tile.cardSubline}</p>
                      ) : null}
                    </div>
                  )}
                </div>
                <p className="type-ui text-stone group-hover:text-ink transition-colors mt-3">
                  {tile.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
