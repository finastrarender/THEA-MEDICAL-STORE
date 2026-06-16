import type { z } from "zod";
import type { aboutHeroDataSchema } from "@/schemas/sections";
import { theaAboutHeroDefaults } from "@/data/thea-about-sections";

type AboutHeroContent = z.infer<typeof aboutHeroDataSchema>;

export default function AboutHeroSection({
  content,
  anchorId,
}: {
  content: AboutHeroContent;
  anchorId?: string;
}) {
  const eyebrow = content.eyebrow?.trim() || theaAboutHeroDefaults.eyebrow;
  const titleLead = content.titleLead?.trim() || theaAboutHeroDefaults.titleLead;
  const titleHighlight = content.titleHighlight?.trim() || theaAboutHeroDefaults.titleHighlight;
  const titleAfter = content.titleAfter?.trim() || theaAboutHeroDefaults.titleAfter;
  const description = content.description?.trim() || theaAboutHeroDefaults.description;
  const highlights =
    content.highlights && content.highlights.length > 0
      ? content.highlights
      : theaAboutHeroDefaults.highlights;
  const quote = content.quote?.trim() || theaAboutHeroDefaults.quote;
  const quoteAttribution =
    content.quoteAttribution?.trim() || theaAboutHeroDefaults.quoteAttribution;
  const imageSrc =
    content.image?.trim() || content.backgroundImage?.trim() || theaAboutHeroDefaults.image;

  return (
    <section className="thea-about-hero" id={anchorId ?? undefined}>
      <div className="thea-about-hero__shell">
        <div className="thea-about-hero__inner">
          <div className="thea-about-hero__copy">
            <p className="thea-about-hero__eyebrow">{eyebrow}</p>
            <h1 className="thea-about-hero__title">
              {titleLead}{' '}
              <span className="thea-about-hero__title-highlight">{titleHighlight}</span>{' '}
              {titleAfter}
            </h1>
            <p className="thea-about-hero__description">{description}</p>
            <div className="thea-about-hero__highlights">
              {highlights.map((item) => (
                <div
                  key={`${item.title}-${item.subtitle}`}
                  className={`thea-about-hero__highlight thea-about-hero__highlight--${item.accent ?? "blue"}`}
                >
                  <p className="thea-about-hero__highlight-title">{item.title}</p>
                  <p className="thea-about-hero__highlight-sub">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="thea-about-hero__visual">
            <div className="thea-about-hero__media">
              {imageSrc ? (
                <img
                  className="thea-about-hero__image"
                  src={imageSrc}
                  alt="THEA Medical Store clinical environment"
                  width={800}
                  height={600}
                  decoding="async"
                  fetchPriority="high"
                />
              ) : (
                <div className="thea-about-hero__image-placeholder" aria-hidden="true" />
              )}
            </div>
            <blockquote className="thea-about-hero__quote">
              <p className="thea-about-hero__quote-text">{quote}</p>
              <cite className="thea-about-hero__quote-cite">— {quoteAttribution}</cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
