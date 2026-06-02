import Link from "next/link";
import { normalizeSitePath } from "@/lib/site-path";

type FooterLink = { label: string; href: string };
type FooterMetaLink = { label: string; href: string; icon?: string };
export type FooterColumn =
  | { title: string; links: FooterLink[] }
  | { title: string; contact: Array<{ type: "location" | "phone" | "mail"; value: string }> }
  | { title: string; body: string };

function isLinkColumn(col: FooterColumn): col is { title: string; links: FooterLink[] } {
  return "links" in col && Array.isArray(col.links);
}

function isContactColumn(
  col: FooterColumn,
): col is { title: string; contact: Array<{ type: "location" | "phone" | "mail"; value: string }> } {
  return "contact" in col && Array.isArray(col.contact);
}

function isBodyColumn(col: FooterColumn): col is { title: string; body: string } {
  return "body" in col && typeof col.body === "string";
}

function resolveLegalLink(item: string | FooterMetaLink): FooterMetaLink {
  if (typeof item === "string") {
    return { label: item, href: "#" };
  }
  return item;
}

function contactLabel(type: "location" | "phone" | "mail") {
  if (type === "phone") return "Phone";
  if (type === "mail") return "Email";
  return "Location";
}

export default function SiteFooter({
  columns,
  meta,
}: {
  columns: FooterColumn[];
  meta: {
    brand: string;
    description: string;
    social: Array<string | FooterMetaLink>;
    copyright: string;
    legal: Array<string | FooterMetaLink>;
  };
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const normalizedColumns = Array.isArray(columns) ? columns : [];
  const legalLinks = (meta.legal ?? []).map(resolveLegalLink);

  return (
    <footer className="site-footer site-footer--thea">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand-col">
            <p className="site-footer__brand">{meta.brand}</p>
            {meta.description ? (
              <p className="site-footer__description">{meta.description}</p>
            ) : null}
            <div className="site-footer__social" aria-hidden="true">
              <span className="site-footer__social-icon">
                <svg viewBox="0 0 24 24" fill="none" className="site-footer__social-svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
              <span className="site-footer__social-icon">
                <svg viewBox="0 0 24 24" fill="none" className="site-footer__social-svg">
                  <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M3 19c0-3 3.5-5 6-5s6 2 6 5M14 15c2.5 0 5 1.5 5 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
          </div>

          {normalizedColumns.map((column) => {
            if (isLinkColumn(column)) {
              return (
                <nav
                  key={column.title}
                  className="site-footer__col site-footer__col--links"
                  aria-label={column.title}
                >
                  <p className="site-footer__col-heading">{column.title}</p>
                  <ul className="site-footer__links">
                    {column.links.map((item) => (
                      <li key={`${item.label}-${item.href}`}>
                        <Link href={normalizeSitePath(item.href, "/")}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              );
            }

            if (isContactColumn(column)) {
              return (
                <div key={column.title} className="site-footer__col site-footer__col--contact">
                  <p className="site-footer__col-heading">{column.title}</p>
                  <ul className="site-footer__contact">
                    {column.contact.map((item, index) => {
                      const line = `${contactLabel(item.type)}: ${item.value}`;
                      return (
                        <li key={`${item.type}-${index}`}>
                          {item.type === "mail" ? (
                            <a className="site-footer__contact-value" href={`mailto:${item.value}`}>
                              {line}
                            </a>
                          ) : item.type === "phone" ? (
                            <a
                              className="site-footer__contact-value"
                              href={`tel:${item.value.replace(/\s/g, "")}`}
                            >
                              {line}
                            </a>
                          ) : (
                            <span className="site-footer__contact-value">{line}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            }

            if (isBodyColumn(column)) {
              return (
                <div key={column.title} className="site-footer__col site-footer__col--body">
                  <p className="site-footer__col-heading">{column.title}</p>
                  <p className="site-footer__body-text">{column.body}</p>
                </div>
              );
            }

            return null;
          })}
        </div>

        <div className="site-footer__bar">
          {meta.copyright ? (
            <p className="site-footer__copyright">{meta.copyright}</p>
          ) : null}
          {legalLinks.length > 0 ? (
            <nav className="site-footer__legal" aria-label="Legal">
              {legalLinks.map((item) => (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={normalizeSitePath(item.href, "/")}
                  className="site-footer__legal-link"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
