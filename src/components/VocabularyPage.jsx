import { useEffect, useMemo, useState } from "react";
import VocabularyCard from "./VocabularyCard";

const INITIAL_VISIBLE = 48;
const VISIBLE_STEP = 48;

function matchesTheme(word, themeId, themes) {
  if (themeId === "all") {
    return true;
  }

  const theme = themes.find((item) => item.id === themeId);
  if (!theme) {
    return true;
  }

  const haystack = [
    word.word,
    word.meaning,
    word.category,
    word.theme,
    ...(word.collocations ?? []),
    ...(word.relatedWords ?? []),
    ...(word.wordFamily ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return (
    word.theme === theme.label ||
    theme.categories.includes(word.category) ||
    theme.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))
  );
}

function VocabularyPage({
  words,
  phrases,
  patterns,
  categories,
  levels,
  themes,
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
  const [themeId, setThemeId] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const normalizedEn = searchEn.trim().toLowerCase();
  const normalizedZh = searchZh.trim();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const dueReviewSet = useMemo(
    () =>
      new Set(
        Object.entries(wordProgress)
          .filter(([, value]) => value.nextReviewAt && value.nextReviewAt <= new Date().toISOString().slice(0, 10))
          .map(([key]) => key),
      ),
    [wordProgress],
  );

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [tab, searchEn, searchZh, category, level, partOfSpeech, frequency, favoritesOnly, themeId]);

  const partOfSpeechOptions = useMemo(
    () => [...new Set(words.map((item) => item.partOfSpeech))].sort(),
    [words],
  );

  const themeCards = useMemo(
    () =>
      themes.map((theme) => ({
        ...theme,
        total: words.filter((word) => matchesTheme(word, theme.id, themes)).length,
      })),
    [themes, words],
  );

  const filteredWords = useMemo(() => {
    const result = words.filter((word) => {
      const matchesEnglish = !normalizedEn || word.word.toLowerCase().includes(normalizedEn);
      const matchesChinese = !normalizedZh || word.meaning.includes(normalizedZh);
      const matchesCategory = category === "all" || word.category === category;
      const matchesLevel = level === "all" || word.level === level;
      const matchesPartOfSpeech = partOfSpeech === "all" || word.partOfSpeech === partOfSpeech;
      const matchesFrequency = frequency === "all" || String(word.frequency) === String(frequency);
      const matchesFavorite = !favoritesOnly || favoriteSet.has(word.id);
      const matchesSelectedTheme = matchesTheme(word, themeId, themes);

      return (
        matchesEnglish &&
        matchesChinese &&
        matchesCategory &&
        matchesLevel &&
        matchesPartOfSpeech &&
        matchesFrequency &&
        matchesFavorite &&
        matchesSelectedTheme
      );
    });

    return result.sort((left, right) => {
      const leftDue = dueReviewSet.has(left.id) ? 1 : 0;
      const rightDue = dueReviewSet.has(right.id) ? 1 : 0;

      if (leftDue !== rightDue) {
        return rightDue - leftDue;
      }

      const leftFavorite = favoriteSet.has(left.id) ? 1 : 0;
      const rightFavorite = favoriteSet.has(right.id) ? 1 : 0;

      if (leftFavorite !== rightFavorite) {
        return rightFavorite - leftFavorite;
      }

      if (left.frequency !== right.frequency) {
        return right.frequency - left.frequency;
      }

      return left.word.localeCompare(right.word);
    });
  }, [
    words,
    normalizedEn,
    normalizedZh,
    category,
    level,
    partOfSpeech,
    frequency,
    favoritesOnly,
    favoriteSet,
    themeId,
    themes,
    dueReviewSet,
  ]);

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
  const dueReviewCount = dueReviewSet.size;
  const visibleWords = filteredWords.slice(0, visibleCount);
  const visiblePhrases = filteredPhrases.slice(0, visibleCount);
  const visiblePatterns = filteredPatterns.slice(0, visibleCount);
  const activeTheme = themeCards.find((item) => item.id === themeId) ?? null;

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Vocabulary Bank</p>
          <h2>把單字學成會用、會聽、會記得的系統</h2>
          <p className="hero-description">
            先看單字，按發音，讀例句，看搭配詞，再做題目，最後交給間隔複習幫你記住。
          </p>
          <div className="flow-strip">
            {["單字", "發音", "例句", "搭配詞", "做題", "複習"].map((step) => (
              <span key={step} className="pill">
                {step}
              </span>
            ))}
          </div>
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
          <div className="metric-card">
            <span>Due Review</span>
            <strong>{dueReviewCount}</strong>
          </div>
        </div>
      </div>

      {tab === "words" && (
        <div className="track-grid">
          {themeCards.map((theme) => (
            <article key={theme.id} className="quest-card track-card">
              <p className="eyebrow">Theme Study</p>
              <h3>{theme.label}</h3>
              <p>{theme.description}</p>
              <div className="hero-badges">
                {theme.keywords.slice(0, 4).map((keyword) => (
                  <span key={keyword} className="pill">
                    {keyword}
                  </span>
                ))}
              </div>
              <div className="card-row">
                <span className="muted">
                  {theme.total.toLocaleString()} words / 推薦先學 {Math.min(theme.total, theme.starterSize)}
                </span>
                <button
                  type="button"
                  className={`primary-button ${themeId === theme.id ? "is-selected" : ""}`}
                  onClick={() => setThemeId(theme.id)}
                >
                  {themeId === theme.id ? "目前主題" : "進入主題"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "words" && activeTheme && (
        <div className="quest-card">
          <div className="card-row">
            <div>
              <strong>目前主題：{activeTheme.label}</strong>
              <p className="muted">{activeTheme.description}</p>
            </div>
            <button type="button" className="secondary-button" onClick={() => setThemeId("all")}>
              清除主題
            </button>
          </div>
        </div>
      )}

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
              placeholder="inventory / shipment / schedule"
            />
          </label>

          <label>
            Search Chinese
            <input
              value={searchZh}
              onChange={(event) => setSearchZh(event.target.value)}
              placeholder="搜尋中文意思"
            />
          </label>

          <label>
            Theme
            <select value={themeId} onChange={(event) => setThemeId(event.target.value)}>
              <option value="all">All Themes</option>
              {themeCards.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All</option>
              {categories.map((item) => (
                <option key={item.id} value={item.label}>
                  {item.label}
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
                  {item} stars
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
                目前顯示 {visibleWords.length.toLocaleString()} / {filteredWords.length.toLocaleString()} 個單字
              </strong>
              <span className="muted">
                已依照複習優先、收藏、頻率排序，讓你先學最值得學的字。
              </span>
            </div>
          </div>

          <div className="card-grid">
            {visibleWords.map((word) => (
              <VocabularyCard
                key={word.id}
                word={word}
                isFavorite={favoriteSet.has(word.id)}
                progress={wordProgress[word.id]}
                onToggleFavorite={onToggleFavorite}
                onSpeak={onSpeak}
              />
            ))}
          </div>

          {visibleCount < filteredWords.length && (
            <div className="quest-card">
              <div className="card-row">
                <span>還有 {(filteredWords.length - visibleWords.length).toLocaleString()} 個單字可繼續載入</span>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => setVisibleCount((value) => value + VISIBLE_STEP)}
                >
                  Load More
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
                  <button type="button" className="secondary-button" onClick={() => onSpeak(phrase.phrase)}>
                    🔊
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
                <span>還有 {(filteredPhrases.length - visiblePhrases.length).toLocaleString()} 個片語</span>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => setVisibleCount((value) => value + VISIBLE_STEP)}
                >
                  Load More
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
                  <button type="button" className="secondary-button" onClick={() => onSpeak(pattern.example)}>
                    🔊
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
                <span>還有 {(filteredPatterns.length - visiblePatterns.length).toLocaleString()} 個句型</span>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => setVisibleCount((value) => value + VISIBLE_STEP)}
                >
                  Load More
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
