import { useEffect, useMemo, useState } from "react";
import Dashboard from "./components/Dashboard";
import GrammarCoach from "./components/GrammarCoach";
import ListeningCoach from "./components/ListeningCoach";
import MistakeBook from "./components/MistakeBook";
import ProgressPanel from "./components/ProgressPanel";
import QuizPage from "./components/QuizPage";
import ReadingCoach from "./components/ReadingCoach";
import VocabularyPage from "./components/VocabularyPage";
import { grammarQuestions } from "./data/grammarQuestions";
import { listeningQuestions } from "./data/listeningQuestions";
import { readingQuestions } from "./data/readingQuestions";
import {
  dailyTasks,
  levelRoadmap,
  listeningKeywordTips,
  phaseTwoRoadmap,
  readingSteps,
  siteBranding,
} from "./data/tips";
import { vocabularyCategories, vocabularySeed } from "./data/vocabulary";

const STORAGE_KEY = "toeic-quest-progress-v1";
const DEFAULT_PAGE = "dashboard";
const VALID_PAGES = [
  "dashboard",
  "vocabulary",
  "quiz",
  "listening",
  "grammar",
  "reading",
  "mistakes",
  "progress",
];

const DEFAULT_STORE = {
  profile: {
    targetLevelId: 2,
    startingScore: 255,
  },
  vocabularyProgress: {},
  questionProgress: {},
  mistakes: {
    vocabulary: [],
    listening: [],
    grammar: [],
    reading: [],
  },
  history: [],
  xp: 0,
};

function readStoredState() {
  if (typeof window === "undefined") {
    return DEFAULT_STORE;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return DEFAULT_STORE;
    }
    const parsed = JSON.parse(saved);
    return {
      ...DEFAULT_STORE,
      ...parsed,
      profile: {
        ...DEFAULT_STORE.profile,
        ...parsed.profile,
      },
      mistakes: {
        ...DEFAULT_STORE.mistakes,
        ...parsed.mistakes,
      },
    };
  } catch (error) {
    return DEFAULT_STORE;
  }
}

function getPageFromHash() {
  if (typeof window === "undefined") {
    return DEFAULT_PAGE;
  }
  const hash = window.location.hash.replace("#", "");
  return VALID_PAGES.includes(hash) ? hash : DEFAULT_PAGE;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-TW", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function addDays(days) {
  const next = new Date();
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

function buildReviewState(previous, correct) {
  if (!correct) {
    return {
      correctStreak: 0,
      nextReviewDate: addDays(1),
      mastered: false,
    };
  }

  const nextStreak = (previous?.correctStreak ?? 0) + 1;

  if (nextStreak >= 4) {
    return {
      correctStreak: nextStreak,
      nextReviewDate: null,
      mastered: true,
    };
  }

  const gapDays = nextStreak === 1 ? 1 : nextStreak === 2 ? 3 : 7;
  return {
    correctStreak: nextStreak,
    nextReviewDate: addDays(gapDays),
    mastered: false,
  };
}

function getAccuracy(entries) {
  if (!entries.length) {
    return 0;
  }
  const correctCount = entries.filter((item) => item.correct).length;
  return Math.round((correctCount / entries.length) * 100);
}

function estimateScore(stats) {
  if (!stats.totalAnswers) {
    return 255;
  }

  const score =
    255 +
    (stats.vocabularyAccuracy / 100) * 60 +
    (stats.listeningAccuracy / 100) * 120 +
    (stats.grammarAccuracy / 100) * 80 +
    (stats.readingAccuracy / 100) * 100 +
    Math.min(50, stats.learnedWords * 0.25) +
    Math.min(65, stats.masteredWords * 0.8);

  return Math.max(255, Math.min(730, Math.round(score)));
}

function getLevelByScore(score) {
  return (
    levelRoadmap
      .filter((level) => score >= level.score)
      .slice(-1)[0] ?? levelRoadmap[0]
  );
}

function buildStats(store, vocabulary) {
  const history = store.history;
  const byType = {
    vocabulary: history.filter((item) => item.type === "vocabulary"),
    listening: history.filter((item) => item.type === "listening"),
    grammar: history.filter((item) => item.type === "grammar"),
    reading: history.filter((item) => item.type === "reading"),
  };

  const learnedWords = vocabulary.filter(
    (word) => (word.totalAttempts ?? 0) > 0
  ).length;
  const masteredWords = vocabulary.filter((word) => word.mastered).length;
  const favoriteWords = vocabulary.filter((word) => word.isFavorite).length;
  const totalMistakes = Object.values(store.mistakes).reduce(
    (sum, items) => sum + items.length,
    0
  );

  const stats = {
    vocabularyAccuracy: getAccuracy(byType.vocabulary),
    listeningAccuracy: getAccuracy(byType.listening),
    grammarAccuracy: getAccuracy(byType.grammar),
    readingAccuracy: getAccuracy(byType.reading),
    learnedWords,
    masteredWords,
    favoriteWords,
    totalMistakes,
    xp: store.xp,
    totalAnswers: history.length,
  };

  return {
    ...stats,
    estimatedScore: estimateScore(stats),
  };
}

function getTodayProgress(history) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayItems = history.filter((item) => item.timestamp.startsWith(todayKey));
  return todayItems.reduce(
    (accumulator, item) => {
      accumulator[item.type] = (accumulator[item.type] ?? 0) + 1;
      return accumulator;
    },
    { vocabulary: 0, listening: 0, grammar: 0, reading: 0 }
  );
}

