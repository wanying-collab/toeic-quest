import { useEffect, useMemo, useState } from "react";
import { pickAdaptiveItem } from "../utils/adaptive";

const MODES = [
  { id: "en-zh", label: "English -> 中文" },
  { id: "zh-en", label: "中文 -> English" },
  { id: "audio-zh", label: "聽單字選中文" },
  { id: "audio-en", label: "聽單字選英文" },
  { id: "spelling", label: "拼字練習" },
];

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function buildChoicePool(words, currentWord, mode) {
  const distractors = shuffle(
    words.filter(
      (item) =>
        item.id !== currentWord.id &&
        item.category === currentWord.category &&
        item.level === currentWord.level,
    ),
  ).slice(0, 3);

  const fallback = shuffle(words.filter((item) => item.id !== currentWord.id)).slice(
    0,
    Math.max(0, 3 - distractors.length),
  );

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
    getCategory: (item) => item.category,
    getReviewKey: (item) => `vocabulary:vocab-${mode}-${item.id}`,
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

function QuizPage({ words, levels, onSpeak, onRecordAnswer, adaptiveProfile }) {
  const [mode, setMode] = useState("en-zh");
  const [level, setLevel] = useState("all");
  const [question, setQuestion] = useState(null);
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
    }
  }, [mode, level, pool, adaptiveProfile]);

  if (pool.length <= 3 || !question) {
    return (
      <section className="page-shell">
        <article className="quest-card">
          <h2>Quiz is getting ready</h2>
          <p>Add more vocabulary or change the level filter to start practicing.</p>
        </article>
      </section>
    );
  }

  const { currentWord } = question;

  const promptMap = {
    "en-zh": currentWord.word,
    "zh-en": currentWord.meaning,
    "audio-zh": "Listen to the word and choose the Chinese meaning.",
    "audio-en": "Listen to the word and choose the English answer.",
    spelling: `Type the English word for: ${currentWord.meaning}`,
  };

  const correctAnswer =
    mode === "en-zh" || mode === "audio-zh" ? currentWord.meaning : currentWord.word;

  const why = `Target word: ${currentWord.word}. Category: ${currentWord.category}. Keep the sound, meaning, and usage together.`;

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
        ? `答對了。${currentWord.word} 在 ${currentWord.category} 類別很常見。`
        : `這題正確答案是 ${correctAnswer}。下次先抓 ${currentWord.word} 的字義和例句。`,
    });
  };

  const nextQuestion = () => {
    setQuestion(createQuestion(pool, mode, adaptiveProfile));
    setFeedback(null);
    setTypedAnswer("");
  };

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Vocabulary Quest</p>
          <h2>單字、發音、拼字一起練</h2>
          <p className="hero-description">
            這裡的出題會避開最近常出現的單字，同時把你最近答錯的字拉回來複習。
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

      <article className="quest-card quiz-shell">
        <div className="card-topline">
          <div>
            <p className="eyebrow">{currentWord.category}</p>
            <h3>{MODES.find((item) => item.id === mode)?.label}</h3>
          </div>
          {(mode === "audio-zh" || mode === "audio-en") && (
            <button type="button" className="primary-button" onClick={() => onSpeak(currentWord.word)}>
              Play Audio
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
              placeholder="Type the word"
              disabled={Boolean(feedback)}
            />
            <button type="submit" className="primary-button" disabled={!typedAnswer.trim() || Boolean(feedback)}>
              Check
            </button>
          </form>
        )}

        {feedback && (
          <div className={`feedback-panel ${feedback.correct ? "correct" : "wrong"}`}>
            <strong>{feedback.correct ? "Correct" : "Try again"}</strong>
            <p>Answer: {feedback.correctAnswer}</p>
            <p>{feedback.explanationZh}</p>
            <p>{feedback.why}</p>
            <p className="word-example">{feedback.example}</p>
            <p className="word-example-zh">{feedback.exampleZh}</p>
            <button type="button" className="primary-button" onClick={nextQuestion}>
              Next Question
            </button>
          </div>
        )}
      </article>
    </section>
  );
}

export default QuizPage;

