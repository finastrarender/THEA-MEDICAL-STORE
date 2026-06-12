/** Ensure internal nav paths are root-relative (e.g. `about` → `/about`). */
export function normalizeSitePath(href: string, fallback = "/"): string {
  const trimmed = href.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("#") || trimmed.startsWith("?")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return `/${trimmed}`;
}
