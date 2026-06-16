import {
  vocabularyCategories,
  vocabularyLevels,
  vocabularyFrequencyOptions,
} from "./shared.js";
import { level1BasicVocabulary } from "./level1-basic.js";
import { level2NormalVocabulary } from "./level2-normal.js";
import { level3GreenVocabulary } from "./level3-green.js";
import { level4BlueVocabulary } from "./level4-blue.js";
import { level5AdvancedVocabulary } from "./level5-advanced.js";

const rawVocabularyBank = [
  ...level1BasicVocabulary,
  ...level2NormalVocabulary,
  ...level3GreenVocabulary,
  ...level4BlueVocabulary,
  ...level5AdvancedVocabulary,
];

export const vocabularyThemes = [
  {
    id: "office-english",
    label: "Office English",
    description: "Files, schedules, paperwork, and office routines.",
    categories: ["Office", "Meeting"],
    keywords: ["deadline", "document", "office", "schedule", "filing", "stationery"],
    starterSize: 150,
  },
  {
    id: "business-english",
    label: "Business English",
    description: "Core company, management, and growth vocabulary.",
    categories: ["Business", "Corporate Development", "Project Management"],
    keywords: ["business", "growth", "proposal", "strategy", "stakeholder", "acquisition"],
    starterSize: 180,
  },
  {
    id: "meeting-english",
    label: "Meeting English",
    description: "Agenda, presentation, minutes, and meeting flow.",
    categories: ["Meeting", "Office"],
    keywords: ["agenda", "conference", "meeting", "minutes", "presentation", "brief"],
    starterSize: 140,
  },
  {
    id: "email-english",
    label: "Email English",
    description: "Reply, request, follow-up, and email action language.",
    categories: ["Office", "Business", "Customer Service"],
    keywords: ["email", "reply", "follow", "request", "send", "subject"],
    starterSize: 130,
  },
  {
    id: "finance-english",
    label: "Finance English",
    description: "Budgeting, accounting, banking, and reporting terms.",
    categories: ["Finance", "Accounting", "Banking", "Insurance"],
    keywords: ["budget", "equity", "invoice", "liability", "audit", "premium"],
    starterSize: 180,
  },
  {
    id: "purchasing-english",
    label: "Purchasing English",
    description: "Buying, quotations, procurement, and vendor communication.",
    categories: ["Purchasing", "Supply Chain"],
    keywords: ["purchase", "quotation", "vendor", "procurement", "order", "supplier"],
    starterSize: 160,
  },
  {
    id: "manufacturing-english",
    label: "Manufacturing English",
    description: "Production, quality, machinery, routing, and maintenance.",
    categories: ["Manufacturing", "Engineering", "Supply Chain"],
    keywords: [
      "production",
      "inventory",
      "maintenance",
      "machinery",
      "assembly",
      "quality control",
      "lead time",
      "routing",
      "scheduling",
    ],
    starterSize: 180,
  },
  {
    id: "logistics-english",
    label: "Logistics English",
    description: "Warehouse, shipment, procurement, distribution, and delivery.",
    categories: ["Logistics", "Supply Chain", "Purchasing", "Travel"],
    keywords: ["warehouse", "shipment", "supplier", "procurement", "distribution", "inventory control"],
    starterSize: 180,
  },
  {
    id: "technology-english",
    label: "Technology English",
    description: "Systems, databases, deployment, and technical support language.",
    categories: ["Technology", "Engineering"],
    keywords: ["database", "deployment", "dashboard", "integration", "system", "technical"],
    starterSize: 150,
  },
  {
    id: "travel-english",
    label: "Travel English",
    description: "Hotel, airport, itinerary, and transportation vocabulary.",
    categories: ["Travel", "Hotel", "Airport", "Dining"],
    keywords: ["airport", "boarding", "hotel", "itinerary", "reservation", "terminal"],
    starterSize: 140,
  },
  {
    id: "customer-service-english",
    label: "Customer Service English",
    description: "Complaints, refunds, support, and guest handling language.",
    categories: ["Customer Service", "Dining", "Hotel", "Sales"],
    keywords: ["complaint", "customer", "refund", "service", "support", "satisfaction"],
    starterSize: 150,
  },
];

