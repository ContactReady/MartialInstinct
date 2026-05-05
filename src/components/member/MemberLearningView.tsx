// ============================================
// MEMBER LEARNING VIEW — Duolingo-Style Lernplattform
// Wissen aus den 10 Modulen als Quiz-basiertes Lernsystem
// ============================================

import React, { useState, useEffect } from 'react';
import { CertificateView } from './CertificateView';
import { ChevronLeft, Star, Zap, BookOpen, Trophy, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QuizEngine } from '../shared/QuizEngine';
import { ProgressBar } from '../shared/ProgressBar';
import { Module, Block, TechniqueProgress, xpProgress } from '../../types';
import { ModuleTopic } from '../../data/moduleTopics';
import { MODULES } from '../../data/modules';

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
  if (progress.status === 'tech_passed') return { label: 'Tactical ✓', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' };
  if (progress.status === 'tac_passed') return { label: 'Combat ✓', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' };
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
  answeredCount: number;
  displayName?: string;
  onStart: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, bestScore, sessions, questionCount, answeredCount, displayName, onStart }) => {
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

        {/* Antwort-Fortschritt */}
        {hasQuestions && (
          <div className="flex flex-col items-end mt-0.5">
            <span className="text-[11px] font-bold text-gray-400">
              <span className={answeredCount >= questionCount ? 'text-green-400' : 'text-gray-300'}>{answeredCount}</span>
              <span className="text-gray-600">/{questionCount}</span>
            </span>
            <span className="text-[9px] text-gray-600 mt-0.5">beantwortet</span>
          </div>
        )}
      </div>

      {/* Name + Status */}
      <div>
        <div className="text-white font-semibold text-sm leading-snug">{displayName ?? module.name}</div>
        {module.subtitle && (
          <div className="text-gray-500 text-[10px] leading-snug mt-0.5">{module.subtitle}</div>
        )}
        <div className="text-gray-600 text-[11px] mt-0.5">
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
  getAnsweredCount: (moduleId: string) => number;
  getModuleName: (moduleId: string) => string;
  onSelectModule: (module: Module) => void;
}

