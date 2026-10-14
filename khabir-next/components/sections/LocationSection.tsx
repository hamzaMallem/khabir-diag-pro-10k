import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { PhoneLinks } from "@/components/ui/PhoneLinks";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./LocationSection.module.css";

/**
 * "Find us": address, hours and a Google Maps view of the workshop, then the roadside call-out.
 * The map only appears when site.streetAddress is filled in (config/site.ts), so it never points to a guessed place.
 */
export function LocationSection({ dict }: { dict: Dictionary }) {
  const hasAddress = Boolean(site.streetAddress);
  const { lat, lng } = site.geo;

  return (
    <section id="location" className="section" aria-labelledby="location-heading">
      <div className={`wrap ${styles.grid}`}>
        <Reveal className={styles.text}>
          <p className="kicker">{dict.loc_kicker}</p>
          <h2 id="location-heading">{dict.loc_h}</h2>
          <p className="lede">{dict.loc_p}</p>
          {hasAddress && (
            <dl className={styles.facts}>
              <div>
                <dt>{dict.i_addr_l}</dt>
                <dd>{dict.i_addr}</dd>
              </div>
              {site.openingHours.length > 0 && (
                <div>
                  <dt>{dict.i_hours_l}</dt>
                  <dd>{dict.i_hours}</dd>
                </div>
              )}
            </dl>
          )}
          {hasAddress && (
            <Button href={site.mapsUrl} size="small">
              {dict.loc_btn}
            </Button>
          )}
        </Reveal>
        <Reveal className={styles.map} index={1}>
          {hasAddress ? (
            <iframe
              title={dict.loc_h}
              src={`https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <p className={styles.placeholder}>{dict.loc_todo}</p>
          )}
        </Reveal>
      </div>
      <div className="wrap">
        <RoadsideCallout dict={dict} />
      </div>
    </section>
  );
}

/** Mobile service: the team travels across Beni Mellal province, day and night. */
export function RoadsideCallout({ dict }: { dict: Dictionary }) {
  return (
    <Reveal className={styles.roadside}>
      <svg className={styles.roadsideIcon} viewBox="0 0 48 48" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 30l4-10a4 4 0 0 1 3.7-2.5h20.6A4 4 0 0 1 38 20l4 10v8H6z" />
          <circle cx="14" cy="38" r="4" />
          <circle cx="34" cy="38" r="4" />
          <path d="M24 4v6M16 7l2 4M32 7l-2 4" />
        </g>
      </svg>
      <div className={styles.roadsideText}>
        <p className="kicker">{dict.rs_kicker}</p>
        <h3>{dict.rs_t}</h3>
        <p>{dict.rs_p}</p>
        <PhoneLinks dict={dict} />
      </div>
    </Reveal>
  );
}
