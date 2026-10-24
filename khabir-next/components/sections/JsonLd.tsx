import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { site } from "@/config/site";
import { socialProfiles } from "@/config/social";

/** What the workshop diagnoses (same list as the services section). Names stay in English: schema.org values, not UI copy. */
const SERVICES = [
  "Engine and ECU diagnostics",
  "AdBlue, SCR, NOx sensor, DPF and EGR diagnostics",
  "Automatic gearbox diagnostics (DSG, 7G-Tronic, ZF)",
  "ABS, ESP and airbag diagnostics",
  "Electrics and CAN network diagnostics",
  "ECU coding and programming",
  "On-site roadside diagnostics in Beni Mellal province",
] as const;

const BRANDS = ["Mercedes-Benz", "BMW", "Audi", "Volkswagen", "Porsche", "MINI", "Škoda", "SEAT"] as const;

/**
 * Structured data for search engines and AI assistants (schema.org AutoRepair + FAQPage).
 * Only facts confirmed by the owner are included; empty fields in config/site.ts are left out.
 */
export function JsonLd({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${site.url}/#business`,
    name: site.name,
    alternateName: site.nameArabic,
    // LinkedIn is the founder's personal profile, not a company Page.
    sameAs: socialProfiles.filter((profile) => profile.owner === "workshop").map((profile) => profile.url),
    url: `${site.url}/${locale}`,
    image: `${site.url}/media/hero-desktop-poster.jpg`,
    description: dict.meta_desc,
    areaServed: { "@type": "AdministrativeArea", name: "Province de Béni Mellal" },
    knowsAbout: [...SERVICES, ...BRANDS.map((brand) => `${brand} diagnostics`)],
    knowsLanguage: ["fr", "ar", "en"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: dict.sv_h,
      itemListElement: SERVICES.map((service) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: service } })),
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: site.country,
      postalCode: site.postalCode,
      ...(site.streetAddress ? { streetAddress: site.streetAddress } : {}),
    },
    ...(site.streetAddress ? { geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng }, hasMap: site.mapsUrl } : {}),
    ...(site.whatsappNumber ? { telephone: `+${site.whatsappNumber}` } : {}),
    contactPoint: site.phones.map((phone) => ({
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${phone.number}`,
      availableLanguage: ["fr", "ar", "en"],
    })),
    ...(site.openingHours.length > 0 ? { openingHours: site.openingHours } : {}),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: ([1, 2, 3, 4, 5] as const).map((n) => ({
      "@type": "Question",
      name: dict[`fq${n}_q`],
      acceptedAnswer: { "@type": "Answer", text: dict[`fq${n}_a`] },
    })),
  };

  // "<" is escaped so the JSON can never end the script tag early.
  const serialize = (value: object) => JSON.stringify(value).replace(/</g, "\\u003c");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(data) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(faq) }} />
    </>
  );
}
