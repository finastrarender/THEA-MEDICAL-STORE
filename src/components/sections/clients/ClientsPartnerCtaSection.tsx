import Link from "next/link";
import type { z } from "zod";
import type { clientsPartnerCtaDataSchema } from "@/schemas/sections";
import { theaClientsPartnerCtaDefaults } from "@/data/thea-clients-sections";

type Content = z.infer<typeof clientsPartnerCtaDataSchema>;

function CtaButton({
  label,
  href,
  variant,
}: {
  label: string;
  href: string;
  variant: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "thea-clients-cta__btn thea-clients-cta__btn--primary"
      : "thea-clients-cta__btn thea-clients-cta__btn--secondary";
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {label}
    </Link>
  );
}

export default function ClientsPartnerCtaSection({ content }: { content: Content }) {
  const title = content.title?.trim() || theaClientsPartnerCtaDefaults.title;
  const description =
    content.description?.trim() || theaClientsPartnerCtaDefaults.description;
  const primary = content.primaryAction ?? theaClientsPartnerCtaDefaults.primaryAction;
  const secondary = content.secondaryAction ?? theaClientsPartnerCtaDefaults.secondaryAction;

  return (
    <section className="thea-clients-cta" aria-labelledby="thea-clients-cta-title">
      <div className="thea-clients-cta__shell">
        <div className="thea-clients-cta__card">
          <h2 id="thea-clients-cta-title" className="thea-clients-cta__title">
            {title}
          </h2>
          <p className="thea-clients-cta__description">{description}</p>
          <div className="thea-clients-cta__actions">
            <CtaButton
              label={primary.label}
              href={primary.href}
              variant="primary"
            />
            <CtaButton
              label={secondary.label}
              href={secondary.href}
              variant="secondary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
