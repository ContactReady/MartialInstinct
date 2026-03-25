// ============================================
// QUIZ ENGINE — Gemeinsame Duolingo-Style Quiz-Komponente
// Immer 10 Fragen pro Session, aus einem Pool zufällig gewählt.
// Fragen werden bei Bedarf wiederholt bis 10 erreicht sind.
// XP: 10 Punkte pro richtige Antwort = max 100 XP pro Session.
// ============================================

import React, { useState, useMemo } from 'react';
import { ProgressBar } from './ProgressBar';
import { QuizQuestion } from '../../types';
export type { QuizQuestion };

interface QuizEngineProps {
  title: string;
  questions: QuizQuestion[];   // Gesamter Fragenpool
  onComplete: (score: number, xpEarned: number) => void;
  onBack: () => void;
  accentColor?: string;        // Tailwind bg class, z.B. 'bg-green-600'
  questionsPerSession?: number; // Standard: 10
}

const DEFAULT_QUESTIONS_PER_SESSION = 10;
const XP_PER_CORRECT = 10;

// Antwortoptionen einer Frage mischen und correctIndex entsprechend aktualisieren
function shuffleOptions(q: QuizQuestion): QuizQuestion {
  const correctAnswer = q.options[q.correctIndex];
  const shuffled = [...q.options].sort(() => Math.random() - 0.5);
  return { ...q, options: shuffled, correctIndex: shuffled.indexOf(correctAnswer) };
}

// Fragen zufällig mischen und auf sessionCount auffüllen (mit Wiederholung wenn nötig)
function buildSession(pool: QuizQuestion[], sessionCount: number): QuizQuestion[] {
  if (pool.length === 0) return [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const session: QuizQuestion[] = [];
  while (session.length < sessionCount) {
    const needed = sessionCount - session.length;
    const chunk = [...shuffled].sort(() => Math.random() - 0.5).slice(0, needed);
    session.push(...chunk);
  }
  return session.slice(0, sessionCount).map(shuffleOptions);
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  title,
  questions,
  onComplete,
  onBack,
  accentColor = 'bg-green-600',
  questionsPerSession
}) => {
  const sessionCount = questionsPerSession ?? DEFAULT_QUESTIONS_PER_SESSION;
  const session = useMemo(() => buildSession(questions, sessionCount), [questions, sessionCount]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const q = session[index];
  const isCorrect = selected === q?.correctIndex;
  const score = done ? Math.round((correct / sessionCount) * 100) : 0;
  const xpEarned = correct * XP_PER_CORRECT;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correctIndex) setCorrect(c => c + 1);
  };

  const handleNext = () => {
    if (index + 1 >= sessionCount) {
      setDone(true);
    } else {
      setIndex(i => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  // ── Ergebnis-Screen ──────────────────────────────────────────────
  if (done) {
    const passed = score >= 70;
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 pb-28 text-center space-y-5">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${passed ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
          {passed ? '🏆' : '💪'}
        </div>
        <div>
          <div className={`text-4xl font-black ${passed ? 'text-green-400' : 'text-orange-400'}`}>{score}%</div>
          <div className="text-gray-400 mt-1">{correct} von {sessionCount} richtig</div>
        </div>

        {/* XP Badge */}
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-6 py-3">
          <div className="text-yellow-400 font-bold text-xl">+{xpEarned} XP</div>
          <div className="text-yellow-500/80 text-sm">Erfahrungspunkte verdient</div>
        </div>

        <div className={`text-base font-semibold ${passed ? 'text-green-400' : 'text-orange-400'}`}>
          {passed
            ? 'Stark! Weiter so!'
            : 'Noch etwas Übung nötig — Wiederholung ist der Schlüssel!'}
        </div>

        <div className="flex gap-3 w-full max-w-xs pt-2">
          <button
            onClick={() => {
              setIndex(0);
              setSelected(null);
              setAnswered(false);
              setCorrect(0);
              setDone(false);
            }}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all"
          >
            Nochmal
          </button>
          <button
            onClick={() => onComplete(score, xpEarned)}
            className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${accentColor} hover:opacity-90`}
          >
            Fertig
          </button>
        </div>
      </div>
    );
  }

  // ── Frage-Screen ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700/50 flex-shrink-0">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-2xl leading-none">←</button>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm truncate">{title}</div>
        </div>
        <div className="text-sm font-bold text-gray-400 flex-shrink-0">
          {index + 1} / {sessionCount}
        </div>
      </div>

      {/* Progress + XP counter */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0 space-y-1.5">
        <ProgressBar
          progress={((index) / sessionCount) * 100}
          color="bg-yellow-500"
          height="h-2"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>⚡ {correct * XP_PER_CORRECT} XP bisher</span>
          <span>✓ {correct} richtig</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
          <p className="text-white font-medium leading-relaxed text-base">{q.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            let cls = 'w-full text-left px-4 py-3.5 rounded-xl border transition-all text-sm font-medium flex items-center gap-3 ';
            if (!answered) {
              cls += 'bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-500 hover:bg-gray-750 active:scale-[0.99]';
            } else if (idx === q.correctIndex) {
              cls += 'bg-green-500/20 border-green-500 text-green-300';
            } else if (idx === selected && !isCorrect) {
              cls += 'bg-red-500/20 border-red-500 text-red-300';
            } else {
              cls += 'bg-gray-800/40 border-gray-700/40 text-gray-500';
            }
            return (
              <button key={idx} onClick={() => handleSelect(idx)} className={cls}>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className={`rounded-xl p-4 border ${isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
            <div className={`font-bold mb-1.5 ${isCorrect ? 'text-green-400' : 'text-orange-400'}`}>
              {isCorrect ? '✅ Richtig!' : '❌ Nicht ganz...'}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{q.explanation || 'Keine weitere Erklärung.'}</p>
          </div>
        )}
      </div>

      {/* Next */}
      {answered && (
        <div className="px-4 pb-24 pt-2 flex-shrink-0">
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
