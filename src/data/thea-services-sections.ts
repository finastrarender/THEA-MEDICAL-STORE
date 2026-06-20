/** Default content for THEA Medical Store services page sections. */
export const theaServicesPageHeroDefaults = {
  badge: "OUR CAPABILITIES",
  title: "Medical Services & Solutions",
  description:
    "Providing comprehensive pharmaceutical distribution and advanced medical equipment lifecycles for the UAE healthcare sector.",
};

export const theaServicesCapabilityCardsDefaults = {
  cards: [
    {
      icon: "pill",
      title: "Drug Store",
      description:
        "Pharmaceutical distribution excellence ensuring safe, temperature-controlled logistics for essential medicines across the region.",
      image: "/services/Pharmaceutical storage facility.png",
      features: ["GDP Compliant Logistics", "Cold Chain Management"],
    },
    {
      icon: "medicalBag",
      title: "Equipment Trading",
      description:
        "Direct procurement of New & Certified Pre-owned medical technology from world-leading manufacturers.",
      image: "/services/Medical ultrasound machine.png",
      features: ["New Installations", "Refurbished Systems"],
    },
    {
      icon: "clipboard",
      title: "Equipment Rental",
      description:
        "Flexible leasing and short-term rental solutions for clinics and hospitals to manage peak demand or temporary needs.",
      image: "/services/equipment-rental.jpg",
      features: ["Short-term Leasing", "24/7 Technical Support"],
    },
  ],
};

export const theaServicesSpecializedDefaults = {
  title: "Specialized Medical Solutions",
  items: [
    {
      accent: "teal" as const,
      title: "Surgical Articles Trading",
      description:
        "Precision-engineered surgical tools and disposables meeting international safety standards for operating theaters.",
    },
    {
      accent: "blue" as const,
      title: "Equipment Management & Operation",
      description:
        "Complete lifecycle management of medical assets, from installation and calibration to ongoing operational staffing.",
    },
  ],
  tiles: [
    {
      variant: "stat" as const,
      icon: "microscope",
      value: "99.9%",
      label: "STERILITY ASSURANCE",
    },
    {
      variant: "image" as const,
      image: "/services/Laboratory testing.png",
    },
    {
      variant: "brand" as const,
      image: "/home/headerLogo.svg",
      brandLine: "THEA MEDICAL",
      brandSub: "UAE HEALTHCARE",
    },
    {
      variant: "product" as const,
      icon: "robotArm",
      title: "AssetPro",
      label: "INVENTORY SYSTEM",
    },
  ],
};

export const theaServicesProductCatalogDefaults = {
  title: "Product Catalog",
  description:
    "Explore our curated selection of high-performance medical consumables and diagnostics.",
  filters: [
    { id: "all", label: "All Categories" },
    { id: "diagnostics", label: "Diagnostics" },
    { id: "lifeSupport", label: "Life Support" },
    { id: "consumables", label: "Consumables" },
  ],
  products: [
    {
      title: "Digital Pulse Oximeters",
      category: "Diagnostics & Monitoring",
      filterId: "diagnostics",
      image: "/services/catalog-oximeter.jpg",
      href: "",
    },
    {
      title: "Sterile Wound Care Kit",
      category: "Surgical Consumables",
      filterId: "consumables",
      image: "/services/Surgical supplies (1).png",
      href: "",
    },
    {
      title: "Patient ICU Beds",
      category: "Hospital Furniture",
      filterId: "lifeSupport",
      image: "/services/catalog-icu-bed.jpg",
      href: "",
    },
    {
      title: "Precision Syringes",
      category: "Injection Consumables",
      filterId: "consumables",
      image: "/services/Syringes.png",
      href: "",
    },
  ],
};

export const theaServicesRegulatoryDefaults = {
  title: "Regulatory Compliance",
  description:
    "THEA Medical Store L.L.C. operates under the strict guidelines of UAE health authorities, ensuring every product and service meets the highest clinical benchmarks.",
  certifications: [
    {
      title: "MOHAP Certified",
      subtitle: "Ministry of Health and Prevention License #THEA-971",
    },
    {
      title: "DHA Registered",
      subtitle: "Dubai Health Authority Approved Medical Supplier",
    },
    {
      title: "ISO 13485:2016",
      subtitle: "Quality Management System for Medical Devices",
    },
  ],
  tableTitle: "Equipment Standards List",
  standards: [
    { deviceCategory: "Imaging Systems", standard: "IEC 60601-1", status: "VERIFIED" },
    { deviceCategory: "Life Support", standard: "CE MDD 93/42/EEC", status: "VERIFIED" },
    { deviceCategory: "Surgical Tools", standard: "ASTM F899", status: "VERIFIED" },
    { deviceCategory: "Monitoring", standard: "ANSI/AAMI EC13", status: "VERIFIED" },
  ],
};

export const theaServicesFooterDefaults = {
  brand: "THEA Medical Store",
  description:
    "Dedicated to advancing the medical landscape through quality distribution and expert clinical support in the UAE.",
  solutionsTitle: "SOLUTIONS",
  solutionLinks: [
    { label: "Pharmaceuticals", href: "/products" },
    { label: "Equipment", href: "/products" },
    { label: "Consumables", href: "/products" },
  ],
  contactTitle: "CONTACT",
  phone: "+971 XXX XXXX",
  email: "info@theamedical.ae",
  location: "Dubai, UAE",
  newsletterTitle: "NEWSLETTER",
  emailPlaceholder: "Email address",
  subscribeLabel: "Subscribe",
  copyright:
    "© 2024 THEA Medical Store L.L.C. All rights reserved. Regulatory Compliance: MOHAP Certified.",
};
