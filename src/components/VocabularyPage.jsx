import { useEffect, useMemo, useState } from "react";
import VocabularyCard from "./VocabularyCard";

const INITIAL_VISIBLE = 60;
const VISIBLE_STEP = 60;

function VocabularyPage({
  words,
  phrases,
  patterns,
  categories,
  levels,
  favoriteIds,
  wordProgress,
  onToggleFavorite,
  onSpeak,
}) {
  const [tab, setTab] = useState("words");
  const [searchEn, setSearchEn] = useState("");
  const [searchZh, setSearchZh] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [partOfSpeech, setPartOfSpeech] = useState("all");
  const [frequency, setFrequency] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const normalizedEn = searchEn.trim().toLowerCase();
  const normalizedZh = searchZh.trim();

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [tab, searchEn, searchZh, category, level, partOfSpeech, frequency, favoritesOnly]);

  const partOfSpeechOptions = useMemo(
    () => [...new Set(words.map((item) => item.partOfSpeech))].sort(),
    [words],
  );

  const filteredWords = useMemo(
    () =>
      words.filter((word) => {
        const matchesEnglish = !normalizedEn || word.word.toLowerCase().includes(normalizedEn);
        const matchesChinese = !normalizedZh || word.meaning.includes(normalizedZh);
        const matchesCategory = category === "all" || word.category === category;
        const matchesLevel = level === "all" || word.level === level;
        const matchesPartOfSpeech = partOfSpeech === "all" || word.partOfSpeech === partOfSpeech;
        const matchesFrequency = frequency === "all" || String(word.frequency) === String(frequency);
        const matchesFavorite = !favoritesOnly || favoriteIds.includes(word.id);

        return (
          matchesEnglish &&
          matchesChinese &&
          matchesCategory &&
          matchesLevel &&
          matchesPartOfSpeech &&
          matchesFrequency &&
          matchesFavorite
        );
      }),
    [
      words,
      normalizedEn,
      normalizedZh,
      category,
      level,
      partOfSpeech,
      frequency,
      favoritesOnly,
      favoriteIds,
    ],
  );

  const filteredPhrases = useMemo(
    () =>
      phrases.filter((phrase) => {
        const matchesEnglish = !normalizedEn || phrase.phrase.toLowerCase().includes(normalizedEn);
        const matchesChinese = !normalizedZh || phrase.meaning.includes(normalizedZh);
        const matchesCategory = category === "all" || phrase.category === category;
        return matchesEnglish && matchesChinese && matchesCategory;
      }),
    [phrases, normalizedEn, normalizedZh, category],
  );

  const filteredPatterns = useMemo(
    () =>
      patterns.filter((pattern) => {
        const matchesEnglish =
          !normalizedEn ||
          pattern.pattern.toLowerCase().includes(normalizedEn) ||
          pattern.example.toLowerCase().includes(normalizedEn);
        const matchesChinese =
          !normalizedZh ||
          pattern.explanation.includes(normalizedZh) ||
          pattern.exampleZh.includes(normalizedZh);
        const matchesLevel = level === "all" || pattern.difficulty === level;
        return matchesEnglish && matchesChinese && matchesLevel;
      }),
    [patterns, normalizedEn, normalizedZh, level],
  );

  const masteredCount = Object.values(wordProgress).filter((item) => item.mastered).length;
  const visibleWords = filteredWords.slice(0, visibleCount);
  const visiblePhrases = filteredPhrases.slice(0, visibleCount);
  const visiblePatterns = filteredPatterns.slice(0, visibleCount);

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Vocabulary Bank</p>
          <h2>Build vocabulary, phrases, and patterns together</h2>
          <p className="hero-description">
            TOEIC Quest is not just a word list. Study vocabulary, business phrases, and sentence patterns in one connected bank.
          </p>
        </div>
        <div className="metric-grid">
          <div className="metric-card">
            <span>Total Words</span>
            <strong>{words.length.toLocaleString()}</strong>
          </div>
          <div className="metric-card">
            <span>Filtered Words</span>
            <strong>{filteredWords.length.toLocaleString()}</strong>
          </div>
          <div className="metric-card">
            <span>Favorites</span>
            <strong>{favoriteIds.length}</strong>
          </div>
          <div className="metric-card">
            <span>Mastered</span>
            <strong>{masteredCount}</strong>
          </div>
        </div>
      </div>

      <div className="filter-bar quest-card">
        <div className="tabs">
          {[
            { id: "words", label: `Words (${words.length.toLocaleString()})` },
            { id: "phrases", label: `Phrases (${phrases.length.toLocaleString()})` },
            { id: "patterns", label: `Patterns (${patterns.length.toLocaleString()})` },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={`tab-button ${tab === item.id ? "active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="filter-grid">
          <label>
            Search English
            <input
              value={searchEn}
              onChange={(event) => setSearchEn(event.target.value)}
              placeholder="invoice / shipment / benchmark"
            />
          </label>

          <label>
            Search Chinese
            <input
              value={searchZh}
              onChange={(event) => setSearchZh(event.target.value)}
              placeholder="發票 / 物流 / 庫存"
            />
          </label>

          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All</option>
              {categories.map((item) => (
                <option key={item.id} value={item.label}>
                  {item.label} / {item.labelZh}
                </option>
              ))}
            </select>
          </label>

          <label>
            Level
            <select value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="all">All</option>
              {levels.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Part of Speech
            <select value={partOfSpeech} onChange={(event) => setPartOfSpeech(event.target.value)}>
              <option value="all">All</option>
              {partOfSpeechOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Frequency
            <select value={frequency} onChange={(event) => setFrequency(event.target.value)}>
              <option value="all">All</option>
              {[5, 4, 3, 2, 1].map((item) => (
                <option key={item} value={item}>
                  {item} star
                </option>
              ))}
            </select>
          </label>

          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(event) => setFavoritesOnly(event.target.checked)}
            />
            Favorites only
          </label>
        </div>
      </div>

      {tab === "words" && (
        <>
          <div className="quest-card">
            <div className="card-row">
              <strong>
                Showing {visibleWords.length.toLocaleString()} / {filteredWords.length.toLocaleString()} words
              </strong>
              <span className="muted">
                Large lists are revealed in batches so search and scrolling stay fast.
              </span>
            </div>
          </div>

          <div className="card-grid">
            {visibleWords.map((word) => (
              <VocabularyCard
                key={word.id}
                word={word}
                isFavorite={favoriteIds.includes(word.id)}
                progress={wordProgress[word.id]}
                onToggleFavorite={onToggleFavorite}
                onSpeak={onSpeak}
              />
            ))}
          </div>

          {visibleCount < filteredWords.length && (
            <div className="quest-card">
              <div className="card-row">
                <span>{(filteredWords.length - visibleWords.length).toLocaleString()} more words available</span>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => setVisibleCount((value) => value + VISIBLE_STEP)}
                >
                  Load 60 More
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "phrases" && (
        <>
        <div className="card-grid">
          {visiblePhrases.map((phrase) => (
            <article key={phrase.id} className="quest-card resource-card">
              <div className="card-topline">
                <div>
                  <p className="eyebrow">{phrase.category}</p>
                  <h3>{phrase.phrase}</h3>
                </div>
                <button type="button" className="icon-button" onClick={() => onSpeak(phrase.phrase)}>
                  ▶
                </button>
              </div>
              <p className="word-meaning">{phrase.meaning}</p>
              <p>{phrase.tip}</p>
              <p className="word-example">{phrase.example}</p>
              <p className="word-example-zh">{phrase.exampleZh}</p>
            </article>
          ))}
        </div>
        {visibleCount < filteredPhrases.length && (
          <div className="quest-card">
            <div className="card-row">
              <span>{(filteredPhrases.length - visiblePhrases.length).toLocaleString()} more phrases available</span>
              <button
                type="button"
                className="primary-button"
                onClick={() => setVisibleCount((value) => value + VISIBLE_STEP)}
              >
                Load 60 More
              </button>
            </div>
          </div>
        )}
        </>
      )}

      {tab === "patterns" && (
        <>
        <div className="card-grid">
          {visiblePatterns.map((pattern) => (
            <article key={pattern.id} className="quest-card resource-card">
              <div className="card-topline">
                <div>
                  <p className="eyebrow">
                    {pattern.category} / {pattern.difficulty.toUpperCase()}
                  </p>
                  <h3>{pattern.pattern}</h3>
                </div>
                <button type="button" className="icon-button" onClick={() => onSpeak(pattern.example)}>
                  ▶
                </button>
              </div>
              <p>{pattern.explanation}</p>
              <p className="word-example">{pattern.example}</p>
              <p className="word-example-zh">{pattern.exampleZh}</p>
              <div className="tip-box">
                <strong>Quick tip</strong>
                <p>{pattern.tip}</p>
              </div>
            </article>
          ))}
        </div>
        {visibleCount < filteredPatterns.length && (
          <div className="quest-card">
            <div className="card-row">
              <span>{(filteredPatterns.length - visiblePatterns.length).toLocaleString()} more patterns available</span>
              <button
                type="button"
                className="primary-button"
                onClick={() => setVisibleCount((value) => value + VISIBLE_STEP)}
              >
                Load 60 More
              </button>
            </div>
          </div>
        )}
        </>
      )}
    </section>
  );
}

export default VocabularyPage;
