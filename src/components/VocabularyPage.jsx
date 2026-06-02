import { useMemo, useState } from "react";
import { difficultyOptions, levelOptions } from "../data/vocabulary";
import VocabularyCard from "./VocabularyCard";

function isDueReview(word) {
  if (!word.nextReviewDate || word.mastered) {
    return false;
  }

  return new Date(word.nextReviewDate) <= new Date();
}

export default function VocabularyPage({
  vocabulary,
  categories,
  onToggleFavorite,
  onSpeak,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [level, setLevel] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [dueOnly, setDueOnly] = useState(false);

  const filteredWords = useMemo(() => {
    return vocabulary.filter((word) => {
      const matchSearch =
        !search ||
        word.word.toLowerCase().includes(search.toLowerCase()) ||
        word.meaning.includes(search);
      const matchCategory = category === "all" || word.category === category;
      const matchDifficulty = difficulty === "all" || word.difficulty === difficulty;
      const matchLevel = level === "all" || word.level === level;
      const matchFavorite = !favoritesOnly || word.isFavorite;
      const matchDue = !dueOnly || isDueReview(word);
      return (
        matchSearch &&
        matchCategory &&
        matchDifficulty &&
        matchLevel &&
        matchFavorite &&
        matchDue
      );
    });
  }, [vocabulary, search, category, difficulty, level, favoritesOnly, dueOnly]);

  return (
    <section className="page-stack">
      <div className="content-card">
        <div className="section-heading">
          <h2>基礎單字庫</h2>
          <p>先收進最常用的商務與生活 TOEIC 基礎字，格式已預留未來擴充到 1000+。</p>
        </div>

        <div className="filter-grid">
          <label className="field">
            <span>搜尋</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="輸入英文或中文"
            />
          </label>
          <label className="field">
            <span>分類</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">全部分類</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>難度</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              <option value="all">全部難度</option>
              {difficultyOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>證書層級</span>
            <select value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="all">全部層級</option>
              {levelOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="toggle-row">
          <label className="toggle-chip">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={() => setFavoritesOnly((value) => !value)}
            />
            只看收藏
          </label>
          <label className="toggle-chip">
            <input
              type="checkbox"
              checked={dueOnly}
              onChange={() => setDueOnly((value) => !value)}
            />
            只看到期複習
          </label>
          <span className="result-note">目前顯示 {filteredWords.length} 個單字</span>
        </div>
      </div>

      <div className="vocabulary-grid">
        {filteredWords.map((word) => (
          <VocabularyCard
            key={word.id}
            word={word}
            onSpeak={onSpeak}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}
