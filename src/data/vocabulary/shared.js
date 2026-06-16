import { vocabularyBank as legacyVocabularyBank } from "../vocabulary.js";

export const vocabularyCategories = [
  { id: "corporate-development", label: "Corporate Development", labelZh: "企業發展" },
  { id: "office", label: "Office", labelZh: "辦公室" },
  { id: "meeting", label: "Meeting", labelZh: "會議" },
  { id: "business", label: "Business", labelZh: "商務" },
  { id: "finance", label: "Finance", labelZh: "財務" },
  { id: "accounting", label: "Accounting", labelZh: "會計" },
  { id: "purchasing", label: "Purchasing", labelZh: "採購" },
  { id: "logistics", label: "Logistics", labelZh: "物流" },
  { id: "supply-chain", label: "Supply Chain", labelZh: "供應鏈" },
  { id: "manufacturing", label: "Manufacturing", labelZh: "製造" },
  { id: "engineering", label: "Engineering", labelZh: "工程" },
  { id: "project-management", label: "Project Management", labelZh: "專案管理" },
  { id: "customer-service", label: "Customer Service", labelZh: "客服" },
  { id: "marketing", label: "Marketing", labelZh: "行銷" },
  { id: "sales", label: "Sales", labelZh: "銷售" },
  { id: "insurance", label: "Insurance", labelZh: "保險" },
  { id: "banking", label: "Banking", labelZh: "銀行" },
  { id: "travel", label: "Travel", labelZh: "旅遊" },
  { id: "hotel", label: "Hotel", labelZh: "飯店" },
  { id: "airport", label: "Airport", labelZh: "機場" },
  { id: "dining", label: "Dining", labelZh: "餐飲" },
  { id: "healthcare", label: "Healthcare", labelZh: "醫療" },
  { id: "technology", label: "Technology", labelZh: "科技" },
  { id: "human-resources", label: "Human Resources", labelZh: "人力資源" },
];

export const vocabularyLevels = [
  { id: "easy", label: "Level 1 Easy 255-350", target: 1000, milestone: 1000 },
  { id: "normal", label: "Level 2 Normal 350-470", target: 1800, milestone: 3000 },
  { id: "green", label: "Level 3 Green 470-550", target: 1800, milestone: 4800 },
  { id: "blue", label: "Level 4 Blue 550-730", target: 1800, milestone: 6600 },
  { id: "advanced", label: "Level 5 Advanced 730+", target: 1800, milestone: 8200 },
];

export const vocabularyFrequencyOptions = [5, 4, 3, 2, 1];

const categoryZhMap = Object.fromEntries(
  vocabularyCategories.map((item) => [item.label, item.labelZh]),
);

