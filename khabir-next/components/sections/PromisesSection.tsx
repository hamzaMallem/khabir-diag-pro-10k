import type { Dictionary } from "@/i18n/dictionaries";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./PromisesSection.module.css";

/** "Clearing is not repairing": four commitments. */
export function PromisesSection({ dict }: { dict: Dictionary }) {
  const promises = [
    { id: "codes", number: "01", title: dict.p1_t, text: dict.p1_p },
    { id: "quote", number: "02", title: dict.p2_t, text: dict.p2_p },
    { id: "proof", number: "03", title: dict.p3_t, text: dict.p3_p },
    { id: "explain", number: "04", title: dict.p4_t, text: dict.p4_p },
  ];

  return (
    <section className={`section ${styles.promises}`} aria-labelledby="promises-heading">
      <div className={`wrap ${styles.grid}`}>
        <Reveal className={styles.side}>
          <p className="kicker">{dict.pr_kicker}</p>
          <h2 id="promises-heading">{dict.pr_h}</h2>
        </Reveal>
        <Reveal as="ol" className={styles.list}>
          {promises.map((promise) => (
            <li key={promise.id}>
              <span className={styles.n}>{promise.number}</span>
              <div>
                <h3>{promise.title}</h3>
                <p>{promise.text}</p>
              </div>
              <svg className={styles.check} viewBox="0 0 24 24" aria-hidden="true">
                <path
                  className="draw"
                  pathLength="1"
                  d="M5 12.5l4.5 4.5L19 7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
