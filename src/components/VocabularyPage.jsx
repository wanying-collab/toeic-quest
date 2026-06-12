import { useState } from "react";
import VocabularyCard from "./VocabularyCard";

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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredWords = words.filter((word) => {
    const matchesSearch =
      !normalizedSearch ||
      word.word.toLowerCase().includes(normalizedSearch) ||
      word.meaning.includes(normalizedSearch) ||
      word.category.toLowerCase().includes(normalizedSearch);
    const matchesCategory = category === "all" || word.category === category;
    const matchesLevel = level === "all" || word.level === level;
    const matchesFavorite = !favoritesOnly || favoriteIds.includes(word.id);

    return matchesSearch && matchesCategory && matchesLevel && matchesFavorite;
  });

  const filteredPhrases = phrases.filter((phrase) => {
    const matchesSearch =
      !normalizedSearch ||
      phrase.phrase.toLowerCase().includes(normalizedSearch) ||
      phrase.meaning.includes(normalizedSearch) ||
      phrase.category.toLowerCase().includes(normalizedSearch);
    const matchesCategory = category === "all" || phrase.category === category;
    return matchesSearch && matchesCategory;
  });

  const filteredPatterns = patterns.filter((pattern) => {
    const matchesSearch =
      !normalizedSearch ||
      pattern.pattern.toLowerCase().includes(normalizedSearch) ||
      pattern.example.toLowerCase().includes(normalizedSearch) ||
      pattern.category.includes(normalizedSearch);
    const matchesLevel = level === "all" || pattern.difficulty === level;
    return matchesSearch && matchesLevel;
  });

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">TOEIC Vocabulary Bank</p>
          <h2>單字、片語、句型一起學</h2>
          <p className="hero-description">
            先用 300+ 高頻單字打底，再用片語與句型把閱讀和聽力接起來。
          </p>
        </div>
        <div className="hero-badges">
          <span className="stat-chip">{words.length} 個單字範例</span>
          <span className="stat-chip">{phrases.length} 個片語範例</span>
          <span className="stat-chip">{patterns.length} 個句型範例</span>
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
            搜尋
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="輸入英文、中文、分類"
            />
          </label>

          <label>
            分類
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
        <div className="card-grid">
          {filteredWords.map((word) => (
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
