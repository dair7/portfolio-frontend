import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import satori, { type Font } from "satori";
import sharp from "sharp";

import { ogImageSize, type OgCardContent } from "../data/seo";
import { createOgCard, ogFontFamily } from "./og-card";

type FontWeight = 400 | 700;

const require = createRequire(import.meta.url);

async function loadFontsourceFont(
  name: string,
  packageName: string,
  weight: FontWeight,
): Promise<Font> {
  // Satori cannot parse woff2, so the .woff build of each weight is used.
  const file = `@fontsource/${packageName}/files/${packageName}-latin-${weight}-normal.woff`;
  const data = await readFile(require.resolve(file));
  return { name, data, weight, style: "normal" };
}

let fontsPromise: Promise<Font[]> | undefined;

function loadOgFonts(): Promise<Font[]> {
  fontsPromise ??= Promise.all([
    loadFontsourceFont(ogFontFamily.display, "space-grotesk", 700),
    loadFontsourceFont(ogFontFamily.body, "inter", 400),
  ]);
  return fontsPromise;
}

export async function renderOgImage(content: OgCardContent): Promise<Response> {
  const svg = await satori(createOgCard(content), {
    ...ogImageSize,
    fonts: await loadOgFonts(),
  });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}
