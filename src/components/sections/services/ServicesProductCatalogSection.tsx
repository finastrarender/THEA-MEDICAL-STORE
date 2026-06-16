import type { z } from "zod";
import type { servicesProductCatalogDataSchema } from "@/schemas/sections";
import { theaServicesProductCatalogDefaults } from "@/data/thea-services-sections";
import { theaPharmaceuticalMedicinesCatalogDefaults } from "@/data/thea-products-sections";

type Content = z.infer<typeof servicesProductCatalogDataSchema>;

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
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ServicesProductCatalogSection({ content }: { content: Content }) {
  const title = content.title?.trim() || theaServicesProductCatalogDefaults.title;
  const description =
    content.description?.trim() || theaServicesProductCatalogDefaults.description;
  const filters =
    content.filters?.length > 0
      ? content.filters
      : theaServicesProductCatalogDefaults.filters;
  const products =
    content.products?.length > 0
      ? content.products
      : theaPharmaceuticalMedicinesCatalogDefaults.products.some(p => filters.some(f => f.id === p.filterId))
        ? theaPharmaceuticalMedicinesCatalogDefaults.products 
        : theaServicesProductCatalogDefaults.products;

  const defaultFilterId =
    filters.find((f) => f.id === "all")?.id ?? filters[0]?.id ?? "all";

  const primaryFilters = filters.filter((f) => f.id !== "consumables");
  const secondaryFilters = filters.filter((f) => f.id === "consumables");

  const filterCss = filters
    .filter((f) => f.id !== "all")
    .map(
      (f) =>
        `.cx-site .thea-services-catalog:has(#thea-catalog-filter-${f.id}:checked) .thea-services-catalog__card:not([data-filter-id="${f.id}"]) { display: none; }`,
    )
    .join("\n");

  function renderFilter(filter: (typeof filters)[number]) {
    return (
      <span key={filter.id} className="thea-services-catalog__filter-wrap">
        <input
          type="radio"
          name="thea-catalog-filter"
          id={`thea-catalog-filter-${filter.id}`}
          className="thea-services-catalog__filter-input"
          defaultChecked={filter.id === defaultFilterId}
          suppressHydrationWarning
        />
        <label
          htmlFor={`thea-catalog-filter-${filter.id}`}
          className="thea-services-catalog__filter"
          role="tab"
          suppressHydrationWarning
        >
          {filter.label}
        </label>
      </span>
    );
  }

  return (
    <section className="thea-services-catalog">
      {filterCss ? <style dangerouslySetInnerHTML={{ __html: filterCss }} /> : null}
      <div className="thea-services-catalog__shell">
        <header className="thea-services-catalog__header">
          <div className="thea-services-catalog__intro">
            <h2 className="thea-services-catalog__title">{title}</h2>
            <p className="thea-services-catalog__description">{description}</p>
          </div>
          <div
            className="thea-services-catalog__filters"
            role="tablist"
            aria-label="Product categories"
          >
            <div className="thea-services-catalog__filters-row">
              {primaryFilters.map((filter) => renderFilter(filter))}
            </div>
            {secondaryFilters.length > 0 ? (
              <div className="thea-services-catalog__filters-row thea-services-catalog__filters-row--secondary">
                {secondaryFilters.map((filter) => renderFilter(filter))}
              </div>
            ) : null}
          </div>
        </header>

        <div className="thea-services-catalog__grid">
          {products.map((product) => {
            const defaultProduct =
              theaServicesProductCatalogDefaults.products.find((p) => p.title === product.title) ||
              theaPharmaceuticalMedicinesCatalogDefaults.products.find((p) => p.title === product.title);
            const image = product.image?.trim() || defaultProduct?.image || "";
            const href = product.href?.trim();
            const filterId = product.filterId || "all";

            const media = (
              <div className="thea-services-catalog__media">
                {image ? (
                  <img
                    className="thea-services-catalog__image"
                    src={image}
                    alt={product.title}
                    width={320}
                    height={320}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="thea-services-catalog__image-placeholder" aria-hidden="true" />
                )}
              </div>
            );
            const meta = (
              <div className="thea-services-catalog__meta">
                <div className="thea-services-catalog__meta-text">
                  <h3 className="thea-services-catalog__product-title">{product.title}</h3>
                  <p className="thea-services-catalog__product-category">{product.category}</p>
                </div>
                <ArrowIcon className="thea-services-catalog__arrow" />
              </div>
            );

            if (href) {
              return (
                <a
                  key={product.title}
                  href={href}
                  className="thea-services-catalog__card thea-services-catalog__card--link"
                  data-filter-id={filterId}
                >
                  {media}
                  {meta}
                </a>
              );
            }

            return (
              <article
                key={product.title}
                className="thea-services-catalog__card"
                data-filter-id={filterId}
              >
                {media}
                {meta}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
