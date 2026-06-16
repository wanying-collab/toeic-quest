import { useEffect, useMemo, useState } from "react";
import { pickAdaptiveItem } from "../utils/adaptive";

function ListeningCoach({
  levels,
  questions,
  keywordGuides,
  trapGuides,
  onSpeak,
  onRecordAnswer,
  adaptiveProfile,
}) {
  const [tab, setTab] = useState("practice");
  const [level, setLevel] = useState("all");
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [keywordFeedback, setKeywordFeedback] = useState({});

  const pool = useMemo(
    () => questions.filter((item) => (level === "all" ? true : item.level === Number(level))),
    [questions, level],
  );

  useEffect(() => {
    if (pool.length > 0) {
      setQuestion(
        pickAdaptiveItem(pool, adaptiveProfile, {
          domain: "listening",
          getItemId: (item) => item.id,
          getRelatedWordId: (item) => item.relatedWordId,
          getCategory: (item) => item.category,
        }),
      );
      setFeedback(null);
    }
  }, [level, pool, adaptiveProfile]);

  const submitAnswer = (option) => {
    if (!question) {
      return;
    }

    const correct = option === question.answer;
    setFeedback({ correct, option });

    onRecordAnswer({
      domain: "listening",
      itemId: question.id,
      relatedWordId: question.relatedWordId,
      category: question.category,
      prompt: question.transcript,
      correct,
      userAnswer: option,
      correctAnswer: question.answer,
      explanationZh: question.explanationZh,
      reason: correct ? question.why : `${question.explanationZh} ${question.trapAnalysis ?? ""}`.trim(),
    });
  };

  const nextQuestion = () => {
    setQuestion(
      pickAdaptiveItem(pool, adaptiveProfile, {
        domain: "listening",
        getItemId: (item) => item.id,
        getRelatedWordId: (item) => item.relatedWordId,
        getCategory: (item) => item.category,
      }),
    );
    setFeedback(null);
  };

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Listening Coach</p>
          <h2>從聽單字一路升到 TOEIC 聽力</h2>
          <p className="hero-description">
            這裡會優先安排你最近答錯的題型，同時降低最近 50 題內重複出現的機率。
          </p>
        </div>
      </div>

      <div className="quest-card filter-bar">
        <div className="tabs">
          {[
            { id: "practice", label: "Listening Practice" },
            { id: "keywords", label: "Keyword Coach" },
            { id: "traps", label: "Trap Analyzer" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={`tab-button ${tab === item.id ? "active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "practice" && (
          <label>
            Level
            <select value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="all">All</option>
              {levels.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {tab === "practice" && question && (
        <article className="quest-card quiz-shell">
          <div className="card-topline">
            <div>
              <p className="eyebrow">
                Level {question.level} / {question.difficulty.toUpperCase()}
              </p>
              <h3>{question.prompt}</h3>
            </div>
            <button type="button" className="primary-button" onClick={() => onSpeak(question.audioText)}>
              Play Audio
            </button>
          </div>

          <p className="question-subtext">Keyword focus: {question.keyword}</p>

          <div className="option-grid">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                className="option-button"
                onClick={() => submitAnswer(option)}
                disabled={Boolean(feedback)}
              >
                {option}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`feedback-panel ${feedback.correct ? "correct" : "wrong"}`}>
              <strong>{feedback.correct ? "Correct" : "Try again"}</strong>
              <p>Answer: {question.answer}</p>
              <p>{question.explanationZh}</p>
              <p>{question.why}</p>
              {question.trapAnalysis && (
                <div className="tip-box">
                  <strong>Trap analysis</strong>
                  <p>{question.trapAnalysis}</p>
                </div>
              )}
              <button type="button" className="primary-button" onClick={nextQuestion}>
                Next Question
              </button>
            </div>
          )}
        </article>
      )}

      {tab === "keywords" && (
        <div className="card-grid">
          {keywordGuides.map((guide) => (
            <article key={guide.id} className="quest-card resource-card">
              <div className="card-topline">
                <div>
                  <p className="eyebrow">{guide.prompt}</p>
                  <h3>{guide.focus}</h3>
                </div>
              </div>
              <p>{guide.explanation}</p>
              <div className="bullet-box">
                <strong>Common answers</strong>
                <ul>
                  {guide.commonAnswers.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bullet-box">
                <strong>Examples</strong>
                <ul>
                  {guide.examples.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="tip-box">
                <strong>Quick drill</strong>
                <p>{guide.drill.question}</p>
                <div className="option-grid compact-grid">
                  {guide.drill.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="option-button"
                      onClick={() => {
                        const correct = option === guide.drill.answer;
                        setKeywordFeedback((previous) => ({
                          ...previous,
                          [guide.id]: { correct, option },
                        }));

                        onRecordAnswer({
                          domain: "listening",
                          itemId: `keyword-${guide.id}`,
                          category: "Listening Keyword Coach",
                          prompt: guide.drill.question,
                          correct,
                          userAnswer: option,
                          correctAnswer: guide.drill.answer,
                          explanationZh: guide.drill.explanation,
                          reason: guide.explanation,
                        });
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {keywordFeedback[guide.id] && (
                  <p className={keywordFeedback[guide.id].correct ? "feedback-inline ok" : "feedback-inline warn"}>
                    {keywordFeedback[guide.id].correct
                      ? `Nice. ${guide.drill.explanation}`
                      : `Look again. ${guide.drill.explanation}`}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "traps" && (
        <div className="card-grid">
          {trapGuides.map((trap) => (
            <article key={trap.id} className="quest-card resource-card">
              <p className="eyebrow">Trap Analyzer</p>
              <h3>{trap.title}</h3>
              <p>{trap.pattern}</p>
              <div className="tip-box">
                <strong>How to avoid it</strong>
                <p>{trap.fix}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ListeningCoach;

