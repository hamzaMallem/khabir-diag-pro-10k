import type { Dictionary } from "@/i18n/dictionaries";
import { formatLocalPhone, site } from "@/config/site";
import { getWhatsAppHref, isWhatsAppConfigured } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { PhoneLinks } from "@/components/ui/PhoneLinks";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./ContactSection.module.css";

// Fixed positions for the floating dust specks (no randomness, so server and browser always agree).
const DUST = Array.from({ length: 22 }, (_, i) => ({
  left: ((i * 37) % 100) + (i % 3) * 0.7,
  top: 40 + ((i * 53) % 60),
  delay: -((i * 11) % 14),
  duration: 11 + ((i * 7) % 8),
}));

/** Final call to action (#rdv) with the business details. Missing details show "to be added". */
export function ContactSection({ dict }: { dict: Dictionary }) {
  const todo = <span className={styles.todo}>{dict.i_todo}</span>;

  return (
    <section id="rdv" className={`section ${styles.final}`} aria-labelledby="contact-heading">
      <div className={styles.dust} aria-hidden="true">
        {DUST.map((speck, i) => (
          <i key={i} style={{ left: `${speck.left}%`, top: `${speck.top}%`, animationDelay: `${speck.delay}s`, animationDuration: `${speck.duration}s` }} />
        ))}
      </div>
      <Reveal className={`wrap ${styles.content}`}>
        <p className="kicker">{dict.cta_kicker}</p>
        <h2 id="contact-heading">{dict.cta_h}</h2>
        <p className={`lede ${styles.lede}`}>{dict.cta_sub}</p>

        {isWhatsAppConfigured ? (
          <Button href={getWhatsAppHref(dict.wa_msg)} size="large" whatsapp className={styles.button}>
            {dict.cta}
          </Button>
        ) : (
          // No WhatsApp number configured yet (config/site.ts): show an inactive button instead of a misleading link.
          <span className={styles.disabledButton} aria-disabled="true">
            {dict.cta}
          </span>
        )}

        <div className={styles.info}>
          <div>
            <p className={styles.label}>{dict.i_addr_l}</p>
            <p className={styles.value}>{site.streetAddress ? dict.i_addr : todo}</p>
          </div>
          <div>
            <p className={styles.label}>{dict.i_hours_l}</p>
            <p className={styles.value}>{site.openingHours.length > 0 ? dict.i_hours : todo}</p>
          </div>
          <div>
            <p className={styles.label}>WhatsApp</p>
            <p className={styles.value}>{isWhatsAppConfigured ? <bdi dir="ltr">{formatLocalPhone(site.whatsappNumber)}</bdi> : todo}</p>
          </div>
        </div>
        {site.phones.length > 0 && (
          <div className={styles.phones}>
            <p className={styles.label}>{dict.ph_l}</p>
            <PhoneLinks dict={dict} />
          </div>
        )}
      </Reveal>
    </section>
  );
}