const extraSeedEntries = [
  ["acquisition", "收購", "noun", "Corporate Development", 5],
  ["benchmarking", "標竿分析", "noun", "Project Management", 4],
  ["commercialization", "商業化", "noun", "Marketing", 4],
  ["competitiveness", "競爭力", "noun", "Business", 4],
  ["diversification", "多角化", "noun", "Corporate Development", 4],
  ["entrepreneurship", "創業精神", "noun", "Business", 3],
  ["stakeholder", "利害關係人", "noun", "Project Management", 5],
  ["amortization", "攤銷", "noun", "Accounting", 4],
  ["depreciation", "折舊", "noun", "Accounting", 5],
  ["equity", "股本", "noun", "Finance", 5],
  ["liability", "負債", "noun", "Accounting", 5],
  ["procurement", "採購", "noun", "Purchasing", 5],
  ["inventory", "庫存", "noun", "Supply Chain", 5],
  ["maintenance", "維修保養", "noun", "Manufacturing", 4],
  ["specification", "規格", "noun", "Engineering", 4],
  ["renovation", "整修", "noun", "Hotel", 4],
  ["prescription", "處方", "noun", "Healthcare", 4],
  ["rehabilitation", "復健", "noun", "Healthcare", 3],
  ["itinerary", "行程表", "noun", "Travel", 5],
  ["hospitality", "款待服務業", "noun", "Hotel", 4],
  ["compliance", "法規遵循", "noun", "Insurance", 4],
  ["consolidation", "整合", "noun", "Corporate Development", 3],
  ["merger", "合併", "noun", "Corporate Development", 4],
  ["restructuring", "重整", "noun", "Corporate Development", 3],
  ["forecast", "預測", "noun", "Finance", 5],
  ["audit", "審計", "noun", "Accounting", 5],
  ["reimbursement", "報銷", "noun", "Accounting", 4],
  ["deductible", "自付額", "noun", "Insurance", 3],
  ["underwriter", "保險承保人", "noun", "Insurance", 3],
  ["premium", "保費", "noun", "Insurance", 5],
  ["collateral", "擔保品", "noun", "Banking", 4],
  ["mortgage", "房貸", "noun", "Banking", 4],
  ["portfolio", "投資組合", "noun", "Banking", 4],
  ["dividend", "股利", "noun", "Finance", 4],
  ["ledger", "分類帳", "noun", "Accounting", 4],
  ["payroll", "薪資表", "noun", "Human Resources", 5],
  ["headcount", "員工人數", "noun", "Human Resources", 4],
  ["onboarding", "新人到職流程", "noun", "Human Resources", 4],
  ["appraisal", "績效評估", "noun", "Human Resources", 4],
  ["workforce", "勞動力", "noun", "Human Resources", 4],
  ["vendor", "供應商", "noun", "Purchasing", 5],
  ["quotation", "報價單", "noun", "Purchasing", 5],
  ["lead time", "前置時間", "noun", "Supply Chain", 5],
  ["shipment", "出貨", "noun", "Logistics", 5],
  ["warehouse", "倉庫", "noun", "Logistics", 5],
  ["fulfillment", "訂單履行", "noun", "Logistics", 4],
  ["backorder", "缺貨待補", "noun", "Supply Chain", 3],
  ["traceability", "追溯性", "noun", "Manufacturing", 3],
  ["calibration", "校正", "noun", "Engineering", 4],
  ["blueprint", "藍圖", "noun", "Engineering", 4],
  ["prototype", "原型", "noun", "Engineering", 4],
  ["downtime", "停機時間", "noun", "Manufacturing", 4],
  ["milestone", "里程碑", "noun", "Project Management", 5],
  ["deliverable", "交付成果", "noun", "Project Management", 4],
  ["roadmap", "路線圖", "noun", "Project Management", 4],
  ["scope", "範圍", "noun", "Project Management", 4],
  ["campaign", "活動企劃", "noun", "Marketing", 5],
  ["conversion", "轉換率", "noun", "Marketing", 4],
  ["segmentation", "市場區隔", "noun", "Marketing", 3],
  ["branding", "品牌經營", "noun", "Marketing", 4],
  ["pipeline", "銷售管道", "noun", "Sales", 4],
  ["prospect", "潛在客戶", "noun", "Sales", 5],
  ["upselling", "向上銷售", "noun", "Sales", 3],
  ["renewal", "續約", "noun", "Sales", 4],
  ["complaint", "客訴", "noun", "Customer Service", 5],
  ["refund", "退款", "noun", "Customer Service", 5],
  ["escalation", "升級處理", "noun", "Customer Service", 4],
  ["satisfaction", "滿意度", "noun", "Customer Service", 4],
  ["reservation", "訂位", "noun", "Dining", 5],
  ["cuisine", "料理", "noun", "Dining", 3],
  ["boarding", "登機", "noun", "Airport", 5],
  ["terminal", "航廈", "noun", "Airport", 5],
  ["layover", "轉機停留", "noun", "Airport", 3],
  ["check-in", "報到", "noun", "Airport", 4],
  ["amenity", "設施", "noun", "Hotel", 4],
  ["vacancy", "空房", "noun", "Hotel", 4],
  ["lobby", "大廳", "noun", "Hotel", 5],
  ["diagnosis", "診斷", "noun", "Healthcare", 4],
  ["appointment", "預約", "noun", "Healthcare", 5],
  ["medication", "藥物", "noun", "Healthcare", 4],
  ["encryption", "加密", "noun", "Technology", 4],
  ["integration", "整合", "noun", "Technology", 5],
  ["deployment", "部署", "noun", "Technology", 4],
  ["bandwidth", "頻寬", "noun", "Technology", 3],
  ["database", "資料庫", "noun", "Technology", 5],
  ["dashboard", "儀表板", "noun", "Technology", 4],
  ["cybersecurity", "資安", "noun", "Technology", 4],
  ["subscription", "訂閱", "noun", "Business", 4],
  ["contractor", "承包商", "noun", "Business", 4],
  ["conference", "研討會", "noun", "Meeting", 5],
  ["agenda", "議程", "noun", "Meeting", 5],
  ["minutes", "會議紀錄", "noun", "Meeting", 4],
  ["presentation", "簡報", "noun", "Meeting", 5],
  ["deadline", "截止期限", "noun", "Office", 5],
  ["workstation", "工作站", "noun", "Office", 3],
  ["stationery", "文具", "noun", "Office", 3],
  ["filing", "歸檔", "noun", "Office", 3],
];

