import type { Locale, Localized } from "@/i18n/config";

/**
 * Solar yield by region — one list for both calculators, the region pages
 * (/cec/{slug}/) and the map on /cec/. kWh a year from 1 kWp of panels
 * (PVGIS via solarprom.com.ua unless marked otherwise).
 */
export const updatedAt = "2026-11-20" as const;

/** Share of the annual yield per month, January first. */
export const monthlyShare = [0.0339, 0.0416, 0.0709, 0.0986, 0.1279, 0.1443, 0.1433, 0.1279, 0.0863, 0.0591, 0.0365, 0.0297] as const;

export type InsolationRegion = {
  id: string;
  /** Location id in content/ukraine-map.ts. */
  mapId: string;
  /** Page slug: /cec/{slug}/ and /en/cec/{slug}/ (English mirrors the Ukrainian path, as everywhere on the site). */
  slug: string;
  /** «Львівська область», «м. Київ». */
  name: Localized;
  /** Pills and the map: «Львівська», «м. Київ», «АР Крим». */
  shortName: Localized;
  /** «у Львівській області». */
  locative: Localized;
  center: Localized;
  /** «у Львові». */
  centerLocative: Localized;
  h1: Localized;
  /** kWh a year from 1 kWp. */
  yield: number;
  /** Not from PVGIS yet: shown as an estimate. */
  yieldEstimate?: true;
  /** Cities shown on the region page, the centre first (Kyiv: districts). */
  cities: Localized[];
  /** Office in this region (id in content/company.ts). */
  office?: "lviv" | "kyiv";
  /** Temporarily occupied or front-line: neutral wording, no «we install here». */
  serviceNote?: "occupied";
  /** schema.org type of the area; AdministrativeArea by default. */
  areaType?: "City";
};

