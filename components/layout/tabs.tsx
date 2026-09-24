"use client";

import { cn } from "@/lib/utils";

export interface TabItem<K extends string> {
  key: K;
  label: string;
  count: number;
}

interface TabsProps<K extends string> {
  items: ReadonlyArray<TabItem<K>>;
  active: K;
  onSelect: (key: K) => void;
  label: string;
}

/**
 * The one tab/filter row used on every list page (projects, photographs):
 * plain text, same size and colour; the active tab is underlined, the others
 * draw the underline on hover.
 */
export function Tabs<K extends string>({ items, active, onSelect, label }: TabsProps<K>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-x-6 gap-y-1">
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            aria-pressed={isActive}
            className="group inline-flex items-baseline min-h-11 md:min-h-9 type-ui text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
          >
            <span
              className={cn(
                "relative pb-0.5",
                "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-ink after:origin-left after:transition-[scale] after:duration-(--dur-base) after:ease-(--ease-gallery)",
                isActive ? "after:scale-x-100" : "after:scale-x-0 group-hover:after:scale-x-100",
              )}
            >
              {item.label}
            </span>
            <span className="ml-1.5 nums">{item.count}</span>
          </button>
        );
      })}
    </div>
  );
}
