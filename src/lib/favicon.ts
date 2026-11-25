import { themeColors } from "../data/theme";
import { beanMarkup, beanViewBox } from "./bean";

export const faviconSize = 32;
const cornerRadius = 8;

export function faviconMarkup(): string {
  const { feature, accent } = themeColors.light;
  const offsetX = (faviconSize - beanViewBox.width) / 2;
  const offsetY = (faviconSize - beanViewBox.height) / 2;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${faviconSize} ${faviconSize}">`,
    `<rect width="${faviconSize}" height="${faviconSize}" rx="${cornerRadius}" fill="${feature}"/>`,
    `<g transform="translate(${offsetX} ${offsetY})">`,
    beanMarkup({ fill: accent, crease: feature }),
    `</g></svg>`,
  ].join("");
}