const qualityProfiles = {
  inventory: {
    meaning: "庫存",
    partOfSpeech: "noun",
    category: "Logistics",
    theme: "Logistics English",
    pronunciation: "/ˈɪnvənˌtɔːri/",
    example: "The inventory was checked yesterday.",
    exampleZh: "昨天已完成庫存盤點。",
    collocations: [
      "inventory management",
      "inventory control",
      "inventory system",
      "inventory report",
    ],
    synonyms: ["stock"],
    relatedWords: ["warehouse", "shipment", "supplier", "procurement"],
    wordFamily: ["inventory", "inventoried", "inventory control"],
  },
  warehouse: {
    meaning: "倉庫",
    partOfSpeech: "noun",
    category: "Logistics",
    theme: "Logistics English",
    pronunciation: "/ˈwerˌhaʊs/",
    example: "The warehouse receives new shipments every morning.",
    exampleZh: "倉庫每天早上都會接收新貨。",
    collocations: [
      "warehouse manager",
      "warehouse space",
      "warehouse operations",
      "warehouse inventory",
    ],
    synonyms: ["storage facility", "distribution center"],
    relatedWords: ["inventory", "shipment", "supplier", "distribution"],
    wordFamily: ["warehouse", "warehousing", "warehouse staff"],
  },
  shipment: {
    meaning: "貨件；出貨",
    partOfSpeech: "noun",
    category: "Logistics",
    theme: "Logistics English",
    pronunciation: "/ˈʃɪpmənt/",
    example: "The shipment was delayed by heavy rain.",
    exampleZh: "這批貨因大雨而延誤。",
    collocations: [
      "shipment delay",
      "shipment tracking",
      "international shipment",
      "shipment status",
    ],
    synonyms: ["delivery", "consignment"],
    relatedWords: ["warehouse", "supplier", "inventory", "procurement"],
    wordFamily: ["ship", "shipment", "shipping", "shipper"],
  },
  supplier: {
    meaning: "供應商",
    partOfSpeech: "noun",
    category: "Purchasing",
    theme: "Purchasing English",
    pronunciation: "/səˈplaɪər/",
    example: "Our supplier confirmed the delivery schedule.",
    exampleZh: "我們的供應商已確認交貨時程。",
    collocations: [
      "supplier contract",
      "supplier performance",
      "main supplier",
      "supplier evaluation",
    ],
    synonyms: ["vendor", "provider"],
    relatedWords: ["procurement", "shipment", "warehouse", "inventory"],
    wordFamily: ["supply", "supplier", "supplied", "supplying"],
  },
  procurement: {
    meaning: "採購",
    partOfSpeech: "noun",
    category: "Purchasing",
    theme: "Purchasing English",
    pronunciation: "/prəˈkjʊrmənt/",
    example: "The procurement team is reviewing vendor quotations.",
    exampleZh: "採購團隊正在審查供應商報價。",
    collocations: [
      "procurement process",
      "procurement team",
      "procurement policy",
      "procurement cost",
    ],
    synonyms: ["purchasing", "sourcing"],
    relatedWords: ["supplier", "quotation", "inventory", "shipment"],
    wordFamily: ["procure", "procured", "procuring", "procurement"],
  },
  produce: {
    meaning: "生產；製造",
    partOfSpeech: "verb",
    category: "Manufacturing",
    theme: "Manufacturing English",
    pronunciation: "/prəˈduːs/",
    example: "The factory can produce 500 units a day.",
    exampleZh: "這間工廠一天可以生產 500 個單位。",
    collocations: [
      "produce goods",
      "produce efficiently",
      "produce in bulk",
      "produce parts",
    ],
    synonyms: ["manufacture", "create"],
    relatedWords: ["product", "production", "producer", "productivity"],
    wordFamily: [
      "produce",
      "product",
      "production",
      "producer",
      "productive",
      "productivity",
    ],
  },
  production: {
    meaning: "生產；產量",
    partOfSpeech: "noun",
    category: "Manufacturing",
    theme: "Manufacturing English",
    pronunciation: "/prəˈdʌkʃən/",
    example: "Production will increase next month.",
    exampleZh: "下個月的產量將會增加。",
    collocations: [
      "production line",
      "production schedule",
      "production target",
      "production cost",
    ],
    synonyms: ["manufacturing", "output"],
    relatedWords: ["produce", "assembly", "maintenance", "machinery"],
    wordFamily: [
      "produce",
      "product",
      "production",
      "producer",
      "productive",
      "productivity",
    ],
  },
  maintenance: {
    meaning: "維修保養",
    partOfSpeech: "noun",
    category: "Manufacturing",
    theme: "Manufacturing English",
    pronunciation: "/ˈmeɪntənəns/",
    example: "The machine is down for maintenance.",
    exampleZh: "這台機器因保養而暫停運作。",
    collocations: [
      "preventive maintenance",
      "maintenance schedule",
      "maintenance team",
      "routine maintenance",
    ],
    synonyms: ["upkeep", "servicing"],
    relatedWords: ["machinery", "production", "downtime", "assembly"],
    wordFamily: ["maintain", "maintenance", "maintained", "maintaining"],
  },
  machinery: {
    meaning: "機械設備",
    partOfSpeech: "noun",
    category: "Manufacturing",
    theme: "Manufacturing English",
    pronunciation: "/məˈʃiːnəri/",
    example: "The new machinery improved efficiency on the line.",
    exampleZh: "新機械設備提升了產線效率。",
    collocations: [
      "heavy machinery",
      "industrial machinery",
      "machinery upgrade",
      "machinery maintenance",
    ],
    synonyms: ["equipment", "machines"],
    relatedWords: ["maintenance", "assembly", "production", "quality control"],
    wordFamily: ["machine", "machinery", "machinist"],
  },
  assembly: {
    meaning: "組裝",
    partOfSpeech: "noun",
    category: "Manufacturing",
    theme: "Manufacturing English",
    pronunciation: "/əˈsembli/",
    example: "The assembly process was revised last week.",
    exampleZh: "組裝流程已在上週完成修訂。",
    collocations: [
      "assembly line",
      "assembly process",
      "assembly area",
      "assembly instructions",
    ],
    synonyms: ["construction", "putting together"],
    relatedWords: ["machinery", "production", "routing", "quality control"],
    wordFamily: ["assemble", "assembled", "assembly"],
  },
  "lead time": {
    meaning: "前置時間",
    partOfSpeech: "noun",
    category: "Supply Chain",
    theme: "Manufacturing English",
    pronunciation: "/ˈliːd taɪm/",
    example: "The lead time is two weeks for custom parts.",
    exampleZh: "客製化零件的前置時間是兩週。",
    collocations: [
      "short lead time",
      "lead time reduction",
      "production lead time",
      "shipping lead time",
    ],
    synonyms: ["processing time", "turnaround time"],
    relatedWords: ["routing", "scheduling", "shipment", "production"],
    wordFamily: ["lead time", "lead-time planning"],
  },
  routing: {
    meaning: "製程路線；路由安排",
    partOfSpeech: "noun",
    category: "Manufacturing",
    theme: "Manufacturing English",
    pronunciation: "/ˈruːtɪŋ/",
    example: "Routing determines the order of each production step.",
    exampleZh: "製程路線決定每個生產步驟的順序。",
    collocations: [
      "routing sheet",
      "routing plan",
      "routing process",
      "routing sequence",
    ],
    synonyms: ["path planning", "process routing"],
    relatedWords: ["scheduling", "assembly", "lead time", "production"],
    wordFamily: ["route", "routing", "routed"],
  },
  scheduling: {
    meaning: "排程",
    partOfSpeech: "noun",
    category: "Manufacturing",
    theme: "Manufacturing English",
    pronunciation: "/ˈskedʒuːlɪŋ/",
    example: "Scheduling helps the factory avoid bottlenecks.",
    exampleZh: "排程能幫助工廠避免瓶頸。",
    collocations: [
      "production scheduling",
      "shift scheduling",
      "scheduling software",
      "scheduling conflict",
    ],
    synonyms: ["planning", "arranging"],
    relatedWords: ["routing", "lead time", "production", "maintenance"],
    wordFamily: ["schedule", "scheduled", "scheduling"],
  },
  invoice: {
    meaning: "發票",
    partOfSpeech: "noun",
    category: "Finance",
    theme: "Finance English",
    pronunciation: "/ˈɪnvɔɪs/",
    example: "Please send the invoice by email today.",
    exampleZh: "請今天以電子郵件寄出發票。",
    collocations: [
      "issue an invoice",
      "pay an invoice",
      "invoice amount",
      "invoice number",
    ],
    synonyms: ["bill", "statement"],
    relatedWords: ["payment", "accounting", "purchase", "budget"],
    wordFamily: ["invoice", "invoiced", "invoicing"],
  },
  schedule: {
    meaning: "行程表；時程",
    partOfSpeech: "noun",
    category: "Office",
    theme: "Office English",
    pronunciation: "/ˈskedʒuːl/",
    example: "The schedule was updated this morning.",
    exampleZh: "時程表已在今天早上更新。",
    collocations: [
      "meeting schedule",
      "work schedule",
      "schedule change",
      "schedule update",
    ],
    synonyms: ["timetable", "agenda"],
    relatedWords: ["meeting", "deadline", "presentation", "itinerary"],
    wordFamily: ["schedule", "scheduled", "scheduling"],
  },
};

