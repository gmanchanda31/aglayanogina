"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal], [data-grid-item]";
/** Longest we hold a reveal waiting for its image to decode */
const DECODE_TIMEOUT_MS = 600;
/** Stagger steps within one batch — beyond this, items arrive together */
const MAX_STAGGER_STEPS = 4;

function decoded(el: Element): Promise<void> {
  const img = el instanceof HTMLImageElement ? el : el.querySelector("img");
  if (!img || img.complete) return Promise.resolve();
  return Promise.race([
    img.decode().catch(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, DECODE_TIMEOUT_MS)),
  ]);
}

/**
 * One IntersectionObserver for the whole site. Elements already on screen
 * when they appear in the DOM are left alone — only those below (or above)
 * the viewport are marked `pending` and settle in when scrolled to. Items
 * entering together are staggered in visual order (top, then left), so
 * masonry columns and grid rows read naturally.
 */
export function MotionRuntime() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Automated browsers (crawlers' renderers, full-page screenshot tools)
    // never scroll, so they'd never see below-the-fold content revealed
    if (navigator.webdriver) return;
    const html = document.documentElement;
    html.dataset.motion = "on";

    const io = new IntersectionObserver(
      (entries) => {
        const batch = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({ el: e.target as HTMLElement, rect: e.boundingClientRect }))
          .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);
        if (batch.length === 0) return;
        for (const { el } of batch) io.unobserve(el);

        void Promise.all(batch.map(({ el }) => decoded(el))).then(() => {
          batch.forEach(({ el }, i) => {
            el.style.setProperty("--reveal-i", String(Math.min(i, MAX_STAGGER_STEPS)));
            el.dataset.revealState = "in";
          });
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const prepare = () => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (el.dataset.revealState) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          el.dataset.revealState = "static";
          return;
        }
        el.dataset.revealState = "pending";
        io.observe(el);
      });
    };

    prepare();

    // Soft navigations and client re-renders (filters, galleries) add nodes
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(prepare);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
      delete html.dataset.motion;
    };
  }, []);

  return null;
}
