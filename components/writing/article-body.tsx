import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { DropCap } from "@/components/mdx/drop-cap";
import { PullQuote } from "@/components/mdx/pull-quote";
import type { PortableTextBody } from "@/lib/types";

/**
 * Renders the literary essay body from Sanity Portable Text.
 *   - Inline `pullQuote` blocks render via the PullQuote component
 *   - `dropCap` mark on a span renders plainly (kept for editor compatibility)
 *   - Paragraphs use `type-body` at a ~65ch reading measure
 */
const components: PortableTextComponents = {
  types: {
    pullQuote: ({ value }) => (
      <PullQuote>{value?.text}</PullQuote>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className="type-body text-ink max-w-[65ch] mb-block">
        {children}
      </p>
    ),
    marker: ({ children }) => (
      <p className="type-meta text-stone nums mt-section mb-tight first:mt-0">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="type-heading text-ink mt-section mb-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="type-body text-ink mt-block mb-tight">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="type-body text-stone border-l-2 border-mist pl-6 my-block">
        {children}
      </blockquote>
    ),
  },
  marks: {
    em: ({ children }) => <em>{children}</em>,
    strong: ({ children }) => <strong>{children}</strong>,
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
      <ul className="type-body text-ink max-w-[65ch] my-block ml-6 list-disc">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="type-body text-ink max-w-[65ch] my-block ml-6 list-decimal">
        {children}
      </ol>
    ),
  },
};

type TextBlock = {
  _type?: string;
  style?: string;
  children?: Array<{ _type?: string; text?: string; marks?: string[] }>;
};

function blockText(block: TextBlock): string {
  return (block.children ?? []).map((c) => c.text ?? "").join("").trim();
}

/**
 * Short standalone lines at the head of a section ("story 1", "story 2")
 * are styled as quiet section labels rather than body paragraphs.
 */
function withSectionMarkers(body: PortableTextBody): PortableTextBody {
  return body.map((node) => {
    const block = node as TextBlock;
    if (block?._type !== "block") return node;
    // Migrated essays carry a manual `dropCap` mark (often on "story 1");
    // strip it so markers and prose render uniformly.
    const stripped: TextBlock = {
      ...block,
      children: (block.children ?? []).map((c) =>
        c.marks?.includes("dropCap")
          ? { ...c, marks: c.marks.filter((m) => m !== "dropCap") }
          : c,
      ),
    };
    node = stripped as typeof node;
    if (block.style && block.style !== "normal") return node;
    const text = blockText(block);
    return /^(story|part|chapter)\s+\d+\.?$/i.test(text)
      ? ({ ...stripped, style: "marker" } as typeof node)
      : node;
  });
}

interface ArticleBodyProps {
  body: PortableTextBody;
}

export function ArticleBody({ body }: ArticleBodyProps) {
  const value = withSectionMarkers(body);
  // PortableText accepts a value of any[]; cast through unknown to satisfy the lib's signature
  return <PortableText value={value as never} components={components} />;
}
