// components/IconPicker.tsx
"use client";

import {
  Activity,
  AlertTriangle,
  Award,
  Book,
  Zap,
  Eye,
  Target,
  Rocket,
  TrendingUp,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Cloud,
  Code2,
  Database,
  Download,
  FileText,
  GraduationCap,
  HardDrive,
  Key,
  Layers,
  Lock,
  Mail,
  MapPin,
  Network,
  Globe,
  Lightbulb,
  BookOpen,
  Briefcase,
  Users,
  Users2,
  Building2,
  Cpu,
  LineChart,
  Handshake,
  Phone,
  RefreshCw,
  Search,
  Server,
  Settings,
  Star,
  Sparkles,
  Terminal,
  Upload,
  Wifi,
  Wrench,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

/** Icons used on the home services pillars and services page capability grid. */
export const HOME_SERVICE_CARD_ICON_OPTIONS = [
  "shield",
  "nodes",
  "terminal",
  "sync",
  "security",
  "online",
  "innovation",
  "corporate",
] as const;

type Props = {
  value: unknown;
  onChange: (val: string) => void;
  options?: readonly string[];
};

export default function IconPicker({ value, onChange, options }: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const selectedValue = typeof value === "string" ? value : "";
  const ICON_OPTIONS: Array<{ name: string; Icon: LucideIcon }> = [
    { name: "shield", Icon: Shield },
    { name: "nodes", Icon: Waypoints },
    { name: "terminal", Icon: Terminal },
    { name: "sync", Icon: RefreshCw },
    { name: "security", Icon: Shield },
    { name: "online", Icon: Cloud },
    { name: "innovation", Icon: Code2 },
    { name: "corporate", Icon: Network },
    { name: "spark", Icon: Star },
    { name: "mail", Icon: Mail },
    { name: "phone", Icon: Phone },
    { name: "location", Icon: MapPin },
    { name: "download", Icon: Download },
    { name: "upload", Icon: Upload },
    { name: "search", Icon: Search },
    { name: "settings", Icon: Settings },
    { name: "wrench", Icon: Wrench },
    { name: "wifi", Icon: Wifi },
    { name: "server", Icon: Server },
    { name: "database", Icon: Database },
    { name: "hardDrive", Icon: HardDrive },
    { name: "layers", Icon: Layers },
    { name: "lock", Icon: Lock },
    { name: "key", Icon: Key },
    { name: "activity", Icon: Activity },
    { name: "alert", Icon: AlertTriangle },
    { name: "award", Icon: Award },
    { name: "fileText", Icon: FileText },
    { name: "book", Icon: Book },
    { name: "graduationCap", Icon: GraduationCap },
    { name: "users2", Icon: Users2 },
    { name: "sparkles", Icon: Sparkles },
    { name: "ShieldCheck", Icon: ShieldCheck },
    { name: "ShieldAlert", Icon: ShieldAlert },
    { name: "Zap", Icon: Zap },
    { name: "Eye", Icon: Eye },
    { name: "Target", Icon: Target },
    { name: "Rocket", Icon: Rocket },
    { name: "TrendingUp", Icon: TrendingUp },
    { name: "Shield", Icon: Shield },
    { name: "Globe", Icon: Globe },
    { name: "Lightbulb", Icon: Lightbulb },
    { name: "BookOpen", Icon: BookOpen },
    { name: "Briefcase", Icon: Briefcase },
    { name: "Users", Icon: Users },
    { name: "Building2", Icon: Building2 },
    { name: "Cpu", Icon: Cpu },
    { name: "LineChart", Icon: LineChart },
    { name: "Handshake", Icon: Handshake },
    { name: "Star", Icon: Star },
  ];
  const SelectedIcon = ICON_OPTIONS.find((opt) => opt.name === selectedValue)?.Icon;

  const availableOptions = options?.length
    ? options
        .map((name) => ICON_OPTIONS.find((opt) => opt.name === name))
        .filter((opt): opt is { name: string; Icon: LucideIcon } => Boolean(opt))
    : ICON_OPTIONS;

  const iconEntries = availableOptions.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="admin-icon-picker">
      <button
        type="button"
        className="admin-icon-picker__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Choose icon"
      >
        <span className="admin-icon-picker__trigger-content">
          {SelectedIcon ? <SelectedIcon size={16} /> : null}
          {selectedValue || "Select icon"}
        </span>
        <span className="admin-icon-picker__caret" aria-hidden="true">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="admin-icon-picker__panel">
          <input
            placeholder="Search icon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-icon-picker__search"
          />

          <div className="admin-icon-picker__grid">
            {iconEntries.map(({ name, Icon }) => (
              <button
                key={name}
                type="button"
                className={`admin-icon-picker__item ${selectedValue === name ? "is-selected" : ""}`}
                title={name}
                aria-label={name}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
