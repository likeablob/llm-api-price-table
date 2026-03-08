import { LOCALES, t, type Locale } from "@/lib/translations";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params }) => {
  const { generateOgpImage } = await import("@/lib/ogp");
  const locale = params.locale;

  if (!locale || !LOCALES.includes(locale as Locale)) {
    return new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const title = t(locale as Locale, "title");
  const png = await generateOgpImage(title);

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

export const getStaticPaths = async () => {
  return LOCALES.map((locale) => ({
    params: { locale },
    props: { locale },
  }));
};
