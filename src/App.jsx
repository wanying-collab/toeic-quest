import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import VocabularyPage from "./components/VocabularyPage";
import QuizPage from "./components/QuizPage";
import ListeningCoach from "./components/ListeningCoach";
import GrammarCoach from "./components/GrammarCoach";
import ReadingCoach from "./components/ReadingCoach";
import MistakeBook from "./components/MistakeBook";
import ProgressPanel from "./components/ProgressPanel";
import StrategyCenter from "./components/StrategyCenter";
import {
  APP_COPY,
  BADGES,
  DAILY_TASKS,
  GRAMMAR_GUIDES,
  KEYWORD_GUIDES,
  LISTENING_TRAPS,
  QUEST_LEVELS,
  READING_LADDER,
} from "./data/tips";
import {
  vocabularyBank,
  vocabularyCategories,
  vocabularyLevels,
} from "./data/vocabulary";
import { phraseBank } from "./data/phraseBank";
import { sentencePatterns } from "./data/sentencePatterns";
import { listeningLevels, listeningQuestions } from "./data/listeningQuestions";
import { grammarQuestions, grammarTopics } from "./data/grammarQuestions";
import { readingQuestions } from "./data/readingQuestions";
import { strategySections } from "./data/strategyCenter";

const STORAGE_KEY = "toeic-quest-state-v3";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "vocabulary", label: "單字庫" },
  { id: "quiz", label: "單字測驗" },
  { id: "listening", label: "聽力訓練" },
  { id: "grammar", label: "文法教學" },
  { id: "reading", label: "閱讀練習" },
  { id: "strategy", label: "技巧中心" },
  { id: "mistakes", label: "錯題本" },
  { id: "progress", label: "學習進度" },
];

const INITIAL_STATE = {
  favorites: [],
  xp: 0,
  streak: 0,
  lastStudyDate: "",
  checkIns: [],
  answerLog: [],
  mistakes: [],
  reviewMap: {},
  wordProgress: {},
};

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateKey, days) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getDate()).padStart(2, "0");
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

