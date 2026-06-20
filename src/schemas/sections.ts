import { z } from "zod";
import { SECTION_TYPES, type SectionType } from "@/types/section";

const navItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  active: z.boolean().optional(),
});

const footerLinkColumnSchema = z.object({
  title: z.string(),
  links: z.array(z.object({ label: z.string(), href: z.string() })),
});

const footerContactColumnSchema = z.object({
  title: z.string(),
  contact: z.array(
    z.object({
      type: z.enum(["location", "phone", "mail"]),
      value: z.string(),
    }),
  ),
});

const footerBodyColumnSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export const heroDataSchema = z.object({
  badge: z.string().max(40).optional(),
  title: z.array(z.string().max(40)),
  lede: z.string().max(100).optional(),
  description: z.string().max(300),
  primaryAction: z.object({ label: z.string().max(25), href: z.string() }),
  secondaryAction: z.object({ label: z.string().max(25), href: z.string() }),
  backgroundImage: z.string().optional(),
  overlayLabel: z.string().max(40).optional(),
  overlayText: z.string().max(100).optional(),
});

const introStatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const introDataSchema = z.object({
  eyebrow: z.string().max(40).optional(),
  title: z.array(z.string().max(40)),
  description: z.string().max(500),
  highlights: z.array(z.string().max(60)).optional(),
  image: z.string().optional(),
  more: z.string().max(40).optional(),
  href: z.string().optional(),
  icon: z.string().optional(),
  expcount: z.number().optional(),
  stats: z.array(introStatSchema).optional(),
  cardLabel: z.string().max(40).optional(),
  cardDescription: z.string().max(160).optional(),
  cardLinkLabel: z.string().max(25).optional(),
  cardHref: z.string().optional(),
});

const serviceCardSchema = z.object({
  title: z.string().max(40),
  description: z.string().max(160),
  icon: z.string().optional(),
  iconImage: z.string().optional(),
  category: z.string().max(25).optional(),
  points: z.array(z.string().max(60)).optional(),
});

const applyNowModalSchema = z.object({
  panelTitle: z.string(),
  panelDescription: z.string(),
  panelHighlights: z.array(z.string()),
  formTitle: z.string(),
  formDescription: z.string(),
  fullNameLabel: z.string(),
  fullNamePlaceholder: z.string(),
  phoneLabel: z.string(),
  phonePlaceholder: z.string(),
  emailLabel: z.string(),
  emailPlaceholder: z.string(),
  cityLabel: z.string(),
  cityPlaceholder: z.string(),
  cityOptions: z.array(z.string()),
  experienceLabel: z.string(),
  experiencePlaceholder: z.string(),
  experienceOptions: z.array(z.string()),
  messageLabel: z.string(),
  messagePlaceholder: z.string(),
  customFields: z.array(
    z.object({
      label: z.string(),
      placeholder: z.string(),
      inputType: z.enum(["text", "email", "number"]),
    }),
  ),
  termsText: z.string(),
  marketingConsentText: z.string(),
  submitLabel: z.string(),
});

export const servicesDataSchema = z.object({
  eyebrow: z.string().max(40).optional(),
  title: z.string().max(40),
  description: z.string().max(300),
  backgroundImage: z.string().optional(),
  cards: z.array(serviceCardSchema),
});

export const servicesAccordionDataSchema = z.object({
  cards: z.array(serviceCardSchema).min(1),
});

const servicesGridCardSchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  cta: z.string(),
  icon: z.string().optional(),
});

export const servicesGridDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  filters: z.array(z.string()).min(1),
  cards: z.array(servicesGridCardSchema).min(1),
});

export const servicesCtaDataSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(200),
  primaryAction: z.object({ label: z.string().max(25), href: z.string() }),
  secondaryAction: z.object({ label: z.string().max(25), href: z.string() }),
});

const servicesLicensingRowSchema = z.object({
  licenseNumber: z.string(),
  authority: z.string(),
  legalType: z.string(),
  location: z.string(),
  status: z.string().optional(),
});

const servicesLicensingCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  linkLabel: z.string(),
  linkHref: z.string().optional(),
  icon: z.string().optional(),
});

export const servicesLicensingDataSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.array(z.string()).optional(),
  description: z.string().optional(),
  cards: z.array(servicesLicensingCardSchema).optional(),
  licenses: z.array(servicesLicensingRowSchema).optional(),
  complianceNotice: z.string().optional(),
  reliabilityTitle: z.string().optional(),
  reliabilityDescription: z.string().optional(),
});

const projectsGridItemSchema = z.object({
  category: z.string(),
  title: z.string(),
  image: z.string(),
});

export const projectsHeroDataSchema = z.object({
  eyebrow: z.string().optional(),
  titleLines: z.array(z.string()).min(1).optional(),
  description: z.string().optional(),
});

export const projectsGridDataSchema = z.object({
  items: z.array(projectsGridItemSchema).min(1).optional(),
});

const projectsIntegrityItemSchema = z.object({
  icon: z.string().optional(),
  title: z.string(),
  description: z.string(),
});

export const projectsIntegrityDataSchema = z.object({
  heading: z.string().optional(),
  description: z.string().optional(),
  items: z.array(projectsIntegrityItemSchema).min(1).optional(),
});

const projectsPartnersPlaceholdersSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
});

export const projectsPartnersDataSchema = z.object({
  formTitle: z.string().optional(),
  submitLabel: z.string().optional(),
  mapImage: z.string().optional(),
  hqLabel: z.string().optional(),
  hqTitle: z.string().optional(),
  hqAddress: z.string().optional(),
  contactLabel: z.string().optional(),
  contactEmail: z.string().optional(),
  placeholders: projectsPartnersPlaceholdersSchema.optional(),
  successMessage: z.string().optional(),
  errorMessage: z.string().optional(),
});

const courseCardSchema = z.object({
  badge: z.string(),
  title: z.string(),
  description: z.string(),
  skills: z.array(z.string()),
  weeks: z.string(),
  image: z.string(),
  category: z.string().optional(),
  level: z.string().optional(),
});

export const coursesCatalogDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  levels: z.array(z.string()),
  durations: z.array(z.string()),
  courses: z.array(courseCardSchema).min(1),
});

export const whyChooseItemSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string(),
  tags: z.array(z.string()).optional(),
});

export const whyChooseDataSchema = z.object({
  title: z.string(),
  subheading: z.string().optional(),
  items: z.array(whyChooseItemSchema),
});

const incubationStepSchema = z.object({
  number: z.number(),
  title: z.string(),
  description: z.string(),
});

export const homeIncubationHighlightDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  steps: z.array(incubationStepSchema).length(3),
  image: z.string(),
  stat: z.object({
    value: z.string(),
    label: z.string(),
  }),
});

const incubationRoadmapItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  points: z.array(z.string()).default([]),
  image: z.string(),
});

const incubationPortfolioMetricSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const incubationPortfolioCardSchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
  metrics: z.array(incubationPortfolioMetricSchema).min(1),
  image: z.string().optional(),
});

const incubationApplicationFieldSchema = z.object({
  label: z.string(),
  placeholder: z.string(),
});

export const incubationDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  steps: z.array(incubationStepSchema).min(1),
  image: z.string(),
  stat: z.object({
    value: z.string(),
    label: z.string(),
  }),
  badge: z.string().optional(),
  heroTitleLines: z.array(z.string()).optional(),
  heroDescription: z.string().optional(),
  primaryAction: z.object({ label: z.string(), href: z.string() }).optional(),
  secondaryAction: z.object({ label: z.string(), href: z.string() }).optional(),
  roadmapTitle: z.string().optional(),
  roadmapSubtitle: z.string().optional(),
  roadmapItems: z.array(incubationRoadmapItemSchema).optional(),
  portfolioTitle: z.string().optional(),
  portfolioDescription: z.string().optional(),
  portfolioAction: z.object({ label: z.string(), href: z.string() }).optional(),
  portfolioCards: z.array(incubationPortfolioCardSchema).optional(),
  applicationTitle: z.string().optional(),
  applicationDescription: z.string().optional(),
  applicationFields: z.array(incubationApplicationFieldSchema).optional(),
  applicationSubmitLabel: z.string().optional(),
  applicationNote: z.string().optional(),
});

