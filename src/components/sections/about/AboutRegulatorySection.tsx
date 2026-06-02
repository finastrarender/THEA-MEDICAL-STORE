import type { z } from "zod";
import type { aboutRegulatoryDataSchema } from "@/schemas/sections";
import { theaAboutRegulatoryDefaults } from "@/data/thea-about-sections";
import AboutRegulatoryIcon from "./AboutRegulatoryIcon";

type AboutRegulatoryContent = z.infer<typeof aboutRegulatoryDataSchema>;

function resolveItems(content: AboutRegulatoryContent) {
  if (content.items && content.items.length > 0) {
    return content.items;
  }
  return theaAboutRegulatoryDefaults.items;
}

export default function AboutRegulatorySection({ content }: { content: AboutRegulatoryContent }) {
  const title = content.title?.trim() || theaAboutRegulatoryDefaults.title;
  const description = content.description?.trim() ?? "";
  const mohapLogo = content.mohapLogo?.trim() || theaAboutRegulatoryDefaults.mohapLogo;
  const isoLine1 = content.isoLine1?.trim() || theaAboutRegulatoryDefaults.isoLine1;
  const isoLine2 = content.isoLine2?.trim() || theaAboutRegulatoryDefaults.isoLine2;
  const guaranteeTitle =
    content.guaranteeTitle?.trim() || theaAboutRegulatoryDefaults.guaranteeTitle;
  const guaranteeText =
    content.guaranteeText?.trim() || theaAboutRegulatoryDefaults.guaranteeText;
  const items = resolveItems(content);

  return (
    <section className="thea-about-regulatory" aria-labelledby="thea-about-regulatory-title">
      <div className="thea-about-regulatory__shell">
        <div className="thea-about-regulatory__inner">
          <div className="thea-about-regulatory__left">
            <div className="thea-about-regulatory__badges">
              <div className="thea-about-regulatory__logo-card">
                <div className="thea-about-regulatory__logo-mount">
                  {mohapLogo ? (
                    <img
                      src={mohapLogo}
                      alt="MOHAP certification"
                      className="thea-about-regulatory__logo"
                    />
                  ) : (
                    <div className="thea-about-regulatory__logo-placeholder" aria-hidden="true">
                      <span className="thea-about-regulatory__logo-seal" />
                    </div>
                  )}
                </div>
              </div>
              <div className="thea-about-regulatory__iso-card">
                <p className="thea-about-regulatory__iso-line1">{isoLine1}</p>
                <p className="thea-about-regulatory__iso-line2">{isoLine2}</p>
              </div>
            </div>

            <div className="thea-about-regulatory__guarantee">
              <h3 className="thea-about-regulatory__guarantee-title">{guaranteeTitle}</h3>
              <p className="thea-about-regulatory__guarantee-text">{guaranteeText}</p>
            </div>
          </div>

          <div className="thea-about-regulatory__right">
            <h2 id="thea-about-regulatory-title" className="thea-about-regulatory__title">
              {title}
            </h2>
            {description ? <p className="thea-about-regulatory__intro">{description}</p> : null}
            <ul className="thea-about-regulatory__list">
              {items.map((item) => (
                <li key={item.title} className="thea-about-regulatory__item">
                  <span className="thea-about-regulatory__item-icon" aria-hidden="true">
                    <AboutRegulatoryIcon
                      name={item.icon ?? "shield"}
                      className="thea-about-regulatory__item-icon-svg"
                    />
                  </span>
                  <div className="thea-about-regulatory__item-body">
                    <h3 className="thea-about-regulatory__item-title">{item.title}</h3>
                    <p className="thea-about-regulatory__item-text">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
