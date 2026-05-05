// ============================================
// MARTIAL INSTINCT - SYSTEM TYPES
// Autorität vor Automatisierung
// Struktur vor Emotion
// Standardisierung vor Wachstum
// ============================================

// Technik-Status (pro Technik, zwei Prüfebenen)
export type TechniqueStatus =
  | 'not_tested'      // ○ Noch nicht geprüft
  | 'tech_pending'    // ⏳ Technische Prüfung beantragt
  | 'tech_passed'     // ◐ Tactical — technisch-taktisches Verständnis
  | 'tac_pending'     // ⏳ Combat-Prüfung beantragt
  | 'tac_passed'      // ● Combat — Technik unter Druck abrufbar
  | 'needs_training'; // ↩ Nachtrainieren empfohlen

// Module/Level
export type ModuleLevel = 'conflict' | 'combat' | 'tactical' | 'contact' | 'assistant_instructor' | 'instructor_level';

// Instructor-Hierarchie
export type InstructorRole =
  | 'member'              // Normales Mitglied
  | 'assistant_instructor' // Unterstützt, keine Prüfberechtigung
  | 'instructor'          // Leitet Trainings, keine Prüfungsfreigabe Combat+
  | 'full_instructor'     // Alle Level unterrichten, keine Tactical-Prüfung
  | 'head_instructor'     // Darf Conflict, Combat, Tactical prüfen
  | 'admin';              // Administrator mit allen Rechten — volle Systemautorität

// Prüfungsberechtigungen pro Rolle
export const EXAM_PERMISSIONS: Record<InstructorRole, ModuleLevel[]> = {
  member: [],
  assistant_instructor: [],
  instructor: [],
  full_instructor: ['conflict'],
  head_instructor: ['conflict', 'combat', 'tactical'],
  admin: ['conflict', 'combat', 'tactical', 'contact', 'assistant_instructor', 'instructor_level']
};

// Unterrichtsberechtigungen pro Rolle
export const TEACHING_PERMISSIONS: Record<InstructorRole, ModuleLevel[]> = {
  member: [],
  assistant_instructor: ['conflict'],
  instructor: ['conflict', 'combat'],
  full_instructor: ['conflict', 'combat', 'tactical', 'contact'],
  head_instructor: ['conflict', 'combat', 'tactical', 'contact'],
  admin: ['conflict', 'combat', 'tactical', 'contact', 'assistant_instructor', 'instructor_level']
};

// Admin-Zugang: Admin immer, Head Instructor individuell entziehbar
export const hasAdminAccess = (member: { role: InstructorRole; adminAccess?: boolean }): boolean => {
  if (member.role === 'admin') return true;
  if (member.role === 'head_instructor') return member.adminAccess !== false; // default true
  return false;
};

// Standort
export interface Location {
  id: string;
  name: string;
  address: string;
  headInstructorId: string;
  instructorIds: string[];
  createdAt: Date;
}

// Technik
export interface Technique {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  level: ModuleLevel;
  isRequired: boolean;
  videoUrl?: string;
  order: number;
}

// Modul
export interface Module {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  level: ModuleLevel;
  description: string;
  icon: string;
  techniques: Technique[];
  requiredTechniquesPercent: number;
}

// Block (Conflict Ready, Combat Ready, etc.)
export interface Block {
  id: string;
  name: string;
  subtitle: string;
  level: ModuleLevel;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  moduleIds: string[];
  requiresApplication: boolean;
  adminOnly?: boolean;  // Block nur für Admins sichtbar
  disabled?: boolean;   // Block deaktiviert (nicht angezeigt)
}

// Technik-Fortschritt eines Mitglieds (zwei Prüfebenen)
export interface TechniqueProgress {
  techniqueId: string;
  status: TechniqueStatus;
  // Technisch-Ebene
  techPassedAt?: Date;
  techExaminerId?: string;
  techExaminerName?: string;
  // Taktisch-Ebene
  tacPassedAt?: Date;
  tacExaminerId?: string;
  tacExaminerName?: string;
  // Letzter Trainer-Kommentar
  lastFeedback?: string;
  // Praxis
  practiceCount?: number;
  lastPracticedAt?: Date;
  lastSelfPracticedAt?: Date;    // Tages-Limit: Selbst-Markierung (max 1×/Tag)
  lastTheoryPracticedAt?: Date;  // Tages-Limit: Theorie-Quiz (max 1×/Tag)
}

