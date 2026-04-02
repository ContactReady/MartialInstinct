// ============================================
// QUIZ ENGINE — 5 Fragetypen
// single | truefalse | multiple | matching | fillblank
// Practice: 10 Fragen, 2 XP/Frage + 10 Bonus bei 100%
// Exam: 30 Fragen, 90% zum Bestehen
// ============================================

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import { QuizQuestion } from '../../types';
export type { QuizQuestion };

interface QuizEngineProps {
  title: string;
  questions: QuizQuestion[];
  onComplete: (score: number, xpEarned: number) => void;
  onBack: () => void;
  accentColor?: string;
  questionsPerSession?: number;
  mode?: 'practice' | 'exam';
  // Fortschritt speichern (nur Practice/Topic, nicht Exam)
  progressKey?: string;
  // Stern-System
  starredIds?: string[];
  onStar?: (questionId: string) => void;
  onUnstar?: (questionId: string) => void;
  // Flag-System
  flagEnabled?: boolean;
  flaggedIds?: string[];
  onFlag?: (questionId: string, comment: string) => void;
  onUnflag?: (questionId: string) => void;
  // Answer-Tracking (für Exam-Voraussetzung)
  onAnswer?: (questionId: string, correct: boolean) => void;
}

const DEFAULT_QUESTIONS_PER_SESSION = 10;
const EXAM_QUESTIONS = 30;
const XP_PER_CORRECT = 2;
const XP_BONUS_ALL_CORRECT = 10;
const EXAM_PASS_RATE = 0.9; // 90%

// ── Shuffling ─────────────────────────────────────────────────────────────────

/** Nur für single / fillblank: Optionen mischen und correctIndex nachziehen */
function shuffleSingle(q: QuizQuestion): QuizQuestion {
  if (!q.options || q.correctIndex === undefined) return q;
  const correct = q.options[q.correctIndex];
  const shuffled = [...q.options].sort(() => Math.random() - 0.5);
  return { ...q, options: shuffled, correctIndex: shuffled.indexOf(correct) };
}

/** Für multiple: Optionen mischen und correctIndices nachziehen */
function shuffleMultiple(q: QuizQuestion): QuizQuestion {
  if (!q.options || !q.correctIndices) return q;
  const indexed = q.options.map((opt, i) => ({ opt, i }));
  const shuffled = indexed.sort(() => Math.random() - 0.5);
  const newOptions = shuffled.map(s => s.opt);
  const oldToNew: Record<number, number> = {};
  shuffled.forEach((s, newIdx) => { oldToNew[s.i] = newIdx; });
  const newCorrectIndices = q.correctIndices.map(i => oldToNew[i]);
  return { ...q, options: newOptions, correctIndices: newCorrectIndices };
}

/** Exam-Session: einmalig, kein Wiederholen, max EXAM_QUESTIONS */
function buildExamSession(pool: QuizQuestion[]): QuizQuestion[] {
  if (pool.length === 0) return [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, EXAM_QUESTIONS);
  return shuffled.map(q => {
    const type = q.type ?? 'single';
    if (type === 'single' || type === 'fillblank') return shuffleSingle(q);
    if (type === 'multiple') return shuffleMultiple(q);
    return q;
  });
}

