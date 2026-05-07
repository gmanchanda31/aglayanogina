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
}

export function ArtworkImage({
  image,
  aspect = "aspect-[4/5]",
  sizes,
  priority,
  className,
  borderless,
}: ArtworkImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-mist/40",
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
        className="object-cover"
      />
    </div>
  );
}
