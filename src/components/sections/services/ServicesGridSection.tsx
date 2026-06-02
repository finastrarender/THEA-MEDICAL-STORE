"use client";
import type { z } from "zod";
import type { servicesGridDataSchema } from "@/schemas/sections";

type ServicesGridContent = z.infer<typeof servicesGridDataSchema>;

function ServicesGridIcon({ kind }: { kind: "shield" | "nodes" | "terminal" | "sync" }) {
  if (kind === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="services-grid-card__icon">
        <path
          d="M12 3 5 6v6c0 5 3 8.7 7 10 4-1.3 7-5 7-10V6l-7-3zm0 3.2L16 8v3c0 3.1-1.5 5.7-4 7-2.5-1.3-4-3.9-4-7V8l4-1.8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  if (kind === "nodes") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="services-grid-card__icon">
        <circle cx="5" cy="6" r="1.7" fill="currentColor" />
        <circle cx="12" cy="4" r="1.7" fill="currentColor" />
        <circle cx="19" cy="8" r="1.7" fill="currentColor" />
        <circle cx="8" cy="14" r="1.7" fill="currentColor" />
        <circle cx="16" cy="17" r="1.7" fill="currentColor" />
        <path d="M6.5 6.4 10.2 4.8M13.6 4.7 17.2 7.2M6.3 7.4 7.4 12.4M9.4 13.5l5.1 2.8M17.6 9.6l-1.2 5.8" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }

  if (kind === "terminal") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="services-grid-card__icon">
        <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="m8 10 2 2-2 2M12 14h4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="services-grid-card__icon">
      <path d="M12 4a8 8 0 1 0 8 8h-2.2a5.8 5.8 0 1 1-1.7-4.1l-2.1 2.1h6V4l-2.4 2.4A7.95 7.95 0 0 0 12 4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 9v3.5l2.4 1.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const ServicesGridSection = ({ content: _content }: { content: ServicesGridContent }) => {
  
  return (
    <section className="services-grid-section">
      <div className="section-shell">
        <div className="services-grid-section__cards">
          <div className="services-grid-row services-grid-row--top">
            <article className="services-grid-card services-grid-card--1">
              <span className="services-grid-card__icon-wrap" aria-hidden="true">
                <ServicesGridIcon kind="shield" />
              </span>
              <h3 className="services-grid-card__title">CYBERSECURITY</h3>
              <p className="services-grid-card__description">
                Proactive threat neutralization and sovereign data protection. We deploy advanced
                cryptographic standards and real-time mesh monitoring to secure enterprise perimeters.
              </p>
              <div className="services-grid-card__tags" aria-label="Cybersecurity capabilities">
                <span>THREAT INTEL</span>
                <span>ZERO TRUST</span>
                <span>SOC+</span>
              </div>
              <div className="services-grid-card__watermark services-grid-card__watermark--shield" aria-hidden="true" />
            </article>

            <article className="services-grid-card services-grid-card--2">
              <span className="services-grid-card__icon-wrap" aria-hidden="true">
                <ServicesGridIcon kind="nodes" />
              </span>
              <h3 className="services-grid-card__title">DATA &amp; CLOUD</h3>
              <p className="services-grid-card__description">
                High-availability cloud orchestration. Scalable neural architectures designed for
                99.99% uptime and hyper-efficient data throughput.
              </p>
              <ul className="services-grid-card__features">
                <li>HYBRID MULTI-CLOUD</li>
                <li>EDGE COMPUTING</li>
              </ul>
              <div className="services-grid-card__watermark services-grid-card__watermark--nodes" aria-hidden="true" />
            </article>
          </div>

          <div className="services-grid-row services-grid-row--bottom">
            <article className="services-grid-card services-grid-card--3">
              <span className="services-grid-card__icon-wrap" aria-hidden="true">
                <ServicesGridIcon kind="terminal" />
              </span>
              <h3 className="services-grid-card__title">
                SOFTWARE &amp;
                <br />
                DEVELOPMENT
              </h3>
              <p className="services-grid-card__description">
                Mission-critical application development. Precision-engineered codebase built for
                speed, modularity, and future-proof scaling.
              </p>
            </article>

            <article className="services-grid-card services-grid-card--4">
              <div className="services-grid-card__content">
                <span className="services-grid-card__icon-wrap" aria-hidden="true">
                  <ServicesGridIcon kind="sync" />
                </span>
                <h3 className="services-grid-card__title">
                  CONSULTING &amp;
                  <br />
                  TRAINING
                </h3>
                <p className="services-grid-card__description">
                  Empowering executive leadership through deep-tech audits and specialized personnel
                  upskilling in emerging tech paradigms.
                </p>
              </div>
              <div className="services-grid-card__visual" aria-hidden="true">
                <div className="services-grid-card__wave" />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesGridSection;
