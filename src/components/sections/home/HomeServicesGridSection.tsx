import type { z } from "zod";
import type { homeServicesGridDataSchema } from "@/schemas/sections";
import HomeServiceIcon from "./HomeServiceIcon";

type HomeServicesGridContent = z.infer<typeof homeServicesGridDataSchema>;

const DEFAULT_ITEMS = [
  {
    icon: "drugStore",
    title: "Drug Store",
    description:
      "Licensed distribution and storage of pharmaceutical medicines with strict temperature control protocols.",
  },
  {
    icon: "equipmentTrading",
    title: "Used Medical Equipment Trading",
    description:
      "Quality-vetted pre-owned medical equipment offering cost-effective solutions without compromising safety.",
  },
  {
    icon: "equipmentRental",
    title: "Medical Equipment Rental",
    description:
      "Flexible leasing options for short-term and long-term medical equipment requirements.",
  },
  {
    icon: "paraPharma",
    title: "Para Pharmaceutical Products",
    description:
      "Supply of hygiene, cosmetic, and nutritional products supporting comprehensive patient wellness.",
  },
  {
    icon: "surgical",
    title: "Surgical Articles Trading",
    description:
      "Specialized trade in sterile surgical tools, sutures, and operating room essentials.",
  },
  {
    icon: "management",
    title: "Equipment Management",
    description:
      "End-to-end operation and maintenance of complex medical machinery and clinical assets.",
  },
];

export default function HomeServicesGridSection({
  content,
  anchorId,
}: {
  content: HomeServicesGridContent;
  anchorId?: string;
}) {
  const title = content.title?.trim() || "Specialized Healthcare Services";
  const description =
    content.description?.trim() ||
    "Comprehensive operational and logistical support for modern medical facilities.";
  const items =
    content.items && content.items.length > 0 ? content.items : DEFAULT_ITEMS;

  return (
    <section className="thea-services" id={anchorId ?? undefined}>
      <div className="thea-services__shell">
        <header className="thea-services__header">
          <h2 className="thea-services__title">{title}</h2>
          <p className="thea-services__subtitle">{description}</p>
        </header>

        <div className="thea-services__grid">
          {items.map((item, index) => (
            <article key={`${item.title}-${index}`} className="thea-services__card">
              <span className="thea-services__icon" aria-hidden="true">
                <HomeServiceIcon name={item.icon || "drugStore"} className="thea-services__icon-svg" />
              </span>
              <h3 className="thea-services__card-title">{item.title}</h3>
              <p className="thea-services__card-text">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
