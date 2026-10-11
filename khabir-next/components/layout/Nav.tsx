"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { locales, type Locale } from "@/i18n/config";
import { saveLocale } from "@/lib/localeCookie";
import { Button } from "@/components/ui/Button";
import styles from "./Nav.module.css";

interface NavProps {
  locale: Locale;
  ctaLabel: string;
  ctaHref: string;
  languageLabel: string;
}

// What each language button shows. Arabic keeps its own script.
const languageButtons: Record<Locale, string> = { ar: "ع", fr: "FR", en: "EN" };
const languageOrder: Locale[] = ["ar", "fr", "en"];

/** Top bar: logo, language switcher and contact button. Becomes solid once the page is scrolled. */
export function Nav({ locale, ctaLabel, ctaHref, languageLabel }: NavProps) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const update = () => setSolid(window.scrollY > 40); // React only re-renders when the value flips
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <nav className={`${styles.nav} ${solid ? styles.solid : ""}`} aria-label="Navigation">
      <a className={styles.brand} href="#top" aria-label="Khabir Diagnostic Auto Pro">
        <svg viewBox="0 0 36 36" aria-hidden="true">
          <rect x=".75" y=".75" width="34.5" height="34.5" rx="9" fill="#162126" stroke="rgba(157,173,179,.35)" strokeWidth="1.5" />
          <path d="M12 8v20M12 18l10-10M15.5 15l9 13" stroke="#ECF1F2" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M6 19.5h24" stroke="#FF6B00" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <span className={styles.brandText}>
          <span className={styles.brandName}>
            KHABIR{" "}
            <span className={styles.brandArabic} lang="ar">
              خبير
            </span>
          </span>
          <span className={styles.brandSub}>DIAGNOSTIC AUTO PRO</span>
        </span>
      </a>

      <div className={styles.right}>
        <div className={styles.langs} role="group" aria-label={languageLabel}>
          {languageOrder
            .filter((l) => locales.includes(l))
            .map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                lang={l}
                hrefLang={l}
                aria-current={l === locale ? "true" : undefined}
                onClick={() => saveLocale(l)}
              >
                {languageButtons[l]}
              </Link>
            ))}
        </div>
        <Button href={ctaHref} size="small" className={styles.cta}>
          {ctaLabel}
        </Button>
      </div>
    </nav>
  );
}
