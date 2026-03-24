// ============================================
// PROFIL-ANSICHT — Member & Instructor
// ============================================

import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Member, ROLE_DISPLAY, LEVEL_DISPLAY } from '../../types';
import { MODULES } from '../../data/modules';

interface ProfileViewProps {
  member: Member;
  isModal?: boolean;   // true → zeigt ✕ Button (Instructor-Ansicht)
  onClose?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ member, isModal = false, onClose }) => {
  const { currentUser, updateProfileImage, computeBadges, getSessionsForMember } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = currentUser?.id === member.id;
  const canEditImage = isOwnProfile;

  const badges = computeBadges(member);
  const recentSessions = getSessionsForMember(member.id)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const techPassedCount = Object.values(member.techniqueProgress).filter(
    p => p.status === 'tech_passed' || p.status === 'tac_passed' || p.status === 'tac_pending'
  ).length;
  const tacPassedCount = Object.values(member.techniqueProgress).filter(
    p => p.status === 'tac_passed'
  ).length;

  // Alle bestandenen Techniken mit Modulname
  const passedTechniques = MODULES.flatMap(mod =>
    mod.techniques
      .filter(t => {
        const prog = member.techniqueProgress[t.id];
        return prog && (prog.status === 'tech_passed' || prog.status === 'tac_passed');
      })
      .map(t => ({
        ...t,
        moduleName: mod.name,
        status: member.techniqueProgress[t.id]?.status,
        passedAt: member.techniqueProgress[t.id]?.techPassedAt ?? member.techniqueProgress[t.id]?.tacPassedAt
      }))
  );

  const handleImageClick = () => {
    if (canEditImage) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const roleInfo = ROLE_DISPLAY[member.role];
  const levelInfo = LEVEL_DISPLAY[member.currentLevel];

  const joinedFormatted = new Date(member.joinedAt).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className={`${isModal ? 'fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4' : ''}`}
      onClick={isModal ? onClose : undefined}
    >
      <div
        className={`bg-gray-900 text-white w-full overflow-y-auto ${
          isModal
            ? 'sm:rounded-2xl sm:max-w-md sm:max-h-[90vh] rounded-t-2xl max-h-[92vh]'
            : 'min-h-full'
        }`}
        onClick={e => e.stopPropagation()}
      >

        {/* Header mit Schließen-Button */}
        {isModal && (
          <div className="flex items-center justify-between px-5 pt-5 pb-2">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Profil</span>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
          </div>
        )}

        {/* Hero — Bild + Name */}
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 px-6 pt-6 pb-5 flex flex-col items-center">
          {/* Avatar / Foto */}
          <div
            className={`relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-700 bg-gray-800 flex items-center justify-center text-5xl ${canEditImage ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
            onClick={handleImageClick}
          >
            {member.profileImageUrl ? (
              <img src={member.profileImageUrl} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <span>{member.avatar}</span>
            )}
            {canEditImage && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-2xl">📷</span>
              </div>
            )}
          </div>
          {canEditImage && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          )}

          {/* Name + Rang */}
          <div className="mt-3 text-center">
            <h2 className="text-xl font-bold text-white">{member.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${roleInfo.bgColor} ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${levelInfo.bgColor} ${levelInfo.color}`}>
                {levelInfo.icon} {levelInfo.name}
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-2">Dabei seit {joinedFormatted}</p>
          </div>
        </div>

        <div className="px-5 pb-28 space-y-5 mt-1">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700 text-center">
              <div className="text-2xl font-black text-orange-400">{member.streak.currentStreak}</div>
              <div className="text-xs text-gray-400 mt-0.5">🔥 Streak</div>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700 text-center">
              <div className="text-2xl font-black text-yellow-400">{member.xp ?? 0}</div>
              <div className="text-xs text-gray-400 mt-0.5">⚡ XP</div>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700 text-center">
              <div className="text-2xl font-black text-green-400">{tacPassedCount}</div>
              <div className="text-xs text-gray-400 mt-0.5">● Vollständig</div>
            </div>
          </div>

          {/* Technik-Überblick */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Techniken</div>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-blue-400 font-bold">{techPassedCount}</span>
                <span className="text-gray-400 ml-1">technisch bestanden</span>
              </div>
              <div>
                <span className="text-green-400 font-bold">{tacPassedCount}</span>
                <span className="text-gray-400 ml-1">vollständig</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Abzeichen</div>
              <div className="flex flex-wrap gap-2">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    title={badge.description}
                    className="flex items-center gap-1.5 bg-gray-700/80 border border-gray-600 rounded-full px-3 py-1.5"
                  >
                    <span className="text-base">{badge.icon}</span>
                    <span className="text-xs font-medium text-gray-200">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bestandene Techniken */}
          {passedTechniques.length > 0 && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">
                Bestandene Techniken ({passedTechniques.length})
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {passedTechniques.map(t => (
                  <div key={t.id} className="flex items-center gap-2 py-1.5 border-b border-gray-700/50 last:border-0">
                    <span className={`text-sm ${t.status === 'tac_passed' ? 'text-green-400' : 'text-blue-400'}`}>
                      {t.status === 'tac_passed' ? '●' : '◐'}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm text-white truncate">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.moduleName}</div>
                    </div>
                    {t.passedAt && (
                      <div className="ml-auto text-xs text-gray-500 flex-shrink-0">
                        {new Date(t.passedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zertifikate */}
          {member.certificates.length > 0 && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Zertifikate</div>
              <div className="space-y-2">
                {member.certificates.map(cert => (
                  <div key={cert.id} className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3">
                    <span className="text-2xl">📜</span>
                    <div>
                      <div className="text-sm font-semibold text-white">{LEVEL_DISPLAY[cert.level].name}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(cert.issuedAt).toLocaleDateString('de-DE')} · {cert.examinerName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trainings-Sessions */}
          {recentSessions.length > 0 && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Zuletzt trainiert</div>
              <div className="space-y-2">
                {recentSessions.map(session => {
                  const techCount = [...new Set(session.groups.flatMap(g => g.techniqueIds))].length;
                  return (
                    <div key={session.id} className="flex items-center gap-3 py-1.5 border-b border-gray-700/50 last:border-0">
                      <span className="text-lg">🥋</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white">
                          {new Date(session.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                          {session.courseName && <span className="text-gray-500 ml-2 text-xs">{session.courseName}</span>}
                        </div>
                        <div className="text-xs text-gray-500">{techCount} Technik{techCount !== 1 ? 'en' : ''}</div>
                      </div>
                      <div className="text-xs text-yellow-500 font-semibold">+{techCount * 10} XP</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Leerer Zustand für badges */}
          {badges.length === 0 && passedTechniques.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🥋</div>
              <p className="text-sm">Noch keine Abzeichen oder Prüfungen</p>
              <p className="text-xs mt-1">Starte dein Training um Fortschritte zu erzielen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
