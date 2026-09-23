import Image from "next/image";
import { LightboxTrigger } from "./lightbox-group";
import type { ImageRef } from "@/lib/types";

interface GalleryGridProps {
  images: ImageRef[];
  /** Lightbox index of the first image (the hero sits at 0) */
  startIndex?: number;
  /** Total images in the viewer, for the trigger labels */
  total: number;
}

/** Same column widths and gaps as WorkGrid, so detail and listing pages share a rhythm. */
const GALLERY_SIZES = "(min-width: 1200px) 360px, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 100vw";

/**
 * Detail-page gallery: one uniform grid, every image at its own proportions,
 * each opening the page's LightboxGroup. Must render inside a LightboxGroup.
 */
export function GalleryGrid({ images, startIndex = 0, total }: GalleryGridProps) {
  return (
    <div
      data-work-grid
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-14 md:gap-y-16 items-start"
    >
      {images.map((image, i) => (
        <figure key={image.src} data-grid-item>
          <LightboxTrigger
            index={startIndex + i}
            label={`Open image ${startIndex + i + 1} of ${total} in viewer`}
            className="w-full"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes={GALLERY_SIZES}
              data-artwork-img
              className="block w-full h-auto"
            />
          </LightboxTrigger>
        </figure>
      ))}
    </div>
  );
}
