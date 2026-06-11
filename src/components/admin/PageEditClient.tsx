"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import HeroSectionForm from "@/components/admin/HeroSectionForm";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { defaultPageSeoBySlug, defaultSeoDefaults } from "@/data/site-defaults";
import {
  AboutAdvantageSectionForm,
  AboutCtaSectionForm,
  AboutFrameworkSectionForm,
  AboutIntroSectionForm,
  AboutValuesSectionForm,
  AboutVisionMissionSectionForm,
  ClientLogosSectionForm,
  ContactSectionForm,
  CoursesCatalogSectionForm,
  ContactHeroSectionForm,
  ContactInquirySectionForm,
  CtaSectionForm,
  GlobalStandardsSectionForm,
  HomeIncubationHighlightSectionForm,
  IncubationSectionForm,
  IntroSectionForm,
  IndustriesCtaSectionForm,
  IndustriesGridSectionForm,
  IndustriesHeroSectionForm,
  InvestmentSectionForm,
  ServicesSectionForm,
  ServicesLicensingSectionForm,
  ServicesAccordionSectionForm,
  ServicesGridSectionForm,
  ServicesCtaSectionForm,
  ProjectsGridSectionForm,
  ProjectsHeroSectionForm,
  ProjectsIntegritySectionForm,
  ProjectsPartnersSectionForm,
  ResearchHubSectionForm,
  WhyChooseSectionForm,
  ServicesHeroSectionForm,
} from "@/components/admin/SectionForms";
import {
  HomeAboutSectionForm,
  HomeProductCategoriesSectionForm,
  HomeQuickInquirySectionForm,
  HomeServicesGridSectionForm,
  HomeTrustedBySectionForm,
  HomeWhyChooseSectionForm,
} from "@/components/admin/TheaHomeSectionForms";
import {
  AboutHeroSectionForm,
  AboutFooterSectionForm,
  AboutInquirySectionForm,
  AboutLeadershipSectionForm,
  AboutMissionSectionForm,
  AboutRegulatorySectionForm,
} from "@/components/admin/TheaAboutSectionForms";
import {
  ServicesCapabilityCardsSectionForm,
  ServicesPageHeroSectionForm,
  ServicesSpecializedSectionForm,
  ServicesProductCatalogSectionForm,
  ServicesRegulatorySectionForm,
  ServicesFooterSectionForm,
} from "@/components/admin/TheaServicesSectionForms";
import {
  ClientsPageHeroSectionForm,
  ClientsSectorsSectionForm,
  ClientsComplianceSectionForm,
  ClientsTrustedBySectionForm,
  ClientsPartnerCtaSectionForm,
} from "@/components/admin/TheaClientsSectionForms";
import {
  ProductsCatalogShowcaseSectionForm,
  ProductsFooterSectionForm,
} from "@/components/admin/TheaProductsSectionForms";
import {
  theaAboutHeroDefaults,
  theaAboutFooterDefaults,
  theaAboutInquiryDefaults,
  theaAboutLeadershipDefaults,
  theaAboutMissionDefaults,
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
  theaServicesSpecializedDefaults,
  theaServicesProductCatalogDefaults,
  theaServicesRegulatoryDefaults,
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
  theaProductsCatalogShowcaseDefaults,
  theaProductsFooterDefaults,
} from "@/data/thea-products-sections";
import { SECTION_TYPES, type SectionType } from "@/types/section";

type SectionRow = { id: string; type: string; order: number; data: Record<string, unknown> };
type InquiryRow = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType?: string;
  sourcePage?: string;
  message: string;
  createdAt?: string;
};
type SectionSaveState = {
  sectionId: string;
  message: string;
  tone: "success" | "error";
} | null;

const PAGE_SECTION_TYPES: Record<string, SectionType[]> = {
  home: ["hero", "homeAbout", "homeServicesGrid", "homeProductCategories", "homeWhyChoose", "homeTrustedBy", "homeQuickInquiry"],
  services: [
    "servicesPageHero",
    "servicesCapabilityCards",
    "servicesSpecialized",
    "servicesProductCatalog",
    "servicesRegulatory",
  ],
  about: [
    "aboutHero",
    "aboutMission",
    "aboutRegulatory",
    "aboutLeadership",
    "aboutInquiry",
  ],
  clients: [
    "clientsPageHero",
    "clientsSectors",
    "clientsCompliance",
    "clientsTrustedBy",
    "clientsPartnerCta",
  ],
  products: ["productsCatalogShowcase"],
  "product-detail": ["servicesProductCatalog", "productsFooter"],
  contact: ["contactInquiry"],
  projects: ["projectsHero", "projectsGrid", "projectsIntegrity", "projectsPartners"],
};

