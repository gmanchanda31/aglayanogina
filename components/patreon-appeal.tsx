import { ArrowUpRight } from "lucide-react";
import { contact } from "@/lib/content";
import { cn } from "@/lib/utils";

interface PatreonAppealProps {
  /**
   * "section" — hairline-bordered block for full-page placement (e.g. About).
   * "inline" — compact, single-line for end-of-essay placement.
   */
  variant?: "section" | "inline";
  className?: string;
}

export function PatreonAppeal({ variant = "section", className }: PatreonAppealProps) {
  if (variant === "inline") {
    return (
      <a
        href={contact.patreonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group inline-flex items-baseline gap-2 label-caps text-clay border-b border-clay/60 hover:border-clay pb-1 transition-colors",
          className,
        )}
      >
        Read the art diary on Patreon
        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    );
  }

  return (
    <aside
      aria-label="Support Aglaya's practice"
      className={cn(
        "border-y border-mist py-10 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start",
        className,
      )}
    >
      <p className="md:col-span-3 label-caps text-stone">Studio support</p>
      <div className="md:col-span-6">
        <p className="font-[family-name:var(--font-vollkorn)] italic text-xl md:text-[1.625rem] leading-[1.45] text-ink">
          Aglaya&apos;s practice is supported by readers and patrons.
        </p>
        <p className="mt-3 text-stone text-base leading-[1.65] max-w-prose">
          The art diary on Patreon shares early sketches, studio notes, work-in-progress
          photographs, and writing — the slower side of the practice. Joining helps her
          keep making.
        </p>
      </div>
      <div className="md:col-span-3 md:flex md:justify-end">
        <a
          href={contact.patreonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center label-caps px-5 py-3 border border-clay text-clay hover:bg-clay hover:text-paper transition-colors duration-300"
        >
          Join the diary
        </a>
      </div>
    </aside>
  );
}
