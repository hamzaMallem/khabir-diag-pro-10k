import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { site } from "@/config/site";

/**
 * Structured data for search engines (schema.org AutoRepair).
 * Only facts confirmed by the owner are included; empty fields in config/site.ts are left out.
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
    areaServed: { "@type": "AdministrativeArea", name: "Province de Béni Mellal" },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: site.country,
      postalCode: site.postalCode,
      ...(site.streetAddress ? { streetAddress: site.streetAddress } : {}),
    },
    ...(site.streetAddress ? { geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng }, hasMap: site.mapsUrl } : {}),
    ...(site.whatsappNumber ? { telephone: `+${site.whatsappNumber}` } : {}),
    ...(site.openingHours.length > 0 ? { openingHours: site.openingHours } : {}),
  };

  // "<" is escaped so the JSON can never end the script tag early.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
