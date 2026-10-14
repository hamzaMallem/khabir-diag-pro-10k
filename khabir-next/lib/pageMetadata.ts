import type { Metadata } from "next";
import { site } from "@/config/site";
import { locales, type Locale } from "@/i18n/config";

/**
 * Title, description, canonical and hreflang for an inner page.
 * `path` is the part after the language, for example "/services" or "/blog/adblue-light".
 * Pass `onlyLocale` when the page exists in one language only (blog articles).
 */
export function pageMetadata(locale: Locale, path: string, title: string, description: string, onlyLocale = false): Metadata {
  const languages = onlyLocale
    ? { [locale]: `/${locale}${path}` }
    : { ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])), "x-default": `/fr${path}` };

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: { canonical: `/${locale}${path}`, languages },
    openGraph: { type: "website", siteName: site.name, title, description, url: `/${locale}${path}` },
  };
}
