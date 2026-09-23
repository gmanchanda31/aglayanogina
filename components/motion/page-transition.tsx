"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

/**
 * Keyed by pathname so every route change is an exit + enter of this
 * boundary — the old page fades out where it sat on screen, the new one
 * settles in. `default="none"` keeps same-route updates (filters, the
 * lightbox) from crossfading the whole page.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