const BlockSection: React.FC<BlockSectionProps> = ({ block, modules, quizProgress, getQuestionCount, getAnsweredCount, getModuleName, onSelectModule }) => {
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
              answeredCount={getAnsweredCount(module.id)}
              displayName={getModuleName(module.id)}
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
  const {
    currentUser, completeModuleQuiz, getOrderedModules,
    getTechniquesForModule, getQuizQuestionsForModule, getQuizCountForModule, checkIns,
    starredQuestions, starQuestion, unstarQuestion,
    answeredQuestions, recordQuizAnswer,
    quizExamState, canTakeExam, completeQuizExam,
    flaggedQuestions, flagSystemEnabled, flagQuestion, unflagQuestion,
    topicOverrides, getTopicsForModuleOrdered, platformConfig, getModuleName, getModuleSubtitle,
    moduleSettings, effectiveBlocks, moduleOrder,
  } = useApp();
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeTopic, setActiveTopic] = useState<ModuleTopic | null>(null);
  const [showTopicQuiz, setShowTopicQuiz] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [learningTab, setLearningTab] = useState<'theorie' | 'praxis' | 'anfragen'>('theorie');
  const [requestSubTab, setRequestSubTab] = useState<'exams' | 'checkins'>('exams');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showCertificate, setShowCertificate] = useState(false);
  const [showTheoryFlagModal, setShowTheoryFlagModal] = useState(false);
  const [theoryFlagComment, setTheoryFlagComment] = useState('');

  useEffect(() => {
    if (showTheoryFlagModal) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    } else {
      document.body.style.overflow = '';
    }
  }, [showTheoryFlagModal]);

  const getFlaggedIds = (moduleId: string) =>
    flaggedQuestions.filter(f => f.moduleId === moduleId).map(f => f.questionId);

  if (!currentUser) return null;

  const isAdmin = currentUser?.role === 'admin';
  const assignedModuleIds = new Set(currentUser?.instructorModules ?? []);
  const visibleBlocks = effectiveBlocks.filter(b =>
    (!b.adminOnly || isAdmin || b.moduleIds.some(mid => assignedModuleIds.has(mid))) && !b.disabled
  );
  // Verwende dynamische moduleIds aus effectiveBlocks (admin-konfiguriert via moduleOrder)
  const visibleModuleIdSet = new Set(visibleBlocks.flatMap(b => b.moduleIds));
  const orderedModules = (moduleOrder.length > 0
    ? moduleOrder
        .filter(o => visibleModuleIdSet.has(o.moduleId))
        .sort((a, b) => a.position - b.position)
        .map(o => MODULES.find(m => m.id === o.moduleId)!)
        .filter(Boolean)
    : MODULES.filter(m => visibleModuleIdSet.has(m.id))
  ).filter(m => !moduleSettings[m.id]?.disabled);
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

  // Exam screen
  if (showExam && activeModule) {
    const questions = getQuizQuestionsForModule(activeModule.id);
    const flaggedIds = getFlaggedIds(activeModule.id);
    return (
      <div className="flex flex-col h-full bg-gray-950">
        <QuizEngine
          title={`${activeModule.icon} ${getModuleName(activeModule.id)}`}
          questions={questions}
          mode="exam"
          accentColor="bg-red-600"
          examPassXP={platformConfig.xp.examPass}
          examPassRate={platformConfig.quiz.examPassRate}
          starredIds={starredQuestions}
          onStar={starQuestion}
          onUnstar={unstarQuestion}
          flagEnabled={flagSystemEnabled}
          flaggedIds={flaggedIds}
          onFlag={(qId, comment) => flagQuestion(qId, activeModule.id, comment)}
          onUnflag={unflagQuestion}
          onAnswer={recordQuizAnswer}
          onComplete={(score) => {
            const passed = score >= 90;
            completeQuizExam(activeModule.id, passed);
            setShowExam(false);
          }}
          onBack={() => setShowExam(false)}
        />
      </div>
    );
  }

  // Practice quiz screen
  if (showQuiz && activeModule) {
    const questions = getQuizQuestionsForModule(activeModule.id);
    const quizCount = getQuizCountForModule(activeModule.id);
    const flaggedIds = getFlaggedIds(activeModule.id);
    return (
      <div className="flex flex-col h-full bg-gray-950">
        <QuizEngine
          title={`${activeModule.icon} ${getModuleName(activeModule.id)}`}
          questions={questions}
          questionsPerSession={quizCount}
          mode="practice"
          progressKey={`practice-${activeModule.id}`}
          accentColor="bg-red-600"
          starredIds={starredQuestions}
          onStar={starQuestion}
          onUnstar={unstarQuestion}
          flagEnabled={flagSystemEnabled}
          flaggedIds={flaggedIds}
          onFlag={(qId, comment) => flagQuestion(qId, activeModule.id, comment)}
          onUnflag={unflagQuestion}
          onAnswer={recordQuizAnswer}
          xpPerCorrect={platformConfig.xp.quizCorrect}
          xpBonusAllCorrect={platformConfig.xp.quizBonusAllCorrect}
          onComplete={(score, xpEarned) => {
            completeModuleQuiz(activeModule.id, score, xpEarned);
            setShowQuiz(false);
          }}
          onBack={() => setShowQuiz(false)}
        />
      </div>
    );
  }

  // ── Topic Quiz Screen ──────────────────────────────────────────────────────
  if (showTopicQuiz && activeTopic && activeModule) {
    const allQ = getQuizQuestionsForModule(activeModule.id);
    const topicQ = allQ.filter(q => q.topic === activeTopic.id);
    const flaggedIds = getFlaggedIds(activeModule.id);
    return (
      <div className="flex flex-col h-full bg-gray-950">
        <QuizEngine
          title={`${activeTopic.icon} ${activeTopic.title}`}
          questions={topicQ}
          questionsPerSession={Math.min(topicQ.length, 10)}
          progressKey={`topic-${activeModule.id}-${activeTopic.id}`}
          mode="practice"
          accentColor="bg-red-600"
          starredIds={starredQuestions}
          onStar={starQuestion}
          onUnstar={unstarQuestion}
          flagEnabled={flagSystemEnabled}
          flaggedIds={flaggedIds}
          onFlag={(qId, comment) => flagQuestion(qId, activeModule.id, comment)}
          onUnflag={unflagQuestion}
          onAnswer={recordQuizAnswer}
          xpPerCorrect={platformConfig.xp.quizCorrect}
          xpBonusAllCorrect={platformConfig.xp.quizBonusAllCorrect}
          onComplete={(score, xpEarned) => {
            completeModuleQuiz(activeModule.id, score, xpEarned);
            setShowTopicQuiz(false);
          }}
          onBack={() => setShowTopicQuiz(false)}
        />
      </div>
    );
  }

  // ── Topic Detail Screen ────────────────────────────────────────────────────
  if (activeTopic && activeModule) {
    const allQ = getQuizQuestionsForModule(activeModule.id);
    const topicQ = allQ.filter(q => q.topic === activeTopic.id);
    const theoryText = topicOverrides[`${activeModule.id}:${activeTopic.id}`] ?? activeTopic.theoryText;

    // Einfaches Markdown-ähnliches Rendering (### Überschriften, ** bold, --- Trennlinie, Bullet-Listen)
    const renderTheory = (text: string) => {
      let firstH2Seen = false;
      return text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h3 key={i} className="text-white font-bold text-base mt-5 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith('## ')) {
          const isFirst = !firstH2Seen;
          firstH2Seen = true;
          if (isFirst && topicQ.length > 0) {
            return (
              <div key={i} className="flex items-center justify-between gap-2 border-b border-gray-700/50 pb-1 mt-6 mb-2">
                <h2 className="text-white font-bold text-lg">{line.slice(3)}</h2>
                <button
                  onClick={() => setShowTopicQuiz(true)}
                  className="flex-shrink-0 flex items-center gap-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all"
                >
                  <Zap className="w-4 h-4" />
                  Quiz starten
                </button>
              </div>
            );
          }
          return <h2 key={i} className="text-white font-bold text-lg mt-6 mb-2 border-b border-gray-700/50 pb-1">{line.slice(3)}</h2>;
        }
        if (line.startsWith('~')) return <p key={i} className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-2 mb-0.5">{line.slice(1)}</p>;
        if (line.startsWith('---')) return <hr key={i} className="border-gray-700/40 my-3" />;
        if (line.startsWith('- ') || line.startsWith('* ')) return <p key={i} className="text-gray-300 text-sm leading-relaxed pl-3 before:content-['•'] before:mr-2 before:text-red-500">{line.slice(2)}</p>;
        if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-white font-semibold text-sm mt-2">{line.slice(2, -2)}</p>;
        if (line.trim() === '') return <div key={i} className="h-2" />;
        // Handle inline bold
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        if (parts.length > 1) {
          return (
            <p key={i} className="text-gray-300 text-sm leading-relaxed">
              {parts.map((part, j) =>
                part.startsWith('**') && part.endsWith('**')
                  ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>
                  : part
              )}
            </p>
          );
        }
        return <p key={i} className="text-gray-300 text-sm leading-relaxed">{line}</p>;
      });
    };

    const submitTheoryFlag = () => {
      if (!theoryFlagComment.trim()) return;
      const flags = (() => { try { return JSON.parse(localStorage.getItem('mi-theory-flags') || '[]'); } catch { return []; } })();
      flags.push({
        id: `tf-${Date.now()}`,
        moduleId: activeModule.id,
        topicId: activeTopic.id,
        topicTitle: activeTopic.title,
        comment: theoryFlagComment.trim(),
        memberName: currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName ?? ''}`.trim() : currentUser.name,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('mi-theory-flags', JSON.stringify(flags));
      setTheoryFlagComment('');
      setShowTheoryFlagModal(false);
    };

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Theory-Flag-Modal */}
        {showTheoryFlagModal && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onPointerDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
          >
            <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-t-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">🚩 Theorie melden</span>
                <button onClick={() => { setShowTheoryFlagModal(false); setTheoryFlagComment(''); }} className="text-gray-400 hover:text-white text-xl">✕</button>
              </div>
              <p className="text-gray-400 text-sm">Was stimmt an diesem Theorie-Text nicht? (Fehler, unklare Formulierung, veraltete Info…)</p>
              <textarea
                value={theoryFlagComment}
                onChange={e => setTheoryFlagComment(e.target.value)}
                placeholder="Beschreibe das Problem kurz…"
                rows={3}
                className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-red-500"
              />
              <div className="flex gap-3">
                <button onClick={() => { setShowTheoryFlagModal(false); setTheoryFlagComment(''); }} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold text-sm">Abbrechen</button>
                <button
                  onClick={submitTheoryFlag}
                  disabled={!theoryFlagComment.trim()}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${theoryFlagComment.trim() ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                >Melden</button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700/50 flex-shrink-0">
          <button onClick={() => setActiveTopic(null)} className="text-gray-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">{activeTopic.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-sm">{activeTopic.title}</div>
            <div className="text-gray-500 text-xs">{getModuleName(activeModule.id)}</div>
          </div>
          <button onClick={() => setShowTheoryFlagModal(true)} className="text-gray-500 hover:text-orange-400 active:scale-90 transition-all p-2 -mr-1" title="Theorie melden">🚩</button>
          <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{topicQ.length} Fragen</span>
        </div>

        {/* Scrollable content — Theorie-Text (Quiz-Button inline neben erster ## Überschrift) */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-1">
            {renderTheory(theoryText)}
          </div>
        </div>
      </div>
    );
  }

  // Module detail
  if (activeModule) {
    const q = getQuizQuestionsForModule(activeModule.id);
    const quizCount = getQuizCountForModule(activeModule.id);
    const progress = quizProgress[activeModule.id];
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700/50 flex-shrink-0">
          <button onClick={() => setActiveModule(null)} className="text-gray-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg">{activeModule.icon}</span>
          <div>
            <div className="text-white font-semibold">{getModuleName(activeModule.id)}</div>
            <div className="text-gray-500 text-xs">{getModuleSubtitle(activeModule.id)}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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

          {/* Topic-Navigation (falls vorhanden) */}
          {(() => {
            const topics = getTopicsForModuleOrdered(activeModule.id);
            if (topics.length === 0) return null;
            return (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-red-400" />
                  <span className="text-white font-semibold text-sm">Theorie-Abschnitte</span>
                </div>
                <div className="space-y-2">
                  {topics.map(topic => {
                    const topicQ = q.filter(qq => qq.topic === topic.id);
                    return (
                      <button
                        key={topic.id}
                        onClick={() => setActiveTopic(topic)}
                        className="w-full text-left bg-gray-800/50 border border-gray-700 hover:border-gray-500 rounded-xl p-3 transition-all active:scale-95 flex items-center gap-3"
                      >
                        <span className="text-xl flex-shrink-0">{topic.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm">{topic.title}</div>
                          <div className="text-gray-500 text-xs">Theorie für {topicQ.length} Fragen</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Quiz info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-2">
              <BookOpen className="w-4 h-4" />
              Infos zum Quiz
            </div>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• {q.length} Fragen im Pool — {quizCount} werden zufällig gewählt</li>
              <li>• 2 XP pro richtige Antwort + 10 Bonus bei 100%</li>
              <li>• ⭐ Stern = Ich kenne diese Frage — kommt seltener vor</li>
              <li>• Wiederholung empfohlen für echten Lernerfolg</li>
            </ul>
          </div>

          {/* Prüfungs-Bereich */}
          {(() => {
            const examState = quizExamState[activeModule.id];
            const { allowed, reason } = canTakeExam(activeModule.id);
            const answered = q.filter(qq => answeredQuestions.includes(qq.id)).length;
            const allAnswered = answered >= q.length;
            const isPassed = !!examState?.passedAt;
            const isBanned = examState?.banUntil && new Date() < new Date(examState.banUntil);
            const attemptsLeft = 2 - (examState?.attempts ?? 0);

            return (
              <div className={`rounded-xl p-4 border space-y-3 ${
                isPassed ? 'bg-green-500/10 border-green-500/30' :
                isBanned ? 'bg-red-500/10 border-red-500/30' :
                'bg-gray-800/50 border-gray-700'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white">🎓 Modulprüfung</span>
                  {isPassed && <span className="text-green-400 text-xs font-bold">✓ Bestanden</span>}
                  {isBanned && <span className="text-red-400 text-xs font-bold">Gesperrt</span>}
                  {!isPassed && !isBanned && <span className="text-gray-500 text-xs">{attemptsLeft > 0 ? `${attemptsLeft}× Versuch` : 'Keine Versuche mehr'}</span>}
                </div>
                <ul className="text-xs text-gray-400 space-y-0.5">
                  <li>• 30 Fragen · 90% zum Bestehen · 2 Versuche</li>
                  <li>• Voraussetzung: alle {q.length} Fragen mind. 1× beantwortet</li>
                  {isBanned && (
                    <li className="text-red-400">• Sperre bis: {new Date(examState!.banUntil!).toLocaleDateString('de-DE')}</li>
                  )}
                </ul>
                {!allAnswered && !isPassed && (
                  <div className="text-xs text-gray-500">
                    Noch {q.length - answered} von {q.length} Fragen nicht beantwortet
                    <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${q.length > 0 ? Math.round((answered / q.length) * 100) : 0}%` }} />
                    </div>
                  </div>
                )}
                {!isPassed && (
                  <button
                    onClick={() => setShowExam(true)}
                    disabled={!allowed}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                      allowed
                        ? 'bg-red-700 hover:bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isBanned ? reason : allowed ? 'Zur Prüfung →' : reason ?? 'Prüfung gesperrt'}
                  </button>
                )}
              </div>
            );
          })()}

          {/* Quiz-Button */}
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

  // Techniken gesamt taktisch bestanden (für Header) — nur Pflicht
  const getTechniquesDone = (moduleId: string): number =>
    getTechniquesForModule(moduleId).filter(t => t.isRequired && isTacticsDone(t.id)).length;

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
  const totalTechniques = orderedModules.reduce((sum, m) => sum + getTechniquesForModule(m.id).filter(t => t.isRequired).length, 0);
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
          <div className="sticky top-[9px] z-30 bg-gray-950 px-4 pt-2 pb-3 border-b border-gray-700/50">
            <div className="flex bg-gray-800/60 rounded-xl p-1 gap-1">
              <button
                onClick={() => setLearningTab('theorie')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  learningTab === 'theorie' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                📖 Theorie
              </button>
              <button
                onClick={() => setLearningTab('praxis')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  learningTab === 'praxis' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                🥋 Praxis
              </button>
              <button
                onClick={() => setLearningTab('anfragen')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                  learningTab === 'anfragen' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
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
            {(() => {
              const lvlInfo = xpProgress(totalXP, platformConfig);
              return (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> Level {lvlInfo.level}</span>
                    <span>{lvlInfo.current} / {lvlInfo.needed} XP</span>
                  </div>
                  <ProgressBar progress={lvlInfo.needed > 0 ? (lvlInfo.current / lvlInfo.needed) * 100 : 100} color="bg-yellow-500" height="h-1.5" />
                </div>
              );
            })()}
          </div>

          {/* Module list by block */}
          <div className="px-4 py-4 space-y-6">
            {visibleBlocks.map(block => (
              <BlockSection
                key={block.id}
                block={block}
                modules={orderedModules}
                quizProgress={quizProgress}
                getQuestionCount={(id) => getQuizQuestionsForModule(id).length}
                getAnsweredCount={(id) => {
                  const qs = getQuizQuestionsForModule(id);
                  return qs.filter(q => answeredQuestions.includes(q.id)).length;
                }}
                getModuleName={getModuleName}
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
            const total = techniques.filter(t => t.isRequired).length;
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
                      <span className="text-white font-semibold text-sm">{getModuleName(module.id)}</span>
                    </div>
                    <div className="bg-gray-900/50 rounded-full h-1.5 w-full">
                      <div className="h-1.5 rounded-full transition-all bg-red-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Tactics Badge */}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border transition-all ${
                      tacticsDone
                        ? 'bg-gray-600 border-gray-600 text-gray-900'
                        : 'bg-gray-800 border-gray-700 text-gray-600'
                    }`}>T</span>
                    {/* Combat Badge */}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border transition-all ${
                      combatDone
                        ? 'bg-gray-900 border-gray-600 text-white'
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
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                              tDone ? 'bg-gray-600 border-gray-600 text-gray-900' : 'bg-gray-800 border-gray-700 text-gray-600'
                            }`}>T</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                              cDone ? 'bg-gray-900 border-gray-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-600'
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
                Check-Ins
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
