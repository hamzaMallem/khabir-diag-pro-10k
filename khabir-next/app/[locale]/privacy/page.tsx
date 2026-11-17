import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/pageMetadata";
import { LegalPage } from "@/components/pages/LegalPage";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, "/privacy", dict.pv_meta_title, dict.pv_meta_desc);
}

export default async function PrivacyPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <LegalPage
      kicker={dict.pv_kicker}
      title={dict.pv_h}
      intro={dict.pv_intro}
      updated={dict.lg_updated}
      sections={[
        { title: dict.pv_1_t, text: dict.pv_1_p },
        { title: dict.pv_2_t, text: dict.pv_2_p },
        { title: dict.pv_3_t, text: dict.pv_3_p },
        { title: dict.pv_4_t, text: dict.pv_4_p },
        { title: dict.pv_5_t, text: dict.pv_5_p },
        { title: dict.pv_6_t, text: dict.pv_6_p },
        { title: dict.pv_7_t, text: dict.pv_7_p },
      ]}
    />
  );
}
