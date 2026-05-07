import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { DropCap } from "@/components/mdx/drop-cap";
import { PullQuote } from "@/components/mdx/pull-quote";
import type { PortableTextBody } from "@/lib/types";

/**
 * Renders the literary essay body from Sanity Portable Text.
 *   - First paragraph automatically gets a drop cap on its first letter
 *   - Inline `pullQuote` blocks render via the PullQuote component
 *   - `dropCap` mark on a span (unused now, kept for editor compatibility)
 *   - Plain paragraphs use Vollkorn body styling
 */
const components: PortableTextComponents = {
  types: {
    pullQuote: ({ value }) => (
      <PullQuote>{value?.text}</PullQuote>
    ),
  },
  block: {
    normal: ({ children }) => (
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
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-mist pl-6 my-8 font-[family-name:var(--font-vollkorn)] italic text-stone">
        {children}
      </blockquote>
    ),
  },
  marks: {
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    dropCap: ({ children }) => <DropCap>{children}</DropCap>,
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href ?? "#";
      const external = /^https?:/.test(href);
      return (
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="border-b border-stone hover:border-ink hover:text-ink transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 ml-6 list-disc font-[family-name:var(--font-vollkorn)] text-[1.0625rem] leading-[1.7] text-ink">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal font-[family-name:var(--font-vollkorn)] text-[1.0625rem] leading-[1.7] text-ink">
        {children}
      </ol>
    ),
  },
};

/**
 * Adds a drop cap to the first letter of the first text block.
 * Mutates a copy — we don't touch the input.
 */
function withFirstLetterDropCap(body: PortableTextBody): PortableTextBody {
  if (!body || body.length === 0) return body;
  const out = [...body];
  for (let i = 0; i < out.length; i++) {
    const block = out[i] as { _type?: string; children?: Array<{ _type?: string; text?: string; marks?: string[] }> };
    if (block?._type !== "block") continue;
    const children = block.children ?? [];
    const firstSpan = children.find((c) => c._type === "span" && (c.text ?? "").length > 0);
    if (!firstSpan || !firstSpan.text) continue;
    const first = firstSpan.text.charAt(0);
    const rest = firstSpan.text.slice(1);
    const newChildren = [
      { _type: "span", _key: "drop", marks: [...(firstSpan.marks ?? []), "dropCap"], text: first },
      { _type: "span", _key: "rest", marks: firstSpan.marks ?? [], text: rest },
      ...children.filter((c) => c !== firstSpan),
    ];
    out[i] = { ...block, children: newChildren };
    break;
  }
  return out;
}

interface ArticleBodyProps {
  body: PortableTextBody;
}

export function ArticleBody({ body }: ArticleBodyProps) {
  const withDropCap = withFirstLetterDropCap(body);
  // PortableText accepts a value of any[]; cast through unknown to satisfy the lib's signature
  return <PortableText value={withDropCap as never} components={components} />;
}
