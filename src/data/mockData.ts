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
    headInstructorId: 'user-owner',
    instructorIds: ['user-owner', 'user-head', 'user-instructor', 'user-assistant'],
    createdAt: new Date('2020-01-01')
  }
];

// ============================================
// HELPER: Create default streak data
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

// ============================================
// MEMBERS
// ============================================

const allTechniques = getAllTechniques();

export const MEMBERS: Member[] = [
  // ADMIN 001 - Jay I
  {
    id: '001',
    name: 'Jay I',
    email: 'jay1@martialinstinct.de',
    password: 'owner123',
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
        tacExaminerId: '001',
        tacExaminerName: 'Jay I'
      }])
    ),
    examRequests: [],
    streak: { ...createDefaultStreak(), currentStreak: 52, longestStreak: 52, lastTrainingDate: new Date() },
    isCheckedIn: false,
    certificates: [],
    instructorNotes: [],
    deficitHints: []
  },
  // OWNER 002 - Jay II
  {
    id: '002',
    name: 'Jay II',
    email: 'jay2@martialinstinct.de',
    password: 'owner123',
    avatar: '👑',
    role: 'owner',
    locationId: 'loc-1',
    joinedAt: new Date('2020-01-01'),
    lastSeenAt: new Date(),
    currentLevel: 'contact',
    techniqueProgress: Object.fromEntries(
      allTechniques.map(t => [t.id, {
        techniqueId: t.id,
        status: 'tac_passed' as const,
        tacPassedAt: new Date('2020-01-01'),
        tacExaminerId: '002',
        tacExaminerName: 'Jay II'
      }])
    ),
    examRequests: [],
    streak: { ...createDefaultStreak(), currentStreak: 52, longestStreak: 52, lastTrainingDate: new Date() },
    isCheckedIn: false,
    certificates: [],
    instructorNotes: [],
    deficitHints: []
  },
  // HEAD INSTRUCTOR
  {
    id: 'user-head',
    name: 'Jay I',
    email: 'jay.head@martialinstinct.de',
    password: 'head123',
    avatar: '🎖️',
    role: 'admin',
    locationId: 'loc-1',
    joinedAt: new Date('2021-01-01'),
    lastSeenAt: new Date(),
    currentLevel: 'tactical',
    techniqueProgress: Object.fromEntries(
      allTechniques.filter(t => t.level !== 'contact').map(t => [t.id, {
        techniqueId: t.id,
        status: 'tac_passed' as const,
        tacPassedAt: new Date('2021-06-01'),
        tacExaminerId: '001',
        tacExaminerName: 'Jay I'
      }])
    ),
    examRequests: [],
    streak: { ...createDefaultStreak(), currentStreak: 24, longestStreak: 30, lastTrainingDate: new Date() },
    isCheckedIn: false,
    certificates: [],
    instructorNotes: [],
    deficitHints: []
  },
  // INSTRUCTOR
  {
    id: 'user-instructor',
    name: 'Holger',
    email: 'holger@martialinstinct.de',
    password: 'inst123',
    avatar: '🥋',
    role: 'instructor',
    locationId: 'loc-1',
    joinedAt: new Date('2022-01-01'),
    lastSeenAt: new Date(),
    currentLevel: 'combat',
    techniqueProgress: Object.fromEntries(
      allTechniques.filter(t => ['conflict', 'combat'].includes(t.level)).map(t => [t.id, {
        techniqueId: t.id,
        status: 'tac_passed' as const,
        tacPassedAt: new Date('2022-06-01'),
        tacExaminerId: 'user-head',
        tacExaminerName: 'Jay I'
      }])
    ),
    examRequests: [],
    streak: { ...createDefaultStreak(), currentStreak: 12, longestStreak: 18, lastTrainingDate: new Date() },
    isCheckedIn: false,
    certificates: [],
    instructorNotes: [],
    deficitHints: []
  },
  // ASSISTANT INSTRUCTOR
  {
    id: 'user-assistant',
    name: 'Hannah',
    email: 'hannah@martialinstinct.de',
    password: 'assist123',
    avatar: '🌟',
    role: 'assistant_instructor',
    locationId: 'loc-1',
    joinedAt: new Date('2023-01-01'),
    lastSeenAt: new Date(),
    currentLevel: 'conflict',
    techniqueProgress: Object.fromEntries(
      allTechniques.filter(t => t.level === 'conflict').map(t => [t.id, {
        techniqueId: t.id,
        status: 'tac_passed' as const,
        tacPassedAt: new Date('2023-06-01'),
        tacExaminerId: 'user-instructor',
        tacExaminerName: 'Holger'
      }])
    ),
    examRequests: [],
    streak: { ...createDefaultStreak(), currentStreak: 8, longestStreak: 8, lastTrainingDate: new Date() },
    isCheckedIn: false,
    certificates: [],
    instructorNotes: [],
    deficitHints: []
  },
  // REGULAR MEMBER 1 - Mad Max
  {
    id: 'user-member-1',
    name: 'Mad Max',
    email: 'max@email.de',
    password: 'member123',
    avatar: '💪',
    role: 'member',
    locationId: 'loc-1',
    joinedAt: new Date('2024-01-15'),
    lastSeenAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    currentLevel: 'conflict',
    techniqueProgress: {
      't-1-1': {
        techniqueId: 't-1-1',
        status: 'tac_passed',
        tacPassedAt: new Date('2024-02-01'),
        tacExaminerId: 'user-instructor',
        tacExaminerName: 'Holger',
        practiceCount: 8
      },
      't-1-2': {
        techniqueId: 't-1-2',
        status: 'tac_passed',
        tacPassedAt: new Date('2024-02-01'),
        tacExaminerId: 'user-instructor',
        tacExaminerName: 'Holger',
        practiceCount: 6
      },
      't-1-3': {
        techniqueId: 't-1-3',
        status: 'tech_pending',
        practiceCount: 5
      },
      't-2-1': {
        techniqueId: 't-2-1',
        status: 'tech_passed',
        techPassedAt: new Date('2024-02-15'),
        techExaminerId: 'user-instructor',
        techExaminerName: 'Holger',
        practiceCount: 7
      },
    },
    examRequests: [
      {
        id: 'req-1',
        memberId: 'user-member-1',
        memberName: 'Mad Max',
        techniqueId: 't-1-3',
        techniqueName: 'Grundbewegungen vorwärts/rückwärts',
        moduleId: 'mod-1',
        moduleName: 'Mission Begins',
        examLevel: 'technical',
        requestedAt: new Date(),
        status: 'pending'
      }
    ],
    streak: {
      ...createDefaultStreak(),
      currentStreak: 3,
      longestStreak: 5,
      lastTrainingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      bandaids: 1
    },
    isCheckedIn: false,
    xp: 320,
    certificates: [],
    instructorNotes: [
      {
        id: 'note-1',
        authorId: 'user-instructor',
        authorName: 'Holger',
        content: 'Zeigt gute Grundlagen, muss an Ausdauer arbeiten.',
        createdAt: new Date('2024-02-01')
      }
    ],
    deficitHints: []
  },
  // REGULAR MEMBER 2 - Salma
  {
    id: 'user-member-2',
    name: 'Salma',
    email: 'salma@email.de',
    password: 'member123',
    avatar: '🔥',
    role: 'member',
    locationId: 'loc-1',
    joinedAt: new Date('2023-06-01'),
    lastSeenAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    currentLevel: 'combat',
    techniqueProgress: Object.fromEntries([
      ...allTechniques.filter(t => t.level === 'conflict').map(t => [t.id, {
        techniqueId: t.id,
        status: 'tac_passed' as const,
        tacPassedAt: new Date('2023-12-01'),
        tacExaminerId: 'user-instructor',
        tacExaminerName: 'Holger',
        practiceCount: 10
      }]),
      ...allTechniques.filter(t => t.level === 'combat').slice(0, 10).map(t => [t.id, {
        techniqueId: t.id,
        status: 'tac_passed' as const,
        tacPassedAt: new Date('2024-02-01'),
        tacExaminerId: 'user-head',
        tacExaminerName: 'Jay I',
        practiceCount: 8
      }])
    ]),
    examRequests: [],
    streak: {
      ...createDefaultStreak(),
      currentStreak: 12,
      longestStreak: 16,
      lastTrainingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      bandaids: 2
    },
    isCheckedIn: false,
    certificates: [
      {
        id: 'cert-1',
        memberId: 'user-member-2',
        memberName: 'Salma',
        level: 'conflict',
        issuedAt: new Date('2023-12-15'),
        locationId: 'loc-1',
        locationName: 'Martial Instinct HQ',
        examinerId: 'user-head',
        examinerName: 'Jay I',
        qrCode: 'MI-CERT-001'
      }
    ],
    xp: 840,
    instructorNotes: [],
    deficitHints: []
  },
  // REGULAR MEMBER 3 - Peter
  {
    id: 'user-member-3',
    name: 'Peter',
    email: 'peter@email.de',
    password: 'member123',
    avatar: '🎯',
    role: 'member',
    locationId: 'loc-1',
    joinedAt: new Date('2024-02-01'),
    lastSeenAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    currentLevel: 'conflict',
    techniqueProgress: {
      't-1-1': {
        techniqueId: 't-1-1',
        status: 'tech_pending',
        practiceCount: 5
      },
    },
    examRequests: [
      {
        id: 'req-2',
        memberId: 'user-member-3',
        memberName: 'Peter',
        techniqueId: 't-1-1',
        techniqueName: 'Richtige Stellung',
        moduleId: 'mod-1',
        moduleName: 'Mission Begins',
        examLevel: 'technical',
        requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'pending'
      }
    ],
    streak: {
      ...createDefaultStreak(),
      currentStreak: 0,
      longestStreak: 2,
      lastTrainingDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    isCheckedIn: false,
    xp: 80,
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
    authorId: '001',
    authorName: 'Jay I',
    authorRole: 'admin',
    content: 'Willkommen im neuen System! Bitte alle Instructor-Zugänge testen.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'msg-2',
    authorId: 'user-head',
    authorName: 'Jay I',
    authorRole: 'admin',
    content: 'Neuer Kursplan ab nächster Woche. Bitte Bescheid geben wer wann kann.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
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
    dayOfWeek: 1, // Monday
    startTime: '18:00',
    endTime: '19:30',
    maxParticipants: 20,
    participantIds: ['user-member-1', 'user-member-3']
  },
  {
    id: 'course-2',
    name: 'Combat Ready Training',
    description: 'Fortgeschrittenen-Training',
    level: 'combat',
    locationId: 'loc-1',
    instructorId: 'user-head',
    instructorName: 'Jay I',
    dayOfWeek: 3, // Wednesday
    startTime: '19:00',
    endTime: '20:30',
    maxParticipants: 15,
    participantIds: ['user-member-2']
  },
  {
    id: 'course-3',
    name: 'Open Mat',
    description: 'Freies Training für alle Level',
    level: 'conflict',
    locationId: 'loc-1',
    instructorId: 'user-assistant',
    instructorName: 'Hannah',
    dayOfWeek: 5, // Friday
    startTime: '17:00',
    endTime: '19:00',
    maxParticipants: 30,
    participantIds: []
  }
];

// ============================================
// NOTIFICATIONS
// ============================================

export const NOTIFICATIONS: Notification[] = [];
