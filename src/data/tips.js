export const APP_COPY = {
  title: "TOEIC Quest",
  subtitle: "From 255 to Blue Badge",
  motto: "Every Word Counts. Every Point Matters.",
  description:
    "從基礎單字、短句聽力、入門文法開始，一步一步把 255 分拉回到綠色證書，再往藍色證書前進。",
};

export const DAILY_TASKS = [
  { key: "vocabulary", label: "單字 20 個", goal: 20, icon: "Aa" },
  { key: "listening", label: "聽力 10 題", goal: 10, icon: "耳" },
  { key: "grammar", label: "文法 5 題", goal: 5, icon: "文" },
  { key: "reading", label: "閱讀 5 題", goal: 5, icon: "讀" },
];

export const QUEST_LEVELS = [
  {
    id: 1,
    label: "Level 1",
    title: "255 基礎救援",
    minScore: 255,
    maxScore: 349,
    focus: "先建立 300 個高頻單字、能聽出關鍵名詞與短句意思。",
  },
  {
    id: 2,
    label: "Level 2",
    title: "350 聽懂單字",
    minScore: 350,
    maxScore: 469,
    focus: "開始聽關鍵疑問詞與簡短對話，閱讀從短句升級到短文。",
  },
  {
    id: 3,
    label: "Level 3",
    title: "470 綠色挑戰",
    minScore: 470,
    maxScore: 549,
    focus: "補齊綠色證書核心字彙，練 Part 2 到 Part 5 的判斷力。",
  },
  {
    id: 4,
    label: "Level 4",
    title: "550 穩定進步",
    minScore: 550,
    maxScore: 729,
    focus: "把閱讀定位與聽力陷阱分析做穩，建立可持續的答題節奏。",
  },
  {
    id: 5,
    label: "Level 5",
    title: "730 藍色挑戰",
    minScore: 730,
    maxScore: 990,
    focus: "進入藍色證書衝刺，強化整回合模擬與時間配置。",
  },
];

export const BADGES = [
  {
    id: "starter",
    title: "初學者出發",
    description: "完成第一次學習紀錄。",
    test: (stats) => stats.totalAnswers >= 1,
  },
  {
    id: "word-100",
    title: "單字 100 達成",
    description: "學習 100 個以上單字。",
    test: (stats) => stats.learnedWords >= 100,
  },
  {
    id: "word-250",
    title: "單字 250 達成",
    description: "學習 250 個以上單字。",
    test: (stats) => stats.learnedWords >= 250,
  },
  {
    id: "green-challenger",
    title: "綠色證書挑戰者",
    description: "預估分數到達 470。",
    test: (stats) => stats.predictedScore >= 470,
  },
  {
    id: "blue-hunter",
    title: "藍色證書挑戰者",
    description: "預估分數到達 730。",
    test: (stats) => stats.predictedScore >= 730,
  },
  {
    id: "listening-riser",
    title: "聽力進步王",
    description: "聽力正確率達到 75%。",
    test: (stats) => stats.accuracy.listening >= 0.75 && stats.attempts.listening >= 12,
  },
  {
    id: "grammar-guide",
    title: "文法達人",
    description: "文法正確率達到 80%。",
    test: (stats) => stats.accuracy.grammar >= 0.8 && stats.attempts.grammar >= 10,
  },
  {
    id: "reading-scout",
    title: "閱讀高手",
    description: "閱讀正確率達到 80%。",
    test: (stats) => stats.accuracy.reading >= 0.8 && stats.attempts.reading >= 10,
  },
];

