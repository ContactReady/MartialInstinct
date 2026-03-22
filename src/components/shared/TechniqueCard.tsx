// ============================================
// TECHNIQUE CARD — Fortschritts-Karte
// Wiederverwendbar für Member- und Instructor-Ansicht
// ============================================

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Technique, TechniqueProgress, STATUS_DISPLAY, TechniqueStatus } from '../../types';

interface TechniqueCardProps {
  technique: Technique;
  progress?: TechniqueProgress;
  mode: 'member' | 'instructor';
  onLogPractice?: () => void;
  onRequestExam?: () => void;
  onMarkPassed?: (notes?: string) => void;
  canExamine?: boolean;
}

const isPassed = (status: TechniqueStatus): boolean =>
  status !== 'not_tested' && status !== 'requested';

const formatDate = (date: Date): string =>
  new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const TechniqueCard: React.FC<TechniqueCardProps> = ({
  technique,
  progress,
  mode,
  onLogPractice,
  onRequestExam,
  onMarkPassed,
  canExamine = false
}) => {
  const [showNoteField, setShowNoteField] = useState(false);
  const [note, setNote] = useState('');

  const status = progress?.status ?? 'not_tested';
  const statusInfo = STATUS_DISPLAY[status];
  const passed = isPassed(status);
  const practiceCount = progress?.practiceCount ?? 0;

  const handleMarkPassed = () => {
    onMarkPassed?.(note.trim() || undefined);
    setNote('');
    setShowNoteField(false);
  };

  // Status-Badge Hintergrundfarbe
  const badgeBg = passed
    ? 'bg-green-500/20 border border-green-500/30'
    : status === 'requested'
      ? 'bg-yellow-500/20 border border-yellow-500/30'
      : 'bg-gray-700/50 border border-gray-600/30';

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Status-Badge + Name */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`flex-shrink-0 px-2 py-1 rounded-lg text-sm flex items-center gap-1 ${badgeBg}`}>
              <span>{statusInfo.icon}</span>
              <span className={`font-medium text-xs ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
            <div className="min-w-0">
              <div className="text-white font-semibold truncate">{technique.name}</div>
              {technique.description && (
                <div className="text-gray-400 text-xs mt-0.5 line-clamp-1">{technique.description}</div>
              )}
            </div>
          </div>

          {/* Pflicht-Badge */}
          {technique.isRequired && (
            <span className="flex-shrink-0 bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded border border-red-500/20">
              Pflicht
            </span>
          )}
        </div>

        {/* Meta-Infos: Übungszähler + Datum + Bewerter */}
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            🏋️ <span className="text-gray-300 font-medium">{practiceCount}×</span> geübt
          </span>
          {progress?.lastPracticedAt && (
            <span className="flex items-center gap-1">
              📅 Zuletzt: <span className="text-gray-300">{formatDate(progress.lastPracticedAt)}</span>
            </span>
          )}
          {passed && progress?.examinerName && (
            <span className="flex items-center gap-1">
              👤 <span className="text-gray-300">{progress.examinerName}</span>
            </span>
          )}
          {passed && progress?.examinedAt && (
            <span className="flex items-center gap-1">
              ✅ {formatDate(progress.examinedAt)}
            </span>
          )}
        </div>

        {/* Notiz vom Instructor (wenn vorhanden) */}
        {progress?.notes && (
          <div className="mt-2 bg-gray-700/40 rounded-lg px-3 py-2 text-xs text-gray-300 italic border-l-2 border-yellow-500/50">
            💬 {progress.notes}
          </div>
        )}
      </div>

      {/* Aktionsbereich */}
      {mode === 'member' && !passed && (
        <div className="border-t border-gray-700/50 px-4 py-3 flex gap-2">
          {/* Als geübt markieren */}
          <button
            onClick={onLogPractice}
            className="flex-shrink-0 bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
          >
            🏋️ Als geübt
          </button>

          {/* Prüfung anfragen */}
          {status === 'not_tested' ? (
            <button
              onClick={onRequestExam}
              className="flex-1 bg-yellow-600/80 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            >
              🟡 Prüfung anfragen
            </button>
          ) : status === 'requested' ? (
            <div className="flex-1 flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5">
              <Loader2 className="w-3 h-3 animate-spin text-yellow-400" />
              <span className="text-yellow-400 text-sm">Prüfung ausstehend…</span>
            </div>
          ) : null}
        </div>
      )}

      {/* Member-Mode: auch bei bestandenen Techniken "als geübt" erlauben */}
      {mode === 'member' && passed && (
        <div className="border-t border-gray-700/50 px-4 py-3">
          <button
            onClick={onLogPractice}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
          >
            🏋️ Als geübt markieren
          </button>
        </div>
      )}

      {/* Instructor-Mode: Bestanden-Button */}
      {mode === 'instructor' && canExamine && !passed && (
        <div className="border-t border-gray-700/50 px-4 py-3 space-y-2">
          {showNoteField ? (
            <>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Optionale Notiz für den Schüler…"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 resize-none focus:outline-none focus:border-green-500"
                rows={2}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleMarkPassed}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white py-1.5 rounded-lg text-sm font-medium transition-all"
                >
                  ✅ Bestätigen
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
            <div className="flex gap-2">
              <button
                onClick={() => setShowNoteField(true)}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-1.5 rounded-lg text-sm font-medium transition-all"
              >
                ✅ Bestanden markieren
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
