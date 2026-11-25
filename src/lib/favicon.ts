import { themeColors } from "../data/theme";

export const faviconSize = 32;

const cornerRadius = 8;
const cup = {
  saucer: { cx: 15, cy: 25.5, rx: 11, ry: 2.4 },
  body: "M6.5 11.5 H23.5 L22.2 22 Q22 24 20 24 H10 Q8 24 7.8 22 Z",
  coffee: { cx: 15, cy: 11.7, rx: 7.6, ry: 1.5 },
  handle: "M23.2 14 q4.3 0 3.9 3.8 q-0.4 3.3 -4.7 3.2",
  handleWidth: 2.2,
  steam: [
    "M12.3 8.6 c-1.3 -1.3 1.3 -2.3 0 -3.6",
    "M17.7 8.6 c-1.3 -1.3 1.3 -2.3 0 -3.6",
  ],
  steamWidth: 1.5,
};

function stroke(path: string, color: string, width: number): string {
  return `<path d="${path}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
}

export function faviconMarkup(): string {
  const { bg, feature, accent } = themeColors.light;
  const { saucer, coffee } = cup;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${faviconSize} ${faviconSize}">`,
    `<rect width="${faviconSize}" height="${faviconSize}" rx="${cornerRadius}" fill="${feature}"/>`,
    ...cup.steam.map((path) => stroke(path, bg, cup.steamWidth)),
    `<ellipse cx="${saucer.cx}" cy="${saucer.cy}" rx="${saucer.rx}" ry="${saucer.ry}" fill="${bg}"/>`,
    stroke(cup.handle, accent, cup.handleWidth),
    `<path d="${cup.body}" fill="${accent}"/>`,
    `<ellipse cx="${coffee.cx}" cy="${coffee.cy}" rx="${coffee.rx}" ry="${coffee.ry}" fill="${feature}"/>`,
    `</svg>`,
  ].join("");
}
