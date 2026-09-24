"use client";

import { addTransitionType, startTransition, useMemo, useState } from "react";
import { WorkGrid } from "@/components/artwork/work-grid";
import { FILTER_TRANSITION } from "@/components/motion/shared-art";
import { Tabs } from "@/components/layout/tabs";
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
      <Tabs
        label="Filter projects"
        items={availableFilters.map(({ label, kind }) => ({
          key: kind,
          label,
          count:
            kind === "All"
              ? projects.length
              : projects.filter((p) => p.kinds.includes(kind as ProjectKind)).length,
        }))}
        active={active}
        onSelect={(kind) =>
          startTransition(() => {
            addTransitionType(FILTER_TRANSITION);
            setActive(kind);
          })
        }
      />

      <div className="mt-block" data-filter-state={active}>
        {filtered.length > 0 ? (
          <WorkGrid entries={filtered} section="projects" />
        ) : (
          <p className="type-lead text-ink py-section">
            No projects under {active}. Try another filter.
          </p>
        )}
      </div>
    </>
  );
}
