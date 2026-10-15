import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// Kept deliberately minimal. Every page is statically generated per language.
// MDX is enabled for the blog articles in content/blog/<locale>/*.mdx.

// Vercel injects its feedback toolbar (vercel.live) on preview deployments only.
const vercelLive = process.env.VERCEL_ENV === "preview" ? " https://vercel.live" : "";

// What the site is allowed to load. Everything is self-hosted (fonts via next/font, videos in /public/media)
// except the Google Maps embed. 'unsafe-inline' is needed for Next.js's inline bootstrap scripts on static pages
// (nonces would force every page to render on each request) and for React style attributes.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}${vercelLive}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self' blob:", // the hero video is downloaded to memory and played from a blob URL
  `connect-src 'self'${vercelLive}`,
  `frame-src https://www.google.com https://maps.google.com${vercelLive}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Hero files carry ?v=<number> (config/hero.ts), so they can be cached for a year without ever going stale.
      {
        source: "/media/:file*",
        has: [{ type: "query", key: "v" }],
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Other images: a day, then refresh quietly in the background.
      {
        source: "/media/:file((?:step|workshop)-.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
