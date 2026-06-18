import type { ReactNode } from "react";
import AboutMissionIcon from "@/components/sections/about/AboutMissionIcon";
import AboutRegulatoryIcon from "@/components/sections/about/AboutRegulatoryIcon";
import HomeWhyChooseIcon from "@/components/sections/home/HomeWhyChooseIcon";

const NATIVE_ICONS: Record<string, ReactNode> = {
  gavel: (
    <>
      <path d="M6 18h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M8.5 14.5 5 11l3-3 6.5 6.5-3 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 8.5 17.5 5l3 3-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
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
      <path
        d="M9.5 13 8 20l4-2 4 2-1.5-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </>
  ),
  certificate: (
    <>
      <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  documentCheck: (
    <>
      <path
        d="M8 4h8l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 4v4h4M9 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

const WHY_CHOOSE_KEYS = new Set([
  "licensedCompliant",
  "fullService",
  "strategicLocation",
  "highQuality",
]);

const REGULATORY_KEYS = new Set(["shield", "shieldCheck", "clipboard", "clipboardCheck"]);

const MISSION_KEYS = new Set(["rocket", "eye", "values", "badge", "badgeCheck"]);

export default function ClientsComplianceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  if (WHY_CHOOSE_KEYS.has(name)) {
    return <HomeWhyChooseIcon name={name} className={className} />;
  }

  if (REGULATORY_KEYS.has(name)) {
    return <AboutRegulatoryIcon name={name} className={className} />;
  }

  if (MISSION_KEYS.has(name)) {
    return <AboutMissionIcon name={name} className={className} />;
  }

  const native = NATIVE_ICONS[name] ?? NATIVE_ICONS.shieldMedical;

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
      {native}
    </svg>
  );
}
