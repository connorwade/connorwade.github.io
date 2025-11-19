import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";

import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  site: "https://www.codingakita.com",
  integrations: [mdx(), sitemap(), svelte(), alpinejs()],

  vite: {
    plugins: [tailwindcss()],
  },
});