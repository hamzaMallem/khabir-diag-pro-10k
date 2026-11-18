import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/pageMetadata";
import { PageHeader, WhatsAppCta } from "@/components/pages/PageParts";
import { LocationSection } from "@/components/sections/LocationSection";
import { PhoneLinks } from "@/components/ui/PhoneLinks";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, "/contact", dict.ct_meta_title, dict.ct_meta_desc);
}

export default async function ContactPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader kicker={dict.ct_kicker} title={dict.ct_h} intro={dict.ct_p}>
        <PhoneLinks dict={dict} />
      </PageHeader>
      <LocationSection dict={dict} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <WhatsAppCta locale={locale} title={dict.cta_h} text={dict.cta_sub} label={dict.cta} message={dict.wa_msg} />
          <p style={{ marginTop: 32, color: "var(--text-secondary)" }}>
            <strong>{dict.ct_legal}.</strong> {dict.ct_legal_p}
          </p>
        </div>
      </section>
    </main>
  );
}
