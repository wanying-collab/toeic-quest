import {
  categoryAliasMap,
  extraVocabularySeeds,
  validMultiWordTerms,
  vocabularyCategories,
  vocabularyFrequencyOptions,
  vocabularyLevels,
  vocabularyThemes,
  wordQualityProfiles,
} from "./catalog.js";
import { highFrequencyVocabularyProfiles } from "./high-frequency-profiles.js";

const themeLabelByCategory = {
  Office: "Office English",
  Meeting: "Office English",
  Email: "Office English",
  Business: "Business English",
  "Corporate Development": "Business English",
  "Project Management": "Business English",
  Sales: "Business English",
  Finance: "Finance English",
  Accounting: "Finance English",
  Banking: "Finance English",
  Insurance: "Finance English",
  Purchasing: "Purchasing English",
  "Supply Chain": "Purchasing English",
  Manufacturing: "Manufacturing English",
  Maintenance: "Manufacturing English",
  "Quality Control": "Manufacturing English",
  Engineering: "Technology English",
  Technology: "Technology English",
  Logistics: "Logistics English",
  Travel: "Travel English",
  Hotel: "Travel English",
  Airport: "Travel English",
  Dining: "Travel English",
  Entertainment: "Travel English",
  "Customer Service": "Customer Service English",
  Contract: "Customer Service English",
  "Human Resources": "Business English",
  Healthcare: "Travel English",
};

const categoryZhMap = Object.fromEntries(
  vocabularyCategories.map((item) => [item.label, item.labelZh]),
);

const validMultiWordTermSet = new Set(validMultiWordTerms.map((item) => item.toLowerCase()));

const LEVEL_PRIORITY = {
  easy: 0,
  normal: 1,
  green: 2,
  blue: 3,
  advanced: 4,
};

const RETIRED_GENERATOR_PATTERNS = [
  /\bcarefully\b/i,
  /\btoday\b/i,
  /\bagain\b/i,
];

function cleanText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function headwordOf(value) {
  return cleanText(value).toLowerCase();
}

