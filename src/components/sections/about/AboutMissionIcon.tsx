import type { ComponentType } from "react";
import { BadgeCheck, Eye, Rocket, type LucideProps } from "lucide-react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  rocket: Rocket,
  eye: Eye,
  values: BadgeCheck,
  badge: BadgeCheck,
  badgeCheck: BadgeCheck,
};

export default function AboutMissionIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? Rocket;

  return (
    <Icon
      className={className}
      aria-hidden="true"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
