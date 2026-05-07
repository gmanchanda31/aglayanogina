import type { MDXComponents } from "mdx/types";
import { DropCap } from "@/components/mdx/drop-cap";
import { PullQuote } from "@/components/mdx/pull-quote";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    DropCap,
    PullQuote,
    p: ({ children }) => (
      <p className="font-[family-name:var(--font-vollkorn)] text-[1.0625rem] md:text-[1.125rem] leading-[1.7] text-ink mb-7">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-[family-name:var(--font-vollkorn)] text-3xl md:text-4xl leading-tight text-ink mt-16 mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-[family-name:var(--font-vollkorn)] text-2xl leading-tight text-ink mt-12 mb-4">
        {children}
      </h3>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    ...components,
  };
}