const globalStandardsPillarSchema = z.object({
  icon: z.string().optional(),
  title: z.string(),
  description: z.string(),
});

export const globalStandardsDataSchema = z.object({
  eyebrow: z.string().max(40).optional(),
  title: z.string().max(40),
  description: z.string().max(300),
  pillars: z.array(globalStandardsPillarSchema).min(1),
});

export const homeAboutDataSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(500),
  description2: z.string().max(500).optional(),
  image: z.string().optional(),
  missionTitle: z.string().max(40),
  missionText: z.string().max(300),
  visionTitle: z.string().max(40),
  visionText: z.string().max(300),
});

const homeServiceItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const homeServicesGridDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(homeServiceItemSchema).min(1),
});

const homeProductCategorySchema = z.object({
  layout: z.enum(["tall", "wide", "small"]).optional(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  theme: z.enum(["pharma", "equipment", "surgical", "consumables"]).optional(),
});

export const homeProductCategoriesDataSchema = z.object({
  title: z.string().max(60),
  categories: z.array(homeProductCategorySchema).min(4),
});

const homeTrustedByItemSchema = z.object({
  icon: z.string(),
  label: z.string(),
});

export const homeTrustedByDataSchema = z.object({
  title: z.string(),
  items: z.array(homeTrustedByItemSchema).min(1),
});

const homeQuickInquiryContactSchema = z.object({
  icon: z.enum(["phone", "mail", "location"]),
  value: z.string(),
});

export const homeQuickInquiryDataSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(300),
  contacts: z.array(homeQuickInquiryContactSchema).min(1),
  submitLabel: z.string().max(25).optional(),
  serviceOptions: z.array(z.string().max(40)).optional(),
  successMessage: z.string().max(100).optional(),
  errorMessage: z.string().max(100).optional(),
});

const homeWhyChooseItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const homeWhyChooseDataSchema = z.object({
  title: z.string().max(60),
  items: z.array(homeWhyChooseItemSchema).min(1),
  image: z.string().optional(),
});

const servicesCapabilityCardSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  features: z.array(z.string()).min(1),
});

export const servicesPageHeroDataSchema = z.object({
  badge: z.string(),
  title: z.string(),
  description: z.string(),
});

export const servicesCapabilityCardsDataSchema = z.object({
  cards: z.array(servicesCapabilityCardSchema).min(1),
});

const servicesSpecializedItemSchema = z.object({
  accent: z.enum(["teal", "blue"]),
  title: z.string(),
  description: z.string(),
});

const servicesSpecializedTileSchema = z.object({
  variant: z.enum(["stat", "image", "brand", "product"]),
  icon: z.string().optional(),
  value: z.string().optional(),
  label: z.string().optional(),
  title: z.string().optional(),
  image: z.string().optional(),
  brandLine: z.string().optional(),
  brandSub: z.string().optional(),
});

export const servicesSpecializedDataSchema = z.object({
  title: z.string(),
  items: z.array(servicesSpecializedItemSchema).min(1),
  tiles: z.array(servicesSpecializedTileSchema).min(4).max(4),
});

const servicesCatalogFilterSchema = z.object({
  id: z.string(),
  label: z.string(),
});

const servicesCatalogProductSchema = z.object({
  title: z.string(),
  category: z.string(),
  filterId: z.string(),
  image: z.string().optional(),
  href: z.string().optional(),
});

export const servicesProductCatalogDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  filters: z.array(servicesCatalogFilterSchema).min(1),
  products: z.array(servicesCatalogProductSchema).min(1),
});

const servicesRegulatoryCertSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
});

