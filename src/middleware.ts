import { defineMiddleware } from 'astro:middleware';

const qrRedirects: Record<string, string> = {
  '/X2U73Q': '/assign-page',
  '/GPHGS1': '/assign-page',
  '/RY1EXM': '/assign-page',
  '/JWGQ9K': '/assign-page',
  '/GSP7WP': '/assign-page',
  '/RX8PXF': '/assign-page',
  '/H7BVJL': '/assign-page',
};

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
