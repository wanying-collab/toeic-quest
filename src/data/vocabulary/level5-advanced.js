import { createLevelSlots, generateLevelVocabulary } from "./shared.js";

export const level5AdvancedVocabulary = generateLevelVocabulary({
  level: "advanced",
  count: 1800,
  startId: 6401,
  slots: createLevelSlots(14, 8, 8, 8),
});
