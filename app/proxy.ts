import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "ar",
  // localePrefix: "as-needed", // يخلّي المسار الأساسي بدون /en
});

export default async function proxy(request: NextRequest) {
  try {
    // Handle root path redirection to default locale
    if (request.nextUrl.pathname === "/") {
      const url = new URL(request.url);
      return NextResponse.redirect(new URL("/en", url.origin));
    }
    
    return intlMiddleware(request);
  } catch (error) {
    console.error("🌍 [Proxy Error] Failed to handle locale:", error);
    // fallback للإنجليزية في حالة أي خطأ
    const url = new URL(request.url);
    return NextResponse.redirect(new URL("/en", url.origin));
  }
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
