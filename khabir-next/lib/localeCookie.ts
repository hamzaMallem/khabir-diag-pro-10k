import { localeCookie, type Locale } from "@/i18n/config";

/** Remember the visitor's language choice for a year (read by proxy.ts on their next visit). */
export function saveLocale(locale: Locale) {
  document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
