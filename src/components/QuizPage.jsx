import { useEffect, useMemo, useState } from "react";

const quizModes = [
  { id: "listen-zh", label: "聽單字選中文" },
  { id: "listen-en", label: "聽單字選英文" },
  { id: "sentence-meaning", label: "聽短句選意思" },
  { id: "word-meaning", label: "英文選中文" },
];

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function pickOptions(pool, current, field) {
  const seen = new Set([current[field]]);
  const distractors = [];

  for (const item of shuffle(pool)) {
    if (item.id === current.id) {
      continue;
    }
    if (seen.has(item[field])) {
      continue;
    }
    distractors.push(item[field]);
    seen.add(item[field]);
    if (distractors.length === 3) {
      break;
    }
  }

  return shuffle([current[field], ...distractors]);
}

function createWordQuestion(word, pool, mode) {
  if (mode === "listen-en") {
    return {
      id: `quiz-${mode}-${word.id}`,
      relatedWordId: word.id,
      difficulty: word.difficulty,
      category: word.category,
      promptLabel: "請聽單字，選出正確英文。",
      prompt: "播放音檔後選出正確英文單字。",
      speakText: word.word,
      options: pickOptions(pool, word, "word"),
      answer: word.word,
      explanationZh: `${word.word} 的中文是「${word.meaning}」，是 ${word.category} 常見單字。`,
      whyWrong: `這題核心是把聲音和字型連起來。${word.word} 的音先熟，拼字就不容易亂掉。`,
      nextTip: "聽單字時，先抓重音位置，再看哪個拼字最像。",
      keywordHint: word.pronunciation,
      example: word.example,
      exampleZh: word.exampleZh,
    };
  }

  const answer = word.meaning;
  return {
    id: `quiz-${mode}-${word.id}`,
    relatedWordId: word.id,
    difficulty: word.difficulty,
    category: word.category,
    promptLabel:
      mode === "word-meaning" ? "請選出正確中文。" : "請聽單字，選出正確中文。",
    prompt: mode === "word-meaning" ? word.word : "播放音檔後選出正確中文。",
    speakText: mode === "word-meaning" ? "" : word.word,
    options: pickOptions(pool, word, "meaning"),
    answer,
    explanationZh: `${word.word} 的意思是「${word.meaning}」。例句：${word.exampleZh}`,
    whyWrong: `這題要先把 ${word.word} 和中文「${word.meaning}」綁在一起，之後才有辦法進句子。`,
    nextTip: "先記最常見的中文意思，再慢慢加上搭配詞。",
    keywordHint: word.pronunciation,
    example: word.example,
    exampleZh: word.exampleZh,
  };
}

function createSentenceQuestion(question) {
  return {
    id: question.id,
    relatedWordId: null,
    difficulty: question.difficulty,
    category: question.focus,
    promptLabel: question.promptText,
    prompt: "播放短句後選出正確中文。",
    speakText: question.speakText,
    options: question.options,
    answer: question.answer,
    explanationZh: question.explanationZh,
    whyWrong: question.whyWrong,
    nextTip: question.nextTip,
    keywordHint: question.keywordHint,
    example: question.transcript,
    exampleZh: question.answer,
  };
}

