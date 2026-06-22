"use client";

import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import CharacterCount from "@/components/admin/CharacterCount";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";
import TheaHomeIconPicker from "@/components/admin/TheaHomeIconPicker";
import ServicesCapabilityIcon from "@/components/sections/services/ServicesCapabilityIcon";
import {
  THEA_SERVICES_CAPABILITY_ICONS,
  THEA_SERVICES_TILE_ICONS,
} from "@/data/thea-services-icon-options";
import {
  theaServicesCapabilityCardsDefaults,
  theaServicesPageHeroDefaults,
  theaServicesProductCatalogDefaults,
  theaServicesRegulatoryDefaults,
  theaServicesSpecializedDefaults,
  theaServicesFooterDefaults,
} from "@/data/thea-services-sections";
import {
  theaProductsCatalogShowcaseDefaults,
  theaProductsFooterDefaults,
  theaPharmaceuticalMedicinesCatalogDefaults,
} from "@/data/thea-products-sections";
import {
  servicesHeroLimits,
  servicesCapabilityLimits,
  servicesSpecializedLimits,
  servicesProductCatalogLimits,
  servicesRegulatoryLimits,
  servicesFooterLimits,
  productsCatalogShowcaseLimits,
  productsFooterLimits,
} from "@/lib/seeded-lengths";

type SectionFormProps = {
  section: { id: string; type: string; order: number; data: Record<string, unknown> };
  onSave: (data: Record<string, unknown>) => void;
  previewHref: string;
  saveMessage?: string | null;
  saveMessageTone?: "success" | "error";
};

const ACCENT_OPTIONS = ["teal", "blue"] as const;
function SectionHeading({ section }: { section: SectionFormProps["section"] }) {
  return (
    <h3>
      {section.type}{" "}
      <span className="admin-muted" style={{ fontWeight: 400 }}>
        (order {section.order}, id {section.id})
      </span>
    </h3>
  );
}

export function ServicesPageHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      badge: (section.data.badge as string) ?? theaServicesPageHeroDefaults.badge,
      title: (section.data.title as string) ?? theaServicesPageHeroDefaults.title,
      description:
        (section.data.description as string) ?? theaServicesPageHeroDefaults.description,
    }),
    [section.data],
  );

  const { register, watch, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues });

  const badge = watch("badge");
  const title = watch("title");
  const description = watch("description");
  const limits = useMemo(() => ({
    badge: Math.max(servicesHeroLimits.badge, defaultValues.badge.length),
    title: Math.max(servicesHeroLimits.title, defaultValues.title.length),
    description: Math.max(servicesHeroLimits.description, defaultValues.description.length),
  }), [defaultValues]);

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Badge
          <CharacterCount current={badge.length} max={limits.badge} />
        </div>
        <input
          {...register("badge", {
            required: true,
            maxLength: limits.badge,
          })}
          maxLength={limits.badge}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title
          <CharacterCount current={title.length} max={limits.title} />
        </div>
        <input
          {...register("title", {
            required: true,
            maxLength: limits.title,
          })}
          maxLength={limits.title}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description
          <CharacterCount current={description.length} max={limits.description} />
        </div>
        <textarea
          rows={3}
          {...register("description", {
            required: true,
            maxLength: limits.description,
          })}
          maxLength={limits.description}
        />
      </label>
      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

export function ServicesCapabilityCardsSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      cards:
        ((section.data.cards as typeof theaServicesCapabilityCardsDefaults.cards) ?? [])
          .length > 0
          ? (section.data.cards as typeof theaServicesCapabilityCardsDefaults.cards)
          : theaServicesCapabilityCardsDefaults.cards,
    }),
    [section.data],
  );

  const { register, control, setValue, watch, handleSubmit, formState: { isSubmitting } } =
    useForm({ defaultValues });

  const limits = useMemo(() => ({
    cardTitle: Math.max(servicesCapabilityLimits.cardTitle, defaultValues.cards.reduce((max, c) => Math.max(max, c.title.length), 0)),
    cardDescription: Math.max(servicesCapabilityLimits.cardDescription, defaultValues.cards.reduce((max, c) => Math.max(max, c.description.length), 0)),
  }), [defaultValues]);

  const { fields, append, remove } = useFieldArray({ control, name: "cards" });
  const cards = watch("cards");

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />
      <h4>Service cards</h4>
      {fields.map((field, cardIndex) => (
        <div key={field.id} className="admin-field-group" style={{ marginBottom: 20 }}>
          <input type="hidden" {...register(`cards.${cardIndex}.icon` as const)} />
          <label>
            <span className="admin-field-label">Icon</span>
            <TheaHomeIconPicker
              value={cards?.[cardIndex]?.icon}
              onChange={(icon) =>
                setValue(`cards.${cardIndex}.icon`, icon, { shouldDirty: true })
              }
              options={THEA_SERVICES_CAPABILITY_ICONS}
              fallbackKey="pill"
              renderIcon={(name, className) => (
                <ServicesCapabilityIcon name={name} className={className} />
              )}
            />
          </label>
          <label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              Title
              <CharacterCount
                current={(watch(`cards.${cardIndex}.title`) ?? "").length}
                max={limits.cardTitle}
              />
            </div>
            <input
              {...register(`cards.${cardIndex}.title` as const, {
                required: true,
                maxLength: limits.cardTitle,
              })}
              maxLength={limits.cardTitle}
            />
          </label>
          <label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              Description
              <CharacterCount
                current={(watch(`cards.${cardIndex}.description`) ?? "").length}
                max={limits.cardDescription}
              />
            </div>
            <textarea
              rows={3}
              {...register(`cards.${cardIndex}.description` as const, {
                required: true,
                maxLength: limits.cardDescription,
              })}
              maxLength={limits.cardDescription}
            />
          </label>
          <input type="hidden" {...register(`cards.${cardIndex}.image` as const)} />
          <ImageUploadField
            label="Card image"
            value={cards?.[cardIndex]?.image ?? ""}
            onChange={(value) =>
              setValue(`cards.${cardIndex}.image`, value, { shouldDirty: true })
            }
            folder={`sections/${section.type}`}
            placeholder="Upload card photo"
            minWidth={600}
            minHeight={400}
            aspectRatio={1.5}
          />
          <p className="admin-muted">Features (one per line in list below)</p>
          {(cards?.[cardIndex]?.features ?? []).map((_, featureIndex) => (
            <label key={`${field.id}-f-${featureIndex}`}>
              Feature {featureIndex + 1}
              <input
                {...register(`cards.${cardIndex}.features.${featureIndex}` as const, {
                  required: true,
                })}
              />
            </label>
          ))}
          <button
            type="button"
            onClick={() => {
              const next = [...(cards?.[cardIndex]?.features ?? []), ""];
              setValue(`cards.${cardIndex}.features`, next, { shouldDirty: true });
            }}
          >
            Add feature
          </button>
          {fields.length > 1 ? (
            <button type="button" onClick={() => remove(cardIndex)}>
              Remove card
            </button>
          ) : null}
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          append({
            icon: "pill",
            title: "",
            description: "",
            image: "",
            features: ["", ""],
          })
        }
        style={{ marginBottom: 16 }}
      >
        Add card
      </button>
      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

export function ServicesSpecializedSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? theaServicesSpecializedDefaults.title,
      items:
        ((section.data.items as typeof theaServicesSpecializedDefaults.items) ?? []).length > 0
          ? (section.data.items as typeof theaServicesSpecializedDefaults.items)
          : theaServicesSpecializedDefaults.items,
      tiles:
        ((section.data.tiles as typeof theaServicesSpecializedDefaults.tiles) ?? []).length === 4
          ? (section.data.tiles as typeof theaServicesSpecializedDefaults.tiles)
          : theaServicesSpecializedDefaults.tiles,
    }),
    [section.data],
  );

  const { register, control, setValue, watch, handleSubmit, formState: { isSubmitting } } =
    useForm({ defaultValues });

  const title = watch("title") ?? "";
  const limits = useMemo(() => ({
    title: Math.max(servicesSpecializedLimits.title, defaultValues.title.length),
    itemTitle: Math.max(servicesSpecializedLimits.itemTitle, defaultValues.items.reduce((max, i) => Math.max(max, i.title.length), 0)),
    itemDescription: Math.max(servicesSpecializedLimits.itemDescription, defaultValues.items.reduce((max, i) => Math.max(max, i.description.length), 0)),
    tileValue: Math.max(servicesSpecializedLimits.tileValue, defaultValues.tiles.reduce((max, t) => Math.max(max, (t.value ?? "").length), 0)),
    tileLabel: Math.max(servicesSpecializedLimits.tileLabel, defaultValues.tiles.reduce((max, t) => Math.max(max, (t.label ?? "").length), 0)),
    tileTitle: Math.max(servicesSpecializedLimits.tileTitle, defaultValues.tiles.reduce((max, t) => Math.max(max, (t.title ?? "").length), 0)),
    tileBrandLine: Math.max(servicesSpecializedLimits.tileBrandLine, defaultValues.tiles.reduce((max, t) => Math.max(max, (t.brandLine ?? "").length), 0)),
    tileBrandSub: Math.max(servicesSpecializedLimits.tileBrandSub, defaultValues.tiles.reduce((max, t) => Math.max(max, (t.brandSub ?? "").length), 0)),
  }), [defaultValues]);

  const { fields: itemFields } = useFieldArray({ control, name: "items" });
  const tiles = watch("tiles");

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Section title
          <CharacterCount current={title.length} max={limits.title} />
        </div>
        <input
          {...register("title", {
            required: true,
            maxLength: limits.title,
          })}
          maxLength={limits.title}
        />
      </label>

      <h4>Text blocks</h4>
      {itemFields.map((field, index) => (
        <div key={field.id} className="admin-field-group">
          <label>
            Accent
            <select {...register(`items.${index}.accent` as const)}>
              {ACCENT_OPTIONS.map((accent) => (
                <option key={accent} value={accent}>
                  {accent}
                </option>
              ))}
            </select>
          </label>
          <label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              Title
              <CharacterCount
                current={(watch(`items.${index}.title`) ?? "").length}
                max={limits.itemTitle}
              />
            </div>
            <input
              {...register(`items.${index}.title` as const, {
                required: true,
                maxLength: limits.itemTitle,
              })}
              maxLength={limits.itemTitle}
            />
          </label>
          <label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              Description
              <CharacterCount
                current={(watch(`items.${index}.description`) ?? "").length}
                max={limits.itemDescription}
              />
            </div>
            <textarea
              rows={2}
              {...register(`items.${index}.description` as const, {
                required: true,
                maxLength: limits.itemDescription,
              })}
              maxLength={limits.itemDescription}
            />
          </label>
        </div>
      ))}

      <h4>Grid tiles (4 required)</h4>
      {tiles?.map((tile, index) => (
        <div key={`tile-${index}`} className="admin-field-group">
          <p className="admin-muted">Tile {index + 1}</p>
          <input type="hidden" {...register(`tiles.${index}.variant` as const)} />
          <p>
            <strong>Variant:</strong> {tile.variant}
          </p>
          {tile.variant === "stat" || tile.variant === "product" ? (
            <>
              <input type="hidden" {...register(`tiles.${index}.icon` as const)} />
              <label>
                <span className="admin-field-label">Icon</span>
                <TheaHomeIconPicker
                  value={tiles[index]?.icon}
                  onChange={(icon) =>
                    setValue(`tiles.${index}.icon`, icon, { shouldDirty: true })
                  }
                  options={THEA_SERVICES_TILE_ICONS}
                  fallbackKey="microscope"
                  renderIcon={(name, className) => (
                    <ServicesCapabilityIcon name={name} className={className} />
                  )}
                />
              </label>
            </>
          ) : null}
          {tile.variant === "stat" ? (
            <>
              <label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  Value
                  <CharacterCount current={(watch(`tiles.${index}.value`) ?? "").length} max={limits.tileValue} />
                </div>
                <input
                  {...register(`tiles.${index}.value` as const, { maxLength: limits.tileValue })}
                  maxLength={limits.tileValue}
                />
              </label>
              <label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  Label
                  <CharacterCount current={(watch(`tiles.${index}.label`) ?? "").length} max={limits.tileLabel} />
                </div>
                <input
                  {...register(`tiles.${index}.label` as const, { maxLength: limits.tileLabel })}
                  maxLength={limits.tileLabel}
                />
              </label>
            </>
          ) : null}
          {tile.variant === "product" ? (
            <>
              <label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  Title
                  <CharacterCount current={(watch(`tiles.${index}.title`) ?? "").length} max={limits.tileTitle} />
                </div>
                <input
                  {...register(`tiles.${index}.title` as const, { maxLength: limits.tileTitle })}
                  maxLength={limits.tileTitle}
                />
              </label>
              <label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  Label
                  <CharacterCount current={(watch(`tiles.${index}.label`) ?? "").length} max={limits.tileLabel} />
                </div>
                <input
                  {...register(`tiles.${index}.label` as const, { maxLength: limits.tileLabel })}
                  maxLength={limits.tileLabel}
                />
              </label>
            </>
          ) : null}
          {tile.variant === "image" || tile.variant === "brand" ? (
            <>
              <input type="hidden" {...register(`tiles.${index}.image` as const)} />
              <ImageUploadField
                label={tile.variant === "image" ? "Photo" : "Logo"}
                value={tiles[index]?.image ?? ""}
                onChange={(value) =>
                  setValue(`tiles.${index}.image`, value, { shouldDirty: true })
                }
                folder={`sections/${section.type}`}
                allowedTypes={
                  tile.variant === "brand"
                    ? ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"]
                    : undefined
                }
              />
            </>
          ) : null}
          {tile.variant === "brand" ? (
            <>
              <label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  Brand line
                  <CharacterCount current={(watch(`tiles.${index}.brandLine`) ?? "").length} max={limits.tileBrandLine} />
                </div>
                <input
                  {...register(`tiles.${index}.brandLine` as const, { maxLength: limits.tileBrandLine })}
                  maxLength={limits.tileBrandLine}
                />
              </label>
              <label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  Brand subtext
                  <CharacterCount current={(watch(`tiles.${index}.brandSub`) ?? "").length} max={limits.tileBrandSub} />
                </div>
                <input
                  {...register(`tiles.${index}.brandSub` as const, { maxLength: limits.tileBrandSub })}
                  maxLength={limits.tileBrandSub}
                />
              </label>
            </>
          ) : null}
        </div>
      ))}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

