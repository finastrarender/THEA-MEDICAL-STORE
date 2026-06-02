/** Ensure internal nav paths are root-relative (e.g. `about` → `/about`). */
export function normalizeSitePath(href: string, fallback = "/"): string {
  const trimmed = href.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  const path = trimmed.split(/[?#]/)[0] ?? "";
  if (!path) return fallback;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}
