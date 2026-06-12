export const readingQuestions = [
  {
    id: "r1",
    stage: "sentence",
    type: "Short Sentence",
    title: "短句入門 1",
    text: "The meeting starts at 9.",
    translation: "會議九點開始。",
    keywords: ["meeting", "starts", "9"],
    strategy: "先抓主詞 meeting，再抓時間 at 9。",
    questions: [
      {
        id: "r1-q1",
        question: "會議什麼時候開始？",
        options: ["九點", "下午", "明天", "二樓"],
        answer: "九點",
        explanationZh: "句子裡的 at 9 就是答案。",
      },
    ],
  },
  {
    id: "r2",
    stage: "sentence",
    type: "Short Sentence",
    title: "短句入門 2",
    text: "Please send the invoice today.",
    translation: "請今天寄送發票。",
    keywords: ["send", "invoice", "today"],
    strategy: "先找動作 send，再找受詞 invoice 和時間 today。",
    questions: [
      {
        id: "r2-q1",
        question: "今天要寄送什麼？",
        options: ["發票", "包裹", "報告", "菜單"],
        answer: "發票",
        explanationZh: "invoice 是發票，所以今天要寄發票。",
      },
    ],
  },
  {
    id: "r3",
    stage: "phrase",
    type: "Phrase Drill",
    title: "片語閱讀",
    text: "Due to heavy rain, the delivery will arrive late.",
    translation: "由於大雨，貨件會晚點到。",
    keywords: ["due to", "delivery", "late"],
    strategy: "先認出 due to 表原因，再抓真正事件是 delivery late。",
    questions: [
      {
        id: "r3-q1",
        question: "送貨為什麼晚到？",
        options: ["因為大雨", "因為會議延後", "因為價格調整", "因為員工放假"],
        answer: "因為大雨",
        explanationZh: "due to heavy rain 直接說明原因。",
      },
    ],
  },
  {
    id: "r4",
    stage: "passage",
    type: "Email",
    title: "Email 練習",
    text:
      "Subject: Updated Training Schedule\n\nHello Team,\nThe customer service training has been moved to Thursday at 10 a.m. because the manager will be away on Wednesday. Please review the attached schedule and let me know if you have any questions.\n\nThank you,\nNina",
    translation:
      "主旨：更新後的訓練時程\n\n各位團隊成員你好：\n客服訓練已改到星期四上午十點，因為經理星期三不在。請查看附件的時程表，如果有問題請告訴我。\n\n謝謝\nNina",
    keywords: ["moved to Thursday", "10 a.m.", "manager will be away", "attached schedule"],
    strategy: "先看題目，再回文找時間、原因與附件資訊。",
    questions: [
      {
        id: "r4-q1",
        question: "訓練現在改到什麼時候？",
        options: ["星期四上午十點", "星期三下午兩點", "星期五上午十點", "今天下午"],
        answer: "星期四上午十點",
        explanationZh: "內文直接寫 moved to Thursday at 10 a.m.",
      },
      {
        id: "r4-q2",
        question: "訓練為什麼改期？",
        options: ["經理星期三不在", "場地太小", "客戶取消", "講師遲到"],
        answer: "經理星期三不在",
        explanationZh: "because the manager will be away on Wednesday 就是原因。",
      },
    ],
  },
  {
    id: "r5",
    stage: "passage",
    type: "Notice",
    title: "Notice 練習",
    text:
      "Notice\nThe cafeteria on the third floor will close at 2 p.m. today for equipment maintenance. Employees may use the first-floor cafe during this time.",
    translation:
      "通知\n三樓餐廳今天下午兩點將因設備維修而關閉。員工在此期間可使用一樓咖啡區。",
    keywords: ["third floor", "2 p.m.", "equipment maintenance", "first-floor cafe"],
    strategy: "Notice 題先找目的，再找替代方案。",
    questions: [
      {
        id: "r5-q1",
        question: "為什麼三樓餐廳會關閉？",
        options: ["設備維修", "人手不足", "要舉辦會議", "要進行促銷"],
        answer: "設備維修",
        explanationZh: "公告明確說明 for equipment maintenance。",
      },
      {
        id: "r5-q2",
        question: "員工在關閉期間可以去哪裡？",
        options: ["一樓咖啡區", "二樓大廳", "地下室倉庫", "會議室 B"],
        answer: "一樓咖啡區",
        explanationZh: "Employees may use the first-floor cafe during this time.",
      },
    ],
  },
  {
    id: "r6",
    stage: "part7",
    type: "Advertisement",
    title: "Advertisement 練習",
    text:
      "Grand Opening Sale!\nVisit Blue Harbor Travel this weekend and receive a 20 percent discount on selected tour packages. Customers who book by Sunday will also get a free airport shuttle voucher.",
    translation:
      "盛大開幕特賣！\n本週末前往 Blue Harbor Travel，可享指定旅遊套裝八折優惠。於週日前完成預訂的顧客，還可獲得免費機場接駁券。",
    keywords: ["20 percent discount", "book by Sunday", "free airport shuttle voucher"],
    strategy: "廣告題常考優惠內容、截止時間與贈品。",
    questions: [
      {
        id: "r6-q1",
        question: "顧客在週日前預訂可以得到什麼？",
        options: ["免費機場接駁券", "免費晚餐", "雙倍折扣", "免費升等房型"],
        answer: "免費機場接駁券",
        explanationZh: "book by Sunday will also get a free airport shuttle voucher。",
      },
    ],
  },
  {
    id: "r7",
    stage: "part7",
    type: "Memo",
    title: "Memo 練習",
    text:
      "Memo\nTo: All warehouse staff\nFrom: Kevin Chu\nStarting next Monday, all outgoing packages must be scanned twice before loading. This new step is intended to reduce shipping errors. Please contact Kevin if you need additional training.",
    translation:
      "備忘錄\n收件人：所有倉庫員工\n寄件人：Kevin Chu\n從下週一開始，所有出貨包裹在裝載前都必須掃描兩次。這個新步驟是為了減少出貨錯誤。如果你需要額外訓練，請聯絡 Kevin。",
    keywords: ["starting next Monday", "scanned twice", "reduce shipping errors", "contact Kevin"],
    strategy: "Memo 題常考規則變更、原因與後續行動。",
    questions: [
      {
        id: "r7-q1",
        question: "新規定何時開始？",
        options: ["下週一", "今天下午", "本週五", "下個月"],
        answer: "下週一",
        explanationZh: "Starting next Monday 直接給出開始時間。",
      },
      {
        id: "r7-q2",
        question: "若員工需要額外訓練，應該怎麼做？",
        options: ["聯絡 Kevin", "打電話給顧客", "前往二樓會議室", "重新列印標籤"],
        answer: "聯絡 Kevin",
        explanationZh: "Please contact Kevin if you need additional training.",
      },
    ],
  },
  {
    id: "r8",
    stage: "part7",
    type: "Invoice",
    title: "Invoice 練習",
    text:
      "Invoice\nWest Line Supplies\nOffice chairs (4) ........ $480\nDelivery fee ............. $30\nDiscount ................. -$40\nTotal .................... $470\nPayment due: June 30",
    translation:
      "發票\nWest Line Supplies\n辦公椅（4 張）...... 480 美元\n運費 ................. 30 美元\n折扣 ................. -40 美元\n總計 ................. 470 美元\n付款截止日：6 月 30 日",
    keywords: ["Delivery fee", "Discount", "Total", "Payment due"],
    strategy: "Invoice 題重點在數字、總額與付款日期。",
    questions: [
      {
        id: "r8-q1",
        question: "總金額是多少？",
        options: ["470 美元", "480 美元", "510 美元", "30 美元"],
        answer: "470 美元",
        explanationZh: "Total 一行明確寫 470 美元。",
      },
      {
        id: "r8-q2",
        question: "付款截止日是什麼時候？",
        options: ["6 月 30 日", "6 月 20 日", "7 月 1 日", "今天"],
        answer: "6 月 30 日",
        explanationZh: "Payment due: June 30 就是答案。",
      },
    ],
  },
];

export const readingStages = [...new Set(readingQuestions.map((item) => item.stage))];