/** Practice-Session: Stern-Fragen füllen 25% der Slots, Rest zufällig (mit Wiederholung) */
function buildSession(pool: QuizQuestion[], sessionCount: number, starredIds?: string[]): QuizQuestion[] {
  if (pool.length === 0) return [];

  const starred = starredIds && starredIds.length > 0
    ? pool.filter(q => starredIds.includes(q.id))
    : [];
  const unstarred = pool.filter(q => !starred.find(s => s.id === q.id));

  const starSlots = starred.length > 0 ? Math.max(1, Math.round(sessionCount * 0.25)) : 0;
  const normalSlots = sessionCount - starSlots;

  const pickWithRepeat = (src: QuizQuestion[], count: number): QuizQuestion[] => {
    if (src.length === 0) return [];
    const result: QuizQuestion[] = [];
    const shuffled = [...src].sort(() => Math.random() - 0.5);
    while (result.length < count) {
      const chunk = [...shuffled].sort(() => Math.random() - 0.5).slice(0, count - result.length);
      result.push(...chunk);
    }
    return result.slice(0, count);
  };

  const starPicks = pickWithRepeat(starred, starSlots);
  // Falls nicht genug Stern-Fragen: Lücken mit normalen füllen
  const normalCount = normalSlots + (starSlots - starPicks.length);
  const normalPicks = pickWithRepeat(unstarred.length > 0 ? unstarred : pool, normalCount);

  const session = [...starPicks, ...normalPicks].sort(() => Math.random() - 0.5);
  return session.map(q => {
    const type = q.type ?? 'single';
    if (type === 'single' || type === 'fillblank') return shuffleSingle(q);
    if (type === 'multiple') return shuffleMultiple(q);
    return q;
  });
}

// ── Matching Shuffle (für rechte Seite der Kacheln) ──────────────────────────

function shuffleMatchingRight(pairs: { left: string; right: string }[]) {
  const rights = pairs.map((p, i) => ({ text: p.right, pairIdx: i }));
  return rights.sort(() => Math.random() - 0.5);
}

// ── Farben für Matching-Paare ─────────────────────────────────────────────────

const MATCH_COLORS = [
  { base: 'border-blue-500 bg-blue-500/20 text-blue-300',    badge: 'bg-blue-500' },
  { base: 'border-purple-500 bg-purple-500/20 text-purple-300', badge: 'bg-purple-500' },
  { base: 'border-orange-500 bg-orange-500/20 text-orange-300', badge: 'bg-orange-500' },
  { base: 'border-teal-500 bg-teal-500/20 text-teal-300',    badge: 'bg-teal-500' },
];

// ── Sub-Renderer ──────────────────────────────────────────────────────────────

interface AnswerFeedback {
  correct: boolean;
  answered: boolean;
}

// ─ Single Choice / Fill-in-Blank ─────────────────────────────────────────────

interface SingleProps {
  q: QuizQuestion;
  selected: number | null;
  feedback: AnswerFeedback;
  onSelect: (idx: number) => void;
}

