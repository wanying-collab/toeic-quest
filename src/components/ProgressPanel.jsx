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

function ProgressPanel({ stats, levels, achievements, weakCategories, reviewQueue }) {
  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Progress</p>
          <h2>學習進度與分數預測</h2>
          <p className="hero-description">
            看見自己目前在哪一關、還差多少、接下來要補哪一塊，會比硬撐更有效率。
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="quest-card">
          <div className="section-heading">
            <h3>核心數據</h3>
            <p>把每天的練習轉成分數感。</p>
          </div>
          <div className="metric-grid">
            <div className="metric-card">
              <span>預估分數</span>
              <strong>{stats.predictedScore}</strong>
            </div>
            <div className="metric-card">
              <span>預估區間</span>
              <strong>
                {stats.predictedRange[0]} - {stats.predictedRange[1]}
              </strong>
            </div>
            <div className="metric-card">
              <span>已掌握單字</span>
              <strong>{stats.masteredWords}</strong>
            </div>
            <div className="metric-card">
              <span>待複習單字</span>
              <strong>{stats.dueReviewCount}</strong>
            </div>
          </div>

          <div className="stack-gap">
            <ProgressBar label="聽力" value={stats.accuracy.listening} />
            <ProgressBar label="閱讀" value={stats.accuracy.reading} />
            <ProgressBar label="文法" value={stats.accuracy.grammar} />
          </div>
        </article>

        <article className="quest-card">
          <div className="section-heading">
            <h3>階段地圖</h3>
            <p>255 到藍色證書的升級路線。</p>
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
      </div>

      <div className="dashboard-grid">
        <article className="quest-card">
          <div className="section-heading">
            <h3>AI 弱點分析</h3>
            <p>最近最需要補強的主題。</p>
          </div>
          {weakCategories.length === 0 ? (
            <p>目前資料還不多，再做幾題後這裡會開始指出你最弱的主題。</p>
          ) : (
            <div className="stack-gap">
              {weakCategories.map((item) => (
                <div key={item.category} className="tip-box">
                  <strong>{item.category}</strong>
                  <p>最近錯誤 {item.wrongCount} 次</p>
                  <p>{item.advice}</p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="quest-card">
          <div className="section-heading">
            <h3>間隔複習</h3>
            <p>先複習快忘掉的內容，比一直刷新題更划算。</p>
          </div>
          {reviewQueue.length === 0 ? (
            <p>目前沒有到期複習項目。繼續做題，系統會自動安排下一次複習。</p>
          ) : (
            <div className="stack-gap">
              {reviewQueue.slice(0, 8).map((item) => (
                <div key={item.key} className="review-item">
                  <strong>{item.label}</strong>
                  <p>
                    下次複習：{new Date(item.nextReviewAt).toLocaleDateString("zh-TW")} / 連續答對{" "}
                    {item.consecutiveCorrect} 次
                  </p>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>

      <article className="quest-card">
        <div className="section-heading">
          <h3>成就與動力</h3>
          <p>讓進步有被看見的感覺。</p>
        </div>
        <div className="badge-grid">
          {achievements.map((badge) => (
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

export default ProgressPanel;
