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

function buildGenericExample(seed) {
  if (seed.partOfSpeech === "verb") {
    return {
      example: `Please ${seed.word} the document before the deadline.`,
      exampleZh: `請在截止日前${seed.meaning}這份文件。`,
    };
  }

  if (seed.partOfSpeech === "adjective") {
    return {
      example: `The manager asked for a ${seed.word} plan.`,
      exampleZh: `經理要求一份${seed.meaning}的計畫。`,
    };
  }

  return {
    example: `The team reviewed the ${seed.word} during the meeting.`,
    exampleZh: `團隊在會議中檢視了${seed.meaning}。`,
  };
}

function buildEntry(seed) {
  const profile = wordQualityProfiles[headwordOf(seed.word)] ?? {};
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
