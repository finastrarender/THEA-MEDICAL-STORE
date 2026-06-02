"use client";

import { useState } from "react";
import type { z } from "zod";
import type { contactInquiryDataSchema } from "@/schemas/sections";
import SimpleIcon from "../SimpleIcon";

type ContactInquiryContent = z.infer<typeof contactInquiryDataSchema>;

const DEFAULT_EYEBROW = "CONTACT CHANNELS";
const DEFAULT_TITLE = "Connect with our Partners";
const DEFAULT_SIDE =
  "Connect with our specialists for procurement, support, and regulatory-safe medical supply operations.";

const DEFAULT_HQ = {
  heading: "Direct Contact",
  contacts: [
    {
      icon: "phone" as const,
      value: "+971 4 000 0000",
    },
    { icon: "mail" as const, value: "inquiry@theamedical.ae" },
    { icon: "check" as const, value: "Mon - Fri: 08:00 - 18:00" },
  ],
};

const DEFAULT_HOURS = {
  heading: "Regulatory Compliance Guaranteed",
  rows: [
    { days: "All inquiries are processed according to strict", hours: "" },
    { days: "medical data privacy standards and ISO 13485 protocols.", hours: "" },
  ],
};

const DEFAULT_MATRIX = {
  label: "Dubai Headquarters",
  title: "Business Bay, Prism Tower",
  subtitle: "Level 24, Suite 2405, Dubai, UAE",
  mapImage: "/contact/uae-map.jpg",
  linkLabel: "GET DIRECTIONS >",
  linkHref: "https://maps.google.com",
};

function resolveHeroTitle(content: ContactInquiryContent) {
  if (content.heroTitle?.trim()) return content.heroTitle.trim();
  if (content.heroTitleLines && content.heroTitleLines.length > 0) {
    return content.heroTitleLines.join(" ");
  }
  return DEFAULT_TITLE;
}

function resolveHqContacts(content: ContactInquiryContent) {
  if (content.hqContacts && content.hqContacts.length > 0) {
    return content.hqContacts;
  }
  if (content.officeItems && content.officeItems.length > 0) {
    return content.officeItems.flatMap((item) =>
      item.lines.map((line) => ({
        icon:
          item.icon === "mail" || item.icon === "phone" ? item.icon : (item.icon || "location"),
        value: line,
      })),
    );
  }
  return DEFAULT_HQ.contacts;
}

export default function ContactInquirySection({ content }: { content: ContactInquiryContent }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [feedback, setFeedback] = useState("");

  const formFields = content.formFields ?? {};
  const heroEyebrow = content.heroEyebrow?.trim() || DEFAULT_EYEBROW;
  const heroTitle = resolveHeroTitle(content);
  const heroSideCopy = content.heroSideCopy?.trim() || DEFAULT_SIDE;
  const submitLabel = content.submitLabel?.trim() || "SUBMIT INQUIRY";
  const inquiryOptions =
    content.inquiryOptions?.filter((option) => option.trim().length > 0) ?? [];
  const hasInquiryOptions = inquiryOptions.length > 0;

  const nameLabel = formFields.fullNameLabel?.trim() || "NAME";
  const emailLabel = formFields.workEmailLabel?.trim() || "INSTITUTIONAL EMAIL";
  const subjectLabel = formFields.interestLabel?.trim() || "SUBJECT";
  const messageLabel = formFields.messageLabel?.trim() || "PROJECT SUMMARY";

  const namePlaceholder = formFields.fullNamePlaceholder?.trim() || "Johnathan Doe";
  const emailPlaceholder =
    formFields.workEmailPlaceholder?.trim() || "j.doe@institution.com";
  const subjectPlaceholder =
    formFields.interestPlaceholder?.trim() || "Inquiry: Asset Management Protocol";
  const companyLabel = formFields.companyLabel?.trim() || "FACILITY NAME";
  const companyPlaceholder = formFields.companyPlaceholder?.trim() || "Dubai Medical Center";
  const phoneLabel = formFields.phoneLabel?.trim() || "DEPARTMENT";
  const phonePlaceholder = formFields.phonePlaceholder?.trim() || "Radiology / Procurement";
  const messagePlaceholder =
    formFields.messagePlaceholder?.trim() ||
    "Briefly describe your institutional requirements...";

  const hqHeading = content.hqHeading?.trim() || content.officeHeading?.trim() || DEFAULT_HQ.heading;
  const hqContacts = resolveHqContacts(content);

  const hoursHeading = content.hoursHeading?.trim() || DEFAULT_HOURS.heading;
  const hoursRows =
    content.hoursRows && content.hoursRows.length > 0
      ? content.hoursRows
      : DEFAULT_HOURS.rows;

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
          "Thank you — our institutional relations team will be in touch shortly.",
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
            <div className="cx-contact__hero-left">
              <p className="cx-contact__eyebrow">{heroEyebrow}</p>
              <h1 id="cx-contact-title" className="cx-contact__title">
                {heroTitle}
              </h1>
            </div>
            <div className="cx-contact__hero-right">
              <span className="cx-contact__hero-divider" aria-hidden="true" />
              <p className="cx-contact__hero-side">{heroSideCopy}</p>
            </div>
          </header>

          <div className="cx-contact__body">
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
                  {status === "loading" ? "SUBMITTING..." : submitLabel}
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

            <aside className="cx-contact__aside" aria-label="Contact details">
              <div className="cx-contact__info-card cx-contact__hq">
                <h2 className="cx-contact__aside-title">{hqHeading}</h2>
                <ul className="cx-contact__hq-list">
                  {hqContacts.map((item, index) => (
                    <li key={`${item.icon}-${index}`} className="cx-contact__hq-item">
                      <span className="cx-contact__hq-icon" aria-hidden="true">
                        <SimpleIcon
                          name={item.icon}
                          className="cx-contact__hq-icon-svg"
                        />
                      </span>
                      {item.icon === "mail" ? (
                        <a className="cx-contact__hq-value" href={`mailto:${item.value}`}>
                          {item.value}
                        </a>
                      ) : item.icon === "phone" ? (
                        <a className="cx-contact__hq-value" href={`tel:${item.value.replace(/\s/g, "")}`}>
                          {item.value}
                        </a>
                      ) : (
                        <span className="cx-contact__hq-value">{item.value}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cx-contact__info-card cx-contact__hours">
                <h2 className="cx-contact__aside-title">{hoursHeading}</h2>
                <dl className="cx-contact__hours-list">
                  {hoursRows.map((row) => (
                    <div key={row.days} className="cx-contact__hours-row">
                      <dt>{row.days}</dt>
                      <dd>{row.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
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
              <p className="cx-contact__matrix-label">{matrix.label}</p>
              <h2 id="cx-contact-matrix-title" className="cx-contact__matrix-title">
                {matrix.title}
              </h2>
              <p className="cx-contact__matrix-subtitle">{matrix.subtitle}</p>
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
