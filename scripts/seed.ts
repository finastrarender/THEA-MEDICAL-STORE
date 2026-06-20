/**
 * Seed MongoDB with SiteGlobal, Pages, and an admin user.
 * Run: pnpm seed
 * Requires MONGODB_URI in .env or .env.local
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

import User from "../src/models/User";
import SiteGlobal from "../src/models/SiteGlobal";
import Page from "../src/models/Page";
import {
  defaultApplyNowModal,
  defaultFooterColumns,
  defaultFooterMeta,
  defaultHeaderActions,
  defaultPageSeoBySlug,
  defaultSeoDefaults,
} from "../src/data/site-defaults";
import {
  theaAboutHeroDefaults,
  theaAboutLeadershipDefaults,
  theaAboutMissionDefaults,
  theaAboutFooterDefaults,
  theaAboutInquiryDefaults,
  theaAboutRegulatoryDefaults,
} from "../src/data/thea-about-sections";
import {
  theaHomeAboutDefaults,
  theaHomeProductsDefaults,
  theaHomeQuickInquiryDefaults,
  theaHomeServicesDefaults,
  theaHomeTrustedByDefaults,
  theaHomeWhyChooseDefaults,
} from "../src/data/thea-home-sections";
import {
  theaServicesCapabilityCardsDefaults,
  theaServicesPageHeroDefaults,
  theaServicesProductCatalogDefaults,
  theaServicesRegulatoryDefaults,
  theaServicesSpecializedDefaults,
  theaServicesFooterDefaults,
} from "../src/data/thea-services-sections";
import {
  theaClientsComplianceDefaults,
  theaClientsPageHeroDefaults,
  theaClientsPartnerCtaDefaults,
  theaClientsSectorsDefaults,
  theaClientsTrustedByDefaults,
} from "../src/data/thea-clients-sections";
import {
  theaPharmaceuticalMedicinesCatalogDefaults,
  theaProductsCatalogShowcaseDefaults,
  theaProductsFooterDefaults,
} from "../src/data/thea-products-sections";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

function section(type: string, order: number, data: Record<string, unknown>) {
  return { id: nanoid(), type, order, data };
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Clients", href: "/clients" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];
const footerColumns = defaultFooterColumns;
const footerMeta = defaultFooterMeta;

const heroData = {
  badge: "MOHAP CERTIFIED MEDICAL SUPPLIER",
  title: ["Reliable Medical", "Supplies &", "Equipment", "Solutions"],
  description:
    "Delivering clinical excellence through premium pharmaceutical products and cutting-edge medical equipment solutions tailored for modern healthcare providers.",
  primaryAction: { label: "Contact Us", href: "/contact" },
  secondaryAction: { label: "View Catalog", href: "/products" },
  backgroundImage: "/home/thea medical.png",
  overlayLabel: "99.9%",
  overlayText: "Accuracy in medical supply distribution across UAE.",
};

const ctaData = {
  title: "STREAMLINE YOUR MEDICAL SUPPLY CHAIN",
  description:
    "Partner with THEA Medical Store for reliable, compliant, and efficient clinical procurement solutions.",
  action: { label: "SEND INQUIRY", href: "/contact" },
};

const aboutHeroData = { ...theaAboutHeroDefaults };
const aboutMissionData = { cards: theaAboutMissionDefaults.cards };
const aboutLeadershipData = { ...theaAboutLeadershipDefaults };
const aboutRegulatoryData = { ...theaAboutRegulatoryDefaults };
const aboutInquiryData = { ...theaAboutInquiryDefaults };
const aboutFooterData = { ...theaAboutFooterDefaults };
const contactInquiryData = {
  heroEyebrow: "REACH OUT TO OUR EXPERTS",
  heroTitle: "Clinical Precision at Your Service.",
  submitLabel: "Submit Request",
  formFields: {
    fullNameLabel: "FULL NAME",
    fullNamePlaceholder: "Dr. Sarah Al-Maktoum",
    workEmailLabel: "EMAIL",
    workEmailPlaceholder: "sarah.a@facility.ae",
    companyLabel: "FACILITY NAME",
    companyPlaceholder: "Dubai Medical Center",
    phoneLabel: "DEPARTMENT",
    phonePlaceholder: "Radiology / Procurement",
    interestLabel: "REQUEST TYPE",
    interestPlaceholder: "Select a service category",
    messageLabel: "MESSAGE",
    messagePlaceholder: "Detail your clinical requirements here...",
    successMessage: "Thank you. Our team will contact you shortly.",
    errorMessage: "Something went wrong. Please try again.",
  },
  inquiryOptions: [
    "General Inquiry",
    "Procurement Support",
    "Equipment Supply",
    "Clinical Support",
  ],
  hqHeading: "Direct Contact",
  hqContacts: [
    {
      icon: "spark",
      label: "EMERGENCY LINE",
      value: "+971 4 000 0000",
    },
    {
      icon: "mail",
      label: "EMAIL CORRESPONDENCE",
      value: "inquiry@theamedical.ae",
    },
    {
      icon: "clock",
      label: "CLINICAL SUPPORT HOURS",
      value: "Mon - Fri: 08:00 - 18:00",
      note: "24/7 Support for Priority Clients",
    },
  ],
  hoursHeading: "Regulatory Compliance Guaranteed",
  complianceText:
    "All inquiries are processed according to strict medical data privacy standards and ISO 13485 protocols.",
  locationMatrix: {
    label: "Dubai Headquarters",
    title: "Business Bay, Prism Tower",
    subtitle: "Level 24, Suite 2405, Dubai, UAE.",
    mapImage: "/contact/uae-map.jpg",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Prism+Tower,+Business+Bay,+Dubai,+United+Arab+Emirates&hl=en&z=15&output=embed",
    linkLabel: "GET DIRECTIONS →",
    linkHref: "https://maps.google.com/?q=Business+Bay+Prism+Tower+Dubai",
  },
};

const homeSections = [
  section("hero", 0, heroData),
  section("homeAbout", 1, theaHomeAboutDefaults),
  section("homeServicesGrid", 2, theaHomeServicesDefaults),
  section("homeProductCategories", 3, theaHomeProductsDefaults),
  section("homeWhyChoose", 4, theaHomeWhyChooseDefaults),
  section("homeTrustedBy", 5, theaHomeTrustedByDefaults),
  section("homeQuickInquiry", 6, theaHomeQuickInquiryDefaults),
];

const aboutSections = [
  section("aboutHero", 0, aboutHeroData),
  section("aboutMission", 1, aboutMissionData),
  section("aboutRegulatory", 2, aboutRegulatoryData),
  section("aboutLeadership", 3, aboutLeadershipData),
  section("aboutInquiry", 4, aboutInquiryData),
  section("aboutFooter", 5, aboutFooterData),
];

const servicesPageSections = [
  section("servicesPageHero", 0, theaServicesPageHeroDefaults),
  section("servicesCapabilityCards", 1, theaServicesCapabilityCardsDefaults),
  section("servicesSpecialized", 2, theaServicesSpecializedDefaults),
  section("servicesProductCatalog", 3, theaServicesProductCatalogDefaults),
  section("servicesRegulatory", 4, theaServicesRegulatoryDefaults),
  section("servicesFooter", 5, theaServicesFooterDefaults),
];

const clientsPageSections = [
  section("clientsPageHero", 0, theaClientsPageHeroDefaults),
  section("clientsSectors", 1, theaClientsSectorsDefaults),
  section("clientsCompliance", 2, theaClientsComplianceDefaults),
  section("clientsTrustedBy", 3, theaClientsTrustedByDefaults),
  section("clientsPartnerCta", 4, theaClientsPartnerCtaDefaults),
];

const productsPageSections = [
  section("productsCatalogShowcase", 0, theaProductsCatalogShowcaseDefaults),
  section("productsFooter", 1, theaProductsFooterDefaults),
];

const pharmaceuticalMedicinesPageSections = [
  section("servicesProductCatalog", 0, theaPharmaceuticalMedicinesCatalogDefaults),
  section("productsFooter", 1, theaProductsFooterDefaults),
];

const contactPageSections = [
  section("contactInquiry", 0, contactInquiryData),
];

async function main() {
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "AdminChangeMe!", 12);
  await User.findOneAndUpdate(
    { email: "admin@theamedical.ae" },
    { $set: { email: "admin@theamedical.ae", passwordHash } },
    { upsert: true },
  );
  console.log("Admin user: admin@theamedical.ae /", process.env.ADMIN_PASSWORD ?? "AdminChangeMe!");

  await SiteGlobal.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        key: "default",
        headerBrand: "THEA Medical Store L.L.C",
        navItems,
        footerColumns,
        footerMeta: {
          ...footerMeta,
          ctaLabel: "REQUEST CREDENTIALS",
          ctaHref: "/contact",
        },
        logoSrc: "/home/logo.png",
        featureFlags: { clientLogos: true },
        applyNowModal: defaultApplyNowModal,
        headerActions: defaultHeaderActions,
        seoDefaults: defaultSeoDefaults,
      },
    },
    { upsert: true },
  );
  console.log("SiteGlobal seeded");

  const pages = [
    {
      slug: "home",
      title: "Home",
      sections: homeSections,
      ...defaultPageSeoBySlug.home,
    },
    {
      slug: "about",
      title: "About Us",
      sections: aboutSections,
      ...defaultPageSeoBySlug.about,
    },
    {
      slug: "services",
      title: "Services",
      sections: servicesPageSections,
      ...defaultPageSeoBySlug.services,
    },
    {
      slug: "clients",
      title: "Clients",
      sections: clientsPageSections,
      ...defaultPageSeoBySlug.clients,
    },
    {
      slug: "products",
      title: "Products",
      sections: productsPageSections,
      ...defaultPageSeoBySlug.products,
    },
    {
      slug: "product-detail",
      title: "Product Detail",
      sections: pharmaceuticalMedicinesPageSections,
      ...defaultPageSeoBySlug["product-detail"],
    },
    {
      slug: "contact",
      title: "Contact",
      sections: contactPageSections,
      ...defaultPageSeoBySlug.contact,
    },
  ];

  await Page.deleteMany({
    slug: { $nin: ["home", "about", "services", "products", "clients", "contact", "product-detail"] },
  });
  console.log("Removed non-core pages from DB");

  for (const p of pages) {
    const published = structuredClone(p.sections);
    await Page.findOneAndUpdate(
      { slug: p.slug },
      {
        $set: {
          slug: p.slug,
          title: p.title,
          status: "published",
          sections: p.sections,
          publishedSections: published,
          publishedAt: new Date(),
          seoTitle: p.seoTitle,
          seoDescription: p.seoDescription,
        },
      },
      { upsert: true },
    );
    console.log("Page seeded:", p.slug);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



