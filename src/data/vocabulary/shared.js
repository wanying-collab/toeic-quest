import { vocabularyBank as legacyVocabularyBank } from "../vocabulary.js";

export const vocabularyCategories = [
  { id: "office", label: "Office", labelZh: "辦公室" },
  { id: "meeting", label: "Meeting", labelZh: "會議" },
  { id: "hr", label: "HR", labelZh: "人事" },
  { id: "finance", label: "Finance", labelZh: "財務" },
  { id: "purchase", label: "Purchase", labelZh: "採購" },
  { id: "shipping", label: "Shipping", labelZh: "出貨物流" },
  { id: "travel", label: "Travel", labelZh: "旅遊" },
  { id: "restaurant", label: "Restaurant", labelZh: "餐廳" },
  { id: "customer-service", label: "Customer Service", labelZh: "客服" },
  { id: "manufacturing", label: "Manufacturing", labelZh: "製造業" },
  { id: "maintenance", label: "Maintenance", labelZh: "維修保養" },
  { id: "quality-control", label: "Quality Control", labelZh: "品質管理" },
  { id: "marketing", label: "Marketing", labelZh: "廣告行銷" },
  { id: "contract", label: "Contract", labelZh: "合約" },
  { id: "email", label: "Email", labelZh: "電子郵件" },
  { id: "logistics", label: "Logistics", labelZh: "物流" },
  { id: "inventory", label: "Inventory", labelZh: "庫存" },
  { id: "production", label: "Production", labelZh: "生產" },
  { id: "engineering", label: "Engineering", labelZh: "工程" },
  { id: "business", label: "Business", labelZh: "商務" },
  { id: "airport", label: "Airport", labelZh: "機場" },
  { id: "hotel", label: "Hotel", labelZh: "飯店" },
  { id: "banking", label: "Banking", labelZh: "銀行" },
  { id: "sales", label: "Sales", labelZh: "銷售" },
  { id: "management", label: "Management", labelZh: "管理" },
  { id: "technology", label: "Technology", labelZh: "科技" },
  { id: "training", label: "Training", labelZh: "訓練" },
  { id: "schedule", label: "Schedule", labelZh: "時程" },
  { id: "transportation", label: "Transportation", labelZh: "運輸" },
  { id: "announcement", label: "Announcement", labelZh: "公告" },
];

export const vocabularyLevels = [
  { id: "easy", label: "Level 1 Easy 255-350", target: 1000 },
  { id: "normal", label: "Level 2 Normal 350-470", target: 1500 },
  { id: "green", label: "Level 3 Green 470-550", target: 1500 },
  { id: "blue", label: "Level 4 Blue 550-730", target: 1500 },
  { id: "advanced", label: "Level 5 Advanced 730+", target: 1500 },
];

export const vocabularyFrequencyOptions = [5, 4, 3, 2, 1];

const categoryZhMap = Object.fromEntries(
  vocabularyCategories.map((item) => [item.label, item.labelZh]),
);

const categoryRotations = {
  Office: ["Office", "Business", "Schedule", "Announcement", "Training"],
  Meeting: ["Meeting", "Management", "Schedule", "Training", "Business"],
  HR: ["HR", "Training", "Management", "Business", "Announcement"],
  Finance: ["Finance", "Banking", "Business", "Sales", "Management"],
  Purchase: ["Purchase", "Inventory", "Business", "Sales", "Logistics"],
  Shipping: ["Shipping", "Logistics", "Transportation", "Inventory", "Airport"],
  Travel: ["Travel", "Airport", "Hotel", "Transportation", "Schedule"],
  Restaurant: ["Restaurant", "Hotel", "Customer Service", "Business", "Sales"],
  "Customer Service": ["Customer Service", "Sales", "Business", "Announcement", "Management"],
  Manufacturing: ["Manufacturing", "Production", "Engineering", "Technology", "Business"],
  Maintenance: ["Maintenance", "Engineering", "Technology", "Production", "Business"],
  "Quality Control": ["Quality Control", "Engineering", "Production", "Management", "Technology"],
  Marketing: ["Marketing", "Sales", "Business", "Technology", "Announcement"],
  Contract: ["Contract", "Business", "Management", "Banking", "Sales"],
  Email: ["Email", "Announcement", "Technology", "Schedule", "Business"],
};

