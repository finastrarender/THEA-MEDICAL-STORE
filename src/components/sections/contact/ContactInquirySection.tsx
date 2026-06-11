"use client";

import { useState } from "react";
import type { z } from "zod";
import type { contactInquiryDataSchema } from "@/schemas/sections";
import SimpleIcon from "../SimpleIcon";

type ContactInquiryContent = z.infer<typeof contactInquiryDataSchema>;

const DEFAULT_EYEBROW = "REACH OUT TO OUR EXPERTS";
const DEFAULT_TITLE = "Clinical Precision at Your Service.";

const DEFAULT_HQ = {
  heading: "Direct Contact",
  contacts: [
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
};

const DEFAULT_COMPLIANCE = {
  heading: "Regulatory Compliance Guaranteed",
  text: "All inquiries are processed according to strict medical data privacy standards and ISO 13485 protocols.",
};

const DEFAULT_MATRIX = {
  label: "Dubai Headquarters",
  title: "Business Bay, Prism Tower",
  subtitle: "Level 24, Suite 2405, Dubai, UAE.",
  mapImage: "/contact/uae-map.jpg",
  linkLabel: "GET DIRECTIONS →",
  linkHref: "https://maps.google.com/?q=Business+Bay+Prism+Tower+Dubai",
};

const DEFAULT_INQUIRY_OPTIONS = [
  "General Inquiry",
  "Procurement Support",
  "Equipment Supply",
  "Clinical Support",
];

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="m4 12 16-7-2.5 7H22l-16 7 2.5-7H4z"
        fill="currentColor"
      />
    </svg>
  );
}

function resolveHeroTitleParts(content: ContactInquiryContent) {
  if (content.heroTitleLines && content.heroTitleLines.length >= 2) {
    const lines = content.heroTitleLines.map((line) => line.trim()).filter(Boolean);
    return {
      lead: lines[0] ?? "Clinical Precision",
      accent: lines.slice(1).join(" "),
    };
  }

  const full = content.heroTitle?.trim() || DEFAULT_TITLE;
  const atMatch = full.match(/^(.+?)\s+(at\s+.+)$/i);
  if (atMatch) {
    return { lead: atMatch[1].trim(), accent: atMatch[2].trim() };
  }

  return { lead: full, accent: "" };
}

function resolveHqContacts(content: ContactInquiryContent) {
  if (content.hqContacts && content.hqContacts.length > 0) {
    return content.hqContacts;
  }
  if (content.officeItems && content.officeItems.length > 0) {
    return content.officeItems.flatMap((item) =>
      item.lines.map((line) => ({
        icon:
          item.icon === "mail" || item.icon === "phone" ? item.icon : item.icon || "location",
        label: item.title,
        value: line,
      })),
    );
  }
  return DEFAULT_HQ.contacts;
}

function resolveComplianceText(content: ContactInquiryContent) {
  if (content.complianceText?.trim()) return content.complianceText.trim();
  if (content.hoursRows && content.hoursRows.length > 0) {
    return content.hoursRows
      .map((row) => [row.days, row.hours].filter(Boolean).join(" "))
      .join(" ");
  }
  return DEFAULT_COMPLIANCE.text;
}