function defaultSectionData(type: SectionType): Record<string, unknown> {
  switch (type) {
    case "hero":
      return {
        badge: "MOHAP CERTIFIED MEDICAL SUPPLIER",
        title: ["Reliable Medical", "Supplies &", "Equipment", "Solutions"],
        description:
          "Delivering clinical excellence through premium pharmaceutical products and cutting-edge medical equipment solutions tailored for modern healthcare providers.",
        primaryAction: { label: "Contact Us", href: "/contact" },
        secondaryAction: { label: "View Catalog", href: "/products" },
        backgroundImage: "",
        overlayLabel: "99.9%",
        overlayText: "Accuracy in medical supply distribution across UAE.",
      };
    case "homeAbout":
      return { ...theaHomeAboutDefaults };
    case "homeServicesGrid":
      return { ...theaHomeServicesDefaults };
    case "homeProductCategories":
      return { ...theaHomeProductsDefaults };
    case "homeTrustedBy":
      return { ...theaHomeTrustedByDefaults };
    case "homeQuickInquiry":
      return { ...theaHomeQuickInquiryDefaults };
    case "homeWhyChoose":
      return { ...theaHomeWhyChooseDefaults };
    case "intro":
      return {
        title: ["The Foundation of", "Digital Trust"],
        description:
          "Cryptonexis Limited stands at the forefront of the UAE's evolving digital economy. As a pioneer in the regulated issuance of non-fungible tokens, we provide institutional clients with the legal and technical scaffolding required for sophisticated asset management.",
        more:
          "Our approach is built on three core pillars: regulatory compliance, architectural integrity, and cryptographic security. We do not participate in speculative retail markets; we build utility-driven ecosystems for the modern enterprise.",
        stats: [
          { value: "UAE", label: "JURISDICTION" },
          { value: "RAK", label: "ECONOMIC ZONE" },
        ],
        cardLabel: "LICENSING AUTHORITY",
        cardDescription:
          "Cryptonexis Limited is registered and regulated within the RAK Economic Zone, adhering to strict financial transparency and digital asset frameworks.",
        cardLinkLabel: "REVIEW CERTIFICATION",
        cardHref: "/about",
        highlights: [],
        image: "",
        href: "/about",
        expcount: 0,
      };
    case "globalStandards":
      return {
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
    case "services":
      return {
        eyebrow: "OUR CAPABILITIES",
        title: "CORE PILLARS",
        description:
          "Modular solutions designed to scale with the complexity of your operational demands.",
        backgroundImage: "",
        cards: [
          {
            icon: "security",
            title: "CYBER SECURITY",
            description:
              "Defensive architecture and threat intelligence systems built to withstand the most sophisticated breaches.",
          },
          {
            icon: "online",
            title: "DATA & CLOUD",
            description:
              "High-performance cloud migration and sovereign data warehousing for sensitive enterprise assets.",
          },
          {
            icon: "innovation",
            title: "SOFTWARE & DEV",
            description:
              "Custom enterprise software engineered with a security-first methodology and technical excellence.",
          },
          {
            icon: "corporate",
            title: "CONSULTING",
            description:
              "Strategic advisory and specialized workforce training to foster a culture of technological resilience.",
          },
        ],
      };
    case "whyChoose":
      return {
        title: "",
        subheading: "",
        items: [
          {
            icon: "ShieldCheck",
            title: "END-TO-END SECURITY",
            description:
              "We don't just 'treat' security; we build it into the DNA of every solution. From physical server security to encrypted application layers, your data remains impenetrable.",
            tags: ["ENCRYPTION", "ZERO TRUST", "SOVEREIGN CONTROL"],
          },
          {
            icon: "Sparkles",
            title: "FUTURE-READY TECH",
            description:
              "Anticipating the next decade of digital evolution. Our stacks are built for modularity, ensuring you can integrate AI, Blockchain, and Quantum protocols seamlessly.",
            tags: ["AI-DRIVEN", "EDGE READY", "SCALABLE MESH"],
          },
        ],
      };
    case "clientLogos":
      return {
        eyebrow: "TRUSTED BY INSTITUTIONAL LEADERS",
        logos: ["GLOBAL BANK", "TECH LOGISTICS", "DUBAI URBAN", "GOV SECTOR", "CORE ENERGY"],
      };
    case "cta":
      return {
        title: "SYSTEM DEPLOYMENT STARTS HERE",
        description: "Secure your digital future with the UAE's premier technical architectural firm.",
        action: { label: "BOOK CONSULTATION", href: "/contact" },
      };
    case "servicesHero":
      return {
        title: ["SYSTEM", "ARCHITECTURE"],
        description:
          "Enterprise-grade infrastructure, elite cybersecurity protocols, and bespoke software orchestration.",
      };
    case "servicesGrid":
      return {
        title: "SERVICES",
        description: "Explore our core service lines.",
        filters: ["ALL"],
        cards: [
          {
            category: "CYBERSECURITY",
            title: "CYBERSECURITY",
            description: "Threat protection, hardening, and security operations.",
            features: ["ZERO TRUST", "SOC OPS", "THREAT INTEL"],
            cta: "INQUIRE",
            icon: "security",
          },
        ],
      };
    case "servicesCTA":
      return {
        title: "SECURE YOUR STACK",
        description: "Get a tailored plan for your organization.",
        primaryAction: { label: "INQUIRE", href: "/contact" },
        secondaryAction: { label: "ABOUT US", href: "/about" },
      };
    case "projectsHero":
      return {
        eyebrow: "INSTITUTIONAL PORTFOLIO",
        titleLines: ["Strategic Digital", "Assets & NFT", "Infrastructure"],
        description:
          "Archiving the evolution of institutional-grade tokenization and distributed ledger deployments across the MENA region.",
      };
    case "projectsGrid":
      return {
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
    case "projectsIntegrity":
      return {
        heading: "Institutional Integrity by Design",
        description:
          "Cryptonexis operates at the intersection of regulatory compliance and technological frontier, ensuring each partnership is built on a foundation of absolute transparency.",
        items: [
          {
            icon: "verified",
            title: "Licensed and compliant",
            description: "Operating under strict UAE regulatory frameworks and governance standards.",
          },
        ],
      };
    case "projectsPartners":
      return {
        formTitle: "Connect with our Partners",
        submitLabel: "SEND INQUIRY",
        mapImage: "/projects/rak-map.jpg",
        hqLabel: "HQ LOCATION",
        hqTitle: "RAK Economic Zone",
        hqAddress: "Al Hamra Industrial Zone-FZ, Ras Al Khaimah, United Arab Emirates",
        contactLabel: "DIRECT CONTACT",
        contactEmail: "office@cryptonexis.com",
      };
    case "servicesLicensing":
      return {
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
        ],
        complianceNotice:
          "CRYPTONEXIS LIMITED OPERATES UNDER STRICT COMPLIANCE MANDATES AS REQUIRED BY UAE RAK ECONOMIC ZONE REGULATIONS. ALL ASSET MINTING PROTOCOLS ARE AUDITED QUARTERLY FOR STRUCTURAL INTEGRITY.",
      };
    case "aboutHero":
      return { ...theaAboutHeroDefaults };
    case "aboutMission":
      return { cards: theaAboutMissionDefaults.cards };
    case "aboutLeadership":
      return { ...theaAboutLeadershipDefaults };
    case "aboutRegulatory":
      return { ...theaAboutRegulatoryDefaults };
    case "aboutInquiry":
      return { ...theaAboutInquiryDefaults };
    case "aboutFooter":
      return { ...theaAboutFooterDefaults };
    case "servicesPageHero":
      return { ...theaServicesPageHeroDefaults };
    case "servicesCapabilityCards":
      return { ...theaServicesCapabilityCardsDefaults };
    case "servicesSpecialized":
      return { ...theaServicesSpecializedDefaults };
    case "servicesProductCatalog":
      return { ...theaServicesProductCatalogDefaults };
    case "servicesRegulatory":
      return { ...theaServicesRegulatoryDefaults };
    case "servicesFooter":
      return { ...theaServicesFooterDefaults };
    case "clientsPageHero":
      return { ...theaClientsPageHeroDefaults };
    case "clientsSectors":
      return { ...theaClientsSectorsDefaults };
    case "clientsCompliance":
      return { ...theaClientsComplianceDefaults };
    case "clientsTrustedBy":
      return { ...theaClientsTrustedByDefaults };
    case "clientsPartnerCta":
      return { ...theaClientsPartnerCtaDefaults };
    case "productsCatalogShowcase":
      return { ...theaProductsCatalogShowcaseDefaults };
    case "productsFooter":
      return { ...theaProductsFooterDefaults };
    case "aboutVisionMission":
      return {
        items: [
          {
            title: "VISION",
            description: "Build resilient infrastructure for a secure digital future.",
            accentColor: "#4ad9ff",
          },
          {
            title: "MISSION",
            description: "Deliver security-first engineering with measurable outcomes.",
            accentColor: "#41ef54",
          },
        ],
      };
    case "aboutFramework":
      return {
        title: "SECURITY FRAMEWORK",
        description: "A practical approach to governance, resilience, and delivery.",
        pillars: [{ letter: "A", title: "ASSESS", description: "Audit, map, and baseline risk." }],
      };
    case "aboutAdvantage":
      return {
        eyebrow: "WHY US",
        title: ["SECURITY", "BY DESIGN"],
        description: "We ship with operational discipline and measurable controls.",
        points: ["Risk-led planning", "Secure delivery pipelines", "Continuous monitoring"],
        image: "/home/headquarters.png",
      };
    case "aboutValues":
      return {
        title: "COMPLIANCE AND\nCERTIFICATIONS",
        description:
          "ADAM TECHNOLOGY L.L.C. operates under strict regulatory frameworks, ensuring global compliance and institutional security standards.",
        region: "DUBAI, UNITED ARAB EMIRATES",
        items: [
          { title: "DUBAI\nLICENSED", description: "Fully registered and regulated by Dubai authorities.", icon: "Award" },
          { title: "ISO\nCERTIFIED", description: "Aligned to ISO 27001 security management standards.", icon: "ShieldCheck" },
          { title: "NIST\nFRAMEWORK", description: "Mapped to NIST for enterprise-grade risk controls.", icon: "Shield" },
        ],
      };
    case "aboutCTA":
      return {
        title: ["BUILD ON", "CERTAINTY"],
        description:
          "Connect with our institutional relations team to discuss your digital asset strategy under our regulated framework.",
        primaryAction: { label: "CONTACT RELATIONS", href: "/contact" },
        secondaryAction: { label: "VIEW LICENSING", href: "/services" },
      };
    case "contactInquiry":
      return {
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
          linkLabel: "GET DIRECTIONS →",
          linkHref: "https://maps.google.com/?q=Business+Bay+Prism+Tower+Dubai",
        },
      };
    default:
      return {};
  }
}

