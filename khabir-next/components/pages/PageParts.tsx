import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./Page.module.css";

/** Top of an inner page: kicker, the page's only h1, and a short intro. */
export function PageHeader({ kicker, title, intro, children }: { kicker: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <header className={styles.header}>
      <Reveal className="wrap">
        {children}
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        {intro && <p className="lede">{intro}</p>}
      </Reveal>
    </header>
  );
}

/**
 * WhatsApp box at the end of an inner page.
 * Without a configured number, the button points to the contact section of the home page (same rule as lib/whatsapp.ts).
 */
export function WhatsAppCta({ locale, title, text, label, message }: { locale: Locale; title: string; text: string; label: string; message: string }) {
  const href = getWhatsAppHref(message);
  return (
    <Reveal className={styles.cta}>
      <h2>{title}</h2>
      <p>{text}</p>
      <Button href={href.startsWith("#") ? `/${locale}${href}` : href} whatsapp>
        {label}
      </Button>
    </Reveal>
  );
}

export { styles as pageStyles };
