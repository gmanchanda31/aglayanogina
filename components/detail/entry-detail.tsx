import { getImageProps } from "next/image";
import { GalleryGrid } from "@/components/artwork/gallery-grid";
import { LightboxGroup, LightboxTrigger } from "@/components/artwork/lightbox-group";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PrevNext } from "@/components/layout/prev-next";
import { SharedArt, artTransitionName } from "@/components/motion/shared-art";
import type { Entry, ImageRef } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RelatedLink {
  href: string;
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
  // Hero opens the viewer at 0; gallery images follow it
  const viewerImages: ImageRef[] = hero ? [hero, ...galleryImages] : galleryImages;
  // A plain <img> (no onLoad, unlike next/image) lets React hold the
  // card→hero morph until the hero has decoded
  const heroProps = hero
    ? getImageProps({
        src: hero.src,
        alt: hero.alt,
        width: hero.width,
        height: hero.height,
        loading: "eager",
        fetchPriority: "high",
        sizes: "(min-width: 1200px) 1000px, (min-width: 768px) 90vw, 100vw",
        className: "block w-full h-auto",
      }).props
    : null;
  // Size the hero from its own ratio before it loads (no layout shift, and
  // the morph lands on the right box): as wide as the column allows, never
  // past its native width or 85% of the viewport height
  const heroBox = hero
    ? { width: `min(100%, ${hero.width}px, ${((hero.width / hero.height) * 85).toFixed(3)}vh)` }
    : undefined;

  return (
    <LightboxGroup images={viewerImages} label={entry.title}>
      <Container className="pt-10 md:pt-12 pb-3">
        <Breadcrumbs
          items={[
            { label: sectionLabel, href: sectionHref },
            { label: entry.title },
          ]}
        />
      </Container>

      {/* HERO — natural-aspect rendering so vertical artworks aren't cropped */}
      {hero && heroProps ? (
        <Container className="pt-6 md:pt-10">
          <figure className="mx-auto w-full max-w-[1000px] flex justify-center">
            <LightboxTrigger
              index={0}
              label={`Open ${entry.title} in viewer`}
              style={heroBox}
            >
              <SharedArt name={artTransitionName(entry.href)}>
                {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- props from getImageProps() */}
                <img {...heroProps} data-artwork-img />
              </SharedArt>
            </LightboxTrigger>
          </figure>
        </Container>
      ) : null}

      {/* TITLE + METADATA — small, centred, metadata stacked directly below */}
      <Container className="pt-10 md:pt-14">
        <div className="max-w-[640px] mx-auto text-center">
          <h1 className="title-page">
            {entry.title}
          </h1>

          {entry.metadata.length > 0 ? (
            <dl className="mt-4 space-y-1" aria-label={metaLabel}>
              {entry.metadata.map((m, i) => (
                <div
                  key={i}
                  className="flex flex-wrap justify-center items-baseline gap-x-2"
                >
                  {m.label ? (
                    <dt className="label-caps text-stone text-xs">{m.label}</dt>
                  ) : null}
                  <dd className="text-stone text-base leading-[1.55] nums">{m.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </Container>

      {/* DESCRIPTION */}
      {(standFirst || restDescription.length > 0) ? (
        <Container className="pt-14 md:pt-20 pb-4">
          <div className="max-w-[640px] mx-auto">
            {standFirst ? (
              <p className="font-[family-name:var(--font-vollkorn)] italic text-lg md:text-[1.25rem] leading-[1.55] text-ink">
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
        <Container className="border-t border-mist mt-14 md:mt-20">
          <div className="py-16 md:py-20 max-w-[700px] mx-auto text-center">
            <blockquote
              data-reveal="fade"
              className={cn(
                "font-[family-name:var(--font-vollkorn)] italic leading-[1.4]",
                "text-[1.25rem] md:text-[1.5rem] text-ink",
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

      {/* GALLERY — natural-aspect images, no cropping; each opens the viewer */}
      {galleryImages.length > 0 ? (
        <Container className={cn(entry.pullQuote ? "border-t border-mist" : "", "pt-16 md:pt-20")}>
          <p className="label-caps text-stone mb-10 md:mb-12">Gallery</p>
          <GalleryGrid
            images={galleryImages}
            startIndex={hero ? 1 : 0}
            total={viewerImages.length}
          />
        </Container>
      ) : null}

      {prev || next ? (
        <PrevNext
          prev={prev}
          next={next}
          indexHref={sectionHref}
          indexLabel={`All ${sectionLabel.toLowerCase()}`}
          label={`More ${sectionLabel.toLowerCase()}`}
        />
      ) : null}
    </LightboxGroup>
  );
}
