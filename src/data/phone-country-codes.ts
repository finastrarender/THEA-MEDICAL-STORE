export type PhoneCountryOption = {
  code: string;
  label: string;
};

/** Common country codes for THEA Medical Store contact forms (UAE default). */
export const PHONE_COUNTRY_CODES: PhoneCountryOption[] = [
  { code: "+971", label: "UAE +971" },
  { code: "+966", label: "Saudi +966" },
  { code: "+973", label: "Bahrain +973" },
  { code: "+968", label: "Oman +968" },
  { code: "+974", label: "Qatar +974" },
  { code: "+91", label: "India +91" },
  { code: "+92", label: "Pakistan +92" },
  { code: "+44", label: "UK +44" },
  { code: "+1", label: "US +1" },
];

export const DEFAULT_PHONE_COUNTRY_CODE = "+971";
