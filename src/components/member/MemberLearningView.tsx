// ============================================
// MEMBER LEARNING VIEW — Duolingo-Style Lernplattform
// Wissen aus den 10 Modulen als Quiz-basiertes Lernsystem
// ============================================

import React, { useState } from 'react';
import { ChevronLeft, Star, Zap, BookOpen, Trophy } from 'lucide-react';
import { useApp, MODULES, BLOCKS } from '../../context/AppContext';
import { MODULE_QUIZ_DATA } from '../../data/memberQuizData';
import { QuizEngine } from '../shared/QuizEngine';
import { ProgressBar } from '../shared/ProgressBar';
import { Module, Block } from '../../types';

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

const ModuleCard: React.FC<ModuleCardProps> = ({ module, block, bestScore, sessions, onStart }) => {
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
  const { currentUser, completeModuleQuiz } = useApp();
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  if (!currentUser) return null;

  const quizProgress = currentUser.quizProgress ?? {};
  const totalXP = currentUser.xp ?? 0;

  // Overall stats
  const allModulesWithQuiz = MODULES.filter(m => (MODULE_QUIZ_DATA[m.id]?.length ?? 0) > 0);
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

  // Main overview
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header Stats */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-700/50">
        <h2 className="text-white font-black text-xl mb-3">Lernplattform</h2>
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

        {/* XP level indicator */}
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
            modules={MODULES}
            quizProgress={quizProgress}
            onSelectModule={setActiveModule}
          />
        ))}

        {/* Tip */}
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30 text-center">
          <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-gray-400 text-xs leading-relaxed">
            Lernerfolg durch Wiederholung. Spiel jedes Quiz mehrmals — die Fragen wechseln zufällig.
          </p>
        </div>
      </div>
    </div>
  );
};
