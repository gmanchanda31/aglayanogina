import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import type { Entry, ImageRef } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RelatedLink {
  href: string;
  label: string;
  title: string;
}

interface EntryDetailProps {
  /** Either project / exhibition / illustration */
  entry: Entry;
  /** Section meta — used in breadcrumb and labels */
  sectionLabel: string;
  sectionHref: string;
  /** What we call the metadata stack column ("Project info", "Exhibition", etc.) */
  metaLabel?: string;
  /** Optional related/prev/next nav cards */
  prev?: RelatedLink;
  next?: RelatedLink;
}

/**
 * Gallery slot pattern. Only the column span matters now — image
 * aspect ratio is whatever the artwork naturally is, so vertical
 * portraits aren't cropped.
 */
const GALLERY_SPANS: string[] = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-8",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-12",
  "md:col-span-5",
  "md:col-span-7",
];

function sizesForSpan(span: string): string {
  const m = span.match(/col-span-(\d+)/);
  const n = m ? parseInt(m[1], 10) : 12;
  const pct = Math.round((n / 12) * 100);
  return `(min-width: 768px) ${pct}vw, 100vw`;
}

export function EntryDetail({
  entry,
  sectionLabel,
  sectionHref,
  metaLabel = "Details",
  prev,
  next,
}: EntryDetailProps) {
  const hero = entry.hero;
  const galleryImages: ImageRef[] = entry.images.slice(1);
  const standFirst = entry.description[0];
  const restDescription = entry.description.slice(1);

  return (
    <>
      <Container className="pt-10 md:pt-12 pb-3">
        <Breadcrumbs
          items={[
            { label: sectionLabel, href: sectionHref },
            { label: entry.title },
          ]}
        />
      </Container>

      {/* HERO — natural-aspect rendering so vertical artworks aren't cropped */}
      {hero ? (
        <Container className="pt-6 md:pt-10">
          <figure className="mx-auto w-full max-w-[1000px] flex justify-center">
            <div className="border border-mist bg-mist/40 inline-flex">
              <Image
                src={hero.src}
                alt={hero.alt}
                width={hero.width}
                height={hero.height}
                priority
                sizes="(min-width: 1200px) 1000px, (min-width: 768px) 90vw, 100vw"
                className="block w-auto h-auto max-w-full max-h-[85vh]"
              />
            </div>
          </figure>
        </Container>
      ) : null}

      {/* TITLE + METADATA */}
      <Container className="pt-16 md:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          <div className="md:col-span-8">
            <h1 className="font-[family-name:var(--font-vollkorn)] text-[3.25rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] leading-[1] tracking-tight">
              {entry.title}
            </h1>
            {entry.metadata[0] ? (
              <p className="label-caps text-stone mt-6">{entry.metadata[0].value}</p>
            ) : null}
          </div>

          {entry.metadata.length > 1 ? (
            <aside
              className="md:col-span-4 md:pt-4"
              aria-label={metaLabel}
            >
              <p className="label-caps text-stone mb-4">{metaLabel}</p>
              <dl className="divide-y divide-mist border-y border-mist">
                {entry.metadata.slice(1).map((m, i) => (
                  <div key={i} className="py-3">
                    {m.label ? (
                      <dt className="label-caps text-stone text-[11px]">{m.label}</dt>
                    ) : null}
                    <dd className="text-ink text-base leading-[1.55]">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          ) : null}
        </div>
      </Container>

      {/* DESCRIPTION */}
      {(standFirst || restDescription.length > 0) ? (
        <Container className="pt-16 md:pt-24 pb-4">
          <div className="max-w-[640px] mx-auto">
            {standFirst ? (
              <p className="font-[family-name:var(--font-vollkorn)] italic text-xl md:text-[1.5rem] leading-[1.5] text-ink">
                {standFirst}
              </p>
            ) : null}
            {restDescription.map((para, i) => (
              <p
                key={i}
                className="text-ink text-base md:text-[1.0625rem] leading-[1.7] mt-6"
              >
                {para}
              </p>
            ))}
          </div>
        </Container>
      ) : null}

      {/* PULL QUOTE */}
      {entry.pullQuote ? (
        <Container className="border-t border-mist mt-16 md:mt-24">
          <div className="py-20 md:py-28 max-w-[760px] mx-auto text-center">
            <blockquote
              className={cn(
                "font-[family-name:var(--font-vollkorn)] italic leading-[1.4]",
                "text-[1.625rem] md:text-[2.25rem] text-ink",
              )}
            >
              “{entry.pullQuote}”
            </blockquote>
            {entry.quoteAttribution ? (
              <p className="label-caps text-stone mt-8">— {entry.quoteAttribution}</p>
            ) : null}
          </div>
        </Container>
      ) : null}

      {/* GALLERY — natural-aspect images, no cropping */}
      {galleryImages.length > 0 ? (
        <Container className={cn(entry.pullQuote ? "border-t border-mist" : "", "pt-16 md:pt-20")}>
          <p className="label-caps text-stone mb-10 md:mb-12">Gallery</p>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-y-16 gap-x-8 md:gap-x-10 items-start">
            {galleryImages.map((image, i) => {
              const colSpan = GALLERY_SPANS[i % GALLERY_SPANS.length];
              return (
                <figure key={image.src} className={colSpan}>
                  <div className="border border-mist bg-mist/40 flex justify-center">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes={sizesForSpan(colSpan)}
                      className="block w-full h-auto"
                    />
                  </div>
                </figure>
              );
            })}
          </div>
        </Container>
      ) : null}

      {/* PREV / NEXT */}
      {prev || next ? (
        <Container className="border-t border-mist mt-24 md:mt-32">
          <nav
            aria-label={`More ${sectionLabel.toLowerCase()}`}
            className="py-12 grid grid-cols-2 gap-4"
          >
            <div>
              {prev ? (
                <Link
                  href={prev.href}
                  className="group inline-flex flex-col gap-1 text-left hover:text-ink"
                >
                  <span className="label-caps text-stone inline-flex items-center gap-1.5">
                    <ArrowLeft className="size-3.5" /> {prev.label}
                  </span>
                  <span className="font-[family-name:var(--font-vollkorn)] italic text-2xl text-stone group-hover:text-ink transition-colors">
                    {prev.title}
                  </span>
                </Link>
              ) : null}
            </div>
            <div className="flex justify-end">
              {next ? (
                <Link
                  href={next.href}
                  className="group inline-flex flex-col gap-1 text-right hover:text-ink"
                >
                  <span className="label-caps text-stone inline-flex items-center gap-1.5 self-end">
                    {next.label} <ArrowRight className="size-3.5" />
                  </span>
                  <span className="font-[family-name:var(--font-vollkorn)] italic text-2xl text-stone group-hover:text-ink transition-colors">
                    {next.title}
                  </span>
                </Link>
              ) : null}
            </div>
          </nav>
        </Container>
      ) : null}
    </>
  );
}