// Prüfungsanfrage
export interface ExamRequest {
  id: string;
  memberId: string;
  memberName: string;
  techniqueId: string;
  techniqueName: string;
  moduleId: string;
  moduleName: string;
  examLevel: 'technical' | 'tactical';    // Welche Prüfebene wird angefragt
  requestedAt: Date;
  status: 'pending' | 'passed' | 'needs_training';
  examinerId?: string;
  examinerName?: string;
  feedback?: string;    // Pflichtkommentar (für beide Outcomes)
  processedAt?: Date;
}

// Wunschtechnik (Mitglied meldet gewünschte Technik)
export interface TechniqueWish {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  techniqueId: string;
  techniqueName: string;
  moduleId: string;
  moduleName: string;
  submittedAt: Date;
  status: 'pending' | 'acknowledged';
}

// Streak & Bandaid System
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastTrainingDate: Date | null;
  weekStartDate: Date;
  bandaids: number;
  maxBandaids: number;
  streakHistory: StreakWeek[];
  bandaidHistory: BandaidEvent[];
}

export interface StreakWeek {
  weekStart: Date;
  trained: boolean;
  bandaidUsed: boolean;
}

export interface BandaidEvent {
  id: string;
  type: 'earned' | 'used';
  reason: string;
  date: Date;
}

// Bandaid-Verdienst-Gründe
export type BandaidReason = 
  | 'streak_4_weeks'
  | 'checkins_10'
  | 'module_complete'
  | 'videos_complete'
  | 'techniques_5_day'
  | 'quiz_passed'
  | 'application_approved'
  | 'birthday'
  | 'instructor_bonus'
  | 'referral'
  | 'event_participation';

// Badge (live-computed aus Fortschrittsdaten)
export interface Badge {
  id: string;
  label: string;
  icon: string;        // Emoji-Fallback
  imageUrl?: string;   // Optionales Patch-Bild (PNG mit Transparenz)
  scale?: number;      // Zoom-Faktor (1.0 = normal, >1 = reingezoomt)
  description: string;
  earnedAt: Date;
}

// Mitglied
export interface Member {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: InstructorRole;
  locationId: string;
  joinedAt: Date;
  lastSeenAt: Date;
  onlineSince?: Date;   // Gesetzt bei Login, gelöscht bei Logout

  // Aktuelles Level
  currentLevel: ModuleLevel;
  
  // Technik-Fortschritt
  techniqueProgress: Record<string, TechniqueProgress>;
  
  // Prüfungsanfragen
  examRequests: ExamRequest[];
  
  // Streak
  streak: StreakData;
  
  // Check-in Status
  isCheckedIn: boolean;
  checkedInAt?: Date;
  
  // Contact Ready Bewerbung
  contactApplication?: ContactApplication;
  
  // Assistant Instructor Bewerbung
  assistantInstructorApplication?: InstructorApplication;
  
  // Zertifikate
  certificates: Certificate[];
  
  // Instructor-Notizen (nur für Instructors sichtbar)
  instructorNotes?: InstructorNote[];
  
  // Defizit-Hinweise (nach Instructor-Bestätigung)
  deficitHints?: DeficitHint[];

  // Trainings-Log (techniqueId → letztes Datum aus Trainer-Session)
  trainedTechniqueLog?: Record<string, Date>;

  // Instructor-Lernfortschritt (nur für Instructor-Rollen relevant)
  instructorLessonProgress?: Record<string, InstructorLessonProgress>;

  // Admin-Zugang (nur relevant für head_instructor — owner/admin immer admin)
  adminAccess?: boolean;

  // Profilbild (base64)
  profileImageUrl?: string;

  // XP (Erfahrungspunkte aus Quiz-Sessions)
  xp?: number;

  // Benachrichtigungs-Einstellungen
  notificationPrefs?: {
    sound: boolean;
    email: boolean; // Präferenz gespeichert — Versand benötigt Backend
  };

  // Member-Quiz-Fortschritt (moduleId → letzte Session)
  quizProgress?: Record<string, MemberQuizProgress>;

  // Stop The Bleed Zertifizierung
  stopTheBleedCertified?: boolean;

