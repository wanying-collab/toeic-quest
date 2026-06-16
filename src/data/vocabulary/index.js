import { vocabularyBank as legacyVocabularyBank } from "../vocabulary.js";
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
import { level1BasicVocabulary } from "./level1-basic.js";
import { level2NormalVocabulary } from "./level2-normal.js";
import { level3GreenVocabulary } from "./level3-green.js";
import { level4BlueVocabulary } from "./level4-blue.js";
import { level5AdvancedVocabulary } from "./level5-advanced.js";

const categoryZhMap = Object.fromEntries(
  vocabularyCategories.map((item) => [item.label, item.labelZh]),
);

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
  "Human Resources": "Business English",
  Contract: "Customer Service English",
  Healthcare: "Travel English",
};

const validMultiWordTermSet = new Set(validMultiWordTerms);
const suspiciousPhrasePatterns = [
  /\b(carefully|quickly|regularly|online)\b/i,
  /^in advance$/i,
];

const rawLegacyVocabulary = [
  ...level1BasicVocabulary,
  ...level2NormalVocabulary,
  ...level3GreenVocabulary,
  ...level4BlueVocabulary,
  ...level5AdvancedVocabulary,
];

const levelPriority = {
  easy: 0,
  normal: 1,
  green: 2,
  blue: 3,
  advanced: 4,
};

