import type { Dictionary } from "@/i18n/dictionaries";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./FaqSection.module.css";

/** Questions and answers. Uses the browser's built-in <details>, so it works without any script. */
export function FaqSection({ dict }: { dict: Dictionary }) {
  const questions = [
    { id: "parts-replaced", q: dict.fq1_q, a: dict.fq1_a },
    { id: "adblue-light", q: dict.fq2_q, a: dict.fq2_a },
    { id: "price", q: dict.fq3_q, a: dict.fq3_a },
    { id: "software", q: dict.fq4_q, a: dict.fq4_a },
    { id: "light-off", q: dict.fq5_q, a: dict.fq5_a },
  ];

  return (
    <section className={`section ${styles.faq}`} aria-labelledby="faq-heading">
      <div className={`wrap ${styles.grid}`}>
        <Reveal>
          <p className="kicker">{dict.fq_kicker}</p>
          <h2 id="faq-heading">{dict.fq_h}</h2>
        </Reveal>
        <Reveal>
          {questions.map((item) => (
            <details key={item.id} className={styles.qa}>
              <summary>
                <span>{item.q}</span>
                <span className={styles.icon} aria-hidden="true" />
              </summary>
              <p className={styles.answer}>{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
