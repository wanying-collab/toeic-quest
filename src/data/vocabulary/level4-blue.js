import { createLevelSlots, generateLevelVocabulary } from "./shared.js";

const level4Slots = createLevelSlots([
  {
    noun: { en: "analysis", zh: "分析" },
    verb: { en: "systematically", zh: "有系統地" },
    adjective: { en: "workflow", zh: "工作流程" },
    frequency: 2,
  },
  {
    noun: { en: "system", zh: "系統" },
    verb: { en: "professionally", zh: "專業地" },
    adjective: { en: "framework", zh: "架構" },
    frequency: 2,
  },
  {
    noun: { en: "review", zh: "審查" },
    verb: { en: "securely", zh: "安全地" },
    adjective: { en: "assessment", zh: "評估" },
    frequency: 2,
  },
  {
    noun: { en: "strategy", zh: "策略" },
    verb: { en: "internally", zh: "在內部" },
    adjective: { en: "document", zh: "文件" },
    frequency: 1,
  },
  {
    noun: { en: "status", zh: "狀態" },
    verb: { en: "formally", zh: "正式地" },
    adjective: { en: "implementation", zh: "執行方案" },
    frequency: 1,
  },
  {
    noun: { en: "framework", zh: "架構" },
    verb: { en: "globally", zh: "在全球範圍內" },
    adjective: { en: "optimization", zh: "最佳化方案" },
    frequency: 1,
  },
  {
    noun: { en: "workflow", zh: "工作流程" },
    verb: { en: "collaboratively", zh: "協作地" },
    adjective: { en: "initiative", zh: "專案" },
    frequency: 1,
  },
  {
    noun: { en: "assessment", zh: "評估" },
    verb: { en: "consistently", zh: "持續地" },
    adjective: { en: "alignment", zh: "對齊方案" },
    frequency: 1,
  },
]);

export const level4BlueVocabulary = generateLevelVocabulary({
  level: "blue",
  count: 1500,
  startId: 4001,
  slots: level4Slots,
});
