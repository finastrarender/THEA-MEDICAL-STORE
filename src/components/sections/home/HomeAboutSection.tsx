import type { z } from "zod";
import type { homeAboutDataSchema } from "@/schemas/sections";

type HomeAboutContent = z.infer<typeof homeAboutDataSchema>;

export default function HomeAboutSection({
  content,
  anchorId,
}: {
  content: HomeAboutContent;
  anchorId?: string;
}) {
  const title = content.title?.trim() || "About THEA Medical Store";
  const description =
    content.description?.trim() ||
    "At THEA Medical Store L.L.C., we stand as a cornerstone of healthcare reliability in the United Arab Emirates. Our commitment goes beyond simple supply; we provide a curated ecosystem of pharmaceutical grade products and clinical equipment.";
  const description2 =
    content.description2?.trim() ||
    "With a focus on precision and regulatory compliance, we serve as the bridge between global medical innovations and local healthcare excellence, ensuring every clinic, hospital, and laboratory has the tools they need to save lives.";
  const image = content.image?.trim() || "";
  const missionTitle = content.missionTitle?.trim() || "Our Mission";
  const missionText =
    content.missionText?.trim() ||
    "Elevating patient care through uncompromising supply chain integrity.";
  const visionTitle = content.visionTitle?.trim() || "Our Vision";
  const visionText =
    content.visionText?.trim() ||
    "To be the most trusted name in clinical procurement in the MENA region.";

  return (
    <section className="thea-about" id={anchorId ?? undefined}>
      <div className="thea-about__shell">
        <div className="thea-about__inner">
          <div className="thea-about__media">
            <div className="thea-about__frame">
              {image ? (
                <img
                  className="thea-about__image"
                  src={image}
                  alt={`${title} — THEA Medical Store`}
                  width={480}
                  height={620}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="thea-about__placeholder" aria-hidden="true">
                  <div className="thea-about__flask thea-about__flask--1" />
                  <div className="thea-about__flask thea-about__flask--2" />
                  <div className="thea-about__flask thea-about__flask--3" />
                  <div className="thea-about__flask thea-about__flask--4" />
                </div>
              )}
            </div>
          </div>

          <div className="thea-about__copy">
            <span className="thea-about__accent" aria-hidden="true" />
            <h2 className="thea-about__title">{title}</h2>
            <p className="thea-about__text">{description}</p>
            <p className="thea-about__text">{description2}</p>

            <div className="thea-about__cards">
              <article className="thea-about__card">
                <h3 className="thea-about__card-title">{missionTitle}</h3>
                <p className="thea-about__card-text">{missionText}</p>
              </article>
              <article className="thea-about__card">
                <h3 className="thea-about__card-title">{visionTitle}</h3>
                <p className="thea-about__card-text">{visionText}</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
