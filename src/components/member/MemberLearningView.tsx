// ============================================
// MEMBER LEARNING VIEW — Duolingo-Style Lernplattform
// Wissen aus den 10 Modulen als Quiz-basiertes Lernsystem
// ============================================

import React, { useState } from 'react';
import { CertificateView } from './CertificateView';
import { ChevronLeft, Star, Zap, BookOpen, Trophy, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { useApp, BLOCKS } from '../../context/AppContext';
import { QuizEngine } from '../shared/QuizEngine';
import { ProgressBar } from '../shared/ProgressBar';
import { Module, Block, TechniqueProgress } from '../../types';

// ============================================
// PRAXIS STATUS HELPER
// ============================================

function getPraxisStatus(progress: TechniqueProgress | undefined): { label: string; color: string; bg: string } {
  if (!progress || progress.status === 'not_tested') {
    if ((progress?.practiceCount ?? 0) > 0) return { label: 'Im Training', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' };
    return { label: 'Noch nicht trainiert', color: 'text-gray-500', bg: 'bg-gray-700/20 border-gray-700/30' };
  }
  if (progress.status === 'needs_training') return { label: 'Im Training', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' };
  if (progress.status === 'tech_pending' || progress.status === 'tac_pending') return { label: 'Prüfung ausstehend', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' };
  if (progress.status === 'tech_passed') return { label: 'Technisch ✓', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' };
  if (progress.status === 'tac_passed') return { label: 'Bestanden ✓', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' };
  return { label: '–', color: 'text-gray-500', bg: 'bg-gray-700/20 border-gray-700/30' };
}

// ============================================
// MODULE CARD
// ============================================

interface ModuleCardProps {
  module: Module;
  block: Block;
  bestScore: number | null;
  sessions: number;
  questionCount: number;
  tacticsDone: boolean;
  combatDone: boolean;
  onStart: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, bestScore, sessions, questionCount, tacticsDone, combatDone, onStart }) => {
  const hasQuestions = questionCount > 0;
  const passed = (bestScore ?? 0) >= 70;
  const pct = bestScore ?? 0;

  return (
    <button
      onClick={hasQuestions ? onStart : undefined}
      disabled={!hasQuestions}
      className={`w-full text-left rounded-xl border p-3 transition-all flex flex-col gap-2.5 ${
        !hasQuestions
          ? 'bg-gray-800/20 border-gray-700/30 opacity-40 cursor-not-allowed'
          : passed
          ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50 active:scale-95'
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 active:scale-95'
      }`}
    >
      {/* Progress ring + Icon */}
      <div className="flex items-start justify-between gap-2">
        <div className="relative flex-shrink-0 w-12 h-12">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#374151" strokeWidth="4" />
            <circle
              cx="24" cy="24" r="20" fill="none"
              stroke={passed ? '#22c55e' : pct > 0 ? '#f97316' : '#4b5563'}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg">
            {module.icon}
          </div>
        </div>

        {/* T/C badges */}
        <div className="flex flex-col items-end gap-1 mt-0.5">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
            tacticsDone ? 'bg-gray-600/40 border-gray-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-600'
          }`}>T</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
            combatDone ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-gray-800 border-gray-700 text-gray-600'
          }`}>C</span>
        </div>
      </div>

      {/* Name + Status */}
      <div>
        <div className="text-white font-semibold text-sm leading-snug">{module.name}</div>
        <div className="text-gray-500 text-[11px] mt-0.5">
          {!hasQuestions ? 'Kein Quiz' : sessions === 0 ? 'Noch nicht gestartet' : `${sessions}× · Best: ${pct}%`}
        </div>
      </div>

      {/* Status pill */}
      {hasQuestions && (
        <div className={`text-[10px] px-2 py-0.5 rounded-full font-semibold w-fit ${
          passed ? 'bg-green-500/20 text-green-400' : sessions > 0 ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-700 text-gray-400'
        }`}>
          {passed ? '✓ Gemeistert' : sessions > 0 ? 'Üben' : 'Starten'}
        </div>
      )}
    </button>
  );
};

// ============================================
// BLOCK SECTION
// ============================================

interface BlockSectionProps {
  block: Block;
  modules: Module[];
  quizProgress: Record<string, { lastScore: number; bestScore: number; totalSessions: number }>;
  getQuestionCount: (moduleId: string) => number;
  getTacticsDone: (moduleId: string) => boolean;
  getCombatDone: (moduleId: string) => boolean;
  onSelectModule: (module: Module) => void;
}

const BlockSection: React.FC<BlockSectionProps> = ({ block, modules, quizProgress, getQuestionCount, getTacticsDone, getCombatDone, onSelectModule }) => {
  const blockModules = modules.filter(m => block.moduleIds.includes(m.id));
  const masteredCount = blockModules.filter(m => (quizProgress[m.id]?.bestScore ?? 0) >= 70).length;

  return (
    <div className="space-y-2">
      {/* Block Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{block.icon}</span>
          <div>
            <div className="text-white font-bold text-sm">{block.name}</div>
            <div className="text-gray-500 text-xs">{block.subtitle}</div>
          </div>
        </div>
        <div className="text-xs text-gray-500">{masteredCount}/{blockModules.length} gemeistert</div>
      </div>

      {blockModules.length === 0 ? (
        <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 p-4 text-center">
          <p className="text-gray-600 text-xs">Keine Module in diesem Block</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {blockModules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              block={block}
              bestScore={quizProgress[module.id]?.bestScore ?? null}
              sessions={quizProgress[module.id]?.totalSessions ?? 0}
              questionCount={getQuestionCount(module.id)}
              tacticsDone={getTacticsDone(module.id)}
              combatDone={getCombatDone(module.id)}
              onStart={() => onSelectModule(module)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN: MEMBER LEARNING VIEW
// ============================================

export const MemberLearningView: React.FC = () => {
  const { currentUser, completeModuleQuiz, getOrderedModules, getTechniquesForModule, getQuizQuestionsForModule, getQuizCountForModule, checkIns } = useApp();
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [learningTab, setLearningTab] = useState<'theorie' | 'praxis' | 'anfragen'>('theorie');
  const [requestSubTab, setRequestSubTab] = useState<'exams' | 'checkins'>('exams');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showCertificate, setShowCertificate] = useState(false);

  if (!currentUser) return null;

  const orderedModules = getOrderedModules();
  const quizProgress = currentUser.quizProgress ?? {};
  const totalXP = currentUser.xp ?? 0;

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  // Overall stats
  const allModulesWithQuiz = orderedModules.filter(m => getQuizQuestionsForModule(m.id).length > 0);
  const masteredModules = allModulesWithQuiz.filter(m => (quizProgress[m.id]?.bestScore ?? 0) >= 70).length;
  const totalSessions = Object.values(quizProgress).reduce((sum, p) => sum + (p.totalSessions ?? 0), 0);

  // Quiz screen
  if (showQuiz && activeModule) {
    const questions = getQuizQuestionsForModule(activeModule.id);
    const quizCount = getQuizCountForModule(activeModule.id);
    return (
      <div className="flex flex-col h-screen bg-gray-950">
        <QuizEngine
          title={`${activeModule.icon} ${activeModule.name}`}
          questions={questions}
          questionsPerSession={quizCount}
          accentColor="bg-red-600"
          onComplete={(score, xpEarned) => {
            completeModuleQuiz(activeModule.id, score, xpEarned);
            setShowQuiz(false);
          }}
          onBack={() => setShowQuiz(false)}
        />
      </div>
    );
  }

  // Module detail
  if (activeModule) {
    const q = getQuizQuestionsForModule(activeModule.id);
    const quizCount = getQuizCountForModule(activeModule.id);
    const progress = quizProgress[activeModule.id];
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700/50">
          <button onClick={() => setActiveModule(null)} className="text-gray-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">{activeModule.icon}</span>
          <div>
            <div className="text-white font-semibold">{activeModule.name}</div>
            <div className="text-gray-500 text-xs">{activeModule.subtitle}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Module info */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-300 text-sm leading-relaxed">{activeModule.description}</p>
          </div>

          {/* Stats */}
          {progress && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800/50 rounded-xl p-3 text-center border border-gray-700">
                <div className="text-xl font-black text-white">{progress.bestScore}%</div>
                <div className="text-xs text-gray-500">Bestes Ergebnis</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3 text-center border border-gray-700">
                <div className="text-xl font-black text-white">{progress.totalSessions}</div>
                <div className="text-xs text-gray-500">Sessions</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3 text-center border border-gray-700">
                <div className="text-xl font-black text-yellow-400">{progress.totalSessions * 100}+</div>
                <div className="text-xs text-gray-500">XP verdient</div>
              </div>
            </div>
          )}

          {/* Best score bar */}
          {progress && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Bestes Ergebnis</span>
                <span>{progress.bestScore}%</span>
              </div>
              <ProgressBar
                progress={progress.bestScore}
                color={progress.bestScore >= 70 ? 'bg-green-500' : 'bg-orange-500'}
                height="h-2"
              />
            </div>
          )}

          {/* Quiz info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-2">
              <BookOpen className="w-4 h-4" />
              Quiz-Details
            </div>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• {q.length} Fragen im Pool — {quizCount} werden zufällig gewählt</li>
              <li>• 10 XP pro richtige Antwort (max. {quizCount * 10} XP)</li>
              <li>• Mindestens 70% für "Gemeistert"</li>
              <li>• Wiederholung empfohlen für echten Lernerfolg</li>
            </ul>
          </div>
        </div>

        <div className="px-4 pb-4 pt-2 border-t border-gray-700/50">
          <button
            onClick={() => setShowQuiz(true)}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            {progress ? 'Nochmal üben' : 'Quiz starten'} — {quizCount} Fragen
          </button>
        </div>
      </div>
    );
  }

  // ── Praxis-Tab Hilfsfunktionen ───────────────────────────────────────────

  // Tactics (technisch): Technik hat tech_passed ODER tac_passed
  const isTacticsDone = (techniqueId: string): boolean => {
    const s = currentUser.techniqueProgress[techniqueId]?.status;
    return s === 'tech_passed' || s === 'tac_passed';
  };

  // Combat (anwendungsorientiert): Technik hat tac_passed
  const isCombatDone = (techniqueId: string): boolean =>
    currentUser.techniqueProgress[techniqueId]?.status === 'tac_passed';

  // Techniken gesamt taktisch bestanden (für Header)
  const getTechniquesDone = (moduleId: string): number =>
    getTechniquesForModule(moduleId).filter(t => isTacticsDone(t.id)).length;

  // Modul: alle required Techniken taktisch bestanden?
  const isModuleTacticsDone = (moduleId: string): boolean => {
    const techs = getTechniquesForModule(moduleId).filter(t => t.isRequired);
    return techs.length > 0 && techs.every(t => isTacticsDone(t.id));
  };

  // Modul: alle required Techniken anwendungsorientiert bestanden?
  const isModuleCombatDone = (moduleId: string): boolean => {
    const techs = getTechniquesForModule(moduleId).filter(t => t.isRequired);
    return techs.length > 0 && techs.every(t => isCombatDone(t.id));
  };

  const totalTechniquesDone = orderedModules.reduce((sum, m) => sum + getTechniquesDone(m.id), 0);
  const totalTechniques = orderedModules.reduce((sum, m) => sum + getTechniquesForModule(m.id).length, 0);
  const totalPct = totalTechniques > 0 ? Math.round((totalTechniquesDone / totalTechniques) * 100) : 0;

  const modulesTotal = orderedModules.length;
  const modulesTacticsDone = orderedModules.filter(m => isModuleTacticsDone(m.id)).length;
  const modulesCombatDone = orderedModules.filter(m => isModuleCombatDone(m.id)).length;

  // Main overview
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Tab-Switcher */}
      {(() => {
        const pendingExams = currentUser.examRequests.filter(r => r.status === 'pending').length;
        const myPendingCheckIns = checkIns.filter(c => c.memberId === currentUser.id && c.status === 'pending').length;
        const totalPending = pendingExams + myPendingCheckIns;
        return (
          <div className="px-4 pt-4 pb-3 border-b border-gray-700/50">
            <div className="flex bg-gray-800/60 rounded-xl p-1 gap-1">
              <button
                onClick={() => setLearningTab('theorie')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  learningTab === 'theorie' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                📖 Theorie
              </button>
              <button
                onClick={() => setLearningTab('praxis')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  learningTab === 'praxis' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                🥋 Praxis
              </button>
              <button
                onClick={() => setLearningTab('anfragen')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                  learningTab === 'anfragen' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                📋 Anfragen
                {totalPending > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalPending > 9 ? '9+' : totalPending}
                  </span>
                )}
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── THEORIE ─────────────────────────────────────────────────────── */}
      {learningTab === 'theorie' && (
        <>
          {/* Header Stats */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-700/30">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center">
                <div className="text-yellow-400 font-black text-xl">{totalXP}</div>
                <div className="text-xs text-gray-500">Total XP</div>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                <div className="text-green-400 font-black text-xl">{masteredModules}</div>
                <div className="text-xs text-gray-500">Gemeistert</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                <div className="text-blue-400 font-black text-xl">{totalSessions}</div>
                <div className="text-xs text-gray-500">Sessions</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> Level {Math.floor(totalXP / 500) + 1}</span>
                <span>{totalXP % 500} / 500 XP</span>
              </div>
              <ProgressBar progress={(totalXP % 500) / 5} color="bg-yellow-500" height="h-1.5" />
            </div>
          </div>

          {/* Module list by block */}
          <div className="px-4 py-4 space-y-6">
            {BLOCKS.map(block => (
              <BlockSection
                key={block.id}
                block={block}
                modules={orderedModules}
                quizProgress={quizProgress}
                getQuestionCount={(id) => getQuizQuestionsForModule(id).length}
                getTacticsDone={(id) => isModuleTacticsDone(id)}
                getCombatDone={(id) => isModuleCombatDone(id)}
                onSelectModule={setActiveModule}
              />
            ))}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30 text-center">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-gray-400 text-xs leading-relaxed">
                Lernerfolg durch Wiederholung. Spiel jedes Quiz mehrmals — die Fragen wechseln zufällig.
              </p>
            </div>
          </div>
        </>
      )}

      {/* ── PRAXIS ──────────────────────────────────────────────────────── */}
      {learningTab === 'praxis' && (
        <div className="px-4 py-4 space-y-4">

          {/* ── Fortschritts-Header ── */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            {/* Techniken-Zeile */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-700/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Techniken</span>
                <span className="text-white font-black text-lg leading-none">
                  {totalTechniquesDone}
                  <span className="text-gray-500 font-normal text-sm">/{totalTechniques}</span>
                </span>
              </div>
              <div className="bg-gray-900/70 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${totalPct}%` }} />
              </div>
              <p className="text-gray-600 text-xs mt-1">{totalPct}% taktisch abgeschlossen</p>
            </div>

            {/* Module Tactics / Combat */}
            <div className="grid grid-cols-2 divide-x divide-gray-700/50">
              {/* Tactics */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                  <span className="text-xs text-gray-300 font-semibold">TACTICS</span>
                  <span className="text-gray-500 text-xs ml-auto">{modulesTacticsDone}/{modulesTotal}</span>
                </div>
                <div className="bg-gray-900/70 rounded-full h-1.5">
                  <div className="bg-gray-400 h-1.5 rounded-full transition-all" style={{ width: modulesTotal > 0 ? `${Math.round((modulesTacticsDone / modulesTotal) * 100)}%` : '0%' }} />
                </div>
                <p className="text-gray-600 text-xs mt-1">Technisch bestätigt</p>
              </div>

              {/* Combat */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-xs text-red-400 font-semibold">COMBAT</span>
                  <span className="text-gray-500 text-xs ml-auto">{modulesCombatDone}/{modulesTotal}</span>
                </div>
                <div className="bg-gray-900/70 rounded-full h-1.5">
                  <div className="bg-red-500 h-1.5 rounded-full transition-all" style={{ width: modulesTotal > 0 ? `${Math.round((modulesCombatDone / modulesTotal) * 100)}%` : '0%' }} />
                </div>
                <p className="text-gray-600 text-xs mt-1">Anwendungsorientiert</p>
              </div>
            </div>
          </div>

          {/* ── Module als Akkordeon ── */}
          {orderedModules.map(module => {
            const techniques = getTechniquesForModule(module.id);
            const done = getTechniquesDone(module.id);
            const total = techniques.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const isOpen = expandedModules.has(module.id);
            const tacticsDone = isModuleTacticsDone(module.id);
            const combatDone = isModuleCombatDone(module.id);

            return (
              <div key={module.id} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center gap-3 p-3.5 hover:bg-gray-700/30 transition-colors"
                >
                  <span className="text-xl flex-shrink-0">{module.icon}</span>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-white font-semibold text-sm">{module.name}</span>
                    </div>
                    <div className="bg-gray-900/50 rounded-full h-1.5 w-full">
                      <div className="h-1.5 rounded-full transition-all bg-red-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Tactics Badge */}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border transition-all ${
                      tacticsDone
                        ? 'bg-gray-600/40 border-gray-400 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-600'
                    }`}>T</span>
                    {/* Combat Badge */}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border transition-all ${
                      combatDone
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-gray-800 border-gray-700 text-gray-600'
                    }`}>C</span>
                    <span className="text-gray-500 text-xs ml-1">{done}/{total}</span>
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-gray-400" />
                      : <ChevronRight className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                </button>

                {/* Techniken-Liste */}
                {isOpen && (
                  <div className="border-t border-gray-700/50 divide-y divide-gray-700/30">
                    {techniques.map(technique => {
                      const tp = currentUser.techniqueProgress[technique.id];
                      const { label, color, bg } = getPraxisStatus(tp);
                      const tDone = isTacticsDone(technique.id);
                      const cDone = isCombatDone(technique.id);
                      return (
                        <div key={technique.id} className="flex items-center gap-3 px-4 py-3">
                          <div className="min-w-0 flex-1">
                            <div className="text-gray-200 text-sm">{technique.name}</div>
                            {tp?.practiceCount ? (
                              <div className="text-gray-600 text-xs">{tp.practiceCount}× trainiert</div>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                              tDone ? 'bg-gray-600/40 border-gray-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-600'
                            }`}>T</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                              cDone ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-gray-800 border-gray-700 text-gray-600'
                            }`}>C</span>
                            <span className={`text-xs px-2 py-1 rounded-lg border font-medium ${color} ${bg}`}>
                              {label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── ANFRAGEN ────────────────────────────────────────────────────── */}
      {learningTab === 'anfragen' && (() => {
        const pendingRequests = currentUser.examRequests.filter(r => r.status === 'pending');
        const processedRequests = currentUser.examRequests.filter(r => r.status !== 'pending');
        const myCheckIns = checkIns
          .filter(c => c.memberId === currentUser.id)
          .slice()
          .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
        const myPendingCheckIns = myCheckIns.filter(c => c.status === 'pending');
        const formatDate = (d: Date) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
        const formatTime = (d: Date) => new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        const levelBadge = (level: 'technical' | 'tactical') =>
          level === 'technical'
            ? <span className="text-xs bg-gray-600/40 text-gray-300 px-1.5 py-0.5 rounded border border-gray-500/40">T Technisch</span>
            : <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">C Combat</span>;

        return (
          <div className="px-4 py-4 space-y-4">
            {/* Sub-Tab */}
            <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700 gap-1">
              <button
                onClick={() => setRequestSubTab('exams')}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  requestSubTab === 'exams' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Prüfungsanfragen
                {pendingRequests.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-red-500 text-white">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setRequestSubTab('checkins')}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  requestSubTab === 'checkins' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Check-ins
                {myPendingCheckIns.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-red-500 text-white">
                    {myPendingCheckIns.length}
                  </span>
                )}
              </button>
            </div>

            {/* ── Prüfungsanfragen ── */}
            {requestSubTab === 'exams' && (
              <div className="space-y-3">
                {/* Offene */}
                {pendingRequests.length === 0 ? (
                  <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 p-8 text-center">
                    <div className="text-3xl mb-2">📋</div>
                    <p className="text-gray-400 text-sm font-medium">Keine offenen Prüfungsanfragen</p>
                    <p className="text-gray-600 text-xs mt-1">Frage eine Prüfung an, sobald du eine Technik beherrschst.</p>
                  </div>
                ) : (
                  pendingRequests.map(req => (
                    <div key={req.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-white text-sm">{req.techniqueName}</div>
                          <div className="text-gray-400 text-xs mt-0.5">{req.moduleName}</div>
                        </div>
                        {levelBadge(req.examLevel)}
                      </div>
                      <div className="text-yellow-500/80 text-xs mt-2 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Gesendet am {new Date(req.requestedAt).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                  ))
                )}
                {/* Abgeschlossene */}
                {processedRequests.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-gray-500 text-xs uppercase tracking-wider px-1">Abgeschlossen</p>
                    {processedRequests.slice(-10).reverse().map(req => (
                      <div key={req.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-semibold text-white text-sm">{req.techniqueName}</div>
                            <div className="text-gray-400 text-xs mt-0.5">{req.moduleName}</div>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {levelBadge(req.examLevel)}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              req.status === 'passed' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                            }`}>
                              {req.status === 'passed' ? '✅ Bestanden' : '↩ Nachtrainieren'}
                            </span>
                          </div>
                        </div>
                        {req.feedback && (
                          <div className="mt-2 p-2 bg-gray-800/80 rounded-lg text-xs text-gray-300 border-l-2 border-gray-600">
                            <span className="text-gray-500">{req.examinerName}: </span>
                            {req.feedback}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Check-in Verlauf ── */}
            {requestSubTab === 'checkins' && (
              <div className="space-y-2">
                {myCheckIns.length === 0 ? (
                  <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 p-8 text-center">
                    <div className="text-3xl mb-2">📍</div>
                    <p className="text-gray-400 text-sm font-medium">Noch keine Check-ins angefragt</p>
                    <p className="text-gray-600 text-xs mt-1">Check dich im Dashboard ein, wenn du im Training bist.</p>
                  </div>
                ) : (
                  myCheckIns.slice(0, 20).map(ci => (
                    <div key={ci.id} className="bg-gray-800/50 rounded-xl border border-gray-700 px-4 py-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium">{formatDate(ci.requestedAt)}</div>
                        <div className="text-gray-500 text-xs">{formatTime(ci.requestedAt)} Uhr</div>
                      </div>
                      <div className="flex-shrink-0">
                        {ci.status === 'pending' && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Ausstehend
                          </span>
                        )}
                        {ci.status === 'approved' && (
                          <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full">✅ Bestätigt</span>
                        )}
                        {ci.status === 'rejected' && (
                          <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full">✕ Abgelehnt</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Certificate Button (immer sichtbar unten) ────────────────────── */}
      <div className="px-4 pb-24 pt-2">
        <button
          onClick={() => setShowCertificate(true)}
          className="w-full py-3 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
        >
          🏅 Trainingsnachweis herunterladen
        </button>
      </div>

      {/* Certificate Overlay */}
      {showCertificate && <CertificateView onClose={() => setShowCertificate(false)} />}
    </div>
  );
};
