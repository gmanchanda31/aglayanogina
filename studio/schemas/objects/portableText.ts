import { defineArrayMember, defineType } from "sanity";

/**
 * Long-form prose. Used by:
 *   - writing.body  (the literary essays — supports DropCap + PullQuote)
 *   - project.description, exhibition.description, illustration.description
 *
 * Supported block types:
 *   - paragraph (Inter body)
 *   - h2/h3 for sub-headings
 *   - bulleted/numbered lists
 *   - emphasis, strong
 *   - inline links
 *   - block-level pullQuote (custom; renders as <PullQuote>)
 *   - block-level dropCap (custom; the first letter of the next paragraph
 *     becomes a drop cap on render)
 */
export const portableText = defineType({
  name: "portableText",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Emphasis", value: "em" },
          { title: "Strong", value: "strong" },
          { title: "Drop cap (first letter)", value: "dropCap" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "object",
      name: "pullQuote",
      title: "Pull quote",
      fields: [
        {
          name: "text",
          type: "text",
          rows: 3,
          title: "Quote",
          validation: (rule) => rule.required(),
        },
        {
          name: "attribution",
          type: "string",
          title: "Attribution",
          description: 'Optional — e.g. "Aglaya"',
        },
      ],
      preview: {
        select: { title: "text", subtitle: "attribution" },
      },
    }),
  ],
});
