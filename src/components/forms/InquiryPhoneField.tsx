import { DEFAULT_PHONE_COUNTRY_CODE, PHONE_COUNTRY_CODES } from "@/data/phone-country-codes";

type InquiryPhoneFieldVariant = "contact" | "home" | "about";

type InquiryPhoneFieldProps = {
  variant: InquiryPhoneFieldVariant;
  error?: string;
  errorId: string;
  label?: string;
  placeholder?: string;
  defaultCountryCode?: string;
};

const variantConfig: Record<
  InquiryPhoneFieldVariant,
  {
    field: string;
    label: string;
    row: string;
    countryWrap: string;
    country: string;
    number: string;
    fieldError: string;
  }
> = {
  contact: {
    field: "cx-contact__field",
    label: "cx-contact__label",
    row: "cx-contact__phone-row",
    countryWrap: "cx-contact__select-wrap cx-contact__phone-country-wrap",
    country: "cx-contact__input cx-contact__select cx-contact__phone-country",
    number: "cx-contact__input cx-contact__phone-number",
    fieldError: "cx-contact__field-error",
  },
  home: {
    field: "thea-inquiry__field",
    label: "thea-inquiry__label",
    row: "thea-inquiry__phone-row",
    countryWrap: "thea-inquiry__select-wrap thea-inquiry__phone-country-wrap",
    country: "thea-inquiry__select thea-inquiry__phone-country",
    number: "thea-inquiry__input thea-inquiry__phone-number",
    fieldError: "thea-inquiry__field-error",
  },
  about: {
    field: "thea-about-inquiry__field",
    label: "thea-about-inquiry__label",
    row: "thea-about-inquiry__phone-row",
    countryWrap: "thea-about-inquiry__select-wrap thea-about-inquiry__phone-country-wrap",
    country: "thea-about-inquiry__select thea-about-inquiry__phone-country",
    number: "thea-about-inquiry__input thea-about-inquiry__phone-number",
    fieldError: "thea-about-inquiry__field-error",
  },
};

export default function InquiryPhoneField({
  variant,
  error,
  errorId,
  label = "PHONE NUMBER",
  placeholder = "501234567",
  defaultCountryCode = DEFAULT_PHONE_COUNTRY_CODE,
}: InquiryPhoneFieldProps) {
  const classes = variantConfig[variant];

  return (
    <label className={classes.field}>
      <span className={classes.label}>{label}</span>
      <div className={classes.row}>
        <span className={classes.countryWrap}>
          <select
            suppressHydrationWarning
            name="phoneCountry"
            className={classes.country}
            defaultValue={defaultCountryCode}
            aria-label="Country code"
          >
            {PHONE_COUNTRY_CODES.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </span>
        <input
          suppressHydrationWarning
          name="phoneLocal"
          type="tel"
          required
          inputMode="numeric"
          autoComplete="tel-national"
          className={classes.number}
          placeholder={placeholder}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </div>
      {error ? (
        <p className={classes.fieldError} id={errorId}>
          {error}
        </p>
      ) : null}
    </label>
  );
}
