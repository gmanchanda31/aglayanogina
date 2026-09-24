import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ImageRef } from "@/lib/types";

interface ArtTileProps {
  image: ImageRef;
  /** next/image sizes attribute — the tile's rendered width */
  sizes: string;
  priority?: boolean;
  /** Classes on the 4:5 box (focus rings etc.) */
  className?: string;
}

/**
 * The one grid tile, site-wide: a 4:5 box the image fills edge to edge.
 * Sanity images arrive pre-cut to 4:5 around her hotspot (`image.tile`);
 * anything else centre-crops. Full, uncropped art lives in the lightbox
 * and the detail hero — never here.
 */
export function ArtTile({ image, sizes, priority, className }: ArtTileProps) {
  return (
    <div className={cn("relative aspect-[4/5] overflow-hidden", className)}>
      <Image
        src={image.tile ?? image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        data-artwork-img
        className="object-cover"
      />
    </div>
  );
}
