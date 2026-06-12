"use client";

import { useState } from "react";
import type { z } from "zod";
import type { homeQuickInquiryDataSchema } from "@/schemas/sections";
import { validateInquiryForm, type InquiryFormErrors } from "@/lib/validation";
import SimpleIcon from "../SimpleIcon";

type HomeQuickInquiryContent = z.infer<typeof homeQuickInquiryDataSchema>;

const DEFAULT_CONTACTS = [
  { icon: "phone" as const, value: "+971 XXX XXXX" },
  { icon: "mail" as const, value: "info@theamedical.ae" },
  { icon: "location" as const, value: "Dubai, United Arab Emirates" },
];

const DEFAULT_SERVICE_OPTIONS = [
  "Equipment Trading",
  "Drug Store",
  "Medical Equipment Rental",
  "Para Pharmaceutical Products",
  "Surgical Articles Trading",
  "Equipment Management",
];

export default function HomeQuickInquirySection({
  content,
  anchorId,
}: {
  content: HomeQuickInquiryContent;
  anchorId?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState<InquiryFormErrors>({});

  const title = content.title?.trim() || "Quick Inquiry";
  const description =
    content.description?.trim() ||
    "Ready to streamline your medical supply chain? Send us your requirements and our procurement specialists will contact you within 24 hours.";
  const contacts =
    content.contacts && content.contacts.length > 0 ? content.contacts : DEFAULT_CONTACTS;
  const serviceOptions =
    content.serviceOptions && content.serviceOptions.length > 0
      ? content.serviceOptions
      : DEFAULT_SERVICE_OPTIONS;
  const submitLabel = content.submitLabel?.trim() || "Send Message";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      company: String(fd.get("facility") ?? "").trim(),
      inquiryType: String(fd.get("serviceType") ?? "").trim(),
      sourcePage: "home",
      message: String(fd.get("message") ?? "").trim(),
    };
    const nextErrors = validateInquiryForm({
      name: body.name,
      email: body.email,
      phone: body.phone,
      facility: body.company,
      serviceType: body.inquiryType,
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
            content.errorMessage ||
            "Something went wrong. Please try again.",
        );
        return;
      }
      setStatus("ok");
      setErrors({});
      setFeedback(
        content.successMessage ||
          "Thank you — our team will contact you within 24 hours.",
      );
      form.reset();
    } catch {
      setStatus("err");
      setFeedback(content.errorMessage || "Network error. Please try again.");
    }
  }

  return (
    <section className="thea-inquiry" id={anchorId ?? undefined}>
      <div className="thea-inquiry__shell">
        <div className="thea-inquiry__card">
          <div className="thea-inquiry__info">
            <h2 className="thea-inquiry__title">{title}</h2>
            <p className="thea-inquiry__description">{description}</p>
            <ul className="thea-inquiry__contacts">
              {contacts.map((item, index) => (
                <li key={`${item.icon}-${index}`} className="thea-inquiry__contact">
                  <span className="thea-inquiry__contact-icon" aria-hidden="true">
                    <SimpleIcon name={item.icon} className="thea-inquiry__contact-icon-svg" />
                  </span>
                  {item.icon === "mail" ? (
                    <a className="thea-inquiry__contact-value">
                      {item.value}
                    </a>
                  ) : item.icon === "phone" ? (
                    <a
                      className="thea-inquiry__contact-value"
                      >
                      {item.value}
                    </a>
                  ) : (
                    <span className="thea-inquiry__contact-value">{item.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <form className="thea-inquiry__form" onSubmit={onSubmit} noValidate suppressHydrationWarning>
            <div className="thea-inquiry__form-row">
              <label className="thea-inquiry__field">
                <span className="thea-inquiry__label">NAME</span>
                <input
                  suppressHydrationWarning
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={50}
                  pattern="[A-Za-z\s]+"
                  autoComplete="name"
                  className="thea-inquiry__input"
                  placeholder="John Smith"
                  aria-invalid={errors.name ? "true" : undefined}
                  aria-describedby={errors.name ? "home-inquiry-name-error" : undefined}
                />
                {errors.name ? (
                  <p className="thea-inquiry__field-error" id="home-inquiry-name-error">
                    {errors.name}
                  </p>
                ) : null}
              </label>
              <label className="thea-inquiry__field">
                <span className="thea-inquiry__label">EMAIL</span>
                <input
                  suppressHydrationWarning
                  name="email"
                  type="email"
                  required
                  maxLength={255}
                  autoComplete="email"
                  className="thea-inquiry__input"
                  placeholder="john@example.com"
                  aria-invalid={errors.email ? "true" : undefined}
                  aria-describedby={errors.email ? "home-inquiry-email-error" : undefined}
                />
                {errors.email ? (
                  <p className="thea-inquiry__field-error" id="home-inquiry-email-error">
                    {errors.email}
                  </p>
                ) : null}
              </label>
            </div>

            <div className="thea-inquiry__form-row">
              <label className="thea-inquiry__field">
                <span className="thea-inquiry__label">PHONE NUMBER</span>
                <input
                  suppressHydrationWarning
                  name="phone"
                  type="tel"
                  required
                  minLength={9}
                  maxLength={16}
                  inputMode="tel"
                  autoComplete="tel"
                  className="thea-inquiry__input"
                  placeholder="+971501234567"
                  aria-invalid={errors.phone ? "true" : undefined}
                  aria-describedby={errors.phone ? "home-inquiry-phone-error" : undefined}
                />
                {errors.phone ? (
                  <p className="thea-inquiry__field-error" id="home-inquiry-phone-error">
                    {errors.phone}
                  </p>
                ) : null}
              </label>

              <label className="thea-inquiry__field">
                <span className="thea-inquiry__label">FACILITY NAME</span>
                <input
                  suppressHydrationWarning
                  name="facility"
                  type="text"
                  required
                  minLength={2}
                  maxLength={150}
                  className="thea-inquiry__input"
                  placeholder="City Hospital"
                  aria-invalid={errors.facility ? "true" : undefined}
                  aria-describedby={errors.facility ? "home-inquiry-facility-error" : undefined}
                />
                {errors.facility ? (
                  <p className="thea-inquiry__field-error" id="home-inquiry-facility-error">
                    {errors.facility}
                  </p>
                ) : null}
              </label>
            </div>

            <label className="thea-inquiry__field">
              <span className="thea-inquiry__label">SERVICE TYPE</span>
              <span className="thea-inquiry__select-wrap">
                <select
                  suppressHydrationWarning
                  name="serviceType"
                  required
                  className="thea-inquiry__select"
                  defaultValue=""
                  aria-invalid={errors.serviceType ? "true" : undefined}
                  aria-describedby={
                    errors.serviceType ? "home-inquiry-service-error" : undefined
                  }
                >
                  <option value="" disabled>
                    Select a service type
                  </option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </span>
              {errors.serviceType ? (
                <p className="thea-inquiry__field-error" id="home-inquiry-service-error">
                  {errors.serviceType}
                </p>
              ) : null}
            </label>

            <label className="thea-inquiry__field thea-inquiry__field--area">
              <span className="thea-inquiry__label">MESSAGE</span>
              <textarea
                suppressHydrationWarning
                name="message"
                required
                minLength={10}
                maxLength={1000}
                rows={4}
                className="thea-inquiry__input thea-inquiry__textarea"
                placeholder="We require medical equipment procurement services for our hospital."
                aria-invalid={errors.message ? "true" : undefined}
                aria-describedby={errors.message ? "home-inquiry-message-error" : undefined}
              />
              {errors.message ? (
                <p className="thea-inquiry__field-error" id="home-inquiry-message-error">
                  {errors.message}
                </p>
              ) : null}
            </label>

            <button
              suppressHydrationWarning
              type="submit"
              className="thea-inquiry__submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : submitLabel}
            </button>

            {feedback ? (
              <p
                className={
                  status === "ok"
                    ? "thea-inquiry__feedback thea-inquiry__feedback--ok"
                    : "thea-inquiry__feedback thea-inquiry__feedback--err"
                }
                role="status"
              >
                {feedback}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
