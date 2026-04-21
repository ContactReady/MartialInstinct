// ============================================
// SHARED RANKING LIST — Member & Instructor
// Einheitliche Rangliste für beide Bereiche
// ============================================

import React, { useState } from 'react';
import { MODULES, BLOCKS } from '../../context/AppContext';
import { Member, CheckIn, LEVEL_DISPLAY } from '../../types';

// Curriculum: genau die 10 nummerierten Module (1–10), unabhängig von Block-Sichtbarkeit
const CURRICULUM_MODULES = MODULES
  .filter(m => m.number <= 10)
  .sort((a, b) => a.number - b.number);

// Für die aufgeklappte Detail-Ansicht: Blöcke die Curriculum-Module enthalten
const CURRICULUM_BLOCKS = BLOCKS.filter(b =>
  b.id !== 'assistant_instructor' &&
  b.moduleIds.some(id => CURRICULUM_MODULES.some(cm => cm.id === id))
);

// Modul-Fortschritt berechnen
function getModProgress(member: Member, moduleId: string): { tactics: boolean; combat: boolean } {
  const mod = MODULES.find(m => m.id === moduleId);
  if (!mod) return { tactics: false, combat: false };
  const required = mod.techniques.filter(t => t.isRequired);
  if (required.length === 0) return { tactics: false, combat: false };
  const tactics = required.every(t => {
    const s = member.techniqueProgress[t.id]?.status;
    return s === 'tech_passed' || s === 'tac_passed';
  });
  const combat = required.every(t => member.techniqueProgress[t.id]?.status === 'tac_passed');
  return { tactics, combat };
}


