import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ url, preferredLocale, redirect }, next) => {

  if (url.pathname === '/' && preferredLocale) {
    return redirect(`/${preferredLocale}/`, 302);
  }

  return await next();
});
