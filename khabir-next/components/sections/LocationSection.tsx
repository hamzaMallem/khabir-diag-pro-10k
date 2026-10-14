import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./LocationSection.module.css";

/**
 * "Find us": a Google Maps view of the workshop.
 * The map only appears once site.streetAddress is filled in (config/site.ts), so it never points to a guessed place.
 */
export function LocationSection({ dict }: { dict: Dictionary }) {
  const query = site.streetAddress ? `${site.streetAddress}, ${site.city}` : "";
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <section id="location" className="section" aria-labelledby="location-heading">
      <div className={`wrap ${styles.grid}`}>
        <Reveal className={styles.text}>
          <p className="kicker">{dict.loc_kicker}</p>
          <h2 id="location-heading">{dict.loc_h}</h2>
          <p className="lede">{dict.loc_p}</p>
          {query && (
            <Button href={mapsHref} size="small">
              {dict.loc_btn}
            </Button>
          )}
        </Reveal>
        <Reveal className={styles.map} index={1}>
          {query ? (
            <iframe
              title={dict.loc_h}
              src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <p className={styles.placeholder}>{dict.loc_todo}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
