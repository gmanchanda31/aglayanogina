import { cn } from "@/lib/utils";

interface ArtworkCaptionProps {
  title: string;
  medium?: string;
  year?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const titleSizes: Record<NonNullable<ArtworkCaptionProps["size"]>, string> = {
  sm: "text-[0.9375rem]",
  md: "text-base",
  lg: "text-[1.125rem]",
};

export function ArtworkCaption({
  title,
  medium,
  year,
  size = "md",
  className,
}: ArtworkCaptionProps) {
  return (
    <div className={cn("mt-3 space-y-1", className)}>
      <h3
        className={cn(
          "font-[family-name:var(--font-vollkorn)] italic leading-snug text-ink",
          titleSizes[size],
        )}
      >
        {title}
      </h3>
      {medium ? (
        <p className="text-stone text-[0.8125rem] leading-[1.5]">{medium}</p>
      ) : null}
      {year ? (
        <p className="text-stone text-[0.8125rem] leading-[1.5]">{year}</p>
      ) : null}
    </div>
  );
}