const nounDefaultCollocations = (word) => [`review the ${word}`, `update the ${word}`];
const verbDefaultCollocations = (word) => [`${word} before noon`, `${word} for the client`];
const adjectiveDefaultCollocations = (word) => [`share the ${word}`, `check the ${word}`];

const nounSentenceTemplates = [
  (word) => `The team updated the ${word} before the weekly meeting.`,
  (word) => `Please review the ${word} before you reply to the client.`,
  (word) => `Our manager checked the ${word} this morning.`,
  (word) => `The staff filed the ${word} after the training session.`,
];

const verbSentenceTemplates = [
  (word) => `Please ${word} before the deadline.`,
  (word) => `Our team will ${word} during today's review.`,
  (word) => `Managers usually ${word} before they send the final email.`,
  (word) => `The staff member had to ${word} again this afternoon.`,
];

const adjectiveSentenceTemplates = [
  (word) => `The team discussed the ${word} during the briefing.`,
  (word) => `We received the ${word} this morning.`,
  (word) => `Please keep the ${word} in the shared folder.`,
  (word) => `The manager mentioned the ${word} in the announcement.`,
];

const adverbTemplates = [
  { en: "carefully", zh: "仔細地" },
  { en: "quickly", zh: "快速地" },
  { en: "online", zh: "在線上" },
  { en: "today", zh: "今天" },
  { en: "again", zh: "再次" },
  { en: "regularly", zh: "定期地" },
  { en: "correctly", zh: "正確地" },
  { en: "in advance", zh: "提前" },
  { en: "by email", zh: "用電子郵件" },
  { en: "efficiently", zh: "有效率地" },
  { en: "directly", zh: "直接地" },
  { en: "on time", zh: "準時地" },
  { en: "in detail", zh: "詳細地" },
  { en: "systematically", zh: "有系統地" },
  { en: "professionally", zh: "專業地" },
  { en: "securely", zh: "安全地" },
  { en: "internally", zh: "在內部" },
  { en: "collaboratively", zh: "協作地" },
  { en: "globally", zh: "在全球範圍內" },
  { en: "strategically", zh: "有策略地" },
  { en: "automatically", zh: "自動地" },
  { en: "consistently", zh: "持續地" },
];

const adjectiveHeads = [
  { en: "notice", zh: "通知" },
  { en: "update", zh: "更新" },
  { en: "report", zh: "報告" },
  { en: "request", zh: "請求" },
  { en: "schedule", zh: "時程" },
  { en: "record", zh: "紀錄" },
  { en: "summary", zh: "摘要" },
  { en: "analysis", zh: "分析" },
  { en: "review", zh: "審查" },
  { en: "guide", zh: "指南" },
  { en: "policy", zh: "政策" },
  { en: "meeting", zh: "會議" },
  { en: "proposal", zh: "提案" },
  { en: "system", zh: "系統" },
  { en: "dashboard", zh: "儀表板" },
  { en: "workflow", zh: "工作流程" },
  { en: "framework", zh: "架構" },
  { en: "assessment", zh: "評估" },
  { en: "implementation", zh: "執行方案" },
  { en: "optimization", zh: "最佳化方案" },
];

function normalizeBaseSeed(entry) {
  return {
    ...entry,
    id: String(entry.id),
    category: entry.category || "Business",
    categoryZh: entry.categoryZh || categoryZhMap[entry.category] || "商務",
  };
}

const baseSeeds = legacyVocabularyBank.map(normalizeBaseSeed);

