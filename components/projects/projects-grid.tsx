"use client";

import { useMemo, useState } from "react";
import { AsymmetricGrid } from "@/components/artwork/asymmetric-grid";
import { cn } from "@/lib/utils";
import type { ProjectEntry, ProjectKind } from "@/lib/types";

const PATTERN = [
  { colSpan: "md:col-span-7", aspect: "aspect-[4/5]" },
  { colSpan: "md:col-span-5", aspect: "aspect-square" },
  { colSpan: "md:col-span-4", aspect: "aspect-[3/4]" },
  { colSpan: "md:col-span-5", aspect: "aspect-[4/5]" },
  { colSpan: "md:col-span-3", aspect: "aspect-square" },
  { colSpan: "md:col-span-6", aspect: "aspect-[3/2]" },
  { colSpan: "md:col-span-6", aspect: "aspect-[3/2]" },
  { colSpan: "md:col-span-12", aspect: "aspect-[16/9]" },
];

const FILTERS: Array<{ label: string; kind: ProjectKind | "All" }> = [
  { label: "All", kind: "All" },
  { label: "Print", kind: "Print" },
  { label: "Painting", kind: "Painting" },
  { label: "Ceramic", kind: "Ceramic" },
  { label: "Sculpture", kind: "Sculpture" },
  { label: "Photography", kind: "Photography" },
];

interface Props {
  projects: ProjectEntry[];
}

export function ProjectsGrid({ projects }: Props) {
  const [active, setActive] = useState<ProjectKind | "All">("All");

  // Only show filters that match at least one project
  const availableFilters = useMemo(() => {
    return FILTERS.filter((f) => {
      if (f.kind === "All") return true;
      return projects.some((p) => p.kinds.includes(f.kind as ProjectKind));
    });
  }, [projects]);

  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter((p) => p.kinds.includes(active));
  }, [projects, active]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {availableFilters.map(({ label, kind }) => {
          const isActive = active === kind;
          const count =
            kind === "All"
              ? projects.length
              : projects.filter((p) => p.kinds.includes(kind as ProjectKind)).length;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActive(kind)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex items-center label-caps px-3.5 py-1.5 border transition-colors",
                isActive
                  ? "border-clay text-ink"
                  : "border-mist text-stone hover:border-stone hover:text-ink",
              )}
            >
              {label}
              <span className={cn("ml-2", isActive ? "text-clay" : "text-stone/60")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-12 md:mt-16">
        {filtered.length > 0 ? (
          <AsymmetricGrid entries={filtered} pattern={PATTERN} />
        ) : (
          <p className="font-[family-name:var(--font-vollkorn)] italic text-stone text-xl py-16">
            No projects under {active}. Try another filter.
          </p>
        )}
      </div>
    </>
  );
}
