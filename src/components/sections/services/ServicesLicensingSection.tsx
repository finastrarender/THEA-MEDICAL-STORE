import Link from "next/link";
import type { z } from "zod";
import type { servicesLicensingDataSchema } from "@/schemas/sections";
import SimpleIcon from "@/components/sections/SimpleIcon";

type ServicesLicensingContent = z.infer<typeof servicesLicensingDataSchema>;

const DEFAULT_EYEBROW = "INSTITUTIONAL DIGITAL ASSETS";

const DEFAULT_TITLE = ["Services &", "Licensing."];

const DEFAULT_DESCRIPTION =
  "Providing high-end architectural infrastructure for digital asset issuance within a regulated framework. Precise. Authorized. Institutional.";

const DEFAULT_CARDS = [
  {
    title: "NFT Creation",
    description:
      "Architecting bespoke smart contract environments for large-scale digital asset minting. Ensuring structural integrity across multiple chain protocols.",
    linkLabel: "PROTOCOL DETAILS →",
    linkHref: "/contact",
    icon: "blocks" as const,
  },
  {
    title: "NFT Issuance",
    description:
      "Managed deployment of verified digital stamps and high-volume asset issuance. Integrated provenance tracking for institutional-grade reliability.",
    linkLabel: "ISSUANCE FRAMEWORK →",
    linkHref: "/contact",
    icon: "shield-check" as const,
  },
];

const DEFAULT_LICENSES = [
  {
    licenseNumber: "RAK-CNX-2024-001",
    authority: "RAK Economic Zone",
    legalType: "Commercial Digital Assets",
    location: "UAE",
    status: "LICENSED",
  },
  {
    licenseNumber: "IF-UAE-9932-A",
    authority: "Freezone Authority",
    legalType: "Technology Infrastructure",
    location: "Dubai",
    status: "LICENSED",
  },
  {
    licenseNumber: "GB-SEC-LP-8812",
    authority: "Global Blockchain Council",
    legalType: "Security Protocol Member",
    location: "International",
    status: "LICENSED",
  },
];

const DEFAULT_COMPLIANCE =
  "CRYPTONEXIS LIMITED OPERATES UNDER STRICT COMPLIANCE MANDATES AS REQUIRED BY UAE RAK ECONOMIC ZONE REGULATIONS. ALL ASSET MINTING PROTOCOLS ARE AUDITED QUARTERLY FOR STRUCTURAL INTEGRITY.";

const DEFAULT_RELIABILITY_TITLE = "Institutional Reliability.";

const DEFAULT_RELIABILITY_DESCRIPTION =
  "Our infrastructure is built on the premise of architectural precision. We eliminate volatility through rigorous compliance and verified blockchain stamps.";

function BlocksIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="8" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="14" y="4" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10" y="14" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 11.5H14M17.5 11v3M13.5 17.5H14"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5 5.5 5.2v5.8c0 4.6 2.8 8.2 6.5 9.8 3.7-1.6 6.5-5.2 6.5-9.8V5.2L12 2.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12.2 10.8 14.5 15.5 9.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServiceCardIcon({ icon }: { icon?: string }) {
  if (icon === "shield-check") {
    return <ShieldCheckIcon className="sl-licensing__card-icon-svg" />;
  }
  if (icon === "blocks") {
    return <BlocksIcon className="sl-licensing__card-icon-svg" />;
  }
  return <SimpleIcon name={icon || "nodes"} className="sl-licensing__card-icon-svg" />;
}

export default function ServicesLicensingSection({
  content,
}: {
  content?: ServicesLicensingContent;
}) {
  const data = content ?? {};
  const eyebrow = data.eyebrow?.trim() || DEFAULT_EYEBROW;
  const titleLines = data.title && data.title.length > 0 ? data.title : DEFAULT_TITLE;
  const description = data.description?.trim() || DEFAULT_DESCRIPTION;
  const cards = data.cards && data.cards.length > 0 ? data.cards : DEFAULT_CARDS;
  const licenses = data.licenses && data.licenses.length > 0 ? data.licenses : DEFAULT_LICENSES;
  const complianceNotice = data.complianceNotice?.trim() || DEFAULT_COMPLIANCE;
  const reliabilityTitle = data.reliabilityTitle?.trim() || DEFAULT_RELIABILITY_TITLE;
  const reliabilityDescription =
    data.reliabilityDescription?.trim() || DEFAULT_RELIABILITY_DESCRIPTION;

  return (
    <section className="sl-licensing" aria-label="Services and licensing">
      <div className="sl-licensing__hero-band">
        <div className="section-shell">
          <header className="sl-licensing__hero">
            <p className="sl-licensing__eyebrow">{eyebrow}</p>
            <h1 className="sl-licensing__title">
              {titleLines.map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </h1>
            <p className="sl-licensing__lede">{description}</p>
          </header>
        </div>
      </div>

      <div className="sl-licensing__cards-band">
        <div className="section-shell">
          <div className="sl-licensing__cards">
            {cards.map((card) => (
              <article key={card.title} className="sl-licensing__card">
                <span className="sl-licensing__card-icon" aria-hidden="true">
                  <ServiceCardIcon icon={card.icon} />
                </span>
                <h3 className="sl-licensing__card-title">{card.title}</h3>
                <p className="sl-licensing__card-text">{card.description}</p>
                <a className="sl-licensing__card-link" href={card.linkHref || "/contact"}>
                  {card.linkLabel}
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="sl-licensing__registry">
        <div className="section-shell">
          <header className="sl-licensing__registry-header">
            <h2 className="sl-licensing__registry-title">LICENSING AUTHORITY</h2>
          </header>

          <div className="sl-licensing__table-wrap">
            <table className="sl-licensing__table">
              <thead>
                <tr>
                  <th scope="col">License Number</th>
                  <th scope="col">Authority</th>
                  <th scope="col">Legal Type</th>
                  <th scope="col">Location</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((row) => (
                  <tr key={row.licenseNumber}>
                    <td className="sl-licensing__cell-license">{row.licenseNumber}</td>
                    <td>{row.authority}</td>
                    <td>{row.legalType}</td>
                    <td>{row.location}</td>
                    <td>
                      <span className="sl-licensing__badge">{row.status ?? "LICENSED"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="sl-licensing__compliance">
            <Link href="/about" className="sl-licensing__compliance-text">
              {complianceNotice}
            </Link>
            <span className="sl-licensing__compliance-watermark" aria-hidden="true">
              <SimpleIcon name="shield" className="sl-licensing__compliance-icon" />
            </span>
          </aside>
        </div>
      </div>

      <div className="sl-licensing__reliability">
        <div className="section-shell sl-licensing__reliability-inner">
          <h2 className="sl-licensing__reliability-title">{reliabilityTitle}</h2>
          <div className="sl-licensing__reliability-divider" aria-hidden="true" />
          <p className="sl-licensing__reliability-text">{reliabilityDescription}</p>
        </div>
      </div>
    </section>
  );
}
