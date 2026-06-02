import Link from "next/link";
import type { z } from "zod";
import type { aboutFooterDataSchema } from "@/schemas/sections";
import { theaAboutFooterDefaults } from "@/data/thea-about-sections";
import { normalizeSitePath } from "@/lib/site-path";

type AboutFooterContent = z.infer<typeof aboutFooterDataSchema>;

export default function AboutFooterSection({ content }: { content: AboutFooterContent }) {
  const brand = content.brand?.trim() || theaAboutFooterDefaults.brand;
  const description = content.description?.trim() || theaAboutFooterDefaults.description;
  const productsTitle = content.productsTitle?.trim() || theaAboutFooterDefaults.productsTitle;
  const productLinks =
    content.productLinks && content.productLinks.length > 0
      ? content.productLinks
      : theaAboutFooterDefaults.productLinks;
  const inquiriesTitle =
    content.inquiriesTitle?.trim() || theaAboutFooterDefaults.inquiriesTitle;
  const phone = content.phone?.trim() || theaAboutFooterDefaults.phone;
  const email = content.email?.trim() || theaAboutFooterDefaults.email;
  const headquartersTitle =
    content.headquartersTitle?.trim() || theaAboutFooterDefaults.headquartersTitle;
  const location = content.location?.trim() || theaAboutFooterDefaults.location;
  const copyright = content.copyright?.trim() || theaAboutFooterDefaults.copyright;

  return (
    <footer className="thea-about-footer" aria-label="Site footer">
      <div className="thea-about-footer__shell">
        <div className="thea-about-footer__grid">
          <div className="thea-about-footer__brand-col">
            <p className="thea-about-footer__brand">{brand}</p>
            <p className="thea-about-footer__description">{description}</p>
          </div>

          <nav className="thea-about-footer__col" aria-label={productsTitle}>
            <p className="thea-about-footer__heading">{productsTitle}</p>
            <ul className="thea-about-footer__list">
              {productLinks.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link href={normalizeSitePath(item.href, "/")}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="thea-about-footer__col">
            <p className="thea-about-footer__heading">{inquiriesTitle}</p>
            <ul className="thea-about-footer__list thea-about-footer__list--plain">
              <li>
                <span>Phone: </span>
                <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              </li>
              <li>
                <span>Email: </span>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            </ul>
          </div>

          <div className="thea-about-footer__col">
            <p className="thea-about-footer__heading">{headquartersTitle}</p>
            <p className="thea-about-footer__location">
              <span>Location: </span>
              {location}
            </p>
          </div>
        </div>

        <div className="thea-about-footer__bar">
          <p className="thea-about-footer__copyright">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
