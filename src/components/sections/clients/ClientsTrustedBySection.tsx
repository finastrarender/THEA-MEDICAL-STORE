import type { z } from "zod";
import type { clientsTrustedByDataSchema } from "@/schemas/sections";
import { theaClientsTrustedByDefaults } from "@/data/thea-clients-sections";

type Content = z.infer<typeof clientsTrustedByDataSchema>;

export default function ClientsTrustedBySection({ content }: { content: Content }) {
  const title = content.title?.trim() || theaClientsTrustedByDefaults.title;
  const logos =
    content.logos?.length > 0 ? content.logos : theaClientsTrustedByDefaults.logos;

  return (
    <section className="thea-clients-trusted" aria-labelledby="thea-clients-trusted-title">
      <div className="thea-clients-trusted__shell">
        <h2 id="thea-clients-trusted-title" className="thea-clients-trusted__title">
          {title}
        </h2>
        <div className="thea-clients-trusted__rule" aria-hidden="true" />
        <ul className="thea-clients-trusted__logos">
          {logos.map((logo, index) => {
            const src = logo.src?.trim();
            const alt = logo.alt?.trim() || `Partner logo ${index + 1}`;
            return (
              <li key={`${alt}-${index}`} className="thea-clients-trusted__logo-item">
                {src ? (
                  <img
                    src={src}
                    alt={alt}
                    className="thea-clients-trusted__logo-image"
                    width={88}
                    height={88}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="thea-clients-trusted__logo-placeholder" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
