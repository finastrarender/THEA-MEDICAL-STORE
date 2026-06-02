import Link from "next/link";
import type { z } from "zod";
import type { productsFooterDataSchema } from "@/schemas/sections";
import { theaProductsFooterDefaults } from "@/data/thea-products-sections";

type Content = z.infer<typeof productsFooterDataSchema>;

export default function ProductsFooterSection({ content }: { content: Content }) {
  const brand = content.brand?.trim() || theaProductsFooterDefaults.brand;
  const copyright =
    content.copyright?.trim() || theaProductsFooterDefaults.copyright;
  const links =
    content.links?.length > 0 ? content.links : theaProductsFooterDefaults.links;

  return (
    <footer className="thea-products-footer" aria-label="Products page footer">
      <div className="thea-products-footer__shell">
        <div className="thea-products-footer__brand-wrap">
          <p className="thea-products-footer__brand">{brand}</p>
          <p className="thea-products-footer__copyright">{copyright}</p>
        </div>
        <nav className="thea-products-footer__nav" aria-label="Legal links">
          {links.map((item) => (
            <Link key={`${item.label}-${item.href}`} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
