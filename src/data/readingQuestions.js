import { phraseBank } from "./phraseBank.js";
import { sentencePatterns } from "./sentencePatterns.js";
import { vocabularyBank } from "./vocabulary/index.js";

const baseWords = vocabularyBank
  .filter((item) => item.partOfSpeech.includes("noun") && !item.word.includes(" "))
  .slice(0, 320);

const passageTypes = [
  "Email",
  "Memo",
  "Notice",
  "Advertisement",
  "Invoice",
  "Schedule",
  "Report",
  "Letter",
  "Chat Message",
];

const readingQuestions = [];
let id = 1;

function pushItem(item) {
  readingQuestions.push({
    id: `r-${String(id).padStart(4, "0")}`,
    ...item,
  });
  id += 1;
}

for (let index = 0; index < 120; index += 1) {
  const word = baseWords[index % baseWords.length];
  pushItem({
    stage: "word",
    type: "Word Drill",
    title: `Word ${index + 1}`,
    text: word.word,
    translation: word.meaning,
    keywords: [word.word, word.category],
    strategy: "先用最短材料穩住單字理解，看到字先不要急著逐字翻譯。",
    questions: [
      {
        id: `r-word-${index + 1}`,
        question: `What does "${word.word}" mean?`,
        options: [
          word.meaning,
          baseWords[(index + 1) % baseWords.length].meaning,
          baseWords[(index + 2) % baseWords.length].meaning,
          baseWords[(index + 3) % baseWords.length].meaning,
        ],
        answer: word.meaning,
        explanationZh: `${word.word} 的意思是「${word.meaning}」。`,
      },
    ],
  });
}

for (let index = 0; index < 120; index += 1) {
  const phrase = phraseBank[index];
  pushItem({
    stage: "phrase",
    type: "Phrase Drill",
    title: `Phrase ${index + 1}`,
    text: phrase.phrase,
    translation: phrase.meaning,
    keywords: [phrase.category, phrase.phrase.split(" ")[0]],
    strategy: "片語題先看核心動詞或介系詞，再判斷整體意思。",
    questions: [
      {
        id: `r-phrase-${index + 1}`,
        question: `Which Chinese meaning matches "${phrase.phrase}"?`,
        options: [
          phrase.meaning,
          phraseBank[(index + 20) % phraseBank.length].meaning,
          phraseBank[(index + 40) % phraseBank.length].meaning,
          phraseBank[(index + 60) % phraseBank.length].meaning,
        ],
        answer: phrase.meaning,
        explanationZh: `這個片語的意思是「${phrase.meaning}」。`,
      },
    ],
  });
}

for (let index = 0; index < 220; index += 1) {
  const pattern = sentencePatterns[index];
  pushItem({
    stage: "sentence",
    type: "Short Sentence",
    title: `Sentence ${index + 1}`,
    text: pattern.example,
    translation: pattern.exampleZh,
    keywords: [pattern.category, pattern.difficulty],
    strategy: "先看題目問什麼，再回句子抓主詞、動詞、時間字。",
    questions: [
      {
        id: `r-sentence-${index + 1}`,
        question: "What is the sentence mainly about?",
        options: [
          pattern.exampleZh,
          sentencePatterns[(index + 30) % sentencePatterns.length].exampleZh,
          sentencePatterns[(index + 60) % sentencePatterns.length].exampleZh,
          sentencePatterns[(index + 90) % sentencePatterns.length].exampleZh,
        ],
        answer: pattern.exampleZh,
        explanationZh: `這句話的完整意思是：${pattern.exampleZh}`,
      },
    ],
  });
}

for (let index = 0; index < 260; index += 1) {
  const word = baseWords[(index + 60) % baseWords.length];
  const type = passageTypes[index % passageTypes.length];
  const text = [
    `${type}`,
    `Subject: ${word.word} update`,
    `Hello team,`,
    `The ${word.word} for the ${word.category.toLowerCase()} team will be reviewed on Thursday at 2 p.m.`,
    `Please check the attached schedule and contact the project leader if you have questions.`,
    `Thank you.`,
  ].join("\n");

  pushItem({
    stage: "passage",
    type,
    title: `${type} ${index + 1}`,
    text,
    translation: `主旨：${word.meaning}更新。${word.meaning}將在週四下午兩點由${word.category}團隊檢查。若有問題，請聯絡專案負責人。`,
    keywords: [word.word, "Thursday", "2 p.m.", "contact the project leader"],
    strategy: "purpose 看開頭，detail 回原文定位，next action 看 please / contact / review。",
    questions: [
      {
        id: `r-passage-${index + 1}-1`,
        question: "What is the purpose of this message?",
        options: [
          `To announce a review of the ${word.word}`,
          "To cancel a hotel reservation",
          "To explain a salary increase",
          "To request a travel refund",
        ],
        answer: `To announce a review of the ${word.word}`,
        explanationZh: `這篇主要是在通知大家要檢查 ${word.meaning}。`,
      },
      {
        id: `r-passage-${index + 1}-2`,
        question: "What should readers do next?",
        options: [
          "Check the schedule and contact the project leader if needed",
          "Visit the airport counter immediately",
          "Pay the invoice in cash",
          "Wait until next month",
        ],
        answer: "Check the schedule and contact the project leader if needed",
        explanationZh: "最後一句提到請查看時程，若有問題就聯絡專案負責人。",
      },
    ],
  });
}

for (let index = 0; index < 280; index += 1) {
  const word = baseWords[(index + 120) % baseWords.length];
  const type = passageTypes[(index + 3) % passageTypes.length];
  const text = [
    `${type}`,
    `To: All staff`,
    `From: Operations Office`,
    `The ${word.word} system will be unavailable from 8 p.m. to 10 p.m. on Friday for maintenance.`,
    `Please download any necessary files before the service window begins.`,
    `After 10 p.m., employees should log in again and confirm that all records were saved correctly.`,
  ].join("\n");

  pushItem({
    stage: "part7",
    type,
    title: `Part 7 ${index + 1}`,
    text,
    translation: `${word.meaning}系統將於週五晚間八點到十點停機維護。請事先下載需要的檔案，十點後重新登入並確認資料有正確保存。`,
    keywords: [word.word, "maintenance", "download files", "log in again"],
    strategy: "遇到 next action 題，優先找 please、should、need to；遇到 NOT 題要特別慢下來確認。",
    questions: [
      {
        id: `r-part7-${index + 1}-1`,
        question: "Why was this notice written?",
        options: [
          `To inform staff about maintenance on the ${word.word} system`,
          "To advertise a new restaurant",
          "To invite staff to a job fair",
          "To explain a travel itinerary",
        ],
        answer: `To inform staff about maintenance on the ${word.word} system`,
        explanationZh: "第一句已經說明是系統維護通知。",
      },
      {
        id: `r-part7-${index + 1}-2`,
        question: "What should employees do before 8 p.m.?",
        options: [
          "Download needed files",
          "Contact customer service",
          "Go to the finance office",
          "Print a boarding pass",
        ],
        answer: "Download needed files",
        explanationZh: "第二句的 please download any necessary files 就是關鍵答案。",
      },
    ],
  });
}

export { readingQuestions };
