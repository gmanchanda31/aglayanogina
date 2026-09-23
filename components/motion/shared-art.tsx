import { ViewTransition } from "react";

/** Transition type set by the /projects filter (see projects-grid.tsx) */
export const FILTER_TRANSITION = "filter";

/**
 * Stable per-work name from its detail href: `/projects/nest` → `art-projects-nest`.
 * The section is part of it because slugs repeat across sections.
 */
export function artTransitionName(href: string): string {
  const key = href
    .split("/")
    .filter(Boolean)
    .join("-")
    .replace(/[^a-zA-Z0-9_-]+/g, "-");
  return `art-${key}`;
}

/**
 * Wraps exactly one artwork image so it morphs between a listing card and
 * the detail hero. Only use where the name is unique on the page (not on
 * the home page, where one work can appear twice).
 */
export function SharedArt({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <ViewTransition name={name} share="art-morph" default="none">
      {children}
    </ViewTransition>
  );
}

/**
 * Wraps a whole grid card so a filter change glides survivors to their new
 * slots and fades the rest. Inert for every other kind of transition.
 */
export function ReflowItem({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <ViewTransition
      name={name}
      update={{ [FILTER_TRANSITION]: "art-reflow", default: "none" }}
      enter={{ [FILTER_TRANSITION]: "art-enter", default: "none" }}
      exit={{ [FILTER_TRANSITION]: "art-exit", default: "none" }}
      share="none"
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