const servicesRegulatoryStandardSchema = z.object({
  deviceCategory: z.string(),
  standard: z.string(),
  status: z.string(),
});

export const servicesRegulatoryDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  certifications: z.array(servicesRegulatoryCertSchema).min(1),
  tableTitle: z.string(),
  standards: z.array(servicesRegulatoryStandardSchema).min(1),
});

const servicesFooterLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const servicesFooterDataSchema = z.object({
  brand: z.string(),
  description: z.string(),
  solutionsTitle: z.string(),
  solutionLinks: z.array(servicesFooterLinkSchema).min(1),
  contactTitle: z.string(),
  phone: z.string(),
  email: z.string(),
  location: z.string(),
  newsletterTitle: z.string(),
  emailPlaceholder: z.string().optional(),
  subscribeLabel: z.string().optional(),
  copyright: z.string(),
});

const clientsHeroCertSchema = z.object({
  label: z.string(),
});

export const clientsPageHeroDataSchema = z.object({
  badge: z.string().max(40),
  titleLead: z.string().max(40),
  titleHighlight: z.string().max(40),
  titleAfter: z.string().max(40),
  description: z.string().max(300),
  backgroundImage: z.string().optional(),
  certifications: z.array(clientsHeroCertSchema).min(1),
});

const clientsSectorCardSchema = z.object({
  layout: z.enum(["featured", "standard"]),
  variant: z.enum(["light", "dark"]),
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  bullets: z.array(z.string()).optional(),
  image: z.string().optional(),
  showFamilyDecor: z.boolean().optional(),
});

export const clientsSectorsDataSchema = z.object({
  title: z.string(),
  titleAccent: z.string().optional(),
  cards: z.array(clientsSectorCardSchema).min(1),
});

const clientsComplianceBadgeSchema = z.object({
  label: z.string(),
});

const clientsComplianceCertSchema = z.object({
  icon: z.string(),
  label: z.string(),
});

export const clientsComplianceDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  approvalBadges: z.array(clientsComplianceBadgeSchema).min(1),
  certifications: z.array(clientsComplianceCertSchema).min(1),
});

const clientsTrustedLogoSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
});

export const clientsTrustedByDataSchema = z.object({
  title: z.string(),
  logos: z.array(clientsTrustedLogoSchema).min(1),
});

const clientsCtaActionSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const clientsPartnerCtaDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  primaryAction: clientsCtaActionSchema,
  secondaryAction: clientsCtaActionSchema,
});

const productsCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
});

export const productsCatalogShowcaseDataSchema = z.object({
  badge: z.string(),
  titleLead: z.string(),
  titleHighlight: z.string(),
  description: z.string(),
  featured: productsCardSchema.extend({
    linkLabel: z.string(),
    linkHref: z.string().optional(),
  }),
  equipment: productsCardSchema.extend({
    buttonLabel: z.string(),
  }),
  surgical: productsCardSchema,
  consumables: productsCardSchema.extend({
    linkLabel: z.string(),
    linkHref: z.string().optional(),
  }),
  secondaryBanner: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).min(1),
  }),
  quality: z.object({
    title: z.string(),
    description: z.string(),
    certifications: z.array(z.string()).min(1),
  }),
});

const productsFooterLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const productsFooterDataSchema = z.object({
  brand: z.string(),
  copyright: z.string(),
  links: z.array(productsFooterLinkSchema).min(1),
});

export const investmentDataSchema = z.object({
  id: z.string().optional(),
  heading: z.array(z.string()).min(1),
  items: z
    .array(
      z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    )
    .min(1),
  quoteText: z.string(),
  quoteAuthor: z.string(),
  quoteRole: z.string(),
});

export const clientLogosDataSchema = z.object({
  eyebrow: z.string().optional(),
  logos: z.array(
    z.object({
      src: z.string(),
      alt: z.string().optional(),
    })
  ).default([]),
});

export const ctaDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  action: z.object({ label: z.string(), href: z.string() }),
});

