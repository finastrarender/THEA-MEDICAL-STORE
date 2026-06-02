import SimpleIcon from "../SimpleIcon";

const CAPABILITY_ICON_SRC: Record<string, string> = {
  tokenize: "/home/capability-icons/tokenize.svg",
  compass: "/home/capability-icons/compass.svg",
  architecture: "/home/capability-icons/compass.svg",
  gavel: "/home/capability-icons/gavel.svg",
  compliance: "/home/capability-icons/gavel.svg",
};

const LEGACY_ICON_ALIASES: Record<string, string> = {
  investment: "tokenize",
  terminal: "compass",
  architecture: "compass",
  compliance: "gavel",
};

export default function CapabilityIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const normalized = LEGACY_ICON_ALIASES[name] ?? name;
  const src = CAPABILITY_ICON_SRC[normalized];

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`cx-capability-card__icon-img${className ? ` ${className}` : ""}`}
        width={26}
        height={26}
        decoding="async"
      />
    );
  }

  return <SimpleIcon name={normalized} className={className} />;
}
