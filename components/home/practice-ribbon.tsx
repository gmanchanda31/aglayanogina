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
          className="label-caps text-stone text-center mb-8 md:mb-10"
        >
          The practice
        </h2>

        <ul className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {practiceTiles.map((tile) => (
            <li key={tile.label}>
              <Link
                href={tile.href}
                className="group block focus-visible:outline-none"
              >
                {tile.image ? (
                  <div className="relative aspect-square overflow-hidden border border-mist bg-paper">
                    <Image
                      src={tile.image.src}
                      alt={tile.image.alt}
                      fill
                      sizes="(min-width: 768px) 18vw, 45vw"
                      className="object-contain p-2 transition-opacity duration-300 group-hover:opacity-90"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-square border border-mist bg-[#F2EDE4] flex flex-col justify-end p-5 transition-colors duration-300 group-hover:bg-clay/10">
                    <p className="font-[family-name:var(--font-vollkorn)] italic text-lg md:text-[1.375rem] leading-tight text-ink">
                      {tile.cardLine}
                    </p>
                    {tile.cardSubline ? (
                      <p className="label-caps text-stone mt-2">{tile.cardSubline}</p>
                    ) : null}
                  </div>
                )}
                <p className="label-caps text-stone group-hover:text-ink transition-colors mt-3">
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
