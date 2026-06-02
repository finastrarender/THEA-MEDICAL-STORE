import {
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  Building2,
  CircleCheck,
  Compass,
  Eye,
  FileText,
  Forward,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  Home,
  Image,
  Landmark,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Mic,
  Paperclip,
  Phone,
  Pointer,
  Scale,
  Search,
  Send,
  Share2,
  Shield,
  ShieldCheck,
  Smile,
  SquarePlus,
  Target,
  ThumbsUp,
  User,
  UserCircle,
  Video,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const PROJECTS_INTEGRITY_ICON_OPTIONS = [
  { key: "verified", label: "Verified badge" },
  { key: "location", label: "Location (custom)" },
  { key: "compass", label: "Compass (custom)" },
  { key: "eye", label: "Eye / transparency" },
  { key: "heart", label: "Heart" },
  { key: "image", label: "Image / gallery" },
  { key: "smile", label: "Smiley" },
  { key: "share", label: "Share / network" },
  { key: "forward", label: "Forward" },
  { key: "bell", label: "Notification bell" },
  { key: "phone", label: "Phone" },
  { key: "thumbsUp", label: "Thumbs up" },
  { key: "send", label: "Send / paper plane" },
  { key: "message", label: "Chat bubble" },
  { key: "plusSquare", label: "Add / plus" },
  { key: "home", label: "Home" },
  { key: "userCircle", label: "User (circle)" },
  { key: "badgeCheck", label: "Badge check" },
  { key: "megaphone", label: "Megaphone" },
  { key: "globe", label: "Globe" },
  { key: "paperclip", label: "Attachment" },
  { key: "mapPin", label: "Map pin" },
  { key: "pointer", label: "Pointer / click" },
  { key: "search", label: "Search" },
  { key: "mail", label: "Email" },
  { key: "mic", label: "Microphone" },
  { key: "video", label: "Video" },
  { key: "user", label: "User profile" },
  { key: "shield", label: "Shield" },
  { key: "shieldCheck", label: "Shield check" },
  { key: "lock", label: "Lock / security" },
  { key: "award", label: "Award" },
  { key: "fileText", label: "Document" },
  { key: "building", label: "Building" },
  { key: "handshake", label: "Handshake" },
  { key: "scale", label: "Legal / scale" },
  { key: "landmark", label: "Institution" },
  { key: "checkCircle", label: "Check circle" },
  { key: "compassNav", label: "Compass" },
  { key: "eyeOpen", label: "Eye" },
  { key: "target", label: "Target" },
  { key: "zap", label: "Energy / zap" },
  { key: "bookOpen", label: "Book" },
  { key: "graduationCap", label: "Education" },
] as const;

export const PROJECTS_INTEGRITY_ICON_KEYS = PROJECTS_INTEGRITY_ICON_OPTIONS.map(
  (option) => option.key,
);

export type ProjectsIntegrityIconKey = (typeof PROJECTS_INTEGRITY_ICON_OPTIONS)[number]["key"];

const LABEL_BY_KEY = Object.fromEntries(
  PROJECTS_INTEGRITY_ICON_OPTIONS.map((option) => [option.key, option.label]),
) as Record<string, string>;

const LUCIDE_BY_KEY: Record<string, LucideIcon> = {
  heart: Heart,
  image: Image,
  smile: Smile,
  share: Share2,
  forward: Forward,
  bell: Bell,
  phone: Phone,
  thumbsUp: ThumbsUp,
  send: Send,
  message: MessageCircle,
  plusSquare: SquarePlus,
  home: Home,
  userCircle: UserCircle,
  badgeCheck: BadgeCheck,
  megaphone: Megaphone,
  globe: Globe,
  paperclip: Paperclip,
  mapPin: MapPin,
  pointer: Pointer,
  search: Search,
  mail: Mail,
  mic: Mic,
  video: Video,
  user: User,
  shield: Shield,
  shieldCheck: ShieldCheck,
  lock: Lock,
  award: Award,
  fileText: FileText,
  building: Building2,
  handshake: Handshake,
  scale: Scale,
  landmark: Landmark,
  checkCircle: CircleCheck,
  compassNav: Compass,
  eyeOpen: Eye,
  target: Target,
  zap: Zap,
  bookOpen: BookOpen,
  graduationCap: GraduationCap,
};

export function projectsIntegrityIconLabel(key: string): string {
  return LABEL_BY_KEY[key] ?? key;
}

type Props = {
  name: string;
  className?: string;
  size?: number;
};

function CustomIntegritySvg({ name, className }: { name: string; className: string }) {
  switch (name) {
    case "verified":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.5 14.8 3.6l2.5-0.3 1.2 2.2 2.1 1.1-0.3 2.5 1.1 2.1-2.2 1.2-1.1 2.1-2.5-0.3-1.9 1.9-2.5 0.3-2.1-1.1-2.2-1.2-1.2-2.2-2.1-1.1 0.3-2.5-1.1-2.1 2.2-1.2 1.2-2.2 2.5 0.3L12 2.5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 12.2 10.8 14.5 15.5 9.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "location":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 21s6-5.33 6-10a6 6 0 1 0-12 0c0 4.67 6 10 6 10z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="11" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "compass":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M12 3v3M12 18v3M3 12h3M18 12h3M7.05 7.05l2.12 2.12M14.83 14.83l2.12 2.12M16.95 7.05l-2.12 2.12M9.17 14.83l-2.12 2.12"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="M14.5 9.5 12 12l-2.5 4.5 4.5-2.5L12 12l2.5-2.5z" fill="currentColor" />
        </svg>
      );
    case "eye":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ProjectsIntegrityIcon({ name, className, size = 22 }: Props) {
  const svgClass = className ?? "cx-projects-integrity__icon-svg";
  const custom = CustomIntegritySvg({ name, className: svgClass });
  if (custom) return custom;

  const Lucide = LUCIDE_BY_KEY[name];
  if (Lucide) {
    return (
      <Lucide
        className={svgClass}
        size={size}
        strokeWidth={1.5}
        aria-hidden
      />
    );
  }

  return <Shield className={svgClass} size={size} strokeWidth={1.5} aria-hidden />;
}
