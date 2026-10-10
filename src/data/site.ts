import rawSite from "@site/site.json";
import { services } from "@site/services";
import type { ImageMetadata } from "astro";
import type { SiteConfig } from "./types";

export const site = rawSite as SiteConfig;
export { services };

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/sites/**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
  { eager: true },
);

export function resolveSiteImage(configPath: string): ImageMetadata {
  const key = `/${configPath.replace(/^\/+/, "")}`;
  const image = images[key]?.default;

  if (!image) {
    throw new Error(`Configured site image was not found: ${configPath}`);
  }

  return image;
}

export function servicePath(slug: string): string {
  return `/services/${slug}/`;
}

export const formattedHours = site.hours
  .map((entry) => `${entry.days.join(", ")}: ${entry.label}`)
  .join(" · ");

export const openingHoursSpecification = site.hours
  .filter((entry) => entry.opens && entry.closes)
  .map((entry) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: entry.days,
    opens: entry.opens,
    closes: entry.closes,
  }));
