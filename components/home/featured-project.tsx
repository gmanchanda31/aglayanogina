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
        <p className="type-meta text-stone text-center">Featured project</p>
      </Container>

      {/* Hero at its own proportions — no frame, no crop, no letterboxing */}
      {project.hero ? (
        <Container>
          <figure className="mx-auto w-full max-w-[1000px] flex justify-center">
            <Image
              src={project.hero.src}
              alt={project.hero.alt}
              width={project.hero.width}
              height={project.hero.height}
              sizes="(min-width: 1200px) 1000px, (min-width: 768px) 90vw, 100vw"
              className="block w-auto h-auto max-w-full max-h-[80vh]"
            />
          </figure>
        </Container>
      ) : null}

      {/* Title block + metadata */}
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          <div className="md:col-span-7" data-reveal="text">
            <h2
              id="featured-heading"
              className="type-heading text-ink"
            >
              {project.title}
            </h2>
            {teaser ? (
              <p className="type-lead text-stone mt-3 max-w-xl">
                {teaser}
              </p>
            ) : null}
            <Link
              href={project.href}
              data-dir="next"
              className="link-draw inline-flex items-center gap-2 mt-8 type-ui text-ink"
            >
              View the project
              <span data-arrow className="inline-flex">
                <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </Link>
          </div>

          <dl className="md:col-span-5 md:pt-2 grid grid-cols-1 gap-y-5">
            {medium ? (
              <div>
                <dt className="type-meta text-stone">Medium</dt>
                <dd className="type-meta text-ink mt-2">{medium}</dd>
              </div>
            ) : null}
            {years ? (
              <div>
                <dt className="type-meta text-stone">Years</dt>
                <dd className="type-meta text-ink mt-2 nums">{years}</dd>
              </div>
            ) : null}
            {exhibitionLine ? (
              <div>
                <dt className="type-meta text-stone">Exhibition</dt>
                <dd className="type-meta text-ink mt-2">{exhibitionLine}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </Container>
    </section>
  );
}
