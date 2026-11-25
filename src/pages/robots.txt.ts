import type { APIRoute } from "astro";

import { sitemapPath } from "../data/seo";

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL(sitemapPath, site);
  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemapUrl.href}`];
  return new Response(`${body.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
