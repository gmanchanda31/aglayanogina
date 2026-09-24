import { Fragment } from "react";
import { ArtworkCard } from "./artwork-card";
import { ReflowItem, artTransitionName } from "@/components/motion/shared-art";
import type { BaseEntry, Entry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WorkGridProps<T extends BaseEntry> {
  entries: T[];
  /** Optional metadata extractor; default = first non-year metadata line */
  getMedium?: (entry: T) => string | undefined;
  getYear?: (entry: T) => string | undefined;
  /** Passed to each card for the card→detail morph */
  section?: "projects" | "exhibitions" | "illustrations";
  className?: string;
}

/**
 * Every card is one column wide at every breakpoint. Height follows each
 * artwork's own proportions — nothing is forced, nothing is cropped.
 */
const GRID_SIZES = "(min-width: 1200px) 360px, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 100vw";

/**
 * Metadata lines are labelled at the source (`buildMetadata` in lib/content.ts),
 * so match on the label. Matching on the shape of the value instead lets one
 * line satisfy both extractors and print twice under the caption.
 */
function lineFor(entry: BaseEntry, label: string): string | undefined {
  const e = entry as Partial<Entry>;
  return e.metadata?.find((m) => m.label === label)?.value;
}

function defaultGetMedium(entry: BaseEntry): string | undefined {
  return lineFor(entry, "Medium");
}

function defaultGetYear(entry: BaseEntry): string | undefined {
  return lineFor(entry, "Year");
}

export function WorkGrid<T extends BaseEntry>({
  entries,
  getMedium = defaultGetMedium,
  getYear = defaultGetYear,
  section,
  className,
}: WorkGridProps<T>) {
  return (
    <div
      data-work-grid
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-14 md:gap-y-16 items-start",
        className,
      )}
    >
      {entries.map((entry) => {
        if (!entry.hero) return null;
        const card = (
          <div data-grid-item>
            <ArtworkCard
              href={entry.href}
              image={entry.hero}
              title={entry.title}
              medium={getMedium(entry)}
              year={getYear(entry)}
              sizes={GRID_SIZES}
              section={section}
            />
          </div>
        );
        return section ? (
          <ReflowItem key={entry.slug} name={`card-${artTransitionName(entry.href)}`}>
            {card}
          </ReflowItem>
        ) : (
          <Fragment key={entry.slug}>{card}</Fragment>
        );
      })}
    </div>
  );
}
