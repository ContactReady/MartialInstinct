// ============================================
// MARTIAL INSTINCT - MOCK DATA
// ============================================

import { Member, Location, CheckIn, BoardMessage, Video, Course, Notification } from '../types';
import { MODULES, getAllTechniques } from './modules';

// ============================================
// LOCATIONS
// ============================================

export const LOCATIONS: Location[] = [
  {
    id: 'loc-1',
    name: 'Martial Instinct HQ',
    address: 'Hauptstraße 1, 10115 Berlin',
    headInstructorId: 'admin-jay',
    instructorIds: ['admin-jay', 'user-instructor'],
    createdAt: new Date('2020-01-01')
  }
];

// ============================================
// HELPER
// ============================================

const createDefaultStreak = () => ({
  currentStreak: 0,
  longestStreak: 0,
  lastTrainingDate: null,
  weekStartDate: new Date(),
  bandaids: 0,
  maxBandaids: 2,
  streakHistory: [],
  bandaidHistory: []
});

const allTechniques = getAllTechniques();

// ============================================
// MEMBERS — 3 Accounts
// ============================================

export const MEMBERS: Member[] = [

  // ── ADMIN: Jay ────────────────────────────
  {
    id: 'admin-jay',
    name: 'Jay',
    email: 'jay@martialinstinct.de',
    password: 'MI_Admin1!',
    avatar: '👑',
    role: 'admin',
    locationId: 'loc-1',
    joinedAt: new Date('2020-01-01'),
    lastSeenAt: new Date(),
    currentLevel: 'contact',
    techniqueProgress: Object.fromEntries(
      allTechniques.map(t => [t.id, {
        techniqueId: t.id,
        status: 'tac_passed' as const,
        tacPassedAt: new Date('2020-01-01'),
        tacExaminerId: 'admin-jay',
        tacExaminerName: 'Jay'
      }])
    ),
    examRequests: [],
    streak: { ...createDefaultStreak(), currentStreak: 52, longestStreak: 52, lastTrainingDate: new Date() },
    isCheckedIn: false,
    certificates: [],
    instructorNotes: [],
    deficitHints: [],
    stopTheBleedCertified: true,
  },

  // ── INSTRUCTOR: Holger ────────────────────
  {
    id: 'user-instructor',
    name: 'Holger',
    email: 'holger@martialinstinct.de',
    password: 'Trainer1!',
    avatar: '🥋',
    role: 'instructor',
    locationId: 'loc-1',
    joinedAt: new Date('2022-01-01'),
    lastSeenAt: new Date(),
    currentLevel: 'combat',
    techniqueProgress: Object.fromEntries(
      allTechniques
        .filter(t => ['conflict', 'combat'].includes(t.level))
        .map(t => [t.id, {
          techniqueId: t.id,
          status: 'tac_passed' as const,
          tacPassedAt: new Date('2022-06-01'),
          tacExaminerId: 'admin-jay',
          tacExaminerName: 'Jay',
          practiceCount: 12
        }])
    ),
    examRequests: [],
    streak: { ...createDefaultStreak(), currentStreak: 12, longestStreak: 18, lastTrainingDate: new Date() },
    isCheckedIn: false,
    xp: 480,
    certificates: [],
    instructorNotes: [],
    deficitHints: []
  },

  // ── MEMBER: Test Account ──────────────────
  {
    id: 'user-test',
    name: 'Test Member',
    email: 'test@martialinstinct.de',
    password: 'Member01!',
    avatar: '💪',
    role: 'member',
    locationId: 'loc-1',
    joinedAt: new Date('2025-01-01'),
    lastSeenAt: new Date(),
    currentLevel: 'conflict',
    techniqueProgress: {
      't-1-1': {
        techniqueId: 't-1-1',
        status: 'tac_passed',
        tacPassedAt: new Date('2025-02-01'),
        tacExaminerId: 'user-instructor',
        tacExaminerName: 'Holger',
        practiceCount: 8
      },
      't-1-2': {
        techniqueId: 't-1-2',
        status: 'tech_passed',
        techPassedAt: new Date('2025-02-15'),
        techExaminerId: 'user-instructor',
        techExaminerName: 'Holger',
        practiceCount: 5
      },
      't-1-3': {
        techniqueId: 't-1-3',
        status: 'tech_pending',
        practiceCount: 3
      }
    },
    examRequests: [],
    streak: {
      ...createDefaultStreak(),
      currentStreak: 3,
      longestStreak: 5,
      lastTrainingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      bandaids: 1
    },
    isCheckedIn: false,
    xp: 120,
    certificates: [],
    instructorNotes: [],
    deficitHints: []
  }
];

// ============================================
// CHECK-INS
// ============================================

export const CHECK_INS: CheckIn[] = [];

// ============================================
// BOARD MESSAGES
// ============================================

export const BOARD_MESSAGES: BoardMessage[] = [
  {
    id: 'msg-1',
    authorId: 'admin-jay',
    authorName: 'Jay',
    authorRole: 'admin',
    content: 'Willkommen im neuen System! Bitte Zugangsdaten in den Einstellungen prüfen.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    visibility: 'public',
    targetType: 'none'
  }
];

// ============================================
// VIDEOS
// ============================================

export const VIDEOS: Video[] = MODULES.slice(0, 5).flatMap((module, mIdx) =>
  module.techniques.slice(0, 3).map((tech, tIdx) => ({
    id: `vid-${module.id}-${tIdx}`,
    title: tech.name,
    description: tech.description,
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: `https://picsum.photos/seed/${mIdx}${tIdx}/320/180`,
    moduleId: module.id,
    techniqueId: tech.id,
    level: module.level,
    duration: 180 + Math.floor(Math.random() * 300),
    order: tIdx + 1,
    isRequired: tech.isRequired
  }))
);

// ============================================
// COURSES
// ============================================

export const COURSES: Course[] = [
  {
    id: 'course-1',
    name: 'Conflict Ready Basics',
    description: 'Grundlagen für Einsteiger',
    level: 'conflict',
    locationId: 'loc-1',
    instructorId: 'user-instructor',
    instructorName: 'Holger',
    dayOfWeek: 1, // Montag
    startTime: '18:00',
    endTime: '19:30',
    maxParticipants: 20,
    participantIds: ['user-test']
  },
  {
    id: 'course-2',
    name: 'Combat Ready Training',
    description: 'Fortgeschrittenen-Training',
    level: 'combat',
    locationId: 'loc-1',
    instructorId: 'admin-jay',
    instructorName: 'Jay',
    dayOfWeek: 3, // Mittwoch
    startTime: '19:00',
    endTime: '20:30',
    maxParticipants: 15,
    participantIds: []
  }
];

// ============================================
// NOTIFICATIONS
// ============================================

export const NOTIFICATIONS: Notification[] = [];
