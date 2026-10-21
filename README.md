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
- Deploy command: `TRACER_FORM_KEY=<Forms key> SITE=<site-id> npm run deploy` (the key comes from Tracer under Integrations, Cloudflare, and is the same for every site)

`SITE` is the only manual build-selection variable. Update the Tracer forms URL (`tracerFormsUrl`), business information, and the Worker name in `site.json`; do not edit generated Wrangler files. Contact-form leads post to Tracer, which stores them under the site's Workspace, emails the business from the site's `info@` address, and counts them as leads; forwarding recipients live in Tracer, not here.

## Add a site

1. Copy `sites/_template/` to a lowercase, hyphenated site ID.
2. Replace every template value and all content.
3. Add site images under `src/assets/sites/<site-id>/`.
4. Build with `SITE=<site-id> npm run build`.
5. Inspect `dist/` for content or asset leakage before deployment.
