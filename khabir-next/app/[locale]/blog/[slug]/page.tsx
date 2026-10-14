import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { formatDate, getPost, getPostSlugs } from "@/lib/blog";
import { pageMetadata } from "@/lib/pageMetadata";
import { PageHeader, WhatsAppCta, pageStyles as styles } from "@/components/pages/PageParts";
import prose from "@/components/pages/Prose.module.css";

type Params = { params: Promise<{ locale: string; slug: string }> };

// Every article is pre-built. Unknown slugs return 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const all = await Promise.all(locales.map(async (locale) => (await getPostSlugs(locale)).map((slug) => ({ locale, slug }))));
  return all.flat();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await getPost(locale, slug);
  if (!post) return {};
  const meta = pageMetadata(locale, `/blog/${slug}`, post.metadata.title, post.metadata.description, true);
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: post.metadata.date } };
}

export default async function PostPage({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const [dict, post] = await Promise.all([getDictionary(locale), getPost(locale, slug)]);
  if (!post) notFound();

  const { default: Content, metadata } = post;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: metadata.title,
    description: metadata.description,
    datePublished: metadata.date,
    inLanguage: locale,
    mainEntityOfPage: `${site.url}/${locale}/blog/${slug}`,
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <main id="main" tabIndex={-1}>
      <article>
        <PageHeader kicker={formatDate(metadata.date, locale)} title={metadata.title} intro={metadata.description}>
          <Link className={styles.back} href={`/${locale}/blog`}>
            {dict.bl_back}
          </Link>
        </PageHeader>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className={`wrap ${prose.prose}`}>
            <Content />
          </div>
          <div className="wrap">
            <WhatsAppCta locale={locale} title={dict.bl_cta_t} text={dict.bl_cta_p} label={dict.cta} message={dict.wa_msg} />
          </div>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </main>
  );
}
