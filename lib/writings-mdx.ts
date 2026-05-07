import type { ComponentType } from "react";

/**
 * Registry of writing slug → dynamic MDX import.
 * Each .mdx in content/writings/ has a matching entry here.
 */
const registry: Record<string, () => Promise<{ default: ComponentType }>> = {
  "afterlife": () => import("@/content/writings/afterlife.mdx"),
  "botanical-bridge": () => import("@/content/writings/botanical-bridge.mdx"),
  "3-stories-about-love": () => import("@/content/writings/3-stories-about-love.mdx"),
  "5-2-richard-bach-street": () => import("@/content/writings/5-2-richard-bach-street.mdx"),
  "yo-yo-and-despair": () => import("@/content/writings/yo-yo-and-despair.mdx"),
  "our-mirror-diaries": () => import("@/content/writings/our-mirror-diaries.mdx"),
  "vulcanization": () => import("@/content/writings/vulcanization.mdx"),
  "uno-duos-tres-cuatro": () => import("@/content/writings/uno-duos-tres-cuatro.mdx"),
  "its-a-sad-and-beautiful-world": () => import("@/content/writings/its-a-sad-and-beautiful-world.mdx"),
  "nest": () => import("@/content/writings/nest.mdx"),
  "instruction": () => import("@/content/writings/instruction.mdx"),
};

export function hasMdx(slug: string): boolean {
  return slug in registry;
}

export async function loadWritingMdx(slug: string): Promise<ComponentType | null> {
  const loader = registry[slug];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
