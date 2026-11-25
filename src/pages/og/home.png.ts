import type { APIRoute } from "astro";

import { homeOgCard } from "../../data/seo";
import { renderOgImage } from "../../lib/og-image";

export const GET: APIRoute = () => renderOgImage(homeOgCard);
