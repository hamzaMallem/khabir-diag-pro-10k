import type { Dictionary } from "@/i18n/dictionaries";
import { BrandTicker } from "@/components/ui/BrandTicker";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./ProblemSection.module.css";

/** "You've already paid for guesswork": three customer quotes and a closing line. */
export function ProblemSection({ dict }: { dict: Dictionary }) {
  const quotes = [dict.q_1, dict.q_2, dict.q_3];

  return (
    <section className={`section ${styles.problem}`} aria-labelledby="problem-heading">
      <div className={styles.osc} aria-hidden="true">
        <svg viewBox="0 0 1600 160" preserveAspectRatio="none">
          <path
            d="M0 80h120l14-40 16 80 14-60 12 20h140l10-12 10 12h200l14-40 16 80 14-60 12 20h140l10-12 10 12h200l14-40 16 80 14-60 12 20h140l10-12 10 12h200l14-40 16 80 14-60 12 20h120"
            fill="none"
            stroke="#FF6B00"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="wrap">
        <Reveal>
          <svg className="wave" viewBox="0 0 1240 40" preserveAspectRatio="none" aria-hidden="true">
            <path className="draw" pathLength="1" d="M0 20h420l12-14 14 28 12-20 10 6h120l8-6 8 6h636" />
          </svg>
        </Reveal>
        <div className={styles.grid}>
          <Reveal>
            <p className="kicker">{dict.pb_kicker}</p>
            <h2 id="problem-heading">{dict.pb_h}</h2>
          </Reveal>
          <div className={styles.quotes}>
            {quotes.map((quote, i) => (
              <Reveal key={i} as="p" className={styles.quote} index={i}>
                {quote}
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal as="p" className={styles.close}>
          {dict.pb_close1} <em>{dict.pb_close2}</em>
        </Reveal>
        <Reveal>
          <BrandTicker label={dict.brands_l} />
        </Reveal>
      </div>
    </section>
  );
}
