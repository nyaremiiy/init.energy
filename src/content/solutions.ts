import type { Locale, Localized } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/messages";
import { formatNumber, formatQuantity } from "@/lib/format";

import { products, type ProductId } from "./products";
import { routes } from "./routes";
import type { SegmentIconId } from "./segments";

export type SolutionLink = {
  label: string;
  /** Key spec shown muted on the right (products only). */
  spec?: string;
  href: string;
};

type ProductRef = { product: ProductId; count?: number };

export type Solution = {
  id: "apartment" | "house" | "business";
  index: string;
  segment: Localized;
  segmentIcon: SegmentIconId;
  title: Localized;
  description: Localized;
  products: ProductRef[];
  capacityProducts: ProductId[];
  image?: {
    src: string;
    alt: Localized;
  };
  /** Backup power pages exist in Ukrainian only. */
  ctaHref: string;
  tone: "light" | "navy" | "dark";
};

export const solutions: Solution[] = [
  {
    id: "apartment",
    index: "01",
    segment: { uk: "Квартира", en: "Apartment" },
    segmentIcon: "apartment",
    title: {
      uk: "Світло й зв'язок під час відключень",
      en: "Light and connectivity during outages",
    },
    description: {
      uk: "Роутер, освітлення, ноутбук і телефони. Працює від розетки, без монтажу.",
      en: "Router, lights, laptop and phones. Plugs into a socket, no installation.",
    },
    products: [{ product: "svit600" }],
    capacityProducts: ["svit600"],
    ctaHref: routes.backup.apartment,
    tone: "light",
  },
  {
    id: "house",
    index: "02",
    segment: { uk: "Приватний будинок", en: "Private house" },
    segmentIcon: "house",
    title: {
      uk: "Весь будинок без перебоїв",
      en: "The whole house without interruptions",
    },
    description: {
      uk: "Котел, насос і холодильник під час відключень, а вдень — власна сонячна енергія.",
      en: "Boiler, pump and fridge during outages, and your own solar energy by day.",
    },
    products: [
      { product: "svitHome" },
      { product: "svitPlus5000" },
      { product: "svitPlus16000" },
    ],
    capacityProducts: ["svitHome", "svitPlus5000", "svitPlus16000"],
    image: {
      src: "/images/cec/home.avif",
      alt: {
        uk: "Сонячні панелі для приватного будинку",
        en: "Solar panels for a private house",
      },
    },
    ctaHref: routes.backup.house,
    tone: "navy",
  },
  {
    id: "business",
    index: "03",
    segment: { uk: "Бізнес", en: "Business" },
    segmentIcon: "business",
    title: {
      uk: "Безперервна робота підприємства",
      en: "Uninterrupted business operations",
    },
    description: {
      uk: "Виробництво, склад, готель чи критичний об'єкт: резерв і генерація під навантаження.",
      en: "Production, warehouses, hotels or critical sites: backup and generation sized to the load.",
    },
    products: [
      { product: "lithiumvalley" },
      { product: "svitPlus5000", count: 16 },
    ],
    capacityProducts: ["lithiumvalley"],
    image: {
      src: "/images/cec/factory.avif",
      alt: {
        uk: "Сонячна електростанція для підприємства",
        en: "Solar power plant for a business",
      },
    },
    ctaHref: routes.backup.business,
    tone: "dark",
  },
];

export function getSolutionLinks(
  solution: Solution,
  locale: Locale,
): SolutionLink[] {
  return solution.products.map((ref) => {
    const product = products[ref.product];
    const total = ref.count
      ? formatQuantity(
          {
            value: Math.floor(product.capacity.value * ref.count),
            unit: product.capacity.unit,
            qualifier: "upTo",
          },
          locale,
        )
      : formatQuantity(product.capacity, locale);

    return {
      label: ref.count ? `${product.name} × ${ref.count}` : product.name,
      spec: total,
      href: product.href,
    };
  });
}

