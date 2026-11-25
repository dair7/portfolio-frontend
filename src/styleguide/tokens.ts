export type ColorToken =
  | "bg"
  | "text"
  | "muted"
  | "line"
  | "surface"
  | "band"
  | "accent"
  | "accent-text"
  | "on-accent"
  | "feature"
  | "feature-text"
  | "feature-muted"
  | "feature-accent"
  | "glass"
  | "glass-line";

export interface ColorSwatch {
  token: ColorToken;
  usage: string;
}

export interface ContrastPair {
  foreground: ColorToken;
  background: ColorToken;
  minimumRatio: number;
}

export const normalTextMinimum = 4.5;
export const largeTextMinimum = 3;

export const colorSwatches: ColorSwatch[] = [
  { token: "bg", usage: "Page background (60 %)" },
  { token: "text", usage: "Headings and body (30 %)" },
  { token: "muted", usage: "Secondary text" },
  { token: "line", usage: "Borders and dividers" },
  { token: "surface", usage: "Cards" },
  { token: "band", usage: "Alternate sections" },
  { token: "accent", usage: "Primary button, details (10 %)" },
  { token: "accent-text", usage: "Small red text, technology tags" },
  { token: "on-accent", usage: "Text on accent" },
  { token: "feature", usage: "Featured block" },
  { token: "feature-text", usage: "Text on feature" },
  { token: "feature-muted", usage: "Secondary text on feature" },
  { token: "feature-accent", usage: "Accent on feature" },
  { token: "glass", usage: "Navigation background" },
  { token: "glass-line", usage: "Navigation border" },
];

export const contrastPairs: ContrastPair[] = [
  { foreground: "text", background: "bg", minimumRatio: normalTextMinimum },
  { foreground: "muted", background: "bg", minimumRatio: normalTextMinimum },
  {
    foreground: "text",
    background: "surface",
    minimumRatio: normalTextMinimum,
  },
  {
    foreground: "muted",
    background: "surface",
    minimumRatio: normalTextMinimum,
  },
  { foreground: "text", background: "band", minimumRatio: normalTextMinimum },
  { foreground: "muted", background: "band", minimumRatio: normalTextMinimum },
  {
    foreground: "on-accent",
    background: "accent",
    minimumRatio: normalTextMinimum,
  },
  { foreground: "accent", background: "bg", minimumRatio: largeTextMinimum },
  {
    foreground: "accent",
    background: "surface",
    minimumRatio: largeTextMinimum,
  },
  {
    foreground: "feature-text",
    background: "feature",
    minimumRatio: normalTextMinimum,
  },
  {
    foreground: "feature-muted",
    background: "feature",
    minimumRatio: normalTextMinimum,
  },
  {
    foreground: "feature-accent",
    background: "feature",
    minimumRatio: normalTextMinimum,
  },
  ...(["bg", "surface", "band", "glass"] as const).map((background) => ({
    foreground: "accent-text" as const,
    background,
    minimumRatio: normalTextMinimum,
  })),
  { foreground: "text", background: "glass", minimumRatio: normalTextMinimum },
  { foreground: "muted", background: "glass", minimumRatio: normalTextMinimum },
];

export function tokenVariable(token: ColorToken): string {
  return `var(--theme-${token})`;
}
