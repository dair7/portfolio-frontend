import { defineConfig, fontProviders } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

function fontsourceFamily({
  name,
  packageName,
  cssVariable,
  weights,
  fallbacks,
  optimizedFallbacks = true,
}) {
  return {
    provider: fontProviders.local(),
    name,
    cssVariable,
    fallbacks,
    optimizedFallbacks,
    options: {
      variants: weights.map((weight) => ({
        weight,
        style: "normal",
        src: [
          `@fontsource/${packageName}/files/${packageName}-latin-${weight}-normal.woff2`,
        ],
      })),
    },
  };
}

const devOnlyStyleguide = {
  name: "dev-only-styleguide",
  hooks: {
    "astro:config:setup": ({ command, injectRoute }) => {
      if (command !== "dev") return;
      injectRoute({
        pattern: "/styleguide",
        entrypoint: "./src/styleguide/StyleguidePage.astro",
      });
    },
  },
};

export default defineConfig({
  // TODO(dair): replace with the final domain.
  site: "https://portfolio-frontend-six-red.vercel.app",

  // Compression drops the line-break whitespace Prettier leaves between {expressions} and tags.
  compressHTML: false,

  markdown: {
    shikiConfig: { theme: "css-variables" },
  },

  integrations: [mdx(), sitemap(), devOnlyStyleguide],

  fonts: [
    fontsourceFamily({
      name: "Space Grotesk",
      packageName: "space-grotesk",
      cssVariable: "--font-space-grotesk",
      weights: [500, 700],
      fallbacks: [
        "Space Grotesk Fallback Arial",
        "Space Grotesk Fallback Roboto",
        "system-ui",
        "sans-serif",
      ],
      optimizedFallbacks: false,
    }),
    fontsourceFamily({
      name: "Inter",
      packageName: "inter",
      cssVariable: "--font-inter",
      weights: [400, 500, 600],
      fallbacks: [
        "Inter Fallback Arial",
        "Inter Fallback Roboto",
        "system-ui",
        "sans-serif",
      ],
      optimizedFallbacks: false,
    }),
    fontsourceFamily({
      name: "JetBrains Mono",
      packageName: "jetbrains-mono",
      cssVariable: "--font-jetbrains-mono",
      weights: [400, 500],
      fallbacks: ["ui-monospace", "monospace"],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