export function getSolutionCapacity(
  solution: Solution,
  locale: Locale,
): string {
  const values = solution.capacityProducts.map(
    (id) => products[id].capacity.value,
  );
  const first = products[solution.capacityProducts[0]].capacity;
  const unit = getMessagesFor(locale).units[first.unit];
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);

  if (solution.id === "apartment") {
    return formatQuantity(first, locale);
  }

  if (solution.id === "business") {
    return `${formatNumber(minimum, locale)}+ ${unit}`;
  }

  return `${formatNumber(Math.round(minimum), locale)}–${formatNumber(Math.round(maximum), locale)} ${unit}`;
}

/* ------------------------------------------------------------------ */
/* Niche solar pages /rishennya/{slug}/ (e.g. hotels). Rendered by     */
/* app/(uk)/rishennya/[segment] and app/en/rishennya/[segment].         */
/* ------------------------------------------------------------------ */

export type NicheIcon =
  | "pool" | "climate" | "water" | "kitchen" | "laundry" | "lighting"
  | "reception" | "security" | "server" | "wifi" | "emergency" | "elevator"
  | "panels" | "inverter" | "mounting" | "cables" | "protection" | "monitoring" | "battery";

export type NicheTone = "white" | "sky" | "surface" | "navy" | "ink";

export type SolutionPage = {
  slug: string;
  /** Parent SES segment page (SILO); not built yet: /cec/dlya-biznesu/. */
  parent: "dlya-biznesu";
  /** Date the facts were last checked (shown on the page). */
  updatedAt: string;
  /** Entries of content/faq.ts shown on the page. */
  faqPage: "ses-hotel";
  serviceType: string;
  meta: { title: Localized; description: Localized };
  breadcrumb: Localized;
  hero: {
    eyebrow: Localized;
    title: Localized;
    lead: Localized;
    primaryCta: Localized;
    secondaryCta: Localized;
    /** Responsive hero photo (AVIF 750 / 1280 / 1920 / 2560); without it a placeholder is shown. */
    image?: { mobile: string; tablet: string; laptop: string; desktop: string; alt: Localized };
    mediaLabel: Localized;
  };
  facts: {
    title: Localized;
    lead: Localized;
    rows: Array<{ label: Localized; value: Localized }>;
    cards: Array<{ value: Localized; label: Localized; tone: NicheTone }>;
  };
  consumers: {
    title: Localized;
    lead: Localized;
    items: Array<{ icon: NicheIcon; name: Localized; text: Localized; tone: NicheTone }>;
  };
  sizing: {
    title: Localized;
    lead: Localized;
    rows: Array<{ type: Localized; rooms: Localized; kwhDay: Localized; kw: Localized; panels: Localized; roof: Localized }>;
    factors: Localized[];
  };
  backup: {
    title: Localized;
    lead: Localized;
    priorities: Array<{ icon: NicheIcon; label: Localized }>;
    modes: Array<{ title: Localized; text: Localized; highlight?: boolean }>;
    products: ProductId[];
  };
  build: {
    title: Localized;
    lead: Localized;
    components: Array<{ icon: NicheIcon; label: Localized }>;
    steps: Array<{ title: Localized; text: Localized }>;
    mediaLabel: Localized;
  };
  /** Projects shown on the page. TODO(content): add a hotel case and a "hotel" project segment. */
  projectSegment: "business";
  faq: { title: Localized; lead: Localized };
  lead: { comment: Localized };
};

/**
 * Facts come from the old init.energy page /rishennya/ses-dlya-gotelyu/
 * (owner's brief, 2026-11-11). Nothing here is invented; doubtful values
 * are marked TODO(content).
 */
