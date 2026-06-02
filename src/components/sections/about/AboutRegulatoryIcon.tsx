import type { ComponentType } from "react";
import { ClipboardCheck, ShieldCheck, type LucideProps } from "lucide-react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  shield: ShieldCheck,
  shieldCheck: ShieldCheck,
  clipboard: ClipboardCheck,
  clipboardCheck: ClipboardCheck,
};

export default function AboutRegulatoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? ShieldCheck;

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
