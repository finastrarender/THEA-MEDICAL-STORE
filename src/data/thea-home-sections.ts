/** Default content for THEA Medical Store home page sections. */
export const theaHomeAboutDefaults = {
  title: "About THEA Medical Store",
  description:
    "At THEA Medical Store L.L.C., we stand as a cornerstone of healthcare reliability in the United Arab Emirates. Our commitment goes beyond simple supply; we provide a curated ecosystem of pharmaceutical grade products and clinical equipment.",
  description2:
    "With a focus on precision and regulatory compliance, we serve as the bridge between global medical innovations and local healthcare excellence, ensuring every clinic, hospital, and laboratory has the tools they need to save lives.",
  image: "",
  missionTitle: "Our Mission",
  missionText: "Elevating patient care through uncompromising supply chain integrity.",
  visionTitle: "Our Vision",
  visionText: "To be the most trusted name in clinical procurement in the MENA region.",
};

export const theaHomeServicesDefaults = {
  title: "Specialized Healthcare Services",
  description:
    "Comprehensive operational and logistical support for modern medical facilities.",
  items: [
    {
      icon: "drugStore",
      title: "Drug Store",
      description:
        "Licensed distribution and storage of pharmaceutical medicines with strict temperature control protocols.",
    },
    {
      icon: "equipmentTrading",
      title: "Used Medical Equipment Trading",
      description:
        "Quality-vetted pre-owned medical equipment offering cost-effective solutions without compromising safety.",
    },
    {
      icon: "equipmentRental",
      title: "Medical Equipment Rental",
      description:
        "Flexible leasing options for short-term and long-term medical equipment requirements.",
    },
    {
      icon: "paraPharma",
      title: "Para Pharmaceutical Products",
      description:
        "Supply of hygiene, cosmetic, and nutritional products supporting comprehensive patient wellness.",
    },
    {
      icon: "surgical",
      title: "Surgical Articles Trading",
      description:
        "Specialized trade in sterile surgical tools, sutures, and operating room essentials.",
    },
    {
      icon: "management",
      title: "Equipment Management",
      description:
        "End-to-end operation and maintenance of complex medical machinery and clinical assets.",
    },
  ],
};

export const theaHomeTrustedByDefaults = {
  title: "TRUSTED BY LEADING INSTITUTIONS",
  items: [
    { icon: "hospitals", label: "Hospitals" },
    { icon: "clinics", label: "Clinics" },
    { icon: "laboratories", label: "Laboratories" },
    { icon: "rehabCenters", label: "Rehab Centers" },
    { icon: "homeHealthcare", label: "Home Healthcare" },
  ],
};

export const theaHomeQuickInquiryDefaults = {
  title: "Quick Inquiry",
  description:
    "Ready to streamline your medical supply chain? Send us your requirements and our procurement specialists will contact you within 24 hours.",
  contacts: [
    { icon: "phone" as const, value: "+971 XXX XXXX" },
    { icon: "mail" as const, value: "info@theamedical.ae" },
    { icon: "location" as const, value: "Dubai, United Arab Emirates" },
  ],
  submitLabel: "Send Message",
  serviceOptions: [
    "Equipment Trading",
    "Drug Store",
    "Medical Equipment Rental",
    "Para Pharmaceutical Products",
    "Surgical Articles Trading",
    "Equipment Management",
  ],
  successMessage: "Thank you — our team will contact you within 24 hours.",
  errorMessage: "Something went wrong. Please try again.",
};

export const theaHomeWhyChooseDefaults = {
  title: "Why Healthcare Providers Choose THEA",
  image: "/home/why-choose.jpg",
  items: [
    {
      icon: "licensedCompliant",
      title: "Licensed and Compliant",
      description:
        "Adhering to the highest MOHAP regulatory standards for medical distribution.",
    },
    {
      icon: "fullService",
      title: "Full-service Healthcare Solutions",
      description:
        "One-stop shop from consumables to complex equipment management.",
    },
    {
      icon: "strategicLocation",
      title: "Strategic UAE Location",
      description:
        "Headquartered in Dubai, ensuring rapid delivery across the Emirates.",
    },
    {
      icon: "highQuality",
      title: "High-quality Standards",
      description:
        "Partnering only with globally recognized medical manufacturers.",
    },
  ],
};

export const theaHomeProductsDefaults = {
  title: "Product Categories",
  categories: [
    {
      layout: "tall",
      title: "Pharmaceutical Medicines",
      description: "Comprehensive range of prescription and OTC medications.",
      image: "",
      theme: "pharma",
    },
    {
      layout: "wide",
      title: "Medical Equipment",
      description: "Diagnostic, monitoring, and therapeutic devices.",
      image: "",
      theme: "equipment",
    },
    {
      layout: "small",
      title: "Surgical Supplies",
      description: "",
      image: "",
      theme: "surgical",
    },
    {
      layout: "small",
      title: "Medical Consumables",
      description: "",
      image: "",
      theme: "consumables",
    },
  ],
};
