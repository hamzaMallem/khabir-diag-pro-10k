import { adsense } from "@/lib/adsense";

// AdSense requires /ads.txt at the site root. The line is built from the publisher ID, so no ID means no file (404).
export const dynamic = "force-static";

export function GET() {
  if (!adsense.client) return new Response("Not found", { status: 404 });
  const publisher = adsense.client.replace(/^ca-/, "");
  return new Response(`google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