export default function ContactInquirySection({ content }: { content: ContactInquiryContent }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [feedback, setFeedback] = useState("");

  const formFields = content.formFields ?? {};
  const heroEyebrow = content.heroEyebrow?.trim() || DEFAULT_EYEBROW;
  const heroTitleParts = resolveHeroTitleParts(content);
  const submitLabel = content.submitLabel?.trim() || "Submit Request";
  const inquiryOptions =
    content.inquiryOptions?.filter((option) => option.trim().length > 0) ??
    DEFAULT_INQUIRY_OPTIONS;
  const hasInquiryOptions = inquiryOptions.length > 0;

  const nameLabel = formFields.fullNameLabel?.trim() || "FULL NAME";
  const emailLabel = formFields.workEmailLabel?.trim() || "EMAIL";
  const subjectLabel = formFields.interestLabel?.trim() || "REQUEST TYPE";
  const messageLabel = formFields.messageLabel?.trim() || "MESSAGE";

  const namePlaceholder = formFields.fullNamePlaceholder?.trim() || "Dr. Sarah Al-Maktoum";
  const emailPlaceholder = formFields.workEmailPlaceholder?.trim() || "sarah.a@facility.ae";
  const subjectPlaceholder =
    formFields.interestPlaceholder?.trim() || "Select a service category";
  const companyLabel = formFields.companyLabel?.trim() || "FACILITY NAME";
  const companyPlaceholder = formFields.companyPlaceholder?.trim() || "Dubai Medical Center";
  const phoneLabel = formFields.phoneLabel?.trim() || "DEPARTMENT";
  const phonePlaceholder = formFields.phonePlaceholder?.trim() || "Radiology / Procurement";
  const messagePlaceholder =
    formFields.messagePlaceholder?.trim() || "Detail your clinical requirements here...";

  const hqHeading = content.hqHeading?.trim() || content.officeHeading?.trim() || DEFAULT_HQ.heading;
  const hqContacts = resolveHqContacts(content);

  const complianceHeading =
    content.hoursHeading?.trim() || DEFAULT_COMPLIANCE.heading;
  const complianceText = resolveComplianceText(content);

  const matrix = {
    ...DEFAULT_MATRIX,
    ...content.locationMatrix,
    mapImage:
      content.locationMatrix?.mapImage?.trim() ||
      content.mapImage?.trim() ||
      DEFAULT_MATRIX.mapImage,
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("department") ?? ""),
      company: String(fd.get("facility") ?? ""),
      inquiryType: String(fd.get("requestType") ?? ""),
      sourcePage: "contact",
      message: String(fd.get("message") ?? ""),
    };

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
            "Something went wrong. Please try again.",
        );
        return;
      }
      setStatus("ok");
      setFeedback(
        formFields.successMessage ||
          "Thank you. Our team will contact you shortly.",
      );
      form.reset();
    } catch {
      setStatus("err");
      setFeedback(formFields.errorMessage || "Network error. Please try again.");
    }
  }

  return (
    <div className="cx-contact">
      <section className="cx-contact__main" aria-labelledby="cx-contact-title">
        <div className="section-shell cx-contact__shell">
          <header className="cx-contact__hero">
            <p className="cx-contact__eyebrow">{heroEyebrow}</p>
            <h1 id="cx-contact-title" className="cx-contact__title">
              <span className="cx-contact__title-lead">{heroTitleParts.lead}</span>
              {heroTitleParts.accent ? (
                <span className="cx-contact__title-accent">{heroTitleParts.accent}</span>
              ) : null}
            </h1>
          </header>

          <div className="cx-contact__body">
            <aside className="cx-contact__aside" aria-label="Contact details">
              <div className="cx-contact__info-card cx-contact__hq">
                <h2 className="cx-contact__aside-title">{hqHeading}</h2>
                <ul className="cx-contact__hq-list">
                  {hqContacts.map((item, index) => (
                    <li key={`${item.label ?? item.icon}-${index}`} className="cx-contact__hq-item">
                      <span className="cx-contact__hq-icon" aria-hidden="true">
                        <SimpleIcon name={item.icon} className="cx-contact__hq-icon-svg" />
                      </span>
                      <div className="cx-contact__hq-body">
                        {item.label ? (
                          <span className="cx-contact__hq-label">{item.label}</span>
                        ) : null}
                        {item.icon === "mail" ? (
                          <span className="cx-contact__hq-value">
                            {item.value}
                          </span>
                        ) : item.icon === "phone" || item.icon === "spark" ? (
                          <span className="cx-contact__hq-value">
                            {item.value}
                          </span>
                        ) : (
                          <span className="cx-contact__hq-value">{item.value}</span>
                        )}
                        {"note" in item && item.note ? (
                          <span className="cx-contact__hq-note">{item.note}</span>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cx-contact__info-card cx-contact__compliance">
                <span className="cx-contact__compliance-icon" aria-hidden="true">
                  <SimpleIcon name="check" className="cx-contact__compliance-icon-svg" />
                </span>
                <div className="cx-contact__compliance-body">
                  <h2 className="cx-contact__compliance-title">{complianceHeading}</h2>
                  <p className="cx-contact__compliance-text">{complianceText}</p>
                </div>
              </div>
            </aside>

            <div className="cx-contact__form-panel">
              <form
                className="cx-contact__form"
                onSubmit={onSubmit}
                noValidate
                suppressHydrationWarning
              >
                <div className="cx-contact__form-row">
                  <label className="cx-contact__field">
                    <span className="cx-contact__label">{nameLabel}</span>
                    <input
                      suppressHydrationWarning
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="cx-contact__input"
                      placeholder={namePlaceholder}
                    />
                  </label>
                  <label className="cx-contact__field">
                    <span className="cx-contact__label">{emailLabel}</span>
                    <input
                      suppressHydrationWarning
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="cx-contact__input"
                      placeholder={emailPlaceholder}
                    />
                  </label>
                </div>

                <div className="cx-contact__form-row">
                  <label className="cx-contact__field">
                    <span className="cx-contact__label">{companyLabel}</span>
                    <input
                      suppressHydrationWarning
                      name="facility"
                      type="text"
                      className="cx-contact__input"
                      placeholder={companyPlaceholder}
                    />
                  </label>
                  <label className="cx-contact__field">
                    <span className="cx-contact__label">{phoneLabel}</span>
                    <input
                      suppressHydrationWarning
                      name="department"
                      type="text"
                      className="cx-contact__input"
                      placeholder={phonePlaceholder}
                    />
                  </label>
                </div>

                <label className="cx-contact__field">
                  <span className="cx-contact__label">{subjectLabel}</span>
                  {hasInquiryOptions ? (
                    <span className="cx-contact__select-wrap">
                      <select
                        suppressHydrationWarning
                        name="requestType"
                        required
                        className="cx-contact__input cx-contact__select"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {subjectPlaceholder}
                        </option>
                        {inquiryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </span>
                  ) : (
                    <input
                      suppressHydrationWarning
                      name="requestType"
                      type="text"
                      required
                      className="cx-contact__input"
                      placeholder={subjectPlaceholder}
                    />
                  )}
                </label>

                <label className="cx-contact__field cx-contact__field--area">
                  <span className="cx-contact__label">{messageLabel}</span>
                  <textarea
                    suppressHydrationWarning
                    name="message"
                    required
                    rows={5}
                    className="cx-contact__input cx-contact__textarea"
                    placeholder={messagePlaceholder}
                  />
                </label>

                <button
                  suppressHydrationWarning
                  type="submit"
                  className="cx-contact__submit"
                  disabled={status === "loading"}
                >
                  <span>{status === "loading" ? "Submitting..." : submitLabel}</span>
                  <SendIcon className="cx-contact__submit-icon" />
                </button>

                {feedback ? (
                  <p
                    className={
                      status === "ok"
                        ? "cx-contact__feedback cx-contact__feedback--ok"
                        : "cx-contact__feedback cx-contact__feedback--err"
                    }
                    role="status"
                  >
                    {feedback}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="cx-contact__matrix-band" aria-labelledby="cx-contact-matrix-title">
        <div className="section-shell cx-contact__matrix-shell">
          <div className="cx-contact__matrix-media">
            <img
              src={matrix.mapImage}
              alt=""
              width={1600}
              height={700}
              decoding="async"
              loading="lazy"
            />
            <article className="cx-contact__matrix-card">
              <h2 id="cx-contact-matrix-title" className="cx-contact__matrix-title">
                {matrix.label}
              </h2>
              <p className="cx-contact__matrix-address">
                {matrix.title}
                {matrix.subtitle ? (
                  <>
                    <br />
                    {matrix.subtitle}
                  </>
                ) : null}
              </p>
              <a className="cx-contact__matrix-link" href={matrix.linkHref}>
                {matrix.linkLabel}
              </a>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
