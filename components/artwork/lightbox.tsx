"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ImageRef } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LightboxProps {
  images: ImageRef[];
  /** Index of the image to show, or null when closed */
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
  /** Title of the work or set — shown in the caption line */
  label?: string;
}

const FOCUSABLE = "button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])";

const controlClass = cn(
  "size-12 inline-flex items-center justify-center text-paper/70 hover:text-paper",
  "disabled:opacity-30 disabled:pointer-events-none",
  "focus-visible:outline-clay focus-visible:outline-2 focus-visible:outline-offset-2",
);

/* ── Motion ──────────────────────────────────────────────────────────────
   Open/close morph the thumbnail into the viewer and back; stepping
   crossfades the stage with an 8px drift in the direction of travel. All
   of it runs through document.startViewTransition — the CSS lives in the
   Motion block of globals.css, scoped by html[data-lb-vt]. Thumbnails are
   found by `[data-lightbox-index="<i>"] img`. */

const MORPH_NAME = "lb-photo";
const ROOT_NAME = "lightbox";
const STAGE_NAME = "lb-stage";
const UNDERLAY_DECODE_MS = 250;
/** Drag distance before we decide the gesture's axis */
const AXIS_LOCK_PX = 8;
/** Commit a horizontal swipe past this share of the width, or this speed */
const SWIPE_COMMIT_RATIO = 0.25;
const SWIPE_COMMIT_VELOCITY = 0.4; // px/ms
/** Commit a drag-down dismiss past this distance, or this speed */
const DISMISS_COMMIT_PX = 120;
const DISMISS_COMMIT_VELOCITY = 0.5; // px/ms
/** Rubber-band factor when dragging past the first/last image */
const EDGE_RESISTANCE = 0.3;
const BACKDROP_ALPHA = 0.95;

type LbTransition = "open" | "close" | "next" | "prev";

let vtToken = 0;

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canTransition(): boolean {
  return typeof document.startViewTransition === "function" && !reducedMotion();
}

function thumbFor(i: number | null): HTMLImageElement | null {
  if (i === null) return null;
  return document.querySelector<HTMLImageElement>(`[data-lightbox-index="${i}"] img`);
}

