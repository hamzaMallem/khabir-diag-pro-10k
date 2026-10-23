import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/config/site";
import { socialProfiles } from "@/config/social";
import type { NavLink } from "./Nav";
import styles from "./Footer.module.css";

export function Footer({ dict, locale, links }: { dict: Dictionary; locale: Locale; links: NavLink[] }) {
  return (
    <footer className={styles.footer}>
      <section className={`wrap ${styles.social}`} aria-labelledby="footer-social-heading">
        <div>
          <h2 id="footer-social-heading" className={styles.socialHeading}>{dict.social_title}</h2>
          <p className={styles.socialDescription}>{dict.social_description}</p>
        </div>
        <ul className={styles.socialLinks}>
          {socialProfiles.map((profile) => (
            <li key={profile.name}>
              <a href={profile.url} target="_blank" rel="noopener noreferrer">
                <bdi dir="ltr">{profile.name}</bdi>
                {profile.owner === "founder" && <span className={styles.founder}>{dict.social_founder}</span>}
                <span aria-hidden="true">↗</span>
                <span className={styles.srOnly}> — {dict.social_new_tab}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <div className={`wrap ${styles.row}`}>
        <span className={styles.name}>
          KHABIR DIAGNOSTIC AUTO PRO
          <span className={styles.arabic} lang="ar">
            {site.nameArabic}
          </span>
        </span>
        <span>{dict.ft_tag}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
      <ul className={`wrap ${styles.links}`} aria-label={dict.nav_label}>
        {links.map((link) => (
          <li key={link.path}>
            <Link href={`/${locale}${link.path}`}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}