export const contactDataSchema = z.object({
  headline: z.string(),
  subtext: z.string(),
});

export const contactHeroDataSchema = z.object({
  title: z.array(z.string()),
  description: z.string(),
  stat: z.string(),
  backgroundImage: z.string(),
});

export const industriesHeroDataSchema = z.object({
  badge: z.string(),
  title: z.array(z.string()).min(1),
  description: z.string(),
  primaryAction: z.object({ label: z.string(), href: z.string() }),
  secondaryAction: z.object({ label: z.string(), href: z.string() }),
});

const industriesGridItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const industriesGridDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(industriesGridItemSchema).min(1),
  partnerCard: z.object({
    title: z.string(),
    description: z.string(),
    href: z.string(),
  }),
});

export const industriesCtaDataSchema = z.object({
  title: z.array(z.string()).min(1),
  description: z.string(),
  primaryAction: z.object({ label: z.string(), href: z.string() }),
  secondaryAction: z.object({ label: z.string(), href: z.string() }),
});

const contactInfoItemSchema = z.object({
  title: z.string(),
  lines: z.array(z.string()),
  icon: z.string(),
});

const contactDepartmentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  email: z.string(),
});

const contactFormFieldsSchema = z.object({
  departmentHeading: z.string().optional(),
  fullNameLabel: z.string().optional(),
  fullNamePlaceholder: z.string().optional(),
  companyLabel: z.string().optional(),
  companyPlaceholder: z.string().optional(),
  workEmailLabel: z.string().optional(),
  workEmailPlaceholder: z.string().optional(),
  phoneLabel: z.string().optional(),
  phonePlaceholder: z.string().optional(),
  interestLabel: z.string().optional(),
  interestPlaceholder: z.string().optional(),
  messageLabel: z.string().optional(),
  messagePlaceholder: z.string().optional(),
  disclaimerText: z.string().optional(),
  successMessage: z.string().optional(),
  errorMessage: z.string().optional(),
});

const contactHqItemSchema = z.object({
  icon: z.string(),
  label: z.string().optional(),
  value: z.string(),
  note: z.string().optional(),
});

const contactHoursRowSchema = z.object({
  days: z.string(),
  hours: z.string(),
});

const contactLocationMatrixSchema = z.object({
  label: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  mapImage: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  linkLabel: z.string().optional(),
  linkHref: z.string().optional(),
});

export const contactInquiryDataSchema = z.object({
  heroEyebrow: z.string().optional(),
  heroTitle: z.string().optional(),
  heroTitleLines: z.array(z.string()).optional(),
  heroSideCopy: z.string().optional(),
  submitLabel: z.string().optional(),
  hqHeading: z.string().optional(),
  hqContacts: z.array(contactHqItemSchema).optional(),
  hoursHeading: z.string().optional(),
  hoursRows: z.array(contactHoursRowSchema).optional(),
  complianceText: z.string().optional(),
  locationMatrix: contactLocationMatrixSchema.optional(),
  formFields: contactFormFieldsSchema.optional(),
  formTitle: z.string().optional(),
  formDescription: z.string().optional(),
  inquiryOptions: z.array(z.string()).optional(),
  officeHeading: z.string().optional(),
  officeItems: z.array(contactInfoItemSchema).optional(),
  departmentContacts: z.array(contactDepartmentSchema).optional(),
  mapImage: z.string().optional(),
  mapLabelTitle: z.string().optional(),
  mapLabelSubtitle: z.string().optional(),
});
export const serviceHeroDataSchema = z.object({
  title: z.array(z.string()).min(1),
  description: z.string(),
});

