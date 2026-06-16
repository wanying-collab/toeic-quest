import {
  vocabularyBank,
  vocabularyLibraryMeta,
  vocabularyQualityReport,
} from "../src/data/vocabulary/index.js";

const report = {
  generatedAt: new Date().toISOString(),
  totalWords: vocabularyBank.length,
  duplicateWords: vocabularyQualityReport.duplicateWords,
  suspectedFakeWordFamily: vocabularyQualityReport.suspectedFakeWordFamily,
  suspectedFakePhrase: vocabularyQualityReport.suspectedFakePhrase,
  missingTranslation: vocabularyQualityReport.missingTranslation,
  missingExample: vocabularyQualityReport.missingExample,
  removedFakeData: vocabularyQualityReport.removedFakeData,
  vocabularyQualityScore: vocabularyQualityReport.vocabularyQualityScore,
  levelCounts: vocabularyLibraryMeta.levelCounts,
};

console.log(JSON.stringify(report, null, 2));
