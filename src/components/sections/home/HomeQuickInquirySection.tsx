"use client";

import { useState } from "react";
import type { z } from "zod";
import type { homeQuickInquiryDataSchema } from "@/schemas/sections";
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
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: "",
      company: String(fd.get("facility") ?? ""),
      inquiryType: String(fd.get("serviceType") ?? ""),
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
            content.errorMessage ||
            "Something went wrong. Please try again.",
        );
        return;
      }
      setStatus("ok");
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
                    <a className="thea-inquiry__contact-value" href={`mailto:${item.value}`}>
                      {item.value}
                    </a>
                  ) : item.icon === "phone" ? (
                    <a
                      className="thea-inquiry__contact-value"
                      href={`tel:${item.value.replace(/\s/g, "")}`}
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
                  autoComplete="name"
                  className="thea-inquiry__input"
                  placeholder="Enter your name"
                />
              </label>
              <label className="thea-inquiry__field">
                <span className="thea-inquiry__label">EMAIL</span>
                <input
                  suppressHydrationWarning
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="thea-inquiry__input"
                  placeholder="Enter your email"
                />
              </label>
            </div>

            <label className="thea-inquiry__field">
              <span className="thea-inquiry__label">FACILITY NAME</span>
              <input
                suppressHydrationWarning
                name="facility"
                type="text"
                className="thea-inquiry__input"
                placeholder="Clinic or Hospital Name"
              />
            </label>

            <label className="thea-inquiry__field">
              <span className="thea-inquiry__label">SERVICE TYPE</span>
              <span className="thea-inquiry__select-wrap">
                <select
                  suppressHydrationWarning
                  name="serviceType"
                  className="thea-inquiry__select"
                  defaultValue={serviceOptions[0]}
                >
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            <label className="thea-inquiry__field thea-inquiry__field--area">
              <span className="thea-inquiry__label">MESSAGE</span>
              <textarea
                suppressHydrationWarning
                name="message"
                required
                rows={4}
                className="thea-inquiry__input thea-inquiry__textarea"
                placeholder="Your requirements..."
              />
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
