import type { z } from "zod";
import type { servicesCapabilityCardsDataSchema } from "@/schemas/sections";
import { theaServicesCapabilityCardsDefaults } from "@/data/thea-services-sections";
import ServicesCapabilityIcon from "./ServicesCapabilityIcon";

type Content = z.infer<typeof servicesCapabilityCardsDataSchema>;

export default function ServicesCapabilityCardsSection({ content }: { content: Content }) {
  const cards =
    content.cards?.length > 0 ? content.cards : theaServicesCapabilityCardsDefaults.cards;

  return (
    <section className="thea-services-cards">
      <div className="thea-services-cards__shell">
        <div className="thea-services-cards__grid">
          {cards.map((card) => {
            const defaultCard = theaServicesCapabilityCardsDefaults.cards.find(
              (item) => item.title === card.title,
            );
            const image = card.image?.trim() || defaultCard?.image || "";

            return (
              <article key={card.title} className="thea-services-cards__card">
                <div className="thea-services-cards__media">
                  {image ? (
                    <img
                      className="thea-services-cards__image"
                      src={image}
                      alt={card.title}
                      width={400}
                      height={260}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="thea-services-cards__image-placeholder" aria-hidden="true" />
                  )}
                </div>
                <div className="thea-services-cards__body">
                  <div className="thea-services-cards__heading">
                    <span className="thea-services-cards__icon-wrap" aria-hidden="true">
                      <ServicesCapabilityIcon
                        name={card.icon || "pill"}
                        className="thea-services-cards__icon"
                      />
                    </span>
                    <h2 className="thea-services-cards__title">{card.title}</h2>
                  </div>
                  <p className="thea-services-cards__text">{card.description}</p>
                  <ul className="thea-services-cards__features">
                    {card.features.map((feature) => (
                      <li key={feature} className="thea-services-cards__feature">
                        <span className="thea-services-cards__check" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
