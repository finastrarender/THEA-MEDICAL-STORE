/** Default content for THEA Medical Store clients page sections. */

export const theaClientsPageHeroDefaults = {
  badge: "STRATEGIC ALLIANCES",
  titleLead: "Healthcare",
  titleHighlight: "Ecosystem",
  titleAfter: "Partners",
  description:
    "Thea Medical Store L.L.C. serves as the vital link between cutting-edge medical technology and the Middle East's premier healthcare institutions.",
  backgroundImage: "",
  certifications: [
    { label: "MOHAP Licensed" },
    { label: "ISO 9001:2015" },
  ],
};

export const theaClientsSectorsDefaults = {
  title: "Sectors We Empower",
  titleAccent: "Sectors",
  cards: [
    {
      layout: "featured" as const,
      variant: "light" as const,
      icon: "hospital",
      title: "Hospitals & Medical Centers",
      description:
        "Supporting large-scale acute care facilities with high-volume surgical supplies, diagnostic equipment, and life-support systems.",
      bullets: [
        "Tier 1 General Hospitals",
        "Specialized Surgical Units",
        "Emergency & Trauma Care",
      ],
      image: "",
    },
    {
      layout: "standard" as const,
      variant: "light" as const,
      icon: "briefcase",
      title: "Outpatient Clinics",
      description:
        "Customized inventory solutions for multi-specialty clinics and private practices, ensuring seamless day-to-day operations.",
      bullets: [] as string[],
      image: "",
    },
    {
      layout: "standard" as const,
      variant: "dark" as const,
      icon: "microscope",
      title: "Diagnostic Laboratories",
      description:
        "Precision reagents, advanced testing kits, and laboratory automation hardware for pathology and research centers.",
      bullets: [] as string[],
      image: "",
    },
    {
      layout: "standard" as const,
      variant: "light" as const,
      icon: "dumbbell",
      title: "Rehabilitation Centers",
      description:
        "Mobility aids, physiotherapy equipment, and specialized recovery tools for long-term care facilities.",
      bullets: [] as string[],
      image: "",
    },
    {
      layout: "standard" as const,
      variant: "light" as const,
      icon: "homeCare",
      title: "Home Healthcare",
      description:
        "Professional-grade medical equipment adapted for home use, empowering patients and caregivers.",
      bullets: [] as string[],
      image: "",
      showFamilyDecor: true,
    },
  ],
};

export const theaClientsComplianceDefaults = {
  title: "Licensed, Compliant, & Regulated",
  description:
    "At THEA Medical Store, compliance is not just a standard—it is our core identity. We operate under the strict supervision of regional health authorities to ensure every product delivered meets global safety benchmarks.",
  approvalBadges: [
    { label: "MOHAP APPROVED" },
    { label: "DHA CERTIFIED" },
  ],
  certifications: [
    { icon: "gavel", label: "MOHAP UAE" },
    { icon: "shieldMedical", label: "DHA DUBAI" },
    { icon: "award", label: "ISO 13485" },
  ],
};

export const theaClientsTrustedByDefaults = {
  title: "TRUSTED BY ELITE INSTITUTIONS",
  logos: [
    { src: "", alt: "Partner institution 1" },
    { src: "", alt: "Partner institution 2" },
    { src: "", alt: "Partner institution 3" },
    { src: "", alt: "Partner institution 4" },
    { src: "", alt: "Partner institution 5" },
    { src: "", alt: "Partner institution 6" },
    { src: "", alt: "Partner institution 7" },
  ],
};

export const theaClientsPartnerCtaDefaults = {
  title: "Partner with Excellence",
  description:
    "Ready to elevate your medical facility's standards? Connect with our distribution specialists for a tailored procurement strategy that ensures compliance and quality.",
  primaryAction: { label: "Become a Partner", href: "/contact" },
  secondaryAction: { label: "Request Credentials", href: "/contact" },
};
