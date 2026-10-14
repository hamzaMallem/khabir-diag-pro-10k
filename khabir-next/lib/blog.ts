import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";
import type { Locale } from "@/i18n/config";

/** What every article exports as `export const metadata = { ... }` at the top of its .mdx file. */
export interface PostMeta {
  title: string;
  description: string;
  /** Publication date, YYYY-MM-DD. */
  date: string;
  tags?: string[];
}

export interface PostSummary extends PostMeta {
  slug: string;
}

interface PostModule {
  default: ComponentType;
  metadata: PostMeta;
}

const contentDir = (locale: Locale) => path.join(process.cwd(), "content", "blog", locale);

/** Slugs of all articles written in this language (file name without .mdx). */
export async function getPostSlugs(locale: Locale): Promise<string[]> {
  try {
    const files = await readdir(contentDir(locale));
    return files.filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return []; // no folder yet for this language
  }
}

export async function getPost(locale: Locale, slug: string): Promise<PostModule | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    return (await import(`@/content/blog/${locale}/${slug}.mdx`)) as PostModule;
  } catch {
    return null;
  }
}

/** All articles of a language, newest first. */
export async function getPosts(locale: Locale): Promise<PostSummary[]> {
  const slugs = await getPostSlugs(locale);
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getPost(locale, slug);
      return post ? { slug, ...post.metadata } : null;
    }),
  );
  return posts.filter((p): p is PostSummary => p !== null).sort((a, b) => b.date.localeCompare(a.date));
}

const dateLocale: Record<Locale, string> = { ar: "ar-MA", fr: "fr-MA", en: "en-GB" };

export function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(dateLocale[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
