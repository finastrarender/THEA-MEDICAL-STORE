/**
 * Utility to calculate seeded lengths for form validation.
 * These lengths are derived from the original design content.
 */

export function getSeededLength(value: string | string[] | undefined | null): number {
  if (!value) return 0;
  if (typeof value === "string") return value.length;
  if (Array.isArray(value)) {
    return value.join("\n").length;
  }
  return 0;
}

// Home Hero Defaults
export const homeHeroSeeded = {
  badge: "MOHAP CERTIFIED MEDICAL SUPPLIER",
  title: ["Reliable Medical", "Supplies &", "Equipment", "Solutions"],
  description:
    "Delivering clinical excellence through premium pharmaceutical products and cutting-edge medical equipment solutions tailored for modern healthcare providers.",
  primaryLabel: "Contact Us",
  secondaryLabel: "View Catalog",
  overlayLabel: "99.9%",
  overlayText: "Accuracy in medical supply distribution across UAE.",
};

export const homeHeroLimits = {
  badge: getSeededLength(homeHeroSeeded.badge),
  titleLines: getSeededLength(homeHeroSeeded.title),
  description: getSeededLength(homeHeroSeeded.description),
  primaryLabel: getSeededLength(homeHeroSeeded.primaryLabel),
  secondaryLabel: getSeededLength(homeHeroSeeded.secondaryLabel),
  overlayLabel: getSeededLength(homeHeroSeeded.overlayLabel),
  overlayText: getSeededLength(homeHeroSeeded.overlayText),
};

// About Hero (from thea-about-sections.ts)
export const aboutHeroSeeded = {
  eyebrow: "ESTABLISHED IN DUBAI",
  titleLead: "Precision in ",
  titleHighlight: "Medical",
  titleAfter: "Supply Chain.",
  description:
    "THEA Medical Store L.L.C. serves as a vital bridge between global healthcare innovation and regional clinical excellence. We curate medical solutions that define the future of patient care in the UAE.",
  quote: "Our mission is to ensure every medical facility in the region has access to the highest caliber of instruments and pharmaceuticals.",
  quoteAttribution: "EXECUTIVE BOARD",
};

export const aboutHeroLimits = {
  eyebrow: getSeededLength(aboutHeroSeeded.eyebrow),
  titleLead: getSeededLength(aboutHeroSeeded.titleLead),
  titleHighlight: getSeededLength(aboutHeroSeeded.titleHighlight),
  titleAfter: getSeededLength(aboutHeroSeeded.titleAfter),
  description: getSeededLength(aboutHeroSeeded.description),
  quote: getSeededLength(aboutHeroSeeded.quote),
  quoteAttribution: getSeededLength(aboutHeroSeeded.quoteAttribution),
};

export const aboutMissionLimits = {
  cardTitle: getSeededLength("Our Mission"),
  cardDescription: getSeededLength("To empower UAE healthcare providers through the seamless distribution of world-class medical equipment and pharmaceuticals, maintaining the highest standards of safety."),
};

export const aboutLeadershipLimits = {
  title: getSeededLength("The Clinical Leadership"),
  description: getSeededLength("Our executive team combines decades of medical logistics experience with clinical expertise to lead THEA toward excellence."),
  memberName: getSeededLength("Dr. Salim Al-Maktoum"),
  memberRole: getSeededLength("CHIEF EXECUTIVE OFFICER"),
  memberBio: getSeededLength("20+ Years in Pharmaceutical Logistics."),
};

export const aboutRegulatoryLimits = {
  title: getSeededLength("Regulatory Excellence & Certification"),
  isoLine1: getSeededLength("ISO 9001:2015"),
  isoLine2: getSeededLength("Certified"),
  guaranteeTitle: getSeededLength("Total Compliance Guarantee"),
  guaranteeText: getSeededLength("Every pharmaceutical and medical device entering our inventory undergoes rigorous secondary verification to ensure compliance with UAE Ministry of Health and Prevention (MOHAP) protocols."),
};

export const aboutInquiryLimits = {
  description: getSeededLength("Submit your requirements and our clinical team will respond within 12 business hours."),
  submitLabel: getSeededLength("Submit Request"),
};

