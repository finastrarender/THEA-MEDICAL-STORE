/** Fixed locale + timezone so admin inquiry dates match on server and client (no hydration mismatch). */
const ADMIN_DATE_LOCALE = "en-GB";
const ADMIN_DATE_TIME_ZONE = "Asia/Dubai";

export function formatAdminDateTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(ADMIN_DATE_LOCALE, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: ADMIN_DATE_TIME_ZONE,
  }).format(date);
}
