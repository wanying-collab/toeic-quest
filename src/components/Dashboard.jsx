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
              開始今日任務
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={onCheckIn}
              disabled={checkedInToday}
            >
              {checkedInToday ? "今天已簽到" : "每日簽到"}
            </button>
          </div>
        </div>

        <div className="hero-score">
          <div className="score-ring">
            <span>{stats.predictedScore}</span>
            <small>預估分數</small>
          </div>
          <div className="score-meta">
            <p>目前起點 255</p>
            <p>下一目標 {nextTarget?.target ?? 350}</p>
            <p>最終目標 730+</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="quest-card">
          <div className="section-heading">
            <h2>今日任務</h2>
            <p>每天一點點，穩定把基礎補起來。</p>
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
            <h2>學習進度</h2>
            <p>把今天的努力換成看得見的成長。</p>
          </div>
          <div className="metric-grid">
            <div className="metric-card">
              <span>已學單字數</span>
              <strong>{stats.learnedWords}</strong>
            </div>
            <div className="metric-card">
              <span>收藏單字數</span>
              <strong>{stats.favoriteCount}</strong>
            </div>
            <div className="metric-card">
              <span>錯題數</span>
              <strong>{stats.mistakeCount}</strong>
            </div>
            <div className="metric-card">
              <span>待複習</span>
              <strong>{stats.dueReviewCount}</strong>
            </div>
            <div className="metric-card">
              <span>聽力正確率</span>
              <strong>{stats.percentages.listening}%</strong>
            </div>
            <div className="metric-card">
              <span>閱讀正確率</span>
              <strong>{stats.percentages.reading}%</strong>
            </div>
            <div className="metric-card">
              <span>文法正確率</span>
              <strong>{stats.percentages.grammar}%</strong>
            </div>
            <div className="metric-card">
              <span>XP / 連續天數</span>
              <strong>
                {stats.xp} / {stats.streak}
              </strong>
            </div>
          </div>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="quest-card">
          <div className="section-heading">
            <h2>目標進度</h2>
            <p>{currentLevel.title}</p>
          </div>
          <div className="goal-steps">
            <div className="goal-line">
              <span>目前預估</span>
              <strong>{stats.predictedScore}</strong>
            </div>
            <div className="goal-line">
              <span>下一目標</span>
              <strong>{nextTarget?.target ?? 350}</strong>
            </div>
            <div className="goal-line">
              <span>距離下一階段</span>
              <strong>{Math.max((nextTarget?.target ?? 350) - stats.predictedScore, 0)} 分</strong>
            </div>
          </div>
          <div className="tip-box">
            <strong>目前建議</strong>
            <p>{nextTarget?.advice ?? currentLevel.focus}</p>
          </div>
        </article>

        <article className="quest-card">
          <div className="section-heading">
            <h2>AI 弱點分析</h2>
            <p>用你的錯題和正確率找出最該補的地方。</p>
          </div>
          <div className="insight-block">
            <strong>{weakInsight.title}</strong>
            <p>{weakInsight.summary}</p>
            <p className="muted">{weakInsight.nextStep}</p>
          </div>
          <div className="quick-links">
            <button type="button" className="secondary-button" onClick={() => onNavigate("listening")}>
              練聽力
            </button>
            <button type="button" className="secondary-button" onClick={() => onNavigate("reading")}>
              練閱讀
            </button>
            <button type="button" className="secondary-button" onClick={() => onNavigate("mistakes")}>
              看錯題
            </button>
          </div>
        </article>
      </div>

      <article className="quest-card">
        <div className="section-heading">
          <h2>最新成就</h2>
          <p>每一個小徽章都代表你真的有在往前走。</p>
        </div>
        <div className="badge-grid">
          {achievements.slice(0, 6).map((badge) => (
            <div key={badge.id} className={`badge-card ${badge.unlocked ? "unlocked" : ""}`}>
              <span>{badge.unlocked ? "已解鎖" : "未解鎖"}</span>
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