// Home sections
export const homeAboutLimits = {
  title: getSeededLength("About THEA Medical Store"),
  description: getSeededLength("At THEA Medical Store L.L.C., we stand as a cornerstone of healthcare reliability in the United Arab Emirates. Our commitment goes beyond simple supply; we provide a curated ecosystem of pharmaceutical grade products and clinical equipment."),
  description2: getSeededLength("With a focus on precision and regulatory compliance, we serve as the bridge between global medical innovations and local healthcare excellence, ensuring every clinic, hospital, and laboratory has the tools they need to save lives."),
  missionTitle: getSeededLength("Our Mission"),
  missionText: getSeededLength("Elevating patient care through uncompromising supply chain integrity."),
  visionTitle: getSeededLength("Our Vision"),
  visionText: getSeededLength("To be the most trusted name in clinical procurement in the MENA region."),
};

export const servicesGridLimits = {
  cardCategory: getSeededLength("Real Estate"),
  cardTitle: getSeededLength("RAK Waterfront Series"),
  cardDescription: getSeededLength("Archiving the evolution of institutional-grade tokenization through secure and transparent digital frameworks."),
  featuresLines: getSeededLength(["Feature 1", "Feature 2"]),
};

export const capabilityCardsLimits = {
  eyebrow: getSeededLength("CAPABILITIES"),
  title: getSeededLength("Leading Digital Transformation"),
};

export const qualityGridLimits = {
  title: getSeededLength("Quality Standards"),
  cardTitle: getSeededLength("MOHAP Certified"),
  cardDescription: getSeededLength("Ensuring adherence to Ministry of Health and Prevention standards."),
};

export const clientsHeroLimits = {
  badge: getSeededLength("COLLABORATIVE EXCELLENCE"),
  titleLead: getSeededLength("Strategic "),
  titleHighlight: getSeededLength("Healthcare"),
  titleAfter: getSeededLength("Alliances."),
  description: getSeededLength("We partner with the UAE's leading hospitals, clinics, and pharmacies to deliver clinical-grade medical solutions that define the future of care."),
};

export const clientsSectorsLimits = {
  title: getSeededLength("Strategic Sector Expertise"),
  titleAccent: getSeededLength("Expertise"),
  cardTitle: getSeededLength("Government Hospitals"),
  cardDescription: getSeededLength("Providing large-scale pharmaceutical supply and critical care equipment to state-run healthcare infrastructure."),
};

export const clientsComplianceLimits = {
  title: getSeededLength("The Gold Standard of Regulatory Excellence"),
  description: getSeededLength("THEA Medical Store operates with surgical precision when it comes to compliance. We are not just a distributor; we are a MOHAP-licensed partner committed to upholding the highest federal healthcare standards of the United Arab Emirates."),
};

export const trustedByLimits = {
  title: getSeededLength("OUR TRUSTED HEALTHCARE PARTNERS"),
  eyebrow: getSeededLength("TRUSTED BY INSTITUTIONAL LEADERS"),
  cardLabel: getSeededLength("Hospitals"),
};

export const clientsPartnerCtaLimits = {
  title: getSeededLength("Become a Strategic Partner"),
  description: getSeededLength("Join our network of elite healthcare providers and experience the standard of clinical supply chain excellence."),
  primaryLabel: getSeededLength("Contact Procurement"),
  secondaryLabel: getSeededLength("View Catalog"),
};

export const homeServicesLimits = {
  title: getSeededLength("Specialized Healthcare Services"),
  description: getSeededLength("Comprehensive operational and logistical support for modern medical facilities."),
  cardTitle: getSeededLength("Used Medical Equipment Trading"),
  cardDescription: getSeededLength("Licensed distribution and storage of pharmaceutical medicines with strict temperature control protocols."),
};

export const whyChooseLimits = {
  title: getSeededLength("Why Choose THEA Medical Store"),
  subheading: getSeededLength("We combine deep local expertise with international standard supply chain protocols."),
  description: getSeededLength("We combine deep local expertise with international standard supply chain protocols."),
  itemTitle: getSeededLength("MOHAP CERTIFIED"),
  itemDescription: getSeededLength("Ensuring all products meet the rigorous safety and quality standards of the UAE Ministry of Health."),
  cardTitle: getSeededLength("MOHAP CERTIFIED"),
  cardDescription: getSeededLength("Ensuring all products meet the rigorous safety and quality standards of the UAE Ministry of Health."),
};

