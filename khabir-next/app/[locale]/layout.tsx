import type { Metadata, Viewport } from "next";
import { Alexandria, IBM_Plex_Mono, Readex_Pro, Saira_Condensed } from "next/font/google";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { getDirection, isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { Background } from "@/components/layout/Background";
import { Footer } from "@/components/layout/Footer";
import { Nav, type NavLink } from "@/components/layout/Nav";
import "@/styles/globals.css";

// Fonts are downloaded at build time and served from our own domain. Each sets a CSS variable used in styles/globals.css.
const saira = Saira_Condensed({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-saira", display: "swap" });
const alexandria = Alexandria({ subsets: ["arabic", "latin"], weight: ["600", "700"], variable: "--font-alexandria", display: "swap" });
const readex = Readex_Pro({ subsets: ["arabic", "latin"], weight: ["300", "400", "500"], variable: "--font-readex", display: "swap" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex", display: "swap" });

type LayoutParams = { params: Promise<{ locale: string }> };

// Pre-build one page per language.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#0E1518" };

const openGraphLocale: Record<Locale, string> = { fr: "fr_MA", ar: "ar_MA", en: "en_US" };

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const image = { url: "/media/hero-desktop-poster.jpg", width: 1280, height: 720, alt: site.name };

  return {
    metadataBase: new URL(site.url),
    title: dict.meta_title,
    description: dict.meta_desc,
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", ar: "/ar", en: "/en", "x-default": "/fr" },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: dict.meta_title,
      description: dict.meta_desc,
      url: `/${locale}`,
      locale: openGraphLocale[locale],
      images: [image],
    },
    twitter: { card: "summary_large_image", title: dict.meta_title, description: dict.meta_desc, images: [image.url] },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode } & LayoutParams) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  // Shared by the top bar and the footer. To add a page: create app/[locale]/<path>/page.tsx and add it here.
  const links: NavLink[] = [
    { path: "", label: dict.nav_home },
    { path: "/services", label: dict.nav_services },
    { path: "/blog", label: dict.nav_blog },
    { path: "/about", label: dict.nav_about },
  ];

  return (
    <html lang={locale} dir={getDirection(locale)} className={`${saira.variable} ${alexandria.variable} ${readex.variable} ${plex.variable}`}>
      <body>
        <a className="skip" href="#main">
          {dict.skip}
        </a>
        <Background />
        <Nav
          locale={locale}
          ctaLabel={dict.nav_cta}
          ctaHref={getWhatsAppHref(dict.wa_msg)}
          languageLabel={dict.lang_label}
          pagesLabel={dict.nav_label}
          links={links}
        />
        {children}
        <Footer dict={dict} locale={locale} links={links} />
      </body>
    </html>
  );
}
