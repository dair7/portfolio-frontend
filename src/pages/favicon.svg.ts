import type { APIRoute } from "astro";

import { faviconMarkup } from "../lib/favicon";

export const GET: APIRoute = () =>
  new Response(faviconMarkup(), {
    headers: { "Content-Type": "image/svg+xml" },
  });
