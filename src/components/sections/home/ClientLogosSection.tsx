import type { z } from "zod";
import type { clientLogosDataSchema } from "@/schemas/sections";

type LogosContent = z.infer<typeof clientLogosDataSchema>;

export default function ClientLogosSection({ content }: { content: LogosContent }) {
  const eyebrow =
    typeof content.eyebrow === "string" && content.eyebrow.trim() !== ""
      ? content.eyebrow
      : "TRUSTED BY INSTITUTIONAL LEADERS";

  const logos = Array.isArray(content.logos) ? content.logos : [];
  const normalizedLogos = logos.filter(
    (logo: any) => (typeof logo === "string" ? logo.trim() !== "" : !!logo?.src)
  );

  return (
    <section className="logos-section">
      <div className="logos-section__card">
        <p className="logos-section__eyebrow">{eyebrow}</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {normalizedLogos.map((logo: any, index: number) => {
            const src = typeof logo === "string" ? "" : logo.src;
            const alt = typeof logo === "string" ? logo : logo.alt || "";

            return (
              <div
                key={index}
                className="flex items-center justify-center p-4 hover:scale-105 transition-transform"
              >
                {src ? (
                  <img
                    src={src}
                    alt={alt}
                    className="max-h-12 w-auto object-contain pointer-events-none"
                    loading="lazy"
                  />
                ) : (
                  <p className="font-bold text-center text-xs tracking-[0.2em] whitespace-nowrap">
                    {alt}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
