import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { formatDate, getPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/pageMetadata";
import { PageHeader, WhatsAppCta, pageStyles as styles } from "@/components/pages/PageParts";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, "/blog", dict.bl_meta_title, dict.bl_meta_desc);
}

export default async function BlogPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [dict, posts] = await Promise.all([getDictionary(locale), getPosts(locale)]);

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader kicker={dict.bl_kicker} title={dict.bl_h} intro={dict.bl_p} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {posts.length === 0 ? (
            <p className={styles.empty}>
              {dict.bl_empty}{" "}
              <Link href="/ar/blog" lang="ar" hrefLang="ar">
                العربية
              </Link>
            </p>
          ) : (
            <ul className={styles.posts}>
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link className={styles.post} href={`/${locale}/blog/${post.slug}`}>
                    <time className={styles.meta} dateTime={post.date}>
                      {formatDate(post.date, locale)}
                    </time>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <span className={styles.more}>{dict.bl_read}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <WhatsAppCta locale={locale} title={dict.bl_cta_t} text={dict.bl_cta_p} label={dict.cta} message={dict.wa_msg} />
        </div>
      </section>
    </main>
  );
}
