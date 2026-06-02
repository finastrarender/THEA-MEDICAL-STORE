import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  licensedCompliant: (
    <>
      <path
        d="M12 3 5 6v5c0 4.4 3 8.5 7 9.5 4-1 7-5.1 7-9.5V6l-7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="11" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12.75 12.75 14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  fullService: (
    <>
      <path
        d="M12 3 5 6v5c0 4.4 3 8.5 7 9.5 4-1 7-5.1 7-9.5V6l-7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  strategicLocation: (
    <>
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  highQuality: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <text
        x="12"
        y="14.5"
        textAnchor="middle"
        fill="currentColor"
        fontSize="7"
        fontWeight="700"
        fontFamily="Montserrat, Arial, sans-serif"
      >
        HQ
      </text>
    </>
  ),
};

export default function HomeWhyChooseIcon({
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
      {ICONS[name] ?? ICONS.licensedCompliant}
    </svg>
  );
}
