function VocabularyCard({
  word,
  isFavorite,
  progress,
  onToggleFavorite,
  onSpeak,
}) {
  const nextReviewText = progress?.nextReviewAt
    ? new Date(progress.nextReviewAt).toLocaleDateString("zh-TW")
    : "尚未安排";

  return (
    <article className="quest-card vocab-card">
      <div className="card-topline">
        <div>
          <p className="eyebrow">
            {word.category} / {word.level.toUpperCase()}
          </p>
          <h3>{word.word}</h3>
        </div>
        <button
          type="button"
          className={`icon-button ${isFavorite ? "active" : ""}`}
          onClick={() => onToggleFavorite(word.id)}
          aria-label={isFavorite ? "取消收藏" : "加入收藏"}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      <div className="card-row">
        <span className="pill">{word.partOfSpeech}</span>
        <span className="muted">{word.pronunciation}</span>
      </div>

      <p className="word-meaning">{word.meaning}</p>
      <p className="word-example">{word.example}</p>
      <p className="word-example-zh">{word.exampleZh}</p>

      <div className="word-collocations">
        <strong>常見搭配</strong>
        <ul>
          {word.collocations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="card-row stats-row">
        <span>錯誤次數 {progress?.wrongCount ?? 0}</span>
        <span>{progress?.mastered ? "已掌握" : `下次複習 ${nextReviewText}`}</span>
      </div>

      <div className="card-actions">
        <button type="button" className="secondary-button" onClick={() => onSpeak(word.word)}>
          播放發音
        </button>
      </div>
    </article>
  );
}

export default VocabularyCard;
