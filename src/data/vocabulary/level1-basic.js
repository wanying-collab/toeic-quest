import { createLevelSlots, generateLevelVocabulary } from "./shared.js";

const level1Slots = createLevelSlots([
  {
    noun: { type: "base" },
    verb: { en: "carefully", zh: "仔細地" },
    adjective: { en: "notice", zh: "通知" },
    frequency: 5,
  },
  {
    noun: { en: "form", zh: "表單" },
    verb: { en: "today", zh: "今天" },
    adjective: { en: "update", zh: "更新" },
    frequency: 5,
  },
  {
    noun: { en: "list", zh: "清單" },
    verb: { en: "online", zh: "在線上" },
    adjective: { en: "report", zh: "報告" },
    frequency: 4,
  },
  {
    noun: { en: "guide", zh: "指南" },
    verb: { en: "again", zh: "再次" },
    adjective: { en: "request", zh: "請求" },
    frequency: 4,
  },
  {
    noun: { en: "note", zh: "筆記" },
    verb: { en: "quickly", zh: "快速地" },
    adjective: { en: "schedule", zh: "時程" },
    frequency: 4,
  },
  {
    noun: { en: "record", zh: "紀錄" },
    verb: { en: "correctly", zh: "正確地" },
    adjective: { en: "summary", zh: "摘要" },
    frequency: 3,
  },
]);

export const level1BasicVocabulary = generateLevelVocabulary({
  level: "easy",
  count: 1000,
  startId: 1,
  slots: level1Slots,
});
