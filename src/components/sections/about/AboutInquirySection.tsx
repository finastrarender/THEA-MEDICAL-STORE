"use client";

import { useState } from "react";
import { Clock, Mail, MapPin, Phone, type LucideProps } from "lucide-react";
import type { ComponentType } from "react";
import type { z } from "zod";
import type { aboutInquiryDataSchema } from "@/schemas/sections";
import { theaAboutInquiryDefaults } from "@/data/thea-about-sections";
import { validateInquiryForm, type InquiryFormErrors } from "@/lib/validation";

type AboutInquiryContent = z.infer<typeof aboutInquiryDataSchema>;

const CONTACT_ICONS: Record<string, ComponentType<LucideProps>> = {
  phone: Phone,
  mail: Mail,
  clock: Clock,
};

export default function AboutInquirySection({ content }: { content: AboutInquiryContent }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState<InquiryFormErrors>({});

  const defaults = theaAboutInquiryDefaults;
  const formFields = { ...defaults.formFields, ...content.formFields };
  const map = { ...defaults.map, ...content.map };

  const title = content.title?.trim() || defaults.title;
  const description = content.description?.trim() || defaults.description;
  const submitLabel = content.submitLabel?.trim() || defaults.submitLabel;
  const contactCardTitle = content.contactCardTitle?.trim() || defaults.contactCardTitle;
  const requestOptions =
    content.requestOptions && content.requestOptions.length > 0
      ? content.requestOptions
      : defaults.requestOptions;
  const contacts =
    content.contacts && content.contacts.length > 0 ? content.contacts : defaults.contacts;

  const mapImage = map.mapImage?.trim();
  const mapHref = map.linkHref?.trim() || defaults.map.linkHref;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      company: String(fd.get("facility") ?? "").trim(),
      inquiryType: String(fd.get("requestType") ?? "").trim(),
      sourcePage: "about",
      message: String(fd.get("message") ?? "").trim(),
    };
    const nextErrors = validateInquiryForm({
      name: body.name,
      email: body.email,
      phone: body.phone,
      facility: body.company,
      requestType: body.inquiryType,
      message: body.message,
    });
    setErrors(nextErrors);
    setFeedback("");
    if (Object.keys(nextErrors).length > 0) {
      setStatus("err");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("err");
        setFeedback(
          (json?.error?.message as string) ||
            formFields.errorMessage ||
            defaults.formFields.errorMessage,
        );
        return;
      }
      setStatus("ok");
      setErrors({});
      setFeedback(formFields.successMessage || defaults.formFields.successMessage);
      form.reset();
    } catch {
      setStatus("err");
      setFeedback(formFields.errorMessage || defaults.formFields.errorMessage);
    }
  }

  return (
    <section className="thea-about-inquiry" aria-labelledby="thea-about-inquiry-title">
      <div className="thea-about-inquiry__shell">
        <div className="thea-about-inquiry__inner">
          <div className="thea-about-inquiry__form-panel">
            <header className="thea-about-inquiry__header">
              <h2 id="thea-about-inquiry-title" className="thea-about-inquiry__title">
                {title}
              </h2>
              <p className="thea-about-inquiry__description">{description}</p>
            </header>

            <form
              className="thea-about-inquiry__form"
              onSubmit={onSubmit}
              noValidate
              suppressHydrationWarning
            >
              <div className="thea-about-inquiry__form-row">
                <label className="thea-about-inquiry__field">
                  <span className="thea-about-inquiry__label">{formFields.fullNameLabel}</span>
                  <input
                    suppressHydrationWarning
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={50}
                    pattern="[A-Za-z\s]+"
                    autoComplete="name"
                    className="thea-about-inquiry__input"
                    placeholder={formFields.fullNamePlaceholder}
                    aria-invalid={errors.name ? "true" : undefined}
                    aria-describedby={errors.name ? "about-inquiry-name-error" : undefined}
                  />
                  {errors.name ? (
                    <p className="thea-about-inquiry__field-error" id="about-inquiry-name-error">
                      {errors.name}
                    </p>
                  ) : null}
                </label>
                <label className="thea-about-inquiry__field">
                  <span className="thea-about-inquiry__label">{formFields.emailLabel}</span>
                  <input
                    suppressHydrationWarning
                    name="email"
                    type="email"
                    required
                    maxLength={255}
                    autoComplete="email"
                    className="thea-about-inquiry__input"
                    placeholder={formFields.emailPlaceholder}
                    aria-invalid={errors.email ? "true" : undefined}
                    aria-describedby={errors.email ? "about-inquiry-email-error" : undefined}
                  />
                  {errors.email ? (
                    <p className="thea-about-inquiry__field-error" id="about-inquiry-email-error">
                      {errors.email}
                    </p>
                  ) : null}
                </label>
              </div>

              <div className="thea-about-inquiry__form-row">
                <label className="thea-about-inquiry__field">
                  <span className="thea-about-inquiry__label">{formFields.facilityLabel}</span>
                  <input
                    suppressHydrationWarning
                    name="facility"
                    type="text"
                    required
                    minLength={2}
                    maxLength={150}
                    className="thea-about-inquiry__input"
                    placeholder={formFields.facilityPlaceholder}
                    aria-invalid={errors.facility ? "true" : undefined}
                    aria-describedby={
                      errors.facility ? "about-inquiry-facility-error" : undefined
                    }
                  />
                  {errors.facility ? (
                    <p
                      className="thea-about-inquiry__field-error"
                      id="about-inquiry-facility-error"
                    >
                      {errors.facility}
                    </p>
                  ) : null}
                </label>
                <label className="thea-about-inquiry__field">
                  <span className="thea-about-inquiry__label">PHONE NUMBER</span>
                  <input
                    suppressHydrationWarning
                    name="phone"
                    type="tel"
                    required
                    minLength={9}
                    maxLength={16}
                    inputMode="tel"
                    autoComplete="tel"
                    className="thea-about-inquiry__input"
                    placeholder="+971501234567"
                    aria-invalid={errors.phone ? "true" : undefined}
                    aria-describedby={errors.phone ? "about-inquiry-phone-error" : undefined}
                  />
                  {errors.phone ? (
                    <p className="thea-about-inquiry__field-error" id="about-inquiry-phone-error">
                      {errors.phone}
                    </p>
                  ) : null}
                </label>
              </div>

              <label className="thea-about-inquiry__field">
                <span className="thea-about-inquiry__label">{formFields.requestTypeLabel}</span>
                <span className="thea-about-inquiry__select-wrap">
                  <select
                    suppressHydrationWarning
                    name="requestType"
                    required
                    className="thea-about-inquiry__select"
                    defaultValue=""
                    aria-invalid={errors.requestType ? "true" : undefined}
                    aria-describedby={
                      errors.requestType ? "about-inquiry-service-error" : undefined
                    }
                  >
                    <option value="" disabled>
                      Select a service type
                    </option>
                    {requestOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </span>
                {errors.requestType ? (
                  <p className="thea-about-inquiry__field-error" id="about-inquiry-service-error">
                    {errors.requestType}
                  </p>
                ) : null}
              </label>

              <label className="thea-about-inquiry__field thea-about-inquiry__field--area">
                <span className="thea-about-inquiry__label">{formFields.messageLabel}</span>
                <textarea
                  suppressHydrationWarning
                  name="message"
                  required
                  minLength={10}
                  maxLength={1000}
                  rows={5}
                  className="thea-about-inquiry__input thea-about-inquiry__textarea"
                  placeholder={formFields.messagePlaceholder}
                  aria-invalid={errors.message ? "true" : undefined}
                  aria-describedby={errors.message ? "about-inquiry-message-error" : undefined}
                />
                {errors.message ? (
                  <p className="thea-about-inquiry__field-error" id="about-inquiry-message-error">
                    {errors.message}
                  </p>
                ) : null}
              </label>

              <button
                suppressHydrationWarning
                type="submit"
                className="thea-about-inquiry__submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Submitting..." : submitLabel}
              </button>

              {feedback ? (
                <p
                  className={
                    status === "ok"
                      ? "thea-about-inquiry__feedback thea-about-inquiry__feedback--ok"
                      : "thea-about-inquiry__feedback thea-about-inquiry__feedback--err"
                  }
                  role="status"
                >
                  {feedback}
                </p>
              ) : null}
            </form>
          </div>

          <aside className="thea-about-inquiry__aside" aria-label="Contact information">
            <div className="thea-about-inquiry__contact-card">
              <h3 className="thea-about-inquiry__contact-title">{contactCardTitle}</h3>
              <ul className="thea-about-inquiry__contact-list">
                {contacts.map((item, index) => {
                  const Icon = CONTACT_ICONS[item.icon] ?? Phone;
                  return (
                    <li key={`${item.label}-${index}`} className="thea-about-inquiry__contact-item">
                      <span className="thea-about-inquiry__contact-icon" aria-hidden="true">
                        <Icon className="thea-about-inquiry__contact-icon-svg" strokeWidth={1.75} />
                      </span>
                      <div className="thea-about-inquiry__contact-body">
                        <span className="thea-about-inquiry__contact-label">{item.label}</span>
                        {item.icon === "mail" ? (
                          <a
                            className="thea-about-inquiry__contact-value"
                            href={`mailto:${item.value}`}
                          >
                            {item.value}
                          </a>
                        ) : item.icon === "phone" ? (
                          <a
                            className="thea-about-inquiry__contact-value"
                            href={`tel:${item.value.replace(/\s/g, "")}`}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="thea-about-inquiry__contact-value">{item.value}</span>
                        )}
                        {item.note ? (
                          <span className="thea-about-inquiry__contact-note">{item.note}</span>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="thea-about-inquiry__map-card">
              <div className="thea-about-inquiry__map-media">
                {mapImage ? (
                  <img
                    src={mapImage}
                    alt=""
                    className="thea-about-inquiry__map-image"
                    width={480}
                    height={280}
                    decoding="async"
                    loading="lazy"
                  />
                ) : (
                  <div className="thea-about-inquiry__map-placeholder" aria-hidden="true" />
                )}
                {mapHref ? (
                  <a
                    className="thea-about-inquiry__map-marker"
                    href={mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="thea-about-inquiry__map-marker-icon" strokeWidth={2} />
                    <span className="thea-about-inquiry__map-marker-text">
                      <span className="thea-about-inquiry__map-marker-title">{map.title}</span>
                      <span className="thea-about-inquiry__map-marker-sub">{map.subtitle}</span>
                    </span>
                  </a>
                ) : (
                  <div className="thea-about-inquiry__map-marker thea-about-inquiry__map-marker--static">
                    <MapPin className="thea-about-inquiry__map-marker-icon" strokeWidth={2} />
                    <span className="thea-about-inquiry__map-marker-text">
                      <span className="thea-about-inquiry__map-marker-title">{map.title}</span>
                      <span className="thea-about-inquiry__map-marker-sub">{map.subtitle}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
