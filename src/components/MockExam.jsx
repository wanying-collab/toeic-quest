import { useCallback, useEffect, useMemo, useState } from "react";

const SECTION_WEIGHTS = {
  listening: 220,
  grammar: 100,
  reading: 215,
};

const MOCK_MODES = {
  mixed: {
    id: "mixed",
    label: "Mixed Mock Test",
    description: "A balanced TOEIC-style block with listening, grammar, and reading together.",
    timeLimitSeconds: 18 * 60,
    counts: {
      listening: 10,
      grammar: 8,
      reading: 8,
    },
  },
  listening: {
    id: "listening",
    label: "Listening Mock Test",
    description: "Focus on word listening, short sentences, question-response, and mini-talks.",
    timeLimitSeconds: 12 * 60,
    counts: {
      listening: 15,
      grammar: 0,
      reading: 0,
    },
  },
  reading: {
    id: "reading",
    label: "Reading Mock Test",
    description: "Move from short reading to passage questions and Part 7 style targeting.",
    timeLimitSeconds: 16 * 60,
    counts: {
      listening: 0,
      grammar: 0,
      reading: 14,
    },
  },
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function mapListeningItem(item) {
  return {
    id: `mock-${item.id}`,
    domain: "listening",
    title: `Listening / Level ${item.level}`,
    prompt: item.prompt,
    context: item.transcript,
    audioText: item.audioText,
    options: item.options,
    answer: item.answer,
    explanationZh: item.explanationZh,
    trapAnalysis: item.trapAnalysis,
    category: item.category,
  };
}

function mapGrammarItem(item) {
  return {
    id: `mock-${item.id}`,
    domain: "grammar",
    title: `Grammar / ${item.topic}`,
    prompt: item.sentence,
    context: item.translation,
    options: item.options,
    answer: item.answer,
    explanationZh: item.explanationZh,
    trapAnalysis: item.technique,
    category: item.topic,
  };
}

function expandReadingItem(item) {
  return item.questions.map((question) => ({
    id: `mock-${item.id}-${question.id}`,
    domain: "reading",
    title: `${item.type} / ${item.stage}`,
    prompt: question.question,
    context: item.text,
    options: question.options,
    answer: question.answer,
    explanationZh: question.explanationZh,
    trapAnalysis: item.strategy,
    category: item.type,
  }));
}

function pickListeningItems(listeningQuestions, count) {
  const levelPlan = count >= 15 ? [3, 3, 3, 3, 3] : [2, 2, 2, 2, 2];
  const result = [];

  levelPlan.forEach((needed, index) => {
    const level = index + 1;
    const items = listeningQuestions
      .filter((item) => item.level === level)
      .slice(0, needed)
      .map(mapListeningItem);

    result.push(...items);
  });

  return result.slice(0, count);
}

function pickGrammarItems(grammarQuestions, count) {
  return grammarQuestions.slice(0, count).map(mapGrammarItem);
}

function pickReadingItems(readingQuestions, count) {
  const stagePlans = count >= 14
    ? [
        ["word", 2],
        ["phrase", 2],
        ["sentence", 3],
        ["passage", 3],
        ["part7", 4],
      ]
    : [
        ["sentence", 2],
        ["passage", 3],
        ["part7", 3],
      ];

  const result = [];

  stagePlans.forEach(([stage, needed]) => {
    const items = readingQuestions
      .filter((item) => item.stage === stage)
      .flatMap((item) => expandReadingItem(item))
      .slice(0, needed);

    result.push(...items);
  });

  return result.slice(0, count);
}

function buildExamItems(modeId, listeningQuestions, grammarQuestions, readingQuestions) {
  const config = MOCK_MODES[modeId] ?? MOCK_MODES.mixed;
  const items = [];

  if (config.counts.listening) {
    items.push(...pickListeningItems(listeningQuestions, config.counts.listening));
  }

  if (config.counts.grammar) {
    items.push(...pickGrammarItems(grammarQuestions, config.counts.grammar));
  }

  if (config.counts.reading) {
    items.push(...pickReadingItems(readingQuestions, config.counts.reading));
  }

  return items;
}

function buildSectionStats(examItems, answers) {
  const domains = [...new Set(examItems.map((item) => item.domain))];

  return domains.map((domain) => {
    const items = examItems.filter((item) => item.domain === domain);
    const correct = items.filter((item) => answers[item.id] === item.answer).length;

    return {
      domain,
      correct,
      total: items.length,
      accuracy: items.length ? Math.round((correct / items.length) * 100) : 0,
    };
  });
}

function buildWeaknessBuckets(wrongItems) {
  const grouped = wrongItems.reduce((accumulator, item) => {
    const key = item.category || item.domain;
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(grouped)
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 4);
}

function buildModeAdvice(modeId, weakestSection, weaknessBuckets) {
  if (modeId === "listening") {
    return "Go back to keyword listening, short response drills, and shadowing before attempting a full mixed block again.";
  }

  if (modeId === "reading") {
    return "Review signal words, passage purpose, and next-action clues before your next reading mock.";
  }

  if (weaknessBuckets[0]) {
    return `Your biggest content gap is ${weaknessBuckets[0].label}. Pair that topic with ${weakestSection.domain} practice next.`;
  }

  return `Your weakest section is ${weakestSection.domain}. Use that as your next focused study block.`;
}

function MockExam({
  listeningQuestions,
  grammarQuestions,
  readingQuestions,
  onSpeak,
  onSaveMockTest,
}) {
  const [modeId, setModeId] = useState("mixed");
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [mockResult, setMockResult] = useState(null);

  const examConfig = MOCK_MODES[modeId] ?? MOCK_MODES.mixed;
  const examItems = useMemo(
    () => buildExamItems(modeId, listeningQuestions, grammarQuestions, readingQuestions),
    [modeId, listeningQuestions, grammarQuestions, readingQuestions],
  );

  const finishExam = useCallback(() => {
    const sectionStats = buildSectionStats(examItems, answers);
    const totalCorrect = examItems.filter((item) => answers[item.id] === item.answer).length;
    const overall = examItems.length ? totalCorrect / examItems.length : 0;
    const weightedAccuracy = sectionStats.reduce((sum, item) => {
      const weight = SECTION_WEIGHTS[item.domain] ?? 100;
      return sum + (item.accuracy / 100) * weight;
    }, 0);
    const totalWeight =
      sectionStats.reduce((sum, item) => sum + (SECTION_WEIGHTS[item.domain] ?? 100), 0) || 1;
    const normalizedAccuracy = weightedAccuracy / totalWeight;
    const timeRatio = elapsedSeconds / examConfig.timeLimitSeconds;
    const pacingBonus = timeRatio <= 0.85 ? 18 : timeRatio <= 1 ? 8 : -18;

    const score = clamp(
      Math.round(255 + normalizedAccuracy * 640 + overall * 70 + pacingBonus),
      255,
      990,
    );

    const wrongItems = examItems
      .filter((item) => answers[item.id] !== item.answer)
      .map((item) => ({
        ...item,
        userAnswer: answers[item.id] ?? "(no answer)",
      }));

    const weakestSection =
      [...sectionStats].sort((left, right) => left.accuracy - right.accuracy)[0] ?? {
        domain: "mixed",
        accuracy: 0,
        total: 0,
        correct: 0,
      };

    const weaknessBuckets = buildWeaknessBuckets(wrongItems);
    const result = {
      modeId,
      modeLabel: examConfig.label,
      score,
      overallAccuracy: Math.round(overall * 100),
      elapsedSeconds,
      timeLimitSeconds: examConfig.timeLimitSeconds,
      sectionStats,
      wrongItems,
      weakestSection,
      weaknessBuckets,
      advice: buildModeAdvice(modeId, weakestSection, weaknessBuckets),
      date: new Date().toISOString(),
    };

    setMockResult(result);
    setFinished(true);
    onSaveMockTest(result);
  }, [answers, elapsedSeconds, examConfig.label, examConfig.timeLimitSeconds, examItems, modeId, onSaveMockTest]);

  useEffect(() => {
    if (!started || finished) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (!started || finished) {
      return;
    }

    if (elapsedSeconds >= examConfig.timeLimitSeconds) {
      finishExam();
    }
  }, [started, finished, elapsedSeconds, examConfig.timeLimitSeconds, finishExam]);

  const current = examItems[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const remainingSeconds = Math.max(0, examConfig.timeLimitSeconds - elapsedSeconds);

  const restartExam = () => {
    setStarted(false);
    setFinished(false);
    setCurrentIndex(0);
    setAnswers({});
    setElapsedSeconds(0);
    setMockResult(null);
  };

  if (!started) {
    return (
      <section className="page-shell">
        <div className="hero-card compact">
          <div>
            <p className="eyebrow">Mock TOEIC</p>
            <h2>Train with dedicated listening, reading, or mixed exam modes</h2>
            <p className="hero-description">
              Each mock writes back to your score history, weakness analysis, and TOEIC prediction model.
            </p>
          </div>
        </div>

        <div className="track-grid">
          {Object.values(MOCK_MODES).map((mode) => (
            <article key={mode.id} className="quest-card track-card">
              <p className="eyebrow">Exam Mode</p>
              <h3>{mode.label}</h3>
              <p>{mode.description}</p>
              <div className="hero-badges">
                {mode.counts.listening > 0 && <span className="pill">Listening {mode.counts.listening}</span>}
                {mode.counts.grammar > 0 && <span className="pill">Grammar {mode.counts.grammar}</span>}
                {mode.counts.reading > 0 && <span className="pill">Reading {mode.counts.reading}</span>}
                <span className="pill">Time {formatTime(mode.timeLimitSeconds)}</span>
              </div>
              <div className="card-row">
                <span className="muted">
                  {buildExamItems(mode.id, listeningQuestions, grammarQuestions, readingQuestions).length.toLocaleString()} questions ready
                </span>
                <button
                  type="button"
                  className={`primary-button ${modeId === mode.id ? "is-selected" : ""}`}
                  onClick={() => setModeId(mode.id)}
                >
                  {modeId === mode.id ? "Selected" : "Choose Mode"}
                </button>
              </div>
            </article>
          ))}
        </div>

        <article className="quest-card">
          <div className="metric-grid">
            <div className="metric-card">
              <span>Total Questions</span>
              <strong>{examItems.length}</strong>
            </div>
            <div className="metric-card">
              <span>Listening</span>
              <strong>{examConfig.counts.listening}</strong>
            </div>
            <div className="metric-card">
              <span>Grammar</span>
              <strong>{examConfig.counts.grammar}</strong>
            </div>
            <div className="metric-card">
              <span>Reading</span>
              <strong>{examConfig.counts.reading}</strong>
            </div>
            <div className="metric-card">
              <span>Time Limit</span>
              <strong>{formatTime(examConfig.timeLimitSeconds)}</strong>
            </div>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setStarted(true);
              setFinished(false);
              setCurrentIndex(0);
              setAnswers({});
              setElapsedSeconds(0);
              setMockResult(null);
            }}
          >
            Start {examConfig.label}
          </button>
        </article>
      </section>
    );
  }

  if (finished && mockResult) {
    return (
      <section className="page-shell">
        <div className="hero-card compact">
          <div>
            <p className="eyebrow">Mock Result</p>
            <h2>{mockResult.modeLabel} score estimate: {mockResult.score}</h2>
            <p className="hero-description">
              This result has already been saved into your score history and now affects the TOEIC predictor.
            </p>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <span>Overall Accuracy</span>
            <strong>{mockResult.overallAccuracy}%</strong>
          </div>
          <div className="metric-card">
            <span>Time Used</span>
            <strong>{formatTime(mockResult.elapsedSeconds)}</strong>
          </div>
          <div className="metric-card">
            <span>Weakest Section</span>
            <strong>{mockResult.weakestSection.domain}</strong>
          </div>
          <div className="metric-card">
            <span>Wrong Items</span>
            <strong>{mockResult.wrongItems.length}</strong>
          </div>
        </div>

        <div className="metric-grid">
          {mockResult.sectionStats.map((item) => (
            <div key={item.domain} className="metric-card">
              <span>{item.domain}</span>
              <strong>
                {item.correct}/{item.total}
              </strong>
              <p>{item.accuracy}%</p>
            </div>
          ))}
        </div>

        <article className="quest-card">
          <h3>Weakness Analysis</h3>
          <p>{mockResult.advice}</p>
          {mockResult.weaknessBuckets.length > 0 && (
            <div className="analysis-grid">
              {mockResult.weaknessBuckets.map((bucket) => (
                <div key={bucket.label} className="tip-box">
                  <strong>{bucket.label}</strong>
                  <p>{bucket.count} wrong answers came from this topic.</p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="quest-card">
          <h3>Detailed Analysis</h3>
          {mockResult.wrongItems.length === 0 ? (
            <p>Excellent. You answered every question correctly in this mock.</p>
          ) : (
            <div className="stack-gap">
              {mockResult.wrongItems.map((item) => (
                <div key={item.id} className="tip-box">
                  <strong>{item.title}</strong>
                  <p>Question: {item.prompt}</p>
                  <p>Your answer: {item.userAnswer}</p>
                  <p>Correct answer: {item.answer}</p>
                  <p>Explanation: {item.explanationZh}</p>
                  <p>How to improve: {item.trapAnalysis}</p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="quest-card">
          <div className="card-row">
            <button type="button" className="secondary-button" onClick={restartExam}>
              Choose Another Mode
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setStarted(true);
                setFinished(false);
                setCurrentIndex(0);
                setAnswers({});
                setElapsedSeconds(0);
                setMockResult(null);
              }}
            >
              Retake {mockResult.modeLabel}
            </button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">{examConfig.label}</p>
          <h2>
            Question {currentIndex + 1} / {examItems.length}
          </h2>
          <p className="hero-description">
            {current.title}
          </p>
        </div>
        <div className="metric-grid">
          <div className="metric-card">
            <span>Time Left</span>
            <strong>{formatTime(remainingSeconds)}</strong>
          </div>
          <div className="metric-card">
            <span>Answered</span>
            <strong>{answeredCount}</strong>
          </div>
          <div className="metric-card">
            <span>Mode</span>
            <strong>{examConfig.label}</strong>
          </div>
        </div>
      </div>

      <article className="quest-card quiz-shell">
        {current.domain === "listening" && (
          <button type="button" className="secondary-button" onClick={() => onSpeak(current.audioText)}>
            Play Audio
          </button>
        )}
        <pre className="reading-passage">{current.context}</pre>
        <h3>{current.prompt}</h3>
        <div className="option-grid">
          {current.options.map((option) => (
            <button
              key={option}
              type="button"
              className={`option-button ${answers[current.id] === option ? "active" : ""}`}
              onClick={() => setAnswers((previous) => ({ ...previous, [current.id]: option }))}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="card-row">
          <button
            type="button"
            className="secondary-button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
          >
            Previous
          </button>

          <div className="hero-badges">
            <button type="button" className="secondary-button" onClick={restartExam}>
              Exit Mock
            </button>
            {currentIndex < examItems.length - 1 ? (
              <button
                type="button"
                className="primary-button"
                onClick={() => setCurrentIndex((value) => Math.min(examItems.length - 1, value + 1))}
              >
                Next
              </button>
            ) : (
              <button type="button" className="primary-button" onClick={finishExam}>
                Finish Mock
              </button>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}

export default MockExam;
