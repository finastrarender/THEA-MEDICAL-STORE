"use client";

import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import CharacterCount from "@/components/admin/CharacterCount";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";
import {
  theaAboutHeroDefaults,
  theaAboutFooterDefaults,
  theaAboutInquiryDefaults,
  theaAboutLeadershipDefaults,
  theaAboutMissionDefaults,
  theaAboutRegulatoryDefaults,
} from "@/data/thea-about-sections";
import {
  aboutHeroLimits,
  aboutMissionLimits,
  aboutLeadershipLimits,
  aboutRegulatoryLimits,
  aboutInquiryLimits,
} from "@/lib/seeded-lengths";

type SectionFormProps = {
  section: { id: string; type: string; order: number; data: Record<string, unknown> };
  onSave: (data: Record<string, unknown>) => void;
  previewHref: string;
  saveMessage?: string | null;
  saveMessageTone?: "success" | "error";
};

const MISSION_ICONS = [
  { value: "rocket", label: "Rocket (Our Mission)" },
  { value: "eye", label: "Eye (Our Vision)" },
  { value: "values", label: "Badge with checkmark (Core Values)" },
] as const;
const REGULATORY_ICONS = [
  { value: "shield", label: "Shield with checkmark (MOHAP Licensed)" },
  { value: "clipboard", label: "Clipboard with checkmark (Cold Chain)" },
] as const;
const HIGHLIGHT_ACCENTS = ["teal", "blue"] as const;

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

