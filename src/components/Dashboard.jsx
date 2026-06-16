function Dashboard({
  appCopy,
  dailyTasks,
  taskProgress,
  stats,
  currentLevel,
  nextTarget,
  weakInsight,
  achievements,
  onNavigate,
  onCheckIn,
  checkedInToday,
  levels,
}) {
  return (
    <section className="page-shell">
      <div className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">{appCopy.subtitle}</p>
          <h1>{appCopy.title}</h1>
          <p className="hero-motto">{appCopy.motto}</p>
          <p className="hero-description">{appCopy.description}</p>
          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={() => onNavigate("quiz")}>
              Start Today
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={onCheckIn}
              disabled={checkedInToday}
            >
              {checkedInToday ? "Checked In" : "Daily Check-in"}
            </button>
          </div>
        </div>

        <div className="hero-score">
          <div className="score-ring">
            <span>{stats.predictedScore}</span>
            <small>Predicted TOEIC</small>
          </div>
          <div className="score-meta">
            <p>Current: {stats.predictedScore}</p>
            <p>Next target: {nextTarget?.target ?? 350}</p>
            <p>Gap: {Math.max((nextTarget?.target ?? 350) - stats.predictedScore, 0)} pts</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="quest-card">
          <div className="section-heading">
            <h2>Today&apos;s Mission</h2>
            <p>Keep the streak alive with a balanced study loop.</p>
          </div>
          <div className="task-stack">
            {dailyTasks.map((task) => {
              const progress = taskProgress[task.key] ?? 0;
              const ratio = Math.min(progress / task.goal, 1);
              return (
                <div key={task.key} className="task-item">
                  <div className="card-row">
                    <span>
                      {task.icon} {task.label}
                    </span>
                    <strong>
                      {progress} / {task.goal}
                    </strong>
                  </div>
                  <div className="progress-bar">
                    <span style={{ width: `${ratio * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="quest-card">
          <div className="section-heading">
            <h2>Daily Momentum</h2>
            <p>Product-style progress, not just homework counters.</p>
          </div>
          <div className="metric-grid">
            <div className="metric-card">
              <span>Today XP</span>
              <strong>{stats.xp}</strong>
            </div>
            <div className="metric-card">
              <span>Streak</span>
              <strong>{stats.streak}</strong>
            </div>
            <div className="metric-card">
              <span>Learned Words</span>
              <strong>{stats.learnedWords}</strong>
            </div>
            <div className="metric-card">
              <span>Speaking</span>
              <strong>{stats.percentages.speaking}%</strong>
            </div>
            <div className="metric-card">
              <span>Listening</span>
              <strong>{stats.percentages.listening}%</strong>
            </div>
            <div className="metric-card">
              <span>Reading</span>
              <strong>{stats.percentages.reading}%</strong>
            </div>
            <div className="metric-card">
              <span>Grammar</span>
              <strong>{stats.percentages.grammar}%</strong>
            </div>
            <div className="metric-card">
              <span>Mock Score</span>
              <strong>{stats.latestMockScore || "--"}</strong>
            </div>
          </div>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="quest-card">
          <div className="section-heading">
            <h2>Learning Path</h2>
            <p>{currentLevel.title}</p>
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
            <h2>AI Weakness Insight</h2>
            <p>Use mistakes to drive the next best study move.</p>
          </div>
          <div className="insight-block">
            <strong>{weakInsight.title}</strong>
            <p>{weakInsight.summary}</p>
            <p className="muted">{weakInsight.nextStep}</p>
          </div>
          <div className="quick-links">
            <button type="button" className="secondary-button" onClick={() => onNavigate("listening")}>
              Fix Listening
            </button>
            <button type="button" className="secondary-button" onClick={() => onNavigate("speaking")}>
              Train Speaking
            </button>
            <button type="button" className="secondary-button" onClick={() => onNavigate("mistakes")}>
              Review Mistakes
            </button>
          </div>
        </article>
      </div>

      <article className="quest-card">
        <div className="section-heading">
          <h2>Achievements</h2>
          <p>Keep motivation high with visible progress wins.</p>
        </div>
        <div className="badge-grid">
          {achievements.slice(0, 6).map((badge) => (
            <div key={badge.id} className={`badge-card ${badge.unlocked ? "unlocked" : ""}`}>
              <span>{badge.unlocked ? "Unlocked" : "Locked"}</span>
              <strong>{badge.title}</strong>
              <p>{badge.description}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export default Dashboard;

