/**
 * Google AdSense settings. Nothing is loaded until the owner's AdSense account is approved and these variables are set
 * in Vercel (Settings > Environment Variables, then redeploy):
 *
 *   NEXT_PUBLIC_ADSENSE_CLIENT = ca-pub-XXXXXXXXXXXXXXXX   (publisher ID shown in AdSense)
 *   NEXT_PUBLIC_ADSENSE_SLOT   = 1234567890                 (ad unit ID of one responsive display ad)
 *
 * Without the first variable the site shows no ads, loads no Google ad script and /ads.txt returns 404.
 * Ads are placed only inside fault-code pages and articles, never on the home page or next to the WhatsApp button.
 */
const client = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "").trim();
const slot = (process.env.NEXT_PUBLIC_ADSENSE_SLOT ?? "").trim();

export const adsense = {
  client: /^ca-pub-\d{10,20}$/.test(client) ? client : "",
  slot: /^\d{6,20}$/.test(slot) ? slot : "",
  scriptSrc: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
} as const;

export const adsEnabled = adsense.client !== "";
