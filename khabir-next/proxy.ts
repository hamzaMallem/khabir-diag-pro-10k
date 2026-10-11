import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie, locales, type Locale } from "@/i18n/config";

/** Pick the visitor's language: saved choice first, then the browser language, then French. */
function pickLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(localeCookie)?.value;
  if (saved && isLocale(saved)) return saved;

  const accepted = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
  return accepted.find(isLocale) ?? defaultLocale;
}

// Runs before every page request. If the URL has no language (for example "/"), redirect to "/fr", "/ar" or "/en".
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${pickLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next.js internals, the media folder and any file with an extension (icons, robots, sitemap...).
  matcher: ["/((?!_next|media|.*\..*).*)"],
};
