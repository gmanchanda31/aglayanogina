import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ImageRef } from "@/lib/types";

interface ArtworkImageProps {
  image: ImageRef;
  /** next/image sizes attribute for responsive image loading */
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Motion hook — marks the artwork <img> inside a card */
  "data-artwork-img"?: boolean;
}

/**
 * Renders an artwork at its own proportions — no frame, no background box,
 * no forced aspect ratio. The image fills the column width and takes
 * whatever height its intrinsic ratio gives it.
 */
export function ArtworkImage({
  image,
  sizes,
  priority,
  className,
  ...rest
}: ArtworkImageProps) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      priority={priority}
      className={cn("block w-full h-auto", className)}
      {...rest}
    />
  );
}
