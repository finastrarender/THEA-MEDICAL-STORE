"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { z } from "zod";
import type { servicesFooterDataSchema } from "@/schemas/sections";
import { theaServicesFooterDefaults } from "@/data/thea-services-sections";
import { normalizeSitePath } from "@/lib/site-path";

type Content = z.infer<typeof servicesFooterDataSchema>;

export default function ServicesFooterSection({ content }: { content: Content }) {
  const brand = content.brand?.trim() || theaServicesFooterDefaults.brand;
  const description = content.description?.trim() || theaServicesFooterDefaults.description;
  const solutionsTitle =
    content.solutionsTitle?.trim() || theaServicesFooterDefaults.solutionsTitle;
  const solutionLinks =
    content.solutionLinks?.length > 0
      ? content.solutionLinks
      : theaServicesFooterDefaults.solutionLinks;
  const contactTitle = content.contactTitle?.trim() || theaServicesFooterDefaults.contactTitle;
  const phone = content.phone?.trim() || theaServicesFooterDefaults.phone;
  const email = content.email?.trim() || theaServicesFooterDefaults.email;
  const location = content.location?.trim() || theaServicesFooterDefaults.location;
  const newsletterTitle =
    content.newsletterTitle?.trim() || theaServicesFooterDefaults.newsletterTitle;
  const emailPlaceholder =
    content.emailPlaceholder?.trim() || theaServicesFooterDefaults.emailPlaceholder;
  const subscribeLabel =
    content.subscribeLabel?.trim() || theaServicesFooterDefaults.subscribeLabel;
  const copyright = content.copyright?.trim() || theaServicesFooterDefaults.copyright;

  const [submitted, setSubmitted] = useState(false);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem("newsletter-email") as HTMLInputElement)?.value;
    if (!email?.trim()) return;
    setSubmitted(true);
    form.reset();
  }

  return (
    <footer className="thea-services-footer" aria-label="Site footer">
      <div className="thea-services-footer__shell">
        <div className="thea-services-footer__grid">
          <div className="thea-services-footer__brand-col">
            <p className="thea-services-footer__brand">{brand}</p>
            <p className="thea-services-footer__description">{description}</p>
          </div>

          <nav className="thea-services-footer__col" aria-label={solutionsTitle}>
            <p className="thea-services-footer__heading">{solutionsTitle}</p>
            <ul className="thea-services-footer__list">
              {solutionLinks.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link href={normalizeSitePath(item.href, "/")}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="thea-services-footer__col">
            <p className="thea-services-footer__heading">{contactTitle}</p>
            <ul className="thea-services-footer__list thea-services-footer__list--plain">
              <li>
                <span>Phone: </span>
                <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              </li>
              <li>
                <span>Email: </span>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                <span>Location: </span>
                {location}
              </li>
            </ul>
          </div>

          <div className="thea-services-footer__col thea-services-footer__col--newsletter">
            <p className="thea-services-footer__heading">{newsletterTitle}</p>
            <form className="thea-services-footer__newsletter" onSubmit={handleSubscribe}>
              <label className="thea-services-footer__newsletter-label" htmlFor="thea-services-newsletter-email">
                <span className="visually-hidden">Email address</span>
                <input
                  id="thea-services-newsletter-email"
                  type="email"
                  name="newsletter-email"
                  placeholder={emailPlaceholder}
                  autoComplete="email"
                  required
                  suppressHydrationWarning
                />
              </label>
              <button
                type="submit"
                className="thea-services-footer__subscribe"
                suppressHydrationWarning
              >
                {submitted ? "Subscribed" : subscribeLabel}
              </button>
            </form>
          </div>
        </div>

        <div className="thea-services-footer__bar">
          <p className="thea-services-footer__copyright">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
