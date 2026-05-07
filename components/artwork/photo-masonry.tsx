import Image from "next/image";
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
  return (
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
          <div className="relative w-full overflow-hidden bg-mist/40 border border-mist">
            <Image
              src={image.src}
              alt={image.alt}
              width={1200}
              height={1600}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              priority={eagerFirst && i === 0}
              className="w-full h-auto block"
            />
          </div>
        </figure>
      ))}
    </div>
  );
}
