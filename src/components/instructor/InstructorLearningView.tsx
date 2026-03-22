// ============================================
// INSTRUCTOR LEARNING VIEW — Zone A
// Lernplattform für Instructoren (Duolingo-Style)
// Basiert auf dem M.I. Trainer-Leitfaden v2.3
// ============================================

import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, Lock, BookOpen, Trophy, Clock } from 'lucide-react';
import { INSTRUCTOR_TRACKS } from '../../data/instructorCurriculum';
import { InstructorLesson, InstructorTrack, InstructorQuizQuestion } from '../../types';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../shared/ProgressBar';

// ============================================
// QUIZ VIEW
// ============================================

interface QuizViewProps {
  lesson: InstructorLesson;
  onComplete: (score: number) => void;
  onBack: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ lesson, onComplete, onBack }) => {
  const quiz = lesson.quiz!;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question: InstructorQuizQuestion = quiz.questions[currentIndex];
  const isCorrect = selected === question.correctIndex;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correctIndex) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= quiz.questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = finalScore >= quiz.passingScore;

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl ${passed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {passed ? '🏆' : '😤'}
        </div>
        <div>
          <div className={`text-3xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>{finalScore}%</div>
          <div className="text-gray-400 mt-1">{correctCount} von {quiz.questions.length} richtig</div>
        </div>
        <div className={`text-lg font-semibold ${passed ? 'text-green-400' : 'text-yellow-400'}`}>
          {passed ? 'Lektion abgeschlossen!' : `Mindestens ${quiz.passingScore}% erforderlich`}
        </div>
        <div className="flex gap-3 w-full max-w-xs">
          {!passed && (
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelected(null);
                setAnswered(false);
                setCorrectCount(0);
                setFinished(false);
              }}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-all"
            >
              Nochmal
            </button>
          )}
          <button
            onClick={() => onComplete(finalScore)}
            className={`flex-1 py-3 rounded-xl font-medium transition-all text-white ${passed ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {passed ? 'Weiter' : 'Trotzdem fortfahren'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Frage {currentIndex + 1} / {quiz.questions.length}</span>
          <span className="text-sm text-green-400 font-medium">✓ {correctCount} richtig</span>
        </div>
        <ProgressBar
          progress={((currentIndex) / quiz.questions.length) * 100}
          color="bg-green-500"
          height="h-2"
        />
      </div>

      {/* Question */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-white font-medium leading-relaxed">{question.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {question.options.map((option, idx) => {
            let btnClass = 'w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ';
            if (!answered) {
              btnClass += 'bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-500 hover:bg-gray-700';
            } else if (idx === question.correctIndex) {
              btnClass += 'bg-green-500/20 border-green-500 text-green-300';
            } else if (idx === selected && !isCorrect) {
              btnClass += 'bg-red-500/20 border-red-500 text-red-300';
            } else {
              btnClass += 'bg-gray-800/50 border-gray-700/50 text-gray-500';
            }

            return (
              <button key={idx} onClick={() => handleSelect(idx)} className={btnClass}>
                <span className="mr-2 font-bold text-gray-500">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className={`rounded-xl p-4 border ${isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <div className={`font-semibold mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✅ Richtig!' : '❌ Nicht ganz...'}
            </div>
            <p className="text-sm text-gray-300">{question.explanation}</p>
          </div>
        )}
      </div>

      {/* Next Button */}
      {answered && (
        <div className="px-4 pb-4">
          <button
            onClick={handleNext}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-all"
          >
            {currentIndex + 1 >= quiz.questions.length ? 'Ergebnis sehen →' : 'Weiter →'}
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// LESSON VIEW
// ============================================

interface LessonViewProps {
  lesson: InstructorLesson;
  track: InstructorTrack;
  lessonIndex: number;
  isCompleted: boolean;
  onComplete: (score?: number) => void;
  onBack: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  track,
  lessonIndex,
  isCompleted,
  onComplete,
  onBack
}) => {
  const [showQuiz, setShowQuiz] = useState(false);

  if (showQuiz && lesson.quiz) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700/50 bg-gray-900/80">
          <button onClick={() => setShowQuiz(false)} className="text-gray-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-gray-300 font-medium">Quiz: {lesson.title}</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <QuizView
            lesson={lesson}
            onComplete={(score) => {
              onComplete(score);
              setShowQuiz(false);
            }}
            onBack={() => setShowQuiz(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700/50 bg-gray-900/80 flex-shrink-0">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500">{track.icon} {track.title}</div>
          <div className="text-white font-semibold text-sm truncate">{lesson.title}</div>
        </div>
        <div className="text-xs text-gray-500 flex-shrink-0">L{lessonIndex + 1} / {track.lessons.length}</div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {lesson.estimatedMinutes} Min.
          </span>
          {lesson.quiz && (
            <span className="flex items-center gap-1">
              📝 {lesson.quiz.questions.length} Fragen
            </span>
          )}
          {isCompleted && (
            <span className="flex items-center gap-1 text-green-400">
              <CheckCircle2 className="w-3 h-3" /> Abgeschlossen
            </span>
          )}
        </div>

        {/* Content text — render newlines and bold */}
        <div className="space-y-3">
          {lesson.content.split('\n\n').map((block, i) => {
            if (block.startsWith('**') && block.endsWith('**')) {
              const heading = block.replace(/\*\*/g, '');
              return <h3 key={i} className="text-white font-bold text-base mt-2">{heading}</h3>;
            }
            // Handle inline bold
            const parts = block.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i} className="text-gray-300 text-sm leading-relaxed">
                {parts.map((part, j) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
                  }
                  return part;
                })}
              </p>
            );
          })}
        </div>

        {/* Key Points */}
        {lesson.keyPoints.length > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="text-blue-400 font-semibold text-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Kernpunkte
            </div>
            <ul className="space-y-2">
              {lesson.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-700/50 flex-shrink-0 space-y-2">
        {lesson.quiz ? (
          <button
            onClick={() => setShowQuiz(true)}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            {isCompleted ? 'Quiz wiederholen' : 'Quiz starten →'}
          </button>
        ) : (
          <button
            onClick={() => onComplete()}
            disabled={isCompleted}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              isCompleted
                ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            {isCompleted ? '✅ Abgeschlossen' : '✅ Als abgeschlossen markieren'}
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// TRACK CARD
// ============================================

interface TrackCardProps {
  track: InstructorTrack;
  completedCount: number;
  onSelect: () => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, completedCount, onSelect }) => {
  const total = track.lessons.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-gray-800/50 rounded-xl border border-gray-700 p-4 hover:border-gray-500 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{track.icon}</span>
          <div>
            <div className="text-white font-semibold">{track.title}</div>
            <div className="text-gray-400 text-xs mt-0.5">{track.description}</div>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <div className="text-sm font-bold text-gray-300">{completedCount}/{total}</div>
          <div className="text-xs text-gray-500">Lektionen</div>
        </div>
      </div>

      <ProgressBar progress={pct} color="bg-blue-500" height="h-1.5" />

      <div className="mt-2 flex gap-1 flex-wrap">
        {track.lessons.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i < completedCount ? 'bg-blue-500' : 'bg-gray-700'}`}
          />
        ))}
      </div>
    </button>
  );
};

// ============================================
// TRACK DETAIL VIEW
// ============================================

interface TrackDetailProps {
  track: InstructorTrack;
  progress: Record<string, { completed: boolean }>;
  onSelectLesson: (lesson: InstructorLesson) => void;
  onBack: () => void;
}

const TrackDetailView: React.FC<TrackDetailProps> = ({ track, progress, onSelectLesson, onBack }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700/50 bg-gray-900/80 flex-shrink-0">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-lg">{track.icon}</span>
        <span className="text-white font-semibold">{track.title}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <p className="text-gray-400 text-sm">{track.description}</p>

        {track.lessons.map((lesson, i) => {
          const done = !!progress[lesson.id]?.completed;
          const prevDone = i === 0 || !!progress[track.lessons[i - 1].id]?.completed;
          const locked = !prevDone;

          return (
            <button
              key={lesson.id}
              onClick={() => !locked && onSelectLesson(lesson)}
              disabled={locked}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                locked
                  ? 'bg-gray-800/20 border-gray-700/30 opacity-40 cursor-not-allowed'
                  : done
                  ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                  locked ? 'bg-gray-700 text-gray-500' :
                  done ? 'bg-green-500/20 text-green-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {locked ? <Lock className="w-4 h-4" /> : done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm ${locked ? 'text-gray-500' : done ? 'text-green-300' : 'text-white'}`}>
                    {lesson.title}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lesson.estimatedMinutes} Min.
                    </span>
                    {lesson.quiz && (
                      <span className="text-xs text-gray-500">• {lesson.quiz.questions.length} Fragen</span>
                    )}
                  </div>
                </div>
                {!locked && (
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    done
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {done ? 'Fertig' : 'Offen'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// MAIN: INSTRUCTOR LEARNING VIEW
// ============================================

export const InstructorLearningView: React.FC = () => {
  const { currentUser, completeInstructorLesson, getInstructorProgress } = useApp();
  const [selectedTrack, setSelectedTrack] = useState<InstructorTrack | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<InstructorLesson | null>(null);

  if (!currentUser) return null;

  const progress = getInstructorProgress(currentUser.id);

  const totalLessons = INSTRUCTOR_TRACKS.reduce((sum, t) => sum + t.lessons.length, 0);
  const completedLessons = INSTRUCTOR_TRACKS.reduce(
    (sum, t) => sum + t.lessons.filter(l => progress[l.id]?.completed).length,
    0
  );
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleCompleteLesson = (lessonId: string, quizScore?: number) => {
    completeInstructorLesson(lessonId, quizScore);
    // Auto-advance to track view after completing
    setSelectedLesson(null);
  };

  // Lesson view
  if (selectedLesson && selectedTrack) {
    const lessonIndex = selectedTrack.lessons.findIndex(l => l.id === selectedLesson.id);
    return (
      <LessonView
        lesson={selectedLesson}
        track={selectedTrack}
        lessonIndex={lessonIndex}
        isCompleted={!!progress[selectedLesson.id]?.completed}
        onComplete={(score) => handleCompleteLesson(selectedLesson.id, score)}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  // Track detail view
  if (selectedTrack) {
    return (
      <TrackDetailView
        track={selectedTrack}
        progress={progress}
        onSelectLesson={(lesson) => setSelectedLesson(lesson)}
        onBack={() => setSelectedTrack(null)}
      />
    );
  }

  // Main overview
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-700/50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-white font-bold text-lg">Mein Lernen</h2>
            <p className="text-gray-400 text-sm">Trainer-Leitfaden v2.3 — {completedLessons}/{totalLessons} Lektionen</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">{overallPct}%</div>
            <div className="text-xs text-gray-500">Gesamt</div>
          </div>
        </div>
        <ProgressBar progress={overallPct} color="bg-blue-500" height="h-2" animated />
      </div>

      {/* Tracks */}
      <div className="px-4 py-4 space-y-3">
        {INSTRUCTOR_TRACKS.map(track => {
          const done = track.lessons.filter(l => progress[l.id]?.completed).length;
          return (
            <TrackCard
              key={track.id}
              track={track}
              completedCount={done}
              onSelect={() => setSelectedTrack(track)}
            />
          );
        })}
      </div>
    </div>
  );
};