  // Anzeige-Badge (offiziell verdient — Auswahl folgt)
  customBadge?: string;

  // Verdiente Badges
  badges?: Badge[];

  // Sichtbarkeit: wer sieht Online- und Trainingsstatus
  visibilityPreference?: 'all' | 'buddies'; // default: 'all'

  // MI-Mitgliedsnummer (z.B. MI-0042)
  memberId?: string;

  // Geschlecht
  gender?: 'male' | 'female';

  // Verbundene Mitglieder (in-person Connect via Code)
  connections?: string[];  // Array von Member-IDs

  // Aktiver Buddy-Code (in Supabase gespeichert für Cross-Device)
  buddyCode?: { code: string; expiresAt: number };

  // Eingehende Trainingspartner-Anfragen (in Supabase gespeichert)
  buddyRequests?: BuddyRequest[];

  // Module die dieser Instructor unterrichten kann
  instructorModules?: string[];  // Array von Module-IDs

  // Vorfortschritt beim Anlegen (gesetzt vom Admin)
  initialModuleProgress?: Record<number, { tactics: boolean; combat: boolean }>; // Modul 1-10

  // Persönliche Daten (Kerndaten — nur Admin editierbar außer Anzeigename)
  firstName?: string;
  lastName?: string;
  birthDate?: string; // ISO "YYYY-MM-DD", Anzeige: TT.MM.YYYY
  // name = Anzeigename (bereits vorhanden, bleibt)

  // Sichtbarkeit auf dem Profil (Member stellt selbst ein)
  dataVisibility?: {
    showLastName?: boolean;           // default: false
    showMemberId?: boolean;           // default: false
    birthDateVisibility?: 'hidden' | 'dayMonth' | 'full'; // default: 'hidden'
  };

  // Gesamtanzahl bestätigter Trainingseinheiten (inkl. Check-Ins)
  totalTrainingSessions?: number;
}

export interface MemberQuizProgress {
  moduleId: string;
  lastScore: number;       // Prozent
  bestScore: number;
  completedAt: Date;
  totalSessions: number;
}

// Beitrittsanfrage (via QR-Code / Join-Seite)
export interface JoinRequest {
  id: string;
  name: string;
  email: string;
  memberIdHint?: string;  // Vom Schüler angegebene Mitglieds-ID / Spitzname zur Verifikation
  course?: string;         // Angegebener Kurs zur Verifikation
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  processedAt?: Date;
}

// Daten für Profil-Erstellung durch Admin
export interface CreateMemberData {
  name: string;
  email: string;
  password: string;
  memberId: string; // MI-XXXX
  moduleProgress: Record<number, { tactics: boolean; combat: boolean }>; // 1-10
  stopTheBleedCertified: boolean;
  joinRequestId?: string;
}

// Contact Ready Bewerbung
export interface ContactApplication {
  id: string;
  memberId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  processedAt?: Date;
  processedBy?: string;
  
  // Bewerbungsfragen
  answers: {
    motivation: string;
    experience: string;
    teamwork: string;
    stressHandling: string;
    protectionOfOthers: string;
    availability: string;
  };
  
  feedback?: string;
}

// Assistant Instructor / Instructor Bewerbung
export interface InstructorApplication {
  id: string;
  memberId: string;
  type: 'assistant_instructor' | 'instructor_level';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  processedAt?: Date;
  processedBy?: string;
  
  // Bewerbungsfragen
  answers: {
    motivation: string;           // Warum möchtest du Instructor werden?
    teachingExperience: string;   // Hast du bereits Unterrichtserfahrung?
    strengthsWeaknesses: string;  // Was sind deine Stärken und Schwächen?
    availability: string;         // Wann kannst du unterrichten?
    goals: string;                // Was sind deine Ziele als Instructor?
    roleModel: string;            // Was macht für dich einen guten Instructor aus?
  };
  
  feedback?: string;
}

// Zertifikat
export interface Certificate {
  id: string;
  memberId: string;
  memberName: string;
  level: ModuleLevel;
  issuedAt: Date;
  locationId: string;
  locationName: string;
  examinerId: string;
  examinerName: string;
  qrCode: string;
  patchAwarded?: boolean;
}

// Instructor-Notiz
export interface InstructorNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

