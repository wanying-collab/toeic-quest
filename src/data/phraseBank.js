import { vocabularyBank, vocabularyCategories } from "./vocabulary/index.js";

const phraseTemplates = [
  {
    lead: "in charge of",
    meaning: (zh) => `負責${zh}`,
    tip: "常用來描述工作職責與負責範圍。",
    example: (phrase) => `Ms. Chen is ${phrase} this quarter.`,
    exampleZh: (zh) => `陳小姐本季負責${zh}。`,
  },
  {
    lead: "be responsible for",
    meaning: (zh) => `對${zh}負責`,
    tip: "比 in charge of 更常出現在正式書信與公告。",
    example: (phrase) => `Our team will ${phrase} starting next month.`,
    exampleZh: (zh) => `我們團隊下個月起會對${zh}負責。`,
  },
  {
    lead: "deal with",
    meaning: (zh) => `處理${zh}`,
    tip: "TOEIC 常拿來搭配 complaint, request, order 等商務名詞。",
    example: (phrase) => `The support desk can ${phrase} right away.`,
    exampleZh: (zh) => `客服櫃台可以立刻處理${zh}。`,
  },
  {
    lead: "according to the",
    meaning: (zh) => `根據${zh}`,
    tip: "看到 according to，後面通常接文件、規則、時程或資料。",
    example: (phrase) => `According to the ${phrase.split(" ").slice(3).join(" ")}, the order is on time.`,
    exampleZh: (zh) => `根據${zh}，這筆訂單是準時的。`,
  },
  {
    lead: "due to the",
    meaning: (zh) => `由於${zh}`,
    tip: "due to 後面接名詞，不接完整子句。",
    example: (phrase) => `The shipment was delayed ${phrase}.`,
    exampleZh: (zh) => `這批出貨因為${zh}而延遲。`,
  },
  {
    lead: "follow up on the",
    meaning: (zh) => `追蹤${zh}`,
    tip: "客服、銷售、專案管理都很常出現。",
    example: (phrase) => `Please ${phrase} before noon.`,
    exampleZh: (zh) => `請在中午前追蹤${zh}。`,
  },
  {
    lead: "take part in the",
    meaning: (zh) => `參與${zh}`,
    tip: "常搭配 meeting, workshop, campaign, project。",
    example: (phrase) => `More interns will ${phrase} this week.`,
    exampleZh: (zh) => `本週會有更多實習生參與${zh}。`,
  },
  {
    lead: "look forward to the",
    meaning: (zh) => `期待${zh}`,
    tip: "look forward to 後面接名詞或 V-ing。",
    example: (phrase) => `We look forward to the ${phrase.split(" ").slice(4).join(" ")} next week.`,
    exampleZh: (zh) => `我們期待下週的${zh}。`,
  },
  {
    lead: "keep track of the",
    meaning: (zh) => `追蹤${zh}`,
    tip: "財務、物流、庫存題很常考。",
    example: (phrase) => `Use this dashboard to ${phrase}.`,
    exampleZh: (zh) => `請用這個儀表板追蹤${zh}。`,
  },
  {
    lead: "make sure the",
    meaning: (zh) => `確認${zh}`,
    tip: "下一步行動題常出現 make sure。",
    example: (phrase) => `Please ${phrase} is correct.`,
    exampleZh: (zh) => `請確認${zh}是正確的。`,
  },
  {
    lead: "in response to the",
    meaning: (zh) => `回應${zh}`,
    tip: "常用於 email、memo、客戶應對情境。",
    example: (phrase) => `We revised the schedule in response to the ${phrase.split(" ").slice(4).join(" ")}.`,
    exampleZh: (zh) => `我們為了回應${zh}而調整了時程。`,
  },
  {
    lead: "as part of the",
    meaning: (zh) => `作為${zh}的一部分`,
    tip: "常考 part of 結構。",
    example: (phrase) => `The training was added ${phrase}.`,
    exampleZh: (zh) => `這場訓練被納入${zh}的一部分。`,
  },
  {
    lead: "with regard to the",
    meaning: (zh) => `關於${zh}`,
    tip: "正式商務寫作很常見。",
    example: (phrase) => `I am writing with regard to the ${phrase.split(" ").slice(4).join(" ")}.`,
    exampleZh: (zh) => `我寫信是關於${zh}。`,
  },
  {
    lead: "ahead of the",
    meaning: (zh) => `在${zh}之前`,
    tip: "時間安排與專案管理常見。",
    example: (phrase) => `The files were submitted ${phrase}.`,
    exampleZh: (zh) => `這些檔案在${zh}之前就提交了。`,
  },
  {
    lead: "in line with the",
    meaning: (zh) => `符合${zh}`,
    tip: "正式商務寫作常用來表示符合政策、目標或需求。",
    example: (phrase) => `The proposal is ${phrase}.`,
    exampleZh: (zh) => `這份提案符合${zh}。`,
  },
  {
    lead: "prior to the",
    meaning: (zh) => `在${zh}之前`,
    tip: "比 before 更正式，常見於通知和合約。",
    example: (phrase) => `Please confirm the details ${phrase}.`,
    exampleZh: (zh) => `請在${zh}之前確認細節。`,
  },
  {
    lead: "on behalf of the",
    meaning: (zh) => `代表${zh}`,
    tip: "Email 和正式公告很常見。",
    example: (phrase) => `I am writing on behalf of the ${phrase.split(" ").slice(4).join(" ")}.`,
    exampleZh: (zh) => `我代表${zh}來信。`,
  },
  {
    lead: "in connection with the",
    meaning: (zh) => `與${zh}有關`,
    tip: "閱讀和商務書信常見。",
    example: (phrase) => `We need more documents in connection with the ${phrase.split(" ").slice(4).join(" ")}.`,
    exampleZh: (zh) => `我們需要更多和${zh}有關的文件。`,
  },
  {
    lead: "take care of the",
    meaning: (zh) => `處理${zh}`,
    tip: "客服和內部協作都很常用。",
    example: (phrase) => `Our team will ${phrase} this afternoon.`,
    exampleZh: (zh) => `我們團隊今天下午會處理${zh}。`,
  },
  {
    lead: "be familiar with the",
    meaning: (zh) => `熟悉${zh}`,
    tip: "常出現在訓練、職務說明和面試回答。",
    example: (phrase) => `New staff should ${phrase} before Friday.`,
    exampleZh: (zh) => `新進同仁應在週五前熟悉${zh}。`,
  },
];

