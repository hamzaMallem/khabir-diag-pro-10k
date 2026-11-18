import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { codes, codeSlug, getCodeText, systems } from "@/content/codes";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/pageMetadata";
import { PageHeader, WhatsAppCta } from "@/components/pages/PageParts";
import { CodeSearch, type CodeCard } from "@/components/codes/CodeSearch";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, "/codes", dict.cd_meta_title, dict.cd_meta_desc);
}

export default async function CodesPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const systemLabel = (id: (typeof systems)[number]) => dict[`cd_sys_${id}`];
  const cards: CodeCard[] = codes.map((c) => {
    const text = getCodeText(locale, c.code);
    return {
      code: c.code,
      href: `/${locale}/codes/${codeSlug(c.code)}`,
      title: text.title,
      system: c.system,
      severity: c.severity,
      haystack: [c.code, text.title, systemLabel(c.system), c.official, ...c.brands].join(" ").toLowerCase(),
    };
  });

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader kicker={dict.cd_kicker} title={dict.cd_h} intro={dict.cd_p} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <CodeSearch
            cards={cards}
            systems={systems.map((id) => ({ id, label: systemLabel(id) }))}
            severityLabels={{ stop: dict.cd_sev_stop, soon: dict.cd_sev_soon, ok: dict.cd_sev_ok }}
            labels={{ search: dict.cd_search, searchLabel: dict.cd_search_l, none: dict.cd_none, all: dict.cd_all, count: dict.cd_count }}
          />
          <WhatsAppCta locale={locale} title={dict.cd_cta_t} text={dict.cd_cta_p} label={dict.cta} message={dict.cd_wa.replace("{code}", "")} />
        </div>
      </section>
    </main>
  );
}
