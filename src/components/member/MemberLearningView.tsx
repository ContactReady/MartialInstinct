// ============================================
// MEMBER LEARNING VIEW — Duolingo-Style Lernplattform
// Wissen aus den 10 Modulen als Quiz-basiertes Lernsystem
// ============================================

import React, { useState } from 'react';
import { ChevronLeft, Star, Zap, BookOpen, Trophy, ChevronDown, ChevronRight } from 'lucide-react';
import { useApp, BLOCKS } from '../../context/AppContext';
import { MODULE_QUIZ_DATA } from '../../data/memberQuizData';
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
  onStart: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, bestScore, sessions, onStart }) => {
  const hasQuestions = (MODULE_QUIZ_DATA[module.id]?.length ?? 0) > 0;
  const passed = (bestScore ?? 0) >= 70;

  return (
    <button
      onClick={hasQuestions ? onStart : undefined}
      disabled={!hasQuestions}
      className={`w-full text-left rounded-xl border p-4 transition-all ${
        !hasQuestions
          ? 'bg-gray-800/20 border-gray-700/30 opacity-40 cursor-not-allowed'
          : passed
          ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
          passed ? 'bg-green-500/20' : 'bg-gray-700/50'
        }`}>
          {module.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">{module.name}</span>
            {passed && <span className="text-green-400 text-xs">✓</span>}
          </div>
          <div className="text-gray-500 text-xs mt-0.5">{module.subtitle}</div>
          {sessions > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">{sessions}× gespielt</span>
              {bestScore !== null && (
                <span className={`text-xs font-bold ${bestScore >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                  Best: {bestScore}%
                </span>
              )}
            </div>
          )}
        </div>
        {hasQuestions && (
          <div className={`flex-shrink-0 text-xs px-2 py-1 rounded-full ${
            passed
              ? 'bg-green-500/20 text-green-400'
              : sessions > 0
              ? 'bg-orange-500/20 text-orange-400'
              : 'bg-blue-500/20 text-blue-400'
          }`}>
            {passed ? 'Gemeistert' : sessions > 0 ? 'Üben' : 'Starten'}
          </div>
        )}
      </div>

      {/* Best score bar */}
      {bestScore !== null && (
        <div className="mt-2">
          <ProgressBar
            progress={bestScore}
            color={bestScore >= 70 ? 'bg-green-500' : 'bg-orange-500'}
            height="h-1"
          />
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
  onSelectModule: (module: Module) => void;
}

const BlockSection: React.FC<BlockSectionProps> = ({ block, modules, quizProgress, onSelectModule }) => {
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

      {blockModules.map(module => (
        <ModuleCard
          key={module.id}
          module={module}
          block={block}
          bestScore={quizProgress[module.id]?.bestScore ?? null}
          sessions={quizProgress[module.id]?.totalSessions ?? 0}
          onStart={() => onSelectModule(module)}
        />
      ))}
    </div>
  );
};

// ============================================
// MAIN: MEMBER LEARNING VIEW
// ============================================

export const MemberLearningView: React.FC = () => {
  const { currentUser, completeModuleQuiz, getOrderedModules } = useApp();
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [learningTab, setLearningTab] = useState<'theorie' | 'praxis'>('theorie');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

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
  const allModulesWithQuiz = orderedModules.filter(m => (MODULE_QUIZ_DATA[m.id]?.length ?? 0) > 0);
  const masteredModules = allModulesWithQuiz.filter(m => (quizProgress[m.id]?.bestScore ?? 0) >= 70).length;
  const totalSessions = Object.values(quizProgress).reduce((sum, p) => sum + (p.totalSessions ?? 0), 0);

  // Quiz screen
  if (showQuiz && activeModule) {
    const questions = MODULE_QUIZ_DATA[activeModule.id] ?? [];
    return (
      <div className="flex flex-col h-screen bg-gray-950">
        <QuizEngine
          title={`${activeModule.icon} ${activeModule.name}`}
          questions={questions}
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
    const q = MODULE_QUIZ_DATA[activeModule.id] ?? [];
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
              <li>• {q.length} Fragen im Pool — 10 werden zufällig gewählt</li>
              <li>• 10 XP pro richtige Antwort (max. 100 XP)</li>
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
            {progress ? 'Nochmal üben' : 'Quiz starten'} — 10 Fragen
          </button>
        </div>
      </div>
    );
  }

  // ── Praxis-Tab Hilfsfunktionen ───────────────────────────────────────────
  const getTechniquesDone = (module: Module): number =>
    module.techniques.filter(t => {
      const s = currentUser.techniqueProgress[t.id]?.status;
      return s === 'tech_passed' || s === 'tac_passed';
    }).length;

  const totalTechniquesDone = orderedModules.reduce((sum, m) => sum + getTechniquesDone(m), 0);
  const totalTechniques = orderedModules.reduce((sum, m) => sum + m.techniques.length, 0);
  const totalPct = totalTechniques > 0 ? Math.round((totalTechniquesDone / totalTechniques) * 100) : 0;

  // Main overview
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Tab-Switcher */}
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
        </div>
      </div>

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
          {/* Gesamtfortschritt */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">Gesamtfortschritt</span>
              <span className="text-sm font-bold text-white">{totalTechniquesDone}<span className="text-gray-500 font-normal">/{totalTechniques}</span></span>
            </div>
            <div className="bg-gray-900/50 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${totalPct}%` }} />
            </div>
            <p className="text-gray-500 text-xs mt-2">{totalPct}% der Techniken technisch bestanden</p>
          </div>

          {/* Module als Akkordeon — geordnet nach Admin-Reihenfolge */}
          {orderedModules.map(module => {
            const done = getTechniquesDone(module);
            const total = module.techniques.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const isOpen = expandedModules.has(module.id);

            return (
              <div key={module.id} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                {/* Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-700/30 transition-colors"
                >
                  <span className="text-xl flex-shrink-0">{module.icon}</span>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-sm">{module.name}</span>
                      {done === total && <span className="text-green-400 text-xs">✓ Alle bestanden</span>}
                    </div>
                    <div className="mt-1.5 bg-gray-900/50 rounded-full h-1.5 w-full">
                      <div className="h-1.5 rounded-full transition-all bg-red-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-gray-400 text-xs">{done}/{total}</span>
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-gray-400" />
                      : <ChevronRight className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                </button>

                {/* Techniken-Liste */}
                {isOpen && (
                  <div className="border-t border-gray-700/50 divide-y divide-gray-700/30">
                    {module.techniques.map(technique => {
                      const progress = currentUser.techniqueProgress[technique.id];
                      const { label, color, bg } = getPraxisStatus(progress);
                      return (
                        <div key={technique.id} className="flex items-center justify-between gap-3 px-4 py-3">
                          <div className="min-w-0">
                            <div className="text-gray-200 text-sm">{technique.name}</div>
                            {progress?.practiceCount ? (
                              <div className="text-gray-600 text-xs">{progress.practiceCount}× trainiert</div>
                            ) : null}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-lg border flex-shrink-0 font-medium ${color} ${bg}`}>
                            {label}
                          </span>
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
    </div>
  );
};
