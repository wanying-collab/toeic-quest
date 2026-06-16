import { useEffect, useMemo, useState } from "react";
import { pickAdaptiveItem } from "../utils/adaptive";

function GrammarCoach({ questions, topics, guides, onRecordAnswer, adaptiveProfile }) {
  const [topic, setTopic] = useState("all");
  const [current, setCurrent] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const filtered = useMemo(
    () => questions.filter((question) => (topic === "all" ? true : question.topic === topic)),
    [questions, topic],
  );

  useEffect(() => {
    if (filtered.length > 0) {
      setCurrent(
        pickAdaptiveItem(filtered, adaptiveProfile, {
          domain: "grammar",
          getItemId: (item) => item.id,
          getCategory: (item) => item.topic,
        }),
      );
      setFeedback(null);
    }
  }, [filtered, adaptiveProfile]);

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
        : `Look at the keyword "${current.keyword}". ${current.technique}`,
    });
  };

  const nextQuestion = () => {
    setCurrent(
      pickAdaptiveItem(filtered, adaptiveProfile, {
        domain: "grammar",
        getItemId: (item) => item.id,
        getCategory: (item) => item.topic,
      }),
    );
    setFeedback(null);
  };

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Grammar Coach</p>
          <h2>用關鍵字快速判斷文法</h2>
          <p className="hero-description">
            這裡的文法題會優先補你最近常錯的題型，並搭配中文解析和解題技巧。
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
          Topic
          <select value={topic} onChange={(event) => setTopic(event.target.value)}>
            <option value="all">All</option>
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
            <strong>{feedback.correct ? "Correct" : "Try again"}</strong>
            <p>Answer: {current.answer}</p>
            <p>Keyword: {current.keyword}</p>
            <p>Technique: {current.technique}</p>
            <p>{current.explanationZh}</p>
            <button type="button" className="primary-button" onClick={nextQuestion}>
              Next Question
            </button>
          </div>
        )}
      </article>
    </section>
  );
}

export default GrammarCoach;

