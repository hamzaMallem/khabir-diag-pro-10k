import "server-only";
import type { Locale } from "./config";

// One JSON file per language in /messages. Keys are identical in all three files.
const loaders = {
  fr: () => import("@/messages/fr.json").then((m) => m.default),
  ar: () => import("@/messages/ar.json").then((m) => m.default),
  en: () => import("@/messages/en.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof loaders)["fr"]>>;

export const getDictionary = (locale: Locale): Promise<Dictionary> => loaders[locale]();
