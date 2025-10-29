import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  // localePrefix: 'as-needed' // This makes the default locale (en) not show in URL
});

export const config = {
  matcher: ['/', '/(ar|en)/:path*']
};

