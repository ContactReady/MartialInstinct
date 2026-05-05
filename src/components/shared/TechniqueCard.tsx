// ============================================
// TECHNIQUE CARD — Zwei-Ebenen Prüfsystem
// Tactical ◐ und Combat ● pro Technik
// ============================================

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Technique, TechniqueProgress, TechniqueStatus } from '../../types';

interface TechniqueCardProps {
  technique: Technique;
  progress?: TechniqueProgress;
  mode: 'member' | 'instructor';
  onLogPractice?: () => void;
  onRequestExam?: () => void;
  onMarkPassed?: (notes?: string) => void;
  canExamine?: boolean;
  onClick?: () => void;
}

const formatDate = (date: Date | undefined): string =>
  date ? new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

// Zwei-Level Status-Chip
const LevelChip: React.FC<{
  label: string;
  passedAt?: Date;
  examinerName?: string;
  pending: boolean;
}> = ({ label, passedAt, examinerName, pending }) => {
  if (passedAt) {
    return (
      <div className="flex items-center gap-1 bg-green-500/15 border border-green-500/30 rounded-lg px-2 py-1">
        <span className="text-green-400 text-xs">●</span>
        <span className="text-green-400 text-xs font-medium">{label}</span>
        {examinerName && <span className="text-green-400/60 text-xs hidden sm:inline">· {examinerName}</span>}
      </div>
    );
  }
  if (pending) {
    return (
      <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-2 py-1">
        <Loader2 className="w-3 h-3 animate-spin text-yellow-400" />
        <span className="text-yellow-400 text-xs font-medium">{label}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 bg-gray-700/40 border border-gray-600/30 rounded-lg px-2 py-1">
      <span className="text-gray-500 text-xs">○</span>
      <span className="text-gray-500 text-xs">{label}</span>
    </div>
  );
};

export const TechniqueCard: React.FC<TechniqueCardProps> = ({
  technique,
  progress,
  mode,
  onLogPractice,
  onRequestExam,
  onMarkPassed,
  canExamine = false,
  onClick,
}) => {
  const [showNoteField, setShowNoteField] = useState(false);
  const [note, setNote] = useState('');

  const status: TechniqueStatus = progress?.status ?? 'not_tested';
  const practiceCount = progress?.practiceCount ?? 0;

  const techPassed = status === 'tech_passed' || status === 'tac_passed';
  const tacPassed = status === 'tac_passed';
  const techPending = status === 'tech_pending';
  const tacPending = status === 'tac_pending';
  const fullyMastered = tacPassed;
  const needsTraining = status === 'needs_training';

  const MIN_PRACTICE_FOR_EXAM = 5;
  const hasEnoughPractice = practiceCount >= MIN_PRACTICE_FOR_EXAM;

  // Tages-Limit: heute schon selbst markiert?
  const todayStr = new Date().toDateString();
  const alreadyPracticedToday =
    !!progress?.lastSelfPracticedAt &&
    new Date(progress.lastSelfPracticedAt).toDateString() === todayStr;

  const canRequestExam = status === 'not_tested' || status === 'needs_training' || status === 'tech_passed';
  const isPending = techPending || tacPending;

  const handleMarkPassed = () => {
    onMarkPassed?.(note.trim() || undefined);
    setNote('');
    setShowNoteField(false);
  };

  const cardBorder = fullyMastered
    ? 'border-green-500/30'
    : techPassed
    ? 'border-blue-500/20'
    : isPending
    ? 'border-yellow-500/20'
    : 'border-gray-700';

  return (
    <div
      className={`bg-gray-800/50 rounded-xl border overflow-hidden transition-all ${cardBorder} ${onClick ? 'cursor-pointer hover:border-gray-500 active:scale-[0.99]' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-semibold truncate">{technique.name}</span>
              {technique.isRequired && (
                <span className="flex-shrink-0 bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded border border-red-500/20">
                  Pflicht
                </span>
              )}
              {fullyMastered && (
                <span className="flex-shrink-0 bg-green-500/20 text-green-400 text-xs px-1.5 py-0.5 rounded border border-green-500/30">
                  Gemeistert
                </span>
              )}
              {needsTraining && (
                <span className="flex-shrink-0 bg-orange-500/20 text-orange-400 text-xs px-1.5 py-0.5 rounded border border-orange-500/20">
                  ↩ Nachtrainieren
                </span>
              )}
            </div>
            {technique.description && (
              <div className="text-gray-400 text-xs mt-0.5 line-clamp-1">{technique.description}</div>
            )}
          </div>
        </div>

        {/* Zwei-Level Chips */}
        <div className="mt-3 flex gap-2 flex-wrap">
          <LevelChip
            label="Tactical"
            passedAt={progress?.techPassedAt}
            examinerName={progress?.techExaminerName}
            pending={techPending}
          />
          <LevelChip
            label="Combat"
            passedAt={progress?.tacPassedAt}
            examinerName={progress?.tacExaminerName}
            pending={tacPending}
          />
        </div>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
          {practiceCount > 0 && (
            <span>🏋️ <span className="text-gray-300 font-medium">{practiceCount}×</span> geübt</span>
          )}
          {progress?.lastPracticedAt && (
            <span>📅 {formatDate(progress.lastPracticedAt)}</span>
          )}
        </div>

        {/* Trainer-Feedback */}
        {progress?.lastFeedback && (
          <div className="mt-2 bg-gray-700/40 rounded-lg px-3 py-2 text-xs text-gray-300 italic border-l-2 border-yellow-500/50">
            💬 {progress.lastFeedback}
          </div>
        )}
      </div>

      {/* Aktionsbereich Member */}
      {mode === 'member' && !onClick && (
        <div className="border-t border-gray-700/50 px-4 py-3 space-y-2">
          {/* Üben-Zeile */}
          <div className="flex items-center gap-2">
            <button
              onClick={e => { e.stopPropagation(); if (!alreadyPracticedToday) onLogPractice?.(); }}
              disabled={alreadyPracticedToday}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                alreadyPracticedToday
                  ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
              title={alreadyPracticedToday ? 'Heute bereits markiert' : ''}
            >
              🏋️ Als geübt markieren
            </button>

            {/* X/5 Fortschrittsanzeige */}
            <div className="flex items-center gap-1">
              {Array.from({ length: MIN_PRACTICE_FOR_EXAM }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < practiceCount ? 'bg-blue-400' : 'bg-gray-600'}`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">
                {Math.min(practiceCount, MIN_PRACTICE_FOR_EXAM)}/{MIN_PRACTICE_FOR_EXAM}
              </span>
            </div>

            {alreadyPracticedToday && (
              <span className="text-xs text-gray-500 italic">Heute erledigt</span>
            )}
          </div>

          {/* Prüfungsanfrage-Zeile */}
          {canRequestExam && !isPending && (
            hasEnoughPractice ? (
              <button
                onClick={e => { e.stopPropagation(); onRequestExam?.(); }}
                className="w-full bg-yellow-600/80 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              >
                {techPassed ? '🔶 Combat prüfen' : '🔷 Tactical prüfen'}
              </button>
            ) : (
              <div className="w-full bg-gray-700/40 border border-gray-600/30 rounded-lg px-3 py-1.5 text-center">
                <span className="text-gray-500 text-xs">
                  🔒 Mindestens {MIN_PRACTICE_FOR_EXAM}× üben für Prüfungsanfrage
                  ({practiceCount}/{MIN_PRACTICE_FOR_EXAM})
                </span>
              </div>
            )
          )}
          {isPending && (
            <div className="w-full flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5">
              <Loader2 className="w-3 h-3 animate-spin text-yellow-400" />
              <span className="text-yellow-400 text-sm">Prüfung ausstehend…</span>
            </div>
          )}
        </div>
      )}

      {/* Aktionsbereich Instructor */}
      {mode === 'instructor' && canExamine && !fullyMastered && (
        <div className="border-t border-gray-700/50 px-4 py-3 space-y-2">
          {showNoteField ? (
            <>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Notiz für den Schüler (optional)…"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 resize-none focus:outline-none focus:border-green-500"
                rows={2}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleMarkPassed}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white py-1.5 rounded-lg text-sm font-medium transition-all"
                >
                  ✅ Combat bestanden
                </button>
                <button
                  onClick={() => { setShowNoteField(false); setNote(''); }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 py-1.5 rounded-lg text-sm transition-all"
                >
                  Abbrechen
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowNoteField(true)}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-1.5 rounded-lg text-sm font-medium transition-all"
            >
              ✅ Als Combat markieren
            </button>
          )}
        </div>
      )}
    </div>
  );
};