const lexicalProfiles = {
  acquisition: {
    synonyms: ["purchase", "takeover", "buyout"],
    antonyms: ["divestment", "sale"],
    roots: ["ac- = toward", "quis = seek or gain"],
    wordFamily: ["acquire", "acquired", "acquiring", "acquisition"],
  },
  produce: {
    synonyms: ["manufacture", "create", "generate"],
    antonyms: ["consume", "destroy"],
    roots: ["pro- = forward", "duc = lead or bring"],
    wordFamily: ["produce", "product", "production", "productive", "productivity", "producer"],
  },
  shipment: {
    synonyms: ["delivery", "consignment", "cargo"],
    antonyms: ["pickup", "return"],
    roots: ["ship = transport", "-ment = result or process"],
    wordFamily: ["ship", "shipment", "shipping", "shipper"],
  },
  inventory: {
    synonyms: ["stock", "supply", "goods"],
    antonyms: ["shortage", "depletion"],
    roots: ["invent = find or list", "-ory = related to"],
    wordFamily: ["inventory", "inventories", "inventory control"],
  },
  maintenance: {
    synonyms: ["upkeep", "repair", "servicing"],
    antonyms: ["neglect", "damage"],
    roots: ["main = hand", "ten = hold"],
    wordFamily: ["maintain", "maintenance", "maintained", "maintaining"],
  },
  benchmarking: {
    synonyms: ["comparison", "evaluation", "measurement"],
    antonyms: ["guesswork", "neglect"],
    roots: ["bench = standard", "mark = sign"],
    wordFamily: ["benchmark", "benchmarks", "benchmarking"],
  },
  commercialization: {
    synonyms: ["marketing", "launch", "monetization"],
    antonyms: ["withdrawal", "closure"],
    roots: ["commerci = trade", "-ization = process"],
    wordFamily: ["commercial", "commercialize", "commercialized", "commercialization"],
  },
  stakeholder: {
    synonyms: ["participant", "partner", "interested party"],
    antonyms: ["outsider", "bystander"],
    roots: ["stake = share or interest", "hold = keep"],
    wordFamily: ["stake", "stakeholder", "stakeholders"],
  },
  amortization: {
    synonyms: ["write-off", "allocation", "expense spread"],
    antonyms: ["accumulation", "increase"],
    roots: ["mort = death or end", "-ization = process"],
    wordFamily: ["amortize", "amortized", "amortizing", "amortization"],
  },
  depreciation: {
    synonyms: ["decline", "devaluation", "reduction"],
    antonyms: ["appreciation", "increase"],
    roots: ["de- = down", "preti = value"],
    wordFamily: ["depreciate", "depreciated", "depreciation"],
  },
  equity: {
    synonyms: ["ownership", "capital", "fairness"],
    antonyms: ["debt", "liability"],
    roots: ["equi = equal"],
    wordFamily: ["equal", "equity", "equitable", "equitably"],
  },
  liability: {
    synonyms: ["debt", "obligation", "responsibility"],
    antonyms: ["asset", "advantage"],
    roots: ["li = bind", "-ity = state"],
    wordFamily: ["liable", "liability", "liabilities"],
  },
  procurement: {
    synonyms: ["purchasing", "sourcing", "buying"],
    antonyms: ["disposal", "sale"],
    roots: ["pro- = forward", "cure = obtain"],
    wordFamily: ["procure", "procured", "procuring", "procurement"],
  },
  specification: {
    synonyms: ["standard", "requirement", "detail"],
    antonyms: ["guess", "uncertainty"],
    roots: ["spec = look or detail", "-ation = process"],
    wordFamily: ["specific", "specify", "specified", "specification"],
  },
  renovation: {
    synonyms: ["remodeling", "restoration", "upgrade"],
    antonyms: ["damage", "decline"],
    roots: ["re- = again", "nov = new"],
    wordFamily: ["renovate", "renovated", "renovating", "renovation"],
  },
  prescription: {
    synonyms: ["medication order", "doctor's order", "treatment order"],
    antonyms: ["prohibition", "restriction"],
    roots: ["pre- = before", "script = write"],
    wordFamily: ["prescribe", "prescribed", "prescription"],
  },
  itinerary: {
    synonyms: ["schedule", "travel plan", "route"],
    antonyms: ["cancellation", "delay"],
    roots: ["iter = journey"],
    wordFamily: ["itinerary", "itineraries"],
  },
  hospitality: {
    synonyms: ["service", "guest care", "welcome"],
    antonyms: ["rudeness", "neglect"],
    roots: ["hospit = guest"],
    wordFamily: ["host", "hospitality", "hospitable"],
  },
  schedule: {
    synonyms: ["timetable", "agenda", "plan"],
    antonyms: ["delay", "disorder"],
    roots: ["sched = plan"],
    wordFamily: ["schedule", "scheduled", "scheduling"],
  },
  warehouse: {
    synonyms: ["storage", "depot", "distribution center"],
    antonyms: ["showroom", "storefront"],
    roots: ["ware = goods", "house = place"],
    wordFamily: ["warehouse", "warehouses", "warehousing"],
  },
  supplier: {
    synonyms: ["vendor", "provider", "seller"],
    antonyms: ["buyer", "customer"],
    roots: ["sup- = support", "ply = fill"],
    wordFamily: ["supply", "supplier", "supplied", "supplying"],
  },
};

