import Link from "next/link";
import { ArtTile } from "./art-tile";
import { ArtworkCaption } from "./artwork-caption";
import { SharedArt, artTransitionName } from "@/components/motion/shared-art";
import type { ImageRef } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ArtworkCardProps {
  href: string;
  image: ImageRef;
  title: string;
  year?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Listing section — keys the card→detail image morph. Omit on home. */
  section?: "projects" | "exhibitions" | "illustrations";
}

export function ArtworkCard({
  href,
  image,
  title,
  year,
  sizes,
  priority,
  className,
  section,
}: ArtworkCardProps) {
  const img = (
    <ArtTile
      image={image}
      sizes={sizes}
      priority={priority}
      // Focus ring sits on the artwork itself, not around image + caption
      className="group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-clay"
    />
  );
  return (
    <Link
      href={href}
      data-artwork-card
      data-section={section}
      className={cn("group block focus-visible:outline-none", className)}
    >
      {section ? (
        <SharedArt name={artTransitionName(href)}>{img}</SharedArt>
      ) : (
        img
      )}
      <ArtworkCaption title={title} year={year} />
    </Link>
  );
}
