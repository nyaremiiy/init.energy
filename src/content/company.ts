import { productList } from "./products";

// Source: https://init.energy (checked 2026-11-06). Ukrainian only for now.

export type TrustStat = {
  id: "years" | "projects" | "installedPower" | "svitModels";
  value: string;
  label: string;
};

export type TrustArgument = {
  id: string;
  title: string;
  description: string;
};

export type TrustContent = {
  stats: TrustStat[];
  arguments: TrustArgument[];
  // TODO(content): wide photo for the trust block (21:8).
  image?: { src: string; alt: string; width: number; height: number };
};

export const trust: TrustContent = {
  stats: [
    // «INIT ENERGY — напрямок компанії «Інформація і технології», яка понад 30 років працює в енергетиці».
    { id: "years", value: "30+", label: "років досвіду в енергетиці" },
    // «20+ Реалізованих проєктів».
    { id: "projects", value: "20+", label: "реалізованих проєктів" },
    // «1 МВт+ Встановленої потужності».
    { id: "installedPower", value: "1 МВт+", label: "встановленої потужності" },
    {
      id: "svitModels",
      value: String(productList.length),
      label: "моделей SVIT власного виробництва",
    },
  ],
  arguments: [
    {
      id: "manufacturer",
      title: "Виробник, а не перепродавець",
      // TODO(content): підтвердити формулювання про власне виробництво SVIT
      // (на init.energy: «Працюємо тільки з перевіреними світовими виробниками…»).
      description:
        "Накопичувачі SVIT розробляємо й збираємо самі, тому відповідаємо за систему від батареї до запуску.",
    },
    {
      id: "turnkey",
      title: "Під ключ: розрахунок → монтаж → сервіс",
      description:
        "Одна команда рахує споживання, проєктує, монтує й обслуговує систему після запуску.",
    },
    {
      id: "warranty",
      title: "Гарантія і сервіс від виробника",
      // TODO(content): підтвердити умови гарантії (на init.energy лише «Офіційна гарантія на обладнання та роботи»).
      description:
        "Гарантійні питання вирішуємо напряму, без посередників між вами і заводом.",
    },
  ],
};
