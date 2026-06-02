import { dailyTasks, levelRoadmap } from "../data/tips";

function getTaskProgress(taskType, todayProgress) {
  const value = todayProgress[taskType] ?? 0;
  const task = dailyTasks.find((item) => item.type === taskType);
  if (!task) {
    return { value: 0, goal: 0, ratio: 0 };
  }

  return {
    value,
    goal: task.goal,
    ratio: Math.min(value / task.goal, 1),
  };
}

export default function Dashboard({
  branding,
  todayProgress,
  stats,
  currentLevel,
  targetLevel,
  onGoalChange,
  dueReviewCount,
  suggestion,
  phaseTwoRoadmap,
}) {
  const metricCards = [
    { label: "已練單字", value: `${stats.learnedWords} 個` },
    { label: "已掌握單字", value: `${stats.masteredWords} 個` },
    { label: "收藏單字", value: `${stats.favoriteWords} 個` },
    { label: "聽力正確率", value: `${stats.listeningAccuracy}%` },
    { label: "閱讀正確率", value: `${stats.readingAccuracy}%` },
    { label: "預估分數", value: `${stats.estimatedScore} 分` },
  ];

  return (
    <section className="page-stack">
      <div className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">TOEIC Rescue System</span>
          <h1>{branding.name}</h1>
          <p className="hero-subtitle">{branding.subtitle}</p>
          <div className="idea-row">
            {branding.ideas.map((idea) => (
              <span key={idea} className="idea-chip">
                {idea}
              </span>
            ))}
          </div>
          <p className="hero-description">{branding.mission}</p>
        </div>
        <div className="hero-score">
          <div className="score-bubble">
            <span>目前定位</span>
            <strong>{currentLevel.badge}</strong>
            <small>預估 {stats.estimatedScore} 分</small>
          </div>
          <div className="score-note">
            <span>今日待複習</span>
            <strong>{dueReviewCount} 項</strong>
          </div>
        </div>
      </div>

      <div className="card-grid two-col">
        <div className="content-card">
          <div className="section-heading">
            <h2>今日學習任務</h2>
            <p>先把量控制住，重點是每天都有完成。</p>
          </div>
          <div className="task-list">
            {dailyTasks.map((task) => {
              const progress = getTaskProgress(task.type, todayProgress);
              return (
                <div key={task.id} className="task-row">
                  <div>
                    <strong>{task.label}</strong>
                    <p>
                      已完成 {progress.value} / {progress.goal}
                    </p>
                  </div>
                  <div className="progress-shell">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress.ratio * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="content-card">
          <div className="section-heading">
            <h2>下一階段目標</h2>
            <p>先選你要衝到哪個里程碑，系統會用這個目標給你提醒。</p>
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
          <div className="goal-summary">
            <p>
              目前目標：<strong>{targetLevel.badge}</strong>
            </p>
            <p>
              距離目標還差 <strong>{Math.max(targetLevel.score - stats.estimatedScore, 0)} 分</strong>
            </p>
            <p>建議下一步：{suggestion}</p>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="section-heading">
          <h2>學習進度</h2>
          <p>先看最重要的幾個數字，知道自己是不是在往前走。</p>
        </div>
        <div className="metric-grid">
          {metricCards.map((card) => (
            <div key={card.label} className="metric-card">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="card-grid two-col">
        <div className="content-card">
          <div className="section-heading">
            <h2>升級路線</h2>
            <p>從 255 分開始，一步一步往綠色與藍色證書前進。</p>
          </div>
          <div className="roadmap-list">
            {levelRoadmap.map((level) => (
              <div
                key={level.id}
                className={`roadmap-item ${currentLevel.id >= level.id ? "is-cleared" : ""}`}
              >
                <strong>{level.badge}</strong>
                <p>{level.focus}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card accent-card">
          <div className="section-heading">
            <h2>第二階段預留</h2>
            <p>第一版先專注救援基礎，但後面的進階功能我已經預留入口。</p>
          </div>
          <div className="chip-list">
            {phaseTwoRoadmap.map((item) => (
              <span key={item} className="soft-chip">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