function formatDateTime(date: Date | null | undefined): string {
  if (!date) return '–';
  const d = new Date(date);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Heute ${time}`;
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) + ` ${time}`;
}

type SortKey = 'xp' | 'streak' | 'techniques';
type FilterKey = 'alle' | 'dieses_jahr' | 'mein_level';

interface RankingListProps {
  members: Member[];
  currentUserId: string;
  currentUserLevel?: string;
  checkIns: CheckIn[];
  showLevelFilter?: boolean; // "Mein Level" nur im Mitgliederbereich sinnvoll
}

export const RankingList: React.FC<RankingListProps> = ({
  members,
  currentUserId,
  currentUserLevel,
  checkIns,
  showLevelFilter = true,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('xp');
  const [filterKey, setFilterKey] = useState<FilterKey>('alle');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Nur Pflicht-Techniken aus den 10 Curriculum-Modulen zählen
  const countPassedTechs = (m: Member) =>
    CURRICULUM_MODULES.flatMap(mod => mod.techniques.filter(t => t.isRequired))
      .filter(t => {
        const s = m.techniqueProgress[t.id]?.status;
        return s === 'tech_passed' || s === 'tac_passed';
      }).length;

  // Filter
  const filtered = members.filter(m => {
    if (filterKey === 'mein_level') return m.currentLevel === currentUserLevel;
    if (filterKey === 'dieses_jahr') {
      const yearStart = new Date(new Date().getFullYear(), 0, 1);
      return checkIns.some(c =>
        c.memberId === m.id && c.status === 'approved' && c.approvedAt != null &&
        new Date(c.approvedAt).getTime() >= yearStart.getTime()
      );
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'streak') {
      const diff = b.streak.currentStreak - a.streak.currentStreak;
      return diff !== 0 ? diff : countPassedTechs(b) - countPassedTechs(a);
    }
    if (sortKey === 'techniques') return countPassedTechs(b) - countPassedTechs(a);
    return (b.xp ?? 0) - (a.xp ?? 0);
  });

  const myRank = sorted.findIndex(m => m.id === currentUserId) + 1;

  const medal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const statusDot = (m: Member) => {
    if (m.isCheckedIn) return <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />;
    if (m.onlineSince)  return <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />;
    return <span className="w-2 h-2 rounded-full bg-gray-700 flex-shrink-0" />;
  };

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => setSortKey(k)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        sortKey === k ? 'bg-gray-600 text-white' : 'bg-gray-700/60 text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-white">🏆 Rangliste</h2>
          {myRank > 0 && <p className="text-xs text-gray-500 mt-0.5">Du bist auf Platz {myRank}</p>}
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <SortBtn k="xp" label="⭐ XP" />
          <SortBtn k="streak" label="🔥 Streak" />
          <SortBtn k="techniques" label="✅ Tech." />
        </div>
      </div>

      {/* Filter */}
      <div className="flex bg-gray-800/50 rounded-xl p-1 gap-1">
        {(['alle', 'dieses_jahr', ...(showLevelFilter ? ['mein_level'] : [])] as FilterKey[]).map(k => {
          const labels: Record<FilterKey, string> = { alle: 'Alle', dieses_jahr: 'Dieses Jahr', mein_level: 'Mein Level' };
          return (
            <button key={k} onClick={() => setFilterKey(k)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterKey === k ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {labels[k]}
            </button>
          );
        })}
      </div>

      {/* Liste */}
      {sorted.length === 0 ? (
        <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 py-12 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-gray-400 text-sm font-medium">Noch keine Member in der Rangliste</p>
          <p className="text-gray-600 text-xs mt-1">Sobald Member aktiv sind, erscheinen sie hier.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((m, idx) => {
            const rank = idx + 1;
            const isMe = m.id === currentUserId;
            const isExpanded = expandedId === m.id;
            const levelInfo = LEVEL_DISPLAY[m.currentLevel];
            const passed = countPassedTechs(m);
            const tacticsDone = CURRICULUM_MODULES.filter(mod => getModProgress(m, mod.id).tactics).length;
            const combatDone = CURRICULUM_MODULES.filter(mod => getModProgress(m, mod.id).combat).length;
            const total = CURRICULUM_MODULES.length;

            return (
              <div
                key={m.id}
                className="rounded-xl border overflow-hidden transition-all bg-gray-800/50 border-gray-700"
              >
                {/* Klickbare Hauptzeile */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : m.id)}
                  className="w-full text-left"
                >
                  {/* Zeile 1: Rang + Avatar + Name + Badges + XP */}
                  <div className="px-3 pt-3 pb-1.5 flex items-start gap-2.5">
                    <div className="w-7 text-center flex-shrink-0 mt-0.5">
                      <span className={`font-bold ${rank <= 3 ? 'text-base' : 'text-xs text-gray-500'}`}>
                        {medal(rank)}
                      </span>
                    </div>
                    {statusDot(m)}
                    <div className="flex-1 min-w-0">
                      {/* Name + Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-sm text-white">
                          {m.name}
                        </span>
                        {isMe && <span className="text-gray-500 text-[10px]">(Du)</span>}
                        {m.customBadge && (
                          <span className="text-[9px] bg-gray-700 border border-gray-600 rounded px-1.5 py-0.5 text-gray-200 font-medium">
                            {m.customBadge}
                          </span>
                        )}
                        {m.stopTheBleedCertified && (
                          <span className="text-[9px] bg-red-900/40 text-red-400 border border-red-800/40 px-1.5 py-0.5 rounded font-semibold">STB</span>
                        )}
                      </div>
                      {/* Kapitel-Badge */}
                      <span className={`text-[10px] font-semibold ${levelInfo.color}`}>
                        {levelInfo.icon} {levelInfo.name}
                      </span>
                    </div>
                    {/* XP + Chevron */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold text-sm">{m.xp ?? 0}</div>
                        <div className="text-gray-600 text-[9px]">XP</div>
                      </div>
                      <span className={`text-gray-600 text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                    </div>
                  </div>

                  {/* Zeile 2: Stats + Zeiten */}
                  <div className="px-3 pb-2.5 flex items-center gap-4 flex-wrap">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <span className="text-orange-400">🔥</span>
                      <span className="font-semibold text-white">{m.streak.currentStreak}</span>
                      <span className="text-gray-600">Wo.</span>
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-gray-700 border border-gray-500 inline-flex items-center justify-center text-[7px] font-bold text-white flex-shrink-0">T</span>
                      <span className="font-semibold text-white">{tacticsDone}</span>
                      <span className="text-gray-600">/{total}</span>
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-red-700 border border-red-500 inline-flex items-center justify-center text-[7px] font-bold text-white flex-shrink-0">C</span>
                      <span className="font-semibold text-white">{combatDone}</span>
                      <span className="text-gray-600">/{total}</span>
                    </span>
                    {(m.instructorModules?.length ?? 0) > 0 && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <span className="w-3.5 h-3.5 rounded bg-red-900/60 border border-red-700 inline-flex items-center justify-center text-[7px] font-bold text-red-400 flex-shrink-0">I</span>
                        <span className="font-semibold text-white">{m.instructorModules!.length}</span>
                      </span>
                    )}
                    <span className="text-[10px] text-gray-600 flex items-center gap-1 ml-auto">
                      <span>{passed} Tech.</span>
                    </span>
                  </div>

                  {/* Zeile 3: Zeiten */}
                  <div className="px-3 pb-2.5 flex flex-wrap gap-x-4 gap-y-0 text-[10px] border-t border-gray-700/30 pt-1.5">
                    <span>
                      <span className="text-gray-600">Online: </span>
                      <span className="text-gray-400">{formatDateTime(m.lastSeenAt)}</span>
                    </span>
                    <span>
                      <span className="text-gray-600">Training: </span>
                      <span className="text-gray-400">{formatDateTime(m.streak.lastTrainingDate)}</span>
                    </span>
                  </div>
                </button>

                {/* Aufgeklapptes Modul-Detail */}
                {isExpanded && (
                  <div className="border-t border-gray-700/40 bg-gray-900/60 px-3 py-3 space-y-3">
                    {CURRICULUM_BLOCKS.map(block => {
                      const blockMods = block.moduleIds
                        .map(id => MODULES.find(mm => mm.id === id)!)
                        .filter(Boolean)
                        .filter(mod => CURRICULUM_MODULES.some(cm => cm.id === mod.id));
                      if (blockMods.length === 0) return null;
                      const bTactics = blockMods.filter(mod => getModProgress(m, mod.id).tactics).length;
                      const bCombat = blockMods.filter(mod => getModProgress(m, mod.id).combat).length;
                      return (
                        <div key={block.id}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">{block.icon}</span>
                              <span className={`text-[10px] font-black tracking-wider uppercase ${block.color}`}>{block.name}</span>
                            </div>
                            <div className="text-[9px] text-gray-500 flex gap-2">
                              <span>T: {bTactics}/{blockMods.length}</span>
                              <span>C: {bCombat}/{blockMods.length}</span>
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            {blockMods.map(mod => {
                              const prog = getModProgress(m, mod.id);
                              return (
                                <div key={mod.id} className="flex items-center gap-2 py-0.5">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                    prog.tactics ? 'bg-gray-700 border-gray-500' : 'border-gray-700'
                                  }`}>
                                    {prog.tactics && <span className="text-white font-bold" style={{ fontSize: '7px' }}>T</span>}
                                  </div>
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                    prog.combat ? 'bg-red-700 border-red-500' : 'border-gray-700'
                                  }`}>
                                    {prog.combat && <span className="text-white font-bold" style={{ fontSize: '7px' }}>C</span>}
                                  </div>
                                  <span className={`text-xs truncate ${
                                    prog.combat ? 'text-white' : prog.tactics ? 'text-gray-300' : 'text-gray-600'
                                  }`}>
                                    {mod.name}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Legende */}
      <div className="flex items-center gap-4 text-[10px] text-gray-600 pt-1 flex-wrap">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Beim Training</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Online</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-700 inline-block" /> Offline</span>
        <span className="flex items-center gap-1">
          <span className="w-3.5 h-3.5 rounded-full bg-gray-700 border border-gray-500 inline-flex items-center justify-center text-[7px] font-bold text-white">T</span> Tactics
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3.5 h-3.5 rounded-full bg-red-700 border border-red-500 inline-flex items-center justify-center text-[7px] font-bold text-white">C</span> Combat
        </span>
      </div>
    </div>
  );
};
