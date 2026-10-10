# Solar panel lead-generation sites

One Astro application builds a selected site from `sites/<site-id>/`.

## Local build

```bash
SITE=carson-city-solar-installation npm run build
```

The build regenerates that site's `wrangler.jsonc` from `site.json`.

## Cloudflare Workers Builds

- Root directory: `/`
- Environment variable: `SITE=<site-id>`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy -c sites/<site-id>/wrangler.jsonc`

`SITE` is the only manual build-selection variable. Update lead routing, business information, and the Worker name in `site.json`; do not edit generated Wrangler files.

## Add a site

1. Copy `sites/_template/` to a lowercase, hyphenated site ID.
2. Replace every template value and all content.
3. Add site images under `src/assets/sites/<site-id>/`.
4. Build with `SITE=<site-id> npm run build`.
5. Inspect `dist/` for content or asset leakage before deployment.
