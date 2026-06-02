import type { z } from "zod";
import type { globalStandardsDataSchema } from "@/schemas/sections";
import CapabilityIcon from "./CapabilityIcon";

type GlobalStandardsContent = z.infer<typeof globalStandardsDataSchema>;

export default function GlobalStandardsSection({ content }: { content: GlobalStandardsContent }) {
  const eyebrow =
    typeof content.eyebrow === "string" && content.eyebrow.trim() !== ""
      ? content.eyebrow
      : "CAPABILITIES";

  const pillars = content.pillars.slice(0, 3);

  return (
    <section className="cx-capabilities" aria-label="Capabilities">
      <div className="section-shell cx-capabilities__inner">
        <div className="cx-capabilities__header">
          <div className="cx-capabilities__header-left">
            <p className="cx-capabilities__label">{eyebrow}</p>
            <h2 className="cx-capabilities__title">{content.title}</h2>
          </div>
          <p className="cx-capabilities__description">{content.description}</p>
        </div>

        <div className="cx-capabilities__divider" aria-hidden="true" />

        <div className="cx-capabilities__grid">
          {pillars.map((pillar, i) => (
            <article
              key={`${pillar.title}-${i}`}
              className={`cx-capability-card${i === 1 ? " cx-capability-card--featured" : ""}`}
            >
              <span className="cx-capability-card__icon" aria-hidden="true">
                <CapabilityIcon
                  name={(pillar.icon as string) || "tokenize"}
                  className="cx-capability-card__icon-svg"
                />
              </span>
              <div className="cx-capability-card__body">
                <h3 className="cx-capability-card__title">{pillar.title}</h3>
                <p className="cx-capability-card__text">{pillar.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