export const aboutHeroDataSchema = z.object({
  eyebrow: z.string().max(40).optional(),
  titleLead: z.string().max(40).optional(),
  titleHighlight: z.string().max(40).optional(),
  titleAfter: z.string().max(40).optional(),
  titleLines: z.array(z.string().max(40)).min(1).optional(),
  /** @deprecated Legacy fields */
  titleAccent: z.string().max(40).optional(),
  titleMain: z.string().max(40).optional(),
  sideCopy: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  highlights: z
    .array(
      z.object({
        title: z.string().max(25),
        subtitle: z.string().max(60),
        accent: z.enum(["teal", "blue"]).optional(),
      }),
    )
    .optional(),
  quote: z.string().max(160).optional(),
  quoteAttribution: z.string().max(60).optional(),
  image: z.string().optional(),
  backgroundImage: z.string().optional(),
});

const aboutMissionCardSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string().optional(),
  bullets: z.array(z.string()).optional(),
});

export const aboutMissionDataSchema = z.object({
  cards: z.array(aboutMissionCardSchema).min(1).optional(),
  label: z.string().optional(),
  headlineLead: z.string().optional(),
  headlineBold: z.string().optional(),
  description: z.string().optional(),
  pillars: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
});

export const aboutLeadershipDataSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  asideLabel: z.string().optional(),
  members: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        bio: z.string(),
        image: z.string().optional(),
      }),
    )
    .min(1),
});

const aboutRegulatoryItemSchema = z.object({
  icon: z.string().optional(),
  title: z.string(),
  description: z.string(),
});

export const aboutRegulatoryDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  mohapLogo: z.string().optional(),
  isoLine1: z.string().optional(),
  isoLine2: z.string().optional(),
  guaranteeTitle: z.string().optional(),
  guaranteeText: z.string().optional(),
  items: z.array(aboutRegulatoryItemSchema).min(1).optional(),
  badge: z.string().optional(),
  stats: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .optional(),
  cardTitle: z.string().optional(),
  cardItems: z.array(z.string()).optional(),
});

const aboutInquiryContactSchema = z.object({
  icon: z.enum(["phone", "mail", "clock"]),
  label: z.string(),
  value: z.string(),
  note: z.string().optional(),
});

const aboutInquiryMapSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  mapImage: z.string().optional(),
  linkHref: z.string().optional(),
});

const aboutInquiryFormFieldsSchema = z.object({
  fullNameLabel: z.string().optional(),
  fullNamePlaceholder: z.string().optional(),
  emailLabel: z.string().optional(),
  emailPlaceholder: z.string().optional(),
  facilityLabel: z.string().optional(),
  facilityPlaceholder: z.string().optional(),
  departmentLabel: z.string().optional(),
  departmentPlaceholder: z.string().optional(),
  requestTypeLabel: z.string().optional(),
  messageLabel: z.string().optional(),
  messagePlaceholder: z.string().optional(),
  successMessage: z.string().optional(),
  errorMessage: z.string().optional(),
});

export const aboutInquiryDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  submitLabel: z.string().optional(),
  contactCardTitle: z.string().optional(),
  requestOptions: z.array(z.string()).min(1).optional(),
  contacts: z.array(aboutInquiryContactSchema).min(1).optional(),
  map: aboutInquiryMapSchema.optional(),
  formFields: aboutInquiryFormFieldsSchema.optional(),
});

const aboutFooterLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const aboutFooterDataSchema = z.object({
  brand: z.string(),
  description: z.string(),
  productsTitle: z.string().optional(),
  productLinks: z.array(aboutFooterLinkSchema).min(1).optional(),
  inquiriesTitle: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  headquartersTitle: z.string().optional(),
  location: z.string().optional(),
  copyright: z.string(),
});

const aboutOverviewStatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const aboutOverviewDataSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
  subDescription: z.string(),
  stats: z.array(aboutOverviewStatSchema).min(2),
  images: z.array(z.string()).min(2),
});

const aboutContentCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  iconImage: z.string().optional(),
  accentColor: z.string(),
});

export const aboutVisionMissionDataSchema = z.object({
  items: z.array(aboutContentCardSchema).min(1),
  vision: z
    .object({
      eyebrow: z.string().optional(),
      title: z.string(),
      quote: z.string(),
      badge: z.string(),
      action: z
        .object({
          label: z.string(),
          href: z.string(),
        })
        .optional(),
    })
    .optional(),
});

