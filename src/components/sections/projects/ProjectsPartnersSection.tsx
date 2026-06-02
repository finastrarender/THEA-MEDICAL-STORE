"use client";

import { useState } from "react";
import type { z } from "zod";
import type { projectsPartnersDataSchema } from "@/schemas/sections";

type ProjectsPartnersContent = z.infer<typeof projectsPartnersDataSchema>;

const DEFAULT_TITLE = "Connect with our Partners";

const DEFAULT_MAP = "/projects/rak-map.jpg";

const DEFAULT_HQ = {
  label: "HQ LOCATION",
  title: "RAK Economic Zone",
  address: "Al Hamra Industrial Zone-FZ, Ras Al Khaimah, United Arab Emirates",
};

const DEFAULT_CONTACT = {
  label: "DIRECT CONTACT",
  email: "office@cryptonexis.com",
};

export default function ProjectsPartnersSection({
  content,
}: {
  content?: ProjectsPartnersContent;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [feedback, setFeedback] = useState("");

  const formTitle = content?.formTitle?.trim() || DEFAULT_TITLE;
  const submitLabel = content?.submitLabel?.trim() || "SEND INQUIRY";
  const mapImage = content?.mapImage?.trim() || DEFAULT_MAP;
  const hqLabel = content?.hqLabel?.trim() || DEFAULT_HQ.label;
  const hqTitle = content?.hqTitle?.trim() || DEFAULT_HQ.title;
  const hqAddress = content?.hqAddress?.trim() || DEFAULT_HQ.address;
  const contactLabel = content?.contactLabel?.trim() || DEFAULT_CONTACT.label;
  const contactEmail = content?.contactEmail?.trim() || DEFAULT_CONTACT.email;

  const placeholders = {
    name: content?.placeholders?.name?.trim() || "Full Name",
    email: content?.placeholders?.email?.trim() || "Institutional Email",
    subject: content?.placeholders?.subject?.trim() || "Subject of Inquiry",
    message: content?.placeholders?.message?.trim() || "Brief Summary of Project/Inquiry",
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: "",
      company: "",
      inquiryType: String(fd.get("subject") ?? ""),
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
            content?.errorMessage ||
            "Something went wrong. Please try again.",
        );
        return;
      }
      setStatus("ok");
      setFeedback(
        content?.successMessage ||
          "Thank you — our institutional relations team will be in touch shortly.",
      );
      form.reset();
    } catch {
      setStatus("err");
      setFeedback(content?.errorMessage || "Network error. Please try again.");
    }
  }

  return (
    <section className="cx-projects-partners" aria-labelledby="projects-partners-title">
      <div className="cx-projects-partners__grid">
        <div className="cx-projects-partners__form-col">
          <h2 id="projects-partners-title" className="cx-projects-partners__title">
            {formTitle}
          </h2>

          <form
            className="cx-projects-partners__form"
            onSubmit={onSubmit}
            noValidate
            suppressHydrationWarning
          >
            <label className="cx-projects-partners__field">
              <span className="visually-hidden">{placeholders.name}</span>
              <input
                suppressHydrationWarning
                name="name"
                type="text"
                required
                autoComplete="name"
                className="cx-projects-partners__input"
                placeholder={placeholders.name}
              />
            </label>
            <label className="cx-projects-partners__field">
              <span className="visually-hidden">{placeholders.email}</span>
              <input
                suppressHydrationWarning
                name="email"
                type="email"
                required
                autoComplete="email"
                className="cx-projects-partners__input"
                placeholder={placeholders.email}
              />
            </label>
            <label className="cx-projects-partners__field">
              <span className="visually-hidden">{placeholders.subject}</span>
              <input
                suppressHydrationWarning
                name="subject"
                type="text"
                required
                className="cx-projects-partners__input"
                placeholder={placeholders.subject}
              />
            </label>
            <label className="cx-projects-partners__field cx-projects-partners__field--area">
              <span className="visually-hidden">{placeholders.message}</span>
              <textarea
                suppressHydrationWarning
                name="message"
                required
                rows={4}
                className="cx-projects-partners__input cx-projects-partners__textarea"
                placeholder={placeholders.message}
              />
            </label>

            <button
              suppressHydrationWarning
              type="submit"
              className="cx-projects-partners__submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "SENDING..." : submitLabel}
            </button>

            {feedback ? (
              <p
                className={
                  status === "ok"
                    ? "cx-projects-partners__feedback cx-projects-partners__feedback--ok"
                    : "cx-projects-partners__feedback cx-projects-partners__feedback--err"
                }
                role="status"
              >
                {feedback}
              </p>
            ) : null}
          </form>
        </div>

        <aside className="cx-projects-partners__aside" aria-label="Location and contact">
          <div className="cx-projects-partners__map">
            <img src={mapImage} alt="" width={960} height={480} decoding="async" />
          </div>
          <div className="cx-projects-partners__info">
            <div className="cx-projects-partners__info-block">
              <p className="cx-projects-partners__info-label">{hqLabel}</p>
              <p className="cx-projects-partners__info-title">{hqTitle}</p>
              <p className="cx-projects-partners__info-text">{hqAddress}</p>
            </div>
            <div className="cx-projects-partners__info-block">
              <p className="cx-projects-partners__info-label">{contactLabel}</p>
              <a className="cx-projects-partners__info-email" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
