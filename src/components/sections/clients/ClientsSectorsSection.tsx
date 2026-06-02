import type { z } from "zod";
import type { clientsSectorsDataSchema } from "@/schemas/sections";
import { theaClientsSectorsDefaults } from "@/data/thea-clients-sections";
import ClientsSectorIcon from "./ClientsSectorIcon";

type Content = z.infer<typeof clientsSectorsDataSchema>;
type SectorCard = Content["cards"][number];

function SectorCardBody({ card }: { card: SectorCard }) {
  const bullets = card.bullets ?? [];

  return (
    <>
      <div className="thea-clients-sectors__icon-wrap">
        <ClientsSectorIcon name={card.icon} className="thea-clients-sectors__icon" />
      </div>
      <h3 className="thea-clients-sectors__card-title">{card.title}</h3>
      <p className="thea-clients-sectors__card-text">{card.description}</p>
      {bullets.length > 0 ? (
        <ul className="thea-clients-sectors__bullets">
          {bullets.map((item) => (
            <li key={item} className="thea-clients-sectors__bullet">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

function FamilyDecor() {
  return (
    <svg
      className="thea-clients-sectors__family-decor"
      viewBox="0 0 80 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="28" cy="14" r="6" fill="currentColor" opacity="0.12" />
      <path
        d="M16 38c0-6.6 5.4-12 12-12s12 5.4 12 12M40 38c0-5.5 4.5-10 10-10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.12"
      />
      <circle cx="52" cy="16" r="5" fill="currentColor" opacity="0.12" />
      <circle cx="64" cy="18" r="4" fill="currentColor" opacity="0.12" />
    </svg>
  );
}

export default function ClientsSectorsSection({ content }: { content: Content }) {
  const title = content.title?.trim() || theaClientsSectorsDefaults.title;
  const titleAccent = content.titleAccent?.trim() || theaClientsSectorsDefaults.titleAccent;
  const cards =
    content.cards?.length > 0 ? content.cards : theaClientsSectorsDefaults.cards;

  const accentInTitle = titleAccent && title.includes(titleAccent);
  const titleParts = accentInTitle ? title.split(titleAccent) : [title];
  const beforeAccent = titleParts[0] ?? "";
  const afterAccent = accentInTitle ? titleParts.slice(1).join(titleAccent) : "";

  return (
    <section className="thea-clients-sectors" aria-labelledby="thea-clients-sectors-title">
      <div className="thea-clients-sectors__shell">
        <h2 id="thea-clients-sectors-title" className="thea-clients-sectors__title">
          {accentInTitle ? (
            <>
              {beforeAccent}
              <span className="thea-clients-sectors__title-accent">{titleAccent}</span>
              {afterAccent}
            </>
          ) : (
            title
          )}
        </h2>

        <div className="thea-clients-sectors__grid">
          {cards.map((card) => {
            const isFeatured = card.layout === "featured";
            const isDark = card.variant === "dark";
            const imageSrc = card.image?.trim();

            if (isFeatured) {
              return (
                <article
                  key={card.title}
                  className="thea-clients-sectors__card thea-clients-sectors__card--featured"
                >
                  <div className="thea-clients-sectors__card-main">
                    <SectorCardBody card={card} />
                  </div>
                  <div className="thea-clients-sectors__card-media">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt=""
                        className="thea-clients-sectors__card-image"
                        width={560}
                        height={320}
                        decoding="async"
                      />
                    ) : (
                      <div className="thea-clients-sectors__card-image-placeholder" aria-hidden="true" />
                    )}
                  </div>
                </article>
              );
            }

            return (
              <article
                key={card.title}
                className={`thea-clients-sectors__card thea-clients-sectors__card--standard${isDark ? " thea-clients-sectors__card--dark" : ""}`}
              >
                <div className="thea-clients-sectors__card-inner">
                  <SectorCardBody card={card} />
                  {imageSrc ? (
                    <div className="thea-clients-sectors__card-thumb">
                      <img
                        src={imageSrc}
                        alt=""
                        className="thea-clients-sectors__card-thumb-image"
                        width={400}
                        height={120}
                        decoding="async"
                      />
                    </div>
                  ) : null}
                  {card.showFamilyDecor ? <FamilyDecor /> : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
