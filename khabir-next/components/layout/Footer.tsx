import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/config/site";
import styles from "./Footer.module.css";

export function Footer({ dict }: { dict: Dictionary }) {
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
    </footer>
  );
}
