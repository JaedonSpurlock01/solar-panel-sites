import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { site, services } from "@/data/site";

export const prerender = false;

const redirect = (request: Request, path: string) =>
  Response.redirect(new URL(path, request.url), 303);

const value = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

const escapeHtml = (input: string) =>
  input.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();

  if (value(form, "company_website")) {
    return redirect(request, "/thank-you/");
  }

  const name = value(form, "name");
  const phone = value(form, "phone");
  const email = value(form, "email");
  const service = value(form, "service");
  const projectDetails = value(form, "projectDetails");
  const serviceValues = new Set(services.map((item) => item.formValue));
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPhone = phone.replace(/\D/g, "").length >= 10;
  const validProjectField =
    site.niche.projectFieldType === "number"
      ? Number(projectDetails) > 0
      : site.niche.projectFieldType === "select"
        ? Boolean(site.niche.projectFieldOptions?.includes(projectDetails))
        : projectDetails.length > 9;

  if (
    !name ||
    name.length > 100 ||
    !validPhone ||
    phone.length > 30 ||
    !validEmail ||
    email.length > 200 ||
    !serviceValues.has(service) ||
    !validProjectField ||
    projectDetails.length > 3000
  ) {
    return redirect(request, "/contact/?error=1#error-fields");
  }

  if (!env.LEAD_EMAIL) {
    return redirect(request, "/contact/?error=bind#error-bind");
  }
  if (!env.LEAD_DELIVERY_EMAIL) {
    return redirect(request, "/contact/?error=config#error-config");
  }

  const submitted = { name, phone, email, service, projectDetails };
  const text = [
    `New ${site.niche.name} lead`,
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Service: ${service}`,
    `${site.niche.projectFieldLabel}:`,
    projectDetails,
  ].join("\n");
  const html = `
    <h1>New ${escapeHtml(site.niche.name)} lead</h1>
    <dl>
      <dt>Name</dt><dd>${escapeHtml(name)}</dd>
      <dt>Phone</dt><dd>${escapeHtml(phone)}</dd>
      <dt>Email</dt><dd>${escapeHtml(email)}</dd>
      <dt>Service</dt><dd>${escapeHtml(service)}</dd>
      <dt>${escapeHtml(site.niche.projectFieldLabel)}</dt>
      <dd>${escapeHtml(projectDetails).replace(/\n/g, "<br>")}</dd>
    </dl>
  `;
  const notify = env.LEAD_NOTIFY_EMAIL?.trim();

  try {
    await env.LEAD_EMAIL.send({
      from: { email: site.business.email, name: site.business.name },
      to: env.LEAD_DELIVERY_EMAIL,
      ...(notify && notify !== env.LEAD_DELIVERY_EMAIL ? { bcc: notify } : {}),
      replyTo: email,
      subject: `New ${service} lead from ${name}`,
      text,
      html,
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        message: "LEAD_EMAIL send failed:",
        error: error instanceof Error ? error.message : String(error),
        submission: { ...submitted, projectDetails: "[redacted]" },
      }),
    );
    return redirect(request, "/contact/?error=send#error-send");
  }

  return redirect(request, "/thank-you/");
};
