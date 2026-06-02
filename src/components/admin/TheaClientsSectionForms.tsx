"use client";

import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";
import {
  THEA_CLIENTS_COMPLIANCE_ICONS,
  THEA_CLIENTS_SECTOR_ICONS,
} from "@/data/thea-clients-icon-options";
import {
  theaClientsComplianceDefaults,
  theaClientsPageHeroDefaults,
  theaClientsPartnerCtaDefaults,
  theaClientsSectorsDefaults,
  theaClientsTrustedByDefaults,
} from "@/data/thea-clients-sections";

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

export function ClientsPageHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      badge: (section.data.badge as string) ?? theaClientsPageHeroDefaults.badge,
      titleLead: (section.data.titleLead as string) ?? theaClientsPageHeroDefaults.titleLead,
      titleHighlight:
        (section.data.titleHighlight as string) ?? theaClientsPageHeroDefaults.titleHighlight,
      titleAfter: (section.data.titleAfter as string) ?? theaClientsPageHeroDefaults.titleAfter,
      description:
        (section.data.description as string) ?? theaClientsPageHeroDefaults.description,
      backgroundImage:
        (section.data.backgroundImage as string) ?? theaClientsPageHeroDefaults.backgroundImage,
      certifications:
        ((section.data.certifications as typeof theaClientsPageHeroDefaults.certifications) ??
          []).length > 0
          ? (section.data.certifications as typeof theaClientsPageHeroDefaults.certifications)
          : theaClientsPageHeroDefaults.certifications,
    }),
    [section.data],
  );

  const { register, control, handleSubmit, setValue, watch, formState: { isSubmitting } } =
    useForm({
      defaultValues,
    });
  const { fields, append, remove } = useFieldArray({ control, name: "certifications" });
  const backgroundImage = watch("backgroundImage");

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />
      <label>
        Badge / eyebrow
        <input {...register("badge", { required: true })} />
      </label>
      <label>
        Title line 1
        <input {...register("titleLead", { required: true })} />
      </label>
      <label>
        Title line 2 (accent color)
        <input {...register("titleHighlight", { required: true })} />
      </label>
      <label>
        Title line 3
        <input {...register("titleAfter", { required: true })} />
      </label>
      <label>
        Description
        <textarea rows={3} {...register("description", { required: true })} />
      </label>
      <ImageUploadField
        label="Background image"
        value={backgroundImage ?? ""}
        onChange={(value) => setValue("backgroundImage", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
        placeholder="Upload hero background"
      />
      <input type="hidden" {...register("backgroundImage")} />
      <h4>Certification pills</h4>
      {fields.map((field, index) => (
        <div key={field.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            {...register(`certifications.${index}.label`, { required: true })}
            placeholder="MOHAP Licensed"
            style={{ flex: 1 }}
          />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ label: "New certification" })}
        style={{ marginBottom: 16 }}
      >
        Add certification
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

export function ClientsSectorsSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? theaClientsSectorsDefaults.title,
      titleAccent: (section.data.titleAccent as string) ?? theaClientsSectorsDefaults.titleAccent,
      cards:
        ((section.data.cards as typeof theaClientsSectorsDefaults.cards) ?? []).length > 0
          ? (section.data.cards as typeof theaClientsSectorsDefaults.cards)
          : theaClientsSectorsDefaults.cards,
    }),
    [section.data],
  );

  const { register, control, handleSubmit, watch, setValue, formState: { isSubmitting } } =
    useForm({
      defaultValues,
    });
  const { fields, append, remove } = useFieldArray({ control, name: "cards" });
  const watchedCards = watch("cards");

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
      <label>
        Underlined accent word
        <input {...register("titleAccent", { required: true })} />
      </label>

      <h4>Sector cards</h4>
      {fields.map((field, index) => {
        const layout = watchedCards?.[index]?.layout ?? "standard";
        const isFeatured = layout === "featured";
        return (
          <div
            key={field.id}
            className="admin-field-group"
            style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #e2e8f0" }}
          >
            <label>
              Layout
              <select {...register(`cards.${index}.layout` as const)}>
                <option value="featured">Featured (wide)</option>
                <option value="standard">Standard</option>
              </select>
            </label>
            <label>
              Style
              <select {...register(`cards.${index}.variant` as const)}>
                <option value="light">Light</option>
                <option value="dark">Dark navy</option>
              </select>
            </label>
            <label>
              Icon
              <select {...register(`cards.${index}.icon` as const)}>
                {THEA_CLIENTS_SECTOR_ICONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Title
              <input {...register(`cards.${index}.title` as const, { required: true })} />
            </label>
            <label>
              Description
              <textarea rows={3} {...register(`cards.${index}.description` as const, { required: true })} />
            </label>
            {isFeatured ? (
              <>
                <label>
                  Bullet 1
                  <input {...register(`cards.${index}.bullets.0` as const)} />
                </label>
                <label>
                  Bullet 2
                  <input {...register(`cards.${index}.bullets.1` as const)} />
                </label>
                <label>
                  Bullet 3
                  <input {...register(`cards.${index}.bullets.2` as const)} />
                </label>
              </>
            ) : null}
            <ImageUploadField
              label={isFeatured ? "Side image" : "Thumbnail image (optional)"}
              value={(watchedCards?.[index]?.image as string) ?? ""}
              onChange={(value) =>
                setValue(`cards.${index}.image`, value, { shouldDirty: true })
              }
              folder={`sections/${section.type}`}
            />
            <input type="hidden" {...register(`cards.${index}.image` as const)} />
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" {...register(`cards.${index}.showFamilyDecor` as const)} />
              Show family decor (home healthcare)
            </label>
            <button type="button" onClick={() => remove(index)}>
              Remove card
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() =>
          append({
            layout: "standard",
            variant: "light",
            icon: "hospital",
            title: "New sector",
            description: "",
            bullets: [],
            image: "",
          })
        }
        style={{ marginBottom: 16 }}
      >
        Add sector card
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

export function ClientsComplianceSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? theaClientsComplianceDefaults.title,
      description:
        (section.data.description as string) ?? theaClientsComplianceDefaults.description,
      approvalBadges:
        ((section.data.approvalBadges as typeof theaClientsComplianceDefaults.approvalBadges) ??
          []).length > 0
          ? (section.data.approvalBadges as typeof theaClientsComplianceDefaults.approvalBadges)
          : theaClientsComplianceDefaults.approvalBadges,
      certifications:
        ((section.data.certifications as typeof theaClientsComplianceDefaults.certifications) ??
          []).length > 0
          ? (section.data.certifications as typeof theaClientsComplianceDefaults.certifications)
          : theaClientsComplianceDefaults.certifications,
    }),
    [section.data],
  );

  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
  });
  const { fields: badgeFields, append: appendBadge, remove: removeBadge } = useFieldArray({
    control,
    name: "approvalBadges",
  });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control,
    name: "certifications",
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
        <textarea rows={4} {...register("description", { required: true })} />
      </label>

      <h4>Approval badges</h4>
      {badgeFields.map((field, index) => (
        <div key={field.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            {...register(`approvalBadges.${index}.label`, { required: true })}
            style={{ flex: 1 }}
          />
          <button type="button" onClick={() => removeBadge(index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendBadge({ label: "NEW BADGE" })}
        style={{ marginBottom: 16 }}
      >
        Add approval badge
      </button>

      <h4>Certification icons</h4>
      {certFields.map((field, index) => (
        <div key={field.id} className="admin-field-group">
          <label>
            Icon
            <select {...register(`certifications.${index}.icon` as const)}>
              {THEA_CLIENTS_COMPLIANCE_ICONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Label
            <input {...register(`certifications.${index}.label` as const, { required: true })} />
          </label>
          <button type="button" onClick={() => removeCert(index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendCert({ icon: "gavel", label: "NEW CERT" })}
        style={{ marginBottom: 16 }}
      >
        Add certification
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

export function ClientsTrustedBySectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? theaClientsTrustedByDefaults.title,
      logos:
        ((section.data.logos as typeof theaClientsTrustedByDefaults.logos) ?? []).length > 0
          ? (section.data.logos as typeof theaClientsTrustedByDefaults.logos)
          : theaClientsTrustedByDefaults.logos,
    }),
    [section.data],
  );

  const { register, control, handleSubmit, setValue, watch, formState: { isSubmitting } } =
    useForm({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "logos" });
  const watchedLogos = watch("logos");

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

      <h4>Partner logos (circular)</h4>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="admin-field-group"
          style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #eef2f6" }}
        >
          <ImageUploadField
            label={`Logo ${index + 1}`}
            value={(watchedLogos?.[index]?.src as string) ?? ""}
            onChange={(value) => setValue(`logos.${index}.src`, value, { shouldDirty: true })}
            folder={`sections/${section.type}`}
            placeholder="Upload partner logo"
          />
          <input type="hidden" {...register(`logos.${index}.src` as const)} />
          <label>
            Alt text
            <input {...register(`logos.${index}.alt` as const)} placeholder="Partner name" />
          </label>
          <button type="button" onClick={() => remove(index)}>
            Remove logo
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ src: "", alt: "Partner institution" })}
        style={{ marginBottom: 16 }}
      >
        Add logo
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

export function ClientsPartnerCtaSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? theaClientsPartnerCtaDefaults.title,
      description:
        (section.data.description as string) ?? theaClientsPartnerCtaDefaults.description,
      primaryAction: {
        label:
          (section.data.primaryAction as { label?: string })?.label ??
          theaClientsPartnerCtaDefaults.primaryAction.label,
        href:
          (section.data.primaryAction as { href?: string })?.href ??
          theaClientsPartnerCtaDefaults.primaryAction.href,
      },
      secondaryAction: {
        label:
          (section.data.secondaryAction as { label?: string })?.label ??
          theaClientsPartnerCtaDefaults.secondaryAction.label,
        href:
          (section.data.secondaryAction as { href?: string })?.href ??
          theaClientsPartnerCtaDefaults.secondaryAction.href,
      },
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
        Title
        <input {...register("title", { required: true })} />
      </label>
      <label>
        Description
        <textarea rows={4} {...register("description", { required: true })} />
      </label>
      <h4>Primary button</h4>
      <label>
        Label
        <input {...register("primaryAction.label", { required: true })} />
      </label>
      <label>
        Link
        <input {...register("primaryAction.href", { required: true })} placeholder="/contact" />
      </label>
      <h4>Secondary button</h4>
      <label>
        Label
        <input {...register("secondaryAction.label", { required: true })} />
      </label>
      <label>
        Link
        <input {...register("secondaryAction.href", { required: true })} placeholder="/contact" />
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
