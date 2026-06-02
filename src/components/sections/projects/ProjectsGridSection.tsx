import type { z } from "zod";
import type { projectsGridDataSchema } from "@/schemas/sections";

type ProjectsGridContent = z.infer<typeof projectsGridDataSchema>;

const DEFAULT_ITEMS = [
  {
    category: "Real Estate",
    title: "RAK Waterfront Series",
    image: "/projects/rak-waterfront.jpg",
  },
  {
    category: "Protocol",
    title: "Ledger Identity V.2",
    image: "/projects/ledger-identity.jpg",
  },
  {
    category: "Finance",
    title: "Sovereign Debt Tokens",
    image: "/projects/sovereign-debt.jpg",
  },
  {
    category: "Logistics",
    title: "Supply Chain Registry",
    image: "/projects/supply-chain.jpg",
  },
  {
    category: "Governance",
    title: "Citizen DAO Protocol",
    image: "/projects/citizen-dao.jpg",
  },
  {
    category: "Luxury",
    title: "Heritage Asset Vault",
    image: "/projects/heritage-vault.jpg",
  },
];

export default function ProjectsGridSection({ content }: { content?: ProjectsGridContent }) {
  const items =
    content?.items && content.items.length > 0 ? content.items : DEFAULT_ITEMS;

  return (
    <section className="cx-projects-grid" aria-label="Project portfolio">
      <ul className="cx-projects-grid__list">
        {items.map((item) => (
          <li key={`${item.category}-${item.title}`} className="cx-projects-grid__item">
            <div className="cx-projects-grid__media">
              <img
                src={item.image}
                alt=""
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="cx-projects-grid__caption">
              <p className="cx-projects-grid__category">{item.category}</p>
              <h2 className="cx-projects-grid__title">{item.title}</h2>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
