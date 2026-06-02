"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";

type HeroFormValues = {
  badge: string;
  titleLines: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  backgroundImage: string;
  overlayLabel: string;
  overlayText: string;
};

type HeroSectionFormProps = {
  section: { id: string; type: string; order: number; data: Record<string, unknown> };
  onSave: (data: Record<string, unknown>) => void;
  previewHref: string;
  saveMessage?: string | null;
  saveMessageTone?: "success" | "error";
};

function toDefaultValues(data: Record<string, unknown>): HeroFormValues {
  const badge = (data.badge as string) ?? "";
  const title = Array.isArray(data.title) ? (data.title as string[]) : [];
  const description = (data.description as string) ?? "";
  const primary = (data.primaryAction as Record<string, unknown>) ?? {};
  const secondary = (data.secondaryAction as Record<string, unknown>) ?? {};
  const backgroundImage = (data.backgroundImage as string) ?? "";

  return {
    badge,
    titleLines: title.join("\n"),
    description,
    primaryLabel: (primary.label as string) ?? "",
    primaryHref: (primary.href as string) ?? "",
    secondaryLabel: (secondary.label as string) ?? "",
    secondaryHref: (secondary.href as string) ?? "",
    backgroundImage,
    overlayLabel: (data.overlayLabel as string) ?? "",
    overlayText: (data.overlayText as string) ?? "",
  };
}

export default function HeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: HeroSectionFormProps) {
  const defaultValues = useMemo(() => toDefaultValues(section.data), [section.data]);

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormValues>({
    defaultValues,
  });
  const backgroundImage = watch("backgroundImage");

  function handleValid(values: HeroFormValues) {
    const titleArray = values.titleLines
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload: Record<string, unknown> = {
      badge: values.badge,
      title: titleArray,
      description: values.description,
      primaryAction: {
        label: values.primaryLabel,
        href: values.primaryHref,
      },
      secondaryAction: {
        label: values.secondaryLabel,
        href: values.secondaryHref,
      },
      backgroundImage: values.backgroundImage,
      overlayLabel: values.overlayLabel,
      overlayText: values.overlayText,
    };

    onSave(payload);
  }

  function handleInvalid() {
    // We still allow submit (per requirements), backend will validate too.
  }

  return (
    <form
      className="admin-form hero-section-form"
      onSubmit={handleSubmit(handleValid, handleInvalid)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <h3>
        Hero{" "}
        <span className="admin-muted" style={{ fontWeight: 400 }}>
          (order {section.order}, id {section.id})
        </span>
      </h3>

      <label>
        Certification badge
        <input
          {...register("badge")}
          placeholder="MOHAP CERTIFIED MEDICAL SUPPLIER"
        />
      </label>

      <label>
        Headline (one line per row)
        <textarea
          rows={4}
          {...register("titleLines", { required: "Headline is required" })}
          placeholder={"Reliable Medical\nSupplies &\nEquipment\nSolutions"}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Supporting description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
          placeholder="Delivering clinical excellence through premium pharmaceutical products and cutting-edge medical equipment solutions tailored for modern healthcare providers."
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <label>
        Stat value
        <input {...register("overlayLabel")} placeholder="99.9%" />
      </label>

      <label>
        Stat description
        <textarea
          rows={2}
          {...register("overlayText")}
          placeholder="Accuracy in medical supply distribution across UAE."
        />
      </label>

      <div className="hero-section-form__actions">
        <div>
          <h4>Primary action</h4>
          <label>
            Label
            <input
              {...register("primaryLabel", { required: "Primary label is required" })}
              placeholder="Contact Us"
            />
            {errors.primaryLabel ? (
              <p className="admin-field-error">{errors.primaryLabel.message}</p>
            ) : null}
          </label>
          <label>
            Href
            <input
              {...register("primaryHref", { required: "Primary href is required" })}
              placeholder="/contact"
            />
            {errors.primaryHref ? (
              <p className="admin-field-error">{errors.primaryHref.message}</p>
            ) : null}
          </label>
        </div>

        <div>
          <h4>Secondary action</h4>
          <label>
            Label
            <input
              {...register("secondaryLabel", {
                required: "Secondary label is required",
              })}
              placeholder="View Catalog"
            />
            {errors.secondaryLabel ? (
              <p className="admin-field-error">{errors.secondaryLabel.message}</p>
            ) : null}
          </label>
          <label>
            Href
            <input
              {...register("secondaryHref", {
                required: "Secondary href is required",
              })}
              placeholder="/products"
            />
            {errors.secondaryHref ? (
              <p className="admin-field-error">{errors.secondaryHref.message}</p>
            ) : null}
          </label>
        </div>
      </div>

      <input type="hidden" {...register("backgroundImage")} />
      <ImageUploadField
        label="Hero image (optional — leave empty for default illustration)"
        value={backgroundImage}
        onChange={(value) => setValue("backgroundImage", value, { shouldDirty: true, shouldValidate: true })}
        folder={`sections/${section.type}`}
        placeholder="Leave empty for default medical product illustration"
      />

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}
