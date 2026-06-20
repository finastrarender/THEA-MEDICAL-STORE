"use client";

import {
  useEffect,
  useMemo,
  useRef,
  type FormHTMLAttributes,
  type RefObject,
} from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import CharacterCount from "@/components/admin/CharacterCount";
import ContactHqIconPicker from "@/components/admin/ContactHqIconPicker";
import ProjectsIntegrityIconPicker from "@/components/admin/ProjectsIntegrityIconPicker";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";
import IconPicker, { HOME_SERVICE_CARD_ICON_OPTIONS } from "./IconPicker";
import {
  introLimits,
  servicesLimits,
  servicesGridLimits,
  capabilityCardsLimits,
  homeAboutLimits,
  trustedByLimits,
  whyChooseLimits,
  productCategoriesLimits,
  qualityGridLimits,
  ctaSectionLimits,
} from "@/lib/seeded-lengths";

type SectionRow = {
  id: string;
  type: string;
  order: number;
  data: Record<string, unknown>;
};

type SectionFormProps = {
  section: SectionRow;
  onSave: (data: Record<string, unknown>) => void;
  previewHref: string;
  saveMessage?: string | null;
  saveMessageTone?: "success" | "error";
};

function SectionHeading({ section }: { section: SectionRow }) {
  return (
    <h3>
      {section.type}{" "}
      <span className="admin-muted" style={{ fontWeight: 400 }}>
        (order {section.order}, id {section.id})
      </span>
    </h3>
  );
}

function FieldHint({ children }: { children: string }) {
  return <p className="admin-field-hint">{children}</p>;
}

function getFieldHintFromLabel(labelText: string) {
  const key = labelText.toLowerCase().replace(/\s+/g, " ").trim();
  if (!key) return null;

  if (key.includes("eyebrow"))
    return "Short intro text shown above the main heading.";
  if (key.includes("badge")) return "A compact tag line shown above the title.";
  if (key.includes("title lines") || key.includes("heading lines")) {
    return "Add one line per row. Each line renders as a separate heading line.";
  }
  if (key.includes("title")) return "Main title text shown for this block.";
  if (key.includes("description lines"))
    return "Use one line per row for multiple description points.";
  if (key.includes("description"))
    return "Write a concise supporting paragraph for this section.";
  if (
    key.includes("subheading") ||
    key.includes("subtitle") ||
    key.includes("subtext")
  ) {
    return "Supporting text shown under the main heading.";
  }
  if (
    key.includes("highlights") ||
    key.includes("points") ||
    key.includes("features")
  ) {
    return "Add one item per line for a clean bullet-style layout.";
  }
  if (key.includes("filter"))
    return "Add one filter label per line (include an All option if needed).";
  if (key.includes("category"))
    return "Use a category that matches one of your filter labels.";
  if (key.includes("stat"))
    return "Short metric text, like 120+ clients or 15 years.";
  if (key.includes("icon"))
    return "Choose an icon that best matches this content item.";
  if (key.includes("caption"))
    return "Small text shown near or under the image.";
  if (
    key.includes("action label") ||
    key.includes("cta label") ||
    key === "label"
  ) {
    return "Button text users will see and click.";
  }
  if (key.includes("href") || key.includes("url")) {
    return "Use a valid route like /contact or a full URL like https://example.com.";
  }
  if (key.includes("image"))
    return "Upload or paste a clear image URL for this section.";
  if (key.includes("form title"))
    return "Heading shown above the contact form.";
  if (key.includes("form description"))
    return "Short helper text shown before form fields.";
  if (key.includes("submit label")) return "Text shown on the submit button.";
  if (key.includes("office"))
    return "Office details shown in the contact information block.";
  if (key.includes("map"))
    return "Map image or label shown near the location details.";
  if (key.includes("quote")) return "Quote content shown as testimonial text.";

  return "Enter a clear value that matches this field's purpose.";
}

function useAutoFieldHints(formRef: RefObject<HTMLFormElement | null>) {
  useEffect(() => {
    const formEl = formRef.current;
    if (!formEl) return;

    const applyHints = () => {
      const labels = formEl.querySelectorAll("label");
      labels.forEach((label) => {
        if (label.querySelector(".admin-field-hint")) return;
        if (!label.querySelector("input, textarea, select, .admin-icon-picker"))
          return;

        const ownText = Array.from(label.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent ?? "")
          .join(" ")
          .trim();
        const normalizedLabel = (ownText || label.textContent || "")
          .replace(/\s+/g, " ")
          .trim();
        const hintText = getFieldHintFromLabel(normalizedLabel);
        if (!hintText) return;

        const hint = document.createElement("p");
        hint.className = "admin-field-hint";
        hint.dataset.autoHint = "true";
        hint.textContent = hintText;

        const error = label.querySelector(".admin-field-error");
        if (error) {
          label.insertBefore(hint, error);
          return;
        }
        label.appendChild(hint);
      });
    };

    applyHints();
    const observer = new MutationObserver(() => applyHints());
    observer.observe(formEl, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [formRef]);
}

function SectionForm(props: FormHTMLAttributes<HTMLFormElement>) {
  const formRef = useRef<HTMLFormElement>(null);
  useAutoFieldHints(formRef);
  return <form ref={formRef} {...props} />;
}

type IntroFormValues = {
  titleLines: string;
  description: string;
  more: string;
  statsLines: string;
  cardLabel: string;
  cardDescription: string;
  cardLinkLabel: string;
  cardHref: string;
};

function toIntroDefaultValues(data: Record<string, unknown>): IntroFormValues {
  const stats = Array.isArray(data.stats)
    ? (data.stats as Array<{ value?: string; label?: string }>)
      .map((s) => `${s.value ?? ""} | ${s.label ?? ""}`)
      .join("\n")
    : "UAE | JURISDICTION\nRAK | ECONOMIC ZONE";

  return {
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    more: (data.more as string) ?? "",
    statsLines: stats,
    cardLabel: (data.cardLabel as string) ?? "",
    cardDescription: (data.cardDescription as string) ?? "",
    cardLinkLabel: (data.cardLinkLabel as string) ?? "",
    cardHref: (data.cardHref as string) ?? "/about",
  };
}

export function IntroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIntroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IntroFormValues>({ defaultValues });

  const titleLines = watch("titleLines");
  const description = watch("description");
  const more = watch("more");
  const cardLabel = watch("cardLabel");
  const cardDescription = watch("cardDescription");
  const cardLinkLabel = watch("cardLinkLabel");

  const limits = useMemo(() => ({
    titleLines: Math.max(introLimits.titleLines, defaultValues.titleLines.length),
    description: Math.max(introLimits.description, defaultValues.description.length),
    more: Math.max(introLimits.more, defaultValues.more.length),
    cardLabel: Math.max(introLimits.cardLabel, defaultValues.cardLabel.length),
    cardDescription: Math.max(introLimits.cardDescription, defaultValues.cardDescription.length),
    cardLinkLabel: Math.max(introLimits.cardLinkLabel, defaultValues.cardLinkLabel.length),
  }), [defaultValues]);

  function handleValid(values: IntroFormValues) {
    const stats = values.statsLines
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [value, label] = line.split("|").map((part) => part.trim());
        return { value: value ?? "", label: label ?? "" };
      })
      .filter((s) => s.value && s.label);

    onSave({
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      more: values.more,
      stats,
      cardLabel: values.cardLabel,
      cardDescription: values.cardDescription,
      cardLinkLabel: values.cardLinkLabel,
      cardHref: values.cardHref,
      highlights: [],
      image: "",
      href: values.cardHref,
      expcount: 0,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title lines (one per line)
          <CharacterCount current={titleLines.length} max={limits.titleLines} />
        </div>
        <textarea
          rows={2}
          {...register("titleLines", {
            required: "Title is required",
            maxLength: limits.titleLines,
          })}
          maxLength={limits.titleLines}
          placeholder={"The Foundation of\nDigital Trust"}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description (paragraph 1)
          <CharacterCount current={description.length} max={limits.description} />
        </div>
        <textarea
          rows={4}
          {...register("description", {
            required: "Description is required",
            maxLength: limits.description,
          })}
          maxLength={limits.description}
          placeholder="Cryptonexis Limited stands at the forefront of the UAE's evolving digital economy..."
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description (paragraph 2)
          <CharacterCount current={more.length} max={limits.more} />
        </div>
        <textarea
          rows={4}
          {...register("more", { maxLength: limits.more })}
          maxLength={limits.more}
          placeholder="Our approach is built on three core pillars..."
        />
      </label>

      <label>
        Stats (one per line: VALUE | LABEL)
        <textarea
          rows={2}
          {...register("statsLines")}
          placeholder={"UAE | JURISDICTION\nRAK | ECONOMIC ZONE"}
        />
      </label>

      <h4>Licensing card</h4>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Card label
          <CharacterCount current={cardLabel.length} max={limits.cardLabel} />
        </div>
        <input
          {...register("cardLabel", { maxLength: limits.cardLabel })}
          maxLength={limits.cardLabel}
          placeholder="LICENSING AUTHORITY"
        />
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Card description
          <CharacterCount current={cardDescription.length} max={limits.cardDescription} />
        </div>
        <textarea
          rows={3}
          {...register("cardDescription", { maxLength: limits.cardDescription })}
          maxLength={limits.cardDescription}
          placeholder="Cryptonexis Limited is registered and regulated within the RAK Economic Zone..."
        />
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Card link label
          <CharacterCount current={cardLinkLabel.length} max={limits.cardLinkLabel} />
        </div>
        <input
          {...register("cardLinkLabel", { maxLength: limits.cardLinkLabel })}
          maxLength={limits.cardLinkLabel}
          placeholder="REVIEW CERTIFICATION"
        />
      </label>

      <label>
        Card link URL
        <input {...register("cardHref")} placeholder="/about" />
      </label>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ServiceCardFormValue = {
  icon: string;
  title: string;
  description: string;
  category: string;
  iconImage: string;
};

type ServicesFormValues = {
  eyebrow: string;
  title: string;
  description: string;
  backgroundImage: string;
  cards: ServiceCardFormValue[];
};

function toServicesDefaultValues(
  data: Record<string, unknown>,
): ServicesFormValues {
  const rawCards = Array.isArray(data.cards)
    ? (data.cards as Record<string, unknown>[])
    : [];

  return {
    eyebrow: (data.eyebrow as string) ?? "",
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    backgroundImage: (data.backgroundImage as string) ?? "",
    cards:
      rawCards.length > 0
        ? rawCards.map((card) => ({
          icon: (card.icon as string) ?? "spark",
          title: (card.title as string) ?? "",
          description: (card.description as string) ?? "",
          category: (card.category as string) ?? "",
          iconImage: (card.iconImage as string) ?? "",
        }))
        : [{ icon: "spark", title: "", description: "", category: "", iconImage: "" }],
  };
}

export function ServicesSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServicesFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "cards" });

  const eyebrow = watch("eyebrow") ?? "";
  const title = watch("title") ?? "";
  const description = watch("description") ?? "";
  const cards = watch("cards");

  const limits = useMemo(() => ({
    eyebrow: Math.max(servicesLimits.eyebrow, defaultValues.eyebrow.length),
    title: Math.max(servicesLimits.title, defaultValues.title.length),
    description: Math.max(servicesLimits.description, defaultValues.description.length),
    cardTitle: Math.max(servicesLimits.cardTitle, defaultValues.cards.reduce((max, c) => Math.max(max, c.title.length), 0)),
    cardDescription: Math.max(servicesLimits.cardDescription, defaultValues.cards.reduce((max, c) => Math.max(max, c.description.length), 0)),
  }), [defaultValues]);

  const iconOptionLabels: Record<string, string> = {
    shield: "Cybersecurity (shield)",
    nodes: "Data & Cloud (network)",
    terminal: "Software & Development (terminal)",
    sync: "Consulting & Training (sync)",
    security: "Security",
    online: "Cloud / online",
    innovation: "Innovation",
    corporate: "Corporate",
  };

  function handleValid(values: ServicesFormValues) {
    onSave({
      eyebrow: values.eyebrow,
      title: values.title,
      description: values.description,
      backgroundImage: values.backgroundImage,
      cards: values.cards.map((card) => ({
        icon: card.icon,
        title: card.title,
        description: card.description,
        category: card.category,
        iconImage: card.iconImage,
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Eyebrow
          <CharacterCount current={eyebrow.length} max={limits.eyebrow} />
        </div>
        <input
          {...register("eyebrow", {
            required: "Eyebrow is required",
            maxLength: limits.eyebrow,
          })}
          maxLength={limits.eyebrow}
          placeholder="OUR CAPABILITIES"
        />
        {errors.eyebrow ? (
          <p className="admin-field-error">{errors.eyebrow.message}</p>
        ) : null}
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title
          <CharacterCount current={title.length} max={limits.title} />
        </div>
        <input
          {...register("title", {
            required: "Title is required",
            maxLength: limits.title,
          })}
          maxLength={limits.title}
          placeholder="CORE PILLARS"
        />
        <FieldHint>Main heading for this services block.</FieldHint>
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Description
          <CharacterCount current={description.length} max={limits.description} />
        </div>
        <textarea
          rows={4}
          {...register("description", {
            required: "Description is required",
            maxLength: limits.description,
          })}
          maxLength={limits.description}
          placeholder="Briefly describe your service offering and value."
        />
        <FieldHint>Use a short summary that supports the heading.</FieldHint>
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div className="admin-section-group">
        <h4>Service cards</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="admin-section-card">
            <label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                Card title
                <CharacterCount current={(cards?.[index]?.title ?? "").length} max={limits.cardTitle} />
              </div>
              <input
                {...register(`cards.${index}.title`, {
                  required: "Card title is required",
                  maxLength: limits.cardTitle,
                })}
                maxLength={limits.cardTitle}
                placeholder="Business Setup"
              />
              <FieldHint>Short name of this service card.</FieldHint>
            </label>
            <label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                Card description
                <CharacterCount current={(cards?.[index]?.description ?? "").length} max={limits.cardDescription} />
              </div>
              <textarea
                rows={3}
                {...register(`cards.${index}.description`, {
                  required: "Card description is required",
                  maxLength: limits.cardDescription,
                })}
                maxLength={limits.cardDescription}
                placeholder="Describe what this service includes."
              />
              <FieldHint>1-2 lines explaining this service.</FieldHint>
            </label>
            <label>
              Icon
              <Controller
                control={control}
                name={`cards.${index}.icon`}
                rules={{ required: "Icon is required" }}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) => field.onChange(val)}
                    options={HOME_SERVICE_CARD_ICON_OPTIONS}
                  />
                )}
              />
              <FieldHint>
                {`Choose an icon: ${HOME_SERVICE_CARD_ICON_OPTIONS.map(
                  (key) => iconOptionLabels[key] ?? key,
                ).join(", ")}.`}
              </FieldHint>
              {errors.cards?.[index]?.icon ? (
                <p className="admin-field-error">
                  {errors.cards[index]?.icon?.message}
                </p>
              ) : null}
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove card
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({
              icon: "security",
              title: "",
              description: "",
              category: "",
              iconImage: "",
            })
          }
        >
          Add card
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ServicesAccordionCardFormValue = {
  title: string;
  description: string;
  category: string;
  icon: string;
  iconImage: string;
  pointsLines: string;
};

type ServicesAccordionFormValues = {
  cards: ServicesAccordionCardFormValue[];
};

function toServicesAccordionDefaultValues(
  data: Record<string, unknown>,
): ServicesAccordionFormValues {
  const rawCards = Array.isArray(data.cards)
    ? (data.cards as Record<string, unknown>[])
    : [];

  return {
    cards:
      rawCards.length > 0
        ? rawCards.map((card) => ({
          title: (card.title as string) ?? "",
          description: (card.description as string) ?? "",
          category: (card.category as string) ?? "",
          icon: (card.icon as string) ?? "",
          iconImage: (card.iconImage as string) ?? "",
          pointsLines: Array.isArray(card.points)
            ? (card.points as string[]).join("\n")
            : "",
        }))
        : [{ title: "", description: "", category: "", icon: "", iconImage: "", pointsLines: "" }],
  };
}

export function ServicesAccordionSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesAccordionDefaultValues(section.data),
    [section.data],
  );
  const {
    control,
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicesAccordionFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "cards" });
  const cards = watch("cards");

  const limits = useMemo(() => ({
    cardTitle: Math.max(servicesGridLimits.cardTitle, defaultValues.cards.reduce((max, c) => Math.max(max, c.title.length), 0)),
    cardDescription: Math.max(servicesGridLimits.cardDescription, defaultValues.cards.reduce((max, c) => Math.max(max, c.description.length), 0)),
    cardCategory: Math.max(servicesGridLimits.cardCategory, defaultValues.cards.reduce((max, c) => Math.max(max, c.category.length), 0)),
  }), [defaultValues]);

  function handleValid(values: ServicesAccordionFormValues) {
    onSave({
      cards: values.cards.map((card) => ({
        title: card.title,
        description: card.description,
        category: card.category,
        icon: card.icon || undefined,
        iconImage: card.iconImage,
        points: card.pointsLines
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <div className="admin-section-group">
        <h4>Accordion items</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="admin-section-card">
            <label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                Item title
                <CharacterCount current={(watch(`cards.${index}.title`) ?? "").length} max={limits.cardTitle} />
              </div>
              <input
                {...register(`cards.${index}.title` as const, {
                  required: "Item title is required",
                  maxLength: limits.cardTitle,
                })}
                maxLength={limits.cardTitle}
              />
            </label>
            <label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                Item description
                <CharacterCount current={(watch(`cards.${index}.description`) ?? "").length} max={limits.cardDescription} />
              </div>
              <textarea
                rows={4}
                {...register(`cards.${index}.description` as const, {
                  required: "Item description is required",
                  maxLength: limits.cardDescription,
                })}
                maxLength={limits.cardDescription}
              />
            </label>
            <label>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                Category
                <CharacterCount current={(watch(`cards.${index}.category`) ?? "").length} max={limits.cardCategory} />
              </div>
              <input
                {...register(`cards.${index}.category` as const, {
                  maxLength: limits.cardCategory,
                })}
                maxLength={limits.cardCategory}
              />
            </label>
            <label>
              Icon
              <Controller
                control={control}
                name={`cards.${index}.icon`}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) => field.onChange(typeof val === "string" ? val : "")}
                  />
                )}
              />
            </label>
            <label>
              Bullet points (one per line)
              <textarea rows={4} {...register(`cards.${index}.pointsLines`)} />
            </label>
            <label>
              Item image
              <input type="hidden" {...register(`cards.${index}.iconImage`)} />
              <ImageUploadField
                label="Item image URL"
                value={cards?.[index]?.iconImage ?? ""}
                onChange={(value) =>
                  setValue(`cards.${index}.iconImage`, value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                folder={`sections/${section.type}/cards`}
                placeholder="/home/hero-bg.jpg"
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove item
            </button>
            {errors.cards?.[index]?.title ? (
              <p className="admin-field-error">{errors.cards[index]?.title?.message}</p>
            ) : null}
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({
              title: "",
              description: "",
              category: "",
              icon: "",
              iconImage: "",
              pointsLines: "",
            })
          }
        >
          Add item
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ServicesGridCardFormValue = {
  category: string;
  title: string;
  description: string;
  featuresLines: string;
  icon: string;
};

type ServicesGridFormValues = {
  title: string;
  description: string;
  cards: ServicesGridCardFormValue[];
};

function toServicesGridDefaultValues(
  data: Record<string, unknown>,
): ServicesGridFormValues {
  const rawCards = Array.isArray(data.cards)
    ? (data.cards as Record<string, unknown>[])
    : [];

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    cards:
      rawCards.length > 0
        ? rawCards.map((card) => ({
          category: (card.category as string) ?? "",
          title: (card.title as string) ?? "",
          description: (card.description as string) ?? "",
          featuresLines: Array.isArray(card.features)
            ? (card.features as string[]).join("\n")
            : "",
          icon: (card.icon as string) ?? "security",
        }))
        : [
          {
            category: "",
            title: "",
            description: "",
            featuresLines: "",
            icon: "security",
          },
        ],
  };
}

export function ServicesGridSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesGridDefaultValues(section.data),
    [section.data],
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServicesGridFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "cards" });

  const title = watch("title");
  const description = watch("description");

  const limits = useMemo(() => ({
    title: Math.max(servicesLimits.title, defaultValues.title.length),
    description: Math.max(servicesLimits.description, defaultValues.description.length),
    cardCategory: Math.max(20, defaultValues.cards.reduce((max, c) => Math.max(max, c.category.length), 0)),
    cardTitle: Math.max(30, defaultValues.cards.reduce((max, c) => Math.max(max, c.title.length), 0)),
    cardDescription: Math.max(200, defaultValues.cards.reduce((max, c) => Math.max(max, c.description.length), 0)),
  }), [defaultValues]);

  function handleValid(values: ServicesGridFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      filters: ["ALL"],
      cards: values.cards.map((card) => ({
        category: card.category,
        title: card.title,
        description: card.description,
        features: card.featuresLines
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        cta: "",
        icon: card.icon,
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Section title
          <CharacterCount current={(watch("title") ?? "").length} max={limits.title} />
        </div>
        <input
          {...register("title", {
            required: "Title is required",
            maxLength: limits.title,
          })}
          maxLength={limits.title}
          placeholder="SERVICES"
        />
      </label>
      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Section description
          <CharacterCount current={(watch("description") ?? "").length} max={limits.description} />
        </div>
        <textarea
          rows={3}
          {...register("description", {
            required: "Description is required",
            maxLength: limits.description,
          })}
          maxLength={limits.description}
          placeholder="Briefly describe your services."
        />
      </label>

      <div className="admin-section-group">
        <h4>Service cards</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="admin-section-card">
            <label>
              Category tag
              <input
                {...register(`cards.${index}.category`, {
                  required: "Category is required",
                })}
                placeholder="Threat Intel"
              />
            </label>
            <label>
              Title
              <input
                {...register(`cards.${index}.title`, {
                  required: "Title is required",
                })}
                placeholder="CYBERSECURITY"
              />
            </label>
            <label>
              Description
              <textarea
                rows={4}
                {...register(`cards.${index}.description`, {
                  required: "Description is required",
                })}
                placeholder="Short capability description."
              />
            </label>
            <label>
              Features (one per line)
              <textarea
                rows={4}
                {...register(`cards.${index}.featuresLines`)}
                placeholder={"Zero Trust\nEdge Monitoring\nSOC Ops"}
              />
            </label>
            <label>
              Icon token
              <input
                {...register(`cards.${index}.icon`, {
                  required: "Icon token is required",
                })}
                placeholder="security"
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove card
            </button>
          </div>
        ))}

        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({
              category: "",
              title: "",
              description: "",
              featuresLines: "",
              icon: "security",
            })
          }
        >
          Add card
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type WhyChooseItemFormValue = {
  title: string;
  icon: string;
  description: string;
  tags: string;
};

