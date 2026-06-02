import type { z } from "zod";
import type { aboutValuesDataSchema } from "@/schemas/sections";
import * as Icons from "lucide-react";
import React from "react";

type AboutValuesContent = z.infer<typeof aboutValuesDataSchema>;

export default function AboutValuesSection({ content }: { content: AboutValuesContent }) {
  const titleText = String(content.title ?? "").trim();
  const titleDisplay =
    titleText.includes("\n") ? titleText : titleText.replace(/\s+and\s+/i, " AND\n");
  const leadText =
    (content.description ?? "").trim() ||
    "ADAM TECHNOLOGY L.L.C. operates under strict regulatory frameworks, ensuring global compliance and institutional security standards.";
  const reach = content.reach ?? {
    title: "GLOBAL REACH",
    image: "/home/headquarters.png",
    metrics: [
      { value: "0.4MS", label: "LOCAL LATENCY" },
      { value: "500PB", label: "DATA MANAGED" },
      { value: "128-BIT", label: "ENCRYPTION STANDARD" },
      { value: "24/7", label: "THREAT MONITORING" },
    ],
  };

  return (
    <section className="about-values">
      <div className="section-shell">
        <div className="about-values__heading">
          <div className="about-values__heading-left">
            <h2 className="about-values__title">{titleDisplay}</h2>
            <p className="about-values__lead">{leadText}</p>
          </div>
          <p className="about-values__region">{content.region ?? "DUBAI, UNITED ARAB EMIRATES"}</p>
        </div>

        <div className="about-values__grid">
          {content.items.slice(0, 3).map((item) => {
            const Icon = Icons[item.icon as keyof typeof Icons] as React.ElementType;
            return <article key={`${item.title}-${item.description}`} className="about-value-card">
              <div className="about-value-card__icon" aria-hidden="true">
                {Icon ? <Icon size={18} /> : ""}
              </div>
              <h3 className="about-value-card__title">{item.title}</h3>
              <p className="about-value-card__description">{item.description}</p>
            </article>;
          })}
        </div>

        <article className="about-values__reach">
          <div className="about-values__reach-image-wrap">
            <img
              src={reach.image}
              alt=""
              width={420}
              height={320}
              className="about-values__reach-image"
            />
          </div>
          <div className="about-values__reach-content">
            <h3 className="about-values__reach-title">{reach.title}</h3>
            <div className="about-values__reach-metrics">
              {reach.metrics.slice(0, 4).map((metric) => (
                <div key={`${metric.value}-${metric.label}`} className="about-values__reach-metric">
                  <p>{metric.value}</p>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
