// ============================================
// CERTIFICATE VIEW — Digitaler Trainingsnachweis
// Druckbar als PDF via window.print()
// Unterschrift: PENDING — wird noch hinzugefügt
// ============================================

import React from 'react';
import { useApp, BLOCKS, MODULES } from '../../context/AppContext';

// ── Roman Numerals ───────────────────────────────────────────────────────────
function toRoman(n: number): string {
  const map: [number, string][] = [
    [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
    [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
    [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
  ];
  let result = '';
  for (const [val, sym] of map) {
    while (n >= val) { result += sym; n -= val; }
  }
  return result;
}

// ── Alle Curriculum-Module in Reihenfolge (ohne Assistant Instructor) ────────
const CURRICULUM_MODULES = BLOCKS
  .filter(b => b.id !== 'assistant_instructor')
  .flatMap(b => b.moduleIds.map(id => MODULES.find(m => m.id === id)!))
  .filter(Boolean)
  .slice(0, 10);

interface CertificateViewProps {
  onClose: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ onClose }) => {
  const { currentUser, getTechniquesForModule } = useApp();
  if (!currentUser) return null;

  const today = new Date().toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  // Prüft ob Tactics abgeschlossen (tech_passed oder tac_passed auf allen Pflicht-Techniken)
  const isTacticsDone = (moduleId: string): boolean => {
    const techs = getTechniquesForModule(moduleId).filter(t => t.isRequired);
    if (techs.length === 0) {
      // Fallback: hardcoded MODULES
      const mod = MODULES.find(m => m.id === moduleId);
      if (!mod) return false;
      const required = mod.techniques.filter(t => t.isRequired);
      if (required.length === 0) return false;
      return required.every(t => {
        const s = currentUser.techniqueProgress[t.id]?.status;
        return s === 'tech_passed' || s === 'tac_passed';
      });
    }
    return techs.every(t => {
      const s = currentUser.techniqueProgress[t.id]?.status;
      return s === 'tech_passed' || s === 'tac_passed';
    });
  };

  // Prüft ob Combat abgeschlossen (tac_passed auf allen Pflicht-Techniken)
  const isCombatDone = (moduleId: string): boolean => {
    const techs = getTechniquesForModule(moduleId).filter(t => t.isRequired);
    if (techs.length === 0) {
      const mod = MODULES.find(m => m.id === moduleId);
      if (!mod) return false;
      const required = mod.techniques.filter(t => t.isRequired);
      if (required.length === 0) return false;
      return required.every(t =>
        currentUser.techniqueProgress[t.id]?.status === 'tac_passed'
      );
    }
    return techs.every(t =>
      currentUser.techniqueProgress[t.id]?.status === 'tac_passed'
    );
  };

  const handlePrint = () => window.print();

  return (
    <>
      {/* ── Print CSS ─────────────────────────────────────────────────────── */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #mi-certificate-print { display: block !important; }
          #mi-certificate-print { position: fixed; inset: 0; }
        }
        @page {
          size: A4 portrait;
          margin: 0;
        }
      `}</style>

      {/* ── Screen Overlay ────────────────────────────────────────────────── */}
      <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-start overflow-y-auto py-4 px-4">

        {/* Buttons */}
        <div className="flex gap-3 mb-4 no-print w-full max-w-2xl">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-all"
          >
            ← Zurück
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all"
          >
            Als PDF herunterladen
          </button>
        </div>

        {/* ── Certificate ─────────────────────────────────────────────────── */}
        <div
          id="mi-certificate-print"
          className="bg-white text-black w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {/* Header */}
          <div className="bg-black text-white px-8 pt-7 pb-5 text-center">
            <img
              src="/logos/mi-logo-light.jpg"
              alt="Martial Instinct"
              className="h-12 mx-auto mb-3 object-contain"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="text-xs tracking-[0.3em] uppercase text-gray-400 mt-1">Martial Instinct Köln</div>
          </div>

          {/* Title */}
          <div className="text-center py-5 border-b border-gray-200 px-8">
            <div className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-1">Offizieller</div>
            <div className="text-2xl font-black tracking-widest uppercase">Trainingsnachweis</div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mt-1">Certificate of Progress</div>
          </div>

          {/* Member Name */}
          <div className="text-center py-4 border-b border-gray-100 px-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-1">Ausgestellt für</div>
            <div className="text-3xl font-black tracking-wide">{currentUser.name}</div>
            <div className="text-xs text-gray-400 mt-1 tracking-widest uppercase">Datum: {today}</div>
          </div>

          {/* ── Module Grid ───────────────────────────────────────────────── */}
          <div className="px-6 py-4">

            {/* Column Headers */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-4 mb-2">
              <div className="text-center text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">Tactics</div>
              <div className="w-48" />
              <div className="text-center text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">Combat</div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-black mb-1" />

            {/* Module Rows */}
            {CURRICULUM_MODULES.map((mod, idx) => {
              const romanNum = toRoman(idx + 1);
              const tacticsDone = isTacticsDone(mod.id);
              const combatDone = isCombatDone(mod.id);

              return (
                <div
                  key={mod.id}
                  className={`grid grid-cols-[1fr_auto_1fr] gap-x-4 items-center py-1.5 ${
                    idx < CURRICULUM_MODULES.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  {/* Tactics Stamp */}
                  <div className="flex justify-center">
                    {tacticsDone ? (
                      <Stamp label="T" color="black" />
                    ) : (
                      <div className="w-8 h-8" />
                    )}
                  </div>

                  {/* Roman + Module Name */}
                  <div className="w-48 text-center">
                    <span className="text-[10px] text-gray-400 font-mono mr-2">{romanNum}</span>
                    <span className="text-xs font-semibold tracking-wide">{mod.name}</span>
                  </div>

                  {/* Combat Stamp */}
                  <div className="flex justify-center">
                    {combatDone ? (
                      <Stamp label="C" color="red" />
                    ) : (
                      <div className="w-8 h-8" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Bottom Divider */}
            <div className="border-t-2 border-black mt-1" />
          </div>

          {/* Legend */}
          <div className="px-6 pb-2 flex justify-center gap-8 text-[9px] text-gray-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-black inline-flex items-center justify-center text-white font-black" style={{fontSize:'7px'}}>T</span>
              Technisch bestanden
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-red-600 inline-flex items-center justify-center text-white font-black" style={{fontSize:'7px'}}>C</span>
              Combat bestanden
            </span>
          </div>

          {/* Signature */}
          <div className="px-8 pb-7 pt-3 border-t border-gray-200 mt-1">
            <div className="flex justify-between items-end">
              <div className="text-center">
                <div className="text-[9px] text-gray-400 tracking-widest uppercase mb-1">Datum</div>
                <div className="border-b border-gray-400 w-36 pb-0.5 text-xs text-gray-600">{today}</div>
              </div>

              <div className="text-center">
                {/* SIGNATURE PLACEHOLDER — hier Unterschrift-Bild einfügen */}
                <div className="h-10 flex items-end justify-center mb-0.5">
                  <span className="text-gray-300 text-xs italic">[Unterschrift folgt]</span>
                </div>
                <div className="border-b border-gray-400 w-48 pb-0.5" />
                <div className="text-[9px] text-gray-400 tracking-widest uppercase mt-1">Head Instructor · Martial Instinct</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-black text-gray-500 text-[9px] text-center py-2 tracking-widest uppercase">
            Martial Instinct Köln · JKD · Eskrima · Selbstverteidigung
          </div>
        </div>
      </div>
    </>
  );
};

// ── Stamp Component ──────────────────────────────────────────────────────────
const Stamp: React.FC<{ label: string; color: 'black' | 'red' }> = ({ label, color }) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white border-2 ${
      color === 'red'
        ? 'bg-red-600 border-red-700'
        : 'bg-black border-gray-800'
    }`}
    style={{ fontSize: '11px', letterSpacing: '0.05em' }}
  >
    {label}
  </div>
);

export default CertificateView;
