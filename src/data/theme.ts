export type Theme = "light" | "dark";

export const themeStorageKey = "theme";

// Must match src/styles/tokens.css: CSS cannot import TypeScript, and meta tags and build-time images need these values in code.
export const themeColors = {
  light: { bg: "#F7F1EC", feature: "#2A1418" },
  dark: { bg: "#160E0F", text: "#F2EAE4", muted: "#A8958F", accent: "#F0513A" },
} as const;
