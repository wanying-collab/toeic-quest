import { useEffect, useMemo, useState } from "react";
import { pickAdaptiveItem } from "../utils/adaptive";

const MODES = [
  { id: "en-zh", label: "英文選中文" },
  { id: "zh-en", label: "中文選英文" },
  { id: "audio-zh", label: "聽發音選中文" },
  { id: "audio-en", label: "聽發音選英文" },
  { id: "spelling", label: "拼字練習" },
];

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function renderStars(count) {
  return "★".repeat(Math.max(1, Math.min(5, count))) + "☆".repeat(Math.max(0, 5 - count));
}

function buildChoicePool(words, currentWord, mode) {
  const distractors = shuffle(
    words.filter(
      (item) =>
        item.id !== currentWord.id &&
        (item.category === currentWord.category || item.theme === currentWord.theme),
    ),
  ).slice(0, 3);

  const fallback = shuffle(
    words.filter((item) => item.id !== currentWord.id && !distractors.some((pick) => pick.id === item.id)),
  ).slice(0, Math.max(0, 3 - distractors.length));

  const finalPool = [...distractors, ...fallback];

  if (mode === "en-zh" || mode === "audio-zh") {
    return shuffle([currentWord.meaning, ...finalPool.map((item) => item.meaning)]);
  }

  return shuffle([currentWord.word, ...finalPool.map((item) => item.word)]);
}

function createQuestion(pool, mode, adaptiveProfile) {
  const currentWord = pickAdaptiveItem(pool, adaptiveProfile, {
    domain: "vocabulary",
    getItemId: (item) => item.id,
    getRelatedWordId: (item) => item.id,
    getCategory: (item) => item.theme ?? item.category,
    getReviewKey: (item) => `vocabulary:vocab-${mode}-${item.id}`,
    getIsFavorite: (item) => adaptiveProfile.favoriteWordSet?.has(item.id),
  });

  if (!currentWord) {
    return null;
  }

  return {
    currentWord,
    mode,
    options: mode === "spelling" ? [] : buildChoicePool(pool, currentWord, mode),
  };
}

