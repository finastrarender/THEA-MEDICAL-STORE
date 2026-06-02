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
  backgroundImage: "",
  overlayLabel: "99.9%",
  overlayText: "Accuracy in medical supply distribution across UAE.",
};

const introData = {
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

const globalStandardsData = {
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

const servicesData = {
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

const servicesHeroData = {
  title: ["SYSTEM", "ARCHITECTURE"],
  description:
    "Enterprise-grade technological dominance through modular infrastructure, elite cybersecurity protocols, and bespoke software orchestration.",
  backgroundImage: "/home/hero-bg.jpg",
};

const servicesGridData = {
  title: "",
  description: "",
  filters: ["ALL"],
  cards: [
    {
      category: "THREAT INTEL",
      title: "CYBERSECURITY",
      description:
        "Proactive threat neutralization and sovereign data protection. We deploy advanced cryptographic standards and real-time mesh monitoring to secure enterprise perimeters.",
      features: ["THREAT INTEL", "ZERO TRUST", "SOC OPS"],
      cta: "",
      icon: "security",
    },
    {
      category: "HYBRID MULTI-CLOUD",
      title: "DATA & CLOUD",
      description:
        "High-availability cloud orchestration. Scalable neural architectures designed for 99.99% uptime and hyper-efficient data throughput.",
      features: ["HYBRID MULTI-CLOUD", "EDGE COMPUTING"],
      cta: "",
      icon: "online",
    },
    {
      category: "MODULAR STACKS",
      title: "SOFTWARE & DEV",
      description:
        "Mission-critical application development. Precision-engineered codebase built for speed, modularity, and future-proof scaling.",
      features: [],
      cta: "",
      icon: "innovation",
    },
    {
      category: "EXECUTIVE ENABLEMENT",
      title: "CONSULTING & TRAINING",
      description:
        "Empowering executive leadership through deep-tech audits and specialized personnel upskilling in emerging tech paradigms.",
      features: [],
      cta: "",
      icon: "corporate",
    },
  ],
};

const servicesAccordionData = {
  cards: [
    {
      title: "Management & Strategic Consultancy",
      description:
        "Strategic advisory solutions that help businesses achieve sustainable growth, operational efficiency, and competitive market positioning..",
      iconImage: "/home/headquarters.png",
      category: "management",
      points: ["Business Growth & Expansion Strategy","Corporate Advisory Services","Operational Excellence Planning"],
    },
    {
      title: "Research & Innovation",
      description:
        "Our state-of-the-art AI labs and incubation facilities support startups and established firms in developing breakthrough technologies.",
      iconImage: "/home/hero-bg.jpg",
      category: "research",
      points: [
        "AI & Machine Learning Research",
        "Product Incubation & Prototyping",
        "Market Intelligence Reports",
      ],
    },
    {
      title: "Membership Organizations",
      description:
        "Professional membership networks designed to connect entrepreneurs, corporates, investors, and industry leaders through collaboration and business engagement.",
      iconImage: "/home/headquarters.png",
      category: "membership",
      points: ["Industry Networking Events","Executive & Professional Communities","Partnership & Collaboration Opportunities"],
    },
    {
      title: "Manpower & Placement",
      description:
        "Comprehensive recruitment and workforce solutions that connect organizations with skilled professionals across multiple industries.",
      iconImage: "/home/headquarters.png",
      category: "manpower",
      points: ["alent Acquisition & Recruitment","Executive Search & Placement","Internship & Career Support Programs"],
    },
    {
      title: "Education & Training",
      description:
        "Professional education and skill development programs focused on leadership, technology, business management, and career advancement.",
      iconImage: "/home/headquarters.png",
      category: "education",
      points: ["Executive & Leadership Training","AI & Technology Programs","Professional Certification Courses"],
    },
  ],
};

const incubationData = {
  badge: "ONE WORLD BUSINESS SCHOOL & INCUBATION CENTRE FZE",
  title: "Turn Your Vision into a Market-Leading Enterprise",
  description:
    "The ultimate ecosystem for founders. We provide the capital, mentorship, and global network required to scale your startup from concept to exit.",
  heroTitleLines: ["Turn Your Vision into a", "Market-Leading Enterprise"],
  heroDescription:
    "The ultimate ecosystem for founders. We provide the capital, mentorship, and global network required to scale your startup from concept to exit.",
  primaryAction: { label: "Start Your Journey", href: "/contact" },
  secondaryAction: { label: "View Portfolio", href: "/about" },
  roadmapTitle: "The Incubation Roadmap",
  roadmapSubtitle: "A structured transition from idea to global scale.",
  steps: [
    {
      number: 1,
      title: "Ideation & Validation",
      description: "Testing your core assumptions in the real market.",
    },
    {
      number: 2,
      title: "Product Development",
      description: "Building MVPs with expert technical mentorship.",
    },
    {
      number: 3,
      title: "Market Scaling",
      description: "Venture capital access and global expansion strategies.",
    },
  ],
  roadmapItems: [
    {
      title: "Idea Validation",
      description:
        "When your ideas seem crazy, analyze market gaps, and write your unique value proposition with clarity.",
      points: ["Market Research Support", "SWOT Feasibility Audit"],
      image: "/home/headquarters.png",
    },
    {
      title: "MVP Development",
      description:
        "Build the first viable product in under 90 days with low-cost development and user-centric features.",
      points: ["UI/UX Prototyping", "Packaging Resources"],
      image: "/home/hero-bg.jpg",
    },
    {
      title: "Market Growth",
      description:
        "Go-to-market strategies that actually work. We connect you with first customers and help refine product-market fit.",
      points: ["Sales Mentorship Programs", "Capital & Partner Network"],
      image: "/home/headquarters.png",
    },
  ],
  portfolioTitle: "Portfolio Highlights",
  portfolioDescription:
    "See how we've helped disruptive startups navigate the complexities of international business growth.",
  portfolioAction: { label: "View all stories ->", href: "/about" },
  portfolioCards: [
    {
      category: "FINTECH",
      title: "NexGen Payments",
      description:
        "Scaled from a local gateway to a cross-border payment powerhouse within 18 months.",
      metrics: [
        { value: "300%", label: "Growth" },
        { value: "$12M", label: "Series A" },
      ],
      image: "/home/hero-bg.jpg",
    },
    {
      category: "SUSTAINABILITY",
      title: "GreenTrace AI",
      description:
        "Using AI to optimize supply chains and reduce carbon footprints in agriculture.",
      metrics: [
        { value: "50+", label: "Partners" },
        { value: "2.4k", label: "Tons CO2 Saved" },
      ],
      image: "/home/headquarters.png",
    },
  ],
  image: "/home/incubation.jpg",
  stat: {
    value: "50+",
    label: "Startups Accelerated",
  },
};

const homeIncubationHighlightData = {
  title: "From Idea to Global Scale",
  description:
    "Our Incubation Centre provides more than just desk space. We offer a structured ecosystem designed to accelerate high-growth potential startups.",
  steps: [
    {
      number: 1,
      title: "Ideation & Validation",
      description: "Testing your core assumptions in the real market.",
    },
    {
      number: 2,
      title: "Product Development",
      description: "Building MVPs with expert technical mentorship.",
    },
    {
      number: 3,
      title: "Market Scaling",
      description: "Venture capital access and global expansion strategies.",
    },
  ],
  image: "/home/incubation.jpg",
  stat: {
    value: "50+",
    label: "Startups Accelerated",
  },
};

const whyChooseData = {
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




const clientLogosData = {
  eyebrow: "TRUSTED BY INSTITUTIONAL LEADERS",
  logos: ["GLOBAL BANK", "TECH LOGISTICS", "DUBAI URBAN", "GOV SECTOR", "CORE ENERGY"],
};

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

const coursesCatalogData = {
  title: "Master the Future of Business",
  description:
    "Professional training programs designed to bridge the gap between academic knowledge and industry excellence.",
  categories: ["Business Management", "Entrepreneurship", "Digital Marketing", "Data Analytics"],
  levels: ["All Levels", "Beginner", "Intermediate", "Advanced"],
  durations: ["Any Duration", "4-8 Weeks", "8-12 Weeks", "12+ Weeks"],
  courses: [
    {
      badge: "Advanced",
      title: "Executive Leadership & Strategic Management",
      description:
        "Master the complete life of modern corporate leadership and learn to drive organizational growth through strategy.",
      skills: ["Leadership", "Policy", "Conflict Resolution", "MBA"],
      weeks: "12 Weeks",
      image: "/home/headquarters.png",
    },
    {
      badge: "Intermediate",
      title: "The Startup Catalyst: From Idea to Exit",
      description:
        "A comprehensive guide for entrepreneurs to validate business models, secure funding, and scale operations.",
      skills: ["Pitching", "Venture Capital", "MVP Dev"],
      weeks: "8 Weeks",
      image: "/home/hero-bg.jpg",
    },
    {
      badge: "Professional",
      title: "Certified Business Data Analyst",
      description:
        "Bridge the gap between raw data and business insights. Learn tools like SQL, Python, and Tableau for decision-making.",
      skills: ["Data Viz", "Predictive Modeling", "BI Tools"],
      weeks: "16 Weeks",
      image: "/home/headquarters.svg",
    },
    {
      badge: "Beginner",
      title: "Global Marketing & Brand Identity",
      description:
        "Learn how to create compelling brand stories and execute multi-channel marketing campaigns across diverse markets.",
      skills: ["Branding", "Social Media", "Analytics"],
      weeks: "6 Weeks",
      image: "/home/headquarters.png",
    },
  ],
};

const researchHubData = {
  heroBadge: "ADVANCED RESEARCH DIVISION",
  heroTitleLines: ["Architecting the", "Future", "of Global Industry."],
  heroDescription:
    "One World Business School and Incubation Centre FZE operates at the intersection of academic rigor and industrial application, driving breakthroughs in autonomous systems and sustainable frameworks.",
  heroPrimaryAction: { label: "Explore Lab Journals", href: "/contact" },
  heroSecondaryAction: { label: "Submit Proposal", href: "/contact" },
  heroImage: "/home/hero-bg.jpg",
  overviewTitle: "Pushing Boundaries Through Interdisciplinary Inquiry",
  overviewDescription:
    "Our research philosophy centers on the integration of theoretical frameworks with real-world technical implementation. We provide the infrastructure for scholars and entrepreneurs to test hypotheses in simulated and physical environments.",
  overviewPoints: [
    "Global Intellectual Property Development",
    "Incubation-Integrated Research Cycles",
    "Cross-Border Academic Partnerships",
  ],
  overviewImage: "/home/headquarters.png",
  pillarsTitle: "Core Research Pillars",
  pillars: [
    {
      icon: "innovation",
      title: "AI & Robotics",
      description:
        "Developing autonomous algorithms and kinetic hardware interfaces for industrial optimization and logistics.",
      project: "ONGOING PROJECT: PROJECT SENTINEL",
    },
    {
      icon: "vision",
      title: "AR/VR Simulation",
      description:
        "Immersive environments for complex business strategy visualization and high-risk technical training.",
      project: "ONGOING PROJECT: META-CAMPUS 2.0",
    },
    {
      icon: "compliance",
      title: "Environmental Studies",
      description:
        "Carbon sequestration models and sustainable supply chain ethics in the evolving global landscape.",
      project: "ONGOING PROJECT: ECO-SUPPLY GRAPH",
    },
  ],
  metrics: [
    { value: "124+", label: "WHITE PAPERS" },
    { value: "42", label: "PATENTS FILED" },
    { value: "15", label: "GLOBAL LABS" },
    { value: "$12M", label: "GRANT FUNDING" },
  ],
  simulationTitle: "Real-Time Impact Simulation",
  simulationDescription:
    "We leverage proprietary data models to predict the economic impact of emerging technologies. Our current research focus is on the acceleration of robotic automation in mid-market manufacturing sectors.",
  accuracyLabel: "MODEL ACCURACY",
  accuracyValue: "98.2%",
  velocityLabel: "DEPLOYMENT VELOCITY",
  velocityValue: "74.5%",
  simulationImage: "/home/hero-bg.jpg",
};

const ctaData = {
  title: "SYSTEM DEPLOYMENT STARTS HERE",
  description:
    "Secure your digital future with the UAE's premier technical architectural firm.",
  action: { label: "BOOK CONSULTATION", href: "/contact" },
};

const aboutHeroData = { ...theaAboutHeroDefaults };
const aboutMissionData = { cards: theaAboutMissionDefaults.cards };
const aboutLeadershipData = { ...theaAboutLeadershipDefaults };
const aboutRegulatoryData = { ...theaAboutRegulatoryDefaults };
const aboutInquiryData = { ...theaAboutInquiryDefaults };
const aboutFooterData = { ...theaAboutFooterDefaults };
const contactInquiryData = {
  heroEyebrow: "CONTACT CHANNELS",
  heroTitle: "Connect with our Partners",
  heroSideCopy:
    "Facilitating digital asset mobility for institutional ecosystems with architectural precision and regulatory rigor.",
  submitLabel: "SUBMIT INQUIRY",
  formFields: {
    fullNameLabel: "NAME",
    fullNamePlaceholder: "Johnathan Doe",
    workEmailLabel: "INSTITUTIONAL EMAIL",
    workEmailPlaceholder: "j.doe@institution.com",
    interestLabel: "SUBJECT",
    interestPlaceholder: "Inquiry: Asset Management Protocol",
    messageLabel: "PROJECT SUMMARY",
    messagePlaceholder: "Briefly describe your institutional requirements...",
    successMessage:
      "Thank you — our institutional relations team will be in touch shortly.",
    errorMessage: "Something went wrong. Please try again.",
  },
  hqHeading: "Global Headquarters",
  hqContacts: [
    {
      icon: "location",
      value: "RAK Economic Zone, Building 4, Ras Al Khaimah, United Arab Emirates",
    },
    { icon: "mail", value: "partners@cryptonexis.com" },
    { icon: "phone", value: "+971 (0) 7 204 1111" },
  ],
  hoursHeading: "Institutional Hours",
  hoursRows: [
    { days: "MONDAY — FRIDAY", hours: "09:00 — 18:00 GST" },
    { days: "SATURDAY — SUNDAY", hours: "CLOSED" },
  ],
  locationMatrix: {
    label: "LOCATION MATRIX",
    title: "Ras Al Khaimah",
    subtitle: "RAKEZ ECONOMIC ZONE HUB",
    mapImage: "/contact/uae-map.jpg",
    linkLabel: "OPEN REGIONAL GRID →",
    linkHref: "https://maps.google.com/?q=RAK+Economical+Zone",
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
  successMessage:
    "Thank you — our institutional relations team will be in touch shortly.",
  errorMessage: "Something went wrong. Please try again.",
};

const projectsPageSections = [
  section("projectsHero", 0, projectsHeroData),
  section("projectsGrid", 1, projectsGridData),
  section("projectsIntegrity", 2, projectsIntegrityData),
  section("projectsPartners", 3, projectsPartnersData),
];

const coursesPageSections = [section("coursesCatalog", 0, coursesCatalogData)];
const incubationPageSections = [section("incubation", 0, incubationData)];
const researchPageSections = [section("researchHub", 0, researchHubData)];

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
    { email: "admin@owtc-fze.com" },
    { $set: { email: "admin@owtc-fze.com", passwordHash } },
    { upsert: true },
  );
  console.log("Admin user: admin@owtc-fze.com /", process.env.ADMIN_PASSWORD ?? "AdminChangeMe!");

  await SiteGlobal.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        key: "default",
        headerBrand: "THEA Medical Store",
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
        seoDefaults: {
          defaultTitle: "THEA Medical Store",
          defaultDescription:
            "THEA Medical Store delivers premium pharmaceutical products and cutting-edge medical equipment solutions for healthcare providers across the UAE.",
        },
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
      seoTitle: "THEA Medical Store | Medical Supplies & Equipment",
      seoDescription:
        "THEA Medical Store delivers premium pharmaceutical products and cutting-edge medical equipment solutions for healthcare providers across the UAE.",
    },
    {
      slug: "about",
      title: "About Us",
      sections: aboutSections,
      seoTitle: "About Us | Adam Technology L.L.C.",
      seoDescription:
        "Learn about Cryptonexis Limited — institutional integrity, executive leadership, and regulated digital asset issuance in the UAE.",
    },
    {
      slug: "services",
      title: "Services",
      sections: servicesPageSections,
      seoTitle: "Services | THEA Medical Store",
      seoDescription:
        "Medical services and solutions — pharmaceutical distribution, equipment trading, rental, and specialized healthcare logistics across the UAE.",
    },
    {
      slug: "clients",
      title: "Clients",
      sections: clientsPageSections,
      seoTitle: "Clients | THEA Medical Store",
      seoDescription:
        "Strategic healthcare alliances and sector expertise — hospitals, clinics, laboratories, rehabilitation, and home healthcare across the UAE.",
    },
    {
      slug: "products",
      title: "Products",
      sections: productsPageSections,
      seoTitle: "Products | THEA Medical Store",
      seoDescription:
        "Clinical-grade pharmaceutical products, medical equipment, surgical supplies, and consumables curated for healthcare providers.",
    },
    {
      slug: "projects",
      title: "Projects",
      sections: projectsPageSections,
      seoTitle: "Projects | Cryptonexis Limited",
      seoDescription:
        "Institutional digital asset and NFT infrastructure portfolio — tokenization and distributed ledger deployments across the MENA region.",
    },
    {
      slug: "contact",
      title: "Contact",
      sections: contactPageSections,
      seoTitle: "Contact | Adam Technology L.L.C.",
      seoDescription:
        "Contact Cryptonexis Limited for institutional digital asset inquiries, RAK Economic Zone headquarters, and partnership channels.",
    },
  ];

  await Page.deleteMany({
    slug: { $nin: ["home", "about", "services", "products", "clients", "projects", "contact"] },
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



