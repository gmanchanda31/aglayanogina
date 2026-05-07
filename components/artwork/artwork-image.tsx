import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ImageRef } from "@/lib/types";

interface ArtworkImageProps {
  image: ImageRef;
  /** Tailwind aspect-ratio class — e.g. "aspect-[4/5]", "aspect-square", "aspect-[3/2]" */
  aspect?: string;
  /** next/image sizes attribute for responsive image loading */
  sizes: string;
  priority?: boolean;
  className?: string;
  /** When true, omit the mist border */
  borderless?: boolean;
  /**
   * How the image fits its aspect-ratio container.
   *
   * - `contain` (default) — preserves the full artwork; paper-colored
   *   "mat" appears around images whose intrinsic aspect doesn't match
   *   the container. Right for art galleries: the work is never cropped.
   * - `cover` — fills the container, cropping as needed. Use only when
   *   the image will fit the container ratio (e.g. controlled stock).
   */
  fit?: "contain" | "cover";
}

export function ArtworkImage({
  image,
  aspect = "aspect-[4/5]",
  sizes,
  priority,
  className,
  borderless,
  fit = "contain",
}: ArtworkImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-paper",
        aspect,
        !borderless && "border border-mist",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={fit === "cover" ? "object-cover" : "object-contain"}
      />
    </div>
  );
}
