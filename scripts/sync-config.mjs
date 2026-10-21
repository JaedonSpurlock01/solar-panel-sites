import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadSite } from "./load-site.mjs";

const { config, directory } = loadSite();
if (!config.tracerFormsUrl) throw new Error(`sites/${config.id}/site.json needs tracerFormsUrl`);

const wrangler = {
  $schema: "../../node_modules/wrangler/config-schema.json",
  name: config.cloudflareProject,
  main: "../../dist/_worker.js/index.js",
  compatibility_date: "2026-10-10",
  compatibility_flags: ["nodejs_compat"],
  workers_dev: false,
  preview_urls: false,
  routes: [{ pattern: config.business.domain, custom_domain: true }],
  assets: {
    directory: "../../dist",
    binding: "ASSETS",
  },
  vars: {
    TRACER_FORMS_URL: config.tracerFormsUrl,
  },
  observability: {
    enabled: true,
    logs: { enabled: true, head_sampling_rate: 1 },
    traces: { enabled: true, head_sampling_rate: 0.01 },
  },
};

const outputPath = resolve(directory, "wrangler.jsonc");
writeFileSync(outputPath, `${JSON.stringify(wrangler, null, 2)}\n`);
console.log(`Generated ${outputPath}`);
