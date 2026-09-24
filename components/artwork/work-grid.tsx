import { Fragment } from "react";
import { ArtworkCard } from "./artwork-card";
import { ReflowItem, artTransitionName } from "@/components/motion/shared-art";
import type { BaseEntry, Entry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WorkGridProps<T extends BaseEntry> {
  entries: T[];
  /** Optional metadata extractor; default = the "Year" metadata line */
  getYear?: (entry: T) => string | undefined;
  /** Passed to each card for the card→detail morph */
  section?: "projects" | "exhibitions" | "illustrations";
  className?: string;
}

/**
 * Listings: 2 columns, 3 from lg. Every card is the same 4:5 tile plus a
 * two-line caption, so every row is the same height.
 */
const GRID_SIZES = "(min-width: 1200px) 376px, (min-width: 1024px) 32vw, 50vw";
/** Cards in the first row at lg load eagerly (the LCP candidates). */
const PRIORITY_COUNT = 3;

/**
 * Metadata lines are labelled at the source (`buildMetadata` in lib/content.ts),
 * so match on the label. Matching on the shape of the value instead lets one
 * line satisfy both extractors and print twice under the caption.
 */
function lineFor(entry: BaseEntry, label: string): string | undefined {
  const e = entry as Partial<Entry>;
  return e.metadata?.find((m) => m.label === label)?.value;
}

function defaultGetYear(entry: BaseEntry): string | undefined {
  return lineFor(entry, "Year");
}

export function WorkGrid<T extends BaseEntry>({
  entries,
  getYear = defaultGetYear,
  section,
  className,
}: WorkGridProps<T>) {
  return (
    <div
      data-work-grid
      className={cn(
        "grid grid-cols-2 lg:grid-cols-3 gap-1",
        className,
      )}
    >
      {entries.map((entry, i) => {
        if (!entry.hero) return null;
        const card = (
          <div data-grid-item>
            <ArtworkCard
              href={entry.href}
              image={entry.hero}
              title={entry.title}
              year={getYear(entry)}
              sizes={GRID_SIZES}
              priority={i < PRIORITY_COUNT}
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
