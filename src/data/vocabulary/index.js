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

export const vocabularyBank = [
  ...level1BasicVocabulary,
  ...level2NormalVocabulary,
  ...level3GreenVocabulary,
  ...level4BlueVocabulary,
  ...level5AdvancedVocabulary,
];

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
    easy: level1BasicVocabulary.length,
    normal: level2NormalVocabulary.length,
    green: level3GreenVocabulary.length,
    blue: level4BlueVocabulary.length,
    advanced: level5AdvancedVocabulary.length,
  },
};
