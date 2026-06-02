import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  pill: (
    <rect
      x="7"
      y="4"
      width="10"
      height="16"
      rx="5"
      stroke="currentColor"
      strokeWidth="1.5"
      transform="rotate(-35 12 12)"
    />
  ),
  medicalBag: (
    <>
      <rect x="6" y="9" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 9V7.2A3 3 0 0 1 15 7.2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 12v4M10 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="5" width="12" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 5V4a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13.5 14.5 16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  microscope: (
    <>
      <path d="M5 20h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4v6l4 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 14h8l-1.5 6H9.5L8 14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </>
  ),
  robotArm: (
    <>
      <path d="M6 18V10l4-3 4 3v8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="10" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 10h4v3h-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 13v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
};

export default function ServicesCapabilityIcon({
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
      {ICONS[name] ?? ICONS.pill}
    </svg>
  );
}
