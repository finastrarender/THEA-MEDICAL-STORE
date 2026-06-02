import type { z } from "zod";
import type { clientsComplianceDataSchema } from "@/schemas/sections";
import { theaClientsComplianceDefaults } from "@/data/thea-clients-sections";
import ClientsComplianceIcon from "./ClientsComplianceIcon";

type Content = z.infer<typeof clientsComplianceDataSchema>;

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      width="18"
      height="18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 2.5 4.5 5v4.8c0 3.1 2.2 5.95 5.5 6.7 3.3-.75 5.5-3.6 5.5-6.7V5L10 2.5z"
        fill="currentColor"
      />
      <path
        d="M7.5 10.2 9.2 12 12.5 8.5"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ClientsComplianceSection({ content }: { content: Content }) {
  const title = content.title?.trim() || theaClientsComplianceDefaults.title;
  const description =
    content.description?.trim() || theaClientsComplianceDefaults.description;
  const approvalBadges =
    content.approvalBadges?.length > 0
      ? content.approvalBadges
      : theaClientsComplianceDefaults.approvalBadges;
  const certifications =
    content.certifications?.length > 0
      ? content.certifications
      : theaClientsComplianceDefaults.certifications;

  return (
    <section
      className="thea-clients-compliance"
      aria-labelledby="thea-clients-compliance-title"
    >
      <div className="thea-clients-compliance__shell">
        <div className="thea-clients-compliance__card">
          <div className="thea-clients-compliance__left">
            <h2 id="thea-clients-compliance-title" className="thea-clients-compliance__title">
              {title}
            </h2>
            <p className="thea-clients-compliance__description">{description}</p>
            <div className="thea-clients-compliance__badges">
              {approvalBadges.map((badge) => (
                <div key={badge.label} className="thea-clients-compliance__badge">
                  <ShieldCheckIcon className="thea-clients-compliance__badge-icon" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="thea-clients-compliance__right">
            <div className="thea-clients-compliance__certs">
              {certifications.map((cert) => (
                <div key={cert.label} className="thea-clients-compliance__cert">
                  <div className="thea-clients-compliance__cert-icon-wrap">
                    <ClientsComplianceIcon
                      name={cert.icon}
                      className="thea-clients-compliance__cert-icon"
                    />
                  </div>
                  <p className="thea-clients-compliance__cert-label">{cert.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
