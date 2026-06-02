import { useEffect, useMemo, useState } from "react";

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export default function GrammarCoach({
  questions,
  onRecordAnswer,
  practiceTarget,
  onPracticeHandled,
}) {
  const [difficulty, setDifficulty] = useState("all");
  const [category, setCategory] = useState("all");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const categories = useMemo(() => {
    return [...new Set(questions.map((item) => item.category))];
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((item) => {
      const matchDifficulty = difficulty === "all" || item.difficulty === difficulty;
      const matchCategory = category === "all" || item.category === category;
      return matchDifficulty && matchCategory;
    });
  }, [questions, difficulty, category]);

  function generateQuestion(sourceId) {
    const nextQuestion =
      filteredQuestions.find((item) => item.id === sourceId) ?? randomItem(filteredQuestions);
    setCurrentQuestion(nextQuestion ?? null);
    setFeedback(null);
  }

  useEffect(() => {
    generateQuestion();
  }, [difficulty, category]);

  useEffect(() => {
    if (practiceTarget?.route !== "grammar") {
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
      title: currentQuestion.category,
      prompt: currentQuestion.question,
      sourceId: currentQuestion.id,
      userAnswer: option,
      correctAnswer: currentQuestion.answer,
      explanationZh: currentQuestion.explanationZh,
      whyWrong: currentQuestion.whyWrong,
      nextTip: currentQuestion.nextTip,
      route: "grammar",
      type: "grammar",
      difficulty: currentQuestion.difficulty,
    };

    setFeedback(result);
    onRecordAnswer(result);
  }

  return (
    <section className="page-stack">
      <div className="content-card">
        <div className="section-heading">
          <h2>基礎文法教練</h2>
          <p>不先教太難，只先練多益最常考、最好拿分的基本款。</p>
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
            <span>文法分類</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">全部</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {currentQuestion ? (
        <div className="content-card question-card">
          <div className="question-top">
            <div>
              <span className="eyebrow">{currentQuestion.category}</span>
              <h3>{currentQuestion.question}</h3>
              <p>先找關鍵字，再用最短的規則做判斷。</p>
            </div>
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
              <strong>{feedback.correct ? "文法點抓到了。" : "先別背規則，先看關鍵字。"}</strong>
              <p>正確答案：{feedback.correctAnswer}</p>
              <p>中文解釋：{feedback.explanationZh}</p>
              <p>你該看的關鍵字：{currentQuestion.keyword}</p>
              <p>解題技巧：{currentQuestion.technique}</p>
              <p>你為什麼會錯：{feedback.whyWrong}</p>
              <p>下次怎麼判斷：{feedback.nextTip}</p>
              <button type="button" className="primary-button" onClick={() => generateQuestion()}>
                下一題
              </button>
            </div>
          ) : (
            <div className="hint-box">
              <span>提示</span>
              <p>先看：{currentQuestion.keyword}</p>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
