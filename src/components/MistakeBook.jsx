import { useState } from "react";

const tabs = [
  { id: "vocabulary", label: "單字錯題" },
  { id: "listening", label: "聽力錯題" },
  { id: "grammar", label: "文法錯題" },
  { id: "reading", label: "閱讀錯題" },
];

export default function MistakeBook({ mistakes, onRetry }) {
  const [activeTab, setActiveTab] = useState("vocabulary");
  const activeMistakes = mistakes[activeTab] ?? [];

  return (
    <section className="page-stack">
      <div className="content-card">
        <div className="section-heading">
          <h2>錯題本</h2>
          <p>答錯不可怕，重點是下一次知道自己是錯在哪裡。</p>
        </div>

        <div className="pill-row">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`pill-button ${activeTab === tab.id ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({mistakes[tab.id]?.length ?? 0})
            </button>
          ))}
        </div>
      </div>

      {activeMistakes.length === 0 ? (
        <div className="content-card empty-card">
          <h3>這一區目前沒有錯題</h3>
          <p>先去做幾題練習，錯過的題目就會自動放進來。</p>
        </div>
      ) : (
        <div className="mistake-grid">
          {activeMistakes.map((item) => (
            <article key={item.id} className="content-card mistake-card">
              <div className="mistake-head">
                <strong>{item.title}</strong>
                <span className="badge badge-mint">{item.difficulty}</span>
              </div>
              <p>題目：{item.prompt}</p>
              <p>你的答案：{item.userAnswer}</p>
              <p>正確答案：{item.correctAnswer}</p>
              <p>錯誤原因：{item.whyWrong}</p>
              <p>錯誤次數：{item.wrongCount}</p>
              <p>最後練習：{item.lastPracticedAt}</p>
              <button type="button" className="primary-button" onClick={() => onRetry(item)}>
                重新練習
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
