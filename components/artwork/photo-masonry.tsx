"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "./lightbox";
import { cn } from "@/lib/utils";
import type { ImageRef } from "@/lib/types";

interface PhotoMasonryProps {
  images: ImageRef[];
  className?: string;
  /** Whether the first image should load eagerly */
  eagerFirst?: boolean;
}

export function PhotoMasonry({
  images,
  className,
  eagerFirst,
}: PhotoMasonryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div
        className={cn(
          "columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 [column-fill:_balance]",
          className,
        )}
      >
        {images.map((image, i) => (
          <figure
            key={image.src}
            className="mb-4 md:mb-6 break-inside-avoid"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Open ${image.alt} in viewer`}
              className="group relative w-full overflow-hidden bg-mist/40 border border-mist block cursor-zoom-in"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={1200}
                height={1600}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                priority={eagerFirst && i === 0}
                className="w-full h-auto block transition-opacity duration-300 group-hover:opacity-90"
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
      />
    </>
  );
}
