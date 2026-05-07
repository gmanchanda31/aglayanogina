import { cn } from "@/lib/utils";

interface ArtworkCaptionProps {
  title: string;
  medium?: string;
  year?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const titleSizes: Record<NonNullable<ArtworkCaptionProps["size"]>, string> = {
  sm: "text-lg",
  md: "text-xl md:text-2xl",
  lg: "text-2xl md:text-3xl",
};

export function ArtworkCaption({
  title,
  medium,
  year,
  size = "md",
  className,
}: ArtworkCaptionProps) {
  return (
    <div className={cn("mt-4 space-y-1.5", className)}>
      <h3
        className={cn(
          "font-[family-name:var(--font-vollkorn)] italic leading-tight text-ink",
          titleSizes[size],
        )}
      >
        {title}
      </h3>
      {medium ? <p className="label-caps text-stone">{medium}</p> : null}
      {year ? <p className="text-stone text-sm">{year}</p> : null}
    </div>
  );
}
