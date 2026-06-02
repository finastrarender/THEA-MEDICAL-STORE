import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  hospitals: (
    <>
      <path
        d="M5 20V11l7-4.5L19 11v9H5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 13h1.5M13.5 13H15M9 16h1.5M13.5 16H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M12 8v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  clinics: (
    <>
      <rect x="6" y="9" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 9V7.2A3 3 0 0 1 15 7.2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 12v4M10 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  laboratories: (
    <>
      <path d="M5 20h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4v6l4 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M8 14h8l-1.5 6H9.5L8 14z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  rehabCenters: (
    <>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M17.5 6.5a8 8 0 0 0-11 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M16 5.5 17.5 4 19 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  homeHealthcare: (
    <>
      <path
        d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-5v-5h-4v5H5a1 1 0 0 1-1-1v-7.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 10v3.5M10.5 11.75h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
};

export default function HomeInstitutionIcon({
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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {ICONS[name] ?? ICONS.hospitals}
    </svg>
  );
}
