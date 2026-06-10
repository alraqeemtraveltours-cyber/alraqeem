/**
 * Renders rich-text HTML authored in the admin (Quill).
 * Content is authored only by the trusted admin (service-role gated).
 */
export default function RichText({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  if (!html) return null;
  return (
    <div
      className={`prose-site ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
