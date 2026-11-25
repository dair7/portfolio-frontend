import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // TODO(dair): replace with the final domain.
  site: "https://portfolio-frontend-six-red.vercel.app",

  integrations: [mdx(), react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
