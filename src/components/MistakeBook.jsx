import { useState } from "react";

const DOMAIN_LABELS = {
  vocabulary: "單字",
  listening: "聽力",
  grammar: "文法",
  reading: "閱讀",
};

const PAGE_BY_DOMAIN = {
  vocabulary: "quiz",
  listening: "listening",
  grammar: "grammar",
  reading: "reading",
};

function MistakeBook({ mistakes, onNavigate }) {
  const [tab, setTab] = useState("all");

  const filtered = mistakes.filter((item) => (tab === "all" ? true : item.domain === tab));

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Mistake Book</p>
          <h2>錯題本</h2>
          <p className="hero-description">
            不是做錯就算了。把錯因記下來，下一次才知道要看哪個關鍵字。
          </p>
        </div>
      </div>

      <div className="quest-card filter-bar">
        <div className="tabs">
          {["all", "vocabulary", "listening", "grammar", "reading"].map((item) => (
            <button
              key={item}
              type="button"
              className={`tab-button ${tab === item ? "active" : ""}`}
              onClick={() => setTab(item)}
            >
              {item === "all" ? "全部" : DOMAIN_LABELS[item]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <article className="quest-card">
          <h3>目前沒有錯題</h3>
          <p>你還沒有累積錯題，或這個分類的錯題已經清空。繼續練習吧。</p>
        </article>
      ) : (
        <div className="card-grid">
          {filtered.map((item) => (
            <article key={item.key} className="quest-card resource-card">
              <div className="card-topline">
                <div>
                  <p className="eyebrow">{DOMAIN_LABELS[item.domain]}</p>
                  <h3>{item.prompt}</h3>
                </div>
              </div>
              <p>你的答案：{item.userAnswer || "未作答"}</p>
              <p>正確答案：{item.correctAnswer}</p>
              <p>錯誤原因：{item.reason}</p>
              <div className="card-row stats-row">
                <span>錯誤次數 {item.wrongCount}</span>
                <span>最後練習 {new Date(item.lastPracticed).toLocaleDateString("zh-TW")}</span>
              </div>
              <button
                type="button"
                className="primary-button"
                onClick={() => onNavigate(PAGE_BY_DOMAIN[item.domain])}
              >
                重新練習這一類
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MistakeBook;
