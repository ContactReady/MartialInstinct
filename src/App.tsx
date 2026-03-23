// ============================================
// MARTIAL INSTINCT - MAIN APP
// ============================================

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MemberView } from './components/member/MemberView';
import { InstructorView } from './components/instructor/InstructorView';
import { ROLE_DISPLAY } from './types';

// ── Login ─────────────────────────────────────────────────────────────────────
const Login: React.FC<{ onLogin: (email: string, password: string) => boolean }> = ({ onLogin }) => {
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
          <div className="text-6xl mb-4">🥋</div>
          <h1 className="text-2xl font-bold text-white">MARTIAL INSTINCT</h1>
          <p className="text-gray-400 mt-2">Training Management System</p>
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
        </form>

        <div className="mt-8">
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
  const { currentUser, updateProfile, toggleDarkMode, darkMode } = useApp();
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

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

          {/* E-Mail */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">E-Mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
          </div>

          <div className="border-t border-gray-700/60 pt-3">
            <div className="text-xs text-gray-500 mb-3 flex items-center justify-between">
              <span>Passwort ändern</span>
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="text-gray-500 hover:text-gray-300 text-xs"
              >
                {showPw ? '🙈 verbergen' : '👁️ anzeigen'}
              </button>
            </div>

            {/* Aktuelles Passwort */}
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Aktuelles Passwort</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  placeholder="Aktuelles Passwort eingeben…"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Neues Passwort</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="Min. 8 Zeichen, Zahl, Sonderzeichen…"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Neues Passwort bestätigen</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Wiederholen…"
                  className={inputCls}
                />
              </div>
            </div>
            <p className="text-gray-600 text-xs mt-2">Leer lassen = Passwort bleibt unverändert</p>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            onClick={handleSave}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
              saved ? 'bg-green-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white'
            }`}
          >
            {saved ? '✅ Gespeichert!' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main App Content ───────────────────────────────────────────────────────────
const AppContent: React.FC = () => {
  const { currentUser, login, logout, switchUser, members, darkMode } = useApp();
  const [viewMode, setViewMode] = useState<'member' | 'instructor'>('member');
  const [showSettings, setShowSettings] = useState(false);

  if (!currentUser) {
    return <Login onLogin={login} />;
  }

  const isInstructor = currentUser.role !== 'member';
  const actualViewMode = isInstructor ? viewMode : 'member';

  return (
    <div className="min-h-screen bg-gray-950 text-white" data-theme={darkMode ? 'dark' : 'light'}>
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-red-500 font-bold">🥋 MI</span>

            {/* View Mode Switcher (only for instructors) */}
            {isInstructor && (
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('member')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'member' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Member View
                </button>
                <button
                  onClick={() => setViewMode('instructor')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'instructor' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Instructor View
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* User Switcher (for demo) */}
            <select
              value={currentUser.id}
              onChange={(e) => switchUser(e.target.value)}
              className="bg-gray-800 text-white text-sm rounded-lg px-3 py-1 border border-gray-700"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.avatar} {m.name} ({ROLE_DISPLAY[m.role].label})
                </option>
              ))}
            </select>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="text-lg leading-none text-gray-400 hover:text-white transition-colors"
              title="Einstellungen"
            >
              ⚙️
            </button>

            <button
              onClick={logout}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-10">
        {actualViewMode === 'member' ? <MemberView /> : <InstructorView />}
      </div>

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
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
