export interface RgbaColor {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

const srgbLinearThreshold = 0.04045;

export function parseCssColor(value: string): RgbaColor {
  const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
  const [red = 0, green = 0, blue = 0, alpha = 1] = channels;
  return { red, green, blue, alpha };
}

export function compositeOver(top: RgbaColor, bottom: RgbaColor): RgbaColor {
  const blend = (front: number, back: number) =>
    Math.round(front * top.alpha + back * (1 - top.alpha));
  return {
    red: blend(top.red, bottom.red),
    green: blend(top.green, bottom.green),
    blue: blend(top.blue, bottom.blue),
    alpha: 1,
  };
}

function linearChannel(channel: number): number {
  const normalized = channel / 255;
  return normalized <= srgbLinearThreshold
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(color: RgbaColor): number {
  return (
    0.2126 * linearChannel(color.red) +
    0.7152 * linearChannel(color.green) +
    0.0722 * linearChannel(color.blue)
  );
}

export function contrastRatio(first: RgbaColor, second: RgbaColor): number {
  const [lighter, darker] = [
    relativeLuminance(first),
    relativeLuminance(second),
  ].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}
