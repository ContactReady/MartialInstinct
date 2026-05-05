// ============================================
// MARTIAL INSTINCT - MAIN APP
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { supabase } from './lib/supabase';
import { MemberView } from './components/member/MemberView';
import { InstructorView } from './components/instructor/InstructorView';
import { ROLE_DISPLAY, LEVEL_DISPLAY, hasAdminAccess } from './types';

// ── Join Request Form (öffentlich, kein Login nötig) ───────────────────────────
const JoinRequestForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { submitJoinRequest, darkMode } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [memberIdHint, setMemberIdHint] = useState('');
  const [course, setCourse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Bitte gib deinen Namen ein.'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Bitte gib eine gültige E-Mail ein.'); return; }
    if (!memberIdHint.trim()) { setError('Bitte gib deine Mitglieds-ID / Vertrags-ID ein.'); return; }
    if (!course.trim()) { setError('Bitte gib deinen Kurs an.'); return; }
    submitJoinRequest(name, email, memberIdHint, course);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-800">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={darkMode ? '/logos/mi-logo-landscape-dark.svg' : '/logos/mi-logo-landscape-light.svg'} alt="Martial Instinct" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-white font-black text-xl tracking-wide">Mitglied werden</h1>
          <p className="text-gray-500 text-sm mt-1">Deine Anfrage geht direkt an uns</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="text-5xl">✅</div>
            <div className="text-white font-bold text-lg">Anfrage gesendet!</div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Wir haben deine Anfrage erhalten und melden uns bei dir.<br />
              Du bekommst deine Zugangsdaten per E-Mail.
            </p>
            <button onClick={onBack} className="mt-4 text-gray-500 hover:text-white text-sm transition-colors underline">
              Zur Anmeldung
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name *"
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-red-500 focus:outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="E-Mail-Adresse *"
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-red-500 focus:outline-none"
            />
            <input
              type="text"
              value={memberIdHint}
              onChange={e => setMemberIdHint(e.target.value)}
              placeholder="Mitglieds-ID / Vertrags-ID *"
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-red-500 focus:outline-none"
            />
            <input
              type="text"
              value={course}
              onChange={e => setCourse(e.target.value)}
              placeholder="Kurs (z.B. JKD Streetdefence) *"
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-red-500 focus:outline-none"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-colors">
              Anfrage senden
            </button>
            <button type="button" onClick={onBack} className="w-full text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Ich habe bereits einen Account → Anmelden
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ── Login ─────────────────────────────────────────────────────────────────────
const Login: React.FC<{ onLogin: (email: string, password: string) => Promise<{ ok: boolean; debug?: string }>; darkMode: boolean; onShowJoinForm: () => void }> = ({ onLogin, darkMode, onShowJoinForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await onLogin(email, password);
      if (!result.ok) { setError(result.debug ?? 'E-Mail oder Passwort falsch'); setLoading(false); }
    } catch (e) {
      setError(`Verbindungsfehler: ${String(e)}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-800">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={darkMode ? '/logos/mi-logo-landscape-dark.svg' : '/logos/mi-logo-landscape-light.svg'} alt="Martial Instinct" className="h-16 w-auto object-contain" />
          </div>
          <p className="text-gray-500 text-xs tracking-widest uppercase">Training Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-Mail"
            className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-red-500 focus:outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              className="w-full bg-gray-800 text-white rounded-lg p-3 pr-12 border border-gray-700 focus:border-red-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-lg leading-none"
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-3 rounded-lg font-bold transition-colors"
          >
            {loading ? 'Anmelden…' : 'Anmelden'}
          </button>
          <button
            type="button"
            onClick={onShowJoinForm}
            className="w-full text-gray-500 hover:text-gray-300 text-sm transition-colors py-1"
          >
            Noch kein Account? Zugang anfragen →
          </button>
        </form>

      </div>
    </div>
  );
};

// ── Settings Modal ─────────────────────────────────────────────────────────────
export const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentUser, updateProfile, toggleDarkMode, darkMode, updateNotificationPrefs, updateVisibilityPreference } = useApp();
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [kontoOpen, setKontoOpen] = useState(false);
  const [sichtbarkeitOpen, setSichtbarkeitOpen] = useState(false);
  const [darstellungOpen, setDarstellungOpen] = useState(false);
  const [badgesOpen, setBadgesOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const visibility = currentUser?.visibilityPreference ?? 'all';

  const handleSave = async () => {
    setError('');
    if (!email.trim()) { setError('E-Mail darf nicht leer sein.'); return; }
    const changingPassword = newPw.length > 0;
    if (changingPassword) {
      if (newPw.length < 8) { setError('Neues Passwort muss mindestens 8 Zeichen haben.'); return; }
      if (newPw !== confirmPw) { setError('Passwörter stimmen nicht überein.'); return; }
      const { error: pwError } = await supabase.auth.updateUser({ password: newPw });
      if (pwError) { setError(pwError.message); return; }
    }
    updateProfile(email.trim(), currentUser?.password ?? '');
    setSaved(true);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-400 placeholder-gray-500';
  const rowCls = 'flex items-center justify-between py-3 border-b border-gray-800 last:border-0';

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-sm max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-800">
          <h2 className="text-white font-bold text-base">Einstellungen</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="px-5 py-4 space-y-3">

          {/* ── Sichtbarkeit ── */}
          <div>
            <button
              onClick={() => setSichtbarkeitOpen(v => !v)}
              className="w-full flex items-center justify-between py-2 px-3 bg-gray-800/60 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">👁️</span>
                <span className="text-sm font-semibold text-white">Sichtbarkeit</span>
              </div>
              <span className="text-gray-500 text-xs">{sichtbarkeitOpen ? '▲' : '▼'}</span>
            </button>
            {sichtbarkeitOpen && (
              <div className="pt-3 px-1 space-y-2">
                <div className="text-xs text-gray-500 mb-2">Wer sieht deinen Online- und Trainingsstatus?</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateVisibilityPreference('all')}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all border ${visibility === 'all' ? 'bg-gray-700 text-white border-gray-600' : 'bg-transparent text-gray-500 border-gray-700 hover:text-gray-300'}`}
                  >
                    Alle Member
                  </button>
                  <button
                    onClick={() => updateVisibilityPreference('buddies')}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all border ${visibility === 'buddies' ? 'bg-gray-700 text-white border-gray-600' : 'bg-transparent text-gray-500 border-gray-700 hover:text-gray-300'}`}
                  >
                    Trainingspartner
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Darstellung & Benachrichtigungen ── */}
          <div>
            <button
              onClick={() => setDarstellungOpen(v => !v)}
              className="w-full flex items-center justify-between py-2 px-3 bg-gray-800/60 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🔔</span>
                <span className="text-sm font-semibold text-white">Darstellung & Benachrichtigungen</span>
              </div>
              <span className="text-gray-500 text-xs">{darstellungOpen ? '▲' : '▼'}</span>
            </button>
            {darstellungOpen && (
              <div className="pt-2 divide-y divide-gray-800">
                <div className={rowCls}>
                  <span className="text-sm text-white">{darkMode ? '🌙 Dunkel' : '☀️ Hell'}</span>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${darkMode ? 'bg-red-600' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow bg-white transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                {([
                  { key: 'sound', label: '🔔 Sound', desc: 'Ton bei Benachrichtigungen' },
                  { key: 'email', label: '📧 E-Mail', desc: 'Kommt bald' },
                ] as { key: 'sound' | 'email'; label: string; desc: string }[]).map(({ key, label, desc }) => {
                  const enabled = currentUser?.notificationPrefs?.[key] ?? (key === 'sound');
                  return (
                    <div key={key} className={rowCls}>
                      <div>
                        <div className="text-sm text-white">{label}</div>
                        <div className="text-xs text-gray-500">{desc}</div>
                      </div>
                      <button
                        onClick={() => updateNotificationPrefs({
                          sound: key === 'sound' ? !enabled : (currentUser?.notificationPrefs?.sound ?? true),
                          email: key === 'email' ? !enabled : (currentUser?.notificationPrefs?.email ?? false),
                        })}
                        disabled={key === 'email'}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-red-600' : 'bg-gray-600'} ${key === 'email' ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <span className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Badges ── */}
          <div>
            <button
              onClick={() => setBadgesOpen(v => !v)}
              className="w-full flex items-center justify-between py-2 px-3 bg-gray-800/60 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🏅</span>
                <span className="text-sm font-semibold text-white">Anzeige-Badge</span>
              </div>
              <span className="text-gray-500 text-xs">{badgesOpen ? '▲' : '▼'}</span>
            </button>
            {badgesOpen && (
              <div className="pt-3 px-1">
                <p className="text-sm text-gray-500">Noch keine Abzeichen verdient. Absolviere Prüfungen um Badges freizuschalten.</p>
              </div>
            )}
          </div>

          {/* ── Zugangsdaten ── */}
          <div>
            <button
              onClick={() => setKontoOpen(v => !v)}
              className="w-full flex items-center justify-between py-2 px-3 bg-gray-800/60 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🔐</span>
                <span className="text-sm font-semibold text-white">Zugangsdaten</span>
              </div>
              <span className="text-gray-500 text-xs">{kontoOpen ? '▲' : '▼'}</span>
            </button>

            {kontoOpen && (
              <div className="space-y-3 pt-3 px-1">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">E-Mail</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Passwort ändern</span>
                    <button type="button" onClick={() => setShowPw(v => !v)} className="text-gray-500 hover:text-gray-300 text-xs">
                      {showPw ? '🙈 verbergen' : '👁️ anzeigen'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input type={showPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Neues Passwort (min. 8 Zeichen)…" className={inputCls} />
                    <input type={showPw ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Neues Passwort wiederholen…" className={inputCls} />
                  </div>
                  <p className="text-gray-600 text-xs mt-1">Passwortfelder leer lassen = unverändert</p>
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button
                  onClick={handleSave}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${saved ? 'bg-green-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
                >
                  {saved ? '✅ Gespeichert!' : 'Speichern'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// ── Notifications Dropdown ─────────────────────────────────────────────────────
const NotificationsDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentUser, notifications, markNotificationRead, clearNotifications, acceptBuddyRequest, rejectBuddyRequest, getPendingCheckIns, getPendingExamRequests, joinRequests } = useApp();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  if (!currentUser) return null;

  const isOwnerRoleD = ['head_instructor', 'admin'].includes(currentUser.role ?? '');
  const isInstructorRoleD = ['instructor', 'assistant_instructor', 'full_instructor', 'head_instructor', 'admin'].includes(currentUser.role ?? '');

  const pendingCIs = isInstructorRoleD ? getPendingCheckIns() : [];
  const pendingExams = isInstructorRoleD ? getPendingExamRequests() : [];
  const pendingJoins = isOwnerRoleD ? joinRequests.filter(r => r.status === 'pending') : [];

  const userNotifs = notifications
    .filter(n =>
      n.oduserId === currentUser.id ||
      (n.oduserId === 'all-instructors' && isInstructorRoleD) ||
      (n.oduserId === 'all-owners' && isOwnerRoleD)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = userNotifs.filter(n => !n.read).length
    + (currentUser?.buddyRequests?.length ?? 0)
    + pendingCIs.length + pendingExams.length + pendingJoins.length;

  const formatTime = (date: Date) => {
    const d = new Date(date);
    const diffMs = Date.now() - d.getTime();
    const mins = Math.floor(diffMs / 60_000);
    if (mins < 1) return 'Gerade eben';
    if (mins < 60) return `vor ${mins} Min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `vor ${hours} Std`;
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div ref={ref} className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-1rem)] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h3 className="text-white font-bold text-sm">
          Benachrichtigungen
          {unreadCount > 0 && <span className="ml-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
        </h3>
        {userNotifs.length > 0 && (
          <button onClick={() => { clearNotifications(); onClose(); }} className="text-gray-400 hover:text-white text-xs transition-colors">
            Alle gelesen
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {/* Ausstehende Trainingspartner-Anfragen */}
        {(currentUser?.buddyRequests ?? []).map(req => (
          <div key={req.id} className="px-4 py-3 border-b border-gray-800/60 bg-gray-800/30">
            <div className="text-white text-sm font-semibold leading-tight">{req.fromMemberName}</div>
            <div className="text-gray-400 text-xs mt-0.5">möchte sich als Trainingspartner verbinden</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => acceptBuddyRequest(req.id)} className="flex-1 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold transition-colors">Annehmen</button>
              <button onClick={() => rejectBuddyRequest(req.id)} className="flex-1 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs font-semibold transition-colors">Ablehnen</button>
            </div>
          </div>
        ))}
        {/* Offene Check-in Anfragen (für Instructoren) */}
        {pendingCIs.map(ci => (
          <div key={ci.id} className="px-4 py-3 border-b border-gray-800/60 bg-gray-800/30">
            <div className="text-white text-sm font-semibold leading-tight">{ci.memberName}</div>
            <div className="text-gray-400 text-xs mt-0.5">
              Check-in Anfrage{ci.unitName ? ` · ${ci.unitName}` : ''}
            </div>
            <div className="text-gray-600 text-xs mt-1">
              {new Date(ci.requestedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
            </div>
          </div>
        ))}
        {/* Offene Prüfungsanfragen (für Instructoren) */}
        {pendingExams.map(ex => (
          <div key={ex.id} className="px-4 py-3 border-b border-gray-800/60 bg-gray-800/30">
            <div className="text-white text-sm font-semibold leading-tight">{ex.memberName}</div>
            <div className="text-gray-400 text-xs mt-0.5">
              Prüfungsanfrage · {ex.techniqueName}
            </div>
            <div className="text-gray-600 text-xs mt-1">{ex.moduleName}</div>
          </div>
        ))}
        {/* Offene Beitrittsanfragen (für Owner/Admins) */}
        {pendingJoins.map(jr => (
          <div key={jr.id} className="px-4 py-3 border-b border-gray-800/60 bg-gray-800/30">
            <div className="text-white text-sm font-semibold leading-tight">{jr.name || jr.email}</div>
            <div className="text-gray-400 text-xs mt-0.5">Beitrittsanfrage</div>
            <div className="text-gray-600 text-xs mt-1">{jr.email}</div>
          </div>
        ))}
        {userNotifs.length === 0 && (currentUser?.buddyRequests ?? []).length === 0
          && pendingCIs.length === 0 && pendingExams.length === 0 && pendingJoins.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="text-3xl mb-2">🔔</div>
            <p className="text-gray-500 text-sm">Keine Benachrichtigungen</p>
          </div>
        ) : userNotifs.map(notif => (
          <div key={notif.id} className={`px-4 py-3 border-b border-gray-800/60 last:border-0 transition-colors ${notif.read ? 'opacity-60' : 'bg-gray-800/30'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-white text-sm font-semibold leading-tight">{notif.title}</div>
                <div className="text-gray-400 text-xs mt-0.5 leading-snug">{notif.message}</div>
                <div className="text-gray-600 text-xs mt-1">{formatTime(notif.createdAt)}</div>
              </div>
              {!notif.read && (
                <button onClick={() => markNotificationRead(notif.id)} className="text-gray-500 hover:text-green-400 text-xs transition-colors flex-shrink-0 mt-0.5" title="Als gelesen markieren">✓</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── User Dropdown ──────────────────────────────────────────────────────────────
interface UserDropdownProps {
  viewMode: 'member' | 'instructor';
  setViewMode: (v: 'member' | 'instructor') => void;
  onClose: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ viewMode, setViewMode, onClose }) => {
  const { currentUser, members, switchUser, logout, toggleDarkMode, darkMode, updateNotificationPrefs, updateVisibilityPreference, updateProfile, updateAnzeigename, updateDataVisibility, updateMemberCoreData, computeBadges, getBadgeDisplaySettings, getProfileImgSettings } = useApp();
  const [badgesOpen, setBadgesOpen] = useState(false);
  const [designOpen, setDesignOpen] = useState(false);
  const [persoenlichOpen, setPersoenlichOpen] = useState(false);
const [sichtbarkeitOpen, setSichtbarkeitOpen] = useState(false);
  const [kontoOpen, setKontoOpen] = useState(false);
  const [anzeigenameDraft, setAnzeigenameDraft] = useState('');
  const [firstNameDraft, setFirstNameDraft] = useState('');
  const [lastNameDraft, setLastNameDraft] = useState('');
  const [birthDateDraft, setBirthDateDraft] = useState('');
  const [memberIdDraft, setMemberIdDraft] = useState('');
  const [persoenlichError, setPersoenlichError] = useState('');
  const [persoenlichSaved, setPersoenlichSaved] = useState(false);
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  const visibility = currentUser?.visibilityPreference ?? 'all';

  const handleSave = async () => {
    setPwError('');
    if (!email.trim()) { setPwError('E-Mail darf nicht leer sein.'); return; }
    const changingPassword = newPw.length > 0;
    if (changingPassword) {
      if (newPw.length < 8) { setPwError('Neues Passwort muss mindestens 8 Zeichen haben.'); return; }
      if (newPw !== confirmPw) { setPwError('Passwörter stimmen nicht überein.'); return; }
      const { error: pwErr } = await supabase.auth.updateUser({ password: newPw });
      if (pwErr) { setPwError(pwErr.message); return; }
    }
    updateProfile(email.trim(), currentUser?.password ?? '');
    setSaved(true);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-400 placeholder-gray-500';
  const rowCls = 'flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0';
  const accordionBtn = (open: boolean, icon: string, label: string, toggle: () => void) => (
    <button
      onClick={toggle}
      className="w-full flex items-center justify-between py-2 px-3 bg-gray-800/60 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>
      <span className="text-gray-500 text-xs">{open ? '▲' : '▼'}</span>
    </button>
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  if (!currentUser) return null;

  const isInstructor = currentUser.role !== 'member';
  const canSwitchProfiles = hasAdminAccess(currentUser);
  const roleInfo = ROLE_DISPLAY[currentUser.role];

  return (
    <div ref={ref} className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-0.5rem)] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-y-auto overflow-x-hidden max-h-[85vh]">

      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-3">
        {(() => { const ps = getProfileImgSettings(currentUser.id); return currentUser.profileImageUrl ? (
          <div className="w-10 h-10 rounded-full border border-gray-700 flex-shrink-0" style={{
            backgroundImage: `url(${currentUser.profileImageUrl})`,
            backgroundSize: `${ps.scale}%`,
            backgroundPosition: `${ps.posX / 3}% ${ps.posY / 3}%`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#fff',
          }} />
        ) : (
          <div className="w-10 h-10 rounded-full border border-gray-700 flex-shrink-0 overflow-hidden">
            <img src="/logos/mi-icon.jpg" alt="" className="w-full h-full object-cover" />
          </div>
        );})()}
        <div className="min-w-0">
          <div className="text-white font-semibold text-sm truncate">{currentUser.name}</div>
          <span className={`text-xs font-medium ${roleInfo.color}`}>{roleInfo.label}</span>
        </div>
      </div>

      {/* View Switcher — nur für Instructors */}
      {isInstructor && (
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Ansicht</div>
          <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
            <button
              onClick={() => setViewMode('member')}
              className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${viewMode === 'member' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              👤 Member
            </button>
            <button
              onClick={() => setViewMode('instructor')}
              className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${viewMode === 'instructor' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              🥋 Instructor
            </button>
          </div>
        </div>
      )}

      {/* Einstellungen */}
      <div className="px-3 py-3 border-t border-gray-800 space-y-2">
        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest px-1 mb-1">Einstellungen</div>

        {/* Badge-Galerie */}
        {accordionBtn(badgesOpen, '🏅', 'Badge-Galerie', () => setBadgesOpen(v => !v))}
        {badgesOpen && (() => {
          const earnedBadges = currentUser ? computeBadges(currentUser) : [];
          return (
            <div className="px-1 py-2">
              {earnedBadges.length === 0 ? (
                <p className="text-xs text-gray-500">Noch keine Abzeichen verdient. Absolviere Prüfungen um Badges freizuschalten.</p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {earnedBadges.filter(b => b.imageUrl).map(badge => {
                    const { scale, posX, posY } = getBadgeDisplaySettings(badge.id);
                    return (
                      <div key={badge.id} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full" style={{
                          backgroundImage: `url(${badge.imageUrl})`,
                          backgroundSize: `${Math.round(scale * 100)}%`,
                          backgroundPosition: `${posX}% ${posY}%`,
                          backgroundRepeat: 'no-repeat',
                        }} />
                        <span className="text-[9px] text-gray-400 text-center leading-tight whitespace-nowrap">{badge.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* Design & Sound */}
        {accordionBtn(designOpen, '🎨', 'Design & Sound', () => setDesignOpen(v => !v))}
        {designOpen && (
          <div className="px-1 divide-y divide-gray-800">
            <div className={rowCls}>
              <span className="text-sm text-white">{darkMode ? '🌙 Dunkel' : '☀️ Hell'}</span>
              <button onClick={toggleDarkMode} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${darkMode ? 'bg-red-600' : 'bg-gray-600'}`}>
                <span className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow bg-white transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            {([
              { key: 'sound', label: '🔔 Sound', desc: 'Ton bei Benachrichtigungen' },
              { key: 'email', label: '📧 E-Mail', desc: 'Kommt bald' },
            ] as { key: 'sound' | 'email'; label: string; desc: string }[]).map(({ key, label, desc }) => {
              const enabled = currentUser?.notificationPrefs?.[key] ?? (key === 'sound');
              return (
                <div key={key} className={rowCls}>
                  <div><div className="text-sm text-white">{label}</div><div className="text-xs text-gray-500">{desc}</div></div>
                  <button onClick={() => updateNotificationPrefs({ sound: key === 'sound' ? !enabled : (currentUser?.notificationPrefs?.sound ?? true), email: key === 'email' ? !enabled : (currentUser?.notificationPrefs?.email ?? false) })} disabled={key === 'email'} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-red-600' : 'bg-gray-600'} ${key === 'email' ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    <span className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Persönliche Daten */}
        {accordionBtn(persoenlichOpen, '🪪', 'Persönliche Daten', () => {
          setPersoenlichOpen(v => !v);
          setAnzeigenameDraft(currentUser?.name ?? '');
          setFirstNameDraft(currentUser?.firstName ?? '');
          setLastNameDraft(currentUser?.lastName ?? '');
          // ISO → TT.MM.YYYY für Anzeige
          const bd = currentUser?.birthDate ?? '';
          if (bd && bd.includes('-')) {
            const [y, m, d] = bd.split('-');
            setBirthDateDraft(`${d}.${m}.${y}`);
          } else { setBirthDateDraft(bd); }
          setMemberIdDraft(currentUser?.memberId ?? '');
          setPersoenlichError('');
          setPersoenlichSaved(false);
        })}
        {persoenlichOpen && (
          <div className="px-1 space-y-3 pb-2">
            {!hasAdminAccess(currentUser) && (
              <p className="text-[10px] text-gray-600">Kerndaten können nur vom Admin geändert werden.</p>
            )}

            {/* ── Daten-Felder ── */}
            <div className="space-y-2">
              {/* Anzeigename — immer editierbar */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Anzeigename</label>
                <input
                  type="text"
                  value={anzeigenameDraft}
                  onChange={e => { setAnzeigenameDraft(e.target.value); setPersoenlichError(''); setPersoenlichSaved(false); }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* Vorname */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Vorname</label>
                {hasAdminAccess(currentUser) ? (
                  <input type="text" value={firstNameDraft} onChange={e => { setFirstNameDraft(e.target.value); setPersoenlichSaved(false); }} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-400" />
                ) : (
                  <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400">{firstNameDraft || '—'}</div>
                )}
              </div>

              {/* Nachname */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Nachname</label>
                {hasAdminAccess(currentUser) ? (
                  <input type="text" value={lastNameDraft} onChange={e => { setLastNameDraft(e.target.value); setPersoenlichSaved(false); }} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-400" />
                ) : (
                  <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400">{lastNameDraft || '—'}</div>
                )}
              </div>

              {/* Geburtsdatum */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Geburtsdatum</label>
                {hasAdminAccess(currentUser) ? (
                  <input type="text" value={birthDateDraft} onChange={e => { setBirthDateDraft(e.target.value); setPersoenlichSaved(false); }} placeholder="TT.MM.YYYY" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-400 placeholder-gray-600" />
                ) : (
                  <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400">{birthDateDraft || '—'}</div>
                )}
              </div>

              {/* Member ID */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Member ID</label>
                {hasAdminAccess(currentUser) ? (
                  <input type="text" value={memberIdDraft} onChange={e => { setMemberIdDraft(e.target.value); setPersoenlichSaved(false); }} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-400" />
                ) : (
                  <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400">{memberIdDraft || '—'}</div>
                )}
              </div>
            </div>

            {/* Fehler + Speichern */}
            {persoenlichError && <p className="text-red-400 text-xs">{persoenlichError}</p>}
            <button
              onClick={() => {
                const nameResult = updateAnzeigename(anzeigenameDraft);
                if (!nameResult.ok) { setPersoenlichError(nameResult.error ?? ''); return; }
                if (hasAdminAccess(currentUser)) {
                  updateMemberCoreData(currentUser.id, {
                    firstName: firstNameDraft,
                    lastName: lastNameDraft,
                    birthDate: birthDateDraft ? (() => { const p = birthDateDraft.split('.'); return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : birthDateDraft; })() : undefined,
                    memberId: memberIdDraft || undefined,
                  });
                }
                setPersoenlichSaved(true);
                setTimeout(() => setPersoenlichSaved(false), 3000);
              }}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${persoenlichSaved ? 'bg-green-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
            >
              {persoenlichSaved ? '✅ Gespeichert!' : 'Speichern'}
            </button>

          </div>
        )}

        {/* Sichtbarkeit */}
        {accordionBtn(sichtbarkeitOpen, '👁️', 'Sichtbarkeit', () => setSichtbarkeitOpen(v => !v))}
        {sichtbarkeitOpen && (
          <div className="px-1 space-y-3 pb-1">
            {/* Online-Status */}
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Online- & Trainingsstatus</div>
              <div className="flex gap-2">
                <button onClick={() => updateVisibilityPreference('all')} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all border ${visibility === 'all' ? 'bg-gray-700 text-white border-gray-600' : 'bg-transparent text-gray-500 border-gray-700 hover:text-gray-300'}`}>Alle Member</button>
                <button onClick={() => updateVisibilityPreference('buddies')} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all border ${visibility === 'buddies' ? 'bg-gray-700 text-white border-gray-600' : 'bg-transparent text-gray-500 border-gray-700 hover:text-gray-300'}`}>Trainingspartner</button>
              </div>
            </div>
            {/* Profil-Sichtbarkeit */}
            <div className="border-t border-gray-800 pt-3">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Auf Profil sichtbar</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">Anzeigename</span>
                  <span className="text-xs text-gray-500 italic">Immer</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">Vorname</span>
                  <span className="text-xs text-gray-500 italic">Immer</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">Nachname</span>
                  <button onClick={() => updateDataVisibility({ ...currentUser?.dataVisibility, showLastName: !(currentUser?.dataVisibility?.showLastName ?? false) })} className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${(currentUser?.dataVisibility?.showLastName ?? false) ? 'bg-red-600' : 'bg-gray-600'}`}>
                    <span className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${(currentUser?.dataVisibility?.showLastName ?? false) ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">Member ID</span>
                  <button onClick={() => updateDataVisibility({ ...currentUser?.dataVisibility, showMemberId: !(currentUser?.dataVisibility?.showMemberId ?? false) })} className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${(currentUser?.dataVisibility?.showMemberId ?? false) ? 'bg-red-600' : 'bg-gray-600'}`}>
                    <span className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${(currentUser?.dataVisibility?.showMemberId ?? false) ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-white block">Geburtsdatum</span>
                  <div className="flex gap-1.5">
                    {(['hidden', 'dayMonth', 'full'] as const).map(opt => (
                      <button key={opt} onClick={() => updateDataVisibility({ ...currentUser?.dataVisibility, birthDateVisibility: opt })}
                        className={`flex-1 py-1 rounded text-[10px] font-semibold transition-all border ${(currentUser?.dataVisibility?.birthDateVisibility ?? 'hidden') === opt ? 'bg-gray-700 text-white border-gray-500' : 'text-gray-500 border-gray-700 hover:text-gray-300'}`}
                      >
                        {opt === 'hidden' ? 'Aus' : opt === 'dayMonth' ? 'TT.MM.' : 'TT.MM.YYYY'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {accordionBtn(kontoOpen, '🔐', 'Zugangsdaten', () => setKontoOpen(v => !v))}
        {kontoOpen && (
          <div className="px-1 space-y-3 pb-1">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">E-Mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Passwort ändern</span>
                <button type="button" onClick={() => setShowPw(v => !v)} className="text-gray-500 hover:text-gray-300 text-xs">{showPw ? '🙈 verbergen' : '👁️ anzeigen'}</button>
              </div>
              <div className="space-y-2">
                <input type={showPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Neues Passwort (min. 8 Zeichen)…" className={inputCls} />
                <input type={showPw ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Neues Passwort wiederholen…" className={inputCls} />
              </div>
              <p className="text-gray-600 text-xs mt-1">Passwortfelder leer lassen = unverändert</p>
            </div>
            {pwError && <p className="text-red-400 text-xs">{pwError}</p>}
            <button onClick={handleSave} className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${saved ? 'bg-green-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}>
              {saved ? '✅ Gespeichert!' : 'Speichern'}
            </button>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="px-2 py-2 border-t border-gray-800">
        <button
          onClick={() => { logout(); onClose(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition-colors text-left"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

// ── Main App Content ───────────────────────────────────────────────────────────
// Kurzes Notification-Ding via Web Audio API
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch { /* ignore if browser blocks audio */ }
}

// ── Help Modal ─────────────────────────────────────────────────────────────────
const HelpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { platformConfig } = useApp();
  const xp = platformConfig.xp;
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (key: string) => setOpen(o => o === key ? null : key);

  const Section: React.FC<{ id: string; icon: string; title: string; children: React.ReactNode }> = ({ id, icon, title, children }) => (
    <div>
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between py-2.5 px-3 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-gray-600 transition-all text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{icon}</span>
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        <span className="text-gray-500 text-xs flex-shrink-0">{open === id ? '▲' : '▼'}</span>
      </button>
      {open === id && (
        <div className="mt-1.5 px-1 space-y-1.5 text-xs text-gray-300 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );

  const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex items-center justify-between py-1 border-b border-gray-800/60 last:border-0">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-3 pb-3 sm:pb-0" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-base">📖</span>
            <h2 className="text-white font-bold text-sm">Gebrauchsanweisung</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-lg leading-none transition-colors">✕</button>
        </div>

        {/* Sections */}
        <div className="px-3 py-3 space-y-2 overflow-y-auto max-h-[70vh]">

          <Section id="checkin" icon="📍" title="Check-In">
            <p>Beantrage beim Trainer deinen Check-In für die aktuelle Trainingseinheit. Sobald der Trainer bestätigt, wirst du als anwesend markiert.</p>
            <div className="mt-1.5 bg-gray-800/50 rounded-lg px-3 py-2">
              <Row label="Bestätigter Check-In" value={`+${xp.checkIn} XP`} />
            </div>
          </Section>

          <Section id="badges" icon="🩹" title="Pflaster">
            <div className="space-y-1">
              {[
                { icon: '🩹', label: '10 Trainingseinheiten', desc: '10 bestätigte Check-Ins absolviert' },
                { icon: '🧠', label: 'Theoriemodul bestanden', desc: 'Quiz-Prüfung in einem Modul bestanden — 1 Pflaster pro Modul' },
                { icon: '◐', label: 'Praxismodul Tactical', desc: 'Alle Pflicht-Techniken eines Moduls auf Tactical — 1 Pflaster pro Modul' },
                { icon: '●', label: 'Praxismodul Combat', desc: 'Alle Pflicht-Techniken eines Moduls auf Combat — 1 Pflaster pro Modul' },
                { icon: '🩸', label: 'Stop The Bleed®', desc: 'Stop The Bleed® Kurs absolviert' },
              ].map(b => (
                <div key={b.label} className="flex items-start gap-2 py-1 border-b border-gray-800/50 last:border-0">
                  <span className="text-base leading-none mt-0.5 flex-shrink-0">{b.icon}</span>
                  <div>
                    <span className="text-white font-semibold">{b.label}</span>
                    <span className="text-gray-500 ml-1.5">{b.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="quiz" icon="🧠" title="Quiz & Prüfung">
            <div className="space-y-2">
              <div>
                <div className="text-white font-semibold mb-0.5">Practice-Modus</div>
                <p>{platformConfig.quiz.practiceQuestionsPerSession} zufällige Fragen aus dem Modul-Pool. Jederzeit wiederholbar — keine Konsequenzen.</p>
              </div>
              <div>
                <div className="text-white font-semibold mb-0.5">Prüfungsquiz</div>
                <p>{platformConfig.quiz.examQuestions} Fragen. Mindestens <span className="text-white font-bold">{Math.round(platformConfig.quiz.examPassRate * 100)}%</span> zum Bestehen.</p>
              </div>
              <div className="bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2">
                <div className="text-gray-300 font-semibold text-xs mb-0.5">⚠️ Achtung</div>
                <p className="text-gray-400">2 Fehlversuche beim Prüfungsquiz → <span className="text-white font-bold">30 Tage Sperre</span> für dieses Modul.</p>
              </div>
            </div>
          </Section>

          <Section id="streak" icon="🔥" title="Streak">
            <p>Dein Streak zählt wie viele Trainingswochen du in Folge aktiv warst. Eine Woche gilt als aktiv wenn du mindestens einmal eingecheckt hast.</p>
            <p className="mt-1">Fehlst du eine Woche, verlierst du den Streak — es sei denn du hast noch <span className="text-white font-semibold">Pflaster</span> übrig (max. 2). Ein Pflaster überbrückt eine verpasste Woche.</p>
          </Section>

          <Section id="techniken" icon="🥋" title="Techniken & Prüfungsebenen">
            <p>Jedes Modul enthält Pflicht- und optionale Techniken. Es gibt zwei Prüfungsebenen für Mitglieder:</p>
            <div className="mt-1.5 space-y-1.5">
              <div className="flex items-start gap-2.5">
                <span className="text-blue-400 font-bold text-sm flex-shrink-0 w-4">◐</span>
                <div><span className="text-white font-semibold">Tactical</span> — Taktisches Verständnis. Technik wurde technisch und taktisch verstanden und kann einem Anfänger erklärt werden.</div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-green-400 font-bold text-sm flex-shrink-0 w-4">●</span>
                <div><span className="text-white font-semibold">Combat</span> — Combat Verhaltensmuster. Technik ist verinnerlicht und wird unter Druck ohne Nachdenken abgerufen.</div>
              </div>
            </div>
            <p className="mt-2 text-gray-500">Für Trainer kommt eine dritte Ebene hinzu: <span className="text-white">Instructor</span> — alle Inhalte des Moduls können unterrichtet werden.</p>
          </Section>

          <Section id="xp" icon="⚡" title="XP – Erfahrungspunkte">
            <div className="bg-gray-800/50 rounded-lg px-3 py-2 space-y-0">
              <Row label="Check-In" value={`+${xp.checkIn} XP`} />
              <Row label="Quiz-Frage richtig" value={`+${xp.quizCorrect} XP`} />
              <Row label="Alle Fragen richtig (Bonus)" value={`+${xp.quizBonusAllCorrect} XP`} />
              <Row label="Prüfungsquiz bestanden" value={`+${xp.examPass} XP`} />
              <Row label="Tactical bestanden" value={`+${xp.techPassed} XP`} />
              <Row label="Combat bestanden" value={`+${xp.tacPassed} XP`} />
              <Row label="Stop The Bleed® Zertifikat" value={`+${xp.stopTheBleed} XP`} />
              <Row label={`Streak-Bonus (alle ${xp.streakInterval} Wochen)`} value={`+${xp.streakWeeks} XP`} />
            </div>
            <p className="text-gray-500 mt-1">XP bestimmt deinen Level-Rang in der Rangliste.</p>
          </Section>

        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, authLoading, login, darkMode, notifications, getProfileImgSettings, getPendingCheckIns, getPendingExamRequests, joinRequests } = useApp();
  const [viewMode, setViewMode] = useState<'member' | 'instructor'>('member');

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [showJoinForm, setShowJoinForm] = useState(() =>
    new URLSearchParams(window.location.search).get('join') === 'true'
  );
  const prevUnreadRef = useRef(0);

  const isInstructor = currentUser?.role !== 'member';
  const actualViewMode = isInstructor ? viewMode : 'member';

  const isOwnerRole = ['head_instructor', 'admin'].includes(currentUser?.role ?? '');
  const isInstructorRole = ['instructor', 'assistant_instructor', 'full_instructor', 'head_instructor', 'admin'].includes(currentUser?.role ?? '');
  const pendingBuddyCount = currentUser?.buddyRequests?.length ?? 0;
  const pendingCIsCount = currentUser && isInstructorRole ? getPendingCheckIns().length : 0;
  const pendingExamsCount = currentUser && isInstructorRole ? getPendingExamRequests().length : 0;
  const pendingJoinsCount = currentUser && isOwnerRole ? joinRequests.filter(r => r.status === 'pending').length : 0;
  const unreadCount = currentUser
    ? notifications.filter(n => !n.read && (
        n.oduserId === currentUser.id ||
        (n.oduserId === 'all-instructors' && isInstructorRole) ||
        (n.oduserId === 'all-owners' && isOwnerRole)
      )).length + pendingBuddyCount + pendingCIsCount + pendingExamsCount + pendingJoinsCount
    : 0;

  // Sound bei neuer Benachrichtigung (wenn aktiviert)
  useEffect(() => {
    if (!currentUser) return;
    const soundEnabled = currentUser.notificationPrefs?.sound ?? true;
    if (soundEnabled && unreadCount > prevUnreadRef.current) {
      playNotificationSound();
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount, currentUser]);

  if (authLoading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-500 text-sm">Laden…</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white" data-theme={darkMode ? 'dark' : 'light'}>
      {!currentUser && showJoinForm && <JoinRequestForm onBack={() => setShowJoinForm(false)} />}
      {!currentUser && !showJoinForm && <Login onLogin={login} darkMode={darkMode} onShowJoinForm={() => setShowJoinForm(true)} />}
      {currentUser && (<>

      {/* ── Fixed Top Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 px-3 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">

          {/* Left: Logo — transparente SVGs, kein Badge nötig */}
          <img
            src={darkMode ? '/logos/mi-logo-landscape-dark.svg' : '/logos/mi-logo-landscape-light.svg'}
            alt="Martial Instinct"
            className="h-[53px] w-auto object-contain flex-shrink-0"
          />

          <div className="flex-1" />

          {/* Right: Help + Bell + Avatar */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Help Button */}
            <button
              onClick={() => { setShowHelp(v => !v); setShowNotifications(false); setShowUserDropdown(false); }}
              className="p-1.5 text-gray-400 hover:text-white transition-colors leading-none flex items-center justify-center"
              title="Gebrauchsanweisung"
            >
              <span className="text-xl leading-none">ℹ️</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(v => !v); setShowUserDropdown(false); }}
                className="relative p-1.5 text-gray-400 hover:text-white transition-colors"
                title="Benachrichtigungen"
              >
                <span className="text-xl leading-none">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-[9px] min-w-[15px] h-[15px] flex items-center justify-center rounded-full font-bold px-0.5 leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationsDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* Avatar Button → User Dropdown */}
            <div className="relative">
              <button
                onMouseDown={e => e.stopPropagation()}
                onClick={() => { setShowUserDropdown(v => !v); setShowNotifications(false); }}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-2 py-1.5 transition-colors"
              >
                {(() => { const ps = getProfileImgSettings(currentUser.id); return currentUser.profileImageUrl ? (
                  <div className="w-6 h-6 rounded-full flex-shrink-0" style={{
                    backgroundImage: `url(${currentUser.profileImageUrl})`,
                    backgroundSize: `${ps.scale}%`,
                    backgroundPosition: `${ps.posX / 3}% ${ps.posY / 3}%`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#fff',
                  }} />
                ) : (
                  <div className="w-6 h-6 rounded-full flex-shrink-0 overflow-hidden">
                    <img src="/logos/mi-icon.jpg" alt="" className="w-full h-full object-cover" />
                  </div>
                );})()}
                <span className="text-white text-xs font-medium hidden sm:block max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
                <span className="text-gray-400 text-xs">▾</span>
              </button>
              {showUserDropdown && (
                <UserDropdown
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  onClose={() => setShowUserDropdown(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {/* Main Content */}
      <div className="pt-[69px]">
        {actualViewMode === 'member' ? <MemberView onSwitchToAdmin={currentUser?.role === 'admin' ? () => setViewMode('instructor') : undefined} /> : <InstructorView />}
      </div>

      </>)}
    </div>
  );
};

// ── Error Boundary ─────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: string | null }> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  render() {
    if (this.state.error) return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-red-800">
          <div className="text-red-400 font-bold mb-2">App-Fehler</div>
          <div className="text-gray-300 text-sm font-mono break-all">{this.state.error}</div>
          <button onClick={() => { localStorage.removeItem('mi_current_user'); window.location.reload(); }}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg text-sm">
            Cache löschen & neu laden
          </button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

// ── App Wrapper ────────────────────────────────────────────────────────────────
const App: React.FC = () => (
  <ErrorBoundary>
    <AppProvider>
      <AppContent />
    </AppProvider>
  </ErrorBoundary>
);

export default App;
