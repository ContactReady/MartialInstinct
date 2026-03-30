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
    instructorIds: ['admin-jay'],
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
    email: 'jay@martial-instinct.de',
    password: '#Underc0ver',
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
    instructorId: 'admin-jay',
    instructorName: 'Jay',
    dayOfWeek: 1, // Montag
    startTime: '18:00',
    endTime: '19:30',
    maxParticipants: 20,
    participantIds: []
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
