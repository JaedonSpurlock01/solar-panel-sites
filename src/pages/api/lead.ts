import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { site, services } from "@/data/site";

export const prerender = false;

const redirect = (request: Request, path: string) =>
  Response.redirect(new URL(path, request.url), 303);

const value = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

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
      ? Number.isFinite(Number(projectDetails)) && Number(projectDetails) > 0
      : site.niche.projectFieldType === "select"
        ? Boolean(site.niche.projectFieldOptions?.includes(projectDetails))
        : projectDetails.length >= 1;

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

  // Tracer stores the submission under this Site's Workspace, forwards it to the business
  // from this Site's address, and counts it as a lead. Every Site shares one Forms key and
  // names itself by hostname.
  const formsUrl = env.TRACER_FORMS_URL?.trim();
  const formKey = env.TRACER_FORM_KEY?.trim();
  if (!formsUrl || !formKey) {
    return redirect(request, "/contact/?error=config#error-config");
  }

  const submission = {
    site: site.business.domain,
    submissionId: crypto.randomUUID(),
    page: new URL(request.headers.get("referer") ?? "/contact/", request.url).pathname,
    fields: {
      Name: name,
      Phone: phone,
      Email: email,
      Service: service,
      [site.niche.projectFieldLabel]: projectDetails,
    },
  };

  try {
    const response = await fetch(formsUrl, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${formKey}` },
      body: JSON.stringify(submission),
    });
    if (!response.ok) {
      console.error(JSON.stringify({ message: "Tracer refused the lead", status: response.status, body: await response.text().catch(() => "") }));
      return redirect(request, "/contact/?error=send#error-send");
    }
  } catch (error) {
    console.error(JSON.stringify({ message: "Tracer lead post failed", error: error instanceof Error ? error.message : String(error) }));
    return redirect(request, "/contact/?error=send#error-send");
  }

  return redirect(request, "/thank-you/");
};