export function AboutHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      eyebrow: (section.data.eyebrow as string) ?? theaAboutHeroDefaults.eyebrow,
      titleLead: (section.data.titleLead as string) ?? theaAboutHeroDefaults.titleLead,
      titleHighlight:
        (section.data.titleHighlight as string) ?? theaAboutHeroDefaults.titleHighlight,
      titleAfter: (section.data.titleAfter as string) ?? theaAboutHeroDefaults.titleAfter,
      description: (section.data.description as string) ?? theaAboutHeroDefaults.description,
      highlights:
        ((section.data.highlights as typeof theaAboutHeroDefaults.highlights) ?? []).length > 0
          ? (section.data.highlights as typeof theaAboutHeroDefaults.highlights)
          : theaAboutHeroDefaults.highlights,
      quote: (section.data.quote as string) ?? theaAboutHeroDefaults.quote,
      quoteAttribution:
        (section.data.quoteAttribution as string) ?? theaAboutHeroDefaults.quoteAttribution,
      image: (section.data.image as string) ?? "",
    }),
    [section.data],
  );

  const { register, setValue, watch, control, handleSubmit, formState: { isSubmitting } } =
    useForm({ defaultValues });

  const limits = useMemo(() => ({
    eyebrow: Math.max(aboutHeroLimits.eyebrow, defaultValues.eyebrow.length),
    titleLead: Math.max(aboutHeroLimits.titleLead, defaultValues.titleLead.length),
    titleHighlight: Math.max(aboutHeroLimits.titleHighlight, defaultValues.titleHighlight.length),
    titleAfter: Math.max(aboutHeroLimits.titleAfter, defaultValues.titleAfter.length),
    description: Math.max(aboutHeroLimits.description, defaultValues.description.length),
    quote: Math.max(aboutHeroLimits.quote, defaultValues.quote.length),
    quoteAttribution: Math.max(aboutHeroLimits.quoteAttribution, defaultValues.quoteAttribution.length),
  }), [defaultValues]);

  const { fields } = useFieldArray({ control, name: "highlights" });
  const image = watch("image");

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Eyebrow
          <CharacterCount current={watch("eyebrow").length} max={limits.eyebrow} warningAt={limits.eyebrow - 10} />
        </div>
        <input
          {...register("eyebrow", {
            required: true,
            maxLength: limits.eyebrow,
          })}
          maxLength={limits.eyebrow}
          placeholder="ESTABLISHED IN DUBAI"
        />
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title (before highlight)
          <CharacterCount current={watch("titleLead").length} max={limits.titleLead} warningAt={limits.titleLead - 10} />
        </div>
        <input
          {...register("titleLead", {
            required: true,
            maxLength: limits.titleLead,
          })}
          maxLength={limits.titleLead}
          placeholder="Precision in "
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Highlighted word
          <CharacterCount current={watch("titleHighlight").length} max={limits.titleHighlight} warningAt={limits.titleHighlight - 10} />
        </div>
        <input
          {...register("titleHighlight", {
            required: true,
            maxLength: limits.titleHighlight,
          })}
          maxLength={limits.titleHighlight}
          placeholder="Medical"
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title (after highlight)
          <CharacterCount current={watch("titleAfter").length} max={limits.titleAfter} warningAt={limits.titleAfter - 10} />
        </div>
        <input
          {...register("titleAfter", {
            required: true,
            maxLength: limits.titleAfter,
          })}
          maxLength={limits.titleAfter}
          placeholder="Supply Chain."
        />
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description
          <CharacterCount current={watch("description").length} max={limits.description} warningAt={limits.description - 50} />
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

      <h4>Highlight cards</h4>
      {fields.map((field, index) => (
        <fieldset key={field.id} style={{ marginBottom: 16, padding: 12, border: "1px solid #e2e8f0" }}>
          <legend>Card {index + 1}</legend>
          <label>
            Title
            <input {...register(`highlights.${index}.title`, { required: true })} />
          </label>
          <label>
            Subtitle
            <input {...register(`highlights.${index}.subtitle`, { required: true })} />
          </label>
          <label>
            Accent border
            <select {...register(`highlights.${index}.accent`)}>
              {HIGHLIGHT_ACCENTS.map((accent) => (
                <option key={accent} value={accent}>
                  {accent}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
      ))}

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Quote
          <CharacterCount current={watch("quote").length} max={limits.quote} warningAt={limits.quote - 20} />
        </div>
        <textarea
          rows={3}
          {...register("quote", {
            required: true,
            maxLength: limits.quote,
          })}
          maxLength={limits.quote}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Quote attribution
          <CharacterCount current={watch("quoteAttribution").length} max={limits.quoteAttribution} warningAt={limits.quoteAttribution - 10} />
        </div>
        <input
          {...register("quoteAttribution", {
            required: true,
            maxLength: limits.quoteAttribution,
          })}
          maxLength={limits.quoteAttribution}
          placeholder="EXECUTIVE BOARD"
        />
      </label>

      <input type="hidden" {...register("image")} />
      <ImageUploadField
        label="Hero image"
        value={image}
        onChange={(value) => setValue("image", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
        placeholder="Upload clinical environment photo"
        minWidth={1200}
        minHeight={800}
        aspectRatio={1.5}
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

type MissionCard = {
  icon: string;
  title: string;
  description?: string;
  bullets?: string[];
};

export function AboutMissionSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(() => {
    const cards = (section.data.cards as MissionCard[] | undefined) ?? [];
    if (cards.length > 0) {
      return { cards };
    }
    return { cards: theaAboutMissionDefaults.cards };
  }, [section.data]);

  const { register, control, setValue, watch, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
  });

  const limits = useMemo(() => ({
    cardTitle: Math.max(aboutMissionLimits.cardTitle, defaultValues.cards.reduce((max, c) => Math.max(max, c.title.length), 0)),
  }), [defaultValues]);

  const { fields } = useFieldArray({ control, name: "cards" });

  function handleValid(values: typeof defaultValues) {
    onSave({
      cards: values.cards.map((card) => {
        const bullets =
          card.bullets && card.bullets.filter((b) => b.trim()).length > 0
            ? card.bullets.filter((b) => b.trim())
            : undefined;
        const description = card.description?.trim() || undefined;
        return {
          icon: card.icon,
          title: card.title,
          ...(bullets ? { bullets } : { description }),
        };
      }),
    });
  }

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      {fields.map((field, index) => (
        <fieldset key={field.id} style={{ marginBottom: 20, padding: 12, border: "1px solid #e2e8f0" }}>
          <legend>Card {index + 1}</legend>
          <label>
            Icon
            <select {...register(`cards.${index}.icon`)}>
              {MISSION_ICONS.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              Title
              <CharacterCount current={(watch(`cards.${index}.title`) ?? "").length} max={limits.cardTitle} />
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
            Description (leave empty if using bullets)
            <textarea rows={3} {...register(`cards.${index}.description`)} />
          </label>
          <label>
            Bullets (one per line, for Core Values)
            <textarea
              rows={4}
              defaultValue={defaultValues.cards[index]?.bullets?.join("\n") ?? ""}
              onBlur={(e) => {
                setValue(
                  `cards.${index}.bullets`,
                  e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                  { shouldDirty: true },
                );
              }}
            />
          </label>
        </fieldset>
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

type LeaderMember = { name: string; role: string; bio: string; image?: string };

type LeadershipFormValues = {
  title: string;
  description: string;
  members: LeaderMember[];
};

export function AboutLeadershipSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? theaAboutLeadershipDefaults.title,
      description:
        (section.data.description as string) ?? theaAboutLeadershipDefaults.description,
      members:
        ((section.data.members as LeaderMember[]) ?? []).length > 0
          ? (section.data.members as LeaderMember[])
          : theaAboutLeadershipDefaults.members,
    }),
    [section.data],
  );

  const { register, setValue, watch, control, handleSubmit, formState: { isSubmitting } } =
    useForm<LeadershipFormValues>({ defaultValues });

  const limits = useMemo(() => ({
    title: Math.max(aboutLeadershipLimits.title, defaultValues.title.length),
    description: Math.max(aboutLeadershipLimits.description, defaultValues.description.length),
    memberName: Math.max(aboutLeadershipLimits.memberName, defaultValues.members.reduce((max, m) => Math.max(max, m.name.length), 0)),
    memberRole: Math.max(aboutLeadershipLimits.memberRole, defaultValues.members.reduce((max, m) => Math.max(max, m.role.length), 0)),
    memberBio: Math.max(aboutLeadershipLimits.memberBio, defaultValues.members.reduce((max, m) => Math.max(max, m.bio.length), 0)),
  }), [defaultValues]);

  const { fields } = useFieldArray({ control, name: "members" });
  const membersWatch = watch("members");
  const title = watch("title");
  const description = watch("description");

  function handleValid(values: LeadershipFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      members: values.members.map((m) => ({
        name: m.name,
        role: m.role,
        bio: m.bio,
        image: m.image?.trim() || "",
      })),
    });
  }

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
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
          Subtitle
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

      {fields.map((field, index) => (
        <fieldset key={field.id} style={{ marginBottom: 20, padding: 12, border: "1px solid #e2e8f0" }}>
          <legend>Team member {index + 1}</legend>
          <input type="hidden" {...register(`members.${index}.image`)} />
          <ImageUploadField
            label="Photo (grayscale recommended)"
            value={membersWatch[index]?.image ?? ""}
            onChange={(value) => setValue(`members.${index}.image`, value, { shouldDirty: true })}
            folder={`sections/${section.type}`}
          />
          <label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              Name
              <CharacterCount current={(membersWatch[index]?.name ?? "").length} max={limits.memberName} />
            </div>
            <input
              {...register(`members.${index}.name` as const, {
                required: true,
                maxLength: limits.memberName,
              })}
              maxLength={limits.memberName}
            />
          </label>
          <label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              Role (shown in caps)
              <CharacterCount current={(membersWatch[index]?.role ?? "").length} max={limits.memberRole} />
            </div>
            <input
              {...register(`members.${index}.role` as const, {
                required: true,
                maxLength: limits.memberRole,
              })}
              maxLength={limits.memberRole}
            />
          </label>
          <label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              Bio
              <CharacterCount current={(membersWatch[index]?.bio ?? "").length} max={limits.memberBio} />
            </div>
            <input
              {...register(`members.${index}.bio` as const, {
                required: true,
                maxLength: limits.memberBio,
              })}
              maxLength={limits.memberBio}
            />
          </label>
        </fieldset>
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

type RegulatoryItem = { icon?: string; title: string; description: string };

type RegulatoryFormValues = {
  title: string;
  description: string;
  mohapLogo: string;
  isoLine1: string;
  isoLine2: string;
  guaranteeTitle: string;
  guaranteeText: string;
  items: RegulatoryItem[];
};

export function AboutRegulatorySectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? theaAboutRegulatoryDefaults.title,
      description: (section.data.description as string) ?? "",
      mohapLogo: (section.data.mohapLogo as string) ?? "",
      isoLine1: (section.data.isoLine1 as string) ?? theaAboutRegulatoryDefaults.isoLine1,
      isoLine2: (section.data.isoLine2 as string) ?? theaAboutRegulatoryDefaults.isoLine2,
      guaranteeTitle:
        (section.data.guaranteeTitle as string) ?? theaAboutRegulatoryDefaults.guaranteeTitle,
      guaranteeText:
        (section.data.guaranteeText as string) ?? theaAboutRegulatoryDefaults.guaranteeText,
      items:
        ((section.data.items as RegulatoryItem[]) ?? []).length > 0
          ? (section.data.items as RegulatoryItem[])
          : theaAboutRegulatoryDefaults.items,
    }),
    [section.data],
  );

  const { register, setValue, watch, control, handleSubmit, formState: { isSubmitting } } =
    useForm<RegulatoryFormValues>({ defaultValues });

  const limits = useMemo(() => ({
    title: Math.max(aboutRegulatoryLimits.title, defaultValues.title.length),
    isoLine1: Math.max(aboutRegulatoryLimits.isoLine1, defaultValues.isoLine1.length),
    isoLine2: Math.max(aboutRegulatoryLimits.isoLine2, defaultValues.isoLine2.length),
    guaranteeTitle: Math.max(aboutRegulatoryLimits.guaranteeTitle, defaultValues.guaranteeTitle.length),
    guaranteeText: Math.max(aboutRegulatoryLimits.guaranteeText, defaultValues.guaranteeText.length),
  }), [defaultValues]);

  const { fields } = useFieldArray({ control, name: "items" });
  const mohapLogo = watch("mohapLogo");
  const title = watch("title");
  const isoLine1 = watch("isoLine1");
  const isoLine2 = watch("isoLine2");
  const guaranteeTitle = watch("guaranteeTitle");
  const guaranteeText = watch("guaranteeText");

  function handleValid(values: RegulatoryFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      mohapLogo: values.mohapLogo,
      isoLine1: values.isoLine1,
      isoLine2: values.isoLine2,
      guaranteeTitle: values.guaranteeTitle,
      guaranteeText: values.guaranteeText,
      items: values.items,
    });
  }

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
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
        Optional intro (hidden when empty)
        <textarea rows={2} {...register("description")} />
      </label>

      <input type="hidden" {...register("mohapLogo")} />
      <ImageUploadField
        label="MOHAP / certification logo"
        value={mohapLogo}
        onChange={(value) => setValue("mohapLogo", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
      />

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          ISO line 1
          <CharacterCount current={(isoLine1 ?? "").length} max={limits.isoLine1} />
        </div>
        <input
          {...register("isoLine1", {
            required: true,
            maxLength: limits.isoLine1,
          })}
          maxLength={limits.isoLine1}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          ISO line 2
          <CharacterCount current={(isoLine2 ?? "").length} max={limits.isoLine2} />
        </div>
        <input
          {...register("isoLine2", {
            required: true,
            maxLength: limits.isoLine2,
          })}
          maxLength={limits.isoLine2}
        />
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Guarantee card title
          <CharacterCount current={guaranteeTitle.length} max={limits.guaranteeTitle} />
        </div>
        <input
          {...register("guaranteeTitle", {
            required: true,
            maxLength: limits.guaranteeTitle,
          })}
          maxLength={limits.guaranteeTitle}
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Guarantee card text
          <CharacterCount current={guaranteeText.length} max={limits.guaranteeText} />
        </div>
        <textarea
          rows={4}
          {...register("guaranteeText", {
            required: true,
            maxLength: limits.guaranteeText,
          })}
          maxLength={limits.guaranteeText}
        />
      </label>

      <h4>Certification items</h4>
      {fields.map((field, index) => (
        <fieldset key={field.id} style={{ marginBottom: 16, padding: 12, border: "1px solid #e2e8f0" }}>
          <legend>Item {index + 1}</legend>
          <label>
            Icon
            <select {...register(`items.${index}.icon`)}>
              {REGULATORY_ICONS.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Title
            <input {...register(`items.${index}.title`, { required: true })} />
          </label>
          <label>
            Description
            <textarea rows={2} {...register(`items.${index}.description`, { required: true })} />
          </label>
        </fieldset>
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

const INQUIRY_CONTACT_ICONS = [
  { value: "phone", label: "Phone" },
  { value: "mail", label: "Email" },
  { value: "clock", label: "Hours" },
] as const;

type InquiryContact = {
  icon: "phone" | "mail" | "clock";
  label: string;
  value: string;
  note?: string;
};

type AboutInquiryFormValues = {
  title: string;
  description: string;
  submitLabel: string;
  contactCardTitle: string;
  requestOptions: string[];
  contacts: InquiryContact[];
  map: {
    title: string;
    subtitle: string;
    mapImage?: string;
    linkHref?: string;
  };
  formFields: Record<string, string>;
};

export function AboutInquirySectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo((): AboutInquiryFormValues => {
    const mapData = section.data.map as AboutInquiryFormValues["map"] | undefined;
    const formFieldsData = section.data.formFields as Record<string, string> | undefined;
    return {
      title: (section.data.title as string) ?? theaAboutInquiryDefaults.title,
      description: (section.data.description as string) ?? theaAboutInquiryDefaults.description,
      submitLabel: (section.data.submitLabel as string) ?? theaAboutInquiryDefaults.submitLabel,
      contactCardTitle:
        (section.data.contactCardTitle as string) ?? theaAboutInquiryDefaults.contactCardTitle,
      requestOptions:
        ((section.data.requestOptions as string[]) ?? []).length > 0
          ? (section.data.requestOptions as string[])
          : [...theaAboutInquiryDefaults.requestOptions],
      contacts:
        ((section.data.contacts as InquiryContact[]) ?? []).length > 0
          ? (section.data.contacts as InquiryContact[])
          : theaAboutInquiryDefaults.contacts.map((c) => ({ ...c })),
      map: {
        ...theaAboutInquiryDefaults.map,
        ...mapData,
      },
      formFields: {
        ...theaAboutInquiryDefaults.formFields,
        ...formFieldsData,
      },
    };
  }, [section.data]);

  const { register, setValue, watch, control, handleSubmit, formState: { isSubmitting } } =
    useForm<AboutInquiryFormValues>({ defaultValues });

  const limits = useMemo(() => ({
    title: Math.max(25, defaultValues.title.length),
    description: Math.max(aboutInquiryLimits.description, defaultValues.description.length),
    submitLabel: Math.max(aboutInquiryLimits.submitLabel, defaultValues.submitLabel.length),
  }), [defaultValues]);

  const { fields: contactFields } = useFieldArray<AboutInquiryFormValues, "contacts">({
    control,
    name: "contacts",
  });
  const requestOptions = watch("requestOptions");
  const mapImage = watch("map.mapImage");
  const title = watch("title");
  const description = watch("description");
  const submitLabel = watch("submitLabel");

  function handleValid(values: AboutInquiryFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      submitLabel: values.submitLabel,
      contactCardTitle: values.contactCardTitle,
      requestOptions: values.requestOptions.filter((o) => o.trim()),
      contacts: values.contacts,
      map: values.map,
      formFields: values.formFields,
    });
  }

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Section title
        <input {...register("title", { required: true })} />
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
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Submit button label
          <CharacterCount current={submitLabel.length} max={limits.submitLabel} />
        </div>
        <input
          {...register("submitLabel", {
            required: true,
            maxLength: limits.submitLabel,
          })}
          maxLength={limits.submitLabel}
        />
      </label>

      <h4>Form labels &amp; placeholders</h4>
      <label>
        Full name label
        <input {...register("formFields.fullNameLabel")} />
      </label>
      <label>
        Full name placeholder
        <input {...register("formFields.fullNamePlaceholder")} />
      </label>
      <label>
        Email label
        <input {...register("formFields.emailLabel")} />
      </label>
      <label>
        Email placeholder
        <input {...register("formFields.emailPlaceholder")} />
      </label>
      <label>
        Facility label
        <input {...register("formFields.facilityLabel")} />
      </label>
      <label>
        Facility placeholder
        <input {...register("formFields.facilityPlaceholder")} />
      </label>
      <label>
        Department label
        <input {...register("formFields.departmentLabel")} />
      </label>
      <label>
        Department placeholder
        <input {...register("formFields.departmentPlaceholder")} />
      </label>
      <label>
        Request type label
        <input {...register("formFields.requestTypeLabel")} />
      </label>
      <label>
        Message label
        <input {...register("formFields.messageLabel")} />
      </label>
      <label>
        Message placeholder
        <textarea rows={2} {...register("formFields.messagePlaceholder")} />
      </label>
      <label>
        Success message
        <input {...register("formFields.successMessage")} />
      </label>
      <label>
        Error message
        <input {...register("formFields.errorMessage")} />
      </label>

      <h4>Request type options</h4>
      {requestOptions.map((_, index) => (
        <div key={`request-option-${index}`} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input {...register(`requestOptions.${index}`, { required: true })} style={{ flex: 1 }} />
          <button
            type="button"
            onClick={() =>
              setValue(
                "requestOptions",
                requestOptions.filter((_, i) => i !== index),
                { shouldDirty: true },
              )
            }
            disabled={requestOptions.length <= 1}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setValue("requestOptions", [...requestOptions, "New option"], { shouldDirty: true })
        }
        style={{ marginBottom: 16 }}
      >
        Add request type
      </button>

      <h4>Direct contact card</h4>
      <label>
        Card title
        <input {...register("contactCardTitle", { required: true })} />
      </label>
      {contactFields.map((field, index) => (
        <fieldset key={field.id} style={{ marginBottom: 16, padding: 12, border: "1px solid #e2e8f0" }}>
          <legend>Contact {index + 1}</legend>
          <label>
            Icon
            <select {...register(`contacts.${index}.icon`)}>
              {INQUIRY_CONTACT_ICONS.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Label (uppercase)
            <input {...register(`contacts.${index}.label`, { required: true })} />
          </label>
          <label>
            Value
            <input {...register(`contacts.${index}.value`, { required: true })} />
          </label>
          <label>
            Note (optional, e.g. 24/7 support)
            <input {...register(`contacts.${index}.note`)} />
          </label>
        </fieldset>
      ))}

      <h4>Map card</h4>
      <input type="hidden" {...register("map.mapImage")} />
      <ImageUploadField
        label="Map image (optional)"
        value={mapImage ?? ""}
        onChange={(value) => setValue("map.mapImage", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
      />
      <label>
        Location title
        <input {...register("map.title", { required: true })} />
      </label>
      <label>
        Location subtitle
        <input {...register("map.subtitle", { required: true })} />
      </label>
      <label>
        Map link (Google Maps)
        <input {...register("map.linkHref")} placeholder="https://maps.google.com/..." />
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

type FooterLink = { label: string; href: string };

export function AboutFooterSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      brand: (section.data.brand as string) ?? theaAboutFooterDefaults.brand,
      description: (section.data.description as string) ?? theaAboutFooterDefaults.description,
      productsTitle:
        (section.data.productsTitle as string) ?? theaAboutFooterDefaults.productsTitle,
      productLinks:
        ((section.data.productLinks as FooterLink[]) ?? []).length > 0
          ? (section.data.productLinks as FooterLink[])
          : theaAboutFooterDefaults.productLinks,
      inquiriesTitle:
        (section.data.inquiriesTitle as string) ?? theaAboutFooterDefaults.inquiriesTitle,
      phone: (section.data.phone as string) ?? theaAboutFooterDefaults.phone,
      email: (section.data.email as string) ?? theaAboutFooterDefaults.email,
      headquartersTitle:
        (section.data.headquartersTitle as string) ?? theaAboutFooterDefaults.headquartersTitle,
      location: (section.data.location as string) ?? theaAboutFooterDefaults.location,
      copyright: (section.data.copyright as string) ?? theaAboutFooterDefaults.copyright,
    }),
    [section.data],
  );

  const { register, control, watch, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
  });

  const limits = useMemo(() => ({
    brand: Math.max(defaultValues.brand.length, 40),
    description: Math.max(defaultValues.description.length, 300),
  }), [defaultValues]);

  const { fields, append, remove } = useFieldArray({ control, name: "productLinks" });

  function handleValid(values: typeof defaultValues) {
    onSave(values);
  }

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Brand name
          <CharacterCount current={watch("brand").length} max={limits.brand} warningAt={limits.brand - 10} />
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
          <CharacterCount current={watch("description").length} max={limits.description} warningAt={limits.description - 50} />
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
        Products column title
        <input {...register("productsTitle", { required: true })} />
      </label>
      <h4>Product links</h4>
      {fields.map((field, index) => (
        <div key={field.id} style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <input {...register(`productLinks.${index}.label`, { required: true })} placeholder="Label" />
          <input {...register(`productLinks.${index}.href`, { required: true })} placeholder="/products" style={{ flex: 1, minWidth: 140 }} />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ label: "New product", href: "/products" })}
        style={{ marginBottom: 16 }}
      >
        Add product link
      </button>

      <label>
        Inquiries column title
        <input {...register("inquiriesTitle", { required: true })} />
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
        Headquarters column title
        <input {...register("headquartersTitle", { required: true })} />
      </label>
      <label>
        Location
        <input {...register("location", { required: true })} />
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
