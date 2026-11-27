import { companyContacts, mainPhone, offices, serviceArea } from "@/content/company";
import { faqForPage } from "@/content/faq";
import { backupRegionPath, regionPath, regionsByLocale } from "@/content/insolation";
import { productList, productSummary } from "@/content/products";
import { routes, slugs, toPath } from "@/content/routes";
import { solutionPages } from "@/content/solutions";
import { localizePath } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";
import { formatNumber, formatPhone } from "@/lib/format";
import { regionStats } from "@/lib/region-stats";
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
  // One line per region page: the yearly output of a 5 kW plant there.
  const regionLines = (locale: "uk" | "en") =>
    regionsByLocale(locale).map((region) =>
      link(
        region.name[locale],
        localizePath(regionPath(region), locale),
        locale === "uk"
          ? `станція 5 кВт ≈ ${formatNumber(regionStats(region).year, "uk")} кВт·год на рік`
          : `a 5 kW plant ≈ ${formatNumber(regionStats(region).year, "en")} kWh a year`,
      ),
    );

  // Backup power by region: the towns we work in and the office, if there is one in the region.
  const backupRegionLines = (locale: "uk" | "en") =>
    regionsByLocale(locale).map((region) => {
      const office = offices.find((item) => item.id === region.office);
      const towns = region.cities.slice(0, 3).map((town) => town[locale]).join(", ");
      const note = locale === "uk" ? `${towns}${office ? `; офіс: ${office.address.uk}` : ""}` : `${towns}${office ? `; office: ${office.address.en}` : ""}`;
      return link(`${locale === "uk" ? "Резервне живлення" : "Backup power"} — ${region.name[locale]}`, localizePath(backupRegionPath(region), locale), note);
    });
  // Where to go during outages (stable wording, no daily schedules).
  const outageLines = (locale: "uk" | "en") => {
    const t = getMessagesFor(locale).meta.llmsOutages;
    return [
      t.intro,
      "",
      link(t.apartment, localizePath(routes.products.svit600, locale), t.apartmentNote),
      link(t.house, localizePath(routes.products.svitHome, locale), t.houseNote),
      link(t.business, localizePath(routes.products.lithiumvalley, locale), t.businessNote),
      link(t.solar, localizePath(routes.services.turnkeySes, locale), t.solarNote),
      link(t.hub, localizePath(routes.backup.hub, locale), t.hubNote),
    ];
  };

  const lines = [
    "# INIT ENERGY",
    "",
    `> ${uk.meta.organizationDescription}`,
    `> ${en.meta.organizationDescription}`,
    "",
    `Регіон роботи: ${serviceArea.uk}. Офіси: ${offices.map((office) => [office.city.uk, office.address.uk, office.phone ? formatPhone(office.phone.display) : null].filter(Boolean).join(", ")).join("; ")}. Телефон: ${formatPhone(mainPhone.display)}. Email: ${companyContacts.email.display}.`,
    "",
    "## Основні сторінки",
    "",
    link(uk.meta.homeTitle, routes.home, uk.meta.homeDescription),
    link(uk.ses.meta.title, routes.services.turnkeySes, uk.ses.meta.description),
    link(uk.backup.meta.title, routes.backup.hub, uk.backup.meta.description),
    link(uk.sesPayback.meta.title, routes.calculators.sesPayback, uk.sesPayback.meta.description),
    ...solutionPages.map((page) => link(page.meta.title.uk, toPath(slugs.solutions.hub, page.slug), page.meta.description.uk)),
    "",
    "## Відключення світла: яка сторінка під яку задачу",
    "",
    ...outageLines("uk"),
    "",
    "## Сонячні панелі по областях",
    "",
    ...regionLines("uk"),
    "",
    "## Резервне живлення по областях",
    "",
    ...backupRegionLines("uk"),
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
    link(en.backup.meta.title, localizePath(routes.backup.hub, "en"), en.backup.meta.description),
    link(en.sesPayback.meta.title, localizePath(routes.calculators.sesPayback, "en"), en.sesPayback.meta.description),
    ...solutionPages.map((page) => link(page.meta.title.en, localizePath(toPath(slugs.solutions.hub, page.slug), "en"), page.meta.description.en)),
    ...productList.map((product) => link(product.name, localizePath(product.href, "en"), productSummary(product.id, "en"))),
    "",
    "### Power outages: which page for which task",
    "",
    ...outageLines("en"),
    "",
    "### Solar panels by region",
    "",
    ...regionLines("en"),
    "",
    "### Backup power by region",
    "",
    ...backupRegionLines("en"),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
