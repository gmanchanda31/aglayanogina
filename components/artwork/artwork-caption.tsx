import { cn } from "@/lib/utils";

interface ArtworkCaptionProps {
  title: string;
  year?: string;
  className?: string;
}

/**
 * Two fixed lines under a grid tile — title, then year — each truncated, so
 * every caption is the same height and rows stay even.
 */
export function ArtworkCaption({ title, year, className }: ArtworkCaptionProps) {
  return (
    <div className={cn("mt-2 mb-4 min-w-0", className)}>
      <h3 className="type-ui text-ink truncate">{title}</h3>
      <p className="type-meta text-ink nums truncate" aria-hidden={year ? undefined : true}>
        {year ?? " "}
      </p>
    </div>
  );
}