function cleanText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyWord(word) {
  return cleanText(word)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function headwordOf(word) {
  return cleanText(word).toLowerCase();
}

function baseHeadwordOf(word) {
  return headwordOf(word).split(" ")[0];
}

function normalizeCategory(category) {
  return categoryAliasMap[cleanText(category)] ?? cleanText(category) ?? "Business";
}

function normalizePartOfSpeech(partOfSpeech) {
  const normalized = cleanText(partOfSpeech).toLowerCase();
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

function isLegitimateVocabularyWord(word) {
  const normalized = headwordOf(word);
  if (!normalized) {
    return false;
  }

  if (validMultiWordTermSet.has(normalized)) {
    return true;
  }

  return /^[a-z][a-z-]*$/i.test(normalized);
}

function looksSyntheticPhrase(value) {
  const normalized = headwordOf(value);
  if (!normalized) {
    return true;
  }

  if (validMultiWordTermSet.has(normalized)) {
    return false;
  }

  if (normalized.split(" ").length <= 1) {
    return false;
  }

  return suspiciousPhrasePatterns.some((pattern) => pattern.test(normalized));
}

function uniqueList(items = []) {
  return [...new Set(items.map(cleanText).filter(Boolean))];
}

function buildPronunciation(word, profilePronunciation, fallbackPronunciation) {
  if (profilePronunciation) {
    return profilePronunciation;
  }
  if (cleanText(fallbackPronunciation)) {
    return cleanText(fallbackPronunciation);
  }
  return `/${cleanText(word).toLowerCase()}/`;
}

function buildDefaultCollocations(entry) {
  if (entry.partOfSpeech === "verb") {
    return [`${entry.word} the document`, `${entry.word} the report`];
  }

  if (entry.partOfSpeech === "adjective") {
    return [`${entry.word} report`, `${entry.word} request`];
  }

  const category = entry.category;
  if (["Finance", "Accounting", "Banking", "Insurance"].includes(category)) {
    return [`${entry.word} report`, `${entry.word} record`];
  }
  if (["Logistics", "Supply Chain", "Purchasing"].includes(category)) {
    return [`${entry.word} status`, `${entry.word} process`];
  }
  if (["Manufacturing", "Maintenance", "Engineering", "Quality Control"].includes(category)) {
    return [`${entry.word} process`, `${entry.word} standard`];
  }
  if (["Travel", "Hotel", "Airport", "Dining"].includes(category)) {
    return [`${entry.word} service`, `${entry.word} schedule`];
  }
  return [`review the ${entry.word}`, `${entry.word} update`];
}

const collocationExampleTemplates = {
  review: (meaning, word) => ({
    example: `The team reviewed the ${word} before the meeting.`,
    exampleZh: `團隊在會議前審閱了${meaning}。`,
  }),
  submit: (meaning, word) => ({
    example: `Please submit the ${word} by this afternoon.`,
    exampleZh: `請在今天下午前提交${meaning}。`,
  }),
  update: (meaning, word) => ({
    example: `Please update the ${word} before noon.`,
    exampleZh: `請在中午前更新${meaning}。`,
  }),
  check: (meaning, word) => ({
    example: `Please check the ${word} before you send the file.`,
    exampleZh: `請在寄出文件前先確認${meaning}。`,
  }),
  track: (meaning, word) => ({
    example: `The staff tracked the ${word} throughout the day.`,
    exampleZh: `工作人員整天都在追蹤${meaning}。`,
  }),
  pay: (meaning, word) => ({
    example: `The accounting team paid the ${word} on time.`,
    exampleZh: `會計團隊準時處理了${meaning}的付款。`,
  }),
  request: (meaning, word) => ({
    example: `We requested the ${word} from the supplier yesterday.`,
    exampleZh: `我們昨天向供應商索取了${meaning}。`,
  }),
  prepare: (meaning, word) => ({
    example: `The team prepared the ${word} for the client meeting.`,
    exampleZh: `團隊為了客戶會議準備了${meaning}。`,
  }),
  reduce: (meaning, word) => ({
    example: `The company is working to reduce ${word}.`,
    exampleZh: `公司正在努力降低${meaning}。`,
  }),
};

const collocationActionMap = {
  analyze: "分析",
  answer: "回覆",
  apply: "申請",
  approve: "核准",
  arrange: "安排",
  assist: "協助",
  attend: "參加",
  avoid: "避免",
  book: "預訂",
  calibrate: "校正",
  cancel: "取消",
  certify: "認證",
  check: "確認",
  choose: "選擇",
  clarify: "釐清",
  clear: "完成",
  collect: "蒐集",
  compare: "比較",
  compile: "彙整",
  complete: "完成",
  conduct: "執行",
  confirm: "確認",
  contact: "聯絡",
  continue: "持續進行",
  count: "盤點",
  deliver: "遞送",
  detect: "偵測",
  diagnose: "診斷",
  discuss: "討論",
  draft: "擬定",
  encourage: "鼓勵",
  enter: "輸入",
  estimate: "估算",
  evaluate: "評估",
  file: "歸檔",
  finish: "完成",
  follow: "跟進",
  form: "建立",
  give: "提供",
  grant: "授予",
  handle: "處理",
  hire: "聘用",
  improve: "改善",
  increase: "提高",
  inspect: "檢查",
  install: "安裝",
  introduce: "介紹",
  issue: "開立",
  join: "參加",
  keep: "保留",
  launch: "推出",
  load: "裝載",
  maintain: "維護",
  manage: "管理",
  measure: "量測",
  meet: "會見",
  monitor: "監控",
  negotiate: "協商",
  offer: "提供",
  open: "開啟",
  operate: "操作",
  order: "訂購",
  pay: "支付",
  plan: "規劃",
  place: "下達",
  post: "張貼",
  prepare: "準備",
  print: "列印",
  process: "處理",
  protect: "保護",
  provide: "提供",
  raise: "提高",
  reach: "達成",
  receive: "接收",
  record: "記錄",
  recruit: "招募",
  reduce: "降低",
  register: "登記",
  renew: "續約",
  repair: "維修",
  replace: "更換",
  report: "回報",
  request: "索取",
  reserve: "預訂",
  resolve: "解決",
  restart: "重新啟動",
  review: "審閱",
  run: "執行",
  scan: "掃描",
  schedule: "安排",
  secure: "取得",
  select: "選擇",
  send: "寄送",
  serve: "提供",
  set: "設定",
  share: "分享",
  ship: "出貨",
  show: "展現",
  sign: "簽署",
  start: "開始",
  store: "存放",
  submit: "提交",
  support: "支援",
  take: "處理",
  test: "測試",
  track: "追蹤",
  train: "培訓",
  transfer: "轉移",
  troubleshoot: "排除故障",
  update: "更新",
  use: "使用",
  verify: "確認",
  visit: "拜訪",
  wait: "等待",
  welcome: "接待",
};

function buildExampleFromCollocation(entry, primaryCollocation) {
  const normalized = headwordOf(primaryCollocation);
  const [verb] = normalized.split(" ");
  const template = collocationExampleTemplates[verb];

  if (template) {
    return template(entry.meaning, entry.word);
  }

  const actionZh = collocationActionMap[verb];
  if (actionZh) {
    return {
      example: `We need to ${primaryCollocation} this week.`,
      exampleZh: `我們需要在本週${actionZh}${entry.meaning}。`,
    };
  }

  if (normalized.includes(" ")) {
    return {
      example: `We need to ${primaryCollocation} this week.`,
      exampleZh: `我們需要在本週處理與${entry.meaning}相關的事項。`,
    };
  }

  if (entry.partOfSpeech === "verb") {
    return {
      example: `Please ${entry.word} the document before the deadline.`,
      exampleZh: `請在截止前完成與${entry.meaning}相關的工作。`,
    };
  }

  if (entry.partOfSpeech === "adjective") {
    return {
      example: `The manager asked for a ${entry.word} update on the project.`,
      exampleZh: `主管要求提供與專案有關的${entry.meaning}更新。`,
    };
  }

  if (["Logistics", "Supply Chain", "Purchasing"].includes(entry.category)) {
    return {
      example: `The staff monitored the ${entry.word} throughout the day.`,
      exampleZh: `現場人員整天都在追蹤${entry.meaning}的狀態。`,
    };
  }

  if (["Manufacturing", "Maintenance", "Engineering", "Quality Control"].includes(entry.category)) {
    return {
      example: `The factory reviewed the ${entry.word} before production started.`,
      exampleZh: `工廠在開始生產前確認了${entry.meaning}。`,
    };
  }

  if (["Finance", "Accounting", "Banking", "Insurance"].includes(entry.category)) {
    return {
      example: `The finance team checked the ${entry.word} this morning.`,
      exampleZh: `財務團隊今天早上確認了${entry.meaning}。`,
    };
  }

  if (["Travel", "Hotel", "Airport", "Dining"].includes(entry.category)) {
    return {
      example: `The staff confirmed the ${entry.word} for the guest.`,
      exampleZh: `工作人員已為客人確認${entry.meaning}。`,
    };
  }

  return {
    example: `The team reviewed the ${entry.word} this morning.`,
    exampleZh: `團隊今天早上確認了${entry.meaning}。`,
  };
}

function normalizeSeed(seed, source) {
  const category = normalizeCategory(seed.category);
  return {
    source,
    sourceId: String(seed.id ?? `${source}-${slugifyWord(seed.word)}`),
    word: cleanText(seed.word),
    meaning: cleanText(seed.meaning),
    partOfSpeech: normalizePartOfSpeech(seed.partOfSpeech),
    pronunciation: cleanText(seed.pronunciation),
    collocations: uniqueList(seed.collocations ?? []),
    example: cleanText(seed.example),
    exampleZh: cleanText(seed.exampleZh),
    category,
    categoryZh: categoryZhMap[category] ?? category,
    level: cleanText(seed.level) || "normal",
    frequency: Number(seed.frequency) || 3,
  };
}

const normalizedSeeds = [
  ...legacyVocabularyBank.map((item) => normalizeSeed(item, "legacy")),
  ...extraVocabularySeeds.map((item) => normalizeSeed(item, "catalog")),
].filter((item) => item.word && item.meaning && isLegitimateVocabularyWord(item.word));

function buildFamilyProfileMap(profiles) {
  const familyMap = new Map();

  Object.entries(profiles).forEach(([word, config]) => {
    familyMap.set(word, config);
    (config.wordFamily ?? []).forEach((familyWord) => {
      if (!familyMap.has(headwordOf(familyWord))) {
        familyMap.set(headwordOf(familyWord), config);
      }
    });
  });

  return familyMap;
}

const familyProfileMap = buildFamilyProfileMap(wordQualityProfiles);
const approvedFamilyWords = new Set(
  Object.values(wordQualityProfiles).flatMap((config) =>
    (config.wordFamily ?? []).map((word) => headwordOf(word)),
  ),
);

function mergeWordRecord(base, incoming) {
  const basePriority = levelPriority[base.level] ?? 99;
  const incomingPriority = levelPriority[incoming.level] ?? 99;
  const preferred = incomingPriority < basePriority ? incoming : base;
  const secondary = preferred === incoming ? base : incoming;

  return {
    ...preferred,
    collocations: uniqueList([...(preferred.collocations ?? []), ...(secondary.collocations ?? [])]),
    example: preferred.example || secondary.example,
    exampleZh: preferred.exampleZh || secondary.exampleZh,
    frequency: Math.max(preferred.frequency ?? 0, secondary.frequency ?? 0),
  };
}

const canonicalSeedMap = normalizedSeeds.reduce((map, seed) => {
  const key = headwordOf(seed.word);
  const current = map.get(key);
  map.set(key, current ? mergeWordRecord(current, seed) : seed);
  return map;
}, new Map());

function buildTheme(entry) {
  return themeLabelByCategory[entry.category] ?? "Business English";
}

function buildBaseEntry(seed) {
  const profileConfig = familyProfileMap.get(headwordOf(seed.word)) ?? {};
  const collocations = uniqueList(
    (profileConfig.collocations ?? seed.collocations ?? buildDefaultCollocations(seed)).filter(
      (item) => !looksSyntheticPhrase(item),
    ),
  );
  const example =
    profileConfig.example && profileConfig.exampleZh
      ? { example: profileConfig.example, exampleZh: profileConfig.exampleZh }
      : buildExampleFromCollocation(seed, collocations[0]);

  return {
    id: `vw-${slugifyWord(seed.word)}`,
    word: seed.word,
    meaning: seed.meaning,
    partOfSpeech: seed.partOfSpeech,
    pronunciation: buildPronunciation(seed.word, profileConfig.pronunciation, seed.pronunciation),
    example: example.example,
    exampleZh: example.exampleZh,
    collocations,
    synonyms: uniqueList(profileConfig.synonyms ?? []),
    antonyms: uniqueList(profileConfig.antonyms ?? []),
    roots: uniqueList(profileConfig.roots ?? []),
    wordFamily: uniqueList(profileConfig.wordFamily ?? []),
    relatedWords: uniqueList(profileConfig.relatedWords ?? []),
    category: seed.category,
    categoryZh: seed.categoryZh,
    level: seed.level,
    frequency: seed.frequency,
    isFavorite: false,
    wrongCount: 0,
    mastered: false,
    theme: buildTheme(seed),
  };
}

const baseVocabularyBank = [...canonicalSeedMap.values()].map(buildBaseEntry);

function buildRelatedWords(entry, allWords) {
  const relatedSet = new Set(
    allWords
      .filter((item) => item.id !== entry.id && item.category === entry.category)
      .map((item) => item.word)
      .slice(0, 6),
  );

  (entry.wordFamily ?? []).forEach((familyWord) => {
    if (familyWord !== entry.word && allWords.some((item) => item.word === familyWord)) {
      relatedSet.add(familyWord);
    }
  });

  return [...relatedSet].slice(0, 6);
}

export const vocabularyBank = baseVocabularyBank
  .map((entry, _, allWords) => ({
    ...entry,
    relatedWords:
      entry.relatedWords.length > 0
        ? entry.relatedWords.filter((word) => word !== entry.word)
        : buildRelatedWords(entry, allWords).filter((word) => word !== entry.word),
  }))
  .sort((left, right) => left.word.localeCompare(right.word));

const cleanWordMap = new Map(vocabularyBank.map((item) => [headwordOf(item.word), item.id]));

function resolveCanonicalId(word) {
  const normalized = headwordOf(word);
  if (cleanWordMap.has(normalized)) {
    return cleanWordMap.get(normalized);
  }

  const base = baseHeadwordOf(word);
  return cleanWordMap.get(base) ?? null;
}

export const vocabularyIdAliases = rawLegacyVocabulary.reduce((aliases, item) => {
  const canonicalId = resolveCanonicalId(item.word);
  if (canonicalId) {
    aliases[String(item.id)] = canonicalId;
  }
  return aliases;
}, {});

vocabularyBank.forEach((item) => {
  vocabularyIdAliases[item.id] = item.id;
});

export const vocabularyPartOfSpeechOptions = [
  ...new Set(vocabularyBank.map((item) => item.partOfSpeech)),
].map((item) => ({ id: item, label: item }));

function countDuplicates(words) {
  const counts = words.reduce((map, item) => {
    const key = headwordOf(item.word);
    map.set(key, (map.get(key) ?? 0) + 1);
    return map;
  }, new Map());

  return [...counts.values()].filter((count) => count > 1).length;
}

function looksFakeWordFamily(headword, familyWord) {
  const normalizedHeadword = headwordOf(headword);
  const normalizedFamilyWord = headwordOf(familyWord);
  if (!normalizedFamilyWord || normalizedFamilyWord === normalizedHeadword) {
    return false;
  }

  if (approvedFamilyWords.has(normalizedFamilyWord)) {
    return false;
  }

  if (validMultiWordTermSet.has(normalizedFamilyWord)) {
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

  return naiveForms.has(normalizedFamilyWord) && !cleanWordMap.has(normalizedFamilyWord);
}

function buildVocabularyQualityReport() {
  const duplicateWords = countDuplicates(vocabularyBank);
  const suspectedFakeWordFamily = vocabularyBank.flatMap((item) =>
    (item.wordFamily ?? []).filter((familyWord) => looksFakeWordFamily(item.word, familyWord)),
  ).length;
  const suspectedFakePhrase = vocabularyBank.filter((item) => looksSyntheticPhrase(item.word)).length;
  const missingTranslation = vocabularyBank.filter((item) => !cleanText(item.meaning)).length;
  const missingExample = vocabularyBank.filter(
    (item) => !cleanText(item.example) || !cleanText(item.exampleZh),
  ).length;
  const rawUniqueWords = new Set(rawLegacyVocabulary.map((item) => headwordOf(item.word)));
  const removedDuplicateCopies = rawLegacyVocabulary.length - rawUniqueWords.size;
  const removedSyntheticEntries = [...rawUniqueWords].filter((word) => !resolveCanonicalId(word)).length;
  const issueWeight =
    duplicateWords * 5 +
    suspectedFakeWordFamily * 4 +
    suspectedFakePhrase * 5 +
    missingTranslation * 3 +
    missingExample * 3;
  const vocabularyQualityScore = Math.max(
    0,
    Math.round(100 - (issueWeight / Math.max(1, vocabularyBank.length)) * 100),
  );

  return {
    totalWords: vocabularyBank.length,
    duplicateWords,
    suspectedFakeWordFamily,
    suspectedFakePhrase,
    missingTranslation,
    missingExample,
    removedFakeData: removedDuplicateCopies + removedSyntheticEntries,
    vocabularyQualityScore,
  };
}

export const vocabularyQualityReport = buildVocabularyQualityReport();

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
  quality: vocabularyQualityReport,
};
