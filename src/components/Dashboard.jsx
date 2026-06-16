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
  vocabularyTotal,
}) {
  const learningProgress = Math.round(
    (stats.vocabularyMasteryRate + stats.percentages.listening + stats.percentages.reading + stats.percentages.grammar) /
      4,
  );

  const recommendation =
    stats.percentages.listening <= stats.percentages.reading
      ? "目前建議：優先加強 Listening 與 Vocabulary。"
      : "目前建議：優先加強 Reading 與 Grammar。";

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
            <span>AI</span>
            <small>Predicted Score</small>
          </div>
          <div className="score-meta">
            <p>Current Level: {currentLevel.publicLabel ?? currentLevel.title}</p>
            <p>Next Goal: {nextTarget?.goalLabel ?? "Green Certificate"}</p>
            <p>Learning Progress: {learningProgress}%</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="quest-card">
          <div className="section-heading">
            <h2>Today&apos;s Mission 今日任務</h2>
            <p>Keep the study loop balanced with vocabulary, listening, reading, and speaking.</p>
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
            <h2>Learning Progress 學習進度</h2>
            <p>Showcase learner momentum with AI-assisted study data.</p>
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
              <span>Vocabulary Mastery</span>
              <strong>{stats.vocabularyMasteryRate}%</strong>
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
              <span>Predicted Score</span>
              <strong>AI-calculated</strong>
            </div>
          </div>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="quest-card">
          <div className="section-heading">
            <h2>AI Learning Analysis AI 智慧學習分析</h2>
            <p>Highlight the platform&apos;s personalized feedback and recommendation engine.</p>
          </div>
          <div className="metric-grid">
            <div className="metric-card">
              <span>Vocabulary Mastery</span>
              <strong>{stats.vocabularyMasteryRate}%</strong>
            </div>
            <div className="metric-card">
              <span>Listening Progress</span>
              <strong>{stats.percentages.listening}%</strong>
            </div>
            <div className="metric-card">
              <span>Reading Progress</span>
              <strong>{stats.percentages.reading}%</strong>
            </div>
            <div className="metric-card">
              <span>Grammar Progress</span>
              <strong>{stats.percentages.grammar}%</strong>
            </div>
          </div>
          <div className="tip-box">
            <strong>Weakness Recommendation</strong>
            <p>{recommendation}</p>
            <p className="muted">{weakInsight.nextStep}</p>
          </div>
        </article>

        <article className="quest-card">
          <div className="section-heading">
            <h2>Vocabulary Database 單字資料庫</h2>
            <p>Make the scale of the platform immediately visible to competition judges.</p>
          </div>
          <div className="database-highlight">
            <strong>{vocabularyTotal.toLocaleString()}+ Words</strong>
            <p>TOEIC Vocabulary Database</p>
          </div>
          <p>
            包含商務、辦公、財務、採購、製造、物流、旅遊、客服與科技等多益常見主題，
            支援主題式學習、發音播放、Word Family 與智慧複習。
          </p>
          <div className="quick-links">
            <button type="button" className="secondary-button" onClick={() => onNavigate("vocabulary")}>
              Open Vocabulary
            </button>
            <button type="button" className="secondary-button" onClick={() => onNavigate("quiz")}>
              Start Quiz
            </button>
          </div>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="quest-card">
          <div className="section-heading">
            <h2>Learning Path 學習路徑</h2>
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
                    <p>{level.publicLabel ?? level.title}</p>
                  </div>
                  <p>{level.focus}</p>
                </div>
              );
            })}
          </div>
        </article>

        <article className="quest-card">
          <div className="section-heading">
            <h2>AI Recommendation AI 推薦行動</h2>
            <p>Use recent study behavior and mistakes to drive the next best learning move.</p>
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
          <h2>Achievements 成就系統</h2>
          <p>Keep motivation visible with milestone-based learning progress.</p>
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
