/** Default content for THEA Medical Store about page sections. */

export const theaAboutHeroDefaults = {
  eyebrow: "ESTABLISHED IN DUBAI",
  titleLead: "Precision in ",
  titleHighlight: "Medical",
  titleAfter: "Supply Chain.",
  description:
    "THEA Medical Store L.L.C. serves as a vital bridge between global healthcare innovation and regional clinical excellence. We curate medical solutions that define the future of patient care in the UAE.",
  highlights: [
    { title: "MOHAP Certified", subtitle: "Regulatory Excellence", accent: "teal" as const },
    { title: "24/7 Support", subtitle: "Clinical Assistance", accent: "blue" as const },
  ],
  quote:
    "Our mission is to ensure every medical facility in the region has access to the highest caliber of instruments and pharmaceuticals.",
  quoteAttribution: "EXECUTIVE BOARD",
  image: "",
};

export const theaAboutMissionDefaults = {
  cards: [
    {
      icon: "rocket",
      title: "Our Mission",
      description:
        "To empower UAE healthcare providers through the seamless distribution of world-class medical equipment and pharmaceuticals, maintaining the highest standards of safety.",
    },
    {
      icon: "eye",
      title: "Our Vision",
      description:
        "To be the most trusted and preferred partner for healthcare infrastructure in the Middle East, recognized for clinical precision and logistical grace.",
    },
    {
      icon: "values",
      title: "Core Values",
      bullets: [
        "Integrity & Trust",
        "Clinical Excellence",
        "Innovative Solutions",
        "Rapid Response",
      ],
    },
  ],
};

export const theaAboutLeadershipDefaults = {
  title: "The Clinical Leadership",
  description:
    "Our executive team combines decades of medical logistics experience with clinical expertise to lead THEA toward excellence.",
  members: [
    {
      name: "Dr. Salim Al-Maktoum",
      role: "CHIEF EXECUTIVE OFFICER",
      bio: "20+ Years in Pharmaceutical Logistics.",
      image: "",
    },
    {
      name: "Elena Rodriguez, PharmD",
      role: "DIRECTOR OF COMPLIANCE",
      bio: "Former Regulatory Advisor for MOHAP.",
      image: "",
    },
    {
      name: "Mark Jensen",
      role: "HEAD OF DISTRIBUTION",
      bio: "Supply Chain Specialist, Global Health.",
      image: "",
    },
    {
      name: "Sarah Chen",
      role: "CLINICAL RELATIONS MANAGER",
      bio: "Hospital Infrastructure Specialist.",
      image: "",
    },
  ],
};

export const theaAboutRegulatoryDefaults = {
  title: "Regulatory Excellence & Certification",
  description: "",
  mohapLogo: "",
  isoLine1: "ISO 9001:2015",
  isoLine2: "Certified",
  guaranteeTitle: "Total Compliance Guarantee",
  guaranteeText:
    "Every pharmaceutical and medical device entering our inventory undergoes rigorous secondary verification to ensure compliance with UAE Ministry of Health and Prevention (MOHAP) protocols.",
  items: [
    {
      icon: "shield",
      title: "MOHAP Licensed",
      description:
        "Full licensure for pharmaceutical distribution and medical equipment importation across all Emirates.",
    },
    {
      icon: "clipboard",
      title: "Cold Chain Certified",
      description:
        "Advanced temperature-controlled storage and distribution hubs monitored 24/7 for biological integrity.",
    },
  ],
};

export const theaAboutInquiryDefaults = {
  title: "Professional Inquiry",
  description:
    "Submit your requirements and our clinical team will respond within 12 business hours.",
  submitLabel: "Submit Request",
  contactCardTitle: "Direct Contact",
  requestOptions: [
    "Product Inquiry (Pharmaceuticals)",
    "Medical Equipment",
    "Surgical Supplies",
    "Compliance & Licensing",
    "General Inquiry",
  ],
  contacts: [
    {
      icon: "phone" as const,
      label: "EMERGENCY LINE",
      value: "+971 4 000 0000",
    },
    {
      icon: "mail" as const,
      label: "EMAIL CORRESPONDENCE",
      value: "inquiry@theamedical.ae",
    },
    {
      icon: "clock" as const,
      label: "CLINICAL SUPPORT HOURS",
      value: "Mon - Fri: 08:00 - 18:00",
      note: "Emergency support available 24/7",
    },
  ],
  map: {
    title: "THEA Medical Headquarters",
    subtitle: "Business Bay, Dubai, UAE",
    mapImage: "",
    linkHref: "https://maps.google.com/?q=Business+Bay+Dubai",
  },
  formFields: {
    fullNameLabel: "FULL NAME",
    fullNamePlaceholder: "e.g. John Doe",
    emailLabel: "EMAIL ADDRESS",
    emailPlaceholder: "j.doe@medical-facility.ae",
    facilityLabel: "FACILITY NAME",
    facilityPlaceholder: "Hospital or Clinic Name",
    departmentLabel: "DEPARTMENT",
    departmentPlaceholder: "e.g. Cardiology, Procurement",
    requestTypeLabel: "REQUEST TYPE",
    messageLabel: "MESSAGE",
    messagePlaceholder: "Detail your specific medical requirements...",
    successMessage: "Thank you — our clinical team will respond within 12 business hours.",
    errorMessage: "Something went wrong. Please try again.",
  },
};

export const theaAboutFooterDefaults = {
  brand: "THEA Medical Store",
  description:
    "A premier provider of clinical solutions, serving the UAE's healthcare landscape with unwavering dedication to quality.",
  productsTitle: "Products",
  productLinks: [
    { label: "Pharmaceuticals", href: "/products" },
    { label: "Equipment", href: "/products" },
    { label: "Consumables", href: "/products" },
  ],
  inquiriesTitle: "Inquiries",
  phone: "+971 XXX XXXX",
  email: "info@theamedical.ae",
  headquartersTitle: "Headquarters",
  location: "Dubai, UAE",
  copyright:
    "© 2024 THEA Medical Store L.L.C. All rights reserved. Regulatory Compliance: MOHAP Certified.",
};
