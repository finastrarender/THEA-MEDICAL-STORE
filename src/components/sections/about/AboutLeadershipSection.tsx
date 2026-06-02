import type { z } from "zod";
import type { aboutLeadershipDataSchema } from "@/schemas/sections";
import { theaAboutLeadershipDefaults } from "@/data/thea-about-sections";

type AboutLeadershipContent = z.infer<typeof aboutLeadershipDataSchema>;

export default function AboutLeadershipSection({ content }: { content: AboutLeadershipContent }) {
  const title = content.title?.trim() || theaAboutLeadershipDefaults.title;
  const description =
    content.description?.trim() || theaAboutLeadershipDefaults.description;
  const members =
    content.members && content.members.length > 0
      ? content.members
      : theaAboutLeadershipDefaults.members;

  return (
    <section className="thea-about-leadership" aria-labelledby="thea-about-leadership-title">
      <div className="thea-about-leadership__shell">
        <header className="thea-about-leadership__header">
          <h2 id="thea-about-leadership-title" className="thea-about-leadership__title">
            {title}
          </h2>
          <p className="thea-about-leadership__description">{description}</p>
        </header>

        <div className="thea-about-leadership__grid">
          {members.map((member) => (
            <article key={member.name} className="thea-about-leader">
              <div className="thea-about-leader__media">
                {member.image?.trim() ? (
                  <img
                    className="thea-about-leader__image"
                    src={member.image}
                    alt=""
                    width={320}
                    height={380}
                    decoding="async"
                    loading="lazy"
                  />
                ) : (
                  <div className="thea-about-leader__placeholder" aria-hidden="true" />
                )}
              </div>
              <div className="thea-about-leader__body">
                <h3 className="thea-about-leader__name">{member.name}</h3>
                <p className="thea-about-leader__role">{member.role}</p>
                <p className="thea-about-leader__bio">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
