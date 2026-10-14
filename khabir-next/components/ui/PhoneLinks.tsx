import type { Dictionary } from "@/i18n/dictionaries";
import { formatLocalPhone, site } from "@/config/site";
import styles from "./PhoneLinks.module.css";

/** Tap-to-call links for every number in config/site.ts, labelled with ph_<id> from messages/*.json. */
export function PhoneLinks({ dict }: { dict: Dictionary }) {
  return (
    <ul className={styles.list}>
      {site.phones.map((phone) => (
        <li key={phone.id}>
          <a className={styles.link} href={`tel:+${phone.number}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
                d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
              />
            </svg>
            <span className={styles.name}>{dict[`ph_${phone.id}` as keyof Dictionary]}</span>
            <bdi dir="ltr" className={styles.number}>
              {formatLocalPhone(phone.number)}
            </bdi>
          </a>
        </li>
      ))}
    </ul>
  );
}