export default function QuizPage({
  vocabulary,
  listeningQuestions,
  onSpeak,
  onRecordAnswer,
  practiceTarget,
  onPracticeHandled,
}) {
  const [mode, setMode] = useState("listen-zh");
  const [difficulty, setDifficulty] = useState("easy");
  const [category, setCategory] = useState("all");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const vocabularyPool = useMemo(() => {
    return vocabulary.filter((word) => {
      const matchDifficulty = difficulty === "all" || word.difficulty === difficulty;
      const matchCategory = category === "all" || word.category === category;
      return matchDifficulty && matchCategory;
    });
  }, [vocabulary, difficulty, category]);

  const sentencePool = useMemo(() => {
    return listeningQuestions.filter(
      (item) => item.mode === "sentence-meaning" && (difficulty === "all" || item.difficulty === difficulty)
    );
  }, [listeningQuestions, difficulty]);

  const categoryOptions = useMemo(() => {
    return [...new Set(vocabulary.map((word) => word.category))];
  }, [vocabulary]);

  function generateQuestion(config = {}) {
    const nextMode = config.mode ?? mode;
    const forcedWordId = config.relatedWordId ?? null;
    const forcedQuestionId = config.sourceId ?? null;

    if (nextMode === "sentence-meaning") {
      const baseQuestion =
        sentencePool.find((item) => item.id === forcedQuestionId) ??
        sentencePool[Math.floor(Math.random() * sentencePool.length)];
      if (!baseQuestion) {
        setCurrentQuestion(null);
        return;
      }
      setCurrentQuestion(createSentenceQuestion(baseQuestion));
      setFeedback(null);
      return;
    }

    const pool = vocabularyPool.length ? vocabularyPool : vocabulary;
    const word =
      pool.find((item) => item.id === forcedWordId) ??
      pool[Math.floor(Math.random() * pool.length)];

    if (!word) {
      setCurrentQuestion(null);
      return;
    }

    setCurrentQuestion(createWordQuestion(word, pool, nextMode));
    setFeedback(null);
  }

  useEffect(() => {
    generateQuestion();
  }, [mode, difficulty, category]);

  useEffect(() => {
    if (practiceTarget?.route !== "quiz") {
      return;
    }

    if (practiceTarget.quizMode) {
      setMode(practiceTarget.quizMode);
      generateQuestion({
        mode: practiceTarget.quizMode,
        relatedWordId: practiceTarget.relatedWordId,
        sourceId: practiceTarget.sourceId,
      });
    }
    onPracticeHandled();
  }, [practiceTarget]);

  useEffect(() => {
    if (!currentQuestion?.speakText) {
      return;
    }
    onSpeak(currentQuestion.speakText);
  }, [currentQuestion?.id]);

  function handleAnswer(selectedAnswer) {
    if (!currentQuestion || feedback) {
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.answer;
    const recordType = mode === "sentence-meaning" ? "listening" : "vocabulary";

    const result = {
      correct: isCorrect,
      title: quizModes.find((item) => item.id === mode)?.label ?? "單字測驗",
      prompt: currentQuestion.promptLabel,
      sourceId: currentQuestion.id,
      relatedWordId: currentQuestion.relatedWordId,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.answer,
      explanationZh: currentQuestion.explanationZh,
      whyWrong: currentQuestion.whyWrong,
      nextTip: currentQuestion.nextTip,
      route: "quiz",
      type: recordType,
      quizMode: mode,
      difficulty: currentQuestion.difficulty,
    };

    setFeedback(result);
    onRecordAnswer(result);
  }

  const emptyState = !currentQuestion;

  return (
    <section className="page-stack">
      <div className="content-card">
        <div className="section-heading">
          <h2>基礎救援測驗</h2>
          <p>先把單字聽懂，再把短句意思聽懂。你不需要一開始就扛完整對話。</p>
        </div>

        <div className="pill-row">
          {quizModes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`pill-button ${mode === item.id ? "is-active" : ""}`}
              onClick={() => setMode(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="filter-grid compact">
          <label className="field">
            <span>難度</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              <option value="all">全部</option>
              <option value="easy">easy</option>
              <option value="normal">normal</option>
              <option value="green">green</option>
              <option value="blue">blue</option>
            </select>
          </label>
          <label className="field">
            <span>分類</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">全部</option>
              {categoryOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {emptyState ? (
        <div className="content-card">
          <p>目前找不到符合條件的題目，請換一個難度或分類。</p>
        </div>
      ) : (
        <div className="content-card question-card">
          <div className="question-top">
            <div>
              <span className="eyebrow">{mode}</span>
              <h3>{currentQuestion.promptLabel}</h3>
              <p>{currentQuestion.prompt}</p>
            </div>
            {currentQuestion.speakText ? (
              <button
                type="button"
                className="ghost-button"
                onClick={() => onSpeak(currentQuestion.speakText)}
              >
                重播語音
              </button>
            ) : null}
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
              <strong>{feedback.correct ? "答對了，繼續加溫。" : "這題先別急，我們拆開看。"}</strong>
              <p>正確答案：{feedback.correctAnswer}</p>
              <p>中文解釋：{feedback.explanationZh}</p>
              <p>為什麼容易錯：{feedback.whyWrong}</p>
              <p>下次怎麼判斷：{feedback.nextTip}</p>
              <p>
                例句：{currentQuestion.example}
                <br />
                <small>{currentQuestion.exampleZh}</small>
              </p>
              <button type="button" className="primary-button" onClick={() => generateQuestion()}>
                下一題
              </button>
            </div>
          ) : (
            <div className="hint-box">
              <span>提示</span>
              <p>{currentQuestion.keywordHint}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
