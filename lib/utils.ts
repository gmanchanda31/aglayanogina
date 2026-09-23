import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * One house style for date ranges: "2023–2025" (en dash, no spaces) between
 * years, " – " between words ("Spring – Autumn 2024"). Source data mixes
 * hyphens, em dashes and spacing.
 */
export function formatYearRange(value: string): string {
  return value
    .replace(/(\d{4})\s*[-–—]\s*(\d{4}|ongoing|present|now)/gi, "$1–$2")
    .replace(/\s+[-–—]\s+/g, " – ");
}

/** "2021–2026" from any year-bearing strings; undefined when none found. */
export function yearSpan(values: ReadonlyArray<string | undefined>): string | undefined {
  const years = values
    .flatMap((v) => (v ?? "").match(/\d{4}/g) ?? [])
    .map(Number);
  if (years.length === 0) return undefined;
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min}–${max}`;
}
