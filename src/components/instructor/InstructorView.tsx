// ============================================
// MARTIAL INSTINCT - INSTRUCTOR VIEW
// Strukturiert, autoritätsbasiert und skalierbar
// ============================================

import React, { useState } from 'react';
import { useApp, MODULES, BLOCKS } from '../../context/AppContext';
import {
  STATUS_DISPLAY,
  LEVEL_DISPLAY,
  ROLE_DISPLAY,
  EXAM_PERMISSIONS,
  Member
} from '../../types';
import { TechniqueCard } from '../shared/TechniqueCard';
import { InstructorLearningView } from './InstructorLearningView';

type Tab = 'lernen' | 'live' | 'evaluate' | 'members' | 'requests' | 'applications' | 'board';

export const InstructorView: React.FC = () => {
  const {
    currentUser,
    members,
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
    getBlockProgress
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('lernen');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [boardMessageText, setBoardMessageText] = useState('');
  const [rejectionFeedback, setRejectionFeedback] = useState<Record<string, string>>({});

  if (!currentUser) return null;

  const pendingCheckIns = getPendingCheckIns();
  const pendingExamRequests = getPendingExamRequests();
  const checkedInMembers = members.filter(m => m.isCheckedIn);
  
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
        return currentUser.role === 'owner';
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
  const renderLiveTab = () => (
    <div className="space-y-6">
      {/* Pending Check-ins */}
      {pendingCheckIns.length > 0 && (
        <div className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-700">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">
            🔔 Check-in Anfragen ({pendingCheckIns.length})
          </h3>
          <div className="space-y-3">
            {pendingCheckIns.map(checkIn => (
              <div key={checkIn.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{checkIn.memberName}</div>
                  <div className="text-gray-400 text-sm">{formatTimeAgo(checkIn.requestedAt)}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveCheckIn(checkIn.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => rejectCheckIn(checkIn.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checked-in Members */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">
          📍 Eingecheckt ({checkedInMembers.length})
        </h3>
        {checkedInMembers.length === 0 ? (
          <p className="text-gray-400">Niemand ist aktuell eingecheckt</p>
        ) : (
          <div className="space-y-3">
            {checkedInMembers.map(member => (
              <div key={member.id} className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{member.avatar}</span>
                  <div>
                    <div className="font-medium text-white">{member.name}</div>
                    <div className="text-gray-400 text-sm">
                      {LEVEL_DISPLAY[member.currentLevel].subtitle} • 
                      Eingecheckt {member.checkedInAt ? formatTimeAgo(member.checkedInAt) : ''}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {canAccessTab('evaluate') && (
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setActiveTab('evaluate');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Bewerten
                    </button>
                  )}
                  <button
                    onClick={() => checkOut(member.id)}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Auschecken
                  </button>
                </div>
              </div>
            ))}
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
  const renderMembersTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Alle Mitglieder</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="pb-3">Mitglied</th>
              <th className="pb-3">Level</th>
              <th className="pb-3">Streak</th>
              <th className="pb-3">Zuletzt</th>
              <th className="pb-3">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {members.filter(m => m.role === 'member').map(member => {
              const progress = getBlockProgress(member.id, member.currentLevel);
              
              return (
                <tr key={member.id} className="border-b border-gray-800">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{member.avatar}</span>
                      <div>
                        <div className="text-white">{member.name}</div>
                        <div className="text-gray-400 text-sm">{progress.completed} Techniken</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={LEVEL_DISPLAY[member.currentLevel].color}>
                      {LEVEL_DISPLAY[member.currentLevel].icon} {LEVEL_DISPLAY[member.currentLevel].subtitle}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-1">
                      🔥 {member.streak.currentStreak}
                      <span className="text-gray-400 text-sm">/ 🩹 {member.streak.bandaids}</span>
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">
                    {formatTimeAgo(member.lastSeenAt)}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => awardBandaid(member.id, 'Instructor Bonus')}
                        className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-sm hover:bg-green-600/30"
                        title="Pflaster vergeben"
                      >
                        🩹+
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setActiveTab('evaluate');
                        }}
                        className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-sm hover:bg-blue-600/30"
                      >
                        Bewerten
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Requests Tab
  const renderRequestsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">
        🟡 Offene Prüfungsanfragen ({pendingExamRequests.length})
      </h3>
      
      {pendingExamRequests.length === 0 ? (
        <p className="text-gray-400">Keine offenen Anfragen</p>
      ) : (
        <div className="space-y-4">
          {pendingExamRequests.map(req => {
            const member = members.find(m => m.id === req.memberId);
            const canProcess = canExamineLevel(req.targetLevel);
            
            return (
              <div key={req.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{member?.avatar}</span>
                    <div>
                      <div className="font-medium text-white">{req.memberName}</div>
                      <div className="text-gray-400 text-sm">{req.moduleName}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${LEVEL_DISPLAY[req.targetLevel].bgColor} ${LEVEL_DISPLAY[req.targetLevel].color}`}>
                    {LEVEL_DISPLAY[req.targetLevel].icon} {LEVEL_DISPLAY[req.targetLevel].subtitle}
                  </span>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-3 mb-3">
                  <div className="text-white">{req.techniqueName}</div>
                  <div className="text-gray-400 text-sm">
                    Angefragt {formatTimeAgo(req.requestedAt)}
                  </div>
                </div>
                
                {canProcess ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveExam(req.memberId, req.id, 'Technik korrekt ausgeführt')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
                      >
                        ✅ Freigeben
                      </button>
                      <button
                        onClick={() => {
                          const feedback = rejectionFeedback[req.id] || 'Nachtraining erforderlich';
                          rejectExam(req.memberId, req.id, feedback);
                        }}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium"
                      >
                        🔄 Nachtraining
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Feedback (optional)"
                      value={rejectionFeedback[req.id] || ''}
                      onChange={(e) => setRejectionFeedback(prev => ({ ...prev, [req.id]: e.target.value }))}
                      className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600 text-sm"
                    />
                  </div>
                ) : (
                  <p className="text-yellow-500 text-sm">
                    ⚠️ Du hast keine Berechtigung für {LEVEL_DISPLAY[req.targetLevel].subtitle}-Prüfungen
                  </p>
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
                        <div className="text-gray-400 text-sm">Motivation</div>
                        <div className="text-white">{app.answers.motivation}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-gray-400 text-sm">Unterrichtserfahrung</div>
                        <div className="text-white">{app.answers.teachingExperience}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-gray-400 text-sm">Verfügbarkeit</div>
                        <div className="text-white">{app.answers.availability}</div>
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
    { id: 'live' as Tab, label: 'Live', icon: '📍', badge: pendingCheckIns.length },
    { id: 'evaluate' as Tab, label: 'Bewerten', icon: '✏️' },
    { id: 'members' as Tab, label: 'Mitglieder', icon: '👥' },
    { id: 'requests' as Tab, label: 'Anfragen', icon: '🟡', badge: pendingExamRequests.length },
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