function slugifyWord(value) {
  return headwordOf(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueList(values = []) {
  return [...new Set(values.map(cleanText).filter(Boolean))];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeCategory(category) {
  const normalized = cleanText(category);
  return categoryAliasMap[normalized] ?? normalized ?? "Business";
}

function normalizePartOfSpeech(partOfSpeech) {
  const normalized = headwordOf(partOfSpeech);
  if (normalized.includes("verb")) {
    return "verb";
  }
  if (normalized.includes("adjective")) {
    return "adjective";
  }
  if (normalized.includes("adverb")) {
    return "adverb";
  }
  return "noun";
}

function normalizeLevel(level) {
  const normalized = headwordOf(level);
  if (Object.hasOwn(LEVEL_PRIORITY, normalized)) {
    return normalized;
  }
  return "normal";
}

function isLegitimateVocabularyWord(word) {
  const normalized = headwordOf(word);
  if (!normalized) {
    return false;
  }

  if (validMultiWordTermSet.has(normalized)) {
    return true;
  }

  return /^[a-z][a-z-\s]*$/i.test(normalized) && normalized.split(" ").length === 1;
}

function looksRetiredGeneratorArtifact(word) {
  const normalized = headwordOf(word);
  if (!normalized || validMultiWordTermSet.has(normalized)) {
    return false;
  }

  if (normalized.split(" ").length <= 1) {
    return false;
  }

  return RETIRED_GENERATOR_PATTERNS.some((pattern) => pattern.test(normalized));
}

function normalizeSeed(seed, source) {
  const word = cleanText(seed.word);
  const category = normalizeCategory(seed.category);

  return {
    source,
    sourceId: cleanText(seed.id ?? `${source}-${slugifyWord(word)}`),
    word,
    meaning: cleanText(seed.meaning),
    partOfSpeech: normalizePartOfSpeech(seed.partOfSpeech),
    pronunciation: cleanText(seed.pronunciation),
    example: cleanText(seed.example),
    exampleZh: cleanText(seed.exampleZh),
    collocations: uniqueList(seed.collocations ?? []),
    category,
    categoryZh: categoryZhMap[category] ?? category,
    level: normalizeLevel(seed.level),
    frequency: clamp(Number(seed.frequency) || 3, 1, 5),
  };
}

function mergeSeedRecord(existing, incoming) {
  const existingPriority = LEVEL_PRIORITY[existing.level] ?? 99;
  const incomingPriority = LEVEL_PRIORITY[incoming.level] ?? 99;
  const preferred = existingPriority <= incomingPriority ? existing : incoming;
  const secondary = preferred === existing ? incoming : existing;

  return {
    ...preferred,
    pronunciation: preferred.pronunciation || secondary.pronunciation,
    example: preferred.example || secondary.example,
    exampleZh: preferred.exampleZh || secondary.exampleZh,
    collocations: uniqueList([...(preferred.collocations ?? []), ...(secondary.collocations ?? [])]),
    frequency: Math.max(preferred.frequency ?? 0, secondary.frequency ?? 0),
  };
}

const normalizedSeeds = extraVocabularySeeds
  .map((seed) => normalizeSeed(seed, "catalog"))
  .filter(
    (seed) =>
      seed.word &&
      seed.meaning &&
      isLegitimateVocabularyWord(seed.word) &&
      !looksRetiredGeneratorArtifact(seed.word),
  );

const duplicateSourceCount = normalizedSeeds.length - new Set(normalizedSeeds.map((item) => headwordOf(item.word))).size;

const approvedFamilyWordSet = new Set(
  Object.values(wordQualityProfiles).flatMap((profile) =>
    uniqueList(profile.wordFamily ?? []).map((word) => headwordOf(word)),
  ),
);

const highFrequencyProfileMap = Object.fromEntries(
  Object.entries(highFrequencyVocabularyProfiles).map(([word, profile]) => [headwordOf(word), profile]),
);

const mergedWordQualityProfiles = {
  ...wordQualityProfiles,
  ...highFrequencyProfileMap,
};

const canonicalSeedMap = normalizedSeeds.reduce((map, seed) => {
  const key = headwordOf(seed.word);
  const current = map.get(key);
  map.set(key, current ? mergeSeedRecord(current, seed) : seed);
  return map;
}, new Map());

function buildPronunciation(word, profilePronunciation, fallbackPronunciation) {
  if (cleanText(profilePronunciation)) {
    return cleanText(profilePronunciation);
  }

  if (cleanText(fallbackPronunciation)) {
    return cleanText(fallbackPronunciation);
  }

  return `/${cleanText(word).toLowerCase()}/`;
}

function buildTheme(category) {
  return themeLabelByCategory[category] ?? "Business English";
}

const topPriorityWordSet = new Set(
  [...canonicalSeedMap.values()]
    .sort((left, right) => (right.frequency - left.frequency) || left.word.localeCompare(right.word))
    .slice(0, 200)
    .map((item) => headwordOf(item.word)),
);

const toeicCategoryTips = {
  Office: {
    commonSections: ["Part 5", "Part 6", "Part 7"],
    commonContexts: ["Email", "Notice", "Schedule"],
    reminder: "辦公室字常出現在公告、會議安排與日常行政流程中。",
  },
  Meeting: {
    commonSections: ["Part 3", "Part 4", "Part 7"],
    commonContexts: ["Meeting", "Agenda", "Announcement"],
    reminder: "注意時間、地點與下一步行動，通常是會議題的關鍵。",
  },
  Business: {
    commonSections: ["Part 5", "Part 7"],
    commonContexts: ["Report", "Business Email", "Announcement"],
    reminder: "商務字常搭配 growth、strategy、performance、plan 一起考。",
  },
  "Corporate Development": {
    commonSections: ["Part 5", "Part 7"],
    commonContexts: ["Press Release", "Business News", "Investor Briefing"],
    reminder: "看到公司擴張、收購、整併相關字時，要注意商業策略與投資情境。",
  },
  Finance: {
    commonSections: ["Part 5", "Part 6", "Part 7"],
    commonContexts: ["Invoice", "Payment", "Financial Report"],
    reminder: "財務字常和 payment、cost、budget、revenue、profit 一起出現。",
  },
  Accounting: {
    commonSections: ["Part 5", "Part 7"],
    commonContexts: ["Statement", "Closing Report", "Expense Form"],
    reminder: "會計題常考報表、費用、折舊與資產負債概念。",
  },
  Banking: {
    commonSections: ["Part 2", "Part 5", "Part 7"],
    commonContexts: ["Bank Notice", "Loan", "Card Payment"],
    reminder: "銀行字常和 account、loan、interest、statement、card 一起看。",
  },
  Insurance: {
    commonSections: ["Part 5", "Part 7"],
    commonContexts: ["Policy", "Claim", "Coverage"],
    reminder: "保險題常考 premium、coverage、claim、deductible 的差異。",
  },
  Purchasing: {
    commonSections: ["Part 5", "Part 6", "Part 7"],
    commonContexts: ["Quotation", "Vendor Email", "Purchase Order"],
    reminder: "採購字常和 supplier、quotation、order、price、delivery 連動出現。",
  },
  Logistics: {
    commonSections: ["Part 3", "Part 4", "Part 7"],
    commonContexts: ["Shipping", "Warehouse", "Delivery Notice"],
    reminder: "物流題要抓 shipment、warehouse、carrier、delivery、tracking。",
  },
  "Supply Chain": {
    commonSections: ["Part 3", "Part 4", "Part 7"],
    commonContexts: ["Shipment", "Inventory", "Supplier Update"],
    reminder: "供應鏈字常和 lead time、inventory、supplier、distribution 一起出現。",
  },
  Manufacturing: {
    commonSections: ["Part 3", "Part 4", "Part 7"],
    commonContexts: ["Factory Report", "Maintenance", "Production"],
    reminder: "製造情境常考 production line、equipment、capacity、raw material。",
  },
  Maintenance: {
    commonSections: ["Part 3", "Part 4", "Part 7"],
    commonContexts: ["Repair Notice", "Maintenance Log", "Inspection"],
    reminder: "維修題常抓 downtime、repair、inspection、schedule 這幾類關鍵字。",
  },
  "Quality Control": {
    commonSections: ["Part 5", "Part 7"],
    commonContexts: ["Inspection Report", "Factory Memo", "Defect Notice"],
    reminder: "品管題要注意 defect、inspection、quality control、standard 之間的關係。",
  },
  Engineering: {
    commonSections: ["Part 4", "Part 7"],
    commonContexts: ["Specification", "Blueprint", "System Setup"],
    reminder: "工程字常出現在規格、設備、校正與系統設定情境中。",
  },
  Technology: {
    commonSections: ["Part 3", "Part 4", "Part 7"],
    commonContexts: ["System Update", "Help Desk", "Security Notice"],
    reminder: "科技題常抓 system、access、backup、configuration、security。",
  },
  Marketing: {
    commonSections: ["Part 5", "Part 7"],
    commonContexts: ["Campaign", "Promotion", "Market Report"],
    reminder: "行銷字常和 campaign、brand、market share、consumer 一起出現。",
  },
  Sales: {
    commonSections: ["Part 2", "Part 3", "Part 7"],
    commonContexts: ["Sales Call", "Forecast", "Client Visit"],
    reminder: "業務題常搭配 prospect、proposal、sale、forecast、commission。",
  },
  "Customer Service": {
    commonSections: ["Part 2", "Part 3", "Part 7"],
    commonContexts: ["Customer Email", "Complaint", "Refund"],
    reminder: "客服題要看清問題、處理方式與後續跟進動作。",
  },
  Contract: {
    commonSections: ["Part 5", "Part 7"],
    commonContexts: ["Agreement", "Amendment", "Legal Notice"],
    reminder: "合約字常和 term、renewal、confidentiality、approval 一起考。",
  },
  Email: {
    commonSections: ["Part 6", "Part 7"],
    commonContexts: ["Email", "Attachment", "Confirmation"],
    reminder: "Email 題通常要抓收件目的、附件內容與下一步動作。",
  },
  Travel: {
    commonSections: ["Part 2", "Part 3", "Part 7"],
    commonContexts: ["Itinerary", "Reservation", "Travel Notice"],
    reminder: "旅行字常和 schedule、reservation、itinerary、cancellation 一起出現。",
  },
  Hotel: {
    commonSections: ["Part 2", "Part 3", "Part 7"],
    commonContexts: ["Hotel Email", "Reservation", "Front Desk"],
    reminder: "住宿題常考 room、reservation、guest、check-in、service。",
  },
  Airport: {
    commonSections: ["Part 2", "Part 3", "Part 7"],
    commonContexts: ["Boarding", "Gate Notice", "Flight Change"],
    reminder: "機場題先聽懂 gate、boarding、arrival、departure 這些字。",
  },
  Dining: {
    commonSections: ["Part 2", "Part 7"],
    commonContexts: ["Restaurant Notice", "Menu", "Reservation"],
    reminder: "餐飲題常和 meal、reservation、service、guest experience 有關。",
  },
  Entertainment: {
    commonSections: ["Part 3", "Part 7"],
    commonContexts: ["Event", "Ticket", "Venue Notice"],
    reminder: "活動題常抓時間、地點、票務與入場安排。",
  },
  "Human Resources": {
    commonSections: ["Part 5", "Part 7"],
    commonContexts: ["Hiring", "Appraisal", "Training"],
    reminder: "人資字常和 applicant、training、appraisal、benefit 一起出現。",
  },
  Healthcare: {
    commonSections: ["Part 2", "Part 7"],
    commonContexts: ["Clinic", "Consultation", "Prescription"],
    reminder: "醫療情境常考 appointment、consultation、prescription、insurance。",
  },
};

const confusingWordMap = {
  invoice: ["receipt", "quotation", "bill"],
  quotation: ["invoice", "receipt", "estimate"],
  receipt: ["invoice", "quotation", "refund"],
  asset: ["liability", "equity", "expense"],
  liability: ["asset", "equity", "expense"],
  equity: ["asset", "liability", "stock"],
  procurement: ["purchase order", "quotation", "supplier"],
  shipment: ["delivery", "cargo", "warehouse"],
  warehouse: ["inventory", "shipment", "distribution center"],
  itinerary: ["schedule", "reservation", "boarding"],
  premium: ["fee", "coverage", "claim"],
  proposal: ["quotation", "plan", "contract"],
};

function buildToeicTips(seed, profile) {
  if (profile.toeicTips) {
    return profile.toeicTips;
  }

  if (!topPriorityWordSet.has(headwordOf(seed.word))) {
    return null;
  }

  const categoryTips = toeicCategoryTips[seed.category] ?? {
    commonSections: ["Part 5", "Part 7"],
    commonContexts: [seed.category, buildTheme(seed.category).replace(" English", "")],
    reminder: `${seed.word} 常出現在 ${seed.category} 相關情境中，先看搭配詞再判斷意思。`,
  };

  return {
    commonSections: categoryTips.commonSections,
    commonContexts: categoryTips.commonContexts,
    confusableWords: confusingWordMap[headwordOf(seed.word)] ?? [],
    reminder: categoryTips.reminder,
  };
}

function buildMemoryTip(seed, profile) {
  if (cleanText(profile.memoryTip)) {
    return cleanText(profile.memoryTip);
  }

  if (!topPriorityWordSet.has(headwordOf(seed.word))) {
    return "";
  }

  const roots = uniqueList(profile.roots ?? []);
  const collocations = uniqueList(profile.collocations ?? seed.collocations ?? []);
  const related = uniqueList([...(profile.relatedWords ?? []), ...(profile.synonyms ?? [])]).slice(0, 3);

  if (roots.length > 0) {
    return `${seed.word} 可以從字根字首來記：${roots.join("；")}。再搭配 ${collocations.slice(0, 2).join("、")} 這些常見用法一起記，會更容易記住。`;
  }

  if (related.length > 0) {
    return `${seed.word} 常和 ${related.join("、")} 一起出現在 ${seed.category} 情境中，可以用同一個主題一起記憶。`;
  }

  if (collocations.length > 0) {
    return `${seed.word} 常見搭配有 ${collocations.slice(0, 2).join("、")}，把搭配詞和情境一起記，比單背中文更有效。`;
  }

  return `${seed.word} 常出現在 ${seed.category} 情境中，建議連同例句一起朗讀，幫助記住實際用法。`;
}

const collocationVerbSet = new Set([
  "accept",
  "adjust",
  "analyze",
  "approve",
  "archive",
  "arrange",
  "assist",
  "attend",
  "book",
  "build",
  "calculate",
  "check",
  "collect",
  "compare",
  "complete",
  "confirm",
  "contact",
  "coordinate",
  "deliver",
  "draft",
  "evaluate",
  "fill",
  "fulfill",
  "handle",
  "improve",
  "increase",
  "inspect",
  "issue",
  "join",
  "launch",
  "maintain",
  "manage",
  "monitor",
  "negotiate",
  "operate",
  "order",
  "pay",
  "place",
  "prepare",
  "print",
  "process",
  "produce",
  "promote",
  "protect",
  "provide",
  "reach",
  "receive",
  "record",
  "reduce",
  "register",
  "renew",
  "repair",
  "replace",
  "request",
  "reserve",
  "resolve",
  "review",
  "schedule",
  "select",
  "send",
  "serve",
  "set",
  "share",
  "ship",
  "sign",
  "sort",
  "submit",
  "support",
  "track",
  "train",
  "transfer",
  "update",
  "verify",
  "visit",
  "write",
]);

function buildExampleFromCollocation(seed, collocations) {
  const primary = collocations[0];
  if (!primary) {
    return null;
  }

  const parts = cleanText(primary).split(" ");
  const verb = headwordOf(parts[0]);

  if (!collocationVerbSet.has(verb)) {
    return null;
  }

  if (seed.partOfSpeech === "verb") {
    return {
      example: `The operations team will ${primary} this week.`,
      exampleZh: `營運團隊將於本週完成與「${seed.meaning}」有關的工作。`,
    };
  }

  return {
    example: `The staff will ${primary} after confirming the details.`,
    exampleZh: `工作人員會在確認細節後處理與「${seed.meaning}」相關的事項。`,
  };
}

function buildGenericExample(seed) {
  const collocationExample = buildExampleFromCollocation(seed, seed.collocations ?? []);
  if (collocationExample) {
    return collocationExample;
  }

  if (seed.partOfSpeech === "verb") {
    if (["Purchasing", "Supply Chain", "Logistics"].includes(seed.category)) {
      return {
        example: `Please ${seed.word} the order after the vendor confirms the price.`,
        exampleZh: `請在供應商確認價格後，完成這筆訂單的「${seed.meaning}」作業。`,
      };
    }

    if (["Manufacturing", "Maintenance", "Engineering", "Quality Control"].includes(seed.category)) {
      return {
        example: `The technician will ${seed.word} the equipment this morning.`,
        exampleZh: `技術人員今天上午會對設備進行「${seed.meaning}」相關作業。`,
      };
    }

    return {
      example: `Please ${seed.word} the document and share it with the team.`,
      exampleZh: `請完成這份文件的「${seed.meaning}」處理後，再與團隊分享。`,
    };
  }

  if (seed.partOfSpeech === "adjective") {
    if (["Finance", "Accounting", "Banking", "Insurance"].includes(seed.category)) {
      return {
        example: `The manager requested a ${seed.word} financial report.`,
        exampleZh: `主管要求一份更「${seed.meaning}」的財務報告。`,
      };
    }

    return {
      example: `The manager asked for a ${seed.word} plan.`,
      exampleZh: `主管要求提出一份更「${seed.meaning}」的計畫。`,
    };
  }

  if (["Finance", "Accounting", "Banking", "Insurance"].includes(seed.category)) {
    return {
      example: `The finance team discussed the ${seed.word} figures in the monthly report.`,
      exampleZh: `財務團隊在月報中討論了與「${seed.meaning}」有關的數據。`,
    };
  }

  if (["Purchasing", "Supply Chain", "Logistics"].includes(seed.category)) {
    return {
      example: `The purchasing team checked the ${seed.word} before releasing the order.`,
      exampleZh: `採購團隊在放行訂單前，確認了與「${seed.meaning}」有關的資料。`,
    };
  }

  if (["Manufacturing", "Maintenance", "Engineering", "Quality Control"].includes(seed.category)) {
    return {
      example: `Plant staff monitored the ${seed.word} during the morning shift.`,
      exampleZh: `工廠人員在早班期間監控了與「${seed.meaning}」有關的狀況。`,
    };
  }

  if (["Travel", "Hotel", "Airport", "Dining", "Entertainment"].includes(seed.category)) {
    return {
      example: `The staff confirmed the ${seed.word} for tomorrow's visitors.`,
      exampleZh: `服務人員已確認明天訪客的「${seed.meaning}」安排。`,
    };
  }

  if (["Customer Service", "Contract", "Email"].includes(seed.category)) {
    return {
      example: `Customer service checked the ${seed.word} before replying to the client.`,
      exampleZh: `客服在回覆客戶前，先確認了與「${seed.meaning}」相關的內容。`,
    };
  }

  return {
    example: `The department included the ${seed.word} in this week's update.`,
    exampleZh: `部門在本週更新中納入了與「${seed.meaning}」有關的內容。`,
  };
}

function buildEntry(seed) {
  const profile = mergedWordQualityProfiles[headwordOf(seed.word)] ?? {};
  const fallbackExample = buildGenericExample(seed);

  return {
    id: `vw-${slugifyWord(seed.word)}`,
    word: seed.word,
    meaning: seed.meaning,
    partOfSpeech: seed.partOfSpeech,
    pronunciation: buildPronunciation(seed.word, profile.pronunciation, seed.pronunciation),
    example: cleanText(profile.example) || seed.example || fallbackExample.example,
    exampleZh: cleanText(profile.exampleZh) || seed.exampleZh || fallbackExample.exampleZh,
    collocations: uniqueList(profile.collocations ?? seed.collocations ?? []),
    synonyms: uniqueList(profile.synonyms ?? []),
    antonyms: uniqueList(profile.antonyms ?? []),
    roots: uniqueList(profile.roots ?? []),
    wordFamily: uniqueList(profile.wordFamily ?? []),
    relatedWords: uniqueList(profile.relatedWords ?? []).filter(
      (relatedWord) => headwordOf(relatedWord) !== headwordOf(seed.word),
    ),
    toeicTips: buildToeicTips(seed, profile),
    memoryTip: buildMemoryTip(seed, profile),
    category: seed.category,
    categoryZh: seed.categoryZh,
    level: seed.level,
    frequency: seed.frequency,
    isFavorite: false,
    wrongCount: 0,
    mastered: false,
    theme: buildTheme(seed.category),
  };
}

export const vocabularyBank = [...canonicalSeedMap.values()]
  .map(buildEntry)
  .sort((left, right) => left.word.localeCompare(right.word));

export const vocabularyIdAliases = vocabularyBank.reduce((aliases, item) => {
  aliases[item.id] = item.id;
  return aliases;
}, {});

export const vocabularyPartOfSpeechOptions = [
  ...new Set(vocabularyBank.map((item) => item.partOfSpeech)),
]
  .sort()
  .map((item) => ({ id: item, label: item }));

function looksFakeWordFamily(headword, familyWord) {
  const normalizedHeadword = headwordOf(headword);
  const normalizedFamilyWord = headwordOf(familyWord);

  if (!normalizedFamilyWord || normalizedHeadword === normalizedFamilyWord) {
    return false;
  }

  if (approvedFamilyWordSet.has(normalizedFamilyWord) || validMultiWordTermSet.has(normalizedFamilyWord)) {
    return false;
  }

  const naiveForms = new Set([
    `${normalizedHeadword}er`,
    `${normalizedHeadword}ing`,
    `${normalizedHeadword}ed`,
  ]);
  const trimmed = normalizedHeadword.replace(/e$/, "");
  naiveForms.add(`${trimmed}ing`);
  naiveForms.add(`${trimmed}ed`);

  return naiveForms.has(normalizedFamilyWord);
}

function buildVocabularyQualityReport() {
  const duplicateWords = vocabularyBank.length - new Set(vocabularyBank.map((item) => headwordOf(item.word))).size;
  const suspectedFakeWordFamily = vocabularyBank.reduce(
    (count, item) =>
      count +
      (item.wordFamily ?? []).filter((familyWord) => looksFakeWordFamily(item.word, familyWord)).length,
    0,
  );
  const suspectedFakePhrase = vocabularyBank.filter((item) => looksRetiredGeneratorArtifact(item.word)).length;
  const missingTranslation = vocabularyBank.filter((item) => !cleanText(item.meaning)).length;
  const missingExample = vocabularyBank.filter(
    (item) => !cleanText(item.example) || !cleanText(item.exampleZh),
  ).length;

  const issueWeight =
    duplicateWords * 5 +
    suspectedFakeWordFamily * 5 +
    suspectedFakePhrase * 5 +
    missingTranslation * 3 +
    missingExample * 3;

  return {
    totalWords: vocabularyBank.length,
    duplicateWords,
    suspectedFakeWordFamily,
    suspectedFakePhrase,
    missingTranslation,
    missingExample,
    removedFakeData: duplicateSourceCount,
    vocabularyQualityScore: Math.max(
      0,
      Math.round(100 - (issueWeight / Math.max(1, vocabularyBank.length)) * 100),
    ),
  };
}

export const vocabularyQualityReport = buildVocabularyQualityReport();

export const vocabularyDataSources = [
  "src/data/vocabulary/index.js",
  "src/data/vocabulary/catalog.js",
  "src/data/vocabulary/expansion-seeds.js",
  "src/data/vocabulary/high-frequency-profiles.js",
];

export {
  vocabularyCategories,
  vocabularyFrequencyOptions,
  vocabularyLevels,
  vocabularyThemes,
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
  dataSources: vocabularyDataSources,
  quality: vocabularyQualityReport,
};
