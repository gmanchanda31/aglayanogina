"use client";

import { useState } from "react";
import { ArtTile } from "./art-tile";
import { GALLERY_SIZES } from "./gallery-grid";
import { Lightbox } from "./lightbox";
import { cn } from "@/lib/utils";
import type { ImageRef } from "@/lib/types";

interface PhotoMasonryProps {
  images: ImageRef[];
  className?: string;
  /** Whether the first row should load eagerly */
  eagerFirst?: boolean;
  /** Set title, shown in the lightbox caption */
  label?: string;
}

/** Tiles in the first row at sm+ */
const FIRST_ROW = 3;

/**
 * A photo set as the site-wide 4:5 grid, read left to right in Studio
 * order. Each tile opens the set's viewer, which shows the photo uncropped.
 */
export function PhotoMasonry({
  images,
  className,
  eagerFirst,
  label,
}: PhotoMasonryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div
        data-work-grid
        className={cn("grid grid-cols-2 sm:grid-cols-3 gap-1", className)}
      >
        {images.map((image, i) => (
          <figure key={image.src} data-grid-item>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Open ${image.alt} in viewer`}
              data-artwork-card
              data-lightbox-index={i}
              className="block w-full cursor-zoom-in"
            >
              <ArtTile
                image={image}
                sizes={GALLERY_SIZES}
                priority={eagerFirst && i < FIRST_ROW}
              />
            </button>
          </figure>
        ))}
      </div>

      <Lightbox
        images={images}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
        label={label}
      />
    </>
  );
}
