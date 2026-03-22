// ============================================
// MARTIAL INSTINCT - INSTRUCTOR VIEW
// Strukturiert, autoritätsbasiert und skalierbar
// ============================================

import React, { useState, useEffect } from 'react';
import { useApp, MODULES, BLOCKS, COURSES } from '../../context/AppContext';
import {
  STATUS_DISPLAY,
  LEVEL_DISPLAY,
  ROLE_DISPLAY,
  EXAM_PERMISSIONS,
  Member,
  CheckIn,
  InstructorRole
} from '../../types';
import { TechniqueCard } from '../shared/TechniqueCard';
import { InstructorLearningView } from './InstructorLearningView';

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
  // tactical_instructor und höher: alles erlaubt
  if (['tactical_instructor', 'head_instructor', 'owner', 'admin'].includes(role)) return true;
  // assistant_instructor / instructor: nur eigene Kursteilnehmer
  const ownCourse = COURSES.find(
    c => c.instructorId === instructorId && c.participantIds.includes(checkIn.memberId)
  );
  return !!ownCourse;
}

type Tab = 'lernen' | 'live' | 'evaluate' | 'members' | 'requests' | 'applications' | 'board';

export const InstructorView: React.FC = () => {
  const {
    currentUser,
    members,
    checkIns,
    boardMessages,
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
    getPendingCheckIns,
    getPendingExamRequests,
    getBlockProgress,
    getOnlineMembers,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('lernen');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [boardMessageText, setBoardMessageText] = useState('');
  const [rejectionFeedback, setRejectionFeedback] = useState<Record<string, string>>({});
  const [liveTick, setLiveTick] = useState(0);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberSort, setMemberSort] = useState<'name' | 'lastSeen' | 'lastTraining'>('lastSeen');

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
  const checkedInMembers = members.filter(m => m.isCheckedIn);
  const detectedCourse = detectCurrentCourse(currentUser.locationId);
  
  const pendingContactApps = getPendingContactApplications();
  const pendingInstructorApps = getPendingInstructorApplications();
  const totalPendingApps = pendingContactApps.length + pendingInstructorApps.length;

  // Check if user can access tab
  const canAccessTab = (tab: Tab): boolean => {
    switch (tab) {
      case 'lernen':
        return true;
      case 'live':
        return true;
      case 'evaluate':
        return EXAM_PERMISSIONS[currentUser.role].length > 0;
      case 'members':
        return ['head_instructor', 'owner'].includes(currentUser.role);
      case 'requests':
        return EXAM_PERMISSIONS[currentUser.role].length > 0;
      case 'applications':
        return currentUser.role === 'owner' || currentUser.role === 'admin';
      case 'board':
        return currentUser.role !== 'member';
      default:
        return false;
    }
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

  // Render Live Tab
  const renderLiveTab = () => {
    const now = new Date();
    const todayStr = now.toDateString();

    // Online-Status: onlineSince gesetzt = aktiv eingeloggt
    // Inaktiv: lastSeenAt < 10 Min her, aber kein onlineSince
    const INACTIVE_CUTOFF = 10 * 60 * 1000;
    const isOnline = (m: typeof members[0]) => !!m.onlineSince;
    const isInactive = (m: typeof members[0]) =>
      !m.onlineSince && (now.getTime() - new Date(m.lastSeenAt).getTime()) < INACTIVE_CUTOFF;

    const onlineMembers = getOnlineMembers().filter(m => isOnline(m) || isInactive(m));

    const instructorRoles = ['assistant_instructor', 'instructor', 'tactical_instructor', 'head_instructor', 'owner', 'admin'];
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
      <div className="space-y-6">
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

        {/* ── Bereich 1: In der Plattform ─────────────────────────────────── */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700/60 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
              In der Plattform
              <span className="text-gray-500 font-normal text-sm">({onlineMembers.length})</span>
            </h3>
            <span className="text-gray-600 text-xs">aktualisiert vor {liveTick === 0 ? '0' : liveTick}×30s</span>
          </div>

          {onlineMembers.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">Niemand ist gerade online</div>
          ) : (
            <div className="divide-y divide-gray-700/40">
              {/* Trainer-Sektion */}
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

              {/* Member-Sektion */}
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
                          <span className="ml-2 text-xs text-gray-500">
                            {LEVEL_DISPLAY[m.currentLevel].subtitle}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs flex-shrink-0">{formatOnlineSince(m)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Legende */}
          <div className="px-4 py-2 border-t border-gray-700/40 flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Aktiv
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Inaktiv (&lt;10 Min)
            </span>
          </div>
        </div>

        {/* ── Bereich 2: Beim Training ─────────────────────────────────────── */}
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
                      {canAccessTab('evaluate') && (
                        <button
                          onClick={() => { setSelectedMember(member); setActiveTab('evaluate'); }}
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

        {/* QR Code */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
          <h3 className="text-lg font-bold text-white mb-4">📱 QR-Code für Check-in</h3>
          <div className="bg-white p-8 rounded-xl inline-block">
            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-6xl">🥋</span>
            </div>
          </div>
          <p className="text-gray-400 mt-4 text-sm">Mitglieder scannen diesen Code zum Einchecken</p>
        </div>
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
                        <span className="text-white">{module.name}</span>
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
              <div className="font-bold text-white">{module.name}</div>
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

  // Render Members Tab
  const renderMembersTab = () => {
    const search = memberSearch;
    const setSearch = setMemberSearch;
    const sortKey = memberSort;
    const setSortKey = setMemberSort;

    const allMembers = members.filter(m => m.role === 'member');

    // Status-Helfer
    const getMemberStatus = (m: Member): 'training' | 'online' | 'offline' => {
      if (m.isCheckedIn) return 'training';
      if (m.onlineSince !== undefined) return 'online';
      return 'offline';
    };

    // Formatierung: Datum + Uhrzeit
    const formatDateTime = (date: Date | null | undefined): string => {
      if (!date) return '–';
      const d = new Date(date);
      const today = new Date();
      const isToday = d.toDateString() === today.toDateString();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const isYesterday = d.toDateString() === yesterday.toDateString();
      const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      if (isToday) return `Heute, ${time}`;
      if (isYesterday) return `Gestern, ${time}`;
      return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }) + `, ${time}`;
    };

    // Filtern
    const filtered = allMembers.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );

    // Sortieren
    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name, 'de');
      if (sortKey === 'lastSeen') {
        return new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime();
      }
      // lastTraining
      const aT = a.streak.lastTrainingDate ? new Date(a.streak.lastTrainingDate).getTime() : 0;
      const bT = b.streak.lastTrainingDate ? new Date(b.streak.lastTrainingDate).getTime() : 0;
      return bT - aT;
    });

    // Status-Zusammenfassung
    const countTraining = allMembers.filter(m => m.isCheckedIn).length;
    const countOnline   = allMembers.filter(m => !m.isCheckedIn && m.onlineSince !== undefined).length;
    const countOffline  = allMembers.length - countTraining - countOnline;

    const StatusDot = ({ status }: { status: 'training' | 'online' | 'offline' }) => {
      if (status === 'training') return <span className="w-3 h-3 rounded-full bg-orange-400 flex-shrink-0 inline-block" />;
      if (status === 'online')   return <span className="w-3 h-3 rounded-full bg-green-400 flex-shrink-0 inline-block animate-pulse" />;
      return <span className="w-3 h-3 rounded-full bg-gray-600 flex-shrink-0 inline-block" />;
    };

    const statusLabel = (status: 'training' | 'online' | 'offline') => {
      if (status === 'training') return <span className="text-orange-400 text-xs font-medium">Beim Training</span>;
      if (status === 'online')   return <span className="text-green-400 text-xs font-medium">Online</span>;
      return <span className="text-gray-500 text-xs">Offline</span>;
    };

    const SortBtn = ({ k, label }: { k: typeof sortKey; label: string }) => (
      <button
        onClick={() => setSortKey(k)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          sortKey === k
            ? 'bg-red-600 text-white'
            : 'bg-gray-700/60 text-gray-400 hover:text-white'
        }`}
      >
        {label}
      </button>
    );

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-lg font-bold text-white">
            Mitglieder
            <span className="text-gray-500 font-normal text-sm ml-2">({allMembers.length})</span>
          </h3>
          {/* Status-Zusammenfassung */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {countTraining > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                {countTraining} beim Training
              </span>
            )}
            {countOnline > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                {countOnline} online
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-600 inline-block" />
              {countOffline} offline
            </span>
          </div>
        </div>

        {/* Suche + Sortierung */}
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Mitglied suchen…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-40 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
          />
          <div className="flex gap-1.5">
            <SortBtn k="name" label="Name" />
            <SortBtn k="lastSeen" label="Letzter Login" />
            <SortBtn k="lastTraining" label="Letztes Training" />
          </div>
        </div>

        {/* Karten-Liste */}
        {sorted.length === 0 ? (
          <div className="bg-gray-800/30 rounded-xl p-6 text-center text-gray-500 text-sm">
            Kein Mitglied gefunden
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map(member => {
              const status   = getMemberStatus(member);
              const progress = getBlockProgress(member.id, member.currentLevel);

              return (
                <div
                  key={member.id}
                  className={`bg-gray-800/50 rounded-xl border transition-all ${
                    status === 'training'
                      ? 'border-orange-500/30'
                      : status === 'online'
                      ? 'border-green-500/20'
                      : 'border-gray-700'
                  }`}
                >
                  {/* Hauptzeile */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <StatusDot status={status} />
                    <span className="text-2xl flex-shrink-0">{member.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-semibold text-sm">{member.name}</span>
                        <span className={`text-xs ${LEVEL_DISPLAY[member.currentLevel].color}`}>
                          {LEVEL_DISPLAY[member.currentLevel].icon} {LEVEL_DISPLAY[member.currentLevel].subtitle}
                        </span>
                        <span className="text-gray-600 text-xs">{progress.completed} Techniken</span>
                      </div>
                      <div className="mt-0.5">{statusLabel(status)}</div>
                    </div>
                    {/* Aktionen */}
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => awardBandaid(member.id, 'Instructor Bonus')}
                        className="bg-gray-700/60 hover:bg-gray-700 text-gray-300 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                        title="Pflaster vergeben"
                      >
                        🩹+
                      </button>
                      <button
                        onClick={() => { setSelectedMember(member); setActiveTab('evaluate'); }}
                        className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      >
                        Bewerten
                      </button>
                    </div>
                  </div>

                  {/* Detail-Zeile */}
                  <div className="px-4 pb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500 border-t border-gray-700/40 pt-2">
                    <span>
                      <span className="text-gray-600">Zuletzt online:</span>{' '}
                      <span className="text-gray-400">{formatDateTime(member.lastSeenAt)}</span>
                    </span>
                    <span>
                      <span className="text-gray-600">Letztes Training:</span>{' '}
                      <span className="text-gray-400">{formatDateTime(member.streak.lastTrainingDate)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      🔥 <span className="text-gray-400">{member.streak.currentStreak} Wochen</span>
                    </span>
                    <span className="flex items-center gap-1">
                      🩹 <span className="text-gray-400">{member.streak.bandaids}/{member.streak.maxBandaids}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Render Requests Tab
  const renderRequestsTab = () => (
    <div className="space-y-6">

      {/* ── Check-in Anfragen ─────────────────────────────────────────────── */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3">
          📥 Check-in Anfragen ({pendingCheckIns.length})
        </h3>
        {pendingCheckIns.length === 0 ? (
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30 text-center">
            <p className="text-gray-500 text-sm">Keine offenen Check-in Anfragen</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingCheckIns.map(checkIn => {
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
            })}
          </div>
        )}
      </div>

      {/* ── Prüfungsanfragen ──────────────────────────────────────────────── */}
      <h3 className="text-lg font-bold text-white">
        🔷 Prüfungsanfragen ({pendingExamRequests.length})
      </h3>

      {pendingExamRequests.length === 0 ? (
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center">
          <p className="text-gray-500 text-sm">Keine offenen Anfragen</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingExamRequests.map(req => {
            const member = members.find(m => m.id === req.memberId);
            // Jeder Instructor (nicht member) kann Prüfungsanfragen bearbeiten
            const canProcess = currentUser.role !== 'member';
            const feedback = rejectionFeedback[req.id] ?? '';
            const hasComment = feedback.trim().length >= 5;
            // Bestanden: kein Kommentar nötig. Nachtrainieren: Pflicht.
            const canPass = canProcess;
            const canReject = canProcess && hasComment;

            const levelBadge = req.examLevel === 'technical'
              ? <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-medium">🔷 Technisch</span>
              : <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 font-medium">🔶 Taktisch</span>;

            return (
              <div key={req.id} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                {/* Kopfzeile */}
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

                {/* Kommentar + Buttons */}
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
          })}
        </div>
      )}
    </div>
  );

  // Render Applications Tab (Owner only)
  const renderApplicationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">
        Bewerbungen ({totalPendingApps})
      </h3>
      
      {totalPendingApps === 0 ? (
        <p className="text-gray-400">Keine offenen Bewerbungen</p>
      ) : (
        <div className="space-y-8">
          {/* Contact Ready Applications */}
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

          {/* Instructor Applications */}
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
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Warum möchtest du Instructor werden?</div>
                        <div className="text-white text-sm">{app.answers.motivation}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Hast du bereits Unterrichtserfahrung?</div>
                        <div className="text-white text-sm">{app.answers.teachingExperience}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Stärken und Schwächen</div>
                        <div className="text-white text-sm">{app.answers.strengthsWeaknesses}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Verfügbarkeit</div>
                        <div className="text-white text-sm">{app.answers.availability}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Ziele als Instructor</div>
                        <div className="text-white text-sm">{app.answers.goals}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Was macht einen guten Instructor aus?</div>
                        <div className="text-white text-sm">{app.answers.roleModel}</div>
                      </div>
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
  );

  // Render Board Tab
  const renderBoardTab = () => (
    <div className="space-y-6">
      {/* New Message */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <textarea
          value={boardMessageText}
          onChange={(e) => setBoardMessageText(e.target.value)}
          placeholder="Nachricht an alle Instructors..."
          className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 resize-none"
          rows={3}
        />
        <button
          onClick={() => {
            if (boardMessageText.trim()) {
              sendBoardMessage(boardMessageText);
              setBoardMessageText('');
            }
          }}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Senden
        </button>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {boardMessages.slice().reverse().map(msg => (
          <div key={msg.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm px-2 py-1 rounded ${ROLE_DISPLAY[msg.authorRole].bgColor} ${ROLE_DISPLAY[msg.authorRole].color}`}>
                  {ROLE_DISPLAY[msg.authorRole].label}
                </span>
                <span className="text-white font-medium">{msg.authorName}</span>
              </div>
              <span className="text-gray-500 text-sm">{formatTimeAgo(msg.createdAt)}</span>
            </div>
            <p className="text-gray-300">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Tab configuration
  const allTabs: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: 'lernen' as Tab, label: 'Lernen', icon: '📚' },
    { id: 'live' as Tab, label: 'Live', icon: '📍' },
    { id: 'evaluate' as Tab, label: 'Bewerten', icon: '✏️' },
    { id: 'members' as Tab, label: 'Mitglieder', icon: '👥' },
    { id: 'requests' as Tab, label: 'Anfragen', icon: '🟡', badge: pendingCheckIns.length + pendingExamRequests.length },
    { id: 'applications' as Tab, label: 'Bewerbungen', icon: '💀', badge: totalPendingApps },
    { id: 'board' as Tab, label: 'Board', icon: '💬' },
  ];
  const tabs = allTabs.filter(tab => canAccessTab(tab.id));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentUser.avatar}</span>
            <div>
              <div className="font-bold text-white">{currentUser.name}</div>
              <div className={`text-sm ${ROLE_DISPLAY[currentUser.role].color}`}>
                {ROLE_DISPLAY[currentUser.role].label}
              </div>
            </div>
          </div>
          <div className="text-xl font-bold text-red-500">INSTRUCTOR DASHBOARD</div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== 'evaluate') {
                  setSelectedMember(null);
                  setSelectedModule(null);
                }
              }}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-red-500 text-red-500' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-4">
        {activeTab === 'lernen' && <InstructorLearningView />}
        {activeTab === 'live' && renderLiveTab()}
        {activeTab === 'evaluate' && renderEvaluateTab()}
        {activeTab === 'members' && renderMembersTab()}
        {activeTab === 'requests' && renderRequestsTab()}
        {activeTab === 'applications' && renderApplicationsTab()}
        {activeTab === 'board' && renderBoardTab()}
      </main>
    </div>
  );
};

export default InstructorView;
