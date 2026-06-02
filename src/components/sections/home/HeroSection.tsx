import type { z } from "zod";
import type { heroDataSchema } from "@/schemas/sections";
import HeroMedicalVisual from "./HeroMedicalVisual";

type HeroContent = z.infer<typeof heroDataSchema>;

const LEGACY_HERO_IMAGES = new Set([
  "/home/hero-bg.jpg",
  "/home/hero-bg.svg",
  "/home/hero-building.jpg",
  "/home/thea-hero-products.png",
  "",
]);

function resolveHeroImage(src?: string) {
  const trimmed = src?.trim() ?? "";
  if (!trimmed || LEGACY_HERO_IMAGES.has(trimmed)) {
    return null;
  }
  return trimmed;
}

function ShieldIcon() {
  return (
    <svg
      className="thea-hero__badge-icon"
      viewBox="0 0 16 16"
      width="13"
      height="13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 1.5L2.75 3.75V7.5C2.75 10.55 5.02 13.33 8 14.5C10.98 13.33 13.25 10.55 13.25 7.5V3.75L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M6 8.25L7.35 9.6L10.25 6.7"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroSection({
  content,
  anchorId,
}: {
  content: HeroContent;
  pageSlug?: string;
  anchorId?: string;
}) {
  const customImage = resolveHeroImage(content.backgroundImage);

  const badge =
    typeof content.badge === "string" && content.badge.trim() !== ""
      ? content.badge
      : "MOHAP CERTIFIED MEDICAL SUPPLIER";

  const titleLines =
    Array.isArray(content.title) && content.title.length > 0
      ? content.title
      : ["Reliable Medical", "Supplies &", "Equipment", "Solutions"];

  const description =
    typeof content.description === "string" && content.description.trim() !== ""
      ? content.description
      : "Delivering clinical excellence through premium pharmaceutical products and cutting-edge medical equipment solutions tailored for modern healthcare providers.";

  const statValue = content.overlayLabel?.trim() || "99.9%";
  const statText =
    content.overlayText?.trim() ||
    "Accuracy in medical supply distribution across UAE.";

  const primaryLabel = content.primaryAction?.label?.trim() || "Contact Us";
  const secondaryLabel = content.secondaryAction?.label?.trim() || "View Catalog";

  return (
    <section className="cx-hero thea-hero" id={anchorId ?? undefined}>
      <div className="thea-hero__shell">
        <div className="thea-hero__inner">
          <div className="thea-hero__copy">
            <p className="thea-hero__badge">
              <ShieldIcon />
              <span>{badge}</span>
            </p>

            <h1 className="thea-hero__title">
              {titleLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>

            <p className="thea-hero__description">{description}</p>

            <div className="thea-hero__actions">
              <a
                className="thea-hero__btn thea-hero__btn--primary"
                href={content.primaryAction.href}
              >
                {primaryLabel}
              </a>
              <a
                className="thea-hero__btn thea-hero__btn--secondary"
                href={content.secondaryAction.href}
              >
                {secondaryLabel}
              </a>
            </div>
          </div>

          <div className="thea-hero__visual">
            <div className="thea-hero__card">
              <div className="thea-hero__card-surface">
                {customImage ? (
                  <img
                    className="thea-hero__image"
                    src={customImage}
                    alt="Premium medical supplies and clinical equipment"
                    width={584}
                    height={584}
                    decoding="async"
                    fetchPriority="high"
                  />
                ) : (
                  <HeroMedicalVisual />
                )}
              </div>

              <div className="thea-hero__stat">
                <p className="thea-hero__stat-value">{statValue}</p>
                <p className="thea-hero__stat-text">{statText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
