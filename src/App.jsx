import { useEffect, useMemo, useState } from "react";
import Dashboard from "./components/Dashboard";
import VocabularyPage from "./components/VocabularyPage";
import QuizPage from "./components/QuizPage";
import ListeningCoach from "./components/ListeningCoach";
import GrammarCoach from "./components/GrammarCoach";
import ReadingCoach from "./components/ReadingCoach";
import SpeakingCoach from "./components/SpeakingCoach";
import MockExam from "./components/MockExam";
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
import { vocabularyBank, vocabularyCategories, vocabularyLevels } from "./data/vocabulary/index.js";
import { phraseBank } from "./data/phraseBank";
import { sentencePatterns } from "./data/sentencePatterns";
import { listeningLevels, listeningQuestions } from "./data/listeningQuestions";
import { grammarQuestions, grammarTopics } from "./data/grammarQuestions";
import { readingQuestions } from "./data/readingQuestions";
import { strategySections } from "./data/strategyCenter";
import { buildAdaptiveProfile } from "./utils/adaptive";

const STORAGE_KEY = "toeic-quest-state-v4";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "vocabulary", label: "Vocabulary" },
  { id: "quiz", label: "Quiz" },
  { id: "listening", label: "Listening" },
  { id: "grammar", label: "Grammar" },
  { id: "reading", label: "Reading" },
  { id: "speaking", label: "Speaking" },
  { id: "mock", label: "Mini Mock" },
  { id: "strategy", label: "Strategy" },
  { id: "mistakes", label: "Mistakes" },
  { id: "progress", label: "Progress" },
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
  mockTests: [],
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
    speaking: 0,
  };

  const correctCounts = {
    vocabulary: 0,
    listening: 0,
    grammar: 0,
    reading: 0,
    speaking: 0,
  };

  const today = getTodayKey();
  const taskProgress = {
    vocabulary: 0,
    listening: 0,
    reading: 0,
    speaking: 0,
  };

  state.answerLog.forEach((item) => {
    if (attempts[item.domain] !== undefined) {
      attempts[item.domain] += 1;
      if (item.correct) {
        correctCounts[item.domain] += 1;
      }
    }

    if (item.date === today && taskProgress[item.domain] !== undefined) {
      taskProgress[item.domain] += 1;
    }
  });

  const accuracy = {
    vocabulary: attempts.vocabulary ? correctCounts.vocabulary / attempts.vocabulary : 0,
    listening: attempts.listening ? correctCounts.listening / attempts.listening : 0,
    grammar: attempts.grammar ? correctCounts.grammar / attempts.grammar : 0,
    reading: attempts.reading ? correctCounts.reading / attempts.reading : 0,
    speaking: attempts.speaking ? correctCounts.speaking / attempts.speaking : 0,
  };

  const percentages = Object.fromEntries(
    Object.entries(accuracy).map(([key, value]) => [key, Math.round(value * 100)]),
  );

  const learnedWords = Object.values(state.wordProgress).filter((item) => item.correctCount > 0).length;
  const masteredWords = Object.values(state.wordProgress).filter((item) => item.mastered).length;
  const dueReviewCount = Object.values(state.wordProgress).filter(
    (item) => !item.mastered && item.nextReviewAt && item.nextReviewAt <= today,
  ).length;

  const latestMock = state.mockTests.at(-1) ?? null;
  const latestMockScore = latestMock?.score ?? 0;
  const vocabularyFactor = clamp(learnedWords / 2000, 0, 1);
  const masteryFactor = clamp(masteredWords / 1000, 0, 1);
  const practiceFactor = clamp(state.answerLog.length / 1500, 0, 1);
  const baseModel = Math.round(
    255 +
      vocabularyFactor * 220 +
      masteryFactor * 90 +
      practiceFactor * 55 +
      accuracy.listening * 170 +
      accuracy.reading * 135 +
      accuracy.grammar * 110 +
      accuracy.speaking * 65 +
      Math.min(state.streak, 30) * 3,
  );

  const predictedScore = clamp(
    latestMockScore
      ? Math.round(baseModel * 0.55 + latestMockScore * 0.45)
      : baseModel,
    255,
    990,
  );

  const rangePadding = latestMockScore ? 25 : 45;

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
    predictedRange: [Math.max(255, predictedScore - rangePadding), Math.min(990, predictedScore + rangePadding)],
    totalAnswers: state.answerLog.length,
    xp: state.xp,
    streak: state.streak,
    latestMockScore,
    latestMock,
  };
}

function buildWeakCategories(mistakes) {
  const grouped = mistakes.reduce((accumulator, item) => {
    const category = item.category || "General";
    accumulator[category] = (accumulator[category] ?? 0) + item.wrongCount;
    return accumulator;
  }, {});

  return Object.entries(grouped)
    .map(([category, wrongCount]) => ({
      category,
      wrongCount,
      advice: `Focus on ${category} vocabulary, listening, and reading for the next study block.`,
    }))
    .sort((left, right) => right.wrongCount - left.wrongCount)
    .slice(0, 4);
}

