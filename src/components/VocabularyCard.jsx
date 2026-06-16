function VocabularyCard({ word, isFavorite, progress, onToggleFavorite, onSpeak }) {
  const nextReviewText = progress?.nextReviewAt
    ? new Date(progress.nextReviewAt).toLocaleDateString("zh-TW")
    : "Not scheduled";

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
          aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
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
        <strong>Collocations</strong>
        <ul>
          {word.collocations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {word.synonyms?.length > 0 && (
        <div className="word-collocations">
          <strong>Synonyms</strong>
          <ul>
            {word.synonyms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {word.antonyms?.length > 0 && (
        <div className="word-collocations">
          <strong>Antonyms</strong>
          <ul>
            {word.antonyms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {word.roots?.length > 0 && (
        <div className="word-collocations">
          <strong>Roots / Prefixes</strong>
          <ul>
            {word.roots.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {word.wordFamily?.length > 0 && (
        <div className="word-collocations">
          <strong>Word Family</strong>
          <ul>
            {word.wordFamily.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card-row stats-row">
        <span>Wrong count {progress?.wrongCount ?? 0}</span>
        <span>{progress?.mastered ? "Mastered" : `Next review ${nextReviewText}`}</span>
      </div>

      <div className="card-actions">
        <button type="button" className="secondary-button" onClick={() => onSpeak(word.word)}>
          Play Pronunciation
        </button>
      </div>
    </article>
  );
}

export default VocabularyCard;
