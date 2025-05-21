import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ params }) => {
  const locale = params.locale;
  return new Response(null, {
    status: 301,
    headers: {
      Location: `/${locale}/exhibition/schwelle`,
    },
  });
};
