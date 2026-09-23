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
      <ArtworkImage
        image={image}
        sizes={sizes}
        priority={priority}
        className="transition-opacity duration-300 group-hover:opacity-90"
      />
      <ArtworkCaption title={title} medium={medium} year={year} size={size} />
    </Link>
  );
}
