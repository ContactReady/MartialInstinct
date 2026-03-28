// ============================================
// INSTRUCTOR LEARNING VIEW — Zone A
// Lernplattform für Instructoren (Duolingo-Style)
// Basiert auf dem M.I. Trainer-Leitfaden v2.3
// ============================================

import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, Lock, BookOpen, Trophy, Clock } from 'lucide-react';
import { INSTRUCTOR_TRACKS } from '../../data/instructorCurriculum';
import { InstructorLesson, InstructorTrack } from '../../types';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../shared/ProgressBar';
import { QuizEngine, QuizQuestion } from '../shared/QuizEngine';


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
    const quizQuestions: QuizQuestion[] = lesson.quiz.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    }));
    return (
      <div className="flex flex-col h-full">
        <QuizEngine
          title={`${track.icon} ${lesson.title}`}
          questions={quizQuestions}
          accentColor="bg-blue-600"
          onComplete={(score) => {
            onComplete(score);
            setShowQuiz(false);
          }}
          onBack={() => setShowQuiz(false)}
        />
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
              📝 10 Fragen
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
// LESSON CARD (2-Spalten-Grid)
// ============================================

interface LessonCardProps {
  lesson: InstructorLesson;
  index: number;
  done: boolean;
  locked: boolean;
  onSelect: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, index, done, locked, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      disabled={locked}
      className={`w-full text-left rounded-xl border p-3 transition-all flex flex-col gap-2 ${
        locked
          ? 'bg-gray-800/20 border-gray-700/30 opacity-40 cursor-not-allowed'
          : done
          ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50 active:scale-95'
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 active:scale-95'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          locked ? 'bg-gray-700 text-gray-500' :
          done ? 'bg-green-500/20 text-green-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {locked ? <Lock className="w-3 h-3" /> : done ? <CheckCircle2 className="w-3 h-3" /> : index + 1}
        </div>
        {!locked && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            done ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
          }`}>
            {done ? 'Fertig' : 'Offen'}
          </span>
        )}
      </div>
      <div>
        <div className={`font-medium text-xs leading-tight ${
          locked ? 'text-gray-500' : done ? 'text-green-300' : 'text-white'
        }`}>
          {lesson.title}
        </div>
        <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" /> {lesson.estimatedMinutes} Min.
          {lesson.quiz && <span>• Quiz</span>}
        </div>
      </div>
    </button>
  );
};


// ============================================
// MAIN: INSTRUCTOR LEARNING VIEW
// ============================================

export const InstructorLearningView: React.FC = () => {
  const { currentUser, completeInstructorLesson, getInstructorProgress } = useApp();
  const [activeTrackId, setActiveTrackId] = useState<string>(INSTRUCTOR_TRACKS[0]?.id ?? '');
  const [selectedLesson, setSelectedLesson] = useState<InstructorLesson | null>(null);

  if (!currentUser) return null;

  const progress = getInstructorProgress(currentUser.id);
  const activeTrack = INSTRUCTOR_TRACKS.find(t => t.id === activeTrackId) ?? INSTRUCTOR_TRACKS[0];

  const handleCompleteLesson = (lessonId: string, quizScore?: number) => {
    completeInstructorLesson(lessonId, quizScore);
    setSelectedLesson(null);
  };

  // Lesson view (full screen)
  if (selectedLesson && activeTrack) {
    const lessonIndex = activeTrack.lessons.findIndex(l => l.id === selectedLesson.id);
    return (
      <LessonView
        lesson={selectedLesson}
        track={activeTrack}
        lessonIndex={lessonIndex}
        isCompleted={!!progress[selectedLesson.id]?.completed}
        onComplete={(score) => handleCompleteLesson(selectedLesson.id, score)}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  const trackDone = (track: InstructorTrack) =>
    track.lessons.filter(l => progress[l.id]?.completed).length;

  const activeDone = trackDone(activeTrack);
  const activeTotal = activeTrack.lessons.length;
  const activePct = activeTotal > 0 ? Math.round((activeDone / activeTotal) * 100) : 0;

  // Main overview
  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Sticky Sub-Tab-Leiste */}
      <div className="sticky top-[9px] z-30 bg-gray-950 px-4 pt-2 pb-3 border-b border-gray-700/50">
        <div className="flex bg-gray-800/60 rounded-xl p-1 gap-1">
          {INSTRUCTOR_TRACKS.map(track => {
            const done = trackDone(track);
            const total = track.lessons.length;
            const isActive = track.id === activeTrackId;
            return (
              <button
                key={track.id}
                onClick={() => setActiveTrackId(track.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex flex-col items-center gap-0.5 ${
                  isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="text-base leading-none">{track.icon}</span>
                <span className="text-[9px] text-gray-500 leading-none">{done}/{total}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Track-Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-700/30">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-white font-bold text-sm">{activeTrack.icon} {activeTrack.title}</h3>
            <p className="text-gray-400 text-xs mt-0.5">{activeTrack.description}</p>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <div className="text-lg font-bold text-blue-400">{activePct}%</div>
            <div className="text-[10px] text-gray-500">{activeDone}/{activeTotal}</div>
          </div>
        </div>
        <ProgressBar progress={activePct} color="bg-blue-500" height="h-1.5" />
      </div>

      {/* Lektionen-Grid */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-2">
          {activeTrack.lessons.map((lesson, i) => {
            const done = !!progress[lesson.id]?.completed;
            const prevDone = i === 0 || !!progress[activeTrack.lessons[i - 1].id]?.completed;
            const locked = !prevDone;
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={i}
                done={done}
                locked={locked}
                onSelect={() => !locked && setSelectedLesson(lesson)}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
};
