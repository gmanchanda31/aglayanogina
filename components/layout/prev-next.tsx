import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "./container";

interface PrevNextLink {
  href: string;
  title: string;
}

interface PrevNextProps {
  prev?: PrevNextLink;
  next?: PrevNextLink;
  /** The section index — "All projects", "All archives", … */
  indexHref: string;
  indexLabel: string;
  /** Accessible name for the nav landmark */
  label: string;
}

/**
 * End-of-page wayfinding shared by every detail page: previous work, back to
 * the section, next work. Stacks on mobile with the index link last.
 */
export function PrevNext({ prev, next, indexHref, indexLabel, label }: PrevNextProps) {
  return (
    <Container className="border-t border-mist mt-24 md:mt-32">
      <nav
        aria-label={label}
        data-prev-next
        className="py-12 grid grid-cols-2 md:grid-cols-3 items-start gap-x-6 gap-y-10"
      >
        <div>
          {prev ? (
            <Link href={prev.href} data-dir="prev" className="group inline-flex flex-col gap-1.5 text-left">
              <span className="label-caps text-stone inline-flex items-center gap-1.5">
                <span data-arrow className="inline-flex">
                  <ArrowLeft className="size-3.5" aria-hidden />
                </span>
                Previous
              </span>
              <span className="title-section italic text-stone group-hover:text-ink">
                {prev.title}
              </span>
            </Link>
          ) : null}
        </div>

        <div className="col-span-2 row-start-2 md:col-span-1 md:row-start-1 md:col-start-2 flex justify-center md:pt-0.5">
          <Link href={indexHref} className="link-draw label-caps text-stone hover:text-ink">
            {indexLabel}
          </Link>
        </div>

        <div className="flex justify-end md:col-start-3 md:row-start-1">
          {next ? (
            <Link href={next.href} data-dir="next" className="group inline-flex flex-col gap-1.5 text-right">
              <span className="label-caps text-stone inline-flex items-center gap-1.5 self-end">
                Next
                <span data-arrow className="inline-flex">
                  <ArrowRight className="size-3.5" aria-hidden />
                </span>
              </span>
              <span className="title-section italic text-stone group-hover:text-ink">
                {next.title}
              </span>
            </Link>
          ) : null}
        </div>
      </nav>
    </Container>
  );
}
