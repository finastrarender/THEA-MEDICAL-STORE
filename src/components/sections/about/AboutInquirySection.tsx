"use client";

import { useState } from "react";
import { Clock, Mail, MapPin, Phone, type LucideProps } from "lucide-react";
import type { ComponentType } from "react";
import type { z } from "zod";
import type { aboutInquiryDataSchema } from "@/schemas/sections";
import { theaAboutInquiryDefaults } from "@/data/thea-about-sections";

type AboutInquiryContent = z.infer<typeof aboutInquiryDataSchema>;

const CONTACT_ICONS: Record<string, ComponentType<LucideProps>> = {
  phone: Phone,
  mail: Mail,
  clock: Clock,
};

export default function AboutInquirySection({ content }: { content: AboutInquiryContent }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [feedback, setFeedback] = useState("");

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
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const department = String(fd.get("department") ?? "").trim();
    const messageBody = String(fd.get("message") ?? "").trim();
    const body = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: "",
      company: String(fd.get("facility") ?? ""),
      inquiryType: String(fd.get("requestType") ?? ""),
      sourcePage: "about",
      message: department
        ? `Department: ${department}\n\n${messageBody}`
        : messageBody,
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
            defaults.formFields.errorMessage,
        );
        return;
      }
      setStatus("ok");
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
                    autoComplete="name"
                    className="thea-about-inquiry__input"
                    placeholder={formFields.fullNamePlaceholder}
                  />
                </label>
                <label className="thea-about-inquiry__field">
                  <span className="thea-about-inquiry__label">{formFields.emailLabel}</span>
                  <input
                    suppressHydrationWarning
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="thea-about-inquiry__input"
                    placeholder={formFields.emailPlaceholder}
                  />
                </label>
              </div>

              <div className="thea-about-inquiry__form-row">
                <label className="thea-about-inquiry__field">
                  <span className="thea-about-inquiry__label">{formFields.facilityLabel}</span>
                  <input
                    suppressHydrationWarning
                    name="facility"
                    type="text"
                    className="thea-about-inquiry__input"
                    placeholder={formFields.facilityPlaceholder}
                  />
                </label>
                <label className="thea-about-inquiry__field">
                  <span className="thea-about-inquiry__label">{formFields.departmentLabel}</span>
                  <input
                    suppressHydrationWarning
                    name="department"
                    type="text"
                    className="thea-about-inquiry__input"
                    placeholder={formFields.departmentPlaceholder}
                  />
                </label>
              </div>

              <label className="thea-about-inquiry__field">
                <span className="thea-about-inquiry__label">{formFields.requestTypeLabel}</span>
                <span className="thea-about-inquiry__select-wrap">
                  <select
                    suppressHydrationWarning
                    name="requestType"
                    className="thea-about-inquiry__select"
                    defaultValue={requestOptions[0]}
                  >
                    {requestOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </span>
              </label>

              <label className="thea-about-inquiry__field thea-about-inquiry__field--area">
                <span className="thea-about-inquiry__label">{formFields.messageLabel}</span>
                <textarea
                  suppressHydrationWarning
                  name="message"
                  required
                  rows={5}
                  className="thea-about-inquiry__input thea-about-inquiry__textarea"
                  placeholder={formFields.messagePlaceholder}
                />
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
