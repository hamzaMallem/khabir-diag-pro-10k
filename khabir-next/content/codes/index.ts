import type { Locale } from "@/i18n/config";
import { ar } from "./ar";
import { en } from "./en";
import { fr } from "./fr";
import { codes, type CodeId, type CodeMeta, type CodeText } from "./meta";

export * from "./meta";

const texts: Record<Locale, Record<CodeId, CodeText>> = { fr, ar, en };

/** "P0420" -> "p0420": how a code appears in the URL. */
export const codeSlug = (code: string) => code.toLowerCase();

export function getCode(slug: string): CodeMeta | undefined {
  return codes.find((c) => codeSlug(c.code) === slug.toLowerCase());
}

export function getCodeText(locale: Locale, code: string): CodeText {
  return texts[locale][code as CodeId];
}

/** Other codes of the same system, for the "related codes" links. */
export function getRelatedCodes(meta: CodeMeta): CodeMeta[] {
  return codes.filter((c) => c.system === meta.system && c.code !== meta.code);
}
