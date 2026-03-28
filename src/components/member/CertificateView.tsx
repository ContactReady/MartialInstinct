// ============================================
// CERTIFICATE VIEW — Digitaler Trainingsnachweis
// Design orientiert am physischen MI-Zertifikat
// Print via ReactDOM.createPortal → direkt in body
// ============================================

import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
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

// ── Ersten 10 Curriculum-Module ──────────────────────────────────────────────
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
  const portalRef = useRef<HTMLDivElement | null>(null);

  // Portal-Container direkt in body einhängen
  useEffect(() => {
    const el = document.createElement('div');
    el.id = 'mi-certificate-portal';
    document.body.appendChild(el);
    portalRef.current = el;
    return () => { document.body.removeChild(el); };
  }, []);

  if (!currentUser) return null;

  const today = new Date().toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  const isTacticsDone = (moduleId: string): boolean => {
    const techs = getTechniquesForModule(moduleId).filter(t => t.isRequired);
    if (techs.length === 0) {
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

  // ── Zertifikat-Inhalt ─────────────────────────────────────────────────────
  const certificateContent = (
    <>
      {/* Print CSS — direkt in head, kein nesting-Problem */}
      <style>{`
        @media print {
          body > *:not(#mi-certificate-portal) { display: none !important; }
          #mi-certificate-portal { display: block !important; position: fixed; inset: 0; z-index: 9999; }
          .cert-no-print { display: none !important; }
        }
        @page { size: A4 portrait; margin: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>

      {/* ── Screen Overlay ── */}
      <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-start overflow-y-auto overflow-x-auto py-4 px-4 cert-no-print"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        <div className="flex gap-3 mb-4 w-full max-w-[794px]">
          <button onClick={onClose}
            className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-all"
          >← Zurück</button>
          <button onClick={handlePrint}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all"
          >Als PDF herunterladen</button>
        </div>

        {/* Zertifikat-Karte */}
        <CertificateCard
          name={currentUser.name}
          today={today}
          modules={CURRICULUM_MODULES}
          isTacticsDone={isTacticsDone}
          isCombatDone={isCombatDone}
          stopTheBleedCertified={currentUser.stopTheBleedCertified}
        />
      </div>

      {/* ── Print-Version (nur bei window.print() sichtbar) ── */}
      <div id="mi-certificate-print" style={{ display: 'none', fontFamily: 'Georgia, serif' }}>
        <CertificateCard
          name={currentUser.name}
          today={today}
          modules={CURRICULUM_MODULES}
          isTacticsDone={isTacticsDone}
          isCombatDone={isCombatDone}
          stopTheBleedCertified={currentUser.stopTheBleedCertified}
          isPrint
        />
      </div>
    </>
  );

  // Portal direkt in body rendern → Print CSS kann body-children korrekt verstecken
  if (portalRef.current) {
    return ReactDOM.createPortal(certificateContent, portalRef.current);
  }
  return certificateContent;
};

// ── Zertifikat-Layout ─────────────────────────────────────────────────────────
interface CardProps {
  name: string;
  today: string;
  modules: typeof CURRICULUM_MODULES;
  isTacticsDone: (id: string) => boolean;
  isCombatDone: (id: string) => boolean;
  stopTheBleedCertified?: boolean;
  isPrint?: boolean;
}

const CertificateCard: React.FC<CardProps> = ({
  name, today, modules, isTacticsDone, isCombatDone, stopTheBleedCertified, isPrint
}) => (
  <div
    className={`bg-white text-black overflow-hidden ${isPrint ? '' : 'rounded-2xl shadow-2xl'}`}
    style={{
      fontFamily: 'Georgia, serif',
      width: isPrint ? '210mm' : '794px',
      minHeight: isPrint ? '297mm' : '1123px',
      ...(isPrint ? { position: 'fixed', inset: 0 } : {})
    }}
  >
    {/* ── Dekorativer Rahmen ── */}
    <div
      className="relative m-3 border-2 border-gray-300 rounded-xl overflow-hidden bg-white flex flex-col"
      style={{ minHeight: isPrint ? 'calc(297mm - 24px)' : 'calc(1123px - 24px)' }}
    >

      {/* Innerer dünner Rahmen */}
      <div className="absolute inset-1 border border-gray-200 rounded-lg pointer-events-none z-10" />

      {/* ── Header: Logo auf Weiß ── */}
      <div className="bg-white px-6 pt-6 pb-2 text-center">
        <img
          src="/logos/mi-logo-landscape-light.svg"
          alt="Martial Instinct"
          className="h-14 mx-auto object-contain"
          onError={e => { (e.target as HTMLImageElement).src = '/logos/mi-logo-landscape-dark.svg'; }}
        />
      </div>

      {/* ── Titel ── */}
      <div className="text-center py-2 px-6 border-b border-gray-200 bg-white">
        <div
          className="font-black tracking-[0.45em] uppercase"
          style={{ fontSize: '30px', color: '#c41230', fontFamily: 'Georgia, serif' }}
        >ZERTIFIKAT</div>
      </div>

      {/* ── Intro-Text ── */}
      <div className="text-center px-8 pt-3 pb-1 bg-white">
        <p className="text-xs text-gray-500 leading-relaxed">
          Dieses Zertifikat bestätigt den Fortschritt im Bereich<br />
          <strong className="text-gray-800">M.I. Streetdefense</strong> von:
        </p>
        <div className="mt-2 border-b-2 border-gray-800 mx-8 pb-1">
          <span className="text-2xl font-black tracking-wide text-gray-900">{name}</span>
        </div>
        <div className="text-[10px] text-gray-400 mt-1 tracking-widest">Datum: {today}</div>
      </div>

      {/* ── Zitat ── */}
      <div className="px-10 py-3 text-center bg-white">
        <p
          className="text-gray-600 leading-relaxed italic"
          style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", fontSize: '13px' }}
        >
          „Erzähle es mir und ich werde es vergessen.<br />
          Zeige es mir und ich werde es behalten.<br />
          Lass es mich tun und ich werde es können."
        </p>
      </div>

      {/* ── Hauptbereich: Foto + Siegel + Module ── */}
      <div className="px-6 pb-2 bg-white">
        <div className="flex gap-3 items-start">

          {/* Foto-Platzhalter */}
          <div className="flex-shrink-0">
            <div
              className="border-2 border-gray-300 rounded flex items-center justify-center text-gray-300 bg-gray-50"
              style={{ width: '72px', height: '90px', fontSize: '10px', textAlign: 'center', lineHeight: '1.3' }}
            >
              Foto
            </div>
            {/* Siegel */}
            <div className="mt-2 flex justify-center">
              <WaxSeal />
            </div>
          </div>

          {/* Module-Tabelle */}
          <div className="flex-1">
            {/* Spalten-Header */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 mb-1 mt-1">
              <div className="text-center text-[9px] font-black tracking-[0.2em] uppercase text-gray-500">Tactics</div>
              <div className="w-36" />
              <div className="text-center text-[9px] font-black tracking-[0.2em] uppercase text-gray-500">Combat</div>
            </div>
            <div className="border-t-2 border-gray-800 mb-0.5" />

            {modules.map((mod, idx) => {
              const romanNum = toRoman(idx + 1);
              const tacticsDone = isTacticsDone(mod.id);
              const combatDone = isCombatDone(mod.id);
              return (
                <div
                  key={mod.id}
                  className={`grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center py-1 ${
                    idx < modules.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex justify-center">
                    {tacticsDone
                      ? <SmallStamp color="black" />
                      : <div className="w-5 h-5" />
                    }
                  </div>
                  <div className="w-36 text-center">
                    <span className="text-[9px] text-gray-400 font-mono mr-1.5">{romanNum}</span>
                    <span className="text-[10px] font-semibold text-gray-800">{mod.name}</span>
                  </div>
                  <div className="flex justify-center">
                    {combatDone
                      ? <SmallStamp color="red" />
                      : <div className="w-5 h-5" />
                    }
                  </div>
                </div>
              );
            })}
            <div className="border-t-2 border-gray-800 mt-0.5" />

            {/* Stop The Bleed Badge */}
            {stopTheBleedCertified && (
              <div className="mt-2 flex items-center gap-2 justify-center">
                <img
                  src="/logos/stop-the-bleed.png"
                  alt="Stop The Bleed"
                  className="h-5 object-contain"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="text-[9px] font-semibold text-gray-600 tracking-wider uppercase">Stop The Bleed® Certified</span>
              </div>
            )}
          </div>
        </div>

        {/* Legende */}
        <div className="flex justify-center gap-6 mt-2 text-[8px] text-gray-400 uppercase tracking-widest">
          <span className="flex items-center gap-1">
            <SmallStamp color="black" />
            Tactics bestanden
          </span>
          <span className="flex items-center gap-1">
            <SmallStamp color="red" />
            Combat bestanden
          </span>
        </div>
      </div>

      {/* Spacer — schiebt Unterschriften ans Ende */}
      <div className="flex-1" />

      {/* ── Unterschriften ── */}
      <div className="px-6 pb-4 pt-3 border-t border-gray-200 bg-white">
        <div className="flex justify-between items-end gap-4">
          <div className="text-center flex-1">
            <div className="border-b border-gray-500 pb-0.5 text-xs text-gray-600 min-h-[20px]">{today}</div>
            <div className="text-[9px] text-gray-400 tracking-widest uppercase mt-1">Ort, Datum</div>
          </div>
          <div className="text-center flex-1">
            <div className="border-b border-gray-500 pb-0.5 min-h-[20px]">
              {/* TRAINER UNTERSCHRIFT PLACEHOLDER */}
            </div>
            <div className="text-[9px] text-gray-400 tracking-widest uppercase mt-1">Trainer</div>
          </div>
          <div className="text-center flex-1">
            <div className="border-b border-gray-500 pb-0.5 min-h-[20px]">
              {/* PRÜFER UNTERSCHRIFT PLACEHOLDER */}
            </div>
            <div className="text-[9px] text-gray-400 tracking-widest uppercase mt-1">Prüfer</div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="bg-white text-gray-400 text-[8px] text-center py-3 tracking-widest uppercase border-t border-gray-100">
        Martial Instinct Köln · JKD · Eskrima · Selbstverteidigung
      </div>
    </div>
  </div>
);

// ── Wachs-Siegel ─────────────────────────────────────────────────────────────
const WaxSeal: React.FC = () => (
  <div
    className="flex items-center justify-center rounded-full bg-red-700 shadow-lg"
    style={{ width: '54px', height: '54px', boxShadow: '0 3px 8px rgba(153,27,27,0.5), inset 0 1px 2px rgba(255,255,255,0.1)' }}
  >
    <img
      src="/logos/mi-icon.jpg"
      alt="MI"
      className="w-8 h-8 rounded-full object-contain opacity-90"
      onError={e => {
        const el = e.target as HTMLImageElement;
        el.style.display = 'none';
        const parent = el.parentElement;
        if (parent) parent.innerHTML = '<span style="color:white;font-size:18px;font-weight:900">M</span>';
      }}
    />
  </div>
);

// ── Kleiner Stempel ───────────────────────────────────────────────────────────
const SmallStamp: React.FC<{ color: 'black' | 'red' }> = ({ color }) => (
  <div
    className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-white border ${
      color === 'red' ? 'bg-red-600 border-red-700' : 'bg-gray-900 border-gray-700'
    }`}
    style={{ fontSize: '8px' }}
  >
    {color === 'red' ? 'C' : 'T'}
  </div>
);

export default CertificateView;
