import { useEffect, useState } from "react";

function ListeningCoach({
  levels,
  questions,
  keywordGuides,
  trapGuides,
  onSpeak,
  onRecordAnswer,
}) {
  const [tab, setTab] = useState("practice");
  const [level, setLevel] = useState("all");
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [keywordFeedback, setKeywordFeedback] = useState({});

  const pool = questions.filter((item) => (level === "all" ? true : item.level === Number(level)));

  useEffect(() => {
    if (pool.length > 0) {
      setQuestion(pool[Math.floor(Math.random() * pool.length)]);
      setFeedback(null);
    }
  }, [level]);

  useEffect(() => {
    if (!question && pool.length > 0) {
      setQuestion(pool[Math.floor(Math.random() * pool.length)]);
    }
  }, [question, pool]);

  const submitAnswer = (option) => {
    if (!question) {
      return;
    }

    const correct = option === question.answer;
    setFeedback({ correct, option });

    onRecordAnswer({
      domain: "listening",
      itemId: question.id,
      category: question.category,
      prompt: question.transcript,
      correct,
      userAnswer: option,
      correctAnswer: question.answer,
      explanationZh: question.explanationZh,
      reason: correct
        ? question.why
        : `${question.explanationZh} ${question.trapAnalysis ?? ""}`.trim(),
    });
  };

  const nextQuestion = () => {
    setQuestion(pool[Math.floor(Math.random() * pool.length)]);
    setFeedback(null);
  };

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Listening Coach</p>
          <h2>聽力從單字開始，慢慢升到 TOEIC 題感</h2>
          <p className="hero-description">
            先練聲音和意思的連結，再進入疑問詞、關鍵字與短對話判斷。
          </p>
        </div>
      </div>

      <div className="quest-card filter-bar">
        <div className="tabs">
          {[
            { id: "practice", label: "分級練習" },
            { id: "keywords", label: "關鍵字教練" },
            { id: "traps", label: "陷阱分析" },
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
            練習等級
            <select value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="all">全部</option>
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
              播放語音
            </button>
          </div>

          <p className="question-subtext">關鍵焦點：{question.keyword}</p>

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
              <strong>{feedback.correct ? "答對了" : "答錯了"}</strong>
              <p>正確答案：{question.answer}</p>
              <p>{question.explanationZh}</p>
              <p>{question.why}</p>
              {question.trapAnalysis && (
                <div className="tip-box">
                  <strong>你剛剛可能卡住的點</strong>
                  <p>{question.trapAnalysis}</p>
                </div>
              )}
              <button type="button" className="primary-button" onClick={nextQuestion}>
                下一題
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
                <strong>常見答案</strong>
                <ul>
                  {guide.commonAnswers.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bullet-box">
                <strong>例句</strong>
                <ul>
                  {guide.examples.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="tip-box">
                <strong>小練習</strong>
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
                      ? `答對了：${guide.drill.explanation}`
                      : `答錯了：${guide.drill.explanation}`}
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
                <strong>下次怎麼判斷</strong>
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
