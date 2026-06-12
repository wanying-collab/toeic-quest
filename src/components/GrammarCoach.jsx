import { useEffect, useState } from "react";

function GrammarCoach({ questions, topics, guides, onRecordAnswer }) {
  const [topic, setTopic] = useState("all");
  const [current, setCurrent] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const filtered = questions.filter((question) => (topic === "all" ? true : question.topic === topic));

  useEffect(() => {
    if (filtered.length > 0) {
      setCurrent(filtered[Math.floor(Math.random() * filtered.length)]);
      setFeedback(null);
    }
  }, [topic]);

  useEffect(() => {
    if (!current && filtered.length > 0) {
      setCurrent(filtered[Math.floor(Math.random() * filtered.length)]);
    }
  }, [current, filtered]);

  if (!current) {
    return null;
  }

  const answerQuestion = (option) => {
    const correct = option === current.answer;
    setFeedback({ correct, option });

    onRecordAnswer({
      domain: "grammar",
      itemId: current.id,
      category: current.topic,
      prompt: current.sentence,
      correct,
      userAnswer: option,
      correctAnswer: current.answer,
      explanationZh: current.explanationZh,
      reason: correct
        ? current.technique
        : `這題要看 ${current.keyword}。${current.technique}`,
    });
  };

  const nextQuestion = () => {
    setCurrent(filtered[Math.floor(Math.random() * filtered.length)]);
    setFeedback(null);
  };

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Grammar Coach</p>
          <h2>基礎文法教練</h2>
          <p className="hero-description">
            不用先背大本語法書，先練 TOEIC 最常考、最容易快速判斷的基本款。
          </p>
        </div>
      </div>

      <div className="card-grid mini-grid">
        {guides.map((guide) => (
          <article key={guide.id} className="quest-card mini-card">
            <h3>{guide.title}</h3>
            <p>{guide.tip}</p>
          </article>
        ))}
      </div>

      <div className="quest-card filter-bar">
        <label>
          題型分類
          <select value={topic} onChange={(event) => setTopic(event.target.value)}>
            <option value="all">全部</option>
            {topics.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <article className="quest-card quiz-shell">
        <div className="card-topline">
          <div>
            <p className="eyebrow">{current.difficulty.toUpperCase()}</p>
            <h3>{topics.find((item) => item.id === current.topic)?.label ?? current.topic}</h3>
          </div>
        </div>

        <p className="question-text">{current.sentence}</p>
        <p className="question-subtext">{current.translation}</p>

        <div className="option-grid">
          {current.options.map((option) => (
            <button
              key={option}
              type="button"
              className="option-button"
              onClick={() => answerQuestion(option)}
              disabled={Boolean(feedback)}
            >
              {option}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`feedback-panel ${feedback.correct ? "correct" : "wrong"}`}>
            <strong>{feedback.correct ? "答對了" : "答錯了"}</strong>
            <p>正確答案：{current.answer}</p>
            <p>解題關鍵字：{current.keyword}</p>
            <p>解題技巧：{current.technique}</p>
            <p>{current.explanationZh}</p>
            <button type="button" className="primary-button" onClick={nextQuestion}>
              下一題
            </button>
          </div>
        )}
      </article>
    </section>
  );
}

export default GrammarCoach;
