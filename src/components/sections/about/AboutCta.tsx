import type { aboutCtaDataSchema } from "@/schemas/sections";
import type { z } from "zod";

type AboutCtaContent = z.infer<typeof aboutCtaDataSchema>;

export default function AboutCta({ content }: { content: AboutCtaContent }) {
  const titleLines = Array.isArray(content.title) ? content.title : [String(content.title ?? "")];
  const primaryAction = content.primaryAction ?? { label: "CONTACT RELATIONS", href: "/contact" };
  const secondaryAction = content.secondaryAction ?? { label: "VIEW LICENSING", href: "/services" };

  return (
    <section className="cx-about-cta">
      <div className="section-shell cx-about-cta__inner">
        <h2 className="cx-about-cta__title">
          {titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="cx-about-cta__description">{content.description}</p>
        <div className="cx-about-cta__actions">
          <a className="cx-about-cta__btn cx-about-cta__btn--primary" href={primaryAction.href}>
            {primaryAction.label}
          </a>
          <a className="cx-about-cta__btn cx-about-cta__btn--secondary" href={secondaryAction.href}>
            {secondaryAction.label}
          </a>
        </div>
      </div>
    </section>
  );
}
