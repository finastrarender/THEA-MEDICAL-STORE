import type { z } from "zod";
import type { aboutMissionDataSchema } from "@/schemas/sections";
import { theaAboutMissionDefaults } from "@/data/thea-about-sections";
import AboutMissionIcon from "./AboutMissionIcon";

type AboutMissionContent = z.infer<typeof aboutMissionDataSchema>;

function resolveCards(content: AboutMissionContent) {
  if (content.cards && content.cards.length > 0) {
    return content.cards;
  }
  if (content.pillars && content.pillars.length > 0) {
    return content.pillars.map((pillar, index) => ({
      icon: ["rocket", "eye", "values"][index] ?? "rocket",
      title: pillar.title,
      description: pillar.description,
      bullets: undefined as string[] | undefined,
    }));
  }
  return theaAboutMissionDefaults.cards;
}

export default function AboutMissionSection({ content }: { content: AboutMissionContent }) {
  const cards = resolveCards(content).slice(0, 3);

  return (
    <section className="thea-about-mission" aria-label="Mission, vision and values">
      <div className="thea-about-mission__shell">
        <div className="thea-about-mission__grid">
          {cards.map((card) => (
            <article key={card.title} className="thea-about-mission__card">
              <span className="thea-about-mission__icon-wrap" aria-hidden="true">
                <AboutMissionIcon name={card.icon} className="thea-about-mission__icon" />
              </span>
              <h2 className="thea-about-mission__card-title">{card.title}</h2>
              {card.bullets && card.bullets.length > 0 ? (
                <ul className="thea-about-mission__list">
                  {card.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="thea-about-mission__card-text">{card.description}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
