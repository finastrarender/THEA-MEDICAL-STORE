import type { z } from "zod";
import type { servicesRegulatoryDataSchema } from "@/schemas/sections";
import { theaServicesRegulatoryDefaults } from "@/data/thea-services-sections";

type Content = z.infer<typeof servicesRegulatoryDataSchema>;

function CertIcon({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="m8 12 2.5 2.5L16 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function ServicesRegulatorySection({ content }: { content: Content }) {
  const title = content.title?.trim() || theaServicesRegulatoryDefaults.title;
  const description =
    content.description?.trim() || theaServicesRegulatoryDefaults.description;
  const certifications =
    content.certifications?.length > 0
      ? content.certifications
      : theaServicesRegulatoryDefaults.certifications;
  const tableTitle =
    content.tableTitle?.trim() || theaServicesRegulatoryDefaults.tableTitle;
  const standards =
    content.standards?.length > 0
      ? content.standards
      : theaServicesRegulatoryDefaults.standards;

  return (
    <section className="thea-services-regulatory">
      <div className="thea-services-regulatory__shell">
        <div className="thea-services-regulatory__inner">
          <div className="thea-services-regulatory__left">
            <h2 className="thea-services-regulatory__title">{title}</h2>
            <p className="thea-services-regulatory__description">{description}</p>
            <ul className="thea-services-regulatory__certs">
              {certifications.map((cert) => (
                <li key={cert.title} className="thea-services-regulatory__cert">
                  <CertIcon className="thea-services-regulatory__cert-icon" />
                  <div className="thea-services-regulatory__cert-body">
                    <h3 className="thea-services-regulatory__cert-title">{cert.title}</h3>
                    <p className="thea-services-regulatory__cert-sub">{cert.subtitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="thea-services-regulatory__table-card">
            <h3 className="thea-services-regulatory__table-title">{tableTitle}</h3>
            <div className="thea-services-regulatory__table-wrap">
              <table className="thea-services-regulatory__table">
                <thead>
                  <tr>
                    <th scope="col">Device category</th>
                    <th scope="col">Standard</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {standards.map((row) => (
                    <tr key={`${row.deviceCategory}-${row.standard}`}>
                      <td>{row.deviceCategory}</td>
                      <td>{row.standard}</td>
                      <td>
                        <span className="thea-services-regulatory__badge">{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
