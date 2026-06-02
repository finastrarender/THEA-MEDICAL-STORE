import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  hospital: (
    <>
      <rect x="5" y="6" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 9v7M9.5 12.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  briefcase: (
    <>
      <rect x="5" y="8" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 8V6.5A3.5 3.5 0 0 1 15.5 6.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  microscope: (
    <>
      <path d="M5 19h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4v5.5l3.5 1.8v2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 14h7l-1.2 5H9.7L8.5 14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M4 12h3M17 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="7" y="10" width="10" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5" y="9" width="2.5" height="6" rx="1" fill="currentColor" />
      <rect x="16.5" y="9" width="2.5" height="6" rx="1" fill="currentColor" />
    </>
  ),
  homeCare: (
    <>
      <path d="M4 11.5 12 5l8 6.5V19H4v-7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 12v7M10 14.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
};

export default function ClientsSectorIcon({
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
      {ICONS[name] ?? ICONS.hospital}
    </svg>
  );
}
