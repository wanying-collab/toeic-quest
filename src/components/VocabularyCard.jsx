export default function VocabularyCard({ word, onSpeak, onToggleFavorite }) {
  return (
    <article className={`vocabulary-card ${word.mastered ? "is-mastered" : ""}`}>
      <div className="vocabulary-top">
        <div>
          <div className="title-row">
            <h3>{word.word}</h3>
            <button
              type="button"
              className={`favorite-button ${word.isFavorite ? "is-favorite" : ""}`}
              onClick={() => onToggleFavorite(word.id)}
              aria-label={word.isFavorite ? "取消收藏" : "加入收藏"}
            >
              {word.isFavorite ? "★" : "☆"}
            </button>
          </div>
          <p className="word-meaning">{word.meaning}</p>
        </div>
        <button type="button" className="ghost-button" onClick={() => onSpeak(word.word)}>
          播放發音
        </button>
      </div>

      <div className="badge-row">
        <span className="badge badge-blue">{word.category}</span>
        <span className="badge badge-mint">{word.difficulty}</span>
        <span className="badge badge-sand">{word.level}</span>
      </div>

      <div className="word-meta">
        <span>{word.partOfSpeech}</span>
        <span>{word.pronunciation}</span>
        <span>{"★".repeat(word.frequency)}</span>
      </div>

      <div className="example-box">
        <p>{word.example}</p>
        <small>{word.exampleZh}</small>
      </div>

      <div className="collocation-box">
        {word.collocations.map((phrase) => (
          <span key={phrase} className="soft-chip">
            {phrase}
          </span>
        ))}
      </div>

      <div className="word-footer">
        <span>錯誤次數：{word.wrongCount ?? 0}</span>
        <span>{word.mastered ? "已掌握" : "持續練習中"}</span>
      </div>
    </article>
  );
}
