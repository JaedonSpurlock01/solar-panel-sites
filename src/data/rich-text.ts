import { site } from "@/data/site";

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

export function renderOutboundText(input: string): string {
  const links = new Map((site.outboundLinks ?? []).map((link) => [link.id, link]));

  return escapeHtml(input).replace(/\{\{outbound:([a-z0-9-]+)\}\}/g, (_match, id: string) => {
    const link = links.get(id);
    if (!link || !/^https:\/\//.test(link.href)) return "";

    return `<a class="outbound-link" href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`;
  });
}
