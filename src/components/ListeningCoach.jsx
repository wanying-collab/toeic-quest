import { useEffect, useMemo, useState } from "react";

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export default function ListeningCoach({
  keywordTips,
  questions,
  onSpeak,
  onRecordAnswer,
  practiceTarget,
  onPracticeHandled,
}) {
  const [focus, setFocus] = useState("all");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const keywordQuestions = useMemo(() => {
    return questions.filter((item) => item.mode === "keyword");
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return keywordQuestions.filter((item) => focus === "all" || item.focus === focus);
  }, [keywordQuestions, focus]);

  function generateQuestion(sourceId) {
    const nextQuestion =
      filteredQuestions.find((item) => item.id === sourceId) ?? randomItem(filteredQuestions);
    setCurrentQuestion(nextQuestion ?? null);
    setFeedback(null);
  }

  useEffect(() => {
    generateQuestion();
  }, [focus]);

  useEffect(() => {
    if (practiceTarget?.route !== "listening") {
      return;
    }
    generateQuestion(practiceTarget.sourceId);
    onPracticeHandled();
  }, [practiceTarget]);

  useEffect(() => {
    if (currentQuestion?.speakText) {
      onSpeak(currentQuestion.speakText);
    }
  }, [currentQuestion?.id]);

  function handleAnswer(option) {
    if (!currentQuestion || feedback) {
      return;
    }

    const result = {
      correct: option === currentQuestion.answer,
      title: `${currentQuestion.focus} 關鍵字訓練`,
      prompt: currentQuestion.promptText,
      sourceId: currentQuestion.id,
      userAnswer: option,
      correctAnswer: currentQuestion.answer,
      explanationZh: currentQuestion.explanationZh,
      whyWrong: currentQuestion.whyWrong,
      nextTip: currentQuestion.nextTip,
      route: "listening",
      type: "listening",
      difficulty: currentQuestion.difficulty,
    };

    setFeedback(result);
    onRecordAnswer(result);
  }

  return (
    <section className="page-stack">
      <div className="card-grid two-col">
        <div className="content-card">
          <div className="section-heading">
            <h2>聽力關鍵字教練</h2>
            <p>先學會聽題目的第一個字，就能少猜很多題。</p>
          </div>
          <div className="keyword-grid">
            {keywordTips.map((tip) => (
              <button
                key={tip.keyword}
                type="button"
                className={`keyword-card ${focus === tip.keyword ? "is-active" : ""}`}
                onClick={() => setFocus((current) => (current === tip.keyword ? "all" : tip.keyword))}
              >
                <strong>{tip.keyword}</strong>
                <span>{tip.focus}</span>
                <small>{tip.examples.join(" / ")}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="content-card accent-card">
          <div className="section-heading">
            <h2>陷阱提醒</h2>
            <p>你現在最需要的是先避開最常見的誤導。</p>
          </div>
          <div className="trap-list">
            <p>Where 題不要選時間字。</p>
            <p>When 題不要被地點字吸走。</p>
            <p>Who 題優先找人名、職稱。</p>
            <p>How much 看價格；How long 看多久。</p>
          </div>
        </div>
      </div>

      {currentQuestion ? (
        <div className="content-card question-card">
          <div className="question-top">
            <div>
              <span className="eyebrow">{currentQuestion.focus}</span>
              <h3>{currentQuestion.promptText}</h3>
              <p>先聽第一個疑問詞，再決定你要找的是地點、時間、人物還是原因。</p>
            </div>
            <button
              type="button"
              className="ghost-button"
              onClick={() => onSpeak(currentQuestion.speakText)}
            >
              重播語音
            </button>
          </div>

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

          {feedback ? (
            <div className={`feedback-card ${feedback.correct ? "is-success" : "is-error"}`}>
              <strong>{feedback.correct ? "有抓到方向。" : "這題錯在方向，不是記憶力。"}</strong>
              <p>正確答案：{feedback.correctAnswer}</p>
              <p>中文解釋：{feedback.explanationZh}</p>
              <p>你為什麼會錯：{feedback.whyWrong}</p>
              <p>下次怎麼判斷：{feedback.nextTip}</p>
              <p>逐字稿：{currentQuestion.transcript}</p>
              <button type="button" className="primary-button" onClick={() => generateQuestion()}>
                再練一題
              </button>
            </div>
          ) : (
            <div className="hint-box">
              <span>提示</span>
              <p>先鎖定：{currentQuestion.keywordHint}</p>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
