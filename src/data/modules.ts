// ============================================
// MARTIAL INSTINCT - MODULE & TECHNIQUE DATA
// ============================================

import { Module, Block, Technique, ModuleLevel } from '../types';

// Helper function to create techniques
const createTechnique = (
  id: string,
  name: string,
  moduleId: string,
  level: ModuleLevel,
  order: number,
  isRequired: boolean = true,
  description: string = ''
): Technique => ({
  id,
  name,
  description: description || `Technik: ${name}`,
  moduleId,
  level,
  isRequired,
  order
});

// ============================================
// CONFLICT READY - BEGINNER (Module 1-4)
// ============================================

const module1: Module = {
  id: 'mod-1',
  number: 1,
  name: 'M.I.ssion begins!',
  subtitle: 'Grundlagen',
  level: 'conflict',
  description: 'Richtige Stellung, Ready-Position, Grundbewegungen, Distanzgefühl, Fitness, Mobility',
  icon: '🎯',
  requiredTechniquesPercent: 80,
  techniques: [
    createTechnique('t-1-1', 'Richtige Stellung', 'mod-1', 'conflict', 1, true, 'Die fundamentale Kampfstellung'),
    createTechnique('t-1-2', 'Ready-Position', 'mod-1', 'conflict', 2, true, 'Deeskalations- und Alarmbereitschaftshaltung'),
    createTechnique('t-1-3', 'Grundbewegungen', 'mod-1', 'conflict', 3, true, 'Sichere Fortbewegung in alle Richtungen'),
    createTechnique('t-1-4', 'Distanzgefühl', 'mod-1', 'conflict', 4, true, 'Gefühl für Raum und Reichweite'),
    createTechnique('t-1-5', 'Fitness', 'mod-1', 'conflict', 5, true, 'Kampfkunstspezifische Kondition'),
    createTechnique('t-1-6', 'Mobility', 'mod-1', 'conflict', 6, true, 'Stretching, Dehnen, Stabilität')
  ]
};

const module2: Module = {
  id: 'mod-2',
  number: 2,
  name: 'Be ready!',
  subtitle: 'Mindset & Prävention',
  level: 'conflict',
  description: 'Trainingsroutine, Durchhalten, Mentale Stabilität, Druckannahme, Entscheidungsfähigkeit',
  icon: '🧠',
  requiredTechniquesPercent: 80,
  techniques: [
    createTechnique('t-2-1', 'Trainingsroutine aufbauen', 'mod-2', 'conflict', 1, true),
    createTechnique('t-2-2', 'Durchhalten', 'mod-2', 'conflict', 2, true),
    createTechnique('t-2-3', 'Mentale Stabilität', 'mod-2', 'conflict', 3, true),
    createTechnique('t-2-4', 'Druckannahme', 'mod-2', 'conflict', 4, true),
    createTechnique('t-2-5', 'Entscheidungsfähigkeit', 'mod-2', 'conflict', 5, true),
    createTechnique('t-2-6', 'Handlungsfähig bleiben', 'mod-2', 'conflict', 6, true),
    createTechnique('t-2-7', 'Mentale Auseinandersetzung mit Konflikten', 'mod-2', 'conflict', 7, true)
  ]
};

const module3: Module = {
  id: 'mod-3',
  number: 3,
  name: 'P.O.N.R.',
  subtitle: 'Point of No Return',
  level: 'conflict',
  description: 'Rote Linie definieren, Initiative übernehmen, Timing',
  icon: '⚡',
  requiredTechniquesPercent: 80,
  techniques: [
    createTechnique('t-3-1', 'Rote Linie definieren', 'mod-3', 'conflict', 1, true),
    createTechnique('t-3-2', 'Initiative übernehmen', 'mod-3', 'conflict', 2, true),
    createTechnique('t-3-3', 'Nicht zu spät reagieren', 'mod-3', 'conflict', 3, true),
    createTechnique('t-3-4', 'Dem Gegner zuvor kommen', 'mod-3', 'conflict', 4, true)
  ]
};