type WhyChooseFormValues = {
  title: string;
  subheading: string;
  items: WhyChooseItemFormValue[];
};

function toWhyChooseDefaultValues(
  data: Record<string, unknown>,
): WhyChooseFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];

  return {
    title: (data.title as string) ?? "",
    subheading: (data.subheading as string) ?? "",
    items:
      rawItems.length > 0
        ? rawItems.map((item) => ({
          icon: typeof item.icon === "string" ? item.icon : "",
          title: (item.title as string) ?? "",
          description: (item.description as string) ?? "",
          tags: Array.isArray(item.tags)
            ? (item.tags as string[]).filter(Boolean).join(", ")
            : "",
        }))
        : [{ icon: "", title: "", description: "", tags: "" }],
  };
}

export function WhyChooseSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toWhyChooseDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<WhyChooseFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const limits = useMemo(() => ({
    title: Math.max(whyChooseLimits.title, defaultValues.title.length),
    subheading: Math.max(whyChooseLimits.subheading, defaultValues.subheading.length),
    itemTitle: Math.max(whyChooseLimits.itemTitle, defaultValues.items.reduce((max, i) => Math.max(max, i.title.length), 0)),
    itemDescription: Math.max(whyChooseLimits.itemDescription, defaultValues.items.reduce((max, i) => Math.max(max, i.description.length), 0)),
  }), [defaultValues]);

  function handleValid(values: WhyChooseFormValues) {
    onSave({
      title: values.title,
      subheading: values.subheading,
      items: values.items.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
        tags: item.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />
      <label>
        Title
        <input {...register("title")} placeholder="(Optional) Leave blank to hide header" />
      </label>
      <label>
        Subheading
        <input {...register("subheading")} placeholder="(Optional) Leave blank to hide subheading" />
      </label>

      <div>
        <h4>Items</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Icon
              <Controller
                control={control}
                name={`items.${index}.icon`}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
            <label>
              Title
              <input
                {...register(`items.${index}.title`, { required: true })}
                placeholder="END-TO-END SECURITY"
              />
            </label>
            <label>
              Description
              <textarea rows={3} {...register(`items.${index}.description`)} placeholder="Security-first description text" />
            </label>
            <label>
              Tags (comma-separated)
              <input
                {...register(`items.${index}.tags`)}
                placeholder="ENCRYPTION, ZERO TRUST, QUANTUM CONTROL"
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove item
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => append({ icon: "", title: "", description: "", tags: "" })}
        >
          Add item
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type InvestmentItemFormValue = {
  icon: string;
  title: string;
  description: string;
};

type InvestmentFormValues = {
  id: string;
  headingLines: string;
  items: InvestmentItemFormValue[];
  quoteText: string;
  quoteAuthor: string;
  quoteRole: string;
};

function toInvestmentDefaultValues(
  data: Record<string, unknown>,
): InvestmentFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];
  const legacyStats = Array.isArray(data.stats)
    ? (data.stats as Record<string, unknown>[])
    : [];
  const legacyDescription = (data.description as string) ?? "";

  const items =
    rawItems.length > 0
      ? rawItems.map((item) => ({
        icon: (item.icon as string) ?? "",
        title: (item.title as string) ?? "",
        description: (item.description as string) ?? "",
      }))
      : legacyStats.length > 0
        ? legacyStats.map((stat) => ({
          icon: "✓",
          title: (stat.label as string) ?? "",
          description: legacyDescription,
        }))
        : [
          { icon: "✓", title: "Global Expertise", description: "" },
          { icon: "✓", title: "Strategic Advisory", description: "" },
          { icon: "✓", title: "Risk Management", description: "" },
        ];

  const headingLines = Array.isArray(data.heading)
    ? (data.heading as string[])
    : typeof data.title === "string"
      ? [data.title]
      : [];

  return {
    id: (data.id as string) ?? "",
    headingLines: headingLines.join("\n"),
    items,
    quoteText: (data.quoteText as string) ?? "",
    quoteAuthor: (data.quoteAuthor as string) ?? "",
    quoteRole: (data.quoteRole as string) ?? "",
  };
}