export function ServicesProductCatalogSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => {
      const dataProducts = (section.data.products as any[]) ?? [];
      const isPharma = dataProducts.some((p) =>
        theaPharmaceuticalMedicinesCatalogDefaults.products.some((dp) => dp.title === p.title)
      );

      const productsDefault = isPharma
        ? theaPharmaceuticalMedicinesCatalogDefaults.products
        : theaServicesProductCatalogDefaults.products;

      const filtersDefault = isPharma
        ? theaPharmaceuticalMedicinesCatalogDefaults.filters
        : theaServicesProductCatalogDefaults.filters;

      const titleDefault = isPharma
        ? theaPharmaceuticalMedicinesCatalogDefaults.title
        : theaServicesProductCatalogDefaults.title;

      const descDefault = isPharma
        ? theaPharmaceuticalMedicinesCatalogDefaults.description
        : theaServicesProductCatalogDefaults.description;

      return {
        title: (section.data.title as string) ?? titleDefault,
        description: (section.data.description as string) ?? descDefault,
        filters:
          ((section.data.filters as typeof theaServicesProductCatalogDefaults.filters) ?? [])
            .length > 0
            ? (section.data.filters as typeof theaServicesProductCatalogDefaults.filters)
            : filtersDefault,
        products: dataProducts.length > 0 ? dataProducts : productsDefault,
      };
    },
    [section.data],
  );

  const { register, control, setValue, watch, handleSubmit, formState: { isSubmitting } } =
    useForm({ defaultValues });

  const title = watch("title") ?? "";
  const description = watch("description") ?? "";
  const limits = useMemo(() => ({
    title: Math.max(servicesProductCatalogLimits.title, (defaultValues.title as string).length),
    description: Math.max(servicesProductCatalogLimits.description, (defaultValues.description as string).length),
  }), [defaultValues]);

  const { fields: filterFields, append: appendFilter, remove: removeFilter } = useFieldArray({
    control,
    name: "filters",
  });
  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
    control,
    name: "products",
  });
  const filters = watch("filters");
  const products = watch("products");

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title
          <CharacterCount current={title.length} max={limits.title} />
        </div>
        <input
          {...register("title", {
            required: true,
            maxLength: limits.title,
          })}
          maxLength={limits.title}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description
          <CharacterCount current={description.length} max={limits.description} />
        </div>
        <textarea
          rows={2}
          {...register("description", {
            required: true,
            maxLength: limits.description,
          })}
          maxLength={limits.description}
        />
      </label>

      <h4>Category filters</h4>
      {filterFields.map((field, index) => (
        <div key={field.id} className="admin-field-group">
          <label>
            Filter ID (e.g. all, diagnostics)
            <input {...register(`filters.${index}.id` as const, { required: true })} />
          </label>
          <label>
            Label
            <input {...register(`filters.${index}.label` as const, { required: true })} />
          </label>
          {filterFields.length > 1 ? (
            <button type="button" onClick={() => removeFilter(index)}>
              Remove filter
            </button>
          ) : null}
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendFilter({ id: "", label: "" })}
        style={{ marginBottom: 16 }}
      >
        Add filter
      </button>

      <h4>Products</h4>
      {productFields.map((field, index) => (
        <div key={field.id} className="admin-field-group" style={{ marginBottom: 20 }}>
          <label>
            Title
            <input {...register(`products.${index}.title` as const, { required: true })} />
          </label>
          <label>
            Category label
            <input {...register(`products.${index}.category` as const, { required: true })} />
          </label>
          <label>
            Filter (matches filter ID)
            <select {...register(`products.${index}.filterId` as const)}>
              {(filters ?? []).map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label} ({f.id})
                </option>
              ))}
            </select>
          </label>
          <label>
            Link (optional)
            <input {...register(`products.${index}.href` as const)} placeholder="/products/..." />
          </label>
          <input type="hidden" {...register(`products.${index}.image` as const)} />
          <ImageUploadField
            label="Product image"
            value={products?.[index]?.image ?? ""}
            onChange={(value) =>
              setValue(`products.${index}.image`, value, { shouldDirty: true })
            }
            folder={`sections/${section.type}`}
          />
          <button type="button" onClick={() => removeProduct(index)}>
            Remove product
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          appendProduct({
            title: "",
            category: "",
            filterId: filters?.[0]?.id ?? "all",
            image: "",
            href: "",
          })
        }
        style={{ marginBottom: 16 }}
      >
        Add product
      </button>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

export function ServicesRegulatorySectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? theaServicesRegulatoryDefaults.title,
      description:
        (section.data.description as string) ?? theaServicesRegulatoryDefaults.description,
      tableTitle:
        (section.data.tableTitle as string) ?? theaServicesRegulatoryDefaults.tableTitle,
      certifications:
        ((section.data.certifications as typeof theaServicesRegulatoryDefaults.certifications) ??
          []).length > 0
          ? (section.data.certifications as typeof theaServicesRegulatoryDefaults.certifications)
          : theaServicesRegulatoryDefaults.certifications,
      standards:
        ((section.data.standards as typeof theaServicesRegulatoryDefaults.standards) ?? [])
          .length > 0
          ? (section.data.standards as typeof theaServicesRegulatoryDefaults.standards)
          : theaServicesRegulatoryDefaults.standards,
    }),
    [section.data],
  );

  const { register, control, watch, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
  });

  const title = watch("title") ?? "";
  const description = watch("description") ?? "";
  const tableTitle = watch("tableTitle") ?? "";
  const limits = useMemo(() => ({
    title: Math.max(servicesRegulatoryLimits.title, (defaultValues.title as string).length),
    description: Math.max(servicesRegulatoryLimits.description, (defaultValues.description as string).length),
    tableTitle: Math.max(servicesRegulatoryLimits.tableTitle, (defaultValues.tableTitle as string).length),
  }), [defaultValues]);

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control,
    name: "certifications",
  });
  const { fields: standardFields, append: appendStandard, remove: removeStandard } = useFieldArray({
    control,
    name: "standards",
  });

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title
          <CharacterCount current={title.length} max={limits.title} />
        </div>
        <input
          {...register("title", {
            required: true,
            maxLength: limits.title,
          })}
          maxLength={limits.title}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description
          <CharacterCount current={description.length} max={limits.description} />
        </div>
        <textarea
          rows={3}
          {...register("description", {
            required: true,
            maxLength: limits.description,
          })}
          maxLength={limits.description}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Table title
          <CharacterCount current={tableTitle.length} max={limits.tableTitle} />
        </div>
        <input
          {...register("tableTitle", {
            required: true,
            maxLength: limits.tableTitle,
          })}
          maxLength={limits.tableTitle}
        />
      </label>

      <h4>Certifications</h4>
      {certFields.map((field, index) => (
        <div key={field.id} className="admin-field-group">
          <label>
            Title
            <input {...register(`certifications.${index}.title` as const, { required: true })} />
          </label>
          <label>
            Subtitle
            <input {...register(`certifications.${index}.subtitle` as const, { required: true })} />
          </label>
          <button type="button" onClick={() => removeCert(index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendCert({ title: "", subtitle: "" })}
      >
        Add certification
      </button>

      <h4>Equipment standards</h4>
      {standardFields.map((field, index) => (
        <div key={field.id} className="admin-field-group">
          <label>
            Device category
            <input
              {...register(`standards.${index}.deviceCategory` as const, { required: true })}
            />
          </label>
          <label>
            Standard
            <input {...register(`standards.${index}.standard` as const, { required: true })} />
          </label>
          <label>
            Status
            <input {...register(`standards.${index}.status` as const, { required: true })} />
          </label>
          <button type="button" onClick={() => removeStandard(index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendStandard({ deviceCategory: "", standard: "", status: "VERIFIED" })}
        style={{ marginBottom: 16 }}
      >
        Add standard
      </button>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

export function ServicesFooterSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      brand: (section.data.brand as string) ?? theaServicesFooterDefaults.brand,
      description:
        (section.data.description as string) ?? theaServicesFooterDefaults.description,
      solutionsTitle:
        (section.data.solutionsTitle as string) ?? theaServicesFooterDefaults.solutionsTitle,
      solutionLinks:
        ((section.data.solutionLinks as any[]) ?? []).length > 0
          ? (section.data.solutionLinks as any[])
          : theaServicesFooterDefaults.solutionLinks,
      contactTitle:
        (section.data.contactTitle as string) ?? theaServicesFooterDefaults.contactTitle,
      phone: (section.data.phone as string) ?? theaServicesFooterDefaults.phone,
      email: (section.data.email as string) ?? theaServicesFooterDefaults.email,
      location: (section.data.location as string) ?? theaServicesFooterDefaults.location,
      newsletterTitle:
        (section.data.newsletterTitle as string) ?? theaServicesFooterDefaults.newsletterTitle,
      emailPlaceholder:
        (section.data.emailPlaceholder as string) ??
        theaServicesFooterDefaults.emailPlaceholder,
      subscribeLabel:
        (section.data.subscribeLabel as string) ?? theaServicesFooterDefaults.subscribeLabel,
      copyright: (section.data.copyright as string) ?? theaServicesFooterDefaults.copyright,
    }),
    [section.data],
  );

  const { register, control, watch, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
  });

  const limits = useMemo(() => ({
    brand: Math.max(servicesFooterLimits.brand, defaultValues.brand.length),
    description: Math.max(servicesFooterLimits.description, defaultValues.description.length),
    solutionsTitle: Math.max(servicesFooterLimits.solutionsTitle, defaultValues.solutionsTitle.length),
    contactTitle: Math.max(servicesFooterLimits.contactTitle, defaultValues.contactTitle.length),
    newsletterTitle: Math.max(servicesFooterLimits.newsletterTitle, defaultValues.newsletterTitle.length),
    copyright: Math.max(servicesFooterLimits.copyright, defaultValues.copyright.length),
  }), [defaultValues]);

  const { fields, append, remove } = useFieldArray({ control, name: "solutionLinks" });

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Brand name
          <CharacterCount current={(watch("brand") ?? "").length} max={limits.brand} warningAt={limits.brand - 10} />
        </div>
        <input
          {...register("brand", {
            required: true,
            maxLength: limits.brand,
          })}
          maxLength={limits.brand}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Brand description
          <CharacterCount current={(watch("description") ?? "").length} max={limits.description} warningAt={limits.description - 50} />
        </div>
        <textarea
          rows={3}
          {...register("description", {
            required: true,
            maxLength: limits.description,
          })}
          maxLength={limits.description}
        />
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Solutions column title
          <CharacterCount current={(watch("solutionsTitle") ?? "").length} max={limits.solutionsTitle} warningAt={limits.solutionsTitle - 10} />
        </div>
        <input
          {...register("solutionsTitle", {
            required: true,
            maxLength: limits.solutionsTitle,
          })}
          maxLength={limits.solutionsTitle}
        />
      </label>
      <h4>Solution links</h4>
      {fields.map((field, index) => (
        <div key={field.id} style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <input
            {...register(`solutionLinks.${index}.label`, { required: true })}
            placeholder="Label"
          />
          <input
            {...register(`solutionLinks.${index}.href`, { required: true })}
            placeholder="/products"
            style={{ flex: 1, minWidth: 140 }}
          />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ label: "New link", href: "/products" })}
        style={{ marginBottom: 16 }}
      >
        Add solution link
      </button>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Contact column title
          <CharacterCount current={(watch("contactTitle") ?? "").length} max={limits.contactTitle} warningAt={limits.contactTitle - 10} />
        </div>
        <input
          {...register("contactTitle", {
            required: true,
            maxLength: limits.contactTitle,
          })}
          maxLength={limits.contactTitle}
        />
      </label>
      <label>
        Phone
        <input {...register("phone", { required: true })} />
      </label>
      <label>
        Email
        <input {...register("email", { required: true })} />
      </label>
      <label>
        Location
        <input {...register("location", { required: true })} />
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Newsletter column title
          <CharacterCount current={(watch("newsletterTitle") ?? "").length} max={limits.newsletterTitle} warningAt={limits.newsletterTitle - 10} />
        </div>
        <input
          {...register("newsletterTitle", {
            required: true,
            maxLength: limits.newsletterTitle,
          })}
          maxLength={limits.newsletterTitle}
        />
      </label>
      <label>
        Email placeholder
        <input {...register("emailPlaceholder")} />
      </label>
      <label>
        Subscribe button label
        <input {...register("subscribeLabel")} />
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Copyright line
          <CharacterCount current={(watch("copyright") ?? "").length} max={limits.copyright} warningAt={limits.copyright - 20} />
        </div>
        <textarea
          rows={2}
          {...register("copyright", {
            required: true,
            maxLength: limits.copyright,
          })}
          maxLength={limits.copyright}
        />
      </label>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}
