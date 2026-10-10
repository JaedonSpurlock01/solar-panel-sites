import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const siteId = process.env.SITE;

if (!siteId || !/^[a-z0-9-]+$/.test(siteId)) {
  throw new Error("Set SITE to a lowercase site ID, for example SITE=carson-city-solar-installation.");
}

const siteDirectory = resolve(`sites/${siteId}`);
const siteConfigPath = resolve(siteDirectory, "site.json");

if (!existsSync(siteConfigPath)) {
  throw new Error(`Site configuration not found: sites/${siteId}/site.json`);
}

const siteConfig = JSON.parse(readFileSync(siteConfigPath, "utf8"));

export default defineConfig({
  site: siteConfig.business.url,
  output: "server",
  build: {
    inlineStylesheets: "always",
  },
  adapter: cloudflare({
    imageService: "passthrough",
    platformProxy: { enabled: false },
  }),
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("/thank-you/"),
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@site": siteDirectory,
        "@": resolve("src"),
      },
    },
  },
});
