import type { z } from "zod";
import type { homeWhyChooseDataSchema } from "@/schemas/sections";
import { theaHomeWhyChooseDefaults } from "@/data/thea-home-sections";
import HomeWhyChooseIcon from "./HomeWhyChooseIcon";

type HomeWhyChooseContent = z.infer<typeof homeWhyChooseDataSchema>;

const DEFAULT_ITEMS = theaHomeWhyChooseDefaults.items;

export default function HomeWhyChooseSection({
  content,
  anchorId,
}: {
  content: HomeWhyChooseContent;
  anchorId?: string;
}) {
  const title = content.title?.trim() || theaHomeWhyChooseDefaults.title;
  const image =
    content.image?.trim() || theaHomeWhyChooseDefaults.image;
  const items = content.items?.length > 0 ? content.items : DEFAULT_ITEMS;

  return (
    <section className="thea-why" id={anchorId ?? undefined}>
      <div className="thea-why__shell">
        <div className="thea-why__panel">
          <div className="thea-why__inner">
            <div className="thea-why__copy">
              <h2 className="thea-why__title">{title}</h2>
              <ul className="thea-why__list">
                {items.map((item) => (
                  <li key={item.title} className="thea-why__item">
                    <span className="thea-why__icon-wrap" aria-hidden="true">
                      <HomeWhyChooseIcon name={item.icon} className="thea-why__icon" />
                    </span>
                    <div className="thea-why__item-body">
                      <h3 className="thea-why__item-title">{item.title}</h3>
                      <p className="thea-why__item-text">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="thea-why__media">
              <div className="thea-why__visual">
                <span className="thea-why__frame" aria-hidden="true" />
                <figure className="thea-why__figure">
                  {image ? (
                    <img
                      className="thea-why__image"
                      src={image}
                      alt="Healthcare professionals walking in a modern hospital corridor"
                      width={480}
                      height={600}
                      decoding="async"
                      loading="lazy"
                    />
                  ) : (
                    <div className="thea-why__placeholder" aria-hidden="true" />
                  )}
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
