/**
 * Static page content when Mongo has no row yet (before `pnpm seed`)
 * or when a slug is missing. Keeps the marketing site usable on first run.
 */
import type { PublicPageView } from "@/lib/content/pages";
import type { PageSection } from "@/types/section";
import {
  theaAboutHeroDefaults,
  theaAboutLeadershipDefaults,
  theaAboutMissionDefaults,
  theaAboutFooterDefaults,
  theaAboutInquiryDefaults,
  theaAboutRegulatoryDefaults,
} from "@/data/thea-about-sections";
import {
  theaHomeAboutDefaults,
  theaHomeProductsDefaults,
  theaHomeQuickInquiryDefaults,
  theaHomeServicesDefaults,
  theaHomeTrustedByDefaults,
  theaHomeWhyChooseDefaults,
} from "@/data/thea-home-sections";
import {
  theaServicesCapabilityCardsDefaults,
  theaServicesPageHeroDefaults,
  theaServicesProductCatalogDefaults,
  theaServicesRegulatoryDefaults,
  theaServicesSpecializedDefaults,
  theaServicesFooterDefaults,
} from "@/data/thea-services-sections";
import {
  theaClientsComplianceDefaults,
  theaClientsPageHeroDefaults,
  theaClientsPartnerCtaDefaults,
  theaClientsSectorsDefaults,
  theaClientsTrustedByDefaults,
} from "@/data/thea-clients-sections";
import {
  theaPharmaceuticalMedicinesCatalogDefaults,
  theaProductsCatalogShowcaseDefaults,
  theaProductsFooterDefaults,
} from "@/data/thea-products-sections";

function sid(slug: string, type: string, order: number): string {
  return `fb-${slug}-${type}-${order}`;
}

function sections(
  slug: string,
  list: { type: PageSection["type"]; order: number; data: Record<string, unknown> }[],
): PageSection[] {
  return list.map((s) => ({
    id: sid(slug, s.type, s.order),
    type: s.type,
    order: s.order,
    data: s.data,
  }));
}

