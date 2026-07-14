// Renders a JSON-LD structured data block. Use one per page with the
// appropriate schema from lib/schema.ts.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Escape `<` so admin-authored content containing `</script>` can't
        // break out of the JSON-LD block.
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
