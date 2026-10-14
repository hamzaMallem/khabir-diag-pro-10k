import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/pageMetadata";
import { PageHeader, WhatsAppCta } from "@/components/pages/PageParts";
import { FaqSection } from "@/components/sections/FaqSection";
import { MethodSection } from "@/components/sections/MethodSection";
import { PromisesSection } from "@/components/sections/PromisesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, "/services", dict.svp_meta_title, dict.svp_meta_desc);
}

export default async function ServicesPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader kicker={dict.svp_kicker} title={dict.svp_h} intro={dict.svp_p} />
      <ServicesSection dict={dict} />
      <MethodSection dict={dict} />
      <PromisesSection dict={dict} />
      <FaqSection dict={dict} />
      <section className="section">
        <div className="wrap">
          <WhatsAppCta locale={locale} title={dict.cta_h} text={dict.cta_sub} label={dict.cta} message={dict.wa_msg} />
        </div>
      </section>
    </main>
  );
}
