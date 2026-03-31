// ============================================
// PROFIL-ANSICHT — Member & Instructor
// ============================================

import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Member, ROLE_DISPLAY, LEVEL_DISPLAY } from '../../types';
import { MODULES } from '../../data/modules';

interface ProfileViewProps {
  member: Member;
  isModal?: boolean;   // true → zeigt ✕ Button (Instructor-Ansicht)
  onClose?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ member, isModal = false, onClose }) => {
  const { currentUser, updateProfileImage, computeBadges, getSessionsForMember, getBadgeDisplaySettings, getProfileImgSettings, setProfileImgSettings, darkMode } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = currentUser?.id === member.id;
  const canEditImage = isOwnProfile;

  // Profilbild-Editor State
  const [imgDraft, setImgDraft] = useState<string | null>(null);
  const [imgScale, setImgScale] = useState(150);
  const [imgPosX, setImgPosX] = useState(150);
  const [imgPosY, setImgPosY] = useState(150);

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
    if (canEditImage && !imgDraft) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const saved = getProfileImgSettings(member.id);
      setImgDraft(reader.result as string);
      setImgScale(saved.scale);
      setImgPosX(saved.posX);
      setImgPosY(saved.posY);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleEditExisting = () => {
    const saved = getProfileImgSettings(member.id);
    setImgDraft(member.profileImageUrl!);
    setImgScale(saved.scale);
    setImgPosX(saved.posX);
    setImgPosY(saved.posY);
  };

  const handleSaveImage = () => {
    if (!imgDraft) return;
    if (imgDraft !== member.profileImageUrl) updateProfileImage(imgDraft);
    setProfileImgSettings(member.id, { scale: imgScale, posX: imgPosX, posY: imgPosY });
    setImgDraft(null);
  };

  const handleCancelImage = () => {
    setImgDraft(null);
  };

  // Aktuelle Anzeigeeinstellungen (gespeichert oder Default)
  const displaySettings = getProfileImgSettings(member.id);
  const displayUrl = member.profileImageUrl || '/logos/mi-icon.jpg';

  const roleInfo = ROLE_DISPLAY[member.role];
  const levelInfo = LEVEL_DISPLAY[member.currentLevel];

  const joinedFormatted = new Date(member.joinedAt).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const dv = member.dataVisibility;
  const viewerRole = currentUser?.role ?? 'member';
  // Ab Instructor (nicht assistant_instructor) alle Daten sichtbar
  const canSeeAll = isOwnProfile || ['instructor', 'full_instructor', 'head_instructor', 'admin'].includes(viewerRole);

  // Geburtsdatum formatieren
  const formatBirthDate = (visibility: 'hidden' | 'dayMonth' | 'full' | 'all') => {
    if (!member.birthDate) return null;
    if (visibility === 'hidden') return null;
    // Unterstützt ISO "YYYY-MM-DD" und TT.MM.YYYY
    const raw = member.birthDate;
    let day = '', month = '', year = '';
    if (raw.includes('-')) { [year, month, day] = raw.split('-'); }
    else if (raw.includes('.')) { [day, month, year] = raw.split('.'); }
    if (!day || !month) return raw;
    if (visibility === 'dayMonth') return `${day}.${month}.`;
    return `${day}.${month}.${year}`;
  };

  const birthDateDisplay = canSeeAll
    ? formatBirthDate('all')
    : formatBirthDate(dv?.birthDateVisibility ?? 'hidden');

  // Welche Felder auf dem Profil sichtbar sind
  const profileFields: { label: string; value: string }[] = [
    ...(member.firstName ? [{ label: 'Vorname', value: member.firstName }] : []),
    ...((canSeeAll || dv?.showLastName) && member.lastName ? [{ label: 'Nachname', value: member.lastName }] : []),
    ...((canSeeAll || dv?.showMemberId) && member.memberId ? [{ label: 'Member ID', value: member.memberId }] : []),
    ...(birthDateDisplay ? [{ label: 'Geburtstag', value: birthDateDisplay }] : []),
  ].filter(f => f.value);

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
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 px-6 pt-8 pb-5 flex flex-col items-center">
          {/* Avatar / Foto */}
          {!imgDraft ? (
            <>
              <div
                className={`relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-700 ${canEditImage ? 'cursor-pointer' : ''}`}
                style={member.profileImageUrl ? {
                  backgroundImage: `url(${member.profileImageUrl})`,
                  backgroundSize: `${displaySettings.scale}%`,
                  backgroundPosition: `${displaySettings.posX / 3}% ${displaySettings.posY / 3}%`,
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: '#fff',
                } : {}}
                onClick={handleImageClick}
              >
                {!member.profileImageUrl && (
                  <img src="/logos/mi-icon.jpg" alt="" className="w-full h-full object-cover" />
                )}
                {canEditImage && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                    <span className="text-white text-2xl">📷</span>
                  </div>
                )}
              </div>
              {canEditImage && (
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              )}
              {canEditImage && member.profileImageUrl && (
                <button
                  onClick={handleEditExisting}
                  className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-gray-700/50 mt-2"
                >
                  ✏️ Bild bearbeiten
                </button>
              )}
            </>
          ) : (
            /* ── Profilbild-Editor ── */
            <div className="w-full space-y-3">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-red-500" style={{
                  backgroundImage: `url(${imgDraft})`,
                  backgroundSize: `${imgScale}%`,
                  backgroundPosition: `${imgPosX / 3}% ${imgPosY / 3}%`,
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: '#fff',
                }} />
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-gray-400">Zoom</label>
                    <span className="text-xs text-gray-500">{imgScale}%</span>
                  </div>
                  <input type="range" min={0} max={300} step={1} value={imgScale} onChange={e => setImgScale(Number(e.target.value))} className="w-full accent-red-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-gray-400">Position Vertikal</label>
                    <span className="text-xs text-gray-500">{imgPosY}</span>
                  </div>
                  <input type="range" min={0} max={300} step={1} value={imgPosY} onChange={e => setImgPosY(Number(e.target.value))} className="w-full accent-red-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-gray-400">Position Horizontal</label>
                    <span className="text-xs text-gray-500">{imgPosX}</span>
                  </div>
                  <input type="range" min={0} max={300} step={1} value={imgPosX} onChange={e => setImgPosX(Number(e.target.value))} className="w-full accent-red-500" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveImage} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-xl text-sm font-semibold transition-all">Speichern</button>
                <button onClick={handleCancelImage} className="px-4 bg-gray-700 text-gray-300 py-2 rounded-xl text-sm hover:bg-gray-600 transition-all">Abbrechen</button>
              </div>
            </div>
          )}

          {/* Name + Rang */}
          <div className="mt-8 text-center">
            <h2 className="text-xl font-bold text-white">{member.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
              {member.role !== 'admin' && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${roleInfo.bgColor} ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${levelInfo.bgColor} ${levelInfo.color}`}>
                {levelInfo.icon} {levelInfo.name}
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-2">Dabei seit {joinedFormatted}</p>
          </div>
        </div>

        <div className="px-5 pb-28 space-y-5 mt-1">

          {/* Persönliche Daten — nur wenn mindestens ein Feld sichtbar */}
          {profileFields.length > 0 && (
            <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 divide-y divide-gray-700/40">
              {profileFields.map(f => (
                <div key={f.label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-gray-500">{f.label}</span>
                  <span className="text-xs text-gray-200 font-medium">{f.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stats — kompakt */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700 text-center">
              <div className="text-xl font-black text-orange-400">{member.streak.longestStreak} W</div>
              <div className="text-xs text-gray-400 mt-0.5">🏅 Rekord</div>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700 text-center">
              <div className="text-xl font-black text-yellow-400">{member.xp ?? 0}</div>
              <div className="text-xs text-gray-400 mt-0.5">XP</div>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700 text-center">
              <div className="text-xl font-black text-blue-400">{techPassedCount}</div>
              <div className="text-xs text-gray-400 mt-0.5">◐ Technisch</div>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700 text-center">
              <div className="text-xl font-black text-green-400">{tacPassedCount}</div>
              <div className="text-xs text-gray-400 mt-0.5">● Vollständig</div>
            </div>
          </div>

          {/* Abzeichen */}
          {badges.filter(b => b.imageUrl).length > 0 && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4">Abzeichen</div>
              <div className="flex flex-wrap gap-6">
                {badges.filter(b => b.imageUrl).map(badge => {
                  const { scale, posX, posY } = getBadgeDisplaySettings(badge.id);
                  const sockelBg = darkMode ? '#0a0a0a' : '#d1d5db';
                  const shadowStack = darkMode
                    ? [
                        '0 1px 0 rgba(255,255,255,0.08) inset',
                        '0 -1px 0 rgba(0,0,0,0.6) inset',
                        '0 4px 8px rgba(0,0,0,0.7)',
                        '0 12px 32px rgba(0,0,0,0.55)',
                        '0 0 0 1.5px rgba(255,255,255,0.06)',
                      ].join(', ')
                    : [
                        '0 1px 0 rgba(255,255,255,0.6) inset',
                        '0 -1px 0 rgba(0,0,0,0.15) inset',
                        '0 4px 8px rgba(0,0,0,0.2)',
                        '0 12px 28px rgba(0,0,0,0.15)',
                        '0 0 0 1.5px rgba(0,0,0,0.08)',
                      ].join(', ');
                  return (
                    <div key={badge.id} className="flex flex-col items-center gap-2" title={badge.description}>
                      <div style={{
                        width: 88, height: 88,
                        borderRadius: '50%',
                        backgroundColor: sockelBg,
                        backgroundImage: `url(${badge.imageUrl})`,
                        backgroundSize: `${Math.round(scale * 100)}%`,
                        backgroundPosition: `${posX}% ${posY}%`,
                        backgroundRepeat: 'no-repeat',
                        boxShadow: shadowStack,
                      }} />
                      <span className="text-[10px] text-gray-400 text-center leading-tight max-w-[88px]">{badge.label}</span>
                    </div>
                  );
                })}
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
          {badges.filter(b => b.imageUrl).length === 0 && passedTechniques.length === 0 && (
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
