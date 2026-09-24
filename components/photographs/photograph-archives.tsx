"use client";

import { useState } from "react";
import Link from "next/link";
import { PhotoMasonry } from "@/components/artwork/photo-masonry";
import { Tabs } from "@/components/layout/tabs";
import type { PhotographSet } from "@/lib/types";

/** The index previews each archive; the full set lives on its own page. */
const PREVIEW_COUNT = 9;

/**
 * Photograph archives behind the same tab row as /projects: "All" previews
 * every archive, a single archive shows all of its photographs.
 */
export function PhotographArchives({ sets }: { sets: PhotographSet[] }) {
  const [active, setActive] = useState<string>("all");
  const total = sets.reduce((n, s) => n + s.images.length, 0);
  const visible = active === "all" ? sets : sets.filter((s) => s.routeSlug === active);

  return (
    <>
      <Tabs
        label="Photograph archives"
        items={[
          { key: "all", label: "All", count: total },
          ...sets.map((s) => ({ key: s.routeSlug, label: s.title, count: s.images.length })),
        ]}
        active={active}
        onSelect={setActive}
      />

      <div className="mt-block space-y-section">
        {visible.map((set, idx) => {
          const preview = active === "all";
          return (
            <section key={set.slug} aria-labelledby={`${set.routeSlug}-heading`}>
              {preview ? (
                <h2 id={`${set.routeSlug}-heading`} className="type-heading text-ink mb-tight">
                  <Link href={set.href}>{set.title}</Link>
                </h2>
              ) : (
                <h2 id={`${set.routeSlug}-heading`} className="sr-only">
                  {set.title}
                </h2>
              )}

              <PhotoMasonry
                images={preview ? set.images.slice(0, PREVIEW_COUNT) : set.images}
                eagerFirst={idx === 0}
                // Nine fills 3 × 3; at 2 columns drop the odd one out
                className={preview ? "max-sm:[&>*:nth-child(n+9)]:hidden" : undefined}
                label={set.title}
              />

              {preview && set.images.length > PREVIEW_COUNT ? (
                <Link href={set.href} className="link-draw type-ui text-ink mt-tight inline-block">
                  View all {set.images.length}
                </Link>
              ) : null}
            </section>
          );
        })}
      </div>
    </>
  );
}