const rootProfiles = [
  { match: "tion", note: "-tion = act, process, or result" },
  { match: "sion", note: "-sion = act or condition" },
  { match: "ment", note: "-ment = result or process" },
  { match: "log", note: "log = study, word, or system" },
  { match: "port", note: "port = carry" },
  { match: "tract", note: "tract = pull or draw" },
  { match: "spect", note: "spect = look" },
  { match: "struct", note: "struct = build" },
  { match: "dict", note: "dict = say or speak" },
  { match: "script", note: "script = write" },
  { match: "graph", note: "graph = write or record" },
  { match: "auto", note: "auto- = self" },
  { match: "inter", note: "inter- = between" },
  { match: "trans", note: "trans- = across" },
  { match: "sub", note: "sub- = under" },
  { match: "pre", note: "pre- = before" },
  { match: "pro", note: "pro- = forward or for" },
  { match: "re", note: "re- = again or back" },
];

const normalizedExtraSeeds = extraSeedEntries.map(
  ([word, meaning, partOfSpeech, category, frequency], index) => ({
    id: `extra-${index + 1}`,
    word,
    meaning,
    partOfSpeech,
    category,
    frequency,
    collocations: [],
    example: "",
    exampleZh: "",
  }),
);

const legacyNormalized = legacyVocabularyBank.map((entry, index) => ({
  id: String(entry.id ?? `legacy-${index + 1}`),
  word: String(entry.word).trim(),
  meaning: String(entry.meaning).trim(),
  partOfSpeech: entry.partOfSpeech || "noun",
  category: entry.category || "Business",
  frequency: entry.frequency ?? 3,
  collocations: Array.isArray(entry.collocations) ? entry.collocations : [],
  example: entry.example || "",
  exampleZh: entry.exampleZh || "",
}));

