import Image from "next/image";
import { Container } from "@/components/layout/container";
import { about } from "@/lib/content";
import { HERO_PORTRAIT } from "@/lib/home";

/**
 * Aglaya's portrait beside who she is — the home page and the top of /about.
 * One font, one size, one colour: the only structure is the two columns.
 */
export function ArtistIntro({ heading }: { heading: React.ReactNode }) {
  const portrait = HERO_PORTRAIT;
  return (
    <Container className="pt-section">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-block items-start">
        <div className="md:col-span-7 max-w-2xl">
          {heading}
          <p className="type-body text-ink">{about.intro}</p>
          {about.paragraphs.map((para, i) => (
            <p key={i} className="type-body text-ink mt-block">
              {para}
            </p>
          ))}
        </div>
        <div className="md:col-span-5 max-md:row-start-1">
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            priority
            sizes="(min-width: 1200px) 480px, (min-width: 768px) 40vw, 100vw"
            className="block w-full h-auto"
          />
        </div>
      </div>
    </Container>
  );
}
