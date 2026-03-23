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
    { email: 'max@email.de', password: 'member123', name: 'Mad Max (Member)' },
    { email: 'salma@email.de', password: 'member123', name: 'Salma (Member)' },
    { email: 'hannah@martialinstinct.de', password: 'assist123', name: 'Hannah (Assistant Instructor)' },
    { email: 'holger@martialinstinct.de', password: 'inst123', name: 'Holger (Instructor)' },
    { email: 'jay.head@martialinstinct.de', password: 'head123', name: 'Jay I (Head Instructor)' },
    { email: 'jay1@martialinstinct.de', password: 'owner123', name: 'Jay I (Admin)' },
    { email: 'jay2@martialinstinct.de', password: 'owner123', name: 'Jay II (Owner & Admin)' },
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');
    if (!email.trim()) { setError('E-Mail darf nicht leer sein.'); return; }
    if (password && password.length < 6) { setError('Passwort muss mindestens 6 Zeichen haben.'); return; }
    if (password && password !== confirmPassword) { setError('Passwörter stimmen nicht überein.'); return; }
    updateProfile(email.trim(), password || (currentUser?.password ?? ''));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-sm p-6 space-y-5"
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
              className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-red-600' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 space-y-3">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Zugangsdaten</div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Neues Passwort <span className="text-gray-600">(leer lassen = unverändert)</span></label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Neues Passwort…"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:border-gray-400 placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-base leading-none"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {password && (
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Passwort bestätigen</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Wiederholen…"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-400 placeholder-gray-500"
              />
            </div>
          )}

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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Fixed Top Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 border-b px-4 py-2 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-red-500 font-bold">🥋 MI</span>

            {/* View Mode Switcher (only for instructors) */}
            {isInstructor && (
              <div className={`flex rounded-lg p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setViewMode('member')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'member' ? 'bg-red-600 text-white' : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Member View
                </button>
                <button
                  onClick={() => setViewMode('instructor')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'instructor' ? 'bg-red-600 text-white' : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
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
              className={`text-sm rounded-lg px-3 py-1 border ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
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
              className={`text-lg leading-none transition-colors ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              title="Einstellungen"
            >
              ⚙️
            </button>

            <button
              onClick={logout}
              className={`text-sm transition-colors ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
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
