import { vocabularyBank } from "./vocabulary/index.js";

const nouns = vocabularyBank
  .filter((item) => item.partOfSpeech.includes("noun") && !item.word.includes(" "))
  .slice(0, 240);

const subjects = [
  ["The manager", "經理"],
  ["The team", "團隊"],
  ["Our supplier", "供應商"],
  ["The customer service staff", "客服人員"],
  ["The project leader", "專案主管"],
  ["The accountant", "會計人員"],
  ["The engineer", "工程師"],
  ["The sales representative", "業務代表"],
];

const verbs = [
  ["review", "檢查"],
  ["update", "更新"],
  ["approve", "核准"],
  ["organize", "整理"],
  ["track", "追蹤"],
  ["prepare", "準備"],
  ["schedule", "安排"],
  ["deliver", "交付"],
];

const timePhrases = [
  ["every Monday", "每週一"],
  ["this morning", "今天早上"],
  ["before noon", "中午前"],
  ["next week", "下週"],
  ["after the meeting", "會議後"],
  ["by Friday", "在週五前"],
  ["during the workshop", "在研討會期間"],
  ["for the client", "為了客戶"],
];

const patternBuilders = [
  {
    category: "subject-verb",
    difficulty: "easy",
    explanation: "主詞是單數時，現在簡單式動詞通常加 s 或 es。",
    tip: "先找主詞是單數還是複數，再決定動詞形式。",
    build: (noun, index) => {
      const [subject, subjectZh] = subjects[index % subjects.length];
      const [verb, verbZh] = verbs[index % verbs.length];
      const [time, timeZh] = timePhrases[index % timePhrases.length];
      const sentence = `${subject} ${verb}${subject === "The team" ? "" : "s"} the ${noun.word} ${time}.`;
      return {
        pattern: sentence,
        example: sentence,
        exampleZh: `${subjectZh}${timeZh}${verbZh}${noun.meaning}。`,
      };
    },
  },
  {
    category: "tense",
    difficulty: "easy",
    explanation: "看到 yesterday、last week、next week 這類時間字，就先判斷時態。",
    tip: "先抓時間副詞，再決定要用過去式、現在式還是未來式。",
    build: (noun, index) => {
      const [subject, subjectZh] = subjects[(index + 1) % subjects.length];
      const [verb, verbZh] = verbs[(index + 1) % verbs.length];
      const sentence = `${subject} will ${verb} the ${noun.word} next week.`;
      return {
        pattern: sentence,
        example: sentence,
        exampleZh: `${subjectZh}下週會${verbZh}${noun.meaning}。`,
      };
    },
  },
  {
    category: "passive",
    difficulty: "normal",
    explanation: "被動語態常見 be + p.p.，重點是東西被完成、被寄送、被核准。",
    tip: "看到 by 或要表達『被處理』，就先想被動語態。",
    build: (noun, index) => {
      const sentence = `The ${noun.word} was approved by the finance team yesterday.`;
      return {
        pattern: sentence,
        example: sentence,
        exampleZh: `${noun.meaning}昨天已由財務團隊核准。`,
      };
    },
  },
  {
    category: "relative-pronoun",
    difficulty: "normal",
    explanation: "關係代名詞 who / which / that 用來補充說明前面的名詞。",
    tip: "先找前面的先行詞，再看後面是修飾人還是事物。",
    build: (noun, index) => {
      const sentence = `The employee who checked the ${noun.word} will lead today's briefing.`;
      return {
        pattern: sentence,
        example: sentence,
        exampleZh: `檢查${noun.meaning}的那位員工今天會主持簡報。`,
      };
    },
  },
  {
    category: "participle",
    difficulty: "green",
    explanation: "分詞可以濃縮資訊，現在分詞主動，過去分詞偏被動。",
    tip: "看到句子想表達附帶動作時，很可能會用到分詞。",
    build: (noun, index) => {
      const sentence = `Reviewing the ${noun.word}, the manager noticed a delay in the schedule.`;
      return {
        pattern: sentence,
        example: sentence,
        exampleZh: `經理在查看${noun.meaning}時，注意到時程延誤。`,
      };
    },
  },
  {
    category: "infinitive",
    difficulty: "easy",
    explanation: "plan, hope, need, decide 後面常接 to + V。",
    tip: "看到 plan / decide / need，先想不定詞。",
    build: (noun, index) => {
      const sentence = `We plan to update the ${noun.word} before the client visit.`;
      return {
        pattern: sentence,
        example: sentence,
        exampleZh: `我們計畫在客戶來訪前更新${noun.meaning}。`,
      };
    },
  },
  {
    category: "gerund",
    difficulty: "easy",
    explanation: "enjoy, avoid, consider, finish 後面常接 V-ing。",
    tip: "動名詞很常出現在固定搭配裡，特別是 enjoy / avoid / finish。",
    build: (noun, index) => {
      const sentence = `She enjoys checking the ${noun.word} every morning.`;
      return {
        pattern: sentence,
        example: sentence,
        exampleZh: `她喜歡每天早上檢查${noun.meaning}。`,
      };
    },
  },
  {
    category: "conditional",
    difficulty: "green",
    explanation: "條件句常用 if 開頭，表示『如果…就…』。",
    tip: "看到 if，就先拆成條件和結果兩部分來看。",
    build: (noun, index) => {
      const [verb, verbZh] = verbs[(index + 2) % verbs.length];
      const sentence = `If you ${verb} the ${noun.word} today, we can finish the project on time.`;
      return {
        pattern: sentence,
        example: sentence,
        exampleZh: `如果你今天${verbZh}${noun.meaning}，我們就能準時完成專案。`,
      };
    },
  },
];

const sentencePatterns = [];
let id = 1;

patternBuilders.forEach((builder, groupIndex) => {
  for (let index = 0; index < 200; index += 1) {
    const noun = nouns[(groupIndex * 37 + index) % nouns.length];
    const built = builder.build(noun, index);
    sentencePatterns.push({
      id: `sp-${String(id).padStart(4, "0")}`,
      category: builder.category,
      pattern: built.pattern,
      explanation: builder.explanation,
      example: built.example,
      exampleZh: built.exampleZh,
      tip: builder.tip,
      difficulty: builder.difficulty,
    });
    id += 1;
  }
});

export { sentencePatterns };
