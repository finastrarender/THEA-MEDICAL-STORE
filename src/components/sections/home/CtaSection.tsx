import type { z } from "zod";
import type { ctaDataSchema } from "@/schemas/sections";

type CtaContent = z.infer<typeof ctaDataSchema>;

function getTitleLines(title: string): string[] {
  const trimmed = title.trim();
  if (!trimmed) return ["SYSTEM", "DEPLOYMENT", "STARTS HERE"];
  if (trimmed.includes("//")) {
    return trimmed
      .split("//")
      .map((line) => line.trim())
      .filter(Boolean);
  }
  const words = trimmed.split(/\s+/);
  if (words.length <= 3) return words;
  return [words[0], words[1], words.slice(2).join(" ")];
}

export default function CtaSection({
  content,
  anchorId = "contact",
}: {
  content: CtaContent;
  anchorId?: string;
}) {
  const titleLines = getTitleLines(content.title);
  const description =
    content.description?.trim() ||
    "Secure your digital future with the UAE's premier technical architectural firm.";

  return (
    <section className="cta-section" id={anchorId}>
      <div className="cta-section__inner section-shell">
        <div className="cta-section__card">
          <h2 className="cta-section__title">
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="cta-section__description">{description}</p>
          <a className="cta-section__button" href={content.action.href}>
            {content.action.label}
          </a>
        </div>
      </div>
    </section>
  );
}
