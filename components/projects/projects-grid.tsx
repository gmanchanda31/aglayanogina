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
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
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
              className="group inline-flex items-baseline min-h-11 md:min-h-9 type-ui focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              {/* Underline drawn like link-draw: full ink line when active */}
              <span
                className={cn(
                  "relative pb-0.5 transition-colors",
                  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-ink after:origin-left after:transition-[scale] after:duration-(--dur-base) after:ease-(--ease-gallery)",
                  isActive
                    ? "text-ink after:scale-x-100"
                    : "text-stone group-hover:text-ink after:scale-x-0 group-hover:after:scale-x-100",
                )}
              >
                {label}
              </span>
              <span className="ml-1.5 text-stone nums">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-block" data-filter-state={active}>
        {filtered.length > 0 ? (
          <WorkGrid entries={filtered} section="projects" />
        ) : (
          <p className="type-lead text-stone py-section">
            No projects under {active}. Try another filter.
          </p>
        )}
      </div>
    </>
  );
}
