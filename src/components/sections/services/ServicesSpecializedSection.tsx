import type { z } from "zod";
import type { servicesSpecializedDataSchema } from "@/schemas/sections";
import { theaServicesSpecializedDefaults } from "@/data/thea-services-sections";
import ServicesCapabilityIcon from "./ServicesCapabilityIcon";

type Content = z.infer<typeof servicesSpecializedDataSchema>;
type Tile = Content["tiles"][number];

const DEFAULT_BRAND_LOGO = "/home/headerLogo.svg";

function normalizeAssetPath(url: string) {
  return url.split("?")[0]?.split("#")[0] ?? url;
}

function isDefaultBrandLogo(url: string) {
  return normalizeAssetPath(url) === DEFAULT_BRAND_LOGO;
}

function resolveTile(tiles: Tile[], variant: Tile["variant"]): Tile {
  return (
    tiles.find((t) => t.variant === variant) ??
    theaServicesSpecializedDefaults.tiles.find((t) => t.variant === variant)!
  );
}

function StatTile({ tile }: { tile: Tile }) {
  if (tile.variant !== "stat") return null;
  return (
    <article className="thea-services-specialized__tile thea-services-specialized__tile--stat">
      <ServicesCapabilityIcon
        name={tile.icon || "microscope"}
        className="thea-services-specialized__tile-icon thea-services-specialized__tile-icon--green"
      />
      <p className="thea-services-specialized__stat-value">{tile.value}</p>
      <p className="thea-services-specialized__stat-label">{tile.label}</p>
    </article>
  );
}

function ImageTile({ tile }: { tile: Tile }) {
  if (tile.variant !== "image") return null;
  const image =
    tile.image?.trim() ||
    (theaServicesSpecializedDefaults.tiles.find((t) => t.variant === "image")?.image ?? "");
  return (
    <article className="thea-services-specialized__tile thea-services-specialized__tile--image">
      {image ? (
        <img
          className="thea-services-specialized__tile-photo"
          src={image}
          alt="Laboratory test tubes and clinical samples"
          width={400}
          height={520}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="thea-services-specialized__tile-photo-placeholder" aria-hidden="true" />
      )}
    </article>
  );
}

function BrandTile({ tile }: { tile: Tile }) {
  if (tile.variant !== "brand") return null;
  const image =
    tile.image?.trim() ||
    (theaServicesSpecializedDefaults.tiles.find((t) => t.variant === "brand")?.image ?? "");
  const useCustomBrandArt = image ? !isDefaultBrandLogo(image) : false;
  const brandAlt = tile.brandLine?.trim()
    ? `${tile.brandLine.trim()} logo`
    : "THEA Medical Store logo";

  if (useCustomBrandArt) {
    return (
      <article
        className="thea-services-specialized__tile thea-services-specialized__tile--brand thea-services-specialized__tile--brand-art"
      >
        <img
          className="thea-services-specialized__tile-photo"
          src={image}
          alt={brandAlt}
          width={400}
          height={520}
          loading="lazy"
          decoding="async"
        />
      </article>
    );
  }

  return (
    <article className="thea-services-specialized__tile thea-services-specialized__tile--brand">
      {image ? (
        <img
          className="thea-services-specialized__brand-logo thea-services-specialized__brand-logo--mono"
          src={image}
          alt={brandAlt}
          width={80}
          height={80}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="thea-services-specialized__brand-mark" aria-hidden="true" />
      )}
      {tile.brandLine ? (
        <p className="thea-services-specialized__brand-line">{tile.brandLine}</p>
      ) : null}
      {tile.brandSub ? (
        <p className="thea-services-specialized__brand-sub">{tile.brandSub}</p>
      ) : null}
    </article>
  );
}

function ProductTile({ tile }: { tile: Tile }) {
  if (tile.variant !== "product") return null;
  return (
    <article className="thea-services-specialized__tile thea-services-specialized__tile--product">
      <ServicesCapabilityIcon
        name={tile.icon || "robotArm"}
        className="thea-services-specialized__tile-icon thea-services-specialized__tile-icon--white"
      />
      <p className="thea-services-specialized__product-title">{tile.title}</p>
      <p className="thea-services-specialized__product-label">{tile.label}</p>
    </article>
  );
}

export default function ServicesSpecializedSection({ content }: { content: Content }) {
  const title = content.title?.trim() || theaServicesSpecializedDefaults.title;
  const items =
    content.items?.length > 0 ? content.items : theaServicesSpecializedDefaults.items;
  const tiles =
    content.tiles?.length === 4 ? content.tiles : theaServicesSpecializedDefaults.tiles;

  const statTile = resolveTile(tiles, "stat");
  const imageTile = resolveTile(tiles, "image");
  const brandTile = resolveTile(tiles, "brand");
  const productTile = resolveTile(tiles, "product");

  return (
    <section className="thea-services-specialized">
      <div className="thea-services-specialized__shell">
        <div className="thea-services-specialized__inner">
          <div className="thea-services-specialized__copy">
            <h2 className="thea-services-specialized__title">{title}</h2>
            <div className="thea-services-specialized__list">
              {items.map((item) => (
                <div
                  key={item.title}
                  className={`thea-services-specialized__item thea-services-specialized__item--${item.accent}`}
                >
                  <h3 className="thea-services-specialized__item-title">{item.title}</h3>
                  <p className="thea-services-specialized__item-text">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="thea-services-specialized__grid">
            <div className="thea-services-specialized__col thea-services-specialized__col--short-tall">
              <StatTile tile={statTile} />
              <ImageTile tile={imageTile} />
            </div>
            <div className="thea-services-specialized__col thea-services-specialized__col--tall-short">
              <BrandTile tile={brandTile} />
              <ProductTile tile={productTile} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
