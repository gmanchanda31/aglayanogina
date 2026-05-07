import { ArtworkCard } from "./artwork-card";
import type { BaseEntry, Entry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GridSlot {
  /** Tailwind grid-column-span class for desktop, e.g. "md:col-span-7" */
  colSpan: string;
  /** Aspect ratio class, e.g. "aspect-[4/5]" */
  aspect: string;
}

interface AsymmetricGridProps<T extends BaseEntry> {
  entries: T[];
  /** Slot pattern. If shorter than entries, the pattern repeats. */
  pattern: GridSlot[];
  /** Sizes attr per slot index — best-effort based on column span at md+ */
  sizesFor?: (slot: GridSlot, i: number) => string;
  /** Optional metadata extractor; default = first short metadata + year */
  getMedium?: (entry: T) => string | undefined;
  getYear?: (entry: T) => string | undefined;
  className?: string;
}

const DEFAULT_PATTERN: GridSlot[] = [
  { colSpan: "md:col-span-7", aspect: "aspect-[4/5]" },
  { colSpan: "md:col-span-5", aspect: "aspect-square" },
  { colSpan: "md:col-span-4", aspect: "aspect-[3/4]" },
  { colSpan: "md:col-span-5", aspect: "aspect-[4/5]" },
  { colSpan: "md:col-span-3", aspect: "aspect-square" },
  { colSpan: "md:col-span-6", aspect: "aspect-[3/2]" },
  { colSpan: "md:col-span-6", aspect: "aspect-[3/2]" },
  { colSpan: "md:col-span-12", aspect: "aspect-[16/9]" },
];

function defaultGetMedium(entry: BaseEntry): string | undefined {
  const e = entry as Partial<Entry>;
  return e.metadata?.find((m) => !/^\d{4}/.test(m.value))?.value;
}

function defaultGetYear(entry: BaseEntry): string | undefined {
  const e = entry as Partial<Entry>;
  return e.metadata?.find((m) => /\d{4}/.test(m.value))?.value;
}

function defaultSizes(slot: GridSlot): string {
  // Translate col-span-N to a viewport % at md+
  const m = slot.colSpan.match(/col-span-(\d+)/);
  const n = m ? parseInt(m[1], 10) : 12;
  const pct = Math.round((n / 12) * 100);
  return `(min-width: 768px) ${pct}vw, 100vw`;
}

export function AsymmetricGrid<T extends BaseEntry>({
  entries,
  pattern = DEFAULT_PATTERN,
  sizesFor,
  getMedium = defaultGetMedium,
  getYear = defaultGetYear,
  className,
}: AsymmetricGridProps<T>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-12 gap-y-14 md:gap-y-20 gap-x-8 md:gap-x-10 items-start",
        className,
      )}
    >
      {entries.map((entry, i) => {
        if (!entry.hero) return null;
        const slot = pattern[i % pattern.length];
        const sizes = sizesFor ? sizesFor(slot, i) : defaultSizes(slot);
        return (
          <ArtworkCard
            key={entry.slug}
            href={entry.href}
            image={entry.hero}
            title={entry.title}
            medium={getMedium(entry)}
            year={getYear(entry)}
            aspect={slot.aspect}
            sizes={sizes}
            className={slot.colSpan}
            size="md"
          />
        );
      })}
    </div>
  );
}
