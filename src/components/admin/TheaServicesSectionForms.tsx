"use client";

import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { theaPharmaceuticalMedicinesCatalogDefaults } from "@/data/thea-products-sections";

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

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues });

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />
      <label>
        Badge
        <input {...register("badge", { required: true })} />
      </label>
      <label>
        Title
        <input {...register("title", { required: true })} />
      </label>
      <label>
        Description
        <textarea rows={3} {...register("description", { required: true })} />
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
            Title
            <input {...register(`cards.${cardIndex}.title` as const, { required: true })} />
          </label>
          <label>
            Description
            <textarea rows={3} {...register(`cards.${cardIndex}.description` as const, { required: true })} />
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
        Section title
        <input {...register("title", { required: true })} />
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
            Title
            <input {...register(`items.${index}.title` as const, { required: true })} />
          </label>
          <label>
            Description
            <textarea rows={2} {...register(`items.${index}.description` as const, { required: true })} />
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
                Value
                <input {...register(`tiles.${index}.value` as const)} />
              </label>
              <label>
                Label
                <input {...register(`tiles.${index}.label` as const)} />
              </label>
            </>
          ) : null}
          {tile.variant === "product" ? (
            <>
              <label>
                Title
                <input {...register(`tiles.${index}.title` as const)} />
              </label>
              <label>
                Label
                <input {...register(`tiles.${index}.label` as const)} />
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
              />
            </>
          ) : null}
          {tile.variant === "brand" ? (
            <>
              <label>
                Brand line
                <input {...register(`tiles.${index}.brandLine` as const)} />
              </label>
              <label>
                Brand subtext
                <input {...register(`tiles.${index}.brandSub` as const)} />
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
        Title
        <input {...register("title", { required: true })} />
      </label>
      <label>
        Description
        <textarea rows={2} {...register("description", { required: true })} />
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

  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
  });
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
        Title
        <input {...register("title", { required: true })} />
      </label>
      <label>
        Description
        <textarea rows={3} {...register("description", { required: true })} />
      </label>
      <label>
        Table title
        <input {...register("tableTitle", { required: true })} />
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
        style={{ marginBottom: 16 }}
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
            Remove row
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          appendStandard({ deviceCategory: "", standard: "", status: "VERIFIED" })
        }
        style={{ marginBottom: 16 }}
      >
        Add standard row
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

type FooterLink = { label: string; href: string };

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
        ((section.data.solutionLinks as FooterLink[]) ?? []).length > 0
          ? (section.data.solutionLinks as FooterLink[])
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

  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "solutionLinks" });

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Brand name
        <input {...register("brand", { required: true })} />
      </label>
      <label>
        Brand description
        <textarea rows={3} {...register("description", { required: true })} />
      </label>

      <label>
        Solutions column title
        <input {...register("solutionsTitle", { required: true })} />
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
        Contact column title
        <input {...register("contactTitle", { required: true })} />
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
        Newsletter column title
        <input {...register("newsletterTitle", { required: true })} />
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
        Copyright line
        <textarea rows={2} {...register("copyright", { required: true })} />
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