export const KEYWORD_GUIDES = [
  {
    id: "where",
    prompt: "Where",
    focus: "找地點",
    explanation: "先聽地點名詞與介系詞，例如 in, on, next to, near。",
    examples: ["Where is the meeting room?", "Where should I leave the package?"],
    commonAnswers: [
      "in the office",
      "on the second floor",
      "next to the station",
      "near the entrance",
    ],
    drill: {
      question: "Where can I meet the manager?",
      options: ["In the lobby", "At 3 p.m.", "Because he is busy", "By email"],
      answer: "In the lobby",
      explanation: "Where 問地點，所以要選地點答案。",
    },
  },
  {
    id: "when",
    prompt: "When",
    focus: "找時間",
    explanation: "注意 tomorrow, next Monday, at 9 a.m., in two weeks 這類時間訊號。",
    examples: ["When does the seminar begin?", "When will the goods arrive?"],
    commonAnswers: ["tomorrow", "next Monday", "at 9 a.m.", "in two weeks"],
    drill: {
      question: "When will the report be ready?",
      options: ["Tomorrow morning", "In the office", "Mr. Lin", "By train"],
      answer: "Tomorrow morning",
      explanation: "When 要找時間，不是地點或人物。",
    },
  },
  {
    id: "who",
    prompt: "Who",
    focus: "找人物",
    explanation: "答案通常是姓名、職稱或部門角色。",
    examples: ["Who approved the budget?", "Who should I contact first?"],
    commonAnswers: ["Mr. Chen", "the manager", "the receptionist", "our supplier"],
    drill: {
      question: "Who will lead the training session?",
      options: ["The HR manager", "At Room B", "Next week", "Because of the change"],
      answer: "The HR manager",
      explanation: "Who 問人物，因此答案應是人或職稱。",
    },
  },
  {
    id: "why",
    prompt: "Why",
    focus: "找原因",
    explanation: "特別留意 because, due to, since, because of 之後的資訊。",
    examples: ["Why was the delivery delayed?", "Why did she cancel the meeting?"],
    commonAnswers: [
      "because the server was down",
      "due to bad weather",
      "since the client requested changes",
      "because of the delay",
    ],
    drill: {
      question: "Why was the order returned?",
      options: ["Because the item was damaged", "At the loading dock", "Next Friday", "By phone"],
      answer: "Because the item was damaged",
      explanation: "Why 要找原因，because 是明顯訊號。",
    },
  },
  {
    id: "how",
    prompt: "How",
    focus: "找方法或狀態",
    explanation: "看答案是方式、流程，還是描述狀態的副詞。",
    examples: ["How did you send the file?", "How was the presentation?"],
    commonAnswers: ["by email", "by train", "carefully", "very well"],
    drill: {
      question: "How did you contact the customer?",
      options: ["By email", "At noon", "In the office", "The supervisor"],
      answer: "By email",
      explanation: "How 常問方法，所以要選傳送方式。",
    },
  },
  {
    id: "how-much",
    prompt: "How much",
    focus: "找價格",
    explanation: "答案通常是金額、費用或折扣。",
    examples: ["How much is the repair fee?", "How much did the tickets cost?"],
    commonAnswers: ["ten dollars", "a 20 percent discount", "the total cost"],
    drill: {
      question: "How much is the upgrade service?",
      options: ["Fifteen dollars", "For two hours", "Near the counter", "Tomorrow"],
      answer: "Fifteen dollars",
      explanation: "How much 要找價格資訊。",
    },
  },
  {
    id: "how-long",
    prompt: "How long",
    focus: "找時間長度",
    explanation: "答案常出現 for, until, about 這類長度或截止時間訊號。",
    examples: ["How long will the repair take?", "How long is the seminar?"],
    commonAnswers: ["for two hours", "about three days", "until Friday"],
    drill: {
      question: "How long will the training last?",
      options: ["For two hours", "At two o'clock", "In Room 5", "The instructor"],
      answer: "For two hours",
      explanation: "How long 問多久，答案要是長度而不是時間點。",
    },
  },
];

export const LISTENING_TRAPS = [
  {
    id: "where-vs-when",
    title: "Where 題不要選時間",
    pattern: "題目問 Where，選項卻出現 tomorrow、at 9 a.m. 這種時間字。",
    fix: "先聽疑問詞，再鎖定地點介系詞與地點名詞。",
  },
  {
    id: "when-vs-where",
    title: "When 題不要選地點",
    pattern: "題目問 When，選項出現 in the office、next to the station 這些地點字。",
    fix: "When 只找時間點或時間長度。",
  },
  {
    id: "echo-keyword",
    title: "關鍵字回音陷阱",
    pattern: "題目和選項同時出現 shipment、invoice 這種熟字，但不代表就是答案。",
    fix: "不要只抓到熟字，要判斷題目到底在問人物、地點、原因還是下一步。",
  },
  {
    id: "sound-alike",
    title: "同音或相似音陷阱",
    pattern: "例如 bill 與 build、fare 與 fair，聽起來像，但意思不同。",
    fix: "搭配上下文一起判斷，不要只靠單一音節。",
  },
  {
    id: "next-step",
    title: "下一步行動題",
    pattern: "題目問接下來要做什麼，答案常藏在 will、going to、need to、please 後面。",
    fix: "鎖定未來動作，不要選已經發生的事。",
  },
];

export const GRAMMAR_GUIDES = [
  {
    id: "parts-of-speech",
    title: "詞性判斷",
    tip: "看到冠詞 a / an / the 後面，先想名詞。看到 very 後面，多半是形容詞。",
  },
  {
    id: "tense",
    title: "時態判斷",
    tip: "yesterday 看過去式，tomorrow / next week 看未來式，since / for 常是完成式。",
  },
  {
    id: "subject-verb",
    title: "主詞動詞一致",
    tip: "He / She / It 後面多半用單數動詞，They / We / You 用原形。",
  },
  {
    id: "passive",
    title: "被動語態",
    tip: "看到 be + p.p.，通常代表某事被完成、被處理。",
  },
  {
    id: "preposition",
    title: "介系詞",
    tip: "in + 月份 / 年份 / 範圍，on + 日期 / 星期，at + 時間點 / 小地點。",
  },
  {
    id: "connector",
    title: "連接詞",
    tip: "because 說原因，although 表轉折，therefore 表結果。",
  },
];

export const READING_LADDER = [
  { id: "word", label: "單字", goal: "先看懂常見商務字。" },
  { id: "phrase", label: "片語", goal: "抓住 due to、look forward to 這種常見搭配。" },
  { id: "sentence", label: "短句", goal: "練會議、訂單、時間、地點的短句判讀。" },
  { id: "passage", label: "短文", goal: "讀通知、email、memo，先找 purpose 與 detail。" },
  { id: "part7", label: "Part 7", goal: "練多題閱讀與定位技巧。" },
];
