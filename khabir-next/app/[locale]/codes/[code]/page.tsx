import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CODES_PUBLISHED, codes, codeSlug, getCode, getCodeText, getRelatedCodes } from "@/content/codes";
import { getExtra, type BrandKey } from "@/content/codes/extra";
import { site } from "@/config/site";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { adsense } from "@/lib/adsense";
import { pageMetadata } from "@/lib/pageMetadata";
import { AdSlot } from "@/components/ads/AdSlot";
import { PageHeader, WhatsAppCta, pageStyles as pageStyle } from "@/components/pages/PageParts";
import prose from "@/components/pages/Prose.module.css";
import styles from "@/components/codes/Codes.module.css";

type Params = { params: Promise<{ locale: string; code: string }> };

// Every code page is pre-built. Unknown codes return 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => codes.map((c) => ({ locale, code: codeSlug(c.code) })));
}

/** Brand families named in the per-brand notes (proper names, not translated). */
const brandNames: Record<BrandKey, string> = { vw: "Volkswagen / Audi", mercedes: "Mercedes-Benz", renault: "Renault / Dacia", peugeot: "Peugeot" };

const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, code } = await params;
  const meta = getCode(code);
  if (!isLocale(locale) || !meta) return {};
  const dict = await getDictionary(locale);
  const text = getCodeText(locale, meta.code);
  const values = { code: meta.code, title: text.title };
  const base = pageMetadata(locale, `/codes/${codeSlug(meta.code)}`, fill(dict.cd_page_title, values), fill(dict.cd_page_desc, values));
  return { ...base, openGraph: { ...base.openGraph, type: "article", publishedTime: CODES_PUBLISHED } };
}

export default async function CodePage({ params }: Params) {
  const { locale, code } = await params;
  const meta = getCode(code);
  if (!isLocale(locale) || !meta) notFound();

  const dict = await getDictionary(locale);
  const text = getCodeText(locale, meta.code);
  const related = getRelatedCodes(meta).slice(0, 8);
  const extra = getExtra(locale, meta.code);
  const path = `/${locale}/codes/${codeSlug(meta.code)}`;
  const heading = `${meta.code} · ${text.title}`;

  const driveColor = { stop: "var(--fault)", soon: "var(--accent)", ok: "var(--ok)" }[meta.severity];
  const driveLabel = { stop: dict.cd_sev_stop, soon: dict.cd_sev_soon, ok: dict.cd_sev_ok }[meta.severity];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: fill(dict.cd_page_title, { code: meta.code, title: text.title }),
      description: text.what,
      datePublished: CODES_PUBLISHED,
      dateModified: CODES_PUBLISHED,
      inLanguage: locale,
      mainEntityOfPage: `${site.url}${path}`,
      author: { "@type": "Organization", name: site.name, url: `${site.url}/${locale}` },
      publisher: { "@type": "Organization", name: site.name },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: dict.nav_home, item: `${site.url}/${locale}` },
        { "@type": "ListItem", position: 2, name: dict.nav_codes, item: `${site.url}/${locale}/codes` },
        { "@type": "ListItem", position: 3, name: meta.code, item: `${site.url}${path}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: [
        { "@type": "Question", name: dict.cd_what, acceptedAnswer: { "@type": "Answer", text: text.what } },
        { "@type": "Question", name: dict.cd_drive, acceptedAnswer: { "@type": "Answer", text: text.drive } },
      ],
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <article>
        <PageHeader kicker={dict.cd_kicker} title={heading} intro={text.what}>
          <Link className={pageStyle.back} href={`/${locale}/codes`}>
            {dict.cd_back}
          </Link>
        </PageHeader>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className={`wrap ${prose.prose}`}>
            <p className={styles.official}>
              {dict.cd_official}: <bdi dir="ltr">{meta.official}</bdi>
            </p>
            {meta.brands.length > 0 && (
              <p className={styles.official}>
                {dict.cd_brands}: <bdi dir="ltr">{meta.brands.join(", ")}</bdi>
              </p>
            )}

            <div className={styles.drive} style={{ color: driveColor }}>
              <h2>
                {dict.cd_drive} {driveLabel}
              </h2>
              <p>{text.drive}</p>
            </div>

            <h2>{dict.cd_symptoms}</h2>
            <ul>
              {text.symptoms.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <AdSlot client={adsense.client} slot={adsense.slot} label={dict.ad_label} />

            <h2>{dict.cd_causes}</h2>
            <ul>
              {text.causes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            {extra && (
              <>
                <h2>{dict.cd_steps}</h2>
                <ol>
                  {extra.steps.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </>
            )}

            <h2>{dict.cd_check}</h2>
            <p>{text.check}</p>

            {extra && (
              <>
                <h2>{dict.cd_brand_notes}</h2>
                <ul>
                  {(Object.keys(brandNames) as BrandKey[]).map((key) => (
                    <li key={key}>
                      <strong>{brandNames[key]}.</strong> {extra.brands[key]}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p className={styles.note}>{dict.cd_note}</p>
            <p className={styles.byline}>
              {dict.cd_by} · {dict.lg_updated}
            </p>

            {related.length > 0 && (
              <>
                <h2>{dict.cd_related}</h2>
                <ul className={styles.related}>
                  {related.map((r) => (
                    <li key={r.code}>
                      <Link href={`/${locale}/codes/${codeSlug(r.code)}`} dir="ltr">
                        {r.code}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="wrap">
            <WhatsAppCta locale={locale} title={dict.cd_cta_t} text={dict.cd_cta_p} label={dict.cta} message={fill(dict.cd_wa, { code: meta.code })} />
          </div>
        </section>
      </article>
      {jsonLd.map((block, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, "\\u003c") }} />
      ))}
    </main>
  );
}
