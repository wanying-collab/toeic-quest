export const siteBranding = {
  name: "TOEIC Quest",
  subtitle: "From 255 to Blue Badge",
  ideas: ["Every Word Counts.", "Every Point Matters."],
  mission:
    "每天進步一點點，從 255 分開始，一路挑戰綠色證書與藍色證書。",
  repository: "toeic-quest",
  pagesUrl: "https://wanying-collab.github.io/toeic-quest/",
};

export const dailyTasks = [
  { id: "vocabulary", label: "單字 20 個", goal: 20, type: "vocabulary" },
  { id: "listening", label: "聽力 10 題", goal: 10, type: "listening" },
  { id: "grammar", label: "文法 5 題", goal: 5, type: "grammar" },
  { id: "reading", label: "閱讀短句 5 題", goal: 5, type: "reading" },
];

export const levelRoadmap = [
  {
    id: 1,
    title: "Level 1",
    score: 255,
    badge: "255 基礎救援",
    focus: "先把最常見單字和超短句聽懂、看懂。",
  },
  {
    id: 2,
    title: "Level 2",
    score: 350,
    badge: "350 聽懂單字",
    focus: "開始穩定抓到關鍵單字、基本句型與時間地點資訊。",
  },
  {
    id: 3,
    title: "Level 3",
    score: 470,
    badge: "470 綠色挑戰",
    focus: "建立綠色證書需要的詞彙量與閱讀穩定度。",
  },
  {
    id: 4,
    title: "Level 4",
    score: 550,
    badge: "550 穩定進步",
    focus: "把基礎聽讀轉成穩定分數，減少猜題。",
  },
  {
    id: 5,
    title: "Level 5",
    score: 730,
    badge: "730 藍色挑戰",
    focus: "往藍色證書前進，補強 Part 1 到 Part 7 的解題節奏。",
  },
];

export const listeningKeywordTips = [
  {
    keyword: "Where",
    focus: "找地點",
    examples: ["in the office", "on the second floor", "near the entrance"],
  },
  {
    keyword: "When",
    focus: "找時間",
    examples: ["tomorrow", "at 9 a.m.", "next Monday"],
  },
  {
    keyword: "Who",
    focus: "找人物",
    examples: ["the manager", "Mr. Chen", "our supplier"],
  },
  {
    keyword: "Why",
    focus: "找原因",
    examples: ["because", "due to traffic", "since the file is missing"],
  },
  {
    keyword: "How much",
    focus: "找價格",
    examples: ["ten dollars", "a 20 percent discount", "the total cost"],
  },
  {
    keyword: "How long",
    focus: "找多久",
    examples: ["for two hours", "about three days", "until Friday"],
  },
];

export const readingSteps = [
  "單字",
  "片語",
  "短句",
  "短文",
  "多益閱讀題",
];

export const phaseTwoRoadmap = [
  "把基礎單字庫擴充到 1000 到 5000 個。",
  "加入綠色 / 藍色 / 金色難度分類與更完整的搜尋篩選。",
  "擴充 TOEIC Part 1 到 Part 7 的解題技巧與陷阱分析。",
  "加入完整間隔複習、成就系統與預估多益分數。",
  "補上 GitHub Pages 正式部署流程。",
];
