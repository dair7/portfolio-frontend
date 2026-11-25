import type { APIRoute } from "astro";
import sharp from "sharp";

import { themeColors } from "../data/theme";
import { faviconMarkup, faviconSize } from "../lib/favicon";

const iconSize = 180;
const defaultDensity = 72;

export const GET: APIRoute = async () => {
  const density = (defaultDensity * iconSize) / faviconSize;
  // iOS fills transparent pixels with black, so the rounded corners get the icon's own background.
  const png = await sharp(Buffer.from(faviconMarkup()), { density })
    .resize(iconSize, iconSize)
    .flatten({ background: themeColors.light.feature })
    .png()
    .toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
