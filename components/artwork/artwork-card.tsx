import Link from "next/link";
import { ArtworkImage } from "./artwork-image";
import { ArtworkCaption } from "./artwork-caption";
import type { ImageRef } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ArtworkCardProps {
  href: string;
  image: ImageRef;
  title: string;
  medium?: string;
  year?: string;
  aspect?: string;
  sizes: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  className?: string;
}

export function ArtworkCard({
  href,
  image,
  title,
  medium,
  year,
  aspect,
  sizes,
  size,
  priority,
  className,
}: ArtworkCardProps) {
  return (
    <Link
      href={href}
      className={cn("group block focus-visible:outline-none", className)}
    >
      <div className="transition-opacity duration-300 group-hover:opacity-90">
        <ArtworkImage
          image={image}
          aspect={aspect}
          sizes={sizes}
          priority={priority}
        />
      </div>
      <ArtworkCaption title={title} medium={medium} year={year} size={size} />
    </Link>
  );
}
