import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ url, preferredLocale, redirect }, next) => {
  const pathname = url.pathname;
  const hasLocalePrefix = pathname.startsWith('/de/') || pathname.startsWith('/en/');

  if (!hasLocalePrefix && preferredLocale) {
    return redirect(`/${preferredLocale}${pathname}`, 302);
  }

  return await next();
});
