import { createLevelSlots, generateLevelVocabulary } from "./shared.js";

const level5Slots = createLevelSlots([
  {
    noun: { en: "framework", zh: "架構" },
    verb: { en: "collaboratively", zh: "協作地" },
    adjective: { en: "alignment", zh: "對齊方案" },
    frequency: 2,
  },
  {
    noun: { en: "workflow", zh: "工作流程" },
    verb: { en: "globally", zh: "在全球範圍內" },
    adjective: { en: "architecture", zh: "架構設計" },
    frequency: 1,
  },
  {
    noun: { en: "compliance", zh: "合規方案" },
    verb: { en: "automatically", zh: "自動地" },
    adjective: { en: "initiative", zh: "專案" },
    frequency: 1,
  },
  {
    noun: { en: "projection", zh: "預測" },
    verb: { en: "strategically", zh: "有策略地" },
    adjective: { en: "optimization", zh: "最佳化方案" },
    frequency: 1,
  },
  {
    noun: { en: "deployment", zh: "部署計畫" },
    verb: { en: "consistently", zh: "持續地" },
    adjective: { en: "implementation", zh: "執行方案" },
    frequency: 1,
  },
  {
    noun: { en: "architecture", zh: "架構設計" },
    verb: { en: "internally", zh: "在內部" },
    adjective: { en: "dashboard", zh: "儀表板" },
    frequency: 1,
  },
  {
    noun: { en: "optimization", zh: "最佳化方案" },
    verb: { en: "professionally", zh: "專業地" },
    adjective: { en: "assessment", zh: "評估" },
    frequency: 1,
  },
  {
    noun: { en: "initiative", zh: "專案" },
    verb: { en: "systematically", zh: "有系統地" },
    adjective: { en: "workflow", zh: "工作流程" },
    frequency: 1,
  },
]);

export const level5AdvancedVocabulary = generateLevelVocabulary({
  level: "advanced",
  count: 1500,
  startId: 5501,
  slots: level5Slots,
});