function buildPronunciation(word) {
  return `/${word.replace(/\s+/g, " ")}/`;
}

function resolveCategory(seed, slotIndex, sequence) {
  const rotation = categoryRotations[seed.category] || [seed.category, "Business"];
  const label = rotation[(Number(seed.id) + slotIndex + sequence) % rotation.length];
  return {
    label,
    labelZh: categoryZhMap[label] || seed.categoryZh || "商務",
  };
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

  if (variant.type === "adjective-head") {
    return `${baseMeaning}${variant.zh}`;
  }

  return baseMeaning;
}

function resolveWord(seed, variant) {
  if (variant.type === "base") {
    return seed.word;
  }

  if (variant.type === "noun-suffix") {
    return `${seed.word} ${variant.en}`;
  }

  if (variant.type === "verb-modifier") {
    return `${seed.word} ${variant.en}`;
  }

  if (variant.type === "adjective-head") {
    return `${seed.word} ${variant.en}`;
  }

  return seed.word;
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

function resolveCollocations(seed, word, partOfSpeech) {
  if (partOfSpeech === "noun" || partOfSpeech === "verb" || partOfSpeech === "adjective") {
    return seed.collocations?.length ? seed.collocations : nounDefaultCollocations(word);
  }

  if (partOfSpeech.startsWith("verb")) {
    return verbDefaultCollocations(word);
  }

  if (partOfSpeech.startsWith("adjective")) {
    return adjectiveDefaultCollocations(word);
  }

  return nounDefaultCollocations(word);
}

function resolveExample(word, meaning, partOfSpeech, categoryLabel, categoryZh, sequence) {
  const templateIndex = sequence % 4;

  if (partOfSpeech.startsWith("verb")) {
    return {
      example: verbSentenceTemplates[templateIndex](word),
      exampleZh: `請在下一次${categoryZh}任務前先${meaning}。`,
    };
  }

  if (partOfSpeech.startsWith("adjective")) {
    return {
      example: adjectiveSentenceTemplates[templateIndex](word),
      exampleZh: `團隊今天在${categoryZh}情境中討論了這個「${meaning}」。`,
    };
  }

  return {
    example: nounSentenceTemplates[templateIndex](word),
    exampleZh: `團隊今天在${categoryZh}情境中處理了這個「${meaning}」。`,
  };
}

function buildVariant(seed, variant, level, slotIndex, sequence, idNumber) {
  const category = resolveCategory(seed, slotIndex, sequence);
  const word = resolveWord(seed, variant);
  const meaning = resolveMeaning(seed.meaning, variant);
  const partOfSpeech = resolvePartOfSpeech(seed, variant);
  const { example, exampleZh } = resolveExample(
    word,
    meaning,
    partOfSpeech,
    category.label,
    category.labelZh,
    sequence,
  );

  return {
    id: `v${String(idNumber).padStart(4, "0")}`,
    word,
    meaning,
    partOfSpeech,
    pronunciation: buildPronunciation(word),
    example,
    exampleZh,
    collocations: resolveCollocations(seed, word, partOfSpeech),
    category: category.label,
    level,
    frequency: variant.frequency,
    isFavorite: false,
    wrongCount: 0,
    mastered: false,
  };
}

function getVariantForSeed(seed, slotConfig) {
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
    return {
      type: "base",
      frequency: slotConfig.frequency,
    };
  }

  return {
    type: "noun-suffix",
    en: slotConfig.noun.en,
    zh: slotConfig.noun.zh,
    frequency: slotConfig.frequency,
  };
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
      const variant = getVariantForSeed(seed, slotConfig);
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

export function createLevelSlots(config) {
  return config.map((item, index) => ({
    noun: item.noun,
    verb: item.verb || adverbTemplates[index % adverbTemplates.length],
    adjective: item.adjective || adjectiveHeads[index % adjectiveHeads.length],
    frequency: item.frequency,
  }));
}

