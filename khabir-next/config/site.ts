// Single source of truth for the business details (confirmed by the owner on 2026-10-14, from the Google Maps listing).
export const site = {
  name: "Khabir Diagnostic Auto Pro",
  nameArabic: "خبير داياغنوستيك أوتو برو",
  city: "Beni Mellal",
  country: "MA",
  postalCode: "23000",

  /** WhatsApp for all "Diagnose my car" buttons. International format, digits only. Empty = not configured. */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "212632899218",

  /** Phone numbers shown as call links. `id` matches the label key ph_<id> in messages/*.json. */
  phones: [
    { id: "saidi", number: "212632899218" },
    { id: "youssef", number: "212671765896" },
  ],

  /** As written on Google Maps. The visible, translated address is i_addr in messages/*.json. Empty = map hidden. */
  streetAddress: "Proche Pharmacie Hay Redouane, Quartier Hay Redouane",
  geo: { lat: 32.3415409, lng: -6.3638183 },
  mapsUrl: "https://maps.app.goo.gl/hEALPzvM1aEfoSbr5",

  /** schema.org format. The visible, translated hours are i_hours in messages/*.json. Empty = "to be added". */
  openingHours: ["Mo-Th 08:30-19:00", "Fr 09:00-19:00", "Sa 08:30-19:00"],

  /**
   * Absolute public URL, used for canonical links, hreflang, the sitemap and Open Graph (server side only).
   * Order: NEXT_PUBLIC_SITE_URL (set it once a custom domain exists), then the production domain Vercel provides
   * at build time (VERCEL_PROJECT_PRODUCTION_URL, e.g. khabir-diag-pro-10k.vercel.app), then localhost.
   */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
  ).replace(/\/$/, ""),
} as const;

/** "212632899218" -> "06 32 89 92 18" (how Moroccan numbers are written locally). */
export function formatLocalPhone(international: string): string {
  const local = `0${international.replace(/^212/, "")}`;
  return local.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}
