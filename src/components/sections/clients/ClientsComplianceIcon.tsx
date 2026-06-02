import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  gavel: (
    <>
      <path d="M6 18h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 14.5 5 11l3-3 6.5 6.5-3 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 8.5 17.5 5l3 3-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </>
  ),
  shieldMedical: (
    <>
      <path
        d="M12 3.5 6.5 6v5.2c0 3.35 2.35 6.45 5.5 7.3 3.15-.85 5.5-3.95 5.5-7.3V6L12 3.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 9v5M9.5 11.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 13 8 20l4-2 4 2-1.5-7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </>
  ),
};

export default function ClientsComplianceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {ICONS[name] ?? ICONS.shieldMedical}
    </svg>
  );
}
