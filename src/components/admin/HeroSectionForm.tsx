"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import ImageUploadField from "@/components/admin/ImageUploadField";
import CharacterCount from "@/components/admin/CharacterCount";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";
import { homeHeroLimits } from "@/lib/seeded-lengths";

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

  // Calculate dynamic limits based on initial seeded content or existing content length
  const limits = useMemo(() => {
    return {
      badge: Math.max(homeHeroLimits.badge, defaultValues.badge.length),
      titleLines: Math.max(homeHeroLimits.titleLines, defaultValues.titleLines.length),
      description: Math.max(homeHeroLimits.description, defaultValues.description.length),
      primaryLabel: Math.max(homeHeroLimits.primaryLabel, defaultValues.primaryLabel.length),
      secondaryLabel: Math.max(homeHeroLimits.secondaryLabel, defaultValues.secondaryLabel.length),
      overlayLabel: Math.max(homeHeroLimits.overlayLabel, defaultValues.overlayLabel.length),
      overlayText: Math.max(homeHeroLimits.overlayText, defaultValues.overlayText.length),
    };
  }, [defaultValues]);

  const backgroundImage = watch("backgroundImage");
  const badge = watch("badge");
  const titleLines = watch("titleLines");
  const description = watch("description");
  const primaryLabel = watch("primaryLabel");
  const secondaryLabel = watch("secondaryLabel");
  const overlayLabel = watch("overlayLabel");
  const overlayText = watch("overlayText");

  const lineCount = titleLines.split("\n").filter(l => l.trim().length > 0).length;

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Certification badge
          <CharacterCount current={badge.length} max={limits.badge} warningAt={limits.badge - 10} />
        </div>
        <input
          {...register("badge", {
            maxLength: {
              value: limits.badge,
              message: "Maximum character limit reached.",
            },
          })}
          maxLength={limits.badge}
          placeholder="MOHAP CERTIFIED MEDICAL SUPPLIER"
        />
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Headline (one line per row)
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ fontSize: 11, color: lineCount > 5 ? "#ef4444" : "#64748b" }}>
              {lineCount} / 5 lines
            </span>
            <CharacterCount current={titleLines.length} max={limits.titleLines} warningAt={limits.titleLines - 20} />
          </div>
        </div>
        <textarea
          rows={5}
          {...register("titleLines", {
            required: "Headline is required",
            maxLength: {
              value: limits.titleLines,
              message: "Maximum character limit reached.",
            },
            validate: (val) => {
              const lines = val.split("\n").filter(l => l.trim().length > 0).length;
              return lines <= 5 || "Maximum 5 lines allowed for alignment";
            }
          })}
          maxLength={limits.titleLines}
          placeholder={"Reliable Medical\nSupplies &\nEquipment\nSolutions"}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Supporting description
          <CharacterCount current={description.length} max={limits.description} warningAt={limits.description - 50} />
        </div>
        <textarea
          rows={4}
          {...register("description", {
            required: "Description is required",
            maxLength: {
              value: limits.description,
              message: "Maximum character limit reached.",
            },
          })}
          maxLength={limits.description}
          placeholder="Delivering clinical excellence through premium pharmaceutical products and cutting-edge medical equipment solutions tailored for modern healthcare providers."
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Stat value
          <CharacterCount current={overlayLabel.length} max={limits.overlayLabel} />
        </div>
        <input
          {...register("overlayLabel", {
            maxLength: {
              value: limits.overlayLabel,
              message: "Maximum character limit reached.",
            },
          })}
          maxLength={limits.overlayLabel}
          placeholder="99.9%"
        />
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Stat description
          <CharacterCount current={overlayText.length} max={limits.overlayText} warningAt={limits.overlayText - 20} />
        </div>
        <textarea
          rows={2}
          {...register("overlayText", {
            maxLength: {
              value: limits.overlayText,
              message: "Maximum character limit reached.",
            },
          })}
          maxLength={limits.overlayText}
          placeholder="Accuracy in medical supply distribution across UAE."
        />
      </label>
</div>

      <div className="hero-section-form__actions">
        <div>
          <h4>Primary action</h4>
          <label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              Label
              <CharacterCount current={primaryLabel.length} max={limits.primaryLabel} warningAt={limits.primaryLabel - 5} />
            </div>
            <input
              {...register("primaryLabel", {
                required: "Primary label is required",
                maxLength: {
                  value: limits.primaryLabel,
                  message: "Maximum character limit reached.",
                },
              })}
              maxLength={limits.primaryLabel}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              Label
              <CharacterCount current={secondaryLabel.length} max={limits.secondaryLabel} warningAt={limits.secondaryLabel - 5} />
            </div>
            <input
              {...register("secondaryLabel", {
                required: "Secondary label is required",
                maxLength: {
                  value: limits.secondaryLabel,
                  message: "Maximum character limit reached.",
                },
              })}
              maxLength={limits.secondaryLabel}
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