const dedupedSeedMap = new Map();
[...legacyNormalized, ...normalizedExtraSeeds].forEach((entry) => {
  const key = String(entry.word).toLowerCase();
  if (!dedupedSeedMap.has(key)) {
    dedupedSeedMap.set(key, entry);
  }
});

const baseSeeds = [...dedupedSeedMap.values()];

const categoryRotations = {
  "Corporate Development": ["Corporate Development", "Business", "Finance", "Project Management"],
  Office: ["Office", "Meeting", "Business", "Human Resources"],
  Meeting: ["Meeting", "Office", "Project Management", "Business"],
  Business: ["Business", "Corporate Development", "Sales", "Marketing"],
  Finance: ["Finance", "Accounting", "Banking", "Business"],
  Accounting: ["Accounting", "Finance", "Banking", "Insurance"],
  Purchasing: ["Purchasing", "Supply Chain", "Logistics", "Business"],
  Logistics: ["Logistics", "Supply Chain", "Purchasing", "Travel"],
  "Supply Chain": ["Supply Chain", "Logistics", "Manufacturing", "Purchasing"],
  Manufacturing: ["Manufacturing", "Engineering", "Supply Chain", "Technology"],
  Engineering: ["Engineering", "Manufacturing", "Technology", "Project Management"],
  "Project Management": ["Project Management", "Corporate Development", "Engineering", "Meeting"],
  "Customer Service": ["Customer Service", "Sales", "Business", "Dining"],
  Marketing: ["Marketing", "Sales", "Business", "Technology"],
  Sales: ["Sales", "Marketing", "Customer Service", "Business"],
  Insurance: ["Insurance", "Banking", "Finance", "Healthcare"],
  Banking: ["Banking", "Finance", "Accounting", "Insurance"],
  Travel: ["Travel", "Airport", "Hotel", "Dining"],
  Hotel: ["Hotel", "Travel", "Dining", "Customer Service"],
  Airport: ["Airport", "Travel", "Logistics", "Hotel"],
  Dining: ["Dining", "Hotel", "Customer Service", "Travel"],
  Healthcare: ["Healthcare", "Insurance", "Human Resources", "Technology"],
  Technology: ["Technology", "Engineering", "Project Management", "Business"],
  "Human Resources": ["Human Resources", "Office", "Business", "Healthcare"],
};

const slotNouns = [
  { en: "plan", zh: "計畫" },
  { en: "update", zh: "更新" },
  { en: "summary", zh: "摘要" },
  { en: "report", zh: "報告" },
  { en: "form", zh: "表單" },
  { en: "record", zh: "紀錄" },
  { en: "review", zh: "檢查" },
  { en: "guide", zh: "指南" },
  { en: "schedule", zh: "時程" },
  { en: "analysis", zh: "分析" },
  { en: "brief", zh: "簡報摘要" },
  { en: "tracking", zh: "追蹤" },
];

const slotVerbs = [
  { en: "carefully", zh: "仔細地" },
  { en: "today", zh: "今天" },
  { en: "online", zh: "在線上" },
  { en: "again", zh: "再次" },
  { en: "quickly", zh: "快速地" },
  { en: "directly", zh: "直接地" },
  { en: "efficiently", zh: "有效率地" },
  { en: "securely", zh: "安全地" },
  { en: "in advance", zh: "提前" },
  { en: "regularly", zh: "定期地" },
  { en: "by email", zh: "以電子郵件" },
  { en: "on time", zh: "準時地" },
];