function buildCategoryTargets() {
  const grouped = new Map();

  vocabularyBank.forEach((word) => {
    if (!word.category || !word.meaning || word.word.includes(" ")) {
      return;
    }
    if (!word.partOfSpeech.includes("noun")) {
      return;
    }
    if ((grouped.get(word.category) ?? []).length >= 10) {
      return;
    }
    const list = grouped.get(word.category) ?? [];
    if (!list.some((item) => item.word === word.word)) {
      list.push(word);
      grouped.set(word.category, list);
    }
  });

  return vocabularyCategories.flatMap((category) => grouped.get(category.label) ?? []);
}

const categoryTargets = buildCategoryTargets();
const phraseMap = new Map();
let phraseId = 1;

phraseTemplates.forEach((template) => {
  categoryTargets.forEach((target, index) => {
    const phrase = `${template.lead} ${target.word}`.replace(/\s+/g, " ").trim();
    if (phraseMap.has(phrase)) {
      return;
    }

    phraseMap.set(phrase, {
      id: `ph-${String(phraseId).padStart(4, "0")}`,
      category: target.category,
      phrase,
      meaning: template.meaning(target.meaning),
      tip: template.tip,
      example: template.example(phrase, target, index),
      exampleZh: template.exampleZh(target.meaning, target, index),
    });
    phraseId += 1;
  });
});

const fixedCorePhrases = [
  ["in charge of", "負責", "常見於職責說明。"],
  ["due to", "由於", "後面接名詞。"],
  ["according to", "根據", "常接 schedule, report, policy。"],
  ["look forward to", "期待", "to 後面接名詞或 V-ing。"],
  ["take part in", "參與", "常搭配 meeting, campaign, workshop。"],
  ["deal with", "處理", "客服和商務情境超常見。"],
  ["as soon as possible", "盡快", "常見於 email 和通知。"],
  ["be responsible for", "對…負責", "正式寫作常見。"],
  ["make sure", "確認", "下一步行動題常出現。"],
  ["in addition to", "除了…之外", "閱讀與文法都常考。"],
  ["follow up on", "追蹤", "銷售、客服、專案管理常考。"],
  ["keep track of", "追蹤", "常搭配 expenses, orders, inventory。"],
  ["with regard to", "關於", "正式商務書信常見。"],
  ["ahead of schedule", "提前", "時程題常出現。"],
  ["subject to approval", "待核准", "合約與流程題常見。"],
  ["at no additional cost", "不另外收費", "客服與銷售題常見。"],
];

fixedCorePhrases.forEach(([phrase, meaning, tip]) => {
  if (phraseMap.has(phrase)) {
    return;
  }
  phraseMap.set(phrase, {
    id: `ph-${String(phraseId).padStart(4, "0")}`,
    category: "Business",
    phrase,
    meaning,
    tip,
    example: `Please ${phrase} when you reply to the client.`,
    exampleZh: `回覆客戶時請記得使用「${phrase}」這類表達。`,
  });
  phraseId += 1;
});

export const phraseBank = [...phraseMap.values()];
