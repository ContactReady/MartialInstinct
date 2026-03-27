// ============================================
// MARTIAL INSTINCT - MEMBER VIEW
// Simpel für Members - nur Status, keine Prozente
// ============================================

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MemberTabId } from '../../types';
import { BLOCKS } from '../../data/modules';
import { MemberLearningView } from './MemberLearningView';
import { ProfileView } from '../shared/ProfileView';
import { RankingList } from '../shared/RankingList';

type Tab = 'dashboard' | 'training' | 'progress' | 'profil';
type ApplicationType = 'contact' | 'assistant_instructor' | null;

export const MemberView: React.FC = () => {
  const {
    currentUser,
    members,
    requestCheckIn,
    checkIns,
    useBandaid,
    getBlockProgress,
    isBlockUnlocked,
    submitContactApplication,
    submitInstructorApplication,
    getSessionsForMember,
    tabConfig,
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showApplicationModal, setShowApplicationModal] = useState<ApplicationType>(null);
  
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





  // Check-in Status aus dem geteilten checkIns-Array ableiten (aktualisiert sich sofort wenn Trainer bestätigt)
  const todayStr = now.toDateString();
  const todayCheckIn = checkIns.find(
    c => c.memberId === currentUser.id &&
         new Date(c.requestedAt).toDateString() === todayStr
  );
  const checkInStatus = todayCheckIn?.status ?? 'none'; // 'none' | 'pending' | 'approved' | 'rejected'
  const checkInApprovedAt = todayCheckIn?.approvedAt ? new Date(todayCheckIn.approvedAt) : null;

  // Count completed techniques (mindestens technisch bestanden)
  const getCompletedCount = (): number => {
    return Object.values(currentUser.techniqueProgress).filter(
      p => p.status === 'tech_passed' || p.status === 'tac_passed'
    ).length;
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
          <div className={`font-black leading-none flex items-baseline justify-center gap-0.5 ${currentUser.streak.bandaids > 0 ? 'text-green-400' : 'text-gray-500'}`}>
            <span className="text-2xl">{currentUser.streak.bandaids}</span>
            <span className="text-sm font-medium opacity-50">/{currentUser.streak.maxBandaids}</span>
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
    const rankMembers = members.filter(m => m.role === 'member');
    return (
      <RankingList
        members={rankMembers}
        currentUserId={currentUser.id}
        currentUserLevel={currentUser.currentLevel}
        checkIns={checkIns}
        showLevelFilter={true}
      />
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
      <main className={`max-w-4xl mx-auto ${activeTab === 'training' ? 'h-[calc(100vh-4rem)] flex flex-col' : activeTab === 'profil' ? '' : 'p-4 pb-24'}`}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'training' && <MemberLearningView />}
        {activeTab === 'progress' && renderRanking()}
        {activeTab === 'profil' && <ProfileView member={currentUser} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto flex">
          {([
            { id: 'dashboard' as Tab, icon: '🏠', label: 'Dashboard' },
            { id: 'training' as Tab, icon: '🥋', label: 'Training' },
            { id: 'progress' as Tab, icon: '🏆', label: 'Rang' },
            { id: 'profil' as Tab, icon: '👤', label: 'Profil' },
          ] as { id: Tab; icon: string; label: string }[]).map(tab => {
            const tabEnabled = tabConfig.memberTabs[tab.id as MemberTabId] !== false;
            return (
              <button
                key={tab.id}
                onClick={() => { if (tabEnabled) setActiveTab(tab.id); }}
                className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all relative ${
                  !tabEnabled ? 'opacity-30 cursor-not-allowed'
                    : activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tabEnabled && activeTab === tab.id && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-500 rounded-full" />
                )}
                <span className={`text-xl transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`}>{tab.icon}</span>
                <span className={`text-xs ${activeTab === tab.id ? 'font-semibold' : ''}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Application Modals */}
      {showApplicationModal === 'contact' && renderContactApplicationModal()}
      {showApplicationModal === 'assistant_instructor' && renderInstructorApplicationModal()}
    </div>
  );
};

export default MemberView;
