import { cn } from "@/lib/utils";

interface ArtworkCaptionProps {
  title: string;
  medium?: string;
  year?: string;
  className?: string;
}

export function ArtworkCaption({
  title,
  medium,
  year,
  className,
}: ArtworkCaptionProps) {
  return (
    <div className={cn("mt-3 space-y-1", className)}>
      <h3 className="type-heading text-ink">{title}</h3>
      {medium ? (
        <p className="type-meta text-stone">{medium}</p>
      ) : null}
      {year ? (
        <p className="type-meta text-stone nums">{year}</p>
      ) : null}
    </div>
  );
}
