import { cn } from "@/lib/utils";

interface FilterChipsProps {
  options: ReadonlyArray<string>;
  active?: string;
  className?: string;
  /** Decorative — the design from Stitch shows them but no logic is wired. */
  decorative?: boolean;
}

export function FilterChips({
  options,
  active,
  className,
  decorative = true,
}: FilterChipsProps) {
  return (
    <ul
      role={decorative ? "presentation" : "tablist"}
      className={cn("flex flex-wrap items-center gap-3", className)}
    >
      {options.map((option) => {
        const isActive = option === active;
        return (
          <li key={option}>
            <span
              aria-disabled={decorative}
              className={cn(
                "inline-flex items-center label-caps px-3.5 py-1.5 border transition-colors",
                isActive
                  ? "border-clay text-ink"
                  : "border-mist text-stone",
              )}
            >
              {option}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
