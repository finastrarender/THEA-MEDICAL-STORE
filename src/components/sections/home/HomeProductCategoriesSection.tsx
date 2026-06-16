import type { z } from "zod";
import type { homeProductCategoriesDataSchema } from "@/schemas/sections";

type HomeProductCategoriesContent = z.infer<typeof homeProductCategoriesDataSchema>;

type CategoryItem = HomeProductCategoriesContent["categories"][number];

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    layout: "tall",
    title: "Pharmaceutical Medicines",
    description: "Comprehensive range of prescription and OTC medications.",
    image: "",
    theme: "pharma",
  },
  {
    layout: "wide",
    title: "Medical Equipment",
    description: "Diagnostic, monitoring, and therapeutic devices.",
    image: "",
    theme: "equipment",
  },
  {
    layout: "small",
    title: "Surgical Supplies",
    description: "",
    image: "",
    theme: "surgical",
  },
  {
    layout: "small",
    title: "Medical Consumables",
    description: "",
    image: "",
    theme: "consumables",
  },
];

function CategoryCard({ category }: { category: CategoryItem }) {
  const layout = category.layout || "small";
  const theme = category.theme || "pharma";
  const hasDescription = Boolean(category.description?.trim());

  return (
    <article
      className={`thea-products__card thea-products__card--${layout} thea-products__card--${theme}`}
    >
      {category.image?.trim() ? (
        <img
          className="thea-products__card-image"
          src={category.image}
          alt={category.title}
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <div className="thea-products__card-overlay">
        <h3 className="thea-products__card-title">{category.title}</h3>
        {hasDescription ? (
          <p className="thea-products__card-desc">{category.description}</p>
        ) : null}
      </div>
    </article>
  );
}

export default function HomeProductCategoriesSection({
  content,
  anchorId,
}: {
  content: HomeProductCategoriesContent;
  anchorId?: string;
}) {
  const title = content.title?.trim() || "Product Categories";
  const categories =
    content.categories && content.categories.length >= 4
      ? content.categories.slice(0, 4)
      : DEFAULT_CATEGORIES;

  const tall = categories.find((c) => c.layout === "tall") ?? categories[0];
  const wide = categories.find((c) => c.layout === "wide") ?? categories[1];
  const smallCards = categories.filter((c) => c.layout === "small");
  const bottomLeft = smallCards[0] ?? categories[2];
  const bottomRight = smallCards[1] ?? categories[3];

  return (
    <section className="thea-products" id={anchorId ?? undefined}>
      <div className="thea-products__shell">
        <h2 className="thea-products__title">{title}</h2>

        <div className="thea-products__grid">
          <div className="thea-products__col thea-products__col--tall">
            <CategoryCard category={tall} />
          </div>
          <div className="thea-products__col thea-products__col--stack">
            <CategoryCard category={wide} />
            <div className="thea-products__row">
              <CategoryCard category={bottomLeft} />
              <CategoryCard category={bottomRight} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
