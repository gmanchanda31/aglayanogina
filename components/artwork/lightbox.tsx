"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
}

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartY = useRef<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while open + key handlers
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" && index !== null && index < images.length - 1) {
        e.preventDefault();
        onIndexChange(index + 1);
      } else if (e.key === "ArrowLeft" && index !== null && index > 0) {
        e.preventDefault();
        onIndexChange(index - 1);
      }
    };
    document.addEventListener("keydown", onKey);
    // Move focus to the close button so screen-reader users land here
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, index, images.length, onClose, onIndexChange]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchStartY.current;
      touchStartY.current = null;
      if (start == null) return;
      const delta = e.changedTouches[0].clientY - start;
      if (delta > 80) onClose(); // swipe down to dismiss
    },
    [onClose],
  );

  if (!mounted || !open || index === null) return null;
  const current = images[index];
  if (!current) return null;
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer"
      className="fixed inset-0 z-[1000] bg-ink/95 backdrop-blur-sm flex flex-col"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <p className="label-caps text-paper/70">
          {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close viewer"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="size-12 inline-flex items-center justify-center rounded-full bg-paper/10 hover:bg-paper/20 text-paper transition-colors focus-visible:outline-clay focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <X className="size-6" />
        </button>
      </div>

      {/* Image */}
      <div
        className="relative flex-1 flex items-center justify-center px-3 sm:px-12 py-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full max-w-[1600px]">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            sizes="100vw"
            priority
            className="object-contain select-none"
          />
        </div>
      </div>

      {/* Prev / Next */}
      <button
        type="button"
        aria-label="Previous"
        disabled={!hasPrev}
        onClick={(e) => {
          e.stopPropagation();
          if (hasPrev) onIndexChange(index - 1);
        }}
        className={cn(
          "hidden md:inline-flex absolute left-4 top-1/2 -translate-y-1/2 z-10",
          "size-12 items-center justify-center rounded-full bg-paper/10 hover:bg-paper/20 text-paper transition-colors",
          "disabled:opacity-30 disabled:pointer-events-none",
          "focus-visible:outline-clay focus-visible:outline-2 focus-visible:outline-offset-2",
        )}
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        type="button"
        aria-label="Next"
        disabled={!hasNext}
        onClick={(e) => {
          e.stopPropagation();
          if (hasNext) onIndexChange(index + 1);
        }}
        className={cn(
          "hidden md:inline-flex absolute right-4 top-1/2 -translate-y-1/2 z-10",
          "size-12 items-center justify-center rounded-full bg-paper/10 hover:bg-paper/20 text-paper transition-colors",
          "disabled:opacity-30 disabled:pointer-events-none",
          "focus-visible:outline-clay focus-visible:outline-2 focus-visible:outline-offset-2",
        )}
      >
        <ChevronRight className="size-6" />
      </button>

      {/* Mobile bottom hint */}
      <p className="md:hidden absolute inset-x-0 bottom-6 text-center label-caps text-paper/50">
        Swipe down to close
      </p>
    </div>,
    document.body,
  );
}
