import { PageHeader } from "@/components/pages/PageParts";
import prose from "@/components/pages/Prose.module.css";

export interface LegalSection {
  title: string;
  text: string;
}

/** Plain text page used for the privacy policy and the terms of use. */
export function LegalPage({ kicker, title, intro, updated, sections }: { kicker: string; title: string; intro: string; updated: string; sections: LegalSection[] }) {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader kicker={kicker} title={title} intro={intro} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className={`wrap ${prose.prose}`}>
          <p>{updated}</p>
          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
