import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { site } from "@/config/site";

/**
 * Structured data for search engines (schema.org AutoRepair).
 * Only facts we actually know are included. The phone number and opening hours are added automatically
 * once they are filled in config/site.ts.
 */
export function JsonLd({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: site.name,
    alternateName: site.nameArabic,
    url: `${site.url}/${locale}`,
    image: `${site.url}/media/hero-desktop-poster.jpg`,
    description: dict.meta_desc,
    areaServed: { "@type": "City", name: site.city },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: site.country,
      ...(site.streetAddress ? { streetAddress: site.streetAddress } : {}),
    },
    ...(site.whatsappNumber ? { telephone: `+${site.whatsappNumber}` } : {}),
    ...(site.openingHours ? { openingHours: site.openingHours } : {}),
  };

  // "<" is escaped so the JSON can never end the script tag early.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
