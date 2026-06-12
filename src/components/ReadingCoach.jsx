import { useEffect, useState } from "react";

function ReadingCoach({ items, ladder, onRecordAnswer }) {
  const [stage, setStage] = useState("all");
  const [showTranslation, setShowTranslation] = useState(true);
  const [item, setItem] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const filtered = items.filter((entry) => (stage === "all" ? true : entry.stage === stage));

  useEffect(() => {
    if (filtered.length > 0) {
      setItem(filtered[Math.floor(Math.random() * filtered.length)]);
      setQuestionIndex(0);
      setFeedback(null);
    }
  }, [stage]);

  useEffect(() => {
    if (!item && filtered.length > 0) {
      setItem(filtered[Math.floor(Math.random() * filtered.length)]);
    }
  }, [filtered, item]);

  if (!item) {
    return null;
  }

  const currentQuestion = item.questions[questionIndex];

  const answerQuestion = (option) => {
    const correct = option === currentQuestion.answer;
    setFeedback({ correct, option });

    onRecordAnswer({
      domain: "reading",
      itemId: currentQuestion.id,
      category: item.type,
      prompt: item.text,
      correct,
      userAnswer: option,
      correctAnswer: currentQuestion.answer,
      explanationZh: currentQuestion.explanationZh,
      reason: correct ? item.strategy : `${item.strategy} ${currentQuestion.explanationZh}`,
    });
  };

  const nextStep = () => {
    if (questionIndex < item.questions.length - 1) {
      setQuestionIndex((value) => value + 1);
      setFeedback(null);
      return;
    }

    setItem(filtered[Math.floor(Math.random() * filtered.length)]);
    setQuestionIndex(0);
    setFeedback(null);
  };

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Reading Coach</p>
          <h2>從短句開始，把閱讀感慢慢建立起來</h2>
          <p className="hero-description">
            先看題目，再回文章找答案。從單句到 Part 7，不再一開始就被長文嚇到。
          </p>
        </div>
      </div>

      <div className="card-grid mini-grid">
        {ladder.map((step) => (
          <article key={step.id} className="quest-card mini-card">
            <h3>{step.label}</h3>
            <p>{step.goal}</p>
          </article>
        ))}
      </div>

      <div className="quest-card filter-bar">
        <label>
          閱讀階段
          <select value={stage} onChange={(event) => setStage(event.target.value)}>
            <option value="all">全部</option>
            {ladder.map((step) => (
              <option key={step.id} value={step.id}>
                {step.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="secondary-button" onClick={() => setShowTranslation((value) => !value)}>
          {showTranslation ? "隱藏中文翻譯" : "顯示中文翻譯"}
        </button>
      </div>

      <article className="quest-card reading-shell">
        <div className="card-topline">
          <div>
            <p className="eyebrow">{item.type}</p>
            <h3>{item.title}</h3>
          </div>
        </div>

        <pre className="reading-passage">{item.text}</pre>
        {showTranslation && <p className="reading-translation">{item.translation}</p>}

        <div className="tip-box">
          <strong>關鍵字提示</strong>
          <p>{item.keywords.join(" / ")}</p>
          <p>{item.strategy}</p>
        </div>

        <div className="question-block">
          <h4>{currentQuestion.question}</h4>
          <div className="option-grid">
            {currentQuestion.options.map((option) => (
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
        </div>

        {feedback && (
          <div className={`feedback-panel ${feedback.correct ? "correct" : "wrong"}`}>
            <strong>{feedback.correct ? "答對了" : "答錯了"}</strong>
            <p>正確答案：{currentQuestion.answer}</p>
            <p>{currentQuestion.explanationZh}</p>
            <p>{item.strategy}</p>
            <button type="button" className="primary-button" onClick={nextStep}>
              {questionIndex < item.questions.length - 1 ? "下一小題" : "換一篇"}
            </button>
          </div>
        )}
      </article>
    </section>
  );
}

export default ReadingCoach;
