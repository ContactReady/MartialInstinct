// ============================================
// MARTIAL INSTINCT - MAIN APP
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
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
const Login: React.FC<{ onLogin: (email: string, password: string) => boolean; darkMode: boolean; onShowJoinForm: () => void }> = ({ onLogin, darkMode, onShowJoinForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(email, password);
    if (!success) setError('Ungültige Anmeldedaten');
  };

  const demoAccounts = [
    { email: 'jay@martialinstinct.de',    password: 'MI_Admin1!', name: '👑 Jay (Admin)' },
    { email: 'holger@martialinstinct.de', password: 'Trainer1!',  name: '🥋 Holger (Instructor)' },
    { email: 'test@martialinstinct.de',   password: 'Member01!',  name: '💪 Test Member' },
  ];

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
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-colors"
          >
            Anmelden
          </button>
          <button
            type="button"
            onClick={onShowJoinForm}
            className="w-full text-gray-500 hover:text-gray-300 text-sm transition-colors py-1"
          >
            Noch kein Account? Zugang anfragen →
          </button>
        </form>

        <div className="mt-6">
          <p className="text-gray-500 text-sm text-center mb-4">Demo-Accounts:</p>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => { setEmail(account.email); setPassword(account.password); }}
                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-4 rounded-lg text-sm text-left transition-colors"
              >
                {account.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Settings Modal ─────────────────────────────────────────────────────────────
const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentUser, updateProfile, toggleDarkMode, darkMode, updateNotificationPrefs, updateCustomBadge } = useApp();
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [badgeInput, setBadgeInput] = useState(currentUser?.customBadge ?? '');
  const [badgeSaved, setBadgeSaved] = useState(false);

  const handleSave = () => {
    setError('');
    if (!email.trim()) { setError('E-Mail darf nicht leer sein.'); return; }

    const changingPassword = newPw.length > 0;
    if (changingPassword) {
      if (currentPw !== (currentUser?.password ?? '')) {
        setError('Aktuelles Passwort ist falsch.');
        return;
      }
      if (newPw.length < 8) { setError('Neues Passwort muss mindestens 8 Zeichen haben.'); return; }
      if (!/\d/.test(newPw)) { setError('Neues Passwort muss mindestens eine Zahl enthalten.'); return; }
      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(newPw)) {
        setError('Neues Passwort muss mindestens ein Sonderzeichen enthalten.');
        return;
      }
      if (newPw !== confirmPw) { setError('Neue Passwörter stimmen nicht überein.'); return; }
    }

    updateProfile(email.trim(), changingPassword ? newPw : (currentUser?.password ?? ''));
    setSaved(true);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-400 placeholder-gray-500';

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-sm p-6 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">⚙️ Einstellungen</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
        </div>

        {/* Theme Toggle */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Darstellung</div>
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">{darkMode ? '🌙 Dunkel' : '☀️ Hell'}</span>
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-red-600' : 'bg-gray-400'}`}
            >
              <span className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow transition-transform ${darkMode ? 'bg-white translate-x-6' : 'bg-gray-900 translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Zugangsdaten */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 space-y-3">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Zugangsdaten</div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">E-Mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
          </div>

          <div className="border-t border-gray-700/60 pt-3">
            <div className="text-xs text-gray-500 mb-3 flex items-center justify-between">
              <span>Passwort ändern</span>
              <button type="button" onClick={() => setShowPw(v => !v)} className="text-gray-500 hover:text-gray-300 text-xs">
                {showPw ? '🙈 verbergen' : '👁️ anzeigen'}
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Aktuelles Passwort</label>
                <input type={showPw ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Aktuelles Passwort eingeben…" className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Neues Passwort</label>
                <input type={showPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 Zeichen, Zahl, Sonderzeichen…" className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Neues Passwort bestätigen</label>
                <input type={showPw ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Wiederholen…" className={inputCls} />
              </div>
            </div>
            <p className="text-gray-600 text-xs mt-2">Leer lassen = Passwort bleibt unverändert</p>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            onClick={handleSave}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${saved ? 'bg-green-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
          >
            {saved ? '✅ Gespeichert!' : 'Speichern'}
          </button>
        </div>

        {/* Persönliches Badge */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 space-y-3">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Persönliches Badge</div>
          <p className="text-xs text-gray-500">Wird in der Rangliste neben deinem Namen angezeigt. Emoji + kurzer Text (max. 20 Zeichen).</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={badgeInput}
              onChange={e => { if (e.target.value.length <= 20) setBadgeInput(e.target.value); }}
              placeholder="z.B. 🏆 MVP oder 🥋 Veteran"
              className={inputCls + ' flex-1'}
              maxLength={20}
            />
            <button
              onClick={() => { updateCustomBadge(badgeInput); setBadgeSaved(true); setTimeout(() => setBadgeSaved(false), 2000); }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${badgeSaved ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
            >
              {badgeSaved ? '✓' : 'Speichern'}
            </button>
          </div>
          {badgeInput && <div className="text-xs text-gray-400">Vorschau: <span className="bg-gray-700 border border-gray-600 rounded px-1.5 py-0.5 text-white text-[10px]">{badgeInput}</span></div>}
        </div>

        {/* Benachrichtigungen */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 space-y-3">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Benachrichtigungen</div>

          {([
            { key: 'sound', label: '🔔 Sound', desc: 'Ton bei neuer Benachrichtigung' },
            { key: 'email', label: '📧 E-Mail', desc: 'Kommt bald — benötigt Backend' },
          ] as { key: 'sound' | 'email'; label: string; desc: string }[]).map(({ key, label, desc }) => {
            const enabled = currentUser?.notificationPrefs?.[key] ?? (key === 'sound' ? true : false);
            return (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm">{label}</div>
                  <div className="text-gray-500 text-xs">{desc}</div>
                </div>
                <button
                  onClick={() => updateNotificationPrefs({
                    sound: key === 'sound' ? !enabled : (currentUser?.notificationPrefs?.sound ?? true),
                    email: key === 'email' ? !enabled : (currentUser?.notificationPrefs?.email ?? false),
                  })}
                  disabled={key === 'email'}
                  className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-red-600' : 'bg-gray-600'} ${key === 'email' ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <span className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow transition-transform bg-white ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Notifications Dropdown ─────────────────────────────────────────────────────
const NotificationsDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentUser, notifications, markNotificationRead, clearNotifications } = useApp();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  if (!currentUser) return null;

  const userNotifs = notifications
    .filter(n => n.oduserId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = userNotifs.filter(n => !n.read).length;

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
        {userNotifs.length === 0 ? (
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
  onSettings: () => void;
  onClose: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ viewMode, setViewMode, onSettings, onClose }) => {
  const { currentUser, members, switchUser, logout } = useApp();
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
    <div ref={ref} className="absolute top-full right-0 mt-2 w-72 max-w-[calc(100vw-1rem)] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">

      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white border border-gray-700 overflow-hidden flex-shrink-0">
          <img
            src={currentUser.profileImageUrl || '/logos/mi-icon.jpg'}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
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
              onClick={() => { setViewMode('member'); onClose(); }}
              className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${viewMode === 'member' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              👤 Member
            </button>
            <button
              onClick={() => { setViewMode('instructor'); onClose(); }}
              className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${viewMode === 'instructor' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              🥋 Instructor
            </button>
          </div>
        </div>
      )}

      {/* Profil-Switcher — nur Admin/Owner */}
      {canSwitchProfiles && (
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Profil wechseln</div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {members.map(m => (
              <button
                key={m.id}
                onClick={() => { switchUser(m.id); onClose(); }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                  m.id === currentUser.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-base flex-shrink-0">{m.avatar}</span>
                <span className="truncate flex-1">{m.name}</span>
                <span className={`flex-shrink-0 text-[10px] font-medium ${ROLE_DISPLAY[m.role].color}`}>
                  {ROLE_DISPLAY[m.role].label}
                </span>
                {m.id === currentUser.id && <span className="text-green-400 text-[10px]">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-2 py-2 space-y-0.5">
        <button
          onClick={() => { onSettings(); onClose(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left"
        >
          <span>⚙️</span>
          <span>Einstellungen</span>
        </button>
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

const AppContent: React.FC = () => {
  const { currentUser, login, darkMode, notifications } = useApp();
  const [viewMode, setViewMode] = useState<'member' | 'instructor'>('member');
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(() =>
    new URLSearchParams(window.location.search).get('join') === 'true'
  );
  const prevUnreadRef = useRef(0);

  const isInstructor = currentUser?.role !== 'member';
  const actualViewMode = isInstructor ? viewMode : 'member';

  const unreadCount = currentUser
    ? notifications.filter(n => n.oduserId === currentUser.id && !n.read).length
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
            className="h-8 w-auto object-contain flex-shrink-0"
          />

          {/* Center: Streak + XP-Balken — nur Member-View */}
          {actualViewMode === 'member' && (() => {
            const xp = currentUser.xp ?? 0;
            const milestones = [0, 100, 300, 600, 1000, 1500, 2500, 4000];
            const nextMilestone = milestones.find(m => m > xp) ?? milestones[milestones.length - 1];
            const prevMilestone = [...milestones].reverse().find(m => m <= xp) ?? 0;
            const xpPct = nextMilestone > prevMilestone
              ? Math.round(((xp - prevMilestone) / (nextMilestone - prevMilestone)) * 100)
              : 100;
            return (
              <div className="flex items-center gap-3 flex-1 justify-center">
                <span className="flex items-center gap-1 text-orange-400 font-bold text-xs sm:text-sm">
                  🔥 <span>{currentUser.streak.currentStreak}W</span>
                </span>
                <span className="w-px h-3 bg-gray-700 flex-shrink-0" />
                {/* XP als Fortschrittsbalken */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-yellow-400 text-xs">⚡</span>
                  <div className="w-20 sm:w-28 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${xpPct}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs hidden sm:inline">{xp}</span>
                </div>
                <span className="w-px h-3 bg-gray-700 flex-shrink-0 hidden sm:block" />
                <span className={`text-xs font-semibold hidden sm:block ${LEVEL_DISPLAY[currentUser.currentLevel].color}`}>
                  {LEVEL_DISPLAY[currentUser.currentLevel].icon} {LEVEL_DISPLAY[currentUser.currentLevel].name}
                </span>
              </div>
            );
          })()}

          {/* Instructor-View: kein Center-Content, flex-1 als Spacer */}
          {actualViewMode === 'instructor' && <div className="flex-1" />}

          {/* Right: Bell + Avatar */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(v => !v); setShowUserDropdown(false); }}
                className="relative p-1.5 text-gray-400 hover:text-white transition-colors"
                title="Benachrichtigungen"
              >
                <span className="text-lg leading-none">🔔</span>
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
                onClick={() => { setShowUserDropdown(v => !v); setShowNotifications(false); }}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-2 py-1.5 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm overflow-hidden flex-shrink-0">
                  <img
                    src={currentUser.profileImageUrl || '/logos/mi-icon.jpg'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white text-xs font-medium hidden sm:block max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
                <span className="text-gray-400 text-xs">▾</span>
              </button>
              {showUserDropdown && (
                <UserDropdown
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  onSettings={() => setShowSettings(true)}
                  onClose={() => setShowUserDropdown(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-10">
        {actualViewMode === 'member' ? <MemberView /> : <InstructorView />}
      </div>

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </>)}
    </div>
  );
};

// ── App Wrapper ────────────────────────────────────────────────────────────────
const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
