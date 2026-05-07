import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { featuredProject } from "@/lib/home";

export function FeaturedProject() {
  if (!featuredProject) return null;
  const { project, teaser, exhibitionLine } = featuredProject;

  const medium = project.metadata.find((m) => m.label === "Medium")?.value;
  const years = project.metadata.find((m) => m.label === "Year")?.value;

  return (
    <section
      aria-labelledby="featured-heading"
      className="border-t border-mist"
    >
      {/* Eyebrow */}
      <Container className="pt-16 md:pt-20 pb-10 md:pb-12">
        <p className="label-caps text-stone text-center">Currently on view</p>
      </Container>

      {/* Full-bleed cinematic hero */}
      {project.hero ? (
        <figure className="relative w-full overflow-hidden bg-mist/40">
          <div className="relative w-full aspect-[3/2] md:aspect-[21/9]">
            <Image
              src={project.hero.src}
              alt={project.hero.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </figure>
      ) : null}

      {/* Title block + metadata */}
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          <div className="md:col-span-7">
            <h2
              id="featured-heading"
              className="font-[family-name:var(--font-vollkorn)] text-5xl md:text-6xl lg:text-7xl tracking-tight text-ink leading-[1]"
            >
              {project.title}
            </h2>
            <p className="font-[family-name:var(--font-vollkorn)] italic text-stone text-xl md:text-[1.5rem] leading-[1.4] mt-6 max-w-xl">
              {teaser}
            </p>
            <Link
              href={project.href}
              className="group inline-flex items-center gap-2 mt-10 px-7 py-3 border border-ink text-ink label-caps hover:bg-ink hover:text-paper transition-colors duration-300"
            >
              View the project
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <dl className="md:col-span-5 md:pt-6 grid grid-cols-1 gap-y-5 divide-y divide-mist border-y border-mist">
            {medium ? (
              <div className="pt-5 first:pt-0">
                <dt className="label-caps text-stone">Medium</dt>
                <dd className="text-ink text-base mt-2 leading-[1.55]">{medium}</dd>
              </div>
            ) : null}
            {years ? (
              <div className="pt-5">
                <dt className="label-caps text-stone">Years</dt>
                <dd className="text-ink text-base mt-2">{years}</dd>
              </div>
            ) : null}
            {exhibitionLine ? (
              <div className="pt-5 pb-5">
                <dt className="label-caps text-stone">Exhibition</dt>
                <dd className="text-ink text-base mt-2 leading-[1.55]">{exhibitionLine}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </Container>
    </section>
  );
}
