// ============================================
// MARTIAL INSTINCT - MEMBER SERVICE
// Supabase CRUD — passt zum bestehenden DB-Schema
// ============================================

import { supabase } from './supabase';
import { Member } from '../types';

// ── ISO-Strings in JSONB-Objekten → Date ──
function reviveDates(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) return new Date(obj);
    return obj;
  }
  if (Array.isArray(obj)) return obj.map(reviveDates);
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      result[k] = reviveDates(v);
    }
    return result;
  }
  return obj;
}

type DbRow = Record<string, unknown>;

// ── Supabase Row → Member ──
function rowToMember(row: DbRow): Member {
  return {
    id:               row.id as string,
    name:             (row.name as string) || (row.email as string).split('@')[0],
    email:            row.email as string,
    password:         '', // nie gespeichert
    avatar:           (row.avatar as string) || '🥋',
    role:             (row.role as Member['role']) || 'member',
    locationId:       (row.location_id as string) || 'loc-1',
    joinedAt:         row.joined_at ? new Date(row.joined_at as string) : new Date(),
    lastSeenAt:       row.last_seen_at ? new Date(row.last_seen_at as string) : new Date(),
    currentLevel:     (row.current_level as Member['currentLevel']) || 'conflict',
    techniqueProgress: reviveDates(row.technique_progress || {}) as Member['techniqueProgress'],
    examRequests:      reviveDates(row.exam_requests || []) as Member['examRequests'],
    streak:            reviveDates(row.streak || {
      currentStreak: 0, longestStreak: 0, lastTrainingDate: null,
      weekStartDate: new Date(), bandaids: 0, maxBandaids: 2,
      streakHistory: [], bandaidHistory: [],
    }) as Member['streak'],
    isCheckedIn:       false, // runtime only
    certificates:      reviveDates(row.certificates || []) as Member['certificates'],
    instructorNotes:   reviveDates(row.instructor_notes || []) as Member['instructorNotes'],
    deficitHints:      reviveDates(row.deficit_hints || []) as Member['deficitHints'],
    trainedTechniqueLog: row.trained_technique_log
      ? reviveDates(row.trained_technique_log) as Member['trainedTechniqueLog']
      : undefined,
    instructorLessonProgress: row.instructor_lesson_progress
      ? reviveDates(row.instructor_lesson_progress) as Member['instructorLessonProgress']
      : undefined,
    adminAccess:       row.admin_access as boolean | undefined,
    xp:                (row.xp as number) || 0,
    notificationPrefs: row.notification_prefs as Member['notificationPrefs'],
    stopTheBleedCertified: (row.stop_the_bleed_certified as boolean) || false,
    visibilityPreference: row.visibility_preference as Member['visibilityPreference'],
    memberId:          row.member_id as string | undefined,
    firstName:         row.first_name as string | undefined,
    lastName:          row.last_name as string | undefined,
    birthDate:         row.birth_date as string | undefined,
    dataVisibility:    row.data_visibility as Member['dataVisibility'],
    contactApplication: row.contact_application
      ? reviveDates(row.contact_application) as Member['contactApplication']
      : undefined,
    assistantInstructorApplication: row.assistant_instructor_application
      ? reviveDates(row.assistant_instructor_application) as Member['assistantInstructorApplication']
      : undefined,
    instructorModules: (row.instructor_modules as string[]) || [],
    profileImage: row.profile_image as string | undefined,
  };
}

// ── Member → Supabase Row ──
function memberToRow(m: Member): DbRow {
  return {
    id:                    m.id,
    name:                  m.name,
    email:                 m.email,
    avatar:                m.avatar,
    role:                  m.role,
    location_id:           m.locationId,
    joined_at:             m.joinedAt instanceof Date ? m.joinedAt.toISOString() : m.joinedAt,
    last_seen_at:          m.lastSeenAt instanceof Date ? m.lastSeenAt.toISOString() : m.lastSeenAt,
    current_level:         m.currentLevel,
    technique_progress:    m.techniqueProgress,
    exam_requests:         m.examRequests,
    streak:                m.streak,
    certificates:          m.certificates,
    instructor_notes:      m.instructorNotes || [],
    deficit_hints:         m.deficitHints || [],
    trained_technique_log: m.trainedTechniqueLog || null,
    instructor_lesson_progress: m.instructorLessonProgress || null,
    admin_access:          m.adminAccess ?? null,
    xp:                    m.xp || 0,
    notification_prefs:    m.notificationPrefs || null,
    stop_the_bleed_certified: m.stopTheBleedCertified || false,
    visibility_preference: m.visibilityPreference || null,
    member_id:             m.memberId || null,
    first_name:            m.firstName || null,
    last_name:             m.lastName || null,
    birth_date:            m.birthDate || null,
    data_visibility:       m.dataVisibility || null,
    contact_application:   m.contactApplication || null,
    assistant_instructor_application: m.assistantInstructorApplication || null,
    instructor_modules:    m.instructorModules || [],
    profile_image:         m.profileImage || null,
    updated_at:            new Date().toISOString(),
  };
}

// ── Alle Members laden ──
export async function loadMembers(): Promise<Member[]> {
  try {
    const { data, error } = await supabase.from('members').select('*');
    if (error || !data || data.length === 0) return [];
    return data.map(row => rowToMember(row as DbRow));
  } catch {
    return [];
  }
}

// ── Einzelnen Member laden (für Self-Refresh) ──
export async function loadMemberById(id: string): Promise<Member | null> {
  try {
    const { data, error } = await supabase.from('members').select('*').eq('id', id).single();
    if (error || !data) return null;
    return rowToMember(data as DbRow);
  } catch {
    return null;
  }
}

// ── Member speichern (upsert) ──
export async function saveMember(member: Member): Promise<void> {
  try {
    const row = memberToRow(member);
    const { error } = await supabase.from('members').upsert(row, { onConflict: 'id' });
    if (error) console.error('[saveMember] Supabase upsert failed:', error.message, '| Member:', member.id);
  } catch (e) {
    console.error('[saveMember] Exception:', e, '| Member:', member.id);
  }
}

// ── Neues Mitglied anlegen: Auth + DB ──
export async function createMemberInSupabase(
  email: string,
  password: string,
  member: Member
): Promise<{ ok: boolean; error?: string }> {
  try {
    // Admin-Session sichern, da signUp die aktuelle Session überschreibt
    const { data: { session: adminSession } } = await supabase.auth.getSession();

    const { error: authError } = await supabase.auth.signUp({ email, password });
    if (authError && !authError.message.includes('already registered')) {
      // Session wiederherstellen auch im Fehlerfall
      if (adminSession) await supabase.auth.setSession({ access_token: adminSession.access_token, refresh_token: adminSession.refresh_token });
      return { ok: false, error: authError.message };
    }

    // Admin-Session sofort wiederherstellen
    if (adminSession) {
      await supabase.auth.setSession({ access_token: adminSession.access_token, refresh_token: adminSession.refresh_token });
    }

    const row = memberToRow(member);
    const { error: dbError } = await supabase.from('members').upsert(row, { onConflict: 'id' });
    if (dbError) return { ok: false, error: dbError.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
