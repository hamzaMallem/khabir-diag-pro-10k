"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { locales, type Locale } from "@/i18n/config";
import { saveLocale } from "@/lib/localeCookie";
import { Button } from "@/components/ui/Button";
import styles from "./Nav.module.css";

export interface NavLink {
  /** Path after the language, "" for the home page. */
  path: string;
  label: string;
}

interface NavProps {
  locale: Locale;
  ctaLabel: string;
  ctaHref: string;
  languageLabel: string;
  pagesLabel: string;
  links: NavLink[];
}

// What each language button shows. Arabic keeps its own script.
const languageButtons: Record<Locale, string> = { ar: "ع", fr: "FR", en: "EN" };
const languageOrder: Locale[] = ["ar", "fr", "en"];

/** Same page in another language. Blog articles exist in one language only, so they lead to that language's article list. */
function translatedPath(pathname: string, target: Locale): string {
  const rest = pathname.split("/").slice(2).join("/");
  if (rest.startsWith("blog/")) return `/${target}/blog`;
  return rest ? `/${target}/${rest}` : `/${target}`;
}

/** Top bar: logo, page links, language switcher and contact button. Becomes solid once the page is scrolled. */
export function Nav({ locale, ctaLabel, ctaHref, languageLabel, pagesLabel, links }: NavProps) {
  const [solid, setSolid] = useState(false);
  const pathname = usePathname() ?? `/${locale}`;
  const onHome = pathname === `/${locale}`;

  useEffect(() => {
    const update = () => setSolid(window.scrollY > 40); // React only re-renders when the value flips
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Without a WhatsApp number the button points to the contact section, which lives on the home page.
  const cta = ctaHref.startsWith("#") && !onHome ? `/${locale}${ctaHref}` : ctaHref;

  return (
    <nav className={`${styles.nav} ${solid ? styles.solid : ""}`} aria-label="Navigation">
      <Link className={styles.brand} href={`/${locale}`} aria-label="Khabir Diagnostic Auto Pro">
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
      </Link>

      <ul className={styles.links} aria-label={pagesLabel}>
        {links.map((link) => {
          const href = `/${locale}${link.path}`;
          const current = link.path === "" ? onHome : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={link.path}>
              <Link href={href} aria-current={current ? "page" : undefined}>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={styles.right}>
        <div className={styles.langs} role="group" aria-label={languageLabel}>
          {languageOrder
            .filter((l) => locales.includes(l))
            .map((l) => (
              <Link
                key={l}
                href={translatedPath(pathname, l)}
                lang={l}
                hrefLang={l}
                aria-current={l === locale ? "true" : undefined}
                onClick={() => saveLocale(l)}
              >
                {languageButtons[l]}
              </Link>
            ))}
        </div>
        <Button href={cta} size="small" className={styles.cta}>
          {ctaLabel}
        </Button>
      </div>
    </nav>
  );
}
