import type { z } from "zod";
import type { projectsHeroDataSchema } from "@/schemas/sections";

type ProjectsHeroContent = z.infer<typeof projectsHeroDataSchema>;

const DEFAULT_EYEBROW = "INSTITUTIONAL PORTFOLIO";

const DEFAULT_TITLE = ["Strategic Digital", "Assets & NFT", "Infrastructure"];

const DEFAULT_DESCRIPTION =
  "Archiving the evolution of institutional-grade tokenization and distributed ledger deployments across the MENA region.";

function normalizeTitleLines(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((line) => String(line).trim()).filter(Boolean);
}

function resolveProjectsHeroContent(content?: ProjectsHeroContent) {
  const cmsTitleLines = normalizeTitleLines(content?.titleLines);
  const cmsDescription = content?.description?.trim() ?? "";

  const hasReferenceTitle =
    cmsTitleLines.length === 3 &&
    cmsTitleLines[0] === "Strategic Digital" &&
    cmsTitleLines[1] === "Assets & NFT" &&
    cmsTitleLines[2] === "Infrastructure";

  const hasCombinedReferenceTitle =
    cmsTitleLines.length === 1 &&
    cmsTitleLines[0].replace(/\s+/g, " ").trim() === DEFAULT_TITLE.join(" ");

  const titleLooksLikeDescription = cmsTitleLines.join(" ").includes("Archiving the evolution");
  const descriptionLooksLikeTitle =
    cmsDescription.includes("Strategic Digital") && cmsDescription.includes("Infrastructure");

  return {
    eyebrow: content?.eyebrow?.trim() || DEFAULT_EYEBROW,
    titleLines:
      hasReferenceTitle && !titleLooksLikeDescription
        ? cmsTitleLines
        : hasCombinedReferenceTitle
          ? DEFAULT_TITLE
        : descriptionLooksLikeTitle
          ? DEFAULT_TITLE
          : cmsTitleLines.length === 3 && cmsTitleLines[0] !== "Institutional"
            ? cmsTitleLines
            : DEFAULT_TITLE,
    description:
      titleLooksLikeDescription
        ? cmsTitleLines.join(" ")
        : cmsDescription === DEFAULT_DESCRIPTION || cmsDescription.includes("Archiving the evolution")
          ? cmsDescription || DEFAULT_DESCRIPTION
          : DEFAULT_DESCRIPTION,
  };
}

function BuildingWatermark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 64" aria-hidden="true">
      <path
        d="M8 58V28l12-8 12 8v30M40 58V22l12-8 12 8v36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M4 58h72" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M20 58V38h8v20M52 58V34h8v24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M32 14 40 8 48 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProjectsHeroSection({ content }: { content?: ProjectsHeroContent }) {
  const { eyebrow, titleLines, description } = resolveProjectsHeroContent(content);

  return (
    <section className="cx-projects-hero" aria-labelledby="projects-hero-title">
      <div className="section-shell cx-projects-hero__shell">
        <p className="cx-projects-hero__eyebrow">{eyebrow}</p>
        <h1 id="projects-hero-title" className="cx-projects-hero__title">
          {titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="cx-projects-hero__description">{description}</p>
      </div>
      <BuildingWatermark className="cx-projects-hero__watermark" />
    </section>
  );
}
