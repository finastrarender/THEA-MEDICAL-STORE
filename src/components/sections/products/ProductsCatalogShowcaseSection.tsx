import Link from "next/link";
import type { z } from "zod";
import type { productsCatalogShowcaseDataSchema } from "@/schemas/sections";
import {
  PRODUCT_DETAIL_PATH,
  theaProductsCatalogShowcaseDefaults,
} from "@/data/thea-products-sections";

type Content = z.infer<typeof productsCatalogShowcaseDataSchema>;

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7M17 7H9M17 7v8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductsCatalogShowcaseSection({ content }: { content: Content }) {
  const fallback = theaProductsCatalogShowcaseDefaults;
  const badge = content.badge?.trim() || fallback.badge;
  const titleLead = content.titleLead?.trim() || fallback.titleLead;
  const titleHighlight = content.titleHighlight?.trim() || fallback.titleHighlight;
  const description = content.description?.trim() || fallback.description;
  const featured = content.featured ?? fallback.featured;
  const equipment = content.equipment ?? fallback.equipment;
  const surgical = content.surgical ?? fallback.surgical;
  const consumables = content.consumables ?? fallback.consumables;
  const secondaryBanner = content.secondaryBanner ?? fallback.secondaryBanner;
  const quality = content.quality ?? fallback.quality;
  const featuredHref =
    featured.linkHref?.trim() ||
    fallback.featured.linkHref ||
    PRODUCT_DETAIL_PATH;
  const consumablesHref =
    consumables.linkHref?.trim() ||
    fallback.consumables.linkHref ||
    PRODUCT_DETAIL_PATH;
  const equipmentHref = PRODUCT_DETAIL_PATH;

  return (
    <section className="thea-products-showcase">
      <div className="thea-products-showcase__shell">
        <header className="thea-products-showcase__header">
          <p className="thea-products-showcase__badge">{badge}</p>
          <h1 className="thea-products-showcase__title">
            {titleLead} <span>{titleHighlight}</span>
          </h1>
          <p className="thea-products-showcase__description">{description}</p>
        </header>

        <div className="thea-products-showcase__grid">
          <article id="pharmaceuticals" className="thea-products-showcase__card thea-products-showcase__card--featured">
            <div className="thea-products-showcase__media">
              {featured.image ? (
                <img src={featured.image} alt="" className="thea-products-showcase__image" />
              ) : (
                <div className="thea-products-showcase__image-placeholder" aria-hidden="true" />
              )}
            </div>
            <div className="thea-products-showcase__body">
              <h3>{featured.title}</h3>
              <p>{featured.description}</p>
              <Link href={featuredHref} className="thea-products-showcase__link">
                {featured.linkLabel} <ArrowIcon className="thea-products-showcase__link-icon" />
              </Link>
            </div>
          </article>

          <article id="equipment" className="thea-products-showcase__card thea-products-showcase__card--equipment">
            <div className="thea-products-showcase__media">
              {equipment.image ? (
                <img src={equipment.image} alt="" className="thea-products-showcase__image" />
              ) : (
                <div className="thea-products-showcase__image-placeholder thea-products-showcase__image-placeholder--teal" aria-hidden="true" />
              )}
            </div>
            <div className="thea-products-showcase__body">
              <h3>{equipment.title}</h3>
              <p>{equipment.description}</p>
              <Link href={equipmentHref} className="thea-products-showcase__button-link">
                {equipment.buttonLabel}
              </Link>
            </div>
          </article>

          <article id="surgical" className="thea-products-showcase__card thea-products-showcase__card--surgical">
            <div className="thea-products-showcase__media">
              {surgical.image ? (
                <img src={surgical.image} alt="" className="thea-products-showcase__image" />
              ) : (
                <div className="thea-products-showcase__image-placeholder" aria-hidden="true" />
              )}
            </div>
            <div className="thea-products-showcase__body">
              <h3>{surgical.title}</h3>
              <p>{surgical.description}</p>
            </div>
          </article>

          <article id="consumables" className="thea-products-showcase__card thea-products-showcase__card--consumables">
            <div className="thea-products-showcase__media">
              {consumables.image ? (
                <img src={consumables.image} alt="" className="thea-products-showcase__image" />
              ) : (
                <div className="thea-products-showcase__image-placeholder" aria-hidden="true" />
              )}
            </div>
            <div className="thea-products-showcase__body">
              <h3>{consumables.title}</h3>
              <p>{consumables.description}</p>
              <Link href={consumablesHref} className="thea-products-showcase__link">
                {consumables.linkLabel} <ArrowIcon className="thea-products-showcase__link-icon" />
              </Link>
            </div>
          </article>
        </div>

        <article className="thea-products-showcase__banner">
          <div className="thea-products-showcase__banner-media">
            {secondaryBanner.image ? (
              <img src={secondaryBanner.image} alt="" className="thea-products-showcase__image" />
            ) : (
              <div className="thea-products-showcase__image-placeholder thea-products-showcase__image-placeholder--navy" aria-hidden="true" />
            )}
          </div>
          <div className="thea-products-showcase__banner-body">
            <h3>{secondaryBanner.title}</h3>
            <p>{secondaryBanner.description}</p>
            <div className="thea-products-showcase__tags">
              {secondaryBanner.tags.map((tag) => (
                <span key={tag} className="thea-products-showcase__tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        <section className="thea-products-showcase__quality" aria-label="Quality assurance">
          <div className="thea-products-showcase__quality-copy">
            <h3>{quality.title}</h3>
            <p>{quality.description}</p>
          </div>
          <div className="thea-products-showcase__quality-certs">
            {quality.certifications.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
