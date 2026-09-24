"use client";

import { addTransitionType, startTransition, useMemo, useState } from "react";
import { WorkGrid } from "@/components/artwork/work-grid";
import { FILTER_TRANSITION } from "@/components/motion/shared-art";
import { cn } from "@/lib/utils";
import type { ProjectEntry, ProjectKind } from "@/lib/types";

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
              onClick={() =>
                startTransition(() => {
                  addTransitionType(FILTER_TRANSITION);
                  setActive(kind);
                })
              }
              aria-pressed={isActive}
              className={cn(
                "inline-flex items-center min-h-11 md:min-h-9 type-ui px-4 border transition-colors",
                isActive
                  ? "border-clay text-ink"
                  : "border-mist text-stone hover:border-stone hover:text-ink",
              )}
            >
              {label}
              <span className={cn("ml-2 nums", isActive ? "text-clay" : "text-stone/60")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-12 md:mt-16" data-filter-state={active}>
        {filtered.length > 0 ? (
          <WorkGrid entries={filtered} section="projects" />
        ) : (
          <p className="type-lead text-stone py-16">
            No projects under {active}. Try another filter.
          </p>
        )}
      </div>
    </>
  );
}