const module4: Module = {
  id: 'mod-4',
  number: 4,
  name: 'R.C.A.T.',
  subtitle: 'Redirect, Control, Attack, Takeaway',
  level: 'conflict',
  description: 'Angriff stoppen, Kontrolle herstellen, Kontern, Beenden',
  icon: '🛡️',
  requiredTechniquesPercent: 80,
  techniques: [
    createTechnique('t-4-1', 'Angriff stoppen', 'mod-4', 'conflict', 1, true),
    createTechnique('t-4-2', 'Kontrolle herstellen', 'mod-4', 'conflict', 2, true),
    createTechnique('t-4-3', 'Kontern', 'mod-4', 'conflict', 3, true),
    createTechnique('t-4-4', 'Beenden', 'mod-4', 'conflict', 4, true)
  ]
};

// ============================================
// COMBAT READY - ADVANCED (Module 5-7, 8 Advanced)
// ============================================

const module5: Module = {
  id: 'mod-5',
  number: 5,
  name: 'Backup Insurance I',
  subtitle: 'Stand',
  level: 'combat',
  description: 'Längerer Konflikt im Stand, Schlag- & Konterstruktur, Stabilität unter Druck',
  icon: '🥊',
  requiredTechniquesPercent: 80,
  techniques: [
    createTechnique('t-5-1', 'Längerer Konflikt im Stand', 'mod-5', 'combat', 1, true),
    createTechnique('t-5-2', 'Schlag- & Konterstruktur', 'mod-5', 'combat', 2, true),
    createTechnique('t-5-3', 'Stabil bleiben unter Druck', 'mod-5', 'combat', 3, true)
  ]
};

const module6: Module = {
  id: 'mod-6',
  number: 6,
  name: 'Backup Insurance II',
  subtitle: 'Ground',
  level: 'combat',
  description: 'Fallen & Aufstehen, Bodensituationen überleben, Positionswechsel',
  icon: '🤼',
  requiredTechniquesPercent: 80,
  techniques: [
    createTechnique('t-6-1', 'Fallen & Aufstehen', 'mod-6', 'combat', 1, true),
    createTechnique('t-6-2', 'Bodensituationen überleben', 'mod-6', 'combat', 2, true),
    createTechnique('t-6-3', 'Tritte abwehren', 'mod-6', 'combat', 3, true),
    createTechnique('t-6-4', 'Positionswechsel', 'mod-6', 'combat', 4, true),
    createTechnique('t-6-5', 'Schnell zurück in die Vertikale', 'mod-6', 'combat', 5, true)
  ]
};

const module7: Module = {
  id: 'mod-7',
  number: 7,
  name: 'Backup Insurance III',
  subtitle: 'Infight',
  level: 'combat',
  description: 'Clinch, Trapping, Würge-/Greifbefreiungen, Strukturdominanz',
  icon: '🤝',
  requiredTechniquesPercent: 80,
  techniques: [
    createTechnique('t-7-1', 'Clinch', 'mod-7', 'combat', 1, true),
    createTechnique('t-7-2', 'Trapping', 'mod-7', 'combat', 2, true),
    createTechnique('t-7-3', 'Würge-/Greifbefreiungen', 'mod-7', 'combat', 3, true),
    createTechnique('t-7-4', 'Strukturdominanz in Nahdistanz', 'mod-7', 'combat', 4, true)
  ]
};


// ============================================
// TACTICAL READY - SPECIALIST (Module 9-10)
// ============================================

