function StrategyCenter({ sections }) {
  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">TOEIC Strategy Center</p>
          <h2>Part 1 到 Part 7 解題技巧中心</h2>
          <p className="hero-description">
            這裡不是死背理論，而是把考場上真的要用的判斷順序整理給你。
          </p>
        </div>
      </div>

      <div className="card-grid">
        {sections.map((section) => (
          <article key={section.id} className="quest-card resource-card">
            <p className="eyebrow">{section.part}</p>
            <h3>{section.title}</h3>
            <p>{section.focus}</p>
            <div className="bullet-box">
              <strong>解題步驟</strong>
              <ul>
                {section.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
            <div className="bullet-box">
              <strong>常見陷阱</strong>
              <ul>
                {section.traps.map((trap) => (
                  <li key={trap}>{trap}</li>
                ))}
              </ul>
            </div>
            <div className="tip-box">
              <strong>快速提醒</strong>
              <p>{section.quickWin}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StrategyCenter;