function normalizeSlugForPath(value: string | undefined | null) {
  return String(value ?? "")
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

function slugPathSegment(value: string | undefined | null) {
  return encodeURIComponent(normalizeSlugForPath(value));
}

function idPathSegment(value: string | undefined | null) {
  return encodeURIComponent(String(value ?? "").trim());
}

function normalizeSectionType(value: string) {
  const trimmed = String(value).trim();
  if (trimmed === "aboutIntro") return "aboutOverview";
  if (trimmed === "industrieshero") return "industriesHero";
  if (trimmed === "industriesgrid") return "industriesGrid";
  if (trimmed === "industriescta") return "industriesCta";
  if (trimmed === "servicesgrid") return "servicesGrid";
  if (trimmed === "servicesaccordion") return "servicesAccordion";
  if (trimmed === "servicescta") return "servicesCTA";
  if (trimmed === "serviceslicensing") return "servicesLicensing";
  if (trimmed === "projectshero") return "projectsHero";
  if (trimmed === "projectsgrid") return "projectsGrid";
  if (trimmed === "projectsintegrity") return "projectsIntegrity";
  if (trimmed === "projectspartners") return "projectsPartners";
  return trimmed;
}

function toAllowedSectionType(value: string): SectionType | null {
  const normalized = normalizeSectionType(value);
  return SECTION_TYPES.includes(normalized as SectionType)
    ? (normalized as SectionType)
    : null;
}

export default function PageEditClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<{
    slug: string;
    title: string;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
    canonicalPath?: string;
    status: string;
    sections: SectionRow[];
  } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [sectionSaveState, setSectionSaveState] = useState<SectionSaveState>(null);
  const [publishing, setPublishing] = useState(false);
  const [newSectionType, setNewSectionType] = useState<SectionType>("hero");
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiriesError, setInquiriesError] = useState<string | null>(null);

  async function parseJsonResponse(res: Response) {
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return res.json();
    }
    const text = await res.text();
    return {
      error: {
        message: `HTTP ${res.status}: ${text.slice(0, 140) || "Non-JSON response"}`,
      },
    };
  }

  const reload = useCallback(async () => {
    const res = await fetch(`/api/v1/admin/pages/${slugPathSegment(slug)}`);
    const json = await parseJsonResponse(res);
    if (!res.ok) throw new Error(json?.error?.message ?? "Load failed");
    setPage(json.data);
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } catch (e) {
        if (!cancelled) setMessage(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  useEffect(() => {
    const current = page?.slug ?? slug;
    const allowed = PAGE_SECTION_TYPES[current] ?? [];
    if (allowed.length > 0) {
      setNewSectionType((prev) => (allowed.includes(prev) ? prev : allowed[0]));
    }
  }, [page?.slug, slug]);

  useEffect(() => {
    if (!page || !["home", "about", "contact"].includes(page.slug)) return;
    let cancelled = false;
    setInquiriesLoading(true);
    setInquiriesError(null);
    (async () => {
      try {
        const res = await fetch(`/api/v1/admin/inquiries?sourcePage=${page.slug}`);
        const json = await parseJsonResponse(res);
        if (!res.ok) throw new Error(json?.error?.message ?? "Inquiry load failed");
        if (!cancelled) setInquiries((json.data ?? []) as InquiryRow[]);
      } catch (e) {
        if (!cancelled) setInquiriesError(e instanceof Error ? e.message : "Inquiry load failed");
      } finally {
        if (!cancelled) setInquiriesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page?.slug]);

  async function saveMeta(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!page) return;
    setSectionSaveState(null);
    const fd = new FormData(e.currentTarget);
    const nextSlug = normalizeSlugForPath(String(fd.get("slug") ?? ""));
    const res = await fetch(`/api/v1/admin/pages/${slugPathSegment(slug)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: nextSlug,
        title: fd.get("title"),
        seoTitle: fd.get("seoTitle") || undefined,
        seoDescription: fd.get("seoDescription") || undefined,
        ogImage: fd.get("ogImage") || undefined,
        canonicalPath: fd.get("canonicalPath") || undefined,
      }),
    });
    const json = await parseJsonResponse(res);
    if (!res.ok) {
      setMessage(json?.error?.message ?? "Save failed");
      return;
    }
    setPage(json.data);
    setMessage("Meta saved.");
    if (json.data.slug && json.data.slug !== slug) {
      router.replace(`/admin/pages/${json.data.slug}`);
    }
  }

  async function saveSection(section: SectionRow, data: Record<string, unknown>) {
    const targetSlug = normalizeSlugForPath(page?.slug ?? slug);
    const patchSection = async (sectionId: string) =>
      fetch(`/api/v1/admin/pages/${slugPathSegment(targetSlug)}/sections/${idPathSegment(sectionId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, type: section.type, order: section.order }),
      });

    let res = await patchSection(section.id);
    let json = await parseJsonResponse(res);

    if (!res.ok && res.status === 404) {
      await reload();
      const latestRes = await fetch(`/api/v1/admin/pages/${slugPathSegment(targetSlug)}`);
      const latestJson = await parseJsonResponse(latestRes);
      const latestPage = latestJson?.data as { sections?: SectionRow[] } | undefined;
      const targetType = normalizeSectionType(section.type);
      const replacement = latestPage?.sections?.find(
        (s) =>
          normalizeSectionType(s.type) === targetType &&
          (s.order === section.order || s.id === section.id),
      );
      if (replacement) {
        res = await patchSection(replacement.id);
        json = await parseJsonResponse(res);
      }
    }

    if (!res.ok) {
      setSectionSaveState({
        sectionId: section.id,
        message:
          json?.error?.message ??
          "Section save failed. Refresh this page once and try again.",
        tone: "error",
      });
      return;
    }
    setPage(json.data.page);
    setMessage(null);
    setSectionSaveState({
      sectionId: section.id,
      message: `Section ${section.type} saved.`,
      tone: "success",
    });
  }

  async function publish() {
    setPublishing(true);
    setMessage(null);
    setSectionSaveState(null);
    try {
      const targetSlug = normalizeSlugForPath(page?.slug ?? slug);
      const res = await fetch(`/api/v1/admin/pages/${slugPathSegment(targetSlug)}/publish`, {
        method: "POST",
      });
      const json = await parseJsonResponse(res);
      if (!res.ok) throw new Error(json?.error?.message ?? "Publish failed");
      setPage(json.data);
      setMessage("Published.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Publish error");
    } finally {
      setPublishing(false);
    }
  }

  if (loading) return <p className="admin-muted">Loading…</p>;
  if (!page) return <p className="contact-form__err">Page not found</p>;

  const currentSlug = page.slug;
  const pageSeoHints =
    defaultPageSeoBySlug[currentSlug] ?? {
      seoTitle: defaultSeoDefaults.defaultTitle,
      seoDescription: defaultSeoDefaults.defaultDescription,
    };
  const currentSlugSegment = slugPathSegment(currentSlug);
  const sorted = [...page.sections].sort((a, b) => a.order - b.order);
  const allowedSectionTypes = PAGE_SECTION_TYPES[currentSlug] ?? [];
  const visibleSections = sorted.filter((section) => {
    if (allowedSectionTypes.length === 0) return true;
    const normalized = toAllowedSectionType(section.type);
    return normalized ? allowedSectionTypes.includes(normalized) : false;
  });

  async function addSection() {
    const targetSlug = normalizeSlugForPath(page?.slug ?? slug);
    setMessage(null);
    setSectionSaveState(null);
    try {
      const res = await fetch(`/api/v1/admin/pages/${slugPathSegment(targetSlug)}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newSectionType,
          data: defaultSectionData(newSectionType),
        }),
      });
      const json = await parseJsonResponse(res);
      if (!res.ok) throw new Error(json?.error?.message ?? "Add section failed");
      setPage(json.data.page);
      setMessage(`Added section ${newSectionType}.`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Add section error");
    }
  }

  async function deleteSection(sectionId: string) {
    const targetSlug = normalizeSlugForPath(page?.slug ?? slug);
    setMessage(null);
    setSectionSaveState(null);
    try {
      const res = await fetch(
        `/api/v1/admin/pages/${slugPathSegment(targetSlug)}/sections/${idPathSegment(sectionId)}`,
        { method: "DELETE" },
      );
      const json = await parseJsonResponse(res);
      if (!res.ok) throw new Error(json?.error?.message ?? "Delete failed");
      setPage(json.data.page);
      setMessage("Section removed.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Delete error");
    }
  }

  async function swapOrder(a: SectionRow, b: SectionRow) {
    const targetSlug = normalizeSlugForPath(page?.slug ?? slug);
    setMessage(null);
    setSectionSaveState(null);
    try {
      const patch = async (id: string, order: number, type: string) =>
        fetch(
          `/api/v1/admin/pages/${slugPathSegment(targetSlug)}/sections/${idPathSegment(id)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order, type }),
          },
        );
      const res1 = await patch(a.id, b.order, a.type);
      const j1 = await parseJsonResponse(res1);
      if (!res1.ok) throw new Error(j1?.error?.message ?? "Reorder failed");
      const res2 = await patch(b.id, a.order, b.type);
      const j2 = await parseJsonResponse(res2);
      if (!res2.ok) throw new Error(j2?.error?.message ?? "Reorder failed");
      setPage(j2.data.page);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Reorder error");
    }
  }

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <Link href="/admin">← Dashboard</Link>
        <div style={{ display: "flex", gap: 8 }}>
          <a
            href={`/api/v1/admin/pages/${currentSlugSegment}/preview`}
            target="_blank"
            rel="noreferrer"
            className="admin-button-secondary"
          >
            Preview draft
          </a>
          <button type="button" onClick={() => publish()} disabled={publishing}>
            {publishing ? "Publishing…" : "Publish draft to live"}
          </button>
        </div>
      </nav>
      <div className="admin-card">
        <h1 style={{ marginTop: 0 }}>Edit page: {currentSlug}</h1>
        <p className="admin-muted">
          Status: <strong>{page.status}</strong>. Editing <strong>draft</strong> sections; visitors see
          published content until you publish.
        </p>
        {message ? <p className="contact-form__ok">{message}</p> : null}

        <form className="admin-form" onSubmit={saveMeta}>
          <h2>Page & SEO</h2>
          <p className="admin-muted" style={{ marginTop: 0 }}>
            Use THEA Medical Store branding in titles and descriptions for search results.
          </p>
          <label>
            Title
            <input name="title" key={page.title} defaultValue={page.title} required />
          </label>
          <label>
            SEO title
            <input
              name="seoTitle"
              key={page.seoTitle}
              defaultValue={page.seoTitle ?? ""}
              placeholder={pageSeoHints.seoTitle}
            />
          </label>
          <label>
            SEO description
            <textarea
              name="seoDescription"
              key={page.seoDescription}
              defaultValue={page.seoDescription ?? ""}
              placeholder={pageSeoHints.seoDescription}
              rows={3}
            />
          </label>
          <label>
            Slug (page url)
            <input
              name="slug"
              key={page.slug}
              defaultValue={page.slug}
              required
              disabled={page.slug === "home"}
              placeholder="about-us"
            />
          </label>
          {page.slug === "home" ? (
            <p className="admin-muted" style={{ margin: 0 }}>
              Home stays on the root route `/`.
            </p>
          ) : null}
          <ImageUploadField
            label="Open Graph image URL"
            name="ogImage"
            value={page.ogImage ?? ""}
            onChange={(value) =>
              setPage((current) => (current ? { ...current, ogImage: value } : current))
            }
            folder={`pages/${page.slug}/seo`}
          />
          <label>
            Canonical path
            <input
              name="canonicalPath"
              value={page.canonicalPath ?? ""}
              onChange={(e) =>
                setPage((current) =>
                  current ? { ...current, canonicalPath: e.target.value } : current,
                )
              }
              placeholder="https://example.com/about"
            />
          </label>
          <button type="submit">Save meta</button>
        </form>

        {["home", "about", "contact"].includes(page.slug) ? (
          <section className="admin-section-form" style={{ marginTop: 24 }}>
            <h3>
              {page.slug === "home"
                ? "Thea Inquiries"
                : `${page.title || page.slug} Requests`}
            </h3>
            <p className="admin-muted" style={{ marginTop: 0 }}>
              Latest messages sent from the {page.slug} page request form.
            </p>
            {inquiriesLoading ? <p className="admin-muted">Loading inquiries...</p> : null}
            {inquiriesError ? <p className="contact-form__err">{inquiriesError}</p> : null}
            {!inquiriesLoading && !inquiriesError && inquiries.length === 0 ? (
              <p className="admin-muted">No inquiries found.</p>
            ) : null}
            <div className="admin-dashboard__grid">
              {inquiries.map((inquiry) => (
                <article key={inquiry.id} className="admin-dashboard__page-card">
                  <span className="admin-dashboard__page-title">{inquiry.name}</span>
                  <span className="admin-dashboard__page-meta">{inquiry.email}</span>
                  {inquiry.phone ? (
                    <span className="admin-dashboard__page-meta">Phone: {inquiry.phone}</span>
                  ) : null}
                  {inquiry.company ? (
                    <span className="admin-dashboard__page-meta">Facility: {inquiry.company}</span>
                  ) : null}
                  {inquiry.inquiryType ? (
                    <span className="admin-dashboard__page-meta">Service: {inquiry.inquiryType}</span>
                  ) : null}
                  <span className="admin-dashboard__page-meta">{inquiry.message}</span>
                  <span className="admin-dashboard__page-link">
                    {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : "New inquiry"}
                  </span>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <h2>Sections (draft)</h2>
        {allowedSectionTypes.length > 0 ? (
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <select
              value={newSectionType}
              onChange={(e) => setNewSectionType(e.target.value as SectionType)}
            >
              {allowedSectionTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button type="button" className="admin-button-secondary" onClick={addSection}>
              Add section
            </button>
          </div>
        ) : null}
        {visibleSections.map((section) => (
          <div key={section.id} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button
                type="button"
                className="admin-button-secondary"
                onClick={() => deleteSection(section.id)}
              >
                Remove
              </button>
              <button
                type="button"
                className="admin-button-secondary"
                onClick={() => {
                  const idx = visibleSections.findIndex((s) => s.id === section.id);
                  if (idx > 0) swapOrder(visibleSections[idx], visibleSections[idx - 1]);
                }}
              >
                Move up
              </button>
              <button
                type="button"
                className="admin-button-secondary"
                onClick={() => {
                  const idx = visibleSections.findIndex((s) => s.id === section.id);
                  if (idx >= 0 && idx < visibleSections.length - 1) {
                    swapOrder(visibleSections[idx], visibleSections[idx + 1]);
                  }
                }}
              >
                Move down
              </button>
            </div>
            <SectionEditor
              section={section}
              onSave={(data) => saveSection(section, data)}
              previewHref={`/api/v1/admin/pages/${currentSlugSegment}/preview`}
              saveMessage={sectionSaveState?.sectionId === section.id ? sectionSaveState.message : null}
              saveMessageTone={sectionSaveState?.sectionId === section.id ? sectionSaveState.tone : "success"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionEditor({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: {
  section: SectionRow;
  onSave: (data: Record<string, unknown>) => void;
  previewHref: string;
  saveMessage?: string | null;
  saveMessageTone?: "success" | "error";
}) {
  const normalizedType = normalizeSectionType(section.type);

  switch (normalizedType) {
    case "hero":
      return (
        <HeroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "intro":
      return (
        <IntroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "services":
      return (
        <ServicesSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesGrid":
      return (
        <ServicesGridSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesCTA":
      return (
        <ServicesCtaSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesLicensing":
      return (
        <ServicesLicensingSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesPageHero":
      return (
        <ServicesPageHeroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesCapabilityCards":
      return (
        <ServicesCapabilityCardsSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesSpecialized":
      return (
        <ServicesSpecializedSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesProductCatalog":
      return (
        <ServicesProductCatalogSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesRegulatory":
      return (
        <ServicesRegulatorySectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesFooter":
      return (
        <ServicesFooterSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "clientsPageHero":
      return (
        <ClientsPageHeroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "clientsSectors":
      return (
        <ClientsSectorsSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "clientsCompliance":
      return (
        <ClientsComplianceSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "clientsTrustedBy":
      return (
        <ClientsTrustedBySectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "clientsPartnerCta":
      return (
        <ClientsPartnerCtaSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "productsCatalogShowcase":
      return (
        <ProductsCatalogShowcaseSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "productsFooter":
      return (
        <ProductsFooterSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "whyChoose":
      return (
        <WhyChooseSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "investment":
      return (
        <InvestmentSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "incubation":
      return (
        <IncubationSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "homeIncubationHighlight":
      return (
        <HomeIncubationHighlightSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "homeAbout":
      return (
        <HomeAboutSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "homeServicesGrid":
      return (
        <HomeServicesGridSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "homeProductCategories":
      return (
        <HomeProductCategoriesSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "homeTrustedBy":
      return (
        <HomeTrustedBySectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "homeQuickInquiry":
      return (
        <HomeQuickInquirySectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "homeWhyChoose":
      return (
        <HomeWhyChooseSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "globalStandards":
      return (
        <GlobalStandardsSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "clientLogos":
      return (
        <ClientLogosSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "cta":
      return (
        <CtaSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "contact":
      return (
        <ContactSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "contactHero":
      return (
        <ContactHeroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "contactInquiry":
      return (
        <ContactInquirySectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutHero":
      return (
        <AboutHeroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutMission":
      return (
        <AboutMissionSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutLeadership":
      return (
        <AboutLeadershipSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutRegulatory":
      return (
        <AboutRegulatorySectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutInquiry":
      return (
        <AboutInquirySectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutFooter":
      return (
        <AboutFooterSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutOverview":
      return (
        <AboutIntroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "coursesCatalog":
      return (
        <CoursesCatalogSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesAccordion":
      return (
        <ServicesAccordionSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutIntro":
      return (
        <AboutIntroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutVisionMission":
      return (
        <AboutVisionMissionSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutFramework":
      return (
        <AboutFrameworkSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutAdvantage":
      return (
        <AboutAdvantageSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutValues":
      return (
        <AboutValuesSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutCTA":
      return (
        <AboutCtaSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesHero":
      return (
        <ServicesHeroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "industriesHero":
      return (
        <IndustriesHeroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "industriesGrid":
      return (
        <IndustriesGridSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "industriesCta":
      return (
        <IndustriesCtaSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "researchHub":
      return (
        <ResearchHubSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "projectsHero":
      return (
        <ProjectsHeroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "projectsGrid":
      return (
        <ProjectsGridSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "projectsIntegrity":
      return (
        <ProjectsIntegritySectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "projectsPartners":
      return (
        <ProjectsPartnersSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    default:
      return (
        <JsonSectionEditor
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
  }
}

function JsonSectionEditor({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: {
  section: SectionRow;
  onSave: (data: Record<string, unknown>) => void;
  previewHref: string;
  saveMessage?: string | null;
  saveMessageTone?: "success" | "error";
}) {
  const [text, setText] = useState(JSON.stringify(section.data, null, 2));

  return (
    <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}>
      <h3>
        {section.type}{" "}
        <span className="admin-muted" style={{ fontWeight: 400 }}>
          (order {section.order}, id {section.id})
        </span>
      </h3>
      <label>
        Section data (JSON)
        <textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <div style={{ display: "grid", gap: 12 }}>
        <button
          type="button"
          onClick={() => {
            try {
              onSave(JSON.parse(text));
            } catch {
              // Unknown section types keep a JSON fallback editor.
            }
          }}
        >
          Save section
        </button>
        <div style={{ display: "grid", gap: 8 }}>
          <a href={previewHref} target="_blank" rel="noreferrer" className="admin-button-secondary">
            Preview draft
          </a>
          {saveMessage ? (
            <p className={saveMessageTone === "error" ? "contact-form__err" : "contact-form__ok"} style={{ margin: 0 }}>
              {saveMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