const module9: Module = {
  id: 'mod-9',
  number: 8,
  name: 'Weapons I',
  subtitle: 'Non-Lethal & Improvised Weapons',
  level: 'combat',
  description: 'Non-Lethal & Improvised Weapons',
  icon: '🗡️',
  requiredTechniquesPercent: 80,
  techniques: [
    createTechnique('t-9-1', 'Messerverteidigung', 'mod-9', 'combat', 1, true),
    createTechnique('t-9-2', 'Hiebwaffen', 'mod-9', 'combat', 2, true),
    createTechnique('t-9-3', 'Winkelarbeit', 'mod-9', 'combat', 3, true),
    createTechnique('t-9-4', 'Distanzmanagement', 'mod-9', 'combat', 4, true),
    createTechnique('t-9-5', 'Technische Verteidigungsprinzipien', 'mod-9', 'combat', 5, true)
  ]
};

const module10: Module = {
  id: 'mod-10',
  number: 9,
  name: 'Tactics & Survival',
  subtitle: 'Kombination & Überleben',
  level: 'tactical',
  description: 'Szenarien, Kombination aller Module, Entscheidungsdruck, Stop the Bleed',
  icon: '🎖️',
  requiredTechniquesPercent: 80,
  techniques: [
    createTechnique('t-10-1', 'Szenarien', 'mod-10', 'tactical', 1, true),
    createTechnique('t-10-2', 'Kombination aller Module', 'mod-10', 'tactical', 2, true),
    createTechnique('t-10-3', 'Entscheidungsdruck', 'mod-10', 'tactical', 3, true),
    createTechnique('t-10-4', 'Stop the Bleed', 'mod-10', 'tactical', 4, true),
    createTechnique('t-10-5', 'Verhalten nach Gewalt', 'mod-10', 'tactical', 5, true),
    createTechnique('t-10-6', 'Verschiedene Umgebungen', 'mod-10', 'tactical', 6, true),
    createTechnique('t-10-7', 'Sich ändernde Lichtverhältnisse', 'mod-10', 'tactical', 7, true)
  ]
};

// ============================================
// CONTACT READY - WEAPONS II (Module 10)
// ============================================

const moduleWeapons2: Module = {
  id: 'mod-weapons-2',
  number: 10,
  name: 'Weapons II',
  subtitle: 'Letale Waffen & Bewaffneter Kampf',
  level: 'contact',
  description: 'Messer-Offense, bewaffneter Nahkampf, Waffen entwinden',
  icon: '🔪',
  requiredTechniquesPercent: 80,
  techniques: [
    createTechnique('t-w2-1', 'Messer-Offense', 'mod-weapons-2', 'contact', 1, true),
    createTechnique('t-w2-2', 'Bewaffneter Nahkampf', 'mod-weapons-2', 'contact', 2, true),
    createTechnique('t-w2-3', 'Waffe entwinden', 'mod-weapons-2', 'contact', 3, true),
    createTechnique('t-w2-4', 'Kombinierte Waffen-Szenarien', 'mod-weapons-2', 'contact', 4, true),
    createTechnique('t-w2-5', 'Waffen unter Druck', 'mod-weapons-2', 'contact', 5, true),
  ]
};

// ============================================
// CONTACT READY - OPERATOR (Module 11-13)
// ============================================

const module11: Module = {
  id: 'mod-11',
  number: 11,
  name: 'Operator Mindset',
  subtitle: 'Professionelle Mentalität',
  level: 'contact',
  description: 'Teamfähigkeit, Schutz Dritter, Einsatzrollenverständnis',
  icon: '💀',
  requiredTechniquesPercent: 80,
  techniques: [
    createTechnique('t-11-1', 'Teamwork', 'mod-11', 'contact', 1, true),
    createTechnique('t-11-2', 'Schutz Dritter', 'mod-11', 'contact', 2, true),
    createTechnique('t-11-3', 'Hochstress-Performance', 'mod-11', 'contact', 3, true)
  ]
};

const module12: Module = {
  id: 'mod-12',
  number: 12,
  name: 'Tactical Operations',
  subtitle: 'Operative Fähigkeiten',
  level: 'contact',
  description: 'Fortgeschrittene taktische Szenarien',
  icon: '🎯',
  requiredTechniquesPercent: 80,
  techniques: [
    createTechnique('t-12-1', 'Raumkontrolle', 'mod-12', 'contact', 1, true),
    createTechnique('t-12-2', 'Fahrzeug-Szenarien', 'mod-12', 'contact', 2, true),
    createTechnique('t-12-3', 'Low-Light Operations', 'mod-12', 'contact', 3, true)
  ]
};