export const ctaSectionLimits = {
  title: getSeededLength("READY TO ELEVATE YOUR CLINICAL INFRASTRUCTURE?"),
  description: getSeededLength("Partner with the UAE's premier medical distribution and equipment firm for unparalleled expertise and reliability."),
  actionLabel: getSeededLength("REQUEST CREDENTIALS"),
  primaryLabel: getSeededLength("REQUEST CREDENTIALS"),
  secondaryLabel: getSeededLength("VIEW SOLUTIONS"),
};

export const productCategoriesLimits = {
  title: getSeededLength("Product Categories"),
  cardTitle: getSeededLength("Laboratory & Testing"),
  cardDescription: getSeededLength("Precision diagnostic instruments for clinical laboratories and research centers."),
};

// Merged above

export const quickInquiryLimits = {
  title: getSeededLength("Quick Inquiry"),
  description: getSeededLength("Ready to streamline your medical supply chain? Send us your requirements and our procurement specialists will contact you within 24 hours."),
  submitLabel: getSeededLength("Send Message"),
};

export const aboutMissionVisionLimits = {
  missionTitle: getSeededLength("Our Mission"),
  missionText: getSeededLength("Elevating patient care through uncompromising supply chain integrity."),
  visionTitle: getSeededLength("Our Vision"),
  visionText: getSeededLength("To be the most trusted name in clinical procurement in the MENA region."),
};

export const productsCatalogShowcaseLimits = {
  badge: getSeededLength("PREMIUM MEDICAL GRADE"),
  titleLead: getSeededLength("Advanced "),
  titleHighlight: getSeededLength("Clinical Portfolio."),
  description: getSeededLength("Explore our meticulously curated selection of world-class medical equipment and pharmaceuticals, specifically chosen to meet the rigorous clinical standards of the UAE healthcare landscape."),
  featuredTitle: getSeededLength("Diagnostic Imaging"),
  featuredDescription: getSeededLength("State-of-the-art MRI, CT, and Ultrasound solutions."),
  featuredLinkLabel: getSeededLength("View Imaging Catalog"),
  equipmentTitle: getSeededLength("Patient Care"),
  equipmentDescription: getSeededLength("Comprehensive ICU and surgical ward equipment."),
  equipmentButtonLabel: getSeededLength("Critical Care"),
  surgicalTitle: getSeededLength("Surgical Supplies"),
  surgicalDescription: getSeededLength("Precision instruments for specialized medical procedures."),
  consumablesTitle: getSeededLength("Medical Consumables"),
  consumablesDescription: getSeededLength("High-quality disposable medical supplies for daily hospital operations."),
  consumablesLinkLabel: getSeededLength("View Consumables"),
  secondaryBannerTitle: getSeededLength("UAE Healthcare Logistics"),
  secondaryBannerDescription: getSeededLength("24/7 pharmaceutical distribution and cold chain management."),
  qualityTitle: getSeededLength("Quality Guarantee"),
  qualityDescription: getSeededLength("All our products are MOHAP certified and meet international ISO standards."),
};

export const servicesHeroLimits = {
  badge: getSeededLength("CLINICAL SERVICES"),
  title: getSeededLength("Comprehensive Healthcare Support"),
  description: getSeededLength("We provide end-to-end operational and logistics solutions for healthcare facilities, ensuring clinical excellence at every touchpoint."),
};

export const servicesCapabilityLimits = {
  cardTitle: getSeededLength("Pharmaceutical Logistics"),
  cardDescription: getSeededLength("MOHAP-compliant storage and distribution of temperature-sensitive medications."),
};

export const servicesSpecializedLimits = {
  title: getSeededLength("Strategic Clinical Expertise"),
  itemTitle: getSeededLength("Licensed & Compliant"),
  itemDescription: getSeededLength("Adhering to the highest MOHAP regulatory standards for medical distribution."),
  tileValue: getSeededLength("500+"),
  tileLabel: getSeededLength("Hospitals Served"),
  tileTitle: getSeededLength("Emergency Response"),
  tileBrandLine: getSeededLength("TRUSTED PARTNER"),
  tileBrandSub: getSeededLength("MOHAP Certified Supply Chain"),
};

