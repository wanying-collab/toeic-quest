function renderStars(count) {
  return "★".repeat(Math.max(1, Math.min(5, count))) + "☆".repeat(Math.max(0, 5 - count));
}

function VocabularyCard({ word, isFavorite, progress, onToggleFavorite, onSpeak }) {
  const nextReviewText = progress?.nextReviewAt
    ? new Date(progress.nextReviewAt).toLocaleDateString("zh-TW")
    : "尚未安排";

  return (
    <article className="quest-card vocab-card">
      <div className="card-topline">
        <div>
          <p className="eyebrow">
            {word.theme} / {word.level.toUpperCase()}
          </p>
          <div className="vocab-title-row">
            <h3>{word.word}</h3>
            <button
              type="button"
              className="secondary-button"
              onClick={() => onSpeak(word.word)}
              aria-label={`Play pronunciation for ${word.word}`}
            >
              🔊
            </button>
          </div>
        </div>
        <button
          type="button"
          className={`secondary-button ${isFavorite ? "saved-button" : ""}`}
          onClick={() => onToggleFavorite(word.id)}
          aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
        >
          {isFavorite ? "已收藏" : "收藏"}
        </button>
      </div>

      <div className="vocab-detail-grid">
        <div className="detail-item">
          <span>中文</span>
          <strong>{word.meaning}</strong>
        </div>
        <div className="detail-item">
          <span>詞性</span>
          <strong>{word.partOfSpeech}</strong>
        </div>
        <div className="detail-item">
          <span>音標</span>
          <strong>{word.pronunciation}</strong>
        </div>
        <div className="detail-item">
          <span>TOEIC 頻率</span>
          <strong>{renderStars(word.frequency)}</strong>
        </div>
      </div>

      <div className="vocab-block">
        <strong>例句</strong>
        <p className="word-example">{word.example}</p>
      </div>

      <div className="vocab-block">
        <strong>翻譯</strong>
        <p className="word-example-zh">{word.exampleZh}</p>
      </div>

      <div className="vocab-block">
        <strong>常見搭配</strong>
        <div className="chip-list">
          {word.collocations.map((item) => (
            <span key={item} className="chip">
              {item}
            </span>
          ))}
        </div>
      </div>

      {word.synonyms?.length > 0 && (
        <div className="vocab-block">
          <strong>同義字</strong>
          <div className="chip-list">
            {word.synonyms.map((item) => (
              <span key={item} className="chip soft">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {word.relatedWords?.length > 0 && (
        <div className="vocab-block">
          <strong>相關字</strong>
          <div className="chip-list">
            {word.relatedWords.map((item) => (
              <span key={item} className="chip soft">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {word.wordFamily?.length > 0 && (
        <div className="vocab-block">
          <strong>Word Family</strong>
          <div className="chip-list">
            {word.wordFamily.map((item) => (
              <span key={item} className="chip family">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {word.roots?.length > 0 && (
        <div className="vocab-block">
          <strong>Roots & Prefixes</strong>
          <ul className="compact-list">
            {word.roots.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card-row stats-row">
        <span>錯誤次數 {progress?.wrongCount ?? 0}</span>
        <span>{progress?.mastered ? "已掌握" : `下次複習 ${nextReviewText}`}</span>
      </div>
    </article>
  );
}

export default VocabularyCard;