const homeHeroData = {
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

const homeFoundationData = {
  eyebrow: "",
  title: ["The Foundation of", "Digital Trust"],
  description:
    "Cryptonexis Limited stands at the forefront of the UAE’s evolving digital economy. As a regulated issuer of non-fungible tokens, we provide institutional clients with the legal and technical scaffolding required for sophisticated asset management.",
  highlights: [],
  image: "/home/thea-intro.png",
  href: "",
  expcount: 0,
  more:
    "Our approach is built on three core pillars: regulatory compliance, architectural integrity, and cryptographic security. We do not participate in speculative retail markets; we build utility-driven ecosystems for the modern enterprise.",
};

const homeCapabilitiesData = {
  eyebrow: "CAPABILITIES",
  title: "Strategic Issuance",
  description:
    "Leveraging advanced smart contract engineering to deliver robust digital asset solutions for the global market.",
  pillars: [
    {
      icon: "tokenize",
      title: "Asset Tokenization",
      description:
        "Converting physical and intellectual property into compliant digital representations.",
    },
    {
      icon: "compass",
      title: "Contract Architecture",
      description:
        "Custom smart contract development with rigorous multi-stage security auditing.",
    },
    {
      icon: "gavel",
      title: "Regulatory Advisory",
      description:
        "Navigating complex international digital asset laws for seamless issuance.",
    },
  ],
};

const aboutHeroData = { ...theaAboutHeroDefaults };
const aboutMissionData = { cards: theaAboutMissionDefaults.cards };
const aboutLeadershipData = { ...theaAboutLeadershipDefaults };
const aboutRegulatoryData = { ...theaAboutRegulatoryDefaults };
const aboutInquiryData = { ...theaAboutInquiryDefaults };
const aboutFooterData = { ...theaAboutFooterDefaults };

const servicesLicensingData = {
  eyebrow: "INSTITUTIONAL DIGITAL ASSETS",
  title: ["Services &", "Licensing."],
  description:
    "Providing high-end architectural infrastructure for digital asset issuance within a regulated framework. Precise. Authorized. Institutional.",
  reliabilityTitle: "Institutional Reliability.",
  reliabilityDescription:
    "Our infrastructure is built on the premise of architectural precision. We eliminate volatility through rigorous compliance and verified blockchain stamps.",
  cards: [
    {
      title: "NFT Creation",
      description:
        "Architecting bespoke smart contract environments for large-scale digital asset minting. Ensuring structural integrity across multiple chain protocols.",
      linkLabel: "PROTOCOL DETAILS →",
      linkHref: "/contact",
      icon: "blocks",
    },
    {
      title: "NFT Issuance",
      description:
        "Managed deployment of verified digital stamps and high-volume asset issuance. Integrated provenance tracking for institutional-grade reliability.",
      linkLabel: "ISSUANCE FRAMEWORK →",
      linkHref: "/contact",
      icon: "shield-check",
    },
  ],
  licenses: [
    {
      licenseNumber: "RAK-CNX-2024-001",
      authority: "RAK Economic Zone",
      legalType: "Commercial Digital Assets",
      location: "UAE",
      status: "LICENSED",
    },
    {
      licenseNumber: "IF-UAE-9932-A",
      authority: "Freezone Authority",
      legalType: "Technology Infrastructure",
      location: "Dubai",
      status: "LICENSED",
    },
    {
      licenseNumber: "GB-SEC-LP-8812",
      authority: "Global Blockchain Council",
      legalType: "Security Protocol Member",
      location: "International",
      status: "LICENSED",
    },
  ],
  complianceNotice:
    "CRYPTONEXIS LIMITED OPERATES UNDER STRICT COMPLIANCE MANDATES AS REQUIRED BY UAE RAK ECONOMIC ZONE REGULATIONS. ALL ASSET MINTING PROTOCOLS ARE AUDITED QUARTERLY FOR STRUCTURAL INTEGRITY.",
};

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

const projectsHeroData = {
  eyebrow: "INSTITUTIONAL PORTFOLIO",
  titleLines: ["Strategic Digital", "Assets & NFT", "Infrastructure"],
  description:
    "Archiving the evolution of institutional-grade tokenization and distributed ledger deployments across the MENA region.",
};

const projectsGridData = {
  items: [
    {
      category: "Real Estate",
      title: "RAK Waterfront Series",
      image: "/projects/rak-waterfront.jpg",
    },
    {
      category: "Protocol",
      title: "Ledger Identity V.2",
      image: "/projects/ledger-identity.jpg",
    },
    {
      category: "Finance",
      title: "Sovereign Debt Tokens",
      image: "/projects/sovereign-debt.jpg",
    },
    {
      category: "Logistics",
      title: "Supply Chain Registry",
      image: "/projects/supply-chain.jpg",
    },
    {
      category: "Governance",
      title: "Citizen DAO Protocol",
      image: "/projects/citizen-dao.jpg",
    },
    {
      category: "Luxury",
      title: "Heritage Asset Vault",
      image: "/projects/heritage-vault.jpg",
    },
  ],
};

const projectsIntegrityData = {
  heading: "Institutional Integrity by Design",
  description:
    "Cryptonexis operates at the intersection of regulatory compliance and technological frontier, ensuring each partnership is built on a foundation of absolute transparency.",
  items: [
    {
      icon: "verified",
      title: "Licensed and compliant",
      description:
        "Operating under strict UAE regulatory frameworks and governance standards.",
    },
    {
      icon: "location",
      title: "Strategic UAE location",
      description:
        "Headquartered in the RAK Economic Zone, a global hub for digital asset innovation.",
    },
    {
      icon: "compass",
      title: "Focused expertise",
      description:
        "Deep specialization in NFT architecture and institutional blockchain deployments.",
    },
    {
      icon: "eye",
      title: "Transparent operations",
      description:
        "Real-time reporting and absolute clarity in all asset management protocols.",
    },
  ],
};

const projectsPartnersData = {
  formTitle: "Connect with our Partners",
  submitLabel: "SEND INQUIRY",
  mapImage: "/projects/rak-map.jpg",
  hqLabel: "HQ LOCATION",
  hqTitle: "RAK Economic Zone",
  hqAddress: "Al Hamra Industrial Zone-FZ, Ras Al Khaimah, United Arab Emirates",
  contactLabel: "DIRECT CONTACT",
  contactEmail: "office@cryptonexis.com",
  placeholders: {
    name: "Full Name",
    email: "Institutional Email",
    subject: "Subject of Inquiry",
    message: "Brief Summary of Project/Inquiry",
  },
};

const FALLBACK_BY_SLUG: Record<string, PublicPageView> = {
  home: {
    slug: "home",
    title: "Home",
    status: "published",
    seoTitle: "THEA Medical Store",
    seoDescription:
      "THEA Medical Store delivers premium pharmaceutical products and cutting-edge medical equipment solutions for healthcare providers across the UAE.",
    effectiveSections: sections("home", [
      { type: "hero", order: 0, data: homeHeroData },
      { type: "homeAbout", order: 1, data: theaHomeAboutDefaults },
      { type: "homeServicesGrid", order: 2, data: theaHomeServicesDefaults },
      { type: "homeProductCategories", order: 3, data: theaHomeProductsDefaults },
      { type: "homeWhyChoose", order: 4, data: theaHomeWhyChooseDefaults },
      { type: "homeTrustedBy", order: 5, data: theaHomeTrustedByDefaults },
      { type: "homeQuickInquiry", order: 6, data: theaHomeQuickInquiryDefaults },
    ]),
    isPreview: false,
  },
  about: {
    slug: "about",
    title: "About Us",
    status: "published",
    seoTitle: "About Us | THEA Medical Store",
    seoDescription:
      "Learn about THEA Medical Store — our mission, leadership, regulatory compliance, and commitment to clinical-grade medical supply across the UAE.",
    effectiveSections: sections("about", [
      { type: "aboutHero", order: 0, data: aboutHeroData },
      { type: "aboutMission", order: 1, data: aboutMissionData },
      { type: "aboutRegulatory", order: 2, data: aboutRegulatoryData },
      { type: "aboutLeadership", order: 3, data: aboutLeadershipData },
      { type: "aboutInquiry", order: 4, data: aboutInquiryData },
      { type: "aboutFooter", order: 5, data: aboutFooterData },
    ]),
    isPreview: false,
  },
  services: {
    slug: "services",
    title: "Services",
    status: "published",
    seoTitle: "Services | THEA Medical Store",
    seoDescription:
      "Medical services and solutions — pharmaceutical distribution, equipment trading, rental, and specialized healthcare logistics across the UAE.",
    effectiveSections: sections("services", [
      { type: "servicesPageHero", order: 0, data: theaServicesPageHeroDefaults },
      { type: "servicesCapabilityCards", order: 1, data: theaServicesCapabilityCardsDefaults },
      { type: "servicesSpecialized", order: 2, data: theaServicesSpecializedDefaults },
      { type: "servicesProductCatalog", order: 3, data: theaServicesProductCatalogDefaults },
      { type: "servicesRegulatory", order: 4, data: theaServicesRegulatoryDefaults },
      { type: "servicesFooter", order: 5, data: theaServicesFooterDefaults },
    ]),
    isPreview: false,
  },
  products: {
    slug: "products",
    title: "Products",
    status: "published",
    seoTitle: "Products | THEA Medical Store",
    seoDescription:
      "Clinical-grade pharmaceutical products, medical equipment, surgical supplies, and consumables curated for healthcare providers.",
    effectiveSections: sections("products", [
      { type: "productsCatalogShowcase", order: 0, data: theaProductsCatalogShowcaseDefaults },
      { type: "productsFooter", order: 1, data: theaProductsFooterDefaults },
    ]),
    isPreview: false,
  },
  "product-detail": {
    slug: "product-detail",
    title: "Product Detail",
    status: "published",
    seoTitle: "Product Detail | THEA Medical Store",
    seoDescription:
      "Browse THEA Medical Store’s licensed pharmaceutical medicines catalog — essential generics, specialty treatments, and critical care formulations.",
    effectiveSections: sections("product-detail", [
      {
        type: "servicesProductCatalog",
        order: 0,
        data: theaPharmaceuticalMedicinesCatalogDefaults,
      },
      { type: "productsFooter", order: 1, data: theaProductsFooterDefaults },
    ]),
    isPreview: false,
  },
  projects: {
    slug: "projects",
    title: "Projects",
    status: "published",
    seoTitle: "Projects | THEA Medical Store",
    seoDescription:
      "Explore THEA Medical Store partnerships and healthcare supply deployments serving providers across the UAE.",
    effectiveSections: sections("projects", [
      { type: "projectsHero", order: 0, data: projectsHeroData },
      { type: "projectsGrid", order: 1, data: projectsGridData },
      { type: "projectsIntegrity", order: 2, data: projectsIntegrityData },
      { type: "projectsPartners", order: 3, data: projectsPartnersData },
    ]),
    isPreview: false,
  },
  contact: {
    slug: "contact",
    title: "Contact Us",
    status: "published",
    seoTitle: "Contact Us | THEA Medical Store",
    seoDescription:
      "Contact THEA Medical Store for procurement support, clinical inquiries, and medical supply solutions in Dubai and across the UAE.",
    effectiveSections: sections("contact", [
      { type: "contactInquiry", order: 0, data: contactInquiryData },
    ]),
    isPreview: false,
  },
  clients: {
    slug: "clients",
    title: "Clients",
    status: "published",
    seoTitle: "Clients | THEA Medical Store",
    seoDescription:
      "Strategic healthcare alliances and sector expertise — hospitals, clinics, laboratories, rehabilitation, and home healthcare across the UAE.",
    effectiveSections: sections("clients", [
      { type: "clientsPageHero", order: 0, data: theaClientsPageHeroDefaults },
      { type: "clientsSectors", order: 1, data: theaClientsSectorsDefaults },
      { type: "clientsCompliance", order: 2, data: theaClientsComplianceDefaults },
      { type: "clientsTrustedBy", order: 3, data: theaClientsTrustedByDefaults },
      { type: "clientsPartnerCta", order: 4, data: theaClientsPartnerCtaDefaults },
    ]),
    isPreview: false,
  },
};

export function getFallbackPageView(slug: string): PublicPageView | null {
  return FALLBACK_BY_SLUG[slug] ?? null;
}

