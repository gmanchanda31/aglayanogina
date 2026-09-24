/**
 * One chronology for every list on the site: most recent first.
 *
 * Years in the Studio are free text ("2025", "2023–2025", "Spring – Autumn
 * 2024", "2025, October", "2022 - ongoing"), so GROQ's `order(year desc)`
 * sorts them as strings. Sorting happens here instead.
 *
 * Order, first difference wins:
 *   1. entries with no date at all go last
 *   2. end year, newest first ("ongoing" counts as the latest)
 *   3. month within that year, latest first (unknown month after known)
 *   4. start year, newest first (2024–2025 before 2023–2025)
 *   5. title A–Z, so ties are stable rather than random
 *
 * An optional `sortDate` (YYYY-MM-DD, set in the Studio) overrides the
 * year text when two entries would otherwise tie.
 */

export interface ChronoFields {
  year?: string | null;
  sortDate?: string | null;
  title: string;
}

interface ChronoKey {
  end: number;
  month: number;
  start: number;
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
  winter: 1, spring: 4, summer: 7, autumn: 10, fall: 10,
};

const MONTH_RE = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|winter|spring|summer|autumn|fall)/g;

export function parseChrono({ year, sortDate }: Omit<ChronoFields, "title">): ChronoKey | null {
  const date = sortDate?.match(/^(\d{4})-(\d{2})/);
  if (date) {
    const y = Number(date[1]);
    return { end: y, month: Number(date[2]), start: y };
  }

  const text = year?.toLowerCase() ?? "";
  const years = (text.match(/\b(?:19|20)\d{2}\b/g) ?? []).map(Number);
  if (years.length === 0) return null;

  const months = Array.from(text.matchAll(MONTH_RE), (m) => MONTHS[m[1]]);
  return {
    end: /ongoing|present|now/.test(text) ? Infinity : Math.max(...years),
    month: months.at(-1) ?? 0,
    start: Math.min(...years),
  };
}

function compareKeys(a: ChronoKey | null, b: ChronoKey | null): number {
  if (!a || !b) return a ? -1 : b ? 1 : 0;
  if (a.end !== b.end) return a.end > b.end ? -1 : 1;
  if (a.month !== b.month) return b.month - a.month;
  return b.start - a.start;
}

/** Date-only comparison (steps 1–4) — for lists with their own tie-break. */
export function compareChrono(
  a: Omit<ChronoFields, "title">,
  b: Omit<ChronoFields, "title">,
): number {
  return compareKeys(parseChrono(a), parseChrono(b));
}

/** A new array, most recent first. */
export function byRecency<T>(items: readonly T[], get: (item: T) => ChronoFields): T[] {
  return items
    .map((item) => {
      const fields = get(item);
      return { item, title: fields.title, key: parseChrono(fields) };
    })
    .sort((a, b) => compareKeys(a.key, b.key) || a.title.localeCompare(b.title, "en"))
    .map(({ item }) => item);
}
