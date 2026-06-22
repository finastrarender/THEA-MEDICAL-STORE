"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import CharacterCount from "@/components/admin/CharacterCount";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";
import {
  productsCatalogShowcaseLimits,
  productsFooterLimits,
} from "@/lib/seeded-lengths";
import {
  theaProductsCatalogShowcaseDefaults,
  theaProductsFooterDefaults,
} from "@/data/thea-products-sections";

type SectionFormProps = {
  section: { id: string; type: string; order: number; data: Record<string, unknown> };
  onSave: (data: Record<string, unknown>) => void;
  previewHref: string;
  saveMessage?: string | null;
  saveMessageTone?: "success" | "error";
};

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

export function ProductsCatalogShowcaseSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaults = theaProductsCatalogShowcaseDefaults;
  const defaultValues = useMemo(
    () => ({
      badge: (section.data.badge as string) ?? defaults.badge,
      titleLead: (section.data.titleLead as string) ?? defaults.titleLead,
      titleHighlight: (section.data.titleHighlight as string) ?? defaults.titleHighlight,
      description: (section.data.description as string) ?? defaults.description,
      featured: {
        title: (section.data.featured as { title?: string })?.title ?? defaults.featured.title,
        description:
          (section.data.featured as { description?: string })?.description ??
          defaults.featured.description,
        linkLabel:
          (section.data.featured as { linkLabel?: string })?.linkLabel ??
          defaults.featured.linkLabel,
        image: (section.data.featured as { image?: string })?.image ?? defaults.featured.image,
      },
      equipment: {
        title: (section.data.equipment as { title?: string })?.title ?? defaults.equipment.title,
        description:
          (section.data.equipment as { description?: string })?.description ??
          defaults.equipment.description,
        buttonLabel:
          (section.data.equipment as { buttonLabel?: string })?.buttonLabel ??
          defaults.equipment.buttonLabel,
        image: (section.data.equipment as { image?: string })?.image ?? defaults.equipment.image,
      },
      surgical: {
        title: (section.data.surgical as { title?: string })?.title ?? defaults.surgical.title,
        description:
          (section.data.surgical as { description?: string })?.description ??
          defaults.surgical.description,
        image: (section.data.surgical as { image?: string })?.image ?? defaults.surgical.image,
      },
      consumables: {
        title:
          (section.data.consumables as { title?: string })?.title ?? defaults.consumables.title,
        description:
          (section.data.consumables as { description?: string })?.description ??
          defaults.consumables.description,
        linkLabel:
          (section.data.consumables as { linkLabel?: string })?.linkLabel ??
          defaults.consumables.linkLabel,
        image:
          (section.data.consumables as { image?: string })?.image ?? defaults.consumables.image,
      },
      secondaryBanner: {
        title:
          (section.data.secondaryBanner as { title?: string })?.title ??
          defaults.secondaryBanner.title,
        description:
          (section.data.secondaryBanner as { description?: string })?.description ??
          defaults.secondaryBanner.description,
        image:
          (section.data.secondaryBanner as { image?: string })?.image ??
          defaults.secondaryBanner.image,
        tags:
          ((section.data.secondaryBanner as { tags?: string[] })?.tags ?? []).length > 0
            ? ((section.data.secondaryBanner as { tags?: string[] }).tags as string[])
            : defaults.secondaryBanner.tags,
      },
      quality: {
        title: (section.data.quality as { title?: string })?.title ?? defaults.quality.title,
        description:
          (section.data.quality as { description?: string })?.description ??
          defaults.quality.description,
        certifications:
          ((section.data.quality as { certifications?: string[] })?.certifications ?? []).length > 0
            ? ((section.data.quality as { certifications?: string[] }).certifications as string[])
            : defaults.quality.certifications,
      },
    }),
    [section.data, defaults],
  );

  const { register, handleSubmit, setValue, watch, handleSubmit: onHandleSubmit, formState: { isSubmitting } } =
    useForm({ defaultValues });

  const badge = watch("badge");
  const titleLead = watch("titleLead");
  const titleHighlight = watch("titleHighlight");
  const description = watch("description");
  const limits = useMemo(() => ({
    badge: Math.max(productsCatalogShowcaseLimits.badge, defaultValues.badge.length),
    titleLead: Math.max(productsCatalogShowcaseLimits.titleLead, defaultValues.titleLead.length),
    titleHighlight: Math.max(productsCatalogShowcaseLimits.titleHighlight, defaultValues.titleHighlight.length),
    description: Math.max(productsCatalogShowcaseLimits.description, defaultValues.description.length),
    featuredTitle: Math.max(productsCatalogShowcaseLimits.featuredTitle, defaultValues.featured.title.length),
    featuredDescription: Math.max(productsCatalogShowcaseLimits.featuredDescription, defaultValues.featured.description.length),
    featuredLinkLabel: Math.max(productsCatalogShowcaseLimits.featuredLinkLabel, defaultValues.featured.linkLabel.length),
    equipmentTitle: Math.max(productsCatalogShowcaseLimits.equipmentTitle, defaultValues.equipment.title.length),
    equipmentDescription: Math.max(productsCatalogShowcaseLimits.equipmentDescription, defaultValues.equipment.description.length),
    equipmentButtonLabel: Math.max(productsCatalogShowcaseLimits.equipmentButtonLabel, defaultValues.equipment.buttonLabel.length),
    surgicalTitle: Math.max(productsCatalogShowcaseLimits.surgicalTitle, defaultValues.surgical.title.length),
    surgicalDescription: Math.max(productsCatalogShowcaseLimits.surgicalDescription, defaultValues.surgical.description.length),
    consumablesTitle: Math.max(productsCatalogShowcaseLimits.consumablesTitle, defaultValues.consumables.title.length),
    consumablesDescription: Math.max(productsCatalogShowcaseLimits.consumablesDescription, defaultValues.consumables.description.length),
    consumablesLinkLabel: Math.max(productsCatalogShowcaseLimits.consumablesLinkLabel, defaultValues.consumables.linkLabel.length),
    secondaryBannerTitle: Math.max(productsCatalogShowcaseLimits.secondaryBannerTitle, defaultValues.secondaryBanner.title.length),
    secondaryBannerDescription: Math.max(productsCatalogShowcaseLimits.secondaryBannerDescription, defaultValues.secondaryBanner.description.length),
    qualityTitle: Math.max(productsCatalogShowcaseLimits.qualityTitle, (section.data.quality as any)?.title?.length ?? 0),
    qualityDescription: Math.max(productsCatalogShowcaseLimits.qualityDescription, (section.data.quality as any)?.description?.length ?? 0),
  }), [defaultValues, section.data]);
  
  const tagFields = watch("secondaryBanner.tags") ?? [];
  const certFields = watch("quality.certifications") ?? [];
  const featuredImage = watch("featured.image");
  const equipmentImage = watch("equipment.image");
  const surgicalImage = watch("surgical.image");
  const consumablesImage = watch("consumables.image");
  const bannerImage = watch("secondaryBanner.image");

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
          Title lead
          <CharacterCount current={titleLead.length} max={limits.titleLead} />
        </div>
        <input
          {...register("titleLead", {
            required: true,
            maxLength: limits.titleLead,
          })}
          maxLength={limits.titleLead}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title highlight
          <CharacterCount current={titleHighlight.length} max={limits.titleHighlight} />
        </div>
        <input
          {...register("titleHighlight", {
            required: true,
            maxLength: limits.titleHighlight,
          })}
          maxLength={limits.titleHighlight}
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

      <h4>Featured Card</h4>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title
          <CharacterCount current={(watch("featured.title") ?? "").length} max={limits.featuredTitle} />
        </div>
        <input
          {...register("featured.title", {
            required: true,
            maxLength: limits.featuredTitle,
          })}
          maxLength={limits.featuredTitle}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description
          <CharacterCount current={(watch("featured.description") ?? "").length} max={limits.featuredDescription} />
        </div>
        <textarea
          rows={2}
          {...register("featured.description", {
            required: true,
            maxLength: limits.featuredDescription,
          })}
          maxLength={limits.featuredDescription}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Link label
          <CharacterCount current={(watch("featured.linkLabel") ?? "").length} max={limits.featuredLinkLabel} />
        </div>
        <input
          {...register("featured.linkLabel", {
            required: true,
            maxLength: limits.featuredLinkLabel,
          })}
          maxLength={limits.featuredLinkLabel}
        />
      </label>
      <ImageUploadField
        label="Featured image"
        value={featuredImage ?? ""}
        onChange={(value) => setValue("featured.image", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
        minWidth={600}
        minHeight={600}
        aspectRatio={1}
      />

      <h4>Medical Equipment Card</h4>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title
          <CharacterCount current={(watch("equipment.title") ?? "").length} max={limits.equipmentTitle} />
        </div>
        <input
          {...register("equipment.title", {
            required: true,
            maxLength: limits.equipmentTitle,
          })}
          maxLength={limits.equipmentTitle}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description
          <CharacterCount current={(watch("equipment.description") ?? "").length} max={limits.equipmentDescription} />
        </div>
        <textarea
          rows={2}
          {...register("equipment.description", {
            required: true,
            maxLength: limits.equipmentDescription,
          })}
          maxLength={limits.equipmentDescription}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Button label
          <CharacterCount current={(watch("equipment.buttonLabel") ?? "").length} max={limits.equipmentButtonLabel} />
        </div>
        <input
          {...register("equipment.buttonLabel", {
            required: true,
            maxLength: limits.equipmentButtonLabel,
          })}
          maxLength={limits.equipmentButtonLabel}
        />
      </label>
      <ImageUploadField
        label="Equipment image"
        value={equipmentImage ?? ""}
        onChange={(value) => setValue("equipment.image", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
        minWidth={400}
        minHeight={400}
        aspectRatio={1}
      />

      <h4>Surgical Supplies Card</h4>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title
          <CharacterCount current={(watch("surgical.title") ?? "").length} max={limits.surgicalTitle} />
        </div>
        <input
          {...register("surgical.title", {
            required: true,
            maxLength: limits.surgicalTitle,
          })}
          maxLength={limits.surgicalTitle}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description
          <CharacterCount current={(watch("surgical.description") ?? "").length} max={limits.surgicalDescription} />
        </div>
        <textarea
          rows={2}
          {...register("surgical.description", {
            required: true,
            maxLength: limits.surgicalDescription,
          })}
          maxLength={limits.surgicalDescription}
        />
      </label>
      <ImageUploadField
        label="Surgical card image"
        value={surgicalImage ?? ""}
        onChange={(value) => setValue("surgical.image", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
        minWidth={400}
        minHeight={400}
        aspectRatio={1}
      />

      <h4>Medical Consumables Card</h4>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title
          <CharacterCount current={(watch("consumables.title") ?? "").length} max={limits.consumablesTitle} />
        </div>
        <input
          {...register("consumables.title", {
            required: true,
            maxLength: limits.consumablesTitle,
          })}
          maxLength={limits.consumablesTitle}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description
          <CharacterCount current={(watch("consumables.description") ?? "").length} max={limits.consumablesDescription} />
        </div>
        <textarea
          rows={2}
          {...register("consumables.description", {
            required: true,
            maxLength: limits.consumablesDescription,
          })}
          maxLength={limits.consumablesDescription}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Link label
          <CharacterCount current={(watch("consumables.linkLabel") ?? "").length} max={limits.consumablesLinkLabel} />
        </div>
        <input
          {...register("consumables.linkLabel", {
            required: true,
            maxLength: limits.consumablesLinkLabel,
          })}
          maxLength={limits.consumablesLinkLabel}
        />
      </label>
      <ImageUploadField
        label="Consumables image"
        value={consumablesImage ?? ""}
        onChange={(value) => setValue("consumables.image", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
        minWidth={400}
        minHeight={400}
        aspectRatio={1}
      />

      <h4>Secondary Banner</h4>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title
          <CharacterCount current={(watch("secondaryBanner.title") ?? "").length} max={limits.secondaryBannerTitle} />
        </div>
        <input
          {...register("secondaryBanner.title", {
            required: true,
            maxLength: limits.secondaryBannerTitle,
          })}
          maxLength={limits.secondaryBannerTitle}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description
          <CharacterCount current={(watch("secondaryBanner.description") ?? "").length} max={limits.secondaryBannerDescription} />
        </div>
        <textarea
          rows={3}
          {...register("secondaryBanner.description", {
            required: true,
            maxLength: limits.secondaryBannerDescription,
          })}
          maxLength={limits.secondaryBannerDescription}
        />
      </label>
      <ImageUploadField
        label="Banner image"
        value={bannerImage ?? ""}
        onChange={(value) => setValue("secondaryBanner.image", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
        minWidth={1200}
        minHeight={600}
        aspectRatio={2}
      />
      <h4>Banner Tags</h4>
      {tagFields.map((_, index) => (
        <label key={`tag-${index}`}>
          Tag {index + 1}
          <input {...register(`secondaryBanner.tags.${index}` as const, { required: true })} />
        </label>
      ))}

      <h4>Quality Strip</h4>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title
          <CharacterCount current={(watch("quality.title") ?? "").length} max={limits.qualityTitle} />
        </div>
        <input
          {...register("quality.title", {
            required: true,
            maxLength: limits.qualityTitle,
          })}
          maxLength={limits.qualityTitle}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description
          <CharacterCount current={(watch("quality.description") ?? "").length} max={limits.qualityDescription} />
        </div>
        <textarea
          rows={2}
          {...register("quality.description", {
            required: true,
            maxLength: limits.qualityDescription,
          })}
          maxLength={limits.qualityDescription}
        />
      </label>
      {certFields.map((_, index) => (
        <label key={`cert-${index}`}>
          Certification {index + 1}
          <input {...register(`quality.certifications.${index}` as const, { required: true })} />
        </label>
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

export function ProductsFooterSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaults = theaProductsFooterDefaults;
  const defaultValues = useMemo(
    () => ({
      brand: (section.data.brand as string) ?? defaults.brand,
      copyright: (section.data.copyright as string) ?? defaults.copyright,
      links:
        ((section.data.links as typeof defaults.links) ?? []).length > 0
          ? (section.data.links as typeof defaults.links)
          : defaults.links,
    }),
    [section.data, defaults],
  );

  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm({ defaultValues });

  const brand = watch("brand");
  const copyright = watch("copyright");
  const limits = useMemo(() => ({
    brand: Math.max(productsFooterLimits.brand, (section.data.brand as string)?.length ?? 0),
    description: Math.max(productsFooterLimits.description, (section.data.description as string)?.length ?? 0),
    copyright: Math.max(productsFooterLimits.copyright, (section.data.copyright as string)?.length ?? 0),
  }), [section.data]);

  const links = watch("links") ?? [];

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Brand
          <CharacterCount current={brand.length} max={limits.brand} />
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
          Copyright line
          <CharacterCount current={copyright.length} max={limits.copyright} />
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
      <h4>Footer links</h4>
      {links.map((_, index) => (
        <div key={`products-footer-link-${index}`} className="admin-field-group">
          <label>
            Label
            <input {...register(`links.${index}.label` as const, { required: true })} />
          </label>
          <label>
            Href
            <input {...register(`links.${index}.href` as const, { required: true })} />
          </label>
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
