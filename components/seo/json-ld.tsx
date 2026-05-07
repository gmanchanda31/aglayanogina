interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders a JSON-LD <script> tag. Use one per page where structured
 * data adds value (Person, CreativeWork, Article).
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Stringify with no extra whitespace; safe because we only ever pass
      // typed data shapes we constructed ourselves.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
