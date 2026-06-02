import type { z } from "zod";
import type { aboutVisionMissionDataSchema } from "@/schemas/sections";

type AboutVisionMissionContent = z.infer<typeof aboutVisionMissionDataSchema>;

export default function AboutVisionMissionSection({
  content,
}: {
  content: AboutVisionMissionContent;
}) {
  function highlightMissionCopy(copy: string) {
    const needle = "bulletproof infrastructure";
    const idx = copy.toLowerCase().indexOf(needle);
    if (idx === -1) return copy;
    return (
      <>
        {copy.slice(0, idx)}
        <span className="about-panel__accent">{copy.slice(idx, idx + needle.length)}</span>
        {copy.slice(idx + needle.length)}
      </>
    );
  }

  const legacyCards = (
    content as unknown as { cards?: Array<Record<string, unknown>> }
  ).cards;
  const items =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : Array.isArray(legacyCards)
        ? legacyCards.map((card) => ({
            title: String(card.title ?? ""),
            description: String(card.description ?? ""),
            icon: String(card.icon ?? ""),
            accentColor: String(card.accentColor ?? "#0b3d91"),
          }))
        : [];

  const mission = items[0] ?? { title: "MISSION", description: "" };
  const objective = items[1] ?? { title: "OBJECTIVE", description: "" };
  const vision = content.vision ?? {
    eyebrow: "",
    title: "VISION 2030",
    quote:
      '"A world where data is as structural and reliable as steel. We envision the total convergence of industrial engineering and digital protocol."',
    badge: "PROTOCOL ACTIVE",
  };
  const visionAction =
    (vision as unknown as { action?: { label?: string; href?: string } }).action ??
    (content as unknown as { visionAction?: { label?: string; href?: string } }).visionAction;
  const visionActionLabel = String(visionAction?.label ?? "").trim();
  const visionActionHref = String(visionAction?.href ?? "").trim();
  const shouldShowVisionAction = Boolean(visionActionLabel && visionActionHref);

  return (
    <section className="about-panels">
      <div className="section-shell">
        <div className="about-panels__top">
          <article className="about-panel about-panel--mission">
            <h2 className="about-panel__title">{mission.title}</h2>
            <p className="about-panel__description">{highlightMissionCopy(mission.description)}</p>
          </article>
          <article className="about-panel about-panel--objective">
            <h2 className="about-panel__title">{objective.title}</h2>
            <p className="about-panel__description">{objective.description}</p>
          </article>
        </div>

        <article className="about-panels__vision">
          <p className="about-panels__vision-icon" aria-hidden="true">◉</p>
          <h3 className="about-panels__vision-title">{vision.title}</h3>
          <p className="about-panels__vision-quote">{vision.quote}</p>
          {shouldShowVisionAction ? (
            <a className="about-panels__vision-action" href={visionActionHref}>
              {visionActionLabel}
            </a>
          ) : null}
          <p className="about-panels__vision-badge">
            <span className="about-panels__vision-dot" aria-hidden="true" /> {vision.badge}
          </p>
        </article>
      </div>
    </section>
  );
}
