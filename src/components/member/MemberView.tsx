// ============================================
// MARTIAL INSTINCT - MEMBER VIEW
// Simpel für Members - nur Status, keine Prozente
// ============================================

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MODULES, BLOCKS } from '../../data/modules';
import { LEVEL_DISPLAY, TechniqueStatus, ModuleLevel } from '../../types';
import { TechniqueCard } from '../shared/TechniqueCard';
import { ProgressBar } from '../shared/ProgressBar';
import { MemberLearningView } from './MemberLearningView';
import { ProfileView } from '../shared/ProfileView';

type Tab = 'dashboard' | 'lernen' | 'progress' | 'requests' | 'profil';
type ApplicationType = 'contact' | 'assistant_instructor' | null;

export const MemberView: React.FC = () => {
  const {
    currentUser,
    members,
    requestCheckIn,
    checkIns,
    requestExam,
    logPractice,
    useBandaid,
    getBlockProgress,
    getModuleProgress,
    isBlockUnlocked,
    submitContactApplication,
    submitInstructorApplication,
    submitTechniqueWish,
    techniqueWishes,
    getSessionsForMember
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<string | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState<ApplicationType>(null);
  const [progressView, setProgressView] = useState<'ranking' | 'myProgress'>('ranking');
  const [rankSort, setRankSort] = useState<'streak' | 'techniques' | 'xp'>('streak');
  const [rankFilter, setRankFilter] = useState<'alle' | 'diese_woche' | 'mein_level'>('alle');
  const [memberRequestSubTab, setMemberRequestSubTab] = useState<'exams' | 'checkins'>('exams');
  
  // Contact Application Answers
  const [contactAnswers, setContactAnswers] = useState({
    motivation: '',
    experience: '',
    teamwork: '',
    stressHandling: '',
    protectionOfOthers: '',
    availability: ''
  });
  
  // Instructor Application Answers
  const [instructorAnswers, setInstructorAnswers] = useState({
    motivation: '',
    teachingExperience: '',
    strengthsWeaknesses: '',
    availability: '',
    goals: '',
    roleModel: ''
  });

  // Tages-Reset: Button reaktiviert sich täglich um Mitternacht
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // nächste Mitternacht
    const msUntilMidnight = midnight.getTime() - Date.now();
    const timer = setTimeout(() => setNow(new Date()), msUntilMidnight);
    return () => clearTimeout(timer);
  }, [now]); // nach jedem Reset neu planen

  if (!currentUser) return null;

  // ── Aktivitätsstatus ──────────────────────────────────────────────────────
  const getWeekStart = (d: Date): Date => {
    const s = new Date(d);
    const day = s.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // Montag als Wochenstart
    s.setDate(s.getDate() + diff);
    s.setHours(0, 0, 0, 0);
    return s;
  };




  // Check-in Status aus dem geteilten checkIns-Array ableiten (aktualisiert sich sofort wenn Trainer bestätigt)
  const todayStr = now.toDateString();
  const todayCheckIn = checkIns.find(
    c => c.memberId === currentUser.id &&
         new Date(c.requestedAt).toDateString() === todayStr
  );
  const checkInStatus = todayCheckIn?.status ?? 'none'; // 'none' | 'pending' | 'approved' | 'rejected'
  const checkInApprovedAt = todayCheckIn?.approvedAt ? new Date(todayCheckIn.approvedAt) : null;

  // Get technique status for display
  const getTechStatus = (techniqueId: string): TechniqueStatus => {
    return currentUser.techniqueProgress[techniqueId]?.status || 'not_tested';
  };

  // Count completed techniques (mindestens technisch bestanden)
  const getCompletedCount = (): number => {
    return Object.values(currentUser.techniqueProgress).filter(
      p => p.status === 'tech_passed' || p.status === 'tac_passed'
    ).length;
  };

  // Handle exam request — AppContext bestimmt automatisch welche Ebene als nächstes dran ist
  const handleRequestExam = (techniqueId: string) => {
    requestExam(techniqueId);
  };

  // Check if application exists for block
  const getApplicationStatus = (level: ModuleLevel): 'none' | 'pending' | 'approved' | 'rejected' => {
    if (level === 'contact') {
      return currentUser.contactApplication?.status || 'none';
    }
    if (level === 'assistant_instructor') {
      return currentUser.assistantInstructorApplication?.status || 'none';
    }
    return 'none';
  };

  // Submit contact application
  const handleSubmitContactApplication = () => {
    submitContactApplication(contactAnswers);
    setShowApplicationModal(null);
    setContactAnswers({
      motivation: '',
      experience: '',
      teamwork: '',
      stressHandling: '',
      protectionOfOthers: '',
      availability: ''
    });
  };

  // Submit instructor application
  const handleSubmitInstructorApplication = () => {
    submitInstructorApplication(instructorAnswers, 'assistant_instructor');
    setShowApplicationModal(null);
    setInstructorAnswers({
      motivation: '',
      teachingExperience: '',
      strengthsWeaknesses: '',
      availability: '',
      goals: '',
      roleModel: ''
    });
  };

  // Render Dashboard Tab
  const renderDashboard = () => {
    // Community Impuls: Members die heute eingecheckt haben
    const todayCheckIns = checkIns.filter(
      c => c.status === 'approved' && new Date(c.approvedAt!).toDateString() === new Date().toDateString()
    );
    const todayCount = new Set(todayCheckIns.map(c => c.memberId)).size;
    const thisWeekXpLeader = [...members]
      .filter(m => m.id !== currentUser.id && m.role === 'member')
      .sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0))[0];

    const mySessions = getSessionsForMember(currentUser.id)
      .filter(s => s.status === 'completed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    return (
    <div className="space-y-4">

      {/* ── 1. Check-in — Hauptaktion ───────────────────────── */}
      <div className={`rounded-xl p-5 border transition-all ${
        checkInStatus === 'approved'
          ? 'bg-green-900/20 border-green-600/40'
          : checkInStatus === 'pending'
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-gray-800/50 border-gray-700'
      }`}>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-white">Training Check-in</h3>
            <p className={`text-sm mt-0.5 ${
              checkInStatus === 'approved' ? 'text-green-400' : 'text-gray-400'
            }`}>
              {checkInStatus === 'approved'
                ? `✅ Eingecheckt um ${checkInApprovedAt
                    ? `${checkInApprovedAt.getHours().toString().padStart(2,'0')}:${checkInApprovedAt.getMinutes().toString().padStart(2,'0')} Uhr`
                    : 'heute'}`
                : checkInStatus === 'pending'
                ? 'Warte auf Trainer-Bestätigung…'
                : 'Heute im Training? Jetzt einchecken.'}
            </p>
          </div>
          {checkInStatus === 'approved' ? (
            <button disabled className="flex-shrink-0 bg-green-700/60 text-green-300 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-not-allowed">
              Eingecheckt
            </button>
          ) : checkInStatus === 'pending' ? (
            <button disabled className="flex-shrink-0 bg-gray-700 text-gray-400 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-not-allowed flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Gesendet
            </button>
          ) : (
            <button
              onClick={requestCheckIn}
              className="flex-shrink-0 bg-red-600 hover:bg-red-500 active:scale-95 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all"
            >
              Einchecken
            </button>
          )}
        </div>
      </div>

      {/* ── 2. Stats — 4 Kacheln ────────────────────────────── */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-gradient-to-b from-orange-900/40 to-orange-900/20 rounded-xl p-3 border border-orange-800/40 text-center">
          <div className="text-2xl font-black text-orange-400 leading-none">{currentUser.streak.currentStreak}</div>
          <div className="text-[10px] text-orange-300/60 mt-1 leading-tight">🔥 Streak</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/80 text-center">
          <div className="text-2xl font-black text-gray-300 leading-none">{currentUser.streak.longestStreak}</div>
          <div className="text-[10px] text-gray-500 mt-1 leading-tight">🏅 Rekord</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/80 text-center">
          <div className="text-2xl font-black text-white leading-none">{getCompletedCount()}</div>
          <div className="text-[10px] text-gray-500 mt-1 leading-tight">✅ Techniken</div>
        </div>
        <div className={`rounded-xl p-3 border text-center ${
          currentUser.streak.bandaids > 0
            ? 'bg-green-900/20 border-green-800/40'
            : 'bg-gray-800/50 border-gray-700/80'
        }`}>
          <div className={`text-2xl font-black leading-none ${currentUser.streak.bandaids > 0 ? 'text-green-400' : 'text-gray-500'}`}>
            {currentUser.streak.bandaids}
          </div>
          <div className={`text-[10px] mt-1 leading-tight ${currentUser.streak.bandaids > 0 ? 'text-green-500/70' : 'text-gray-600'}`}>
            🩹 Pflaster
          </div>
        </div>
      </div>

      {/* ── 3. Community Impuls ─────────────────────────────── */}
      {todayCount > 0 && (
        <div className="bg-gray-800/30 rounded-lg px-3 py-2.5 border border-gray-700/40 flex items-center gap-2">
          <span className="text-sm flex-shrink-0">🏟️</span>
          <p className="text-gray-400 text-xs">
            <span className="text-gray-200 font-medium">{todayCount} Member{todayCount !== 1 ? 's' : ''}</span> {todayCount === 1 ? 'war' : 'waren'} heute im Training
            {thisWeekXpLeader && (thisWeekXpLeader.xp ?? 0) > 0 && (
              <span className="text-gray-600"> · {thisWeekXpLeader.name.split(' ')[0]} führt mit {thisWeekXpLeader.xp} XP</span>
            )}
          </p>
        </div>
      )}

      {/* ── 4. Training-Log + Pflaster — 2-col auf Desktop ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Training-Log */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">🥋 Letzte Trainings</h3>
          {mySessions.length === 0 ? (
            <p className="text-gray-600 text-sm">Noch kein Training dokumentiert</p>
          ) : (
            <div className="space-y-2.5">
              {mySessions.map(session => {
                const myGroup = session.groups.find(g => g.memberIds.includes(currentUser.id));
                const techCount = myGroup?.techniqueIds.length ?? 0;
                const xpGained = techCount * 10;
                const dateStr = new Date(session.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
                return (
                  <div key={session.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-gray-200 text-sm font-medium truncate">
                        {dateStr} — {session.courseName ?? 'Training'}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {techCount} Technik{techCount !== 1 ? 'en' : ''}
                        {session.instructorName ? ` · ${session.instructorName}` : ''}
                      </div>
                    </div>
                    <span className="text-yellow-500 text-xs font-bold flex-shrink-0">+{xpGained} XP</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pflaster — kompakt */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">🩹 Pflaster</h3>
            <div className="flex gap-1.5">
              {Array.from({ length: currentUser.streak.maxBandaids }).map((_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
                    i < currentUser.streak.bandaids
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-700/60 text-gray-600'
                  }`}
                >
                  🩹
                </div>
              ))}
            </div>
          </div>
          <p className="text-gray-500 text-xs mb-3 leading-relaxed">
            Rette deinen Streak wenn du eine Woche verpasst.
          </p>
          {currentUser.streak.bandaids > 0 ? (
            <button
              onClick={useBandaid}
              className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition-all"
            >
              Pflaster einsetzen
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {['4 Wochen Streak', '10 Check-ins', 'Modul 100%', 'Instructor'].map(tip => (
                <div key={tip} className="text-[11px] text-gray-600 bg-gray-700/30 rounded px-2 py-1 flex items-center gap-1">
                  <span className="text-gray-700">+</span>{tip}
                </div>
              ))}
            </div>
          )}
          {currentUser.streak.bandaidHistory.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700/60 space-y-1.5">
              {currentUser.streak.bandaidHistory.slice(-3).reverse().map(event => (
                <div key={event.id} className="flex items-center justify-between text-xs">
                  <span className={event.type === 'earned' ? 'text-green-500' : 'text-red-400'}>
                    {event.type === 'earned' ? '+1 🩹' : '-1 🩹'} {event.reason}
                  </span>
                  <span className="text-gray-600">{new Date(event.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 5. Block-Fortschritt ─────────────────────────────── */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Dein Fortschritt</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BLOCKS.map(block => {
            const progress = getBlockProgress(currentUser.id, block.level);
            const unlocked = isBlockUnlocked(currentUser.id, block.level);
            return (
              <div
                key={block.id}
                className={`${block.bgColor} rounded-xl p-4 border ${block.borderColor} ${!unlocked ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{block.icon}</span>
                    <div>
                      <div className={`font-bold text-sm ${block.color}`}>{block.name}</div>
                      <div className="text-gray-500 text-xs">{block.subtitle}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {unlocked ? (
                      <div className="text-white font-bold text-sm">{progress.completed}<span className="text-gray-500 font-normal">/{progress.total}</span></div>
                    ) : (
                      <div className="text-gray-600 text-sm">🔒</div>
                    )}
                  </div>
                </div>
                {unlocked && (
                  <div className="bg-gray-900/50 rounded-full h-1.5">
                    <div
                      className="bg-red-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
    );
  };

  // ── Rangliste ─────────────────────────────────────────────────────────────
  const renderRanking = () => {
    // Alle Members (inkl. Instructors, damit Rangliste vollständig ist)
    const rankMembers = members.filter(m => m.role === 'member');

    const countPassed = (m: typeof members[0]) =>
      Object.values(m.techniqueProgress).filter(
        p => p.status === 'tech_passed' || p.status === 'tac_passed'
      ).length;

    // Filter anwenden
    const weekStart = getWeekStart(new Date());
    const filteredMembers = rankMembers.filter(m => {
      if (rankFilter === 'mein_level') return m.currentLevel === currentUser.currentLevel;
      if (rankFilter === 'diese_woche') {
        return checkIns.some(c =>
          c.memberId === m.id && c.status === 'approved' && c.approvedAt != null &&
          new Date(c.approvedAt).getTime() >= weekStart.getTime()
        );
      }
      return true;
    });

    // Sortierung — bei "Diese Woche": nach XP dieser Woche (approximiert durch Gesamt-XP, da keine wöchentliche XP-Trennung)
    const sorted = [...filteredMembers].sort((a, b) => {
      if (rankSort === 'streak') {
        const diff = b.streak.currentStreak - a.streak.currentStreak;
        if (diff !== 0) return diff;
        return countPassed(b) - countPassed(a);
      }
      if (rankSort === 'techniques') return countPassed(b) - countPassed(a);
      return (b.xp ?? 0) - (a.xp ?? 0);
    });

    const myRank = sorted.findIndex(m => m.id === currentUser.id) + 1;

    const medal = (rank: number) => {
      if (rank === 1) return '🥇';
      if (rank === 2) return '🥈';
      if (rank === 3) return '🥉';
      return `#${rank}`;
    };

    const statusDot = (m: typeof members[0]) => {
      if (m.isCheckedIn) return <span className="w-2.5 h-2.5 rounded-full bg-orange-400 flex-shrink-0" />;
      if (m.onlineSince)  return <span className="w-2.5 h-2.5 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />;
      return <span className="w-2.5 h-2.5 rounded-full bg-gray-600 flex-shrink-0" />;
    };

    // Spaltenbreite für Buttons UND Stats-Werte — exakt gleich
    const COL = 'w-16 text-center flex-shrink-0';

    const SortBtn = ({ k, label }: { k: typeof rankSort; label: string }) => (
      <button
        onClick={() => setRankSort(k)}
        className={`${COL} py-1.5 rounded-lg text-xs font-medium transition-all ${
          rankSort === k ? 'bg-red-600 text-white' : 'bg-gray-700/60 text-gray-400 hover:text-white'
        }`}
      >
        {label}
      </button>
    );

    const formatDateTime = (date: Date | null | undefined): string => {
      if (!date) return '–';
      const d = new Date(date);
      const today = new Date();
      const isToday = d.toDateString() === today.toDateString();
      const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      if (isToday) return `Heute ${time}`;
      return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) + ` ${time}`;
    };

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white">🏆 Rangliste</h2>
            {myRank > 0 && (
              <p className="text-sm text-gray-400 mt-0.5">Du bist auf Platz {myRank}</p>
            )}
          </div>
          {/* Sortier-Buttons */}
          <div className="flex gap-1.5 flex-shrink-0">
            <SortBtn k="streak" label="🔥 Streak" />
            <SortBtn k="techniques" label="✅ Tech." />
            <SortBtn k="xp" label="⭐ XP" />
          </div>
        </div>

        {/* Filter-Tabs */}
        <div className="flex bg-gray-800/50 rounded-xl p-1 gap-1">
          {([['alle', 'Alle'], ['diese_woche', 'Diese Woche'], ['mein_level', 'Mein Level']] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setRankFilter(k)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                rankFilter === k ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Liste */}
        <div className="space-y-2">
          {sorted.map((m, idx) => {
            const rank = idx + 1;
            const isMe = m.id === currentUser.id;
            const passed = countPassed(m);

            return (
              <div
                key={m.id}
                className={`rounded-xl border overflow-hidden transition-all ${
                  isMe ? 'bg-yellow-900/20 border-yellow-500/40' : 'bg-gray-800/50 border-gray-700'
                }`}
              >
                {/* Hauptzeile */}
                <div className="px-4 py-3 flex items-center gap-3">
                  {/* Rang */}
                  <div className="w-8 text-center flex-shrink-0">
                    <span className={`font-bold ${rank <= 3 ? 'text-lg' : 'text-gray-500 text-sm'}`}>
                      {medal(rank)}
                    </span>
                  </div>

                  {/* Status-Dot + Avatar */}
                  {statusDot(m)}
                  <span className="text-2xl flex-shrink-0">{m.avatar}</span>

                  {/* Name + Level */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`font-semibold text-sm ${isMe ? 'text-yellow-300' : 'text-white'}`}>
                        {m.name}
                      </span>
                      {isMe && <span className="text-yellow-500/70 text-xs">(Du)</span>}
                    </div>
                    <span className={`text-xs ${LEVEL_DISPLAY[m.currentLevel].color}`}>
                      {LEVEL_DISPLAY[m.currentLevel].icon} {LEVEL_DISPLAY[m.currentLevel].subtitle}
                    </span>
                  </div>

                  {/* Stats — gleiche Breite wie Buttons */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <div className={COL}>
                      <div className="text-white font-bold text-sm">{m.streak.currentStreak}</div>
                      <div className="text-gray-500 text-xs">Wo.</div>
                    </div>
                    <div className={COL}>
                      <div className="text-white font-bold text-sm">{passed}</div>
                      <div className="text-gray-500 text-xs">Tech.</div>
                    </div>
                    <div className={COL}>
                      <div className="text-white font-bold text-sm">{m.xp ?? 0}</div>
                      <div className="text-gray-500 text-xs">XP</div>
                    </div>
                  </div>
                </div>

                {/* Detail-Zeile: Zuletzt online + Letztes Training */}
                <div className="px-4 pb-2.5 flex flex-wrap gap-x-5 gap-y-0.5 text-xs border-t border-gray-700/30 pt-2">
                  <span>
                    <span className="text-gray-600">Zuletzt online:</span>{' '}
                    <span className="text-gray-400">{formatDateTime(m.lastSeenAt)}</span>
                  </span>
                  <span>
                    <span className="text-gray-600">Letztes Training:</span>{' '}
                    <span className="text-gray-400">{formatDateTime(m.streak.lastTrainingDate)}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legende */}
        <div className="flex items-center gap-4 text-xs text-gray-600 pt-1">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Beim Training</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Online</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-600 inline-block" /> Offline</span>
        </div>
      </div>
    );
  };

  // Render Progress Tab
  const renderProgress = () => {
    // ── Technik-Detail ────────────────────────────────────────────────────────
    if (selectedTechniqueId && selectedModule) {
      const module = MODULES.find(m => m.id === selectedModule);
      const tech = module?.techniques.find(t => t.id === selectedTechniqueId);
      if (!tech || !module) return null;

      const progress = currentUser.techniqueProgress[tech.id];
      const status = progress?.status ?? 'not_tested';
      const techPassed = status === 'tech_passed' || status === 'tac_passed';
      const tacPassed = status === 'tac_passed';
      const isPending = status === 'tech_pending' || status === 'tac_pending';
      const canRequest = !isPending && !tacPassed;

      return (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedTechniqueId(null)}
            className="text-gray-400 hover:text-white flex items-center gap-2 text-sm"
          >
            ← Zurück zu {module.name}
          </button>

          {/* Titel */}
          <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{module.icon}</span>
              <div>
                <div className="text-xs text-gray-500">{module.name}</div>
                <div className="text-white font-bold text-lg">{tech.name}</div>
              </div>
              {tech.isRequired && (
                <span className="ml-auto flex-shrink-0 bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded border border-red-500/20">Pflicht</span>
              )}
            </div>
            {tech.description && (
              <p className="text-gray-400 text-sm leading-relaxed">{tech.description}</p>
            )}
          </div>

          {/* Zwei-Ebenen Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-4 border text-center ${techPassed ? 'bg-blue-500/10 border-blue-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
              <div className={`text-2xl font-bold mb-1 ${techPassed ? 'text-blue-400' : 'text-gray-600'}`}>◐</div>
              <div className={`text-sm font-semibold ${techPassed ? 'text-blue-300' : 'text-gray-500'}`}>Technisch</div>
              {progress?.techPassedAt && (
                <div className="text-xs text-blue-400/70 mt-1">
                  {new Date(progress.techPassedAt).toLocaleDateString('de-DE')}
                </div>
              )}
              {progress?.techExaminerName && (
                <div className="text-xs text-gray-500 mt-0.5">{progress.techExaminerName}</div>
              )}
              {!techPassed && <div className="text-xs text-gray-600 mt-1">Nicht bestanden</div>}
            </div>
            <div className={`rounded-xl p-4 border text-center ${tacPassed ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
              <div className={`text-2xl font-bold mb-1 ${tacPassed ? 'text-green-400' : techPassed ? 'text-gray-500' : 'text-gray-700'}`}>●</div>
              <div className={`text-sm font-semibold ${tacPassed ? 'text-green-300' : 'text-gray-500'}`}>Taktisch</div>
              {progress?.tacPassedAt && (
                <div className="text-xs text-green-400/70 mt-1">
                  {new Date(progress.tacPassedAt).toLocaleDateString('de-DE')}
                </div>
              )}
              {progress?.tacExaminerName && (
                <div className="text-xs text-gray-500 mt-0.5">{progress.tacExaminerName}</div>
              )}
              {!tacPassed && <div className="text-xs text-gray-600 mt-1">{techPassed ? 'Offen' : 'Gesperrt'}</div>}
            </div>
          </div>

          {/* Trainer-Feedback */}
          {progress?.lastFeedback && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-yellow-500/20">
              <div className="text-xs text-gray-500 mb-1">Letztes Trainer-Feedback</div>
              <p className="text-gray-300 text-sm italic">"{progress.lastFeedback}"</p>
            </div>
          )}

          {/* Aktions-Buttons */}
          {(() => {
            const practiceCount = progress?.practiceCount ?? 0;
            const MIN_PRACTICE = 5;
            const hasEnough = practiceCount >= MIN_PRACTICE;
            const todayStr2 = new Date().toDateString();
            const practicedToday = !!progress?.lastSelfPracticedAt &&
              new Date(progress.lastSelfPracticedAt).toDateString() === todayStr2;

            return (
              <div className="space-y-3">
                {/* Üben-Zeile mit Fortschritt */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { if (!practicedToday) logPractice(tech.id); }}
                    disabled={practicedToday}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      practicedToday
                        ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }`}
                  >
                    🏋️ Als geübt markieren
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: MIN_PRACTICE }).map((_, i) => (
                      <span key={i} className={`w-3 h-3 rounded-full ${i < practiceCount ? 'bg-blue-400' : 'bg-gray-600'}`} />
                    ))}
                    <span className="text-sm text-gray-400 ml-1">{Math.min(practiceCount, MIN_PRACTICE)}/{MIN_PRACTICE}</span>
                  </div>
                  {practicedToday && <span className="text-xs text-gray-500 italic">Heute erledigt</span>}
                </div>

                {/* Prüfungsanfrage */}
                {canRequest && !isPending && (
                  hasEnough ? (
                    <button
                      onClick={() => { handleRequestExam(tech.id); setSelectedTechniqueId(null); }}
                      className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-semibold transition-all text-sm"
                    >
                      {techPassed ? '🔶 Taktische Prüfung anfragen' : '🔷 Technische Prüfung anfragen'}
                    </button>
                  ) : (
                    <div className="w-full bg-gray-700/40 border border-gray-600/30 rounded-xl py-3 text-center">
                      <span className="text-gray-500 text-sm">
                        🔒 Mindestens {MIN_PRACTICE}× üben für Prüfungsanfrage ({practiceCount}/{MIN_PRACTICE})
                      </span>
                    </div>
                  )
                )}
                {isPending && (
                  <div className="w-full flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-medium">Prüfung ausstehend…</span>
                  </div>
                )}
                {tacPassed && (
                  <div className="w-full flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl py-3">
                    <span className="text-green-400 font-semibold text-sm">✅ Vollständig gemeistert</span>
                  </div>
                )}

                {/* Wunschtechnik */}
                {(() => {
                  const alreadyWished = techniqueWishes.some(
                    w => w.techniqueId === tech.id && w.memberId === currentUser.id && w.status === 'pending'
                  );
                  return alreadyWished ? (
                    <div className="w-full flex items-center justify-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-xl py-2.5">
                      <span className="text-purple-400 text-sm">💡 Wunsch gemeldet</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => submitTechniqueWish(tech.id, tech.name, module.id, module.name)}
                      className="w-full bg-gray-700/40 hover:bg-gray-700/70 border border-gray-600/30 hover:border-purple-500/30 text-gray-400 hover:text-purple-300 py-2.5 rounded-xl text-sm transition-all"
                    >
                      💡 Als Wunschtechnik melden
                    </button>
                  );
                })()}
              </div>
            );
          })()}
        </div>
      );
    }

    // ── Modul-Detail ──────────────────────────────────────────────────────────
    if (selectedModule) {
      const module = MODULES.find(m => m.id === selectedModule);
      if (!module) return null;

      return (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedModule(null)}
            className="text-gray-400 hover:text-white flex items-center gap-2"
          >
            ← Zurück zu Modulen
          </button>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{module.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{module.name}</h2>
                <p className="text-gray-400">{module.subtitle}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">{module.description}</p>
          </div>

          {/* Technik-Karten — mit Click für Detail-Ansicht */}
          <div className="space-y-3">
            {module.techniques.map(tech => (
              <TechniqueCard
                key={tech.id}
                technique={tech}
                progress={currentUser.techniqueProgress[tech.id]}
                mode="member"
                onLogPractice={() => logPractice(tech.id)}
                onRequestExam={() => handleRequestExam(tech.id)}
                onClick={() => setSelectedTechniqueId(tech.id)}
              />
            ))}
          </div>

          {/* Nächste Schritte */}
          {(() => {
            const requiredTechs = module.techniques.filter(t => t.isRequired);
            const passedRequired = requiredTechs.filter(t => {
              const s = getTechStatus(t.id);
              return s === 'tech_passed' || s === 'tac_passed';
            });
            const missingRequired = requiredTechs.filter(t => {
              const s = getTechStatus(t.id);
              return s !== 'tech_passed' && s !== 'tac_passed';
            });

            if (requiredTechs.length === 0) return null;

            const percentage = Math.round((passedRequired.length / requiredTechs.length) * 100);
            const levelDisplay = LEVEL_DISPLAY[module.level];

            return (
              <div className="bg-gray-900/60 rounded-xl border border-gray-700 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <h4 className="text-white font-bold text-sm">
                    Was du für <span className={levelDisplay.color}>{levelDisplay.name}</span> brauchst
                  </h4>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Pflicht-Techniken erfüllt</span>
                    <span className="text-white font-medium">{passedRequired.length} / {requiredTechs.length}</span>
                  </div>
                  <ProgressBar progress={percentage} color="bg-green-500" height="h-2" />
                </div>

                {missingRequired.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-red-400 mb-2">Noch fehlend:</div>
                    <div className="space-y-1">
                      {missingRequired.map(t => {
                        const s = getTechStatus(t.id);
                        const isPending = s === 'tech_pending' || s === 'tac_pending';
                        return (
                          <div key={t.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                            <div
                              className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer flex-1"
                              onClick={() => { setSelectedTechniqueId(t.id); }}
                            >
                              <span>{s === 'needs_training' ? '↩' : s === 'tech_passed' ? '◐' : '○'}</span>
                              <span>{t.name}</span>
                            </div>
                            {!isPending ? (
                              <button
                                onClick={() => handleRequestExam(t.id)}
                                className="text-xs bg-yellow-600/70 hover:bg-yellow-600 text-white px-2 py-1 rounded transition-all flex-shrink-0"
                              >
                                {s === 'tech_passed' ? 'Taktisch' : 'Prüfen'}
                              </button>
                            ) : (
                              <span className="text-xs text-yellow-400 flex items-center gap-1 flex-shrink-0">
                                <Loader2 className="w-3 h-3 animate-spin" /> Offen
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {passedRequired.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-green-400 mb-2">Bereits erfüllt:</div>
                    <div className="space-y-1">
                      {passedRequired.map(t => (
                        <div key={t.id} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400">
                          <span>✅</span>
                          <span>{t.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      );
    }
    
    if (selectedBlock) {
      const block = BLOCKS.find(b => b.id === selectedBlock);
      if (!block) return null;
      
      const blockModules = MODULES.filter(m => block.moduleIds.includes(m.id));
      
      return (
        <div className="space-y-4">
          <button 
            onClick={() => setSelectedBlock(null)}
            className="text-gray-400 hover:text-white flex items-center gap-2"
          >
            ← Zurück zu Blocks
          </button>
          
          <div className={`${block.bgColor} rounded-xl p-6 border ${block.borderColor}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{block.icon}</span>
              <div>
                <h2 className={`text-xl font-bold ${block.color}`}>{block.name}</h2>
                <p className="text-gray-400">{block.subtitle}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {blockModules.map(module => {
              const progress = getModuleProgress(currentUser.id, module.id);
              
              return (
                <button
                  key={module.id}
                  onClick={() => setSelectedModule(module.id)}
                  className="w-full bg-gray-800/50 rounded-lg p-4 border border-gray-700 flex items-center justify-between hover:bg-gray-700/50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{module.icon}</span>
                    <div>
                      <div className="text-white font-medium">{module.number}. {module.name}</div>
                      <div className="text-gray-400 text-sm">{module.subtitle}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{progress.completed}/{progress.total}</div>
                    <div className="text-gray-400 text-sm">Techniken</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Alle Ausbildungsstufen</h2>
        
        {BLOCKS.map(block => {
          const unlocked = isBlockUnlocked(currentUser.id, block.level);
          const progress = getBlockProgress(currentUser.id, block.level);
          const applicationStatus = getApplicationStatus(block.level);
          const needsApplication = block.requiresApplication && applicationStatus === 'none';
          const applicationPending = block.requiresApplication && applicationStatus === 'pending';
          const applicationRejected = block.requiresApplication && applicationStatus === 'rejected';
          
          // Determine which application type
          const applicationType: ApplicationType = block.level === 'contact' 
            ? 'contact' 
            : block.level === 'assistant_instructor' 
              ? 'assistant_instructor' 
              : null;
          
          return (
            <button
              key={block.id}
              onClick={() => unlocked && setSelectedBlock(block.id)}
              disabled={!unlocked && !needsApplication}
              className={`w-full ${block.bgColor} rounded-xl p-6 border ${block.borderColor} text-left transition-all ${
                unlocked ? 'hover:scale-[1.02] cursor-pointer' : needsApplication ? 'cursor-pointer opacity-80' : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{block.icon}</span>
                  <div>
                    <div className={`text-xl font-bold ${block.color}`}>{block.name}</div>
                    <div className="text-gray-400">{block.subtitle}</div>
                  </div>
                </div>
                {unlocked ? (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{progress.completed}/{progress.total}</div>
                    <div className="text-gray-400 text-sm">→</div>
                  </div>
                ) : needsApplication && applicationType ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowApplicationModal(applicationType);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      block.level === 'contact' 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }`}
                  >
                    🎓 Jetzt bewerben
                  </button>
                ) : applicationPending ? (
                  <div className="text-yellow-500 text-sm">
                    ⏳ Bewerbung wird geprüft...
                  </div>
                ) : applicationRejected ? (
                  <div className="text-red-400 text-sm">
                    ❌ Bewerbung abgelehnt
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (applicationType) setShowApplicationModal(applicationType);
                      }}
                      className="block text-xs text-gray-400 hover:text-white mt-1"
                    >
                      Erneut bewerben
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-500">🔒</div>
                )}
              </div>
              {unlocked && (
                <div className="mt-4 bg-gray-900/50 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // Render Requests Tab
  const renderRequests = () => {
    const pendingRequests = currentUser.examRequests.filter(r => r.status === 'pending');
    const processedRequests = currentUser.examRequests.filter(r => r.status !== 'pending');

    // Check-in Verlauf des Members (alle, sortiert nach Datum)
    const myCheckIns = checkIns
      .filter(c => c.memberId === currentUser.id)
      .slice()
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

    const myPendingCheckIns = myCheckIns.filter(c => c.status === 'pending');

    const levelBadge = (level: 'technical' | 'tactical') =>
      level === 'technical'
        ? <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">🔷 Technisch</span>
        : <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/20">🔶 Taktisch</span>;

    const formatDate = (d: Date) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const formatTime = (d: Date) => new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    return (
      <div className="space-y-4">
        {/* Sub-Tab Switcher */}
        <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700 gap-1">
          <button
            onClick={() => setMemberRequestSubTab('exams')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              memberRequestSubTab === 'exams' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            🔷 Prüfungsanfragen
            {pendingRequests.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                memberRequestSubTab === 'exams' ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}>
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setMemberRequestSubTab('checkins')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              memberRequestSubTab === 'checkins' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            📍 Check-in Anfragen
            {myPendingCheckIns.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                memberRequestSubTab === 'checkins' ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}>
                {myPendingCheckIns.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Meine Prüfungsanfragen ───────────────────────────────────── */}
        {memberRequestSubTab === 'exams' && (
          <div className="space-y-4">
            {/* Offene */}
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
              <h3 className="text-base font-bold text-white mb-4">⏳ Offen</h3>
              {pendingRequests.length === 0 ? (
                <p className="text-gray-500 text-sm">Keine offenen Prüfungsanfragen</p>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="bg-gray-700/50 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-white">{req.techniqueName}</div>
                          <div className="text-gray-400 text-xs mt-0.5">{req.moduleName}</div>
                        </div>
                        {levelBadge(req.examLevel)}
                      </div>
                      <div className="text-yellow-500/80 text-xs mt-2 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Gesendet am {new Date(req.requestedAt).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Abgeschlossene */}
            {processedRequests.length > 0 && (
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <h3 className="text-base font-bold text-white mb-4">📋 Abgeschlossen</h3>
                <div className="space-y-3">
                  {processedRequests.slice(-10).reverse().map(req => (
                    <div key={req.id} className="bg-gray-700/50 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold text-white">{req.techniqueName}</div>
                          <div className="text-gray-400 text-xs mt-0.5">{req.moduleName}</div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-end gap-1">
                          {levelBadge(req.examLevel)}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            req.status === 'passed'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-orange-500/20 text-orange-400'
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
              </div>
            )}
          </div>
        )}

        {/* ── Meine Check-in Anfragen ──────────────────────────────────── */}
        {memberRequestSubTab === 'checkins' && (
          <div className="space-y-3">
            {myCheckIns.length === 0 ? (
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center">
                <p className="text-gray-500 text-sm">Noch keine Check-ins angefragt</p>
              </div>
            ) : (
              myCheckIns.slice(0, 20).map(ci => (
                <div key={ci.id} className="bg-gray-800/50 rounded-xl border border-gray-700 px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium">
                      {formatDate(ci.requestedAt)}
                    </div>
                    <div className="text-gray-500 text-xs">{formatTime(ci.requestedAt)} Uhr</div>
                  </div>
                  <div className="flex-shrink-0">
                    {ci.status === 'pending' && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Ausstehend
                      </span>
                    )}
                    {ci.status === 'approved' && (
                      <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full">
                        ✅ Bestätigt
                      </span>
                    )}
                    {ci.status === 'rejected' && (
                      <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full">
                        ✕ Abgelehnt
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  // Contact Application Modal
  const renderContactApplicationModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">☠️ CONTACT READY Bewerbung</h2>
        <p className="text-gray-400 mb-6">
          Contact Ready (Operator) ist nur auf Bewerbung und Freigabe durch den Owner möglich.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2">Motivation *</label>
            <textarea
              value={contactAnswers.motivation}
              onChange={(e) => setContactAnswers(prev => ({ ...prev, motivation: e.target.value }))}
              placeholder="Warum möchtest du Operator werden?"
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Erfahrung *</label>
            <textarea
              value={contactAnswers.experience}
              onChange={(e) => setContactAnswers(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="Beschreibe deinen Kampfsport-Hintergrund"
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Teamfähigkeit *</label>
            <textarea
              value={contactAnswers.teamwork}
              onChange={(e) => setContactAnswers(prev => ({ ...prev, teamwork: e.target.value }))}
              placeholder="Wie arbeitest du im Team?"
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Stressbewältigung *</label>
            <textarea
              value={contactAnswers.stressHandling}
              onChange={(e) => setContactAnswers(prev => ({ ...prev, stressHandling: e.target.value }))}
              placeholder="Wie gehst du mit Hochstress-Situationen um?"
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Schutz Dritter *</label>
            <textarea
              value={contactAnswers.protectionOfOthers}
              onChange={(e) => setContactAnswers(prev => ({ ...prev, protectionOfOthers: e.target.value }))}
              placeholder="Wie würdest du andere schützen?"
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Verfügbarkeit</label>
            <textarea
              value={contactAnswers.availability}
              onChange={(e) => setContactAnswers(prev => ({ ...prev, availability: e.target.value }))}
              placeholder="Wann bist du verfügbar?"
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
              rows={2}
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowApplicationModal(null)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSubmitContactApplication}
            disabled={!contactAnswers.motivation || !contactAnswers.experience || !contactAnswers.teamwork || !contactAnswers.stressHandling || !contactAnswers.protectionOfOthers}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium"
          >
            Bewerbung absenden
          </button>
        </div>
      </div>
    </div>
  );

  // Assistant Instructor Application Modal
  const renderInstructorApplicationModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">🎓 ASSISTANT INSTRUCTOR Bewerbung</h2>
        <p className="text-gray-400 mb-6">
          Du möchtest Instructor werden und andere unterrichten? Beantworte uns ein paar Fragen.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2">Motivation *</label>
            <textarea
              value={instructorAnswers.motivation}
              onChange={(e) => setInstructorAnswers(prev => ({ ...prev, motivation: e.target.value }))}
              placeholder="Warum möchtest du Instructor werden?"
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Unterrichtserfahrung *</label>
            <textarea
              value={instructorAnswers.teachingExperience}
              onChange={(e) => setInstructorAnswers(prev => ({ ...prev, teachingExperience: e.target.value }))}
              placeholder="Hast du bereits Unterrichtserfahrung? (Sport, Arbeit, etc.)"
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Stärken & Schwächen *</label>
            <textarea
              value={instructorAnswers.strengthsWeaknesses}
              onChange={(e) => setInstructorAnswers(prev => ({ ...prev, strengthsWeaknesses: e.target.value }))}
              placeholder="Was sind deine Stärken und Schwächen?"
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Verfügbarkeit *</label>
            <textarea
              value={instructorAnswers.availability}
              onChange={(e) => setInstructorAnswers(prev => ({ ...prev, availability: e.target.value }))}
              placeholder="Wann könntest du unterrichten? (Tage, Uhrzeiten)"
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Ziele *</label>
            <textarea
              value={instructorAnswers.goals}
              onChange={(e) => setInstructorAnswers(prev => ({ ...prev, goals: e.target.value }))}
              placeholder="Was sind deine Ziele als Instructor?"
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-white mb-2">Dein Vorbild</label>
            <textarea
              value={instructorAnswers.roleModel}
              onChange={(e) => setInstructorAnswers(prev => ({ ...prev, roleModel: e.target.value }))}
              placeholder="Was macht für dich einen guten Instructor aus?"
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
              rows={2}
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowApplicationModal(null)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSubmitInstructorApplication}
            disabled={!instructorAnswers.motivation || !instructorAnswers.teachingExperience || !instructorAnswers.strengthsWeaknesses || !instructorAnswers.availability || !instructorAnswers.goals}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium"
          >
            Bewerbung absenden
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Content */}
      <main className={`max-w-4xl mx-auto ${activeTab === 'lernen' ? 'h-[calc(100vh-4rem)] flex flex-col' : activeTab === 'profil' ? '' : 'p-4 pb-24'}`}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'lernen' && <MemberLearningView />}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            {/* Sub-Nav */}
            <div className="flex gap-2 bg-gray-800/50 rounded-xl p-1 border border-gray-700">
              <button
                onClick={() => { setProgressView('ranking'); setSelectedBlock(null); setSelectedModule(null); setSelectedTechniqueId(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  progressView === 'ranking' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                🏆 Rangliste
              </button>
              <button
                onClick={() => setProgressView('myProgress')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  progressView === 'myProgress' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                📊 Mein Fortschritt
              </button>
            </div>
            {progressView === 'ranking' ? renderRanking() : renderProgress()}
          </div>
        )}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'profil' && <ProfileView member={currentUser} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto flex">
          {[
            { id: 'dashboard' as Tab, icon: '🏠', label: 'Dashboard' },
            { id: 'lernen' as Tab, icon: '🎓', label: 'Lernen' },
            { id: 'progress' as Tab, icon: '🏆', label: 'Rang' },
            { id: 'requests' as Tab, icon: '📝', label: 'Anfragen' },
            { id: 'profil' as Tab, icon: '👤', label: 'Profil' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedBlock(null);
                setSelectedModule(null);
                setSelectedTechniqueId(null);
              }}
              className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
                activeTab === tab.id ? 'text-red-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Application Modals */}
      {showApplicationModal === 'contact' && renderContactApplicationModal()}
      {showApplicationModal === 'assistant_instructor' && renderInstructorApplicationModal()}
    </div>
  );
};

export default MemberView;
