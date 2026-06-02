import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  drugStore: (
    <>
      <path
        d="M10 3h4v2.5h1.2a1.8 1.8 0 0 1 1.8 1.8v10.9a1.8 1.8 0 0 1-1.8 1.8H9a1.8 1.8 0 0 1-1.8-1.8V7.3A1.8 1.8 0 0 1 9.2 5.5H10V3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="9" y="10" width="6" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 11.5v2M10.5 12.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  equipmentTrading: (
    <>
      <path
        d="M8 3.5a2.5 2.5 0 0 1 5 0V9a4 4 0 0 1-8 0V3.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 13v2.2a2.8 2.8 0 0 0 5.6 0V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="19" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 19h2.5M14.5 19H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  equipmentRental: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 10h16M8 4v3M16 4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 14h2M14 14h2M8 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  paraPharma: (
    <>
      <path
        d="M5 4l3 3-5 5 2.5 2.5 5-5-2.5-2.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 7v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="14" y="11" width="5" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16.5 8v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  surgical: (
    <>
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.2 9.2 17.5 17.5M9.2 14.8 17.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  management: (
    <>
      <circle cx="12" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 9.5V8M12 20v-1.5M7.2 10.8l-1-1M16.8 10.8l1-1M6.5 14H5M19 14h-1.5M7.2 17.2l-1 1M16.8 17.2l1 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M16 5l1 1M18 3l1-1M20 5l1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
};

export default function HomeServiceIcon({
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
      {ICONS[name] ?? ICONS.drugStore}
    </svg>
  );
}
