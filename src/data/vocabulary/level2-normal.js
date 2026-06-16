import { createLevelSlots, generateLevelVocabulary } from "./shared.js";

export const level2NormalVocabulary = generateLevelVocabulary({
  level: "normal",
  count: 1800,
  startId: 1001,
  slots: createLevelSlots(12, 2, 2, 2),
});
