import { useMemo, useState } from "react";

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function buildExamItems(listeningQuestions, grammarQuestions, readingQuestions) {
  const listeningItems = listeningQuestions.slice(0, 8).map((item) => ({
    id: `mock-${item.id}`,
    domain: "listening",
    title: `Listening / Level ${item.level}`,
    prompt: item.prompt,
    context: item.transcript,
    audioText: item.audioText,
    options: item.options,
    answer: item.answer,
    explanationZh: item.explanationZh,
  }));

  const grammarItems = grammarQuestions.slice(0, 6).map((item) => ({
    id: `mock-${item.id}`,
    domain: "grammar",
    title: "Grammar",
    prompt: item.sentence,
    context: item.translation,
    options: item.options,
    answer: item.answer,
    explanationZh: item.explanationZh,
  }));

  const readingItems = readingQuestions.slice(0, 6).map((item) => ({
    id: `mock-${item.id}`,
    domain: "reading",
    title: item.type,
    prompt: item.questions[0].question,
    context: item.text,
    options: item.questions[0].options,
    answer: item.questions[0].answer,
    explanationZh: item.questions[0].explanationZh,
  }));

  return [...listeningItems, ...grammarItems, ...readingItems];
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

  const current = examItems[currentIndex];

  const finishExam = () => {
    setFinished(true);
    const listeningItems = examItems.filter((item) => item.domain === "listening");
    const grammarItems = examItems.filter((item) => item.domain === "grammar");
    const readingItems = examItems.filter((item) => item.domain === "reading");

    const countCorrect = (items) =>
      items.filter((item) => answers[item.id] && answers[item.id] === item.answer).length;

    const listeningAccuracy = countCorrect(listeningItems) / listeningItems.length;
    const grammarAccuracy = countCorrect(grammarItems) / grammarItems.length;
    const readingAccuracy = countCorrect(readingItems) / readingItems.length;
    const totalCorrect = countCorrect(examItems);
    const overall = totalCorrect / examItems.length;
    const predicted = clamp(
      Math.round(255 + overall * 320 + listeningAccuracy * 120 + grammarAccuracy * 70 + readingAccuracy * 90),
      255,
      990,
    );

    onSaveMockTest(predicted);
  };

  if (!started) {
    return (
      <section className="page-shell">
        <div className="hero-card compact">
          <div>
            <p className="eyebrow">Mini Mock TOEIC</p>
            <h2>Take a mixed practice exam</h2>
            <p className="hero-description">
              This mini mock mixes listening, grammar, and reading. When you finish, the score will feed back into the AI score predictor.
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
              <strong>8</strong>
            </div>
            <div className="metric-card">
              <span>Grammar</span>
              <strong>6</strong>
            </div>
            <div className="metric-card">
              <span>Reading</span>
              <strong>6</strong>
            </div>
          </div>
          <button type="button" className="primary-button" onClick={() => setStarted(true)}>
            Start Mini Mock
          </button>
        </article>
      </section>
    );
  }

  if (finished) {
    const totalCorrect = examItems.filter((item) => answers[item.id] === item.answer).length;
    const overall = totalCorrect / examItems.length;
    const score = clamp(Math.round(255 + overall * 320), 255, 990);

    const sectionStats = ["listening", "grammar", "reading"].map((domain) => {
      const items = examItems.filter((item) => item.domain === domain);
      const correct = items.filter((item) => answers[item.id] === item.answer).length;
      return {
        domain,
        correct,
        total: items.length,
        accuracy: Math.round((correct / items.length) * 100),
      };
    });

    const weakest = [...sectionStats].sort((a, b) => a.accuracy - b.accuracy)[0];

    return (
      <section className="page-shell">
        <div className="hero-card compact">
          <div>
            <p className="eyebrow">Mini Mock Result</p>
            <h2>Your estimated mini-mock score: {score}</h2>
            <p className="hero-description">
              This result has already been saved into your score history and will affect the predicted TOEIC score.
            </p>
          </div>
        </div>

        <div className="metric-grid">
          {sectionStats.map((item) => (
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
          <h3>Weakest section</h3>
          <p>
            {weakest.domain} is your current weakest section in this mini mock. Use it to guide your next focused block.
          </p>
          <div className="card-row">
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setStarted(false);
                setFinished(false);
                setCurrentIndex(0);
                setAnswers({});
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
          <p className="hero-description">{current.title}</p>
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

