import { useEffect, useMemo, useState } from "react";

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export default function ReadingCoach({
  questions,
  readingSteps,
  onRecordAnswer,
  practiceTarget,
  onPracticeHandled,
}) {
  const [difficulty, setDifficulty] = useState("all");
  const [stage, setStage] = useState("all");
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const filteredQuestions = useMemo(() => {
    return questions.filter((item) => {
      const matchDifficulty = difficulty === "all" || item.difficulty === difficulty;
      const matchStage = stage === "all" || item.stage === stage;
      return matchDifficulty && matchStage;
    });
  }, [questions, difficulty, stage]);

  function generateQuestion(sourceId) {
    const nextQuestion =
      filteredQuestions.find((item) => item.id === sourceId) ?? randomItem(filteredQuestions);
    setCurrentQuestion(nextQuestion ?? null);
    setFeedback(null);
    setShowTranslation(false);
  }

  useEffect(() => {
    generateQuestion();
  }, [difficulty, stage]);

  useEffect(() => {
    if (practiceTarget?.route !== "reading") {
      return;
    }
    generateQuestion(practiceTarget.sourceId);
    onPracticeHandled();
  }, [practiceTarget]);

  function handleAnswer(option) {
    if (!currentQuestion || feedback) {
      return;
    }

    const result = {
      correct: option === currentQuestion.answer,
      title: currentQuestion.title,
      prompt: currentQuestion.question,
      sourceId: currentQuestion.id,
      userAnswer: option,
      correctAnswer: currentQuestion.answer,
      explanationZh: currentQuestion.explanationZh,
      whyWrong: currentQuestion.whyWrong,
      nextTip: currentQuestion.nextTip,
      route: "reading",
      type: "reading",
      difficulty: currentQuestion.difficulty,
    };

    setFeedback(result);
    onRecordAnswer(result);
  }

  return (
    <section className="page-stack">
      <div className="content-card">
        <div className="section-heading">
          <h2>短句閱讀教練</h2>
          <p>先從短句開始，不先硬塞長文。你的任務是練會找關鍵字。</p>
        </div>
        <div className="reading-step-row">
          {readingSteps.map((item) => (
            <span key={item} className={`soft-chip ${stage === item ? "is-highlight" : ""}`}>
              {item}
            </span>
          ))}
        </div>
        <div className="filter-grid compact">
          <label className="field">
            <span>難度</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              <option value="all">全部</option>
              <option value="easy">easy</option>
              <option value="normal">normal</option>
            </select>
          </label>
          <label className="field">
            <span>閱讀階段</span>
            <select value={stage} onChange={(event) => setStage(event.target.value)}>
              <option value="all">全部</option>
              <option value="短句">短句</option>
              <option value="短文">短文</option>
            </select>
          </label>
        </div>
      </div>

      {currentQuestion ? (
        <div className="content-card question-card">
          <div className="question-top">
            <div>
              <span className="eyebrow">{currentQuestion.title}</span>
              <h3>{currentQuestion.kind === "sentence" ? "短句練習" : "迷你短文練習"}</h3>
              <p>先看題目，再回原文找答案，不要從頭慢慢翻。</p>
            </div>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setShowTranslation((value) => !value)}
            >
              {showTranslation ? "隱藏中文" : "顯示中文"}
            </button>
          </div>

          <div className="passage-box">
            <p>{currentQuestion.passage}</p>
            {showTranslation ? <small>{currentQuestion.translation}</small> : null}
          </div>

          <div className="question-block">
            <strong>{currentQuestion.question}</strong>
            <div className="option-grid">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`option-button ${
                    feedback
                      ? option === currentQuestion.answer
                        ? "is-correct"
                        : option === feedback.userAnswer
                          ? "is-wrong"
                          : ""
                      : ""
                  }`}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {feedback ? (
            <div className={`feedback-card ${feedback.correct ? "is-success" : "is-error"}`}>
              <strong>{feedback.correct ? "有找到關鍵字。" : "這題不是看不懂，是還沒找到關鍵字。"}</strong>
              <p>正確答案：{feedback.correctAnswer}</p>
              <p>關鍵字提示：{currentQuestion.keywordHint}</p>
              <p>中文解釋：{feedback.explanationZh}</p>
              <p>你為什麼會錯：{feedback.whyWrong}</p>
              <p>下次怎麼判斷：{feedback.nextTip}</p>
              <button type="button" className="primary-button" onClick={() => generateQuestion()}>
                下一題
              </button>
            </div>
          ) : (
            <div className="hint-box">
              <span>提示</span>
              <p>先讀題目，再回文中找：{currentQuestion.keywordHint}</p>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
