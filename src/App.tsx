// tslint:disable
/* eslint-disable */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Play,
  RotateCw,
  HelpCircle,
  Volume2,
  VolumeX,
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  Share2,
  Menu as MenuIcon,
  X,
  Eye,
  Info,
  Sparkles,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import {getConfig, THEME} from './constants';
import BackgroundMusic from './utils/BackgroundMusic';
import {
  createFixedStepper,
  formatTime,
  GameState,
  MenuOverlay,
  prepareCanvas,
  useAssets,
  useAutoFocus,
  gameAudio,
  useIsMobile,
} from './utils/helper';
import {
  AI_MODELS,
  AIModel,
  ChallengeCategory,
  evaluateGuess,
  getDailyPuzzle,
  getDifficultyCandidatePool,
  getPreviousUTCDateKey,
  getRandomPuzzle,
  getUTCDateKey,
  GuessFeedback,
  VerifiedChallenge,
  VERIFIED_CHALLENGE_LIBRARY,
} from './aiModelsData';

const BACKGROUND_MUSIC_URL = 'assets/audio/bgm_synth_ambient.mp3';

// Public address appended to shared results. Keep in sync with the URLs in index.html.
const SHARE_URL = 'https://aidle-two.vercel.app';

const ASSETS_MANIFEST: Record<string, string> = {
  logo: '/images/app_logo_mark.png',
  trophy: '/images/icon_trophy_gold.png',
  chip: '/images/icon_ai_chip.png',
  flame: '/images/icon_streak_flame.png',
};

const PRACTICE_CATEGORIES: ('All Scenarios' | ChallengeCategory)[] = [
  'All Scenarios',
  'Relationships & Dating',
  'Apologies & Conflict',
  'Workplace Communication',
  'Everyday Messages',
  'Emotional Situations',
  'Personal & Professional Writing',
];

interface SessionStats {
  dailyPlayed: number;
  dailyWon: number;
  dailyStreak: number;
  maxDailyStreak: number;
  totalDailyScore: number;
  practicePlayed: number;
  practiceWon: number;
  guessDistribution: number[]; // Index 0-4 for guesses 1-5
  lastDailyDate: string | null;
}

interface DailyStateRecord {
  dateKey: string;
  puzzleId: string;
  targetModelId: string;
  guesses: GuessFeedback[];
  status: 'PLAYING' | 'VICTORY' | 'GAME_OVER';
  revealedHints: number;
  timeSpent: number;
  score: number;
  completed: boolean;
}

const DAILY_STATE_STORAGE_KEY = 'aidle_v3_daily_state';
const STATS_STORAGE_KEY = 'aidle_v3_verified_stats';
const RECENT_PRACTICE_KEY = 'aidle_recent_practice_ids';

// Safe storage wrapper with in-memory fallback for private browsing / blocked cookies
const memoryStorage = new Map<string, string>();
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {}
    return memoryStorage.get(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {}
    memoryStorage.set(key, value);
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {}
    memoryStorage.delete(key);
  },
};

// Resilient clipboard helper with textarea fallback
async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {}
  }
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (e) {
    return false;
  }
}

