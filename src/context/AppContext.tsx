// ============================================
// MARTIAL INSTINCT - APP CONTEXT
// ============================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  Member,
  CheckIn,
  BoardMessage,
  Notification,
  TechniqueStatus,
  ModuleLevel,
  ExamRequest,
  EXAM_PERMISSIONS,
  ContactApplication,
  InstructorApplication,
  BandaidEvent,
  InstructorLessonProgress
} from '../types';
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
  sendBoardMessage: (content: string) => void;
  
  // Notifications
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // Instructor Notes
  addInstructorNote: (memberId: string, content: string) => void;
  
  // Instructor Learning
  completeInstructorLesson: (lessonId: string, quizScore?: number) => void;
  getInstructorProgress: (memberId: string) => Record<string, InstructorLessonProgress>;

  // Theme
  toggleDarkMode: () => void;

  // Helpers
  getMemberById: (id: string) => Member | undefined;
  getCheckedInMembers: () => Member[];
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
  const [darkMode, setDarkMode] = useState(true);

  // ============================================
  // AUTH
  // ============================================

  const login = useCallback((email: string, password: string): boolean => {
    const member = members.find(m => m.email === email && m.password === password);
    if (member) {
      setCurrentUser(member);
      return true;
    }
    return false;
  }, [members]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const switchUser = useCallback((userId: string) => {
    const member = members.find(m => m.id === userId);
    if (member) {
      setCurrentUser(member);
    }
  }, [members]);

  // ============================================
  // CHECK-INS
  // ============================================

  const requestCheckIn = useCallback(() => {
    if (!currentUser) return;
    
    const newCheckIn: CheckIn = {
      id: `checkin-${Date.now()}`,
      memberId: currentUser.id,
      memberName: currentUser.name,
      locationId: currentUser.locationId,
      requestedAt: new Date(),
      status: 'pending'
    };
    
    setCheckIns(prev => [...prev, newCheckIn]);
    
    // Notify instructors
    const instructorNotification: Notification = {
      id: `notif-${Date.now()}`,
      oduserId: 'all-instructors',
      type: 'checkin',
      title: 'Check-in Anfrage',
      message: `${currentUser.name} möchte einchecken`,
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, instructorNotification]);
  }, [currentUser]);

  const approveCheckIn = useCallback((checkInId: string) => {
    if (!currentUser) return;
    
    setCheckIns(prev => prev.map(c => 
      c.id === checkInId 
        ? { ...c, status: 'approved' as const, approvedById: currentUser.id, approvedByName: currentUser.name, approvedAt: new Date() }
        : c
    ));
    
    const checkIn = checkIns.find(c => c.id === checkInId);
    if (checkIn) {
      setMembers(prev => prev.map(m => 
        m.id === checkIn.memberId
          ? { 
              ...m, 
              isCheckedIn: true, 
              checkedInAt: new Date(),
              lastSeenAt: new Date(),
              streak: {
                ...m.streak,
                lastTrainingDate: new Date(),
                currentStreak: m.streak.currentStreak + 1,
                longestStreak: Math.max(m.streak.longestStreak, m.streak.currentStreak + 1)
              }
            }
          : m
      ));
      
      // Notify member
      const memberNotification: Notification = {
        id: `notif-${Date.now()}`,
        oduserId: checkIn.memberId,
        type: 'checkin',
        title: 'Eingecheckt!',
        message: 'Du bist jetzt eingecheckt. Viel Erfolg beim Training!',
        read: false,
        createdAt: new Date()
      };
      setNotifications(prev => [...prev, memberNotification]);
    }
  }, [currentUser, checkIns]);

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
    
    const newRequest: ExamRequest = {
      id: `exam-${Date.now()}`,
      memberId: currentUser.id,
      memberName: currentUser.name,
      techniqueId,
      techniqueName: technique.name,
      moduleId: module.id,
      moduleName: module.name,
      targetLevel: technique.level,
      requestedAt: new Date(),
      status: 'pending'
    };
    
    setMembers(prev => prev.map(m => 
      m.id === currentUser.id
        ? { 
            ...m, 
            examRequests: [...m.examRequests, newRequest],
            techniqueProgress: {
              ...m.techniqueProgress,
              [techniqueId]: { techniqueId, status: 'requested' as TechniqueStatus }
            }
          }
        : m
    ));
    
    // Update current user
    if (currentUser) {
      setCurrentUser(prev => prev ? {
        ...prev,
        examRequests: [...prev.examRequests, newRequest],
        techniqueProgress: {
          ...prev.techniqueProgress,
          [techniqueId]: { techniqueId, status: 'requested' as TechniqueStatus }
        }
      } : null);
    }
  }, [currentUser]);

  const approveExam = useCallback((memberId: string, requestId: string, feedback?: string) => {
    if (!currentUser) return;
    
    const member = members.find(m => m.id === memberId);
    const request = member?.examRequests.find(r => r.id === requestId);
    
    if (!member || !request) return;
    
    const newStatus: TechniqueStatus = request.targetLevel;
    
    setMembers(prev => prev.map(m => 
      m.id === memberId
        ? {
            ...m,
            examRequests: m.examRequests.map(r => 
              r.id === requestId 
                ? { ...r, status: 'approved' as const, examinerId: currentUser.id, examinerName: currentUser.name, feedback, processedAt: new Date() }
                : r
            ),
            techniqueProgress: {
              ...m.techniqueProgress,
              [request.techniqueId]: {
                techniqueId: request.techniqueId,
                status: newStatus,
                examinerId: currentUser.id,
                examinerName: currentUser.name,
                locationId: currentUser.locationId,
                examinedAt: new Date()
              }
            }
          }
        : m
    ));
    
    // Notify member
    const memberNotification: Notification = {
      id: `notif-${Date.now()}`,
      oduserId: memberId,
      type: 'exam_result',
      title: 'Technik bestanden! ✅',
      message: `${request.techniqueName} wurde freigegeben!`,
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, memberNotification]);
  }, [currentUser, members]);

  const rejectExam = useCallback((memberId: string, requestId: string, feedback: string) => {
    if (!currentUser) return;
    
    const member = members.find(m => m.id === memberId);
    const request = member?.examRequests.find(r => r.id === requestId);
    
    if (!member || !request) return;
    
    setMembers(prev => prev.map(m => 
      m.id === memberId
        ? {
            ...m,
            examRequests: m.examRequests.map(r => 
              r.id === requestId 
                ? { ...r, status: 'needs_training' as const, examinerId: currentUser.id, examinerName: currentUser.name, feedback, processedAt: new Date() }
                : r
            ),
            techniqueProgress: {
              ...m.techniqueProgress,
              [request.techniqueId]: {
                techniqueId: request.techniqueId,
                status: 'not_tested' as TechniqueStatus
              }
            }
          }
        : m
    ));
    
    // Notify member
    const memberNotification: Notification = {
      id: `notif-${Date.now()}`,
      oduserId: memberId,
      type: 'exam_result',
      title: 'Nachtraining erforderlich',
      message: `${request.techniqueName}: ${feedback}`,
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, memberNotification]);
  }, [currentUser, members]);

  const canExamineLevel = useCallback((level: ModuleLevel): boolean => {
    if (!currentUser) return false;
    return EXAM_PERMISSIONS[currentUser.role].includes(level);
  }, [currentUser]);

  const logPractice = useCallback((techniqueId: string) => {
    if (!currentUser) return;
    setMembers(prev => prev.map(m =>
      m.id === currentUser.id
        ? {
            ...m,
            techniqueProgress: {
              ...m.techniqueProgress,
              [techniqueId]: {
                ...m.techniqueProgress[techniqueId],
                techniqueId,
                status: m.techniqueProgress[techniqueId]?.status || 'not_tested',
                practiceCount: (m.techniqueProgress[techniqueId]?.practiceCount ?? 0) + 1,
                lastPracticedAt: new Date()
              }
            }
          }
        : m
    ));
    setCurrentUser(prev => prev ? {
      ...prev,
      techniqueProgress: {
        ...prev.techniqueProgress,
        [techniqueId]: {
          ...prev.techniqueProgress[techniqueId],
          techniqueId,
          status: prev.techniqueProgress[techniqueId]?.status || 'not_tested',
          practiceCount: (prev.techniqueProgress[techniqueId]?.practiceCount ?? 0) + 1,
          lastPracticedAt: new Date()
        }
      }
    } : null);
  }, [currentUser]);

  const markTechniquePassed = useCallback((memberId: string, techniqueId: string, notes?: string) => {
    if (!currentUser) return;
    const technique = getAllTechniques().find(t => t.id === techniqueId);
    if (!technique || !EXAM_PERMISSIONS[currentUser.role].includes(technique.level)) return;

    setMembers(prev => prev.map(m =>
      m.id === memberId
        ? {
            ...m,
            techniqueProgress: {
              ...m.techniqueProgress,
              [techniqueId]: {
                techniqueId,
                status: technique.level,
                examinerId: currentUser.id,
                examinerName: currentUser.name,
                locationId: currentUser.locationId,
                examinedAt: new Date(),
                notes,
                practiceCount: m.techniqueProgress[techniqueId]?.practiceCount,
                lastPracticedAt: m.techniqueProgress[techniqueId]?.lastPracticedAt
              }
            }
          }
        : m
    ));

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
            },
            currentLevel: 'assistant_instructor' as ModuleLevel,
            role: 'assistant_instructor' as const
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

  const sendBoardMessage = useCallback((content: string) => {
    if (!currentUser) return;
    
    const newMessage: BoardMessage = {
      id: `msg-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content,
      createdAt: new Date(),
      locationId: currentUser.locationId
    };
    
    setBoardMessages(prev => [...prev, newMessage]);
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
  // THEME
  // ============================================

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
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

  const getPendingCheckIns = useCallback((): CheckIn[] => {
    return checkIns.filter(c => c.status === 'pending');
  }, [checkIns]);

  const getPendingExamRequests = useCallback((): ExamRequest[] => {
    return members.flatMap(m => m.examRequests.filter(r => r.status === 'pending'));
  }, [members]);

  const getMemberProgress = useCallback((memberId: string): { total: number; completed: number; percentage: number } => {
    const member = members.find(m => m.id === memberId);
    if (!member) return { total: 0, completed: 0, percentage: 0 };
    
    const allTechs = getAllTechniques();
    const total = allTechs.length;
    const completed = Object.values(member.techniqueProgress).filter(
      p => p.status !== 'not_tested' && p.status !== 'requested'
    ).length;
    
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [members]);

  const getModuleProgress = useCallback((memberId: string, moduleId: string): { total: number; completed: number; percentage: number } => {
    const member = members.find(m => m.id === memberId);
    const module = MODULES.find(m => m.id === moduleId);
    
    if (!member || !module) return { total: 0, completed: 0, percentage: 0 };
    
    const total = module.techniques.length;
    const completed = module.techniques.filter(
      t => member.techniqueProgress[t.id]?.status && 
           member.techniqueProgress[t.id].status !== 'not_tested' && 
           member.techniqueProgress[t.id].status !== 'requested'
    ).length;
    
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [members]);

  const getBlockProgress = useCallback((memberId: string, blockLevel: ModuleLevel): { total: number; completed: number; percentage: number } => {
    const member = members.find(m => m.id === memberId);
    const block = BLOCKS.find(b => b.level === blockLevel);
    
    if (!member || !block) return { total: 0, completed: 0, percentage: 0 };
    
    const blockModules = MODULES.filter(m => block.moduleIds.includes(m.id));
    const allTechs = blockModules.flatMap(m => m.techniques);
    
    const total = allTechs.length;
    const completed = allTechs.filter(
      t => member.techniqueProgress[t.id]?.status && 
           member.techniqueProgress[t.id].status !== 'not_tested' && 
           member.techniqueProgress[t.id].status !== 'requested'
    ).length;
    
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [members]);

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
      return member.role === 'instructor' || member.role === 'tactical_instructor' || 
             member.role === 'head_instructor' || member.role === 'owner';
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
    markNotificationRead,
    clearNotifications,
    addInstructorNote,
    completeInstructorLesson,
    getInstructorProgress,
    toggleDarkMode,
    getMemberById,
    getCheckedInMembers,
    getPendingCheckIns,
    getPendingExamRequests,
    getMemberProgress,
    getModuleProgress,
    getBlockProgress,
    isBlockUnlocked
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
