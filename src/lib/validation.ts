import { DEFAULT_PHONE_COUNTRY_CODE } from "@/data/phone-country-codes";

export const ValidationRules = {
  name: {
    required: "Please enter your name.",
    min: "Name must be at least 2 characters long.",
    max: "Name cannot exceed 50 characters.",
    pattern: "Name can only contain letters and spaces.",
    regex: /^[A-Za-z\s]{2,50}$/,
  },
  email: {
    required: "Please enter your email address.",
    pattern: "Please enter a valid email address.",
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    max: 255,
  },
  phone: {
    required: "Please enter your phone number.",
    digits: "Full phone number (country code + number) must be 8–15 digits.",
    pattern: "Phone number can only contain digits.",
    invalid: "Please enter a valid phone number with country code.",
    regex: /^\+[0-9]{8,15}$/,
  },
  facility: {
    required: "Please enter your clinic or hospital name.",
    max: "Facility name cannot exceed 150 characters.",
    pattern: "Please enter a valid clinic or hospital name.",
    regex: /^[A-Za-z0-9\s&.\-/()]{2,150}$/,
  },
  service: {
    required: "Please select a service type.",
  },
  message: {
    required: "Please enter your requirements.",
    min: "Message must be at least 10 characters long.",
    max: "Message cannot exceed 1000 characters.",
  },
};

export type InquiryFieldName =
  | "name"
  | "email"
  | "phone"
  | "facility"
  | "serviceType"
  | "requestType"
  | "message";

export type InquiryFormValues = Partial<Record<InquiryFieldName, string>>;
export type InquiryFormErrors = Partial<Record<InquiryFieldName, string>>;

export function combinePhoneNumber(countryCode: string, localNumber: string): string {
  const codeDigits = countryCode.replace(/\D/g, "");
  const localDigits = localNumber.replace(/\D/g, "");
  return `+${codeDigits}${localDigits}`;
}

export function getPhoneFromFormData(
  fd: FormData,
  defaultCountryCode = DEFAULT_PHONE_COUNTRY_CODE,
): string {
  const phoneCountry = String(fd.get("phoneCountry") ?? defaultCountryCode).trim();
  const phoneLocal = String(fd.get("phoneLocal") ?? "").trim();
  return combinePhoneNumber(phoneCountry, phoneLocal);
}

export function validatePhoneParts(countryCode: string, localNumber: string): string | null {
  const trimmedLocal = localNumber.trim();
  const localDigits = trimmedLocal.replace(/\D/g, "");

  if (!localDigits) return ValidationRules.phone.required;
  if (!/^\d+$/.test(trimmedLocal.replace(/\s/g, ""))) {
    return ValidationRules.phone.pattern;
  }

  return validateField("phone", combinePhoneNumber(countryCode, localDigits));
}

export function validateField(name: string, value: string): string | null {
  const v = value.trim();
  switch (name) {
    case "name":
      if (!v) return ValidationRules.name.required;
      if (v.length < 2) return ValidationRules.name.min;
      if (v.length > 50) return ValidationRules.name.max;
      if (!/^[A-Za-z\s]+$/.test(v)) return ValidationRules.name.pattern;
      return null;
    case "email":
      if (!v) return ValidationRules.email.required;
      if (v.length > ValidationRules.email.max) return ValidationRules.email.pattern;
      if (!ValidationRules.email.regex.test(v)) return ValidationRules.email.pattern;
      return null;
    case "phone":
      if (!v) return ValidationRules.phone.required;
      if (!/^\+?[0-9]+$/.test(v) || v.slice(1).includes("+")) {
        return ValidationRules.phone.pattern;
      }
      const digits = v.replace(/^\+/, "");
      if (digits.length < 8 || digits.length > 15) return ValidationRules.phone.digits;
      if (!ValidationRules.phone.regex.test(v)) return ValidationRules.phone.invalid;
      return null;
    case "facility":
      if (!v) return ValidationRules.facility.required;
      if (v.length > 150) return ValidationRules.facility.max;
      if (!ValidationRules.facility.regex.test(v)) return ValidationRules.facility.pattern;
      return null;
    case "serviceType":
    case "requestType":
      if (!v || v.toLowerCase().includes("select")) return ValidationRules.service.required;
      return null;
    case "message":
      if (!v) return ValidationRules.message.required;
      if (v.length < 10) return ValidationRules.message.min;
      if (v.length > 1000) return ValidationRules.message.max;
      return null;
    default:
      return null;
  }
}

export function validateInquiryForm(values: InquiryFormValues): InquiryFormErrors {
  const errors: InquiryFormErrors = {};
  const serviceField: InquiryFieldName =
    values.requestType !== undefined ? "requestType" : "serviceType";
  const fields: InquiryFieldName[] = [
    "name",
    "email",
    "phone",
    "facility",
    serviceField,
    "message",
  ];

  fields.forEach((field) => {
    const error = validateField(field, values[field] ?? "");
    if (error) errors[field] = error;
  });

  return errors;
}
