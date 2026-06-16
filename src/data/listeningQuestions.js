import { sentencePatterns } from "./sentencePatterns.js";
import { vocabularyBank } from "./vocabulary/index.js";

export const listeningLevels = [
  {
    id: 1,
    title: "Level 1 Word to Chinese",
    description: "從單字聽力開始，先建立最基本的商務字彙辨識。",
  },
  {
    id: 2,
    title: "Level 2 Word to English",
    description: "聽到發音後，練習辨認正確英文單字。",
  },
  {
    id: 3,
    title: "Level 3 Short Sentence",
    description: "從短句開始聽意思，降低一開始聽長對話的壓力。",
  },
  {
    id: 4,
    title: "Level 4 Question and Response",
    description: "練習 Where / When / Why / How 等關鍵問句。",
  },
  {
    id: 5,
    title: "Level 5 TOEIC-style Mini Talks",
    description: "進入接近 TOEIC 的公告、對話與下一步判斷。",
  },
];

const simpleWords = vocabularyBank.filter(
  (word) => !word.word.includes(" ") && word.word.length <= 18 && word.meaning.length <= 10,
);

function sampleDistractors(pool, answer, getValue, count = 3) {
  const used = new Set([answer]);
  const options = [];

  for (let index = 0; index < pool.length && options.length < count; index += 1) {
    const value = getValue(pool[index]);
    if (used.has(value)) {
      continue;
    }
    used.add(value);
    options.push(value);
  }

  return options;
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

const listeningQuestions = [];
let id = 1;

for (let index = 0; index < 900; index += 1) {
  const word = simpleWords[index % simpleWords.length];
  const distractorPool = simpleWords.filter(
    (item) => item.category === word.category && item.id !== word.id,
  );
  const options = shuffle([
    word.meaning,
    ...sampleDistractors(distractorPool, word.meaning, (item) => item.meaning),
  ]);

  listeningQuestions.push({
    id: `l-${String(id).padStart(4, "0")}`,
    level: 1,
    difficulty: "easy",
    prompt: "Listen to the word and choose the Chinese meaning.",
    audioText: word.word,
    transcript: word.word,
    options,
    answer: word.meaning,
    keyword: word.word,
    category: word.category,
    relatedWordId: word.id,
    explanationZh: `${word.word} 的意思是「${word.meaning}」。`,
    why: `這題先抓單字本身，不要被其他同類商務字混淆。${word.exampleZh}`,
    trapAnalysis: `如果你把 ${word.word} 和同類字搞混，下次先注意它常出現在 ${word.category} 情境。`,
  });
  id += 1;
}

for (let index = 0; index < 700; index += 1) {
  const word = simpleWords[(index + 900) % simpleWords.length];
  const distractorPool = simpleWords.filter(
    (item) => item.level === word.level && item.id !== word.id,
  );
  const options = shuffle([
    word.word,
    ...sampleDistractors(distractorPool, word.word, (item) => item.word),
  ]);

  listeningQuestions.push({
    id: `l-${String(id).padStart(4, "0")}`,
    level: 2,
    difficulty: "easy",
    prompt: "Listen to the word and choose the English answer.",
    audioText: word.word,
    transcript: word.word,
    options,
    answer: word.word,
    keyword: word.meaning,
    category: word.category,
    relatedWordId: word.id,
    explanationZh: `這題聽到的是 ${word.word}，中文是「${word.meaning}」。`,
    why: "單字聽寫最怕同音或開頭相似，下次先抓第一個音節。",
    trapAnalysis: `常見陷阱是把 ${word.word} 聽成發音接近的字，所以要先穩住前半段音。`,
  });
  id += 1;
}

const sentencePool = sentencePatterns.slice(0, 700);
const sentenceZhPool = sentencePatterns.slice(60, 760);

for (let index = 0; index < 700; index += 1) {
  const item = sentencePool[index];
  const distractorPool = sentenceZhPool.filter((entry) => entry.id !== item.id);
  const options = shuffle([
    item.exampleZh,
    ...sampleDistractors(distractorPool, item.exampleZh, (entry) => entry.exampleZh),
  ]);

  listeningQuestions.push({
    id: `l-${String(id).padStart(4, "0")}`,
    level: 3,
    difficulty: "normal",
    prompt: "Listen to the sentence and choose the best Chinese meaning.",
    audioText: item.example,
    transcript: item.example,
    options,
    answer: item.exampleZh,
    keyword: item.category,
    category: item.category,
    explanationZh: `句子重點在 ${item.category}，完整意思是：${item.exampleZh}`,
    why: `先抓主詞、動詞和時間字，再判斷整句意思。${item.tip}`,
    trapAnalysis: "如果你只抓到單字卻沒抓到動作和時間，容易選到看起來像、意思卻不完整的選項。",
  });
  id += 1;
}

const qaPatterns = [
  {
    type: "Where",
    question: (word) => `Where should I leave the ${word.word}?`,
    answer: (word) => `At the ${word.category.toLowerCase()} desk.`,
    distractors: ["Tomorrow morning.", "Because the file is urgent.", "By email."],
    explanation: "Where 題先找地點答案。",
    trap: "如果你看到 tomorrow 或 at 3 p.m.，那是時間，不是地點。",
  },
  {
    type: "When",
    question: (word) => `When will the ${word.word} be ready?`,
    answer: () => "By Friday afternoon.",
    distractors: ["In the lobby.", "The project manager.", "Because of the delay."],
    explanation: "When 題先找時間、日期或時段。",
    trap: "不要被地點詞或人物詞帶走。",
  },
  {
    type: "Who",
    question: (word) => `Who approved the ${word.word}?`,
    answer: () => "The finance director.",
    distractors: ["In Room B.", "Tomorrow morning.", "Because it was urgent."],
    explanation: "Who 題找人物或職稱。",
    trap: "看到時間或地點就先排除。",
  },
  {
    type: "Why",
    question: (word) => `Why was the ${word.word} delayed?`,
    answer: () => "Because the supplier changed the schedule.",
    distractors: ["At the airport gate.", "Next Tuesday.", "The assistant manager."],
    explanation: "Why 題重點是原因，常見 because / due to。",
    trap: "Why 很容易錯選 Where 或 When 類型答案。",
  },
  {
    type: "How much",
    question: (word) => `How much did the ${word.word} cost?`,
    answer: () => "About twenty dollars.",
    distractors: ["For two hours.", "Near the reception desk.", "The sales intern."],
    explanation: "How much 題要找價格或數字。",
    trap: "如果選到 for two hours，那是 How long，不是 How much。",
  },
  {
    type: "How long",
    question: (word) => `How long will the ${word.word} take?`,
    answer: () => "For about three days.",
    distractors: ["At the service counter.", "About twenty dollars.", "The branch office."],
    explanation: "How long 題看時間長度。",
    trap: "金額和地點都不是這題的重點。",
  },
];

for (let index = 0; index < 400; index += 1) {
  const word = simpleWords[(index + 1600) % simpleWords.length];
  const pattern = qaPatterns[index % qaPatterns.length];
  const answer = pattern.answer(word);
  const options = shuffle([answer, ...pattern.distractors]);

  listeningQuestions.push({
    id: `l-${String(id).padStart(4, "0")}`,
    level: 4,
    difficulty: "green",
    prompt: "Listen to the question and choose the best response.",
    audioText: pattern.question(word),
    transcript: pattern.question(word),
    options,
    answer,
    keyword: pattern.type,
    category: `${pattern.type} Keyword Coach`,
    relatedWordId: word.id,
    explanationZh: `${pattern.explanation} 正確答案是：${answer}`,
    why: `這題先聽第一個疑問詞 ${pattern.type}，再找對應類型的答案。`,
    trapAnalysis: pattern.trap,
  });
  id += 1;
}

const talkPurpose = [
  "confirm a delivery",
  "reschedule a meeting",
  "report a delay",
  "announce a training session",
  "request technical support",
  "check a hotel reservation",
];

for (let index = 0; index < 300; index += 1) {
  const word = simpleWords[(index + 2000) % simpleWords.length];
  const purpose = talkPurpose[index % talkPurpose.length];
  const talk = [
    `Hello, this is Maya from the ${word.category} team.`,
    `I'm calling to ${purpose}.`,
    `Please review the ${word.word} before 3 p.m.`,
    `If you have any questions, contact customer service right away.`,
  ].join(" ");

  const question = "What is the next step?";
  const answer = `Review the ${word.word} before 3 p.m.`;
  const options = shuffle([
    answer,
    "Wait until next month.",
    "Go to the airport gate.",
    "Cancel the customer account immediately.",
  ]);

  listeningQuestions.push({
    id: `l-${String(id).padStart(4, "0")}`,
    level: 5,
    difficulty: "blue",
    prompt: question,
    audioText: talk,
    transcript: talk,
    options,
    answer,
    keyword: purpose,
    category: word.category,
    relatedWordId: word.id,
    explanationZh: `最後一句提到 Please review the ${word.word} before 3 p.m.，所以下一步就是先檢查它。`,
    why: "下一步行動題要特別抓 will / need to / please 之後的動作。",
    trapAnalysis: "這類題最常被前面提到的背景資訊誤導，真正答案通常藏在最後一句的指示動作。",
  });
  id += 1;
}

export { listeningQuestions };
