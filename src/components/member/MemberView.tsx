// ============================================
// MARTIAL INSTINCT - MEMBER VIEW
// Simpel für Members - nur Status, keine Prozente
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MemberTabId, Badge } from '../../types';
import { BLOCKS, MODULES } from '../../data/modules';
import { xpProgress, LEVEL_DISPLAY } from '../../types';
import { MemberLearningView } from './MemberLearningView';
import { ProfileView } from '../shared/ProfileView';
import { RankingList } from '../shared/RankingList';

type Tab = 'dashboard' | 'training' | 'community' | 'profil';
type ApplicationType = 'contact' | 'assistant_instructor' | null;

export const MemberView: React.FC<{ onSwitchToAdmin?: () => void }> = ({ onSwitchToAdmin }) => {
  const {
    currentUser,
    members,
    requestCheckIn,
    cancelCheckIn,
    checkIns,
    trainingUnits,
    isBlockUnlocked,
    submitContactApplication,
    submitInstructorApplication,
    getSessionsForMember,
    tabConfig,
    generateBuddyCode,
    sendBuddyRequest,
    acceptBuddyRequest,
    getPendingBuddyRequests,
    platformConfig,
    getModuleName,
    boardMessages,
    markBoardMessageRead,
    addBoardReply,
    boardRepliesGloballyEnabled,
    effectiveBlocks,
    moduleOrder,
    moduleSettings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>(() => (localStorage.getItem('mi_active_tab_member') as Tab) || 'dashboard');
  const setActiveTabPersisted = (tab: Tab) => { setActiveTab(tab); localStorage.setItem('mi_active_tab_member', tab); };
  const [dashboardSubTab, setDashboardSubTab] = useState<'fortschritt' | 'board'>('fortschritt');
  const [boardReplyOpenId, setBoardReplyOpenId] = useState<string | null>(null);
  const [boardReplyText, setBoardReplyText] = useState('');
  const [showApplicationModal, setShowApplicationModal] = useState<ApplicationType>(null);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>(undefined);
  const [communitySubTab, setCommunitySubTab] = useState<'online' | 'training' | 'mitglieder' | 'rangliste'>('online');
  const communityTabs = ['online', 'training', 'mitglieder', 'rangliste'] as const;
  const communitySubTabRef = useRef(communitySubTab);
  useEffect(() => { communitySubTabRef.current = communitySubTab; }, [communitySubTab]);

  useEffect(() => {
    if (activeTab !== 'community') return;
    let startX = 0, startY = 0;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      const tabs = communityTabs;
      const idx = tabs.indexOf(communitySubTabRef.current);
      if (dx < 0 && idx < tabs.length - 1) setCommunitySubTab(tabs[idx + 1]);
      if (dx > 0 && idx > 0) setCommunitySubTab(tabs[idx - 1]);
    };
    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchend', onEnd, { passive: true });
    return () => { document.removeEventListener('touchstart', onStart); document.removeEventListener('touchend', onEnd); };
  }, [activeTab]);
  const [connectCode, setConnectCode] = useState('');
  const [generatedBuddyCode, setGeneratedBuddyCode] = useState<string | null>(null);
  const [buddyCodeExpiresAt, setBuddyCodeExpiresAt] = useState<number | null>(null);
  const [buddyCodeSecondsLeft, setBuddyCodeSecondsLeft] = useState<number>(0);
  const [isConnectInputFocused, setIsConnectInputFocused] = useState(false);
  const [buddyRequestResult, setBuddyRequestResult] = useState<{ ok: boolean; error?: string } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

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

  // Buddy-Code Countdown
  useEffect(() => {
    if (!buddyCodeExpiresAt) return;
    const tick = () => {
      const left = Math.max(0, Math.round((buddyCodeExpiresAt - Date.now()) / 1000));
      setBuddyCodeSecondsLeft(left);
      if (left === 0) {
        setGeneratedBuddyCode(null);
        setBuddyCodeExpiresAt(null);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [buddyCodeExpiresAt]);

  if (!currentUser) return null;





  // Check-in Status aus dem geteilten checkIns-Array ableiten (aktualisiert sich sofort wenn Trainer bestätigt)
  const todayStr = now.toDateString();
  const todayCheckIn = checkIns.find(
    c => c.memberId === currentUser.id &&
         new Date(c.requestedAt).toDateString() === todayStr
  );
  const checkInStatus = todayCheckIn?.status ?? 'none'; // 'none' | 'pending' | 'approved' | 'rejected'
  const checkInApprovedAt = todayCheckIn?.approvedAt ? new Date(todayCheckIn.approvedAt) : null;

  // Heutige Trainingseinheiten
  const todayDay = now.getDay();
  const nowTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const todayUnits = trainingUnits.filter(u => u.daysOfWeek.includes(todayDay));
  const activeUnit = todayUnits.find(u => nowTime >= u.startTime && nowTime < u.endTime);
  const DAY_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  // Einheit zum genehmigten Check-in (für Zeitanzeige nach Bestätigung)
  const approvedUnit = todayCheckIn?.unitId
    ? trainingUnits.find(u => u.id === todayCheckIn.unitId)
    : undefined;

  const handleCheckInPress = () => {
    // Immer Picker anzeigen — auch wenn kein Kurs heute
    setSelectedUnitId(activeUnit?.id ?? todayUnits[0]?.id ?? trainingUnits[0]?.id);
    setShowUnitPicker(true);
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

  // ── Dashboard Tab ──────────────────────────────────────────────────────────
  const renderDashboard = () => {
    const mySessions = getSessionsForMember(currentUser.id)
      .filter(s => s.status === 'completed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    // ── XP-Fortschritt ──
    const xpProg = xpProgress(currentUser.xp ?? 0, platformConfig);
    const xpPercent = Math.min(100, Math.round((xpProg.current / xpProg.needed) * 100));
    const levelInfo = LEVEL_DISPLAY[currentUser.currentLevel];

    // ── Stats-Berechnungen (nur Pflichttechniken aus sichtbaren Blöcken) ──
    const isAdminUser = currentUser.role === 'admin';
    const assignedMods = new Set(currentUser.instructorModules ?? []);
    const dashboardBlocks = effectiveBlocks.filter(b =>
      (!b.adminOnly || isAdminUser || b.moduleIds.some(mid => assignedMods.has(mid))) && !b.disabled
    );
    const visibleModuleIds = new Set(dashboardBlocks.flatMap(b => b.moduleIds));
    const allRequired = MODULES
      .filter(m => visibleModuleIds.has(m.id))
      .flatMap(m => m.techniques.filter(t => t.isRequired));
    const totalRequired = allRequired.length;
    const tacticsPassed = allRequired.filter(t => {
      const s = currentUser.techniqueProgress[t.id]?.status;
      return s === 'tech_passed' || s === 'tac_passed';
    }).length;
    const totalPassedRequired = tacticsPassed;
    const totalPercent = totalRequired > 0 ? Math.round((tacticsPassed / totalRequired) * 100) : 0;

    // ── Modul-Kacheln: Anzahl Module (nicht Techniken) ──
    const visibleModules = MODULES.filter(m => visibleModuleIds.has(m.id));
    const tacticsModsDone = visibleModules.filter(mod => {
      const req = mod.techniques.filter(t => t.isRequired);
      return req.length > 0 && req.every(t => {
        const s = currentUser.techniqueProgress[t.id]?.status;
        return s === 'tech_passed' || s === 'tac_passed';
      });
    }).length;
    const combatModsDone = visibleModules.filter(mod => {
      const req = mod.techniques.filter(t => t.isRequired);
      return req.length > 0 && req.every(t =>
        currentUser.techniqueProgress[t.id]?.status === 'tac_passed'
      );
    }).length;
    const totalVisibleMods = visibleModules.length;

    // ── Offene Prüfungsanfragen ──
    const pendingExams = currentUser.examRequests.filter(r => r.status === 'pending');

    // ── Board: Nachrichten die für dieses Member sichtbar sind ──
    const visibleBoardMessages = boardMessages.filter(msg => {
      if (msg.visibility === 'restricted') {
        if (msg.authorId === currentUser.id) return true;
        if (msg.targetType === 'all') return true;
        if (msg.targetType === 'gender') return msg.targetGenders ? msg.targetGenders.includes(currentUser.gender as any) : true;
        if (msg.targetType === 'activity') return msg.targetMemberIds ? msg.targetMemberIds.includes(currentUser.id) : true;
        if (msg.targetType === 'roles' && msg.targetRoles) return msg.targetRoles.includes(currentUser.role);
        if (msg.targetType === 'members' && msg.targetMemberIds) return msg.targetMemberIds.includes(currentUser.id);
        return false;
      }
      return true;
    }).slice().reverse();
    const unreadBoardCount = visibleBoardMessages.filter(m => !(m.readBy ?? []).includes(currentUser.id)).length;

    return (
      <div className="space-y-3 p-4 pb-24">

        {/* ── Check-In ── */}
        <div className="sticky top-[var(--mi-header-h)] z-20 bg-gray-950 -mx-4 px-4 pt-2 pb-2">
        <div className={`rounded-xl border transition-all ${
          checkInStatus === 'approved' ? 'bg-green-900/20 border-green-600/40'
          : 'bg-gray-800/50 border-gray-700'
        }`}>
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-bold text-white">Trainings Check-In</div>
              <div className={`text-xs mt-0.5 ${checkInStatus === 'approved' ? 'text-green-400' : 'text-gray-400'}`}>
                {checkInStatus === 'approved'
                  ? approvedUnit
                    ? `✅ ${approvedUnit.name} · ${approvedUnit.startTime}–${approvedUnit.endTime} Uhr`
                    : `✅ Eingecheckt${checkInApprovedAt ? ` · ${checkInApprovedAt.getHours().toString().padStart(2,'0')}:${checkInApprovedAt.getMinutes().toString().padStart(2,'0')} Uhr` : ''}`
                  : checkInStatus === 'pending' ? `Warte auf Bestätigung…${todayCheckIn?.unitName ? ` (${todayCheckIn.unitName})` : ''}`
                  : 'Sei heute dabei!'}
              </div>
            </div>
            {checkInStatus === 'approved' ? (
              <span className="text-green-400 text-xs font-bold flex-shrink-0">✓ Dabei</span>
            ) : checkInStatus === 'pending' ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                <button
                  onClick={() => todayCheckIn && cancelCheckIn(todayCheckIn.id)}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                  title="Anfrage zurückziehen"
                >✕</button>
              </div>
            ) : (
              <button onClick={handleCheckInPress} className="flex-shrink-0 bg-red-600 hover:bg-red-500 active:scale-95 text-white px-4 py-1.5 rounded-lg font-bold text-sm transition-all">
                Check-In
              </button>
            )}
          </div>

          {/* ── Unit-Picker ── */}
          {showUnitPicker && checkInStatus === 'none' && (
            <div className="border-t border-gray-700/60 px-4 py-3 space-y-2">
              <p className="text-xs text-gray-400 font-medium">Für welche Einheit?</p>
              <div className="space-y-1.5">
                {(todayUnits.length > 0 ? todayUnits : trainingUnits).map(unit => {
                  const isActive = unit.daysOfWeek.includes(todayDay) && nowTime >= unit.startTime && nowTime < unit.endTime;
                  const isSelected = selectedUnitId === unit.id;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => setSelectedUnitId(unit.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-red-600/20 border-red-500/60 text-white'
                          : 'bg-gray-700/40 border-gray-600/40 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{unit.name}</span>
                        {isActive && <span className="text-xs text-green-400 font-medium">läuft jetzt</span>}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {unit.daysOfWeek.map(d => DAY_SHORT[d]).join(', ')} · {unit.startTime}–{unit.endTime} Uhr
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setShowUnitPicker(false); setSelectedUnitId(undefined); }}
                  className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-600 transition-all"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => { requestCheckIn(selectedUnitId); setShowUnitPicker(false); }}
                  className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all"
                >
                  Einchecken
                </button>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* ── Sub-Tab Switcher ── */}
        <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700 gap-1">
          {([
            { id: 'fortschritt' as const, label: '📊 Fortschritt' },
            { id: 'board' as const, label: '💬 Board', badge: unreadBoardCount },
          ]).map(tab => (
            <button key={tab.id} onClick={() => setDashboardSubTab(tab.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                dashboardSubTab === tab.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center ${
                  dashboardSubTab === tab.id ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'
                }`}>{tab.badge > 9 ? '9+' : tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {dashboardSubTab === 'board' && (
          <div className="space-y-3">
            {visibleBoardMessages.length === 0 ? (
              <div className="bg-gray-800/30 rounded-xl p-6 text-center text-gray-500 text-sm border border-gray-700/30">
                Keine Nachrichten
              </div>
            ) : visibleBoardMessages.map(msg => {
              const readBy = msg.readBy ?? [];
              const hasRead = readBy.includes(currentUser.id);
              const replyOpen = boardReplyOpenId === msg.id;
              return (
                <div key={msg.id} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <span className="text-white font-medium text-sm">{msg.authorName}</span>
                      <span className="text-gray-500 text-xs flex-shrink-0">
                        {(() => {
                          const diff = Date.now() - new Date(msg.createdAt).getTime();
                          const min = Math.floor(diff / 60000);
                          if (min < 1) return 'Gerade eben';
                          if (min < 60) return `vor ${min} Min`;
                          const h = Math.floor(diff / 3600000);
                          if (h < 24) return `vor ${h} Std`;
                          return `vor ${Math.floor(diff / 86400000)} Tagen`;
                        })()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{msg.content}</p>
                    <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-gray-700/40">
                      <button
                        onClick={() => !hasRead && markBoardMessageRead(msg.id)}
                        disabled={hasRead}
                        className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                          hasRead ? 'text-gray-600 border-gray-700/50 cursor-default'
                          : 'text-gray-300 border-gray-600 hover:border-gray-400 hover:text-white'
                        }`}
                      >
                        {hasRead ? '✓ Gelesen' : 'Als gelesen markieren'}
                      </button>
                      {boardRepliesGloballyEnabled && msg.repliesEnabled !== false ? (
                        <button
                          onClick={() => { setBoardReplyOpenId(replyOpen ? null : msg.id); setBoardReplyText(''); }}
                          className={`text-xs px-3 py-1 rounded-lg border transition-all ml-auto ${
                            replyOpen ? 'bg-gray-700 border-gray-500 text-white' : 'text-gray-500 border-gray-700 hover:text-gray-300'
                          }`}
                        >
                          💬 {(msg.replies?.length ?? 0) > 0 ? `${msg.replies!.length} Antwort${msg.replies!.length !== 1 ? 'en' : ''}` : 'Antworten'}
                        </button>
                      ) : (msg.replies?.length ?? 0) > 0 ? (
                        <span className="text-xs text-gray-600 ml-auto">
                          💬 {msg.replies!.length} Antwort{msg.replies!.length !== 1 ? 'en' : ''}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {/* Replies */}
                  {(msg.replies?.length ?? 0) > 0 && (
                    <div className="border-t border-gray-700/30 divide-y divide-gray-700/20">
                      {msg.replies!.map(reply => (
                        <div key={reply.id} className="flex gap-3 px-4 py-2.5">
                          <div className="w-0.5 bg-gray-700/60 rounded-full flex-shrink-0 mt-0.5 self-stretch" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] text-gray-300">{reply.authorName}</span>
                              <span className="text-gray-600 text-[10px]">
                                {(() => {
                                  const diff = Date.now() - new Date(reply.createdAt).getTime();
                                  const min = Math.floor(diff / 60000);
                                  if (min < 1) return 'Gerade eben';
                                  if (min < 60) return `vor ${min} Min`;
                                  const h = Math.floor(diff / 3600000);
                                  return h < 24 ? `vor ${h} Std` : `vor ${Math.floor(diff / 86400000)} Tagen`;
                                })()}
                              </span>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Reply-Eingabe */}
                  {replyOpen && boardRepliesGloballyEnabled && msg.repliesEnabled !== false && (
                    <div className="border-t border-gray-700/50 p-3 flex gap-2">
                      <input
                        value={boardReplyText}
                        onChange={e => setBoardReplyText(e.target.value)}
                        placeholder="Antwort schreiben…"
                        className="flex-1 bg-gray-700 border border-gray-600 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-gray-500"
                        onKeyDown={e => { if (e.key === 'Enter' && boardReplyText.trim()) { addBoardReply(msg.id, boardReplyText); setBoardReplyText(''); setBoardReplyOpenId(null); } }}
                      />
                      <button
                        onClick={() => { if (boardReplyText.trim()) { addBoardReply(msg.id, boardReplyText); setBoardReplyText(''); setBoardReplyOpenId(null); } }}
                        disabled={!boardReplyText.trim()}
                        className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                      >Senden</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {dashboardSubTab === 'fortschritt' && <>

        {/* ── Level-Banner ── */}
        <div className={`${levelInfo.bgColor} rounded-xl border border-gray-700 p-4`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl leading-none">{levelInfo.icon}</span>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-black tracking-wider ${levelInfo.color}`}>{levelInfo.name}</div>
              <div className="text-xs text-gray-500">{levelInfo.subtitle}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-gray-500">Level</div>
              <div className="text-xl font-black text-white leading-none">{xpProg.level}</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">XP bis Level {xpProg.level + 1}</span>
              <span className="text-[10px] text-gray-400">{xpProg.current} / {xpProg.needed} XP</span>
            </div>
            <div className="bg-gray-900/60 rounded-full h-1.5">
              <div
                className="bg-red-600 h-1.5 rounded-full transition-all"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Stats-Kacheln ── */}
        <div className="grid grid-cols-2 gap-2">
          {/* Streak */}
          <div className="bg-gradient-to-b from-orange-900/40 to-orange-900/20 rounded-xl p-3 border border-orange-800/40 flex items-center gap-3">
            <div className="text-2xl leading-none">🔥</div>
            <div>
              <div className="text-2xl font-black text-orange-400 leading-none">{currentUser.streak.currentStreak}</div>
              <div className="text-[10px] text-orange-300/60 mt-0.5">Streak Wochen</div>
            </div>
          </div>
          {/* XP Total */}
          <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/80 flex items-center gap-3">
            <div className="text-2xl leading-none">⭐</div>
            <div>
              <div className="text-2xl font-black text-yellow-400 leading-none">{(currentUser.xp ?? 0).toLocaleString('de-DE')}</div>
              <div className="text-[10px] text-yellow-500/60 mt-0.5">XP Gesamt</div>
            </div>
          </div>
          {/* Tactics bestanden */}
          <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/80 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-black text-gray-300">T</span>
            </div>
            <div>
              <div className="text-2xl font-black text-white leading-none">{tacticsModsDone}<span className="text-sm font-normal text-gray-500">/{totalVisibleMods}</span></div>
              <div className="text-[10px] text-gray-500 mt-0.5">Module Tactics</div>
            </div>
          </div>
          {/* Combat bestanden */}
          <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/80 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-900/40 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-black text-red-400">C</span>
            </div>
            <div>
              <div className="text-2xl font-black text-white leading-none">{combatModsDone}<span className="text-sm font-normal text-gray-500">/{totalVisibleMods}</span></div>
              <div className="text-[10px] text-gray-500 mt-0.5">Module Combat</div>
            </div>
          </div>
          {/* Instructor Module — nur wenn vorhanden */}
          {(currentUser.instructorModules?.length ?? 0) > 0 && (
            <div className="col-span-2 bg-gray-800/50 rounded-xl p-3 border border-gray-700/80 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-red-900/40 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-black text-red-400">I</span>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none">{currentUser.instructorModules!.length}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Instructor Module</div>
              </div>
            </div>
          )}
          {/* Bandaids — volle Breite */}
          <div className={`col-span-2 rounded-xl p-3 border flex items-center gap-3 ${
            currentUser.streak.bandaids > 0 ? 'bg-green-900/20 border-green-800/40' : 'bg-gray-800/50 border-gray-700/80'
          }`}>
            <div className="text-2xl leading-none">🩹</div>
            <div className="flex-1">
              <div className={`text-lg font-black leading-none flex items-baseline gap-1 ${
                currentUser.streak.bandaids > 0 ? 'text-green-400' : 'text-gray-500'
              }`}>
                {currentUser.streak.bandaids}
                <span className="text-sm font-medium opacity-50">/ {currentUser.streak.maxBandaids}</span>
              </div>
              <div className={`text-[10px] mt-0.5 ${currentUser.streak.bandaids > 0 ? 'text-green-500/70' : 'text-gray-600'}`}>
                Bandaids verfügbar
              </div>
            </div>
            {/* mini Balken */}
            <div className="w-20 flex-shrink-0">
              <div className="bg-gray-900/60 rounded-full h-1">
                <div
                  className="bg-green-500 h-1 rounded-full transition-all"
                  style={{ width: `${currentUser.streak.maxBandaids > 0 ? Math.round((currentUser.streak.bandaids / currentUser.streak.maxBandaids) * 100) : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Gesamtfortschritt ── */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gesamtfortschritt</h3>
            <span className="text-xs text-gray-400">{totalPassedRequired} / {totalRequired}</span>
          </div>
          <div className="bg-gray-900/60 rounded-full h-2 mb-1.5">
            <div
              className="bg-red-600 h-2 rounded-full transition-all"
              style={{ width: `${totalPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-600">Pflichtechniken bestanden</span>
            <span className="text-xs font-bold text-gray-300">{totalPercent}%</span>
          </div>
        </div>

        {/* ── Block-Fortschritt — gleiche Struktur wie Instructor Fortschritt-Tab ── */}
        <div className="space-y-3">
          {dashboardBlocks.map(block => {
            const unlocked = isBlockUnlocked(currentUser.id, block.level);
            // Verwende admin-konfigurierte Reihenfolge + Zuweisung aus effectiveBlocks.moduleIds
            const blockModules = block.moduleIds
              .map(id => MODULES.find(m => m.id === id))
              .filter((m): m is NonNullable<typeof m> => !!m && !moduleSettings[m.id]?.disabled);
            const required = blockModules.flatMap(m => m.techniques.filter(t => t.isRequired));
            const tacticsPassed = required.filter(t => {
              const s = currentUser.techniqueProgress[t.id]?.status;
              return s === 'tech_passed' || s === 'tac_passed';
            }).length;
            const combatPassed = required.filter(t =>
              currentUser.techniqueProgress[t.id]?.status === 'tac_passed'
            ).length;
            const total = required.length;
            const pct = total > 0 ? Math.round((tacticsPassed / total) * 100) : 0;
            const isComplete = total > 0 && tacticsPassed === total && combatPassed === total;

            return (
              <div key={block.id} className={`bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden ${!unlocked ? 'opacity-40' : ''}`}>

                {/* Block-Header (= Track-Header beim Instructor) */}
                <div className="px-4 py-3 border-b border-gray-700/50 flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{block.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold truncate ${block.color}`}>{block.name}</span>
                      {!unlocked
                        ? <span className="text-gray-600 text-xs flex-shrink-0">🔒</span>
                        : isComplete
                          ? <span className="text-green-400 text-xs font-bold flex-shrink-0">✓ Abgeschlossen</span>
                          : null
                      }
                    </div>
                    {unlocked && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-red-600'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-gray-500 text-xs flex-shrink-0">{tacticsPassed}/{total}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modul-Liste (= Lektionen-Liste beim Instructor) */}
                {unlocked && (
                  <div className="divide-y divide-gray-700/30">
                    {blockModules.map((mod, idx) => {
                      const modRequired = mod.techniques.filter(t => t.isRequired);
                      const modTactics = modRequired.filter(t => {
                        const s = currentUser.techniqueProgress[t.id]?.status;
                        return s === 'tech_passed' || s === 'tac_passed';
                      }).length;
                      const modCombat = modRequired.filter(t =>
                        currentUser.techniqueProgress[t.id]?.status === 'tac_passed'
                      ).length;
                      const modTotal = modRequired.length;
                      const tacDone = modTotal > 0 && modTactics === modTotal;
                      const combatDone = modTotal > 0 && modCombat === modTotal;
                      const fullyDone = tacDone && combatDone;

                      return (
                        <div key={mod.id} className="px-4 py-2.5 flex items-center gap-3">
                          {/* Status-Kreis (wie beim Instructor) */}
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            fullyDone ? 'bg-green-500/20 text-green-400'
                            : tacDone  ? 'bg-gray-600/40 text-gray-300'
                            : 'bg-gray-700 text-gray-500'
                          }`}>
                            {fullyDone ? '✓' : mod.number}
                          </div>

                          {/* Modul-Name */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${fullyDone ? 'text-white' : tacDone ? 'text-gray-300' : 'text-gray-500'}`}>
                              {mod.icon} {getModuleName(mod.id)}
                            </p>
                          </div>

                          {/* T / C Badges */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border ${
                              tacDone ? 'bg-gray-600 text-white border-gray-500' : 'text-gray-700 border-gray-700/40'
                            }`}>T</span>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border ${
                              combatDone ? 'bg-red-900/60 text-red-400 border-red-700/50' : 'text-gray-700 border-gray-700/40'
                            }`}>C</span>
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

        {/* ── Offene Prüfungsanfragen ── */}
        {pendingExams.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Offene Prüfungsanfragen</h3>
            <div className="space-y-2">
              {pendingExams.map(req => (
                <div key={req.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0 text-xs">
                    {req.examLevel === 'technical' ? 'T' : 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-200 truncate">{req.techniqueName}</div>
                    <div className="text-[10px] text-gray-500">{getModuleName(req.moduleId)}</div>
                  </div>
                  <span className="text-[10px] bg-yellow-900/40 text-yellow-400 border border-yellow-700/40 px-2 py-0.5 rounded-full flex-shrink-0">
                    Ausstehend
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Letzte Trainings ── */}
        {mySessions.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Letzte Trainings</h3>
            <div className="space-y-2.5">
              {mySessions.map(session => {
                const myGroup = session.groups.find((g: { memberIds: string[] }) => g.memberIds.includes(currentUser.id));
                const techCount = myGroup?.techniqueIds.length ?? 0;
                const dateStr = new Date(session.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
                return (
                  <div key={session.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-gray-200 text-sm font-medium truncate">{dateStr} — {session.courseName ?? 'Training'}</div>
                      <div className="text-gray-500 text-xs">{techCount} Technik{techCount !== 1 ? 'en' : ''}{session.instructorName ? ` · ${session.instructorName}` : ''}</div>
                    </div>
                    <span className="text-yellow-500 text-xs font-bold flex-shrink-0">+{techCount * 10} XP</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Badges ── */}
        {(currentUser.badges?.length ?? 0) > 0 && (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Badges</h3>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {currentUser.badges!.map((badge: Badge) => (
                <div key={badge.id} className="flex-shrink-0 flex flex-col items-center gap-1 w-14">
                  {badge.imageUrl ? (
                    <img
                      src={badge.imageUrl}
                      alt={badge.label}
                      className="w-10 h-10 rounded-lg object-cover"
                      style={{ transform: badge.scale ? `scale(${badge.scale})` : undefined }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-xl">
                      {badge.icon}
                    </div>
                  )}
                  <span className="text-[9px] text-gray-500 text-center leading-tight line-clamp-2">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </>}

      </div>
    );
  };

  // ── Community Tab ──────────────────────────────────────────────────────────
  const renderCommunity = () => {
    const myConnections = (currentUser.connections ?? []);
    const connectedMembers = members.filter(m => myConnections.includes(m.id));
    const myVisibility = currentUser.visibilityPreference ?? 'all';
    const canSeeAll = myVisibility === 'all';

    // Sichtbarkeitsregel (one-way privacy):
    // Deine Einstellung bestimmt ob DU erscheinst — nicht was du siehst.
    // B.visibility='all'     → sichtbar für alle
    // B.visibility='buddies' → nur sichtbar für eigene Connections
    const visibleMembers = members.filter(m => {
      if (m.id === currentUser.id) return true; // self immer sichtbar
      const mVis = m.visibilityPreference ?? 'all';
      if (mVis === 'buddies') return myConnections.includes(m.id);
      return true; // 'all' → sichtbar für jeden
    });

    const ONLINE_CUTOFF_MS = 10 * 60 * 1000; // 10 Min — konsistent mit InstructorView
    const nowTs = Date.now();
    const nowDate = new Date();
    const isActive = (m: typeof visibleMembers[0]) => m.id === currentUser.id || !!m.onlineSince;
    const isInactive = (m: typeof visibleMembers[0]) =>
      !m.onlineSince && m.id !== currentUser.id &&
      (nowTs - new Date(m.lastSeenAt).getTime()) < ONLINE_CUTOFF_MS;
    const onlineConnected = visibleMembers.filter(m => isActive(m) || isInactive(m));
    const trainingConnected = visibleMembers.filter(m => checkIns.some(c => c.memberId === m.id && c.status === 'approved'));

    const instructorRoles = ['assistant_instructor', 'instructor', 'full_instructor', 'head_instructor', 'admin'];
    const onlineInstructors = onlineConnected.filter(m => instructorRoles.includes(m.role));
    const onlineMembers2 = onlineConnected.filter(m => !instructorRoles.includes(m.role));

    const formatOnlineSince = (m: typeof visibleMembers[0]): string => {
      if (m.id === currentUser.id) return 'gerade eben';
      const since = m.onlineSince ? new Date(m.onlineSince) : new Date(m.lastSeenAt);
      const diffMs = nowDate.getTime() - since.getTime();
      const mins = Math.floor(diffMs / 60_000);
      if (mins < 1) return 'gerade eben';
      if (mins < 60) return `seit ${mins} Min`;
      return `seit ${Math.floor(mins / 60)} Std`;
    };

    const OnlineDot = ({ member }: { member: typeof visibleMembers[0] }) => (
      <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${isActive(member) ? 'bg-green-400' : 'bg-yellow-400'}`} />
    );

    return (
      <div className="space-y-4">
        {/* Sub-Tab Switcher — sticky */}
        <div className="sticky top-[var(--mi-header-h)] z-30 bg-gray-950 -mx-4 px-4 pt-2 pb-2">
        <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700 gap-1">
          {([
            { id: 'online' as const, label: 'Online', badge: onlineConnected.length, dot: true },
            { id: 'training' as const, label: 'Training', badge: trainingConnected.length, dot: false },
            { id: 'mitglieder' as const, label: 'Member', badge: 0, dot: false },
            { id: 'rangliste' as const, label: 'Rangliste', badge: 0, dot: false },
          ] as { id: 'online'|'training'|'mitglieder'|'rangliste'; label: string; badge: number; dot: boolean }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setCommunitySubTab(tab.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                communitySubTab === tab.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.dot && <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />}
              {tab.label}
              {tab.badge > 0 && (
                <span className="bg-gray-600 text-gray-300 text-[10px] px-1.5 py-0.5 rounded-full">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>
        </div>

        {/* ── ONLINE ── */}
        {communitySubTab === 'online' && (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-700/60 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
                Online
                <span className="text-gray-500 font-normal text-sm">({onlineConnected.length})</span>
              </h3>
            </div>
            {onlineConnected.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                <div className="text-2xl mb-2">😴</div>
                {canSeeAll ? 'Alle Members mit sichtbarem Status werden hier angezeigt.' : 'Du siehst nur deine Trainingspartner.'}
              </div>
            ) : (
              <div className="divide-y divide-gray-700/40">
                {onlineInstructors.length > 0 && (
                  <div className="px-4 py-3">
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Trainer ({onlineInstructors.length})</div>
                    <div className="space-y-2">
                      {onlineInstructors.map(m => (
                        <div key={m.id} className="flex items-center gap-3">
                          <OnlineDot member={m} />
                          {m.profileImage ? <img src={m.profileImage} className="w-7 h-7 rounded-full object-cover flex-shrink-0" /> : <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-300">{m.name.charAt(0).toUpperCase()}</div>}
                          <div className="flex-1 min-w-0">
                            <span className="text-white font-medium text-sm">{m.name}{m.id === currentUser.id && <span className="text-gray-500 text-[10px] ml-1">(Du)</span>}</span>
                            <span className="ml-2 text-xs text-gray-500">{LEVEL_DISPLAY[m.currentLevel].subtitle}</span>
                          </div>
                          <span className="text-gray-500 text-xs flex-shrink-0">{formatOnlineSince(m)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {onlineMembers2.length > 0 && (
                  <div className="px-4 py-3">
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Members ({onlineMembers2.length})</div>
                    <div className="space-y-2">
                      {onlineMembers2.map(m => (
                        <div key={m.id} className="flex items-center gap-3">
                          <OnlineDot member={m} />
                          {m.profileImage ? <img src={m.profileImage} className="w-7 h-7 rounded-full object-cover flex-shrink-0" /> : <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-300">{m.name.charAt(0).toUpperCase()}</div>}
                          <div className="flex-1 min-w-0">
                            <span className="text-white font-medium text-sm">{m.name}{m.id === currentUser.id && <span className="text-gray-500 text-[10px] ml-1">(Du)</span>}</span>
                            <span className="ml-2 text-xs text-gray-500">{LEVEL_DISPLAY[m.currentLevel].subtitle}</span>
                          </div>
                          <span className="text-gray-500 text-xs flex-shrink-0">{formatOnlineSince(m)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="px-4 py-2 border-t border-gray-700/40 flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Aktiv
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Inaktiv (&lt;10 Min)
              </span>
            </div>
          </div>
        )}

        {/* ── TRAINING ── */}
        {communitySubTab === 'training' && (
          <div className="space-y-3">
            {trainingConnected.length === 0 ? (
              <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 p-8 text-center">
                <div className="text-3xl mb-2">🥋</div>
                <p className="text-gray-400 text-sm font-medium">Niemand trainiert gerade</p>
                <p className="text-gray-500 text-xs mt-1">{canSeeAll ? 'Alle Members mit sichtbarem Status werden hier angezeigt.' : 'Du siehst nur deine Trainingspartner.'}</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-xs px-1 mb-2">Gerade im Training ({trainingConnected.length})</p>
                {trainingConnected.map(m => {
                  const isMe = m.id === currentUser.id;
                  return (
                  <div key={m.id} className="bg-gray-800/50 rounded-xl border border-orange-800/30 px-4 py-3 flex items-center gap-3 mb-2">
                    <div className="relative flex-shrink-0">
                      {m.profileImage ? <img src={m.profileImage} className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-300">{m.name.charAt(0).toUpperCase()}</div>}
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-400 rounded-full border border-gray-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-semibold text-sm">{m.name}</span>
                        {isMe && <span className="text-gray-500 text-[10px]">(Du)</span>}
                      </div>
                      <div className="text-orange-400/70 text-xs">Im Training</div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── MITGLIEDER ── */}
        {communitySubTab === 'mitglieder' && (
          <div className="space-y-4">
            {/* Eingehende Buddy-Anfragen */}
            {getPendingBuddyRequests().map(req => (
              <div key={req.id} className="bg-gray-800/50 rounded-xl border border-red-800/40 p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-white text-sm font-semibold">{req.fromMemberName}</p>
                  <p className="text-gray-400 text-xs mt-0.5">möchte sich als Trainingspartner verbinden</p>
                </div>
                <button
                  onClick={() => acceptBuddyRequest(req.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold text-sm transition-all flex-shrink-0"
                >
                  Annehmen
                </button>
              </div>
            ))}

            {/* Trainingspartner-Kachel */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 space-y-3">
              <p className="text-gray-500 text-xs uppercase tracking-wider">Mit Trainingspartner verbinden</p>

              {/* Code generieren Button */}
              <button
                onClick={() => {
                  const expiresAt = Date.now() + 15 * 60 * 1000;
                  const code = generateBuddyCode();
                  setGeneratedBuddyCode(code);
                  setBuddyCodeExpiresAt(expiresAt);
                  setIsConnectInputFocused(false);
                  setBuddyRequestResult(null);
                }}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold text-sm transition-all"
              >
                Code generieren
              </button>

              {/* Generierter Code — nur sichtbar wenn vorhanden und Input nicht fokussiert */}
              {generatedBuddyCode && !isConnectInputFocused && (
                <div className="bg-gray-900 rounded-lg px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white font-black text-2xl tracking-[0.3em] font-mono">{generatedBuddyCode}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedBuddyCode);
                        setCodeCopied(true);
                        setTimeout(() => setCodeCopied(false), 2000);
                      }}
                      className="text-gray-400 hover:text-white transition-colors text-sm px-2 py-1"
                    >
                      {codeCopied ? '✓' : '⎘'}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 rounded-full transition-all duration-1000"
                        style={{ width: `${(buddyCodeSecondsLeft / 900) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-500 text-[10px] font-mono tabular-nums w-8 text-right">
                      {String(Math.floor(buddyCodeSecondsLeft / 60)).padStart(2, '0')}:{String(buddyCodeSecondsLeft % 60).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              )}

              {/* Trennlinie */}
              <div className="border-t border-gray-700" />

              {/* Code eingeben */}
              <input
                type="text"
                value={connectCode}
                onChange={e => {
                  setConnectCode(e.target.value.toUpperCase());
                  setBuddyRequestResult(null);
                }}
                onFocus={() => setIsConnectInputFocused(true)}
                onBlur={() => setIsConnectInputFocused(false)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && /^[A-Z0-9-]{6,}$/.test(connectCode)) {
                    const result = sendBuddyRequest(connectCode);
                    setBuddyRequestResult(result);
                    if (result.ok) setConnectCode('');
                  }
                }}
                placeholder="Z.B. A3F7B2E9"
                className="w-full bg-gray-900/60 text-white rounded-xl px-4 py-2.5 border border-gray-700 focus:border-gray-500 focus:outline-none font-mono tracking-widest text-sm uppercase placeholder-gray-600"
              />

              {/* Verbinden Button */}
              <button
                onClick={() => {
                  const result = sendBuddyRequest(connectCode);
                  setBuddyRequestResult(result);
                  if (result.ok) setConnectCode('');
                }}
                disabled={!/^[A-Z0-9-]{6,}$/.test(connectCode)}
                className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all disabled:bg-gray-700 disabled:text-gray-500 bg-red-600 hover:bg-red-500 text-white"
              >
                Verbinden
              </button>

              {/* Feedback */}
              {buddyRequestResult && (
                <p className={`text-xs ${buddyRequestResult.ok ? 'text-gray-400' : 'text-red-400'}`}>
                  {buddyRequestResult.ok
                    ? '⏳ Warte auf Bestätigung...'
                    : `✗ ${buddyRequestResult.error}`}
                </p>
              )}
            </div>

            {/* Alle sichtbaren Member */}
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider px-1 mb-2">
                Member ({visibleMembers.length})
              </p>
              {visibleMembers.length === 0 ? (
                <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 p-6 text-center">
                  <p className="text-gray-500 text-sm">Keine Member sichtbar</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {visibleMembers.map(m => {
                    const isMe = m.id === currentUser.id;
                    const isOnlineNow = isMe || m.onlineSince !== undefined || (nowTs - new Date(m.lastSeenAt).getTime()) < ONLINE_CUTOFF_MS;
                    const status = checkIns.some(c => c.memberId === m.id && c.status === 'approved') ? 'training' : isOnlineNow ? 'online' : 'offline';
                    return (
                      <div key={m.id} className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${isMe ? 'bg-gray-700/60 border-gray-600' : 'bg-gray-800/50 border-gray-700'}`}>
                        <div className="relative flex-shrink-0">
                          {m.profileImage ? <img src={m.profileImage} className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-300">{m.name.charAt(0).toUpperCase()}</div>}
                          <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-gray-900 ${
                            status === 'training' ? 'bg-orange-400' :
                            status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-white font-semibold text-sm">{m.name}</span>
                            {isMe && <span className="text-gray-500 text-[10px]">(Du)</span>}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {status === 'training' ? 'Im Training' :
                             status === 'online' ? 'Online' : 'Offline'}
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
    const myConnections = currentUser.connections ?? [];
    const canSeeAll = (currentUser.visibilityPreference ?? 'all') === 'all';
    const rankMembers = members.filter(m => {
      if (m.id === currentUser.id) return true;
      const mVis = m.visibilityPreference ?? 'all';
      if (mVis === 'buddies') return myConnections.includes(m.id);
      return true;
    });
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
      <div className="bg-gray-900 border border-gray-700/60 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">☠️ CONTACT READY Bewerbung</h2>
        <p className="text-gray-400 mb-6">
          Contact Ready (Operator) ist nur auf Bewerbung und Freigabe durch den Owner möglich.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Motivation *</label>
            <textarea
              value={contactAnswers.motivation}
              onChange={(e) => setContactAnswers(prev => ({ ...prev, motivation: e.target.value }))}
              placeholder="Warum möchtest du Operator werden?"
              className="w-full bg-gray-900/60 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Erfahrung *</label>
            <textarea
              value={contactAnswers.experience}
              onChange={(e) => setContactAnswers(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="Beschreibe deinen Kampfsport-Hintergrund"
              className="w-full bg-gray-900/60 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Teamfähigkeit *</label>
            <textarea
              value={contactAnswers.teamwork}
              onChange={(e) => setContactAnswers(prev => ({ ...prev, teamwork: e.target.value }))}
              placeholder="Wie arbeitest du im Team?"
              className="w-full bg-gray-900/60 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Stressbewältigung *</label>
            <textarea
              value={contactAnswers.stressHandling}
              onChange={(e) => setContactAnswers(prev => ({ ...prev, stressHandling: e.target.value }))}
              placeholder="Wie gehst du mit Hochstress-Situationen um?"
              className="w-full bg-gray-900/60 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Schutz Dritter *</label>
            <textarea
              value={contactAnswers.protectionOfOthers}
              onChange={(e) => setContactAnswers(prev => ({ ...prev, protectionOfOthers: e.target.value }))}
              placeholder="Wie würdest du andere schützen?"
              className="w-full bg-gray-900/60 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Verfügbarkeit</label>
            <textarea
              value={contactAnswers.availability}
              onChange={(e) => setContactAnswers(prev => ({ ...prev, availability: e.target.value }))}
              placeholder="Wann bist du verfügbar?"
              className="w-full bg-gray-900/60 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
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
      <div className="bg-gray-900 border border-gray-700/60 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">🎓 ASSISTANT INSTRUCTOR Bewerbung</h2>
        <p className="text-gray-400 mb-6">
          Du möchtest Instructor werden und andere unterrichten? Beantworte uns ein paar Fragen.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Motivation *</label>
            <textarea
              value={instructorAnswers.motivation}
              onChange={(e) => setInstructorAnswers(prev => ({ ...prev, motivation: e.target.value }))}
              placeholder="Warum möchtest du Instructor werden?"
              className="w-full bg-gray-900/60 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Unterrichtserfahrung *</label>
            <textarea
              value={instructorAnswers.teachingExperience}
              onChange={(e) => setInstructorAnswers(prev => ({ ...prev, teachingExperience: e.target.value }))}
              placeholder="Hast du bereits Unterrichtserfahrung? (Sport, Arbeit, etc.)"
              className="w-full bg-gray-900/60 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Stärken & Schwächen *</label>
            <textarea
              value={instructorAnswers.strengthsWeaknesses}
              onChange={(e) => setInstructorAnswers(prev => ({ ...prev, strengthsWeaknesses: e.target.value }))}
              placeholder="Was sind deine Stärken und Schwächen?"
              className="w-full bg-gray-900/60 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Verfügbarkeit *</label>
            <textarea
              value={instructorAnswers.availability}
              onChange={(e) => setInstructorAnswers(prev => ({ ...prev, availability: e.target.value }))}
              placeholder="Wann könntest du unterrichten? (Tage, Uhrzeiten)"
              className="w-full bg-gray-900/60 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Ziele *</label>
            <textarea
              value={instructorAnswers.goals}
              onChange={(e) => setInstructorAnswers(prev => ({ ...prev, goals: e.target.value }))}
              placeholder="Was sind deine Ziele als Instructor?"
              className="w-full bg-gray-900/60 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Dein Vorbild</label>
            <textarea
              value={instructorAnswers.roleModel}
              onChange={(e) => setInstructorAnswers(prev => ({ ...prev, roleModel: e.target.value }))}
              placeholder="Was macht für dich einen guten Instructor aus?"
              className="w-full bg-gray-900/60 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
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
      <main className={`max-w-4xl mx-auto ${activeTab === 'training' ? 'h-[calc(100vh-133px)] flex flex-col' : 'pb-24'}`}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'training' && <MemberLearningView />}
        {activeTab === 'community' && <div className="p-4 pb-24">{renderCommunity()}</div>}
        {activeTab === 'profil' && <ProfileView member={currentUser} />}
      </main>

      {/* ── Fixed Bottom Navigation ────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40">
        <div className="max-w-4xl mx-auto flex">
          {([
            { id: 'dashboard' as Tab, icon: '📊', label: 'Dashboard' },
            { id: 'training' as Tab, icon: '🥋', label: 'Training' },
            { id: 'community' as Tab, icon: '👥', label: 'Community' },
            { id: 'profil' as Tab, icon: '👤', label: 'Profil' },
          ] as { id: Tab; icon: string; label: string }[]).map(tab => {
            const tabEnabled = tabConfig.memberTabs[tab.id as MemberTabId] !== false;
            return (
              <button
                key={tab.id}
                onClick={() => { if (tabEnabled) setActiveTabPersisted(tab.id); }}
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
          {onSwitchToAdmin && (
            <button
              onClick={onSwitchToAdmin}
              className="flex-1 py-3 flex flex-col items-center gap-0.5 transition-all text-gray-500 hover:text-gray-300"
            >
              <span className="text-xl">🔐</span>
              <span className="text-[11px] font-semibold">Admin</span>
            </button>
          )}
        </div>
      </nav>

      {/* Application Modals */}
      {showApplicationModal === 'contact' && renderContactApplicationModal()}
      {showApplicationModal === 'assistant_instructor' && renderInstructorApplicationModal()}
    </div>
  );
};

export default MemberView;
