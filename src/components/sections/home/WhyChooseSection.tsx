import type { z } from "zod";
import type { whyChooseDataSchema } from "@/schemas/sections";
import * as Icons from "lucide-react";
import React from "react";

type WhyContent = z.infer<typeof whyChooseDataSchema>;

export default function WhyChooseSection({ content }: { content: WhyContent }) {
  const items = (content.items ?? []).slice(0, 2);
  const hasHeader = Boolean(content.title?.trim() || content.subheading?.trim());

  return (
    <section className="why-section">
      <div className="why-section__inner section-shell">
        {hasHeader ? (
          <div className="why-section__header">
            {content.title ? <h2>{content.title}</h2> : null}
            {content.subheading ? (
              <p className="why-section__subheading">{content.subheading}</p>
            ) : null}
          </div>
        ) : null}
        <div className="why-section__grid">
          {items.map((item, i) => {
            const Icon = Icons[item.icon as keyof typeof Icons] as React.ElementType;
            return (
              <article key={i} className="why-card">
                <div className="why-card__icon" aria-hidden="true">
                  {Icon ? <Icon /> : null}
                </div>
                <h3 className="why-card__title">{item.title}</h3>
                {item.description ? (
                  <p className="why-card__description">{item.description}</p>
                ) : null}
                {Array.isArray(item.tags) && item.tags.length > 0 ? (
                  <div className="why-card__tags">
                    {item.tags.map((tag, tagIndex) => (
                      <span key={`${tag}-${tagIndex}`} className="why-card__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
