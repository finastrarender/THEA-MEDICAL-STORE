import type { z } from "zod";
import type { clientsPageHeroDataSchema } from "@/schemas/sections";
import { theaClientsPageHeroDefaults } from "@/data/thea-clients-sections";

type Content = z.infer<typeof clientsPageHeroDataSchema>;

function CertCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path
        d="M6.5 10.2 8.6 12.3 13.5 7.4"
        stroke="#fff"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ClientsPageHeroSection({ content }: { content: Content }) {
  const badge = content.badge?.trim() || theaClientsPageHeroDefaults.badge;
  const titleLead = content.titleLead?.trim() || theaClientsPageHeroDefaults.titleLead;
  const titleHighlight =
    content.titleHighlight?.trim() || theaClientsPageHeroDefaults.titleHighlight;
  const titleAfter = content.titleAfter?.trim() || theaClientsPageHeroDefaults.titleAfter;
  const description = content.description?.trim() || theaClientsPageHeroDefaults.description;
  const backgroundImage =
    content.backgroundImage?.trim() || theaClientsPageHeroDefaults.backgroundImage;
  const certifications =
    content.certifications?.length > 0
      ? content.certifications
      : theaClientsPageHeroDefaults.certifications;

  const bgStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : undefined;

  return (
    <section className="thea-clients-hero" style={bgStyle}>
      <div className="thea-clients-hero__overlay" aria-hidden="true" />
      <div className="thea-clients-hero__shell">
        <div className="thea-clients-hero__copy">
          <p className="thea-clients-hero__badge">{badge}</p>
          <h1 className="thea-clients-hero__title">
            <span className="thea-clients-hero__title-line">{titleLead}</span>{' '}
            <span className="thea-clients-hero__title-line thea-clients-hero__title-line--accent">
              {titleHighlight}
            </span>{' '}
            <span className="thea-clients-hero__title-line">{titleAfter}</span>
          </h1>
          <p className="thea-clients-hero__description">{description}</p>
          <div className="thea-clients-hero__certs">
            {certifications.map((cert) => (
              <div key={cert.label} className="thea-clients-hero__cert">
                <CertCheckIcon className="thea-clients-hero__cert-icon" />
                <span>{cert.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
