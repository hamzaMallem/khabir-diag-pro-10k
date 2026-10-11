// Single source of truth for the business details.
// Fill these in (here or through environment variables) before launching.
export const site = {
  name: "Khabir Diagnostic Auto Pro",
  nameArabic: "خبير داياغنوستيك أوتو برو",
  city: "Beni Mellal",
  country: "MA",

  /** International format, digits only, for example "2126XXXXXXXX". Empty = not configured yet. */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",

  /** Not provided yet. Keep empty until the owner confirms them. */
  streetAddress: "",
  openingHours: "",

  /** Absolute public URL, used for canonical links, hreflang and the sitemap. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;
