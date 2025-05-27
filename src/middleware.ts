import { defineMiddleware } from 'astro:middleware';
import qrRedirects from './data/qrRedirects';

export const onRequest = defineMiddleware(async ({ url, preferredLocale, redirect }, next) => {
  const pathname = url.pathname;

  if (qrRedirects[pathname]) {
    return redirect(qrRedirects[pathname], 302);
  }

  const hasLocalePrefix = pathname.startsWith('/de/') || pathname.startsWith('/en/');
  const locale = preferredLocale || 'en';

  if (!hasLocalePrefix) {
    return redirect(`/${locale}${pathname}`, 302);
  }

  return await next();
});
