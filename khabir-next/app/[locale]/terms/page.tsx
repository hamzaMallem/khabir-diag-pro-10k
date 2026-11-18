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
  return pageMetadata(locale, "/terms", dict.tm_meta_title, dict.tm_meta_desc);
}

export default async function TermsPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <LegalPage
      kicker={dict.tm_kicker}
      title={dict.tm_h}
      intro={dict.tm_intro}
      updated={dict.lg_updated}
      sections={[
        { title: dict.tm_1_t, text: dict.tm_1_p },
        { title: dict.tm_2_t, text: dict.tm_2_p },
        { title: dict.tm_3_t, text: dict.tm_3_p },
        { title: dict.tm_4_t, text: dict.tm_4_p },
        { title: dict.tm_5_t, text: dict.tm_5_p },
        { title: dict.tm_6_t, text: dict.tm_6_p },
        { title: dict.tm_7_t, text: dict.tm_7_p },
      ]}
    />
  );
}
