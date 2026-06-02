import type { z } from "zod";
import type { homeTrustedByDataSchema } from "@/schemas/sections";
import HomeInstitutionIcon from "./HomeInstitutionIcon";

type HomeTrustedByContent = z.infer<typeof homeTrustedByDataSchema>;

export default function HomeTrustedBySection({
  content,
  anchorId,
}: {
  content: HomeTrustedByContent;
  anchorId?: string;
}) {
  const title = content.title?.trim() || "TRUSTED BY LEADING INSTITUTIONS";
  const items =
    content.items?.length > 0
      ? content.items
      : [
          { icon: "hospitals", label: "Hospitals" },
          { icon: "clinics", label: "Clinics" },
          { icon: "laboratories", label: "Laboratories" },
          { icon: "rehabCenters", label: "Rehab Centers" },
          { icon: "homeHealthcare", label: "Home Healthcare" },
        ];

  return (
    <section className="thea-trusted" id={anchorId ?? undefined}>
      <div className="thea-trusted__shell">
        <h2 className="thea-trusted__title">{title}</h2>
        <ul className="thea-trusted__grid">
          {items.map((item) => (
            <li key={`${item.icon}-${item.label}`} className="thea-trusted__item">
              <span className="thea-trusted__icon-wrap" aria-hidden="true">
                <HomeInstitutionIcon name={item.icon} className="thea-trusted__icon" />
              </span>
              <span className="thea-trusted__label">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
