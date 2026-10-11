import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./MethodSection.module.css";

/** "Test. Prove. Repair.": three numbered steps with a picture each. */
export function MethodSection({ dict }: { dict: Dictionary }) {
  const steps = [
    { id: "connect", number: "01", title: dict.s1_t, text: dict.s1_p, image: "/media/step-1.jpg" },
    { id: "measure", number: "02", title: dict.s2_t, text: dict.s2_p, image: "/media/step-2.jpg" },
    { id: "prove", number: "03", title: dict.s3_t, text: dict.s3_p, image: "/media/step-3.jpg" },
  ];

  return (
    <section className={`section ${styles.method}`} aria-labelledby="method-heading">
      <div className="wrap">
        <Reveal className={styles.head}>
          <p className="kicker">{dict.me_kicker}</p>
          <h2 id="method-heading">{dict.me_h}</h2>
        </Reveal>
        <div className={styles.steps}>
          {steps.map((step, i) => (
            <Reveal key={step.id} as="article" className={styles.step} index={i}>
              <figure>
                <Image src={step.image} alt="" width={1536} height={1024} sizes="(max-width: 900px) 100vw, 33vw" />
              </figure>
              <div className={styles.body}>
                <p className={styles.num}>
                  <i />
                  {step.number}
                </p>
                <h3>{step.title}</h3>
                <p className={styles.text}>{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