export const servicesProductCatalogLimits = {
  title: getSeededLength("Clinical Equipment Catalog"),
  description: getSeededLength("Browse our comprehensive range of clinicalgrade instruments and pharmaceutical supplies."),
};

export const servicesRegulatoryLimits = {
  title: getSeededLength("Regulatory Excellence"),
  description: getSeededLength("Our compliance specialists ensure every piece of medical equipment and pharmaceutical product meets UAE Ministry of Health (MOHAP) protocols."),
  tableTitle: getSeededLength("Certification & Global Standards"),
};

export const siteGlobalLimits = {
  headerBrand: getSeededLength("THEA Medical Store"),
  navLabel: getSeededLength("Services"),
  footerBrand: getSeededLength("THEA Medical Store"),
  footerDescription: getSeededLength("Excellence in medical distribution and equipment solutions for the UAE's thriving healthcare sector."),
  footerCopyright: getSeededLength("© 2024 THEA Medical Store L.L.C. All rights reserved."),
  footerCtaLabel: getSeededLength("REQUEST CREDENTIALS"),
  seoTitle: getSeededLength("THEA Medical Store"),
  seoDescription: getSeededLength("THEA Medical Store delivers premium pharmaceutical products and cutting-edge medical equipment solutions for healthcare providers across the UAE."),
  linkColumnTitle: getSeededLength("Categories"),
  contactColumnTitle: getSeededLength("Support"),
  complianceColumnTitle: getSeededLength("Compliance"),
  complianceColumnBody: getSeededLength("Regulatory Compliance: MOHAP Certified. Licensed medical distributor operating under UAE federal laws."),
};

export const productsFooterLimits = {
  brand: getSeededLength("THEA Medical Store"),
  description: getSeededLength("Excellence in medical distribution and equipment solutions for the UAE's thriving healthcare sector."),
  solutionsTitle: getSeededLength("Categories"),
  contactTitle: getSeededLength("Support"),
  newsletterTitle: getSeededLength("Stay Informed"),
  copyright: getSeededLength("© 2024 THEA Medical Store L.L.C. All rights reserved."),
};

export const servicesFooterLimits = productsFooterLimits;

export const applyNowModalLimits = {
  panelTitle: getSeededLength("Unlock Your Potential"),
  panelDescription: getSeededLength("Join a global community of innovators and business leaders in Dubai's premier business hub."),
  highlight: getSeededLength("Startup Incubator"),
  formTitle: getSeededLength("Request Information"),
  formDescription: getSeededLength("Fill in the details below to receive a personalized program consultation."),
  label: getSeededLength("PHONE NUMBER"),
  placeholder: getSeededLength("Tell us about your career goals..."),
  termsText: getSeededLength("I agree to the Terms of Service and Privacy Policy."),
  marketingConsentText: getSeededLength("I consent to receive promotional offers and communication via email and SMS."),
  submitLabel: getSeededLength("ENROLL NOW"),
};

// Common sections (used in SectionForms.tsx)
// Note: These might need to be grouped by section type.

export const introLimits = {
  titleLines: getSeededLength(["The Foundation of", "Digital Trust"]),
  description: getSeededLength("Cryptonexis Limited stands at the forefront of the UAE's evolving digital economy. As a regulated issuer of non-fungible tokens, we provide institutional clients with the legal and technical scaffolding required for sophisticated asset management."),
  more: getSeededLength("Our approach is built on three core pillars: regulatory compliance, architectural integrity, and cryptographic security. We do not participate in speculative retail markets; we build utility-driven ecosystems for the modern enterprise."),
  cardLabel: getSeededLength("LICENSING AUTHORITY"),
  cardDescription: getSeededLength("Cryptonexis Limited is registered and regulated within the RAK Economic Zone, ensuring structural compliance across all digital asset issuance protocols."),
  cardLinkLabel: getSeededLength("REVIEW CERTIFICATION"),
};

export const servicesLimits = {
  eyebrow: getSeededLength("OUR CAPABILITIES"),
  title: getSeededLength("CORE PILLARS"),
  description: getSeededLength("Briefly describe your service offering and value."),
  cardTitle: getSeededLength("Business Setup"),
  cardDescription: getSeededLength("Describe what this service includes."),
};