const aboutFrameworkPillarSchema = z.object({
  letter: z.string(),
  title: z.string(),
  description: z.string(),
});

export const aboutFrameworkDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  pillars: z.array(aboutFrameworkPillarSchema).min(1),
});

export const aboutAdvantageDataSchema = z.object({
  eyebrow: z.string(),
  title: z.array(z.string()),
  description: z.string(),
  points: z.array(z.string()),
  image: z.string(),
});

const aboutValueItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  iconImage: z.string().optional(),
});

export const aboutValuesDataSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  region: z.string().optional(),
  items: z.array(aboutValueItemSchema).min(1),
  reach: z
    .object({
      title: z.string(),
      image: z.string(),
      metrics: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
          }),
        )
        .min(4),
    })
    .optional(),
});
export const aboutCtaDataSchema = z.object({
  title: z.array(z.string()).min(1),
  description: z.string(),
  primaryAction: z.object({ label: z.string(), href: z.string() }),
  secondaryAction: z.object({ label: z.string(), href: z.string() }),
});

const researchPillarSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  project: z.string(),
});

const researchMetricSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const researchHubDataSchema = z.object({
  heroBadge: z.string(),
  heroTitleLines: z.array(z.string()).min(1),
  heroDescription: z.string(),
  heroPrimaryAction: z.object({ label: z.string(), href: z.string() }),
  heroSecondaryAction: z.object({ label: z.string(), href: z.string() }),
  heroImage: z.string(),
  overviewTitle: z.string(),
  overviewDescription: z.string(),
  overviewPoints: z.array(z.string()).min(1),
  overviewImage: z.string(),
  pillarsTitle: z.string(),
  pillars: z.array(researchPillarSchema).min(3),
  metrics: z.array(researchMetricSchema).min(4),
  simulationTitle: z.string(),
  simulationDescription: z.string(),
  accuracyLabel: z.string(),
  accuracyValue: z.string(),
  velocityLabel: z.string(),
  velocityValue: z.string(),
  simulationImage: z.string(),
});

const sectionDataValidators: Record<string, z.ZodType<unknown>> = {
  hero: heroDataSchema,
  intro: introDataSchema,
  services: servicesDataSchema,
  servicesGrid: servicesGridDataSchema,
  servicesAccordion: servicesAccordionDataSchema,
  servicesCTA: servicesCtaDataSchema,
  servicesLicensing: servicesLicensingDataSchema,
  coursesCatalog: coursesCatalogDataSchema,
  whyChoose: whyChooseDataSchema,
  investment: investmentDataSchema,
  clientLogos: clientLogosDataSchema,
  cta: ctaDataSchema,
  contact: contactDataSchema,
  contactHero: contactHeroDataSchema,
  contactInquiry: contactInquiryDataSchema,
  servicesHero: serviceHeroDataSchema,
  industriesHero: industriesHeroDataSchema,
  industriesGrid: industriesGridDataSchema,
  industriesCta: industriesCtaDataSchema,
  homeIncubationHighlight: homeIncubationHighlightDataSchema,
  incubation: incubationDataSchema,
  globalStandards: globalStandardsDataSchema,
  homeAbout: homeAboutDataSchema,
  homeServicesGrid: homeServicesGridDataSchema,
  homeProductCategories: homeProductCategoriesDataSchema,
  homeTrustedBy: homeTrustedByDataSchema,
  homeQuickInquiry: homeQuickInquiryDataSchema,
  homeWhyChoose: homeWhyChooseDataSchema,
  servicesPageHero: servicesPageHeroDataSchema,
  servicesCapabilityCards: servicesCapabilityCardsDataSchema,
  servicesSpecialized: servicesSpecializedDataSchema,
  servicesProductCatalog: servicesProductCatalogDataSchema,
  servicesRegulatory: servicesRegulatoryDataSchema,
  servicesFooter: servicesFooterDataSchema,
  clientsPageHero: clientsPageHeroDataSchema,
  clientsSectors: clientsSectorsDataSchema,
  clientsCompliance: clientsComplianceDataSchema,
  clientsTrustedBy: clientsTrustedByDataSchema,
  clientsPartnerCta: clientsPartnerCtaDataSchema,
  productsCatalogShowcase: productsCatalogShowcaseDataSchema,
  productsFooter: productsFooterDataSchema,
  aboutHero: aboutHeroDataSchema,
  aboutOverview: aboutOverviewDataSchema,
  aboutIntro: aboutOverviewDataSchema,
  aboutMission: aboutMissionDataSchema,
  aboutLeadership: aboutLeadershipDataSchema,
  aboutRegulatory: aboutRegulatoryDataSchema,
  aboutInquiry: aboutInquiryDataSchema,
  aboutFooter: aboutFooterDataSchema,
  aboutVisionMission: aboutVisionMissionDataSchema,
  aboutFramework: aboutFrameworkDataSchema,
  aboutAdvantage: aboutAdvantageDataSchema,
  aboutValues: aboutValuesDataSchema,
  aboutCTA: aboutCtaDataSchema,
  researchHub: researchHubDataSchema,
  projectsHero: projectsHeroDataSchema,
  projectsGrid: projectsGridDataSchema,
  projectsIntegrity: projectsIntegrityDataSchema,
  projectsPartners: projectsPartnersDataSchema,
};

