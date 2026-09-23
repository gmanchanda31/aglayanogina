"use client";

import { createContext, useContext, useState } from "react";
import { Lightbox } from "./lightbox";
import type { ImageRef } from "@/lib/types";
import { cn } from "@/lib/utils";

const OpenAt = createContext<((i: number) => void) | null>(null);

interface LightboxGroupProps {
  /** Every image the viewer can step through, in order */
  images: ImageRef[];
  /** Work title — lightbox caption */
  label: string;
  children: React.ReactNode;
}

/**
 * One shared viewer for images that live in different parts of a page
 * (the detail hero and its gallery). Children stay server-rendered.
 */
export function LightboxGroup({ images, label, children }: LightboxGroupProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <OpenAt.Provider value={setOpenIndex}>
      {children}
      <Lightbox
        images={images}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
        label={label}
      />
    </OpenAt.Provider>
  );
}

interface LightboxTriggerProps {
  index: number;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function LightboxTrigger({ index, label, className, style, children }: LightboxTriggerProps) {
  const openAt = useContext(OpenAt);
  return (
    <button
      type="button"
      onClick={() => openAt?.(index)}
      aria-label={label}
      data-lightbox-index={index}
      data-artwork-card
      className={cn("group block cursor-zoom-in", className)}
      style={style}
    >
      {children}
    </button>
  );
}
