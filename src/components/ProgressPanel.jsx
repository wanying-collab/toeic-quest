export default function ProgressPanel({
  stats,
  levelRoadmap,
  currentLevel,
  targetLevel,
  onGoalChange,
  dueReviewCount,
  phaseTwoRoadmap,
}) {
  const accuracyCards = [
    { label: "單字正確率", value: stats.vocabularyAccuracy },
    { label: "聽力正確率", value: stats.listeningAccuracy },
    { label: "文法正確率", value: stats.grammarAccuracy },
    { label: "閱讀正確率", value: stats.readingAccuracy },
  ];

  return (
    <section className="page-stack">
      <div className="card-grid two-col">
        <div className="content-card">
          <div className="section-heading">
            <h2>學習等級</h2>
            <p>你現在不需要和別人比，只要知道自己有沒有比上週更穩。</p>
          </div>
          <div className="metric-card large">
            <span>目前推估落點</span>
            <strong>{stats.estimatedScore} 分</strong>
            <p>{currentLevel.badge}</p>
          </div>
          <div className="level-button-grid">
            {levelRoadmap.map((level) => (
              <button
                key={level.id}
                type="button"
                className={`level-button ${targetLevel.id === level.id ? "is-active" : ""}`}
                onClick={() => onGoalChange(level.id)}
              >
                <span>{level.title}</span>
                <strong>{level.badge}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="content-card">
          <div className="section-heading">
            <h2>進度總覽</h2>
            <p>先看最實際的四件事：正確率、XP、待複習、掌握數。</p>
          </div>
          <div className="metric-grid">
            <div className="metric-card">
              <span>XP</span>
              <strong>{stats.xp}</strong>
            </div>
            <div className="metric-card">
              <span>待複習</span>
              <strong>{dueReviewCount}</strong>
            </div>
            <div className="metric-card">
              <span>錯題總數</span>
              <strong>{stats.totalMistakes}</strong>
            </div>
            <div className="metric-card">
              <span>目標差距</span>
              <strong>{Math.max(targetLevel.score - stats.estimatedScore, 0)} 分</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="section-heading">
          <h2>各區表現</h2>
          <p>如果哪一區最低，下一輪任務就優先補那一區。</p>
        </div>
        <div className="accuracy-list">
          {accuracyCards.map((card) => (
            <div key={card.label} className="accuracy-row">
              <div className="accuracy-label">
                <span>{card.label}</span>
                <strong>{card.value}%</strong>
              </div>
              <div className="progress-shell">
                <div className="progress-fill" style={{ width: `${card.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="content-card accent-card">
        <div className="section-heading">
          <h2>第二階段擴充</h2>
          <p>第一版先把救援做穩，進階功能已經安排好下一步。</p>
        </div>
        <div className="roadmap-list">
          {phaseTwoRoadmap.map((item) => (
            <div key={item} className="roadmap-item">
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
