import { useState } from "react";

function ProgressBar({ label, value }) {
  return (
    <div className="progress-line">
      <div className="card-row">
        <span>{label}</span>
        <strong>{Math.round(value * 100)}%</strong>
      </div>
      <div className="progress-bar">
        <span style={{ width: `${Math.round(value * 100)}%` }} />
      </div>
    </div>
  );
}

function ProgressPanel({
  stats,
  levels,
  achievements,
  weakCategories,
  reviewQueue,
  mockTests,
  onSaveMockTest,
}) {
  const [mockScore, setMockScore] = useState("");

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Progress</p>
          <h2>See your score, weak points, and review plan</h2>
          <p className="hero-description">
            TOEIC Quest now estimates your score by combining vocabulary growth, listening, grammar, reading, speaking, and mock results.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="quest-card">
          <div className="section-heading">
            <h3>AI Score Predictor</h3>
            <p>More than accuracy alone.</p>
          </div>
          <div className="metric-grid">
            <div className="metric-card">
              <span>Predicted Score</span>
              <strong>{stats.predictedScore}</strong>
            </div>
            <div className="metric-card">
              <span>Predicted Range</span>
              <strong>
                {stats.predictedRange[0]} - {stats.predictedRange[1]}
              </strong>
            </div>
            <div className="metric-card">
              <span>Vocabulary Size</span>
              <strong>{stats.learnedWords}</strong>
            </div>
            <div className="metric-card">
              <span>Latest Mock</span>
              <strong>{stats.latestMockScore || "--"}</strong>
            </div>
            <div className="metric-card">
              <span>Study Progress</span>
              <strong>{stats.totalAnswers}</strong>
            </div>
          </div>

          <div className="stack-gap">
            <ProgressBar label="Listening" value={stats.accuracy.listening} />
            <ProgressBar label="Reading" value={stats.accuracy.reading} />
            <ProgressBar label="Grammar" value={stats.accuracy.grammar} />
            <ProgressBar label="Speaking" value={stats.accuracy.speaking} />
          </div>
        </article>

        <article className="quest-card">
          <div className="section-heading">
            <h3>Mock TOEIC Input</h3>
            <p>Save mini or full mock scores to improve the prediction.</p>
          </div>
          <form
            className="spelling-form"
            onSubmit={(event) => {
              event.preventDefault();
              const numeric = Number(mockScore);
              if (!Number.isFinite(numeric) || numeric < 10 || numeric > 990) {
                return;
              }
              onSaveMockTest(numeric);
              setMockScore("");
            }}
          >
            <input
              value={mockScore}
              onChange={(event) => setMockScore(event.target.value)}
              placeholder="Enter a mock score, e.g. 385"
            />
            <button type="submit" className="primary-button">
              Save Mock Score
            </button>
          </form>
          <div className="stack-gap">
            {mockTests.length === 0 ? (
              <p>No mock scores yet. Add one to sharpen the prediction.</p>
            ) : (
              mockTests.slice(-5).reverse().map((item) => (
                <div key={item.date + item.score} className="review-item">
                  <strong>{item.score}</strong>
                  <p>{new Date(item.date).toLocaleDateString("zh-TW")}</p>
                  {item.elapsedSeconds ? <p>Time {item.elapsedSeconds}s</p> : null}
                  {item.weakestSection ? <p>Weakest {item.weakestSection.domain}</p> : null}
                </div>
              ))
            )}
          </div>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="quest-card">
          <div className="section-heading">
            <h3>Level Map</h3>
            <p>Move from 255 to 730+ step by step.</p>
          </div>
          <div className="level-stack">
            {levels.map((level) => {
              const active =
                stats.predictedScore >= level.minScore && stats.predictedScore <= level.maxScore;
              return (
                <div key={level.id} className={`level-item ${active ? "active" : ""}`}>
                  <div>
                    <strong>
                      {level.label} {level.title}
                    </strong>
                    <p>
                      {level.minScore} - {level.maxScore}
                    </p>
                  </div>
                  <p>{level.focus}</p>
                </div>
              );
            })}
          </div>
        </article>

        <article className="quest-card">
          <div className="section-heading">
            <h3>Weakness Analysis</h3>
            <p>Use real mistakes to choose the next training block.</p>
          </div>
          {weakCategories.length === 0 ? (
            <p>Keep practicing. Once you build more answer history, weakness analysis will become more specific.</p>
          ) : (
            <div className="stack-gap">
              {weakCategories.map((item) => (
                <div key={item.category} className="tip-box">
                  <strong>{item.category}</strong>
                  <p>Wrong answers: {item.wrongCount}</p>
                  <p>{item.advice}</p>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="quest-card">
          <div className="section-heading">
            <h3>Spaced Review Queue</h3>
            <p>Bring back what you need before it fades.</p>
          </div>
          {reviewQueue.length === 0 ? (
            <p>No review items yet. Finish a few practices and your queue will fill automatically.</p>
          ) : (
            <div className="stack-gap">
              {reviewQueue.slice(0, 8).map((item) => (
                <div key={item.key} className="review-item">
                  <strong>{item.label}</strong>
                  <p>
                    Next review: {new Date(item.nextReviewAt).toLocaleDateString("zh-TW")} / Correct streak:{" "}
                    {item.consecutiveCorrect}
                  </p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="quest-card">
          <div className="section-heading">
            <h3>Achievements</h3>
            <p>Small wins build long-term momentum.</p>
          </div>
          <div className="badge-grid">
            {achievements.map((badge) => (
              <div key={badge.id} className={`badge-card ${badge.unlocked ? "unlocked" : ""}`}>
                <span>{badge.unlocked ? "Unlocked" : "Locked"}</span>
                <strong>{badge.title}</strong>
                <p>{badge.description}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default ProgressPanel;
