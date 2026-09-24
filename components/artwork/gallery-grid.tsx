import { ArtTile } from "./art-tile";
import { LightboxTrigger } from "./lightbox-group";
import type { ImageRef } from "@/lib/types";

interface GalleryGridProps {
  images: ImageRef[];
  /** Lightbox index of the first image (the hero sits at 0) */
  startIndex?: number;
  /** Total images in the viewer, for the trigger labels */
  total: number;
}

/** 2 columns, 3 from sm — same tile and gap as every other grid. */
export const GALLERY_SIZES = "(min-width: 1200px) 376px, (min-width: 640px) 32vw, 50vw";

/**
 * Detail-page gallery: uniform 4:5 tiles, each opening the page's
 * LightboxGroup, where the work is shown uncropped. Must render inside a
 * LightboxGroup.
 */
export function GalleryGrid({ images, startIndex = 0, total }: GalleryGridProps) {
  return (
    <div data-work-grid className="grid grid-cols-2 sm:grid-cols-3 gap-1">
      {images.map((image, i) => (
        <figure key={image.src} data-grid-item>
          <LightboxTrigger
            index={startIndex + i}
            label={`Open image ${startIndex + i + 1} of ${total} in viewer`}
            className="w-full"
          >
            <ArtTile image={image} sizes={GALLERY_SIZES} />
          </LightboxTrigger>
        </figure>
      ))}
    </div>
  );
}
