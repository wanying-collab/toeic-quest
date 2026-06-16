import { createLevelSlots, generateLevelVocabulary } from "./shared.js";

export const level1BasicVocabulary = generateLevelVocabulary({
  level: "easy",
  count: 1000,
  startId: 1,
  slots: createLevelSlots(8, 0, 0, 0),
});
