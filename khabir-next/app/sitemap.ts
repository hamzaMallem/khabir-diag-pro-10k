import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";

// One entry per language page, each pointing to its translations (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}`]));
  return locales.map((locale) => ({
    url: `${site.url}/${locale}`,
    lastModified: new Date(),
    alternates: { languages },
  }));
}
