# Carson City Solar Installation deployment

## Worker build

- Project name: `carson-city-solar-installation`
- Custom domain: `carsoncitysolarinstallation.com`
- Build variable: `SITE=carson-city-solar-installation`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy -c sites/carson-city-solar-installation/wrangler.jsonc`

The generated Wrangler file sends form leads from `info@carsoncitysolarinstallation.com` to `spurjae@gmail.com`. The notification address is the same as the delivery address, so the API intentionally skips BCC.

## Email Sending

Before testing production submissions:

1. Onboard `carsoncitysolarinstallation.com` under Cloudflare Email Sending.
2. Confirm the sender domain is active.
3. Confirm `spurjae@gmail.com` is an allowed and verified destination when Cloudflare requires destination verification.
4. Deploy the generated Wrangler configuration.
5. Submit a real test lead and inspect Worker logs if delivery fails.

Do not add `remote: true` to production configuration. That option is only for intentionally sending real mail from local development.

## Public inbound email

Email Routing and Email Sending are separate.

Create this Cloudflare Email Routing rule for inbound public messages:

```text
info@carsoncitysolarinstallation.com → spurjae@gmail.com
```

Verify `spurjae@gmail.com` as a destination address and enable the DNS records Cloudflare provides for Email Routing. This routing rule does not control form delivery; the `LEAD_EMAIL` binding handles form submissions.
