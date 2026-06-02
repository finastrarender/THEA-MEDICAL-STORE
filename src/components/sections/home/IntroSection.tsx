import type { z } from "zod";
import Link from "next/link";
import type { introDataSchema } from "@/schemas/sections";
import SimpleIcon from "../SimpleIcon";

type IntroContent = z.infer<typeof introDataSchema>;

const DEFAULT_STATS = [
  { value: "UAE", label: "JURISDICTION" },
  { value: "RAK", label: "ECONOMIC ZONE" },
];

export default function IntroSection({
  content,
  anchorId,
}: {
  content: IntroContent;
  anchorId?: string;
}) {
  const rawTitle =
    Array.isArray(content.title) && content.title.length > 0
      ? content.title
      : ["The Foundation of", "Digital Trust"];

  const titleLines =
    rawTitle.length >= 2
      ? rawTitle
      : rawTitle[0]?.includes("Foundation of") && rawTitle[0]?.includes("Digital Trust")
        ? ["The Foundation of", "Digital Trust"]
        : rawTitle;

  const description =
    typeof content.description === "string" && content.description.trim() !== ""
      ? content.description
      : "Cryptonexis Limited stands at the forefront of the UAE's evolving digital economy. As a pioneer in the regulated issuance of non-fungible tokens, we provide institutional clients with the legal and technical scaffolding required for sophisticated asset management.";

  const more =
    typeof content.more === "string" && content.more.trim() !== ""
      ? content.more
      : "Our approach is built on three core pillars: regulatory compliance, architectural integrity, and cryptographic security. We do not participate in speculative retail markets; we build utility-driven ecosystems for the modern enterprise.";

  const stats =
    content.stats && content.stats.length > 0 ? content.stats : DEFAULT_STATS;

  const cardLabel = content.cardLabel?.trim() || "LICENSING AUTHORITY";
  const cardDescription =
    content.cardDescription?.trim() ||
    "Cryptonexis Limited is registered and regulated within the RAK Economic Zone, adhering to strict financial transparency and digital asset frameworks.";
  const cardLinkLabel = content.cardLinkLabel?.trim() || "REVIEW CERTIFICATION";
  const cardHref = content.cardHref?.trim() || "/about";

  return (
    <section className="cx-foundation" id={anchorId ?? undefined}>
      <div className="section-shell cx-foundation__inner">
        <div className="cx-foundation__left">
          <h2 className="cx-foundation__title">
            {titleLines.slice(0, 2).map((line, i) => (
              <span key={`${line}-${i}`}>{line}</span>
            ))}
          </h2>
          <p className="cx-foundation__description">{description}</p>
          <p className="cx-foundation__description">{more}</p>

          <div className="cx-foundation__divider" aria-hidden="true" />

          <div className="cx-foundation__stats" role="list">
            {stats.map((stat) => (
              <div key={`${stat.value}-${stat.label}`} className="cx-foundation__stat" role="listitem">
                <p className="cx-foundation__stat-value">{stat.value}</p>
                <p className="cx-foundation__stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="cx-foundation__right" aria-label="Licensing authority">
          <div className="cx-foundation-card">
            <div className="cx-foundation-card__icon" aria-hidden="true">
              <span className="cx-foundation-card__icon-ring">
                <SimpleIcon name="shield" className="cx-foundation-card__icon-svg" />
              </span>
            </div>
            <p className="cx-foundation-card__label">{cardLabel}</p>
            <p className="cx-foundation-card__text">{cardDescription}</p>
            <Link className="cx-foundation-card__link" href={cardHref}>
              {cardLinkLabel}
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
