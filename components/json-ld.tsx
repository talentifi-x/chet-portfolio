/**
 * Renders a schema.org JSON-LD block.
 *
 * Structured data is what lets search engines and AI answer engines resolve
 * who this site is about and cite it, rather than guessing from prose.
 *
 * `JSON.stringify` does not escape HTML, and some of these payloads carry
 * Sanity-authored text, so `<` is replaced with its unicode escape to close
 * off script-injection through a post title or excerpt.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\u003c"),
      }}
    />
  );
}