function getRecentPracticeIds(): string[] {
  try {
    const raw = safeStorage.getItem(RECENT_PRACTICE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

function recordRecentPracticeId(id: string) {
  try {
    const current = getRecentPracticeIds();
    const filtered = current.filter((item) => item !== id);
    filtered.push(id);
    const maxRetained = Math.max(1, VERIFIED_CHALLENGE_LIBRARY.length - 1);
    const trimmed = filtered.slice(-maxRetained);
    safeStorage.setItem(RECENT_PRACTICE_KEY, JSON.stringify(trimmed));
  } catch (e) {}
}

function loadDailyRecord(): DailyStateRecord | null {
  try {
    const raw = safeStorage.getItem(DAILY_STATE_STORAGE_KEY);
    if (raw) {
      const parsed: DailyStateRecord = JSON.parse(raw);
      if (parsed.dateKey === getUTCDateKey()) {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
}

function saveDailyRecord(record: DailyStateRecord) {
  try {
    safeStorage.setItem(DAILY_STATE_STORAGE_KEY, JSON.stringify(record));
  } catch (e) {}
}

interface ScoreBreakdown {
  baseScore: number;
  wrongPenalty: number;
  hintPenalty: number;
  timeBonus: number;
  totalScore: number;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepperRef = useRef<ReturnType<typeof createFixedStepper>>();
  const isMobile = useIsMobile();

  // --- ASSETS ---
  const {assets, isReady: assetsReady} = useAssets(ASSETS_MANIFEST);

  const canvasWidth = getConfig('baseCanvasWidth') as number;
  const canvasHeight = getConfig('baseCanvasHeight') as number;

  if (!stepperRef.current) {
    const stepMs = getConfig('stepMs');
    const maxSubSteps = getConfig('maxSubSteps');
    stepperRef.current = createFixedStepper(stepMs, maxSubSteps);
  }

  // --- GAME STATE ---
  const [gameState, setGameState] = useState<GameState>({
    status: 'START',
    score: 0,
    level: 1,
    timer: 0,
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Audio settings
  const [sfxMuted, setSfxMuted] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);

  // Overlay navigation states
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Check if player has seen the tutorial modal on initial launch
  useEffect(() => {
    try {
      const hasSeen = safeStorage.getItem('aidle_has_seen_tutorial');
      if (hasSeen !== 'true') {
        setIsHowToPlayOpen(true);
      }
    } catch (e) {}
  }, []);

  const closeHowToPlay = useCallback(() => {
    setIsHowToPlayOpen(false);
    try {
      safeStorage.setItem('aidle_has_seen_tutorial', 'true');
    } catch (e) {}
  }, []);

  // Midnight UTC rollover detection
  const [activeUtcDate, setActiveUtcDate] = useState<string>(() => getUTCDateKey());
  const [rolloverAvailableDate, setRolloverAvailableDate] = useState<string | null>(null);

  useEffect(() => {
    const checkRollover = () => {
      const latestUtc = getUTCDateKey();
      if (latestUtc !== activeUtcDate) {
        setRolloverAvailableDate(latestUtc);
        if (gameStateRef.current.status === 'START') {
          setActiveUtcDate(latestUtc);
          setRolloverAvailableDate(null);
        }
      }
    };

    const interval = setInterval(checkRollover, 15000);
    window.addEventListener('focus', checkRollover);
    document.addEventListener('visibilitychange', checkRollover);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkRollover);
      document.removeEventListener('visibilitychange', checkRollover);
    };
  }, [activeUtcDate]);

  // Post-game tab switcher ('analysis' | 'compare')
  const [postGameTab, setPostGameTab] = useState<'analysis' | 'compare'>('analysis');

  // Game Mode & Difficulty
  const [gameMode, setGameMode] = useState<'daily' | 'practice'>('daily');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedPracticeCategory, setSelectedPracticeCategory] = useState<'All Scenarios' | ChallengeCategory>('All Scenarios');
  const [currentPuzzle, setCurrentPuzzle] = useState<VerifiedChallenge>(() => getDailyPuzzle());

  // Gameplay Mechanics State
  const [guesses, setGuesses] = useState<GuessFeedback[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [activeCandidateFilter, setActiveCandidateFilter] = useState<string>('All');
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [shakeCard, setShakeCard] = useState(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [earnedScore, setEarnedScore] = useState<number>(0);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSubmittingRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());

  // Persistence Stats with strict Daily vs Practice separation
  const [stats, setStats] = useState<SessionStats>(() => {
    try {
      const saved = safeStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      const legacy = safeStorage.getItem('aidle_v2_stats');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        return {
          dailyPlayed: parsed.played || 0,
          dailyWon: parsed.won || 0,
          dailyStreak: parsed.streak || 0,
          maxDailyStreak: parsed.maxStreak || 0,
          totalDailyScore: parsed.totalScore || 0,
          practicePlayed: 0,
          practiceWon: 0,
          guessDistribution: parsed.guessDistribution || [0, 0, 0, 0, 0],
          lastDailyDate: parsed.lastDailyDate || null,
        };
      }
    } catch (e) {}
    return {
      dailyPlayed: 0,
      dailyWon: 0,
      dailyStreak: 0,
      maxDailyStreak: 0,
      totalDailyScore: 0,
      practicePlayed: 0,
      practiceWon: 0,
      guessDistribution: [0, 0, 0, 0, 0],
      lastDailyDate: null,
    };
  });

  const saveStats = (newStats: SessionStats) => {
    setStats(newStats);
    try {
      safeStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
    } catch (e) {}
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const maxGuessesAllowed = getConfig('maxGuesses') as number;

  // Candidate pool derived deterministically from the puzzle and difficulty tier
  // Easy: 4 models | Medium: 6 models | Hard: 8 models
  // In daily mode, difficulty is standardized to 'medium' (6 models benchmark)
  const candidatePool = useMemo(() => {
    const activeDiff = gameMode === 'daily' ? 'medium' : difficulty;
    return getDifficultyCandidatePool(currentPuzzle, activeDiff);
  }, [currentPuzzle, difficulty, gameMode]);

  // Filtered candidate list based on developer tabs
  const visibleCandidates = useMemo(() => {
    if (activeCandidateFilter === 'All') return candidatePool;
    if (activeCandidateFilter === 'Open-Source') {
      return candidatePool.filter(
        (m) =>
          m.tier === 'Open-Weight' ||
          m.developer === 'Meta' ||
          m.developer === 'DeepSeek' ||
          m.developer === 'Mistral',
      );
    }
    return candidatePool.filter((m) => m.developer === activeCandidateFilter);
  }, [candidatePool, activeCandidateFilter]);

  // Solved / eliminated model IDs
  const eliminatedModelIds = useMemo(() => {
    return new Set(guesses.map((g) => g.model.id));
  }, [guesses]);

  // Score Calculation based on difficulty multiplier, wrong guesses, hints used, & speed
  const calculateFinalScore = (
    triesTaken: number,
    durationSec: number,
    hintsCount: number = revealedHints,
    activeDiff: 'easy' | 'medium' | 'hard' = (gameMode === 'daily' ? 'medium' : difficulty),
  ): ScoreBreakdown => {
    let baseScore = getConfig('mediumBaseScore') as number;
    if (activeDiff === 'easy') baseScore = getConfig('easyBaseScore') as number;
    if (activeDiff === 'hard') baseScore = getConfig('hardBaseScore') as number;

    const penaltyPct = (getConfig('wrongGuessPenaltyPct') as number) / 100;
    const wrongGuesses = Math.max(0, triesTaken - 1);
    const wrongPenalty = Math.round(baseScore * wrongGuesses * penaltyPct);
    const scoreAfterPenalty = Math.max(50, baseScore - wrongPenalty);

    // Clue deduction:
    // Easy difficulty has 1 free unlocked clue.
    // Any extra manually revealed clues incur a 75-point deduction.
    const freeClues = activeDiff === 'easy' ? 1 : 0;
    const extraHints = Math.max(0, hintsCount - freeClues);
    const hintPenalty = extraHints * 75;

    const speedLimit = getConfig('timeBonusLimitSec') as number;
    let timeBonus = 0;
    if (durationSec <= speedLimit) {
      timeBonus = Math.round(((speedLimit - durationSec) / speedLimit) * 200);
    }

    const totalScore = Math.max(50, scoreAfterPenalty - hintPenalty + timeBonus);

    return {
      baseScore,
      wrongPenalty,
      hintPenalty,
      timeBonus,
      totalScore,
    };
  };

  // Start / Restart Game with comprehensive daily state preservation
  const initGame = useCallback(
    (
      mode: 'daily' | 'practice' = gameMode,
      diff: 'easy' | 'medium' | 'hard' = difficulty,
      category: 'All Scenarios' | ChallengeCategory = selectedPracticeCategory,
    ) => {
      // If currently playing in daily mode with in-progress guesses, preserve it first
      if (gameMode === 'daily' && guesses.length > 0 && gameState.status === 'PLAYING') {
        saveDailyRecord({
          dateKey: getUTCDateKey(),
          puzzleId: currentPuzzle.id,
          targetModelId: currentPuzzle.targetModelId,
          guesses,
          status: 'PLAYING',
          revealedHints,
          timeSpent,
          score: 0,
          completed: false,
        });
      }

      if (mode === 'daily') {
        const dailyPuzzle = getDailyPuzzle();
        const existingRecord = loadDailyRecord();

        setCurrentPuzzle(dailyPuzzle);
        setGameMode('daily');
        setDifficulty('medium'); // Standardized benchmark difficulty for daily mode
        setActiveCandidateFilter('All');
        setSelectedCandidateId(null);
        setIsGameMenuOpen(false);
        setIsHowToPlayOpen(false);
        setIsStatsOpen(false);
        setIsSystemInfoOpen(false);
        setPostGameTab('analysis');

        if (existingRecord) {
          // Restore saved daily state (completed or in-progress)
          setGuesses(existingRecord.guesses);
          setRevealedHints(existingRecord.revealedHints);
          setTimeSpent(existingRecord.timeSpent);
          setEarnedScore(existingRecord.score);

          setGameState({
            status: existingRecord.status,
            score: existingRecord.score,
            level: 1,
            timer: existingRecord.timeSpent,
          });

          if (existingRecord.completed) {
            triggerToast("Today's Daily Case already solved!");
          } else {
            triggerToast('Resumed in-progress Daily Case.');
          }
          return;
        }

        // Fresh daily challenge initialization
        isSubmittingRef.current = false;
        startTimeRef.current = Date.now();
        setGuesses([]);
        setRevealedHints(0);
        setTimeSpent(0);
        setEarnedScore(0);
        setScoreBreakdown(null);
        setShowToast(null);

        setGameState({
          status: 'PLAYING',
          score: 0,
          level: 1,
          timer: 0,
        });

        console.log('GAME_STARTED_DAILY');
        gameAudio.playPowerupChime();
      } else {
        // Practice mode initialization
        const puzzle = getRandomPuzzle(diff, category, currentPuzzle?.id);
        setCurrentPuzzle(puzzle);
        setGameMode('practice');
        setDifficulty(diff);
        setSelectedPracticeCategory(category);
        isSubmittingRef.current = false;
        startTimeRef.current = Date.now();
        setGuesses([]);
        setSelectedCandidateId(null);
        setActiveCandidateFilter('All');
        // Easy difficulty provides 1 high-signal clue unlocked from start
        setRevealedHints(diff === 'easy' ? 1 : 0);
        setTimeSpent(0);
        setEarnedScore(0);
        setScoreBreakdown(null);
        setShowToast(null);
        setPostGameTab('analysis');
        setIsGameMenuOpen(false);
        setIsHowToPlayOpen(false);
        setIsStatsOpen(false);
        setIsSystemInfoOpen(false);

        setGameState({
          status: 'PLAYING',
          score: 0,
          level: 2,
          timer: 0,
        });

        console.log('GAME_STARTED_PRACTICE');
        gameAudio.playPowerupChime();
      }
    },
    [gameMode, difficulty, selectedPracticeCategory, currentPuzzle, guesses, revealedHints, timeSpent, gameState.status],
  );

  // Reliable, comprehensive Restart / Reset handler
  const restartCurrentPuzzle = useCallback(() => {
    // 1. Release concurrency submission lock immediately
    isSubmittingRef.current = false;
    startTimeRef.current = Date.now();

    // 2. Clear interaction state and feedback
    setGuesses([]);
    setSelectedCandidateId(null);
    setScoreBreakdown(null);
    setEarnedScore(0);
    setShakeCard(false);
    setShowToast(null);
    setPostGameTab('analysis');
    setIsGameMenuOpen(false);

    // 3. Reset clues based on difficulty
    const activeDiff = gameMode === 'daily' ? 'medium' : difficulty;
    const initialHints = activeDiff === 'easy' ? 1 : 0;
    setRevealedHints(initialHints);

    // 4. Reset timer
    setTimeSpent(0);

    // 5. Update GameState to PLAYING with score: 0 and timer: 0
    setGameState((prev) => ({
      ...prev,
      status: 'PLAYING',
      score: 0,
      timer: 0,
      level: gameMode === 'daily' ? 1 : 2,
    }));

    // 6. Handle Daily vs Practice storage
    if (gameMode === 'daily') {
      const existing = loadDailyRecord();
      // If uncompleted or replay, clear the in-progress daily record so it doesn't reload old guesses
      if (!existing || !existing.completed) {
        saveDailyRecord({
          dateKey: getUTCDateKey(),
          puzzleId: currentPuzzle.id,
          targetModelId: currentPuzzle.targetModelId,
          guesses: [],
          status: 'PLAYING',
          revealedHints: initialHints,
          timeSpent: 0,
          score: 0,
          completed: false,
        });
      }
    }

    // 7. Audio & feedback
    gameAudio.playPowerupChime();
    triggerToast('Round restarted. Ready for your first guess!');
  }, [gameMode, difficulty, currentPuzzle]);

  // Timer Effect
  useEffect(() => {
    if (
      gameState.status === 'PLAYING' &&
      !isGameMenuOpen &&
      !isHowToPlayOpen &&
      !isStatsOpen &&
      !isSystemInfoOpen
    ) {
      timerIntervalRef.current = setInterval(() => {
        setTimeSpent((t) => {
          const next = t + 1;
          setGameState((prev) => ({...prev, timer: next}));
          return next;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState.status, isGameMenuOpen, isHowToPlayOpen, isStatsOpen, isSystemInfoOpen]);

  // Autoplay handler
  const hasAutoplayed = useRef(false);
  useEffect(() => {
    if (
      !hasAutoplayed.current &&
      new URLSearchParams(window.location.search).has('autoplay')
    ) {
      hasAutoplayed.current = true;
      initGame('daily', 'medium', 'All Scenarios');
    }
  }, [initGame]);

  // Submit Guess with concurrency lock & duplicate prevention
  const handleSubmitGuess = () => {
    if (
      isSubmittingRef.current ||
      !selectedCandidateId ||
      gameState.status !== 'PLAYING' ||
      guesses.length >= maxGuessesAllowed
    ) {
      return;
    }

    if (eliminatedModelIds.has(selectedCandidateId)) {
      gameAudio.playErrorBuzz();
      triggerToast('Model already evaluated.');
      return;
    }

    isSubmittingRef.current = true;
    try {
      const feedback = evaluateGuess(selectedCandidateId, currentPuzzle.targetModelId);
      const newGuesses = [...guesses, feedback];
      setGuesses(newGuesses);
      setSelectedCandidateId(null);

      const isWin = feedback.isCorrect;
      const isExhausted = newGuesses.length >= maxGuessesAllowed;

      if (isWin) {
        const breakdown = calculateFinalScore(newGuesses.length, timeSpent, revealedHints);
        setScoreBreakdown(breakdown);
        const finalScore = breakdown.totalScore;
        setEarnedScore(finalScore);

        // Leaderboard isolation: practice rounds do not pollute daily leaderboard
        setGameState((prev) => ({
          ...prev,
          status: 'VICTORY',
          score: gameMode === 'daily' ? finalScore : 0,
        }));
        console.log('SCORE_UPDATED', finalScore);
        gameAudio.playVictoryFanfare();

        const todayUtc = getUTCDateKey();
        const yesterdayUtc = getPreviousUTCDateKey(todayUtc, 1);

        if (gameMode === 'daily') {
          const isFirstDailyWinToday = stats.lastDailyDate !== todayUtc;
          let newDailyStreak = stats.dailyStreak;
          if (isFirstDailyWinToday) {
            // Consecutive day verification: increment streak if played yesterday or first game ever
            if (stats.lastDailyDate === yesterdayUtc || stats.lastDailyDate === null) {
              newDailyStreak = stats.dailyStreak + 1;
            } else {
              // Missed a day: reset streak to 1
              newDailyStreak = 1;
            }
          }

          const newDistribution = [...stats.guessDistribution];
          if (isFirstDailyWinToday && newGuesses.length <= 5) {
            newDistribution[newGuesses.length - 1] += 1;
          }

          const newStats: SessionStats = {
            ...stats,
            dailyPlayed: stats.dailyPlayed + (isFirstDailyWinToday ? 1 : 0),
            dailyWon: stats.dailyWon + (isFirstDailyWinToday ? 1 : 0),
            dailyStreak: newDailyStreak,
            maxDailyStreak: Math.max(stats.maxDailyStreak, newDailyStreak),
            totalDailyScore: stats.totalDailyScore + (isFirstDailyWinToday ? finalScore : 0),
            guessDistribution: newDistribution,
            lastDailyDate: todayUtc,
          };
          saveStats(newStats);

          saveDailyRecord({
            dateKey: todayUtc,
            puzzleId: currentPuzzle.id,
            targetModelId: currentPuzzle.targetModelId,
            guesses: newGuesses,
            status: 'VICTORY',
            revealedHints,
            timeSpent,
            score: finalScore,
            completed: true,
          });
        } else {
          // Practice mode updates practice stats without touching daily streak
          const newStats: SessionStats = {
            ...stats,
            practicePlayed: stats.practicePlayed + 1,
            practiceWon: stats.practiceWon + 1,
          };
          saveStats(newStats);
        }
      } else if (isExhausted) {
        setEarnedScore(0);
        setScoreBreakdown(null);
        setGameState((prev) => ({
          ...prev,
          status: 'GAME_OVER',
          score: 0,
        }));
        console.log('SCORE_UPDATED', 0);
        gameAudio.playDefeatMotif();
        setShakeCard(true);
        setTimeout(() => setShakeCard(false), 600);

        if (gameMode === 'daily') {
          const todayUtc = getUTCDateKey();
          const isFirstDailyAttemptToday = stats.lastDailyDate !== todayUtc;
          if (isFirstDailyAttemptToday) {
            const newStats: SessionStats = {
              ...stats,
              dailyPlayed: stats.dailyPlayed + 1,
              dailyStreak: 0, // Reset daily streak on failure
              lastDailyDate: todayUtc,
            };
            saveStats(newStats);
          }

          saveDailyRecord({
            dateKey: todayUtc,
            puzzleId: currentPuzzle.id,
            targetModelId: currentPuzzle.targetModelId,
            guesses: newGuesses,
            status: 'GAME_OVER',
            revealedHints,
            timeSpent,
            score: 0,
            completed: true,
          });
        } else {
          const newStats: SessionStats = {
            ...stats,
            practicePlayed: stats.practicePlayed + 1,
          };
          saveStats(newStats);
        }
      } else {
        gameAudio.playErrorBuzz();
        setShakeCard(true);
        setTimeout(() => setShakeCard(false), 500);

        const activeDiff = gameMode === 'daily' ? 'medium' : difficulty;
        const maxHintsForDifficulty = activeDiff === 'hard' ? 1 : 2;
        let nextHints = revealedHints;
        if (revealedHints < maxHintsForDifficulty) {
          nextHints = revealedHints + 1;
          setRevealedHints(nextHints);
          gameAudio.playHoverMicroTone();
          triggerToast('Clue unlocked.');
        }

        if (gameMode === 'daily') {
          saveDailyRecord({
            dateKey: getUTCDateKey(),
            puzzleId: currentPuzzle.id,
            targetModelId: currentPuzzle.targetModelId,
            guesses: newGuesses,
            status: 'PLAYING',
            revealedHints: nextHints,
            timeSpent,
            score: 0,
            completed: false,
          });
        }
      }
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleSubmitGuessRef = useRef(handleSubmitGuess);
  handleSubmitGuessRef.current = handleSubmitGuess;

  const visibleCandidatesRef = useRef(visibleCandidates);
  visibleCandidatesRef.current = visibleCandidates;

  const eliminatedModelIdsRef = useRef(eliminatedModelIds);
  eliminatedModelIdsRef.current = eliminatedModelIds;

  const selectedCandidateIdRef = useRef(selectedCandidateId);
  selectedCandidateIdRef.current = selectedCandidateId;

  // Accessible Keyboard Navigation & Global Modal Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Ignore if typing into any text input/textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // 2. Escape dismisses modals or toggles pause/menu
      if (e.key === 'Escape') {
        if (isHowToPlayOpen) {
          closeHowToPlay();
          gameAudio.playCrispClick();
          return;
        }
        if (isStatsOpen) {
          setIsStatsOpen(false);
          gameAudio.playCrispClick();
          return;
        }
        if (isSystemInfoOpen) {
          setIsSystemInfoOpen(false);
          gameAudio.playCrispClick();
          return;
        }
        if (isGameMenuOpen) {
          setIsGameMenuOpen(false);
          gameAudio.playCrispClick();
          return;
        }
        if (gameState.status === 'PLAYING') {
          setIsGameMenuOpen(true);
          gameAudio.playCrispClick();
          return;
        }
        return;
      }

      // 3. Disable in-game shortcuts if any modal/menu is active or game not in PLAYING
      if (
        isHowToPlayOpen ||
        isStatsOpen ||
        isSystemInfoOpen ||
        isGameMenuOpen ||
        gameState.status !== 'PLAYING'
      ) {
        return;
      }

      // 4. Number keys 1-8 select visible candidate models
      const keyNum = parseInt(e.key, 10);
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 8) {
        const pool = visibleCandidatesRef.current;
        const targetIndex = keyNum - 1;
        if (targetIndex < pool.length) {
          const candidate = pool[targetIndex];
          if (candidate) {
            e.preventDefault();
            if (eliminatedModelIdsRef.current.has(candidate.id)) {
              gameAudio.playErrorBuzz();
              triggerToast('Model already evaluated.');
            } else {
              setSelectedCandidateId(candidate.id);
              gameAudio.playHoverMicroTone();
            }
          }
        }
        return;
      }

      // 5. Enter submits the currently selected candidate
      if (e.key === 'Enter') {
        if (selectedCandidateIdRef.current) {
          e.preventDefault();
          handleSubmitGuessRef.current();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isHowToPlayOpen,
    isStatsOpen,
    isSystemInfoOpen,
    isGameMenuOpen,
    gameState.status,
    closeHowToPlay,
  ]);

  // Share Result to Clipboard with clean editorial Wordle format & fallback
  const handleShare = async () => {
    const todayNum = currentPuzzle.dateKey || getUTCDateKey();
    const totalTries =
      gameState.status === 'VICTORY'
        ? `${guesses.length}/${maxGuessesAllowed}`
        : `X/${maxGuessesAllowed}`;

    let gridString = '';
    guesses.forEach((g) => {
      if (g.isCorrect) {
        gridString += '🟩🟩🟩🟩\n';
      } else {
        const devChar = g.developerMatch === 'correct' ? '🟩' : '⬛';
        const tierChar = g.tierMatch === 'correct' ? '🟩' : '⬛';
        const yearChar = g.yearMatch === 'correct' ? '🟩' : '🟨';
        const ctxChar = g.contextMatch === 'correct' ? '🟩' : '🟨';
        gridString += `${devChar}${tierChar}${yearChar}${ctxChar}\n`;
      }
    });

    const activeDiff = gameMode === 'daily' ? 'medium' : difficulty;
    const modeLabel = gameMode === 'daily' ? 'Daily' : `Practice (${activeDiff.toUpperCase()})`;
    const shareText = `AIdle #${todayNum} • ${totalTries} guesses • Score: ${earnedScore}\nMode: ${modeLabel}\n\n${gridString.trim()}\nPlay at: ${SHARE_URL}`;

    const success = await copyToClipboard(shareText);
    if (success) {
      gameAudio.playCoinPickup();
      triggerToast('Copied to clipboard!');
    } else {
      triggerToast('Failed to copy to clipboard.');
    }
  };

  // Canvas Grain / Paper ruling background
  const draw = (ctx: CanvasRenderingContext2D) => {
    prepareCanvas(ctx, canvasWidth, canvasHeight);
    ctx.fillStyle = '#F8F7F3';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.save();
    ctx.strokeStyle = '#EFECE6';
    ctx.lineWidth = 1;
    for (let y = 48; y < canvasHeight; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) drawRef.current(ctx);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const isMusicPlaying =
    !['START', 'GAME_OVER', 'VICTORY'].includes(gameState.status) && !musicMuted;
  const targetModel =
    AI_MODELS.find((m) => m.id === currentPuzzle.targetModelId) || AI_MODELS[0];
  const primaryStartBtnRef = useAutoFocus<HTMLButtonElement>(gameState.status === 'START');

  const formattedUtcDate = useMemo(() => {
    return getUTCDateKey();
  }, []);

  const todayDailyRecord = useMemo(() => {
    return loadDailyRecord();
  }, [gameState.status]);

  const isDailyCompletedToday = todayDailyRecord?.completed === true;

  const activeDifficultyTier = gameMode === 'daily' ? 'medium' : difficulty;
  const maxAllowedClues = activeDifficultyTier === 'hard' ? 1 : 2;

  return (
    <div
      style={{
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
      className="fixed inset-0 overflow-hidden touch-none flex flex-col bg-[#F8F7F3] text-[#242424] select-none">
      {/* Editorial Web Fonts & Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif-masthead {
          font-family: 'Newsreader', Georgia, 'Merriweather', serif;
        }
        @keyframes subtleShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: subtleShake 0.4s ease-in-out;
        }
      `}</style>

      {/* Background Audio */}
      <BackgroundMusic
        url={BACKGROUND_MUSIC_URL}
        isPlaying={isMusicPlaying}
        isMuted={musicMuted}
      />

      {/* Canvas Paper Grain Background */}
      <div className="absolute inset-0 pointer-events-none opacity-60 z-0">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#242424] text-[#F8F7F3] px-4 py-2 rounded-md text-xs font-medium shadow-md flex items-center gap-2 transition-all">
          <Info size={14} className="text-[#E5E3DE]" />
          <span>{showToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDITORIAL HEADER (MAX 720PX CENTERED) */}
      {/* ========================================================================= */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#E5E3DE] z-20 shrink-0">
        <div className="max-w-[720px] mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Left: Wordmark & Tagline */}
          <div className="flex items-baseline gap-2.5">
            <h1
              onClick={() => {
                if (gameState.status !== 'START') {
                  gameAudio.playCrispClick();
                  setGameState((prev) => ({...prev, status: 'START'}));
                }
              }}
              className="font-serif-masthead font-bold text-2xl md:text-3xl tracking-tight text-[#242424] cursor-pointer hover:opacity-80 transition-opacity">
              AIdle
            </h1>
            <span className="hidden sm:inline text-[11px] uppercase tracking-wider text-[#777777] border-l border-[#E5E3DE] pl-2.5">
              Verified Everyday AI Deduction
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Quick Daily/Practice Switcher */}
            {gameState.status === 'PLAYING' && (
              <div className="hidden xs:flex items-center bg-[#F8F7F3] border border-[#E5E3DE] rounded p-0.5 text-xs mr-1">
                <button
                  onClick={() => {
                    gameAudio.playCrispClick();
                    initGame('daily');
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    gameMode === 'daily'
                      ? 'bg-[#FFFFFF] text-[#242424] shadow-sm font-semibold'
                      : 'text-[#777777] hover:text-[#242424]'
                  }`}>
                  Daily {isDailyCompletedToday && '✓'}
                </button>
                <button
                  onClick={() => {
                    gameAudio.playCrispClick();
                    initGame('practice', difficulty, selectedPracticeCategory);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    gameMode === 'practice'
                      ? 'bg-[#FFFFFF] text-[#242424] shadow-sm font-semibold'
                      : 'text-[#777777] hover:text-[#242424]'
                  }`}>
                  Practice
                </button>
              </div>
            )}

            {/* System Info / Verification Tooltip Button */}
            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setIsSystemInfoOpen(true);
              }}
              title="Verified Architecture & UTC Sync Info"
              className="px-2 py-1.5 rounded text-xs font-medium text-[#777777] hover:text-[#242424] hover:bg-[#F8F7F3] border border-transparent hover:border-[#E5E3DE] transition-colors flex items-center gap-1">
              <ShieldCheck size={15} className="text-[#477A60]" />
              <span className="hidden md:inline text-[11px]">UTC Sync</span>
            </button>

            {/* How to Play Button */}
            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setIsHowToPlayOpen(true);
              }}
              title="How to Play"
              className="px-2.5 py-1.5 rounded text-xs font-medium text-[#777777] hover:text-[#242424] hover:bg-[#F8F7F3] border border-transparent hover:border-[#E5E3DE] transition-colors flex items-center gap-1">
              <HelpCircle size={15} />
              <span className="hidden md:inline">How to Play</span>
            </button>

            {/* Stats Button */}
            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setIsStatsOpen(true);
              }}
              title="Statistics"
              className="px-2.5 py-1.5 rounded text-xs font-medium text-[#777777] hover:text-[#242424] hover:bg-[#F8F7F3] border border-transparent hover:border-[#E5E3DE] transition-colors flex items-center gap-1">
              <Trophy size={15} />
              <span className="hidden md:inline">Stats</span>
            </button>

            {/* In-Game Header Restart Button */}
            {gameState.status === 'PLAYING' && (
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  restartCurrentPuzzle();
                }}
                data-testid="restart-button"
                title="Restart Current Puzzle"
                className="px-2 py-1.5 rounded text-xs font-medium text-[#777777] hover:text-[#242424] hover:bg-[#F8F7F3] border border-transparent hover:border-[#E5E3DE] transition-colors flex items-center gap-1">
                <RotateCw size={14} />
                <span className="hidden sm:inline text-[11px]">Restart</span>
              </button>
            )}

            {/* Settings Menu Button */}
            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setIsGameMenuOpen(true);
              }}
              data-testid="menu-button"
              title="Menu & Settings"
              className="p-1.5 rounded text-xs text-[#777777] hover:text-[#242424] hover:bg-[#F8F7F3] border border-transparent hover:border-[#E5E3DE] transition-colors">
              <MenuIcon size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN GAMEPLAY VIEWPORT (CENTERED MAX 720PX) */}
      {/* ========================================================================= */}
      {gameState.status === 'PLAYING' && (
        <main className="flex-1 w-full min-h-0 overflow-y-auto touch-auto px-3 sm:px-4 py-3 z-10 flex flex-col items-center">
          <div className="w-full max-w-[720px] flex flex-col gap-3.5">
            {/* ----------------------------------------------------------------- */}
            {/* METADATA BAR (DATE, TOPIC, 5 GUESS TRACKERS & TIMER) */}
            {/* ----------------------------------------------------------------- */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E5E3DE] text-xs">
              {/* Left: Metadata Tag & Verified ID */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777777] flex items-center gap-1.5">
                  <Calendar size={12} className="text-[#477A60]" />
                  {gameMode === 'daily'
                    ? `Daily Case • UTC ${currentPuzzle.dateKey || formattedUtcDate}`
                    : `Practice • ${activeDifficultyTier.toUpperCase()} • ${currentPuzzle.category}`}
                </span>
                <span className="text-[10px] font-mono text-[#9B9994] bg-[#F8F7F3] border border-[#E5E3DE] px-1.5 py-0.2 rounded">
                  {currentPuzzle.id}
                </span>
                <span
                  title={`${currentPuzzle.sourceEvidence} (${currentPuzzle.verificationStatus || 'verified'})`}
                  className={`text-[10px] px-1.5 py-0.2 rounded flex items-center gap-0.5 cursor-help ${
                    currentPuzzle.verificationStatus === 'verified' || !currentPuzzle.verificationStatus
                      ? 'text-[#477A60] bg-[#EDF5F0] border border-[#477A60]/30'
                      : currentPuzzle.verificationStatus === 'partially_verified'
                      ? 'text-[#C28B38] bg-[#FDF7EB] border border-[#C28B38]/30'
                      : 'text-[#777777] bg-[#F8F7F3] border border-[#E5E3DE]'
                  }`}>
                  <ShieldCheck size={11} />{' '}
                  {currentPuzzle.verificationStatus === 'partially_verified'
                    ? 'Partially Verified Reference'
                    : currentPuzzle.verificationStatus === 'unverified'
                    ? 'Unverified Reference'
                    : 'Verified Record'}
                </span>
              </div>

              {/* Right: 5 Wordle Guess Indicators & Timer */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1" title="Attempts remaining">
                  {Array.from({length: maxGuessesAllowed}).map((_, i) => {
                    const guess = guesses[i];
                    let indicatorStyle = 'bg-[#FFFFFF] border-[#E5E3DE] text-transparent';
                    if (guess) {
                      indicatorStyle = guess.isCorrect
                        ? 'bg-[#477A60] border-[#477A60] text-[#FFFFFF]'
                        : 'bg-[#B85C54] border-[#B85C54] text-[#FFFFFF]';
                    } else if (i === guesses.length) {
                      indicatorStyle = 'bg-[#FFFFFF] border-[#242424] text-[#242424] font-bold';
                    }
                    return (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-sm border text-[9px] flex items-center justify-center transition-all ${indicatorStyle}`}>
                        {guess ? (guess.isCorrect ? '✓' : '×') : ''}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#777777] font-mono">
                  <Clock size={12} />
                  <span>{formatTime(timeSpent)}</span>
                </div>

                <button
                  onClick={() => {
                    gameAudio.playCrispClick();
                    restartCurrentPuzzle();
                  }}
                  data-testid="metadata-restart-button"
                  title="Restart Round"
                  className="p-1 rounded text-[#777777] hover:text-[#242424] hover:bg-[#FFFFFF] border border-transparent hover:border-[#E5E3DE] transition-colors flex items-center">
                  <RotateCw size={12} />
                </button>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* SCENARIO & MODEL RESPONSE PRESENTATION CARD */}
            {/* ----------------------------------------------------------------- */}
            <div
              className={`bg-[#FFFFFF] border border-[#E5E3DE] rounded-md p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col gap-3 transition-transform ${
                shakeCard ? 'animate-shake' : ''
              }`}>
              {/* Scenario Topic & Title */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E3DE]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#477A60] bg-[#EDF5F0] px-2 py-0.5 rounded">
                    {currentPuzzle.category}
                  </span>
                  <span className="text-xs font-semibold text-[#242424]">
                    "{currentPuzzle.title}"
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#777777] font-medium bg-[#F8F7F3] border border-[#E5E3DE] px-1.5 py-0.5 rounded">
                    {activeDifficultyTier.toUpperCase()} ({candidatePool.length} Verified AI)
                  </span>
                  <span className="text-[11px] font-mono text-[#777777]">
                    {maxGuessesAllowed - guesses.length} left
                  </span>
                </div>
              </div>

              {/* Everyday Prompt */}
              <div className="text-xs sm:text-sm text-[#242424] bg-[#F8F7F3] border-l-2 border-[#477A60] px-3.5 py-2.5 rounded-r">
                <span className="font-semibold text-[#777777] block text-[11px] uppercase tracking-wider mb-0.5">
                  Everyday Scenario Prompt:
                </span>
                "{currentPuzzle.prompt}"
              </div>

              {/* AI Model Output Area */}
              <div className="space-y-2 border-t border-[#E5E3DE] pt-3">
                <div className="flex items-center justify-between text-[11px] text-[#777777] uppercase tracking-wider font-semibold">
                  <span>Target AI Model Response</span>
                  <span className="text-[10px] text-[#9B9994] font-normal normal-case">
                    Which AI drafted this exact reply?
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-[#242424] leading-relaxed bg-[#FFFFFF] p-3.5 rounded border border-[#E5E3DE] font-serif-masthead italic text-base sm:text-lg">
                  "{currentPuzzle.targetResponse}"
                </div>
              </div>

              {/* Clues / Hints Bar */}
              <div className="pt-2 border-t border-[#E5E3DE] flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777777]">
                    Stylistic Clues ({revealedHints}/{maxAllowedClues} Unlocked)
                  </span>
                  {revealedHints < maxAllowedClues && (
                    <button
                      onClick={() => {
                        setRevealedHints((h) => {
                          const next = h + 1;
                          if (gameMode === 'daily') {
                            saveDailyRecord({
                              dateKey: getUTCDateKey(),
                              puzzleId: currentPuzzle.id,
                              targetModelId: currentPuzzle.targetModelId,
                              guesses,
                              status: 'PLAYING',
                              revealedHints: next,
                              timeSpent,
                              score: 0,
                              completed: false,
                            });
                          }
                          return next;
                        });
                        gameAudio.playHoverMicroTone();
                        triggerToast('Clue revealed (-75 pts).');
                      }}
                      className="text-[11px] font-medium text-[#477A60] hover:underline flex items-center gap-1">
                      <Eye size={12} /> Reveal Next Clue
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  <div
                    className={`p-2 rounded border transition-colors ${
                      revealedHints >= 1
                        ? 'bg-[#FFFFFF] border-[#E5E3DE] text-[#242424]'
                        : 'bg-[#F8F7F3] border-[#E5E3DE] text-[#9B9994]'
                    }`}>
                    <span className="font-semibold block text-[#777777] mb-0.5">
                      1. Tone & Phrasing Habit
                    </span>
                    {revealedHints >= 1
                      ? currentPuzzle.difficultyMetadata.hints.stylometryClue
                      : 'Locked (Reveals on first attempt)'}
                  </div>

                  {activeDifficultyTier !== 'hard' && (
                    <div
                      className={`p-2 rounded border transition-colors ${
                        revealedHints >= 2
                          ? 'bg-[#FFFFFF] border-[#E5E3DE] text-[#242424]'
                          : 'bg-[#F8F7F3] border-[#E5E3DE] text-[#9B9994]'
                      }`}>
                      <span className="font-semibold block text-[#777777] mb-0.5">
                        2. Structure & Cadence
                      </span>
                      {revealedHints >= 2
                        ? currentPuzzle.difficultyMetadata.hints.structuralClue || currentPuzzle.difficultyMetadata.hints.contextClue
                        : 'Locked'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* PREVIOUS GUESSES EVALUATION LEDGER (NYT WORDLE STYLE) */}
            {/* ----------------------------------------------------------------- */}
            {guesses.length > 0 && (
              <div className="bg-[#FFFFFF] border border-[#E5E3DE] rounded-md p-3 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col gap-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#777777] pb-1 border-b border-[#E5E3DE]">
                  Deduction Ledger ({guesses.length}/{maxGuessesAllowed})
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {guesses.map((g, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-1.5 text-xs items-center p-1.5 rounded bg-[#F8F7F3] border border-[#E5E3DE]">
                      {/* Guess # and Model Name */}
                      <div className="col-span-5 truncate font-medium text-[#242424]">
                        <span className="text-[#777777] mr-1">{idx + 1}.</span>
                        {g.model.name}
                      </div>

                      {/* Developer Match Tag */}
                      <div
                        className={`col-span-3 text-center py-0.5 px-1 rounded text-[10px] font-medium truncate ${
                          g.developerMatch === 'correct'
                            ? 'bg-[#477A60] text-[#FFFFFF]'
                            : 'bg-[#E5E3DE] text-[#777777]'
                        }`}>
                        {g.model.developer}
                      </div>

                      {/* Release Year */}
                      <div
                        className={`col-span-2 text-center py-0.5 px-1 rounded text-[10px] font-medium flex items-center justify-center gap-0.5 ${
                          g.yearMatch === 'correct'
                            ? 'bg-[#477A60] text-[#FFFFFF]'
                            : 'bg-[#E5E3DE] text-[#777777]'
                        }`}>
                        {g.model.releaseYear}
                        {g.yearMatch === 'higher' && <ArrowUp size={10} />}
                        {g.yearMatch === 'lower' && <ArrowDown size={10} />}
                      </div>

                      {/* Context Window */}
                      <div
                        className={`col-span-2 text-center py-0.5 px-1 rounded text-[10px] font-medium flex items-center justify-center gap-0.5 ${
                          g.contextMatch === 'correct'
                            ? 'bg-[#477A60] text-[#FFFFFF]'
                            : 'bg-[#E5E3DE] text-[#777777]'
                        }`}>
                        {g.model.contextWindow}
                        {g.contextMatch === 'higher' && <ArrowUp size={10} />}
                        {g.contextMatch === 'lower' && <ArrowDown size={10} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* MODEL CANDIDATE SELECTION & SUBMISSION */}
            {/* ----------------------------------------------------------------- */}
            <div className="bg-[#FFFFFF] border border-[#E5E3DE] rounded-md p-3 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col gap-3">
              {/* Candidate Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 touch-auto text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] mr-1 shrink-0">
                  Filter:
                </span>
                {['All', 'OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral', 'Open-Source'].map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        gameAudio.playCrispClick();
                        setActiveCandidateFilter(filter);
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                        activeCandidateFilter === filter
                          ? 'bg-[#242424] text-[#FFFFFF]'
                          : 'bg-[#F8F7F3] text-[#777777] hover:text-[#242424] hover:bg-[#EFECE6] border border-[#E5E3DE]'
                      }`}>
                      {filter}
                    </button>
                  ),
                )}
              </div>

              {/* Candidate Models Grid (Sized strictly by verified difficulty pool) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 sm:max-h-80 overflow-y-auto overflow-x-hidden pr-1 touch-auto w-full">
                {visibleCandidates.length === 0 ? (
                  <div className="col-span-1 sm:col-span-2 text-center py-6 text-xs text-[#777777]">
                    No candidates match the "{activeCandidateFilter}" filter in this pool.
                    <button
                      onClick={() => setActiveCandidateFilter('All')}
                      className="block mx-auto mt-1 text-[#477A60] font-semibold hover:underline">
                      Show all {candidatePool.length} verified candidates
                    </button>
                  </div>
                ) : (
                  visibleCandidates.map((model, idx) => {
                    const isEliminated = eliminatedModelIds.has(model.id);
                    const isSelected = selectedCandidateId === model.id;
                    const shortcutKey = idx < 8 ? idx + 1 : null;

                    return (
                      <button
                        key={model.id}
                        disabled={isEliminated || gameState.status !== 'PLAYING'}
                        onClick={() => {
                          gameAudio.playHoverMicroTone();
                          setSelectedCandidateId(model.id);
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col justify-between min-h-[82px] h-auto touch-manipulation relative overflow-hidden ${
                          isEliminated
                            ? 'opacity-35 bg-[#F8F7F3] border-[#E5E3DE] cursor-not-allowed line-through text-[#9B9994]'
                            : isSelected
                            ? 'bg-[#EDF5F0] border-[#477A60] ring-1 ring-[#477A60] shadow-sm'
                            : 'bg-[#FFFFFF] hover:bg-[#F8F7F3] border-[#E5E3DE] hover:border-[#CCC8C0]'
                        }`}>
                        {/* Top: Model Name, Shortcut Badge, Developer Tag */}
                        <div className="flex items-start justify-between gap-2 w-full">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            {shortcutKey && (
                              <kbd
                                aria-label={`Key ${shortcutKey}`}
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 font-bold transition-colors ${
                                  isSelected
                                    ? 'bg-[#477A60] text-[#FFFFFF] border-[#477A60]'
                                    : isEliminated
                                    ? 'bg-[#E5E3DE] text-[#9B9994] border-[#CCC8C0]'
                                    : 'bg-[#F8F7F3] text-[#777777] border-[#E5E3DE]'
                                }`}>
                                [{shortcutKey}]
                              </kbd>
                            )}
                            <span
                              className={`font-bold text-xs sm:text-[13px] leading-tight break-words ${
                                isSelected ? 'text-[#477A60]' : 'text-[#242424]'
                              }`}>
                              {model.name}
                            </span>
                          </div>
                          <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#F8F7F3] text-[#6B6966] border border-[#E5E3DE] shrink-0 font-medium">
                            {model.developer}
                          </span>
                        </div>

                        {/* Middle: Secondary Description / Tagline (Multi-line text wrapping without truncation) */}
                        <div className="text-[11px] text-[#555350] mt-1.5 mb-2 leading-relaxed break-words italic">
                          {model.tagline}
                        </div>

                        {/* Bottom: Technical metadata (Release Year, Context Window, Version) cleanly wrapped */}
                        <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-[#777777] pt-1.5 border-t border-[#F0EEEA] w-full">
                          <span className="font-mono">
                            {model.contextWindow} context • {model.releaseYear}
                          </span>
                          <span className="font-mono text-[9.5px] px-1.5 py-0.5 rounded bg-[#F8F7F3] border border-[#E5E3DE] text-[#666460] break-all">
                            {model.version}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Submit Guess Button */}
              <div className="pt-2 border-t border-[#E5E3DE]">
                <button
                  disabled={
                    !selectedCandidateId ||
                    guesses.length >= maxGuessesAllowed ||
                    gameState.status !== 'PLAYING' ||
                    isSubmittingRef.current
                  }
                  onClick={handleSubmitGuess}
                  className={`w-full py-2.5 px-4 rounded font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors min-h-[44px] ${
                    selectedCandidateId && gameState.status === 'PLAYING'
                      ? 'bg-[#477A60] hover:bg-[#36604A] text-[#FFFFFF] cursor-pointer shadow-sm'
                      : 'bg-[#F8F7F3] text-[#9B9994] cursor-not-allowed border border-[#E5E3DE]'
                  }`}>
                  <CheckCircle2 size={16} />
                  <span>
                    {selectedCandidateId
                      ? `Submit Guess: ${
                          AI_MODELS.find((m) => m.id === selectedCandidateId)?.name
                        }`
                      : 'Select a Candidate Model Above'}
                  </span>
                  {selectedCandidateId && (
                    <kbd className="hidden sm:inline-block ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-white/90 border border-white/20">
                      [Enter]
                    </kbd>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* START / MENU OVERLAY (DAILY & PRACTICE SELECTION) */}
      {/* ========================================================================= */}
      {gameState.status === 'START' && (
        <MenuOverlay tone="neutral" zIndex={40}>
          <div className="w-full max-w-[540px] bg-[#FFFFFF] border border-[#E5E3DE] rounded-lg p-5 sm:p-7 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex flex-col items-center text-center">
            {/* Masthead */}
            <div className="mb-2.5">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#477A60] mb-1">
                <ShieldCheck size={14} /> Verified Everyday AI Benchmark
              </div>
              <h1 className="font-serif-masthead text-4xl sm:text-5xl font-bold text-[#242424] tracking-tight">
                AIdle
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-[#6B6966] mb-4 leading-relaxed max-w-sm">
              Read real everyday human situations, analyze how verified AI models communicate, and deduce the authoring AI in 5 guesses.
            </p>

            {/* Daily Stats Summary */}
            <div className="w-full grid grid-cols-3 gap-2 bg-[#F8F7F3] border border-[#E5E3DE] rounded-md p-3 mb-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                  Daily Streak
                </div>
                <div className="text-base font-semibold text-[#242424] flex items-center justify-center gap-1">
                  <Flame size={15} className="text-[#C28B38]" />
                  <span>{stats.dailyStreak}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                  Daily Win Rate
                </div>
                <div className="text-base font-semibold text-[#477A60]">
                  {stats.dailyPlayed > 0
                    ? Math.round((stats.dailyWon / stats.dailyPlayed) * 100)
                    : 0}
                  %
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                  Daily Score
                </div>
                <div className="text-base font-semibold text-[#242424]">
                  {stats.totalDailyScore}
                </div>
              </div>
            </div>

            {/* Play Actions */}
            <div className="w-full flex flex-col gap-3">
              {/* Daily Challenge Start / Resume / Completed Button */}
              <button
                ref={primaryStartBtnRef}
                autoFocus
                onClick={() => initGame('daily')}
                data-testid="start-daily-button"
                className={`w-full font-semibold text-sm py-3 px-6 rounded transition-colors shadow-sm flex items-center justify-center gap-2 min-h-[46px] ${
                  isDailyCompletedToday
                    ? 'bg-[#EDF5F0] hover:bg-[#DEF0E4] text-[#477A60] border border-[#477A60]/40'
                    : 'bg-[#477A60] hover:bg-[#36604A] text-[#FFFFFF]'
                }`}>
                {isDailyCompletedToday ? <CheckCircle2 size={16} /> : <Play size={16} />}
                {isDailyCompletedToday
                  ? `View Today's Solved Case (UTC ${formattedUtcDate}) • Completed ✓`
                  : `Play Today's Daily Case (UTC ${formattedUtcDate})`}
              </button>

              {/* Practice Mode Setup Box */}
              <div className="w-full bg-[#F8F7F3] border border-[#E5E3DE] rounded-md p-3.5 flex flex-col gap-2.5 text-left">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                  <span>Practice Mode (Score Isolated)</span>
                  <span>Select Real-World Category</span>
                </div>

                {/* 6 Real-World Priority Categories Filter */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider">
                    Everyday Scenario Topic:
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pr-1">
                    {PRACTICE_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          gameAudio.playCrispClick();
                          setSelectedPracticeCategory(cat);
                        }}
                        className={`text-[10.5px] px-2.5 py-1 rounded font-medium transition-colors ${
                          selectedPracticeCategory === cat
                            ? 'bg-[#242424] text-[#FFFFFF] font-semibold'
                            : 'bg-[#FFFFFF] text-[#6B6966] hover:text-[#242424] hover:bg-[#EFECE6] border border-[#E5E3DE]'
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Tier in Practice */}
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider">
                    Difficulty & Candidate Pool:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['easy', 'medium', 'hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => {
                          gameAudio.playCrispClick();
                          setDifficulty(diff);
                        }}
                        className={`text-xs py-1.5 rounded font-medium capitalize transition-colors ${
                          difficulty === diff
                            ? 'bg-[#242424] text-[#FFFFFF]'
                            : 'bg-[#FFFFFF] text-[#777777] hover:text-[#242424] border border-[#E5E3DE]'
                        }`}>
                        {diff} ({diff === 'easy' ? '4 AI' : diff === 'medium' ? '6 AI' : '8 AI'})
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => initGame('practice', difficulty, selectedPracticeCategory)}
                  className="w-full mt-1 bg-[#FFFFFF] hover:bg-[#EFECE6] text-[#242424] font-medium text-xs py-2.5 px-3 rounded border border-[#E5E3DE] flex items-center justify-center gap-1.5 transition-colors min-h-[38px]">
                  Start Practice Round
                </button>
              </div>

              {/* Rules link & Verification info */}
              <div className="flex items-center justify-center gap-4 text-xs text-[#777777]">
                <button
                  onClick={() => {
                    gameAudio.playCrispClick();
                    setIsHowToPlayOpen(true);
                  }}
                  className="hover:text-[#242424] py-1 transition-colors flex items-center gap-1">
                  <HelpCircle size={14} /> Rules & Model Signatures
                </button>
                <span>•</span>
                <button
                  onClick={() => {
                    gameAudio.playCrispClick();
                    setIsSystemInfoOpen(true);
                  }}
                  className="hover:text-[#242424] py-1 transition-colors flex items-center gap-1">
                  <ShieldCheck size={14} className="text-[#477A60]" /> Verified Data Info
                </button>
              </div>
            </div>
          </div>
        </MenuOverlay>
      )}

      {/* ========================================================================= */}
      {/* VICTORY OVERLAY WITH EDUCATIONAL ANALYSIS & COMPARISON TABS */}
      {/* ========================================================================= */}
      {gameState.status === 'VICTORY' && (
        <MenuOverlay tone="neutral" zIndex={40}>
          <div className="w-full max-w-[560px] bg-[#FFFFFF] border border-[#E5E3DE] rounded-lg p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-[#EDF5F0] border border-[#477A60] flex items-center justify-center text-[#477A60] mb-2.5">
              <CheckCircle2 size={22} />
            </div>

            <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
              <span
                title={`${currentPuzzle.sourceEvidence} (${currentPuzzle.verificationStatus || 'verified'})`}
                className={`text-[10.5px] px-2 py-0.5 rounded flex items-center gap-1 cursor-help ${
                  currentPuzzle.verificationStatus === 'verified' || !currentPuzzle.verificationStatus
                    ? 'text-[#477A60] bg-[#EDF5F0] border border-[#477A60]/30'
                    : 'text-[#C28B38] bg-[#FDF7EB] border border-[#C28B38]/30'
                }`}>
                <ShieldCheck size={12} />
                {currentPuzzle.verificationStatus === 'partially_verified'
                  ? 'Partially Verified Reference'
                  : 'Verified Record'}
              </span>
              <span className="text-[10px] text-[#777777] font-mono bg-[#F8F7F3] border border-[#E5E3DE] px-1.5 py-0.5 rounded">
                {currentPuzzle.id}
              </span>
            </div>

            <h2 className="font-serif-masthead text-2xl sm:text-3xl font-bold text-[#242424] mb-0.5">
              Case Solved!
            </h2>
            <p className="text-xs text-[#777777] mb-3">
              Identified <strong>{targetModel.name}</strong> ({currentPuzzle.modelVersion}) in{' '}
              {guesses.length} of {maxGuessesAllowed} attempts ({formatTime(timeSpent)})
            </p>

            {/* Score Breakdown Card */}
            <div className="w-full bg-[#F8F7F3] border border-[#E5E3DE] rounded-md p-3 mb-3 text-left">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E5E3DE]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                  Final Score Breakdown ({gameMode === 'daily' ? 'Daily' : 'Practice'}):
                </span>
                <span className="text-sm font-bold text-[#477A60]">
                  +{earnedScore || gameState.score} pts
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                <div>
                  <span className="text-[#777777] block text-[10px]">Base Score</span>
                  <span className="font-semibold text-[#242424]">
                    +{scoreBreakdown?.baseScore || (gameMode === 'daily' ? 1000 : difficulty === 'easy' ? 500 : difficulty === 'hard' ? 1500 : 1000)}
                  </span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[10px]">Wrong Guesses ({Math.max(0, guesses.length - 1)})</span>
                  <span className="font-semibold text-[#B85C54]">
                    -{scoreBreakdown?.wrongPenalty || 0}
                  </span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[10px]">Clues ({revealedHints})</span>
                  <span className="font-semibold text-[#B85C54]">
                    {scoreBreakdown?.hintPenalty ? `-${scoreBreakdown.hintPenalty}` : '0'}
                  </span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[10px]">Speed Bonus</span>
                  <span className="font-semibold text-[#477A60]">
                    +{scoreBreakdown?.timeBonus || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Post-Game Interactive Tabs */}
            <div className="w-full flex items-center bg-[#F8F7F3] border border-[#E5E3DE] rounded p-0.5 mb-3 text-xs">
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setPostGameTab('analysis');
                }}
                className={`flex-1 py-1.5 rounded font-medium transition-colors ${
                  postGameTab === 'analysis'
                    ? 'bg-[#FFFFFF] text-[#242424] shadow-sm font-semibold'
                    : 'text-[#777777] hover:text-[#242424]'
                }`}>
                Stylometric Analysis
              </button>
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setPostGameTab('compare');
                }}
                className={`flex-1 py-1.5 rounded font-medium transition-colors ${
                  postGameTab === 'compare'
                    ? 'bg-[#FFFFFF] text-[#242424] shadow-sm font-semibold'
                    : 'text-[#777777] hover:text-[#242424]'
                }`}>
                All Verified Models ({(currentPuzzle.comparisonResponses?.length || 0) + 1})
              </button>
            </div>

            {/* Tab 1: Factual Educational Stylometry Card */}
            {postGameTab === 'analysis' && (
              <div className="w-full bg-[#F8F7F3] border border-[#E5E3DE] rounded-md p-3.5 mb-3 text-left flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block mb-0.5">
                      Why this response matches {targetModel.name}:
                    </span>
                    <span className="font-bold text-sm text-[#242424]">
                      {targetModel.name}
                    </span>
                    <span className="text-[10px] text-[#777777] ml-2 font-mono">
                      {currentPuzzle.modelVersion}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#EDF5F0] text-[#477A60] border border-[#477A60]/30 font-medium">
                    {targetModel.tier} Tier
                  </span>
                </div>
                <p className="text-xs text-[#444444] leading-relaxed">
                  {currentPuzzle.difficultyMetadata.responseAnalysis}
                </p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {currentPuzzle.difficultyMetadata.distinguishingTraits?.map((trait, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-[#FFFFFF] border border-[#E5E3DE] text-[#477A60] px-2 py-0.5 rounded font-medium">
                      ✓ {trait}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] bg-[#FFFFFF] p-2.5 rounded border border-[#E5E3DE] text-[#6B6966]">
                  <span className="font-semibold text-[#242424] block mb-0.5">
                    Signature Communication Profile:
                  </span>
                  {targetModel.signatureStyle}
                </div>
              </div>
            )}

            {/* Tab 2: Compare All Verified Model Responses Side-by-Side */}
            {postGameTab === 'compare' && (
              <div className="w-full space-y-2 mb-3 max-h-60 overflow-y-auto pr-1 text-left touch-auto">
                <div className="text-[11px] font-semibold text-[#777777] uppercase tracking-wider pb-1 border-b border-[#E5E3DE] flex items-center justify-between">
                  <span>Responses to the exact same prompt:</span>
                  <span className="text-[10px] text-[#477A60] font-mono">
                    {(currentPuzzle.comparisonResponses?.length || 0) + 1} Verified Models
                  </span>
                </div>

                {/* Target Solution Model Response Card */}
                <div className="bg-[#EDF5F0] border-2 border-[#477A60] rounded-md p-3 text-xs flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center justify-between font-bold text-[#242424]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#477A60] flex items-center gap-1">
                        <CheckCircle2 size={13} /> {targetModel.name}
                      </span>
                      <span className="text-[10px] font-mono font-normal text-[#477A60] bg-[#FFFFFF] border border-[#477A60]/30 px-1.5 py-0.2 rounded">
                        {currentPuzzle.modelVersion}
                      </span>
                      <span className="text-[9.5px] uppercase font-bold text-[#FFFFFF] bg-[#477A60] px-1.5 py-0.2 rounded">
                        Target Solution
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-[#242424] italic font-serif-masthead bg-[#FFFFFF] p-2.5 rounded border border-[#477A60]/30">
                    "{currentPuzzle.targetResponse}"
                  </div>
                  <div className="text-[11px] text-[#477A60] bg-[#FFFFFF] p-1.5 rounded border border-[#477A60]/30 font-medium">
                    <span className="font-bold mr-1">Signature Stylometric Clue:</span>
                    {currentPuzzle.difficultyMetadata?.hints?.stylometryClue || currentPuzzle.hints?.stylometryClue}
                  </div>
                </div>

                {/* Alternative Verified Model Responses */}
                {currentPuzzle.comparisonResponses?.map((alt, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F8F7F3] border border-[#E5E3DE] rounded-md p-3 text-xs flex flex-col gap-1.5">
                    <div className="flex items-center justify-between font-bold text-[#242424]">
                      <div className="flex items-center gap-1.5">
                        <span>{alt.model}</span>
                        <span className="text-[10px] font-mono font-normal text-[#777777] bg-[#FFFFFF] border border-[#E5E3DE] px-1.5 py-0.2 rounded">
                          {alt.version}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-[#242424] italic font-serif-masthead bg-[#FFFFFF] p-2.5 rounded border border-[#E5E3DE]">
                      "{alt.response}"
                    </div>
                    <div className="text-[11px] text-[#6B6966] bg-[#EDF5F0] p-1.5 rounded border border-[#477A60]/20">
                      <span className="font-semibold text-[#477A60] mr-1">Stylometric Note:</span>
                      {alt.keyStylometricNote}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Practice Category Selector (if in Practice Mode) */}
            {gameMode === 'practice' && (
              <div className="w-full bg-[#F8F7F3] border border-[#E5E3DE] rounded-md p-2.5 mb-3 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777] block mb-1">
                  Next Round Category:
                </span>
                <div className="flex flex-wrap gap-1">
                  {PRACTICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        gameAudio.playCrispClick();
                        setSelectedPracticeCategory(cat);
                      }}
                      className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                        selectedPracticeCategory === cat
                          ? 'bg-[#242424] text-white font-semibold'
                          : 'bg-white text-[#6B6966] border border-[#E5E3DE] hover:bg-[#EFECE6]'
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2">
              {gameMode === 'daily' ? (
                <>
                  <button
                    onClick={() => initGame('practice', difficulty, selectedPracticeCategory)}
                    className="w-full bg-[#477A60] hover:bg-[#36604A] text-[#FFFFFF] font-semibold text-xs sm:text-sm py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2 min-h-[44px] shadow-sm">
                    <Sparkles size={16} /> Continue with Unlimited Practice
                  </button>
                  <button
                    onClick={() => {
                      gameAudio.playCrispClick();
                      restartCurrentPuzzle();
                    }}
                    data-testid="play-again-button"
                    className="w-full bg-[#FFFFFF] hover:bg-[#F8F7F3] text-[#242424] font-medium text-xs sm:text-sm py-2 px-4 rounded border border-[#E5E3DE] flex items-center justify-center gap-2 min-h-[40px] transition-colors">
                    <RotateCw size={15} /> Play Again (Replay Case)
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full bg-[#FFFFFF] hover:bg-[#F8F7F3] text-[#242424] font-medium text-xs sm:text-sm py-2 px-4 rounded border border-[#E5E3DE] flex items-center justify-center gap-2 min-h-[40px] transition-colors">
                    <Share2 size={15} /> Share Result
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => initGame('practice', difficulty, selectedPracticeCategory)}
                    className="w-full bg-[#477A60] hover:bg-[#36604A] text-[#FFFFFF] font-semibold text-xs sm:text-sm py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2 min-h-[44px] shadow-sm">
                    <Sparkles size={15} /> Next Practice Round
                  </button>
                  <button
                    onClick={() => {
                      gameAudio.playCrispClick();
                      restartCurrentPuzzle();
                    }}
                    data-testid="play-again-button"
                    className="w-full bg-[#FFFFFF] hover:bg-[#F8F7F3] text-[#242424] font-medium text-xs sm:text-sm py-2 px-4 rounded border border-[#E5E3DE] flex items-center justify-center gap-2 min-h-[40px] transition-colors">
                    <RotateCw size={15} /> Play Again (Restart Round)
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full bg-[#FFFFFF] hover:bg-[#F8F7F3] text-[#242424] font-medium text-xs sm:text-sm py-2 px-4 rounded border border-[#E5E3DE] flex items-center justify-center gap-2 min-h-[40px] transition-colors">
                    <Share2 size={15} /> Share Result
                  </button>
                </>
              )}
              <button
                onClick={() => setGameState((prev) => ({...prev, status: 'START'}))}
                className="text-xs text-[#777777] hover:text-[#242424] py-1 transition-colors">
                Return to Home
              </button>
            </div>
          </div>
        </MenuOverlay>
      )}

      {/* ========================================================================= */}
      {/* GAME OVER (ATTEMPTS EXHAUSTED) OVERLAY WITH COMPARISON TABS */}
      {/* ========================================================================= */}
      {gameState.status === 'GAME_OVER' && (
        <MenuOverlay tone="neutral" zIndex={40}>
          <div className="w-full max-w-[560px] bg-[#FFFFFF] border border-[#E5E3DE] rounded-lg p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-[#FBF1F0] border border-[#B85C54] flex items-center justify-center text-[#B85C54] mb-2.5">
              <XCircle size={22} />
            </div>

            <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
              <span
                title={`${currentPuzzle.sourceEvidence} (${currentPuzzle.verificationStatus || 'verified'})`}
                className={`text-[10.5px] px-2 py-0.5 rounded flex items-center gap-1 cursor-help ${
                  currentPuzzle.verificationStatus === 'verified' || !currentPuzzle.verificationStatus
                    ? 'text-[#477A60] bg-[#EDF5F0] border border-[#477A60]/30'
                    : 'text-[#C28B38] bg-[#FDF7EB] border border-[#C28B38]/30'
                }`}>
                <ShieldCheck size={12} />
                {currentPuzzle.verificationStatus === 'partially_verified'
                  ? 'Partially Verified Reference'
                  : 'Verified Record'}
              </span>
              <span className="text-[10px] text-[#777777] font-mono bg-[#F8F7F3] border border-[#E5E3DE] px-1.5 py-0.5 rounded">
                {currentPuzzle.id}
              </span>
            </div>

            <h2 className="font-serif-masthead text-2xl sm:text-3xl font-bold text-[#242424] mb-0.5">
              Deduction Unsolved
            </h2>
            <p className="text-xs text-[#777777] mb-3">
              The target AI model was <strong>{targetModel.name}</strong> ({currentPuzzle.modelVersion}).
              Attempts exhausted (5/5).
            </p>

            {/* Post-Game Tabs */}
            <div className="w-full flex items-center bg-[#F8F7F3] border border-[#E5E3DE] rounded p-0.5 mb-3 text-xs">
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setPostGameTab('analysis');
                }}
                className={`flex-1 py-1.5 rounded font-medium transition-colors ${
                  postGameTab === 'analysis'
                    ? 'bg-[#FFFFFF] text-[#242424] shadow-sm font-semibold'
                    : 'text-[#777777] hover:text-[#242424]'
                }`}>
                Stylometric Breakdown
              </button>
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setPostGameTab('compare');
                }}
                className={`flex-1 py-1.5 rounded font-medium transition-colors ${
                  postGameTab === 'compare'
                    ? 'bg-[#FFFFFF] text-[#242424] shadow-sm font-semibold'
                    : 'text-[#777777] hover:text-[#242424]'
                }`}>
                All Verified Models ({(currentPuzzle.comparisonResponses?.length || 0) + 1})
              </button>
            </div>

            {/* Solution & Learning Card */}
            {postGameTab === 'analysis' && (
              <div className="w-full bg-[#F8F7F3] border border-[#E5E3DE] rounded-md p-3.5 mb-3 text-left flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block mb-0.5">
                      Why this response matches {targetModel.name}:
                    </span>
                    <span className="font-bold text-sm text-[#242424]">
                      {targetModel.name}
                    </span>
                    <span className="text-[10px] text-[#777777] ml-2 font-mono">
                      {targetModel.developer}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#EDF5F0] text-[#477A60] border border-[#477A60]/30 font-medium">
                    {targetModel.tier} Tier
                  </span>
                </div>
                <p className="text-xs text-[#444444] leading-relaxed">
                  {currentPuzzle.difficultyMetadata.responseAnalysis}
                </p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {currentPuzzle.difficultyMetadata.distinguishingTraits?.map((trait, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-[#FFFFFF] border border-[#E5E3DE] text-[#477A60] px-2 py-0.5 rounded font-medium">
                      ✓ {trait}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] bg-[#FFFFFF] p-2.5 rounded border border-[#E5E3DE] text-[#6B6966]">
                  <span className="font-semibold text-[#242424] block mb-0.5">
                    Key Communication Trait:
                  </span>
                  {targetModel.signatureStyle}
                </div>
              </div>
            )}

            {/* Post-Game Compare Tab (Game Over) */}
            {postGameTab === 'compare' && (
              <div className="w-full space-y-2 mb-3 max-h-60 overflow-y-auto pr-1 text-left touch-auto">
                <div className="text-[11px] font-semibold text-[#777777] uppercase tracking-wider pb-1 border-b border-[#E5E3DE] flex items-center justify-between">
                  <span>Responses to the exact same prompt:</span>
                  <span className="text-[10px] text-[#477A60] font-mono">
                    {(currentPuzzle.comparisonResponses?.length || 0) + 1} Verified Models
                  </span>
                </div>

                {/* Target Solution Model Response Card */}
                <div className="bg-[#EDF5F0] border-2 border-[#477A60] rounded-md p-3 text-xs flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center justify-between font-bold text-[#242424]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#477A60] flex items-center gap-1">
                        <CheckCircle2 size={13} /> {targetModel.name}
                      </span>
                      <span className="text-[10px] font-mono font-normal text-[#477A60] bg-[#FFFFFF] border border-[#477A60]/30 px-1.5 py-0.2 rounded">
                        {currentPuzzle.modelVersion}
                      </span>
                      <span className="text-[9.5px] uppercase font-bold text-[#FFFFFF] bg-[#477A60] px-1.5 py-0.2 rounded">
                        Target Solution
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-[#242424] italic font-serif-masthead bg-[#FFFFFF] p-2.5 rounded border border-[#477A60]/30">
                    "{currentPuzzle.targetResponse}"
                  </div>
                  <div className="text-[11px] text-[#477A60] bg-[#FFFFFF] p-1.5 rounded border border-[#477A60]/30 font-medium">
                    <span className="font-bold mr-1">Signature Stylometric Clue:</span>
                    {currentPuzzle.difficultyMetadata?.hints?.stylometryClue || currentPuzzle.hints?.stylometryClue}
                  </div>
                </div>

                {/* Alternative Verified Model Responses */}
                {currentPuzzle.comparisonResponses?.map((alt, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F8F7F3] border border-[#E5E3DE] rounded-md p-3 text-xs flex flex-col gap-1.5">
                    <div className="flex items-center justify-between font-bold text-[#242424]">
                      <div className="flex items-center gap-1.5">
                        <span>{alt.model}</span>
                        <span className="text-[10px] font-mono font-normal text-[#777777] bg-[#FFFFFF] border border-[#E5E3DE] px-1.5 py-0.2 rounded">
                          {alt.version}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-[#242424] italic font-serif-masthead bg-[#FFFFFF] p-2.5 rounded border border-[#E5E3DE]">
                      "{alt.response}"
                    </div>
                    <div className="text-[11px] text-[#6B6966] bg-[#EDF5F0] p-1.5 rounded border border-[#477A60]/20">
                      <span className="font-semibold text-[#477A60] mr-1">Stylometric Note:</span>
                      {alt.keyStylometricNote}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Practice Category Selector (if in Practice Mode) */}
            {gameMode === 'practice' && (
              <div className="w-full bg-[#F8F7F3] border border-[#E5E3DE] rounded-md p-2.5 mb-3 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777] block mb-1">
                  Next Round Category:
                </span>
                <div className="flex flex-wrap gap-1">
                  {PRACTICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        gameAudio.playCrispClick();
                        setSelectedPracticeCategory(cat);
                      }}
                      className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                        selectedPracticeCategory === cat
                          ? 'bg-[#242424] text-white font-semibold'
                          : 'bg-white text-[#6B6966] border border-[#E5E3DE] hover:bg-[#EFECE6]'
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2">
              {gameMode === 'daily' ? (
                <>
                  <button
                    onClick={() => {
                      gameAudio.playCrispClick();
                      restartCurrentPuzzle();
                    }}
                    data-testid="restart-button"
                    className="w-full bg-[#477A60] hover:bg-[#36604A] text-[#FFFFFF] font-semibold text-xs sm:text-sm py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2 min-h-[44px] shadow-sm">
                    <RotateCw size={16} /> Restart &amp; Try Again
                  </button>
                  <button
                    onClick={() => initGame('practice', difficulty, selectedPracticeCategory)}
                    className="w-full bg-[#FFFFFF] hover:bg-[#F8F7F3] text-[#242424] font-medium text-xs sm:text-sm py-2 px-4 rounded border border-[#E5E3DE] flex items-center justify-center gap-2 min-h-[40px] transition-colors">
                    <Sparkles size={15} /> Continue with Unlimited Practice
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full bg-[#FFFFFF] hover:bg-[#F8F7F3] text-[#242424] font-medium text-xs sm:text-sm py-2 px-4 rounded border border-[#E5E3DE] flex items-center justify-center gap-2 min-h-[40px] transition-colors">
                    <Share2 size={15} /> Share Result
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      gameAudio.playCrispClick();
                      restartCurrentPuzzle();
                    }}
                    data-testid="restart-button"
                    className="w-full bg-[#242424] hover:bg-[#3D3D3D] text-[#FFFFFF] font-semibold text-xs sm:text-sm py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2 min-h-[44px]">
                    <RotateCw size={16} /> Restart &amp; Try Again
                  </button>
                  <button
                    onClick={() => initGame('practice', difficulty, selectedPracticeCategory)}
                    className="w-full bg-[#FFFFFF] hover:bg-[#F8F7F3] text-[#242424] font-medium text-xs sm:text-sm py-2 px-4 rounded border border-[#E5E3DE] flex items-center justify-center gap-2 min-h-[40px] transition-colors">
                    <Sparkles size={15} /> Next Practice Round
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full bg-[#FFFFFF] hover:bg-[#F8F7F3] text-[#242424] font-medium text-xs sm:text-sm py-2 px-4 rounded border border-[#E5E3DE] flex items-center justify-center gap-2 min-h-[40px] transition-colors">
                    <Share2 size={15} /> Share Result
                  </button>
                </>
              )}
              <button
                onClick={() => setGameState((prev) => ({...prev, status: 'START'}))}
                className="text-xs text-[#777777] hover:text-[#242424] py-1 transition-colors">
                Return to Home
              </button>
            </div>
          </div>
        </MenuOverlay>
      )}

      {/* ========================================================================= */}
      {/* SYSTEM INFO & UTC VERIFICATION MODAL */}
      {/* ========================================================================= */}
      {isSystemInfoOpen && (
        <MenuOverlay tone="neutral" zIndex={50}>
          <div className="w-full max-w-[500px] bg-[#FFFFFF] border border-[#E5E3DE] rounded-lg p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex flex-col text-left">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E3DE]">
              <div className="flex items-center gap-2 font-serif-masthead text-xl font-bold text-[#242424]">
                <ShieldCheck size={20} className="text-[#477A60]" />
                Verified System Architecture
              </div>
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setIsSystemInfoOpen(false);
                }}
                className="p-1 rounded text-[#777777] hover:text-[#242424]">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#444444] leading-relaxed max-h-96 overflow-y-auto pr-1 touch-auto">
              <div className="p-3 bg-[#F8F7F3] rounded border border-[#E5E3DE]">
                <span className="font-bold text-[#242424] block mb-1">
                  1. Deterministic UTC Daily Synchronization
                </span>
                The daily challenge is deterministically selected using the UTC calendar date (
                <code className="text-[#477A60] font-mono">YYYY-MM-DD</code>) combined with a 32-bit
                Murmur3 hash function. An anti-repetition lookback filter guarantees variety across
                consecutive days while ensuring 100% stability across all reloads, devices, and
                sessions worldwide.
              </div>

              <div className="p-3 bg-[#F8F7F3] rounded border border-[#E5E3DE]">
                <span className="font-bold text-[#242424] block mb-1">
                  2. Pre-Verified Challenge Metadata Standard
                </span>
                Every case in the AIdle library is strictly pre-verified with documented model
                version strings (e.g.{' '}
                <code className="text-[#242424] font-mono">claude-3-5-sonnet-20240620</code>,{' '}
                <code className="text-[#242424] font-mono">gpt-4o-2024-08-06</code>) and verified
                API benchmark timestamps.
              </div>

              <div className="p-3 bg-[#F8F7F3] rounded border border-[#E5E3DE]">
                <span className="font-bold text-[#242424] block mb-1">
                  3. Multi-Model Comparison Engine
                </span>
                Each scenario features verified alternative responses from competing models
                prompted with the exact same instructions, highlighting genuine differences in tone,
                conciseness, emotional nuance, and structure.
              </div>

              <div className="p-3 bg-[#F8F7F3] rounded border border-[#E5E3DE]">
                <span className="font-bold text-[#242424] block mb-1">
                  4. Practice Mode Isolation
                </span>
                Practice mode training operates independently and never affects your Daily Streak,
                total daily score, or UTC daily completion record.
              </div>
            </div>

            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setIsSystemInfoOpen(false);
              }}
              className="mt-4 w-full bg-[#477A60] hover:bg-[#36604A] text-[#FFFFFF] font-medium py-2 rounded text-xs sm:text-sm min-h-[40px] transition-colors">
              Close Information
            </button>
          </div>
        </MenuOverlay>
      )}

      {/* ========================================================================= */}
      {/* GAME SETTINGS / MENU OVERLAY */}
      {/* ========================================================================= */}
      {isGameMenuOpen && (
        <MenuOverlay tone="neutral" zIndex={40} onClose={() => setIsGameMenuOpen(false)}>
          <div className="w-full max-w-[440px] bg-[#FFFFFF] border border-[#E5E3DE] rounded-lg p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex flex-col text-left">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E3DE]">
              <h2 className="font-serif-masthead text-xl font-bold text-[#242424]">
                Menu & Settings
              </h2>
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setIsGameMenuOpen(false);
                }}
                className="p-1 rounded text-[#777777] hover:text-[#242424]">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Resume */}
              {gameState.status === 'PLAYING' && (
                <button
                  onClick={() => {
                    gameAudio.playCrispClick();
                    setIsGameMenuOpen(false);
                  }}
                  autoFocus
                  className="w-full bg-[#477A60] hover:bg-[#36604A] text-[#FFFFFF] font-medium text-xs sm:text-sm py-2.5 rounded flex items-center justify-center gap-2 min-h-[42px]">
                  <Play size={16} /> Resume Puzzle
                </button>
              )}

              {/* Reset / Restart */}
              <button
                data-testid="menu-restart-button"
                onClick={() => {
                  gameAudio.playCrispClick();
                  restartCurrentPuzzle();
                }}
                className="w-full bg-[#FFFFFF] hover:bg-[#F8F7F3] text-[#242424] font-medium text-xs sm:text-sm py-2 rounded border border-[#E5E3DE] flex items-center justify-center gap-2 min-h-[40px]">
                <RotateCw size={14} /> Restart Current Puzzle
              </button>

              {/* Audio Controls */}
              <div className="grid grid-cols-2 gap-2 my-1">
                <button
                  onClick={() => {
                    const newMuted = gameAudio.toggleMute();
                    setSfxMuted(newMuted);
                  }}
                  className={`py-2 px-3 rounded border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors min-h-[40px] ${
                    sfxMuted
                      ? 'bg-[#F8F7F3] border-[#E5E3DE] text-[#9B9994]'
                      : 'bg-[#FFFFFF] border-[#477A60] text-[#477A60]'
                  }`}>
                  {sfxMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  SFX: {sfxMuted ? 'Off' : 'On'}
                </button>

                <button
                  onClick={() => {
                    setMusicMuted((prev) => !prev);
                  }}
                  className={`py-2 px-3 rounded border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors min-h-[40px] ${
                    musicMuted
                      ? 'bg-[#F8F7F3] border-[#E5E3DE] text-[#9B9994]'
                      : 'bg-[#FFFFFF] border-[#477A60] text-[#477A60]'
                  }`}>
                  {musicMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  Music: {musicMuted ? 'Off' : 'On'}
                </button>
              </div>

              {/* How to Play */}
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setIsHowToPlayOpen(true);
                }}
                className="w-full bg-[#FFFFFF] hover:bg-[#F8F7F3] text-[#242424] font-medium text-xs sm:text-sm py-2 rounded border border-[#E5E3DE] flex items-center justify-center gap-2 min-h-[40px]">
                <HelpCircle size={15} className="text-[#777777]" /> How to Play
              </button>

              {/* Stats */}
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setIsStatsOpen(true);
                }}
                className="w-full bg-[#FFFFFF] hover:bg-[#F8F7F3] text-[#242424] font-medium text-xs sm:text-sm py-2 rounded border border-[#E5E3DE] flex items-center justify-center gap-2 min-h-[40px]">
                <Trophy size={15} className="text-[#777777]" /> View Statistics
              </button>

              {/* Exit to Home */}
              {gameState.status === 'PLAYING' && (
                <button
                  onClick={() => {
                    gameAudio.playCrispClick();
                    setIsGameMenuOpen(false);
                    setGameState((prev) => ({...prev, status: 'START'}));
                  }}
                  className="w-full text-xs text-[#B85C54] hover:underline py-2 text-center">
                  Exit to Main Menu
                </button>
              )}
            </div>
          </div>
        </MenuOverlay>
      )}

      {/* ========================================================================= */}
      {/* HOW TO PLAY MODAL (SLEEK 3-STEP MINIMAL EDITORIAL) */}
      {/* ========================================================================= */}
      {isHowToPlayOpen && (
        <MenuOverlay
          tone="neutral"
          zIndex={50}
          maxWidthClass="max-w-[460px]"
          onClose={closeHowToPlay}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tutorial-modal-title"
            className="w-full bg-[#FFFFFF] border border-[#E5E3DE] rounded-xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col text-left relative">
            {/* Header: Prominent Serif Heading + Small Unobtrusive Close Button */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E3DE]">
              <h2
                id="tutorial-modal-title"
                className="font-serif-masthead text-2xl sm:text-3xl font-bold tracking-tight text-[#242424]">
                How to Play
              </h2>
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  closeHowToPlay();
                }}
                aria-label="Close tutorial"
                className="p-1.5 -mr-1 text-[#777777] hover:text-[#242424] hover:bg-[#F8F7F3] rounded-md transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Strictly Three Numbered Steps */}
            <div className="py-5 space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-[#F8F7F3] border border-[#E5E3DE] text-[#477A60] font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[#242424] mb-0.5">
                    Read
                  </div>
                  <div className="text-xs text-[#777777] leading-relaxed">
                    Study the prompt and the AI-generated response.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-[#F8F7F3] border border-[#E5E3DE] text-[#477A60] font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[#242424] mb-0.5">
                    Guess
                  </div>
                  <div className="text-xs text-[#777777] leading-relaxed">
                    Choose which AI model you think wrote the response. You have 5 attempts.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-[#F8F7F3] border border-[#E5E3DE] text-[#477A60] font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[#242424] mb-0.5">
                    Reveal
                  </div>
                  <div className="text-xs text-[#777777] leading-relaxed">
                    Find out whether you&apos;re right and compare the response with other models.
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Divider & Tagline */}
            <div className="border-t border-[#E5E3DE] pt-4 flex flex-col gap-4">
              <p className="text-xs text-[#777777] italic text-center font-serif-masthead sm:text-[13px]">
                One daily challenge. Five guesses. How well do you know AI?
              </p>

              {/* Primary Action Button */}
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  closeHowToPlay();
                }}
                className="w-full bg-[#477A60] hover:bg-[#36604A] text-[#FFFFFF] font-medium text-sm py-2.5 px-5 rounded-lg transition-colors shadow-sm flex items-center justify-center min-h-[42px]">
                Let&apos;s Play
              </button>
            </div>
          </div>
        </MenuOverlay>
      )}

      {/* ========================================================================= */}
      {/* STATISTICS MODAL (WORDLE / NYT STYLE WITH ISOLATED TRACKS) */}
      {/* ========================================================================= */}
      {isStatsOpen && (
        <MenuOverlay tone="neutral" zIndex={50} onClose={() => setIsStatsOpen(false)}>
          <div className="w-full max-w-[480px] bg-[#FFFFFF] border border-[#E5E3DE] rounded-lg p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex flex-col text-center">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E3DE]">
              <h2 className="font-serif-masthead text-xl font-bold text-[#242424]">
                Deduction Statistics
              </h2>
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setIsStatsOpen(false);
                }}
                className="p-1 rounded text-[#777777] hover:text-[#242424]">
                <X size={18} />
              </button>
            </div>

            {/* Daily Challenge Statistics */}
            <div className="text-left mb-3">
              <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#477A60] mb-1.5 flex items-center gap-1">
                <Calendar size={13} /> Daily Challenge Record
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-[#F8F7F3] p-2 rounded border border-[#E5E3DE] text-center">
                  <div className="text-lg font-bold text-[#242424]">{stats.dailyPlayed}</div>
                  <div className="text-[10px] text-[#777777] uppercase tracking-wider">Played</div>
                </div>
                <div className="bg-[#F8F7F3] p-2 rounded border border-[#E5E3DE] text-center">
                  <div className="text-lg font-bold text-[#477A60]">
                    {stats.dailyPlayed > 0
                      ? Math.round((stats.dailyWon / stats.dailyPlayed) * 100)
                      : 0}
                    %
                  </div>
                  <div className="text-[10px] text-[#777777] uppercase tracking-wider">Win %</div>
                </div>
                <div className="bg-[#F8F7F3] p-2 rounded border border-[#E5E3DE] text-center">
                  <div className="text-lg font-bold text-[#242424]">{stats.dailyStreak}</div>
                  <div className="text-[10px] text-[#777777] uppercase tracking-wider">Streak</div>
                </div>
                <div className="bg-[#F8F7F3] p-2 rounded border border-[#E5E3DE] text-center">
                  <div className="text-lg font-bold text-[#242424]">{stats.maxDailyStreak}</div>
                  <div className="text-[10px] text-[#777777] uppercase tracking-wider">Max</div>
                </div>
              </div>
            </div>

            {/* Practice Statistics */}
            <div className="text-left mb-4">
              <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#777777] mb-1.5 flex items-center gap-1">
                <Sparkles size={13} /> Practice Training Record
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#F8F7F3] p-1.5 rounded border border-[#E5E3DE]">
                  <span className="text-[10px] text-[#777777] uppercase block">Rounds</span>
                  <span className="font-bold text-[#242424]">{stats.practicePlayed}</span>
                </div>
                <div className="bg-[#F8F7F3] p-1.5 rounded border border-[#E5E3DE]">
                  <span className="text-[10px] text-[#777777] uppercase block">Solved</span>
                  <span className="font-bold text-[#477A60]">{stats.practiceWon}</span>
                </div>
                <div className="bg-[#F8F7F3] p-1.5 rounded border border-[#E5E3DE]">
                  <span className="text-[10px] text-[#777777] uppercase block">Win %</span>
                  <span className="font-bold text-[#242424]">
                    {stats.practicePlayed > 0
                      ? Math.round((stats.practiceWon / stats.practicePlayed) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Guess Distribution Bar Chart */}
            <div className="w-full bg-[#F8F7F3] border border-[#E5E3DE] rounded p-3 mb-4 text-left font-mono">
              <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#777777] mb-2">
                Guess Distribution
              </div>
              <div className="space-y-1.5">
                {stats.guessDistribution.map((count, i) => {
                  const maxCount = Math.max(1, ...stats.guessDistribution);
                  const pct = Math.round((count / maxCount) * 100);
                  const isCurrentGuessWin =
                    gameState.status === 'VICTORY' && guesses.length === i + 1;
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-right text-[#777777] font-semibold">{i + 1}</span>
                      <div className="flex-1 bg-[#FFFFFF] rounded h-4 overflow-hidden border border-[#E5E3DE]">
                        <div
                          style={{width: `${Math.max(7, pct)}%`}}
                          className={`h-full flex items-center justify-end pr-1.5 text-[10px] font-bold ${
                            isCurrentGuessWin || (count > 0 && !isCurrentGuessWin)
                              ? 'bg-[#477A60] text-[#FFFFFF]'
                              : 'bg-[#E5E3DE] text-[#777777]'
                          }`}>
                          {count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setIsStatsOpen(false);
              }}
              className="w-full bg-[#FFFFFF] hover:bg-[#F8F7F3] text-[#242424] font-medium py-2 rounded border border-[#E5E3DE] min-h-[40px] text-xs transition-colors">
              Close
            </button>
          </div>
        </MenuOverlay>
      )}
    </div>
  );
}
