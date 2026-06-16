import { vocabularyBank } from "./vocabulary/index.js";

export const grammarTopics = [
  { id: "parts-of-speech", label: "詞性" },
  { id: "tense", label: "時態" },
  { id: "preposition", label: "介系詞" },
  { id: "connector", label: "連接詞" },
  { id: "passive", label: "被動語態" },
  { id: "participle", label: "分詞" },
  { id: "relative-pronoun", label: "關係代名詞" },
  { id: "subject-verb", label: "主詞動詞一致" },
];

const nouns = vocabularyBank
  .filter((item) => item.partOfSpeech.includes("noun") && !item.word.includes(" "))
  .slice(0, 280);

const people = ["manager", "engineer", "accountant", "sales clerk", "project leader"];

const grammarQuestions = [];
let id = 1;

function pushQuestion(question) {
  grammarQuestions.push({
    id: `g-${String(id).padStart(4, "0")}`,
    ...question,
  });
  id += 1;
}

for (let index = 0; index < 375; index += 1) {
  const noun = nouns[index % nouns.length];
  pushQuestion({
    topic: "subject-verb",
    difficulty: "easy",
    sentence: `The ${people[index % people.length]} ____ the ${noun.word} every Monday morning.`,
    translation: `${people[index % people.length]} 每週一早上都會處理${noun.meaning}。`,
    options: ["review", "reviews", "reviewing", "reviewed"],
    answer: "reviews",
    keyword: "The + singular noun",
    technique: "看到單數主詞加上 every Monday，多半用現在簡單式，動詞要加 s。",
    explanationZh: "主詞是單數，所以 review 要變成 reviews。",
  });
}

for (let index = 0; index < 375; index += 1) {
  const noun = nouns[(index + 40) % nouns.length];
  pushQuestion({
    topic: "tense",
    difficulty: index < 180 ? "easy" : "normal",
    sentence: `We ____ the ${noun.word} yesterday afternoon.`,
    translation: `我們昨天下午處理了${noun.meaning}。`,
    options: ["check", "checks", "checked", "will check"],
    answer: "checked",
    keyword: "yesterday afternoon",
    technique: "看到 yesterday、last week 這類時間字，就優先想過去式。",
    explanationZh: "句子有 yesterday afternoon，所以要用過去式 checked。",
  });
}

for (let index = 0; index < 375; index += 1) {
  const noun = nouns[(index + 80) % nouns.length];
  pushQuestion({
    topic: "parts-of-speech",
    difficulty: "easy",
    sentence: `Please submit the ____ ${noun.word} before noon.`,
    translation: `請在中午前提交完整的${noun.meaning}。`,
    options: ["complete", "completely", "completion", "completes"],
    answer: "complete",
    keyword: "the ____ noun",
    technique: "冠詞 the 和名詞中間通常放形容詞。",
    explanationZh: `${noun.word} 是名詞，所以前面應放形容詞 complete。`,
  });
}

const prepMarkers = [
  ["____ 9 a.m.", "在上午九點", "at"],
  ["____ Monday", "在星期一", "on"],
  ["____ July", "在七月", "in"],
  ["____ the lobby", "在大廳", "in"],
  ["____ the airport gate", "在登機口", "at"],
];

for (let index = 0; index < 375; index += 1) {
  const noun = nouns[(index + 120) % nouns.length];
  const marker = prepMarkers[index % prepMarkers.length];
  pushQuestion({
    topic: "preposition",
    difficulty: "easy",
    sentence: `The ${noun.word} review will start ${marker[0]}.`,
    translation: `${noun.meaning}檢查會${marker[1]}開始。`,
    options: ["in", "on", "at", "for"],
    answer: marker[2],
    keyword: marker[0].replace("____ ", ""),
    technique: "at 接時間點或小地點，on 接日期星期，in 接月份年份或大範圍。",
    explanationZh: `這裡要搭配 ${marker[1]}，正確介系詞是 ${marker[2]}。`,
  });
}

for (let index = 0; index < 375; index += 1) {
  const noun = nouns[(index + 160) % nouns.length];
  pushQuestion({
    topic: "connector",
    difficulty: "normal",
    sentence: `The shipment was delayed ____ heavy rain near the port.`,
    translation: `這批出貨因為港口附近的大雨而延誤。`,
    options: ["because", "because of", "although", "however"],
    answer: "because of",
    keyword: "heavy rain",
    technique: "後面如果接名詞片語，用 because of；如果接完整子句，才用 because。",
    explanationZh: "heavy rain 是名詞片語，所以答案要選 because of。",
  });
}

for (let index = 0; index < 375; index += 1) {
  const noun = nouns[(index + 200) % nouns.length];
  pushQuestion({
    topic: "passive",
    difficulty: index < 180 ? "easy" : "normal",
    sentence: `The ${noun.word} was ____ by the finance team this morning.`,
    translation: `${noun.meaning}今天早上已由財務團隊處理。`,
    options: ["process", "processed", "processing", "processes"],
    answer: "processed",
    keyword: "was ____ by",
    technique: "看到 be + ____ + by，就先想被動語態，答案多半是過去分詞。",
    explanationZh: "was ... by 是被動語態訊號，所以要用 processed。",
  });
}

for (let index = 0; index < 375; index += 1) {
  const noun = nouns[(index + 240) % nouns.length];
  pushQuestion({
    topic: "participle",
    difficulty: "green",
    sentence: `____ the ${noun.word}, the manager found several errors.`,
    translation: `在檢查${noun.meaning}時，經理發現了幾個錯誤。`,
    options: ["Reviewing", "Reviewed", "Review", "Reviews"],
    answer: "Reviewing",
    keyword: "comma after participle phrase",
    technique: "句首要放分詞片語時，常用 V-ing 表示主動進行中的附帶動作。",
    explanationZh: "主詞是經理，前面要表達『在檢查時』，所以用 Reviewing。",
  });
}

for (let index = 0; index < 375; index += 1) {
  const noun = nouns[(index + 20) % nouns.length];
  pushQuestion({
    topic: "relative-pronoun",
    difficulty: "green",
    sentence: `The employee ____ updated the ${noun.word} is waiting in the lobby.`,
    translation: `更新${noun.meaning}的那位員工正在大廳等候。`,
    options: ["who", "which", "where", "whose"],
    answer: "who",
    keyword: "employee",
    technique: "先行詞是人，後面又是主格子句，所以通常用 who。",
    explanationZh: "employee 是人，所以關係代名詞應選 who。",
  });
}

export { grammarQuestions };