export function InvestmentSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toInvestmentDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InvestmentFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const limits = useMemo(() => ({
    headingLines: Math.max(200, defaultValues.headingLines.length),
    itemTitle: Math.max(40, defaultValues.items.reduce((max, i) => Math.max(max, i.title.length), 0)),
    itemDescription: Math.max(200, defaultValues.items.reduce((max, i) => Math.max(max, i.description.length), 0)),
    quoteText: Math.max(500, defaultValues.quoteText.length),
    quoteAuthor: Math.max(50, defaultValues.quoteAuthor.length),
    quoteRole: Math.max(50, defaultValues.quoteRole.length),
  }), [defaultValues]);

  function handleValid(values: InvestmentFormValues) {
    const heading = values.headingLines
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    onSave({
      id: values.id || undefined,
      heading,
      items: values.items.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
      })),
      quoteText: values.quoteText,
      quoteAuthor: values.quoteAuthor,
      quoteRole: values.quoteRole,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Section anchor id
        <input {...register("id")} placeholder="investment" />
      </label>

      <label>
        Heading lines (one per line)
        <textarea
          rows={3}
          {...register("headingLines", { required: "Heading is required" })}
        />
        {errors.headingLines ? (
          <p className="admin-field-error">{errors.headingLines.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Feature items</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Icon
              <Controller
                control={control}
                name={`items.${index}.icon`}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
            <label>
              Title
              <input
                {...register(`items.${index}.title`, { required: true })}
                placeholder="Global Expertise"
              />
            </label>
            <label>
              Description
              <textarea
                rows={3}
                {...register(`items.${index}.description`, { required: true })}
                placeholder="Navigating international markets with deep-rooted regulatory and cultural knowledge."
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove stat
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => append({ icon: "✓", title: "", description: "" })}
        >
          Add item
        </button>
      </div>

      <div>
        <h4>Quote card</h4>
        <label>
          Quote text
          <textarea
            rows={4}
            {...register("quoteText", { required: "Quote text is required" })}
          />
          {errors.quoteText ? (
            <p className="admin-field-error">{errors.quoteText.message}</p>
          ) : null}
        </label>
        <label>
          Quote author
          <input
            {...register("quoteAuthor", {
              required: "Quote author is required",
            })}
          />
          {errors.quoteAuthor ? (
            <p className="admin-field-error">{errors.quoteAuthor.message}</p>
          ) : null}
        </label>
        <label>
          Quote role
          <input
            {...register("quoteRole", { required: "Quote role is required" })}
          />
          {errors.quoteRole ? (
            <p className="admin-field-error">{errors.quoteRole.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ClientLogosFormValues = {
  eyebrow: string;
  logos: Array<{ src: string; alt: string }>;
};

function toClientLogosDefaultValues(
  data: Record<string, unknown>,
): ClientLogosFormValues {
  const logos = Array.isArray(data.logos) ? data.logos : [];

  return {
    eyebrow: (data.eyebrow as string) ?? "TRUSTED BY INSTITUTIONAL LEADERS",
    logos: logos.map((l: any) => {
      if (typeof l === "string") return { src: "", alt: l };
      return {
        src: (l.src as string) ?? "",
        alt: (l.alt as string) ?? "",
      };
    }),
  };
}

export function ClientLogosSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toClientLogosDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClientLogosFormValues>({ defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "logos",
  });

  const logos = watch("logos");
  const eyebrow = watch("eyebrow");

  const limits = useMemo(() => ({
    eyebrow: Math.max(trustedByLimits.eyebrow, defaultValues.eyebrow.length),
  }), [defaultValues]);

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Eyebrow
          <CharacterCount current={eyebrow.length} max={limits.eyebrow} />
        </div>
        <input
          {...register("eyebrow", { required: "Eyebrow is required" })}
          placeholder="TRUSTED BY INSTITUTIONAL LEADERS"
        />
        {errors.eyebrow ? (
          <p className="admin-field-error">{errors.eyebrow.message}</p>
        ) : null}
      </label>

      <h4>Logos</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {fields.map((field, index) => (
          <div key={field.id} className="admin-field-group" style={{ position: "relative", padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
            <button
              type="button"
              onClick={() => remove(index)}
              style={{ position: "absolute", right: "8px", top: "8px", color: "#ef4444", padding: "4px" }}
              title="Remove logo"
            >
              <Trash2 size={16} />
            </button>

            <ImageUploadField
              label={`Logo ${index + 1}`}
              value={logos?.[index]?.src ?? ""}
              onChange={(val) => setValue(`logos.${index}.src`, val, { shouldDirty: true })}
              folder={`sections/${section.type}`}
              aspectRatio={1}
            />

            <label style={{ marginTop: "12px" }}>
              Alt Text / Label
              <input
                {...register(`logos.${index}.alt` as const)}
                placeholder="e.g. Hospital Name"
              />
            </label>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append({ src: "", alt: "" })}
        className="admin-button-secondary"
        style={{ marginTop: "16px" }}
      >
        <Plus size={16} style={{ marginRight: "8px" }} />
        Add Logo
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

type CtaFormValues = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

function toCtaDefaultValues(data: Record<string, unknown>): CtaFormValues {
  const action = ((data.action as Record<string, unknown>) ?? {}) as Record<
    string,
    unknown
  >;

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    actionLabel: (action.label as string) ?? "",
    actionHref: (action.href as string) ?? "",
  };
}

export function CtaSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toCtaDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CtaFormValues>({ defaultValues });

  const title = watch("title") ?? "";
  const description = watch("description") ?? "";
  const actionLabel = watch("actionLabel") ?? "";

  const limits = useMemo(() => ({
    title: Math.max(ctaSectionLimits.title, defaultValues.title.length),
    description: Math.max(ctaSectionLimits.description, defaultValues.description.length),
    actionLabel: Math.max(ctaSectionLimits.actionLabel, defaultValues.actionLabel.length),
  }), [defaultValues]);

  function handleValid(values: CtaFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      action: {
        label: values.actionLabel,
        href: values.actionHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <div>
        <h4>CTA Content</h4>
        <label>
          Title
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="SYSTEM DEPLOYMENT STARTS HERE"
          />
          {errors.title ? <p className="admin-field-error">{errors.title.message}</p> : null}
        </label>
        <label>
          Description
          <textarea
            rows={3}
            {...register("description", { required: "Description is required" })}
            placeholder="Short CTA description"
          />
          {errors.description ? (
            <p className="admin-field-error">{errors.description.message}</p>
          ) : null}
        </label>
        <label>
          Button label
          <input
            {...register("actionLabel", { required: "Button label is required" })}
            placeholder="BOOK CONSULTATION"
          />
          {errors.actionLabel ? (
            <p className="admin-field-error">{errors.actionLabel.message}</p>
          ) : null}
        </label>
        <label>
          Button link (href)
          <input
            {...register("actionHref", { required: "Action href is required" })}
            placeholder="/contact"
          />
          {errors.actionHref ? (
            <p className="admin-field-error">{errors.actionHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutCtaFormValues = {
  titleLines: string;
  description: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  secondaryActionLabel: string;
  secondaryActionHref: string;
};

function toAboutCtaDefaultValues(
  data: Record<string, unknown>,
): AboutCtaFormValues {
  const primaryAction = ((data.primaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;
  const secondaryAction = ((data.secondaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    primaryActionLabel: (primaryAction.label as string) ?? "",
    primaryActionHref: (primaryAction.href as string) ?? "",
    secondaryActionLabel: (secondaryAction.label as string) ?? "",
    secondaryActionHref: (secondaryAction.href as string) ?? "",
  };
}

export function AboutCtaSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutCtaDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutCtaFormValues>({ defaultValues });

  function handleValid(values: AboutCtaFormValues) {
    onSave({
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      primaryAction: {
        label: values.primaryActionLabel,
        href: values.primaryActionHref,
      },
      secondaryAction: {
        label: values.secondaryActionLabel,
        href: values.secondaryActionHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title lines (one per line)
        <textarea
          rows={3}
          {...register("titleLines", { required: "Title is required" })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Primary action</h4>
        <label>
          Label
          <input
            {...register("primaryActionLabel", {
              required: "Primary action label is required",
            })}
          />
          {errors.primaryActionLabel ? (
            <p className="admin-field-error">
              {errors.primaryActionLabel.message}
            </p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("primaryActionHref", {
              required: "Primary action href is required",
            })}
          />
          {errors.primaryActionHref ? (
            <p className="admin-field-error">
              {errors.primaryActionHref.message}
            </p>
          ) : null}
        </label>
      </div>

      <div>
        <h4>Secondary action</h4>
        <label>
          Label
          <input
            {...register("secondaryActionLabel", {
              required: "Secondary action label is required",
            })}
          />
          {errors.secondaryActionLabel ? (
            <p className="admin-field-error">
              {errors.secondaryActionLabel.message}
            </p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("secondaryActionHref", {
              required: "Secondary action href is required",
            })}
          />
          {errors.secondaryActionHref ? (
            <p className="admin-field-error">
              {errors.secondaryActionHref.message}
            </p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ContactFormValues = {
  headline: string;
  subtext: string;
};

function toContactDefaultValues(
  data: Record<string, unknown>,
): ContactFormValues {
  return {
    headline: (data.headline as string) ?? "",
    subtext: (data.subtext as string) ?? "",
  };
}

export function ContactSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toContactDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ defaultValues });

  function handleValid(values: ContactFormValues) {
    onSave({
      headline: values.headline,
      subtext: values.subtext,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Headline
        <input
          {...register("headline", { required: "Headline is required" })}
        />
        {errors.headline ? (
          <p className="admin-field-error">{errors.headline.message}</p>
        ) : null}
      </label>

      <label>
        Subtext
        <textarea
          rows={4}
          {...register("subtext", { required: "Subtext is required" })}
        />
        {errors.subtext ? (
          <p className="admin-field-error">{errors.subtext.message}</p>
        ) : null}
      </label>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ContactHeroFormValues = {
  titleLines: string;
  description: string;
  stat: string;
  backgroundImage: string;
};

function toContactHeroDefaultValues(
  data: Record<string, unknown>,
): ContactHeroFormValues {
  return {
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    stat: (data.stat as string) ?? "",
    backgroundImage: (data.backgroundImage as string) ?? "",
  };
}

export function ContactHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toContactHeroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactHeroFormValues>({ defaultValues });
  const backgroundImage = useWatch({ control, name: "backgroundImage" });

  const titleLines = watch("titleLines") ?? "";
  const description = watch("description") ?? "";

  const limits = useMemo(() => ({
    titleLines: Math.max(introLimits.titleLines, defaultValues.titleLines.length),
    description: Math.max(introLimits.description, defaultValues.description.length),
  }), [defaultValues]);

  function handleValid(values: ContactHeroFormValues) {
    onSave({
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      stat: values.stat,
      backgroundImage: values.backgroundImage,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", { required: "Title is required" })}
          placeholder={"SYSTEM\nARCHITECTURE"}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
          placeholder="Enterprise-grade technological dominance through modular infrastructure..."
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      {/* <label>
        Supporting stat
        <input {...register("stat", { required: "Stat is required" })} />
        {errors.stat ? (
          <p className="admin-field-error">{errors.stat.message}</p>
        ) : null}
      </label> */}

      <input
        type="hidden"
        {...register("backgroundImage", {
          required: "Background image is required",
        })}
      />
      <ImageUploadField
        label="Background image URL"
        value={backgroundImage}
        onChange={(value) =>
          setValue("backgroundImage", value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        folder={`sections/${section.type}`}
      />
      {errors.backgroundImage ? (
        <p className="admin-field-error">{errors.backgroundImage.message}</p>
      ) : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type IncubationStepFormValue = {
  number: number;
  title: string;
  description: string;
};

type HomeIncubationHighlightFormValues = {
  title: string;
  description: string;
  step1Title: string;
  step1Description: string;
  step2Title: string;
  step2Description: string;
  step3Title: string;
  step3Description: string;
  image: string;
  statValue: string;
  statLabel: string;
};

function toHomeIncubationHighlightDefaultValues(
  data: Record<string, unknown>,
): HomeIncubationHighlightFormValues {
  const steps = Array.isArray(data.steps) ? (data.steps as Record<string, unknown>[]) : [];
  const step1 = steps[0] ?? {};
  const step2 = steps[1] ?? {};
  const step3 = steps[2] ?? {};
  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    step1Title: (step1.title as string) ?? "",
    step1Description: (step1.description as string) ?? "",
    step2Title: (step2.title as string) ?? "",
    step2Description: (step2.description as string) ?? "",
    step3Title: (step3.title as string) ?? "",
    step3Description: (step3.description as string) ?? "",
    image: (data.image as string) ?? "",
    statValue: ((data.stat as Record<string, unknown>)?.value as string) ?? "",
    statLabel: ((data.stat as Record<string, unknown>)?.label as string) ?? "",
  };
}

export function HomeIncubationHighlightSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toHomeIncubationHighlightDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HomeIncubationHighlightFormValues>({ defaultValues });
  const image = useWatch({ control, name: "image" });

  function handleValid(values: HomeIncubationHighlightFormValues) {
    onSave({
      title: values.title.trim(),
      description: values.description.trim(),
      steps: [
        {
          number: 1,
          title: values.step1Title.trim(),
          description: values.step1Description.trim(),
        },
        {
          number: 2,
          title: values.step2Title.trim(),
          description: values.step2Description.trim(),
        },
        {
          number: 3,
          title: values.step3Title.trim(),
          description: values.step3Description.trim(),
        },
      ],
      image: values.image,
      stat: {
        value: values.statValue.trim(),
        label: values.statLabel.trim(),
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />
      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? <p className="admin-field-error">{errors.title.message}</p> : null}
      </label>
      <label>
        Description
        <textarea rows={4} {...register("description", { required: "Description is required" })} />
        {errors.description ? <p className="admin-field-error">{errors.description.message}</p> : null}
      </label>

      <div className="admin-section-group">
        <h4>Step 1</h4>
        <label>
          Title
          <input {...register("step1Title", { required: "Step 1 title is required" })} />
        </label>
        <label>
          Description
          <input {...register("step1Description", { required: "Step 1 description is required" })} />
        </label>
      </div>
      <div className="admin-section-group">
        <h4>Step 2</h4>
        <label>
          Title
          <input {...register("step2Title", { required: "Step 2 title is required" })} />
        </label>
        <label>
          Description
          <input {...register("step2Description", { required: "Step 2 description is required" })} />
        </label>
      </div>
      <div className="admin-section-group">
        <h4>Step 3</h4>
        <label>
          Title
          <input {...register("step3Title", { required: "Step 3 title is required" })} />
        </label>
        <label>
          Description
          <input {...register("step3Description", { required: "Step 3 description is required" })} />
        </label>
      </div>

      <input type="hidden" {...register("image", { required: "Image is required" })} />
      <ImageUploadField
        label="Image URL"
        value={image}
        onChange={(value) => setValue("image", value, { shouldDirty: true, shouldValidate: true })}
        folder={`sections/${section.type}`}
      />
      {errors.image ? <p className="admin-field-error">{errors.image.message}</p> : null}

      <label>
        Stat value
        <input {...register("statValue", { required: "Stat value is required" })} />
        {errors.statValue ? <p className="admin-field-error">{errors.statValue.message}</p> : null}
      </label>
      <label>
        Stat label
        <input {...register("statLabel", { required: "Stat label is required" })} />
        {errors.statLabel ? <p className="admin-field-error">{errors.statLabel.message}</p> : null}
      </label>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type IncubationRoadmapItemFormValue = {
  title: string;
  description: string;
  pointsLines: string;
  image: string;
};

type IncubationPortfolioMetricFormValue = {
  value: string;
  label: string;
};

type IncubationPortfolioCardFormValue = {
  category: string;
  title: string;
  description: string;
  image: string;
  metrics: IncubationPortfolioMetricFormValue[];
};

type IncubationApplicationFieldFormValue = {
  label: string;
  placeholder: string;
};

type IncubationFormValues = {
  badge: string;
  heroTitleLines: string;
  heroDescription: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  secondaryActionLabel: string;
  secondaryActionHref: string;
  roadmapTitle: string;
  roadmapSubtitle: string;
  roadmapItems: IncubationRoadmapItemFormValue[];
  portfolioTitle: string;
  portfolioDescription: string;
  portfolioActionLabel: string;
  portfolioActionHref: string;
  portfolioCards: IncubationPortfolioCardFormValue[];
  applicationTitle: string;
  applicationDescription: string;
  applicationFields: IncubationApplicationFieldFormValue[];
  applicationSubmitLabel: string;
  applicationNote: string;
  title: string;
  description: string;
  steps: IncubationStepFormValue[];
  image: string;
  statValue: string;
  statLabel: string;
};

function toIncubationDefaultValues(
  data: Record<string, unknown>,
): IncubationFormValues {
  const rawSteps = Array.isArray(data.steps) ? (data.steps as any[]) : [];
  const rawRoadmapItems = Array.isArray(data.roadmapItems)
    ? (data.roadmapItems as Record<string, unknown>[])
    : [];
  const rawPortfolioCards = Array.isArray(data.portfolioCards)
    ? (data.portfolioCards as Record<string, unknown>[])
    : [];
  const rawApplicationFields = Array.isArray(data.applicationFields)
    ? (data.applicationFields as Record<string, unknown>[])
    : [];
  const primaryAction = (data.primaryAction as Record<string, unknown>) ?? {};
  const secondaryAction = (data.secondaryAction as Record<string, unknown>) ?? {};
  const portfolioAction = (data.portfolioAction as Record<string, unknown>) ?? {};

  const defaultRoadmapItems =
    rawRoadmapItems.length > 0
      ? rawRoadmapItems
      : rawSteps.map((step) => ({
        title: (step.title as string) ?? "",
        description: (step.description as string) ?? "",
        points: [],
        image: (data.image as string) ?? "",
      }));

  return {
    badge: (data.badge as string) ?? "",
    heroTitleLines: Array.isArray(data.heroTitleLines)
      ? (data.heroTitleLines as string[]).join("\n")
      : (data.title as string) ?? "",
    heroDescription: (data.heroDescription as string) ?? (data.description as string) ?? "",
    primaryActionLabel: (primaryAction.label as string) ?? "",
    primaryActionHref: (primaryAction.href as string) ?? "",
    secondaryActionLabel: (secondaryAction.label as string) ?? "",
    secondaryActionHref: (secondaryAction.href as string) ?? "",
    roadmapTitle: (data.roadmapTitle as string) ?? "The Incubation Roadmap",
    roadmapSubtitle:
      (data.roadmapSubtitle as string) ?? "A structured transition from idea to global scale.",
    roadmapItems:
      defaultRoadmapItems.length > 0
        ? defaultRoadmapItems.map((item) => ({
          title: (item.title as string) ?? "",
          description: (item.description as string) ?? "",
          pointsLines: Array.isArray(item.points) ? (item.points as string[]).join("\n") : "",
          image: (item.image as string) ?? "",
        }))
        : [
          { title: "", description: "", pointsLines: "", image: "" },
          { title: "", description: "", pointsLines: "", image: "" },
          { title: "", description: "", pointsLines: "", image: "" },
        ],
    portfolioTitle: (data.portfolioTitle as string) ?? "Portfolio Highlights",
    portfolioDescription:
      (data.portfolioDescription as string) ??
      "See how we've helped disruptive startups navigate the complexities of international business growth.",
    portfolioActionLabel: (portfolioAction.label as string) ?? "View all stories ->",
    portfolioActionHref: (portfolioAction.href as string) ?? "/about",
    portfolioCards:
      rawPortfolioCards.length > 0
        ? rawPortfolioCards.map((card) => ({
          category: (card.category as string) ?? "",
          title: (card.title as string) ?? "",
          description: (card.description as string) ?? "",
          image: (card.image as string) ?? "",
          metrics: Array.isArray(card.metrics)
            ? (card.metrics as Record<string, unknown>[]).map((metric) => ({
              value: (metric.value as string) ?? "",
              label: (metric.label as string) ?? "",
            }))
            : [
              { value: "", label: "" },
              { value: "", label: "" },
            ],
        }))
        : [
          {
            category: "",
            title: "",
            description: "",
            image: "",
            metrics: [
              { value: "", label: "" },
              { value: "", label: "" },
            ],
          },
          {
            category: "",
            title: "",
            description: "",
            image: "",
            metrics: [
              { value: "", label: "" },
              { value: "", label: "" },
            ],
          },
        ],
    applicationTitle: (data.applicationTitle as string) ?? "Ready to Build Your Legacy?",
    applicationDescription:
      (data.applicationDescription as string) ??
      "We are looking for bold founders solving hard problems. Our next cohort application window is now open. Apply today and get access to the ecosystem you need to win.",
    applicationFields:
      rawApplicationFields.length > 0
        ? rawApplicationFields.map((field) => ({
          label: (field.label as string) ?? "",
          placeholder: (field.placeholder as string) ?? "",
        }))
        : [
          { label: "Full Name", placeholder: "Jane Doe" },
          { label: "Startup Name", placeholder: "Acme Inc." },
          { label: "Email Address", placeholder: "jane@startup.com" },
          {
            label: "Pitch Deck URL",
            placeholder: "https://dropbox.com/your-pitch-deck",
          },
        ],
    applicationSubmitLabel: (data.applicationSubmitLabel as string) ?? "Submit Application",
    applicationNote:
      (data.applicationNote as string) ??
      "Our team typically responds within 5-7 business days for initial screening.",
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    steps:
      rawSteps.length > 0
        ? rawSteps.map((step, index) => ({
          number: typeof step.number === "number" ? step.number : index + 1,
          title: (step.title as string) ?? "",
          description: (step.description as string) ?? "",
        }))
        : [
          { number: 1, title: "", description: "" },
          { number: 2, title: "", description: "" },
          { number: 3, title: "", description: "" },
        ],
    image: (data.image as string) ?? "",
    statValue: ((data.stat as Record<string, unknown>)?.value as string) ?? "",
    statLabel: ((data.stat as Record<string, unknown>)?.label as string) ?? "",
  };
}

export function IncubationSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIncubationDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IncubationFormValues>({ defaultValues });
  const image = useWatch({ control, name: "image" });
  const roadmapItems = useWatch({ control, name: "roadmapItems" });
  const portfolioCards = useWatch({ control, name: "portfolioCards" });

  function handleValid(values: IncubationFormValues) {
    const heroTitleLines = values.heroTitleLines
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    onSave({
      badge: values.badge,
      heroTitleLines,
      heroDescription: values.heroDescription,
      primaryAction: {
        label: values.primaryActionLabel,
        href: values.primaryActionHref,
      },
      secondaryAction: {
        label: values.secondaryActionLabel,
        href: values.secondaryActionHref,
      },
      roadmapTitle: values.roadmapTitle,
      roadmapSubtitle: values.roadmapSubtitle,
      roadmapItems: values.roadmapItems.map((item) => ({
        title: item.title,
        description: item.description,
        points: item.pointsLines
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        image: item.image,
      })),
      portfolioTitle: values.portfolioTitle,
      portfolioDescription: values.portfolioDescription,
      portfolioAction: {
        label: values.portfolioActionLabel,
        href: values.portfolioActionHref,
      },
      portfolioCards: values.portfolioCards.map((card) => ({
        category: card.category,
        title: card.title,
        description: card.description,
        image: card.image,
        metrics: card.metrics.map((metric) => ({
          value: metric.value,
          label: metric.label,
        })),
      })),
      applicationTitle: values.applicationTitle,
      applicationDescription: values.applicationDescription,
      applicationFields: (values.applicationFields ?? [])
        .filter(
          (field) =>
            Boolean(field) &&
            typeof field.label === "string" &&
            typeof field.placeholder === "string" &&
            field.label.trim().length > 0 &&
            field.placeholder.trim().length > 0,
        )
        .map((field) => ({
          label: field.label.trim(),
          placeholder: field.placeholder.trim(),
        })),
      applicationSubmitLabel: values.applicationSubmitLabel,
      applicationNote: values.applicationNote,
      title: values.title,
      description: values.description,
      steps: values.steps.map((step, index) => ({
        number: step.number ?? index + 1,
        title: step.title,
        description: step.description,
      })),
      image: values.image,
      stat: {
        value: values.statValue,
        label: values.statLabel,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Hero Badge
        <input {...register("badge")} placeholder="ONE WORLD BUSINESS SCHOOL & INCUBATION CENTRE FZE" />
      </label>

      <label>
        Hero title lines (one per line)
        <textarea rows={3} {...register("heroTitleLines", { required: "Hero title is required" })} />
      </label>

      <label>
        Hero description
        <textarea rows={3} {...register("heroDescription", { required: "Hero description is required" })} />
      </label>

      <div className="admin-section-group">
        <h4>Hero actions</h4>
        <label>
          Primary action label
          <input {...register("primaryActionLabel", { required: "Primary action label is required" })} />
        </label>
        <label>
          Primary action href
          <input {...register("primaryActionHref", { required: "Primary action href is required" })} />
        </label>
        <label>
          Secondary action label
          <input {...register("secondaryActionLabel", { required: "Secondary action label is required" })} />
        </label>
        <label>
          Secondary action href
          <input {...register("secondaryActionHref", { required: "Secondary action href is required" })} />
        </label>
      </div>

      <label>
        Roadmap heading
        <input {...register("roadmapTitle", { required: "Roadmap heading is required" })} />
      </label>

      <label>
        Roadmap subheading
        <input {...register("roadmapSubtitle", { required: "Roadmap subheading is required" })} />
      </label>

      <div className="admin-section-group">
        <h4>Roadmap items</h4>
        {roadmapItems?.map((_, index) => (
          <div key={index} className="admin-section-card">
            <label>
              Item title
              <input {...register(`roadmapItems.${index}.title` as const, { required: true })} />
            </label>
            <label>
              Item description
              <textarea rows={3} {...register(`roadmapItems.${index}.description` as const, { required: true })} />
            </label>
            <label>
              Bullet points (one per line)
              <textarea rows={3} {...register(`roadmapItems.${index}.pointsLines` as const)} />
            </label>
            <input type="hidden" {...register(`roadmapItems.${index}.image` as const, { required: true })} />
            <ImageUploadField
              label="Roadmap image URL"
              value={roadmapItems?.[index]?.image ?? ""}
              onChange={(value) =>
                setValue(`roadmapItems.${index}.image` as const, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/roadmap`}
            />
          </div>
        ))}
      </div>

      <label>
        Portfolio section title
        <input {...register("portfolioTitle", { required: "Portfolio title is required" })} />
      </label>

      <label>
        Portfolio section description
        <textarea rows={3} {...register("portfolioDescription", { required: "Portfolio description is required" })} />
      </label>

      <label>
        Portfolio action label
        <input {...register("portfolioActionLabel", { required: "Portfolio action label is required" })} />
      </label>

      <label>
        Portfolio action href
        <input {...register("portfolioActionHref", { required: "Portfolio action href is required" })} />
      </label>

      <div className="admin-section-group">
        <h4>Portfolio cards</h4>
        {portfolioCards?.map((_, cardIndex) => (
          <div key={cardIndex} className="admin-section-card">
            <label>
              Card category
              <input {...register(`portfolioCards.${cardIndex}.category` as const, { required: true })} />
            </label>
            <label>
              Card title
              <input {...register(`portfolioCards.${cardIndex}.title` as const, { required: true })} />
            </label>
            <label>
              Card description
              <textarea rows={3} {...register(`portfolioCards.${cardIndex}.description` as const, { required: true })} />
            </label>
            <input type="hidden" {...register(`portfolioCards.${cardIndex}.image` as const)} />
            <ImageUploadField
              label="Card background image URL"
              value={portfolioCards?.[cardIndex]?.image ?? ""}
              onChange={(value) =>
                setValue(`portfolioCards.${cardIndex}.image` as const, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/portfolio`}
            />
            <label>
              Metric 1 value
              <input {...register(`portfolioCards.${cardIndex}.metrics.0.value` as const, { required: true })} />
            </label>
            <label>
              Metric 1 label
              <input {...register(`portfolioCards.${cardIndex}.metrics.0.label` as const, { required: true })} />
            </label>
            <label>
              Metric 2 value
              <input {...register(`portfolioCards.${cardIndex}.metrics.1.value` as const, { required: true })} />
            </label>
            <label>
              Metric 2 label
              <input {...register(`portfolioCards.${cardIndex}.metrics.1.label` as const, { required: true })} />
            </label>
          </div>
        ))}
      </div>

      <div className="admin-section-group">
        <h4>Application block</h4>
        <label>
          Block title
          <input {...register("applicationTitle", { required: "Application title is required" })} />
        </label>
        <label>
          Block description
          <textarea
            rows={3}
            {...register("applicationDescription", {
              required: "Application description is required",
            })}
          />
        </label>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="admin-section-card">
            <label>
              Field {index + 1} label
              <input
                {...register(`applicationFields.${index}.label` as const, {
                  required: "Field label is required",
                })}
              />
            </label>
            <label>
              Field {index + 1} placeholder
              <input
                {...register(`applicationFields.${index}.placeholder` as const, {
                  required: "Field placeholder is required",
                })}
              />
            </label>
          </div>
        ))}
        <label>
          Submit button label
          <input
            {...register("applicationSubmitLabel", {
              required: "Submit button label is required",
            })}
          />
        </label>
        <label>
          Bottom note
          <input {...register("applicationNote", { required: "Bottom note is required" })} />
        </label>
      </div>

      <label>
        Title
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="From Idea to Global Scale"
        />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", {
            required: "Description is required",
          })}
          placeholder="Our Incubation Centre provides more than just desk space..."
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <input
        type="hidden"
        {...register("image", { required: "Image is required" })}
      />
      <ImageUploadField
        label="Image URL"
        value={image}
        onChange={(value) =>
          setValue("image", value, { shouldDirty: true, shouldValidate: true })
        }
        folder={`sections/${section.type}`}
      />
      {errors.image ? (
        <p className="admin-field-error">{errors.image.message}</p>
      ) : null}

      <label>
        Stat value
        <input
          {...register("statValue", { required: "Stat value is required" })}
          placeholder="50+"
        />
        {errors.statValue ? (
          <p className="admin-field-error">{errors.statValue.message}</p>
        ) : null}
      </label>

      <label>
        Stat label
        <input
          {...register("statLabel", { required: "Stat label is required" })}
          placeholder="Startups Accelerated"
        />
        {errors.statLabel ? (
          <p className="admin-field-error">{errors.statLabel.message}</p>
        ) : null}
      </label>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type GlobalStandardsPillarFormValue = {
  icon: string;
  title: string;
  description: string;
};

type GlobalStandardsFormValues = {
  eyebrow: string;
  title: string;
  description: string;
  pillars: GlobalStandardsPillarFormValue[];
};

function toGlobalStandardsDefaultValues(
  data: Record<string, unknown>,
): GlobalStandardsFormValues {
  const rawPillars = Array.isArray(data.pillars) ? (data.pillars as any[]) : [];
  return {
    eyebrow: (data.eyebrow as string) ?? "",
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    pillars:
      rawPillars.length > 0
        ? rawPillars.map((pillar) => ({
          icon: (pillar.icon as string) ?? "spark",
          title: (pillar.title as string) ?? "",
          description: (pillar.description as string) ?? "",
        }))
        : [
          { icon: "tokenize", title: "Asset Tokenization", description: "" },
          { icon: "architecture", title: "Contract Architecture", description: "" },
          { icon: "compliance", title: "Regulatory Advisory", description: "" },
        ],
  };
}

export function GlobalStandardsSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toGlobalStandardsDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GlobalStandardsFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "pillars" });

  const eyebrow = watch("eyebrow");
  const title = watch("title");

  const limits = useMemo(() => ({
    eyebrow: Math.max(servicesLimits.eyebrow, defaultValues.eyebrow.length),
    title: Math.max(servicesLimits.title, defaultValues.title.length),
  }), [defaultValues]);

  function handleValid(values: GlobalStandardsFormValues) {
    onSave({
      eyebrow: values.eyebrow,
      title: values.title,
      description: values.description,
      pillars: values.pillars.slice(0, 3).map((pillar) => ({
        icon: pillar.icon,
        title: pillar.title,
        description: pillar.description,
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Eyebrow
          <CharacterCount current={eyebrow.length} max={servicesLimits.eyebrow} />
        </div>
        <input
          {...register("eyebrow", {
            required: "Eyebrow is required",
            maxLength: servicesLimits.eyebrow,
          })}
          maxLength={servicesLimits.eyebrow}
          placeholder="CAPABILITIES"
        />
        {errors.eyebrow ? (
          <p className="admin-field-error">{errors.eyebrow.message}</p>
        ) : null}
      </label>

      <label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          Title
          <CharacterCount current={title.length} max={servicesLimits.title} />
        </div>
        <input
          {...register("title", {
            required: "Title is required",
            maxLength: servicesLimits.title,
          })}
          maxLength={servicesLimits.title}
          placeholder="Strategic Issuance"
        />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", {
            required: "Description is required",
          })}
          placeholder="Leveraging advanced smart contract engineering to deliver robust digital asset solutions for the global market."
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Pillars</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Pillar icon
              <input
                {...register(`pillars.${index}.icon` as const, {
                  required: "Pillar icon is required",
                })}
                placeholder="security"
              />
            </label>

            <label>
              Pillar title
              <input
                {...register(`pillars.${index}.title` as const, {
                  required: "Pillar title is required",
                })}
                placeholder={field.title || `Pillar ${index + 1}`}
              />
            </label>

            <label>
              Pillar description
              <textarea
                rows={3}
                {...register(`pillars.${index}.description` as const, {
                  required: "Pillar description is required",
                })}
              />
            </label>
            <button type="button" onClick={() => remove(index)}>
              Remove pillar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ icon: "spark", title: "", description: "" })}
        >
          Add pillar
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ContactOfficeItemFormValue = {
  title: string;
  linesText: string;
  icon: string;
};

type ContactDepartmentFormValue = {
  title: string;
  subtitle: string;
  email: string;
};

type IndustriesHeroFormValues = {
  badge: string;
  titleLines: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

function toIndustriesHeroDefaultValues(
  data: Record<string, unknown>,
): IndustriesHeroFormValues {
  const primaryAction = ((data.primaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;
  const secondaryAction = ((data.secondaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    badge: (data.badge as string) ?? "",
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    primaryLabel: (primaryAction.label as string) ?? "",
    primaryHref: (primaryAction.href as string) ?? "",
    secondaryLabel: (secondaryAction.label as string) ?? "",
    secondaryHref: (secondaryAction.href as string) ?? "",
  };
}
type ServicesHeroFormValues = {
  titleLines: string;
  description: string;
};
function toServicesHeroDefaultValues(
  data: Record<string, unknown>,
): ServicesHeroFormValues {
  return {
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
  };
}
export function ServicesHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesHeroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicesHeroFormValues>({ defaultValues });

  function handleValid(values: ServicesHeroFormValues) {
    onSave({
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
    });
  }
  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", { required: "Title is required" })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      {/* <label>
        Supporting stat
        <input {...register("stat", { required: "Stat is required" })} />
        {errors.stat ? (
          <p className="admin-field-error">{errors.stat.message}</p>
        ) : null}
      </label> */}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

export function IndustriesHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIndustriesHeroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndustriesHeroFormValues>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: IndustriesHeroFormValues) {
    onSave({
      badge: values.badge,
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      primaryAction: {
        label: values.primaryLabel,
        href: values.primaryHref,
      },
      secondaryAction: {
        label: values.secondaryLabel,
        href: values.secondaryHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Badge
        <input {...register("badge", { required: "Badge is required" })} />
        {errors.badge ? (
          <p className="admin-field-error">{errors.badge.message}</p>
        ) : null}
      </label>

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", {
            required: "At least one title line is required",
          })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Primary action</h4>
        <label>
          Label
          <input
            {...register("primaryLabel", {
              required: "Primary label is required",
            })}
          />
          {errors.primaryLabel ? (
            <p className="admin-field-error">{errors.primaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("primaryHref", {
              required: "Primary href is required",
            })}
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
          />
          {errors.secondaryHref ? (
            <p className="admin-field-error">{errors.secondaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type IndustriesGridItemFormValue = {
  icon: string;
  title: string;
  description: string;
};

type IndustriesGridFormValues = {
  title: string;
  description: string;
  items: IndustriesGridItemFormValue[];
  partnerTitle: string;
  partnerDescription: string;
  partnerHref: string;
};

function toIndustriesGridDefaultValues(
  data: Record<string, unknown>,
): IndustriesGridFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];
  const partnerCard = ((data.partnerCard as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    items:
      rawItems.length > 0
        ? rawItems.map((item) => ({
          icon: (item.icon as string) ?? "SquareCode",
          title: (item.title as string) ?? "",
          description: (item.description as string) ?? "",
        }))
        : [
          {
            icon: "SquareCode",
            title: "",
            description: "",
          },
        ],
    partnerTitle: (partnerCard.title as string) ?? "",
    partnerDescription: (partnerCard.description as string) ?? "",
    partnerHref: (partnerCard.href as string) ?? "/contact",
  };
}

export function IndustriesGridSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIndustriesGridDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndustriesGridFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: IndustriesGridFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      items: values.items.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
      })),
      partnerCard: {
        title: values.partnerTitle,
        description: values.partnerDescription,
        href: values.partnerHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Section title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Section description
        <textarea
          rows={3}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Industry cards</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Icon
              <Controller
                control={control}
                name={`items.${index}.icon`}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
            <label>
              Title
              <input
                {...register(`items.${index}.title`, { required: true })}
              />
            </label>
            <label>
              Description
              <textarea
                rows={3}
                {...register(`items.${index}.description`, { required: true })}
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove card
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({ icon: "SquareCode", title: "", description: "" })
          }
        >
          Add card
        </button>
      </div>

      <div>
        <h4>Partner card</h4>
        <label>
          Title
          <input
            {...register("partnerTitle", {
              required: "Partner title is required",
            })}
          />
          {errors.partnerTitle ? (
            <p className="admin-field-error">{errors.partnerTitle.message}</p>
          ) : null}
        </label>
        <label>
          Description
          <textarea
            rows={3}
            {...register("partnerDescription", {
              required: "Partner description is required",
            })}
          />
          {errors.partnerDescription ? (
            <p className="admin-field-error">
              {errors.partnerDescription.message}
            </p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("partnerHref", {
              required: "Partner href is required",
            })}
          />
          {errors.partnerHref ? (
            <p className="admin-field-error">{errors.partnerHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type IndustriesCtaFormValues = {
  titleLines: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

type ServicesCtaFormValues = {
  title: string;
  primaryLabel: string;
  primaryHref: string;
};

function toServicesCtaDefaultValues(
  data: Record<string, unknown>,
): ServicesCtaFormValues {
  const primaryAction = ((data.primaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;
  const secondaryAction = ((data.secondaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    title: (data.title as string) ?? "",
    primaryLabel: (primaryAction.label as string) ?? "",
    primaryHref: (primaryAction.href as string) ?? "",
  };
}

export function ServicesCtaSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesCtaDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicesCtaFormValues>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: ServicesCtaFormValues) {
    onSave({
      title: values.title,
      description: "",
      primaryAction: {
        label: values.primaryLabel,
        href: values.primaryHref,
      },
      secondaryAction: {
        label: "",
        href: "/contact",
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Status line
        <input
          {...register("title", { required: "Status line is required" })}
          placeholder="ALL SYSTEMS OPERATIONAL // DUBAI HUB"
        />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Right action button</h4>
        <label>
          Label
          <input
            {...register("primaryLabel", {
              required: "Primary label is required",
            })}
          />
          {errors.primaryLabel ? (
            <p className="admin-field-error">{errors.primaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("primaryHref", {
              required: "Primary href is required",
            })}
          />
          {errors.primaryHref ? (
            <p className="admin-field-error">{errors.primaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

function toIndustriesCtaDefaultValues(
  data: Record<string, unknown>,
): IndustriesCtaFormValues {
  const primaryAction = ((data.primaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;
  const secondaryAction = ((data.secondaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    primaryLabel: (primaryAction.label as string) ?? "",
    primaryHref: (primaryAction.href as string) ?? "",
    secondaryLabel: (secondaryAction.label as string) ?? "",
    secondaryHref: (secondaryAction.href as string) ?? "",
  };
}

export function IndustriesCtaSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIndustriesCtaDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndustriesCtaFormValues>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: IndustriesCtaFormValues) {
    onSave({
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      primaryAction: {
        label: values.primaryLabel,
        href: values.primaryHref,
      },
      secondaryAction: {
        label: values.secondaryLabel,
        href: values.secondaryHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title lines (one per line)
        <textarea
          rows={3}
          {...register("titleLines", {
            required: "At least one title line is required",
          })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={3}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Primary action</h4>
        <label>
          Label
          <input
            {...register("primaryLabel", {
              required: "Primary label is required",
            })}
          />
          {errors.primaryLabel ? (
            <p className="admin-field-error">{errors.primaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("primaryHref", {
              required: "Primary href is required",
            })}
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
          />
          {errors.secondaryHref ? (
            <p className="admin-field-error">{errors.secondaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ContactHqFormValue = {
  icon: string;
  label: string;
  value: string;
  note: string;
};

type ContactHoursFormValue = {
  days: string;
  hours: string;
};

type ContactInquiryFormValues = {
  heroEyebrow: string;
  heroTitle: string;
  submitLabel: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  workEmailLabel: string;
  workEmailPlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  interestLabel: string;
  interestPlaceholder: string;
  inquiryOptionsText: string;
  messageLabel: string;
  messagePlaceholder: string;
  successMessage: string;
  errorMessage: string;
  hqHeading: string;
  hqContacts: ContactHqFormValue[];
  hoursHeading: string;
  complianceText: string;
  hoursRows: ContactHoursFormValue[];
  matrixLabel: string;
  matrixTitle: string;
  matrixSubtitle: string;
  matrixMapImage: string;
  matrixMapEmbedUrl: string;
  matrixLinkLabel: string;
  matrixLinkHref: string;
};

function toContactInquiryDefaultValues(
  data: Record<string, unknown>,
): ContactInquiryFormValues {
  const formFields = (data.formFields as Record<string, unknown>) ?? {};
  const matrix = (data.locationMatrix as Record<string, unknown>) ?? {};
  const hqContacts = Array.isArray(data.hqContacts)
    ? (data.hqContacts as ContactHqFormValue[])
    : [];
  const hoursRows = Array.isArray(data.hoursRows)
    ? (data.hoursRows as ContactHoursFormValue[])
    : [];
  const inquiryOptions = Array.isArray(data.inquiryOptions)
    ? (data.inquiryOptions as string[])
    : [];

  const hqFromDb = hqContacts.map((item) => ({
    icon: item.icon ?? "location",
    label: (item as ContactHqFormValue).label ?? "",
    value: item.value ?? "",
    note: (item as ContactHqFormValue).note ?? "",
  }));

  return {
    heroEyebrow: (data.heroEyebrow as string) ?? "REACH OUT TO OUR EXPERTS",
    heroTitle:
      (data.heroTitle as string) ??
      (Array.isArray(data.heroTitleLines)
        ? (data.heroTitleLines as string[]).join(" ")
        : "Clinical Precision at Your Service."),
    submitLabel: (data.submitLabel as string) ?? "Submit Request",
    fullNameLabel: (formFields.fullNameLabel as string) ?? "FULL NAME",
    fullNamePlaceholder: (formFields.fullNamePlaceholder as string) ?? "Dr. Sarah Al-Maktoum",
    workEmailLabel: (formFields.workEmailLabel as string) ?? "EMAIL",
    workEmailPlaceholder: (formFields.workEmailPlaceholder as string) ?? "sarah.a@facility.ae",
    companyLabel: (formFields.companyLabel as string) ?? "FACILITY NAME",
    companyPlaceholder: (formFields.companyPlaceholder as string) ?? "Dubai Medical Center",
    phoneLabel: (formFields.phoneLabel as string) ?? "DEPARTMENT",
    phonePlaceholder: (formFields.phonePlaceholder as string) ?? "Radiology / Procurement",
    interestLabel: (formFields.interestLabel as string) ?? "REQUEST TYPE",
    interestPlaceholder:
      (formFields.interestPlaceholder as string) ?? "Select a service category",
    inquiryOptionsText: inquiryOptions.join("\n"),
    messageLabel: (formFields.messageLabel as string) ?? "MESSAGE",
    messagePlaceholder:
      (formFields.messagePlaceholder as string) ??
      "Detail your clinical requirements here...",
    successMessage:
      (formFields.successMessage as string) ??
      "Thank you — our institutional relations team will be in touch shortly.",
    errorMessage: (formFields.errorMessage as string) ?? "Network error",
    hqHeading: (data.hqHeading as string) ?? "Direct Contact",
    hqContacts:
      hqFromDb.length > 0
        ? hqFromDb
        : [
          { icon: "spark", label: "EMERGENCY LINE", value: "+971 4 000 0000", note: "" },
          { icon: "mail", label: "EMAIL CORRESPONDENCE", value: "inquiry@theamedical.ae", note: "" },
          {
            icon: "clock",
            label: "CLINICAL SUPPORT HOURS",
            value: "Mon - Fri: 08:00 - 18:00",
            note: "24/7 Support for Priority Clients",
          },
        ],
    hoursHeading: (data.hoursHeading as string) ?? "Regulatory Compliance Guaranteed",
    complianceText:
      (data.complianceText as string) ??
      (hoursRows.length > 0
        ? hoursRows.map((row) => [row.days, row.hours].filter(Boolean).join(" ")).join(" ")
        : "All inquiries are processed according to strict medical data privacy standards and ISO 13485 protocols."),
    hoursRows:
      hoursRows.length > 0
        ? hoursRows
        : [{ days: "", hours: "" }],
    matrixLabel: (matrix.label as string) ?? "Dubai Headquarters",
    matrixTitle: (matrix.title as string) ?? "Business Bay, Prism Tower",
    matrixSubtitle: (matrix.subtitle as string) ?? "Level 24, Suite 2405, Dubai, UAE.",
    matrixMapImage: (matrix.mapImage as string) ?? (data.mapImage as string) ?? "",
    matrixMapEmbedUrl:
      (matrix.mapEmbedUrl as string) ??
      "https://maps.google.com/maps?q=Prism+Tower,+Business+Bay,+Dubai,+United+Arab+Emirates&hl=en&z=15&output=embed",
    matrixLinkLabel: (matrix.linkLabel as string) ?? "GET DIRECTIONS →",
    matrixLinkHref:
      (matrix.linkHref as string) ??
      "https://maps.google.com/?q=Business+Bay+Prism+Tower+Dubai",
  };
}

export function ContactInquirySectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toContactInquiryDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInquiryFormValues>({ defaultValues });
  const { fields: hqFields, append: appendHq, remove: removeHq } = useFieldArray({
    control,
    name: "hqContacts",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);
  const matrixMapImage = watch("matrixMapImage");

  function handleValid(values: ContactInquiryFormValues) {
    onSave({
      heroEyebrow: values.heroEyebrow.trim(),
      heroTitle: values.heroTitle.trim(),
      submitLabel: values.submitLabel.trim(),
      formFields: {
        fullNameLabel: values.fullNameLabel.trim(),
        fullNamePlaceholder: values.fullNamePlaceholder.trim(),
        workEmailLabel: values.workEmailLabel.trim(),
        workEmailPlaceholder: values.workEmailPlaceholder.trim(),
        companyLabel: values.companyLabel.trim(),
        companyPlaceholder: values.companyPlaceholder.trim(),
        phoneLabel: values.phoneLabel.trim(),
        phonePlaceholder: values.phonePlaceholder.trim(),
        interestLabel: values.interestLabel.trim(),
        interestPlaceholder: values.interestPlaceholder.trim(),
        messageLabel: values.messageLabel.trim(),
        messagePlaceholder: values.messagePlaceholder.trim(),
        successMessage: values.successMessage.trim(),
        errorMessage: values.errorMessage.trim(),
      },
      inquiryOptions: values.inquiryOptionsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      hqHeading: values.hqHeading.trim(),
      hqContacts: values.hqContacts.map((item) => ({
        icon: item.icon,
        label: item.label.trim(),
        value: item.value.trim(),
        note: item.note.trim(),
      })),
      hoursHeading: values.hoursHeading.trim(),
      complianceText: values.complianceText.trim(),
      hoursRows: values.hoursRows.map((row) => ({
        days: row.days.trim(),
        hours: row.hours.trim(),
      })),
      locationMatrix: {
        label: values.matrixLabel.trim(),
        title: values.matrixTitle.trim(),
        subtitle: values.matrixSubtitle.trim(),
        mapImage: values.matrixMapImage.trim(),
        mapEmbedUrl: values.matrixMapEmbedUrl.trim(),
        linkLabel: values.matrixLinkLabel.trim(),
        linkHref: values.matrixLinkHref.trim(),
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <div className="admin-section-group">
        <h4>Hero</h4>
        <label>
          Eyebrow
          <input {...register("heroEyebrow", { required: true })} />
        </label>
        <label>
          Title
          <input {...register("heroTitle", { required: true })} />
        </label>
      </div>

      <div className="admin-section-group">
        <h4>Form</h4>
        <label>
          Submit button label
          <input {...register("submitLabel", { required: true })} />
        </label>
        <label>
          Name label
          <input {...register("fullNameLabel", { required: true })} />
        </label>
        <label>
          Name placeholder
          <input {...register("fullNamePlaceholder", { required: true })} />
        </label>
        <label>
          Email label
          <input {...register("workEmailLabel", { required: true })} />
        </label>
        <label>
          Email placeholder
          <input {...register("workEmailPlaceholder", { required: true })} />
        </label>
        <label>
          Facility label
          <input {...register("companyLabel", { required: true })} />
        </label>
        <label>
          Facility placeholder
          <input {...register("companyPlaceholder", { required: true })} />
        </label>
        <label>
          Department label
          <input {...register("phoneLabel", { required: true })} />
        </label>
        <label>
          Department placeholder
          <input {...register("phonePlaceholder", { required: true })} />
        </label>
        <label>
          Request type label
          <input {...register("interestLabel", { required: true })} />
        </label>
        <label>
          Request type placeholder
          <input {...register("interestPlaceholder", { required: true })} />
        </label>
        <label>
          Request type options (one per line)
          <textarea rows={4} {...register("inquiryOptionsText")} />
        </label>
        <label>
          Message label
          <input {...register("messageLabel", { required: true })} />
        </label>
        <label>
          Message placeholder
          <textarea rows={2} {...register("messagePlaceholder", { required: true })} />
        </label>
        <label>
          Success message
          <input {...register("successMessage", { required: true })} />
        </label>
        <label>
          Error message
          <input {...register("errorMessage", { required: true })} />
        </label>
      </div>

      <div className="admin-section-group">
        <h4>Direct contact (left column)</h4>
        <label>
          Card heading
          <input {...register("hqHeading", { required: true })} />
        </label>
        {hqFields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <div>
              <span className="admin-field-label">Icon</span>
              <Controller
                control={control}
                name={`hqContacts.${index}.icon`}
                rules={{ required: "Icon is required" }}
                render={({ field }) => (
                  <ContactHqIconPicker value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
            <label>
              Label (e.g. EMERGENCY LINE)
              <input {...register(`hqContacts.${index}.label`)} />
            </label>
            <label>
              Value
              <textarea rows={2} {...register(`hqContacts.${index}.value`, { required: true })} />
            </label>
            <label>
              Note (optional, e.g. 24/7 support line)
              <input {...register(`hqContacts.${index}.note`)} />
            </label>
            <button type="button" onClick={() => removeHq(index)} disabled={hqFields.length === 1}>
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => appendHq({ icon: "phone", label: "", value: "", note: "" })}
        >
          Add contact line
        </button>
      </div>

      <div className="admin-section-group">
        <h4>Regulatory compliance card</h4>
        <label>
          Card heading
          <input {...register("hoursHeading", { required: true })} />
        </label>
        <label>
          Body text
          <textarea rows={4} {...register("complianceText", { required: true })} />
        </label>
      </div>

      <div className="admin-section-group">
        <h4>Map &amp; headquarters</h4>
        <label>
          Card title (e.g. Dubai Headquarters)
          <input {...register("matrixLabel", { required: true })} />
        </label>
        <label>
          Address line 1
          <input {...register("matrixTitle", { required: true })} />
        </label>
        <label>
          Address line 2
          <input {...register("matrixSubtitle", { required: true })} />
        </label>
        <input type="hidden" {...register("matrixMapImage")} />
        <ImageUploadField
          label="Map image (optional — used only when embed URL is empty)"
          value={matrixMapImage}
          onChange={(value) =>
            setValue("matrixMapImage", value, { shouldDirty: true, shouldValidate: true })
          }
          folder={`sections/${section.type}`}
          placeholder="Leave empty to use Google Maps embed"
        />
        <label>
          Map embed URL
          <input
            {...register("matrixMapEmbedUrl", { required: true })}
            placeholder="https://maps.google.com/maps?q=..."
          />
        </label>
        <label>
          Link label
          <input {...register("matrixLinkLabel", { required: true })} />
        </label>
        <label>
          Link URL
          <input {...register("matrixLinkHref", { required: true })} />
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutHeroFormValues = {
  eyebrow: string;
  titleLines: string;
  description: string;
  sideCopy: string;
  image: string;
};

function toAboutHeroDefaultValues(data: Record<string, unknown>): AboutHeroFormValues {
  const titleLines = Array.isArray(data.titleLines)
    ? (data.titleLines as string[])
    : data.titleMain
      ? [(data.titleAccent as string) ?? "", data.titleMain as string].filter(Boolean)
      : ["Institutional", "Integrity", "By Design"];

  return {
    eyebrow: (data.eyebrow as string) ?? "ESTABLISHED 2024",
    titleLines: titleLines.join("\n"),
    description: (data.description as string) ?? "",
    sideCopy: (data.sideCopy as string) ?? "",
    image: ((data.image as string) ?? (data.backgroundImage as string) ?? ""),
  };
}

export function AboutHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutHeroDefaultValues(section.data),
    [section.data],
  );

  const {
    register,
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutHeroFormValues>({ defaultValues });

  const image = useWatch({ control, name: "image" });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: AboutHeroFormValues) {
    onSave({
      eyebrow: values.eyebrow.trim(),
      titleLines: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description.trim(),
      sideCopy: values.sideCopy.trim(),
      image: values.image.trim(),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Establishment label
        <input
          {...register("eyebrow", { required: "Establishment label is required" })}
          placeholder="ESTABLISHED 2024"
        />
        {errors.eyebrow ? (
          <p className="admin-field-error">{errors.eyebrow.message}</p>
        ) : null}
      </label>

      <label>
        Main title (one line per row)
        <textarea
          rows={3}
          {...register("titleLines", { required: "Main title is required" })}
          placeholder={"Institutional\nIntegrity\nBy Design"}
        />
        <FieldHint>Each line becomes a row in the large heading, as on the About page.</FieldHint>
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Primary description
        <textarea
          rows={4}
          {...register("description", { required: "Primary description is required" })}
          placeholder="Cryptonexis Limited is a Company Limited by Shares..."
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <label>
        Secondary text (right column)
        <textarea
          rows={3}
          {...register("sideCopy", { required: "Secondary text is required" })}
          placeholder="A digital environment where quiet authority meets architectural precision..."
        />
        {errors.sideCopy ? (
          <p className="admin-field-error">{errors.sideCopy.message}</p>
        ) : null}
      </label>

      <input type="hidden" {...register("image", { required: "Hero image is required" })} />

      <ImageUploadField
        label="Hero image"
        value={image}
        onChange={(value) =>
          setValue("image", value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        folder={`sections/${section.type}`}
        placeholder="/home/hero-building.jpg"
      />

      {errors.image ? <p className="admin-field-error">{errors.image.message}</p> : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutIntroFormValues = {
  eyebrow: string;
  title: string;
  description: string;
  subDescription: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  image1: string;
  image2: string;
};

function toAboutIntroDefaultValues(
  data: Record<string, unknown>,
): AboutIntroFormValues {
  const stats = Array.isArray(data.stats) ? (data.stats as Record<string, unknown>[]) : [];
  const images = Array.isArray(data.images) ? (data.images as string[]) : [];

  return {
    eyebrow: (data.eyebrow as string) ?? "",
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    subDescription: (data.subDescription as string) ?? "",
    stat1Value: (stats[0]?.value as string) ?? "",
    stat1Label: (stats[0]?.label as string) ?? "",
    stat2Value: (stats[1]?.value as string) ?? "",
    stat2Label: (stats[1]?.label as string) ?? "",
    image1: (images[0] as string) ?? "",
    image2: (images[1] as string) ?? "",
  };
}

type CoursesCatalogCourseFormValue = {
  badge: string;
  category: string;
  level: string;
  title: string;
  description: string;
  skillsLines: string;
  weeks: string;
  image: string;
};

type CoursesCatalogFormValues = {
  title: string;
  description: string;
  categoriesLines: string;
  levelsLines: string;
  durationsLines: string;
  courses: CoursesCatalogCourseFormValue[];
};

function toCoursesCatalogDefaultValues(
  data: Record<string, unknown>,
): CoursesCatalogFormValues {
  const rawCourses = Array.isArray(data.courses)
    ? (data.courses as Record<string, unknown>[])
    : [];

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    categoriesLines: Array.isArray(data.categories)
      ? (data.categories as string[]).join("\n")
      : "",
    levelsLines: Array.isArray(data.levels)
      ? (data.levels as string[]).join("\n")
      : "",
    durationsLines: Array.isArray(data.durations)
      ? (data.durations as string[]).join("\n")
      : "",
    courses:
      rawCourses.length > 0
        ? rawCourses.map((course) => ({
          badge: (course.badge as string) ?? "",
          category: (course.category as string) ?? "",
          level: (course.level as string) ?? "",
          title: (course.title as string) ?? "",
          description: (course.description as string) ?? "",
          skillsLines: Array.isArray(course.skills)
            ? (course.skills as string[]).join("\n")
            : "",
          weeks: (course.weeks as string) ?? "",
          image: ((course.image as string) ?? (course.iconImage as string) ?? "").trim(),
        }))
        : [
          {
            badge: "",
            category: "",
            level: "",
            title: "",
            description: "",
            skillsLines: "",
            weeks: "",
            image: "",
          },
        ],
  };
}

export function CoursesCatalogSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toCoursesCatalogDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CoursesCatalogFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "courses" });
  const courses = watch("courses");

  function handleValid(values: CoursesCatalogFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      categories: values.categoriesLines
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      levels: values.levelsLines
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      durations: values.durationsLines
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      courses: values.courses.map((course) => ({
        badge: course.badge,
        category: course.category,
        level: course.level,
        title: course.title,
        description: course.description,
        skills: course.skillsLines
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean),
        weeks: course.weeks,
        image: course.image,
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? <p className="admin-field-error">{errors.title.message}</p> : null}
      </label>

      <label>
        Description
        <textarea rows={3} {...register("description", { required: "Description is required" })} />
        {errors.description ? <p className="admin-field-error">{errors.description.message}</p> : null}
      </label>

      <label>
        Categories (one per line)
        <textarea rows={4} {...register("categoriesLines", { required: "Categories are required" })} />
      </label>

      <label>
        Levels (one per line)
        <textarea rows={4} {...register("levelsLines", { required: "Levels are required" })} />
      </label>

      <label>
        Durations (one per line)
        <textarea rows={4} {...register("durationsLines", { required: "Durations are required" })} />
      </label>

      <div className="admin-section-group">
        <h4>Course cards</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="admin-section-card">
            <label>
              Badge
              <input {...register(`courses.${index}.badge`, { required: true })} />
            </label>
            <label>
              Category
              <input {...register(`courses.${index}.category`, { required: true })} />
            </label>
            <label>
              Level
              <input {...register(`courses.${index}.level`, { required: true })} />
            </label>
            <label>
              Title
              <input {...register(`courses.${index}.title`, { required: true })} />
            </label>
            <label>
              Description
              <textarea rows={3} {...register(`courses.${index}.description`, { required: true })} />
            </label>
            <label>
              Skills (one per line)
              <textarea rows={4} {...register(`courses.${index}.skillsLines`, { required: true })} />
            </label>
            <label>
              Weeks
              <input {...register(`courses.${index}.weeks`, { required: true })} />
            </label>
            <input type="hidden" {...register(`courses.${index}.image`, { required: true })} />
            <ImageUploadField
              label="Course image URL"
              value={courses?.[index]?.image ?? ""}
              onChange={(value) =>
                setValue(`courses.${index}.image`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/courses`}
            />
            <button type="button" onClick={() => remove(index)} disabled={fields.length === 1}>
              Remove course
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({
              badge: "",
              category: "",
              level: "",
              title: "",
              description: "",
              skillsLines: "",
              weeks: "",
              image: "",
            })
          }
        >
          Add course
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

export function AboutIntroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutIntroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutIntroFormValues>({ defaultValues });
  const image1 = useWatch({ control, name: "image1" });
  const image2 = useWatch({ control, name: "image2" });

  function handleValid(values: AboutIntroFormValues) {
    onSave({
      eyebrow: values.eyebrow,
      title: values.title,
      description: values.description,
      subDescription: values.subDescription,
      stats: [
        { value: values.stat1Value, label: values.stat1Label },
        { value: values.stat2Value, label: values.stat2Label },
      ],
      images: [values.image1, values.image2],
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Eyebrow
        <input {...register("eyebrow", { required: "Eyebrow is required" })} />
        {errors.eyebrow ? (
          <p className="admin-field-error">{errors.eyebrow.message}</p>
        ) : null}
      </label>

      <label>
        Title
        <input
          {...register("title", { required: "Title is required" })}
        />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={3}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <label>
        Sub Description
        <textarea
          rows={4}
          {...register("subDescription", {
            required: "Sub description is required",
          })}
        />
        {errors.subDescription ? (
          <p className="admin-field-error">{errors.subDescription.message}</p>
        ) : null}
      </label>

      <label>
        Stat 1 Value
        <input {...register("stat1Value", { required: "Stat 1 value is required" })} />
        {errors.stat1Value ? (
          <p className="admin-field-error">{errors.stat1Value.message}</p>
        ) : null}
      </label>

      <label>
        Stat 1 Label
        <input {...register("stat1Label", { required: "Stat 1 label is required" })} />
        {errors.stat1Label ? (
          <p className="admin-field-error">{errors.stat1Label.message}</p>
        ) : null}
      </label>

      <label>
        Stat 2 Value
        <input {...register("stat2Value", { required: "Stat 2 value is required" })} />
        {errors.stat2Value ? (
          <p className="admin-field-error">{errors.stat2Value.message}</p>
        ) : null}
      </label>

      <label>
        Stat 2 Label
        <input {...register("stat2Label", { required: "Stat 2 label is required" })} />
        {errors.stat2Label ? (
          <p className="admin-field-error">{errors.stat2Label.message}</p>
        ) : null}
      </label>

      <input type="hidden" {...register("image1", { required: "Primary image is required" })} />
      <ImageUploadField
        label="Primary image URL"
        value={image1}
        onChange={(value) =>
          setValue("image1", value, { shouldDirty: true, shouldValidate: true })
        }
        folder={`sections/${section.type}`}
      />
      {errors.image1 ? (
        <p className="admin-field-error">{errors.image1.message}</p>
      ) : null}

      <input type="hidden" {...register("image2", { required: "Secondary image is required" })} />
      <ImageUploadField
        label="Secondary image URL"
        value={image2}
        onChange={(value) =>
          setValue("image2", value, { shouldDirty: true, shouldValidate: true })
        }
        folder={`sections/${section.type}`}
      />
      {errors.image2 ? (
        <p className="admin-field-error">{errors.image2.message}</p>
      ) : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutVisionMissionCardFormValue = {
  title: string;
  description: string;
  icon: string;
  iconImage: string;
  accentColor: string;
};

type AboutVisionMissionFormValues = {
  items: AboutVisionMissionCardFormValue[];
  visionTitle: string;
  visionQuote: string;
  visionBadge: string;
  visionActionLabel: string;
  visionActionHref: string;
};

function toAboutVisionMissionDefaultValues(
  data: Record<string, unknown>,
): AboutVisionMissionFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : Array.isArray(data.cards)
      ? (data.cards as Record<string, unknown>[])
      : [];

  return {
    items:
      rawItems.length > 0
        ? rawItems.map((item) => ({
          title: (item.title as string) ?? "",
          description: (item.description as string) ?? "",
          icon: (item.icon as string) ?? "",
          iconImage: (item.iconImage as string) ?? "",
          accentColor: (item.accentColor as string) ?? "#0b3d91",
        }))
        : [
          {
            title: "Our Mission",
            description: "",
            icon: "Zap",
            iconImage: "",
            accentColor: "#0b3d91",
          },
          {
            title: "Our Vision",
            description: "",
            icon: "Eye",
            iconImage: "",
            accentColor: "#c8a96a",
          },
        ],
    visionTitle:
      ((data.vision as Record<string, unknown> | undefined)?.title as string) ??
      "VISION 2030",
    visionQuote:
      ((data.vision as Record<string, unknown> | undefined)?.quote as string) ??
      "",
    visionBadge:
      ((data.vision as Record<string, unknown> | undefined)?.badge as string) ??
      "PROTOCOL ACTIVE",
    visionActionLabel:
      (((data.vision as Record<string, unknown> | undefined)?.action as Record<string, unknown> | undefined)?.label as string) ??
      "",
    visionActionHref:
      (((data.vision as Record<string, unknown> | undefined)?.action as Record<string, unknown> | undefined)?.href as string) ??
      "",
  };
}

export function AboutVisionMissionSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutVisionMissionDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AboutVisionMissionFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = useWatch({ control, name: "items" });

  function handleValid(values: AboutVisionMissionFormValues) {
    onSave({
      items: values.items.map((item) => ({
        title: item.title,
        description: item.description,
        icon: item.icon || undefined,
        iconImage: item.iconImage || undefined,
        accentColor: item.accentColor,
      })),
      vision: {
        title: values.visionTitle,
        quote: values.visionQuote,
        badge: values.visionBadge,
        action:
          values.visionActionLabel.trim() && values.visionActionHref.trim()
            ? {
              label: values.visionActionLabel.trim(),
              href: values.visionActionHref.trim(),
            }
            : undefined,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <div>
        <h4>Mission and Vision Cards</h4>

        <div className="admin-section-group">
          <h4>Vision 2030 block</h4>
          <label>
            Vision title
            <input
              {...register("visionTitle", {
                required: "Vision title is required",
              })}
            />
          </label>
          <label>
            Vision quote
            <textarea
              rows={4}
              {...register("visionQuote", {
                required: "Vision quote is required",
              })}
            />
          </label>
          <label>
            Vision badge text
            <input
              {...register("visionBadge", {
                required: "Vision badge is required",
              })}
            />
          </label>
          <label>
            Vision button label (optional)
            <input
              {...register("visionActionLabel")}
              placeholder="DOWNLOAD REPORT"
            />
          </label>
          <label>
            Vision button link (optional)
            <input
              {...register("visionActionHref")}
              placeholder="/files/report.pdf"
            />
          </label>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Card Title
              <input
                {...register(`items.${index}.title`, { required: true })}
              />
            </label>
            <label>
              Description
              <textarea
                rows={4}
                {...register(`items.${index}.description`, { required: true })}
              />
            </label>
            <label>
              Choose Icon
              <Controller
                control={control}
                name={`items.${index}.icon`}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
            {/* <input type="hidden" {...register(`cards.${index}.iconImage`)} />
            <ImageUploadField
              label="Custom icon image URL"
              value={cards?.[index]?.iconImage ?? ""}
              onChange={(value) =>
                setValue(`cards.${index}.iconImage`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/icons`}
            /> */}
            <label>
              Accent color
              <input
                {...register(`items.${index}.accentColor`, { required: true })}
                placeholder="#0b3d91"
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length <= 2}
            >
              Remove card
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          disabled={fields.length >= 2}
          onClick={() =>
            append({
              title: "",
              description: "",
              icon: "",
              iconImage: "",
              accentColor: "#0b3d91",
            })
          }
        >
          Add card
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutFrameworkPillarFormValue = {
  letter: string;
  title: string;
  description: string;
};

type AboutFrameworkFormValues = {
  title: string;
  description: string;
  pillars: AboutFrameworkPillarFormValue[];
};

function toAboutFrameworkDefaultValues(
  data: Record<string, unknown>,
): AboutFrameworkFormValues {
  const rawPillars = Array.isArray(data.pillars)
    ? (data.pillars as Record<string, unknown>[])
    : [];

  const fallbackPillars: AboutFrameworkPillarFormValue[] = [
    { letter: "O", title: "Operational Excellence", description: "" },
    { letter: "N", title: "Next-Gen Learning", description: "" },
    { letter: "E", title: "Entrepreneurial Growth", description: "" },
  ];

  return {
    title: (data.title as string) ?? "The O.N.E Framework",
    description: (data.description as string) ?? "",
    pillars:
      rawPillars.length > 0
        ? rawPillars.map((item) => ({
          letter: (item.letter as string) ?? "",
          title: (item.title as string) ?? "",
          description: (item.description as string) ?? "",
        }))
        : fallbackPillars,
  };
}

export function AboutFrameworkSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutFrameworkDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AboutFrameworkFormValues>({ defaultValues });
  const { fields } = useFieldArray({ control, name: "pillars" });

  function handleValid(values: AboutFrameworkFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      pillars: values.pillars.map((pillar) => ({
        letter: pillar.letter.trim(),
        title: pillar.title.trim(),
        description: pillar.description.trim(),
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Framework Title
        <input {...register("title", { required: true })} />
      </label>

      <label>
        Framework Description
        <textarea rows={3} {...register("description", { required: true })} />
      </label>

      <div>
        <h4>Framework Pillars (O, N, E)</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Letter
              <input {...register(`pillars.${index}.letter`, { required: true })} />
            </label>
            <label>
              Title
              <input {...register(`pillars.${index}.title`, { required: true })} />
            </label>
            <label>
              Description
              <textarea
                rows={4}
                {...register(`pillars.${index}.description`, { required: true })}
              />
            </label>
          </div>
        ))}
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutAdvantageFormValues = {
  eyebrow: string;
  titleLines: string;
  description: string;
  pointsLines: string;
  image: string;
};

function toAboutAdvantageDefaultValues(
  data: Record<string, unknown>,
): AboutAdvantageFormValues {
  return {
    eyebrow: (data.eyebrow as string) ?? "",
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    pointsLines: Array.isArray(data.points)
      ? (data.points as string[]).join("\n")
      : "",
    image: (data.image as string) ?? "",
  };
}

export function AboutAdvantageSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutAdvantageDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutAdvantageFormValues>({ defaultValues });
  const image = useWatch({ control, name: "image" });

  function handleValid(values: AboutAdvantageFormValues) {
    onSave({
      eyebrow: values.eyebrow,
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      points: values.pointsLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      image: values.image,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Eyebrow
        <input {...register("eyebrow", { required: "Eyebrow is required" })} />
        {errors.eyebrow ? (
          <p className="admin-field-error">{errors.eyebrow.message}</p>
        ) : null}
      </label>

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", { required: "Title is required" })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <label>
        Bullet points (one per line)
        <textarea
          rows={4}
          {...register("pointsLines", {
            required: "At least one point is required",
          })}
        />
        {errors.pointsLines ? (
          <p className="admin-field-error">{errors.pointsLines.message}</p>
        ) : null}
      </label>

      <input
        type="hidden"
        {...register("image", { required: "Image is required" })}
      />
      <ImageUploadField
        label="Image URL"
        value={image}
        onChange={(value) =>
          setValue("image", value, { shouldDirty: true, shouldValidate: true })
        }
        folder={`sections/${section.type}`}
      />
      {errors.image ? (
        <p className="admin-field-error">{errors.image.message}</p>
      ) : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutValueItemFormValue = {
  title: string;
  description: string;
  icon: string;
  iconImage: string;
};

type AboutValuesFormValues = {
  title: string;
  description: string;
  region: string;
  reachTitle: string;
  reachImage: string;
  reachMetric1Value: string;
  reachMetric1Label: string;
  reachMetric2Value: string;
  reachMetric2Label: string;
  reachMetric3Value: string;
  reachMetric3Label: string;
  reachMetric4Value: string;
  reachMetric4Label: string;
  items: AboutValueItemFormValue[];
};

function toAboutValuesDefaultValues(
  data: Record<string, unknown>,
): AboutValuesFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    region: (data.region as string) ?? "DUBAI, UNITED ARAB EMIRATES",
    reachTitle:
      ((data.reach as Record<string, unknown> | undefined)?.title as string) ??
      "GLOBAL REACH",
    reachImage:
      ((data.reach as Record<string, unknown> | undefined)?.image as string) ??
      "/home/headquarters.png",
    reachMetric1Value:
      String(
        (Array.isArray((data.reach as Record<string, unknown> | undefined)?.metrics)
          ? ((data.reach as Record<string, unknown>).metrics as Array<Record<string, unknown>>)[0]
            ?.value
          : "0.4MS") ?? "",
      ),
    reachMetric1Label:
      String(
        (Array.isArray((data.reach as Record<string, unknown> | undefined)?.metrics)
          ? ((data.reach as Record<string, unknown>).metrics as Array<Record<string, unknown>>)[0]
            ?.label
          : "LOCAL LATENCY") ?? "",
      ),
    reachMetric2Value:
      String(
        (Array.isArray((data.reach as Record<string, unknown> | undefined)?.metrics)
          ? ((data.reach as Record<string, unknown>).metrics as Array<Record<string, unknown>>)[1]
            ?.value
          : "500PB") ?? "",
      ),
    reachMetric2Label:
      String(
        (Array.isArray((data.reach as Record<string, unknown> | undefined)?.metrics)
          ? ((data.reach as Record<string, unknown>).metrics as Array<Record<string, unknown>>)[1]
            ?.label
          : "DATA MANAGED") ?? "",
      ),
    reachMetric3Value:
      String(
        (Array.isArray((data.reach as Record<string, unknown> | undefined)?.metrics)
          ? ((data.reach as Record<string, unknown>).metrics as Array<Record<string, unknown>>)[2]
            ?.value
          : "128-BIT") ?? "",
      ),
    reachMetric3Label:
      String(
        (Array.isArray((data.reach as Record<string, unknown> | undefined)?.metrics)
          ? ((data.reach as Record<string, unknown>).metrics as Array<Record<string, unknown>>)[2]
            ?.label
          : "ENCRYPTION STANDARD") ?? "",
      ),
    reachMetric4Value:
      String(
        (Array.isArray((data.reach as Record<string, unknown> | undefined)?.metrics)
          ? ((data.reach as Record<string, unknown>).metrics as Array<Record<string, unknown>>)[3]
            ?.value
          : "24/7") ?? "",
      ),
    reachMetric4Label:
      String(
        (Array.isArray((data.reach as Record<string, unknown> | undefined)?.metrics)
          ? ((data.reach as Record<string, unknown>).metrics as Array<Record<string, unknown>>)[3]
            ?.label
          : "THREAT MONITORING") ?? "",
      ),
    items:
      rawItems.length > 0
        ? rawItems.map((item) => ({
          title: (item.title as string) ?? "",
          description: (item.description as string) ?? "",
          icon: (item.icon as string) ?? "",
          iconImage: (item.iconImage as string) ?? "",
        }))
        : [{ title: "", description: "", icon: "", iconImage: "" }],
  };
}

export function AboutValuesSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutValuesDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutValuesFormValues>({ defaultValues });
  const reachImage = useWatch({ control, name: "reachImage" });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = useWatch({ control, name: "items" });

  function handleValid(values: AboutValuesFormValues) {
    onSave({
      title: values.title,
      description: values.description || undefined,
      region: values.region,
      items: values.items.map((item) => ({
        title: item.title,
        description: item.description,
        icon: item.icon || undefined,
        iconImage: item.iconImage || undefined,
      })),
      reach: {
        title: values.reachTitle,
        image: values.reachImage,
        metrics: [
          { value: values.reachMetric1Value, label: values.reachMetric1Label },
          { value: values.reachMetric2Value, label: values.reachMetric2Label },
          { value: values.reachMetric3Value, label: values.reachMetric3Label },
          { value: values.reachMetric4Value, label: values.reachMetric4Label },
        ],
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Subtitle / description
        <textarea rows={3} {...register("description")} />
      </label>

      <label>
        Region label
        <input {...register("region", { required: "Region is required" })} />
      </label>

      <div>
        <h4>Global reach block</h4>
        <label>
          Title
          <input {...register("reachTitle", { required: true })} />
        </label>
        <input type="hidden" {...register("reachImage")} />
        <ImageUploadField
          label="Image URL"
          value={reachImage}
          onChange={(value) =>
            setValue("reachImage", value, { shouldDirty: true, shouldValidate: true })
          }
          folder={`sections/${section.type}/reach`}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            Metric 1 value
            <input {...register("reachMetric1Value", { required: true })} />
          </label>
          <label>
            Metric 1 label
            <input {...register("reachMetric1Label", { required: true })} />
          </label>
          <label>
            Metric 2 value
            <input {...register("reachMetric2Value", { required: true })} />
          </label>
          <label>
            Metric 2 label
            <input {...register("reachMetric2Label", { required: true })} />
          </label>
          <label>
            Metric 3 value
            <input {...register("reachMetric3Value", { required: true })} />
          </label>
          <label>
            Metric 3 label
            <input {...register("reachMetric3Label", { required: true })} />
          </label>
          <label>
            Metric 4 value
            <input {...register("reachMetric4Value", { required: true })} />
          </label>
          <label>
            Metric 4 label
            <input {...register("reachMetric4Label", { required: true })} />
          </label>
        </div>
      </div>

      <div>
        <h4>Value cards</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Title
              <input
                {...register(`items.${index}.title`, { required: true })}
              />
            </label>
            <label>
              Description
              <textarea
                rows={3}
                {...register(`items.${index}.description`, { required: true })}
              />
            </label>
            <label>
              Icon
              <Controller
                name={`items.${index}.icon`}
                control={control}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
            {/* <input type="hidden" {...register(`items.${index}.iconImage`)} />
            <ImageUploadField
              label="Custom icon image URL"
              value={items?.[index]?.iconImage ?? ""}
              onChange={(value) =>
                setValue(`items.${index}.iconImage`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/icons`}
            /> */}
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove value
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({ title: "", description: "", icon: "", iconImage: "" })
          }
        >
          Add value
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ResearchHubFormValues = {
  heroBadge: string;
  heroTitleLines: string;
  heroDescription: string;
  heroPrimaryActionLabel: string;
  heroPrimaryActionHref: string;
  heroSecondaryActionLabel: string;
  heroSecondaryActionHref: string;
  heroImage: string;
  overviewTitle: string;
  overviewDescription: string;
  overviewPointsLines: string;
  overviewImage: string;
  pillarsTitle: string;
  pillar1Icon: string;
  pillar1Title: string;
  pillar1Description: string;
  pillar1Project: string;
  pillar2Icon: string;
  pillar2Title: string;
  pillar2Description: string;
  pillar2Project: string;
  pillar3Icon: string;
  pillar3Title: string;
  pillar3Description: string;
  pillar3Project: string;
  metric1Value: string;
  metric1Label: string;
  metric2Value: string;
  metric2Label: string;
  metric3Value: string;
  metric3Label: string;
  metric4Value: string;
  metric4Label: string;
  simulationTitle: string;
  simulationDescription: string;
  accuracyLabel: string;
  accuracyValue: string;
  velocityLabel: string;
  velocityValue: string;
  simulationImage: string;
};

function toResearchHubDefaultValues(data: Record<string, unknown>): ResearchHubFormValues {
  const primary = (data.heroPrimaryAction as Record<string, unknown>) ?? {};
  const secondary = (data.heroSecondaryAction as Record<string, unknown>) ?? {};
  const pillars = Array.isArray(data.pillars) ? (data.pillars as Record<string, unknown>[]) : [];
  const metrics = Array.isArray(data.metrics) ? (data.metrics as Record<string, unknown>[]) : [];
  const pillar1 = pillars[0] ?? {};
  const pillar2 = pillars[1] ?? {};
  const pillar3 = pillars[2] ?? {};
  const metric1 = metrics[0] ?? {};
  const metric2 = metrics[1] ?? {};
  const metric3 = metrics[2] ?? {};
  const metric4 = metrics[3] ?? {};
  return {
    heroBadge: (data.heroBadge as string) ?? "",
    heroTitleLines: Array.isArray(data.heroTitleLines) ? (data.heroTitleLines as string[]).join("\n") : "",
    heroDescription: (data.heroDescription as string) ?? "",
    heroPrimaryActionLabel: (primary.label as string) ?? "",
    heroPrimaryActionHref: (primary.href as string) ?? "",
    heroSecondaryActionLabel: (secondary.label as string) ?? "",
    heroSecondaryActionHref: (secondary.href as string) ?? "",
    heroImage: (data.heroImage as string) ?? "",
    overviewTitle: (data.overviewTitle as string) ?? "",
    overviewDescription: (data.overviewDescription as string) ?? "",
    overviewPointsLines: Array.isArray(data.overviewPoints) ? (data.overviewPoints as string[]).join("\n") : "",
    overviewImage: (data.overviewImage as string) ?? "",
    pillarsTitle: (data.pillarsTitle as string) ?? "",
    pillar1Icon: (pillar1.icon as string) ?? "",
    pillar1Title: (pillar1.title as string) ?? "",
    pillar1Description: (pillar1.description as string) ?? "",
    pillar1Project: (pillar1.project as string) ?? "",
    pillar2Icon: (pillar2.icon as string) ?? "",
    pillar2Title: (pillar2.title as string) ?? "",
    pillar2Description: (pillar2.description as string) ?? "",
    pillar2Project: (pillar2.project as string) ?? "",
    pillar3Icon: (pillar3.icon as string) ?? "",
    pillar3Title: (pillar3.title as string) ?? "",
    pillar3Description: (pillar3.description as string) ?? "",
    pillar3Project: (pillar3.project as string) ?? "",
    metric1Value: (metric1.value as string) ?? "",
    metric1Label: (metric1.label as string) ?? "",
    metric2Value: (metric2.value as string) ?? "",
    metric2Label: (metric2.label as string) ?? "",
    metric3Value: (metric3.value as string) ?? "",
    metric3Label: (metric3.label as string) ?? "",
    metric4Value: (metric4.value as string) ?? "",
    metric4Label: (metric4.label as string) ?? "",
    simulationTitle: (data.simulationTitle as string) ?? "",
    simulationDescription: (data.simulationDescription as string) ?? "",
    accuracyLabel: (data.accuracyLabel as string) ?? "",
    accuracyValue: (data.accuracyValue as string) ?? "",
    velocityLabel: (data.velocityLabel as string) ?? "",
    velocityValue: (data.velocityValue as string) ?? "",
    simulationImage: (data.simulationImage as string) ?? "",
  };
}

export function ResearchHubSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(() => toResearchHubDefaultValues(section.data), [section.data]);
  const { register, control, setValue, handleSubmit, formState: { isSubmitting } } =
    useForm<ResearchHubFormValues>({ defaultValues });
  const heroImage = useWatch({ control, name: "heroImage" });
  const overviewImage = useWatch({ control, name: "overviewImage" });
  const simulationImage = useWatch({ control, name: "simulationImage" });

  function handleValid(values: ResearchHubFormValues) {
    onSave({
      heroBadge: values.heroBadge,
      heroTitleLines: values.heroTitleLines.split("\n").map((x) => x.trim()).filter(Boolean),
      heroDescription: values.heroDescription,
      heroPrimaryAction: { label: values.heroPrimaryActionLabel, href: values.heroPrimaryActionHref },
      heroSecondaryAction: { label: values.heroSecondaryActionLabel, href: values.heroSecondaryActionHref },
      heroImage: values.heroImage,
      overviewTitle: values.overviewTitle,
      overviewDescription: values.overviewDescription,
      overviewPoints: values.overviewPointsLines.split("\n").map((x) => x.trim()).filter(Boolean),
      overviewImage: values.overviewImage,
      pillarsTitle: values.pillarsTitle,
      pillars: [
        {
          icon: values.pillar1Icon,
          title: values.pillar1Title,
          description: values.pillar1Description,
          project: values.pillar1Project,
        },
        {
          icon: values.pillar2Icon,
          title: values.pillar2Title,
          description: values.pillar2Description,
          project: values.pillar2Project,
        },
        {
          icon: values.pillar3Icon,
          title: values.pillar3Title,
          description: values.pillar3Description,
          project: values.pillar3Project,
        },
      ],
      metrics: [
        { value: values.metric1Value, label: values.metric1Label },
        { value: values.metric2Value, label: values.metric2Label },
        { value: values.metric3Value, label: values.metric3Label },
        { value: values.metric4Value, label: values.metric4Label },
      ],
      simulationTitle: values.simulationTitle,
      simulationDescription: values.simulationDescription,
      accuracyLabel: values.accuracyLabel,
      accuracyValue: values.accuracyValue,
      velocityLabel: values.velocityLabel,
      velocityValue: values.velocityValue,
      simulationImage: values.simulationImage,
    });
  }

  return (
    <SectionForm className="admin-form admin-section-form" onSubmit={handleSubmit(handleValid)}>
      <SectionHeading section={section} />
      <label>Hero Badge<input {...register("heroBadge")} /></label>
      <label>Hero Title lines<textarea rows={3} {...register("heroTitleLines")} /></label>
      <label>Hero Description<textarea rows={3} {...register("heroDescription")} /></label>
      <label>Hero Primary Label<input {...register("heroPrimaryActionLabel")} /></label>
      <label>Hero Primary Href<input {...register("heroPrimaryActionHref")} /></label>
      <label>Hero Secondary Label<input {...register("heroSecondaryActionLabel")} /></label>
      <label>Hero Secondary Href<input {...register("heroSecondaryActionHref")} /></label>
      <input type="hidden" {...register("heroImage")} />
      <ImageUploadField label="Hero image URL" value={heroImage} onChange={(value) => setValue("heroImage", value)} folder={`sections/${section.type}`} />

      <label>Overview Title<input {...register("overviewTitle")} /></label>
      <label>Overview Description<textarea rows={3} {...register("overviewDescription")} /></label>
      <label>Overview Points (one per line)<textarea rows={4} {...register("overviewPointsLines")} /></label>
      <input type="hidden" {...register("overviewImage")} />
      <ImageUploadField label="Overview image URL" value={overviewImage} onChange={(value) => setValue("overviewImage", value)} folder={`sections/${section.type}`} />

      <label>Pillars Title<input {...register("pillarsTitle")} /></label>
      <div className="admin-section-group">
        <h4>Core Research Pillars</h4>
        <div className="admin-section-card">
          <h5>Pillar 1</h5>
          <label>Icon<input {...register("pillar1Icon")} placeholder="innovation" /></label>
          <label>Title<input {...register("pillar1Title")} /></label>
          <label>Description<textarea rows={3} {...register("pillar1Description")} /></label>
          <label>Project label<input {...register("pillar1Project")} /></label>
        </div>
        <div className="admin-section-card">
          <h5>Pillar 2</h5>
          <label>Icon<input {...register("pillar2Icon")} placeholder="vision" /></label>
          <label>Title<input {...register("pillar2Title")} /></label>
          <label>Description<textarea rows={3} {...register("pillar2Description")} /></label>
          <label>Project label<input {...register("pillar2Project")} /></label>
        </div>
        <div className="admin-section-card">
          <h5>Pillar 3</h5>
          <label>Icon<input {...register("pillar3Icon")} placeholder="compliance" /></label>
          <label>Title<input {...register("pillar3Title")} /></label>
          <label>Description<textarea rows={3} {...register("pillar3Description")} /></label>
          <label>Project label<input {...register("pillar3Project")} /></label>
        </div>
      </div>

      <div className="admin-section-group">
        <h4>Metrics strip</h4>
        <div className="admin-section-card">
          <h5>Metric 1</h5>
          <label>Value<input {...register("metric1Value")} placeholder="124+" /></label>
          <label>Label<input {...register("metric1Label")} placeholder="WHITE PAPERS" /></label>
        </div>
        <div className="admin-section-card">
          <h5>Metric 2</h5>
          <label>Value<input {...register("metric2Value")} placeholder="42" /></label>
          <label>Label<input {...register("metric2Label")} placeholder="PATENTS FILED" /></label>
        </div>
        <div className="admin-section-card">
          <h5>Metric 3</h5>
          <label>Value<input {...register("metric3Value")} placeholder="15" /></label>
          <label>Label<input {...register("metric3Label")} placeholder="GLOBAL LABS" /></label>
        </div>
        <div className="admin-section-card">
          <h5>Metric 4</h5>
          <label>Value<input {...register("metric4Value")} placeholder="$12M" /></label>
          <label>Label<input {...register("metric4Label")} placeholder="GRANT FUNDING" /></label>
        </div>
      </div>

      <label>Simulation Title<input {...register("simulationTitle")} /></label>
      <label>Simulation Description<textarea rows={3} {...register("simulationDescription")} /></label>
      <label>Accuracy Label<input {...register("accuracyLabel")} /></label>
      <label>Accuracy Value<input {...register("accuracyValue")} /></label>
      <label>Velocity Label<input {...register("velocityLabel")} /></label>
      <label>Velocity Value<input {...register("velocityValue")} /></label>
      <input type="hidden" {...register("simulationImage")} />
      <ImageUploadField label="Simulation image URL" value={simulationImage} onChange={(value) => setValue("simulationImage", value)} folder={`sections/${section.type}`} />

      <SectionSaveFooter isSubmitting={isSubmitting} message={saveMessage} messageTone={saveMessageTone} previewHref={previewHref} />
    </SectionForm>
  );
}

type ServicesLicensingFormValues = {
  eyebrow: string;
  titleLines: string;
  description: string;
  reliabilityTitle: string;
  reliabilityDescription: string;
  card1Title: string;
  card1Description: string;
  card1LinkLabel: string;
  card1LinkHref: string;
  card1Icon: string;
  card2Title: string;
  card2Description: string;
  card2LinkLabel: string;
  card2LinkHref: string;
  card2Icon: string;
  licenseRows: string;
  complianceNotice: string;
};

function toServicesLicensingDefaultValues(data: Record<string, unknown>): ServicesLicensingFormValues {
  const title = Array.isArray(data.title) ? (data.title as string[]).join("\n") : "";
  const cards = Array.isArray(data.cards) ? (data.cards as Record<string, unknown>[]) : [];
  const card1 = cards[0] ?? {};
  const card2 = cards[1] ?? {};
  const licenses = Array.isArray(data.licenses) ? (data.licenses as Record<string, unknown>[]) : [];
  return {
    eyebrow: (data.eyebrow as string) ?? "",
    titleLines: title,
    description: (data.description as string) ?? "",
    reliabilityTitle: (data.reliabilityTitle as string) ?? "",
    reliabilityDescription: (data.reliabilityDescription as string) ?? "",
    card1Title: (card1.title as string) ?? "",
    card1Description: (card1.description as string) ?? "",
    card1LinkLabel: (card1.linkLabel as string) ?? "",
    card1LinkHref: (card1.linkHref as string) ?? "",
    card1Icon: (card1.icon as string) ?? "",
    card2Title: (card2.title as string) ?? "",
    card2Description: (card2.description as string) ?? "",
    card2LinkLabel: (card2.linkLabel as string) ?? "",
    card2LinkHref: (card2.linkHref as string) ?? "",
    card2Icon: (card2.icon as string) ?? "",
    licenseRows: licenses
      .map((row) =>
        [
          row.licenseNumber ?? "",
          row.authority ?? "",
          row.legalType ?? "",
          row.location ?? "",
          row.status ?? "LICENSED",
        ].join(" | "),
      )
      .join("\n"),
    complianceNotice: (data.complianceNotice as string) ?? "",
  };
}

export function ServicesLicensingSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ServicesLicensingFormValues>({
    defaultValues: useMemo(() => toServicesLicensingDefaultValues(section.data), [section.data]),
  });

  function handleValid(values: ServicesLicensingFormValues) {
    const licenses = values.licenseRows
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [licenseNumber = "", authority = "", legalType = "", location = "", status = "LICENSED"] = line
          .split("|")
          .map((part) => part.trim());
        return { licenseNumber, authority, legalType, location, status };
      });

    onSave({
      eyebrow: values.eyebrow.trim(),
      title: values.titleLines.split("\n").map((x) => x.trim()).filter(Boolean),
      description: values.description.trim(),
      reliabilityTitle: values.reliabilityTitle.trim(),
      reliabilityDescription: values.reliabilityDescription.trim(),
      cards: [
        {
          title: values.card1Title.trim(),
          description: values.card1Description.trim(),
          linkLabel: values.card1LinkLabel.trim(),
          linkHref: values.card1LinkHref.trim(),
          icon: values.card1Icon.trim(),
        },
        {
          title: values.card2Title.trim(),
          description: values.card2Description.trim(),
          linkLabel: values.card2LinkLabel.trim(),
          linkHref: values.card2LinkHref.trim(),
          icon: values.card2Icon.trim(),
        },
      ],
      licenses,
      complianceNotice: values.complianceNotice.trim(),
    });
  }

  return (
    <SectionForm className="admin-form admin-section-form" onSubmit={handleSubmit(handleValid)}>
      <SectionHeading section={section} />
      <label>Eyebrow<input {...register("eyebrow")} /></label>
      <label>Title lines (one per line)<textarea rows={3} {...register("titleLines")} /></label>
      <label>Description<textarea rows={3} {...register("description")} /></label>
      <label>Reliability title<input {...register("reliabilityTitle")} /></label>
      <label>Reliability description<textarea rows={3} {...register("reliabilityDescription")} /></label>
      <div className="admin-section-group">
        <h4>Card 1</h4>
        <label>Title<input {...register("card1Title")} /></label>
        <label>Description<textarea rows={3} {...register("card1Description")} /></label>
        <label>Link label<input {...register("card1LinkLabel")} /></label>
        <label>Link href<input {...register("card1LinkHref")} /></label>
        <label>Icon<input {...register("card1Icon")} /></label>
      </div>
      <div className="admin-section-group">
        <h4>Card 2</h4>
        <label>Title<input {...register("card2Title")} /></label>
        <label>Description<textarea rows={3} {...register("card2Description")} /></label>
        <label>Link label<input {...register("card2LinkLabel")} /></label>
        <label>Link href<input {...register("card2LinkHref")} /></label>
        <label>Icon<input {...register("card2Icon")} /></label>
      </div>
      <label>
        License rows (one per line)
        <textarea rows={5} {...register("licenseRows")} />
      </label>
      <FieldHint>Format: license number | authority | legal type | location | status</FieldHint>
      <label>Compliance notice<textarea rows={4} {...register("complianceNotice")} /></label>
      <SectionSaveFooter isSubmitting={isSubmitting} message={saveMessage} messageTone={saveMessageTone} previewHref={previewHref} />
    </SectionForm>
  );
}

type AboutMissionFormValues = {
  label: string;
  headlineLead: string;
  headlineBold: string;
  description: string;
  pillar1Title: string;
  pillar1Description: string;
  pillar2Title: string;
  pillar2Description: string;
};

function toAboutMissionDefaults(data: Record<string, unknown>): AboutMissionFormValues {
  const pillars = Array.isArray(data.pillars) ? (data.pillars as Record<string, unknown>[]) : [];
  const p1 = pillars[0] ?? {};
  const p2 = pillars[1] ?? {};
  return {
    label: (data.label as string) ?? "",
    headlineLead: (data.headlineLead as string) ?? "",
    headlineBold: (data.headlineBold as string) ?? "",
    description: (data.description as string) ?? "",
    pillar1Title: (p1.title as string) ?? "",
    pillar1Description: (p1.description as string) ?? "",
    pillar2Title: (p2.title as string) ?? "",
    pillar2Description: (p2.description as string) ?? "",
  };
}

export function AboutMissionSectionForm(props: SectionFormProps) {
  const { section, onSave, previewHref, saveMessage, saveMessageTone } = props;
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<AboutMissionFormValues>({
    defaultValues: useMemo(() => toAboutMissionDefaults(section.data), [section.data]),
  });
  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit((v) =>
        onSave({
          label: v.label.trim(),
          headlineLead: v.headlineLead.trim(),
          headlineBold: v.headlineBold.trim(),
          description: v.description.trim(),
          pillars: [
            { title: v.pillar1Title.trim(), description: v.pillar1Description.trim() },
            { title: v.pillar2Title.trim(), description: v.pillar2Description.trim() },
          ],
        }))}
    >
      <SectionHeading section={section} />
      <label>Label<input {...register("label")} /></label>
      <label>Headline lead<textarea rows={2} {...register("headlineLead")} /></label>
      <label>Headline bold<textarea rows={2} {...register("headlineBold")} /></label>
      <label>Description<textarea rows={3} {...register("description")} /></label>
      <label>Pillar 1 title<input {...register("pillar1Title")} /></label>
      <label>Pillar 1 description<textarea rows={2} {...register("pillar1Description")} /></label>
      <label>Pillar 2 title<input {...register("pillar2Title")} /></label>
      <label>Pillar 2 description<textarea rows={2} {...register("pillar2Description")} /></label>
      <SectionSaveFooter isSubmitting={isSubmitting} message={saveMessage} messageTone={saveMessageTone} previewHref={previewHref} />
    </SectionForm>
  );
}

type AboutLeadershipMemberFormValue = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

type AboutLeadershipFormValues = {
  title: string;
  asideLabel: string;
  members: AboutLeadershipMemberFormValue[];
};

function toAboutLeadershipDefaults(data: Record<string, unknown>): AboutLeadershipFormValues {
  const members = Array.isArray(data.members) ? (data.members as Record<string, unknown>[]) : [];
  return {
    title: (data.title as string) ?? "",
    asideLabel: (data.asideLabel as string) ?? "",
    members:
      members.length > 0
        ? members.map((member) => ({
          name: (member.name as string) ?? "",
          role: (member.role as string) ?? "",
          bio: (member.bio as string) ?? "",
          image: (member.image as string) ?? "",
        }))
        : [{ name: "", role: "", bio: "", image: "" }],
  };
}

export function AboutLeadershipSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutLeadershipDefaults(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutLeadershipFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "members" });
  const watchedMembers = useWatch({ control, name: "members" });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: AboutLeadershipFormValues) {
    onSave({
      title: values.title.trim(),
      asideLabel: values.asideLabel.trim(),
      members: values.members
        .map((member) => ({
          name: member.name.trim(),
          role: member.role.trim(),
          bio: member.bio.trim(),
          image: member.image.trim(),
        }))
        .filter((member) => member.name || member.role || member.bio || member.image),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Section title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? <p className="admin-field-error">{errors.title.message}</p> : null}
      </label>

      <label>
        Aside label
        <input {...register("asideLabel", { required: "Aside label is required" })} />
        {errors.asideLabel ? (
          <p className="admin-field-error">{errors.asideLabel.message}</p>
        ) : null}
      </label>

      <div className="admin-section-group">
        <h4>Leadership cards</h4>
        <FieldHint>Each card appears in the leadership grid on the About page.</FieldHint>

        {fields.map((field, index) => (
          <div key={field.id} className="admin-section-card">
            <h5 style={{ margin: "0 0 12px" }}>Leader {index + 1}</h5>

            <label>
              Name
              <input
                {...register(`members.${index}.name`, { required: "Name is required" })}
                placeholder="MARCUS THORNE"
              />
              {errors.members?.[index]?.name ? (
                <p className="admin-field-error">{errors.members[index]?.name?.message}</p>
              ) : null}
            </label>

            <label>
              Role
              <input
                {...register(`members.${index}.role`, { required: "Role is required" })}
                placeholder="CHIEF EXECUTIVE OFFICER"
              />
              {errors.members?.[index]?.role ? (
                <p className="admin-field-error">{errors.members[index]?.role?.message}</p>
              ) : null}
            </label>

            <label>
              Bio
              <textarea
                rows={3}
                {...register(`members.${index}.bio`, { required: "Bio is required" })}
              />
              {errors.members?.[index]?.bio ? (
                <p className="admin-field-error">{errors.members[index]?.bio?.message}</p>
              ) : null}
            </label>

            <input type="hidden" {...register(`members.${index}.image`, { required: true })} />
            <ImageUploadField
              label="Portrait image"
              value={watchedMembers?.[index]?.image ?? ""}
              onChange={(value) =>
                setValue(`members.${index}.image`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/members`}
              placeholder="/about/leader-1.jpg"
            />
            {errors.members?.[index]?.image ? (
              <p className="admin-field-error">{errors.members[index]?.image?.message}</p>
            ) : null}

            <button
              type="button"
              className="admin-button-secondary"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove leader
            </button>
          </div>
        ))}

        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({
              name: "",
              role: "",
              bio: "",
              image: "",
            })
          }
        >
          Add leader
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutRegulatoryFormValues = {
  badge: string;
  title: string;
  description: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  cardTitle: string;
  cardItems: string;
};

function toAboutRegulatoryDefaults(data: Record<string, unknown>): AboutRegulatoryFormValues {
  const stats = Array.isArray(data.stats) ? (data.stats as Record<string, unknown>[]) : [];
  const s1 = stats[0] ?? {};
  const s2 = stats[1] ?? {};
  return {
    badge: (data.badge as string) ?? "",
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    stat1Value: (s1.value as string) ?? "",
    stat1Label: (s1.label as string) ?? "",
    stat2Value: (s2.value as string) ?? "",
    stat2Label: (s2.label as string) ?? "",
    cardTitle: (data.cardTitle as string) ?? "",
    cardItems: Array.isArray(data.cardItems) ? (data.cardItems as string[]).join("\n") : "",
  };
}

export function AboutRegulatorySectionForm(props: SectionFormProps) {
  const { section, onSave, previewHref, saveMessage, saveMessageTone } = props;
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<AboutRegulatoryFormValues>({
    defaultValues: useMemo(() => toAboutRegulatoryDefaults(section.data), [section.data]),
  });
  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit((v) =>
        onSave({
          badge: v.badge.trim(),
          title: v.title.trim(),
          description: v.description.trim(),
          stats: [
            { value: v.stat1Value.trim(), label: v.stat1Label.trim() },
            { value: v.stat2Value.trim(), label: v.stat2Label.trim() },
          ],
          cardTitle: v.cardTitle.trim(),
          cardItems: v.cardItems.split("\n").map((x) => x.trim()).filter(Boolean),
        }))}
    >
      <SectionHeading section={section} />
      <label>Badge<input {...register("badge")} /></label>
      <label>Title<input {...register("title")} /></label>
      <label>Description<textarea rows={3} {...register("description")} /></label>
      <label>Stat 1 value<input {...register("stat1Value")} /></label>
      <label>Stat 1 label<input {...register("stat1Label")} /></label>
      <label>Stat 2 value<input {...register("stat2Value")} /></label>
      <label>Stat 2 label<input {...register("stat2Label")} /></label>
      <label>Card title<input {...register("cardTitle")} /></label>
      <label>Card items (one per line)<textarea rows={4} {...register("cardItems")} /></label>
      <SectionSaveFooter isSubmitting={isSubmitting} message={saveMessage} messageTone={saveMessageTone} previewHref={previewHref} />
    </SectionForm>
  );
}

type ProjectsHeroFormValues = { eyebrow: string; titleLines: string; description: string };
export function ProjectsHeroSectionForm(props: SectionFormProps) {
  const { section, onSave, previewHref, saveMessage, saveMessageTone } = props;
  const defaultValues = useMemo(
    () => ({
      eyebrow: (section.data.eyebrow as string) ?? "",
      titleLines: Array.isArray(section.data.titleLines) ? (section.data.titleLines as string[]).join("\n") : "",
      description: (section.data.description as string) ?? "",
    }),
    [section.data],
  );
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ProjectsHeroFormValues>({ defaultValues });
  return (
    <SectionForm className="admin-form admin-section-form" onSubmit={handleSubmit((v) => onSave({
      eyebrow: v.eyebrow.trim(),
      titleLines: v.titleLines.split("\n").map((x) => x.trim()).filter(Boolean),
      description: v.description.trim(),
    }))}>
      <SectionHeading section={section} />
      <label>Eyebrow<input {...register("eyebrow")} /></label>
      <label>Title lines (one per line)<textarea rows={3} {...register("titleLines")} /></label>
      <label>Description<textarea rows={3} {...register("description")} /></label>
      <SectionSaveFooter isSubmitting={isSubmitting} message={saveMessage} messageTone={saveMessageTone} previewHref={previewHref} />
    </SectionForm>
  );
}

type ProjectsGridItemFormValue = {
  category: string;
  title: string;
  image: string;
};

type ProjectsGridFormValues = {
  items: ProjectsGridItemFormValue[];
};

function toProjectsGridDefaultValues(data: Record<string, unknown>): ProjectsGridFormValues {
  const items = Array.isArray(data.items) ? (data.items as Record<string, unknown>[]) : [];
  return {
    items:
      items.length > 0
        ? items.map((item) => ({
          category: (item.category as string) ?? "",
          title: (item.title as string) ?? "",
          image: (item.image as string) ?? "",
        }))
        : [{ category: "", title: "", image: "" }],
  };
}

export function ProjectsGridSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toProjectsGridDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectsGridFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems = useWatch({ control, name: "items" });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: ProjectsGridFormValues) {
    onSave({
      items: values.items
        .map((item) => ({
          category: item.category.trim(),
          title: item.title.trim(),
          image: item.image.trim(),
        }))
        .filter((item) => item.category || item.title || item.image),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <div className="admin-section-group">
        <h4>Portfolio grid items</h4>
        <FieldHint>
          Each card appears in the 3×2 portfolio grid on the Projects page. Upload an image for
          every project.
        </FieldHint>

        {fields.map((field, index) => (
          <div key={field.id} className="admin-section-card">
            <h5 style={{ margin: "0 0 12px" }}>Project {index + 1}</h5>

            <label>
              Category
              <input
                {...register(`items.${index}.category`, {
                  required: "Category is required",
                })}
                placeholder="Real Estate"
              />
              {errors.items?.[index]?.category ? (
                <p className="admin-field-error">{errors.items[index]?.category?.message}</p>
              ) : null}
            </label>

            <label>
              Project title
              <input
                {...register(`items.${index}.title`, {
                  required: "Title is required",
                })}
                placeholder="RAK Waterfront Series"
              />
              {errors.items?.[index]?.title ? (
                <p className="admin-field-error">{errors.items[index]?.title?.message}</p>
              ) : null}
            </label>

            <input type="hidden" {...register(`items.${index}.image`, { required: true })} />
            <ImageUploadField
              label="Project image"
              value={watchedItems?.[index]?.image ?? ""}
              onChange={(value) =>
                setValue(`items.${index}.image`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/items`}
              placeholder="/projects/rak-waterfront.jpg"
            />
            {errors.items?.[index]?.image ? (
              <p className="admin-field-error">{errors.items[index]?.image?.message}</p>
            ) : null}

            <button
              type="button"
              className="admin-button-secondary"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove project
            </button>
          </div>
        ))}

        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({
              category: "",
              title: "",
              image: "",
            })
          }
        >
          Add project
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ProjectsIntegrityItemFormValue = {
  icon: string;
  title: string;
  description: string;
};

type ProjectsIntegrityFormValues = {
  heading: string;
  description: string;
  items: ProjectsIntegrityItemFormValue[];
};

function toProjectsIntegrityDefaultValues(data: Record<string, unknown>): ProjectsIntegrityFormValues {
  const items = Array.isArray(data.items) ? (data.items as Record<string, unknown>[]) : [];
  return {
    heading: (data.heading as string) ?? "",
    description: (data.description as string) ?? "",
    items:
      items.length > 0
        ? items.map((item) => ({
          icon: (item.icon as string) ?? "verified",
          title: (item.title as string) ?? "",
          description: (item.description as string) ?? "",
        }))
        : [
          {
            icon: "verified",
            title: "",
            description: "",
          },
        ],
  };
}

export function ProjectsIntegritySectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toProjectsIntegrityDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectsIntegrityFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: ProjectsIntegrityFormValues) {
    onSave({
      heading: values.heading.trim(),
      description: values.description.trim(),
      items: values.items
        .map((item) => ({
          icon: item.icon.trim() || "verified",
          title: item.title.trim(),
          description: item.description.trim(),
        }))
        .filter((item) => item.title || item.description),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Section heading
        <input {...register("heading", { required: "Heading is required" })} />
        {errors.heading ? (
          <p className="admin-field-error">{errors.heading.message}</p>
        ) : null}
      </label>

      <label>
        Section description
        <textarea rows={3} {...register("description", { required: "Description is required" })} />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div className="admin-section-group">
        <h4>Integrity items</h4>
        <FieldHint>Open the icon dropdown to pick the logo shown on the Projects page.</FieldHint>

        {fields.map((field, index) => (
          <div key={field.id} className="admin-section-card">
            <h5 style={{ margin: "0 0 12px" }}>Item {index + 1}</h5>

            <div>
              <span className="admin-field-label">Icon</span>
              <Controller
                control={control}
                name={`items.${index}.icon`}
                rules={{ required: "Icon is required" }}
                render={({ field: iconField }) => (
                  <ProjectsIntegrityIconPicker
                    value={iconField.value}
                    onChange={iconField.onChange}
                  />
                )}
              />
            </div>

            <label>
              Title
              <input
                {...register(`items.${index}.title`, { required: "Title is required" })}
                placeholder="Licensed and compliant"
              />
              {errors.items?.[index]?.title ? (
                <p className="admin-field-error">{errors.items[index]?.title?.message}</p>
              ) : null}
            </label>

            <label>
              Description
              <textarea
                rows={3}
                {...register(`items.${index}.description`, { required: "Description is required" })}
              />
              {errors.items?.[index]?.description ? (
                <p className="admin-field-error">{errors.items[index]?.description?.message}</p>
              ) : null}
            </label>

            <button
              type="button"
              className="admin-button-secondary"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove item
            </button>
          </div>
        ))}

        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({
              icon: "verified",
              title: "",
              description: "",
            })
          }
        >
          Add item
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ProjectsPartnersFormValues = {
  formTitle: string;
  submitLabel: string;
  placeholderName: string;
  placeholderEmail: string;
  placeholderSubject: string;
  placeholderMessage: string;
  successMessage: string;
  errorMessage: string;
  mapImage: string;
  hqLabel: string;
  hqTitle: string;
  hqAddress: string;
  contactLabel: string;
  contactEmail: string;
};

function toProjectsPartnersDefaultValues(data: Record<string, unknown>): ProjectsPartnersFormValues {
  const placeholders =
    data.placeholders && typeof data.placeholders === "object"
      ? (data.placeholders as Record<string, unknown>)
      : {};
  return {
    formTitle: (data.formTitle as string) ?? "",
    submitLabel: (data.submitLabel as string) ?? "",
    placeholderName: (placeholders.name as string) ?? "",
    placeholderEmail: (placeholders.email as string) ?? "",
    placeholderSubject: (placeholders.subject as string) ?? "",
    placeholderMessage: (placeholders.message as string) ?? "",
    successMessage: (data.successMessage as string) ?? "",
    errorMessage: (data.errorMessage as string) ?? "",
    mapImage: (data.mapImage as string) ?? "",
    hqLabel: (data.hqLabel as string) ?? "",
    hqTitle: (data.hqTitle as string) ?? "",
    hqAddress: (data.hqAddress as string) ?? "",
    contactLabel: (data.contactLabel as string) ?? "",
    contactEmail: (data.contactEmail as string) ?? "",
  };
}

export function ProjectsPartnersSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toProjectsPartnersDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectsPartnersFormValues>({ defaultValues });
  const mapImage = watch("mapImage");

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: ProjectsPartnersFormValues) {
    onSave({
      formTitle: values.formTitle.trim(),
      submitLabel: values.submitLabel.trim(),
      placeholders: {
        name: values.placeholderName.trim(),
        email: values.placeholderEmail.trim(),
        subject: values.placeholderSubject.trim(),
        message: values.placeholderMessage.trim(),
      },
      successMessage: values.successMessage.trim(),
      errorMessage: values.errorMessage.trim(),
      mapImage: values.mapImage.trim(),
      hqLabel: values.hqLabel.trim(),
      hqTitle: values.hqTitle.trim(),
      hqAddress: values.hqAddress.trim(),
      contactLabel: values.contactLabel.trim(),
      contactEmail: values.contactEmail.trim(),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <div className="admin-section-group">
        <h4>Form block</h4>
        <label>
          Form title
          <input {...register("formTitle", { required: "Form title is required" })} />
          {errors.formTitle ? (
            <p className="admin-field-error">{errors.formTitle.message}</p>
          ) : null}
        </label>
        <label>
          Submit button label
          <input {...register("submitLabel", { required: "Submit label is required" })} />
          {errors.submitLabel ? (
            <p className="admin-field-error">{errors.submitLabel.message}</p>
          ) : null}
        </label>
        <label>
          Name field placeholder
          <input {...register("placeholderName", { required: true })} placeholder="Full Name" />
        </label>
        <label>
          Email field placeholder
          <input {...register("placeholderEmail", { required: true })} placeholder="Institutional Email" />
        </label>
        <label>
          Subject field placeholder
          <input {...register("placeholderSubject", { required: true })} placeholder="Subject of Inquiry" />
        </label>
        <label>
          Message field placeholder
          <textarea
            rows={2}
            {...register("placeholderMessage", { required: true })}
            placeholder="Brief Summary of Project/Inquiry"
          />
        </label>
        <label>
          Success message (after submit)
          <input {...register("successMessage", { required: true })} />
        </label>
        <label>
          Error message (failed submit)
          <input {...register("errorMessage", { required: true })} />
        </label>
      </div>

      <div className="admin-section-group">
        <h4>Location sidebar</h4>
        <input type="hidden" {...register("mapImage", { required: true })} />
        <ImageUploadField
          label="Map image"
          value={mapImage}
          onChange={(value) =>
            setValue("mapImage", value, { shouldDirty: true, shouldValidate: true })
          }
          folder={`sections/${section.type}`}
          placeholder="/projects/rak-map.jpg"
        />
        <label>
          HQ label
          <input {...register("hqLabel", { required: true })} placeholder="HQ LOCATION" />
        </label>
        <label>
          HQ title
          <input {...register("hqTitle", { required: true })} placeholder="RAK Economic Zone" />
        </label>
        <label>
          HQ address
          <textarea rows={3} {...register("hqAddress", { required: true })} />
        </label>
        <label>
          Contact label
          <input {...register("contactLabel", { required: true })} placeholder="DIRECT CONTACT" />
        </label>
        <label>
          Contact email
          <input
            type="email"
            {...register("contactEmail", { required: true })}
            placeholder="office@cryptonexis.com"
          />
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}