function buildWeakInsight(stats, weakCategories) {
  const skillRanking = [
    { key: "listening", label: "Listening", value: stats.accuracy.listening },
    { key: "reading", label: "Reading", value: stats.accuracy.reading },
    { key: "grammar", label: "Grammar", value: stats.accuracy.grammar },
    { key: "speaking", label: "Speaking", value: stats.accuracy.speaking },
  ].sort((left, right) => left.value - right.value);

  const weakestSkill = skillRanking[0];
  const topCategory = weakCategories[0];

  if (!weakestSkill || stats.totalAnswers === 0) {
    return {
      title: "Start your first study loop",
      summary: "Build a little history first. Once you answer more questions, TOEIC Quest can spot patterns in your weak areas.",
      nextStep: "Finish one block each of vocabulary, listening, reading, and speaking today.",
    };
  }

  if (topCategory) {
    return {
      title: `${weakestSkill.label} needs the most support`,
      summary: `Your recent mistakes suggest ${topCategory.category} is a weak area, especially when combined with ${weakestSkill.label.toLowerCase()} tasks.`,
      nextStep: `Do a focused ${topCategory.category} practice set and then revisit one ${weakestSkill.label.toLowerCase()} block.`,
    };
  }

  return {
    title: `${weakestSkill.label} is currently your lowest skill`,
    summary: `Your study history shows ${weakestSkill.label.toLowerCase()} is lagging behind the other skill areas.`,
    nextStep: `Do 10 more ${weakestSkill.label.toLowerCase()} questions before moving back to mixed practice.`,
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
      advice: "Stay with survival vocabulary, word listening, and short speaking shadowing until the basics feel automatic.",
    };
  }
  if (predictedScore < 470) {
    return {
      target: 470,
      advice: "Push question keywords, grammar basics, and short business passages every day.",
    };
  }
  if (predictedScore < 550) {
    return {
      target: 550,
      advice: "Stabilize Part 2, Part 5, and logistics or manufacturing vocabulary.",
    };
  }
  return {
    target: 730,
    advice: "Use more mixed listening, longer reading, speaking practice, and mock scores to move toward the blue badge.",
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
      setPage(getInitialPage());
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
  const adaptiveProfile = useMemo(
    () => buildAdaptiveProfile(state.answerLog, state.mistakes, state.reviewMap),
    [state.answerLog, state.mistakes, state.reviewMap],
  );

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

  const saveMockTest = (result) => {
    const payload =
      typeof result === "number"
        ? { score: result, date: new Date().toISOString() }
        : { ...result, date: result.date ?? new Date().toISOString() };

    setState((current) => ({
      ...ensureDailyEngagement(current),
      mockTests: [...current.mockTests, payload].slice(-20),
    }));
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
          ...engaged.answerLog.slice(-4999),
          {
            domain,
            itemId,
            category,
            correct,
            date: today,
            relatedWordId,
          },
        ],
        mistakes: nextMistakes,
        reviewMap: nextReviewMap,
        wordProgress: nextWordProgress,
      };
    });
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
        levels={QUEST_LEVELS}
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
    pageContent = (
      <QuizPage
        words={vocabularyBank}
        levels={vocabularyLevels}
        onSpeak={speakText}
        onRecordAnswer={recordAnswer}
        adaptiveProfile={adaptiveProfile}
      />
    );
  } else if (page === "listening") {
    pageContent = (
      <ListeningCoach
        levels={listeningLevels}
        questions={listeningQuestions}
        keywordGuides={KEYWORD_GUIDES}
        trapGuides={LISTENING_TRAPS}
        onSpeak={speakText}
        onRecordAnswer={recordAnswer}
        adaptiveProfile={adaptiveProfile}
      />
    );
  } else if (page === "grammar") {
    pageContent = (
      <GrammarCoach
        questions={grammarQuestions}
        topics={grammarTopics}
        guides={GRAMMAR_GUIDES}
        onRecordAnswer={recordAnswer}
        adaptiveProfile={adaptiveProfile}
      />
    );
  } else if (page === "reading") {
    pageContent = (
      <ReadingCoach
        items={readingQuestions}
        ladder={READING_LADDER}
        onRecordAnswer={recordAnswer}
        onSpeak={speakText}
        adaptiveProfile={adaptiveProfile}
      />
    );
  } else if (page === "speaking") {
    pageContent = (
      <SpeakingCoach
        words={vocabularyBank}
        patterns={sentencePatterns}
        onSpeak={speakText}
        onRecordAnswer={recordAnswer}
      />
    );
  } else if (page === "mock") {
    pageContent = (
      <MockExam
        listeningQuestions={listeningQuestions}
        grammarQuestions={grammarQuestions}
        readingQuestions={readingQuestions}
        onSpeak={speakText}
        onSaveMockTest={saveMockTest}
      />
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
        mockTests={state.mockTests}
        onSaveMockTest={saveMockTest}
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
          <span>TOEIC {stats.predictedScore}</span>
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
        <p>
          TOEIC Quest AI 2.0 now connects vocabulary, pronunciation, shadowing, listening, grammar,
          reading, speaking, and adaptive review into one study loop.
        </p>
      </footer>
    </div>
  );
}

export default App;