export function parseSectionData(type: string, data: unknown): unknown {
  const normalizedType =
    type === "industrieshero"
      ? "industriesHero"
      : type === "industriesgrid"
        ? "industriesGrid"
        : type === "industriescta"
          ? "industriesCta"
          : type === "servicesgrid"
            ? "servicesGrid"
            : type === "servicesaccordion"
              ? "servicesAccordion"
              : type === "servicescta"
                ? "servicesCTA"
                : type === "serviceslicensing"
                  ? "servicesLicensing"
                  : type === "projectshero"
                    ? "projectsHero"
                    : type === "projectsgrid"
                      ? "projectsGrid"
                      : type === "projectsintegrity"
                        ? "projectsIntegrity"
                        : type === "projectspartners"
                          ? "projectsPartners"
                          : type === "aboutoverview"
                            ? "aboutOverview"
                            : type;
  if (!SECTION_TYPES.includes(normalizedType as SectionType)) {
    throw new Error(`Unknown section type: ${type}`);
  }
  const schema = sectionDataValidators[normalizedType];
  if (!schema) {
    throw new Error(`Unknown section type: ${type}`);
  }
  return schema.parse(data);
}

export const siteGlobalPayloadSchema = z.object({
  headerBrand: z.string().optional(),
  navItems: z.array(navItemSchema),
  footerColumns: z.array(
    z.union([footerLinkColumnSchema, footerContactColumnSchema, footerBodyColumnSchema]),
  ),
  footerMeta: z.object({
    brand: z.string(),
    description: z.string(),
    social: z.array(
      z.union([
        z.string(),
        z.object({
          label: z.string(),
          href: z.string(),
          icon: z.string().optional(),
        }),
      ]),
    ),
    copyright: z.string(),
    legal: z.array(
      z.union([z.string(), z.object({ label: z.string(), href: z.string() })]),
    ),
    ctaLabel: z.string().optional(),
    ctaHref: z.string().optional(),
  }),
  logoSrc: z.string().optional(),
  featureFlags: z.record(z.string(), z.boolean()).optional(),
  seoDefaults: z
    .object({
      defaultTitle: z.string().optional(),
      defaultDescription: z.string().optional(),
    })
    .optional(),
  applyNowModal: applyNowModalSchema.optional(),
  headerActions: z
    .object({
      contactLabel: z.string().optional(),
      inquireLabel: z.string().optional(),
      inquireHref: z.string().optional(),
    })
    .optional(),
});

export type SiteGlobalPayload = z.infer<typeof siteGlobalPayloadSchema>;
