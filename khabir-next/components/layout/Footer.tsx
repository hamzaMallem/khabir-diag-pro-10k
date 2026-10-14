import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/config/site";
import type { NavLink } from "./Nav";
import styles from "./Footer.module.css";

export function Footer({ dict, locale, links }: { dict: Dictionary; locale: Locale; links: NavLink[] }) {
  return (
    <footer className={styles.footer}>
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
