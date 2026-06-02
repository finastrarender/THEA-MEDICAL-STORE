"use client";

import type { z } from "zod";
import type { servicesDataSchema } from "@/schemas/sections";
import SimpleIcon from "@/components/sections/SimpleIcon";

type ServicesContent = z.infer<typeof servicesDataSchema>;

export default function ServicesSection({ content }: { content: ServicesContent }) {
  const data = content as ServicesContent & { eyebrow?: string };
  const eyebrow =
    typeof data.eyebrow === "string" && data.eyebrow.trim() !== ""
      ? data.eyebrow
      : "OUR CAPABILITIES";

  return (
    <section className="services-section">
      <div className="section-shell">
        <div className="services-pillars__header">
          <div className="services-pillars__header-main">
            <p className="services-pillars__eyebrow">{eyebrow}</p>
            <h2 className="services-pillars__title">{content.title}</h2>
          </div>
          <p className="services-pillars__description">{content.description}</p>
        </div>

        <div className="services-pillars__grid">
          {content.cards.slice(0, 4).map((card) => (
            <article key={card.title} className="services-pillars__card">
              <span className="services-pillars__icon" aria-hidden="true">
                <SimpleIcon
                  name={card.icon || "spark"}
                  className="services-pillars__icon-svg"
                />
              </span>
              <h3 className="services-pillars__card-title">{card.title}</h3>
              <p className="services-pillars__card-description">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
