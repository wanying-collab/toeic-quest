export const APP_COPY = {
  title: "TOEIC Quest AI",
  subtitle: "Personalized TOEIC Learning System",
  motto: "AI-Powered English Learning Platform",
  description:
    "結合 AI 分析、發音訓練、智慧複習與模擬測驗的個人化英語學習平台。",
};

export const DAILY_TASKS = [
  { key: "vocabulary", label: "Vocabulary 20", goal: 20, icon: "Aa" },
  { key: "listening", label: "Listening 10", goal: 10, icon: "L" },
  { key: "reading", label: "Reading 5", goal: 5, icon: "R" },
  { key: "speaking", label: "Speaking 5", goal: 5, icon: "S" },
];

export const QUEST_LEVELS = [
  {
    id: 1,
    label: "Level 1",
    title: "Beginner Foundation",
    publicLabel: "Beginner",
    minScore: 255,
    maxScore: 349,
    focus: "Build essential vocabulary, word listening, short reading, and basic speaking confidence.",
  },
  {
    id: 2,
    label: "Level 2",
    title: "Core Builder",
    publicLabel: "Developing",
    minScore: 350,
    maxScore: 469,
    focus: "Strengthen keyword listening, grammar basics, and short business reading habits.",
  },
  {
    id: 3,
    label: "Level 3",
    title: "Green Certificate Track",
    publicLabel: "Intermediate",
    minScore: 470,
    maxScore: 549,
    focus: "Stabilize core TOEIC sections while expanding business vocabulary and reading accuracy.",
  },
  {
    id: 4,
    label: "Level 4",
    title: "Blue Certificate Track",
    publicLabel: "Upper Intermediate",
    minScore: 550,
    maxScore: 729,
    focus: "Strengthen longer listening, reading strategy, and speaking or shadowing performance.",
  },
  {
    id: 5,
    label: "Level 5",
    title: "Advanced Performance",
    publicLabel: "Advanced",
    minScore: 730,
    maxScore: 990,
    focus: "Maintain high accuracy with mock exams, advanced vocabulary, and faster processing under pressure.",
  },
];

export const BADGES = [
  {
    id: "starter",
    title: "First Step",
    description: "Finish your first practice activity.",
    test: (stats) => stats.totalAnswers >= 1,
  },
  {
    id: "word-100",
    title: "Word 100",
    description: "Study 100 words.",
    test: (stats) => stats.learnedWords >= 100,
  },
  {
    id: "word-500",
    title: "Word 500",
    description: "Study 500 words.",
    test: (stats) => stats.learnedWords >= 500,
  },
  {
    id: "green-challenger",
    title: "Green Challenger",
    description: "Predicted score reaches 470.",
    test: (stats) => stats.predictedScore >= 470,
  },
  {
    id: "blue-hunter",
    title: "Blue Hunter",
    description: "Predicted score reaches 730.",
    test: (stats) => stats.predictedScore >= 730,
  },
  {
    id: "listening-riser",
    title: "Listening Riser",
    description: "Listening accuracy reaches 75%.",
    test: (stats) => stats.accuracy.listening >= 0.75 && stats.attempts.listening >= 12,
  },
  {
    id: "speaking-spark",
    title: "Speaking Spark",
    description: "Finish 10 speaking or shadowing practices.",
    test: (stats) => stats.attempts.speaking >= 10,
  },
  {
    id: "reading-scout",
    title: "Reading Scout",
    description: "Reading accuracy reaches 80%.",
    test: (stats) => stats.accuracy.reading >= 0.8 && stats.attempts.reading >= 10,
  },
];

