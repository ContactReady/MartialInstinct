// ============================================
// MARTIAL INSTINCT - MEMBER VIEW
// Simpel für Members - nur Status, keine Prozente
// ============================================

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MODULES, BLOCKS } from '../../data/modules';
import { STATUS_DISPLAY, LEVEL_DISPLAY, TechniqueStatus, ModuleLevel } from '../../types';
import { TechniqueCard } from '../shared/TechniqueCard';
import { ProgressBar } from '../shared/ProgressBar';

type Tab = 'dashboard' | 'progress' | 'streak' | 'requests';
type ApplicationType = 'contact' | 'assistant_instructor' | null;

export const MemberView: React.FC = () => {
  const {
    currentUser,
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
    notifications,
    markNotificationRead
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
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

  // Eingecheckt-Status nur gültig wenn checkedInAt heute ist
  const isCheckedInToday =
    currentUser.isCheckedIn &&
    currentUser.checkedInAt != null &&
    new Date(currentUser.checkedInAt).toDateString() === now.toDateString();

  const userNotifications = notifications.filter(n => n.oduserId === currentUser.id && !n.read);

  // Get technique status for display
  const getTechStatus = (techniqueId: string): TechniqueStatus => {
    return currentUser.techniqueProgress[techniqueId]?.status || 'not_tested';
  };

  // Count completed techniques
  const getCompletedCount = (): number => {
    return Object.values(currentUser.techniqueProgress).filter(
      p => p.status !== 'not_tested' && p.status !== 'requested'
    ).length;
  };

  // Handle exam request
  const handleRequestExam = (techniqueId: string) => {
    const status = getTechStatus(techniqueId);
    if (status === 'not_tested') {
      requestExam(techniqueId);
    }
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
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Check-in Card */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Training Check-in</h3>
            <p className="text-gray-400 text-sm mt-1">
              {isCheckedInToday ? 'Du bist heute eingecheckt!' : 'Melde dich für das Training an'}
            </p>
          </div>
          {isCheckedInToday ? (
            <button
              disabled
              className="bg-green-600/80 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 cursor-not-allowed"
            >
              ✅ Eingecheckt
            </button>
          ) : checkIns.some(c => c.memberId === currentUser.id && c.status === 'pending') ? (
            <button
              disabled
              className="bg-gray-600 text-gray-300 px-6 py-3 rounded-lg font-bold flex items-center gap-2 cursor-not-allowed opacity-75"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Anfrage gesendet…
            </button>
          ) : (
            <button
              onClick={requestCheckIn}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-all"
            >
              Einchecken
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-white">{currentUser.streak.currentStreak}</div>
          <div className="text-gray-400 text-sm">Wochen Streak</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-3xl mb-2">🩹</div>
          <div className="text-2xl font-bold text-white">{currentUser.streak.bandaids}/{currentUser.streak.maxBandaids}</div>
          <div className="text-gray-400 text-sm">Pflaster</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-white">{getCompletedCount()}</div>
          <div className="text-gray-400 text-sm">Techniken bestanden</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-3xl mb-2">{LEVEL_DISPLAY[currentUser.currentLevel]?.icon || '⚪'}</div>
          <div className="text-lg font-bold text-white">{LEVEL_DISPLAY[currentUser.currentLevel]?.subtitle || 'Beginner'}</div>
          <div className="text-gray-400 text-sm">Aktuelles Level</div>
        </div>
      </div>

      {/* Notifications */}
      {userNotifications.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-3">Neue Benachrichtigungen</h3>
          <div className="space-y-2">
            {userNotifications.slice(0, 5).map(notif => (
              <div 
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className="bg-gray-700/50 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-white">{notif.title}</div>
                <div className="text-gray-400 text-sm">{notif.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Block Overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Dein Fortschritt</h3>
        {BLOCKS.map(block => {
          const progress = getBlockProgress(currentUser.id, block.level);
          const unlocked = isBlockUnlocked(currentUser.id, block.level);
          
          return (
            <div 
              key={block.id}
              className={`${block.bgColor} rounded-xl p-4 border ${block.borderColor} ${!unlocked ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{block.icon}</span>
                  <div>
                    <div className={`font-bold ${block.color}`}>{block.name}</div>
                    <div className="text-gray-400 text-sm">{block.subtitle}</div>
                  </div>
                </div>
                <div className="text-right">
                  {unlocked ? (
                    <>
                      <div className="text-white font-bold">{progress.completed}/{progress.total}</div>
                      <div className="text-gray-400 text-sm">Techniken</div>
                    </>
                  ) : (
                    <div className="text-gray-500">🔒 Gesperrt</div>
                  )}
                </div>
              </div>
              {unlocked && (
                <div className="mt-3 bg-gray-900/50 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render Progress Tab
  const renderProgress = () => {
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
          
          {/* Technik-Karten */}
          <div className="space-y-3">
            {module.techniques.map(tech => (
              <TechniqueCard
                key={tech.id}
                technique={tech}
                progress={currentUser.techniqueProgress[tech.id]}
                mode="member"
                onLogPractice={() => logPractice(tech.id)}
                onRequestExam={() => handleRequestExam(tech.id)}
              />
            ))}
          </div>

          {/* Nächste Schritte */}
          {(() => {
            const requiredTechs = module.techniques.filter(t => t.isRequired);
            const passedRequired = requiredTechs.filter(t => {
              const s = getTechStatus(t.id);
              return s !== 'not_tested' && s !== 'requested';
            });
            const missingRequired = requiredTechs.filter(t => {
              const s = getTechStatus(t.id);
              return s === 'not_tested' || s === 'requested';
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
                        return (
                          <div key={t.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <span>{STATUS_DISPLAY[s].icon}</span>
                              <span>{t.name}</span>
                            </div>
                            {s === 'not_tested' && (
                              <button
                                onClick={() => handleRequestExam(t.id)}
                                className="text-xs bg-yellow-600/70 hover:bg-yellow-600 text-white px-2 py-1 rounded transition-all"
                              >
                                Anfragen
                              </button>
                            )}
                            {s === 'requested' && (
                              <span className="text-xs text-yellow-400 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" /> Ausstehend
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

  // Render Streak Tab
  const renderStreak = () => (
    <div className="space-y-6">
      {/* Streak Card */}
      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-6 border border-orange-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-5xl mb-2">🔥</div>
            <div className="text-4xl font-bold text-white">{currentUser.streak.currentStreak}</div>
            <div className="text-orange-400">Wochen Streak</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm">Längster Streak</div>
            <div className="text-2xl font-bold text-white">{currentUser.streak.longestStreak}</div>
            <div className="text-gray-400 text-sm">Wochen</div>
          </div>
        </div>
      </div>

      {/* Bandaids Card */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">🩹 Pflaster</h3>
            <p className="text-gray-400 text-sm">Rette deinen Streak wenn du eine Woche verpasst</p>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: currentUser.streak.maxBandaids }).map((_, i) => (
              <div 
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  i < currentUser.streak.bandaids 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-700 text-gray-500'
                }`}
              >
                🩹
              </div>
            ))}
          </div>
        </div>
        
        {currentUser.streak.bandaids > 0 && (
          <button
            onClick={useBandaid}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-all"
          >
            Pflaster einsetzen
          </button>
        )}
      </div>

      {/* How to earn bandaids */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">So verdienst du Pflaster:</h3>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-center gap-3">
            <span className="text-green-400">✓</span>
            4 Wochen Streak erreichen
          </li>
          <li className="flex items-center gap-3">
            <span className="text-green-400">✓</span>
            10 Check-ins gesamt
          </li>
          <li className="flex items-center gap-3">
            <span className="text-green-400">✓</span>
            Modul zu 100% abschließen
          </li>
          <li className="flex items-center gap-3">
            <span className="text-green-400">✓</span>
            5 Techniken an einem Tag bestehen
          </li>
          <li className="flex items-center gap-3">
            <span className="text-green-400">✓</span>
            Instructor Bonus
          </li>
        </ul>
      </div>

      {/* Bandaid History */}
      {currentUser.streak.bandaidHistory.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Pflaster-Historie</h3>
          <div className="space-y-2">
            {currentUser.streak.bandaidHistory.slice(-5).reverse().map(event => (
              <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={event.type === 'earned' ? 'text-green-400' : 'text-red-400'}>
                    {event.type === 'earned' ? '+1 🩹' : '-1 🩹'}
                  </span>
                  <span className="text-gray-300">{event.reason}</span>
                </div>
                <span className="text-gray-500 text-sm">
                  {new Date(event.date).toLocaleDateString('de-DE')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render Requests Tab
  const renderRequests = () => {
    const pendingRequests = currentUser.examRequests.filter(r => r.status === 'pending');
    const processedRequests = currentUser.examRequests.filter(r => r.status !== 'pending');
    
    return (
      <div className="space-y-6">
        {/* Pending Requests */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">🟡 Offene Prüfungsanfragen</h3>
          {pendingRequests.length === 0 ? (
            <p className="text-gray-400">Keine offenen Anfragen</p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map(req => (
                <div key={req.id} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="font-medium text-white">{req.techniqueName}</div>
                  <div className="text-gray-400 text-sm">{req.moduleName}</div>
                  <div className="text-yellow-500 text-sm mt-2">
                    Angefragt am {new Date(req.requestedAt).toLocaleDateString('de-DE')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">📋 Abgeschlossene Anfragen</h3>
            <div className="space-y-3">
              {processedRequests.slice(-10).reverse().map(req => (
                <div key={req.id} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{req.techniqueName}</div>
                      <div className="text-gray-400 text-sm">{req.moduleName}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      req.status === 'approved' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {req.status === 'approved' ? '✅ Bestanden' : '🔄 Nachtraining'}
                    </span>
                  </div>
                  {req.feedback && (
                    <div className="mt-2 p-2 bg-gray-800 rounded text-sm text-gray-300">
                      {req.examinerName}: {req.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
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
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentUser.avatar}</span>
            <div>
              <div className="font-bold text-white">{currentUser.name}</div>
              <div className="text-sm text-gray-400">{LEVEL_DISPLAY[currentUser.currentLevel]?.subtitle || 'Beginner'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="font-bold">{currentUser.streak.currentStreak}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-4 pb-24">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'progress' && renderProgress()}
        {activeTab === 'streak' && renderStreak()}
        {activeTab === 'requests' && renderRequests()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto flex">
          {[
            { id: 'dashboard' as Tab, icon: '🏠', label: 'Dashboard' },
            { id: 'progress' as Tab, icon: '📊', label: 'Fortschritt' },
            { id: 'streak' as Tab, icon: '🔥', label: 'Streak' },
            { id: 'requests' as Tab, icon: '📝', label: 'Anfragen' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedBlock(null);
                setSelectedModule(null);
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