function uniqueList(items = []) {
  return [...new Set(items.filter(Boolean).map((item) => String(item).trim()))];
}

function headwordOf(word) {
  return String(word).trim().toLowerCase();
}

function baseHeadwordOf(word) {
  return String(word).trim().split(" ")[0].toLowerCase();
}

function formatThemeFromCategory(category) {
  const map = {
    Office: "Office English",
    Meeting: "Meeting English",
    Business: "Business English",
    "Corporate Development": "Business English",
    Finance: "Finance English",
    Accounting: "Finance English",
    Banking: "Finance English",
    Insurance: "Finance English",
    Purchasing: "Purchasing English",
    Manufacturing: "Manufacturing English",
    Logistics: "Logistics English",
    "Supply Chain": "Logistics English",
    Engineering: "Technology English",
    Technology: "Technology English",
    Travel: "Travel English",
    Hotel: "Travel English",
    Airport: "Travel English",
    Dining: "Travel English",
    "Customer Service": "Customer Service English",
    Sales: "Business English",
    "Human Resources": "Business English",
    "Project Management": "Business English",
  };

  return map[category] ?? "Business English";
}

function findThemeByWord(word) {
  const haystack = [
    word.word,
    word.meaning,
    word.category,
    ...(word.collocations ?? []),
    ...(word.synonyms ?? []),
    ...(word.wordFamily ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return (
    vocabularyThemes.find(
      (theme) =>
        theme.categories.includes(word.category) ||
        theme.keywords.some((keyword) => haystack.includes(keyword.toLowerCase())),
    )?.label ?? formatThemeFromCategory(word.category)
  );
}

function buildRelatedWords(word) {
  const sameTheme = rawVocabularyBank
    .filter(
      (item) =>
        item.id !== word.id &&
        !item.word.includes(" ") &&
        (item.category === word.category || baseHeadwordOf(item.word) === baseHeadwordOf(word.word)),
    )
    .slice(0, 6)
    .map((item) => item.word);

  return uniqueList(sameTheme).slice(0, 4);
}

function enrichWord(word) {
  const profile = qualityProfiles[headwordOf(word.word)] ?? qualityProfiles[baseHeadwordOf(word.word)] ?? {};
  const category = profile.category ?? word.category;
  const theme = profile.theme ?? findThemeByWord({ ...word, category });
  const pronunciation = profile.pronunciation ?? word.pronunciation;
  const collocations = uniqueList(profile.collocations ?? word.collocations).slice(0, 6);
  const synonyms = uniqueList(profile.synonyms ?? word.synonyms).slice(0, 5);
  const antonyms = uniqueList(profile.antonyms ?? word.antonyms).slice(0, 4);
  const roots = uniqueList(profile.roots ?? word.roots).slice(0, 4);
  const wordFamily = uniqueList(profile.wordFamily ?? word.wordFamily).slice(0, 6);
  const relatedWords = uniqueList(profile.relatedWords ?? buildRelatedWords({ ...word, category })).slice(0, 6);

  return {
    ...word,
    meaning: profile.meaning ?? word.meaning,
    partOfSpeech: profile.partOfSpeech ?? word.partOfSpeech,
    category,
    theme,
    pronunciation,
    example: profile.example ?? word.example,
    exampleZh: profile.exampleZh ?? word.exampleZh,
    collocations,
    synonyms,
    antonyms,
    roots,
    wordFamily,
    relatedWords,
  };
}

function ensureCoreEntries(bank) {
  const nextBank = [...bank];

  Object.entries(qualityProfiles).forEach(([headword, profile]) => {
    const hasExact = nextBank.some((item) => item.word.toLowerCase() === headword);
    if (hasExact) {
      return;
    }

    const source = nextBank.find((item) => baseHeadwordOf(item.word) === headword);
    const fallback = {
      id: `core-${headword}`,
      word: headword,
      meaning: profile.meaning ?? headword,
      partOfSpeech: profile.partOfSpeech ?? source?.partOfSpeech ?? "noun",
      pronunciation: profile.pronunciation ?? source?.pronunciation ?? `/${headword}/`,
      example: profile.example ?? source?.example ?? `The team reviewed the ${headword} this morning.`,
      exampleZh: profile.exampleZh ?? source?.exampleZh ?? `團隊今天早上檢查了 ${headword}。`,
      collocations: profile.collocations ?? source?.collocations ?? [`review the ${headword}`],
      synonyms: profile.synonyms ?? source?.synonyms ?? [],
      antonyms: profile.antonyms ?? source?.antonyms ?? [],
      roots: profile.roots ?? source?.roots ?? [],
      wordFamily: profile.wordFamily ?? source?.wordFamily ?? [headword],
      relatedWords: profile.relatedWords ?? source?.relatedWords ?? [],
      category: profile.category ?? source?.category ?? "Business",
      level: source?.level ?? "easy",
      frequency: source?.frequency ?? 5,
      isFavorite: false,
      wrongCount: 0,
      mastered: false,
    };

    nextBank.unshift(enrichWord(fallback));
  });

  return nextBank;
}

const levelPriority = {
  easy: 0,
  normal: 1,
  green: 2,
  blue: 3,
  advanced: 4,
};

function mergeWordRecord(base, incoming) {
  return {
    ...base,
    collocations: uniqueList([...(base.collocations ?? []), ...(incoming.collocations ?? [])]).slice(0, 8),
    synonyms: uniqueList([...(base.synonyms ?? []), ...(incoming.synonyms ?? [])]).slice(0, 6),
    antonyms: uniqueList([...(base.antonyms ?? []), ...(incoming.antonyms ?? [])]).slice(0, 5),
    roots: uniqueList([...(base.roots ?? []), ...(incoming.roots ?? [])]).slice(0, 5),
    wordFamily: uniqueList([...(base.wordFamily ?? []), ...(incoming.wordFamily ?? [])]).slice(0, 8),
    relatedWords: uniqueList([...(base.relatedWords ?? []), ...(incoming.relatedWords ?? [])]).slice(0, 8),
  };
}

function dedupeVocabulary(bank) {
  const canonicalMap = new Map();
  const aliasMap = {};

  bank.forEach((item) => {
    const key = item.word.toLowerCase().trim();
    const current = canonicalMap.get(key);

    if (!current) {
      canonicalMap.set(key, item);
      aliasMap[item.id] = item.id;
      return;
    }

    const currentPriority = levelPriority[current.level] ?? 99;
    const incomingPriority = levelPriority[item.level] ?? 99;

    if (incomingPriority < currentPriority) {
      const merged = mergeWordRecord(item, current);
      canonicalMap.set(key, merged);
      aliasMap[current.id] = item.id;
      aliasMap[item.id] = item.id;
      return;
    }

    canonicalMap.set(key, mergeWordRecord(current, item));
    aliasMap[item.id] = current.id;
  });

  const vocabularyBank = [...canonicalMap.values()];
  vocabularyBank.forEach((item) => {
    aliasMap[item.id] = item.id;
  });

  return { vocabularyBank, vocabularyIdAliases: aliasMap };
}

const dedupedVocabulary = dedupeVocabulary(ensureCoreEntries(rawVocabularyBank.map(enrichWord)));

export const vocabularyBank = dedupedVocabulary.vocabularyBank;
export const vocabularyIdAliases = dedupedVocabulary.vocabularyIdAliases;

export const vocabularyPartOfSpeechOptions = [
  ...new Set(vocabularyBank.map((item) => item.partOfSpeech)),
].map((item) => ({ id: item, label: item }));

export {
  vocabularyCategories,
  vocabularyLevels,
  vocabularyFrequencyOptions,
};

export const vocabularyLibraryMeta = {
  totalWords: vocabularyBank.length,
  levelCounts: {
    easy: vocabularyBank.filter((item) => item.level === "easy").length,
    normal: vocabularyBank.filter((item) => item.level === "normal").length,
    green: vocabularyBank.filter((item) => item.level === "green").length,
    blue: vocabularyBank.filter((item) => item.level === "blue").length,
    advanced: vocabularyBank.filter((item) => item.level === "advanced").length,
  },
};