function getSuggestion(stats, dueReviewCount) {
  if (dueReviewCount > 0) {
    return `先把今天到期的 ${dueReviewCount} 個複習題做完，穩定記憶會比一直加新題更有效。`;
  }
  if (stats.vocabularyAccuracy < 65) {
    return "先回單字測驗，把基礎商務字和中文意思穩穩配對。";
  }
  if (stats.listeningAccuracy < 65) {
    return "先去聽力教練練 Where / When / Who，方向抓對分數就會起來。";
  }
  if (stats.grammarAccuracy < 65) {
    return "回文法區先補主詞動詞、時態和介系詞，這幾題最值得先拿。";
  }
  if (stats.readingAccuracy < 65) {
    return "去閱讀教練練短句找關鍵字，先習慣先看題目再找答案。";
  }
  return "可以把難度拉到 normal，開始往 470 綠色挑戰前進。";
}

function isReviewDue(item) {
  return Boolean(
    item?.nextReviewDate &&
      !item?.mastered &&
      new Date(item.nextReviewDate) <= new Date()
  );
}

export default function App() {
  const [store, setStore] = useState(readStoredState);
  const [currentPage, setCurrentPage] = useState(getPageFromHash);
  const [practiceTarget, setPracticeTarget] = useState(null);

  const vocabulary = useMemo(() => {
    return vocabularySeed.map((word) => ({
      ...word,
      ...store.vocabularyProgress[word.id],
    }));
  }, [store.vocabularyProgress]);

  const stats = useMemo(() => buildStats(store, vocabulary), [store, vocabulary]);
  const todayProgress = useMemo(() => getTodayProgress(store.history), [store.history]);
  const dueReviewCount = useMemo(() => {
    const wordDue = Object.values(store.vocabularyProgress).filter(isReviewDue).length;
    const questionDue = Object.values(store.questionProgress).filter(isReviewDue).length;
    return wordDue + questionDue;
  }, [store.vocabularyProgress, store.questionProgress]);

  const currentLevel = useMemo(
    () => getLevelByScore(stats.estimatedScore),
    [stats.estimatedScore]
  );
  const targetLevel =
    levelRoadmap.find((level) => level.id === store.profile.targetLevelId) ?? levelRoadmap[1];
  const suggestion = getSuggestion(stats, dueReviewCount);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    function handleHashChange() {
      setCurrentPage(getPageFromHash());
    }

    window.addEventListener("hashchange", handleHashChange);
    if (!window.location.hash) {
      window.location.hash = `#${DEFAULT_PAGE}`;
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.title = `${siteBranding.name} | ${siteBranding.subtitle}`;
  }, []);

  function navigate(page) {
    window.location.hash = `#${page}`;
  }

  function speakText(text) {
    if (!text || typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function updateGoal(levelId) {
    setStore((previous) => ({
      ...previous,
      profile: {
        ...previous.profile,
        targetLevelId: levelId,
      },
    }));
  }

  function toggleFavorite(wordId) {
    setStore((previous) => {
      const current = previous.vocabularyProgress[wordId] ?? {};
      return {
        ...previous,
        vocabularyProgress: {
          ...previous.vocabularyProgress,
          [wordId]: {
            ...current,
            isFavorite: !current.isFavorite,
          },
        },
      };
    });
  }

  function recordAnswer(entry) {
    const timestamp = new Date().toISOString();

    setStore((previous) => {
      const nextHistory = [
        ...previous.history,
        {
          type: entry.type,
          correct: entry.correct,
          title: entry.title,
          timestamp,
        },
      ].slice(-500);

      const questionKey = `${entry.type}:${entry.sourceId}`;
      const existingQuestionProgress = previous.questionProgress[questionKey] ?? {};
      const nextQuestionReview = buildReviewState(
        existingQuestionProgress,
        entry.correct
      );

      let nextVocabularyProgress = previous.vocabularyProgress;
      if (entry.relatedWordId) {
        const existingWordProgress = previous.vocabularyProgress[entry.relatedWordId] ?? {};
        const nextWordReview = buildReviewState(existingWordProgress, entry.correct);
        nextVocabularyProgress = {
          ...previous.vocabularyProgress,
          [entry.relatedWordId]: {
            ...existingWordProgress,
            ...nextWordReview,
            totalAttempts: (existingWordProgress.totalAttempts ?? 0) + 1,
            totalCorrect:
              (existingWordProgress.totalCorrect ?? 0) + (entry.correct ? 1 : 0),
            wrongCount:
              (existingWordProgress.wrongCount ?? 0) + (entry.correct ? 0 : 1),
            lastPracticedAt: timestamp,
          },
        };
      }

      const nextMistakes = { ...previous.mistakes };
      if (!entry.correct) {
        const bucket = [...(nextMistakes[entry.type] ?? [])];
        const itemId = `${entry.type}-${entry.sourceId}`;
        const existingIndex = bucket.findIndex((item) => item.id === itemId);
        const nextItem = {
          id: itemId,
          title: entry.title,
          prompt: entry.prompt,
          userAnswer: entry.userAnswer,
          correctAnswer: entry.correctAnswer,
          whyWrong: entry.whyWrong,
          wrongCount:
            existingIndex >= 0 ? bucket[existingIndex].wrongCount + 1 : 1,
          lastPracticedAt: formatDate(timestamp),
          route: entry.route,
          sourceId: entry.sourceId,
          relatedWordId: entry.relatedWordId ?? null,
          quizMode: entry.quizMode ?? null,
          difficulty: entry.difficulty ?? "easy",
        };

        if (existingIndex >= 0) {
          bucket[existingIndex] = nextItem;
        } else {
          bucket.unshift(nextItem);
        }

        nextMistakes[entry.type] = bucket.slice(0, 60);
      }

      return {
        ...previous,
        vocabularyProgress: nextVocabularyProgress,
        questionProgress: {
          ...previous.questionProgress,
          [questionKey]: {
            ...existingQuestionProgress,
            ...nextQuestionReview,
            lastPracticedAt: timestamp,
          },
        },
        mistakes: nextMistakes,
        history: nextHistory,
        xp: previous.xp + (entry.correct ? 12 : 4),
      };
    });
  }

  function handleRetry(item) {
    setPracticeTarget(item);
    navigate(item.route);
  }

  function clearPracticeTarget() {
    setPracticeTarget(null);
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "vocabulary", label: "Vocabulary" },
    { id: "quiz", label: "Quiz" },
    { id: "listening", label: "Listening Coach" },
    { id: "grammar", label: "Grammar Coach" },
    { id: "reading", label: "Reading Coach" },
    { id: "mistakes", label: "Mistake Book" },
    { id: "progress", label: "Progress" },
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="eyebrow">Every Word Counts</span>
          <h1>{siteBranding.name}</h1>
          <p>{siteBranding.subtitle}</p>
        </div>
        <div className="topbar-meta">
          <span>Repo: {siteBranding.repository}</span>
          <a href={siteBranding.pagesUrl} target="_blank" rel="noreferrer">
            GitHub Pages 路徑
          </a>
        </div>
      </header>

      <nav className="main-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-button ${currentPage === item.id ? "is-active" : ""}`}
            onClick={() => navigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="page-wrap">
        {currentPage === "dashboard" ? (
          <Dashboard
            branding={siteBranding}
            todayProgress={todayProgress}
            stats={stats}
            currentLevel={currentLevel}
            targetLevel={targetLevel}
            onGoalChange={updateGoal}
            dueReviewCount={dueReviewCount}
            suggestion={suggestion}
            phaseTwoRoadmap={phaseTwoRoadmap}
          />
        ) : null}

        {currentPage === "vocabulary" ? (
          <VocabularyPage
            vocabulary={vocabulary}
            categories={vocabularyCategories}
            onToggleFavorite={toggleFavorite}
            onSpeak={speakText}
          />
        ) : null}

        {currentPage === "quiz" ? (
          <QuizPage
            vocabulary={vocabulary}
            listeningQuestions={listeningQuestions}
            onSpeak={speakText}
            onRecordAnswer={recordAnswer}
            practiceTarget={practiceTarget}
            onPracticeHandled={clearPracticeTarget}
          />
        ) : null}

        {currentPage === "listening" ? (
          <ListeningCoach
            keywordTips={listeningKeywordTips}
            questions={listeningQuestions}
            onSpeak={speakText}
            onRecordAnswer={recordAnswer}
            practiceTarget={practiceTarget}
            onPracticeHandled={clearPracticeTarget}
          />
        ) : null}

        {currentPage === "grammar" ? (
          <GrammarCoach
            questions={grammarQuestions}
            onRecordAnswer={recordAnswer}
            practiceTarget={practiceTarget}
            onPracticeHandled={clearPracticeTarget}
          />
        ) : null}

        {currentPage === "reading" ? (
          <ReadingCoach
            questions={readingQuestions}
            readingSteps={readingSteps}
            onRecordAnswer={recordAnswer}
            practiceTarget={practiceTarget}
            onPracticeHandled={clearPracticeTarget}
          />
        ) : null}

        {currentPage === "mistakes" ? (
          <MistakeBook mistakes={store.mistakes} onRetry={handleRetry} />
        ) : null}

        {currentPage === "progress" ? (
          <ProgressPanel
            stats={stats}
            levelRoadmap={levelRoadmap}
            currentLevel={currentLevel}
            targetLevel={targetLevel}
            onGoalChange={updateGoal}
            dueReviewCount={dueReviewCount}
            phaseTwoRoadmap={phaseTwoRoadmap}
          />
        ) : null}
      </main>

      <footer className="app-footer">
        <p>{siteBranding.mission}</p>
        <p>
          今日任務設定：
          {dailyTasks.map((task) => task.label).join(" / ")}
        </p>
      </footer>
    </div>
  );
}