export const KEYWORD_GUIDES = [
  {
    id: "where",
    prompt: "Where",
    focus: "Find the location",
    explanation: "Look for place answers such as in the office, on the second floor, or near the entrance.",
    examples: ["Where is the meeting room?", "Where should I leave the package?"],
    commonAnswers: ["in the office", "on the second floor", "next to the station", "near the entrance"],
    drill: {
      question: "Where can I meet the manager?",
      options: ["In the lobby", "At 3 p.m.", "Because he is busy", "By email"],
      answer: "In the lobby",
      explanation: "Where asks for a place, so the answer should be a location.",
    },
  },
  {
    id: "when",
    prompt: "When",
    focus: "Find the time",
    explanation: "Look for tomorrow, next Monday, at 9 a.m., or other time expressions.",
    examples: ["When does the seminar begin?", "When will the goods arrive?"],
    commonAnswers: ["tomorrow", "next Monday", "at 9 a.m.", "in two weeks"],
    drill: {
      question: "When will the report be ready?",
      options: ["Tomorrow morning", "In the office", "Mr. Lin", "By train"],
      answer: "Tomorrow morning",
      explanation: "When asks for time, date, or schedule information.",
    },
  },
  {
    id: "who",
    prompt: "Who",
    focus: "Find the person",
    explanation: "Expect a person, title, or department lead.",
    examples: ["Who approved the budget?", "Who should I contact first?"],
    commonAnswers: ["Mr. Chen", "the manager", "the receptionist", "our supplier"],
    drill: {
      question: "Who will lead the training session?",
      options: ["The HR manager", "At Room B", "Next week", "Because of the change"],
      answer: "The HR manager",
      explanation: "Who asks for a person or role.",
    },
  },
  {
    id: "why",
    prompt: "Why",
    focus: "Find the reason",
    explanation: "Listen for because, due to, since, or because of.",
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
      explanation: "Why asks for the reason, so look for a cause.",
    },
  },
  {
    id: "how",
    prompt: "How",
    focus: "Find the way or condition",
    explanation: "How often points to methods, states, or manners such as by email, carefully, or very well.",
    examples: ["How did you send the file?", "How was the presentation?"],
    commonAnswers: ["by email", "by train", "carefully", "very well"],
    drill: {
      question: "How did you contact the customer?",
      options: ["By email", "At noon", "In the office", "The supervisor"],
      answer: "By email",
      explanation: "How asks about method or condition.",
    },
  },
  {
    id: "how-much",
    prompt: "How much",
    focus: "Find the price",
    explanation: "Look for money, discount, or total cost.",
    examples: ["How much is the repair fee?", "How much did the tickets cost?"],
    commonAnswers: ["ten dollars", "a 20 percent discount", "the total cost"],
    drill: {
      question: "How much is the upgrade service?",
      options: ["Fifteen dollars", "For two hours", "Near the counter", "Tomorrow"],
      answer: "Fifteen dollars",
      explanation: "How much asks for amount or price.",
    },
  },
  {
    id: "how-long",
    prompt: "How long",
    focus: "Find the duration",
    explanation: "Look for for two hours, until Friday, or about three days.",
    examples: ["How long will the repair take?", "How long is the seminar?"],
    commonAnswers: ["for two hours", "about three days", "until Friday"],
    drill: {
      question: "How long will the training last?",
      options: ["For two hours", "At two o'clock", "In Room 5", "The instructor"],
      answer: "For two hours",
      explanation: "How long asks about duration, not a clock time or place.",
    },
  },
];

export const LISTENING_TRAPS = [
  {
    id: "where-vs-when",
    title: "Where but you pick time",
    pattern: "The question starts with Where, but one option contains tomorrow or at 9 a.m. That is not a place.",
    fix: "When you hear Where, immediately search for location words such as in, on, at, near, next to.",
  },
  {
    id: "when-vs-where",
    title: "When but you pick location",
    pattern: "The question starts with When, but one option gives a place such as in the office or near the station.",
    fix: "When asks for time, date, or duration. Ignore place words.",
  },
  {
    id: "echo-keyword",
    title: "Keyword echo trap",
    pattern: "The audio mentions shipment, and one option repeats shipment, but the real answer may be the next action or the reason.",
    fix: "Do not choose only because a word repeats. Always match the question type first.",
  },
  {
    id: "sound-alike",
    title: "Sound-alike trap",
    pattern: "Words like bill and build or fare and fair can sound close when you are nervous.",
    fix: "Listen for the whole chunk, especially the last sound and the sentence meaning around it.",
  },
  {
    id: "next-step",
    title: "Next step trap",
    pattern: "A question asks what will happen next, but the early part of the audio only gives background information.",
    fix: "Find the action after will, going to, need to, or please. That is usually the answer.",
  },
];

export const GRAMMAR_GUIDES = [
  {
    id: "parts-of-speech",
    title: "詞性判斷",
    tip: "冠詞 the / a / an 後面常接名詞；very 後面常接形容詞或副詞。",
  },
  {
    id: "tense",
    title: "時態關鍵字",
    tip: "yesterday 看過去式；tomorrow / next week 看未來式；since / for 常見完成式訊號。",
  },
  {
    id: "subject-verb",
    title: "主詞動詞一致",
    tip: "He / She / It 後面常接動詞加 s；They / We / You 後面接原形動詞。",
  },
  {
    id: "passive",
    title: "被動語態",
    tip: "be + p.p. 幾乎就是被動語態提示。",
  },
  {
    id: "preposition",
    title: "介系詞",
    tip: "in + 月份年份；on + 日期星期；at + 時間點或小地點。",
  },
  {
    id: "connector",
    title: "連接詞",
    tip: "because 表原因；although 表讓步；therefore 表結果。",
  },
];

export const READING_LADDER = [
  { id: "word", label: "Word", goal: "先把單字意思讀懂，建立最基本的閱讀信心。" },
  { id: "phrase", label: "Phrase", goal: "看懂常考商務片語，避免看到熟字卻讀不懂整體意思。" },
  { id: "sentence", label: "Sentence", goal: "抓主詞、動詞、時間字，把短句讀穩。" },
  { id: "passage", label: "Passage", goal: "先看題目，再回短文定位重點資訊。" },
  { id: "part7", label: "Part 7", goal: "練 purpose、detail、next action 和 NOT 題。" },
];
