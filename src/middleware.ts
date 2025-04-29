import { defineMiddleware } from 'astro:middleware';

const qrRedirects: Record<string, string> = {
  '/XYZ1': '/about',
  '/XYZ2': '/guestbook',
};

export const onRequest = defineMiddleware(async ({ url, preferredLocale, redirect }, next) => {
  const pathname = url.pathname;
  const hasLocalePrefix = pathname.startsWith('/de/') || pathname.startsWith('/en/');

  if (qrRedirects[pathname] && preferredLocale) {
    return redirect(`/${preferredLocale}${qrRedirects[pathname]}`, 302);
  }

  if (!hasLocalePrefix && preferredLocale) {
    return redirect(`/${preferredLocale}${pathname}`, 302);
  }

  return await next();
});
