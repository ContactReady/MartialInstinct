// ============================================
// CERTIFICATE VIEW — Digitaler Trainingsnachweis
// html2canvas + jsPDF für zuverlässigen Download (inkl. Mobil)
// ============================================

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useApp, BLOCKS, MODULES } from '../../context/AppContext';

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

const CURRICULUM_MODULES = BLOCKS
  .filter(b => b.id !== 'assistant_instructor' && !b.adminOnly)
  .flatMap(b => b.moduleIds.map(id => MODULES.find(m => m.id === id)!))
  .filter(Boolean)
  .slice(0, 10);

interface CertificateViewProps {
  onClose: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ onClose }) => {
  const { currentUser, getTechniquesForModule } = useApp();
  const certRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

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

  const handleDownload = async () => {
    if (!certRef.current || loading) return;
    setLoading(true);
    try {
      await document.fonts.ready;
      const el = certRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: el.offsetWidth,
        height: el.offsetHeight,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const aspect = canvas.height / canvas.width;
      const imgH = pdfW * aspect;
      const yOffset = imgH < pdfH ? (pdfH - imgH) / 2 : 0;
      pdf.addImage(imgData, 'JPEG', 0, yOffset, pdfW, Math.min(imgH, pdfH));

      // Blob-basierter Download für bessere Mobilkompatibilität
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MI_Zertifikat_${currentUser.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>
      <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-start overflow-y-auto overflow-x-auto py-4 px-2">
        {/* Buttons */}
        <div className="flex gap-3 mb-4 w-full max-w-[794px]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-all"
          >
            ← Zurück
          </button>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all"
          >
            {loading ? 'Wird erstellt…' : 'Als PDF herunterladen'}
          </button>
        </div>

        {/* Zertifikat-Karte — wird von html2canvas erfasst */}
        <div
          ref={certRef}
          style={{
            width: '794px',
            minHeight: '1123px',
            backgroundColor: '#ffffff',
            fontFamily: 'Georgia, "Times New Roman", serif',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          }}
        >
          {/* Äußerer Rahmen */}
          <div style={{
            margin: '14px',
            border: '1.5px solid #d1d5db',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}>
            {/* Innerer dünner Rahmen */}
            <div style={{
              position: 'absolute',
              inset: '5px',
              border: '0.5px solid #e5e7eb',
              pointerEvents: 'none',
            }} />

            {/* ── Logo ── */}
            <div style={{ textAlign: 'center', padding: '36px 24px 20px' }}>
              <img
                src="/logos/mi-logo-landscape-light.svg"
                alt="Martial Instinct"
                style={{ height: '60px', margin: '0 auto', display: 'block', objectFit: 'contain' }}
                onError={e => {
                  (e.target as HTMLImageElement).src = '/logos/mi-logo-landscape-dark.svg';
                }}
              />
            </div>

            {/* ── Trennlinie ── */}
            <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '0 24px' }} />

            {/* ── ZERTIFIKAT ── */}
            <div style={{
              textAlign: 'center',
              padding: '24px 24px 20px',
              borderBottom: '1px solid #e5e7eb',
            }}>
              <div style={{
                fontSize: '46px',
                fontWeight: '900',
                letterSpacing: '0.55em',
                color: '#c41230',
                textTransform: 'uppercase',
                fontFamily: 'Georgia, serif',
                lineHeight: 1,
                paddingLeft: '0.55em', // optische Zentrierung bei letter-spacing
              }}>
                ZERTIFIKAT
              </div>
            </div>

            {/* ── Untertitel + Name ── */}
            <div style={{ textAlign: 'center', padding: '24px 48px 12px' }}>
              <p style={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
                Dieses Zertifikat bestätigt den Fortschritt im Bereich<br />
                <strong style={{ color: '#1f2937' }}>M.I. Streetdefense</strong> von:
              </p>
              <div style={{
                borderBottom: '1.5px solid #374151',
                margin: '18px 32px 6px',
                paddingBottom: '6px',
              }}>
                <span style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  color: '#111827',
                  letterSpacing: '0.02em',
                  fontFamily: 'Georgia, serif',
                }}>
                  {currentUser.name}
                </span>
              </div>
            </div>

            {/* ── Zitat ── */}
            <div style={{ textAlign: 'center', padding: '10px 56px 20px' }}>
              <p style={{
                fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                fontSize: '17px',
                color: '#374151',
                lineHeight: 1.8,
                fontStyle: 'italic',
                margin: 0,
              }}>
                „Erzähle es mir und ich werde es vergessen.<br />
                Zeige es mir und ich werde es behalten.<br />
                Lass es mich tun und ich werde es können."
              </p>
            </div>

            {/* ── Trennlinie ── */}
            <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '0 24px' }} />

            {/* ── Hauptbereich: Foto + Siegel | Modul-Tabelle ── */}
            <div style={{
              display: 'flex',
              gap: '24px',
              padding: '24px 28px',
              alignItems: 'flex-start',
            }}>
              {/* Foto + Siegel */}
              <div style={{
                flexShrink: 0,
                width: '88px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{
                  width: '80px',
                  height: '100px',
                  border: '1.5px solid #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f9fafb',
                  borderRadius: '2px',
                }}>
                  <span style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center', lineHeight: 1.5 }}>Foto</span>
                </div>
                <div style={{
                  width: '62px',
                  height: '62px',
                  borderRadius: '50%',
                  backgroundColor: '#b91c1c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(153,27,27,0.45), inset 0 1px 3px rgba(255,255,255,0.12)',
                }}>
                  <img
                    src="/logos/mi-icon.jpg"
                    alt="MI"
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'contain', opacity: 0.9 }}
                    onError={e => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      const p = el.parentElement;
                      if (p) p.innerHTML = '<span style="color:white;font-size:22px;font-weight:900;font-family:Georgia,serif">M</span>';
                    }}
                  />
                </div>
              </div>

              {/* Modul-Tabelle */}
              <div style={{ flex: 1 }}>
                {/* Spalten-Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '56px 1fr 56px',
                  marginBottom: '6px',
                }}>
                  <div style={{ textAlign: 'center', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b7280' }}>Tactics</div>
                  <div style={{ textAlign: 'center', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#374151' }}>Modul</div>
                  <div style={{ textAlign: 'center', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b7280' }}>Combat</div>
                </div>

                <div style={{ height: '2px', backgroundColor: '#1f2937' }} />

                {CURRICULUM_MODULES.map((mod, idx) => {
                  const tDone = isTacticsDone(mod.id);
                  const cDone = isCombatDone(mod.id);
                  return (
                    <div
                      key={mod.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '56px 1fr 56px',
                        alignItems: 'center',
                        padding: '7px 0',
                        borderBottom: idx < CURRICULUM_MODULES.length - 1 ? '1px solid #f3f4f6' : 'none',
                      }}
                    >
                      {/* Tactics */}
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                          width: '20px', height: '20px',
                          borderRadius: '50%',
                          backgroundColor: tDone ? '#1f2937' : 'transparent',
                          border: `1.5px solid ${tDone ? '#1f2937' : '#d1d5db'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {tDone && <span style={{ color: 'white', fontSize: '10px', fontWeight: '900', lineHeight: 1 }}>✓</span>}
                        </div>
                      </div>

                      {/* Modul-Name */}
                      <div style={{ textAlign: 'center', padding: '0 8px' }}>
                        <span style={{ fontSize: '9px', color: '#9ca3af', fontFamily: 'monospace', marginRight: '5px' }}>
                          {toRoman(idx + 1)}
                        </span>
                        <span style={{ fontSize: '10.5px', fontWeight: '600', color: '#1f2937' }}>
                          {mod.name}
                        </span>
                      </div>

                      {/* Combat */}
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                          width: '20px', height: '20px',
                          borderRadius: '50%',
                          backgroundColor: cDone ? '#c41230' : 'transparent',
                          border: `1.5px solid ${cDone ? '#c41230' : '#d1d5db'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {cDone && <span style={{ color: 'white', fontSize: '10px', fontWeight: '900', lineHeight: 1 }}>✓</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div style={{ height: '2px', backgroundColor: '#1f2937' }} />

                {/* Legende */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '8px', color: '#9ca3af' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1f2937' }} />
                    Tactics bestanden
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '8px', color: '#9ca3af' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#c41230' }} />
                    Combat bestanden
                  </div>
                </div>

                {currentUser.stopTheBleedCertified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
                    <img
                      src="/logos/stop-the-bleed.png"
                      alt="Stop The Bleed"
                      style={{ height: '18px', objectFit: 'contain' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <span style={{ fontSize: '8.5px', fontWeight: '600', color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Stop The Bleed® Certified
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* ── Unterschriften ── */}
            <div style={{ borderTop: '1px solid #e5e7eb', padding: '20px 36px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                {[
                  { label: 'Ort, Datum', value: today },
                  { label: 'Trainer', value: '' },
                  { label: 'Prüfer', value: '' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{
                      borderBottom: '1px solid #9ca3af',
                      paddingBottom: '4px',
                      minHeight: '28px',
                      fontSize: '11px',
                      color: '#4b5563',
                      fontFamily: 'Georgia, serif',
                    }}>
                      {value}
                    </div>
                    <div style={{
                      fontSize: '8px',
                      color: '#9ca3af',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      marginTop: '5px',
                    }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Footer ── */}
            <div style={{
              textAlign: 'center',
              padding: '8px 24px 14px',
              fontSize: '7.5px',
              color: '#9ca3af',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              borderTop: '1px solid #f3f4f6',
            }}>
              Martial Instinct Köln · JKD · Eskrima · Selbstverteidigung
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificateView;
