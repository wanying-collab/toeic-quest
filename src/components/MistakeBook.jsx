import { useState } from "react";

const DOMAIN_LABELS = {
  vocabulary: "Vocabulary",
  listening: "Listening",
  grammar: "Grammar",
  reading: "Reading",
  speaking: "Speaking",
};

const PAGE_BY_DOMAIN = {
  vocabulary: "quiz",
  listening: "listening",
  grammar: "grammar",
  reading: "reading",
  speaking: "speaking",
};

function MistakeBook({ mistakes, onNavigate }) {
  const [tab, setTab] = useState("all");

  const filtered = mistakes.filter((item) => (tab === "all" ? true : item.domain === tab));

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Mistake Book</p>
          <h2>Turn weak answers into your next study plan</h2>
          <p className="hero-description">
            Every wrong answer is saved here with the reason, the correct answer, and a fast way back to practice.
          </p>
        </div>
      </div>

      <div className="quest-card filter-bar">
        <div className="tabs">
          {["all", "vocabulary", "listening", "grammar", "reading", "speaking"].map((item) => (
            <button
              key={item}
              type="button"
              className={`tab-button ${tab === item ? "active" : ""}`}
              onClick={() => setTab(item)}
            >
              {item === "all" ? "All" : DOMAIN_LABELS[item]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <article className="quest-card">
          <h3>No mistakes saved yet</h3>
          <p>Once you miss a question, it will appear here with the explanation and a retry shortcut.</p>
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
              <p>Your answer: {item.userAnswer || "(not captured)"}</p>
              <p>Correct answer: {item.correctAnswer}</p>
              <p>Why it matters: {item.reason}</p>
              <div className="card-row stats-row">
                <span>Wrong count {item.wrongCount}</span>
                <span>Last practiced {new Date(item.lastPracticed).toLocaleDateString("zh-TW")}</span>
              </div>
              <button
                type="button"
                className="primary-button"
                onClick={() => onNavigate(PAGE_BY_DOMAIN[item.domain])}
              >
                Practice Again
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MistakeBook;

