"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  menuLabel: string;
  closeLabel: string;
  links: NavLink[];
}

// What each language button shows. Arabic keeps its own script.
const languageButtons: Record<Locale, string> = { ar: "ع", fr: "FR", en: "EN" };
const languageOrder: Locale[] = ["ar", "fr", "en"];

/** Above this width the page links sit in the bar; below it they move into the menu sheet. KEEP IN SYNC with Nav.module.css. */
const WIDE_QUERY = "(min-width: 961px)";

/** Same page in another language. Blog articles exist in one language only, so they lead to that language's article list. */
function translatedPath(pathname: string, target: Locale): string {
  const rest = pathname.split("/").slice(2).join("/");
  if (rest.startsWith("blog/")) return `/${target}/blog`;
  return rest ? `/${target}/${rest}` : `/${target}`;
}

/**
 * Top bar. Wide screens: logo, page links, language switch, contact button.
 * Phones and small tablets: logo, contact button and a menu button; the pages and language switch live in a
 * full-screen sheet. The contact button stays in the bar so the main action is always one tap away.
 */
export function Nav({ locale, ctaLabel, ctaHref, languageLabel, pagesLabel, menuLabel, closeLabel, links }: NavProps) {
  const [solid, setSolid] = useState(false);
  const pathname = usePathname() ?? `/${locale}`;
  const onHome = pathname === `/${locale}`;
  // The menu is "open for this page": navigating anywhere (a link, the language switch) closes it by itself.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const menuButton = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const active = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setTheme(active);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const themeToggleLabel =
    theme === "dark"
      ? locale === "ar"
        ? "التبديل إلى الوضع النهاري"
        : locale === "fr"
          ? "Passer au mode clair"
          : "Switch to light mode"
      : locale === "ar"
        ? "التبديل إلى الوضع الليلي"
        : locale === "fr"
          ? "Passer au mode sombre"
          : "Switch to dark mode";

  const themeButton = (
    <button
      type="button"
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={themeToggleLabel}
      title={theme === "dark" ? "Mode clair" : "Mode sombre"}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="10" cy="10" r="3.8" />
          <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.34 4.34l1.42 1.42M14.24 14.24l1.42 1.42M4.34 15.66l1.42-1.42M14.24 5.76l1.42-1.42" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );


  useEffect(() => {
    const update = () => setSolid(window.scrollY > 40); // React only re-renders when the value flips
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // While the sheet is open: lock page scroll, close on Escape or when the screen becomes wide, keep Tab inside.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    sheet.current?.querySelector<HTMLElement>("a")?.focus();

    const wide = window.matchMedia(WIDE_QUERY);
    const onWide = () => wide.matches && setOpenAt(null);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenAt(null);
        menuButton.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !sheet.current || !menuButton.current) return;
      const stops = [menuButton.current, ...sheet.current.querySelectorAll<HTMLElement>("a[href], button")];
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;
      if (!stops.includes(active as HTMLElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  // Without a WhatsApp number the button points to the contact section, which lives on the home page.
  const cta = ctaHref.startsWith("#") && !onHome ? `/${locale}${ctaHref}` : ctaHref;

  const isCurrent = (link: NavLink) => {
    const href = `/${locale}${link.path}`;
    return link.path === "" ? onHome : pathname === href || pathname.startsWith(`${href}/`);
  };

  const languageSwitch = (className: string) => (
    <div className={className} role="group" aria-label={languageLabel}>
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
  );

  return (
    <>
      <nav className={`${styles.nav} ${solid || open ? styles.solid : ""}`} aria-label="Navigation">
        <Link className={styles.brand} href={`/${locale}`} aria-label="Khabir Diagnostic Auto Pro">
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <rect x=".75" y=".75" width="34.5" height="34.5" rx="9" fill="var(--panel)" stroke="var(--line-strong)" strokeWidth="1.5" />
            <path d="M12 8v20M12 18l10-10M15.5 15l9 13" stroke="var(--text-primary)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M6 19.5h24" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" />
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
          {links.map((link) => (
            <li key={link.path}>
              <Link href={`/${locale}${link.path}`} aria-current={isCurrent(link) ? "page" : undefined}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.right}>
          {themeButton}
          {languageSwitch(styles.langs)}
          <Button href={cta} size="small" className={styles.cta}>
            {ctaLabel}
          </Button>
          <button
            ref={menuButton}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? closeLabel : menuLabel}
            onClick={() => setOpenAt(open ? null : pathname)}
          >
            <span className={styles.menuLines} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {open && (
        <div ref={sheet} id="site-menu" className={styles.sheet} role="dialog" aria-modal="true" aria-label={menuLabel}>
          <ul className={styles.sheetLinks}>
            {links.map((link) => (
              <li key={link.path}>
                <Link href={`/${locale}${link.path}`} aria-current={isCurrent(link) ? "page" : undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.sheetFoot}>
            <div className={styles.sheetActions}>
              {languageSwitch(styles.sheetLangs)}
              {themeButton}
            </div>
            <Button href={cta} size="large" whatsapp className={styles.sheetCta}>
              {ctaLabel}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
