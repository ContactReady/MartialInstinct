// ============================================
// MARTIAL INSTINCT - MEMBER VIEW
// Simpel für Members - nur Status, keine Prozente
// ============================================

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MemberTabId } from '../../types';
import { MemberLearningView } from './MemberLearningView';
import { ProfileView } from '../shared/ProfileView';
import { RankingList } from '../shared/RankingList';

type Tab = 'training' | 'community' | 'profil';
type ApplicationType = 'contact' | 'assistant_instructor' | null;

export const MemberView: React.FC = () => {
  const {
    currentUser,
    members,
    requestCheckIn,
    checkIns,
    submitContactApplication,
    submitInstructorApplication,
    tabConfig,
    connectWithCode,
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<Tab>('training');
  const [showApplicationModal, setShowApplicationModal] = useState<ApplicationType>(null);
  const [communitySubTab, setCommunitySubTab] = useState<'online' | 'training' | 'mitglieder' | 'rangliste'>('online');
  const [connectCode, setConnectCode] = useState('');
  const [connectResult, setConnectResult] = useState<{ type: 'success' | 'error' | 'duplicate'; message: string } | null>(null);

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

  // ── Community Tab ──────────────────────────────────────────────────────────
  const renderCommunity = () => {
    const myConnections = (currentUser.connections ?? []);
    const connectedMembers = members.filter(m => myConnections.includes(m.id));
    const onlineConnected = connectedMembers.filter(m => m.onlineSince);
    const trainingConnected = connectedMembers.filter(m => m.isCheckedIn);
    const myCode = currentUser.id.slice(0, 8).toUpperCase();

    const handleConnect = () => {
      if (!connectCode.trim()) return;
      const result = connectWithCode(connectCode.trim());
      if (result.success) {
        setConnectResult({ type: 'success', message: `Verbunden mit ${result.memberName}!` });
        setConnectCode('');
      } else if (result.memberName) {
        setConnectResult({ type: 'duplicate', message: `Bereits verbunden mit ${result.memberName}.` });
      } else {
        setConnectResult({ type: 'error', message: 'Code nicht gefunden. Lass dir den Code direkt zeigen.' });
      }
      setTimeout(() => setConnectResult(null), 4000);
    };

    const formatTimeAgo = (date: Date | undefined): string => {
      if (!date) return '';
      const diff = Date.now() - new Date(date).getTime();
      const min = Math.floor(diff / 60000);
      if (min < 1) return 'Gerade eben';
      if (min < 60) return `vor ${min} Min`;
      const h = Math.floor(diff / 3600000);
      if (h < 24) return `vor ${h} Std`;
      return `vor ${Math.floor(diff / 86400000)} Tagen`;
    };

    return (
      <div className="space-y-4">
        {/* Sub-Tab Switcher */}
        <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700 gap-1">
          {([
            { id: 'online' as const, label: '🟢 Online', badge: onlineConnected.length },
            { id: 'training' as const, label: '🥋 Training', badge: trainingConnected.length },
            { id: 'mitglieder' as const, label: '👥 Mitglieder' },
            { id: 'rangliste' as const, label: '🏆 Rang' },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setCommunitySubTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-[10px] font-semibold transition-all relative flex items-center justify-center gap-1 ${
                communitySubTab === tab.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {'badge' in tab && tab.badge !== undefined && tab.badge > 0 && (
                <span className="text-[9px] bg-red-500 text-white px-1 rounded-full font-bold">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── ONLINE ── */}
        {communitySubTab === 'online' && (
          <div className="space-y-3">
            {myConnections.length === 0 ? (
              <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 p-8 text-center">
                <div className="text-3xl mb-2">👥</div>
                <p className="text-gray-400 text-sm font-medium">Noch keine Verbindungen</p>
                <p className="text-gray-500 text-xs mt-1">Verbinde dich im Training unter "Mitglieder".</p>
              </div>
            ) : onlineConnected.length === 0 ? (
              <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 p-8 text-center">
                <div className="text-3xl mb-2">😴</div>
                <p className="text-gray-400 text-sm font-medium">Keine Verbindungen gerade online</p>
                <p className="text-gray-500 text-xs mt-1">{connectedMembers.length} Verbindung{connectedMembers.length !== 1 ? 'en' : ''} insgesamt</p>
              </div>
            ) : (
              onlineConnected.map(m => (
                <div key={m.id} className="bg-gray-800/50 rounded-xl border border-gray-700 px-4 py-3 flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <span className="text-2xl">{m.avatar}</span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-gray-900 animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm">{m.name}</div>
                    <div className="text-gray-500 text-xs">{formatTimeAgo(m.onlineSince)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── TRAINING ── */}
        {communitySubTab === 'training' && (
          <div className="space-y-3">
            {myConnections.length === 0 ? (
              <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 p-8 text-center">
                <div className="text-3xl mb-2">🥋</div>
                <p className="text-gray-400 text-sm font-medium">Noch keine Verbindungen</p>
                <p className="text-gray-500 text-xs mt-1">Verbinde dich im Training unter "Mitglieder".</p>
              </div>
            ) : trainingConnected.length === 0 ? (
              <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 p-8 text-center">
                <div className="text-3xl mb-2">🥋</div>
                <p className="text-gray-400 text-sm font-medium">Niemand aus deinen Verbindungen trainiert gerade</p>
                <p className="text-gray-500 text-xs mt-1">{connectedMembers.length} Verbindung{connectedMembers.length !== 1 ? 'en' : ''} insgesamt</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-xs px-1 mb-2">Gerade im Training ({trainingConnected.length})</p>
                {trainingConnected.map(m => (
                  <div key={m.id} className="bg-gray-800/50 rounded-xl border border-orange-800/30 px-4 py-3 flex items-center gap-3 mb-2">
                    <div className="relative flex-shrink-0">
                      <span className="text-2xl">{m.avatar}</span>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-400 rounded-full border border-gray-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm">{m.name}</div>
                      <div className="text-orange-400/70 text-xs">🥋 Im Training</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MITGLIEDER ── */}
        {communitySubTab === 'mitglieder' && (
          <div className="space-y-4">
            {/* Mein Code */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Dein Connect-Code</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-900 rounded-lg py-3 px-4 text-center">
                  <span className="text-white font-black text-2xl tracking-[0.3em] font-mono">{myCode}</span>
                </div>
              </div>
              <p className="text-gray-600 text-xs mt-2">Zeig diesen Code einem Trainingspartner — er gibt ihn ein um euch zu verbinden.</p>
            </div>

            {/* Code eingeben */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Code eingeben</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={connectCode}
                  onChange={e => setConnectCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleConnect()}
                  placeholder="z.B. A3F7B2E9"
                  maxLength={8}
                  className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-gray-400 focus:outline-none font-mono tracking-widest text-sm uppercase placeholder-gray-600"
                />
                <button
                  onClick={handleConnect}
                  disabled={connectCode.length < 6}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-semibold text-sm transition-all"
                >
                  Verbinden
                </button>
              </div>
              {connectResult && (
                <p className={`text-xs mt-2 ${
                  connectResult.type === 'success' ? 'text-green-400' :
                  connectResult.type === 'duplicate' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {connectResult.type === 'success' ? '✅' : connectResult.type === 'duplicate' ? 'ℹ️' : '✗'} {connectResult.message}
                </p>
              )}
            </div>

            {/* Verbundene Mitglieder */}
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider px-1 mb-2">
                Verbindungen ({connectedMembers.length})
              </p>
              {connectedMembers.length === 0 ? (
                <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 p-6 text-center">
                  <p className="text-gray-500 text-sm">Noch keine Verbindungen</p>
                  <p className="text-gray-600 text-xs mt-1">Tauscht im Training eure Codes aus.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {connectedMembers.map(m => {
                    const status = m.isCheckedIn ? 'training' : m.onlineSince ? 'online' : 'offline';
                    return (
                      <div key={m.id} className="bg-gray-800/50 rounded-xl border border-gray-700 px-4 py-3 flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <span className="text-2xl">{m.avatar}</span>
                          <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-gray-900 ${
                            status === 'training' ? 'bg-orange-400' :
                            status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-semibold text-sm">{m.name}</div>
                          <div className="text-gray-500 text-xs">
                            {status === 'training' ? '🥋 Im Training' :
                             status === 'online' ? '🟢 Online' : '⚫ Offline'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── RANGLISTE ── */}
        {communitySubTab === 'rangliste' && renderRanking()}
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

      {/* ── Fixed Check-In Bar ─────────────────────────────── */}
      <div className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 border-b ${
        checkInStatus === 'approved'
          ? 'bg-green-950/80 border-green-800/50'
          : 'bg-gray-900 border-gray-800'
      }`} style={{ height: '44px' }}>
        <div className="flex flex-col justify-center">
          <span className="text-[11px] font-bold text-white leading-tight">Trainings Check-In</span>
          <span className={`text-[10px] leading-tight ${checkInStatus === 'approved' ? 'text-green-400' : checkInStatus === 'pending' ? 'text-gray-400' : 'text-gray-500'}`}>
            {checkInStatus === 'approved'
              ? `✓ Eingecheckt${checkInApprovedAt ? ` · ${checkInApprovedAt.getHours().toString().padStart(2,'0')}:${checkInApprovedAt.getMinutes().toString().padStart(2,'0')} Uhr` : ''}`
              : checkInStatus === 'pending'
              ? 'Warte auf Trainer-Bestätigung…'
              : 'Sei heute dabei!'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {checkInStatus === 'none' && (
            <button
              onClick={requestCheckIn}
              className="bg-red-600 hover:bg-red-500 active:scale-95 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-all"
            >
              Einchecken
            </button>
          )}
          {checkInStatus === 'pending' && (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          )}
          {/* Profil-Avatar */}
          <button
            onClick={() => setActiveTab(activeTab === 'profil' ? 'training' : 'profil')}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden border-2 transition-all ${
              activeTab === 'profil' ? 'border-red-500 text-red-400' : 'border-gray-700 bg-gray-800 text-gray-300'
            }`}
          >
            {currentUser.profileImageUrl
              ? <img src={currentUser.profileImageUrl} className="w-full h-full object-cover" alt="" />
              : currentUser.name[0].toUpperCase()}
          </button>
        </div>
      </div>

      {/* Content */}
      <main className={`max-w-4xl mx-auto ${activeTab === 'training' ? 'pt-11 h-[calc(100vh-2.75rem)] flex flex-col' : 'pt-11 pb-20'}`}>
        {activeTab === 'training' && <MemberLearningView />}
        {activeTab === 'community' && <div className="p-4">{renderCommunity()}</div>}
        {activeTab === 'profil' && <ProfileView member={currentUser} />}
      </main>

      {/* ── Fixed Bottom Navigation ────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40">
        <div className="max-w-4xl mx-auto flex">
          {([
            { id: 'training' as Tab, icon: '🥋', label: 'Training' },
            { id: 'community' as Tab, icon: '👥', label: 'Community' },
          ] as { id: Tab; icon: string; label: string }[]).map(tab => {
            const tabEnabled = tabConfig.memberTabs[tab.id as MemberTabId] !== false;
            return (
              <button
                key={tab.id}
                onClick={() => { if (tabEnabled) setActiveTab(tab.id); }}
                className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-all relative ${
                  !tabEnabled ? 'opacity-30 cursor-not-allowed'
                    : activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tabEnabled && activeTab === tab.id && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-red-500 rounded-full" />
                )}
                <span className={`text-xl transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`}>{tab.icon}</span>
                <span className={`text-[11px] ${activeTab === tab.id ? 'font-semibold' : ''}`}>{tab.label}</span>
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