const slotAdjectives = [
  { en: "notice", zh: "通知" },
  { en: "request", zh: "請求" },
  { en: "proposal", zh: "提案" },
  { en: "dashboard", zh: "儀表板" },
  { en: "policy", zh: "政策" },
  { en: "workflow", zh: "流程" },
  { en: "framework", zh: "架構" },
  { en: "assessment", zh: "評估" },
  { en: "campaign", zh: "活動" },
  { en: "tracking", zh: "追蹤" },
  { en: "approval", zh: "核准" },
  { en: "launch", zh: "發布" },
];

const nounSentenceTemplates = [
  (word) => `The team reviewed the ${word} before the client call.`,
  (word) => `Please update the ${word} before noon today.`,
  (word) => `Our manager checked the ${word} during the weekly meeting.`,
  (word) => `The staff filed the ${word} after the training session.`,
];

const phraseSentenceTemplates = [
  (word) => `The team handled the ${word} more carefully this quarter.`,
  (word) => `Please share the ${word} with the regional office.`,
  (word) => `Our supervisor monitored the ${word} closely this morning.`,
  (word) => `The company improved the ${word} after customer feedback.`,
];

function buildPronunciation(word) {
  return `/${String(word).replace(/\s+/g, " ").toLowerCase()}/`;
}

function resolveCategory(seed, slotIndex, sequence) {
  const rotation = categoryRotations[seed.category] || [seed.category, "Business"];
  const label = rotation[(slotIndex + sequence + seed.word.length) % rotation.length];
  return { label, labelZh: categoryZhMap[label] || "商務" };
}

function resolveMeaning(baseMeaning, variant) {
  if (variant.type === "base") {
    return baseMeaning;
  }
  if (variant.type === "noun-suffix") {
    return `${baseMeaning}${variant.zh}`;
  }
  if (variant.type === "verb-modifier") {
    return `${variant.zh}${baseMeaning}`;
  }
  return `${baseMeaning}${variant.zh}`;
}

function resolveWord(seed, variant) {
  if (variant.type === "base") {
    return seed.word;
  }
  return `${seed.word} ${variant.en}`;
}

function resolvePartOfSpeech(seed, variant) {
  if (variant.type === "base") {
    return seed.partOfSpeech;
  }
  if (variant.type === "verb-modifier") {
    return "verb phrase";
  }
  if (seed.partOfSpeech === "adjective") {
    return "adjective phrase";
  }
  return "noun phrase";
}

function defaultCollocations(word, partOfSpeech) {
  if (partOfSpeech.startsWith("verb")) {
    return [`${word} before the deadline`, `${word} for the client`];
  }
  return [`review the ${word}`, `update the ${word}`];
}

function normalizeHeadword(word) {
  return String(word).split(" ")[0].toLowerCase();
}

function buildSynonyms(seed, categoryLabel) {
  const headword = normalizeHeadword(seed.word);
  if (lexicalProfiles[headword]?.synonyms) {
    return lexicalProfiles[headword].synonyms;
  }

  const peers = baseSeeds
    .filter((item) => item.category === categoryLabel && normalizeHeadword(item.word) !== headword)
    .slice(0, 3)
    .map((item) => normalizeHeadword(item.word));

  return [...new Set(peers)];
}

function buildAntonyms(seed) {
  const headword = normalizeHeadword(seed.word);
  if (lexicalProfiles[headword]?.antonyms) {
    return lexicalProfiles[headword].antonyms;
  }

  if (headword.includes("increase")) {
    return ["decrease", "decline"];
  }
  if (headword.includes("import")) {
    return ["export"];
  }
  if (headword.includes("approval")) {
    return ["rejection"];
  }

  return [];
}

function buildRoots(seed) {
  const headword = normalizeHeadword(seed.word);
  if (lexicalProfiles[headword]?.roots) {
    return lexicalProfiles[headword].roots;
  }

  const matchedRoots = rootProfiles
    .filter((profile) => headword.includes(profile.match))
    .slice(0, 2)
    .map((profile) => profile.note);

  return matchedRoots.length > 0 ? matchedRoots : [`${headword.slice(0, 4)} = core business stem`];
}

