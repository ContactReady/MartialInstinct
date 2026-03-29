// ============================================
// MARTIAL INSTINCT - APP CONTEXT
// ============================================

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  Member,
  Badge,
  CheckIn,
  BoardMessage,
  BoardReply,
  Notification,
  TechniqueStatus,
  TechniqueProgress,
  ModuleLevel,
  InstructorRole,
  ExamRequest,
  EXAM_PERMISSIONS,
  ContactApplication,
  InstructorApplication,
  BandaidEvent,
  InstructorLessonProgress,
  MemberQuizProgress,
  TechniqueWish,
  TrainingSession,
  TrainingGroup,
  ModuleOrder,
  ContentTechnique,
  ModuleSettings,
  QuizQuestion,
  RolePermissions,
  PermissionsConfig,
  DEFAULT_PERMISSIONS,
  PlatformTabConfig,
  DEFAULT_TAB_CONFIG,
  JoinRequest,
  CreateMemberData,
  BuddyCode,
  BuddyRequest,
} from '../types';
import { MODULE_QUIZ_DATA } from '../data/memberQuizData';
import { supabase } from '../lib/supabase';
import { MEMBERS, CHECK_INS, BOARD_MESSAGES, NOTIFICATIONS, LOCATIONS, VIDEOS, COURSES } from '../data/mockData';
import { MODULES, BLOCKS, getAllTechniques, getModuleById } from '../data/modules';

// ============================================
// CONTEXT TYPE
// ============================================

interface AppContextType {
  // State
  currentUser: Member | null;
  members: Member[];
  checkIns: CheckIn[];
  boardMessages: BoardMessage[];
  notifications: Notification[];
  darkMode: boolean;
  