// Defizit-Hinweis (KI-generiert, Instructor-bestätigt)
export interface DeficitHint {
  id: string;
  techniqueId: string;
  techniqueName: string;
  hint: string;
  suggestedBy: 'ai' | 'instructor';
  confirmedByInstructorId?: string;
  confirmedAt?: Date;
  resolved: boolean;
}

// Trainings-Session (Instructor dokumentiert Training-Inhalte)
export interface TrainingGroup {
  id: string;
  name: string;           // z.B. "Alle", "Gruppe 1 – Anfänger"
  memberIds: string[];    // Teilmenge der Anwesenden
  techniqueIds: string[]; // Welche Techniken diese Gruppe trainiert hat
}

export interface TrainingSession {
  id: string;
  locationId: string;
  instructorId: string;
  instructorName: string;
  courseId?: string;      // Auto-erkannt via detectCurrentCourse
  courseName?: string;
  date: Date;
  attendeeIds: string[];  // Alle bestätigten + manuell hinzugefügten Members
  groups: TrainingGroup[];
  notes?: string;
  createdAt: Date;
  status: 'draft' | 'completed';
}

// Trainingseinheit (wöchentlich wiederkehrend)
export interface TrainingUnit {
  id: string;
  name: string;
  daysOfWeek: number[];  // 0=So, 1=Mo, 2=Di, 3=Mi, 4=Do, 5=Fr, 6=Sa
  startTime: string;     // HH:MM
  endTime: string;       // HH:MM
}

// Check-in
export interface CheckIn {
  id: string;
  memberId: string;
  memberName: string;
  locationId: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvedById?: string;
  approvedByName?: string;
  approvedAt?: Date;
  unitId?: string;
  unitName?: string;
}

// Benachrichtigung
export interface Notification {
  id: string;
  oduserId: string;
  type: 'exam_result' | 'exam_request' | 'checkin' | 'certificate' | 'application' | 'system' | 'bandaid' | 'board' | 'buddy_request';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: Record<string, unknown>;
}

// Temporärer Buddy-Code (15 Minuten gültig)
export interface BuddyCode {
  code: string;
  generatedBy: string;   // memberId
  expiresAt: number;     // Date.now() + 15 * 60 * 1000
}

// Buddy-Anfrage (Zwei-Schritt-Bestätigung)
export interface BuddyRequest {
  id: string;
  fromMemberId: string;
  fromMemberName: string;
  toMemberId: string;
  code: string;
  createdAt: number;
  status: 'pending' | 'accepted';
}

// Kurs/Training
export interface Course {
  id: string;
  name: string;
  description: string;
  level: ModuleLevel;
  locationId: string;
  instructorId: string;
  instructorName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  participantIds: string[];
}

// Board Reply (Thread innerhalb eines Posts)
export interface BoardReply {
  id: string;
  parentId: string;       // BoardMessage.id
  authorId: string;
  authorName: string;
  authorRole: InstructorRole;
  content: string;
  createdAt: Date;
}

// Instructor Board Nachricht
export interface BoardMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: InstructorRole;
  content: string;
  createdAt: Date;
  locationId?: string;
  // Sichtbarkeit & Targeting
  visibility: 'public' | 'restricted'; // public = alle sehen, restricted = nur Ausgewählte
  targetType: 'all' | 'roles' | 'members' | 'gender' | 'activity'; // 'all' = kein Filter = alle
  targetRoles?: InstructorRole[];
  targetMemberIds?: string[];
  targetGenders?: ('male' | 'female')[];
  targetActivityValue?: number;                          // Anzahl
  targetActivityUnit?: 'days' | 'weeks' | 'months';     // Einheit
  // Thread & Lesebestätigung
  replies?: BoardReply[];
  readBy?: string[];          // Member-IDs die gelesen haben (inkl. Autor + Antwortende)
  requiredReaders?: string[]; // IDs die lesen müssen (bei restricted)
  repliesEnabled?: boolean;   // false = Antworten gesperrt (default: true)
}

// Classroom Video
export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  moduleId: string;
  techniqueId?: string;
  level: ModuleLevel;
  duration: number;
  order: number;
  isRequired: boolean;
}