const SingleRenderer: React.FC<SingleProps> = ({ q, selected, feedback, onSelect }) => {
  const isFillBlank = q.type === 'fillblank';
  return (
    <div className="space-y-2">
      {isFillBlank && (
        <div className="bg-gray-900/60 rounded-xl px-4 py-3 border border-gray-700/50 text-center">
          <p className="text-gray-300 text-sm leading-relaxed">
            {q.question.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={`inline-block mx-1 px-3 py-0.5 rounded border font-bold text-sm ${
                    !feedback.answered
                      ? 'border-dashed border-gray-500 text-gray-500 bg-gray-800'
                      : selected === q.correctIndex
                      ? 'border-green-500 text-green-300 bg-green-500/20'
                      : 'border-red-500 text-red-300 bg-red-500/20'
                  }`}>
                    {feedback.answered && selected !== null ? q.options?.[selected] : '___'}
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      )}
      {(q.options ?? []).map((opt, idx) => {
        let cls = 'w-full text-left px-4 py-3.5 rounded-xl border transition-all text-sm font-medium flex items-center gap-3 ';
        if (!feedback.answered) {
          cls += 'bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-500 active:scale-[0.99]';
        } else if (idx === q.correctIndex) {
          cls += 'bg-green-500/20 border-green-500 text-green-300';
        } else if (idx === selected && idx !== q.correctIndex) {
          cls += 'bg-red-500/20 border-red-500 text-red-300';
        } else {
          cls += 'bg-gray-800/40 border-gray-700/40 text-gray-500';
        }
        return (
          <button key={idx} onClick={() => onSelect(idx)} className={cls} disabled={feedback.answered}>
            {!isFillBlank && (
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
            )}
            <span>{opt}</span>
          </button>
        );
      })}
    </div>
  );
};

// ─ True / False ───────────────────────────────────────────────────────────────

interface TrueFalseProps {
  q: QuizQuestion;
  selected: number | null;
  feedback: AnswerFeedback;
  onSelect: (idx: number) => void;
}

const TrueFalseRenderer: React.FC<TrueFalseProps> = ({ q, selected, feedback, onSelect }) => {
  const opts = q.options ?? ['Richtig', 'Falsch'];
  return (
    <div className="flex gap-3">
      {opts.map((opt, idx) => {
        const isCorrect = idx === q.correctIndex;
        const isSelected = idx === selected;
        let cls = 'flex-1 py-5 rounded-2xl border-2 transition-all font-bold text-lg ';
        if (!feedback.answered) {
          cls += 'bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-500 active:scale-95';
        } else if (isCorrect) {
          cls += 'bg-green-500/20 border-green-500 text-green-300';
        } else if (isSelected && !isCorrect) {
          cls += 'bg-red-500/20 border-red-500 text-red-300';
        } else {
          cls += 'bg-gray-800/30 border-gray-700/30 text-gray-600';
        }
        const icon = opt === 'Richtig' ? '✓' : '✗';
        return (
          <button key={idx} onClick={() => onSelect(idx)} className={cls} disabled={feedback.answered}>
            <div className="text-2xl mb-1">{icon}</div>
            <div>{opt}</div>
          </button>
        );
      })}
    </div>
  );
};

// ─ Multiple Choice ────────────────────────────────────────────────────────────

interface MultipleProps {
  q: QuizQuestion;
  selected: Set<number>;
  feedback: AnswerFeedback;
  onToggle: (idx: number) => void;
  onSubmit: () => void;
}

const MultipleRenderer: React.FC<MultipleProps> = ({ q, selected, feedback, onToggle, onSubmit }) => {
  const correctSet = new Set(q.correctIndices ?? []);
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 text-center mb-1">Mehrere Antworten möglich</p>
      {(q.options ?? []).map((opt, idx) => {
        const isChecked = selected.has(idx);
        const isCorrect = correctSet.has(idx);
        let cls = 'w-full text-left px-4 py-3.5 rounded-xl border transition-all text-sm font-medium flex items-center gap-3 ';
        if (!feedback.answered) {
          cls += isChecked
            ? 'bg-yellow-500/15 border-yellow-500/60 text-yellow-200'
            : 'bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-500';
        } else if (isCorrect && isChecked) {
          cls += 'bg-green-500/20 border-green-500 text-green-300';
        } else if (isCorrect && !isChecked) {
          cls += 'bg-green-500/10 border-green-500/50 text-green-400';
        } else if (!isCorrect && isChecked) {
          cls += 'bg-red-500/20 border-red-500 text-red-300';
        } else {
          cls += 'bg-gray-800/40 border-gray-700/40 text-gray-500';
        }
        return (
          <button key={idx} onClick={() => onToggle(idx)} className={cls} disabled={feedback.answered}>
            <span className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
              isChecked ? 'border-yellow-400 bg-yellow-400 text-gray-900' : 'border-gray-500'
            }`}>
              {isChecked && '✓'}
            </span>
            <span>{opt}</span>
          </button>
        );
      })}
      {!feedback.answered && (
        <button
          onClick={onSubmit}
          disabled={selected.size === 0}
          className={`w-full py-3 rounded-xl font-bold text-sm mt-2 transition-all ${
            selected.size > 0
              ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Antwort prüfen
        </button>
      )}
    </div>
  );
};

// ─ Matching ───────────────────────────────────────────────────────────────────

interface MatchingProps {
  q: QuizQuestion;
  onAnswer: (correct: boolean) => void;
}

const MatchingRenderer: React.FC<MatchingProps> = ({ q, onAnswer }) => {
  const pairs = q.pairs ?? [];

  const shuffledRight = useMemo(
    () => shuffleMatchingRight(pairs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q.id]
  );

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  // leftIdx → displayRightIdx
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allMatched = Object.keys(matches).length === pairs.length;

  const getLeftColor = (leftIdx: number) => {
    const displayRightIdx = matches[leftIdx];
    if (displayRightIdx === undefined) return null;
    // Welche Farbe bekommt dieses Paar? Basierend auf leftIdx
    return MATCH_COLORS[leftIdx % MATCH_COLORS.length];
  };

  const getDisplayRightColor = (displayRightIdx: number) => {
    const entry = Object.entries(matches).find(([, dr]) => dr === displayRightIdx);
    if (!entry) return null;
    const leftIdx = Number(entry[0]);
    return MATCH_COLORS[leftIdx % MATCH_COLORS.length];
  };

  const isMatchCorrect = (leftIdx: number) => {
    const displayRightIdx = matches[leftIdx];
    if (displayRightIdx === undefined) return false;
    return shuffledRight[displayRightIdx].pairIdx === leftIdx;
  };

  const handleLeftTap = (idx: number) => {
    if (submitted) return;
    setSelectedLeft(prev => prev === idx ? null : idx);
  };

  const handleRightTap = (displayIdx: number) => {
    if (submitted) return;
    if (selectedLeft === null) return;

    // Verbindung umkehren wenn bereits gematchter rechter Tile getippt
    const existingLeft = Object.entries(matches).find(([, dr]) => dr === displayIdx);

    setMatches(prev => {
      const updated = { ...prev };
      // Rechte Seite des aktuellen Left freimachen, falls bereits gematchт
      if (updated[selectedLeft] !== undefined) {
        delete updated[selectedLeft];
      }
      // Linke Seite des vorherigen Owners freimachen
      if (existingLeft) {
        delete updated[Number(existingLeft[0])];
      }
      updated[selectedLeft] = displayIdx;
      return updated;
    });
    setSelectedLeft(null);
  };

  const handleSubmit = () => {
    if (!allMatched) return;
    setSubmitted(true);
    const allCorrect = pairs.every((_, i) => isMatchCorrect(i));
    onAnswer(allCorrect);
  };

  const matchedLeftIndices = new Set(Object.keys(matches).map(Number));
  const matchedRightDisplayIndices = new Set(Object.values(matches));

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 text-center">Linke Kachel antippen → rechte Kachel antippen zum Verbinden</p>

      <div className="grid grid-cols-2 gap-2">
        {/* Linke Seite */}
        <div className="space-y-2">
          {pairs.map((p, leftIdx) => {
            const color = getLeftColor(leftIdx);
            const isSelected = selectedLeft === leftIdx;
            const isMatched = matchedLeftIndices.has(leftIdx);

            let cls = 'w-full text-left px-3 py-2.5 rounded-xl border-2 text-xs font-medium transition-all min-h-[56px] flex items-center ';
            if (submitted) {
              cls += isMatchCorrect(leftIdx)
                ? 'bg-green-500/20 border-green-500 text-green-300'
                : 'bg-red-500/20 border-red-500 text-red-300';
            } else if (isSelected) {
              cls += 'bg-yellow-500/20 border-yellow-400 text-yellow-200 scale-[1.02]';
            } else if (isMatched && color) {
              cls += color.base;
            } else {
              cls += 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500';
            }

            return (
              <button key={leftIdx} onClick={() => handleLeftTap(leftIdx)} className={cls}>
                <span className="leading-tight">{p.left}</span>
              </button>
            );
          })}
        </div>

        {/* Rechte Seite (shuffled) */}
        <div className="space-y-2">
          {shuffledRight.map((item, displayIdx) => {
            const color = getDisplayRightColor(displayIdx);
            const isMatched = matchedRightDisplayIndices.has(displayIdx);
            const leftOwner = isMatched ? Number(Object.entries(matches).find(([, dr]) => dr === displayIdx)?.[0]) : -1;
            const isCorrectMatch = submitted && isMatched && shuffledRight[displayIdx].pairIdx === leftOwner;
            const isWrongMatch = submitted && isMatched && !isCorrectMatch;

            // Ungematchte rechte Tiles nach Submit: were they supposed to be matched?
            const correctButNotMatched = submitted && !isMatched;

            let cls = 'w-full text-left px-3 py-2.5 rounded-xl border-2 text-xs font-medium transition-all min-h-[56px] flex items-center ';
            if (submitted) {
              if (isCorrectMatch) cls += 'bg-green-500/20 border-green-500 text-green-300';
              else if (isWrongMatch) cls += 'bg-red-500/20 border-red-500 text-red-300';
              else if (correctButNotMatched) cls += 'bg-orange-500/10 border-orange-500/40 text-orange-400';
              else cls += 'bg-gray-800/40 border-gray-700/40 text-gray-500';
            } else if (isMatched && color) {
              cls += color.base;
            } else if (selectedLeft !== null && !isMatched) {
              cls += 'bg-gray-800 border-gray-600 text-gray-200 hover:border-yellow-500/50';
            } else {
              cls += 'bg-gray-800 border-gray-700 text-gray-300';
            }

            return (
              <button key={displayIdx} onClick={() => handleRightTap(displayIdx)} className={cls}>
                <span className="leading-tight">{item.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allMatched}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
            allMatched
              ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {allMatched ? 'Zuordnung prüfen' : `Noch ${pairs.length - Object.keys(matches).length} offen`}
        </button>
      )}
    </div>
  );
};

// ── Progress-Speicherung (localStorage) ──────────────────────────────────────

interface SavedProgress { sessionIds: string[]; index: number; correct: number; }

function loadProgress(key: string): SavedProgress | null {
  try { const raw = localStorage.getItem(`mi-quiz-progress-${key}`); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}
function saveProgress(key: string, data: SavedProgress) {
  try { localStorage.setItem(`mi-quiz-progress-${key}`, JSON.stringify(data)); } catch {}
}
function clearProgress(key: string) {
  try { localStorage.removeItem(`mi-quiz-progress-${key}`); } catch {}
}

// ── Haupt-QuizEngine ──────────────────────────────────────────────────────────

export const QuizEngine: React.FC<QuizEngineProps> = ({
  title,
  questions,
  onComplete,
  onBack,
  accentColor = 'bg-green-600',
  questionsPerSession,
  mode = 'practice',
  progressKey,
  starredIds,
  onStar,
  onUnstar,
  flagEnabled = false,
  flaggedIds,
  onFlag,
  onUnflag,
  onAnswer,
}) => {
  const isExam = mode === 'exam';
  const sessionCount = isExam ? Math.min(EXAM_QUESTIONS, questions.length) : (questionsPerSession ?? DEFAULT_QUESTIONS_PER_SESSION);

  // Gespeicherter Fortschritt (einmalig beim Mount laden)
  const savedRef = useRef<SavedProgress | null>(
    progressKey && !isExam ? loadProgress(progressKey) : null
  );

  const [session] = useState<QuizQuestion[]>(() => {
    const saved = savedRef.current;
    if (saved?.sessionIds?.length) {
      const qMap = new Map(questions.map(q => [q.id, q]));
      const restored = saved.sessionIds.map(id => qMap.get(id)).filter((q): q is QuizQuestion => !!q);
      if (restored.length === saved.sessionIds.length) return restored;
    }
    return isExam ? buildExamSession(questions) : buildSession(questions, sessionCount, starredIds);
  });

  const [index, setIndex] = useState(() => savedRef.current?.index ?? 0);
  const [correct, setCorrect] = useState(() => savedRef.current?.correct ?? 0);
  const [done, setDone] = useState(false);

  // Exam-Abbruch Warnung
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Per-Frage State
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedMultiple, setSelectedMultiple] = useState<Set<number>>(new Set());

  // Flag-Modal State
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const flagTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll-Lock + Focus wenn Flag-Modal öffnet/schließt
  useEffect(() => {
    if (showFlagModal) {
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => flagTextareaRef.current?.focus(), 50);
      return () => { clearTimeout(t); document.body.style.overflow = ''; };
    } else {
      document.body.style.overflow = '';
    }
  }, [showFlagModal]);

  const q = session[index];
  const qType = q?.type ?? 'single';

  const score = done ? Math.round((correct / sessionCount) * 100) : 0;
  const xpEarned = isExam ? 0 : correct * XP_PER_CORRECT + (correct === sessionCount ? XP_BONUS_ALL_CORRECT : 0);
  const examPassed = isExam && score >= Math.round(EXAM_PASS_RATE * 100);

  const currentStarred = q ? (starredIds?.includes(q.id) ?? false) : false;
  const currentFlagged = q ? (flaggedIds?.includes(q.id) ?? false) : false;

  const registerAnswer = (ok: boolean) => {
    setIsCorrect(ok);
    setAnswered(true);
    if (ok) setCorrect(c => c + 1);
    if (q && onAnswer) onAnswer(q.id, ok);
  };

  const handleStarToggle = () => {
    if (!q) return;
    if (currentStarred) onUnstar?.(q.id);
    else onStar?.(q.id);
  };

  const handleFlagSubmit = () => {
    if (!q || !flagComment.trim()) return;
    onFlag?.(q.id, flagComment.trim());
    setFlagComment('');
    setShowFlagModal(false);
  };

  const handleUnflag = () => {
    if (!q) return;
    onUnflag?.(q.id);
  };

  const handleSelectSingle = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    registerAnswer(idx === (q.correctIndex ?? -1));
  };

  const handleToggleMultiple = (idx: number) => {
    if (answered) return;
    setSelectedMultiple(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleSubmitMultiple = () => {
    if (answered) return;
    const correctSet = new Set(q.correctIndices ?? []);
    const ok =
      selectedMultiple.size === correctSet.size &&
      [...selectedMultiple].every(i => correctSet.has(i));
    registerAnswer(ok);
  };

  const handleMatchingAnswer = (ok: boolean) => {
    registerAnswer(ok);
  };

  const handleNext = () => {
    const nextIndex = index + 1;
    if (nextIndex >= sessionCount) {
      setDone(true);
      if (progressKey && !isExam) clearProgress(progressKey);
    } else {
      if (progressKey && !isExam) {
        saveProgress(progressKey, { sessionIds: session.map(q => q.id), index: nextIndex, correct });
      }
      setIndex(nextIndex);
      setAnswered(false);
      setIsCorrect(false);
      setSelected(null);
      setSelectedMultiple(new Set());
    }
  };

  const handleBack = () => {
    if (isExam && !done) { setShowExitConfirm(true); } else { onBack(); }
  };

  // ── Ergebnis-Screen ────────────────────────────────────────────────────────
  if (done) {
    const passed = isExam ? examPassed : score >= 70;
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 pb-28 text-center space-y-5">
        {isExam && (
          <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Modulprüfung</div>
        )}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${passed ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
          {passed ? '🏆' : '💪'}
        </div>
        <div>
          <div className={`text-4xl font-black ${passed ? 'text-green-400' : 'text-orange-400'}`}>{score}%</div>
          <div className="text-gray-400 mt-1">{correct} von {sessionCount} richtig</div>
          {isExam && (
            <div className="text-xs text-gray-500 mt-1">Bestehensgrenze: {Math.round(EXAM_PASS_RATE * 100)}%</div>
          )}
        </div>

        {!isExam && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-6 py-3">
            <div className="text-yellow-400 font-bold text-xl">+{xpEarned} XP</div>
            <div className="text-yellow-500/80 text-sm">
              {correct * XP_PER_CORRECT} Basis{correct === sessionCount ? ` + ${XP_BONUS_ALL_CORRECT} Bonus (alle richtig!)` : ''}
            </div>
          </div>
        )}

        {isExam && passed && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-6 py-3">
            <div className="text-yellow-400 font-bold text-xl">+80 XP</div>
            <div className="text-yellow-500/80 text-sm">Prüfung bestanden!</div>
          </div>
        )}

        <div className={`text-base font-semibold ${passed ? 'text-green-400' : 'text-orange-400'}`}>
          {isExam
            ? (passed ? 'Modul bestanden! Glückwunsch!' : 'Nicht bestanden — übe weiter und versuche es erneut.')
            : (passed ? 'Stark! Weiter so!' : 'Noch etwas Übung nötig — Wiederholung ist der Schlüssel!')}
        </div>

        <div className="flex gap-3 w-full max-w-xs pt-2">
          {!isExam && (
            <button
              onClick={() => {
                setIndex(0); setSelected(null); setSelectedMultiple(new Set());
                setAnswered(false); setIsCorrect(false); setCorrect(0); setDone(false);
              }}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all"
            >
              Nochmal
            </button>
          )}
          <button
            onClick={() => onComplete(score, xpEarned)}
            className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${accentColor} hover:opacity-90`}
          >
            {isExam ? (passed ? 'Abschließen →' : 'Zurück') : 'Fertig'}
          </button>
        </div>
      </div>
    );
  }

  // ── Frage-Screen ───────────────────────────────────────────────────────────
  const feedback: AnswerFeedback = { correct: isCorrect, answered };

  return (
    <div className="flex flex-col h-full">
      {/* Exam-Abbruch Bestätigung */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-t-2xl p-5 space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl">⚠️</div>
              <div className="font-bold text-white text-lg">Prüfung abbrechen?</div>
              <p className="text-gray-400 text-sm">Dein Fortschritt geht verloren. Du musst die Prüfung erneut von vorne starten.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold text-sm">
                Weiter machen
              </button>
              <button onClick={onBack} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-semibold text-sm">
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flag-Modal */}
      {showFlagModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onPointerDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
        >
          <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-t-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">🚩 Frage melden</span>
              <button onClick={() => { setShowFlagModal(false); setFlagComment(''); }} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <p className="text-gray-400 text-sm">Was stimmt an dieser Frage nicht? (Fehler, unklare Formulierung, falsches Ergebnis…)</p>
            <textarea
              ref={flagTextareaRef}
              value={flagComment}
              onChange={e => setFlagComment(e.target.value)}
              placeholder="Beschreibe das Problem kurz…"
              rows={3}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-red-500"
            />
            <div className="flex gap-3">
              <button onClick={() => { setShowFlagModal(false); setFlagComment(''); }} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold text-sm">
                Abbrechen
              </button>
              <button
                onClick={handleFlagSubmit}
                disabled={!flagComment.trim()}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${flagComment.trim() ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
              >
                Melden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700/50 flex-shrink-0">
        <button onClick={handleBack} className="text-gray-400 hover:text-white text-2xl leading-none flex-shrink-0">←</button>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm truncate">{title}</div>
          {isExam && <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Prüfungsmodus</div>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Stern-Button (nur Practice) */}
          {!isExam && (onStar || onUnstar) && q && (
            <button
              onClick={handleStarToggle}
              title={currentStarred ? 'Stern entfernen' : 'Als Lernfrage markieren'}
              className={`text-xl transition-all active:scale-90 ${currentStarred ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-500'}`}
            >
              {currentStarred ? '⭐' : '☆'}
            </button>
          )}
          {/* Flag-Button */}
          {flagEnabled && q && (
            currentFlagged ? (
              <button
                onClick={handleUnflag}
                title="Meldung zurückziehen"
                className="text-lg text-red-500 hover:text-red-400 transition-all active:scale-90"
              >
                🚩
              </button>
            ) : (
              <button
                onClick={() => setShowFlagModal(true)}
                title="Frage melden"
                className="text-lg text-gray-600 hover:text-red-500 transition-all active:scale-90"
              >
                🏳
              </button>
            )
          )}
          <div className="text-sm font-bold text-gray-400">{index + 1} / {sessionCount}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0 space-y-1.5">
        <ProgressBar progress={(index / sessionCount) * 100} color={isExam ? 'bg-red-500' : 'bg-yellow-500'} height="h-2" />
        <div className="flex justify-between text-xs text-gray-500">
          {!isExam
            ? <span>⚡ {correct * XP_PER_CORRECT} XP bisher</span>
            : <span className="text-red-400/70 font-medium">Prüfung · {Math.round(EXAM_PASS_RATE * 100)}% zum Bestehen</span>
          }
          <span>✓ {correct} richtig</span>
        </div>
      </div>

      {/* Fragetyp-Badge */}
      <div className="px-4 pb-1 flex-shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
          {qType === 'truefalse' ? 'Richtig oder Falsch' :
           qType === 'multiple'  ? 'Mehrfachauswahl' :
           qType === 'matching'  ? 'Zuordnung' :
           qType === 'fillblank' ? 'Lückentext' : 'Auswahl'}
        </span>
      </div>

      {/* Inhalt */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {/* Frage (nicht bei fillblank — die Frage ist im Satz selbst) */}
        {qType !== 'fillblank' && (
          <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
            <p className="text-white font-medium leading-relaxed text-base">{q.question}</p>
          </div>
        )}
        {qType === 'fillblank' && (
          <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
            <p className="text-xs text-gray-500 mb-2">Ergänze den Lückentext:</p>
            <p className="text-white font-medium leading-relaxed text-base">
              {q.question.split('___').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className={`inline-block mx-1 px-3 py-0.5 rounded border font-bold text-sm align-middle ${
                      !answered
                        ? 'border-dashed border-gray-500 text-gray-500 bg-gray-800'
                        : selected === q.correctIndex
                        ? 'border-green-500 text-green-300 bg-green-500/20'
                        : 'border-red-500 text-red-300 bg-red-500/20'
                    }`}>
                      {answered && selected !== null ? q.options?.[selected] : '___'}
                    </span>
                  )}
                </span>
              ))}
            </p>
          </div>
        )}

        {/* Renderer pro Typ */}
        {(qType === 'single' || qType === 'fillblank') && (
          <SingleRenderer q={q} selected={selected} feedback={feedback} onSelect={handleSelectSingle} />
        )}
        {qType === 'truefalse' && (
          <TrueFalseRenderer q={q} selected={selected} feedback={feedback} onSelect={handleSelectSingle} />
        )}
        {qType === 'multiple' && (
          <MultipleRenderer
            q={q}
            selected={selectedMultiple}
            feedback={feedback}
            onToggle={handleToggleMultiple}
            onSubmit={handleSubmitMultiple}
          />
        )}
        {qType === 'matching' && (
          <MatchingRenderer key={q.id} q={q} onAnswer={handleMatchingAnswer} />
        )}

        {/* Feedback */}
        {answered && qType !== 'matching' && (
          <div className={`rounded-xl p-4 border ${isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
            <div className={`font-bold mb-1.5 ${isCorrect ? 'text-green-400' : 'text-orange-400'}`}>
              {isCorrect ? '✅ Richtig!' : '❌ Nicht ganz...'}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{q.explanation ?? 'Keine weitere Erklärung.'}</p>
          </div>
        )}
        {answered && qType === 'matching' && (
          <div className={`rounded-xl p-4 border ${isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
            <div className={`font-bold mb-1.5 ${isCorrect ? 'text-green-400' : 'text-orange-400'}`}>
              {isCorrect ? '✅ Alle Paare richtig!' : '❌ Nicht alle Paare korrekt'}
            </div>
            {q.explanation && <p className="text-sm text-gray-300 leading-relaxed">{q.explanation}</p>}
          </div>
        )}
      </div>

      {/* Weiter-Button */}
      {answered && (
        <div className="px-4 pb-6 pt-2 flex-shrink-0">
          <button
            onClick={handleNext}
            className={`w-full text-white py-3.5 rounded-xl font-bold text-base transition-all ${accentColor} hover:opacity-90`}
          >
            {index + 1 >= sessionCount ? 'Ergebnis sehen →' : 'Weiter →'}
          </button>
        </div>
      )}
    </div>
  );
};
