import { createLevelSlots, generateLevelVocabulary } from "./shared.js";

export const level4BlueVocabulary = generateLevelVocabulary({
  level: "blue",
  count: 1800,
  startId: 4601,
  slots: createLevelSlots(12, 6, 6, 6),
});
