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
        const matchesEnglish =
          !normalizedEn || word.word.toLowerCase().includes(normalizedEn);
        const matchesChinese = !normalizedZh || word.meaning.includes(normalizedZh);
        const matchesCategory = category === "all" || word.category === category;
        const matchesLevel = level === "all" || word.level === level;
        const matchesPartOfSpeech =
          partOfSpeech === "all" || word.partOfSpeech === partOfSpeech;
        const matchesFrequency =
          frequency === "all" || String(word.frequency) === String(frequency);
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
        const matchesEnglish =
          !normalizedEn || phrase.phrase.toLowerCase().includes(normalizedEn);
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

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">TOEIC Vocabulary Bank</p>
          <h2>真正可搜尋、可篩選、可練習的大型單字庫</h2>
          <p className="hero-description">
            這一版不只是寫支援 6000+，而是網站現在真的有 7000 筆可顯示的字彙資料。
          </p>
        </div>
        <div className="metric-grid">
          <div className="metric-card">
            <span>Total Words</span>
            <strong>{words.length}</strong>
          </div>
          <div className="metric-card">
            <span>Filtered Words</span>
            <strong>{filteredWords.length}</strong>
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
            { id: "words", label: "單字庫" },
            { id: "phrases", label: "片語庫" },
            { id: "patterns", label: "句型庫" },
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
            搜尋英文
            <input
              value={searchEn}
              onChange={(event) => setSearchEn(event.target.value)}
              placeholder="例如 invoice / shipment / schedule"
            />
          </label>

          <label>
            搜尋中文
            <input
              value={searchZh}
              onChange={(event) => setSearchZh(event.target.value)}
              placeholder="例如 發票 / 庫存 / 會議"
            />
          </label>

          <label>
            類別
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">全部</option>
              {categories.map((item) => (
                <option key={item.id} value={item.label}>
                  {item.label} / {item.labelZh}
                </option>
              ))}
            </select>
          </label>

          <label>
            難度
            <select value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="all">全部</option>
              {levels.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            詞性
            <select value={partOfSpeech} onChange={(event) => setPartOfSpeech(event.target.value)}>
              <option value="all">全部</option>
              {partOfSpeechOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            頻率
            <select value={frequency} onChange={(event) => setFrequency(event.target.value)}>
              <option value="all">全部</option>
              {[5, 4, 3, 2, 1].map((item) => (
                <option key={item} value={item}>
                  {item} 星
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
            只看收藏
          </label>
        </div>
      </div>

      {tab === "words" && (
        <>
          <div className="quest-card">
            <div className="card-row">
              <strong>
                目前顯示 {visibleWords.length} / {filteredWords.length} 筆
              </strong>
              <span className="muted">
                為了避免一次渲染 7000 張卡片造成卡頓，頁面先顯示前幾筆，可再繼續載入。
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
                <span>還有 {filteredWords.length - visibleWords.length} 筆符合條件的單字</span>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => setVisibleCount((value) => value + VISIBLE_STEP)}
                >
                  再載入 60 筆
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "phrases" && (
        <div className="card-grid">
          {filteredPhrases.map((phrase) => (
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
      )}

      {tab === "patterns" && (
        <div className="card-grid">
          {filteredPatterns.map((pattern) => (
            <article key={pattern.id} className="quest-card resource-card">
              <div className="card-topline">
                <div>
                  <p className="eyebrow">
                    {pattern.category} / {pattern.difficulty.toUpperCase()}
                  </p>
                  <h3>{pattern.pattern}</h3>
                </div>
              </div>
              <p>{pattern.explanation}</p>
              <p className="word-example">{pattern.example}</p>
              <p className="word-example-zh">{pattern.exampleZh}</p>
              <div className="tip-box">
                <strong>解題提醒</strong>
                <p>{pattern.tip}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default VocabularyPage;
