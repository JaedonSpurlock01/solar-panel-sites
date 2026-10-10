import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export function loadSite(siteId = process.env.SITE) {
  if (!siteId || !/^[a-z0-9-]+$/.test(siteId)) {
    throw new Error("SITE must be set to a lowercase site ID.");
  }

  const directory = resolve(`sites/${siteId}`);
  const configPath = resolve(directory, "site.json");
  const servicesPath = resolve(directory, "services.ts");
  const contentPath = resolve(directory, "content.ts");

  if (!existsSync(configPath) || !existsSync(servicesPath) || !existsSync(contentPath)) {
    throw new Error(`Missing site files for "${siteId}".`);
  }

  const config = JSON.parse(readFileSync(configPath, "utf8"));

  if (config.id !== siteId) {
    throw new Error(`SITE "${siteId}" does not match site.json id "${config.id}".`);
  }

  return { config, directory };
}
