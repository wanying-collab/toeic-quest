import { useEffect, useMemo, useState } from "react";
import { pickAdaptiveItem } from "../utils/adaptive";

function ReadingCoach({ items, ladder, onRecordAnswer, onSpeak, adaptiveProfile }) {
  const [stage, setStage] = useState("all");
  const [showTranslation, setShowTranslation] = useState(true);
  const [item, setItem] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const filtered = useMemo(
    () => items.filter((entry) => (stage === "all" ? true : entry.stage === stage)),
    [items, stage],
  );

  useEffect(() => {
    if (filtered.length > 0) {
      setItem(
        pickAdaptiveItem(filtered, adaptiveProfile, {
          domain: "reading",
          getItemId: (entry) => entry.id,
          getCategory: (entry) => entry.type,
        }),
      );
      setQuestionIndex(0);
      setFeedback(null);
    }
  }, [filtered, adaptiveProfile]);

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

    setItem(
      pickAdaptiveItem(filtered, adaptiveProfile, {
        domain: "reading",
        getItemId: (entry) => entry.id,
        getCategory: (entry) => entry.type,
      }),
    );
    setQuestionIndex(0);
    setFeedback(null);
  };

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Reading Coach</p>
          <h2>從單字、片語一路讀到 Part 7</h2>
          <p className="hero-description">
            先看題目，再回文章找關鍵字。系統也會把你最近常錯的文章類型多排一點。
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
          Stage
          <select value={stage} onChange={(event) => setStage(event.target.value)}>
            <option value="all">All</option>
            {ladder.map((step) => (
              <option key={step.id} value={step.id}>
                {step.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="secondary-button" onClick={() => setShowTranslation((value) => !value)}>
          {showTranslation ? "Hide Translation" : "Show Translation"}
        </button>
      </div>

      <article className="quest-card reading-shell">
        <div className="card-topline">
          <div>
            <p className="eyebrow">{item.type}</p>
            <h3>{item.title}</h3>
          </div>
          <button type="button" className="secondary-button" onClick={() => onSpeak(item.text)}>
            Read Aloud
          </button>
        </div>

        <pre className="reading-passage">{item.text}</pre>
        {showTranslation && <p className="reading-translation">{item.translation}</p>}

        <div className="tip-box">
          <strong>Keywords</strong>
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
            <strong>{feedback.correct ? "Correct" : "Try again"}</strong>
            <p>Answer: {currentQuestion.answer}</p>
            <p>{currentQuestion.explanationZh}</p>
            <p>{item.strategy}</p>
            <button type="button" className="primary-button" onClick={nextStep}>
              {questionIndex < item.questions.length - 1 ? "Next Question" : "Next Passage"}
            </button>
          </div>
        )}
      </article>
    </section>
  );
}

export default ReadingCoach;