export const solutionPages: SolutionPage[] = [
  {
    slug: "ses-dlya-gotelyu",
    parent: "dlya-biznesu",
    updatedAt: "2026-11-11",
    faqPage: "ses-hotel",
    serviceType: "Solar power plant for hotels",
    meta: {
      title: { uk: "СЕС для готелю: потужність, окупність, монтаж", en: "Solar for hotels: system size, payback, installation" },
      description: {
        uk: "СЕС для готелю й комплексу відпочинку на 30–200 кВт: економія на електроенергії 40–70%, резерв під час відключень, монтаж без зупинки роботи.",
        en: "Solar power plants for hotels and resorts, 30–200 kW: 40–70% lower electricity costs, backup during outages, installed without closing the hotel.",
      },
    },
    breadcrumb: { uk: "Для готелю", en: "For hotels" },
    hero: {
      eyebrow: { uk: "СЕС для бізнесу · готелі й комплекси відпочинку", en: "Solar for business · hotels and resorts" },
      title: { uk: "Сонячна електростанція\nдля готелю", en: "Solar power plant\nfor your hotel" },
      lead: {
        uk: "СЕС на даху готелю чи комплексу відпочинку зменшує витрати на електроенергію на 40–70% і тримає рецепцію, Wi-Fi, ліфти й освітлення під час відключень. INIT ENERGY проєктує, монтує й запускає станцію без зупинки роботи готелю.",
        en: "A rooftop solar plant cuts electricity costs for a hotel or resort by 40–70% and keeps reception, Wi-Fi, lifts and lighting running through outages. INIT ENERGY designs, installs and commissions it while the hotel stays open.",
      },
      primaryCta: { uk: "Розрахувати СЕС для готелю", en: "Size a plant for your hotel" },
      secondaryCta: { uk: "Залишити заявку", en: "Send a request" },
      image: {
        mobile: "/images/cec/rishennya/hotel/01-750.avif",
        tablet: "/images/cec/rishennya/hotel/01-1280.avif",
        laptop: "/images/cec/rishennya/hotel/01-1920.avif",
        desktop: "/images/cec/rishennya/hotel/01-2560.avif",
        alt: {
          uk: "Гірський готель із сонячними панелями на даху",
          en: "Mountain hotel with solar panels on the roof",
        },
      },
      mediaLabel: { uk: "Фото СЕС на даху готелю — буде додано", en: "Photo of a hotel rooftop plant — coming soon" },
    },
    facts: {
      title: { uk: "СЕС для готелю в цифрах", en: "Hotel solar in numbers" },
      lead: {
        uk: "Готелю зазвичай потрібна СЕС на 30–200 кВт. Вона зменшує витрати на електроенергію на 40–70%, а в готелях з рестораном, кондиціонерами, пральнею чи SPA на місці використовується 70–90% генерації.",
        en: "A hotel usually needs a 30–200 kW solar plant. It lowers electricity costs by 40–70%, and hotels with a restaurant, air conditioning, a laundry or a spa use 70–90% of the output on site.",
      },
      rows: [
        { label: { uk: "Типова потужність", en: "Typical capacity" }, value: { uk: "30–200 кВт", en: "30–200 kW" } },
        // TODO(content): the old page gives 450–550 m² in one place and 500–550 m² in another; verify.
        { label: { uk: "Площа даху на 100 кВт", en: "Roof area per 100 kW" }, value: { uk: "450–550 м²", en: "450–550 m²" } },
        { label: { uk: "Економія на електроенергії", en: "Electricity savings" }, value: { uk: "40–70%", en: "40–70%" } },
        // TODO(content): verify; payback depends on the tariff and the system price.
        { label: { uk: "Окупність", en: "Payback" }, value: { uk: "3–5 років", en: "3–5 years" } },
        { label: { uk: "Тип системи", en: "System type" }, value: { uk: "мережева або гібридна", en: "grid-tied or hybrid" } },
        { label: { uk: "Строк служби панелей", en: "Panel service life" }, value: { uk: "понад 25 років", en: "25+ years" } },
        { label: { uk: "Монтаж", en: "Installation" }, value: { uk: "2–4 тижні", en: "2–4 weeks" } },
      ],
      cards: [
        { value: { uk: "30–200 кВт", en: "30–200 kW" }, label: { uk: "типова потужність СЕС для готелю", en: "typical solar capacity for a hotel" }, tone: "sky" },
        { value: { uk: "40–70%", en: "40–70%" }, label: { uk: "економія на рахунках за електроенергію", en: "lower electricity bills" }, tone: "surface" },
        { value: { uk: "70–90%", en: "70–90%" }, label: { uk: "генерації використовується на місці в готелях з рестораном, кондиціонерами, пральнею чи SPA", en: "of the output used on site in hotels with a restaurant, AC, laundry or spa" }, tone: "navy" },
        { value: { uk: "2–4 тижні", en: "2–4 weeks" }, label: { uk: "монтаж без зупинки роботи готелю", en: "installation while the hotel stays open" }, tone: "ink" },
      ],
    },
    consumers: {
      title: { uk: "Куди йде енергія в готелі", en: "Where a hotel’s energy goes" },
      lead: {
        uk: "Найбільше електроенергії в готелі забирають басейн і SPA, клімат, вода, кухня, пральня й освітлення. Значна частина цих навантажень припадає на день — коли станція виробляє найбільше.",
        en: "Pools and spas, climate control, hot water, the kitchen, the laundry and lighting draw most of a hotel’s power. Much of that load falls in daytime, when the plant produces the most.",
      },
      items: [
        { icon: "pool", name: { uk: "Басейн і SPA", en: "Pool and spa" }, text: { uk: "Насоси, підігрів і фільтрація води працюють цілий день.", en: "Pumps, heating and water filtration run all day." }, tone: "white" },
        { icon: "climate", name: { uk: "Кондиціонування й вентиляція", en: "Air conditioning and ventilation" }, text: { uk: "Найбільше навантаження влітку — у години найвищої генерації.", en: "The peak load comes in summer, during the hours of highest generation." }, tone: "sky" },
        { icon: "water", name: { uk: "Водопостачання", en: "Water supply" }, text: { uk: "Насоси й бойлери гарячої води для номерів і кухні.", en: "Pumps and hot-water boilers for rooms and the kitchen." }, tone: "navy" },
        { icon: "kitchen", name: { uk: "Кухня й ресторан", en: "Kitchen and restaurant" }, text: { uk: "Плити, холодильні камери, посудомийні машини.", en: "Cookers, cold rooms and dishwashers." }, tone: "white" },
        { icon: "laundry", name: { uk: "Пральня", en: "Laundry" }, text: { uk: "Пральні й сушильні машини — переважно вдень.", en: "Washers and dryers, mostly in daytime." }, tone: "ink" },
        { icon: "lighting", name: { uk: "Освітлення", en: "Lighting" }, text: { uk: "Номери, коридори, фасад і територія.", en: "Rooms, corridors, the facade and the grounds." }, tone: "white" },
      ],
    },
    sizing: {
      title: { uk: "Яка СЕС потрібна вашому готелю", en: "What size plant your hotel needs" },
      lead: {
        uk: "Потужність залежить від кількості номерів, добового споживання й площі даху. Таблиця дає орієнтир для типових об’єктів; точну потужність визначаємо за річним споживанням.",
        en: "Capacity depends on the number of rooms, daily consumption and roof area. The table gives a guide for typical properties; we set the exact size from annual consumption.",
      },
      // TODO(content): 100 kW roof area — 450–550 m² vs 500–550 m² on the old page; verify.
      rows: [
        { type: { uk: "Малий готель", en: "Small hotel" }, rooms: { uk: "20–30", en: "20–30" }, kwhDay: { uk: "80–120", en: "80–120" }, kw: { uk: "30–40", en: "30–40" }, panels: { uk: "≈ 55 (30 кВт)", en: "≈ 55 (30 kW)" }, roof: { uk: "160–180", en: "160–180" } },
        { type: { uk: "Середній готель", en: "Mid-size hotel" }, rooms: { uk: "40–60", en: "40–60" }, kwhDay: { uk: "150–300", en: "150–300" }, kw: { uk: "50–100", en: "50–100" }, panels: { uk: "≈ 90 (50 кВт)", en: "≈ 90 (50 kW)" }, roof: { uk: "250–300", en: "250–300" } },
        { type: { uk: "Комплекс відпочинку", en: "Resort" }, rooms: { uk: "80+", en: "80+" }, kwhDay: { uk: "400–800", en: "400–800" }, kw: { uk: "100–300", en: "100–300" }, panels: { uk: "≈ 180 (100 кВт)", en: "≈ 180 (100 kW)" }, roof: { uk: "500–550", en: "500–550" } },
      ],
      factors: [
        { uk: "Орієнтація даху", en: "Roof orientation" },
        { uk: "Кут нахилу", en: "Tilt angle" },
        { uk: "Затінення", en: "Shading" },
        { uk: "Профіль споживання", en: "Consumption profile" },
        { uk: "Сезонність", en: "Seasonality" },
      ],
    },
    backup: {
      title: { uk: "Готель працює й під час відключень", en: "The hotel keeps running through outages" },
      lead: {
        uk: "Гібридна СЕС з накопичувачем автоматично тримає критичні системи готелю, коли зникає мережа. Мережева СЕС під час відключення вимикається.",
        en: "A hybrid plant with storage automatically keeps the hotel’s critical systems running when the grid goes down. A grid-tied plant switches off during an outage.",
      },
      priorities: [
        { icon: "reception", label: { uk: "Рецепція", en: "Reception" } },
        { icon: "security", label: { uk: "Системи безпеки", en: "Security systems" } },
        { icon: "server", label: { uk: "Серверне обладнання", en: "Servers" } },
        { icon: "wifi", label: { uk: "Wi-Fi", en: "Wi-Fi" } },
        { icon: "emergency", label: { uk: "Аварійне освітлення", en: "Emergency lighting" } },
        { icon: "elevator", label: { uk: "Ліфти", en: "Lifts" } },
      ],
      modes: [
        { title: { uk: "Власне споживання", en: "Self-consumption" }, text: { uk: "Уся генерація йде на потреби готелю вдень.", en: "All the output covers the hotel’s daytime needs." } },
        { title: { uk: "Net billing", en: "Net billing" }, text: { uk: "Надлишок віддається в мережу й зараховується в рахунок.", en: "Surplus goes to the grid and is credited to the bill." } },
        { title: { uk: "Гібридний", en: "Hybrid" }, text: { uk: "Під час відключення готель автоматично переходить на накопичувач.", en: "During an outage the hotel switches to the battery automatically." }, highlight: true },
      ],
      products: ["svitPlus16000", "lithiumvalley"],
    },
    build: {
      title: { uk: "Що входить у СЕС і як ми її будуємо", en: "What’s in the plant and how we build it" },
      lead: {
        uk: "Станція складається зі стандартних вузлів. Монтаж триває 2–4 тижні й іде без зупинки роботи готелю.",
        en: "The plant is made of standard components. Installation takes 2–4 weeks while the hotel stays open.",
      },
      components: [
        { icon: "panels", label: { uk: "Сонячні панелі", en: "Solar panels" } },
        { icon: "inverter", label: { uk: "Інвертор мережевий або гібридний", en: "Grid-tied or hybrid inverter" } },
        { icon: "mounting", label: { uk: "Монтажні конструкції", en: "Mounting structures" } },
        { icon: "cables", label: { uk: "Кабельні лінії", en: "Cabling" } },
        { icon: "protection", label: { uk: "Захисна автоматика", en: "Protection devices" } },
        { icon: "monitoring", label: { uk: "Система моніторингу", en: "Monitoring system" } },
        { icon: "battery", label: { uk: "Накопичувач — за потреби", en: "Battery storage, if needed" } },
      ],
      steps: [
        { title: { uk: "Аналіз споживання", en: "Consumption analysis" }, text: { uk: "Дивимося, скільки й коли готель споживає енергії.", en: "We look at how much power the hotel uses and when." } },
        { title: { uk: "Проєкт", en: "Design" }, text: { uk: "Потужність, обладнання, схема підключення.", en: "Capacity, equipment and the connection scheme." } },
        { title: { uk: "Монтаж", en: "Installation" }, text: { uk: "Без зупинки роботи готелю.", en: "While the hotel stays open." } },
        { title: { uk: "Запуск і підключення", en: "Commissioning" }, text: { uk: "Запуск станції й підключення до мережі.", en: "Start-up and grid connection." } },
      ],
      mediaLabel: { uk: "Фото СЕС на даху готелю — буде додано", en: "Photo of a hotel rooftop plant — coming soon" },
    },
    projectSegment: "business",
    faq: {
      title: { uk: "Питання про СЕС для готелю", en: "Hotel solar questions" },
      lead: { uk: "Про потужність, площу даху, окупність і роботу під час відключень.", en: "About capacity, roof area, payback and running through outages." },
    },
    lead: {
      comment: { uk: "Кількість номерів, є басейн чи SPA, площа даху", en: "Number of rooms, pool or spa, roof area" },
    },
  },
];

export function solutionPageBySlug(slug: string): SolutionPage | undefined {
  return solutionPages.find((page) => page.slug === slug);
}
