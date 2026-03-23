// ============================================
// MARTIAL INSTINCT - MAIN APP
// ============================================

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MemberView } from './components/member/MemberView';
import { InstructorView } from './components/instructor/InstructorView';
import { ROLE_DISPLAY } from './types';

// Login Component
const Login: React.FC<{ onLogin: (email: string, password: string) => boolean }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(email, password);
    if (!success) {
      setError('Ungültige Anmeldedaten');
    }
  };

  // Demo accounts
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
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🥋</div>
          <h1 className="text-2xl font-bold text-white">MARTIAL INSTINCT</h1>
          <p className="text-gray-400 mt-2">Training Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-Mail"
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-red-500 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-red-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-colors"
          >
            Anmelden
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8">
          <p className="text-gray-500 text-sm text-center mb-4">Demo-Accounts:</p>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
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

// Main App Content
const AppContent: React.FC = () => {
  const { currentUser, login, logout, switchUser, members } = useApp();
  const [viewMode, setViewMode] = useState<'member' | 'instructor'>('member');

  if (!currentUser) {
    return <Login onLogin={login} />;
  }

  const isInstructor = currentUser.role !== 'member';
  const actualViewMode = isInstructor ? viewMode : 'member';

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Bar with View Switcher */}
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

          <div className="flex items-center gap-4">
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

            <button
              onClick={logout}
              className="text-gray-400 hover:text-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content — pt-10 compensates for fixed top bar height */}
      <div className="pt-10">
        {actualViewMode === 'member' ? <MemberView /> : <InstructorView />}
      </div>
    </div>
  );
};

// App Wrapper with Provider
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
