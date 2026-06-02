"use client";

import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import ContactHqIconPicker from "@/components/admin/ContactHqIconPicker";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";
import TheaHomeIconPicker from "@/components/admin/TheaHomeIconPicker";
import HomeInstitutionIcon from "@/components/sections/home/HomeInstitutionIcon";
import HomeServiceIcon from "@/components/sections/home/HomeServiceIcon";
import HomeWhyChooseIcon from "@/components/sections/home/HomeWhyChooseIcon";
import {
  THEA_INSTITUTION_ICON_OPTIONS,
  THEA_SERVICE_ICON_OPTIONS,
  THEA_WHY_CHOOSE_ICON_OPTIONS,
} from "@/data/thea-home-icon-options";
import {
  theaHomeAboutDefaults,
  theaHomeProductsDefaults,
  theaHomeQuickInquiryDefaults,
  theaHomeServicesDefaults,
  theaHomeTrustedByDefaults,
  theaHomeWhyChooseDefaults,
} from "@/data/thea-home-sections";

type SectionFormProps = {
  section: { id: string; type: string; order: number; data: Record<string, unknown> };
  onSave: (data: Record<string, unknown>) => void;
  previewHref: string;
  saveMessage?: string | null;
  saveMessageTone?: "success" | "error";
};

const CATEGORY_THEMES = ["pharma", "equipment", "surgical", "consumables"] as const;

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