function diffDays(from, to) {
  const start = new Date(`${from}T00:00:00`).getTime();
  const end = new Date(`${to}T00:00:00`).getTime();
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function ensureDailyEngagement(state) {
  const today = getTodayKey();

  if (state.lastStudyDate === today && state.checkIns.includes(today)) {
    return state;
  }

  let nextStreak = 1;

  if (state.lastStudyDate) {
    nextStreak = diffDays(state.lastStudyDate, today) === 1 ? state.streak + 1 : 1;
  }

  return {
    ...state,
    streak: nextStreak,
    lastStudyDate: today,
    checkIns: Array.from(new Set([...state.checkIns, today])),
  };
}

function updateReviewEntry(previous = {}, label, correct) {
  const today = getTodayKey();
  const nextCorrect = correct ? (previous.consecutiveCorrect ?? 0) + 1 : 0;
  const consecutiveCorrect = Math.min(nextCorrect, 4);
  const mastered = correct && consecutiveCorrect >= 4;

  const nextReviewAt = correct
    ? mastered
      ? addDays(today, 14)
      : addDays(today, consecutiveCorrect === 1 ? 1 : consecutiveCorrect === 2 ? 3 : 7)
    : addDays(today, 1);

  return {
    label,
    consecutiveCorrect,
    correctCount: (previous.correctCount ?? 0) + (correct ? 1 : 0),
    wrongCount: (previous.wrongCount ?? 0) + (correct ? 0 : 1),
    mastered,
    nextReviewAt,
    lastPracticed: today,
  };
}

function getInitialPage() {
  const hash = window.location.hash.replace("#", "");
  return NAV_ITEMS.some((item) => item.id === hash) ? hash : "dashboard";
}

function buildStats(state) {
  const attempts = {
    vocabulary: 0,
    listening: 0,
    grammar: 0,
    reading: 0,
  };

  const correctCounts = {
    vocabulary: 0,
    listening: 0,
    grammar: 0,
    reading: 0,
  };

  const today = getTodayKey();
  const taskProgress = {
    vocabulary: 0,
    listening: 0,
    grammar: 0,
    reading: 0,
  };

  state.answerLog.forEach((item) => {
    if (attempts[item.domain] !== undefined) {
      attempts[item.domain] += 1;
      if (item.correct) {
        correctCounts[item.domain] += 1;
      }
      if (item.date === today) {
        taskProgress[item.domain] += 1;
      }
    }
  });

  const accuracy = {
    vocabulary: attempts.vocabulary ? correctCounts.vocabulary / attempts.vocabulary : 0,
    listening: attempts.listening ? correctCounts.listening / attempts.listening : 0,
    grammar: attempts.grammar ? correctCounts.grammar / attempts.grammar : 0,
    reading: attempts.reading ? correctCounts.reading / attempts.reading : 0,
  };

  const percentages = Object.fromEntries(
    Object.entries(accuracy).map(([key, value]) => [key, Math.round(value * 100)]),
  );

  const learnedWords = Object.values(state.wordProgress).filter((item) => item.correctCount > 0).length;
  const masteredWords = Object.values(state.wordProgress).filter((item) => item.mastered).length;
  const dueReviewCount = Object.values(state.wordProgress).filter(
    (item) => !item.mastered && item.nextReviewAt && item.nextReviewAt <= today,
  ).length;

  const predictedScore = clamp(
    Math.round(
      255 +
        learnedWords * 0.45 +
        accuracy.listening * 155 +
        accuracy.reading * 140 +
        accuracy.grammar * 120 +
        Math.min(state.streak, 14) * 4,
    ),
    255,
    900,
  );

  return {
    attempts,
    accuracy,
    percentages,
    taskProgress,
    learnedWords,
    masteredWords,
    favoriteCount: state.favorites.length,
    mistakeCount: state.mistakes.length,
    dueReviewCount,
    predictedScore,
    predictedRange: [Math.max(255, predictedScore - 35), Math.min(990, predictedScore + 40)],
    totalAnswers: state.answerLog.length,
    xp: state.xp,
    streak: state.streak,
  };
}

function buildWeakCategories(mistakes) {
  const grouped = mistakes.reduce((accumulator, item) => {
    const category = item.category || "未分類";
    accumulator[category] = (accumulator[category] ?? 0) + item.wrongCount;
    return accumulator;
  }, {});

  return Object.entries(grouped)
    .map(([category, wrongCount]) => ({
      category,
      wrongCount,
      advice: `${category} 最近錯得比較多，建議先回到這個主題做 5 到 10 題集中練習。`,
    }))
    .sort((left, right) => right.wrongCount - left.wrongCount)
    .slice(0, 4);
}

function buildWeakInsight(stats, weakCategories) {
  const skillRanking = [
    { key: "listening", label: "聽力", value: stats.accuracy.listening },
    { key: "reading", label: "閱讀", value: stats.accuracy.reading },
    { key: "grammar", label: "文法", value: stats.accuracy.grammar },
  ].sort((left, right) => left.value - right.value);

  const weakestSkill = skillRanking[0];
  const topCategory = weakCategories[0];

  if (!weakestSkill || stats.totalAnswers === 0) {
    return {
      title: "先建立第一波資料",
      summary: "目前答題資料還不多，先做幾輪單字、聽力和文法，系統就會開始抓出弱點。",
      nextStep: "建議先完成今天的單字 20 個與聽力 10 題。",
    };
  }

  if (topCategory) {
    return {
      title: `${weakestSkill.label}需要優先補強`,
      summary: `最近整體最弱的是${weakestSkill.label}，而且 ${topCategory.category} 類題目錯得最多。`,
      nextStep: `下一步先做 ${topCategory.category} 類題目，再回來測一次 ${weakestSkill.label}。`,
    };
  }

  return {
    title: `${weakestSkill.label}需要優先補強`,
    summary: `目前 ${weakestSkill.label} 的正確率最低，先從這一項補起來最划算。`,
    nextStep: `先安排 10 題${weakestSkill.label}練習，練完再看錯題原因。`,
  };
}

function buildAchievements(stats) {
  return BADGES.map((badge) => ({
    ...badge,
    unlocked: badge.test(stats),
  }));
}

function getCurrentLevel(predictedScore) {
  return (
    QUEST_LEVELS.find(
      (level) => predictedScore >= level.minScore && predictedScore <= level.maxScore,
    ) ?? QUEST_LEVELS[0]
  );
}

function getNextTarget(predictedScore) {
  if (predictedScore < 350) {
    return {
      target: 350,
      advice: "先把單字聽熟，練會議、訂單、時間地點這些最常見短句。",
    };
  }
  if (predictedScore < 470) {
    return {
      target: 470,
      advice: "把關鍵疑問詞和 Part 2 問答題穩住，閱讀從短句升到短文。",
    };
  }
  if (predictedScore < 550) {
    return {
      target: 550,
      advice: "集中補綠色證書常見字與文法，開始練 Part 5 到 Part 7 定位。",
    };
  }
  return {
    target: 730,
    advice: "開始用長對話、通知、email 和 Part 7 題型把速度與穩定度拉上去。",
  };
}

function buildReviewQueue(wordProgress) {
  return Object.entries(wordProgress)
    .map(([key, value]) => ({
      key,
      ...value,
    }))
    .sort((left, right) => left.nextReviewAt.localeCompare(right.nextReviewAt));
}

function App() {
  const [page, setPage] = useState(getInitialPage);
  const [state, setState] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return INITIAL_STATE;
    }

    try {
      return { ...INITIAL_STATE, ...JSON.parse(saved) };
    } catch {
      return INITIAL_STATE;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const handleHashChange = () => {
      const next = getInitialPage();
      setPage(next);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const stats = buildStats(state);
  const weakCategories = buildWeakCategories(state.mistakes);
  const weakInsight = buildWeakInsight(stats, weakCategories);
  const achievements = buildAchievements(stats);
  const currentLevel = getCurrentLevel(stats.predictedScore);
  const nextTarget = getNextTarget(stats.predictedScore);
  const reviewQueue = buildReviewQueue(state.wordProgress);
  const checkedInToday = state.checkIns.includes(getTodayKey());

  const navigate = (nextPage) => {
    window.location.hash = nextPage;
    setPage(nextPage);
  };

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  const toggleFavorite = (wordId) => {
    setState((current) => ({
      ...current,
      favorites: current.favorites.includes(wordId)
        ? current.favorites.filter((item) => item !== wordId)
        : [...current.favorites, wordId],
    }));
  };

  const checkInToday = () => {
    setState((current) => ensureDailyEngagement(current));
  };

  const recordAnswer = ({
    domain,
    itemId,
    relatedWordId,
    category,
    prompt,
    correct,
    userAnswer,
    correctAnswer,
    explanationZh,
    reason,
  }) => {
    setState((current) => {
      const engaged = ensureDailyEngagement(current);
      const today = getTodayKey();
      const xpGain = correct ? 12 : 5;
      const reviewKey = `${domain}:${itemId}`;
      const label = relatedWordId
        ? vocabularyBank.find((item) => item.id === relatedWordId)?.word ?? prompt
        : prompt;

      const nextReviewMap = {
        ...engaged.reviewMap,
        [reviewKey]: updateReviewEntry(engaged.reviewMap[reviewKey], label, correct),
      };

      const nextWordProgress = relatedWordId
        ? {
            ...engaged.wordProgress,
            [relatedWordId]: updateReviewEntry(
              engaged.wordProgress[relatedWordId],
              vocabularyBank.find((item) => item.id === relatedWordId)?.word ?? label,
              correct,
            ),
          }
        : engaged.wordProgress;

      const nextMistakes = correct
        ? engaged.mistakes
        : (() => {
            const key = `${domain}:${itemId}`;
            const existing = engaged.mistakes.find((item) => item.key === key);
            if (existing) {
              return engaged.mistakes.map((item) =>
                item.key === key
                  ? {
                      ...item,
                      userAnswer,
                      correctAnswer,
                      reason,
                      wrongCount: item.wrongCount + 1,
                      lastPracticed: today,
                    }
                  : item,
              );
            }

            return [
              ...engaged.mistakes,
              {
                key,
                domain,
                itemId,
                prompt,
                userAnswer,
                correctAnswer,
                reason,
                wrongCount: 1,
                lastPracticed: today,
                category,
                explanationZh,
              },
            ];
          })();

      return {
        ...engaged,
        xp: engaged.xp + xpGain,
        answerLog: [
          ...engaged.answerLog.slice(-799),
          {
            domain,
            itemId,
            category,
            correct,
            date: today,
          },
        ],
        mistakes: nextMistakes,
        reviewMap: nextReviewMap,
        wordProgress: nextWordProgress,
      };
    });
  };

  const sharedPageProps = {
    onSpeak: speakText,
    onRecordAnswer: recordAnswer,
  };

  let pageContent = null;

  if (page === "dashboard") {
    pageContent = (
      <Dashboard
        appCopy={APP_COPY}
        dailyTasks={DAILY_TASKS}
        taskProgress={stats.taskProgress}
        stats={stats}
        currentLevel={currentLevel}
        nextTarget={nextTarget}
        weakInsight={weakInsight}
        achievements={achievements}
        onNavigate={navigate}
        onCheckIn={checkInToday}
        checkedInToday={checkedInToday}
      />
    );
  } else if (page === "vocabulary") {
    pageContent = (
      <VocabularyPage
        words={vocabularyBank}
        phrases={phraseBank}
        patterns={sentencePatterns}
        categories={vocabularyCategories}
        levels={vocabularyLevels}
        favoriteIds={state.favorites}
        wordProgress={state.wordProgress}
        onToggleFavorite={toggleFavorite}
        onSpeak={speakText}
      />
    );
  } else if (page === "quiz") {
    pageContent = <QuizPage words={vocabularyBank} levels={vocabularyLevels} {...sharedPageProps} />;
  } else if (page === "listening") {
    pageContent = (
      <ListeningCoach
        levels={listeningLevels}
        questions={listeningQuestions}
        keywordGuides={KEYWORD_GUIDES}
        trapGuides={LISTENING_TRAPS}
        {...sharedPageProps}
      />
    );
  } else if (page === "grammar") {
    pageContent = (
      <GrammarCoach
        questions={grammarQuestions}
        topics={grammarTopics}
        guides={GRAMMAR_GUIDES}
        onRecordAnswer={recordAnswer}
      />
    );
  } else if (page === "reading") {
    pageContent = (
      <ReadingCoach items={readingQuestions} ladder={READING_LADDER} onRecordAnswer={recordAnswer} />
    );
  } else if (page === "strategy") {
    pageContent = <StrategyCenter sections={strategySections} />;
  } else if (page === "mistakes") {
    pageContent = <MistakeBook mistakes={state.mistakes} onNavigate={navigate} />;
  } else if (page === "progress") {
    pageContent = (
      <ProgressPanel
        stats={stats}
        levels={QUEST_LEVELS}
        achievements={achievements}
        weakCategories={weakCategories}
        reviewQueue={reviewQueue}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">TQ</div>
          <div>
            <strong>{APP_COPY.title}</strong>
            <p>{APP_COPY.subtitle}</p>
          </div>
        </div>

        <div className="topbar-stats">
          <span>XP {stats.xp}</span>
          <span>Streak {stats.streak}</span>
          <span>估分 {stats.predictedScore}</span>
        </div>
      </header>

      <nav className="main-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-pill ${page === item.id ? "active" : ""}`}
            onClick={() => navigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main>{pageContent}</main>

      <footer className="app-footer">
        <p>{APP_COPY.motto}</p>
        <p>目前版本先以 255 起步救援為主，資料結構已預留擴充到 6000+ 單字、片語與進階題庫。</p>
      </footer>
    </div>
  );
}

export default App;