export interface VideoProgress {
  videoId: string;
  watched: boolean;
  watchedAt?: Date;
  progress: number;
  notes?: string;
  bookmarked: boolean;
}

// Quiz
export interface Quiz {
  id: string;
  videoId: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export type QuizQuestionType = 'single' | 'truefalse' | 'multiple' | 'matching' | 'fillblank';

export interface MatchingPair {
  left: string;
  right: string;
}

export interface QuizQuestion {
  id: string;
  type?: QuizQuestionType;    // undefined → 'single' (rückwärtskompatibel)
  question: string;
  options?: string[];          // single / truefalse / fillblank / multiple
  correctIndex?: number;       // single / truefalse / fillblank
  correctIndices?: number[];   // multiple: alle korrekten Indizes
  pairs?: MatchingPair[];      // matching: immer 4 Paare
  explanation?: string;
  moduleId?: string;
  position?: number;
  topic?: string;              // Themen-Slug für topic-basierte Navigation (z.B. 'paragraphen', 'stellungen')
}

// Dynamische Technik (aus Supabase, ersetzt hardcoded Techniques in modules.ts)
export interface ContentTechnique {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  isRequired: boolean;
  position: number;
}

// Pro-Modul Quiz-Einstellungen
export interface ModuleSettings {
  moduleId: string;
  quizCount: number;
  disabled?: boolean;
}

// ── Quiz-Flagging ─────────────────────────────────────────────────────────────
export interface FlaggedQuestion {
  questionId: string;
  moduleId: string;
  flaggedBy: string;
  flaggedByName: string;
  flaggedByRole: InstructorRole;
  comment: string;
  flaggedAt: Date;
}

// ── Quiz-Prüfungsstatus pro Modul ─────────────────────────────────────────────
export interface QuizExamAttempt {
  attempts: number;          // 0 | 1 | 2
  lastAttemptAt: Date | null;
  passedAt: Date | null;
  banUntil: Date | null;     // gesetzt nach 2 Fehlversuchen (+ 30 Tage)
}

export interface QuizResult {
  quizId: string;
  score: number;
  passed: boolean;
  completedAt: Date;
  answers: number[];
}

// ============================================
// INSTRUCTOR-LERNPLATTFORM (Trainer-Leitfaden v2.3)
// ============================================

export type InstructorTrackId = 'didaktik' | 'technik' | 'business' | 'karriere';

export interface InstructorQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string; // Erklärung nach der Antwort (Duolingo-Style)
}

export interface InstructorQuiz {
  questions: InstructorQuizQuestion[];
  passingScore: number; // Prozent, z.B. 80
}

export interface InstructorLesson {
  id: string;
  trackId: InstructorTrackId;
  title: string;
  content: string;     // Lerninhalt als Text
  keyPoints: string[]; // Kernpunkte als Bullet-Liste
  quiz?: InstructorQuiz;
  order: number;
  estimatedMinutes: number;
}

export interface InstructorTrack {
  id: InstructorTrackId;
  title: string;
  icon: string;
  description: string;
  lessons: InstructorLesson[];
}

export interface InstructorLessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
  quizScore?: number;
  quizPassed?: boolean;
  lastAttemptAt?: Date;
}

// App State
export interface AppState {
  currentUser: Member | null;
  members: Member[];
  locations: Location[];
  modules: Module[];
  blocks: Block[];
  videos: Video[];
  courses: Course[];
  checkIns: CheckIn[];
  boardMessages: BoardMessage[];
  notifications: Notification[];
}

// Status Display Helpers
export const STATUS_DISPLAY: Record<TechniqueStatus, { icon: string; label: string; color: string }> = {
  not_tested:     { icon: '○',  label: 'Nicht geprüft',        color: 'text-gray-500' },
  tech_pending:   { icon: '⏳', label: 'Prüfung angefragt',    color: 'text-yellow-400' },
  tech_passed:    { icon: '◐',  label: 'Tactical',  color: 'text-blue-400' },
  tac_pending:    { icon: '⏳', label: 'Prüfung angefragt',    color: 'text-yellow-400' },
  tac_passed:     { icon: '●',  label: 'Combat',    color: 'text-green-400' },
  needs_training: { icon: '↩',  label: 'Nachtrainieren',       color: 'text-orange-400' },
};

