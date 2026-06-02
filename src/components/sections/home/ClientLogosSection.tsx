import type { z } from "zod";
import type { clientLogosDataSchema } from "@/schemas/sections";

type LogosContent = z.infer<typeof clientLogosDataSchema>;

export default function ClientLogosSection({ content }: { content: LogosContent }) {
  const eyebrow =
    typeof content.eyebrow === "string" && content.eyebrow.trim() !== ""
      ? content.eyebrow
      : "TRUSTED BY INSTITUTIONAL LEADERS";

  const logos = (Array.isArray(content.logos) ? content.logos : [])
    .map((logo) => String(logo).trim())
    .filter(Boolean);
  const normalizedLogos =
    logos.length > 0
      ? logos
      : ["GLOBAL BANK", "TECH LOGISTICS", "DUBAI URBAN", "GOV SECTOR", "CORE ENERGY"];

  return (
    <section className="logos-section">
      <div className="logos-section__card">
        <p className="logos-section__eyebrow">{eyebrow}</p>
        <div className="logos-section__grid">
          {normalizedLogos.map((logo) => (
            <p key={logo} className="logos-section__logo">
              {logo}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
