"use client";

import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import CharacterCount from "@/components/admin/CharacterCount";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";
import TheaHomeIconPicker from "@/components/admin/TheaHomeIconPicker";
import ClientsComplianceIcon from "@/components/sections/clients/ClientsComplianceIcon";
import ClientsSectorIcon from "@/components/sections/clients/ClientsSectorIcon";
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
import {
  clientsHeroLimits,
  clientsSectorsLimits,
  clientsComplianceLimits,
  trustedByLimits,
  clientsPartnerCtaLimits,
} from "@/lib/seeded-lengths";

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

  const description = watch("description");
  const limits = useMemo(() => ({
    badge: Math.max(clientsHeroLimits.badge, defaultValues.badge.length),
    titleLead: Math.max(clientsHeroLimits.titleLead, defaultValues.titleLead.length),
    titleHighlight: Math.max(clientsHeroLimits.titleHighlight, defaultValues.titleHighlight.length),
    titleAfter: Math.max(clientsHeroLimits.titleAfter, defaultValues.titleAfter.length),
    description: Math.max(clientsHeroLimits.description, defaultValues.description.length),
    certLabel: Math.max(35, defaultValues.certifications.reduce((max, c) => Math.max(max, c.label.length), 0)),
  }), [defaultValues]);
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Badge / eyebrow
          <CharacterCount current={(watch("badge") ?? "").length} max={limits.badge} warningAt={limits.badge - 5} />
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
          Title line 1
          <CharacterCount current={(watch("titleLead") ?? "").length} max={limits.titleLead} warningAt={limits.titleLead - 10} />
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
          Title line 2 (accent color)
          <CharacterCount current={(watch("titleHighlight") ?? "").length} max={limits.titleHighlight} warningAt={limits.titleHighlight - 10} />
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
          Title line 3
          <CharacterCount current={(watch("titleAfter") ?? "").length} max={limits.titleAfter} warningAt={limits.titleAfter - 10} />
        </div>
        <input
          {...register("titleAfter", {
            required: true,
            maxLength: limits.titleAfter,
          })}
          maxLength={limits.titleAfter}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description
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
      <ImageUploadField
        label="Background image"
        value={backgroundImage ?? ""}
        onChange={(value) => setValue("backgroundImage", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
        placeholder="Upload hero background"
        minWidth={1600}
        minHeight={800}
        aspectRatio={2}
        maxSizeKB={10000}
      />
      <input type="hidden" {...register("backgroundImage")} />
      <h4>Certification pills</h4>
      {fields.map((field, index) => (
        <div key={field.id} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              Label
              <CharacterCount current={(watch(`certifications.${index}.label`) ?? "").length} max={limits.certLabel} />
            </div>
            <input
              {...register(`certifications.${index}.label`, { required: true, maxLength: limits.certLabel })}
              maxLength={limits.certLabel}
              placeholder="MOHAP Licensed"
            />
          </div>
          <button type="button" onClick={() => remove(index)} style={{ alignSelf: "flex-end", height: 38 }}>
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

  const title = watch("title");
  const titleAccent = watch("titleAccent");
  const limits = useMemo(() => ({
    title: Math.max(clientsSectorsLimits.title, defaultValues.title.length),
    titleAccent: Math.max(clientsSectorsLimits.titleAccent, defaultValues.titleAccent.length),
    cardTitle: Math.max(clientsSectorsLimits.cardTitle, defaultValues.cards.reduce((max, c) => Math.max(max, c.title.length), 0)),
    cardDescription: Math.max(clientsSectorsLimits.cardDescription, defaultValues.cards.reduce((max, c) => Math.max(max, c.description.length), 0)),
  }), [defaultValues]);
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
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Underlined accent word
          <CharacterCount current={titleAccent.length} max={limits.titleAccent} />
        </div>
        <input
          {...register("titleAccent", {
            required: true,
            maxLength: limits.titleAccent,
          })}
          maxLength={limits.titleAccent}
        />
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
              <span className="admin-field-label">Icon</span>
              <input type="hidden" {...register(`cards.${index}.icon` as const)} />
              <TheaHomeIconPicker
                value={watchedCards?.[index]?.icon}
                onChange={(icon) =>
                  setValue(`cards.${index}.icon`, icon, { shouldDirty: true })
                }
                options={THEA_CLIENTS_SECTOR_ICONS}
                fallbackKey="hospital"
                renderIcon={(name, className) => (
                  <ClientsSectorIcon name={name} className={className} />
                )}
              />
            </label>
            <label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                Title
                <CharacterCount current={(watch(`cards.${index}.title`) ?? "").length} max={limits.cardTitle} warningAt={limits.cardTitle - 10} />
              </div>
              <input
                {...register(`cards.${index}.title` as const, {
                  required: true,
                  maxLength: limits.cardTitle,
                })}
                maxLength={limits.cardTitle}
              />
            </label>
            <label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                Description
                <CharacterCount current={(watch(`cards.${index}.description`) ?? "").length} max={limits.cardDescription} warningAt={limits.cardDescription - 20} />
              </div>
              <textarea
                rows={3}
                {...register(`cards.${index}.description` as const, {
                  required: true,
                  maxLength: limits.cardDescription,
                })}
                maxLength={limits.cardDescription}
              />
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

  const { register, control, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues,
  });

  const limits = useMemo(() => ({
    title: Math.max(clientsComplianceLimits.title, defaultValues.title.length),
    description: Math.max(clientsComplianceLimits.description, defaultValues.description.length),
    badgeLabel: Math.max(25, defaultValues.approvalBadges.reduce((max, b) => Math.max(max, b.label.length), 0)),
    certificationLabel: Math.max(30, defaultValues.certifications.reduce((max, c) => Math.max(max, c.label.length), 0)),
  }), [defaultValues]);
  const { fields: badgeFields, append: appendBadge, remove: removeBadge } = useFieldArray({
    control,
    name: "approvalBadges",
  });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control,
    name: "certifications",
  });
  const watchedCertifications = watch("certifications");
  const watchedBadges = watch("approvalBadges");

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
          <CharacterCount current={(watch("title") ?? "").length} max={limits.title} warningAt={limits.title - 10} />
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
          <CharacterCount current={(watch("description") ?? "").length} max={limits.description} warningAt={limits.description - 50} />
        </div>
        <textarea
          rows={4}
          {...register("description", {
            required: true,
            maxLength: limits.description,
          })}
          maxLength={limits.description}
        />
      </label>

      <h4>Approval badges</h4>
      {badgeFields.map((field, index) => (
        <div key={field.id} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              Label
              <CharacterCount current={(watchedBadges?.[index]?.label ?? "").length} max={limits.badgeLabel} />
            </div>
            <input
              {...register(`approvalBadges.${index}.label`, { required: true, maxLength: limits.badgeLabel })}
              maxLength={limits.badgeLabel}
              style={{ width: "100%" }}
            />
          </div>
          <button type="button" onClick={() => removeBadge(index)} style={{ alignSelf: "flex-end", height: 38 }}>
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
            <span className="admin-field-label">Icon</span>
            <input type="hidden" {...register(`certifications.${index}.icon` as const)} />
            <TheaHomeIconPicker
              value={watchedCertifications?.[index]?.icon}
              onChange={(icon) =>
                setValue(`certifications.${index}.icon`, icon, { shouldDirty: true })
              }
              options={THEA_CLIENTS_COMPLIANCE_ICONS}
              fallbackKey="shieldMedical"
              renderIcon={(name, className) => (
                <ClientsComplianceIcon name={name} className={className} />
              )}
            />
          </label>
          <label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              Label
              <CharacterCount current={(watchedCertifications?.[index]?.label ?? "").length} max={limits.certificationLabel} />
            </div>
            <input
              {...register(`certifications.${index}.label` as const, { required: true, maxLength: limits.certificationLabel })}
              maxLength={limits.certificationLabel}
            />
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

  const title = watch("title");
  const limits = useMemo(() => ({
    title: Math.max(trustedByLimits.title, defaultValues.title.length),
  }), [defaultValues]);
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

  const { register, watch, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues });

  const title = watch("title");
  const description = watch("description");
  const primaryLabel = watch("primaryAction.label");
  const secondaryLabel = watch("secondaryAction.label");

  const limits = useMemo(() => ({
    title: Math.max(clientsPartnerCtaLimits.title, defaultValues.title.length),
    description: Math.max(clientsPartnerCtaLimits.description, defaultValues.description.length),
    primaryLabel: Math.max(clientsPartnerCtaLimits.primaryLabel, defaultValues.primaryAction.label.length),
    secondaryLabel: Math.max(clientsPartnerCtaLimits.secondaryLabel, defaultValues.secondaryAction.label.length),
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
          rows={4}
          {...register("description", {
            required: true,
            maxLength: limits.description,
          })}
          maxLength={limits.description}
        />
      </label>
      <h4>Primary button</h4>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Label
          <CharacterCount current={(primaryLabel ?? "").length} max={limits.primaryLabel} />
        </div>
        <input
          {...register("primaryAction.label", {
            required: true,
            maxLength: limits.primaryLabel,
          })}
          maxLength={limits.primaryLabel}
        />
      </label>
      <label>
        Link
        <input {...register("primaryAction.href", { required: true })} placeholder="/contact" />
      </label>
      <h4>Secondary button</h4>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Label
          <CharacterCount current={(secondaryLabel ?? "").length} max={limits.secondaryLabel} />
        </div>
        <input
          {...register("secondaryAction.label", {
            maxLength: limits.secondaryLabel,
          })}
          maxLength={limits.secondaryLabel}
        />
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
