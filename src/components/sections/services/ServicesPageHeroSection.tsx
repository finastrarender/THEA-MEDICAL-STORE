import type { z } from "zod";
import type { servicesPageHeroDataSchema } from "@/schemas/sections";
import { theaServicesPageHeroDefaults } from "@/data/thea-services-sections";

type Content = z.infer<typeof servicesPageHeroDataSchema>;

function HeroDecorIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="52" y="72" width="96" height="80" rx="12" stroke="currentColor" strokeWidth="3" />
      <path
        d="M68 72V58a32 32 0 0 1 64 0v14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M100 98v28M86 112h28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function ServicesPageHeroSection({
  content,
  anchorId,
}: {
  content: Content;
  anchorId?: string;
}) {
  const badge = content.badge?.trim() || theaServicesPageHeroDefaults.badge;
  const title = content.title?.trim() || theaServicesPageHeroDefaults.title;
  const description = content.description?.trim() || theaServicesPageHeroDefaults.description;

  return (
    <section className="thea-services-hero" id={anchorId ?? undefined}>
      <div className="thea-services-hero__shell">
        <div className="thea-services-hero__inner">
          <div className="thea-services-hero__copy">
            <p className="thea-services-hero__badge">{badge}</p>
            <h1 className="thea-services-hero__title">{title}</h1>
            <p className="thea-services-hero__description">{description}</p>
          </div>
          <HeroDecorIcon className="thea-services-hero__decor" />
        </div>
      </div>
    </section>
  );
}