export const insolationRegions: InsolationRegion[] = [
  {
    id: "vinnytska",
    mapId: "vinnytsia",
    slug: "vinnytska-oblast",
    name: { uk: "Вінницька область", en: "Vinnytsia Oblast" },
    shortName: { uk: "Вінницька", en: "Vinnytsia" },
    locative: { uk: "у Вінницькій області", en: "in Vinnytsia Oblast" },
    center: { uk: "Вінниця", en: "Vinnytsia" },
    centerLocative: { uk: "у Вінниці", en: "in Vinnytsia" },
    h1: { uk: "Сонячні панелі у Вінниці та Вінницькій області", en: "Solar panels in Vinnytsia and Vinnytsia Oblast" },
    yield: 1160,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Вінниця", en: "Vinnytsia" },
      { uk: "Жмеринка", en: "Zhmerynka" },
      { uk: "Могилів-Подільський", en: "Mohyliv-Podilskyi" },
      { uk: "Козятин", en: "Koziatyn" },
      { uk: "Хмільник", en: "Khmilnyk" },
      { uk: "Гайсин", en: "Haisyn" },
      { uk: "Ладижин", en: "Ladyzhyn" },
      { uk: "Бар", en: "Bar" },
      { uk: "Калинівка", en: "Kalynivka" },
      { uk: "Тульчин", en: "Tulchyn" },
    ],
  },
  {
    id: "volynska",
    mapId: "volyn",
    slug: "volynska-oblast",
    name: { uk: "Волинська область", en: "Volyn Oblast" },
    shortName: { uk: "Волинська", en: "Volyn" },
    locative: { uk: "у Волинській області", en: "in Volyn Oblast" },
    center: { uk: "Луцьк", en: "Lutsk" },
    centerLocative: { uk: "у Луцьку", en: "in Lutsk" },
    h1: { uk: "Сонячні панелі у Луцьку та Волинській області", en: "Solar panels in Lutsk and Volyn Oblast" },
    yield: 1050,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Луцьк", en: "Lutsk" },
      { uk: "Ковель", en: "Kovel" },
      { uk: "Нововолинськ", en: "Novovolynsk" },
      { uk: "Володимир", en: "Volodymyr" },
      { uk: "Ківерці", en: "Kivertsi" },
      { uk: "Любомль", en: "Liuboml" },
      { uk: "Камінь-Каширський", en: "Kamin-Kashyrskyi" },
    ],
  },
  {
    id: "dnipropetrovska",
    mapId: "dnipropetrovsk",
    slug: "dnipropetrovska-oblast",
    name: { uk: "Дніпропетровська область", en: "Dnipropetrovsk Oblast" },
    shortName: { uk: "Дніпропетровська", en: "Dnipropetrovsk" },
    locative: { uk: "у Дніпропетровській області", en: "in Dnipropetrovsk Oblast" },
    center: { uk: "Дніпро", en: "Dnipro" },
    centerLocative: { uk: "у Дніпрі", en: "in Dnipro" },
    h1: { uk: "Сонячні панелі у Дніпрі та Дніпропетровській області", en: "Solar panels in Dnipro and Dnipropetrovsk Oblast" },
    yield: 1270,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Дніпро", en: "Dnipro" },
      { uk: "Кривий Ріг", en: "Kryvyi Rih" },
      { uk: "Кам’янське", en: "Kamianske" },
      { uk: "Нікополь", en: "Nikopol" },
      { uk: "Павлоград", en: "Pavlohrad" },
      { uk: "Самар", en: "Samar" },
      { uk: "Марганець", en: "Marhanets" },
      { uk: "Жовті Води", en: "Zhovti Vody" },
      { uk: "Покров", en: "Pokrov" },
      { uk: "Синельникове", en: "Synelnykove" },
    ],
  },
  {
    id: "donetska",
    mapId: "donetsk",
    slug: "donetska-oblast",
    name: { uk: "Донецька область", en: "Donetsk Oblast" },
    shortName: { uk: "Донецька", en: "Donetsk" },
    locative: { uk: "у Донецькій області", en: "in Donetsk Oblast" },
    center: { uk: "Краматорськ", en: "Kramatorsk" },
    centerLocative: { uk: "у Краматорську", en: "in Kramatorsk" },
    h1: { uk: "Сонячні панелі у Краматорську та Донецькій області", en: "Solar panels in Kramatorsk and Donetsk Oblast" },
    // TODO(content): перевірити в PVGIS — оцінка з колишнього content/calculator.ts.
    yield: 1230,
    yieldEstimate: true,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Краматорськ", en: "Kramatorsk" },
      { uk: "Слов’янськ", en: "Sloviansk" },
      { uk: "Дружківка", en: "Druzhkivka" },
      { uk: "Костянтинівка", en: "Kostiantynivka" },
      { uk: "Покровськ", en: "Pokrovsk" },
      { uk: "Бахмут", en: "Bakhmut" },
      { uk: "Маріуполь", en: "Mariupol" },
      { uk: "Донецьк", en: "Donetsk" },
    ],
    serviceNote: "occupied",
  },
  {
    id: "zhytomyrska",
    mapId: "zhytomyr",
    slug: "zhytomyrska-oblast",
    name: { uk: "Житомирська область", en: "Zhytomyr Oblast" },
    shortName: { uk: "Житомирська", en: "Zhytomyr" },
    locative: { uk: "у Житомирській області", en: "in Zhytomyr Oblast" },
    center: { uk: "Житомир", en: "Zhytomyr" },
    centerLocative: { uk: "у Житомирі", en: "in Zhytomyr" },
    h1: { uk: "Сонячні панелі у Житомирі та Житомирській області", en: "Solar panels in Zhytomyr and Zhytomyr Oblast" },
    yield: 1085,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Житомир", en: "Zhytomyr" },
      { uk: "Бердичів", en: "Berdychiv" },
      { uk: "Коростень", en: "Korosten" },
      { uk: "Звягель", en: "Zviahel" },
      { uk: "Малин", en: "Malyn" },
      { uk: "Коростишів", en: "Korostyshiv" },
      { uk: "Овруч", en: "Ovruch" },
    ],
  },
  {
    id: "zakarpatska",
    mapId: "zakarpattia",
    slug: "zakarpatska-oblast",
    name: { uk: "Закарпатська область", en: "Zakarpattia Oblast" },
    shortName: { uk: "Закарпатська", en: "Zakarpattia" },
    locative: { uk: "у Закарпатській області", en: "in Zakarpattia Oblast" },
    center: { uk: "Ужгород", en: "Uzhhorod" },
    centerLocative: { uk: "в Ужгороді", en: "in Uzhhorod" },
    h1: { uk: "Сонячні панелі в Ужгороді та Закарпатській області", en: "Solar panels in Uzhhorod and Zakarpattia Oblast" },
    yield: 1125,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Ужгород", en: "Uzhhorod" },
      { uk: "Мукачево", en: "Mukachevo" },
      { uk: "Хуст", en: "Khust" },
      { uk: "Берегове", en: "Berehove" },
      { uk: "Виноградів", en: "Vynohradiv" },
      { uk: "Свалява", en: "Svaliava" },
      { uk: "Рахів", en: "Rakhiv" },
    ],
  },
  {
    id: "zaporizka",
    mapId: "zaporizhia",
    slug: "zaporizka-oblast",
    name: { uk: "Запорізька область", en: "Zaporizhzhia Oblast" },
    shortName: { uk: "Запорізька", en: "Zaporizhzhia" },
    locative: { uk: "у Запорізькій області", en: "in Zaporizhzhia Oblast" },
    center: { uk: "Запоріжжя", en: "Zaporizhzhia" },
    centerLocative: { uk: "у Запоріжжі", en: "in Zaporizhzhia" },
    h1: { uk: "Сонячні панелі у Запоріжжі та Запорізькій області", en: "Solar panels in Zaporizhzhia and Zaporizhzhia Oblast" },
    yield: 1340,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Запоріжжя", en: "Zaporizhzhia" },
      { uk: "Мелітополь", en: "Melitopol" },
      { uk: "Бердянськ", en: "Berdiansk" },
      { uk: "Енергодар", en: "Enerhodar" },
      { uk: "Токмак", en: "Tokmak" },
      { uk: "Пологи", en: "Polohy" },
      { uk: "Оріхів", en: "Orikhiv" },
    ],
  },
  {
    id: "ivano-frankivska",
    mapId: "ivano-frankivsk",
    slug: "ivano-frankivska-oblast",
    name: { uk: "Івано-Франківська область", en: "Ivano-Frankivsk Oblast" },
    shortName: { uk: "Івано-Франківська", en: "Ivano-Frankivsk" },
    locative: { uk: "в Івано-Франківській області", en: "in Ivano-Frankivsk Oblast" },
    center: { uk: "Івано-Франківськ", en: "Ivano-Frankivsk" },
    centerLocative: { uk: "в Івано-Франківську", en: "in Ivano-Frankivsk" },
    h1: { uk: "Сонячні панелі в Івано-Франківську та Івано-Франківській області", en: "Solar panels in Ivano-Frankivsk and Ivano-Frankivsk Oblast" },
    yield: 1090,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Івано-Франківськ", en: "Ivano-Frankivsk" },
      { uk: "Калуш", en: "Kalush" },
      { uk: "Коломия", en: "Kolomyia" },
      { uk: "Надвірна", en: "Nadvirna" },
      { uk: "Долина", en: "Dolyna" },
      { uk: "Бурштин", en: "Burshtyn" },
      { uk: "Яремче", en: "Yaremche" },
      { uk: "Болехів", en: "Bolekhiv" },
    ],
  },
  {
    id: "kyivska",
    mapId: "kyiv",
    slug: "kyivska-oblast",
    name: { uk: "Київська область", en: "Kyiv Oblast" },
    shortName: { uk: "Київська", en: "Kyiv" },
    locative: { uk: "у Київській області", en: "in Kyiv Oblast" },
    center: { uk: "Біла Церква", en: "Bila Tserkva" },
    centerLocative: { uk: "у Білій Церкві", en: "in Bila Tserkva" },
    h1: { uk: "Сонячні панелі в Київській області", en: "Solar panels in Kyiv Oblast" },
    yield: 1120,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Біла Церква", en: "Bila Tserkva" },
      { uk: "Бровари", en: "Brovary" },
      { uk: "Бориспіль", en: "Boryspil" },
      { uk: "Ірпінь", en: "Irpin" },
      { uk: "Буча", en: "Bucha" },
      { uk: "Фастів", en: "Fastiv" },
      { uk: "Обухів", en: "Obukhiv" },
      { uk: "Васильків", en: "Vasylkiv" },
      { uk: "Вишгород", en: "Vyshhorod" },
      { uk: "Боярка", en: "Boiarka" },
      { uk: "Славутич", en: "Slavutych" },
    ],
  },
  {
    id: "kyiv",
    mapId: "kyiv-city",
    slug: "kyiv",
    name: { uk: "м. Київ", en: "Kyiv" },
    shortName: { uk: "м. Київ", en: "Kyiv City" },
    locative: { uk: "у Києві", en: "in Kyiv" },
    center: { uk: "Київ", en: "Kyiv" },
    centerLocative: { uk: "у Києві", en: "in Kyiv" },
    h1: { uk: "Сонячні панелі у Києві", en: "Solar panels in Kyiv" },
    // Місто: те саме значення, що для Київської області.
    yield: 1120,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Голосіївський", en: "Holosiivskyi" },
      { uk: "Дарницький", en: "Darnytskyi" },
      { uk: "Деснянський", en: "Desnianskyi" },
      { uk: "Дніпровський", en: "Dniprovskyi" },
      { uk: "Оболонський", en: "Obolonskyi" },
      { uk: "Печерський", en: "Pecherskyi" },
      { uk: "Подільський", en: "Podilskyi" },
      { uk: "Святошинський", en: "Sviatoshynskyi" },
      { uk: "Солом’янський", en: "Solomianskyi" },
      { uk: "Шевченківський", en: "Shevchenkivskyi" },
    ],
    office: "kyiv",
    areaType: "City",
  },
  {
    id: "kirovohradska",
    mapId: "kirovohrad",
    slug: "kirovohradska-oblast",
    name: { uk: "Кіровоградська область", en: "Kirovohrad Oblast" },
    shortName: { uk: "Кіровоградська", en: "Kirovohrad" },
    locative: { uk: "у Кіровоградській області", en: "in Kirovohrad Oblast" },
    center: { uk: "Кропивницький", en: "Kropyvnytskyi" },
    centerLocative: { uk: "у Кропивницькому", en: "in Kropyvnytskyi" },
    h1: { uk: "Сонячні панелі у Кропивницькому та Кіровоградській області", en: "Solar panels in Kropyvnytskyi and Kirovohrad Oblast" },
    yield: 1240,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Кропивницький", en: "Kropyvnytskyi" },
      { uk: "Олександрія", en: "Oleksandriia" },
      { uk: "Світловодськ", en: "Svitlovodsk" },
      { uk: "Знам’янка", en: "Znamianka" },
      { uk: "Долинська", en: "Dolynska" },
      { uk: "Новоукраїнка", en: "Novoukrainka" },
    ],
  },
  {
    id: "luhanska",
    mapId: "luhansk",
    slug: "luhanska-oblast",
    name: { uk: "Луганська область", en: "Luhansk Oblast" },
    shortName: { uk: "Луганська", en: "Luhansk" },
    locative: { uk: "у Луганській області", en: "in Luhansk Oblast" },
    center: { uk: "Сєвєродонецьк", en: "Sievierodonetsk" },
    centerLocative: { uk: "у Сєвєродонецьку", en: "in Sievierodonetsk" },
    h1: { uk: "Сонячні панелі у Сєвєродонецьку та Луганській області", en: "Solar panels in Sievierodonetsk and Luhansk Oblast" },
    // TODO(content): перевірити в PVGIS — оцінка з колишнього content/calculator.ts.
    yield: 1200,
    yieldEstimate: true,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Сєвєродонецьк", en: "Sievierodonetsk" },
      { uk: "Лисичанськ", en: "Lysychansk" },
      { uk: "Луганськ", en: "Luhansk" },
      { uk: "Алчевськ", en: "Alchevsk" },
      { uk: "Рубіжне", en: "Rubizhne" },
      { uk: "Кремінна", en: "Kreminna" },
      { uk: "Старобільськ", en: "Starobilsk" },
    ],
    serviceNote: "occupied",
  },
  {
    id: "lvivska",
    mapId: "lviv",
    slug: "lvivska-oblast",
    name: { uk: "Львівська область", en: "Lviv Oblast" },
    shortName: { uk: "Львівська", en: "Lviv" },
    locative: { uk: "у Львівській області", en: "in Lviv Oblast" },
    center: { uk: "Львів", en: "Lviv" },
    centerLocative: { uk: "у Львові", en: "in Lviv" },
    h1: { uk: "Сонячні панелі у Львові та Львівській області", en: "Solar panels in Lviv and Lviv Oblast" },
    yield: 1080,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Львів", en: "Lviv" },
      { uk: "Дрогобич", en: "Drohobych" },
      { uk: "Шептицький", en: "Sheptytskyi" },
      { uk: "Стрий", en: "Stryi" },
      { uk: "Самбір", en: "Sambir" },
      { uk: "Борислав", en: "Boryslav" },
      { uk: "Трускавець", en: "Truskavets" },
      { uk: "Новий Розділ", en: "Novyi Rozdil" },
      { uk: "Золочів", en: "Zolochiv" },
      { uk: "Жовква", en: "Zhovkva" },
      { uk: "Яворів", en: "Yavoriv" },
      { uk: "Городок", en: "Horodok" },
      { uk: "Пустомити", en: "Pustomyty" },
      { uk: "Броди", en: "Brody" },
    ],
    office: "lviv",
  },
  {
    id: "mykolaivska",
    mapId: "mykolaiv",
    slug: "mykolaivska-oblast",
    name: { uk: "Миколаївська область", en: "Mykolaiv Oblast" },
    shortName: { uk: "Миколаївська", en: "Mykolaiv" },
    locative: { uk: "у Миколаївській області", en: "in Mykolaiv Oblast" },
    center: { uk: "Миколаїв", en: "Mykolaiv" },
    centerLocative: { uk: "у Миколаєві", en: "in Mykolaiv" },
    h1: { uk: "Сонячні панелі у Миколаєві та Миколаївській області", en: "Solar panels in Mykolaiv and Mykolaiv Oblast" },
    yield: 1330,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Миколаїв", en: "Mykolaiv" },
      { uk: "Первомайськ", en: "Pervomaisk" },
      { uk: "Вознесенськ", en: "Voznesensk" },
      { uk: "Южноукраїнськ", en: "Yuzhnoukrainsk" },
      { uk: "Новий Буг", en: "Novyi Buh" },
      { uk: "Очаків", en: "Ochakiv" },
      { uk: "Баштанка", en: "Bashtanka" },
    ],
  },
  {
    id: "odeska",
    mapId: "odessa",
    slug: "odeska-oblast",
    name: { uk: "Одеська область", en: "Odesa Oblast" },
    shortName: { uk: "Одеська", en: "Odesa" },
    locative: { uk: "в Одеській області", en: "in Odesa Oblast" },
    center: { uk: "Одеса", en: "Odesa" },
    centerLocative: { uk: "в Одесі", en: "in Odesa" },
    h1: { uk: "Сонячні панелі в Одесі та Одеській області", en: "Solar panels in Odesa and Odesa Oblast" },
    yield: 1320,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Одеса", en: "Odesa" },
      { uk: "Ізмаїл", en: "Izmail" },
      { uk: "Чорноморськ", en: "Chornomorsk" },
      { uk: "Білгород-Дністровський", en: "Bilhorod-Dnistrovskyi" },
      { uk: "Подільськ", en: "Podilsk" },
      { uk: "Южне", en: "Yuzhne" },
      { uk: "Болград", en: "Bolhrad" },
      { uk: "Рені", en: "Reni" },
      { uk: "Балта", en: "Balta" },
    ],
  },
  {
    id: "poltavska",
    mapId: "poltava",
    slug: "poltavska-oblast",
    name: { uk: "Полтавська область", en: "Poltava Oblast" },
    shortName: { uk: "Полтавська", en: "Poltava" },
    locative: { uk: "у Полтавській області", en: "in Poltava Oblast" },
    center: { uk: "Полтава", en: "Poltava" },
    centerLocative: { uk: "у Полтаві", en: "in Poltava" },
    h1: { uk: "Сонячні панелі у Полтаві та Полтавській області", en: "Solar panels in Poltava and Poltava Oblast" },
    yield: 1190,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Полтава", en: "Poltava" },
      { uk: "Кременчук", en: "Kremenchuk" },
      { uk: "Горішні Плавні", en: "Horishni Plavni" },
      { uk: "Лубни", en: "Lubny" },
      { uk: "Миргород", en: "Myrhorod" },
      { uk: "Гадяч", en: "Hadiach" },
      { uk: "Пирятин", en: "Pyriatyn" },
    ],
  },
  {
    id: "rivnenska",
    mapId: "rivne",
    slug: "rivnenska-oblast",
    name: { uk: "Рівненська область", en: "Rivne Oblast" },
    shortName: { uk: "Рівненська", en: "Rivne" },
    locative: { uk: "у Рівненській області", en: "in Rivne Oblast" },
    center: { uk: "Рівне", en: "Rivne" },
    centerLocative: { uk: "у Рівному", en: "in Rivne" },
    h1: { uk: "Сонячні панелі у Рівному та Рівненській області", en: "Solar panels in Rivne and Rivne Oblast" },
    yield: 1060,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Рівне", en: "Rivne" },
      { uk: "Вараш", en: "Varash" },
      { uk: "Дубно", en: "Dubno" },
      { uk: "Костопіль", en: "Kostopil" },
      { uk: "Сарни", en: "Sarny" },
      { uk: "Здолбунів", en: "Zdolbuniv" },
      { uk: "Острог", en: "Ostroh" },
    ],
  },
  {
    id: "sumska",
    mapId: "sumy",
    slug: "sumska-oblast",
    name: { uk: "Сумська область", en: "Sumy Oblast" },
    shortName: { uk: "Сумська", en: "Sumy" },
    locative: { uk: "у Сумській області", en: "in Sumy Oblast" },
    center: { uk: "Суми", en: "Sumy" },
    centerLocative: { uk: "у Сумах", en: "in Sumy" },
    h1: { uk: "Сонячні панелі у Сумах та Сумській області", en: "Solar panels in Sumy and Sumy Oblast" },
    yield: 1100,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Суми", en: "Sumy" },
      { uk: "Конотоп", en: "Konotop" },
      { uk: "Шостка", en: "Shostka" },
      { uk: "Охтирка", en: "Okhtyrka" },
      { uk: "Ромни", en: "Romny" },
      { uk: "Глухів", en: "Hlukhiv" },
      { uk: "Лебедин", en: "Lebedyn" },
    ],
  },
  {
    id: "ternopilska",
    mapId: "ternopil",
    slug: "ternopilska-oblast",
    name: { uk: "Тернопільська область", en: "Ternopil Oblast" },
    shortName: { uk: "Тернопільська", en: "Ternopil" },
    locative: { uk: "у Тернопільській області", en: "in Ternopil Oblast" },
    center: { uk: "Тернопіль", en: "Ternopil" },
    centerLocative: { uk: "у Тернополі", en: "in Ternopil" },
    h1: { uk: "Сонячні панелі у Тернополі та Тернопільській області", en: "Solar panels in Ternopil and Ternopil Oblast" },
    yield: 1100,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Тернопіль", en: "Ternopil" },
      { uk: "Чортків", en: "Chortkiv" },
      { uk: "Кременець", en: "Kremenets" },
      { uk: "Бережани", en: "Berezhany" },
      { uk: "Збараж", en: "Zbarazh" },
      { uk: "Бучач", en: "Buchach" },
      { uk: "Теребовля", en: "Terebovlia" },
    ],
  },
  {
    id: "kharkivska",
    mapId: "kharkiv",
    slug: "kharkivska-oblast",
    name: { uk: "Харківська область", en: "Kharkiv Oblast" },
    shortName: { uk: "Харківська", en: "Kharkiv" },
    locative: { uk: "у Харківській області", en: "in Kharkiv Oblast" },
    center: { uk: "Харків", en: "Kharkiv" },
    centerLocative: { uk: "у Харкові", en: "in Kharkiv" },
    h1: { uk: "Сонячні панелі у Харкові та Харківській області", en: "Solar panels in Kharkiv and Kharkiv Oblast" },
    yield: 1210,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Харків", en: "Kharkiv" },
      { uk: "Лозова", en: "Lozova" },
      { uk: "Ізюм", en: "Izium" },
      { uk: "Чугуїв", en: "Chuhuiv" },
      { uk: "Куп’янськ", en: "Kupiansk" },
      { uk: "Балаклія", en: "Balakliia" },
      { uk: "Мерефа", en: "Merefa" },
      { uk: "Богодухів", en: "Bohodukhiv" },
    ],
  },
  {
    id: "khersonska",
    mapId: "kherson",
    slug: "khersonska-oblast",
    name: { uk: "Херсонська область", en: "Kherson Oblast" },
    shortName: { uk: "Херсонська", en: "Kherson" },
    locative: { uk: "у Херсонській області", en: "in Kherson Oblast" },
    center: { uk: "Херсон", en: "Kherson" },
    centerLocative: { uk: "у Херсоні", en: "in Kherson" },
    h1: { uk: "Сонячні панелі у Херсоні та Херсонській області", en: "Solar panels in Kherson and Kherson Oblast" },
    yield: 1360,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Херсон", en: "Kherson" },
      { uk: "Нова Каховка", en: "Nova Kakhovka" },
      { uk: "Каховка", en: "Kakhovka" },
      { uk: "Скадовськ", en: "Skadovsk" },
      { uk: "Генічеськ", en: "Henichesk" },
      { uk: "Олешки", en: "Oleshky" },
      { uk: "Берислав", en: "Beryslav" },
    ],
  },
  {
    id: "khmelnytska",
    mapId: "khmelnytskyi",
    slug: "khmelnytska-oblast",
    name: { uk: "Хмельницька область", en: "Khmelnytskyi Oblast" },
    shortName: { uk: "Хмельницька", en: "Khmelnytskyi" },
    locative: { uk: "у Хмельницькій області", en: "in Khmelnytskyi Oblast" },
    center: { uk: "Хмельницький", en: "Khmelnytskyi" },
    centerLocative: { uk: "у Хмельницькому", en: "in Khmelnytskyi" },
    h1: { uk: "Сонячні панелі у Хмельницькому та Хмельницькій області", en: "Solar panels in Khmelnytskyi and Khmelnytskyi Oblast" },
    yield: 1115,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Хмельницький", en: "Khmelnytskyi" },
      { uk: "Кам’янець-Подільський", en: "Kamianets-Podilskyi" },
      { uk: "Шепетівка", en: "Shepetivka" },
      { uk: "Нетішин", en: "Netishyn" },
      { uk: "Славута", en: "Slavuta" },
      { uk: "Старокостянтинів", en: "Starokostiantyniv" },
      { uk: "Полонне", en: "Polonne" },
    ],
  },
  {
    id: "cherkaska",
    mapId: "cherkasy",
    slug: "cherkaska-oblast",
    name: { uk: "Черкаська область", en: "Cherkasy Oblast" },
    shortName: { uk: "Черкаська", en: "Cherkasy" },
    locative: { uk: "у Черкаській області", en: "in Cherkasy Oblast" },
    center: { uk: "Черкаси", en: "Cherkasy" },
    centerLocative: { uk: "у Черкасах", en: "in Cherkasy" },
    h1: { uk: "Сонячні панелі у Черкасах та Черкаській області", en: "Solar panels in Cherkasy and Cherkasy Oblast" },
    yield: 1200,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Черкаси", en: "Cherkasy" },
      { uk: "Умань", en: "Uman" },
      { uk: "Сміла", en: "Smila" },
      { uk: "Золотоноша", en: "Zolotonosha" },
      { uk: "Канів", en: "Kaniv" },
      { uk: "Звенигородка", en: "Zvenyhorodka" },
      { uk: "Корсунь-Шевченківський", en: "Korsun-Shevchenkivskyi" },
    ],
  },
  {
    id: "chernivetska",
    mapId: "chernivtsi",
    slug: "chernivetska-oblast",
    name: { uk: "Чернівецька область", en: "Chernivtsi Oblast" },
    shortName: { uk: "Чернівецька", en: "Chernivtsi" },
    locative: { uk: "у Чернівецькій області", en: "in Chernivtsi Oblast" },
    center: { uk: "Чернівці", en: "Chernivtsi" },
    centerLocative: { uk: "у Чернівцях", en: "in Chernivtsi" },
    h1: { uk: "Сонячні панелі у Чернівцях та Чернівецькій області", en: "Solar panels in Chernivtsi and Chernivtsi Oblast" },
    yield: 1110,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Чернівці", en: "Chernivtsi" },
      { uk: "Новодністровськ", en: "Novodnistrovsk" },
      { uk: "Хотин", en: "Khotyn" },
      { uk: "Сторожинець", en: "Storozhynets" },
      { uk: "Кіцмань", en: "Kitsman" },
      { uk: "Новоселиця", en: "Novoselytsia" },
    ],
  },
  {
    id: "chernihivska",
    mapId: "chernihiv",
    slug: "chernihivska-oblast",
    name: { uk: "Чернігівська область", en: "Chernihiv Oblast" },
    shortName: { uk: "Чернігівська", en: "Chernihiv" },
    locative: { uk: "у Чернігівській області", en: "in Chernihiv Oblast" },
    center: { uk: "Чернігів", en: "Chernihiv" },
    centerLocative: { uk: "у Чернігові", en: "in Chernihiv" },
    h1: { uk: "Сонячні панелі у Чернігові та Чернігівській області", en: "Solar panels in Chernihiv and Chernihiv Oblast" },
    yield: 1070,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Чернігів", en: "Chernihiv" },
      { uk: "Ніжин", en: "Nizhyn" },
      { uk: "Прилуки", en: "Pryluky" },
      { uk: "Бахмач", en: "Bakhmach" },
      { uk: "Новгород-Сіверський", en: "Novhorod-Siverskyi" },
      { uk: "Мена", en: "Mena" },
      { uk: "Корюківка", en: "Koriukivka" },
    ],
  },
  {
    id: "krym",
    mapId: "crimea",
    slug: "krym",
    name: { uk: "Автономна Республіка Крим", en: "Autonomous Republic of Crimea" },
    shortName: { uk: "АР Крим", en: "Crimea" },
    locative: { uk: "в Автономній Республіці Крим", en: "in the Autonomous Republic of Crimea" },
    center: { uk: "Сімферополь", en: "Simferopol" },
    centerLocative: { uk: "у Сімферополі", en: "in Simferopol" },
    h1: { uk: "Сонячні панелі в Криму", en: "Solar panels in Crimea" },
    // TODO(content): перевірити в PVGIS — приклад від власника.
    yield: 1330,
    yieldEstimate: true,
    // cities: перелік від агента, власник перевіряє
    cities: [
      { uk: "Сімферополь", en: "Simferopol" },
      { uk: "Севастополь", en: "Sevastopol" },
      { uk: "Керч", en: "Kerch" },
      { uk: "Євпаторія", en: "Yevpatoriia" },
      { uk: "Ялта", en: "Yalta" },
      { uk: "Феодосія", en: "Feodosiia" },
    ],
    serviceNote: "occupied",
  },
];

/** Region page path. "cec" = slugs.services.turnkeySes (routes.ts imports i18n/config, which imports this file). */
export function regionPath(region: Pick<InsolationRegion, "slug">): string {
  return `/cec/${region.slug}/`;
}

export const regionPaths: string[] = insolationRegions.map(regionPath);

export function regionBySlug(slug: string): InsolationRegion | undefined {
  return insolationRegions.find((region) => region.slug === slug);
}

export function regionById(id: string): InsolationRegion | undefined {
  return insolationRegions.find((region) => region.id === id);
}

/** Alphabetical by the full name in a locale (selects). */
export function regionsByLocale(locale: Locale) {
  return insolationRegions.toSorted((a, b) => a.name[locale].localeCompare(b.name[locale], locale));
}

/** Alphabetical by the short name in a locale (pills, «other regions»), ignoring «м.» / «АР»: м. Київ next to Київська. */
export function regionsByShortName(locale: Locale) {
  const key = (region: InsolationRegion) => region.shortName[locale].replace(/^(м\.|АР)\s+/, "");
  return insolationRegions.toSorted((a, b) => key(a).localeCompare(key(b), locale));
}
