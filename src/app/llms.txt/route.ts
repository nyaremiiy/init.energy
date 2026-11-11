import { companyContacts, offices, serviceArea } from "@/content/company";
import { faqForPage } from "@/content/faq";
import { productList, productSummary } from "@/content/products";
import { routes, slugs, toPath } from "@/content/routes";
import { solutionPages } from "@/content/solutions";
import { localizePath } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";
import { formatPhone } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo/metadata";

/** Built once at build time from the same content as the pages. */
export const dynamic = "force-static";

/**
 * /llms.txt — a short Markdown brief for AI assistants and answer engines
 * (GEO): who INIT ENERGY is, the main pages and the answers to common
 * questions. Everything comes from content/ and messages/, so it never
 * drifts from the site.
 */
export function GET() {
  const uk = getMessagesFor("uk");
  const en = getMessagesFor("en");
  const link = (title: string, path: string, note: string) => `- [${title}](${absoluteUrl(path)}): ${note}`;

  const lines = [
    "# INIT ENERGY",
    "",
    `> ${uk.meta.organizationDescription}`,
    `> ${en.meta.organizationDescription}`,
    "",
    `Регіон роботи: ${serviceArea.uk}. Офіси: ${offices.map((office) => `${office.city.uk}, ${office.address.uk}, ${formatPhone(office.phone.display)}`).join("; ")}. Email: ${companyContacts.email.display}.`,
    "",
    "## Основні сторінки",
    "",
    link(uk.meta.homeTitle, routes.home, uk.meta.homeDescription),
    link(uk.ses.meta.title, routes.services.turnkeySes, uk.ses.meta.description),
    link(uk.sesPayback.meta.title, routes.calculators.sesPayback, uk.sesPayback.meta.description),
    ...solutionPages.map((page) => link(page.meta.title.uk, toPath(slugs.solutions.hub, page.slug), page.meta.description.uk)),
    "",
    "## Накопичувачі",
    "",
    ...productList.map((product) => link(product.name, product.href, productSummary(product.id, "uk"))),
    "",
    "## Часті питання",
    "",
    ...faqForPage("home").flatMap((faq) => [`### ${faq.question.uk}`, "", faq.answer.uk, ""]),
    "## English",
    "",
    link(en.meta.homeTitle, localizePath(routes.home, "en"), en.meta.homeDescription),
    link(en.ses.meta.title, localizePath(routes.services.turnkeySes, "en"), en.ses.meta.description),
    link(en.sesPayback.meta.title, localizePath(routes.calculators.sesPayback, "en"), en.sesPayback.meta.description),
    ...solutionPages.map((page) => link(page.meta.title.en, localizePath(toPath(slugs.solutions.hub, page.slug), "en"), page.meta.description.en)),
    ...productList.map((product) => link(product.name, localizePath(product.href, "en"), productSummary(product.id, "en"))),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