export const LEVEL_DISPLAY: Record<ModuleLevel, { name: string; subtitle: string; color: string; bgColor: string; icon: string }> = {
  conflict: { name: 'CONFLICT READY', subtitle: 'Beginner', color: 'text-gray-400', bgColor: 'bg-gray-800', icon: '⚪' },
  combat: { name: 'COMBAT READY', subtitle: 'Advanced', color: 'text-gray-100', bgColor: 'bg-gray-900', icon: '⚫' },
  tactical: { name: 'TACTICAL READY', subtitle: 'Specialist', color: 'text-red-500', bgColor: 'bg-red-900/30', icon: '🔴' },
  contact: { name: 'CONTACT READY', subtitle: 'Operator', color: 'text-red-400', bgColor: 'bg-gradient-to-r from-gray-900 to-red-900', icon: '☠️' },
  assistant_instructor: { name: 'ASSISTANT INSTRUCTOR', subtitle: 'Ausbilder', color: 'text-yellow-400', bgColor: 'bg-gradient-to-r from-yellow-900/30 to-amber-900/30', icon: '🎓' },
  instructor_level: { name: 'INSTRUCTOR', subtitle: 'Vollausbilder', color: 'text-purple-400', bgColor: 'bg-gradient-to-r from-purple-900/30 to-pink-900/30', icon: '👑' }
};

// Reihenfolge der Module (wird in Supabase persistiert)
export interface ModuleOrder {
  moduleId: string;
  blockLevel: string;
  position: number;
}

// ── Rechte-Matrix ────────────────────────────────────────────────────────────
export interface RolePermissions {
  canPostToBoard: boolean;
  canRestrictBoardVisibility: boolean; // Nur Admin
  canManageOwnStudents: boolean;       // Full Instructor+
  canManageCenter: boolean;            // Head Instructor+
  canGrantAdminAccess: boolean;        // Nur Admin
  canViewAllMembers: boolean;
  canApproveExams: boolean;
  canTrainInstructors: boolean;        // Head Instructor+
}

export type PermissionsConfig = Record<InstructorRole, RolePermissions>;

export const DEFAULT_PERMISSIONS: PermissionsConfig = {
  member:               { canPostToBoard: false, canRestrictBoardVisibility: false, canManageOwnStudents: false, canManageCenter: false, canGrantAdminAccess: false, canViewAllMembers: false, canApproveExams: false, canTrainInstructors: false },
  assistant_instructor: { canPostToBoard: true,  canRestrictBoardVisibility: false, canManageOwnStudents: false, canManageCenter: false, canGrantAdminAccess: false, canViewAllMembers: false, canApproveExams: false, canTrainInstructors: false },
  instructor:           { canPostToBoard: true,  canRestrictBoardVisibility: false, canManageOwnStudents: true,  canManageCenter: false, canGrantAdminAccess: false, canViewAllMembers: false, canApproveExams: false, canTrainInstructors: false },
  full_instructor:      { canPostToBoard: true,  canRestrictBoardVisibility: false, canManageOwnStudents: true,  canManageCenter: false, canGrantAdminAccess: false, canViewAllMembers: true,  canApproveExams: true,  canTrainInstructors: false },
  head_instructor:      { canPostToBoard: true,  canRestrictBoardVisibility: false, canManageOwnStudents: true,  canManageCenter: true,  canGrantAdminAccess: false, canViewAllMembers: true,  canApproveExams: true,  canTrainInstructors: true  },
  admin:                { canPostToBoard: true,  canRestrictBoardVisibility: true,  canManageOwnStudents: true,  canManageCenter: true,  canGrantAdminAccess: true,  canViewAllMembers: true,  canApproveExams: true,  canTrainInstructors: true  },
};

// ── Tab-Verwaltung ────────────────────────────────────────────────────────────
export type MemberTabId = 'dashboard' | 'training' | 'community' | 'profil';
export type InstructorTabId = 'dashboard' | 'training' | 'community' | 'profil' | 'admin';

export interface PlatformTabConfig {
  memberTabs:     Record<MemberTabId, boolean>;
  instructorTabs: Record<InstructorTabId, boolean>;
}

export const DEFAULT_TAB_CONFIG: PlatformTabConfig = {
  memberTabs:     { dashboard: true, training: true, community: true, profil: true },
  instructorTabs: { dashboard: true, training: true, community: true, profil: true, admin: true },
};

