// ============================================
// MARTIAL INSTINCT - INSTRUCTOR VIEW
// Strukturiert, autoritätsbasiert und skalierbar
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { useApp, MODULES, BLOCKS, COURSES } from '../../context/AppContext';
import { INSTRUCTOR_TRACKS } from '../../data/instructorCurriculum';
import { getTopicsForModule } from '../../data/moduleTopics';
import { ModuleOrder, RolePermissions, InstructorTabId, MemberTabId, JoinRequest, CreateMemberData } from '../../types';
import {
  LEVEL_DISPLAY,
  ROLE_DISPLAY,
  hasAdminAccess,
  Member,
  CheckIn,
  InstructorRole,
  TrainingGroup
} from '../../types';
import { TechniqueCard } from '../shared/TechniqueCard';
import { InstructorLearningView } from './InstructorLearningView';
import { ProfileView } from '../shared/ProfileView';
import { RankingList } from '../shared/RankingList';

// ── Kurs-Erkennung anhand aktueller Uhrzeit ──────────────────────────────────
function detectCurrentCourse(locationId: string): string | null {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${hh}:${mm}`;
  const course = COURSES.find(
    c => c.locationId === locationId &&
         c.dayOfWeek === dayOfWeek &&
         c.startTime <= currentTime &&
         c.endTime >= currentTime
  );
  return course ? `${course.name} • ${course.startTime}–${course.endTime}` : null;
}

// ── Berechtigungsprüfung: darf dieser Instructor diese Anfrage bestätigen? ───
function canApproveCheckIn(role: InstructorRole, instructorId: string, checkIn: CheckIn): boolean {
  // full_instructor und höher: alles erlaubt
  if (['full_instructor', 'head_instructor', 'admin'].includes(role)) return true;
  // assistant_instructor / instructor: nur eigene Kursteilnehmer
  const ownCourse = COURSES.find(
    c => c.instructorId === instructorId && c.participantIds.includes(checkIn.memberId)
  );
  return !!ownCourse;
}

type Tab = 'dashboard' | 'training' | 'community' | 'admin' | 'profil';
type DashboardSubTab = 'anfragen' | 'board' | 'bewerten' | 'fortschritt';
type CommunitySubTab = 'online' | 'mitglieder' | 'training' | 'rangliste';
type AdminSubTab = 'analytics' | 'verwaltung' | 'bewerbungen';
type VerwaltungSubTab = 'plattform' | 'training' | 'mitglieder';

export const InstructorView: React.FC = () => {
  const {
    currentUser,
    members,
    checkIns,
    boardMessages,
    notifications,
    approveCheckIn,
    rejectCheckIn,
    checkOut,
    approveExam,
    rejectExam,
    canExamineLevel,
    markTechniquePassed,
    approveContactApplication,
    rejectContactApplication,
    approveInstructorApplication,
    rejectInstructorApplication,
    getPendingContactApplications,
    getPendingInstructorApplications,
    awardBandaid,
    sendBoardMessage,
    addBoardReply,
    markBoardMessageRead,
    sendReadReminder,
    boardRepliesGloballyEnabled,
    setBoardRepliesGloballyEnabled,
    setBoardMessageRepliesEnabled,
    hasPermission,
    permissionsConfig,
    updatePermissionsConfig,
    tabConfig,
    updateTabConfig,
    getPendingCheckIns,
    getPendingExamRequests,
    getBlockProgress,
    getOnlineMembers,
    getPendingTechniqueWishes,
    completeTrainingSession,
    updateMemberRole,
    updateAdminAccess,
    restoreStreak,
    saveModuleOrder,
    moduleOrder,
    getTechniquesForModule,
    getQuizQuestionsForModule,
    getQuizCountForModule,
    saveTechnique,
    deleteTechnique,
    saveQuizQuestion,
    deleteQuizQuestion,
    saveModuleSettings,
    joinRequests,
    createMemberFromRequest,
    rejectJoinRequest,
    updateMemberCoreData,
    getBadgeDisplaySettings,
    setBadgeDisplaySettings,
    computeBadges,
    flaggedQuestions,
    flagSystemEnabled,
    toggleFlagSystem,
    releaseFlaggedQuestion,
    editQuestionOverride,
    questionOverrides,
    topicOverrides,
    updateTopicText,
    moduleNameOverrides,
    saveModuleName,
    getModuleName,
    moduleSubtitleOverrides,
    saveModuleSubtitle,
    platformConfig,
    updatePlatformConfig,
    trainingSessions,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>(() => (localStorage.getItem('mi_active_tab_instructor') as Tab) || 'dashboard');
  const setActiveTabPersisted = (tab: Tab) => { setActiveTab(tab); localStorage.setItem('mi_active_tab_instructor', tab); };
  const [dashboardSubTab, setDashboardSubTab] = useState<DashboardSubTab>('fortschritt');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [boardMessageText, setBoardMessageText] = useState('');
  const [boardVisibility, setBoardVisibility] = useState<'public' | 'restricted'>('public');
  const [boardTargetType, setBoardTargetType] = useState<'none' | 'roles' | 'members' | 'all' | 'activity'>('none');
  const [boardTargetRoles, setBoardTargetRoles] = useState<InstructorRole[]>([]);
  const [boardTargetMemberIds, setBoardTargetMemberIds] = useState<string[]>([]);
  const [boardMemberSearch, setBoardMemberSearch] = useState('');
  const [boardNewRepliesEnabled, setBoardNewRepliesEnabled] = useState(true);
  const [boardActivityMonths, setBoardActivityMonths] = useState<number>(3);
  // Board Thread / Lesebestätigung State
  const [boardReplyOpenId, setBoardReplyOpenId] = useState<string | null>(null);
  const [boardReplyText, setBoardReplyText] = useState('');
  const [boardReadersOpenId, setBoardReadersOpenId] = useState<string | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState<Record<string, string>>({});
  const [liveTick, setLiveTick] = useState(0);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberSort, setMemberSort] = useState<'name' | 'lastSeen' | 'lastTraining'>('lastSeen');
  const [profileMember, setProfileMember] = useState<Member | null>(null);

  // Admin Sub-Tab State
  const [adminSubTab, setAdminSubTab] = useState<AdminSubTab>('analytics');
  const [verwaltungSubTab, setVerwaltungSubTab] = useState<VerwaltungSubTab>('plattform');

  // Member Settings (Streak + Kerndaten — kombiniert)
  const [memberSettingsOpen, setMemberSettingsOpen] = useState<string | null>(null);
  const [streakRestoreValue, setStreakRestoreValue] = useState(1);
  const [streakRestoreReason, setStreakRestoreReason] = useState('');

  // Plattform-Accordion State
  const [plattformOpen, setPlattformOpen] = useState<Record<string, boolean>>({});
  const togglePlattform = (key: string) => setPlattformOpen(prev => ({ ...prev, [key]: !prev[key] }));

  // Badge-Display State (Admin)
  const [badgeEditId, setBadgeEditId] = useState<string | null>(null);
  const [badgeEditScale, setBadgeEditScale] = useState(1.15);
  const [badgeEditPosX, setBadgeEditPosX] = useState(50);
  const [badgeEditPosY, setBadgeEditPosY] = useState(50);
  const [badgeSaveState, setBadgeSaveState] = useState<'idle' | 'dirty' | 'saved'>('idle');
  const [badgePendingClose, setBadgePendingClose] = useState(false);
  const [coreDataSaveState, setCoreDataSaveState] = useState<'idle' | 'dirty' | 'saved'>('idle');
  const [coreDataPendingClose, setCoreDataPendingClose] = useState(false);
  const [streakSaveState, setStreakSaveState] = useState<'idle' | 'dirty' | 'saved'>('idle');
  const [streakPendingClose, setStreakPendingClose] = useState(false);

  const [coreName, setCoreName] = useState('');
  const [coreFirstName, setCoreFirstName] = useState('');
  const [coreLastName, setCoreLastName] = useState('');
  const [coreBirthDate, setCoreBirthDate] = useState('');
  const [coreMemberId, setCoreMemberId] = useState('');

  // Modul-Verwaltung State
  const [localModuleOrder, setLocalModuleOrder] = useState<ModuleOrder[]>([]);
  const [dndSaveState, setDndSaveState] = useState<'idle' | 'dirty' | 'saved'>('idle');
  const [dndPendingClose, setDndPendingClose] = useState(false);

  // Theorie-Meldungen — immer frisch aus localStorage lesen
  const [theoryFlagsVersion, setTheoryFlagsVersion] = useState(0);
  const getTheoryFlags = () => { try { return JSON.parse(localStorage.getItem('mi-theory-flags') || '[]') as {id:string;moduleId:string;topicId:string;topicTitle:string;comment:string;memberName:string;timestamp:string}[]; } catch { return []; } };
  const dismissTheoryFlag = (id: string) => {
    const next = getTheoryFlags().filter(f => f.id !== id);
    localStorage.setItem('mi-theory-flags', JSON.stringify(next));
    setTheoryFlagsVersion(v => v + 1);
  };

  // Content Editor State (Rules of Hooks: alle auf Top-Level)
  const [contentModuleId, setContentModuleId] = useState<string | null>(null);
  const [contentSubTab, setContentSubTab] = useState<'techniques' | 'quiz' | 'theorie'>('techniques');
  const [editingTechniqueId, setEditingTechniqueId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingFlagId, setEditingFlagId] = useState<string | null>(null);
  const [flagEditQuestion, setFlagEditQuestion] = useState('');
  const [flagEditOptions, setFlagEditOptions] = useState(['', '', '', '']);
  const [flagEditCorrectIndex, setFlagEditCorrectIndex] = useState(0);
  const [flagEditExplanation, setFlagEditExplanation] = useState('');
  const [flagEditTheoryText, setFlagEditTheoryText] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');
  const [showQuizBulkImport, setShowQuizBulkImport] = useState(false);
  const [quizBulkImportText, setQuizBulkImportText] = useState('');
  const [quizBulkPreview, setQuizBulkPreview] = useState<{ question: string; options: string[]; correctIndex: number; explanation: string }[]>([]);
  const [techEditName, setTechEditName] = useState('');
  const [techEditDesc, setTechEditDesc] = useState('');
  const [qEditQuestion, setQEditQuestion] = useState('');
  const [qEditOptions, setQEditOptions] = useState(['', '', '', '']);
  const [qEditCorrectIndex, setQEditCorrectIndex] = useState(0);
  const [qEditExplanation, setQEditExplanation] = useState('');
  const [contentQuizCount, setContentQuizCount] = useState(10);

  // Sub-Tab States (an Top-Level wegen Rules of Hooks)
  const [communitySubTab, setCommunitySubTab] = useState<CommunitySubTab>('training');
  const communityTabOrder: CommunitySubTab[] = ['online', 'training', 'mitglieder', 'rangliste'];
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
      const tabs = communityTabOrder;
      const idx = tabs.indexOf(communitySubTabRef.current);
      if (dx < 0 && idx < tabs.length - 1) setCommunitySubTab(tabs[idx + 1]);
      if (dx > 0 && idx > 0) setCommunitySubTab(tabs[idx - 1]);
    };
    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchend', onEnd, { passive: true });
    return () => { document.removeEventListener('touchstart', onStart); document.removeEventListener('touchend', onEnd); };
  }, [activeTab]);
  const [requestSubTab, setRequestSubTab] = useState<'exams' | 'checkins' | 'beitritt'>('exams');

  // Beitrittsanfragen Modal State
  const [createMemberRequest, setCreateMemberRequest] = useState<JoinRequest | null>(null);
  const [createMemberName, setCreateMemberName] = useState('');
  const [createMemberEmail, setCreateMemberEmail] = useState('');
  const [createMemberId, setCreateMemberId] = useState('');
  const [createMemberPassword, setCreateMemberPassword] = useState('');
  const [createMemberProgress, setCreateMemberProgress] = useState<Record<number, { tactics: boolean; combat: boolean }>>({});
  const [createMemberSTB, setCreateMemberSTB] = useState(false);

  // Session-Builder State (alle an Top-Level wegen Rules of Hooks)
  const [showSessionBuilder, setShowSessionBuilder] = useState(false);
  const [sessionAttendees, setSessionAttendees] = useState<string[]>([]);
  const [sessionGroups, setSessionGroups] = useState<TrainingGroup[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionDone, setSessionDone] = useState(false);
  const [sessionModuleFilter, setSessionModuleFilter] = useState<string>('all');

  // 30s Auto-Refresh für den Live-Tab
  useEffect(() => {
    const interval = setInterval(() => setLiveTick(t => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  if (!currentUser) return null;

  const allPendingCheckIns = getPendingCheckIns();
  // Alle sichtbaren Anfragen (nach Standort gefiltert)
  const visibleCheckIns = allPendingCheckIns.filter(c => c.locationId === currentUser.locationId);
  const pendingCheckIns = visibleCheckIns; // Alias für Template
  const pendingExamRequests = getPendingExamRequests();
  const pendingWishes = getPendingTechniqueWishes();
  const detectedCourse = detectCurrentCourse(currentUser.locationId);
  
  const pendingContactApps = getPendingContactApplications();
  const pendingInstructorApps = getPendingInstructorApplications();
  const totalPendingApps = pendingContactApps.length + pendingInstructorApps.length;
  const unreadBoardNotifs = notifications.filter(n => n.type === 'board' && n.oduserId === currentUser.id && !n.read).length;

  // Check if user can access tab (Rollen-Check + Tab-Config)
  const canAccessTab = (tab: Tab): boolean => {
    const roleCheck = (() => {
      switch (tab) {
        case 'dashboard': return true;
        case 'training':  return true;
        case 'community': return true;
        case 'profil':    return true;
        case 'admin':     return hasAdminAccess(currentUser);
        default:          return false;
      }
    })();
    return roleCheck; // tabConfig steuert nur Sichtbarkeit (grayed out), nicht Zugriff
  };

  // Format time ago
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Gerade eben';
    if (minutes < 60) return `vor ${minutes} Min`;
    if (hours < 24) return `vor ${hours} Std`;
    return `vor ${days} Tagen`;
  };

  // Render Community Tab (Online + Training + Mitglieder + Rangliste)
  const renderCommunityTab = () => {
    const now = new Date();
    const todayStr = now.toDateString();

    // Online-Status: onlineSince gesetzt = aktiv eingeloggt
    // Inaktiv: lastSeenAt < 10 Min her, aber kein onlineSince
    const INACTIVE_CUTOFF = 10 * 60 * 1000;
    const isOnline = (m: typeof members[0]) => !!m.onlineSince;
    const isInactive = (m: typeof members[0]) =>
      !m.onlineSince && (now.getTime() - new Date(m.lastSeenAt).getTime()) < INACTIVE_CUTOFF;

    const onlineMembers = getOnlineMembers().filter(m => isOnline(m) || isInactive(m));

    const instructorRoles = ['assistant_instructor', 'instructor', 'full_instructor', 'head_instructor', 'admin'];
    const onlineInstructors = onlineMembers.filter(m => instructorRoles.includes(m.role));
    const onlineRegularMembers = onlineMembers.filter(m => m.role === 'member');

    // Bestätigte Check-ins von heute
    const todayCheckIns = checkIns.filter(
      c => c.status === 'approved' && new Date(c.requestedAt).toDateString() === todayStr
    );

    const formatOnlineSince = (m: typeof members[0]): string => {
      const since = m.onlineSince ? new Date(m.onlineSince) : new Date(m.lastSeenAt);
      const diffMs = now.getTime() - since.getTime();
      const mins = Math.floor(diffMs / 60_000);
      if (mins < 1) return 'gerade eben';
      if (mins < 60) return `seit ${mins} Min`;
      return `seit ${Math.floor(mins / 60)} Std`;
    };

    const OnlineDot = ({ member }: { member: typeof members[0] }) => (
      <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${isOnline(member) ? 'bg-green-400' : 'bg-yellow-400'}`} />
    );

    return (
      <div className="space-y-4">
        {/* Kurs-Erkennung Banner */}
        {detectedCourse && (
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-blue-400 text-lg">📅</span>
            <div>
              <div className="text-blue-300 font-semibold text-sm">Laufender Kurs</div>
              <div className="text-blue-400/80 text-xs">{detectedCourse}</div>
            </div>
          </div>
        )}

        {/* Sub-Tab Switcher — sticky */}
        <div className="sticky top-[var(--mi-header-h)] z-30 bg-gray-950 -mx-4 px-4 pt-2 pb-2">
        <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700 gap-1">
          {([
            { id: 'online' as CommunitySubTab, label: 'Online', badge: onlineMembers.length, dot: true },
            { id: 'training' as CommunitySubTab, label: 'Training', badge: todayCheckIns.length, dot: false },
            { id: 'mitglieder' as CommunitySubTab, label: 'Member', badge: 0, dot: false },
            { id: 'rangliste' as CommunitySubTab, label: 'Rangliste', badge: 0, dot: false },
          ] as { id: CommunitySubTab; label: string; badge: number; dot: boolean }[]).map(item => (
            <button
              key={item.id}
              onClick={() => setCommunitySubTab(item.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                communitySubTab === item.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.dot && <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />}
              {item.label}
              {item.badge > 0 && (
                <span className="bg-gray-600 text-gray-300 text-[10px] px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          ))}
        </div>
        </div>

        {/* ── Tab: Online ─────────────────────────────────────────────────── */}
        {communitySubTab === 'online' && (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-700/60 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
                Online
                <span className="text-gray-500 font-normal text-sm">({onlineMembers.length})</span>
              </h3>
              <span className="text-gray-600 text-xs">{liveTick > 0 ? `aktualisiert ×${liveTick}` : 'live'}</span>
            </div>

            {onlineMembers.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">Niemand ist gerade online</div>
            ) : (
              <div className="divide-y divide-gray-700/40">
                {onlineInstructors.length > 0 && (
                  <div className="px-4 py-3">
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                      Trainer ({onlineInstructors.length})
                    </div>
                    <div className="space-y-2">
                      {onlineInstructors.map(m => (
                        <div key={m.id} className="flex items-center gap-3">
                          <OnlineDot member={m} />
                          <span className="text-xl">{m.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-white font-medium text-sm">{m.name}</span>
                            <span className={`ml-2 text-xs ${ROLE_DISPLAY[m.role].color}`}>
                              {ROLE_DISPLAY[m.role].label}
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs flex-shrink-0">{formatOnlineSince(m)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {onlineRegularMembers.length > 0 && (
                  <div className="px-4 py-3">
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                      Members ({onlineRegularMembers.length})
                    </div>
                    <div className="space-y-2">
                      {onlineRegularMembers.map(m => (
                        <div key={m.id} className="flex items-center gap-3">
                          <OnlineDot member={m} />
                          <span className="text-xl">{m.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-white font-medium text-sm">{m.name}</span>
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

        {/* ── Tab: Beim Training ───────────────────────────────────────────── */}
        {communitySubTab === 'training' && (
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-700/60">
                <h3 className="font-bold text-white flex items-center gap-2">
                  📍 Beim Training
                  <span className="text-gray-500 font-normal text-sm">({todayCheckIns.length})</span>
                </h3>
              </div>
              {todayCheckIns.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500 text-sm">Niemand ist heute eingecheckt</div>
              ) : (
                <div className="divide-y divide-gray-700/40">
                  {todayCheckIns.map(ci => {
                    const member = members.find(m => m.id === ci.memberId);
                    if (!member) return null;
                    const checkedInTime = ci.approvedAt
                      ? new Date(ci.approvedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
                      : '–';
                    return (
                      <div key={ci.id} className="px-4 py-3 flex items-center gap-3">
                        <span className="text-xl flex-shrink-0">{member.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm">{member.name}</div>
                          <div className="text-gray-500 text-xs">
                            {LEVEL_DISPLAY[member.currentLevel].subtitle}
                            {detectedCourse && <span> · {detectedCourse.split(' •')[0]}</span>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-green-400 text-sm font-medium">✅ {checkedInTime} Uhr</div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {canAccessTab('dashboard') && (
                            <button
                              onClick={() => { setSelectedMember(member); setActiveTab('dashboard'); setDashboardSubTab('bewerten'); }}
                              className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs"
                            >
                              Bewerten
                            </button>
                          )}
                          <button
                            onClick={() => checkOut(member.id)}
                            className="bg-gray-600/80 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-xs"
                          >
                            Auschecken
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

        {/* ── Training dokumentieren ────────────────────────────────────── */}
        {(() => {
          // Anwesende = bestätigte Check-ins heute
          const todayAttendees = todayCheckIns
            .map(c => members.find(m => m.id === c.memberId))
            .filter((m): m is Member => !!m);

          const allTechs = MODULES.flatMap(mod => mod.techniques.map(t => ({ ...t, moduleId: mod.id, moduleName: mod.name, moduleIcon: mod.icon })));
          const filteredTechs = sessionModuleFilter === 'all'
            ? allTechs
            : allTechs.filter(t => t.moduleId === sessionModuleFilter);

          const initSession = () => {
            const defaultGroup: TrainingGroup = {
              id: 'group-all',
              name: 'Alle',
              memberIds: todayAttendees.map(m => m.id),
              techniqueIds: []
            };
            setSessionAttendees(todayAttendees.map(m => m.id));
            setSessionGroups([defaultGroup]);
            setSessionNotes('');
            setSessionDone(false);
            setShowSessionBuilder(true);
          };

          const toggleTechInGroup = (groupId: string, techId: string) => {
            setSessionGroups(prev => prev.map(g =>
              g.id === groupId
                ? { ...g, techniqueIds: g.techniqueIds.includes(techId) ? g.techniqueIds.filter(id => id !== techId) : [...g.techniqueIds, techId] }
                : g
            ));
          };

          const addGroup = () => {
            const newGroup: TrainingGroup = {
              id: `group-${Date.now()}`,
              name: `Gruppe ${sessionGroups.length + 1}`,
              memberIds: [],
              techniqueIds: []
            };
            setSessionGroups(prev => [...prev, newGroup]);
          };

          const moveMemberToGroup = (memberId: string, targetGroupId: string) => {
            setSessionGroups(prev => prev.map(g => ({
              ...g,
              memberIds: g.id === targetGroupId
                ? [...g.memberIds.filter(id => id !== memberId), memberId]
                : g.memberIds.filter(id => id !== memberId)
            })));
          };

          const removeGroup = (groupId: string) => {
            if (sessionGroups.length <= 1) return;
            const group = sessionGroups.find(g => g.id === groupId);
            const firstGroupId = sessionGroups[0].id;
            setSessionGroups(prev => prev
              .filter(g => g.id !== groupId)
              .map(g => g.id === firstGroupId
                ? { ...g, memberIds: [...g.memberIds, ...(group?.memberIds ?? [])] }
                : g
              )
            );
          };

          const submitSession = () => {
            const totalTechs = [...new Set(sessionGroups.flatMap(g => g.techniqueIds))].length;
            if (totalTechs === 0) return;
            const course = COURSES.find(c =>
              c.locationId === currentUser.locationId &&
              sessionGroups[0]?.memberIds.some(id => c.participantIds.includes(id))
            );
            completeTrainingSession(
              sessionAttendees,
              sessionGroups,
              sessionNotes || undefined,
              course?.id,
              course?.name
            );
            setSessionDone(true);
            setShowSessionBuilder(false);
          };

          if (sessionDone) {
            return (
              <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-green-300 font-bold text-lg">Training dokumentiert!</div>
                <div className="text-green-400/70 text-sm mt-1">Alle Techniken wurden den Members gutgeschrieben.</div>
                <button
                  onClick={() => setSessionDone(false)}
                  className="mt-3 text-xs text-gray-500 hover:text-gray-300 underline"
                >
                  Neues Training dokumentieren
                </button>
              </div>
            );
          }

          if (!showSessionBuilder) {
            return (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white flex items-center gap-2">📝 Training dokumentieren</h3>
                  {todayAttendees.length > 0 && (
                    <span className="text-gray-400 text-xs">{todayAttendees.length} Anwesende</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  {todayAttendees.length === 0
                    ? 'Noch niemand eingecheckt. Du kannst Members auch manuell hinzufügen.'
                    : 'Welche Techniken wurden heute trainiert?'}
                </p>
                <button
                  onClick={initSession}
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-semibold transition-all"
                >
                  📝 Training jetzt dokumentieren
                </button>
              </div>
            );
          }

          // ── Session-Builder ──────────────────────────────────────────────
          return (
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-700/60 flex items-center justify-between">
                <h3 className="font-bold text-white">📝 Training dokumentieren</h3>
                <button onClick={() => setShowSessionBuilder(false)} className="text-gray-500 hover:text-gray-300 text-sm">✕ Abbrechen</button>
              </div>

              <div className="p-4 space-y-5">
                {/* Gruppen */}
                {sessionGroups.map((group, gIdx) => (
                  <div key={group.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 font-semibold text-white text-sm">{group.name}</div>
                      {sessionGroups.length > 1 && (
                        <button onClick={() => removeGroup(group.id)} className="text-gray-600 hover:text-red-400 text-xs">✕ Entfernen</button>
                      )}
                    </div>

                    {/* Members in dieser Gruppe */}
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Members:</div>
                      <div className="flex flex-wrap gap-2">
                        {group.memberIds.map(mid => {
                          const m = members.find(m => m.id === mid);
                          if (!m) return null;
                          return (
                            <div key={mid} className="flex items-center gap-1.5 bg-gray-700 rounded-lg px-2.5 py-1.5 text-sm">
                              <span>{m.avatar}</span>
                              <span className="text-white">{m.name}</span>
                              {sessionGroups.length > 1 && (
                                <select
                                  value={group.id}
                                  onChange={e => moveMemberToGroup(mid, e.target.value)}
                                  className="ml-1 bg-gray-600 text-gray-300 text-xs rounded px-1 py-0.5 border-0 outline-none"
                                >
                                  {sessionGroups.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                          );
                        })}
                        {group.memberIds.length === 0 && (
                          <span className="text-gray-600 text-xs italic">Keine Members — Members aus anderen Gruppen hierher verschieben</span>
                        )}
                      </div>
                    </div>

                    {/* Techniken-Auswahl */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-xs text-gray-500">Techniken:</div>
                        {gIdx === 0 && (
                          <select
                            value={sessionModuleFilter}
                            onChange={e => setSessionModuleFilter(e.target.value)}
                            className="ml-auto bg-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1 border border-gray-600 outline-none"
                          >
                            <option value="all">Alle Module</option>
                            {MODULES.map(m => <option key={m.id} value={m.id}>{m.icon} {getModuleName(m.id)}</option>)}
                          </select>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                        {filteredTechs.map(tech => {
                          const selected = group.techniqueIds.includes(tech.id);
                          return (
                            <button
                              key={tech.id}
                              onClick={() => toggleTechInGroup(group.id, tech.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                                selected
                                  ? 'bg-red-600/30 border-red-500/50 text-red-300'
                                  : 'bg-gray-700/50 border-gray-600/30 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                              }`}
                            >
                              {selected ? '✓ ' : ''}{tech.name}
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {group.techniqueIds.length} Technik{group.techniqueIds.length !== 1 ? 'en' : ''} ausgewählt
                      </div>
                    </div>

                    {gIdx < sessionGroups.length - 1 && <div className="border-t border-gray-700/40" />}
                  </div>
                ))}

                {/* Gruppe hinzufügen */}
                <button
                  onClick={addGroup}
                  className="text-gray-500 hover:text-gray-300 text-sm flex items-center gap-1.5 transition-all"
                >
                  + Gruppe aufteilen
                </button>

                {/* Notiz */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Trainer-Notiz (optional)</label>
                  <textarea
                    rows={2}
                    value={sessionNotes}
                    onChange={e => setSessionNotes(e.target.value)}
                    placeholder="Was war der Fokus? Besonderheiten?"
                    className="w-full bg-gray-700/60 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-gray-400"
                  />
                </div>

                {/* Abschließen */}
                <button
                  onClick={submitSession}
                  disabled={sessionGroups.every(g => g.techniqueIds.length === 0)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    sessionGroups.every(g => g.techniqueIds.length === 0)
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-500 text-white'
                  }`}
                >
                  ✅ Training abschließen ({[...new Set(sessionGroups.flatMap(g => g.techniqueIds))].length} Techniken)
                </button>
              </div>
            </div>
          );
        })()}


          </div>
        )}

        {/* ── Mitglieder ─────────────────────────────────────────────────── */}
        {communitySubTab === 'mitglieder' && (() => {
          const allMembers = members.filter(m => m.role === 'member');
          const getMemberStatus = (m: Member): 'training' | 'online' | 'offline' => {
            if (m.isCheckedIn) return 'training';
            if (m.onlineSince !== undefined) return 'online';
            return 'offline';
          };
          const formatDateTime = (date: Date | null | undefined): string => {
            if (!date) return '–';
            const d = new Date(date);
            const today2 = new Date();
            const isToday = d.toDateString() === today2.toDateString();
            const yesterday = new Date(today2);
            yesterday.setDate(today2.getDate() - 1);
            const isYesterday = d.toDateString() === yesterday.toDateString();
            const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
            if (isToday) return `Heute, ${time}`;
            if (isYesterday) return `Gestern, ${time}`;
            return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }) + `, ${time}`;
          };
          const filtered = allMembers.filter(m =>
            m.name.toLowerCase().includes(memberSearch.toLowerCase())
          );
          const sorted = [...filtered].sort((a, b) => {
            if (memberSort === 'name') return a.name.localeCompare(b.name, 'de');
            if (memberSort === 'lastSeen') return new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime();
            const aT = a.streak.lastTrainingDate ? new Date(a.streak.lastTrainingDate).getTime() : 0;
            const bT = b.streak.lastTrainingDate ? new Date(b.streak.lastTrainingDate).getTime() : 0;
            return bT - aT;
          });
          const countTraining = allMembers.filter(m => m.isCheckedIn).length;
          const countOnline = allMembers.filter(m => !m.isCheckedIn && m.onlineSince !== undefined).length;
          const countOffline = allMembers.length - countTraining - countOnline;
          const StatusDot = ({ status }: { status: 'training' | 'online' | 'offline' }) => {
            if (status === 'training') return <span className="w-3 h-3 rounded-full bg-orange-400 flex-shrink-0 inline-block" />;
            if (status === 'online') return <span className="w-3 h-3 rounded-full bg-green-400 flex-shrink-0 inline-block animate-pulse" />;
            return <span className="w-3 h-3 rounded-full bg-gray-600 flex-shrink-0 inline-block" />;
          };
          const statusLabel = (status: 'training' | 'online' | 'offline') => {
            if (status === 'training') return <span className="text-orange-400 text-xs font-medium">Beim Training</span>;
            if (status === 'online') return <span className="text-green-400 text-xs font-medium">Online</span>;
            return <span className="text-gray-500 text-xs">Offline</span>;
          };
          const SortBtn = ({ k, label }: { k: typeof memberSort; label: string }) => (
            <button
              onClick={() => setMemberSort(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                memberSort === k ? 'bg-red-600 text-white' : 'bg-gray-700/60 text-gray-400 hover:text-white'
              }`}
            >{label}</button>
          );
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-lg font-bold text-white">
                  Member
                  <span className="text-gray-500 font-normal text-sm ml-2">({allMembers.length})</span>
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {countTraining > 0 && <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />{countTraining} beim Training</span>}
                  {countOnline > 0 && <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />{countOnline} online</span>}
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-600 inline-block" />{countOffline} offline</span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Mitglied suchen…"
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  className="flex-1 min-w-40 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                />
                <div className="flex gap-1.5">
                  <SortBtn k="name" label="Name" />
                  <SortBtn k="lastSeen" label="Login" />
                  <SortBtn k="lastTraining" label="Training" />
                </div>
              </div>
              {sorted.length === 0 ? (
                <div className="bg-gray-800/30 rounded-xl p-6 text-center text-gray-500 text-sm">Kein Mitglied gefunden</div>
              ) : (
                <div className="space-y-2">
                  {sorted.map(member => {
                    const status = getMemberStatus(member);
                    const progress = getBlockProgress(member.id, member.currentLevel);
                    return (
                      <div key={member.id} className={`bg-gray-800/50 rounded-xl border transition-all ${status === 'training' ? 'border-orange-500/30' : status === 'online' ? 'border-green-500/20' : 'border-gray-700'}`}>
                        <div className="px-4 py-3 flex items-center gap-3">
                          <StatusDot status={status} />
                          <span className="text-2xl flex-shrink-0">{member.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-white font-semibold text-sm">{member.name}</span>
                              <span className={`text-xs ${LEVEL_DISPLAY[member.currentLevel].color}`}>{LEVEL_DISPLAY[member.currentLevel].icon} {LEVEL_DISPLAY[member.currentLevel].subtitle}</span>
                              <span className="text-gray-600 text-xs">{progress.completed} Techniken</span>
                            </div>
                            <div className="mt-0.5">{statusLabel(status)}</div>
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            <button onClick={() => awardBandaid(member.id, 'Instructor Bonus')} className="bg-gray-700/60 hover:bg-gray-700 text-gray-300 px-2.5 py-1.5 rounded-lg text-xs transition-all" title="Pflaster vergeben">🩹+</button>
                            <button onClick={() => setProfileMember(member)} className="bg-gray-700/60 hover:bg-gray-700 text-gray-300 px-2.5 py-1.5 rounded-lg text-xs transition-all" title="Profil anzeigen">👤</button>
                            <button onClick={() => { setSelectedMember(member); setActiveTab('dashboard'); setDashboardSubTab('bewerten'); }} className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">Bewerten</button>
                          </div>
                        </div>
                        <div className="px-4 pb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500 border-t border-gray-700/40 pt-2">
                          <span><span className="text-gray-600">Zuletzt online:</span> <span className="text-gray-400">{formatDateTime(member.lastSeenAt)}</span></span>
                          <span><span className="text-gray-600">Letztes Training:</span> <span className="text-gray-400">{formatDateTime(member.streak.lastTrainingDate)}</span></span>
                          <span className="flex items-center gap-1">🔥 <span className="text-gray-400">{member.streak.currentStreak} Wochen</span></span>
                          <span className="flex items-center gap-1">🩹 <span className="text-gray-400">{member.streak.bandaids}/{member.streak.maxBandaids}</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── Rangliste ───────────────────────────────────────────────────── */}
        {communitySubTab === 'rangliste' && (
          <RankingList
            members={members.filter(m => m.role === 'member')}
            currentUserId={currentUser!.id}
            currentUserLevel={currentUser!.currentLevel}
            checkIns={checkIns}
            showLevelFilter={false}
          />
        )}

      </div>
    );
  };

  // Render Evaluate Tab
  const renderEvaluateTab = () => {
    if (!selectedMember) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Mitglied auswählen</h3>
          <div className="grid gap-3">
            {members.filter(m => m.role === 'member').map(member => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 flex items-center justify-between hover:bg-gray-700/50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{member.avatar}</span>
                  <div>
                    <div className="font-medium text-white">{member.name}</div>
                    <div className="text-gray-400 text-sm">{LEVEL_DISPLAY[member.currentLevel].subtitle}</div>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (!selectedModule) {
      return (
        <div className="space-y-4">
          <button 
            onClick={() => setSelectedMember(null)}
            className="text-gray-400 hover:text-white flex items-center gap-2"
          >
            ← Zurück zu Mitgliedern
          </button>
          
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 flex items-center gap-4">
            <span className="text-3xl">{selectedMember.avatar}</span>
            <div>
              <div className="font-bold text-white">{selectedMember.name}</div>
              <div className="text-gray-400">{LEVEL_DISPLAY[selectedMember.currentLevel].subtitle}</div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white">Modul auswählen</h3>
          
          {BLOCKS.map(block => {
            if (block.adminOnly && currentUser?.role !== 'admin') return null;
            if (!canExamineLevel(block.level)) return null;
            
            const blockModules = MODULES.filter(m => block.moduleIds.includes(m.id));
            const progress = getBlockProgress(selectedMember.id, block.level);
            
            return (
              <div key={block.id} className={`${block.bgColor} rounded-xl p-4 border ${block.borderColor}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{block.icon}</span>
                  <div>
                    <div className={`font-bold ${block.color}`}>{block.name}</div>
                    <div className="text-gray-400 text-sm">{progress.completed}/{progress.total} Techniken</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {blockModules.map(module => (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModule(module.id)}
                      className="w-full bg-gray-800/50 rounded-lg p-3 flex items-center justify-between hover:bg-gray-700/50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span>{module.icon}</span>
                        <span className="text-white">{getModuleName(module.id)}</span>
                      </div>
                      <span className="text-gray-400">→</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

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

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{module.icon}</span>
            <div>
              <div className="font-bold text-white">{getModuleName(module.id)}</div>
              <div className="text-gray-400 text-sm">{selectedMember.name}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {module.techniques.map(tech => (
            <TechniqueCard
              key={tech.id}
              technique={tech}
              progress={selectedMember.techniqueProgress[tech.id]}
              mode="instructor"
              canExamine={canExamineLevel(tech.level)}
              onMarkPassed={(notes) => markTechniquePassed(selectedMember.id, tech.id, notes)}
            />
          ))}
        </div>
      </div>
    );
  };


  // ── DASHBOARD TAB ─────────────────────────────────────────────────────────
  const renderDashboardTab = () => {
    const anfragenBadge = pendingCheckIns.length + pendingExamRequests.length + totalPendingApps + joinRequests.filter(r => r.status === 'pending').length;
    const boardBadge = unreadBoardNotifs;

    const subTabs: { id: DashboardSubTab; label: string; badge?: number }[] = [
      { id: 'fortschritt', label: '📊 Fortschritt' },
      { id: 'bewerten',    label: '✏️ Bewerten' },
      { id: 'board',       label: '💬 Board',    badge: boardBadge > 0 ? boardBadge : undefined },
      { id: 'anfragen',    label: '📋 Anfragen', badge: anfragenBadge > 0 ? anfragenBadge : undefined },
    ];

    return (
      <div className="space-y-4">
        {/* Sub-Tab Switcher — sticky */}
        <div className="sticky top-[var(--mi-header-h)] z-30 bg-gray-950 -mx-4 px-4 pt-2 pb-2">
          <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700 gap-1">
            {subTabs.map(st => (
              <button
                key={st.id}
                onClick={() => setDashboardSubTab(st.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all relative flex items-center justify-center gap-1.5 ${
                  dashboardSubTab === st.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {st.label}
                {st.badge !== undefined && st.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center ${
                    dashboardSubTab === st.id ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {st.badge > 9 ? '9+' : st.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {dashboardSubTab === 'anfragen' && renderRequestsTab()}
        {dashboardSubTab === 'board' && renderBoardTab()}
        {dashboardSubTab === 'bewerten' && renderEvaluateTab()}
        {dashboardSubTab === 'fortschritt' && renderProgressTab()}
      </div>
    );
  };

  // ── FORTSCHRITT TAB ────────────────────────────────────────────────────────
  const renderProgressTab = () => {
    const progress = currentUser?.instructorLessonProgress ?? {};
    const allLessons = INSTRUCTOR_TRACKS.flatMap(t => t.lessons);
    const totalLessons = allLessons.length;
    const completedTotal = allLessons.filter(l => progress[l.id]?.completed).length;
    const overallPct = totalLessons > 0 ? Math.round((completedTotal / totalLessons) * 100) : 0;

    return (
      <div className="space-y-4">
        {/* Gesamt-Fortschritt */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-semibold">Gesamtfortschritt</span>
            <span className="text-gray-400 text-xs">{completedTotal}/{totalLessons} Lektionen</span>
          </div>
          <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-500"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">{overallPct}%</div>
        </div>

        {/* Pro Track */}
        {INSTRUCTOR_TRACKS.map(track => {
          const done = track.lessons.filter(l => progress[l.id]?.completed).length;
          const total = track.lessons.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const isComplete = done === total;

          return (
            <div key={track.id} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
              {/* Track-Header */}
              <div className="px-4 py-3 border-b border-gray-700/50 flex items-center gap-3">
                <span className="text-xl">{track.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white text-sm font-semibold truncate">{track.title}</span>
                    {isComplete && <span className="text-green-400 text-xs font-bold flex-shrink-0">✓ Abgeschlossen</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-red-600'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-gray-500 text-xs flex-shrink-0">{done}/{total}</span>
                  </div>
                </div>
              </div>

              {/* Lektionen-Liste */}
              <div className="divide-y divide-gray-700/30">
                {track.lessons.map((lesson, idx) => {
                  const lessonDone = progress[lesson.id]?.completed;
                  const completedAt = progress[lesson.id]?.completedAt;
                  const quizScore = progress[lesson.id]?.quizScore;

                  return (
                    <div key={lesson.id} className="px-4 py-2.5 flex items-center gap-3">
                      {/* Status-Icon */}
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        lessonDone ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'
                      }`}>
                        {lessonDone ? '✓' : <span>{idx + 1}</span>}
                      </div>

                      {/* Titel + Meta */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${lessonDone ? 'text-white' : 'text-gray-400'}`}>
                          {lesson.title}
                        </p>
                        {lessonDone && completedAt && (
                          <p className="text-[10px] text-gray-600 mt-0.5">
                            {new Date(completedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                          </p>
                        )}
                      </div>

                      {/* Quiz-Score */}
                      {lessonDone && quizScore !== undefined && (
                        <span className={`text-xs font-bold flex-shrink-0 ${
                          quizScore >= 80 ? 'text-green-400' : quizScore >= 50 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {quizScore}%
                        </span>
                      )}
                      {lessonDone && quizScore === undefined && (
                        <span className="text-xs text-gray-600 flex-shrink-0">–</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render Requests Tab
  const renderRequestsTab = () => {
    const pendingJoinRequests = joinRequests.filter(r => r.status === 'pending');
    const isAdmin = hasAdminAccess(currentUser);

    const openCreateModal = (req: JoinRequest) => {
      setCreateMemberRequest(req);
      setCreateMemberName(req.name);
      setCreateMemberEmail(req.email);
      const randId = `MI-${Math.floor(1000 + Math.random() * 9000)}`;
      const randPw = Math.random().toString(36).slice(2, 10).toUpperCase();
      setCreateMemberId(randId);
      setCreateMemberPassword(randPw);
      setCreateMemberProgress({});
      setCreateMemberSTB(false);
    };

    const handleCreateMember = () => {
      if (!createMemberRequest) return;
      const data: CreateMemberData = {
        name: createMemberName,
        email: createMemberEmail,
        password: createMemberPassword,
        memberId: createMemberId,
        moduleProgress: createMemberProgress,
        stopTheBleedCertified: createMemberSTB,
        joinRequestId: createMemberRequest.id,
      };
      createMemberFromRequest(data);
      setCreateMemberRequest(null);
    };

    const toggleProgress = (moduleNum: number, field: 'tactics' | 'combat') => {
      setCreateMemberProgress(prev => {
        const cur = prev[moduleNum] ?? { tactics: false, combat: false };
        return { ...prev, [moduleNum]: { ...cur, [field]: !cur[field] } };
      });
    };

    const subTabItems: { id: typeof requestSubTab; label: string; badge: number }[] = [
      { id: 'exams',    label: 'Prüfungen',        badge: pendingExamRequests.length },
      { id: 'checkins', label: 'Check-Ins',         badge: pendingCheckIns.length },
      ...(isAdmin ? [{ id: 'beitritt' as const, label: 'Beitrittsanfragen', badge: pendingJoinRequests.length }] : []),
    ];

    return (
      <>
      <div className="space-y-4">
        {/* Sub-Sub-Tab Switcher — sticky unter der Dashboard-Leiste */}
        <div className="sticky top-[calc(var(--mi-header-h)+var(--mi-subtab-h))] z-20 bg-gray-950 -mx-4 px-4 pb-2">
        <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700 gap-1">
          {subTabItems.map(item => (
            <button
              key={item.id}
              onClick={() => setRequestSubTab(item.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                requestSubTab === item.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
              {item.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  requestSubTab === item.id ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        </div>

        {/* ── Prüfungsanfragen ──────────────────────────────────────────────── */}
        {requestSubTab === 'exams' && (
          <div className="space-y-4">
            {pendingExamRequests.length === 0 ? (
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center">
                <p className="text-gray-500 text-sm">Keine offenen Prüfungsanfragen</p>
              </div>
            ) : (
              pendingExamRequests.map(req => {
                const member = members.find(m => m.id === req.memberId);
                const canProcess = currentUser.role !== 'member';
                const feedback = rejectionFeedback[req.id] ?? '';
                const hasComment = feedback.trim().length >= 5;
                const canPass = canProcess;
                const canReject = canProcess && hasComment;

                const levelBadge = req.examLevel === 'technical'
                  ? <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-medium">🔷 Technisch</span>
                  : <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 font-medium">🔶 Taktisch</span>;

                return (
                  <div key={req.id} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="p-4 pb-3">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl flex-shrink-0">{member?.avatar ?? '🥋'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white">{req.memberName}</div>
                          <div className="text-gray-400 text-xs">{req.moduleName}</div>
                        </div>
                        {levelBadge}
                      </div>
                      <div className="bg-gray-700/40 rounded-lg px-3 py-2 flex items-center justify-between">
                        <span className="text-white text-sm font-medium">{req.techniqueName}</span>
                        <span className="text-gray-500 text-xs flex-shrink-0">{formatTimeAgo(req.requestedAt)}</span>
                      </div>
                    </div>
                    {canProcess ? (
                      <div className="border-t border-gray-700/50 px-4 pt-3 pb-4 space-y-3">
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">
                            Kommentar
                            <span className="text-gray-600 ml-1">(optional bei Bestanden — Pflicht bei Nachtrainieren)</span>
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Feedback für den Member… (Pflicht bei Nachtrainieren)"
                            value={feedback}
                            onChange={e => setRejectionFeedback(prev => ({ ...prev, [req.id]: e.target.value }))}
                            className="w-full bg-gray-700/60 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-gray-400 transition-colors"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            disabled={!canPass}
                            onClick={() => {
                              approveExam(req.memberId, req.id, feedback);
                              setRejectionFeedback(prev => { const n = { ...prev }; delete n[req.id]; return n; });
                            }}
                            className="flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all bg-green-600 hover:bg-green-500 text-white"
                          >
                            ✅ Bestanden
                          </button>
                          <button
                            disabled={!canReject}
                            onClick={() => {
                              rejectExam(req.memberId, req.id, feedback);
                              setRejectionFeedback(prev => { const n = { ...prev }; delete n[req.id]; return n; });
                            }}
                            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                              canReject
                                ? 'bg-orange-600 hover:bg-orange-500 text-white'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            ↩ Nachtrainieren
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-gray-700/50 px-4 py-3">
                        <p className="text-yellow-500/80 text-sm">⚠️ Keine Berechtigung zur Prüfung</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}


        {/* ── Check-in Anfragen ─────────────────────────────────────────────── */}
        {requestSubTab === 'checkins' && (
          <div className="space-y-3">
            {pendingCheckIns.length === 0 ? (
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center">
                <p className="text-gray-500 text-sm">Keine offenen Check-in Anfragen</p>
              </div>
            ) : (
              pendingCheckIns.map(checkIn => {
                const canApprove = canApproveCheckIn(currentUser.role, currentUser.id, checkIn);
                const member = members.find(m => m.id === checkIn.memberId);
                return (
                  <div key={checkIn.id} className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl flex-shrink-0">{member?.avatar ?? '🥋'}</span>
                        <div className="min-w-0">
                          <div className="font-medium text-white">{checkIn.memberName}</div>
                          <div className="text-gray-400 text-xs">{formatTimeAgo(checkIn.requestedAt)}</div>
                          {detectedCourse && (
                            <div className="text-blue-400/70 text-xs mt-0.5">📅 {detectedCourse}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {canApprove ? (
                          <>
                            <button
                              onClick={() => approveCheckIn(checkIn.id)}
                              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold transition-all"
                              title="Bestätigen"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => rejectCheckIn(checkIn.id)}
                              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition-all"
                              title="Ablehnen"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500 italic px-2 py-2">
                            Nicht dein Kurs
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Beitrittsanfragen ─────────────────────────────────────────────── */}
        {requestSubTab === 'beitritt' && (
          <div className="space-y-3">
            {pendingJoinRequests.length === 0 ? (
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center">
                <p className="text-gray-500 text-sm">Keine offenen Beitrittsanfragen</p>
                <p className="text-gray-600 text-xs mt-1">Teile den QR-Code im Admin → Plattform-Bereich</p>
              </div>
            ) : (
              pendingJoinRequests.map(req => (
                <div key={req.id} className={`bg-gray-800/50 rounded-xl border overflow-hidden ${
                  req.status === 'pending' ? 'border-gray-700' : req.status === 'approved' ? 'border-green-800/40' : 'border-gray-700/30 opacity-60'
                }`}>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-white">{req.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            req.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            'bg-gray-700 text-gray-500'
                          }`}>
                            {req.status === 'pending' ? 'Ausstehend' : req.status === 'approved' ? 'Angenommen' : 'Abgelehnt'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">{req.email}</div>
                        {(req.memberIdHint || req.course) && (
                          <div className="text-[10px] text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                            {req.memberIdHint && <span>ID: <span className="text-gray-300">{req.memberIdHint}</span></span>}
                            {req.course && <span>Kurs: <span className="text-gray-300">{req.course}</span></span>}
                          </div>
                        )}
                        <div className="text-[10px] text-gray-600 mt-1">
                          {new Date(req.submittedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {req.status === 'pending' && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => openCreateModal(req)}
                            className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                          >
                            Profil erstellen
                          </button>
                          <button
                            onClick={() => rejectJoinRequest(req.id)}
                            className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-all"
                          >
                            Ablehnen
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Profil-Erstellen Modal ──────────────────────────────────────────── */}
      {createMemberRequest && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl">
            <div className="px-5 py-4 border-b border-gray-700/50">
              <div className="text-sm font-bold text-white">Mitglied anlegen</div>
              <div className="text-xs text-gray-500 mt-0.5">Beitrittsanfrage von {createMemberRequest.name}</div>
            </div>
            <div className="p-5 space-y-4">
              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Name</label>
                  <input
                    value={createMemberName}
                    onChange={e => setCreateMemberName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">E-Mail</label>
                  <input
                    value={createMemberEmail}
                    onChange={e => setCreateMemberEmail(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>
              {/* ID + Passwort */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Mitglieds-ID</label>
                  <input
                    value={createMemberId}
                    onChange={e => setCreateMemberId(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Passwort</label>
                  <input
                    value={createMemberPassword}
                    onChange={e => setCreateMemberPassword(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
              </div>

              {/* Modulfortschritt */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-2">Bestehender Fortschritt</label>
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                  <div className="grid grid-cols-[1fr_auto_auto] text-[9px] text-gray-500 font-semibold uppercase tracking-wider px-3 py-2 border-b border-gray-700/30">
                    <span>Modul</span>
                    <span className="w-16 text-center">Tactics</span>
                    <span className="w-16 text-center">Combat</span>
                  </div>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
                    const prog = createMemberProgress[num] ?? { tactics: false, combat: false };
                    const romanNums = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
                    return (
                      <div key={num} className={`grid grid-cols-[1fr_auto_auto] items-center px-3 py-1.5 ${num < 10 ? 'border-b border-gray-700/20' : ''}`}>
                        <span className="text-xs text-gray-300">
                          <span className="text-gray-500 font-mono text-[10px] mr-1.5">{romanNums[num - 1]}</span>
                          Modul {num}
                        </span>
                        <div className="w-16 flex justify-center">
                          <button
                            onClick={() => toggleProgress(num, 'tactics')}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              prog.tactics ? 'bg-gray-900 border-gray-700' : 'border-gray-700 hover:border-gray-500'
                            }`}
                          >
                            {prog.tactics && <span className="text-white font-bold" style={{ fontSize: '9px' }}>T</span>}
                          </button>
                        </div>
                        <div className="w-16 flex justify-center">
                          <button
                            onClick={() => toggleProgress(num, 'combat')}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              prog.combat ? 'bg-red-600 border-red-500' : 'border-gray-700 hover:border-gray-500'
                            }`}
                          >
                            {prog.combat && <span className="text-white font-bold" style={{ fontSize: '9px' }}>C</span>}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stop The Bleed */}
              <div className="flex items-center justify-between py-2 px-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div>
                  <div className="text-sm text-gray-200">Stop The Bleed® Certified</div>
                  <div className="text-[10px] text-gray-500">Erste-Hilfe Zertifizierung bestätigen</div>
                </div>
                <button
                  onClick={() => setCreateMemberSTB(v => !v)}
                  className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${createMemberSTB ? 'bg-red-600' : 'bg-gray-700'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${createMemberSTB ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => setCreateMemberRequest(null)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-all"
              >
                Abbrechen
              </button>
              <button
                onClick={handleCreateMember}
                disabled={!createMemberName || !createMemberEmail || !createMemberId || !createMemberPassword}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all"
              >
                Mitglied anlegen
              </button>
            </div>
          </div>
        </div>
      )}
      </>
    );
  };

  // Render Board Tab
  const renderBoardTab = () => {
    const instructorRoles: InstructorRole[] = ['assistant_instructor', 'instructor', 'full_instructor', 'head_instructor', 'admin'];
    const allInstructors = members.filter(m => instructorRoles.includes(m.role) && m.id !== currentUser!.id);
    const filteredInstructors = allInstructors.filter(m =>
      m.name.toLowerCase().includes(boardMemberSearch.toLowerCase())
    );

    const ROLE_GROUPS: { id: InstructorRole; label: string }[] = [
      { id: 'assistant_instructor', label: 'Assistent' },
      { id: 'instructor', label: 'Instructor' },
      { id: 'full_instructor', label: 'Full Instructor' },
      { id: 'head_instructor', label: 'Head Instructor' },
      { id: 'admin', label: 'Admin' },
    ];

    const toggleRole = (role: InstructorRole) =>
      setBoardTargetRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
    const toggleMember = (id: string) =>
      setBoardTargetMemberIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const hasTargets = boardTargetType === 'all' || boardTargetType === 'activity'
      ? true
      : boardTargetType === 'roles' ? boardTargetRoles.length > 0
      : boardTargetType === 'members' ? boardTargetMemberIds.length > 0 : false;

    // Aktive Members nach Trainingsteilnahme
    const getActivityMembers = (months: number) => {
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() - months);
      const activeIds = new Set(
        trainingSessions
          .filter(s => s.status === 'completed' && new Date(s.date) >= cutoff)
          .flatMap(s => s.attendeeIds)
      );
      return members.filter(m => activeIds.has(m.id) && m.id !== currentUser!.id);
    };

    const targetSummary = (): string => {
      if (boardTargetType === 'none') return 'Keine';
      if (boardTargetType === 'all') return `Alle (${members.filter(m => m.id !== currentUser!.id).length} Personen)`;
      if (boardTargetType === 'activity') {
        const count = getActivityMembers(boardActivityMonths).length;
        return `${count} aktive Mitglieder (letzte ${boardActivityMonths} Monate)`;
      }
      if (boardTargetType === 'roles') {
        if (boardTargetRoles.length === 0) return 'Keine Rollen gewählt';
        return boardTargetRoles.map(r => ROLE_GROUPS.find(g => g.id === r)?.label ?? r).join(', ');
      }
      if (boardTargetMemberIds.length === 0) return 'Keine Personen gewählt';
      return boardTargetMemberIds.map(id => members.find(m => m.id === id)?.name ?? id).join(', ');
    };

    const notifCount = boardTargetType === 'all'
      ? members.filter(m => m.id !== currentUser!.id).length
      : boardTargetType === 'activity' ? getActivityMembers(boardActivityMonths).length
      : boardTargetType === 'roles' ? allInstructors.filter(m => boardTargetRoles.includes(m.role)).length
      : boardTargetType === 'members' ? boardTargetMemberIds.length : 0;

    // Admin sieht IMMER alles; restricted = nur Targets/Autor
    const canSeeMessage = (msg: typeof boardMessages[0]): boolean => {
      if (currentUser!.role === 'admin') return true;
      if (msg.visibility === 'restricted') {
        if (msg.authorId === currentUser!.id) return true;
        if (msg.targetType === 'all') return true;
        if (msg.targetType === 'activity') return msg.targetMemberIds ? msg.targetMemberIds.includes(currentUser!.id) : true;
        if (msg.targetType === 'roles' && msg.targetRoles) return msg.targetRoles.includes(currentUser!.role);
        if (msg.targetType === 'members' && msg.targetMemberIds) return msg.targetMemberIds.includes(currentUser!.id);
        return false;
      }
      return true;
    };

    const visibleMessages = boardMessages.filter(canSeeMessage).slice().reverse();

    const canRestrictVisibility = hasPermission('canRestrictBoardVisibility');

    const handleSend = () => {
      if (!boardMessageText.trim()) return;
      sendBoardMessage(
        boardMessageText,
        boardVisibility,
        boardTargetType,
        boardTargetType === 'roles' ? boardTargetRoles : undefined,
        boardTargetType === 'members' ? boardTargetMemberIds : undefined,
        boardNewRepliesEnabled,
        boardTargetType === 'activity' ? boardActivityMonths : undefined,
      );
      setBoardMessageText('');
      setBoardVisibility('public');
      setBoardTargetType('none');
      setBoardTargetRoles([]);
      setBoardTargetMemberIds([]);
      setBoardMemberSearch('');
      setBoardNewRepliesEnabled(true);
    };

    const handleSendReply = (msgId: string) => {
      if (!boardReplyText.trim()) return;
      addBoardReply(msgId, boardReplyText);
      setBoardReplyText('');
      setBoardReplyOpenId(null);
    };

    return (
      <div className="space-y-4">

        {/* ── Globale Einstellungen (nur Admin) ── */}
        {currentUser!.role === 'admin' && (
          <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-300">Antworten global</div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                {boardRepliesGloballyEnabled ? 'Mitglieder können antworten' : 'Antworten für alle gesperrt'}
              </div>
            </div>
            <button
              onClick={() => setBoardRepliesGloballyEnabled(!boardRepliesGloballyEnabled)}
              className={`relative w-10 h-5 rounded-full transition-all ${boardRepliesGloballyEnabled ? 'bg-red-600' : 'bg-gray-700'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${boardRepliesGloballyEnabled ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
        )}

        {/* ── Verfassen ──────────────────────────────────────────────────── */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 space-y-3">
            <textarea
              value={boardMessageText}
              onChange={e => setBoardMessageText(e.target.value)}
              placeholder="Nachricht verfassen…"
              rows={3}
              className="w-full bg-gray-700/60 text-white rounded-lg p-3 border border-gray-600 resize-none focus:outline-none focus:border-gray-500 text-sm"
            />

            {/* Sichtbarkeit */}
            <div>
              <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1.5">Sichtbarkeit</div>
              <div className="flex gap-2">
                {(['public', 'restricted'] as const).map(v => {
                  const isDisabled = v === 'restricted' && !canRestrictVisibility;
                  return (
                    <button
                      key={v}
                      onClick={() => !isDisabled && setBoardVisibility(v)}
                      disabled={isDisabled}
                      title={isDisabled ? 'Nur Admins können die Sichtbarkeit einschränken' : undefined}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isDisabled ? 'opacity-40 cursor-not-allowed border-gray-700 text-gray-600'
                          : boardVisibility === v ? 'bg-gray-700 border-gray-500 text-white' : 'bg-gray-800/50 border-gray-700 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {v === 'public' ? '🌐 Alle können lesen' : '🔒 Nur Ausgewählte'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Empfänger */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">
                  Empfänger {boardVisibility === 'restricted' && <span className="text-yellow-600/80 normal-case tracking-normal font-normal">(bestimmt auch wer lesen kann)</span>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {([
                  { id: 'none',     label: 'Keine' },
                  { id: 'all',      label: 'Alle' },
                  { id: 'activity', label: 'Aktiv' },
                  { id: 'roles',    label: 'Nach Rang' },
                  { id: 'members',  label: 'Nach Name' },
                ] as { id: typeof boardTargetType; label: string }[]).map(t => (
                  <button key={t.id}
                    onClick={() => { setBoardTargetType(t.id); setBoardTargetRoles([]); setBoardTargetMemberIds([]); }}
                    className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      boardTargetType === t.id ? 'bg-gray-700 border-gray-500 text-white' : 'bg-gray-800/50 border-gray-700 text-gray-500 hover:text-gray-300'
                    }`}
                  >{t.label}</button>
                ))}
              </div>

              {/* Aktivitäts-Filter: Monats-Auswahl */}
              {boardTargetType === 'activity' && (
                <div className="mb-2">
                  <div className="text-[10px] text-gray-500 mb-1.5">Trainiert in den letzten…</div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 6].map(m => (
                      <button key={m} onClick={() => setBoardActivityMonths(m)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          boardActivityMonths === m ? 'bg-red-600 border-red-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                        }`}
                      >{m} Mon.</button>
                    ))}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1.5">
                    → {getActivityMembers(boardActivityMonths).length} Mitglieder qualifiziert
                  </div>
                </div>
              )}

              {boardTargetType === 'roles' && (
                <div className="flex flex-wrap gap-1.5">
                  {ROLE_GROUPS.map(g => (
                    <button key={g.id} onClick={() => toggleRole(g.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                        boardTargetRoles.includes(g.id) ? 'bg-red-600 border-red-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                      }`}
                    >{g.label}</button>
                  ))}
                </div>
              )}
              {boardTargetType === 'members' && (
                <div className="space-y-1.5">
                  <input type="text" value={boardMemberSearch} onChange={e => setBoardMemberSearch(e.target.value)}
                    placeholder="Person suchen…"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                  />
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {filteredInstructors.map(m => (
                      <button key={m.id} onClick={() => toggleMember(m.id)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border ${
                          boardTargetMemberIds.includes(m.id) ? 'bg-red-600/20 border-red-500/40 text-white' : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${boardTargetMemberIds.includes(m.id) ? 'bg-red-600 border-red-500' : 'border-gray-500'}`}>
                          {boardTargetMemberIds.includes(m.id) && <span className="text-white text-[8px] font-bold">✓</span>}
                        </span>
                        <span>{m.avatar} {m.name}</span>
                        <span className={`ml-auto text-[10px] ${ROLE_DISPLAY[m.role].color}`}>{ROLE_DISPLAY[m.role].label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Antworten erlauben Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">Antworten</span>
              <button
                onClick={() => setBoardNewRepliesEnabled(v => !v)}
                className={`relative w-10 h-5 rounded-full transition-all ${boardNewRepliesEnabled ? 'bg-red-600' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${boardNewRepliesEnabled ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Zusammenfassung + Senden */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-700/50">
              <div className="text-xs text-gray-600 leading-tight">
                <div>{boardVisibility === 'public' ? '🌐 Alle sehen' : '🔒 Nur Ausgewählte'}</div>
                {boardTargetType !== 'none' && (notifCount > 0) && (
                  <div className="text-gray-500">🔔 {notifCount} Benachrichtigung{notifCount !== 1 ? 'en' : ''} → {targetSummary()}</div>
                )}
                {boardTargetType !== 'none' && notifCount === 0 && (
                  <div className="text-gray-600">🔔 Niemand qualifiziert / ausgewählt</div>
                )}
              </div>
              <button onClick={handleSend} disabled={!boardMessageText.trim()}
                className="bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all"
              >Senden</button>
            </div>
          </div>
        </div>

        {/* ── Nachrichten ────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {visibleMessages.length === 0 ? (
            <div className="bg-gray-800/30 rounded-xl p-6 text-center text-gray-500 text-sm border border-gray-700/30">
              Keine sichtbaren Nachrichten
            </div>
          ) : visibleMessages.map(msg => {
            const isRestricted = msg.visibility === 'restricted';
            const targetInfo = msg.targetType === 'all' ? 'Alle'
              : msg.targetType === 'activity' ? `Aktiv (letzte ${msg.targetActivityMonths ?? '?'} Monate)`
              : msg.targetType === 'roles' && msg.targetRoles?.length
              ? msg.targetRoles.map(r => ROLE_GROUPS.find(g => g.id === r)?.label ?? r).join(', ')
              : msg.targetType === 'members' && msg.targetMemberIds?.length
              ? msg.targetMemberIds.map(id => members.find(m => m.id === id)?.name ?? id).join(', ')
              : null;

            const readBy = msg.readBy ?? [];
            const isAuthor = msg.authorId === currentUser!.id;
            const isAdmin = currentUser!.role === 'admin';
            const hasRead = readBy.includes(currentUser!.id) || isAdmin; // Admin zählt immer als gelesen
            const showReadPanel = (isAuthor || isAdmin) && boardReadersOpenId === msg.id;

            // Personen die lesen müssten: alle Instructors minus Autor
            const expectedReaders = allInstructors;
            const unreadMembers = expectedReaders.filter(m => !readBy.includes(m.id));

            const replyOpen = boardReplyOpenId === msg.id;

            return (
              <div key={msg.id} className={`bg-gray-800/50 rounded-xl border ${isRestricted ? 'border-gray-600' : 'border-gray-700'}`}>
                {/* ── Hauptnachricht ── */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-medium text-sm">
                        {msg.authorName}
                        <span className={`ml-1.5 text-xs font-normal ${ROLE_DISPLAY[msg.authorRole].color}`}>· {ROLE_DISPLAY[msg.authorRole].label}</span>
                      </span>
                      {isRestricted && <span className="text-[10px] text-gray-500 bg-gray-700/50 px-1.5 py-0.5 rounded">🔒 Eingeschränkt</span>}
                      {targetInfo && <span className="text-[10px] text-gray-500 bg-gray-700/50 px-1.5 py-0.5 rounded">🔔 {targetInfo}</span>}
                    </div>
                    <span className="text-gray-500 text-xs flex-shrink-0">{formatTimeAgo(msg.createdAt)}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{msg.content}</p>

                  {/* ── Aktionen ── */}
                  <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-gray-700/40">
                    {/* Gelesen-Button (für alle die noch nicht gelesen haben und nicht Autor/Admin sind) */}
                    {!isAuthor && !isAdmin && (
                      <button
                        onClick={() => !hasRead && markBoardMessageRead(msg.id)}
                        disabled={hasRead}
                        className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                          hasRead
                            ? 'text-gray-600 border-gray-700/50 cursor-default'
                            : 'text-gray-300 border-gray-600 hover:border-gray-500 hover:text-white'
                        }`}
                      >
                        {hasRead ? '✓ Gelesen' : 'Als gelesen markieren'}
                      </button>
                    )}

                    {/* Leser-Panel Toggle (nur für Autor und Admin) */}
                    {(isAuthor || isAdmin) && (
                      <button
                        onClick={() => setBoardReadersOpenId(boardReadersOpenId === msg.id ? null : msg.id)}
                        className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                          showReadPanel ? 'bg-gray-700 border-gray-500 text-white' : 'text-gray-500 border-gray-700 hover:text-gray-300'
                        }`}
                      >
                        👁 {readBy.length} gelesen {unreadMembers.length > 0 && `· ${unreadMembers.length} ausstehend`}
                      </button>
                    )}

                    {/* Pro-Post Antworten-Toggle (nur Admin) */}
                    {isAdmin && (
                      <button
                        onClick={() => setBoardMessageRepliesEnabled(msg.id, !(msg.repliesEnabled !== false))}
                        title={msg.repliesEnabled !== false ? 'Antworten sperren' : 'Antworten freigeben'}
                        className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                          msg.repliesEnabled !== false ? 'text-gray-500 border-gray-700 hover:text-yellow-400 hover:border-yellow-700' : 'text-yellow-500 border-yellow-700/50 bg-yellow-900/20'
                        }`}
                      >
                        {msg.repliesEnabled !== false ? '💬' : '🔇'}
                      </button>
                    )}

                    {/* Antworten-Button */}
                    <button
                      onClick={() => { setBoardReplyOpenId(replyOpen ? null : msg.id); setBoardReplyText(''); }}
                      className={`text-xs px-3 py-1 rounded-lg border transition-all ml-auto ${
                        replyOpen ? 'bg-gray-700 border-gray-500 text-white' : 'text-gray-500 border-gray-700 hover:text-gray-300'
                      }`}
                    >
                      💬 {(msg.replies?.length ?? 0) > 0 ? `${msg.replies!.length} Antwort${msg.replies!.length !== 1 ? 'en' : ''}` : 'Antworten'}
                      {msg.repliesEnabled === false && <span className="ml-1 text-yellow-500/70">· gesperrt</span>}
                    </button>
                  </div>
                </div>

                {/* ── Leser-Panel ── */}
                {showReadPanel && (
                  <div className="border-t border-gray-700/50 px-4 py-3 space-y-2">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">Lesestatus</div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {expectedReaders.map(m => {
                        const hasReadMsg = readBy.includes(m.id);
                        return (
                          <div key={m.id} className="flex items-center gap-2 py-1">
                            <span className={`text-xs w-4 text-center ${hasReadMsg ? 'text-green-500' : 'text-gray-600'}`}>
                              {hasReadMsg ? '✓' : '○'}
                            </span>
                            <span className={`text-xs flex-1 ${hasReadMsg ? 'text-gray-300' : 'text-gray-500'}`}>{m.name}</span>
                            <span className={`text-[10px] ${ROLE_DISPLAY[m.role].color}`}>{ROLE_DISPLAY[m.role].label}</span>
                            {!hasReadMsg && isAdmin && (
                              <button
                                onClick={() => sendReadReminder(msg.id, m.id)}
                                className="text-[10px] text-gray-500 hover:text-white border border-gray-700 hover:border-gray-500 px-2 py-0.5 rounded transition-all"
                              >Erinnern</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Replies ── */}
                {(msg.replies?.length ?? 0) > 0 && (
                  <div className="border-t border-gray-700/30 divide-y divide-gray-700/20">
                    {msg.replies!.map(reply => (
                      <div key={reply.id} className="flex gap-3 px-4 py-2.5">
                        <div className="w-0.5 bg-gray-700/60 rounded-full flex-shrink-0 mt-0.5 self-stretch" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-gray-300">{reply.authorName}<span className={`ml-1 ${ROLE_DISPLAY[reply.authorRole].color}`}>· {ROLE_DISPLAY[reply.authorRole].label}</span></span>
                            <span className="text-gray-600 text-[10px]">{formatTimeAgo(reply.createdAt)}</span>
                          </div>
                          <p className="text-gray-400 text-xs leading-relaxed">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Reply-Eingabe ── */}
                {replyOpen && (
                  <div className="border-t border-gray-700/50 p-3 flex gap-2">
                    <input
                      value={boardReplyText}
                      onChange={e => setBoardReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(msg.id); }}}
                      placeholder="Antwort schreiben…"
                      className="flex-1 bg-gray-700/60 text-white rounded-lg px-3 py-2 border border-gray-600 text-sm focus:outline-none focus:border-gray-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSendReply(msg.id)}
                      disabled={!boardReplyText.trim()}
                      className="bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    >↩</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Admin Tab
  const renderAdminTab = () => {
    // ── DnD Helpers ────────────────────────────────────────────────────────
    const getWorkingOrder = (): ModuleOrder[] => {
      if (localModuleOrder.length > 0) return localModuleOrder;
      if (moduleOrder.length > 0) return moduleOrder;
      return MODULES.map((m, i) => ({ moduleId: m.id, blockLevel: m.level, position: i }));
    };

    const getModulesForBlock = (blockLevel: string) =>
      getWorkingOrder()
        .filter(o => o.blockLevel === blockLevel)
        .sort((a, b) => a.position - b.position)
        .map(o => MODULES.find(m => m.id === o.moduleId))
        .filter(Boolean) as typeof MODULES;

    const handleMoveUp = (moduleId: string, blockLevel: string) => {
      const current = getWorkingOrder();
      const blockItems = current
        .filter(o => o.blockLevel === blockLevel)
        .sort((a, b) => a.position - b.position);
      const idx = blockItems.findIndex(o => o.moduleId === moduleId);
      if (idx <= 0) return;
      const reordered = [...blockItems];
      [reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]];
      const newOrder: ModuleOrder[] = BLOCKS.flatMap(block =>
        block.level === blockLevel
          ? reordered.map((o, i) => ({ ...o, position: i }))
          : current.filter(o => o.blockLevel === block.level).sort((a, b) => a.position - b.position).map((o, i) => ({ ...o, position: i }))
      );
      setLocalModuleOrder(newOrder);
      setDndSaveState('dirty');
    };

    const handleMoveDown = (moduleId: string, blockLevel: string) => {
      const current = getWorkingOrder();
      const blockItems = current
        .filter(o => o.blockLevel === blockLevel)
        .sort((a, b) => a.position - b.position);
      const idx = blockItems.findIndex(o => o.moduleId === moduleId);
      if (idx < 0 || idx >= blockItems.length - 1) return;
      const reordered = [...blockItems];
      [reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]];
      const newOrder: ModuleOrder[] = BLOCKS.flatMap(block =>
        block.level === blockLevel
          ? reordered.map((o, i) => ({ ...o, position: i }))
          : current.filter(o => o.blockLevel === block.level).sort((a, b) => a.position - b.position).map((o, i) => ({ ...o, position: i }))
      );
      setLocalModuleOrder(newOrder);
      setDndSaveState('dirty');
    };

    const handleBlockChange = (moduleId: string, newBlockLevel: string) => {
      const current = getWorkingOrder();
      const blockItems = current.filter(o => o.blockLevel === newBlockLevel);
      const reindexed = BLOCKS.flatMap(block =>
        current
          .map(o => o.moduleId === moduleId ? { ...o, blockLevel: newBlockLevel, position: blockItems.length } : o)
          .filter(o => o.blockLevel === block.level)
          .sort((a, b) => a.position - b.position)
          .map((o, i) => ({ ...o, position: i }))
      );
      setLocalModuleOrder(reindexed);
      setDndSaveState('dirty');
    };

    const handleSave = async () => {
      await saveModuleOrder(getWorkingOrder());
      setDndSaveState('saved');
      setDndPendingClose(false);
    };

    // ── Role options ────────────────────────────────────────────────────────
    const roleOptions: { value: InstructorRole; label: string }[] = [
      { value: 'member', label: 'Member' },
      { value: 'assistant_instructor', label: 'Assistant Instructor' },
      { value: 'instructor', label: 'Instructor' },
      { value: 'full_instructor', label: 'Full Instructor' },
      { value: 'head_instructor', label: 'Head Instructor' },
      { value: 'admin', label: 'Admin' },
    ];
    const isOwnerOrAdmin = currentUser.role === 'admin';

    return (
      <div className="space-y-4">
        {/* Sub-Tab Switcher — sticky */}
        <div className="sticky top-[var(--mi-header-h)] z-30 bg-gray-950 -mx-4 px-4 pt-2 pb-2">
        <div className="flex bg-gray-800/50 rounded-xl p-1 gap-1 border border-gray-700/50 overflow-x-auto">
          {([
            ['analytics', '📊 Analytics'],
            ['verwaltung', '⚙️ Verwaltung'],
            ['bewerbungen', `💼 Bewerbungen${totalPendingApps > 0 ? ` (${totalPendingApps})` : ''}`],
          ] as [AdminSubTab, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setAdminSubTab(id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                adminSubTab === id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        </div>

        {/* Sub-Sub-Tab-Leiste Verwaltung */}
        {adminSubTab === 'verwaltung' && (
          <div className="flex bg-gray-800/40 rounded-xl p-1 gap-1 border border-gray-700/40">
            {([
              ['plattform', '🔧 Plattform'],
              ['training', '🥋 Training'],
              ['mitglieder', '👥 Member'],
            ] as [VerwaltungSubTab, string][]).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setVerwaltungSubTab(id)}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  verwaltungSubTab === id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* ── ANALYTICS ──────────────────────────────────────────────── */}
        {adminSubTab === 'analytics' && (() => {
          const allM = members.filter(m => m.role === 'member');
          const now = new Date();

          // Wochenstart-Helfer
          const wStart = (d: Date) => {
            const s = new Date(d); const day = s.getDay();
            s.setDate(s.getDate() - (day === 0 ? 6 : day - 1)); s.setHours(0,0,0,0); return s;
          };
          const thisWeekStart = wStart(now);

          // KPIs
          const activeThisWeek = new Set(
            checkIns.filter(c => c.status === 'approved' && c.approvedAt && new Date(c.approvedAt) >= thisWeekStart).map(c => c.memberId)
          ).size;
          const avgStreak = allM.length ? Math.round(allM.reduce((s, m) => s + m.streak.currentStreak, 0) / allM.length) : 0;
          const stbCount = allM.filter(m => m.stopTheBleedCertified).length;
          const pendingJoin = joinRequests.filter(r => r.status === 'pending').length;
          const totalXP = allM.reduce((s, m) => s + (m.xp ?? 0), 0);

          // Check-in Trend: letzte 8 Wochen
          const weekTrend: { label: string; count: number }[] = [];
          for (let i = 7; i >= 0; i--) {
            const wS = new Date(thisWeekStart); wS.setDate(wS.getDate() - i * 7);
            const wE = new Date(wS); wE.setDate(wE.getDate() + 7);
            const label = i === 0 ? 'Jetzt'
              : `${wS.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}`;
            const count = checkIns.filter(c =>
              c.status === 'approved' && c.approvedAt &&
              new Date(c.approvedAt) >= wS && new Date(c.approvedAt) < wE
            ).length;
            weekTrend.push({ label, count });
          }
          const maxCheckIns = Math.max(...weekTrend.map(w => w.count), 1);

          // Kapitel-Verteilung
          const levelCounts: Record<string, number> = {};
          allM.forEach(m => { levelCounts[m.currentLevel] = (levelCounts[m.currentLevel] ?? 0) + 1; });

          // Modul-Abschluss (erste 10 Curriculum-Module)
          const currMods = BLOCKS.filter(b => b.id !== 'assistant_instructor')
            .flatMap(b => b.moduleIds.map(id => MODULES.find(m => m.id === id)!))
            .filter(Boolean).slice(0, 10);

          const getModDone = (member: Member, modId: string) => {
            const mod = MODULES.find(m => m.id === modId);
            if (!mod) return { t: false, c: false };
            const req = mod.techniques.filter(t => t.isRequired);
            if (!req.length) return { t: false, c: false };
            const t = req.every(t => { const s = member.techniqueProgress[t.id]?.status; return s === 'tech_passed' || s === 'tac_passed'; });
            const c = req.every(t => member.techniqueProgress[t.id]?.status === 'tac_passed');
            return { t, c };
          };

          // Inaktive Mitglieder (>14 Tage kein Training)
          const cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - 14);
          const inactive = allM.filter(m => {
            const last = m.streak.lastTrainingDate ? new Date(m.streak.lastTrainingDate) : null;
            return !last || last < cutoff;
          }).sort((a, b) => {
            const la = a.streak.lastTrainingDate ? new Date(a.streak.lastTrainingDate).getTime() : 0;
            const lb = b.streak.lastTrainingDate ? new Date(b.streak.lastTrainingDate).getTime() : 0;
            return la - lb;
          });

          const LEVEL_LABELS: Record<string, { label: string; color: string; icon: string }> = {
            conflict:   { label: 'Conflict Ready',  color: 'bg-gray-500',  icon: '⚪' },
            combat:     { label: 'Combat Ready',    color: 'bg-gray-300',  icon: '⚫' },
            tactical:   { label: 'Tactical Ready',  color: 'bg-red-600',   icon: '🔴' },
            contact:    { label: 'Contact Ready',   color: 'bg-red-400',   icon: '☠️' },
            assistant_instructor: { label: 'Asst. Instructor', color: 'bg-yellow-500', icon: '🎓' },
          };

          return (
            <div className="space-y-5">

              {/* ── KPI Karten ── */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Member', value: allM.length, icon: '👥', sub: `${activeThisWeek} aktiv diese Woche` },
                  { label: 'Ø Streak', value: `${avgStreak} W`, icon: '🔥', sub: 'Durchschnitt aller Member' },
                  { label: 'Stop The Bleed', value: stbCount, icon: '🩸', sub: `${allM.length ? Math.round(stbCount / allM.length * 100) : 0}% zertifiziert` },
                  { label: 'Gesamt XP', value: totalXP.toLocaleString('de-DE'), icon: '⭐', sub: `Ø ${allM.length ? Math.round(totalXP / allM.length) : 0} XP/Mitglied` },
                ].map(k => (
                  <div key={k.label} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-2xl font-black text-white">{k.value}</div>
                        <div className="text-xs font-semibold text-gray-400 mt-0.5">{k.label}</div>
                        <div className="text-[10px] text-gray-600 mt-1">{k.sub}</div>
                      </div>
                      <span className="text-2xl opacity-60">{k.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Offene Beitrittsanfragen Banner */}
              {pendingJoin > 0 && (
                <button
                  onClick={() => setAdminSubTab('bewerbungen')}
                  className="w-full bg-yellow-900/30 border border-yellow-700/50 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-yellow-900/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold text-sm">🔔 {pendingJoin} offene Beitrittsanfrage{pendingJoin > 1 ? 'n' : ''}</span>
                  </div>
                  <span className="text-yellow-600 text-xs">Anfragen öffnen →</span>
                </button>
              )}

              {/* ── Check-in Trend ── */}
              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-700/30">
                  <div className="text-sm font-semibold text-white">Check-in Trend</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Bestätigte Trainings — letzte 8 Wochen</div>
                </div>
                <div className="px-4 py-4">
                  <div className="flex items-end gap-1.5 h-24">
                    {weekTrend.map((w, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <span className="text-[9px] text-gray-500 font-mono">{w.count || ''}</span>
                        <div
                          className={`w-full rounded-t transition-all ${i === weekTrend.length - 1 ? 'bg-red-600' : 'bg-gray-600'}`}
                          style={{ height: `${Math.max((w.count / maxCheckIns) * 72, w.count > 0 ? 4 : 0)}px` }}
                        />
                        <span className="text-[8px] text-gray-600 text-center leading-tight">{w.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── 2-Spalten ── */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Kapitel-Verteilung */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700/30">
                    <div className="text-sm font-semibold text-white">Kapitel-Verteilung</div>
                  </div>
                  <div className="px-4 py-3 space-y-2.5">
                    {Object.entries(LEVEL_LABELS).map(([level, meta]) => {
                      const count = levelCounts[level] ?? 0;
                      const pct = allM.length ? (count / allM.length) * 100 : 0;
                      return (
                        <div key={level}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-300">{meta.icon} {meta.label}</span>
                            <span className="text-xs font-bold text-white">{count}</span>
                          </div>
                          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${meta.color} transition-all`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Inaktive Mitglieder */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700/30">
                    <div className="text-sm font-semibold text-white">Inaktiv &gt;14 Tage</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{inactive.length} Member</div>
                  </div>
                  <div className="divide-y divide-gray-700/30 max-h-52 overflow-y-auto">
                    {inactive.length === 0 ? (
                      <div className="px-4 py-4 text-center text-gray-600 text-xs">Alle aktiv 💪</div>
                    ) : inactive.map(m => {
                      const last = m.streak.lastTrainingDate ? new Date(m.streak.lastTrainingDate) : null;
                      const daysAgo = last ? Math.floor((now.getTime() - last.getTime()) / 86400000) : null;
                      return (
                        <div key={m.id} className="px-4 py-2.5 flex items-center gap-2">
                          <span className="text-base flex-shrink-0">{m.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-300 truncate">{m.name}</div>
                            <div className="text-[10px] text-gray-600">
                              {daysAgo === null ? 'Noch nie' : `vor ${daysAgo} Tagen`}
                            </div>
                          </div>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            daysAgo === null || daysAgo > 30 ? 'bg-red-900/40 text-red-400' : 'bg-yellow-900/40 text-yellow-400'
                          }`}>
                            {daysAgo === null ? '–' : `${daysAgo}d`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── Modul-Abschlussrate ── */}
              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-700/30">
                  <div className="text-sm font-semibold text-white">Modul-Abschlussrate</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Anteil der Mitglieder die Tactics / Combat je Modul bestanden haben</div>
                </div>
                <div className="px-4 py-3 space-y-3">
                  {currMods.map((mod, idx) => {
                    const tDone = allM.filter(m => getModDone(m, mod.id).t).length;
                    const cDone = allM.filter(m => getModDone(m, mod.id).c).length;
                    const tPct = allM.length ? (tDone / allM.length) * 100 : 0;
                    const cPct = allM.length ? (cDone / allM.length) * 100 : 0;
                    const romanNums = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
                    return (
                      <div key={mod.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">
                            <span className="text-gray-600 font-mono mr-1.5">{romanNums[idx]}</span>
                            {getModuleName(mod.id)}
                          </span>
                          <div className="flex gap-3 text-[10px] text-gray-500">
                            <span>T: <span className="text-gray-300 font-semibold">{tDone}/{allM.length}</span></span>
                            <span>C: <span className="text-gray-300 font-semibold">{cDone}/{allM.length}</span></span>
                          </div>
                        </div>
                        <div className="flex gap-1 h-2">
                          <div className="flex-1 bg-gray-700/60 rounded-full overflow-hidden">
                            <div className="h-full bg-gray-400 rounded-full transition-all" style={{ width: `${tPct}%` }} />
                          </div>
                          <div className="flex-1 bg-gray-700/60 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 rounded-full transition-all" style={{ width: `${cPct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex gap-4 text-[9px] text-gray-600 pt-1">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-gray-400 inline-block" /> Tactics</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-600 inline-block" /> Combat</span>
                  </div>
                </div>
              </div>

            </div>
          );
        })()}

        {/* ── MITGLIEDER ──────────────────────────────────────────────── */}
        {adminSubTab === 'verwaltung' && verwaltungSubTab === 'mitglieder' && (
          <div className="space-y-3">
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700/20 transition-all"
                onClick={() => togglePlattform('mitglieder_liste')}
              >
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">Member verwalten</div>
                  <div className="text-xs text-gray-500 mt-0.5">Rollen, Admin-Zugang, Kerndaten und Streak.</div>
                </div>
                <span className="text-gray-500 text-xs ml-3 flex-shrink-0">{plattformOpen['mitglieder_liste'] ? '▲' : '▼'}</span>
              </button>
              {plattformOpen['mitglieder_liste'] && (
              <div className="border-t border-gray-700/50 divide-y divide-gray-700/40">
            {members.map(m => {
              const roleInfo = ROLE_DISPLAY[m.role];
              const memberHasAdmin = hasAdminAccess(m);
              const canToggleAdmin = isOwnerOrAdmin && m.role === 'head_instructor' && m.id !== currentUser.id;
              const adminFixed = m.role === 'admin';
              const isSettingsOpen = memberSettingsOpen === m.id;

              return (
                <div key={m.id} className="overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <button
                      onClick={() => setProfileMember(m)}
                      className="w-9 h-9 rounded-full bg-white border border-gray-600 flex-shrink-0 overflow-hidden hover:ring-2 hover:ring-red-500/50 transition-all"
                    >
                      <img src={m.profileImageUrl || '/logos/mi-icon.jpg'} alt="" className="w-full h-full object-cover" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button onClick={() => setProfileMember(m)} className="text-white font-semibold text-sm hover:text-red-400 transition-colors">{m.name}</button>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${roleInfo.bgColor} ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                        {memberHasAdmin && !adminFixed && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-900/30 text-red-400">
                            🔐 Admin
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5 flex items-center gap-2">
                        <span className="text-orange-400/70 flex-shrink-0">🔥 {m.streak.currentStreak} W</span>
                        <span className="truncate">{m.email}</span>
                      </div>
                      {isOwnerOrAdmin && m.id !== currentUser.id && (
                        <select
                          value={m.role}
                          onChange={e => updateMemberRole(m.id, e.target.value as InstructorRole)}
                          className="mt-1.5 bg-gray-700 border border-gray-600 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-red-500 max-w-[160px]"
                        >
                          {roleOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {canToggleAdmin && (
                        <button
                          onClick={() => updateAdminAccess(m.id, !memberHasAdmin)}
                          className={`text-xs px-2 py-1.5 rounded-lg font-medium transition-all ${
                            memberHasAdmin ? 'bg-red-900/40 text-red-400' : 'bg-gray-700/60 text-gray-400'
                          }`}
                        >
                          {memberHasAdmin ? '🔓' : '🔐'}
                        </button>
                      )}
                      {isOwnerOrAdmin && (
                        <button
                          onClick={() => {
                            if (isSettingsOpen) {
                              setMemberSettingsOpen(null);
                            } else {
                              setMemberSettingsOpen(m.id);
                              setCoreName(m.name);
                              setCoreFirstName(m.firstName ?? '');
                              setCoreLastName(m.lastName ?? '');
                              setCoreBirthDate(m.birthDate ?? '');
                              setCoreMemberId(m.memberId ?? '');
                              setStreakRestoreValue(m.streak.currentStreak);
                              setStreakRestoreReason('');
                              setCoreDataSaveState('idle');
                              setCoreDataPendingClose(false);
                              setStreakSaveState('idle');
                              setStreakPendingClose(false);
                            }
                          }}
                          className={`text-xs px-2 py-1.5 rounded-lg transition-all ${isSettingsOpen ? 'bg-gray-600 text-white' : 'bg-gray-700/60 text-gray-400 hover:text-white hover:bg-gray-600'}`}
                          title="Einstellungen"
                        >
                          ⚙️
                        </button>
                      )}
                    </div>
                  </div>
                  {/* ⚙️ Kombiniertes Settings-Panel */}
                  {isSettingsOpen && (
                    <div className="border-t border-gray-700/50 px-4 py-3 bg-gray-800/30 space-y-4">
                      <p className="text-xs text-gray-400 font-medium">Persönliche Daten · {m.name}</p>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Anzeigename</label>
                          <input type="text" value={coreName} onChange={e => { setCoreName(e.target.value); setCoreDataSaveState('dirty'); setCoreDataPendingClose(false); }} className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Vorname</label>
                            <input type="text" value={coreFirstName} onChange={e => { setCoreFirstName(e.target.value); setCoreDataSaveState('dirty'); setCoreDataPendingClose(false); }} className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Nachname</label>
                            <input type="text" value={coreLastName} onChange={e => { setCoreLastName(e.target.value); setCoreDataSaveState('dirty'); setCoreDataPendingClose(false); }} className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Member ID</label>
                          <input type="text" value={coreMemberId} onChange={e => { setCoreMemberId(e.target.value); setCoreDataSaveState('dirty'); setCoreDataPendingClose(false); }} className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Geburtsdatum</label>
                          <input type="date" value={coreBirthDate} onChange={e => { setCoreBirthDate(e.target.value); setCoreDataSaveState('dirty'); setCoreDataPendingClose(false); }} className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
                        </div>
                      </div>
                      {coreDataPendingClose && (
                        <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg px-3 py-2.5 flex items-center justify-between gap-3">
                          <span className="text-xs text-yellow-400">⚠ Nicht gespeicherte Änderungen</span>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => { setCoreDataPendingClose(false); setCoreDataSaveState('idle'); }} className="text-xs px-2.5 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all">Verwerfen</button>
                            <button onClick={() => { updateMemberCoreData(m.id, { name: coreName || undefined, firstName: coreFirstName, lastName: coreLastName, birthDate: coreBirthDate || undefined, memberId: coreMemberId || undefined }); setCoreDataPendingClose(false); setCoreDataSaveState('saved'); }} className="text-xs px-2.5 py-1 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-all">Speichern</button>
                          </div>
                        </div>
                      )}
                      <button
                        disabled={coreDataSaveState !== 'dirty'}
                        onClick={() => { updateMemberCoreData(m.id, { name: coreName || undefined, firstName: coreFirstName, lastName: coreLastName, birthDate: coreBirthDate || undefined, memberId: coreMemberId || undefined }); setCoreDataSaveState('saved'); }}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                          coreDataSaveState === 'saved' ? 'bg-green-600 text-white cursor-default' :
                          coreDataSaveState === 'dirty' ? 'bg-gray-600 hover:bg-gray-500 text-white' :
                          'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {coreDataSaveState === 'saved' ? '✓ Gespeichert' : 'Daten speichern'}
                      </button>

                      {/* ── Streak ── */}
                      <div className="border-t border-gray-700/50 pt-3 space-y-2">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">🔥 Streak</p>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500 block mb-1">Wochen</label>
                          <input
                            type="number"
                            min={1}
                            max={52}
                            value={streakRestoreValue}
                            onChange={e => { setStreakRestoreValue(Number(e.target.value)); setStreakSaveState('dirty'); setStreakPendingClose(false); }}
                            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div className="flex-[3]">
                          <label className="text-xs text-gray-500 block mb-1">Grund</label>
                          <input
                            type="text"
                            placeholder="z.B. War 4 Wochen im Urlaub"
                            value={streakRestoreReason}
                            onChange={e => { setStreakRestoreReason(e.target.value); setStreakSaveState('dirty'); setStreakPendingClose(false); }}
                            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                      {streakPendingClose && (
                        <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg px-3 py-2.5 flex items-center justify-between gap-3">
                          <span className="text-xs text-yellow-400">⚠ Nicht gespeicherte Änderungen</span>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => { setStreakPendingClose(false); setStreakSaveState('idle'); }} className="text-xs px-2.5 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all">Verwerfen</button>
                            <button onClick={() => { if (!streakRestoreReason.trim()) return; restoreStreak(m.id, streakRestoreValue, streakRestoreReason); setStreakPendingClose(false); setStreakSaveState('saved'); }} className="text-xs px-2.5 py-1 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-all">Speichern</button>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          disabled={streakSaveState !== 'dirty'}
                          onClick={() => {
                            if (!streakRestoreReason.trim()) return;
                            restoreStreak(m.id, streakRestoreValue, streakRestoreReason);
                            setStreakSaveState('saved');
                          }}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                            streakSaveState === 'saved' ? 'bg-green-600 text-white cursor-default' :
                            streakSaveState === 'dirty' ? 'bg-orange-600 hover:bg-orange-500 text-white' :
                            'bg-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {streakSaveState === 'saved' ? '✓ Gespeichert' : `Streak auf ${streakRestoreValue}W setzen`}
                        </button>
                      </div>
                      </div>

                      {/* Schließen */}
                      <button
                        onClick={() => { setMemberSettingsOpen(null); setCoreDataSaveState('idle'); setStreakSaveState('idle'); setStreakPendingClose(false); setCoreDataPendingClose(false); }}
                        className="w-full py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 bg-gray-800 hover:bg-gray-700 transition-all"
                      >
                        Schließen
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
              </div>
              )}
            </div>
          </div>
        )}


        {/* ── BEWERBUNGEN ─────────────────────────────────────────────── */}
        {adminSubTab === 'bewerbungen' && (
          <div className="space-y-6">
            {totalPendingApps === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-3">✅</div>
                <p>Keine offenen Bewerbungen</p>
              </div>
            ) : (
              <div className="space-y-8">
                {pendingContactApps.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-red-400 font-bold flex items-center gap-2">
                      ☠️ Contact Ready ({pendingContactApps.length})
                    </h4>
                    {pendingContactApps.map(member => {
                      const app = member.contactApplication!;
                      return (
                        <div key={member.id} className="bg-gradient-to-r from-gray-900 to-red-900/30 rounded-xl p-6 border border-red-700">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl">{member.avatar}</span>
                            <div>
                              <div className="text-xl font-bold text-white">{member.name}</div>
                              <div className="text-gray-400">{LEVEL_DISPLAY[member.currentLevel].subtitle}</div>
                            </div>
                          </div>
                          <div className="space-y-3 mb-6">
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <div className="text-gray-400 text-sm">Motivation</div>
                              <div className="text-white">{app.answers.motivation}</div>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <div className="text-gray-400 text-sm">Erfahrung</div>
                              <div className="text-white">{app.answers.experience}</div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => approveContactApplication(member.id, 'Angenommen')} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">✅ Annehmen</button>
                            <button onClick={() => rejectContactApplication(member.id, 'Abgelehnt')} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">❌ Ablehnen</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {pendingInstructorApps.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-yellow-400 font-bold flex items-center gap-2">
                      🎓 Assistant Instructor ({pendingInstructorApps.length})
                    </h4>
                    {pendingInstructorApps.map(member => {
                      const app = member.assistantInstructorApplication!;
                      return (
                        <div key={member.id} className="bg-gradient-to-r from-gray-900 to-yellow-900/30 rounded-xl p-6 border border-yellow-700">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl">{member.avatar}</span>
                            <div>
                              <div className="text-xl font-bold text-white">{member.name}</div>
                              <div className="text-gray-400">{LEVEL_DISPLAY[member.currentLevel].subtitle}</div>
                            </div>
                          </div>
                          <div className="space-y-3 mb-6">
                            {[
                              ['Warum Instructor werden?', app.answers.motivation],
                              ['Unterrichtserfahrung', app.answers.teachingExperience],
                              ['Stärken & Schwächen', app.answers.strengthsWeaknesses],
                              ['Verfügbarkeit', app.answers.availability],
                              ['Ziele als Instructor', app.answers.goals],
                              ['Guter Instructor?', app.answers.roleModel],
                            ].map(([q, a]) => (
                              <div key={q} className="bg-gray-800/50 rounded-lg p-3">
                                <div className="text-gray-400 text-xs mb-1">{q}</div>
                                <div className="text-white text-sm">{a}</div>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => approveInstructorApplication(member.id, 'Willkommen im Team!')} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">✅ Annehmen</button>
                            <button onClick={() => rejectInstructorApplication(member.id, 'Noch nicht bereit.')} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">❌ Ablehnen</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TRAINING ────────────────────────────────────────────────── */}
        {adminSubTab === 'verwaltung' && verwaltungSubTab === 'training' && (() => {
          // ── Content editor helpers ──
          const selectedModule = contentModuleId ? MODULES.find(m => m.id === contentModuleId) : null;
          const moduleTechniques = contentModuleId ? getTechniquesForModule(contentModuleId) : [];
          const moduleQuestions = contentModuleId ? getQuizQuestionsForModule(contentModuleId) : [];

          const openEditTechnique = (id: string, name = '', desc = '') => {
            setEditingTechniqueId(id);
            setTechEditName(name);
            setTechEditDesc(desc);
          };

          const handleSaveTechnique = async () => {
            if (!contentModuleId || !techEditName.trim()) return;
            const selectedMod = MODULES.find(m => m.id === contentModuleId);
            if (!selectedMod) return;
            const isNew = editingTechniqueId === 'new';
            const id = isNew ? `t-${contentModuleId}-${Date.now()}` : editingTechniqueId!;
            const maxPos = isNew ? moduleTechniques.length : (moduleTechniques.find(t => t.id === id)?.position ?? moduleTechniques.length);
            await saveTechnique({ id, moduleId: contentModuleId, name: techEditName.trim(), description: techEditDesc.trim(), isRequired: true, position: maxPos });
            setEditingTechniqueId(null);
          };

          const handleDeleteTechnique = async (id: string) => {
            if (!confirm('Technik wirklich löschen?')) return;
            await deleteTechnique(id);
          };

          const openEditQuestion = (id: string, question = '', options = ['', '', '', ''], correctIndex = 0, explanation = '') => {
            setEditingQuestionId(id);
            setQEditQuestion(question);
            setQEditOptions([...options, '', '', '', ''].slice(0, 4));
            setQEditCorrectIndex(correctIndex);
            setQEditExplanation(explanation);
          };

          const handleSaveQuestion = async () => {
            if (!contentModuleId || !qEditQuestion.trim()) return;
            const isNew = editingQuestionId === 'new';
            const id = isNew ? undefined : editingQuestionId ?? undefined;
            const maxPos = isNew ? moduleQuestions.length : (moduleQuestions.find(q => q.id === id)?.position ?? moduleQuestions.length);
            await saveQuizQuestion({ id: id ?? '', moduleId: contentModuleId, question: qEditQuestion.trim(), options: qEditOptions.map(o => o.trim()), correctIndex: qEditCorrectIndex, explanation: qEditExplanation.trim(), position: maxPos });
            setEditingQuestionId(null);
          };

          const handleDeleteQuestion = async (id: string) => {
            if (!confirm('Frage wirklich löschen?')) return;
            await deleteQuizQuestion(id);
          };

          const handleBulkImport = async () => {
            if (!contentModuleId) return;
            const lines = bulkImportText.split('\n').map(l => l.trim()).filter(Boolean);
            const startPos = moduleTechniques.length;
            for (let i = 0; i < lines.length; i++) {
              const [namePart, ...descParts] = lines[i].split(':');
              const name = namePart.trim();
              const desc = descParts.join(':').trim();
              if (!name) continue;
              await saveTechnique({ id: `t-${contentModuleId}-${Date.now()}-${i}`, moduleId: contentModuleId, name, description: desc, isRequired: true, position: startPos + i });
            }
            setBulkImportText('');
            setShowBulkImport(false);
          };

          // Quiz CSV-Import: Frage[sep]A[sep]B[sep]C[sep]D[sep]Richtige(0-3|A-D)[sep]Erklärung
          const parseQuizBulk = (raw: string) => {
            return raw
              .split('\n')
              .map(l => l.trim())
              .filter(Boolean)
              .map(line => {
                // Tab (Excel) oder Semikolon als Trennzeichen
                const sep = line.includes('\t') ? '\t' : ';';
                const parts = line.split(sep).map(p => p.trim());
                if (parts.length < 6) return null;
                const [question, a, b, c, d, rawCorrect, ...explanationParts] = parts;
                const options = [a, b, c, d];
                if (!question || options.some(o => !o)) return null;
                let correctIndex = parseInt(rawCorrect, 10);
                if (isNaN(correctIndex)) {
                  // A/B/C/D → 0/1/2/3
                  correctIndex = 'ABCD'.indexOf(rawCorrect.toUpperCase());
                }
                if (correctIndex < 0 || correctIndex > 3) return null;
                return { question, options, correctIndex, explanation: explanationParts.join(sep).trim() };
              })
              .filter((q): q is NonNullable<typeof q> => q !== null);
          };

          const handleQuizBulkPreview = () => {
            setQuizBulkPreview(parseQuizBulk(quizBulkImportText));
          };

          const handleQuizBulkImport = async () => {
            if (!contentModuleId) return;
            const parsed = parseQuizBulk(quizBulkImportText);
            const startPos = moduleQuestions.length;
            for (let i = 0; i < parsed.length; i++) {
              await saveQuizQuestion({ id: '', moduleId: contentModuleId, ...parsed[i], position: startPos + i });
            }
            setQuizBulkImportText('');
            setQuizBulkPreview([]);
            setShowQuizBulkImport(false);
          };

          const handleQuizCountChange = async (val: number) => {
            if (!contentModuleId) return;
            setContentQuizCount(val);
            await saveModuleSettings(contentModuleId, val);
          };

          const TrainingAccordionHeader = ({ id, title, subtitle, onBeforeClose }: { id: string; title: string; subtitle: string; onBeforeClose?: () => boolean }) => (
            <button
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700/20 transition-all"
              onClick={() => {
                if (plattformOpen[id] && onBeforeClose && !onBeforeClose()) return;
                togglePlattform(id);
              }}
            >
              <div className="text-left">
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>
              </div>
              <span className="text-gray-500 text-xs ml-3 flex-shrink-0">{plattformOpen[id] ? '▲' : '▼'}</span>
            </button>
          );

          const TrainingUnsavedWarning = ({ onDiscard, onSave }: { onDiscard: () => void; onSave: () => void }) => (
            <div className="mb-3 bg-yellow-900/20 border border-yellow-700/40 rounded-lg px-3 py-2.5 flex items-center justify-between gap-3">
              <span className="text-xs text-yellow-400">⚠ Nicht gespeicherte Änderungen</span>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={onDiscard} className="text-xs px-2.5 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all">Verwerfen</button>
                <button onClick={onSave} className="text-xs px-2.5 py-1 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-all">Speichern</button>
              </div>
            </div>
          );

          return (
          <div className="space-y-3">
            {/* ── Modul-Reihenfolge ── */}
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
              <TrainingAccordionHeader id="training_reihenfolge" title="Modul-Reihenfolge" subtitle="▲▼ Reihenfolge ändern · Block-Zuordnung via Dropdown."
                onBeforeClose={() => {
                  if (dndSaveState === 'dirty') { setDndPendingClose(true); return false; }
                  setDndSaveState('idle'); setDndPendingClose(false); return true;
                }}
              />
              {plattformOpen['training_reihenfolge'] && (
              <div className="border-t border-gray-700/50 p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-xs">▲▼ Reihenfolge innerhalb eines Blocks · Block via Dropdown ändern.</span>
                <button
                  disabled={dndSaveState !== 'dirty'}
                  onClick={handleSave}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    dndSaveState === 'saved' ? 'bg-green-700/40 text-green-400 cursor-default' :
                    dndSaveState === 'dirty' ? 'bg-red-600 hover:bg-red-500 text-white' :
                    'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {dndSaveState === 'saved' ? '✓ Gespeichert' : 'Speichern'}
                </button>
              </div>

              {dndPendingClose && <TrainingUnsavedWarning
                onDiscard={() => { setDndPendingClose(false); setDndSaveState('idle'); togglePlattform('training_reihenfolge'); }}
                onSave={() => { handleSave(); togglePlattform('training_reihenfolge'); }}
              />}
              {BLOCKS.filter(b => b.level !== 'assistant_instructor' && b.level !== 'instructor_level' && (!b.adminOnly || currentUser?.role === 'admin')).map(block => {
                const blockModules = getModulesForBlock(block.level);
                return (
                <div
                  key={block.id}
                  className={`rounded-xl border ${block.borderColor} ${block.bgColor} p-3 mb-2`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span>{block.icon}</span>
                    <span className={`font-bold text-sm ${block.color}`}>{block.name}</span>
                    <span className="text-gray-500 text-xs">({blockModules.length})</span>
                  </div>
                  <div className="space-y-0.5">
                    {blockModules.map((module, moduleIdx) => (
                      <div
                        key={module.id}
                        className="flex items-center gap-2 bg-gray-900/60 rounded-lg px-2 py-1.5 border border-gray-700/40"
                      >
                        {/* ▲▼ Reihenfolge */}
                        <div className="flex flex-col gap-0">
                          <button
                            onClick={() => handleMoveUp(module.id, block.level)}
                            disabled={moduleIdx === 0}
                            className="text-gray-500 hover:text-gray-200 disabled:opacity-20 disabled:cursor-not-allowed text-[10px] leading-none px-1 py-0.5 transition-colors"
                          >▲</button>
                          <button
                            onClick={() => handleMoveDown(module.id, block.level)}
                            disabled={moduleIdx === blockModules.length - 1}
                            className="text-gray-500 hover:text-gray-200 disabled:opacity-20 disabled:cursor-not-allowed text-[10px] leading-none px-1 py-0.5 transition-colors"
                          >▼</button>
                        </div>
                        <span className="text-base flex-shrink-0">{module.icon}</span>
                        <span className="text-gray-200 text-sm flex-1 truncate">{getModuleName(module.id)}</span>
                        <select
                          value={block.level}
                          onChange={e => handleBlockChange(module.id, e.target.value)}
                          className="bg-gray-700 border border-gray-600 text-gray-300 text-xs rounded px-1.5 py-1 focus:outline-none"
                        >
                          {BLOCKS.filter(b => b.level !== 'assistant_instructor' && b.level !== 'instructor_level' && (!b.adminOnly || currentUser?.role === 'admin')).map(b => (
                            <option key={b.level} value={b.level}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                    {blockModules.length === 0 && (
                      <div className="text-center text-gray-600 text-xs py-4 border border-dashed border-gray-700/40 rounded-lg">Leer — Block via Dropdown zuweisen</div>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
            )}
            </div>

            {/* ── Modul-Inhalt bearbeiten ── */}
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
              <TrainingAccordionHeader id="training_inhalt" title="Modul-Inhalt bearbeiten" subtitle="Techniken und Quiz-Fragen pro Modul pflegen." />
              {plattformOpen['training_inhalt'] && (
              <div className="border-t border-gray-700/50 p-3">

              {/* Modul-Auswahl */}
              <div className="flex flex-wrap gap-2 mb-4">
                {MODULES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setContentModuleId(m.id); setEditingTechniqueId(null); setEditingQuestionId(null); setShowBulkImport(false); setContentQuizCount(getQuizCountForModule(m.id)); }}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      contentModuleId === m.id ? 'bg-gray-600 border-gray-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                    }`}
                  >
                    {m.icon} {getModuleName(m.id)}
                  </button>
                ))}
              </div>

              {/* Editor Panel */}
              {selectedModule && (
                <div className="space-y-3">
                  {/* Modulname & Subtitle bearbeiten */}
                  <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50 space-y-2">
                    {/* Name */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg flex-shrink-0">{selectedModule.icon}</span>
                      <input
                        type="text"
                        value={moduleNameOverrides[selectedModule.id] ?? selectedModule.name}
                        onChange={e => saveModuleName(selectedModule.id, e.target.value)}
                        placeholder={selectedModule.name}
                        className="flex-1 bg-gray-800 text-white text-sm font-semibold rounded-lg px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-gray-500"
                      />
                      {moduleNameOverrides[selectedModule.id] && moduleNameOverrides[selectedModule.id] !== selectedModule.name && (
                        <button
                          onClick={() => saveModuleName(selectedModule.id, selectedModule.name)}
                          className="text-xs text-gray-500 hover:text-gray-300 flex-shrink-0"
                          title="Zurücksetzen"
                        >↩</button>
                      )}
                    </div>
                    {/* Subtitle */}
                    <div className="flex items-center gap-2 pl-7">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest flex-shrink-0 w-12">Unter­titel</span>
                      <input
                        type="text"
                        value={moduleSubtitleOverrides[selectedModule.id] ?? selectedModule.subtitle ?? ''}
                        onChange={e => saveModuleSubtitle(selectedModule.id, e.target.value)}
                        placeholder={selectedModule.subtitle ?? 'Untertitel…'}
                        className="flex-1 bg-gray-800 text-gray-300 text-xs rounded-lg px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-gray-500"
                      />
                      {moduleSubtitleOverrides[selectedModule.id] !== undefined && moduleSubtitleOverrides[selectedModule.id] !== (selectedModule.subtitle ?? '') && (
                        <button
                          onClick={() => saveModuleSubtitle(selectedModule.id, selectedModule.subtitle ?? '')}
                          className="text-xs text-gray-500 hover:text-gray-300 flex-shrink-0"
                          title="Zurücksetzen"
                        >↩</button>
                      )}
                    </div>
                  </div>

                  {/* Sub-Tab */}
                  <div className="flex bg-gray-900/50 rounded-lg p-0.5 gap-0.5">
                    {(['techniques', 'quiz', 'theorie'] as const).map(tab => (
                      <button key={tab} onClick={() => setContentSubTab(tab)} className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${contentSubTab === tab ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                        {tab === 'techniques' ? `🥋 Techniken (${moduleTechniques.length})` : tab === 'quiz' ? `📝 Quiz (${moduleQuestions.length})` : '📖 Theorie'}
                      </button>
                    ))}
                  </div>

                  {/* ── TECHNIKEN ── */}
                  {contentSubTab === 'techniques' && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button onClick={() => openEditTechnique('new')} className="flex-1 text-xs bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg">+ Neue Technik</button>
                        <button onClick={() => setShowBulkImport(v => !v)} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-3 rounded-lg">Bulk</button>
                      </div>

                      {showBulkImport && (
                        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700 space-y-2">
                          <p className="text-gray-500 text-xs">Eine Technik pro Zeile. Format: <span className="text-gray-300">Name: Beschreibung</span></p>
                          <textarea value={bulkImportText} onChange={e => setBulkImportText(e.target.value)} rows={5} placeholder={"Richtige Stellung: Die fundamentale Kampfstellung\nGuard Position: Schutzhaltung\n..."} className="w-full bg-gray-800 text-white text-xs rounded px-2 py-2 border border-gray-600 resize-none font-mono" />
                          <div className="flex gap-2">
                            <button onClick={handleBulkImport} className="flex-1 text-xs bg-green-700 hover:bg-green-600 text-white py-1.5 rounded-lg">Importieren</button>
                            <button onClick={() => { setShowBulkImport(false); setBulkImportText(''); }} className="text-xs text-gray-400 py-1.5 px-3">Abbrechen</button>
                          </div>
                        </div>
                      )}

                      {editingTechniqueId === 'new' && (
                        <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600 space-y-2">
                          <input value={techEditName} onChange={e => setTechEditName(e.target.value)} placeholder="Technik-Name *" className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-600 outline-none focus:border-red-500" />
                          <textarea value={techEditDesc} onChange={e => setTechEditDesc(e.target.value)} placeholder="Beschreibung (optional)" rows={2} className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-600 outline-none focus:border-red-500 resize-none" />
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingTechniqueId(null)} className="text-xs text-gray-400 px-3 py-1">Abbrechen</button>
                            <button onClick={handleSaveTechnique} className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded">Speichern</button>
                          </div>
                        </div>
                      )}

                      {moduleTechniques.map(t => (
                        editingTechniqueId === t.id ? (
                          <div key={t.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600 space-y-2">
                            <input value={techEditName} onChange={e => setTechEditName(e.target.value)} placeholder="Technik-Name *" className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-600 outline-none focus:border-red-500" />
                            <textarea value={techEditDesc} onChange={e => setTechEditDesc(e.target.value)} placeholder="Beschreibung (optional)" rows={2} className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-600 outline-none focus:border-red-500 resize-none" />
                            <div className="flex gap-2 justify-between">
                              <button onClick={() => handleDeleteTechnique(t.id)} className="text-xs bg-red-900/50 hover:bg-red-800 text-red-400 px-3 py-1 rounded">Löschen</button>
                              <div className="flex gap-2">
                                <button onClick={() => setEditingTechniqueId(null)} className="text-xs text-gray-400 px-3 py-1">Abbrechen</button>
                                <button onClick={handleSaveTechnique} className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded">Speichern</button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div key={t.id} className="flex items-start gap-2 bg-gray-800/50 rounded-lg px-3 py-2.5 group border border-gray-700/30 hover:border-gray-600/50">
                            <div className="flex-1 min-w-0">
                              <div className="text-gray-200 text-sm">{t.name}</div>
                              {t.description && <div className="text-gray-500 text-xs mt-0.5 leading-relaxed">{t.description}</div>}
                            </div>
                            <button onClick={() => openEditTechnique(t.id, t.name, t.description)} className="text-gray-500 hover:text-white text-xs flex-shrink-0 mt-0.5 transition-colors">✏️</button>
                          </div>
                        )
                      ))}

                      {moduleTechniques.length === 0 && editingTechniqueId !== 'new' && (
                        <div className="text-gray-600 text-xs text-center py-4 border border-dashed border-gray-700/40 rounded-lg">Noch keine Techniken — füge die erste hinzu.</div>
                      )}
                    </div>
                  )}

                  {/* ── QUIZ ── */}
                  {contentSubTab === 'quiz' && (
                    <div className="space-y-2">
                      {/* Quiz-Einstellungen */}
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-gray-300 text-xs font-semibold">Fragen pro Sitzung</div>
                          <div className="text-gray-600 text-xs">{moduleQuestions.length} im Pool</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleQuizCountChange(Math.max(1, (contentModuleId ? getQuizCountForModule(contentModuleId) : contentQuizCount) - 1))} className="w-7 h-7 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">−</button>
                          <span className="text-white font-bold w-8 text-center">{contentModuleId ? getQuizCountForModule(contentModuleId) : contentQuizCount}</span>
                          <button onClick={() => handleQuizCountChange(Math.min(moduleQuestions.length || 50, (contentModuleId ? getQuizCountForModule(contentModuleId) : contentQuizCount) + 1))} className="w-7 h-7 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">+</button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => openEditQuestion('new')} className="flex-1 text-xs bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg">+ Neue Frage</button>
                        <button onClick={() => { setShowQuizBulkImport(v => !v); setQuizBulkPreview([]); setQuizBulkImportText(''); }} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-3 rounded-lg">Bulk</button>
                      </div>

                      {showQuizBulkImport && (
                        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700 space-y-2">
                          <p className="text-gray-500 text-xs leading-relaxed">
                            Aus Excel einfügen oder manuell eingeben.<br />
                            Format pro Zeile: <span className="text-gray-300 font-mono">Frage; A; B; C; D; Richtige(0-3); Erklärung</span><br />
                            Tab-getrennt (direktes Excel-Kopieren) wird automatisch erkannt.
                          </p>
                          <textarea
                            value={quizBulkImportText}
                            onChange={e => { setQuizBulkImportText(e.target.value); setQuizBulkPreview([]); }}
                            rows={6}
                            placeholder={"Was ist die Centerline-Theorie?;Abstand halten;Die direkte Linie zum Gegner;Seitliche Bewegung;Atem-Kontrolle;1;Die Centerline verbindet...\nWelche Kampfstellung nutzt JKD?;Neutral;Fighting Stance;Boxer Guard;Sumo;1;"}
                            className="w-full bg-gray-800 text-white text-xs rounded px-2 py-2 border border-gray-600 resize-none font-mono focus:outline-none focus:border-gray-500"
                          />

                          {/* Vorschau */}
                          {quizBulkPreview.length > 0 && (
                            <div className="space-y-1.5">
                              <div className="text-gray-400 text-xs font-semibold">{quizBulkPreview.length} Fragen erkannt:</div>
                              {quizBulkPreview.slice(0, 3).map((q, i) => (
                                <div key={i} className="bg-gray-800 rounded px-2 py-1.5 border border-gray-700">
                                  <div className="text-gray-200 text-xs truncate">{q.question}</div>
                                  <div className="text-gray-500 text-xs">✓ {q.options[q.correctIndex]}</div>
                                </div>
                              ))}
                              {quizBulkPreview.length > 3 && (
                                <div className="text-gray-600 text-xs">… und {quizBulkPreview.length - 3} weitere</div>
                              )}
                            </div>
                          )}

                          <div className="flex gap-2">
                            {quizBulkPreview.length === 0 ? (
                              <button onClick={handleQuizBulkPreview} disabled={!quizBulkImportText.trim()} className="flex-1 text-xs bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 text-white py-1.5 rounded-lg">Vorschau</button>
                            ) : (
                              <button onClick={handleQuizBulkImport} className="flex-1 text-xs bg-green-700 hover:bg-green-600 text-white py-1.5 rounded-lg">
                                {quizBulkPreview.length} Fragen importieren
                              </button>
                            )}
                            <button onClick={() => { setShowQuizBulkImport(false); setQuizBulkImportText(''); setQuizBulkPreview([]); }} className="text-xs text-gray-400 py-1.5 px-3">Abbrechen</button>
                          </div>
                        </div>
                      )}

                      {editingQuestionId === 'new' && (
                        <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600 space-y-2">
                          <textarea value={qEditQuestion} onChange={e => setQEditQuestion(e.target.value)} placeholder="Frage *" rows={2} className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-600 outline-none focus:border-red-500 resize-none" />
                          {qEditOptions.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <button onClick={() => setQEditCorrectIndex(i)} className={`w-6 h-6 rounded-full border-2 flex-shrink-0 text-xs font-bold transition-all ${i === qEditCorrectIndex ? 'bg-green-500 border-green-500 text-white' : 'border-gray-500 text-gray-500'}`}>{String.fromCharCode(65 + i)}</button>
                              <input value={opt} onChange={e => { const o = [...qEditOptions]; o[i] = e.target.value; setQEditOptions(o); }} placeholder={`Option ${String.fromCharCode(65 + i)}`} className="flex-1 bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-600 outline-none focus:border-red-500" />
                            </div>
                          ))}
                          <input value={qEditExplanation} onChange={e => setQEditExplanation(e.target.value)} placeholder="Erklärung nach der Antwort (optional)" className="w-full bg-gray-800 text-gray-300 text-sm rounded px-2 py-1.5 border border-gray-600 outline-none focus:border-gray-500" />
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingQuestionId(null)} className="text-xs text-gray-400 px-3 py-1">Abbrechen</button>
                            <button onClick={handleSaveQuestion} className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded">Speichern</button>
                          </div>
                        </div>
                      )}

                      {moduleQuestions.map((q, idx) => (
                        editingQuestionId === q.id ? (
                          <div key={q.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600 space-y-2">
                            <div className="text-gray-500 text-xs">Frage {idx + 1}</div>
                            <textarea value={qEditQuestion} onChange={e => setQEditQuestion(e.target.value)} rows={2} className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-600 outline-none focus:border-red-500 resize-none" />
                            {qEditOptions.map((opt, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <button onClick={() => setQEditCorrectIndex(i)} className={`w-6 h-6 rounded-full border-2 flex-shrink-0 text-xs font-bold transition-all ${i === qEditCorrectIndex ? 'bg-green-500 border-green-500 text-white' : 'border-gray-500 text-gray-500'}`}>{String.fromCharCode(65 + i)}</button>
                                <input value={opt} onChange={e => { const o = [...qEditOptions]; o[i] = e.target.value; setQEditOptions(o); }} className="flex-1 bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-600 outline-none focus:border-red-500" />
                              </div>
                            ))}
                            <input value={qEditExplanation} onChange={e => setQEditExplanation(e.target.value)} placeholder="Erklärung (optional)" className="w-full bg-gray-800 text-gray-300 text-sm rounded px-2 py-1.5 border border-gray-600 outline-none" />
                            <div className="flex gap-2 justify-between">
                              <button onClick={() => handleDeleteQuestion(q.id)} className="text-xs bg-red-900/50 hover:bg-red-800 text-red-400 px-3 py-1 rounded">Löschen</button>
                              <div className="flex gap-2">
                                <button onClick={() => setEditingQuestionId(null)} className="text-xs text-gray-400 px-3 py-1">Abbrechen</button>
                                <button onClick={handleSaveQuestion} className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded">Speichern</button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div key={q.id} className="flex items-start gap-2 bg-gray-800/50 rounded-lg px-3 py-2.5 group border border-gray-700/30 hover:border-gray-600/50">
                            <div className="flex-1 min-w-0">
                              <div className="text-gray-200 text-sm leading-relaxed">{q.question}</div>
                              <div className="text-gray-500 text-xs mt-0.5">✓ {q.options?.[q.correctIndex ?? 0]}</div>
                            </div>
                            <button onClick={() => openEditQuestion(q.id, q.question, q.options ?? [], q.correctIndex ?? 0, q.explanation ?? '')} className="text-gray-500 hover:text-white text-xs flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">✏️</button>
                          </div>
                        )
                      ))}

                      {moduleQuestions.length === 0 && editingQuestionId !== 'new' && (
                        <div className="text-gray-600 text-xs text-center py-4 border border-dashed border-gray-700/40 rounded-lg">Noch keine Fragen — füge die erste hinzu.</div>
                      )}
                    </div>
                  )}

                  {/* ── THEORIE ── */}
                  {contentSubTab === 'theorie' && (() => {
                    const moduleTopicsList = getTopicsForModule(contentModuleId ?? '');
                    if (moduleTopicsList.length === 0) {
                      return (
                        <div className="text-gray-600 text-xs text-center py-6 border border-dashed border-gray-700/40 rounded-lg">
                          Für dieses Modul sind noch keine Theorie-Abschnitte definiert.
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-3">
                        <p className="text-gray-500 text-xs">Bearbeite die Theorie-Texte der einzelnen Abschnitte. Änderungen sind sofort für alle Member sichtbar.</p>
                        {moduleTopicsList.map(topic => {
                          const overrideKey = `${contentModuleId}:${topic.id}`;
                          const currentText = topicOverrides[overrideKey] ?? topic.theoryText;
                          const isEditing = editingQuestionId === overrideKey;
                          const topicFlags = getTheoryFlags().filter(f => f.moduleId === contentModuleId && f.topicId === topic.id);
                          return (
                            <div key={topic.id} className="bg-gray-900/50 rounded-lg border border-gray-700/50 overflow-hidden">
                              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700/50">
                                <span>{topic.icon}</span>
                                <span className="text-white text-xs font-semibold flex-1">{topic.title}</span>
                                {topicFlags.length > 0 && (
                                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded">
                                    🚩 {topicFlags.length}
                                  </span>
                                )}
                                <button
                                  onClick={() => setEditingQuestionId(isEditing ? null : overrideKey)}
                                  className="text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded"
                                >
                                  {isEditing ? 'Schließen' : 'Bearbeiten'}
                                </button>
                                {topicOverrides[overrideKey] && (
                                  <button
                                    onClick={() => updateTopicText(overrideKey, topic.theoryText)}
                                    className="text-xs text-orange-400 hover:text-orange-300 px-2 py-0.5 rounded"
                                    title="Standard-Text wiederherstellen"
                                  >
                                    Reset
                                  </button>
                                )}
                              </div>
                              {topicFlags.length > 0 && (
                                <div className="px-3 py-2 space-y-1.5 border-b border-gray-700/50 bg-orange-500/5">
                                  {topicFlags.map(flag => (
                                    <div key={flag.id} className="flex items-start gap-2 text-xs">
                                      <span className="text-orange-400 flex-shrink-0">🚩</span>
                                      <div className="flex-1 min-w-0">
                                        <span className="text-gray-400">{flag.memberName}</span>
                                        <span className="text-gray-600 mx-1">·</span>
                                        <span className="text-gray-300">{flag.comment}</span>
                                      </div>
                                      <button onClick={() => dismissTheoryFlag(flag.id)} className="text-gray-600 hover:text-gray-400 flex-shrink-0">✕</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {isEditing ? (
                                <div className="p-2 space-y-2">
                                  <textarea
                                    value={currentText}
                                    onChange={e => updateTopicText(overrideKey, e.target.value)}
                                    rows={12}
                                    className="w-full bg-gray-800 text-gray-200 text-xs rounded px-2 py-2 border border-gray-600 resize-y font-mono leading-relaxed"
                                  />
                                  <p className="text-gray-600 text-[10px]">Formatierung: ## Überschrift 1, ### Überschrift 2, **fett**, - Liste, --- Trennlinie</p>
                                </div>
                              ) : (
                                <p className="text-gray-600 text-xs px-3 py-2 line-clamp-2">{currentText.slice(0, 100)}…</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                </div>
              )}

              {!selectedModule && (
                <div className="text-gray-600 text-xs text-center py-6 border border-dashed border-gray-700/40 rounded-lg">Wähle ein Modul oben aus, um Inhalte zu bearbeiten.</div>
              )}
              </div>
              )}
            </div>

            {/* ── Quiz-Fragen: Flag-System ── */}
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
              <TrainingAccordionHeader id="training_flags" title="🚩 Gemeldete Fragen" subtitle={`${flaggedQuestions.length + getTheoryFlags().length} Meldung${(flaggedQuestions.length + getTheoryFlags().length) !== 1 ? 'en' : ''} offen · Flag-System verwalten`} />
              {plattformOpen['training_flags'] && (
              <div className="border-t border-gray-700/50 p-3 space-y-4">

                {/* Flag-System Toggle */}
                <div className="flex items-center justify-between bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                  <div>
                    <div className="text-white font-semibold text-sm">Flag-System</div>
                    <div className="text-gray-500 text-xs">Mitglieder können Fragen als fehlerhaft melden</div>
                  </div>
                  <button
                    onClick={() => toggleFlagSystem(!flagSystemEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-all ${flagSystemEnabled ? 'bg-red-600' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${flagSystemEnabled ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>

                {/* Gemeldete Fragen */}
                {flaggedQuestions.length === 0 ? (
                  <div className="text-center text-gray-600 text-sm py-4">Keine offenen Meldungen</div>
                ) : (
                  <div className="space-y-3">
                    {flaggedQuestions.map(flag => {
                      const moduleQuestions = getQuizQuestionsForModule(flag.moduleId);
                      const q = moduleQuestions.find(qq => qq.id === flag.questionId);
                      const override = questionOverrides[flag.questionId] ?? {};
                      const module = MODULES.find(m => m.id === flag.moduleId);
                      return (
                        <div key={`${flag.questionId}-${flag.flaggedBy}`} className="bg-gray-900/60 rounded-xl border border-red-500/30 p-4 space-y-3">
                          {/* Flag-Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1">
                                {module?.icon} {module?.name} · {flag.flaggedByName} · {new Date(flag.flaggedAt).toLocaleDateString('de-DE')}
                              </div>
                              <div className="text-white text-sm font-medium leading-snug">
                                {q?.question ?? <span className="text-gray-500 italic">Frage nicht gefunden</span>}
                              </div>
                            </div>
                          </div>

                          {/* Kommentar */}
                          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-sm text-red-300 leading-snug">
                            💬 "{flag.comment}"
                          </div>

                          {/* Aktuelle Antwort */}
                          {q && (
                            <div className="text-xs text-gray-500 space-y-1">
                              {q.type === 'matching' ? (
                                q.pairs?.map((p, i) => (
                                  <div key={i} className="flex gap-2"><span className="text-gray-400">{p.left}</span><span>→</span><span className="text-gray-400">{p.right}</span></div>
                                ))
                              ) : q.type === 'multiple' ? (
                                <div>Korrekt: {q.correctIndices?.map(i => q.options?.[i]).filter(Boolean).join(', ')}</div>
                              ) : (
                                <div>Korrekte Antwort: <span className="text-gray-300">{q.options?.[q.correctIndex ?? 0] ?? '–'}</span></div>
                              )}
                            </div>
                          )}

                          {/* Quick-Edit: Erklärung */}
                          {q && (
                            <div className="space-y-2">
                              <div className="text-xs text-gray-500 font-medium">Erklärung (Override):</div>
                              <textarea
                                defaultValue={override.explanation ?? q.explanation ?? ''}
                                onBlur={e => {
                                  const val = e.target.value.trim();
                                  if (val !== (q.explanation ?? '')) editQuestionOverride(flag.questionId, { explanation: val });
                                }}
                                rows={2}
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white resize-none focus:outline-none focus:border-yellow-500"
                              />
                            </div>
                          )}

                          {/* Inline-Edit: Frage + Antworten + Erklärung */}
                          {editingFlagId === flag.questionId && q && (
                            <div className="space-y-2 pt-1 border-t border-gray-700/50">
                              <textarea
                                value={flagEditQuestion}
                                onChange={e => setFlagEditQuestion(e.target.value)}
                                placeholder="Frage"
                                rows={2}
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white resize-none focus:outline-none focus:border-red-500"
                              />
                              {q.type !== 'truefalse' && q.type !== 'matching' && (
                                <div className="space-y-1">
                                  {flagEditOptions.map((opt, oi) => (
                                    <div key={oi} className="flex items-center gap-2">
                                      <input
                                        type="radio"
                                        checked={flagEditCorrectIndex === oi}
                                        onChange={() => setFlagEditCorrectIndex(oi)}
                                        className="accent-red-500 flex-shrink-0"
                                      />
                                      <input
                                        value={opt}
                                        onChange={e => { const o = [...flagEditOptions]; o[oi] = e.target.value; setFlagEditOptions(o); }}
                                        placeholder={`Antwort ${oi + 1}`}
                                        className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-red-500"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              <textarea
                                value={flagEditExplanation}
                                onChange={e => setFlagEditExplanation(e.target.value)}
                                placeholder="Erklärung"
                                rows={2}
                                className="w-full bg-gray-800 border border-yellow-600/40 rounded-lg px-3 py-2 text-xs text-white resize-none focus:outline-none focus:border-yellow-500"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={async () => {
                                    await saveQuizQuestion({ id: flag.questionId, moduleId: flag.moduleId, question: flagEditQuestion.trim(), options: q.type !== 'truefalse' && q.type !== 'matching' ? flagEditOptions.map(o => o.trim()) : q.options, correctIndex: q.type !== 'truefalse' && q.type !== 'matching' ? flagEditCorrectIndex : q.correctIndex, correctIndices: q.correctIndices, pairs: q.pairs, explanation: flagEditExplanation.trim(), position: q.position ?? 0, type: q.type });
                                    setEditingFlagId(null);
                                  }}
                                  className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg font-semibold transition-all"
                                >
                                  💾 Speichern
                                </button>
                                <button onClick={() => setEditingFlagId(null)} className="px-3 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded-lg transition-all">Abbrechen</button>
                              </div>
                            </div>
                          )}

                          {/* Aktionen */}
                          <div className="flex gap-2">
                            {q && editingFlagId !== flag.questionId && (
                              <button
                                onClick={() => {
                                  setEditingFlagId(flag.questionId);
                                  setFlagEditQuestion(q.question);
                                  setFlagEditOptions([...(q.options ?? ['', '', '', '']), '', '', '', ''].slice(0, 4));
                                  setFlagEditCorrectIndex(q.correctIndex ?? 0);
                                  setFlagEditExplanation(q.explanation ?? '');
                                }}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded-lg font-semibold transition-all"
                              >
                                ✏️ Bearbeiten
                              </button>
                            )}
                            {q && editingFlagId !== flag.questionId && (
                              <button
                                onClick={async () => {
                                  if (!window.confirm('Frage wirklich löschen? Das kann nicht rückgängig gemacht werden.')) return;
                                  await deleteQuizQuestion(flag.questionId);
                                  releaseFlaggedQuestion(flag.questionId);
                                }}
                                className="bg-red-900/60 hover:bg-red-800 text-red-400 hover:text-red-300 text-xs py-2 px-3 rounded-lg font-semibold transition-all"
                              >
                                🗑
                              </button>
                            )}
                            <button
                              onClick={() => releaseFlaggedQuestion(flag.questionId)}
                              className="flex-1 bg-green-600/80 hover:bg-green-600 text-white text-xs py-2 rounded-lg font-semibold transition-all"
                            >
                              ✓ Schließen
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* ── Gemeldete Theorie-Texte ── */}
                {(() => {
                  const tFlags = getTheoryFlags();
                  if (tFlags.length === 0) return null;
                  return (
                    <div className="mt-4 space-y-3">
                      <div className="text-xs font-bold uppercase tracking-widest text-orange-400 mt-2">Gemeldete Theorie-Texte</div>
                      {tFlags.map(flag => {
                        const topic = getTopicsForModule(flag.moduleId).find(t => t.id === flag.topicId);
                        const currentText = topicOverrides[`${flag.moduleId}:${flag.topicId}`] ?? topic?.theoryText ?? '';
                        const isEditingThis = editingFlagId === `theory:${flag.id}`;
                        return (
                          <div key={flag.id} className="bg-gray-900/60 rounded-xl border border-orange-500/30 p-4 space-y-3">
                            <div className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">
                              {flag.topicTitle} · {flag.memberName} · {new Date(flag.timestamp).toLocaleDateString('de-DE')}
                            </div>
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2 text-sm text-orange-300 leading-snug">
                              💬 "{flag.comment}"
                            </div>
                            {isEditingThis && (
                              <div className="space-y-2 border-t border-gray-700/50 pt-2">
                                <textarea
                                  value={flagEditTheoryText}
                                  onChange={e => setFlagEditTheoryText(e.target.value)}
                                  rows={8}
                                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-200 resize-y font-mono focus:outline-none focus:border-orange-500"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => { updateTopicText(`${flag.moduleId}:${flag.topicId}`, flagEditTheoryText); dismissTheoryFlag(flag.id); setEditingFlagId(null); }}
                                    className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded-lg font-semibold"
                                  >
                                    💾 Speichern & Schließen
                                  </button>
                                  <button onClick={() => setEditingFlagId(null)} className="px-3 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded-lg">Abbrechen</button>
                                </div>
                              </div>
                            )}
                            {!isEditingThis && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => { setEditingFlagId(`theory:${flag.id}`); setFlagEditTheoryText(currentText); }}
                                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded-lg font-semibold"
                                >
                                  ✏️ Text bearbeiten
                                </button>
                                <button
                                  onClick={() => dismissTheoryFlag(flag.id)}
                                  className="flex-1 bg-green-600/80 hover:bg-green-600 text-white text-xs py-2 rounded-lg font-semibold"
                                >
                                  ✓ Schließen
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
              )}
            </div>
          </div>
          );
        })()}

        {/* ── PLATTFORM ──────────────────────────────────────────────── */}
        {adminSubTab === 'verwaltung' && verwaltungSubTab === 'plattform' && (() => {
          // Permissions-Matrix Konfiguration
          const PERMISSION_LABELS: { key: keyof RolePermissions; label: string; description: string; adminOnly?: boolean }[] = [
            { key: 'canPostToBoard',              label: 'Board: Posten',                description: 'Darf Nachrichten im Instructor-Board verfassen' },
            { key: 'canRestrictBoardVisibility',  label: 'Board: Einschränken',          description: 'Darf Posts auf "Nur Ausgewählte" beschränken', adminOnly: true },
            { key: 'canViewAllMembers',           label: 'Alle Member sehen',            description: 'Vollständige Memberliste einsehen' },
            { key: 'canApproveExams',             label: 'Prüfungen abnehmen',           description: 'Technische Prüfungen durchführen und bestätigen' },
            { key: 'canManageOwnStudents',        label: 'Eigene Schüler verwalten',     description: 'Eigene Kursteilnehmer einsehen und verwalten' },
            { key: 'canManageCenter',             label: 'Center verwalten',             description: 'Standort/Center-Verwaltung und -Einstellungen' },
            { key: 'canTrainInstructors',         label: 'Instructoren ausbilden',       description: 'Instructor-Ausbildung leiten und dokumentieren' },
            { key: 'canGrantAdminAccess',         label: 'Admin-Zugang vergeben',        description: 'Anderen Mitgliedern Admin-Rechte erteilen/entziehen', adminOnly: true },
          ];

          const ROLE_COLS: { role: InstructorRole; label: string }[] = [
            { role: 'assistant_instructor', label: 'Asst.' },
            { role: 'instructor',           label: 'Instr.' },
            { role: 'full_instructor',      label: 'Full' },
            { role: 'head_instructor',      label: 'Head' },
            { role: 'admin',                label: 'Admin' },
          ];

          const localPerms = permissionsConfig;

          const togglePerm = (role: InstructorRole, key: keyof RolePermissions) => {
            if (role === 'admin') return; // Admin nicht änderbar
            const perm = PERMISSION_LABELS.find(p => p.key === key);
            if (perm?.adminOnly) return; // adminOnly nicht für andere
            const updated: RolePermissions = { ...localPerms[role], [key]: !localPerms[role][key] };
            updatePermissionsConfig({ ...localPerms, [role]: updated });
          };

          // Tab-Konfiguration
          const MEMBER_TAB_LABELS: { id: MemberTabId; label: string; locked?: boolean }[] = [
            { id: 'dashboard',  label: 'Dashboard' },
            { id: 'training',   label: 'Training' },
            { id: 'community',  label: 'Community' },
            { id: 'profil',     label: 'Profil', locked: true },
          ];
          const INSTRUCTOR_TAB_LABELS: { id: InstructorTabId; label: string; locked?: boolean }[] = [
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'training',  label: 'Training' },
            { id: 'community', label: 'Community' },
            { id: 'profil',    label: 'Profil' },
            { id: 'admin',     label: 'Admin', locked: true },
          ];

          const localTab = tabConfig;

          const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}?join=true` : '';

          const AccordionHeader = ({ id, title, subtitle, onBeforeClose }: { id: string; title: string; subtitle: string; onBeforeClose?: () => boolean }) => (
            <button
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700/20 transition-all"
              onClick={() => {
                if (plattformOpen[id] && onBeforeClose && !onBeforeClose()) return;
                togglePlattform(id);
              }}
            >
              <div className="text-left">
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>
              </div>
              <span className="text-gray-500 text-xs ml-3 flex-shrink-0">{plattformOpen[id] ? '▲' : '▼'}</span>
            </button>
          );

          const UnsavedWarning = ({ onDiscard, onSave }: { onDiscard: () => void; onSave: () => void }) => (
            <div className="mx-4 mb-3 bg-yellow-900/20 border border-yellow-700/40 rounded-lg px-3 py-2.5 flex items-center justify-between gap-3">
              <span className="text-xs text-yellow-400">⚠ Nicht gespeicherte Änderungen</span>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={onDiscard} className="text-xs px-2.5 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all">Verwerfen</button>
                <button onClick={onSave} className="text-xs px-2.5 py-1 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-all">Speichern</button>
              </div>
            </div>
          );

          return (
            <div className="space-y-3">
              {/* A: Badge-Anzeige */}
              {(() => {
                const imageBadgesA = currentUser ? computeBadges(currentUser).filter(b => b.imageUrl) : [];
                if (imageBadgesA.length === 0) return null;
                const currentIdxA = badgeEditId ? imageBadgesA.findIndex(b => b.id === badgeEditId) : 0;
                const idxA = currentIdxA < 0 ? 0 : currentIdxA;
                const badgeA = imageBadgesA[idxA];
                const previewStyleA = {
                  backgroundImage: `url(${badgeA.imageUrl})`,
                  backgroundSize: `${Math.round(badgeEditScale * 100)}%`,
                  backgroundPosition: `${badgeEditPosX}% ${badgeEditPosY}%`,
                  backgroundRepeat: 'no-repeat' as const,
                };
                const saveBtnClass =
                  badgeSaveState === 'saved' ? 'bg-green-600 text-white cursor-default' :
                  badgeSaveState === 'dirty' ? 'bg-red-600 hover:bg-red-500 text-white' :
                  'bg-gray-700 text-gray-500 cursor-not-allowed';
                const saveBtnLabel =
                  badgeSaveState === 'saved' ? '✓ Gespeichert' :
                  badgeSaveState === 'dirty' ? 'Speichern' :
                  'Speichern';
                return (
                  <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
                    <AccordionHeader id="badges" title="Badge-Anzeige" subtitle="Zoom und Position pro Badge einstellen."
                      onBeforeClose={() => {
                        if (badgeSaveState === 'dirty') { setBadgePendingClose(true); return false; }
                        setBadgeSaveState('idle'); setBadgePendingClose(false); return true;
                      }}
                    />
                    {plattformOpen['badges'] && (
                      <div className="border-t border-gray-700/50 px-4 py-4 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <button onClick={() => { const ni = (idxA - 1 + imageBadgesA.length) % imageBadgesA.length; const b = imageBadgesA[ni]; const s = getBadgeDisplaySettings(b.id); setBadgeEditId(b.id); setBadgeEditScale(s.scale); setBadgeEditPosX(s.posX); setBadgeEditPosY(s.posY); setBadgeSaveState('idle'); setBadgePendingClose(false); }} className="w-8 h-8 rounded-lg bg-gray-700 text-gray-300 text-sm flex items-center justify-center hover:bg-gray-600 flex-shrink-0" disabled={imageBadgesA.length <= 1}>←</button>
                          <span className="text-sm text-white font-medium text-center">{badgeA.label}</span>
                          <button onClick={() => { const ni = (idxA + 1) % imageBadgesA.length; const b = imageBadgesA[ni]; const s = getBadgeDisplaySettings(b.id); setBadgeEditId(b.id); setBadgeEditScale(s.scale); setBadgeEditPosX(s.posX); setBadgeEditPosY(s.posY); setBadgeSaveState('idle'); setBadgePendingClose(false); }} className="w-8 h-8 rounded-lg bg-gray-700 text-gray-300 text-sm flex items-center justify-center hover:bg-gray-600 flex-shrink-0" disabled={imageBadgesA.length <= 1}>→</button>
                        </div>
                        <div className="flex justify-center"><div className="w-20 h-20 rounded-full border-2 border-gray-600" style={previewStyleA} /></div>
                        <div><div className="flex justify-between mb-1"><label className="text-xs text-gray-400">Zoom</label><span className="text-xs text-gray-500">{Math.round(badgeEditScale * 100)}%</span></div><input type="range" min={100} max={250} step={1} value={Math.round(badgeEditScale * 100)} onChange={e => { setBadgeEditScale(Number(e.target.value) / 100); setBadgeSaveState('dirty'); setBadgePendingClose(false); }} className="w-full accent-red-500" /></div>
                        <div><div className="flex justify-between mb-1"><label className="text-xs text-gray-400">Position Horizontal</label><span className="text-xs text-gray-500">{badgeEditPosX}%</span></div><input type="range" min={0} max={100} step={1} value={badgeEditPosX} onChange={e => { setBadgeEditPosX(Number(e.target.value)); setBadgeSaveState('dirty'); setBadgePendingClose(false); }} className="w-full accent-red-500" /></div>
                        <div><div className="flex justify-between mb-1"><label className="text-xs text-gray-400">Position Vertikal</label><span className="text-xs text-gray-500">{badgeEditPosY}%</span></div><input type="range" min={0} max={100} step={1} value={badgeEditPosY} onChange={e => { setBadgeEditPosY(Number(e.target.value)); setBadgeSaveState('dirty'); setBadgePendingClose(false); }} className="w-full accent-red-500" /></div>
                        {badgePendingClose && <UnsavedWarning
                          onDiscard={() => { setBadgePendingClose(false); setBadgeSaveState('idle'); togglePlattform('badges'); }}
                          onSave={() => { setBadgeDisplaySettings(badgeA.id, { scale: badgeEditScale, posX: badgeEditPosX, posY: badgeEditPosY }); setBadgePendingClose(false); setBadgeSaveState('idle'); togglePlattform('badges'); }}
                        />}
                        <button disabled={badgeSaveState !== 'dirty'} onClick={() => { setBadgeDisplaySettings(badgeA.id, { scale: badgeEditScale, posX: badgeEditPosX, posY: badgeEditPosY }); setBadgeSaveState('saved'); }} className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${saveBtnClass}`}>{saveBtnLabel}</button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* B: Beitritts-QR-Code */}
              <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
                <AccordionHeader id="qr" title="Beitritts-QR-Code" subtitle="Schüler scannen diesen Code und senden eine Beitrittsanfrage — kein Login nötig." />
                {plattformOpen['qr'] && (
                <div className="border-t border-gray-700/50">
                <div className="p-5 flex flex-col items-center gap-3">
                  <div className="bg-white p-3 rounded-xl">
                    <QRCode value={joinUrl} size={160} />
                  </div>
                  <div className="text-[10px] text-gray-500 text-center font-mono break-all">{joinUrl}</div>
                  <div className="text-xs text-gray-400 text-center">Anfragen erscheinen unter <span className="text-white font-semibold">Anfragen → Beitrittsanfragen</span></div>
                </div>
                </div>
                )}
              </div>

              {/* C: Rechte-Matrix */}
              <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
                <AccordionHeader id="rechte" title="Rechte-Matrix" subtitle="Legt fest, was jede Rolle tun darf. Admin hat immer alle Rechte." />
                {plattformOpen['rechte'] && (
                <div className="border-t border-gray-700/50">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-700/50">
                        <th className="text-left px-4 py-2.5 text-gray-500 font-medium w-48">Berechtigung</th>
                        {ROLE_COLS.map(c => (
                          <th key={c.role} className={`px-3 py-2.5 font-medium text-center ${c.role === 'admin' ? 'text-red-400' : 'text-gray-400'}`}>{c.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                      {PERMISSION_LABELS.map(perm => (
                        <tr key={perm.key} className="hover:bg-gray-700/20 transition-colors">
                          <td className="px-4 py-2.5">
                            <div className="text-gray-300 leading-tight">{perm.label}</div>
                            <div className="text-gray-600 text-[10px] mt-0.5 leading-tight">{perm.description}</div>
                          </td>
                          {ROLE_COLS.map(c => {
                            const isAdmin = c.role === 'admin';
                            const isAdminOnly = perm.adminOnly;
                            const checked = isAdmin ? true : (localPerms[c.role]?.[perm.key] ?? false);
                            const isLocked = isAdmin || (isAdminOnly && !isAdmin);
                            return (
                              <td key={c.role} className="px-3 py-2.5 text-center">
                                <button
                                  onClick={() => togglePerm(c.role, perm.key)}
                                  disabled={isLocked}
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mx-auto transition-all ${
                                    isLocked
                                      ? checked ? 'bg-gray-600 border-gray-600 cursor-not-allowed' : 'border-gray-700 cursor-not-allowed opacity-40'
                                      : checked ? 'bg-red-600 border-red-500' : 'border-gray-600 hover:border-gray-400'
                                  }`}
                                >
                                  {checked && <span className="text-white font-bold" style={{ fontSize: '10px' }}>✓</span>}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-2.5 border-t border-gray-700/30 text-[10px] text-gray-600">
                  Änderungen werden sofort gespeichert und sind nach Seitenneuladung aktiv.
                </div>
                </div>
                )}
              </div>

              {/* D: Reiter-Verwaltung */}
              <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
                <AccordionHeader id="reiter" title="Reiter-Verwaltung" subtitle="Deaktivierte Reiter sind ausgegraut und nicht aufrufbar." />
                {plattformOpen['reiter'] && (
                <div className="border-t border-gray-700/50">
                <div className="divide-y divide-gray-700/30">
                  {/* Member-Bereich */}
                  <div className="px-4 py-3">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2">Member-Bereich</div>
                    <div className="space-y-1.5">
                      {MEMBER_TAB_LABELS.map(t => {
                        const enabled = localTab.memberTabs[t.id] !== false;
                        return (
                          <div key={t.id} className="flex items-center justify-between py-1">
                            <div>
                              <span className={`text-sm ${enabled ? 'text-gray-200' : 'text-gray-500'}`}>{t.label}</span>
                              {t.locked && <span className="text-[10px] text-gray-600 ml-2">immer aktiv</span>}
                            </div>
                            <button
                              disabled={!!t.locked}
                              onClick={() => !t.locked && updateTabConfig({ ...localTab, memberTabs: { ...localTab.memberTabs, [t.id]: !enabled } })}
                              className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${
                                t.locked ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                              } ${enabled ? 'bg-red-600' : 'bg-gray-700'}`}
                            >
                              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'left-5' : 'left-0.5'}`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Instructor-Bereich */}
                  <div className="px-4 py-3">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2">Instructor-Bereich</div>
                    <div className="space-y-1.5">
                      {INSTRUCTOR_TAB_LABELS.map(t => {
                        const enabled = localTab.instructorTabs[t.id] !== false;
                        return (
                          <div key={t.id} className="flex items-center justify-between py-1">
                            <div>
                              <span className={`text-sm ${enabled ? 'text-gray-200' : 'text-gray-500'}`}>{t.label}</span>
                              {t.locked && <span className="text-[10px] text-gray-600 ml-2">immer aktiv</span>}
                            </div>
                            <button
                              disabled={!!t.locked}
                              onClick={() => !t.locked && updateTabConfig({ ...localTab, instructorTabs: { ...localTab.instructorTabs, [t.id]: !enabled } })}
                              className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${
                                t.locked ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                              } ${enabled ? 'bg-red-600' : 'bg-gray-700'}`}
                            >
                              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'left-5' : 'left-0.5'}`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                </div>
                )}
              </div>

              {/* E: XP & Level-Konfiguration */}
              <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
                <AccordionHeader id="xp_config" title="XP & Level-Konfiguration" subtitle="Alle XP-Werte, Level-Schwellen und Quiz-Einstellungen der Plattform." />
                {plattformOpen['xp_config'] && (
                <div className="border-t border-gray-700/50 divide-y divide-gray-700/30">

                  {/* XP-Vergabe */}
                  <div className="px-4 py-3">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-3">XP-Vergabe</div>
                    <div className="space-y-2">
                      {([
                        { key: 'checkIn',            label: 'Check-In bestätigt',               unit: 'XP' },
                        { key: 'techniqueSession',   label: 'Technik trainiert (pro Session)',   unit: 'XP' },
                        { key: 'quizCorrect',        label: 'Quiz: richtige Antwort',            unit: 'XP' },
                        { key: 'quizBonusAllCorrect',label: 'Quiz: Bonus bei 100%',              unit: 'XP' },
                        { key: 'examPass',           label: 'Prüfungsquiz bestanden',            unit: 'XP' },
                        { key: 'techPassed',         label: 'Technik bestanden (tech_passed)',   unit: 'XP' },
                        { key: 'tacPassed',          label: 'Technik bestanden (tac_passed)',    unit: 'XP' },
                        { key: 'stopTheBleed',       label: 'Stop the Bleed Zertifizierung',    unit: 'XP' },
                        { key: 'streakWeeks',        label: 'Streak-Bonus (alle N Wochen)',      unit: 'XP' },
                        { key: 'streakInterval',     label: 'Streak-Intervall',                  unit: 'Wochen' },
                      ] as { key: keyof typeof platformConfig.xp; label: string; unit: string }[]).map(({ key, label, unit }) => (
                        <div key={key} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-300 flex-1">{label}</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              value={platformConfig.xp[key] as number}
                              onChange={e => {
                                const val = parseInt(e.target.value) || 0;
                                updatePlatformConfig({ ...platformConfig, xp: { ...platformConfig.xp, [key]: val } });
                              }}
                              className="w-20 bg-gray-900 border border-gray-700 text-white text-sm text-right rounded-lg px-2 py-1 focus:outline-none focus:border-gray-500"
                            />
                            <span className="text-xs text-gray-500 w-10">{unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modul-Abschluss XP pro Block */}
                  <div className="px-4 py-3">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-3">Modul-Abschluss XP (pro Block)</div>
                    <div className="space-y-2">
                      {platformConfig.xp.moduleBlock.map((val, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-300 flex-1">Block {idx + 1}</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              value={val}
                              onChange={e => {
                                const newArr = [...platformConfig.xp.moduleBlock];
                                newArr[idx] = parseInt(e.target.value) || 0;
                                updatePlatformConfig({ ...platformConfig, xp: { ...platformConfig.xp, moduleBlock: newArr } });
                              }}
                              className="w-20 bg-gray-900 border border-gray-700 text-white text-sm text-right rounded-lg px-2 py-1 focus:outline-none focus:border-gray-500"
                            />
                            <span className="text-xs text-gray-500 w-10">XP</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Level-System */}
                  <div className="px-4 py-3">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-3">XP pro Level (Tierstufen, je 10 Level)</div>
                    <div className="space-y-2">
                      {platformConfig.levels.xpPerTier.map((val, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-300 flex-1">Level {idx * 10 + 1}–{(idx + 1) * 10}</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={100}
                              step={50}
                              value={val}
                              onChange={e => {
                                const newArr = [...platformConfig.levels.xpPerTier];
                                newArr[idx] = parseInt(e.target.value) || 500;
                                updatePlatformConfig({ ...platformConfig, levels: { ...platformConfig.levels, xpPerTier: newArr } });
                              }}
                              className="w-20 bg-gray-900 border border-gray-700 text-white text-sm text-right rounded-lg px-2 py-1 focus:outline-none focus:border-gray-500"
                            />
                            <span className="text-xs text-gray-500 w-10">XP</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quiz-Einstellungen */}
                  <div className="px-4 py-3">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-3">Quiz-Einstellungen</div>
                    <div className="space-y-2">
                      {([
                        { key: 'practiceQuestionsPerSession', label: 'Übungsquiz: Fragen pro Session' },
                        { key: 'examQuestions',               label: 'Prüfungsquiz: Gesamtfragen' },
                      ] as { key: keyof typeof platformConfig.quiz; label: string }[]).map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-300 flex-1">{label}</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={1}
                              value={platformConfig.quiz[key] as number}
                              onChange={e => {
                                const val = parseInt(e.target.value) || 10;
                                updatePlatformConfig({ ...platformConfig, quiz: { ...platformConfig.quiz, [key]: val } });
                              }}
                              className="w-20 bg-gray-900 border border-gray-700 text-white text-sm text-right rounded-lg px-2 py-1 focus:outline-none focus:border-gray-500"
                            />
                            <span className="text-xs text-gray-500 w-10">Stk.</span>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-gray-300 flex-1">Bestehensquote Prüfung</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={50}
                            max={100}
                            step={5}
                            value={Math.round(platformConfig.quiz.examPassRate * 100)}
                            onChange={e => {
                              const pct = Math.min(100, Math.max(50, parseInt(e.target.value) || 90));
                              updatePlatformConfig({ ...platformConfig, quiz: { ...platformConfig.quiz, examPassRate: pct / 100 } });
                            }}
                            className="w-20 bg-gray-900 border border-gray-700 text-white text-sm text-right rounded-lg px-2 py-1 focus:outline-none focus:border-gray-500"
                          />
                          <span className="text-xs text-gray-500 w-10">%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-3">Änderungen werden sofort gespeichert und sind plattformweit aktiv.</p>
                  </div>

                </div>
                )}
              </div>

            </div>
          );
        })()}
      </div>
    );
  };

  // Tab configuration
  const dashboardBadge = pendingCheckIns.length + pendingExamRequests.length + pendingWishes.length + totalPendingApps + joinRequests.filter(r => r.status === 'pending').length + unreadBoardNotifs;

  const allTabs: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: '📊', badge: dashboardBadge > 0 ? dashboardBadge : undefined },
    { id: 'training' as Tab, label: 'Training', icon: '🥋' },
    { id: 'community' as Tab, label: 'Community', icon: '👥' },
    { id: 'profil' as Tab, label: 'Profil', icon: '👤' },
    { id: 'admin' as Tab, label: 'Admin', icon: '🔐' },
  ];
  // Nur role-zugängliche Tabs zeigen; tabConfig steuert ob klickbar (grayed out wenn deaktiviert)
  const tabs = allTabs.filter(tab => canAccessTab(tab.id));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Content */}
      <main className="max-w-6xl mx-auto p-4 pb-24">
        {activeTab === 'dashboard' && renderDashboardTab()}
        {activeTab === 'training' && <InstructorLearningView />}
        {activeTab === 'community' && renderCommunityTab()}
        {activeTab === 'profil' && <ProfileView member={currentUser} />}
        {activeTab === 'admin' && renderAdminTab()}
      </main>

      {/* Profil Modal */}
      {profileMember && (
        <ProfileView member={profileMember} isModal onClose={() => setProfileMember(null)} />
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40">
        <div className="max-w-6xl mx-auto flex overflow-x-auto">
          {tabs.map(tab => {
            const tabEnabled = tabConfig.instructorTabs[tab.id as InstructorTabId] !== false;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (!tabEnabled) return; // deaktivierte Tabs nicht klickbar
                  setActiveTabPersisted(tab.id);
                  if (tab.id !== 'dashboard') {
                    setSelectedMember(null);
                    setSelectedModule(null);
                  }
                }}
                className={`flex-1 min-w-[60px] py-3 flex flex-col items-center gap-0.5 transition-all relative ${
                  !tabEnabled ? 'opacity-30 cursor-not-allowed'
                    : activeTab === tab.id ? 'text-white' : 'text-gray-500'
                }`}
              >
                {tabEnabled && activeTab === tab.id && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-red-500 rounded-full" />
                )}
                <span className={`text-xl leading-tight transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`}>{tab.icon}</span>
                <span className={`text-[11px] leading-tight whitespace-nowrap ${activeTab === tab.id ? 'font-semibold' : ''}`}>{tab.label}</span>
                {tabEnabled && tab.badge && tab.badge > 0 ? (
                  <span className="absolute top-1.5 right-1/2 translate-x-3 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default InstructorView;