  // Auth
  login: (email: string, password: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  
  // Check-ins
  requestCheckIn: () => void;
  approveCheckIn: (checkInId: string) => void;
  rejectCheckIn: (checkInId: string) => void;
  checkOut: (memberId: string) => void;
  
  // Exam Requests
  requestExam: (techniqueId: string) => void;
  approveExam: (memberId: string, requestId: string, feedback?: string) => void;
  rejectExam: (memberId: string, requestId: string, feedback: string) => void;
  
  // Technique Status
  canExamineLevel: (level: ModuleLevel) => boolean;
  logPractice: (techniqueId: string) => void;
  markTechniquePassed: (memberId: string, techniqueId: string, notes?: string) => void;
  
  // Contact Application
  submitContactApplication: (answers: ContactApplication['answers']) => void;
  approveContactApplication: (memberId: string, feedback?: string) => void;
  rejectContactApplication: (memberId: string, feedback: string) => void;
  
  // Instructor Application
  submitInstructorApplication: (answers: InstructorApplication['answers'], type: 'assistant_instructor' | 'instructor_level') => void;
  approveInstructorApplication: (memberId: string, feedback?: string) => void;
  rejectInstructorApplication: (memberId: string, feedback: string) => void;
  
  // Get applications
  getPendingContactApplications: () => Member[];
  getPendingInstructorApplications: () => Member[];
  
  // Streak & Bandaids
  useBandaid: () => void;
  awardBandaid: (memberId: string, reason: string) => void;
  
  // Board Messages
  sendBoardMessage: (
    content: string,
    visibility: 'public' | 'restricted',
    targetType: 'none' | 'roles' | 'members',
    targetRoles?: InstructorRole[],
    targetMemberIds?: string[]
  ) => void;
  addBoardReply: (messageId: string, content: string) => void;
  markBoardMessageRead: (messageId: string) => void;
  sendReadReminder: (messageId: string, memberId: string) => void;
  updateNotificationPrefs: (prefs: { sound: boolean; email: boolean }) => void;

  // Rechte-Matrix
  permissionsConfig: PermissionsConfig;
  updatePermissionsConfig: (config: PermissionsConfig) => void;
  hasPermission: (permission: keyof RolePermissions) => boolean;

  // Tab-Verwaltung
  tabConfig: PlatformTabConfig;
  updateTabConfig: (config: PlatformTabConfig) => void;

  // Notifications
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // Instructor Notes
  addInstructorNote: (memberId: string, content: string) => void;
  
  // Instructor Learning
  completeInstructorLesson: (lessonId: string, quizScore?: number) => void;
  getInstructorProgress: (memberId: string) => Record<string, InstructorLessonProgress>;

  // XP & Member Quiz
  awardXP: (amount: number) => void;
  completeModuleQuiz: (moduleId: string, score: number, xpEarned: number) => void;

  // Theme
  toggleDarkMode: () => void;

  // Profile
  updateProfile: (email: string, password: string) => void;
  updateProfileImage: (base64: string) => void;
  computeBadges: (member: Member) => Badge[];

  // Admin
  updateMemberRole: (memberId: string, role: InstructorRole) => void;
  updateAdminAccess: (memberId: string, hasAccess: boolean) => void;
  restoreStreak: (memberId: string, streakValue: number, reason: string) => void;

  // Modul-Reihenfolge
  moduleOrder: ModuleOrder[];
  getOrderedModules: () => typeof MODULES;
  saveModuleOrder: (orders: ModuleOrder[]) => Promise<void>;

  // Content Management (Techniken + Quiz)
  contentTechniques: ContentTechnique[];
  quizQuestions: QuizQuestion[];
  moduleSettings: Record<string, ModuleSettings>;
  getTechniquesForModule: (moduleId: string) => ContentTechnique[];
  getQuizQuestionsForModule: (moduleId: string) => QuizQuestion[];
  getQuizCountForModule: (moduleId: string) => number;
  saveTechnique: (t: ContentTechnique) => Promise<void>;
  deleteTechnique: (id: string) => Promise<void>;
  reorderTechniques: (moduleId: string, orderedIds: string[]) => Promise<void>;
  saveQuizQuestion: (q: QuizQuestion & { moduleId: string }) => Promise<void>;
  deleteQuizQuestion: (id: string) => Promise<void>;
  reorderQuizQuestions: (moduleId: string, orderedIds: string[]) => Promise<void>;
  saveModuleSettings: (moduleId: string, quizCount: number) => Promise<void>;

  // Helpers
  // Trainingsreport
  trainingSessions: TrainingSession[];
  completeTrainingSession: (attendeeIds: string[], groups: TrainingGroup[], notes?: string, courseId?: string, courseName?: string) => void;
  getSessionsForMember: (memberId: string) => TrainingSession[];

  // Wunschtechniken
  techniqueWishes: TechniqueWish[];
  submitTechniqueWish: (techniqueId: string, techniqueName: string, moduleId: string, moduleName: string) => void;
  acknowledgeWish: (wishId: string) => void;
  getPendingTechniqueWishes: () => TechniqueWish[];

  // Join Requests (QR-Code Onboarding)
  joinRequests: JoinRequest[];
  submitJoinRequest: (name: string, email: string, memberIdHint?: string, course?: string) => void;
  createMemberFromRequest: (data: CreateMemberData) => void;
  rejectJoinRequest: (id: string) => void;
  updateStopTheBleed: (memberId: string, certified: boolean) => void;
  updateCustomBadge: (badge: string) => void;
  updateVisibilityPreference: (pref: 'all' | 'buddies') => void;
  updateAnzeigename: (name: string) => { ok: boolean; error?: string };
  updateDataVisibility: (prefs: NonNullable<Member['dataVisibility']>) => void;
  updateMemberCoreData: (memberId: string, data: { name?: string; firstName?: string; lastName?: string; birthDate?: string; memberId?: string }) => void;
  connectWithCode: (code: string) => { success: boolean; memberName?: string };

  // Buddy System
  generateBuddyCode: () => string;
  sendBuddyRequest: (code: string) => { ok: boolean; error?: string };
  acceptBuddyRequest: (requestId: string) => void;
  getPendingBuddyRequests: () => BuddyRequest[];
  getBuddies: () => Member[];

  getMemberById: (id: string) => Member | undefined;
  getCheckedInMembers: () => Member[];
  getOnlineMembers: () => Member[];
  getPendingCheckIns: () => CheckIn[];
  getPendingExamRequests: () => ExamRequest[];
  getMemberProgress: (memberId: string) => { total: number; completed: number; percentage: number };
  getModuleProgress: (memberId: string, moduleId: string) => { total: number; completed: number; percentage: number };
  getBlockProgress: (memberId: string, blockLevel: ModuleLevel) => { total: number; completed: number; percentage: number };
  isBlockUnlocked: (memberId: string, blockLevel: ModuleLevel) => boolean;
}

// ============================================
// CONTEXT
// ============================================

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(CHECK_INS);
  const [boardMessages, setBoardMessages] = useState<BoardMessage[]>(BOARD_MESSAGES);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('mi-theme');
    return saved !== null ? saved === 'dark' : true; // Standard: Dunkel
  });
  const [techniqueWishes, setTechniqueWishes] = useState<TechniqueWish[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [moduleOrder, setModuleOrder] = useState<ModuleOrder[]>([]);
  const [contentTechniques, setContentTechniques] = useState<ContentTechnique[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [moduleSettings, setModuleSettings] = useState<Record<string, ModuleSettings>>({});
  const [permissionsConfig, setPermissionsConfig] = useState<PermissionsConfig>(() => {
    try {
      const saved = localStorage.getItem('mi-permissions-config');
      return saved ? JSON.parse(saved) : DEFAULT_PERMISSIONS;
    } catch { return DEFAULT_PERMISSIONS; }
  });
  const [tabConfig, setTabConfig] = useState<PlatformTabConfig>(() => {
    try {
      const saved = localStorage.getItem('mi-tab-config');
      return saved ? JSON.parse(saved) : DEFAULT_TAB_CONFIG;
    } catch { return DEFAULT_TAB_CONFIG; }
  });
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(() => {
    try {
      const saved = localStorage.getItem('mi-join-requests');
      if (!saved) return [];
      return JSON.parse(saved).map((r: JoinRequest) => ({ ...r, submittedAt: new Date(r.submittedAt), processedAt: r.processedAt ? new Date(r.processedAt) : undefined }));
    } catch { return []; }
  });

  // Beim Start: Modulreihenfolge aus Supabase laden
  // SQL: CREATE TABLE module_order (module_id text PRIMARY KEY, block_level text NOT NULL, position integer NOT NULL);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('module_order')
          .select('module_id, block_level, position');
        if (data && data.length > 0) {
          setModuleOrder(data.map((r: { module_id: string; block_level: string; position: number }) => ({
            moduleId: r.module_id,
            blockLevel: r.block_level,
            position: r.position
          })));
        }
      } catch (_) { /* Fallback auf hardcoded Reihenfolge */ }
    })();
  }, []);

  // Beim Start: Lerninhalte (Techniken + Quiz) aus Supabase laden
  // Mit localStorage-Cache für Offline-Betrieb, Fallback auf hardcoded Daten
  useEffect(() => {
    const CACHE_KEY = 'mi_content_v1';

    const mapTech = (r: { id: string; module_id: string; name: string; description: string; is_required: boolean; position: number }): ContentTechnique => ({
      id: r.id, moduleId: r.module_id, name: r.name, description: r.description ?? '', isRequired: r.is_required, position: r.position
    });
    const mapQ = (r: { id: string; module_id: string; question: string; options: string[]; correct_index: number; explanation: string; position: number }): QuizQuestion => ({
      id: r.id, moduleId: r.module_id, question: r.question, options: r.options, correctIndex: r.correct_index, explanation: r.explanation ?? '', position: r.position
    });

    const buildHardcoded = () => {
      const techniques: ContentTechnique[] = [];
      MODULES.forEach(mod => mod.techniques.forEach(t => techniques.push({ id: t.id, moduleId: t.moduleId, name: t.name, description: t.description, isRequired: t.isRequired, position: t.order })));
      const questions: QuizQuestion[] = [];
      Object.entries(MODULE_QUIZ_DATA).forEach(([moduleId, qs]) => qs.forEach((q, i) => questions.push({ id: q.id, moduleId, question: q.question, options: q.options, correctIndex: q.correctIndex, explanation: q.explanation ?? '', position: i })));
      return { techniques, questions };
    };

    (async () => {
      try {
        const [techRes, quizRes, settRes] = await Promise.all([
          supabase.from('content_techniques').select('*').order('module_id').order('position'),
          supabase.from('content_quiz_questions').select('*').order('module_id').order('position'),
          supabase.from('module_settings').select('*'),
        ]);

        let techniques: ContentTechnique[] = (techRes.data ?? []).map(mapTech);
        let questions: QuizQuestion[] = (quizRes.data ?? []).map(mapQ);
        const settings: Record<string, ModuleSettings> = {};
        (settRes.data ?? []).forEach((r: { module_id: string; quiz_count: number }) => { settings[r.module_id] = { moduleId: r.module_id, quizCount: r.quiz_count }; });

        // Auto-Seed: falls Tabellen leer, hardcoded Daten einspielen
        if (techniques.length === 0) {
          const { techniques: fallT } = buildHardcoded();
          await supabase.from('content_techniques').insert(fallT.map(t => ({ id: t.id, module_id: t.moduleId, name: t.name, description: t.description, is_required: t.isRequired, position: t.position })));
          techniques = fallT;
        }
        if (questions.length === 0) {
          const { questions: fallQ } = buildHardcoded();
          await supabase.from('content_quiz_questions').insert(fallQ.map(q => ({ module_id: q.moduleId, question: q.question, options: q.options, correct_index: q.correctIndex, explanation: q.explanation ?? '', position: q.position ?? 0 })));
          const { data: freshQ } = await supabase.from('content_quiz_questions').select('*').order('module_id').order('position');
          questions = (freshQ ?? []).map(mapQ);
        }

        setContentTechniques(techniques);
        setQuizQuestions(questions);
        setModuleSettings(settings);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ techniques, questions, settings }));
      } catch (_) {
        // Offline: localStorage-Cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const { techniques, questions, settings } = JSON.parse(cached) as { techniques: ContentTechnique[]; questions: QuizQuestion[]; settings: Record<string, ModuleSettings> };
            setContentTechniques(techniques);
            setQuizQuestions(questions);
            setModuleSettings(settings);
            return;
          } catch (_) { /* ignore parse errors */ }
        }
        // Letzter Fallback: hardcoded
        const { techniques, questions } = buildHardcoded();
        setContentTechniques(techniques);
        setQuizQuestions(questions);
      }
    })();
  }, []);

  // ============================================
  // AUTH
  // ============================================

  const login = useCallback((email: string, password: string): boolean => {
    const member = members.find(m => m.email === email && m.password === password);
    if (member) {
      const now = new Date();
      const online = { ...member, onlineSince: now, lastSeenAt: now };
      setMembers(prev => prev.map(m => m.id === member.id ? online : m));
      setCurrentUser(online);
      return true;
    }
    return false;
  }, [members]);

  const logout = useCallback(() => {
    if (currentUser) {
      // Online-Status löschen beim Logout
      setMembers(prev => prev.map(m =>
        m.id === currentUser.id ? { ...m, onlineSince: undefined } : m
      ));
    }
    setCurrentUser(null);
  }, [currentUser]);

  const switchUser = useCallback((userId: string) => {
    // Vorherigen User offline setzen
    if (currentUser) {
      setMembers(prev => prev.map(m =>
        m.id === currentUser.id ? { ...m, onlineSince: undefined } : m
      ));
    }
    const member = members.find(m => m.id === userId);
    if (member) {
      const now = new Date();
      const online = { ...member, onlineSince: now, lastSeenAt: now };
      setMembers(prev => prev.map(m => m.id === userId ? online : m));
      setCurrentUser(online);
    }
  }, [members, currentUser]);

  // Heartbeat: lastSeenAt alle 60s aktualisieren (→ "online" = < 3 Min)
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      const now = new Date();
      setMembers(prev => prev.map(m =>
        m.id === currentUser.id ? { ...m, lastSeenAt: now } : m
      ));
      setCurrentUser(prev => prev ? { ...prev, lastSeenAt: now } : null);
    }, 60_000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  // ============================================
  // CHECK-INS
  // ============================================

  const requestCheckIn = useCallback(() => {
    if (!currentUser) return;

    // Guard: kein doppelter Check-in für heute
    const todayStr = new Date().toDateString();
    setCheckIns(prev => {
      const alreadyExists = prev.some(
        c => c.memberId === currentUser.id &&
             new Date(c.requestedAt).toDateString() === todayStr &&
             (c.status === 'pending' || c.status === 'approved')
      );
      if (alreadyExists) return prev;

      const newCheckIn: CheckIn = {
        id: `checkin-${Date.now()}`,
        memberId: currentUser.id,
        memberName: currentUser.name,
        locationId: currentUser.locationId,
        requestedAt: new Date(),
        status: 'pending'
      };

      // Notify instructors
      const instructorNotification: Notification = {
        id: `notif-checkin-${Date.now()}`,
        oduserId: 'all-instructors',
        type: 'checkin',
        title: 'Check-in Anfrage',
        message: `${currentUser.name} möchte einchecken`,
        read: false,
        createdAt: new Date()
      };
      setNotifications(n => [...n, instructorNotification]);

      return [...prev, newCheckIn];
    });
  }, [currentUser]);

  const approveCheckIn = useCallback((checkInId: string) => {
    if (!currentUser) return;

    const approvedAt = new Date();

    // Finde den CheckIn im aktuellen State
    setCheckIns(prev => {
      const checkIn = prev.find(c => c.id === checkInId);
      if (!checkIn) return prev;

      const updatedCheckIns = prev.map(c =>
        c.id === checkInId
          ? { ...c, status: 'approved' as const, approvedById: currentUser.id, approvedByName: currentUser.name, approvedAt }
          : c
      );

      // Member-State + currentUser-State aktualisieren
      const updateMember = (m: import('../types').Member) =>
        m.id === checkIn.memberId
          ? {
              ...m,
              isCheckedIn: true,
              checkedInAt: approvedAt,
              lastSeenAt: approvedAt,
              streak: {
                ...m.streak,
                lastTrainingDate: approvedAt,
                currentStreak: m.streak.currentStreak + 1,
                longestStreak: Math.max(m.streak.longestStreak, m.streak.currentStreak + 1)
              }
            }
          : m;

      setMembers(prev => prev.map(updateMember));
      setCurrentUser(prev => prev ? updateMember(prev) : null);

      // Member-Benachrichtigung
      const memberNotification: Notification = {
        id: `notif-approved-${Date.now()}`,
        oduserId: checkIn.memberId,
        type: 'checkin',
        title: 'Eingecheckt!',
        message: `Du wurdest um ${approvedAt.getHours().toString().padStart(2,'0')}:${approvedAt.getMinutes().toString().padStart(2,'0')} Uhr eingecheckt. Viel Erfolg!`,
        read: false,
        createdAt: approvedAt
      };
      setNotifications(n => [...n, memberNotification]);

      return updatedCheckIns;
    });
  }, [currentUser]);

  const rejectCheckIn = useCallback((checkInId: string) => {
    setCheckIns(prev => prev.map(c => 
      c.id === checkInId 
        ? { ...c, status: 'rejected' as const }
        : c
    ));
  }, []);

  const checkOut = useCallback((memberId: string) => {
    setMembers(prev => prev.map(m => 
      m.id === memberId
        ? { ...m, isCheckedIn: false, checkedInAt: undefined }
        : m
    ));
    setCheckIns(prev => prev.filter(c => c.memberId !== memberId || c.status !== 'approved'));
  }, []);

  // ============================================
  // EXAM REQUESTS
  // ============================================

  const requestExam = useCallback((techniqueId: string) => {
    if (!currentUser) return;

    const technique = getAllTechniques().find(t => t.id === techniqueId);
    const module = technique ? getModuleById(technique.moduleId) : undefined;
    if (!technique || !module) return;

    const currentStatus = currentUser.techniqueProgress[techniqueId]?.status ?? 'not_tested';
    const practiceCount = currentUser.techniqueProgress[techniqueId]?.practiceCount ?? 0;
    const MIN_PRACTICE = 5;

    // Guard: keine neue Anfrage wenn pending oder vollständig bestanden
    if (currentStatus === 'tech_pending' || currentStatus === 'tac_pending' || currentStatus === 'tac_passed') return;
    // Guard: needs_training → erst nach genug Nachtraining erneut anfragen
    if (currentStatus === 'needs_training' && practiceCount < MIN_PRACTICE) return;

    // Auto-Erkennung: welche Ebene kommt als nächstes?
    const examLevel: 'technical' | 'tactical' =
      currentStatus === 'tech_passed' ? 'tactical' : 'technical';

    const pendingStatus: TechniqueStatus =
      examLevel === 'technical' ? 'tech_pending' : 'tac_pending';

    const newRequest: ExamRequest = {
      id: `exam-${Date.now()}`,
      memberId: currentUser.id,
      memberName: currentUser.name,
      techniqueId,
      techniqueName: technique.name,
      moduleId: module.id,
      moduleName: module.name,
      examLevel,
      requestedAt: new Date(),
      status: 'pending',
    };

    const updateMember = (m: Member): Member => ({
      ...m,
      examRequests: [...m.examRequests, newRequest],
      techniqueProgress: {
        ...m.techniqueProgress,
        [techniqueId]: {
          ...m.techniqueProgress[techniqueId],
          techniqueId,
          status: pendingStatus,
        },
      },
    });

    setMembers(prev => prev.map(m => m.id === currentUser.id ? updateMember(m) : m));
    setCurrentUser(prev => prev ? updateMember(prev) : null);
  }, [currentUser]);

  const approveExam = useCallback((memberId: string, requestId: string, feedback?: string) => {
    if (!currentUser) return;

    const member = members.find(m => m.id === memberId);
    const request = member?.examRequests.find(r => r.id === requestId);
    if (!member || !request) return;

    const now = new Date();
    const isTechnical = request.examLevel === 'technical';
    const newStatus: TechniqueStatus = isTechnical ? 'tech_passed' : 'tac_passed';

    const prevProgress = member.techniqueProgress[request.techniqueId] ?? { techniqueId: request.techniqueId, status: 'not_tested' as TechniqueStatus };

    const updatedProgress: TechniqueProgress = {
      ...prevProgress,
      status: newStatus,
      lastFeedback: feedback,
      ...(isTechnical
        ? { techPassedAt: now, techExaminerId: currentUser.id, techExaminerName: currentUser.name }
        : { tacPassedAt: now, tacExaminerId: currentUser.id, tacExaminerName: currentUser.name }
      ),
    };

    const applyApprove = (m: Member): Member => ({
      ...m,
      examRequests: m.examRequests.map(r =>
        r.id === requestId
          ? { ...r, status: 'passed' as const, examinerId: currentUser.id, examinerName: currentUser.name, feedback, processedAt: now }
          : r
      ),
      techniqueProgress: { ...m.techniqueProgress, [request.techniqueId]: updatedProgress },
    });

    setMembers(prev => prev.map(m => m.id === memberId ? applyApprove(m) : m));
    if (currentUser.id === memberId) setCurrentUser(prev => prev ? applyApprove(prev) : null);

    const levelLabel = isTechnical ? 'Technisch' : 'Taktisch';
    setNotifications(prev => [...prev, {
      id: `notif-${Date.now()}`,
      oduserId: memberId,
      type: 'exam_result' as const,
      title: `✅ ${levelLabel} bestanden!`,
      message: `${request.techniqueName} — ${currentUser.name}: "${feedback}"`,
      read: false,
      createdAt: now,
    }]);
  }, [currentUser, members]);

  const rejectExam = useCallback((memberId: string, requestId: string, feedback: string) => {
    if (!currentUser) return;

    const member = members.find(m => m.id === memberId);
    const request = member?.examRequests.find(r => r.id === requestId);
    if (!member || !request) return;

    const now = new Date();
    const isTechnical = request.examLevel === 'technical';
    const prevProgress = member.techniqueProgress[request.techniqueId] ?? { techniqueId: request.techniqueId, status: 'not_tested' as TechniqueStatus };

    // Taktische Ablehnung: tech_passed bleibt erhalten, nur Status auf needs_training
    const updatedProgress: TechniqueProgress = {
      ...prevProgress,
      status: 'needs_training',
      lastFeedback: feedback,
      // Bei Ablehnung der technischen Ebene: alle Tech-Felder zurücksetzen
      ...(isTechnical ? { techPassedAt: undefined, techExaminerId: undefined, techExaminerName: undefined } : {}),
    };

    const applyReject = (m: Member): Member => ({
      ...m,
      examRequests: m.examRequests.map(r =>
        r.id === requestId
          ? { ...r, status: 'needs_training' as const, examinerId: currentUser.id, examinerName: currentUser.name, feedback, processedAt: now }
          : r
      ),
      techniqueProgress: { ...m.techniqueProgress, [request.techniqueId]: updatedProgress },
    });

    setMembers(prev => prev.map(m => m.id === memberId ? applyReject(m) : m));
    if (currentUser.id === memberId) setCurrentUser(prev => prev ? applyReject(prev) : null);

    setNotifications(prev => [...prev, {
      id: `notif-${Date.now()}`,
      oduserId: memberId,
      type: 'exam_result' as const,
      title: '↩ Nachtraining empfohlen',
      message: `${request.techniqueName} — ${currentUser.name}: "${feedback}"`,
      read: false,
      createdAt: now,
    }]);
  }, [currentUser, members]);

  const canExamineLevel = useCallback((level: ModuleLevel): boolean => {
    if (!currentUser) return false;
    return EXAM_PERMISSIONS[currentUser.role].includes(level);
  }, [currentUser]);

  const logPractice = useCallback((techniqueId: string) => {
    if (!currentUser) return;
    const todayStr = new Date().toDateString();

    const applyLog = (m: Member): Member => {
      const prog = m.techniqueProgress[techniqueId];
      // Tages-Limit: Selbst-Markierung max 1× pro Tag
      if (prog?.lastSelfPracticedAt && new Date(prog.lastSelfPracticedAt).toDateString() === todayStr) return m;
      const now = new Date();
      return {
        ...m,
        techniqueProgress: {
          ...m.techniqueProgress,
          [techniqueId]: {
            ...prog,
            techniqueId,
            status: prog?.status || 'not_tested',
            practiceCount: (prog?.practiceCount ?? 0) + 1,
            lastPracticedAt: now,
            lastSelfPracticedAt: now,
          }
        }
      };
    };

    setMembers(prev => prev.map(m => m.id === currentUser.id ? applyLog(m) : m));
    setCurrentUser(prev => prev ? applyLog(prev) : null);
  }, [currentUser]);

  const markTechniquePassed = useCallback((memberId: string, techniqueId: string, notes?: string) => {
    if (!currentUser) return;
    const technique = getAllTechniques().find(t => t.id === techniqueId);
    if (!technique) return;

    const now = new Date();
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      const prev_ = m.techniqueProgress[techniqueId];
      return {
        ...m,
        techniqueProgress: {
          ...m.techniqueProgress,
          [techniqueId]: {
            ...prev_,
            techniqueId,
            status: 'tac_passed' as TechniqueStatus,
            lastFeedback: notes,
            techPassedAt: prev_?.techPassedAt ?? now,
            techExaminerId: prev_?.techExaminerId ?? currentUser.id,
            techExaminerName: prev_?.techExaminerName ?? currentUser.name,
            tacPassedAt: now,
            tacExaminerId: currentUser.id,
            tacExaminerName: currentUser.name,
            practiceCount: prev_?.practiceCount,
            lastPracticedAt: prev_?.lastPracticedAt,
          },
        },
      };
    }));

    const memberNotification: Notification = {
      id: `notif-${Date.now()}`,
      oduserId: memberId,
      type: 'exam_result',
      title: 'Technik bestanden! ✅',
      message: `${technique.name} wurde von ${currentUser.name} als bestanden markiert.`,
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, memberNotification]);
  }, [currentUser]);

  // ============================================
  // CONTACT APPLICATION
  // ============================================

  const submitContactApplication = useCallback((answers: ContactApplication['answers']) => {
    if (!currentUser) return;
    
    const application: ContactApplication = {
      id: `app-${Date.now()}`,
      memberId: currentUser.id,
      status: 'pending',
      submittedAt: new Date(),
      answers
    };
    
    setMembers(prev => prev.map(m => 
      m.id === currentUser.id
        ? { ...m, contactApplication: application }
        : m
    ));
    
    setCurrentUser(prev => prev ? { ...prev, contactApplication: application } : null);
  }, [currentUser]);

  const approveContactApplication = useCallback((memberId: string, feedback?: string) => {
    if (!currentUser) return;
    
    setMembers(prev => prev.map(m => 
      m.id === memberId && m.contactApplication
        ? {
            ...m,
            contactApplication: {
              ...m.contactApplication,
              status: 'approved',
              processedAt: new Date(),
              processedBy: currentUser.id,
              feedback
            },
            currentLevel: 'contact' as ModuleLevel
          }
        : m
    ));
    
    // Notify member
    const memberNotification: Notification = {
      id: `notif-${Date.now()}`,
      oduserId: memberId,
      type: 'application',
      title: 'Bewerbung angenommen! 🎉',
      message: 'Willkommen bei CONTACT READY - Operator Level!',
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, memberNotification]);
  }, [currentUser]);

  const rejectContactApplication = useCallback((memberId: string, feedback: string) => {
    if (!currentUser) return;
    
    setMembers(prev => prev.map(m => 
      m.id === memberId && m.contactApplication
        ? {
            ...m,
            contactApplication: {
              ...m.contactApplication,
              status: 'rejected',
              processedAt: new Date(),
              processedBy: currentUser.id,
              feedback
            }
          }
        : m
    ));
    
    // Notify member
    const memberNotification: Notification = {
      id: `notif-${Date.now()}`,
      oduserId: memberId,
      type: 'application',
      title: 'Bewerbung abgelehnt',
      message: feedback,
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, memberNotification]);
  }, [currentUser]);

  // ============================================
  // INSTRUCTOR APPLICATION
  // ============================================

  const submitInstructorApplication = useCallback((answers: InstructorApplication['answers'], type: 'assistant_instructor' | 'instructor_level') => {
    if (!currentUser) return;
    
    const application: InstructorApplication = {
      id: `app-inst-${Date.now()}`,
      memberId: currentUser.id,
      type,
      status: 'pending',
      submittedAt: new Date(),
      answers
    };
    
    setMembers(prev => prev.map(m => 
      m.id === currentUser.id
        ? { ...m, assistantInstructorApplication: application }
        : m
    ));
    
    setCurrentUser(prev => prev ? { ...prev, assistantInstructorApplication: application } : null);
    
    // Notify owners
    const ownerNotification: Notification = {
      id: `notif-${Date.now()}`,
      oduserId: 'all-owners',
      type: 'application',
      title: 'Neue Instructor-Bewerbung',
      message: `${currentUser.name} möchte ${type === 'assistant_instructor' ? 'Assistant Instructor' : 'Instructor'} werden`,
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, ownerNotification]);
  }, [currentUser]);

  const approveInstructorApplication = useCallback((memberId: string, feedback?: string) => {
    if (!currentUser) return;

    setMembers(prev => prev.map(m =>
      m.id === memberId && m.assistantInstructorApplication
        ? {
            ...m,
            assistantInstructorApplication: {
              ...m.assistantInstructorApplication,
              status: 'approved',
              processedAt: new Date(),
              processedBy: currentUser.id,
              feedback
            }
            // Keine automatische Rollenänderung — Admin entscheidet separat
          }
        : m
    ));
    
    // Notify member
    const memberNotification: Notification = {
      id: `notif-${Date.now()}`,
      oduserId: memberId,
      type: 'application',
      title: 'Bewerbung angenommen! 🎓',
      message: 'Willkommen im Team! Du bist jetzt Assistant Instructor!',
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, memberNotification]);
  }, [currentUser]);

  const rejectInstructorApplication = useCallback((memberId: string, feedback: string) => {
    if (!currentUser) return;
    
    setMembers(prev => prev.map(m => 
      m.id === memberId && m.assistantInstructorApplication
        ? {
            ...m,
            assistantInstructorApplication: {
              ...m.assistantInstructorApplication,
              status: 'rejected',
              processedAt: new Date(),
              processedBy: currentUser.id,
              feedback
            }
          }
        : m
    ));
    
    // Notify member
    const memberNotification: Notification = {
      id: `notif-${Date.now()}`,
      oduserId: memberId,
      type: 'application',
      title: 'Instructor-Bewerbung abgelehnt',
      message: feedback,
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, memberNotification]);
  }, [currentUser]);

  const getPendingContactApplications = useCallback((): Member[] => {
    return members.filter(m => m.contactApplication?.status === 'pending');
  }, [members]);

  const getPendingInstructorApplications = useCallback((): Member[] => {
    return members.filter(m => m.assistantInstructorApplication?.status === 'pending');
  }, [members]);

  // ============================================
  // STREAK & BANDAIDS
  // ============================================

  const useBandaid = useCallback(() => {
    if (!currentUser || currentUser.streak.bandaids <= 0) return;
    
    const event: BandaidEvent = {
      id: `bandaid-${Date.now()}`,
      type: 'used',
      reason: 'Streak gerettet',
      date: new Date()
    };
    
    setMembers(prev => prev.map(m => 
      m.id === currentUser.id
        ? {
            ...m,
            streak: {
              ...m.streak,
              bandaids: m.streak.bandaids - 1,
              bandaidHistory: [...m.streak.bandaidHistory, event]
            }
          }
        : m
    ));
    
    setCurrentUser(prev => prev ? {
      ...prev,
      streak: {
        ...prev.streak,
        bandaids: prev.streak.bandaids - 1,
        bandaidHistory: [...prev.streak.bandaidHistory, event]
      }
    } : null);
  }, [currentUser]);

  const awardBandaid = useCallback((memberId: string, reason: string) => {
    const event: BandaidEvent = {
      id: `bandaid-${Date.now()}`,
      type: 'earned',
      reason,
      date: new Date()
    };
    
    setMembers(prev => prev.map(m => 
      m.id === memberId
        ? {
            ...m,
            streak: {
              ...m.streak,
              bandaids: Math.min(m.streak.bandaids + 1, m.streak.maxBandaids),
              bandaidHistory: [...m.streak.bandaidHistory, event]
            }
          }
        : m
    ));
    
    // Notify member
    const memberNotification: Notification = {
      id: `notif-${Date.now()}`,
      oduserId: memberId,
      type: 'bandaid',
      title: 'Pflaster erhalten! 🩹',
      message: reason,
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, memberNotification]);
  }, []);

  // ============================================
  // BOARD MESSAGES
  // ============================================

  const sendBoardMessage = useCallback((
    content: string,
    visibility: 'public' | 'restricted',
    targetType: 'none' | 'roles' | 'members',
    targetRoles?: InstructorRole[],
    targetMemberIds?: string[]
  ) => {
    if (!currentUser) return;

    const newMessage: BoardMessage = {
      id: `msg-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content,
      createdAt: new Date(),
      locationId: currentUser.locationId,
      visibility,
      targetType,
      ...(targetRoles && targetRoles.length > 0 ? { targetRoles } : {}),
      ...(targetMemberIds && targetMemberIds.length > 0 ? { targetMemberIds } : {}),
      readBy: [currentUser.id], // Autor hat es "gelesen"
      replies: [],
    };

    setBoardMessages(prev => [...prev, newMessage]);

    // Benachrichtigungen: Admins IMMER + explizite Targets
    const instructorRoles: InstructorRole[] = ['assistant_instructor', 'instructor', 'full_instructor', 'head_instructor', 'admin'];
    const allInstructors = members.filter(m => instructorRoles.includes(m.role) && m.id !== currentUser.id);

    // Basis-Empfänger: alle Admins (immer)
    const adminRecipients = allInstructors.filter(m => m.role === 'admin');
    // Explizite Targets (wenn vorhanden)
    let targetRecipients: typeof allInstructors = [];
    if (targetType === 'roles' && targetRoles && targetRoles.length > 0) {
      targetRecipients = allInstructors.filter(m => targetRoles.includes(m.role) && m.role !== 'admin');
    } else if (targetType === 'members' && targetMemberIds && targetMemberIds.length > 0) {
      targetRecipients = allInstructors.filter(m => targetMemberIds.includes(m.id) && m.role !== 'admin');
    }
    // Union (ohne Duplikate)
    const recipientIds = new Set([...adminRecipients.map(m => m.id), ...targetRecipients.map(m => m.id)]);
    const recipients = allInstructors.filter(m => recipientIds.has(m.id));

    if (recipients.length > 0) {
      const newNotifs = recipients.map(m => ({
        id: `notif-board-${Date.now()}-${m.id}`,
        oduserId: m.id,
        type: 'board' as const,
        title: `📌 Board: ${currentUser.name}`,
        message: content.length > 60 ? content.slice(0, 60) + '…' : content,
        read: false,
        createdAt: new Date(),
        data: { boardMessageId: newMessage.id }
      }));
      setNotifications(prev => [...prev, ...newNotifs]);
    }
  }, [currentUser, members]);

  const addBoardReply = useCallback((messageId: string, content: string) => {
    if (!currentUser) return;
    const reply: BoardReply = {
      id: `reply-${Date.now()}`,
      parentId: messageId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content,
      createdAt: new Date(),
    };
    setBoardMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? {
            ...msg,
            replies: [...(msg.replies ?? []), reply],
            // Antworten = automatisch Lesebestätigung
            readBy: Array.from(new Set([...(msg.readBy ?? []), currentUser.id])),
          }
        : msg
    ));
  }, [currentUser]);

  const markBoardMessageRead = useCallback((messageId: string) => {
    if (!currentUser) return;
    setBoardMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, readBy: Array.from(new Set([...(msg.readBy ?? []), currentUser.id])) }
        : msg
    ));
  }, [currentUser]);

  const sendReadReminder = useCallback((messageId: string, targetMemberId: string) => {
    if (!currentUser) return;
    const msg = boardMessages.find(m => m.id === messageId);
    if (!msg) return;
    const notif: Notification = {
      id: `notif-reminder-${Date.now()}-${targetMemberId}`,
      oduserId: targetMemberId,
      type: 'board' as const,
      title: '📌 Erinnerung: Board-Nachricht',
      message: `${currentUser.name} bittet dich, eine Board-Nachricht zu lesen.`,
      read: false,
      createdAt: new Date(),
      data: { boardMessageId: messageId }
    };
    setNotifications(prev => [...prev, notif]);
  }, [currentUser, boardMessages]);

  const hasPermission = useCallback((permission: keyof RolePermissions): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return permissionsConfig[currentUser.role]?.[permission] ?? false;
  }, [currentUser, permissionsConfig]);

  const updatePermissionsConfig = useCallback((config: PermissionsConfig) => {
    setPermissionsConfig(config);
    localStorage.setItem('mi-permissions-config', JSON.stringify(config));
  }, []);

  const updateTabConfig = useCallback((config: PlatformTabConfig) => {
    setTabConfig(config);
    localStorage.setItem('mi-tab-config', JSON.stringify(config));
  }, []);

  const updateNotificationPrefs = useCallback((prefs: { sound: boolean; email: boolean }) => {
    if (!currentUser) return;
    setMembers(prev => prev.map(m =>
      m.id === currentUser.id ? { ...m, notificationPrefs: prefs } : m
    ));
    setCurrentUser(prev => prev ? { ...prev, notificationPrefs: prefs } : null);
  }, [currentUser]);

  // ============================================
  // NOTIFICATIONS
  // ============================================

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  }, []);

  const clearNotifications = useCallback(() => {
    if (!currentUser) return;
    setNotifications(prev => prev.filter(n => n.oduserId !== currentUser.id));
  }, [currentUser]);

  // ============================================
  // INSTRUCTOR NOTES
  // ============================================

  const addInstructorNote = useCallback((memberId: string, content: string) => {
    if (!currentUser) return;
    
    const note = {
      id: `note-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      content,
      createdAt: new Date()
    };
    
    setMembers(prev => prev.map(m => 
      m.id === memberId
        ? { ...m, instructorNotes: [...(m.instructorNotes || []), note] }
        : m
    ));
  }, [currentUser]);

  // ============================================
  // TRAININGSREPORT
  // ============================================

  const XP_PER_TRAINED_TECHNIQUE = 10;

  const completeTrainingSession = useCallback((
    attendeeIds: string[],
    groups: TrainingGroup[],
    notes?: string,
    courseId?: string,
    courseName?: string
  ) => {
    if (!currentUser) return;
    const now = new Date();

    const session: TrainingSession = {
      id: `session-${Date.now()}`,
      locationId: currentUser.locationId,
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      courseId,
      courseName,
      date: now,
      attendeeIds,
      groups,
      notes,
      createdAt: now,
      status: 'completed'
    };

    setTrainingSessions(prev => [...prev, session]);

    // Bulk-Update: practiceCount + XP + trainedTechniqueLog für jeden Member in jeder Gruppe
    setMembers(prev => prev.map(member => {
      const memberGroups = groups.filter(g => g.memberIds.includes(member.id));
      if (memberGroups.length === 0) return member;

      const trainedTechniqueIds = [...new Set(memberGroups.flatMap(g => g.techniqueIds))];
      const xpGained = trainedTechniqueIds.length * XP_PER_TRAINED_TECHNIQUE;

      const updatedProgress = { ...member.techniqueProgress };
      const updatedLog = { ...(member.trainedTechniqueLog ?? {}) };

      for (const techniqueId of trainedTechniqueIds) {
        const prev = updatedProgress[techniqueId] ?? { techniqueId, status: 'not_tested' as TechniqueStatus };
        const newStatus: TechniqueStatus =
          prev.status === 'needs_training' ? 'not_tested' : prev.status;

        updatedProgress[techniqueId] = {
          ...prev,
          status: newStatus,
          practiceCount: (prev.practiceCount ?? 0) + 1,
          lastPracticedAt: now,
          // NICHT lastSelfPracticedAt — das ist nur für Selbst-Markierung reserviert
        };
        updatedLog[techniqueId] = now;
      }

      return {
        ...member,
        xp: (member.xp ?? 0) + xpGained,
        techniqueProgress: updatedProgress,
        trainedTechniqueLog: updatedLog,
      };
    }));

    // Notifications an alle Anwesenden
    const techniqueCount = [...new Set(groups.flatMap(g => g.techniqueIds))].length;
    const newNotifs: Notification[] = attendeeIds.map(memberId => ({
      id: `notif-session-${Date.now()}-${memberId}`,
      oduserId: memberId,
      type: 'system' as const,
      title: '🥋 Training dokumentiert',
      message: `${currentUser.name} hat das Training eingetragen — ${techniqueCount} Technik${techniqueCount !== 1 ? 'en' : ''} (+${techniqueCount * XP_PER_TRAINED_TECHNIQUE} XP)`,
      read: false,
      createdAt: now,
    }));
    setNotifications(prev => [...prev, ...newNotifs]);
  }, [currentUser]);

  const getSessionsForMember = useCallback((memberId: string): TrainingSession[] => {
    return trainingSessions.filter(s => s.attendeeIds.includes(memberId));
  }, [trainingSessions]);

  // ============================================
  // WUNSCHTECHNIKEN
  // ============================================

  const submitTechniqueWish = useCallback((techniqueId: string, techniqueName: string, moduleId: string, moduleName: string) => {
    if (!currentUser) return;

    // Guard: kein doppelter Wunsch für dieselbe Technik
    const alreadyPending = techniqueWishes.some(
      w => w.techniqueId === techniqueId && w.memberId === currentUser.id && w.status === 'pending'
    );
    if (alreadyPending) return;

    const wish: TechniqueWish = {
      id: `wish-${Date.now()}`,
      memberId: currentUser.id,
      memberName: currentUser.name,
      memberAvatar: currentUser.avatar,
      techniqueId,
      techniqueName,
      moduleId,
      moduleName,
      submittedAt: new Date(),
      status: 'pending'
    };

    setTechniqueWishes(prev => [...prev, wish]);
  }, [currentUser, techniqueWishes]);

  const acknowledgeWish = useCallback((wishId: string) => {
    setTechniqueWishes(prev => prev.map(w =>
      w.id === wishId ? { ...w, status: 'acknowledged' as const } : w
    ));
  }, []);

  const getPendingTechniqueWishes = useCallback((): TechniqueWish[] => {
    return techniqueWishes.filter(w => w.status === 'pending');
  }, [techniqueWishes]);

  // ============================================
  // THEME
  // ============================================

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('mi-theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const updateProfile = useCallback((email: string, password: string) => {
    if (!currentUser) return;
    setMembers(prev => prev.map(m =>
      m.id === currentUser.id ? { ...m, email, password } : m
    ));
    setCurrentUser(prev => prev ? { ...prev, email, password } : null);
  }, [currentUser]);

  const updateProfileImage = useCallback((base64: string) => {
    if (!currentUser) return;
    setMembers(prev => prev.map(m =>
      m.id === currentUser.id ? { ...m, profileImageUrl: base64 } : m
    ));
    setCurrentUser(prev => prev ? { ...prev, profileImageUrl: base64 } : null);
  }, [currentUser]);

  const computeBadges = useCallback((member: Member): Badge[] => {
    const badges: Badge[] = [];
    const tp = member.techniqueProgress;
    const streak = member.streak;

    const techPassedCount = Object.values(tp).filter(p => p.status === 'tech_passed' || p.status === 'tac_passed' || p.status === 'tac_pending').length;
    const tacPassedCount = Object.values(tp).filter(p => p.status === 'tac_passed').length;

    if (techPassedCount >= 1) {
      badges.push({ id: 'first_tech', label: 'Erste Prüfung', icon: '🎯', description: 'Erste technische Prüfung bestanden', earnedAt: new Date() });
    }
    if (tacPassedCount >= 1) {
      badges.push({ id: 'first_tac', label: 'Taktik-Meister', icon: '⚔️', description: 'Erste taktische Prüfung bestanden', earnedAt: new Date() });
    }
    if (streak.currentStreak >= 4) {
      badges.push({ id: 'streak_4', label: '4-Wochen Streak', icon: '🔥', description: '4 Wochen am Stück trainiert', earnedAt: new Date() });
    }
    if (streak.currentStreak >= 10) {
      badges.push({ id: 'streak_10', label: '10-Wochen Krieger', icon: '💪', description: '10 Wochen am Stück trainiert', earnedAt: new Date() });
    }
    if (streak.longestStreak >= 20) {
      badges.push({ id: 'streak_20', label: 'Eiserner Wille', icon: '🏆', description: '20 Wochen Streak erreicht', earnedAt: new Date() });
    }
    if ((member.xp ?? 0) >= 500) {
      badges.push({ id: 'xp_500', label: 'XP-Veteran', icon: '⚡', description: '500 XP gesammelt', earnedAt: new Date() });
    }
    if (member.certificates.length >= 1) {
      badges.push({ id: 'certified', label: 'Zertifiziert', icon: '📜', description: 'Erstes Zertifikat erhalten', earnedAt: new Date() });
    }
    if (member.role !== 'member') {
      badges.push({ id: 'instructor', label: 'Instructor', icon: '🎓', description: 'Ausbilderrang erreicht', earnedAt: new Date() });
    }

    return badges;
  }, []);

  // ============================================
  // HELPERS
  // ============================================

  const getMemberById = useCallback((id: string): Member | undefined => {
    return members.find(m => m.id === id);
  }, [members]);

  const getCheckedInMembers = useCallback((): Member[] => {
    return members.filter(m => m.isCheckedIn);
  }, [members]);

  // Online = hat onlineSince gesetzt (aktive Session)
  // Inaktiv = lastSeenAt < 10 Minuten her (noch sichtbar, aber kein Heartbeat)
  const getOnlineMembers = useCallback((): Member[] => {
    const cutoff = new Date(Date.now() - 10 * 60 * 1000); // 10 Minuten
    return members.filter(m =>
      m.onlineSince !== undefined || new Date(m.lastSeenAt) > cutoff
    );
  }, [members]);

  const getPendingCheckIns = useCallback((): CheckIn[] => {
    return checkIns.filter(c => c.status === 'pending');
  }, [checkIns]);

  const getPendingExamRequests = useCallback((): ExamRequest[] => {
    return members.flatMap(m => m.examRequests.filter(r => r.status === 'pending'));
  }, [members]);

  // Technik gilt als "abgeschlossen" wenn mindestens technisch bestanden
  const isTechniqueCompleted = (status: TechniqueStatus): boolean =>
    status === 'tech_passed' || status === 'tac_passed';

  const getMemberProgress = useCallback((memberId: string): { total: number; completed: number; percentage: number } => {
    const member = members.find(m => m.id === memberId);
    if (!member) return { total: 0, completed: 0, percentage: 0 };

    const total = contentTechniques.length > 0 ? contentTechniques.length : getAllTechniques().length;
    const completed = Object.values(member.techniqueProgress).filter(p => isTechniqueCompleted(p.status)).length;

    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [members, contentTechniques]);

  const getModuleProgress = useCallback((memberId: string, moduleId: string): { total: number; completed: number; percentage: number } => {
    const member = members.find(m => m.id === memberId);
    if (!member) return { total: 0, completed: 0, percentage: 0 };

    const techs = contentTechniques.length > 0
      ? contentTechniques.filter(t => t.moduleId === moduleId)
      : (MODULES.find(m => m.id === moduleId)?.techniques ?? []);
    const total = techs.length;
    const completed = techs.filter(t => isTechniqueCompleted(member.techniqueProgress[t.id]?.status ?? 'not_tested')).length;

    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [members, contentTechniques]);

  const getBlockProgress = useCallback((memberId: string, blockLevel: ModuleLevel): { total: number; completed: number; percentage: number } => {
    const member = members.find(m => m.id === memberId);
    const block = BLOCKS.find(b => b.level === blockLevel);

    if (!member || !block) return { total: 0, completed: 0, percentage: 0 };

    const allTechs = contentTechniques.length > 0
      ? contentTechniques.filter(t => block.moduleIds.includes(t.moduleId))
      : MODULES.filter(m => block.moduleIds.includes(m.id)).flatMap(m => m.techniques);

    const total = allTechs.length;
    const completed = allTechs.filter(
      t => isTechniqueCompleted(member.techniqueProgress[t.id]?.status ?? 'not_tested')
    ).length;

    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [members, contentTechniques]);

  const isBlockUnlocked = useCallback((memberId: string, blockLevel: ModuleLevel): boolean => {
    const member = members.find(m => m.id === memberId);
    if (!member) return false;
    
    // First block is always unlocked
    if (blockLevel === 'conflict') return true;
    
    // Contact requires application approval
    if (blockLevel === 'contact') {
      return member.contactApplication?.status === 'approved';
    }
    
    // Assistant Instructor requires application approval
    if (blockLevel === 'assistant_instructor') {
      return member.assistantInstructorApplication?.status === 'approved';
    }
    
    // Instructor level requires being assistant instructor first
    if (blockLevel === 'instructor_level') {
      return member.role === 'instructor' || member.role === 'full_instructor' ||
             member.role === 'head_instructor' || member.role === 'admin';
    }
    
    // Other blocks require 80% of previous block
    const blockOrder: ModuleLevel[] = ['conflict', 'combat', 'tactical'];
    const currentIndex = blockOrder.indexOf(blockLevel);
    if (currentIndex <= 0) return true;
    
    const previousLevel = blockOrder[currentIndex - 1];
    const prevProgress = getBlockProgress(memberId, previousLevel);
    
    return prevProgress.percentage >= 80;
  }, [members, getBlockProgress]);

  // ============================================
  // INSTRUCTOR LEARNING
  // ============================================

  const completeInstructorLesson = useCallback((lessonId: string, quizScore?: number) => {
    if (!currentUser) return;
    const lessonProgress: InstructorLessonProgress = {
      lessonId,
      completed: true,
      completedAt: new Date(),
      quizScore,
      quizPassed: quizScore !== undefined ? quizScore >= 67 : undefined,
      lastAttemptAt: new Date()
    };
    const updateProgress = (m: Member): Member => ({
      ...m,
      instructorLessonProgress: {
        ...m.instructorLessonProgress,
        [lessonId]: lessonProgress
      }
    });
    setMembers(prev => prev.map(m => m.id === currentUser.id ? updateProgress(m) : m));
    setCurrentUser(prev => prev ? updateProgress(prev) : null);
  }, [currentUser]);

  const getInstructorProgress = useCallback((memberId: string): Record<string, InstructorLessonProgress> => {
    const member = members.find(m => m.id === memberId);
    return member?.instructorLessonProgress ?? {};
  }, [members]);

  const awardXP = useCallback((amount: number) => {
    if (!currentUser) return;
    const update = (m: Member): Member => ({ ...m, xp: (m.xp ?? 0) + amount });
    setMembers(prev => prev.map(m => m.id === currentUser.id ? update(m) : m));
    setCurrentUser(prev => prev ? update(prev) : null);
  }, [currentUser]);

  const completeModuleQuiz = useCallback((moduleId: string, score: number, xpEarned: number) => {
    if (!currentUser) return;
    const prev = currentUser.quizProgress?.[moduleId];
    const progress: MemberQuizProgress = {
      moduleId,
      lastScore: score,
      bestScore: Math.max(score, prev?.bestScore ?? 0),
      completedAt: new Date(),
      totalSessions: (prev?.totalSessions ?? 0) + 1
    };
    const update = (m: Member): Member => ({
      ...m,
      xp: (m.xp ?? 0) + xpEarned,
      quizProgress: { ...m.quizProgress, [moduleId]: progress }
    });
    setMembers(prev => prev.map(m => m.id === currentUser.id ? update(m) : m));
    setCurrentUser(prev => prev ? update(prev) : null);
  }, [currentUser]);

  // ============================================
  // CONTENT MANAGEMENT — Getter
  // ============================================

  const getTechniquesForModule = useCallback((moduleId: string): ContentTechnique[] =>
    contentTechniques.filter(t => t.moduleId === moduleId).sort((a, b) => a.position - b.position),
  [contentTechniques]);

  const getQuizQuestionsForModule = useCallback((moduleId: string): QuizQuestion[] =>
    quizQuestions.filter(q => q.moduleId === moduleId).sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
  [quizQuestions]);

  const getQuizCountForModule = useCallback((moduleId: string): number =>
    moduleSettings[moduleId]?.quizCount ?? 10,
  [moduleSettings]);

  // ============================================
  // CONTENT MANAGEMENT — Admin CRUD
  // ============================================

  const saveTechnique = useCallback(async (t: ContentTechnique) => {
    const isNew = !contentTechniques.find(x => x.id === t.id);
    await supabase.from('content_techniques').upsert([{ id: t.id, module_id: t.moduleId, name: t.name, description: t.description, is_required: t.isRequired, position: t.position }], { onConflict: 'id' });
    setContentTechniques(prev => isNew ? [...prev, t] : prev.map(x => x.id === t.id ? t : x));
  }, [contentTechniques]);

  const deleteTechnique = useCallback(async (id: string) => {
    await supabase.from('content_techniques').delete().eq('id', id);
    setContentTechniques(prev => prev.filter(t => t.id !== id));
  }, []);

  const reorderTechniques = useCallback(async (_moduleId: string, orderedIds: string[]) => {
    const updates = orderedIds.map((id, i) => ({ id, position: i }));
    setContentTechniques(prev => prev.map(t => { const u = updates.find(x => x.id === t.id); return u ? { ...t, position: u.position } : t; }));
    await Promise.all(updates.map(u => supabase.from('content_techniques').update({ position: u.position }).eq('id', u.id)));
  }, []);

  const saveQuizQuestion = useCallback(async (q: QuizQuestion & { moduleId: string }) => {
    const existing = q.id ? quizQuestions.find(x => x.id === q.id) : null;
    const row = { module_id: q.moduleId, question: q.question, options: q.options, correct_index: q.correctIndex, explanation: q.explanation ?? '', position: q.position ?? 0 };
    if (existing) {
      await supabase.from('content_quiz_questions').update(row).eq('id', q.id);
      setQuizQuestions(prev => prev.map(x => x.id === q.id ? { ...q } : x));
    } else {
      const { data } = await supabase.from('content_quiz_questions').insert([row]).select();
      const newQ: QuizQuestion = { ...q, id: data?.[0]?.id ?? `tmp-${Date.now()}` };
      setQuizQuestions(prev => [...prev, newQ]);
    }
  }, [quizQuestions]);

  const deleteQuizQuestion = useCallback(async (id: string) => {
    await supabase.from('content_quiz_questions').delete().eq('id', id);
    setQuizQuestions(prev => prev.filter(q => q.id !== id));
  }, []);

  const reorderQuizQuestions = useCallback(async (_moduleId: string, orderedIds: string[]) => {
    const updates = orderedIds.map((id, i) => ({ id, position: i }));
    setQuizQuestions(prev => prev.map(q => { const u = updates.find(x => x.id === q.id); return u ? { ...q, position: u.position } : q; }));
    await Promise.all(updates.map(u => supabase.from('content_quiz_questions').update({ position: u.position }).eq('id', u.id)));
  }, []);

  const saveModuleSettings = useCallback(async (moduleId: string, quizCount: number) => {
    setModuleSettings(prev => ({ ...prev, [moduleId]: { moduleId, quizCount } }));
    await supabase.from('module_settings').upsert([{ module_id: moduleId, quiz_count: quizCount, updated_at: new Date().toISOString() }], { onConflict: 'module_id' });
  }, []);

  // ============================================
  // MODUL-REIHENFOLGE
  // ============================================

  const getOrderedModules = useCallback(() => {
    if (moduleOrder.length === 0) return MODULES; // Fallback: hardcoded Reihenfolge
    const ordered = [...MODULES].sort((a, b) => {
      const aOrder = moduleOrder.find(o => o.moduleId === a.id);
      const bOrder = moduleOrder.find(o => o.moduleId === b.id);
      if (!aOrder && !bOrder) return 0;
      if (!aOrder) return 1;
      if (!bOrder) return -1;
      return aOrder.position - bOrder.position;
    });
    return ordered;
  }, [moduleOrder]);

  const saveModuleOrder = useCallback(async (orders: ModuleOrder[]) => {
    setModuleOrder(orders);
    await supabase
      .from('module_order')
      .upsert(orders.map(o => ({
        module_id: o.moduleId,
        block_level: o.blockLevel,
        position: o.position
      })), { onConflict: 'module_id' });
  }, []);

  // ============================================
  // ADMIN
  // ============================================

  const updateMemberRole = useCallback((memberId: string, role: InstructorRole) => {
    setMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, role } : m
    ));
    if (currentUser?.id === memberId) {
      setCurrentUser(prev => prev ? { ...prev, role } : null);
    }
  }, [currentUser]);

  const restoreStreak = useCallback((memberId: string, streakValue: number, reason: string) => {
    const update = (m: Member): Member => ({
      ...m,
      streak: {
        ...m.streak,
        currentStreak: streakValue,
        longestStreak: Math.max(m.streak.longestStreak, streakValue),
        lastTrainingDate: new Date(),
      }
    });
    setMembers(prev => prev.map(m => m.id === memberId ? update(m) : m));
    if (currentUser?.id === memberId) setCurrentUser(prev => prev ? update(prev) : null);
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      oduserId: memberId,
      type: 'bandaid',
      title: 'Streak wiederhergestellt 🔥',
      message: reason,
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, notif]);
  }, [currentUser]);

  // ============================================
  // JOIN REQUESTS & MEMBER CREATION
  // ============================================

  const submitJoinRequest = useCallback((name: string, email: string, memberIdHint?: string, course?: string) => {
    const req: JoinRequest = {
      id: `join-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      memberIdHint: memberIdHint?.trim(),
      course: course?.trim(),
      status: 'pending',
      submittedAt: new Date(),
    };
    setJoinRequests(prev => {
      const updated = [...prev, req];
      localStorage.setItem('mi-join-requests', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const createMemberFromRequest = useCallback((data: CreateMemberData) => {
    // Erstelle techniqueProgress aus moduleProgress
    const techniqueProgress: Member['techniqueProgress'] = {};
    const allTechs = getAllTechniques();
    // Finde die ersten 10 Module in Reihenfolge
    const curriculum = MODULES.slice(0, 10);
    Object.entries(data.moduleProgress).forEach(([moduleNumStr, progress]) => {
      const moduleNum = parseInt(moduleNumStr) - 1; // 0-indexed
      const mod = curriculum[moduleNum];
      if (!mod) return;
      const techs = allTechs.filter(t => t.moduleId === mod.id && t.isRequired);
      techs.forEach(t => {
        if (progress.combat) {
          techniqueProgress[t.id] = { techniqueId: t.id, status: 'tac_passed', lastPracticedAt: new Date(), tacPassedAt: new Date(), techPassedAt: new Date() };
        } else if (progress.tactics) {
          techniqueProgress[t.id] = { techniqueId: t.id, status: 'tech_passed', lastPracticedAt: new Date(), techPassedAt: new Date() };
        }
      });
    });

    const newMember: Member = {
      id: data.memberId,
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: '🥋',
      role: 'member',
      locationId: 'loc-1',
      joinedAt: new Date(),
      lastSeenAt: new Date(),
      currentLevel: 'conflict',
      techniqueProgress,
      examRequests: [],
      streak: { currentStreak: 0, longestStreak: 0, lastTrainingDate: null, weekStartDate: new Date(), bandaids: 0, maxBandaids: 2, streakHistory: [], bandaidHistory: [] },
      isCheckedIn: false,
      certificates: [],
      stopTheBleedCertified: data.stopTheBleedCertified,
    };

    setMembers(prev => [...prev, newMember]);

    // Join Request als approved markieren
    if (data.joinRequestId) {
      setJoinRequests(prev => {
        const updated = prev.map(r => r.id === data.joinRequestId ? { ...r, status: 'approved' as const, processedAt: new Date() } : r);
        localStorage.setItem('mi-join-requests', JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  const rejectJoinRequest = useCallback((id: string) => {
    setJoinRequests(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status: 'rejected' as const, processedAt: new Date() } : r);
      localStorage.setItem('mi-join-requests', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateStopTheBleed = useCallback((memberId: string, certified: boolean) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, stopTheBleedCertified: certified } : m));
    if (memberId === currentUser?.id) {
      setCurrentUser(prev => prev ? { ...prev, stopTheBleedCertified: certified } : null);
    }
  }, [currentUser]);

  const updateCustomBadge = useCallback((badge: string) => {
    if (!currentUser) return;
    setMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, customBadge: badge } : m));
    setCurrentUser(prev => prev ? { ...prev, customBadge: badge } : null);
  }, [currentUser]);

  const updateVisibilityPreference = useCallback((pref: 'all' | 'buddies') => {
    if (!currentUser) return;
    setMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, visibilityPreference: pref } : m));
    setCurrentUser(prev => prev ? { ...prev, visibilityPreference: pref } : null);
  }, [currentUser]);

  const updateAnzeigename = useCallback((name: string): { ok: boolean; error?: string } => {
    if (!currentUser) return { ok: false, error: 'Nicht eingeloggt' };
    const trimmed = name.trim();
    if (!trimmed) return { ok: false, error: 'Anzeigename darf nicht leer sein' };
    const taken = members.some(m => m.id !== currentUser.id && m.name.toLowerCase() === trimmed.toLowerCase());
    if (taken) return { ok: false, error: 'Dieser Anzeigename ist bereits vergeben' };
    setMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, name: trimmed } : m));
    setCurrentUser(prev => prev ? { ...prev, name: trimmed } : null);
    return { ok: true };
  }, [currentUser, members]);

  const updateDataVisibility = useCallback((prefs: NonNullable<Member['dataVisibility']>) => {
    if (!currentUser) return;
    setMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, dataVisibility: prefs } : m));
    setCurrentUser(prev => prev ? { ...prev, dataVisibility: prefs } : null);
  }, [currentUser]);

  const updateMemberCoreData = useCallback((memberId: string, data: { name?: string; firstName?: string; lastName?: string; birthDate?: string; memberId?: string }) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      const updated = { ...m };
      if (data.name !== undefined) updated.name = data.name;
      if (data.firstName !== undefined) updated.firstName = data.firstName;
      if (data.lastName !== undefined) updated.lastName = data.lastName;
      if (data.birthDate !== undefined) updated.birthDate = data.birthDate;
      if (data.memberId !== undefined) updated.memberId = data.memberId;
      return updated;
    }));
    setCurrentUser(prev => {
      if (!prev || prev.id !== memberId) return prev;
      const updated = { ...prev };
      if (data.name !== undefined) updated.name = data.name;
      if (data.firstName !== undefined) updated.firstName = data.firstName;
      if (data.lastName !== undefined) updated.lastName = data.lastName;
      if (data.birthDate !== undefined) updated.birthDate = data.birthDate;
      if (data.memberId !== undefined) updated.memberId = data.memberId;
      return updated;
    });
  }, []);

  const connectWithCode = (code: string): { success: boolean; memberName?: string } => {
    if (!currentUser) return { success: false };
    const normalizedCode = code.trim().toUpperCase();
    // Finde Mitglied anhand der ersten 8 Zeichen seiner ID (uppercase)
    const target = members.find(m =>
      m.id !== currentUser.id &&
      m.id.slice(0, 8).toUpperCase() === normalizedCode
    );
    if (!target) return { success: false };
    // Bereits verbunden?
    if ((currentUser.connections ?? []).includes(target.id)) {
      return { success: false, memberName: target.name };
    }
    // Gegenseitig verbinden
    setMembers(prev => prev.map(m => {
      if (m.id === currentUser.id) {
        return { ...m, connections: [...(m.connections ?? []), target.id] };
      }
      if (m.id === target.id) {
        return { ...m, connections: [...(m.connections ?? []), currentUser.id] };
      }
      return m;
    }));
    return { success: true, memberName: target.name };
  };

  // ── Buddy System ────────────────────────────────────────────────────────────
  const BUDDY_CODES_KEY = 'mi_buddy_codes';
  const BUDDY_REQUESTS_KEY = 'mi_buddy_requests';

  const generateBuddyCode = (): string => {
    if (!currentUser) return '';
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const rand = (n: number) =>
      Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const code = `${rand(3)}-${rand(3)}`;
    const now = Date.now();
    const existing: BuddyCode[] = JSON.parse(localStorage.getItem(BUDDY_CODES_KEY) || '[]');
    const cleaned = existing.filter(c => c.expiresAt > now && c.generatedBy !== currentUser.id);
    const entry: BuddyCode = { code, generatedBy: currentUser.id, expiresAt: now + 15 * 60 * 1000 };
    localStorage.setItem(BUDDY_CODES_KEY, JSON.stringify([...cleaned, entry]));
    return code;
  };

  const sendBuddyRequest = (code: string): { ok: boolean; error?: string } => {
    if (!currentUser) return { ok: false, error: 'Nicht eingeloggt.' };
    const normalizedCode = code.trim().toUpperCase();
    const now = Date.now();
    const buddyCodes: BuddyCode[] = JSON.parse(localStorage.getItem(BUDDY_CODES_KEY) || '[]');
    const codeEntry = buddyCodes.find(c => c.code === normalizedCode && c.expiresAt > now);
    if (!codeEntry) return { ok: false, error: 'Code ungültig oder abgelaufen.' };
    if (codeEntry.generatedBy === currentUser.id) return { ok: false, error: 'Du kannst nicht deinen eigenen Code eingeben.' };
    if ((currentUser.connections ?? []).includes(codeEntry.generatedBy)) {
      return { ok: false, error: 'Ihr seid bereits verbunden.' };
    }
    const requests: BuddyRequest[] = JSON.parse(localStorage.getItem(BUDDY_REQUESTS_KEY) || '[]');
    const existing = requests.find(
      r => r.fromMemberId === currentUser.id && r.toMemberId === codeEntry.generatedBy && r.status === 'pending'
    );
    if (existing) return { ok: true };
    const newRequest: BuddyRequest = {
      id: `br_${now}_${Math.random().toString(36).slice(2)}`,
      fromMemberId: currentUser.id,
      fromMemberName: currentUser.name,
      toMemberId: codeEntry.generatedBy,
      code: normalizedCode,
      createdAt: now,
      status: 'pending',
    };
    localStorage.setItem(BUDDY_REQUESTS_KEY, JSON.stringify([...requests, newRequest]));
    // Benachrichtigung für den Empfänger
    setNotifications(prev => [...prev, {
      id: `notif-buddy-${now}`,
      oduserId: codeEntry.generatedBy,
      type: 'buddy_request' as const,
      title: 'Trainingspartner-Anfrage',
      message: `${currentUser.name} möchte sich mit dir verbinden.`,
      read: false,
      createdAt: new Date(),
      data: { requestId: newRequest.id },
    }]);
    return { ok: true };
  };

  const acceptBuddyRequest = (requestId: string): void => {
    if (!currentUser) return;
    const requests: BuddyRequest[] = JSON.parse(localStorage.getItem(BUDDY_REQUESTS_KEY) || '[]');
    const request = requests.find(r => r.id === requestId && r.status === 'pending');
    if (!request) return;
    const updated = requests.map(r => r.id === requestId ? { ...r, status: 'accepted' as const } : r);
    localStorage.setItem(BUDDY_REQUESTS_KEY, JSON.stringify(updated));
    const myId = currentUser.id;
    const theirId = request.fromMemberId;
    setMembers(prev => prev.map(m => {
      if (m.id === myId) return { ...m, connections: [...new Set([...(m.connections ?? []), theirId])] };
      if (m.id === theirId) return { ...m, connections: [...new Set([...(m.connections ?? []), myId])] };
      return m;
    }));
    setCurrentUser(prev => prev ? { ...prev, connections: [...new Set([...(prev.connections ?? []), theirId])] } : null);
  };

  const getPendingBuddyRequests = (): BuddyRequest[] => {
    if (!currentUser) return [];
    const requests: BuddyRequest[] = JSON.parse(localStorage.getItem(BUDDY_REQUESTS_KEY) || '[]');
    const cutoff = Date.now() - 15 * 60 * 1000;
    return requests.filter(r =>
      r.toMemberId === currentUser.id &&
      r.status === 'pending' &&
      r.createdAt > cutoff
    );
  };

  const getBuddies = (): Member[] => {
    if (!currentUser) return [];
    return members.filter(m => (currentUser.connections ?? []).includes(m.id));
  };

  const updateAdminAccess = useCallback((memberId: string, hasAccess: boolean) => {
    setMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, adminAccess: hasAccess } : m
    ));
    if (currentUser?.id === memberId) {
      setCurrentUser(prev => prev ? { ...prev, adminAccess: hasAccess } : null);
    }
  }, [currentUser]);

  // ============================================
  // VALUE
  // ============================================

  const value: AppContextType = {
    currentUser,
    members,
    checkIns,
    boardMessages,
    notifications,
    darkMode,
    login,
    logout,
    switchUser,
    requestCheckIn,
    approveCheckIn,
    rejectCheckIn,
    checkOut,
    requestExam,
    approveExam,
    rejectExam,
    canExamineLevel,
    logPractice,
    markTechniquePassed,
    submitContactApplication,
    approveContactApplication,
    rejectContactApplication,
    submitInstructorApplication,
    approveInstructorApplication,
    rejectInstructorApplication,
    getPendingContactApplications,
    getPendingInstructorApplications,
    useBandaid,
    awardBandaid,
    sendBoardMessage,
    addBoardReply,
    markBoardMessageRead,
    sendReadReminder,
    updateNotificationPrefs,
    permissionsConfig,
    updatePermissionsConfig,
    hasPermission,
    tabConfig,
    updateTabConfig,
    markNotificationRead,
    clearNotifications,
    addInstructorNote,
    completeInstructorLesson,
    getInstructorProgress,
    awardXP,
    completeModuleQuiz,
    toggleDarkMode,
    updateProfile,
    updateProfileImage,
    computeBadges,
    trainingSessions,
    completeTrainingSession,
    getSessionsForMember,
    techniqueWishes,
    submitTechniqueWish,
    acknowledgeWish,
    getPendingTechniqueWishes,
    joinRequests,
    submitJoinRequest,
    createMemberFromRequest,
    rejectJoinRequest,
    updateStopTheBleed,
    updateCustomBadge,
    updateVisibilityPreference,
    updateAnzeigename,
    updateDataVisibility,
    updateMemberCoreData,
    connectWithCode,
    generateBuddyCode,
    sendBuddyRequest,
    acceptBuddyRequest,
    getPendingBuddyRequests,
    getBuddies,
    getMemberById,
    getCheckedInMembers,
    getOnlineMembers,
    getPendingCheckIns,
    getPendingExamRequests,
    getMemberProgress,
    getModuleProgress,
    getBlockProgress,
    isBlockUnlocked,
    updateMemberRole,
    updateAdminAccess,
    restoreStreak,
    moduleOrder,
    getOrderedModules,
    saveModuleOrder,
    contentTechniques,
    quizQuestions,
    moduleSettings,
    getTechniquesForModule,
    getQuizQuestionsForModule,
    getQuizCountForModule,
    saveTechnique,
    deleteTechnique,
    reorderTechniques,
    saveQuizQuestion,
    deleteQuizQuestion,
    reorderQuizQuestions,
    saveModuleSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ============================================
// HOOK
// ============================================

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Re-export data for convenience
export { MODULES, BLOCKS, LOCATIONS, VIDEOS, COURSES };