// ── Plattform-Konfiguration ───────────────────────────────────────────────────

export interface PlatformConfig {
  // XP-Vergabe
  xp: {
    checkIn: number;            // Training Check-In bestätigt
    techniqueSession: number;   // Technik in Session eingetragen (pro Stück)
    quizCorrect: number;        // Quiz-Frage richtig (Practice)
    quizBonusAllCorrect: number;// Bonus wenn alle Fragen richtig
    examPass: number;           // Prüfungsquiz bestanden
    techPassed: number;         // Technik technisch bestanden (tech_passed)
    tacPassed: number;          // Technik taktisch bestanden (tac_passed)
    moduleBlock: number[];      // Modul abgeschlossen: XP je Block-Position [0]=Block1 usw.
    stopTheBleed: number;       // Stop The Bleed® zertifiziert
    streakWeeks: number;        // XP alle 10 Streak-Wochen
    streakInterval: number;     // Intervall in Wochen (Standard: 10)
  };
  // Level-System
  levels: {
    xpPerTier: number[];        // XP je Tier à 10 Level: [500, 600, 700, …]
  };
  // Quiz
  quiz: {
    practiceQuestionsPerSession: number;
    examQuestions: number;
    examPassRate: number;       // 0–1, z.B. 0.9 = 90%
  };
}

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  xp: {
    checkIn: 100,
    techniqueSession: 10,
    quizCorrect: 2,
    quizBonusAllCorrect: 10,
    examPass: 120,
    techPassed: 50,
    tacPassed: 200,
    moduleBlock: [800, 1000, 1200, 1400],
    stopTheBleed: 400,
    streakWeeks: 200,
    streakInterval: 10,
  },
  levels: {
    xpPerTier: [500, 600, 700, 800, 900, 1000],
  },
  quiz: {
    practiceQuestionsPerSession: 10,
    examQuestions: 30,
    examPassRate: 0.9,
  },
};

/** XP-Schwelle für ein bestimmtes Level (1-basiert) */
export function xpForLevel(level: number, config: PlatformConfig): number {
  const tiers = config.levels.xpPerTier;
  let total = 0;
  for (let l = 1; l < level; l++) {
    const tierIdx = Math.floor((l - 1) / 10);
    const xpPerLevel = tiers[Math.min(tierIdx, tiers.length - 1)];
    total += xpPerLevel;
  }
  return total;
}

/** Aktuelles Level aus XP berechnen */
export function levelFromXp(xp: number, config: PlatformConfig): number {
  let level = 1;
  let remaining = xp;
  while (true) {
    const tierIdx = Math.floor((level - 1) / 10);
    const xpNeeded = config.levels.xpPerTier[Math.min(tierIdx, config.levels.xpPerTier.length - 1)];
    if (remaining < xpNeeded) break;
    remaining -= xpNeeded;
    level++;
  }
  return level;
}

/** XP innerhalb des aktuellen Levels + XP für nächstes Level */
export function xpProgress(xp: number, config: PlatformConfig): { current: number; needed: number; level: number } {
  const level = levelFromXp(xp, config);
  const tierIdx = Math.floor((level - 1) / 10);
  const needed = config.levels.xpPerTier[Math.min(tierIdx, config.levels.xpPerTier.length - 1)];
  const threshold = xpForLevel(level, config);
  return { current: xp - threshold, needed, level };
}

export const ROLE_DISPLAY: Record<InstructorRole, { label: string; color: string; bgColor: string }> = {
  member: { label: 'Member', color: 'text-gray-400', bgColor: 'bg-gray-800/80' },
  assistant_instructor: { label: 'Assistant Instructor', color: 'text-gray-300', bgColor: 'bg-gray-700/70' },
  instructor: { label: 'Instructor', color: 'text-gray-300', bgColor: 'bg-gray-700/70' },
  full_instructor: { label: 'Full Instructor', color: 'text-gray-300', bgColor: 'bg-gray-700/70' },
  head_instructor: { label: 'Head Instructor', color: 'text-gray-300', bgColor: 'bg-gray-700/70' },
  admin: { label: 'Admin', color: 'text-gray-300', bgColor: 'bg-gray-700/70' }
};