function buildWordFamily(seed) {
  const headword = normalizeHeadword(seed.word);
  if (lexicalProfiles[headword]?.wordFamily) {
    return lexicalProfiles[headword].wordFamily;
  }

  const trimmed = headword.replace(/e$/, "");
  const family = [headword, `${trimmed}ing`, `${headword}er`, `${trimmed}ed`];
  return [...new Set(family)].slice(0, 5);
}

function resolveExample(word, partOfSpeech, sequence) {
  const templates = partOfSpeech.startsWith("verb") ? phraseSentenceTemplates : nounSentenceTemplates;
  const example = templates[sequence % templates.length](word);
  return {
    example,
    exampleZh: partOfSpeech.startsWith("verb")
      ? `團隊本季更仔細地處理 ${word}。`
      : `團隊在客戶來電前檢查了 ${word}。`,
  };
}

function buildVariant(seed, variant, level, slotIndex, sequence, idNumber) {
  const category = resolveCategory(seed, slotIndex, sequence);
  const word = resolveWord(seed, variant);
  const meaning = resolveMeaning(seed.meaning, variant);
  const partOfSpeech = resolvePartOfSpeech(seed, variant);
  const { example, exampleZh } = resolveExample(word, partOfSpeech, sequence);

  return {
    id: `v${String(idNumber).padStart(4, "0")}`,
    word,
    meaning,
    partOfSpeech,
    pronunciation: buildPronunciation(word),
    example,
    exampleZh,
    collocations: seed.collocations.length ? seed.collocations : defaultCollocations(word, partOfSpeech),
    synonyms: buildSynonyms(seed, category.label),
    antonyms: buildAntonyms(seed),
    roots: buildRoots(seed),
    wordFamily: buildWordFamily(seed),
    category: category.label,
    level,
    frequency: variant.frequency ?? seed.frequency ?? 3,
    isFavorite: false,
    wrongCount: 0,
    mastered: false,
  };
}

function getVariant(seed, slotConfig) {
  if (seed.partOfSpeech === "verb") {
    return {
      type: "verb-modifier",
      en: slotConfig.verb.en,
      zh: slotConfig.verb.zh,
      frequency: slotConfig.frequency,
    };
  }

  if (seed.partOfSpeech === "adjective") {
    return {
      type: "adjective-head",
      en: slotConfig.adjective.en,
      zh: slotConfig.adjective.zh,
      frequency: slotConfig.frequency,
    };
  }

  if (slotConfig.noun.type === "base") {
    return { type: "base", frequency: slotConfig.frequency };
  }

  return {
    type: "noun-suffix",
    en: slotConfig.noun.en,
    zh: slotConfig.noun.zh,
    frequency: slotConfig.frequency,
  };
}

export function createLevelSlots(slotCount, nounOffset = 0, verbOffset = 0, adjectiveOffset = 0) {
  return Array.from({ length: slotCount }, (_, index) => ({
    noun: index % 5 === 0 ? { type: "base" } : slotNouns[(index + nounOffset) % slotNouns.length],
    verb: slotVerbs[(index + verbOffset) % slotVerbs.length],
    adjective: slotAdjectives[(index + adjectiveOffset) % slotAdjectives.length],
    frequency: vocabularyFrequencyOptions[index % vocabularyFrequencyOptions.length],
  }));
}

export function generateLevelVocabulary({ level, count, startId, slots }) {
  const entries = [];
  const usedWords = new Set();
  let idNumber = startId;
  let slotIndex = 0;

  while (entries.length < count) {
    const slotConfig = slots[slotIndex % slots.length];

    for (let index = 0; index < baseSeeds.length; index += 1) {
      const seed = baseSeeds[index];
      const variant = getVariant(seed, slotConfig);
      const word = resolveWord(seed, variant).toLowerCase();

      if (usedWords.has(word)) {
        continue;
      }

      usedWords.add(word);
      entries.push(buildVariant(seed, variant, level, slotIndex, entries.length, idNumber));
      idNumber += 1;

      if (entries.length >= count) {
        break;
      }
    }

    slotIndex += 1;
  }

  return entries;
}