function inViewport(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

function settle(img: HTMLImageElement | null, ms: number): Promise<void> {
  if (!img || !img.getAttribute("src")) return Promise.resolve();
  return Promise.race([
    img.decode().catch(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  ]);
}

/** Run `update` inside a view transition tagged `kind` (or directly). */
function runTransition(
  kind: LbTransition,
  update: () => void | Promise<void>,
  cleanup?: () => void,
) {
  if (!canTransition()) {
    void update();
    cleanup?.();
    return;
  }
  const token = ++vtToken;
  const html = document.documentElement;
  html.dataset.lbVt = kind;
  const vt = document.startViewTransition(update);
  void vt.finished.finally(() => {
    cleanup?.();
    if (token === vtToken) delete html.dataset.lbVt;
  });
}

interface DragState {
  id: number;
  x0: number;
  y0: number;
  t0: number;
  axis: "x" | "y" | null;
  dx: number;
  dy: number;
}

export function Lightbox({ images, index, onClose, onIndexChange, label }: LightboxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const underlayRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const indexRef = useRef(index);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const open = index !== null;

  // Direction of travel for the current index change — motion reads data-dir
  const [prevIndex, setPrevIndex] = useState(index);
  const [dir, setDir] = useState<"prev" | "next" | undefined>(undefined);
  if (index !== prevIndex) {
    setDir(index !== null && prevIndex !== null ? (index > prevIndex ? "next" : "prev") : undefined);
    setPrevIndex(index);
  }

  // Latest index for handlers + the grid's cached thumbnail as an underlay,
  // so the stage is never empty while the full-size image decodes
  useLayoutEffect(() => {
    if (index === null) return;
    indexRef.current = index;
    const thumb = thumbFor(index);
    const underlay = underlayRef.current;
    if (underlay && thumb) {
      const src = thumb.currentSrc || thumb.src;
      if (underlay.getAttribute("src") !== src) underlay.src = src;
    }
  }, [index]);

  // Open: morph the clicked thumbnail into the viewer. The viewer is already
  // committed; keep it hidden for the old-state capture, reveal it inside.
  useLayoutEffect(() => {
    if (!open || !canTransition()) return;
    const root = rootRef.current;
    const box = boxRef.current;
    if (!root || !box) return;
    const thumb = thumbFor(indexRef.current);
    // Transparent rather than hidden, so focus can still move into it
    root.style.opacity = "0";
    if (thumb) thumb.style.viewTransitionName = MORPH_NAME;
    runTransition(
      "open",
      async () => {
        if (thumb) {
          thumb.style.viewTransitionName = "";
          box.style.viewTransitionName = MORPH_NAME;
        }
        root.style.opacity = "";
        root.style.viewTransitionName = ROOT_NAME;
        await settle(underlayRef.current, UNDERLAY_DECODE_MS);
      },
      () => {
        root.style.viewTransitionName = "";
        box.style.viewTransitionName = "";
      },
    );
  }, [open]);

  const close = useCallback(() => {
    const root = rootRef.current;
    const box = boxRef.current;
    const thumb = thumbFor(indexRef.current);
    if (root) root.style.viewTransitionName = ROOT_NAME;
    if (box && thumb) box.style.viewTransitionName = MORPH_NAME;
    runTransition(
      "close",
      () => {
        flushSync(onClose);
        if (thumb) {
          // Land back where the image you ended on sits in the grid
          if (!inViewport(thumb)) thumb.scrollIntoView({ block: "center", behavior: "instant" });
          thumb.style.viewTransitionName = MORPH_NAME;
        }
      },
      () => {
        if (thumb) thumb.style.viewTransitionName = "";
      },
    );
  }, [onClose]);

  const go = useCallback(
    (to: number) => {
      const from = indexRef.current;
      if (from === null || to === from || to < 0 || to >= images.length) return;
      const stage = stageRef.current;
      const root = rootRef.current;
      // The viewer is named too, so the header layer can't surface above it
      if (root) root.style.viewTransitionName = ROOT_NAME;
      if (stage) stage.style.viewTransitionName = STAGE_NAME;
      runTransition(
        to > from ? "next" : "prev",
        async () => {
          flushSync(() => onIndexChange(to));
          await settle(underlayRef.current, UNDERLAY_DECODE_MS);
        },
        () => {
          if (root) root.style.viewTransitionName = "";
          if (stage) stage.style.viewTransitionName = "";
        },
      );
    },
    [images.length, onIndexChange],
  );

  // Remember the trigger on open; on close, focus the thumbnail of the image
  // you ended on (falls back to the trigger)
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => {
      const thumbTrigger = thumbFor(indexRef.current)?.closest<HTMLElement>("button, a");
      (thumbTrigger ?? returnFocusRef.current)?.focus({ preventScroll: true });
    };
  }, [open]);

  // Lock body scroll while open + key handlers + focus trap
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight" && index !== null && index < images.length - 1) {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === "ArrowLeft" && index !== null && index > 0) {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === "Tab" && rootRef.current) {
        const nodes = Array.from(
          rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
        ).filter((n) => n.offsetParent !== null);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, index, images.length, close, go]);

  /* Gesture: horizontal drag follows the finger and steps; drag down
     follows and dismisses. Touch/pen only — mouse keeps click semantics. */

  const setDragOffset = (x: number, y: number) => {
    const box = boxRef.current;
    const root = rootRef.current;
    if (box) box.style.translate = x || y ? `${x}px ${y}px` : "";
    if (root) {
      const fade = Math.min(Math.max(y, 0) / 400, 0.5);
      root.style.backgroundColor = y > 0 ? `rgb(15 14 13 / ${BACKDROP_ALPHA * (1 - fade)})` : "";
    }
  };

  const snapBack = () => {
    const box = boxRef.current;
    const root = rootRef.current;
    const ease = "var(--dur-base) var(--ease-gallery)";
    if (box) box.style.transition = `translate ${ease}`;
    if (root) root.style.transition = `background-color ${ease}`;
    setDragOffset(0, 0);
    window.setTimeout(() => {
      if (box) box.style.transition = "";
      if (root) root.style.transition = "";
    }, 360);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    suppressClickRef.current = false;
    if (e.pointerType === "mouse" || !e.isPrimary) return;
    if ((e.target as Element).closest("[data-lightbox-bar]")) return;
    dragRef.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: e.timeStamp, axis: null, dx: 0, dy: 0 };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.id || index === null) return;
    d.dx = e.clientX - d.x0;
    d.dy = e.clientY - d.y0;
    if (d.axis === null) {
      if (Math.hypot(d.dx, d.dy) < AXIS_LOCK_PX) return;
      if (Math.abs(d.dx) > Math.abs(d.dy)) d.axis = "x";
      else if (d.dy > 0) d.axis = "y";
      else {
        dragRef.current = null;
        return;
      }
      suppressClickRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (reducedMotion()) return;
    if (d.axis === "x") {
      const atEdge = (d.dx > 0 && index === 0) || (d.dx < 0 && index === images.length - 1);
      setDragOffset(atEdge ? d.dx * EDGE_RESISTANCE : d.dx, 0);
    } else {
      setDragOffset(0, Math.max(d.dy, 0));
    }
  };

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.id) return;
    dragRef.current = null;
    if (d.axis === null || index === null || e.type === "pointercancel") {
      if (d.axis !== null) snapBack();
      return;
    }
    const dt = Math.max(e.timeStamp - d.t0, 1);
    if (d.axis === "x") {
      const width = rootRef.current?.clientWidth ?? window.innerWidth;
      const commit = Math.abs(d.dx) > width * SWIPE_COMMIT_RATIO || Math.abs(d.dx) / dt > SWIPE_COMMIT_VELOCITY;
      const to = d.dx < 0 ? index + 1 : index - 1;
      if (commit && to >= 0 && to < images.length) go(to);
      else snapBack();
    } else {
      const commit = d.dy > DISMISS_COMMIT_PX || d.dy / dt > DISMISS_COMMIT_VELOCITY;
      if (commit) close();
      else snapBack();
    }
  };

  // Only ever open after a click, so `document` is always available here
  if (!open || index === null) return null;
  const current = images[index];
  if (!current) return null;
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;
  const caption = label;
  const ratio = current.width / current.height;

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasPrev) go(index - 1);
  };
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasNext) go(index + 1);
  };

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={label ? `${label} — image viewer` : "Image viewer"}
      data-lightbox-open
      data-dir={dir}
      className="fixed inset-0 z-[1000] bg-ink/95 backdrop-blur-sm flex flex-col [touch-action:pinch-zoom]"
      onClick={close}
      onClickCapture={(e) => {
        // A drag that started on a tap zone or the backdrop isn't a click
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      {/* Top bar */}
      <div
        data-lightbox-bar
        className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-2 py-2 sm:px-4 sm:py-3"
      >
        <p className="type-meta nums text-paper/70 pl-2" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close viewer"
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
          className={controlClass}
        >
          <X className="size-6" aria-hidden />
        </button>
      </div>

      {/* Stage — exactly one child; the box inside is sized to the image's
          own ratio so the open/close morph never distorts it */}
      <div
        ref={stageRef}
        data-lightbox-stage
        className="relative flex-1 flex items-center justify-center px-3 sm:px-16 pt-16 pb-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full max-w-[1600px] flex items-center justify-center [container-type:size]">
          <div
            key={current.src}
            ref={boxRef}
            className="relative"
            style={{ aspectRatio: ratio, width: `min(100cqw, ${ratio} * 100cqh)` }}
          >
            {/* Cached grid tile (possibly a 4:5 crop) until the full image decodes.
                Cover, so it fills the box like the morph snapshot does. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- cached grid thumbnail, src set imperatively */}
            <img
              ref={underlayRef}
              alt=""
              aria-hidden
              className="absolute inset-0 size-full object-cover select-none"
            />
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              priority
              className="object-contain select-none"
            />
          </div>
        </div>
      </div>

      {/* Mobile edge tap zones — real buttons so they sit in the focus trap */}
      <button
        type="button"
        aria-label="Previous image"
        disabled={!hasPrev}
        onClick={goPrev}
        className="md:hidden absolute left-0 top-16 bottom-20 z-10 w-[30%] disabled:pointer-events-none focus-visible:outline-clay focus-visible:outline-2 focus-visible:-outline-offset-4"
      />
      <button
        type="button"
        aria-label="Next image"
        disabled={!hasNext}
        onClick={goNext}
        className="md:hidden absolute right-0 top-16 bottom-20 z-10 w-[30%] disabled:pointer-events-none focus-visible:outline-clay focus-visible:outline-2 focus-visible:-outline-offset-4"
      />

      {/* Desktop prev / next */}
      <button
        type="button"
        aria-label="Previous image"
        disabled={!hasPrev}
        onClick={goPrev}
        className={cn(controlClass, "hidden md:inline-flex absolute left-2 top-1/2 -translate-y-1/2 z-20")}
      >
        <ChevronLeft className="size-7" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Next image"
        disabled={!hasNext}
        onClick={goNext}
        className={cn(controlClass, "hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 z-20")}
      >
        <ChevronRight className="size-7" aria-hidden />
      </button>

      {/* Caption */}
      {caption ? (
        <p className="absolute inset-x-0 bottom-0 z-20 px-6 py-6 text-center type-meta text-paper/60 truncate">
          {caption}
        </p>
      ) : null}
    </div>,
    document.body,
  );
}