function QuizPage({ words, levels, favoriteIds, wordProgress, onSpeak, onRecordAnswer, adaptiveProfile }) {
  const [mode, setMode] = useState("en-zh");
  const [level, setLevel] = useState("all");
  const [question, setQuestion] = useState(null);
  const [phase, setPhase] = useState("study");
  const [feedback, setFeedback] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState("");

  const pool = useMemo(
    () => words.filter((word) => (level === "all" ? true : word.level === level)),
    [words, level],
  );

  useEffect(() => {
    if (pool.length > 3) {
      setQuestion(createQuestion(pool, mode, adaptiveProfile));
      setFeedback(null);
      setTypedAnswer("");
      setPhase("study");
    }
  }, [mode, level, pool, adaptiveProfile]);

  if (pool.length <= 3 || !question) {
    return (
      <section className="page-shell">
        <article className="quest-card">
          <h2>Quiz 準備中</h2>
          <p>請先加入更多單字，或切換等級後再開始練習。</p>
        </article>
      </section>
    );
  }

  const { currentWord } = question;
  const progress = wordProgress[currentWord.id];
  const isFavorite = favoriteIds.includes(currentWord.id);

  const promptMap = {
    "en-zh": currentWord.word,
    "zh-en": currentWord.meaning,
    "audio-zh": "請先播放發音，再選出正確中文。",
    "audio-en": "請先播放發音，再選出正確英文。",
    spelling: `請輸入「${currentWord.meaning}」的英文`,
  };

  const correctAnswer =
    mode === "en-zh" || mode === "audio-zh" ? currentWord.meaning : currentWord.word;

  const why = `把 ${currentWord.word} 的發音、意思、例句與搭配詞一起記，會比只背單字更容易長期保留。`;

  const submitResult = (userAnswer) => {
    const normalizedUser = mode === "spelling" ? userAnswer.trim().toLowerCase() : userAnswer;
    const normalizedCorrect = mode === "spelling" ? correctAnswer.trim().toLowerCase() : correctAnswer;
    const correct = normalizedUser === normalizedCorrect;

    const result = {
      correct,
      userAnswer,
      correctAnswer,
      explanationZh: `${currentWord.word} 的中文是「${currentWord.meaning}」。`,
      why,
      example: currentWord.example,
      exampleZh: currentWord.exampleZh,
    };

    setFeedback(result);
    setPhase("feedback");

    onRecordAnswer({
      domain: "vocabulary",
      itemId: `vocab-${mode}-${currentWord.id}`,
      relatedWordId: currentWord.id,
      category: currentWord.theme ?? currentWord.category,
      prompt: promptMap[mode],
      correct,
      userAnswer,
      correctAnswer,
      explanationZh: result.explanationZh,
      reason: correct
        ? `你已經把 ${currentWord.word} 和 ${currentWord.theme ?? currentWord.category} 主題連起來了。`
        : `這題正解是 ${correctAnswer}。下次先抓發音，再連到例句和搭配詞。`,
    });
  };

  const nextQuestion = () => {
    setQuestion(createQuestion(pool, mode, adaptiveProfile));
    setFeedback(null);
    setTypedAnswer("");
    setPhase("study");
  };

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Vocabulary Quest</p>
          <h2>先學後測，讓單字真的記住</h2>
          <p className="hero-description">
            每題先看單字、聽發音、讀例句，再進入作答。這會比直接猜答案更有記憶效果。
          </p>
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
          Level
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="all">All</option>
            {levels.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <article className="quest-card study-card">
        <div className="card-topline">
          <div>
            <p className="eyebrow">{currentWord.theme ?? currentWord.category}</p>
            <h3>{currentWord.word}</h3>
          </div>
          <div className="hero-badges">
            <span className="pill">{currentWord.partOfSpeech}</span>
            <span className="pill">{renderStars(currentWord.frequency)}</span>
            {isFavorite && <span className="pill">已收藏</span>}
          </div>
        </div>

        <div className="vocab-detail-grid">
          <div className="detail-item">
            <span>中文</span>
            <strong>{currentWord.meaning}</strong>
          </div>
          <div className="detail-item">
            <span>音標</span>
            <strong>{currentWord.pronunciation}</strong>
          </div>
          <div className="detail-item">
            <span>複習狀態</span>
            <strong>{progress?.mastered ? "已掌握" : progress?.nextReviewAt ?? "新單字"}</strong>
          </div>
          <div className="detail-item">
            <span>Word Family</span>
            <strong>{currentWord.wordFamily?.slice(0, 3).join(" / ") || "—"}</strong>
          </div>
        </div>

        <div className="card-actions">
          <button type="button" className="primary-button" onClick={() => onSpeak(currentWord.word)}>
            聽發音
          </button>
          <button type="button" className="secondary-button" onClick={() => onSpeak(currentWord.example)}>
            聽例句
          </button>
        </div>

        <div className="vocab-block">
          <strong>例句</strong>
          <p className="word-example">{currentWord.example}</p>
          <p className="word-example-zh">{currentWord.exampleZh}</p>
        </div>

        <div className="vocab-block">
          <strong>常見搭配</strong>
          <div className="chip-list">
            {currentWord.collocations.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </div>

        {currentWord.relatedWords?.length > 0 && (
          <div className="vocab-block">
            <strong>相關字</strong>
            <div className="chip-list">
              {currentWord.relatedWords.map((item) => (
                <span key={item} className="chip soft">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      <article className="quest-card quiz-shell">
        <div className="card-topline">
          <div>
            <p className="eyebrow">{MODES.find((item) => item.id === mode)?.label}</p>
            <h3>Step {phase === "study" ? "1" : phase === "question" ? "2" : "3"}</h3>
          </div>
          {(mode === "audio-zh" || mode === "audio-en") && (
            <button type="button" className="primary-button" onClick={() => onSpeak(currentWord.word)}>
              播放題目發音
            </button>
          )}
        </div>

        {phase === "study" && (
          <div className="tip-box">
            <strong>先熟悉這個單字</strong>
            <p>先聽發音、看例句、看搭配詞，再開始作答，記憶效果會更穩定。</p>
            <button type="button" className="primary-button" onClick={() => setPhase("question")}>
              開始作答
            </button>
          </div>
        )}

        {phase !== "study" && (
          <>
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
                  placeholder="輸入英文單字"
                  disabled={Boolean(feedback)}
                />
                <button type="submit" className="primary-button" disabled={!typedAnswer.trim() || Boolean(feedback)}>
                  Check
                </button>
              </form>
            )}
          </>
        )}

        {feedback && (
          <div className={`feedback-panel ${feedback.correct ? "correct" : "wrong"}`}>
            <strong>{feedback.correct ? "答對了" : "這題答錯了"}</strong>
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
