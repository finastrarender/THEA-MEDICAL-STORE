import type { z } from "zod";
import type { servicesCtaDataSchema } from "@/schemas/sections";

type ServicesCtaContent = z.infer<typeof servicesCtaDataSchema>;

const DEFAULT_CONTENT: ServicesCtaContent = {
  title: "ALL SYSTEMS OPERATIONAL // DUBAI HUB",
  description: "",
  primaryAction: { label: "DOWNLOAD CAPABILITY STATEMENT", href: "/contact" },
  secondaryAction: { label: "", href: "/contact" },
};

export default function ServicesSectionCta({
  content,
}: {
  content: Partial<ServicesCtaContent>;
}) {
  const safeContent: ServicesCtaContent = {
    title: content.title || DEFAULT_CONTENT.title,
    description: content.description || DEFAULT_CONTENT.description,
    primaryAction: {
      label: content.primaryAction?.label || DEFAULT_CONTENT.primaryAction.label,
      href: content.primaryAction?.href || DEFAULT_CONTENT.primaryAction.href,
    },
    secondaryAction: {
      label: content.secondaryAction?.label || DEFAULT_CONTENT.secondaryAction.label,
      href: content.secondaryAction?.href || DEFAULT_CONTENT.secondaryAction.href,
    },
  };

  return (
    <section className="services-cta">
      <div className="section-shell">
        <div className="services-cta__content">
          <div className="services-cta__status">
            <span className="services-cta__dot" aria-hidden="true" />
            <p className="services-cta__title">{safeContent.title}</p>
          </div>
          <div className="services-cta__actions">
            <a className="services-cta__button services-cta__button-primary" href={safeContent.primaryAction.href}>
              {safeContent.primaryAction.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
