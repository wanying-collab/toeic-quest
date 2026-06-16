import { useEffect, useMemo, useState } from "react";

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function buildExamItems(listeningQuestions, grammarQuestions, readingQuestions) {
  const listeningItems = listeningQuestions.slice(0, 10).map((item) => ({
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
  }));

  const grammarItems = grammarQuestions.slice(0, 8).map((item) => ({
    id: `mock-${item.id}`,
    domain: "grammar",
    title: "Grammar",
    prompt: item.sentence,
    context: item.translation,
    options: item.options,
    answer: item.answer,
    explanationZh: item.explanationZh,
    trapAnalysis: item.technique,
  }));

  const readingItems = readingQuestions.slice(0, 8).map((item) => {
    const firstQuestion = item.questions[0];
    return {
      id: `mock-${firstQuestion.id}`,
      domain: "reading",
      title: item.type,
      prompt: firstQuestion.question,
      context: item.text,
      options: firstQuestion.options,
      answer: firstQuestion.answer,
      explanationZh: firstQuestion.explanationZh,
      trapAnalysis: item.strategy,
    };
  });

  return [...listeningItems, ...grammarItems, ...readingItems];
}

function buildSectionStats(examItems, answers) {
  return ["listening", "grammar", "reading"].map((domain) => {
    const items = examItems.filter((item) => item.domain === domain);
    const correct = items.filter((item) => answers[item.id] === item.answer).length;
    return {
      domain,
      correct,
      total: items.length,
      accuracy: Math.round((correct / items.length) * 100),
    };
  });
}

function MockExam({
  listeningQuestions,
  grammarQuestions,
  readingQuestions,
  onSpeak,
  onSaveMockTest,
}) {
  const examItems = useMemo(
    () => buildExamItems(listeningQuestions, grammarQuestions, readingQuestions),
    [listeningQuestions, grammarQuestions, readingQuestions],
  );

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [mockResult, setMockResult] = useState(null);

  useEffect(() => {
    if (!started || finished) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [started, finished]);

  const current = examItems[currentIndex];

  const finishExam = () => {
    const sectionStats = buildSectionStats(examItems, answers);
    const totalCorrect = examItems.filter((item) => answers[item.id] === item.answer).length;
    const overall = totalCorrect / examItems.length;
    const listeningAccuracy = sectionStats.find((item) => item.domain === "listening")?.accuracy ?? 0;
    const grammarAccuracy = sectionStats.find((item) => item.domain === "grammar")?.accuracy ?? 0;
    const readingAccuracy = sectionStats.find((item) => item.domain === "reading")?.accuracy ?? 0;

    const score = clamp(
      Math.round(
        255 +
          overall * 310 +
          (listeningAccuracy / 100) * 135 +
          (grammarAccuracy / 100) * 80 +
          (readingAccuracy / 100) * 120,
      ),
      255,
      990,
    );

    const wrongItems = examItems
      .filter((item) => answers[item.id] !== item.answer)
      .map((item) => ({
        ...item,
        userAnswer: answers[item.id] ?? "(no answer)",
      }));

    const weakestSection = [...sectionStats].sort((a, b) => a.accuracy - b.accuracy)[0];

    const result = {
      score,
      overallAccuracy: Math.round(overall * 100),
      elapsedSeconds,
      sectionStats,
      wrongItems,
      weakestSection,
      date: new Date().toISOString(),
    };

    setMockResult(result);
    setFinished(true);
    onSaveMockTest(result);
  };

  if (!started) {
    return (
      <section className="page-shell">
        <div className="hero-card compact">
          <div>
            <p className="eyebrow">Mini Mock TOEIC</p>
            <h2>Take a timed mixed practice exam</h2>
            <p className="hero-description">
              This mock includes separate listening, grammar, and reading blocks. When you finish, the score and analysis go back into the AI predictor.
            </p>
          </div>
        </div>

        <article className="quest-card">
          <div className="metric-grid">
            <div className="metric-card">
              <span>Total Questions</span>
              <strong>{examItems.length}</strong>
            </div>
            <div className="metric-card">
              <span>Listening</span>
              <strong>10</strong>
            </div>
            <div className="metric-card">
              <span>Grammar</span>
              <strong>8</strong>
            </div>
            <div className="metric-card">
              <span>Reading</span>
              <strong>8</strong>
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
            Start Mini Mock
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
            <p className="eyebrow">Mini Mock Result</p>
            <h2>Your estimated mock score: {mockResult.score}</h2>
            <p className="hero-description">
              This result has already been saved into your score history and now affects the TOEIC prediction.
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
            <strong>{mockResult.elapsedSeconds}s</strong>
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
          <p>
            Your weakest section is <strong>{mockResult.weakestSection.domain}</strong>. That section should be your next focused study block.
          </p>
          <p>
            The result combines section accuracy, overall accuracy, and exam pacing to estimate a TOEIC-like mock score.
          </p>
        </article>

        <article className="quest-card">
          <h3>Mistake Analysis</h3>
          {mockResult.wrongItems.length === 0 ? (
            <p>Excellent. You answered every mini-mock question correctly.</p>
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
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setStarted(false);
                setFinished(false);
                setCurrentIndex(0);
                setAnswers({});
                setElapsedSeconds(0);
                setMockResult(null);
              }}
            >
              Retake Mini Mock
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
          <p className="eyebrow">Mini Mock TOEIC</p>
          <h2>
            Question {currentIndex + 1} / {examItems.length}
          </h2>
          <p className="hero-description">
            {current.title} / Elapsed Time: {elapsedSeconds}s
          </p>
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
      </article>
    </section>
  );
}

export default MockExam;

