import type { FooterColumn } from "@/components/layout/SiteFooter";

/** Shared defaults for seed + UI fallback when DB is empty. */
export const defaultNavItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Clients", href: "/clients" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export const defaultFooterColumns: FooterColumn[] = [
  {
    title: "Categories",
    links: [
      { label: "Pharmaceuticals", href: "/products#pharmaceuticals" },
      { label: "Equipment", href: "/products#equipment" },
      { label: "Consumables", href: "/products#consumables" },
    ],
  },
  {
    title: "Support",
    contact: [
      { type: "phone", value: "+971 XXX XXXX" },
      { type: "mail", value: "info@theamedical.ae" },
      { type: "location", value: "Dubai, UAE" },
    ],
  },
  {
    title: "Compliance",
    body:
      "Regulatory Compliance: MOHAP Certified. Licensed medical distributor operating under UAE federal laws.",
  },
];

export const defaultHeaderActions = {
  contactLabel: "Contact Us",
  inquireLabel: "Inquire",
  inquireHref: "/contact?apply=1",
};

export const defaultFooterMeta = {
  brand: "THEA Medical Store",
  description:
    "Excellence in medical distribution and equipment solutions for the UAE's thriving healthcare sector.",
  social: [],
  copyright: "© 2024 THEA Medical Store L.L.C. All rights reserved.",
  ctaLabel: "",
  ctaHref: "/contact",
  legal: [
    { label: "PRIVACY POLICY", href: "/privacy" },
    { label: "TERMS OF SERVICE", href: "/terms" },
  ],
};

export const defaultApplyNowModal = {
  panelTitle: "Unlock Your Potential",
  panelDescription:
    "Join a global community of innovators and business leaders in Dubai's premier business hub.",
  panelHighlights: ["Elite Faculty", "Global Network", "Startup Incubator"],
  formTitle: "Request Information",
  formDescription: "Fill in the details below to receive a personalized program consultation.",
  fullNameLabel: "FULL NAME",
  fullNamePlaceholder: "Enter your full name",
  phoneLabel: "PHONE NUMBER",
  phonePlaceholder: "+971      50 123 4567",
  emailLabel: "WORK EMAIL",
  emailPlaceholder: "email@company.com",
  cityLabel: "SELECT CITY",
  cityPlaceholder: "Choose City",
  cityOptions: ["Dubai", "Abu Dhabi", "Sharjah"],
  experienceLabel: "EXPERIENCE",
  experiencePlaceholder: "Years of Experience",
  experienceOptions: ["0-2 Years", "3-5 Years", "6-10 Years", "10+ Years"],
  messageLabel: "MESSAGE (OPTIONAL)",
  messagePlaceholder: "Tell us about your career goals...",
  customFields: [] as Array<{
    label: string;
    placeholder: string;
    inputType: "text" | "email" | "number";
  }>,
  termsText: "I agree to the Terms of Service and Privacy Policy.",
  marketingConsentText: "I consent to receive promotional offers and communication via email and SMS.",
  submitLabel: "ENROLL NOW",
};

/** Site-wide SEO fallbacks (admin Site Global + metadata). */
export const defaultSeoDefaults = {
  defaultTitle: "THEA Medical Store",
  defaultDescription:
    "THEA Medical Store delivers premium pharmaceutical products and cutting-edge medical equipment solutions for healthcare providers across the UAE.",
};

/** Per-page SEO suggestions for admin Page edit and seed/fallback. */
export const defaultPageSeoBySlug: Record<
  string,
  { seoTitle: string; seoDescription: string }
> = {
  home: {
    seoTitle: "THEA Medical Store | Medical Supplies & Equipment",
    seoDescription: defaultSeoDefaults.defaultDescription,
  },
  about: {
    seoTitle: "About Us | THEA Medical Store",
    seoDescription:
      "Learn about THEA Medical Store — our mission, leadership, regulatory compliance, and commitment to clinical-grade medical supply across the UAE.",
  },
  services: {
    seoTitle: "Services | THEA Medical Store",
    seoDescription:
      "Medical services and solutions — pharmaceutical distribution, equipment trading, rental, and specialized healthcare logistics across the UAE.",
  },
  products: {
    seoTitle: "Products | THEA Medical Store",
    seoDescription:
      "Clinical-grade pharmaceutical products, medical equipment, surgical supplies, and consumables curated for healthcare providers.",
  },
  "product-detail": {
    seoTitle: "Product Detail | THEA Medical Store",
    seoDescription:
      "Browse THEA Medical Store’s licensed pharmaceutical medicines catalog — essential generics, specialty treatments, and critical care formulations.",
  },
  clients: {
    seoTitle: "Clients | THEA Medical Store",
    seoDescription:
      "Strategic healthcare alliances and sector expertise — hospitals, clinics, laboratories, rehabilitation, and home healthcare across the UAE.",
  },
  contact: {
    seoTitle: "Contact Us | THEA Medical Store",
    seoDescription:
      "Contact THEA Medical Store for procurement support, clinical inquiries, and medical supply solutions in Dubai and across the UAE.",
  },
  projects: {
    seoTitle: "Projects | THEA Medical Store",
    seoDescription:
      "Explore THEA Medical Store partnerships and healthcare supply deployments serving providers across the UAE.",
  },
};

