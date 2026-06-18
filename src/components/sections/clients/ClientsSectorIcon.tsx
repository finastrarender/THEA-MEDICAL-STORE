import HomeInstitutionIcon from "@/components/sections/home/HomeInstitutionIcon";
import HomeServiceIcon from "@/components/sections/home/HomeServiceIcon";
import ServicesCapabilityIcon from "@/components/sections/services/ServicesCapabilityIcon";

const INSTITUTION_KEYS = new Set([
  "hospitals",
  "clinics",
  "laboratories",
  "rehabCenters",
  "homeHealthcare",
]);

const SERVICE_KEYS = new Set([
  "drugStore",
  "equipmentTrading",
  "equipmentRental",
  "paraPharma",
  "surgical",
  "management",
]);

const CAPABILITY_KEYS = new Set(["pill", "medicalBag", "clipboard", "microscope", "robotArm"]);

/** Maps legacy clients-page keys to the shared institution icon set. */
const LEGACY_ALIASES: Record<string, string> = {
  hospital: "hospitals",
  briefcase: "clinics",
  dumbbell: "rehabCenters",
  homeCare: "homeHealthcare",
};

function resolveSectorIconKey(name: string) {
  if (LEGACY_ALIASES[name]) return LEGACY_ALIASES[name];
  return name;
}

export default function ClientsSectorIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const key = resolveSectorIconKey(name);

  if (INSTITUTION_KEYS.has(key)) {
    return <HomeInstitutionIcon name={key} className={className} />;
  }

  if (SERVICE_KEYS.has(key)) {
    return <HomeServiceIcon name={key} className={className} />;
  }

  if (CAPABILITY_KEYS.has(key) || name === "microscope") {
    return <ServicesCapabilityIcon name={name === "microscope" ? "microscope" : key} className={className} />;
  }

  return <HomeInstitutionIcon name="hospitals" className={className} />;
}
