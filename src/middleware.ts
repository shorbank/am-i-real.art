import { defineMiddleware } from 'astro:middleware';
import qrRedirects from './data/qrRedirects';

export const onRequest = defineMiddleware(async ({ url, preferredLocale, redirect }, next) => {
  const pathname = url.pathname;
  const locale = preferredLocale || 'en';
  const hasLocalePrefix = pathname.startsWith('/de/') || pathname.startsWith('/en/');

  const target = qrRedirects[pathname];
  if (target) {
    const targetHasLocale = target.startsWith('/de/') || target.startsWith('/en/');
    const finalTarget = targetHasLocale ? target : `/${locale}${target}`;
    return redirect(finalTarget, 302);
  }

  if (!hasLocalePrefix) {
    return redirect(`/${locale}${pathname}`, 302);
  }

  return await next();
});