export function HomeAboutSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? "",
      description: (section.data.description as string) ?? "",
      description2: (section.data.description2 as string) ?? "",
      image: (section.data.image as string) ?? "",
      missionTitle: (section.data.missionTitle as string) ?? "",
      missionText: (section.data.missionText as string) ?? "",
      visionTitle: (section.data.visionTitle as string) ?? "",
      visionText: (section.data.visionText as string) ?? "",
    }),
    [section.data],
  );

  const { register, setValue, watch, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
  });
  const image = watch("image");

  return (
    <form
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(onSave)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input {...register("title", { required: true })} placeholder="About THEA Medical Store" />
      </label>

      <label>
        Paragraph 1
        <textarea rows={4} {...register("description", { required: true })} />
      </label>

      <label>
        Paragraph 2
        <textarea rows={4} {...register("description2")} />
      </label>

      <input type="hidden" {...register("image")} />
      <ImageUploadField
        label="Featured image (optional)"
        value={image}
        onChange={(value) => setValue("image", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
        placeholder="Leave empty for default illustration"
      />

      <h4>Mission card</h4>
      <label>
        Title
        <input {...register("missionTitle", { required: true })} placeholder="Our Mission" />
      </label>
      <label>
        Text
        <textarea rows={2} {...register("missionText", { required: true })} />
      </label>

      <h4>Vision card</h4>
      <label>
        Title
        <input {...register("visionTitle", { required: true })} placeholder="Our Vision" />
      </label>
      <label>
        Text
        <textarea rows={2} {...register("visionText", { required: true })} />
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

type ServiceItem = { icon: string; title: string; description: string };

export function HomeServicesGridSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? theaHomeServicesDefaults.title,
      description: (section.data.description as string) ?? theaHomeServicesDefaults.description,
      items:
        ((section.data.items as ServiceItem[]) ?? []).length > 0
          ? (section.data.items as ServiceItem[]).map((item) => ({
              icon: item.icon ?? "drugStore",
              title: item.title ?? "",
              description: item.description ?? "",
            }))
          : theaHomeServicesDefaults.items,
    }),
    [section.data],
  );

  const { register, control, setValue, watch, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");

  function handleValid(values: typeof defaultValues) {
    onSave({
      title: values.title,
      description: values.description,
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
        Section title
        <input {...register("title", { required: true })} placeholder="Specialized Healthcare Services" />
      </label>

      <label>
        Subtitle
        <textarea rows={2} {...register("description", { required: true })} />
      </label>

      <h4>Service cards</h4>
      {fields.map((field, index) => (
        <div key={field.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #eee" }}>
          <input type="hidden" {...register(`items.${index}.icon` as const)} />
          <label>
            <span className="admin-field-label">Icon</span>
            <TheaHomeIconPicker
              value={items?.[index]?.icon}
              onChange={(icon) =>
                setValue(`items.${index}.icon`, icon, { shouldDirty: true })
              }
              options={THEA_SERVICE_ICON_OPTIONS}
              fallbackKey="drugStore"
              renderIcon={(name, className) => (
                <HomeServiceIcon name={name} className={className} />
              )}
            />
          </label>
          <label>
            Title
            <input {...register(`items.${index}.title` as const, { required: true })} />
          </label>
          <label>
            Description
            <textarea rows={2} {...register(`items.${index}.description` as const, { required: true })} />
          </label>
          {fields.length > 1 ? (
            <button type="button" onClick={() => remove(index)}>
              Remove card
            </button>
          ) : null}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ icon: "drugStore", title: "", description: "" })}
        style={{ marginBottom: 16 }}
      >
        Add service card
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

type CategoryItem = {
  layout: "tall" | "wide" | "small";
  title: string;
  description: string;
  image: string;
  theme: (typeof CATEGORY_THEMES)[number];
};

export function HomeProductCategoriesSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? theaHomeProductsDefaults.title,
      categories:
        ((section.data.categories as CategoryItem[]) ?? []).length >= 4
          ? (section.data.categories as CategoryItem[]).slice(0, 4).map((cat) => ({
              layout: cat.layout ?? "small",
              title: cat.title ?? "",
              description: cat.description ?? "",
              image: cat.image ?? "",
              theme: cat.theme ?? "pharma",
            }))
          : theaHomeProductsDefaults.categories,
    }),
    [section.data],
  );

  const { register, setValue, watch, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
  });
  const categories = watch("categories");

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
        Section title
        <input {...register("title", { required: true })} placeholder="Product Categories" />
      </label>

      <h4>Category cards (4 required for layout)</h4>
      {categories?.map((_, index) => (
        <div key={index} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #eee" }}>
          <p className="admin-muted">Card {index + 1}</p>
          <label>
            Layout
            <select {...register(`categories.${index}.layout` as const)}>
              <option value="tall">Tall (left column)</option>
              <option value="wide">Wide (top right)</option>
              <option value="small">Small (bottom row)</option>
            </select>
          </label>
          <label>
            Theme
            <select {...register(`categories.${index}.theme` as const)}>
              {CATEGORY_THEMES.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </label>
          <label>
            Title
            <input {...register(`categories.${index}.title` as const, { required: true })} />
          </label>
          <label>
            Description (optional for small cards)
            <textarea rows={2} {...register(`categories.${index}.description` as const)} />
          </label>
          <input type="hidden" {...register(`categories.${index}.image` as const)} />
          <ImageUploadField
            label="Background image (optional)"
            value={categories[index]?.image ?? ""}
            onChange={(value) =>
              setValue(`categories.${index}.image`, value, { shouldDirty: true })
            }
            folder={`sections/${section.type}`}
            placeholder="Leave empty for theme gradient"
          />
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

export function HomeTrustedBySectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? theaHomeTrustedByDefaults.title,
      items: (section.data.items as typeof theaHomeTrustedByDefaults.items) ??
        theaHomeTrustedByDefaults.items,
    }),
    [section.data],
  );

  const { register, control, setValue, watch, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");

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

      <h4>Institutions</h4>
      {fields.map((field, index) => (
        <div key={field.id} className="admin-field-group">
          <input type="hidden" {...register(`items.${index}.icon` as const)} />
          <label>
            <span className="admin-field-label">Icon</span>
            <TheaHomeIconPicker
              value={items?.[index]?.icon}
              onChange={(icon) =>
                setValue(`items.${index}.icon`, icon, { shouldDirty: true })
              }
              options={THEA_INSTITUTION_ICON_OPTIONS}
              fallbackKey="hospitals"
              renderIcon={(name, className) => (
                <HomeInstitutionIcon name={name} className={className} />
              )}
            />
          </label>
          <label>
            Label
            <input {...register(`items.${index}.label` as const, { required: true })} />
          </label>
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ icon: "hospitals", label: "" })}>
        Add institution
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

export function HomeQuickInquirySectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? theaHomeQuickInquiryDefaults.title,
      description: (section.data.description as string) ?? theaHomeQuickInquiryDefaults.description,
      submitLabel: (section.data.submitLabel as string) ?? theaHomeQuickInquiryDefaults.submitLabel,
      successMessage:
        (section.data.successMessage as string) ?? theaHomeQuickInquiryDefaults.successMessage,
      errorMessage:
        (section.data.errorMessage as string) ?? theaHomeQuickInquiryDefaults.errorMessage,
      contacts:
        (section.data.contacts as typeof theaHomeQuickInquiryDefaults.contacts) ??
        theaHomeQuickInquiryDefaults.contacts,
      serviceOptions:
        (section.data.serviceOptions as string[]) ?? theaHomeQuickInquiryDefaults.serviceOptions,
    }),
    [section.data],
  );

  const { register, control, setValue, watch, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
  });
  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control,
    name: "contacts",
  });
  const serviceOptions = watch("serviceOptions") ?? [];

  function addServiceOption() {
    setValue("serviceOptions", [...serviceOptions, ""], { shouldDirty: true });
  }

  function removeServiceOption(index: number) {
    setValue(
      "serviceOptions",
      serviceOptions.filter((_, itemIndex) => itemIndex !== index),
      { shouldDirty: true },
    );
  }

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
        Submit button label
        <input {...register("submitLabel")} />
      </label>

      <h4>Contact details</h4>
      {contactFields.map((field, index) => (
        <div key={field.id} className="admin-field-group">
          <input type="hidden" {...register(`contacts.${index}.icon` as const)} />
          <label>
            <span className="admin-field-label">Icon</span>
            <ContactHqIconPicker
              value={watch(`contacts.${index}.icon`)}
              onChange={(icon) =>
                setValue(`contacts.${index}.icon`, icon as "phone" | "mail" | "location", {
                  shouldDirty: true,
                })
              }
            />
          </label>
          <label>
            Value
            <input {...register(`contacts.${index}.value` as const, { required: true })} />
          </label>
          <button type="button" onClick={() => removeContact(index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendContact({ icon: "phone", value: "" })}
      >
        Add contact
      </button>

      <h4>Service type options</h4>
      {serviceOptions.map((_, index) => (
        <div key={`service-option-${index}`} className="admin-field-group">
          <label>
            Option
            <input {...register(`serviceOptions.${index}` as const, { required: true })} />
          </label>
          <button type="button" onClick={() => removeServiceOption(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addServiceOption}>
        Add service option
      </button>

      <label>
        Success message
        <input {...register("successMessage")} />
      </label>
      <label>
        Error message
        <input {...register("errorMessage")} />
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

export function HomeWhyChooseSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: (section.data.title as string) ?? theaHomeWhyChooseDefaults.title,
      image: (section.data.image as string) ?? "",
      items:
        (section.data.items as typeof theaHomeWhyChooseDefaults.items) ??
        theaHomeWhyChooseDefaults.items,
    }),
    [section.data],
  );

  const { register, control, setValue, watch, handleSubmit, formState: { isSubmitting } } =
    useForm({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const image = watch("image");
  const items = watch("items");

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

      <input type="hidden" {...register("image")} />
      <ImageUploadField
        label="Featured image (optional)"
        value={image}
        onChange={(value) => setValue("image", value, { shouldDirty: true })}
        folder={`sections/${section.type}`}
        placeholder="Leave empty for default illustration"
      />

      <h4>Features</h4>
      {fields.map((field, index) => (
        <div key={field.id} className="admin-field-group">
          <input type="hidden" {...register(`items.${index}.icon` as const)} />
          <label>
            <span className="admin-field-label">Icon</span>
            <TheaHomeIconPicker
              value={items?.[index]?.icon}
              onChange={(icon) =>
                setValue(`items.${index}.icon`, icon, { shouldDirty: true })
              }
              options={THEA_WHY_CHOOSE_ICON_OPTIONS}
              fallbackKey="licensedCompliant"
              renderIcon={(name, className) => (
                <HomeWhyChooseIcon name={name} className={className} />
              )}
            />
          </label>
          <label>
            Title
            <input {...register(`items.${index}.title` as const, { required: true })} />
          </label>
          <label>
            Description
            <textarea rows={2} {...register(`items.${index}.description` as const, { required: true })} />
          </label>
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          append({ icon: "licensedCompliant", title: "", description: "" })
        }
      >
        Add feature
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
