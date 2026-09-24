import { getImageProps } from "next/image";
import { GalleryGrid } from "@/components/artwork/gallery-grid";
import { LightboxGroup, LightboxTrigger } from "@/components/artwork/lightbox-group";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PrevNext } from "@/components/layout/prev-next";
import { SharedArt, artTransitionName } from "@/components/motion/shared-art";
import type { Entry, ImageRef } from "@/lib/types";

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
      <Container className="pt-block">
        <Breadcrumbs
          items={[
            { label: sectionLabel, href: sectionHref },
            { label: entry.title },
          ]}
        />
      </Container>

      {/* One left-aligned column: hero, title, details, description,
          quote, gallery. No labels or centred fragments — one font, one
          size, one colour; only spacing separates the parts. */}
      {hero && heroProps ? (
        <Container className="pt-block">
          <figure className="w-full max-w-[1000px] flex">
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

      <Container className="pt-block">
        <div className="max-w-[640px]">
          <h1 className="type-title">{entry.title}</h1>
          {entry.metadata.length > 0 ? (
            <dl aria-label={metaLabel}>
              {entry.metadata.map((m, i) => (
                <div key={i}>
                  {m.label ? <dt className="sr-only">{m.label}</dt> : null}
                  <dd className="type-meta text-ink nums">{m.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {entry.description.map((para, i) => (
            <p key={i} className="type-body text-ink mt-block">
              {para}
            </p>
          ))}

          {entry.pullQuote ? (
            <blockquote className="type-body text-ink mt-block">
              <p>“{entry.pullQuote}”</p>
              {entry.quoteAttribution ? <p>— {entry.quoteAttribution}</p> : null}
            </blockquote>
          ) : null}
        </div>
      </Container>

      {galleryImages.length > 0 ? (
        <Container className="pt-section">
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
