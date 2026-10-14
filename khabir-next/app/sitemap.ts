import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";
import { getPosts } from "@/lib/blog";

// Pages that exist in every language. "" is the home page.
const pages = ["", "/services", "/blog", "/about"];

// One entry per page and language, each pointing to its translations (hreflang), plus one entry per blog article.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shared = pages.flatMap((page) => {
    const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${page}`]));
    return locales.map((locale) => ({ url: `${site.url}/${locale}${page}`, lastModified: new Date(), alternates: { languages } }));
  });

  const articles = (
    await Promise.all(
      locales.map(async (locale) =>
        (await getPosts(locale)).map((post) => ({ url: `${site.url}/${locale}/blog/${post.slug}`, lastModified: new Date(post.date) })),
      ),
    )
  ).flat();

  return [...shared, ...articles];
}