const module13: Module = {
  id: 'mod-13',
  number: 13,
  name: 'Advanced Combatives',
  subtitle: 'Fortgeschrittener Kampf',
  level: 'contact',
  description: 'Höchste Kampffertigkeiten für den Einsatz',
  icon: '⚔️',
  requiredTechniquesPercent: 80,
  techniques: [
    createTechnique('t-13-1', 'Force Continuum', 'mod-13', 'contact', 1, true),
    createTechnique('t-13-2', 'Restraint Techniques', 'mod-13', 'contact', 2, true),
    createTechnique('t-13-3', 'Multiple Opponents', 'mod-13', 'contact', 3, true)
  ]
};

// ============================================
// ALL MODULES
// ============================================

export const MODULES: Module[] = [
  module1,
  module2,
  module3,
  module4,
  module5,
  module6,
  module7,
  module9,
  module10,
  moduleWeapons2,
  module11,
  module12,
  module13
];

// ============================================
// BLOCKS
// ============================================

export const BLOCKS: Block[] = [
  {
    id: 'conflict',
    name: 'CONFLICT READY',
    subtitle: 'Beginner',
    level: 'conflict',
    color: 'text-gray-400',
    bgColor: 'bg-gray-800/50',
    borderColor: 'border-gray-600',
    icon: '⚪',
    moduleIds: ['mod-1', 'mod-2', 'mod-3', 'mod-4'],
    requiresApplication: false
  },
  {
    id: 'combat',
    name: 'COMBAT READY',
    subtitle: 'Advanced',
    level: 'combat',
    color: 'text-gray-100',
    bgColor: 'bg-gray-900/80',
    borderColor: 'border-gray-500',
    icon: '⚫',
    moduleIds: ['mod-5', 'mod-6', 'mod-7', 'mod-9'],
    requiresApplication: false
  },
  {
    id: 'tactical',
    name: 'CONTACT READY I',
    subtitle: 'Specialist',
    level: 'tactical',
    color: 'text-red-500',
    bgColor: 'bg-gray-800/60',
    borderColor: 'border-red-900/60',
    icon: '🔴',
    moduleIds: ['mod-10'],
    requiresApplication: false
  },
  {
    id: 'contact',
    name: 'CONTACT READY II',
    subtitle: 'Operator',
    level: 'contact',
    color: 'text-red-400',
    bgColor: 'bg-gray-900/80',
    borderColor: 'border-red-800/50',
    icon: '☠️',
    moduleIds: ['mod-11', 'mod-12', 'mod-13'],
    requiresApplication: true,
    adminOnly: true,
  },
  {
    id: 'assistant_instructor',
    name: 'ASSISTANT INSTRUCTOR',
    subtitle: 'Ausbilder',
    level: 'assistant_instructor',
    color: 'text-yellow-400',
    bgColor: 'bg-gradient-to-r from-yellow-900/20 to-amber-900/20',
    borderColor: 'border-yellow-700',
    icon: '🎓',
    moduleIds: [],
    requiresApplication: true
  }
];

// Helper to get all techniques
export const getAllTechniques = (): Technique[] => {
  return MODULES.flatMap(m => m.techniques);
};

// Helper to get module by ID
export const getModuleById = (id: string): Module | undefined => {
  return MODULES.find(m => m.id === id);
};

// Helper to get block by level
export const getBlockByLevel = (level: ModuleLevel): Block | undefined => {
  return BLOCKS.find(b => b.level === level);
};

// Helper to get modules for a block
export const getModulesForBlock = (blockId: string): Module[] => {
  const block = BLOCKS.find(b => b.id === blockId);
  if (!block) return [];
  return MODULES.filter(m => block.moduleIds.includes(m.id));
};
