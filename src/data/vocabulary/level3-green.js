import { createLevelSlots, generateLevelVocabulary } from "./shared.js";

export const level3GreenVocabulary = generateLevelVocabulary({
  level: "green",
  count: 1800,
  startId: 2801,
  slots: createLevelSlots(12, 4, 4, 4),
});
