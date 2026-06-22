import type { z } from "zod";
import { productsCatalogShowcaseDataSchema } from "@/schemas/sections";

type ProductsCatalogShowcaseDefaults = z.infer<typeof productsCatalogShowcaseDataSchema>;

export const theaProductsCatalogShowcaseDefaults: ProductsCatalogShowcaseDefaults = {
  badge: "OFFICIAL DISTRIBUTION CATALOG",
  titleLead: "Clinical Precision in",
  titleHighlight: "Medical Supply.",
  description:
    "Thea Medical Store LLC provides a curated portfolio of high-grade pharmaceutical and surgical solutions, ensuring regulatory compliance and operational excellence for global healthcare providers.",
  featured: {
    title: "Pharmaceutical Medicines",
    description:
      "Comprehensive range of life-saving medications and specialized clinical treatments under stringent quality controls.",
    linkLabel: "View Medicines",
    linkHref: "/product-detail",
    image: "/products/Pharmaceutical collection.png",
  },
  equipment: {
    title: "Medical Equipment",
    description:
      "Advanced diagnostic and therapeutic hardware for hospital-grade modernization.",
    buttonLabel: "VIEW HARDWARE",
    image: "/products/Medical equipment (1).png",
  },
  surgical: {
    title: "Surgical Supplies",
    description: "Precision-engineered instruments and disposable surgical assets.",
    image: "/products/Surgical supplies (2).png",
  },
  consumables: {
    title: "Medical Consumables",
    description:
      "High-volume essential supplies supporting day-to-day patient care and clinical hygiene.",
    linkLabel: "Stock Availability",
    linkHref: "/product-detail",
    image: "/products/Medical consumables.png",
  },
  secondaryBanner: {
    title: "Para-Pharmaceutical Products",
    description:
      "Bringing health and wellness with a premium selection of dermo-cosmetics, food supplements, and specialized solutions curated for pharmacy retail and clinical aesthetics.",
    image: "/products/Para-pharmaceutical products.png",
    tags: ["DERMO-COSMETICS", "SUPPLEMENTS", "DAILY CARE"],
  },
  quality: {
    title: "Quality Assurance",
    description:
      "Every product in our catalog adheres to MOH regulatory frameworks and international safety standards.",
    certifications: ["ISO 9001:2015", "GMP CERTIFIED", "MOH LICENSED"],
  },
};

export const PRODUCT_DETAIL_PATH = "/product-detail";

/** Product grid for the pharmaceutical medicines listing page. */
export const theaPharmaceuticalMedicinesCatalogDefaults = {
  title: "Product Detail",
  description:
    "Browse our MOHAP-licensed catalog of essential pharmaceuticals, specialty treatments, and clinical formulations for healthcare providers across the UAE.",
  filters: [
    { id: "all", label: "All Medicines" },
    { id: "general", label: "General Medicine" },
    { id: "specialty", label: "Specialty Care" },
    { id: "critical", label: "Critical Care" },
  ],
  products: [
    {
      title: "Antibiotic Formulations",
      category: "General Medicine",
      filterId: "general",
      image: "/products/antibiotics.png",
      href: "",
    },
    {
      title: "Cardiovascular Agents",
      category: "Specialty Care",
      filterId: "specialty",
      image: "/products/cardiovascular.png",
      href: "",
    },
    {
      title: "Analgesics & Anti-inflammatories",
      category: "General Medicine",
      filterId: "general",
      image: "/products/analgesics.png",
      href: "",
    },
    {
      title: "Critical Care Infusions",
      category: "Critical Care",
      filterId: "critical",
      image: "/products/critical-care.png",
      href: "",
    },
  ],
};

export const theaProductsFooterDefaults = {
  brand: "THEA Medical Store L.L.C.",
  copyright:
    "© 2024 THEA Medical Store L.L.C. All rights reserved. Regulatory Compliance Guaranteed.",
  links: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Compliance", href: "/compliance" },
    { label: "Contact", href: "/contact" },
  ],
};
