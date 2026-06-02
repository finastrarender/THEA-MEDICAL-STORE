export const THEA_SERVICE_ICON_OPTIONS = [
  { key: "drugStore", label: "Drug store bottle" },
  { key: "equipmentTrading", label: "Stethoscope" },
  { key: "equipmentRental", label: "Calendar" },
  { key: "paraPharma", label: "Syringe & vial" },
  { key: "surgical", label: "Surgical scissors" },
  { key: "management", label: "Gear & maintenance" },
] as const;

export const THEA_INSTITUTION_ICON_OPTIONS = [
  { key: "hospitals", label: "Hospitals" },
  { key: "clinics", label: "Clinics" },
  { key: "laboratories", label: "Laboratories" },
  { key: "rehabCenters", label: "Rehab centers" },
  { key: "homeHealthcare", label: "Home healthcare" },
] as const;

export const THEA_WHY_CHOOSE_ICON_OPTIONS = [
  { key: "licensedCompliant", label: "Licensed & compliant" },
  { key: "fullService", label: "Full-service" },
  { key: "strategicLocation", label: "Strategic location" },
  { key: "highQuality", label: "High quality" },
] as const;

export function theaHomeIconLabel(
  options: readonly { key: string; label: string }[],
  key: string,
): string {
  return options.find((option) => option.key === key)?.label ?? key;
}
