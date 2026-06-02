import type { z } from "zod";
import type { serviceHeroDataSchema } from "@/schemas/sections";

type ServicesHeroContent = z.infer<typeof serviceHeroDataSchema>;

export default function ServicesHeroSection({ content }: { content: ServicesHeroContent }) {
  const primaryLine = content.title[0] ?? "SYSTEM";
  const secondaryLine = content.title[1] ?? "ARCHITECTURE";

  return (
    <section className="services-hero">
      <div className="services-hero__overlay" aria-hidden="true" />
      <div className="section-shell services-hero__content">
        <p className="services-hero__eyebrow">CORE PILLARS</p>
        <h1 className="services-hero__title">
          <span>{primaryLine}</span>
          <span>{secondaryLine}</span>
        </h1>
        <p className="services-hero__description">{content.description}</p>
        <div className="services-hero__status" aria-hidden="true">
          <span className="services-hero__status-active" />
          <span className="services-hero__status-track" />
        </div>
      </div>
    </section>
  );
}
