"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";
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

  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } =
    useForm({ defaultValues });
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
        Badge
        <input {...register("badge", { required: true })} />
      </label>
      <label>
        Title lead
        <input {...register("titleLead", { required: true })} />
      </label>
      <label>
        Title highlight
        <input {...register("titleHighlight", { required: true })} />
      </label>
      <label>
        Description
        <textarea rows={3} {...register("description", { required: true })} />
      </label>

      <h4>Featured Card</h4>
      <label>
        Title
        <input {...register("featured.title", { required: true })} />
      </label>
      <label>
        Description
        <textarea rows={2} {...register("featured.description", { required: true })} />
      </label>
      <label>
        Link label
        <input {...register("featured.linkLabel", { required: true })} />
      </label>
      <ImageUploadField
        label="Featured image"
        value={featuredImage ?? ""}
        onChange={(value) => setValue("featured.image", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
      />

      <h4>Medical Equipment Card</h4>
      <label>
        Title
        <input {...register("equipment.title", { required: true })} />
      </label>
      <label>
        Description
        <textarea rows={2} {...register("equipment.description", { required: true })} />
      </label>
      <label>
        Button label
        <input {...register("equipment.buttonLabel", { required: true })} />
      </label>
      <ImageUploadField
        label="Equipment image"
        value={equipmentImage ?? ""}
        onChange={(value) => setValue("equipment.image", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
      />

      <h4>Surgical Supplies Card</h4>
      <label>
        Title
        <input {...register("surgical.title", { required: true })} />
      </label>
      <label>
        Description
        <textarea rows={2} {...register("surgical.description", { required: true })} />
      </label>
      <ImageUploadField
        label="Surgical card image"
        value={surgicalImage ?? ""}
        onChange={(value) => setValue("surgical.image", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
      />

      <h4>Medical Consumables Card</h4>
      <label>
        Title
        <input {...register("consumables.title", { required: true })} />
      </label>
      <label>
        Description
        <textarea rows={2} {...register("consumables.description", { required: true })} />
      </label>
      <label>
        Link label
        <input {...register("consumables.linkLabel", { required: true })} />
      </label>
      <ImageUploadField
        label="Consumables image"
        value={consumablesImage ?? ""}
        onChange={(value) => setValue("consumables.image", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
      />

      <h4>Secondary Banner</h4>
      <label>
        Title
        <input {...register("secondaryBanner.title", { required: true })} />
      </label>
      <label>
        Description
        <textarea rows={3} {...register("secondaryBanner.description", { required: true })} />
      </label>
      <ImageUploadField
        label="Banner image"
        value={bannerImage ?? ""}
        onChange={(value) => setValue("secondaryBanner.image", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
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
        Title
        <input {...register("quality.title", { required: true })} />
      </label>
      <label>
        Description
        <textarea rows={2} {...register("quality.description", { required: true })} />
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
  const links = watch("links") ?? [];

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />
      <label>
        Brand
        <input {...register("brand", { required: true })} />
      </label>
      <label>
        Copyright line
        <textarea rows={2} {...register("copyright", { required: true })} />
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
