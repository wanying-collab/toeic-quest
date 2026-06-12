import { createLevelSlots, generateLevelVocabulary } from "./shared.js";

const level2Slots = createLevelSlots([
  {
    noun: { en: "schedule", zh: "時程" },
    verb: { en: "regularly", zh: "定期地" },
    adjective: { en: "meeting", zh: "會議" },
    frequency: 4,
  },
  {
    noun: { en: "update", zh: "更新" },
    verb: { en: "correctly", zh: "正確地" },
    adjective: { en: "summary", zh: "摘要" },
    frequency: 4,
  },
  {
    noun: { en: "checklist", zh: "檢查表" },
    verb: { en: "in advance", zh: "提前" },
    adjective: { en: "record", zh: "紀錄" },
    frequency: 4,
  },
  {
    noun: { en: "team", zh: "團隊" },
    verb: { en: "by email", zh: "用電子郵件" },
    adjective: { en: "policy", zh: "政策" },
    frequency: 3,
  },
  {
    noun: { en: "training", zh: "訓練" },
    verb: { en: "quickly", zh: "快速地" },
    adjective: { en: "guide", zh: "指南" },
    frequency: 3,
  },
  {
    noun: { en: "record", zh: "紀錄" },
    verb: { en: "today", zh: "今天" },
    adjective: { en: "analysis", zh: "分析" },
    frequency: 3,
  },
  {
    noun: { en: "notice", zh: "通知" },
    verb: { en: "carefully", zh: "仔細地" },
    adjective: { en: "dashboard", zh: "儀表板" },
    frequency: 3,
  },
  {
    noun: { en: "guide", zh: "指南" },
    verb: { en: "again", zh: "再次" },
    adjective: { en: "proposal", zh: "提案" },
    frequency: 2,
  },
]);

export const level2NormalVocabulary = generateLevelVocabulary({
  level: "normal",
  count: 1500,
  startId: 1001,
  slots: level2Slots,
});
