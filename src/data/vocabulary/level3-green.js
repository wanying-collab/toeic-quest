import { createLevelSlots, generateLevelVocabulary } from "./shared.js";

const level3Slots = createLevelSlots([
  {
    noun: { en: "report", zh: "報告" },
    verb: { en: "efficiently", zh: "有效率地" },
    adjective: { en: "proposal", zh: "提案" },
    frequency: 3,
  },
  {
    noun: { en: "plan", zh: "計畫" },
    verb: { en: "directly", zh: "直接地" },
    adjective: { en: "analysis", zh: "分析" },
    frequency: 3,
  },
  {
    noun: { en: "policy", zh: "政策" },
    verb: { en: "in detail", zh: "詳細地" },
    adjective: { en: "schedule", zh: "時程" },
    frequency: 3,
  },
  {
    noun: { en: "review", zh: "審查" },
    verb: { en: "with care", zh: "謹慎地" },
    adjective: { en: "system", zh: "系統" },
    frequency: 2,
  },
  {
    noun: { en: "request", zh: "申請單" },
    verb: { en: "on time", zh: "準時地" },
    adjective: { en: "dashboard", zh: "儀表板" },
    frequency: 2,
  },
  {
    noun: { en: "guide", zh: "指南" },
    verb: { en: "regularly", zh: "定期地" },
    adjective: { en: "framework", zh: "架構" },
    frequency: 2,
  },
  {
    noun: { en: "summary", zh: "摘要" },
    verb: { en: "correctly", zh: "正確地" },
    adjective: { en: "workflow", zh: "工作流程" },
    frequency: 2,
  },
  {
    noun: { en: "analysis", zh: "分析" },
    verb: { en: "by email", zh: "用電子郵件" },
    adjective: { en: "assessment", zh: "評估" },
    frequency: 2,
  },
]);

export const level3GreenVocabulary = generateLevelVocabulary({
  level: "green",
  count: 1500,
  startId: 2501,
  slots: level3Slots,
});
