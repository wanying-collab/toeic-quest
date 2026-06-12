import { useEffect, useState } from "react";

const MODES = [
  { id: "en-zh", label: "英文選中文" },
  { id: "zh-en", label: "中文選英文" },
  { id: "audio-zh", label: "聽單字選中文" },
  { id: "audio-en", label: "聽單字選英文" },
  { id: "spelling", label: "拼字練習" },
];

function randomPick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function buildChoicePool(words, currentWord, mode) {
  const others = shuffle(words.filter((item) => item.id !== currentWord.id)).slice(0, 3);

  if (mode === "en-zh" || mode === "audio-zh") {
    return shuffle([currentWord.meaning, ...others.map((item) => item.meaning)]);
  }

  return shuffle([currentWord.word, ...others.map((item) => item.word)]);
}

function createQuestion(words, mode) {
  const currentWord = randomPick(words);

  return {
    currentWord,
    mode,
    options: mode === "spelling" ? [] : buildChoicePool(words, currentWord, mode),
  };
}

function QuizPage({ words, levels, onSpeak, onRecordAnswer }) {
  const [mode, setMode] = useState("en-zh");
  const [level, setLevel] = useState("all");
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState("");

  const pool = words.filter((word) => (level === "all" ? true : word.level === level));

  useEffect(() => {
    if (pool.length > 3) {
      setQuestion(createQuestion(pool, mode));
      setFeedback(null);
      setTypedAnswer("");
    }
  }, [mode, level]);

  useEffect(() => {
    if (!question && pool.length > 3) {
      setQuestion(createQuestion(pool, mode));
    }
  }, [pool, mode, question]);

  if (pool.length <= 3 || !question) {
    return (
      <section className="page-shell">
        <article className="quest-card">
          <h2>題庫準備中</h2>
          <p>目前這個篩選條件下的單字太少，請切換其他難度再試一次。</p>
        </article>
      </section>
    );
  }

  const { currentWord } = question;

  const promptMap = {
    "en-zh": currentWord.word,
    "zh-en": currentWord.meaning,
    "audio-zh": "播放單字後選出正確中文",
    "audio-en": "播放單字後選出正確英文",
    spelling: `請輸入「${currentWord.meaning}」的英文`,
  };

  const correctAnswer =
    mode === "en-zh" || mode === "audio-zh" ? currentWord.meaning : currentWord.word;

  const why = `這題的核心是 ${currentWord.word} = ${currentWord.meaning}。記住例句中的用法，之後在聽力和閱讀就比較不會卡住。`;

  const submitResult = (userAnswer) => {
    const normalizedUser =
      mode === "spelling" ? userAnswer.trim().toLowerCase() : userAnswer;
    const normalizedCorrect =
      mode === "spelling" ? correctAnswer.trim().toLowerCase() : correctAnswer;
    const correct = normalizedUser === normalizedCorrect;

    const result = {
      correct,
      userAnswer,
      correctAnswer,
      explanationZh: `${currentWord.word} 的意思是 ${currentWord.meaning}。`,
      why,
      example: currentWord.example,
      exampleZh: currentWord.exampleZh,
    };

    setFeedback(result);

    onRecordAnswer({
      domain: "vocabulary",
      itemId: `vocab-${mode}-${currentWord.id}`,
      relatedWordId: currentWord.id,
      category: currentWord.category,
      prompt: promptMap[mode],
      correct,
      userAnswer,
      correctAnswer,
      explanationZh: result.explanationZh,
      reason: correct
        ? "你有把英文和中文順利對起來。"
        : `這題應該選 ${correctAnswer}，因為 ${currentWord.word} 的中文是 ${currentWord.meaning}。`,
    });
  };

  const nextQuestion = () => {
    setQuestion(createQuestion(pool, mode));
    setFeedback(null);
    setTypedAnswer("");
  };

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Quest Practice</p>
          <h2>單字練習模式</h2>
          <p className="hero-description">先把基本字打穩，聽力和閱讀才會開始真的看懂、聽懂。</p>
        </div>
      </div>

      <div className="quest-card filter-bar">
        <div className="tabs">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`tab-button ${mode === item.id ? "active" : ""}`}
              onClick={() => setMode(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label>
          題目難度
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="all">全部</option>
            {levels.map((item) => (
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
            <p className="eyebrow">{currentWord.category}</p>
            <h3>{MODES.find((item) => item.id === mode)?.label}</h3>
          </div>
          {(mode === "audio-zh" || mode === "audio-en") && (
            <button type="button" className="primary-button" onClick={() => onSpeak(currentWord.word)}>
              播放發音
            </button>
          )}
        </div>

        <div className="quiz-prompt">
          <p>{promptMap[mode]}</p>
        </div>

        {mode !== "spelling" ? (
          <div className="option-grid">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                className="option-button"
                onClick={() => submitResult(option)}
                disabled={Boolean(feedback)}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <form
            className="spelling-form"
            onSubmit={(event) => {
              event.preventDefault();
              submitResult(typedAnswer);
            }}
          >
            <input
              value={typedAnswer}
              onChange={(event) => setTypedAnswer(event.target.value)}
              placeholder="輸入英文拼字"
              disabled={Boolean(feedback)}
            />
            <button type="submit" className="primary-button" disabled={!typedAnswer.trim() || Boolean(feedback)}>
              送出答案
            </button>
          </form>
        )}

        {feedback && (
          <div className={`feedback-panel ${feedback.correct ? "correct" : "wrong"}`}>
            <strong>{feedback.correct ? "答對了" : "答錯了"}</strong>
            <p>正確答案：{feedback.correctAnswer}</p>
            <p>{feedback.explanationZh}</p>
            <p>{feedback.why}</p>
            <p className="word-example">{feedback.example}</p>
            <p className="word-example-zh">{feedback.exampleZh}</p>
            <button type="button" className="primary-button" onClick={nextQuestion}>
              下一題
            </button>
          </div>
        )}
      </article>
    </section>
  );
}

export default QuizPage;
