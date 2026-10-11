// The three languages of the site. French is the default.
export const locales = ["fr", "ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const localeCookie = "khabir-lang";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Arabic is the only right-to-left language. */
export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
