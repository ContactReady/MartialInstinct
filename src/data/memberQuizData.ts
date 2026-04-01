// ============================================
// MEMBER QUIZ-FRAGEN — Wissen aus den 10 Modulen
// Jeder Fragenpool pro Modul: mindestens 15 Fragen
// Quiz-Engine wählt immer 10 zufällig aus (mit Wiederholung)
// ============================================

import { QuizQuestion } from '../types';

// ============================================
// MODUL 1 — Mission Begins
// 65 Fragen — 5 Typen:
// 15 × truefalse | 20 × single | 10 × multiple | 8 × matching | 12 × fillblank
// Inhalte: Gesetzliche Grundlagen, 7 Verhaltensrichtlinien,
//          Stellungen, Eingänge, Distanzmanagement, Grundtechniken
// ============================================
export const mod1Questions: QuizQuestion[] = [

  // ── RICHTIG / FALSCH (15) ──────────────────────────────────────────────────

  {
    id: 'm1tf1',
    type: 'truefalse',
    question: '§ 32 StGB (Notwehr) gilt nur bei Angriffen von Menschen.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 0,
    explanation: '§ 32 StGB und § 227 BGB gelten nur für menschliche Angriffe. Für Angriffe von Tieren oder Gefahren von Sachen gilt § 228 BGB.'
  },
  {
    id: 'm1tf2',
    type: 'truefalse',
    question: 'Putativnotwehr bedeutet, der Täter handelt absichtlich außerhalb der Notwehr.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 1,
    explanation: 'Falsch. Putativnotwehr ist eine irrtümliche Notwehr — der Täter glaubt fälschlicherweise, dass die Voraussetzungen der Notwehr vorliegen.'
  },
  {
    id: 'm1tf3',
    type: 'truefalse',
    question: '§ 33 StGB schützt den Täter, der die Notwehr aus Furcht oder Schrecken überschreitet, vor Bestrafung.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 0,
    explanation: '§ 33 StGB: Überschreitung der Notwehr aus Verwirrung, Furcht oder Schrecken → keine Bestrafung.'
  },
  {
    id: 'm1tf4',
    type: 'truefalse',
    question: 'Der Versuch einer einfachen Körperverletzung (§ 223 StGB) ist nicht strafbar.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 1,
    explanation: 'Falsch. § 223 Abs. 2 StGB besagt ausdrücklich: "Der Versuch ist strafbar."'
  },
  {
    id: 'm1tf5',
    type: 'truefalse',
    question: '"Einsatzbereit" bedeutet zwei bis drei Bewegungen bis zum Einsatz der Waffe.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 1,
    explanation: 'Falsch. "Einsatzbereit" = eine Bewegung bis zum effektiven Einsatz. "Griffbereit" = zwei bis drei Bewegungen.'
  },
  {
    id: 'm1tf6',
    type: 'truefalse',
    question: 'Die Ready Position ist die Kampfstellung, die bei tatsächlichem Kontakt eingenommen wird.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 1,
    explanation: 'Falsch. Die Ready Position ist für potenzielle Konfliktsituationen. Bei tatsächlichem Kontakt wechselt man in die Contact Ready Position.'
  },
  {
    id: 'm1tf7',
    type: 'truefalse',
    question: 'Laut Verhaltensrichtlinie 6 soll man nach einem Treffer sofort aufhören zu kämpfen.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 1,
    explanation: 'Falsch. Richtlinie 6: Wenn du getroffen wirst, machst du weiter — kämpfen, reagieren oder flüchten. Der Gegner macht auch weiter.'
  },
  {
    id: 'm1tf8',
    type: 'truefalse',
    question: '§ 228 BGB gilt für Angriffe von Tieren oder ausgehende Gefahren von Sachen.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 0,
    explanation: '§ 228 BGB (nicht § 32 StGB) regelt die Notwehr bei Tierangriffen oder Gefahren von Sachen.'
  },
  {
    id: 'm1tf9',
    type: 'truefalse',
    question: 'Beim Slide-Step wird zuerst der hintere Fuß bewegt.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 1,
    explanation: 'Falsch. Beim Slide-Step wird zuerst der VORDERE Fuß aus der Gefahrenzone bewegt (Slide), dann folgt der hintere (Step).'
  },
  {
    id: 'm1tf10',
    type: 'truefalse',
    question: 'Der Switch-Auslagenwechsel ist schneller und explosiver als der Schritt.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 0,
    explanation: 'Richtig. Switch = beide Füße nahezu gleichzeitig, schnell und explosiv. Schritt = nacheinander, kontrollierter.'
  },
  {
    id: 'm1tf11',
    type: 'truefalse',
    question: 'Verhaltensrichtlinie 7 sagt: Nach einem Konflikt davon ausgehen, dass alles in Ordnung ist.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 1,
    explanation: 'Falsch. Genau das Gegenteil: NICHT davon ausgehen, dass alles okay ist. Körper aktiv abtasten, auf Blut achten, Stop the Bleed wenn nötig.'
  },
  {
    id: 'm1tf12',
    type: 'truefalse',
    question: 'Der Push ist die kontrollierteste und langsamste Grundbewegung.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 1,
    explanation: 'Falsch. Der Push ist die EXPLOSIVSTE Bewegung — für schnelle Distanzveränderung. Step & Slide ist die kontrollierteste.'
  },
  {
    id: 'm1tf13',
    type: 'truefalse',
    question: 'Wer bei einem Unglücksfall keine Hilfe leistet, kann nach § 323c StGB bestraft werden.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 0,
    explanation: '§ 323c StGB: Unterlassene Hilfeleistung wird mit bis zu einem Jahr Freiheitsstrafe oder Geldstrafe bestraft — wenn Hilfe möglich und zumutbar war.'
  },
  {
    id: 'm1tf14',
    type: 'truefalse',
    question: 'Strong-Side-Forward bedeutet, die schwache Seite ist vorne für bessere Reichweite.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 1,
    explanation: 'Falsch. Strong-Side-Forward = starke (dominante) Seite ist vorne. Kürzerer Weg zum Ziel = schnellere Aktion.'
  },
  {
    id: 'm1tf15',
    type: 'truefalse',
    question: '§ 34 StGB rechtfertigt eine Handlung im Notstand nur, wenn das geschützte Rechtsgut wesentlich höherwertig ist als der entstandene Schaden.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 0,
    explanation: '§ 34 StGB (Rechtfertigender Notstand): Das geschützte Gut muss wesentlich höherwertig sein als der Schaden — sonst keine Rechtfertigung.'
  },

  // ── SINGLE CHOICE (20) ────────────────────────────────────────────────────

  {
    id: 'm1sc1',
    type: 'single',
    question: 'Welcher Paragraph regelt die schwere Körperverletzung mit dauerhaften Folgen?',
    options: ['§ 223 StGB', '§ 224 StGB', '§ 226 StGB', '§ 323c StGB'],
    correctIndex: 2,
    explanation: '§ 226 StGB regelt die schwere Körperverletzung — mit Folgen wie Verlust von Sehvermögen, Gehör, Körperteilen oder dauerhafter Entstellung.'
  },
  {
    id: 'm1sc2',
    type: 'single',
    question: 'Was ist die Mindeststrafe bei § 224 StGB (gefährliche Körperverletzung)?',
    options: ['Geldstrafe', 'Sechs Monate Freiheitsstrafe', 'Ein Jahr Freiheitsstrafe', 'Drei Jahre Freiheitsstrafe'],
    correctIndex: 1,
    explanation: '§ 224 StGB: Freiheitsstrafe von sechs Monaten bis zu zehn Jahren.'
  },
  {
    id: 'm1sc3',
    type: 'single',
    question: 'Welche Stellung wird eingenommen, sobald Kontakt entsteht?',
    options: ['Neutrale Position', 'Ready Position', 'Contact Ready Position', 'Strong-Side-Forward'],
    correctIndex: 2,
    explanation: 'Kernregel: Sobald Kontakt entsteht → Contact Ready. Diese Position ist auf Stabilität, Agilität und sofortige Handlungsfähigkeit ausgelegt.'
  },
  {
    id: 'm1sc4',
    type: 'single',
    question: 'Was bedeutet "griffbereit" bei einer Waffe?',
    options: ['Eine Bewegung bis zum Einsatz', 'Zwei bis drei Bewegungen bis zum Einsatz', 'Die Waffe ist bereits gezogen', 'Die Waffe ist gesichert'],
    correctIndex: 1,
    explanation: 'Griffbereit = 2–3 Bewegungen bis zum effektiven Einsatz. Einsatzbereit = eine Bewegung.'
  },
  {
    id: 'm1sc5',
    type: 'single',
    question: 'Welche Verhaltensrichtlinie betont: "Der beste Kampf ist der, der nicht stattfindet"?',
    options: ['Richtlinie 1', 'Richtlinie 2', 'Richtlinie 3', 'Richtlinie 4'],
    correctIndex: 1,
    explanation: 'Verhaltensrichtlinie 2: Vermeide Konfliktsituationen. Meide Orte mit hohem Konfliktpotenzial, erkenne Gefahren frühzeitig, handle deeskalierend.'
  },
  {
    id: 'm1sc6',
    type: 'single',
    question: 'Welche Vorbereitungsebene umfasst den Umgang mit Tools wie Pfefferspray und Tactical Pen?',
    options: ['Physisch', 'Mental', 'Emotional', 'Taktisch'],
    correctIndex: 3,
    explanation: 'Die taktische Ebene umfasst den Umgang mit Tools: Pfefferspray, Tactical Pen, Messer, Stock. Handlung beginnt vor dem Konflikt.'
  },
  {
    id: 'm1sc7',
    type: 'single',
    question: 'Was ist der Hauptvorteil von Strong-Side-Forward?',
    options: ['Bessere Balance im Sparring', 'Kürzerer Weg zum Ziel für schnellere Aktionen', 'Schwächere Hand schützt den Körper', 'Bessere Optik beim Training'],
    correctIndex: 1,
    explanation: 'Wenn die starke Hand vorne ist, ist der Weg zum Ziel kürzer — schnellere Aktion, mehr Überraschungseffekt, universell einsetzbar mit Tool oder Hand.'
  },
  {
    id: 'm1sc8',
    type: 'single',
    question: 'Was trainiert Mirror Drill 1?',
    options: ['Distanz zum Partner halten', 'Schritte vom Partner kopieren', 'Angriffe imitieren', 'Tempowechsel üben'],
    correctIndex: 1,
    explanation: 'Mirror Drill 1: Schritte vom Partner kopieren. Mirror Drill 2: Distanz zum Partner halten.'
  },
  {
    id: 'm1sc9',
    type: 'single',
    question: 'Welcher Auslagenwechsel wird als schnell und explosiv beschrieben?',
    options: ['Vorderer Wechsel', 'Hinterer Wechsel', 'Switch', 'Schritt'],
    correctIndex: 2,
    explanation: 'Switch = beide Füße nahezu gleichzeitig → schnell und explosiv. Schritt = kontrolliert, nacheinander.'
  },
  {
    id: 'm1sc10',
    type: 'single',
    question: 'Was ist die Strafe bei § 226 StGB, wenn die schwere Körperverletzung mit Absicht begangen wurde?',
    options: ['Mindestens 6 Monate', 'Mindestens 1 Jahr', 'Mindestens 3 Jahre', 'Mindestens 5 Jahre'],
    correctIndex: 2,
    explanation: '§ 226 Abs. 2 StGB: Bei Absicht mindestens 3 Jahre Freiheitsstrafe.'
  },
  {
    id: 'm1sc11',
    type: 'single',
    question: 'Was passiert beim Vorderen Auslagenwechsel zuerst?',
    options: ['Der hintere Fuß bewegt sich', 'Beide Füße gleichzeitig', 'Der vordere Fuß leitet den Wechsel ein', 'Der Körperschwerpunkt sinkt'],
    correctIndex: 2,
    explanation: 'Beim vorderen Wechsel bewegt sich der vordere Fuß zuerst und leitet den Wechsel ein. Danach wird der hintere Fuß passend nachgeführt.'
  },
  {
    id: 'm1sc12',
    type: 'single',
    question: 'Wofür ist der Push als Grundbewegung gedacht?',
    options: ['Kontrolle in engen Situationen', 'Explosive, schnelle Distanzveränderung', 'Sicherer Rückzug', 'Balance beim Angriff'],
    correctIndex: 1,
    explanation: 'Der Push kommt immer dann zum Einsatz, wenn Zeit ein kritischer Faktor ist — du willst sofort reagieren, nicht "gehen". Geschwindigkeit + Energie.'
  },
  {
    id: 'm1sc13',
    type: 'single',
    question: 'Welcher Paragraph schützt bei Überschreitung der Notwehr aus Verwirrung oder Schrecken?',
    options: ['§ 32 StGB', '§ 33 StGB', '§ 34 StGB', '§ 228 BGB'],
    correctIndex: 1,
    explanation: '§ 33 StGB: Wer die Notwehr aus Verwirrung, Furcht oder Schrecken überschreitet, wird nicht bestraft.'
  },
  {
    id: 'm1sc14',
    type: 'single',
    question: 'Was unterscheidet die Ready Position von der Contact Ready Position taktisch?',
    options: ['Contact Ready ist defensiver', 'Ready für potenzielle Konflikte, Contact Ready für tatsächlichen Kontakt', 'Beide sind gleich — nur optisch verschieden', 'Ready wird nur im Sparring verwendet'],
    correctIndex: 1,
    explanation: 'Ready = vorbereitet ohne Aggression zu signalisieren. Contact Ready = für tatsächlichen oder unmittelbar bevorstehenden Kontakt — auf Stabilität und Agilität ausgelegt.'
  },
  {
    id: 'm1sc15',
    type: 'single',
    question: 'Was beschreibt der defensive Eingang?',
    options: ['Schritt nach vorne', 'Schritt + Angriff', 'Schritt zurück', 'Seitlicher Schritt'],
    correctIndex: 2,
    explanation: 'Der defensive Eingang ist ein Schritt zurück — Übergang in Contact Ready durch Rückwärtsbewegung, um Distanz zu schaffen.'
  },
  {
    id: 'm1sc16',
    type: 'single',
    question: 'Was ist das unveränderliche Grundprinzip beim Slide-Step?',
    options: [
      'Der vordere Fuß bewegt sich immer zuerst',
      'Der hintere Fuß bewegt sich immer zuerst',
      'Die Gleitbewegung kommt immer vor dem Schritt',
      'Beide Füße bewegen sich gleichzeitig'
    ],
    correctIndex: 2,
    explanation: 'Das Grundprinzip: Slide (Gleiten) kommt immer vor Step (Schritt). Welcher Fuß gleitet, hängt von der Bewegungsrichtung ab — vorwärts: hinterer Fuß, rückwärts: vorderer Fuß.'
  },
  {
    id: 'm1sc17',
    type: 'single',
    question: 'Was fordert Verhaltensrichtlinie 5?',
    options: [
      'Verletzungen durch Distanz aktiv vermeiden',
      'Psychologische Vorbereitung darauf, verletzt zu werden',
      'Immer zuerst fliehen, wenn Gefahr besteht',
      'Keine Waffe einsetzen, wenn man getroffen wird'
    ],
    correctIndex: 1,
    explanation: 'Richtlinie 5: Du musst damit rechnen, getroffen zu werden — mentale Vorbereitung, Training unter Druck, mit Schmerz umgehen, Stresssituationen erleben.'
  },
  {
    id: 'm1sc18',
    type: 'single',
    question: 'Welcher Paragraph definiert "unterlassene Hilfeleistung"?',
    options: ['§ 223 StGB', '§ 226 StGB', '§ 34 StGB', '§ 323c StGB'],
    correctIndex: 3,
    explanation: '§ 323c StGB: Wer bei Unglücksfällen oder Gefahr keine Hilfe leistet, obwohl möglich und zumutbar, wird mit Freiheitsstrafe bis zu einem Jahr oder Geldstrafe bestraft.'
  },
  {
    id: 'm1sc19',
    type: 'single',
    question: 'Was passiert beim Hinteren Auslagenwechsel zuerst?',
    options: ['Der vordere Fuß bewegt sich', 'Beide Füße gleichzeitig', 'Der hintere Fuß leitet den Wechsel ein', 'Der Körperschwerpunkt sinkt'],
    correctIndex: 2,
    explanation: 'Beim Hinteren Wechsel bewegt sich der hintere Fuß zuerst und leitet den Wechsel ein. Danach folgt der vordere Fuß in die neue Position.'
  },
  {
    id: 'm1sc20',
    type: 'single',
    question: 'Welche Aussage über den Schritt-Auslagenwechsel ist FALSCH?',
    options: [
      'Der Wechsel erfolgt nacheinander',
      'Die Bewegung ist kontrollierter als der Switch',
      'Es ist der explosivste Auslagenwechsel',
      'Ein Fuß geht am anderen vorbei nach vorne'
    ],
    correctIndex: 2,
    explanation: 'Der Switch ist explosiver, nicht der Schritt. Der Schritt ist kontrolliert und nacheinander — der hintere Fuß geht am vorderen vorbei nach vorne.'
  },

  // ── MULTIPLE CHOICE (10) ──────────────────────────────────────────────────

  {
    id: 'm1mc1',
    type: 'multiple',
    question: 'Welche Paragraphen regeln Notwehr direkt? (Mehrere möglich)',
    options: ['§ 32 StGB', '§ 33 StGB', '§ 227 BGB', '§ 228 BGB'],
    correctIndices: [0, 2],
    explanation: '§ 32 StGB und § 227 BGB regeln Notwehr gegen menschliche Angriffe. § 33 ist Notwehrüberschreitung, § 228 BGB gilt für Tiere/Sachen.'
  },
  {
    id: 'm1mc2',
    type: 'multiple',
    question: 'Welche Vorbereitungsebenen nennt Verhaltensrichtlinie 1? (Mehrere möglich)',
    options: ['Physisch', 'Mental', 'Emotional', 'Taktisch'],
    correctIndices: [0, 1, 2, 3],
    explanation: 'Alle vier Ebenen sind korrekt: Physisch (Training), Mental (Routine), Emotional (Stresstraining), Taktisch (Tools). Vorbereitung beginnt vor dem Konflikt.'
  },
  {
    id: 'm1mc3',
    type: 'multiple',
    question: 'Welche Voraussetzungen müssen für eine Strafbarkeit erfüllt sein? (Mehrere möglich)',
    options: ['Tatbestand', 'Absicht', 'Rechtswidrigkeit', 'Schuld'],
    correctIndices: [0, 2, 3],
    explanation: 'Tatbestand, Rechtswidrigkeit und Schuld müssen alle drei erfüllt sein. "Absicht" ist keine eigenständige Grundvoraussetzung der Strafbarkeit.'
  },
  {
    id: 'm1mc4',
    type: 'multiple',
    question: 'Welche Merkmale können § 224 StGB (gefährliche Körperverletzung) erfüllen? (Mehrere möglich)',
    options: ['Mittels einer Waffe', 'Durch Gift oder Stoffe', 'Gemeinschaftlich mit anderen', 'Nur bei Verlust eines Körperteils'],
    correctIndices: [0, 1, 2],
    explanation: '§ 224 listet 5 Merkmale: Gift/Stoffe, Waffe/Werkzeug, hinterlistiger Überfall, gemeinschaftlich, lebensgefährdend. Verlust von Körperteilen ist § 226.'
  },
  {
    id: 'm1mc5',
    type: 'multiple',
    question: 'Was verändert sich in der Contact Ready Position gegenüber der Ready Position? (Mehrere möglich)',
    options: ['Tieferer Körperschwerpunkt', 'Hände höher und kampfbereiter', 'Füße klar versetzt', 'Entspanntere Körperhaltung'],
    correctIndices: [0, 1, 2],
    explanation: 'In Contact Ready sinkt der Schwerpunkt tiefer, Hände sind höher/kampfbereiter, Füße klarer versetzt — alles auf tatsächlichen Konflikt ausgelegt.'
  },
  {
    id: 'm1mc6',
    type: 'multiple',
    question: 'Welche Auslagenwechsel gibt es im M.I. System? (Mehrere möglich)',
    options: ['Vorderer Wechsel', 'Hinterer Wechsel', 'Switch', 'Schritt'],
    correctIndices: [0, 1, 2, 3],
    explanation: 'Alle vier sind korrekt: Vorderer Wechsel, Hinterer Wechsel, Switch und Schritt. Jeder hat eigene Einsatzsituationen.'
  },
  {
    id: 'm1mc7',
    type: 'multiple',
    question: 'Was fordert Verhaltensrichtlinie 7 nach einem Konflikt? (Mehrere möglich)',
    options: ['Körper aktiv abtasten', 'Auf Blut achten', 'Sofort davon ausgehen, dass alles okay ist', 'Stop the Bleed anwenden wenn nötig'],
    correctIndices: [0, 1, 3],
    explanation: 'Richtlinie 7: Körper abtasten, auf Blut achten, Stop the Bleed wenn nötig. Schmerz kann verzögert auftreten — NICHT davon ausgehen, dass alles okay ist.'
  },
  {
    id: 'm1mc8',
    type: 'multiple',
    question: 'Welche der folgenden sind Schrittkombinationen im Distanzmanagement? (Mehrere möglich)',
    options: ['Step & Slide', 'Slide-Step', 'Push', 'Switch'],
    correctIndices: [0, 1, 2],
    explanation: 'Step & Slide, Slide-Step und Push sind die drei Schrittkombinationen. Switch ist ein Auslagenwechsel, keine Schrittkombination.'
  },
  {
    id: 'm1mc9',
    type: 'multiple',
    question: 'Welche Grundtechniken gehören zu den Hand-/Armtechniken? (Mehrere möglich)',
    options: ['Jab', 'Stoppkick vorne', 'Ellenbogen', 'Uppercut'],
    correctIndices: [0, 2, 3],
    explanation: 'Jab, Ellenbogen und Uppercut sind Hand-/Armtechniken. Stoppkick vorne ist ein Kick.'
  },
  {
    id: 'm1mc10',
    type: 'multiple',
    question: 'Welche Folgen können zu § 226 StGB (schwere Körperverletzung) führen? (Mehrere möglich)',
    options: ['Verlust des Sehvermögens', 'Verlust des Gehörs', 'Dauerhafte Entstellung', 'Kleine Schnittwunde ohne Dauerfolge'],
    correctIndices: [0, 1, 2],
    explanation: '§ 226 gilt bei dauerhaften schweren Folgen: Verlust von Sehvermögen, Gehör, Sprache, Körperteilen oder dauerhafter Entstellung. Kleine Wunden ohne Dauerfolge nicht.'
  },

  // ── MATCHING (8) ─────────────────────────────────────────────────────────

  {
    id: 'm1ma1',
    type: 'matching',
    question: 'Ordne die Paragraphen ihren Themen zu:',
    pairs: [
      { left: '§ 32 StGB', right: 'Notwehr (menschliche Angriffe)' },
      { left: '§ 34 StGB', right: 'Rechtfertigender Notstand' },
      { left: '§ 224 StGB', right: 'Gefährliche Körperverletzung' },
      { left: '§ 323c StGB', right: 'Unterlassene Hilfeleistung' },
    ],
    explanation: '§ 32 = Notwehr, § 34 = Notstand, § 224 = Gefährliche KV, § 323c = Unterlassene Hilfeleistung.'
  },
  {
    id: 'm1ma2',
    type: 'matching',
    question: 'Ordne die Positionen ihrer Bedeutung zu:',
    pairs: [
      { left: 'Neutrale Position', right: 'Alltag' },
      { left: 'Ready Position', right: 'Potenzieller Konflikt' },
      { left: 'Contact Ready', right: 'Tatsächlicher Kontakt' },
      { left: 'Strong-Side-Forward', right: 'Starke Seite vorne' },
    ],
    explanation: 'Neutral → Alltag, Ready → potenzieller Konflikt, Contact Ready → tatsächlicher Kontakt, Strong-Side-Forward → starke Seite vorne.'
  },
  {
    id: 'm1ma3',
    type: 'matching',
    question: 'Ordne Verhaltensrichtlinien 1–4 ihrem Kern zu:',
    pairs: [
      { left: 'Richtlinie 1', right: 'Sei vorbereitet' },
      { left: 'Richtlinie 2', right: 'Vermeide Konflikte' },
      { left: 'Richtlinie 3', right: 'Waffe einsatzbereit' },
      { left: 'Richtlinie 4', right: 'Kontrolliere die Distanz' },
    ],
    explanation: 'R1 = Vorbereitung, R2 = Konfliktvermeidung, R3 = Waffe einsatzbereit, R4 = Distanzkontrolle.'
  },
  {
    id: 'm1ma4',
    type: 'matching',
    question: 'Ordne Verhaltensrichtlinien 5–7 und Putativnotwehr zu:',
    pairs: [
      { left: 'Richtlinie 5', right: 'Rechne mit Verletzungen' },
      { left: 'Richtlinie 6', right: 'Nach Treffer: mach weiter' },
      { left: 'Richtlinie 7', right: 'Körper danach prüfen' },
      { left: 'Putativnotwehr', right: 'Irrtümliche Notwehrannahme' },
    ],
    explanation: 'R5 = mentale Vorbereitung auf Verletzungen, R6 = Weiterkämpfen, R7 = Körper nach Konflikt prüfen, Putativnotwehr = Irrtum über Notwehrlage.'
  },
  {
    id: 'm1ma5',
    type: 'matching',
    question: 'Ordne die Auslagenwechsel ihrer Beschreibung zu:',
    pairs: [
      { left: 'Vorderer Wechsel', right: 'Vorderer Fuß leitet ein' },
      { left: 'Hinterer Wechsel', right: 'Hinterer Fuß leitet ein' },
      { left: 'Switch', right: 'Beide Füße gleichzeitig' },
      { left: 'Schritt', right: 'Kontrolliert, nacheinander' },
    ],
    explanation: 'Jeder Wechsel hat eine klar definierte Einleitungsbewegung. Switch ist am explosivsten, Schritt am kontrolliertesten.'
  },
  {
    id: 'm1ma6',
    type: 'matching',
    question: 'Ordne die Grundbewegungen ihrer Eigenschaft zu:',
    pairs: [
      { left: 'Step & Slide', right: 'Kontrolliert und stabil' },
      { left: 'Slide-Step', right: 'Schnell und reaktiv' },
      { left: 'Push', right: 'Explosiv, maximale Energie' },
      { left: 'Mirror Drill 2', right: 'Distanz zum Partner halten' },
    ],
    explanation: 'Step & Slide = kontrolliert, Slide-Step = reaktiv (ideal für Defense), Push = explosiv, Mirror Drill 2 = Distanzkontrolle.'
  },
  {
    id: 'm1ma7',
    type: 'matching',
    question: 'Ordne Paragraphen ihrem Strafmaß zu:',
    pairs: [
      { left: '§ 223 StGB', right: 'Bis zu 5 Jahre' },
      { left: '§ 224 StGB', right: '6 Monate bis 10 Jahre' },
      { left: '§ 226 StGB', right: '1 bis 10 Jahre' },
      { left: '§ 323c StGB', right: 'Bis zu 1 Jahr / Geldstrafe' },
    ],
    explanation: '§ 223 = bis 5J, § 224 = 6M–10J, § 226 = 1–10J (bei Absicht: min. 3J), § 323c = bis 1J oder Geldstrafe.'
  },
  {
    id: 'm1ma8',
    type: 'matching',
    question: 'Ordne die Vorbereitungsebenen ihrem Inhalt zu:',
    pairs: [
      { left: 'Physisch', right: 'Kraft- und Selbstverteidigungstraining' },
      { left: 'Mental', right: 'Routine und regelmäßiges Training' },
      { left: 'Emotional', right: 'Sparring und Stresstraining' },
      { left: 'Taktisch', right: 'Umgang mit Tools wie Pfefferspray' },
    ],
    explanation: 'Die 4 Ebenen aus Richtlinie 1: Physisch, Mental, Emotional, Taktisch. Alle vier gemeinsam bilden echte Vorbereitung.'
  },

  // ── LÜCKENTEXT / FILL-IN-BLANK (12) ─────────────────────────────────────

  {
    id: 'm1fb1',
    type: 'fillblank',
    question: '§ 32 StGB Notwehr gilt nur gegen ___ Angriffe.',
    options: ['menschliche', 'tierische', 'zufällige', 'staatliche'],
    correctIndex: 0,
    explanation: '§ 32 StGB schützt nur vor menschlichen Angriffen. Für Tiere oder Sachen gilt § 228 BGB.'
  },
  {
    id: 'm1fb2',
    type: 'fillblank',
    question: '§ 33 StGB schützt die Notwehrüberschreitung aus Verwirrung, Furcht oder ___.',
    options: ['Schrecken', 'Wut', 'Absicht', 'Irrtum'],
    correctIndex: 0,
    explanation: '§ 33 StGB nennt drei Zustände: Verwirrung, Furcht, Schrecken — bei diesen wird die Überschreitung nicht bestraft.'
  },
  {
    id: 'm1fb3',
    type: 'fillblank',
    question: '"Einsatzbereit" bedeutet ___ Bewegung bis zum Einsatz der Waffe.',
    options: ['eine', 'zwei', 'drei', 'keine'],
    correctIndex: 0,
    explanation: 'Einsatzbereit = eine Bewegung. Griffbereit = zwei bis drei Bewegungen. Das Ziel: sofort handlungsfähig sein.'
  },
  {
    id: 'm1fb4',
    type: 'fillblank',
    question: 'Wer die Distanz kontrolliert, kontrolliert das ___.',
    options: ['Geschehen', 'Ergebnis', 'Training', 'Gegenüber'],
    correctIndex: 0,
    explanation: 'Verhaltensrichtlinie 4: Du bestimmst die Distanz — nicht dein Gegner. Wer die Distanz kontrolliert, kontrolliert das Geschehen.'
  },
  {
    id: 'm1fb5',
    type: 'fillblank',
    question: 'Der beste Kampf ist der, der nicht ___.',
    options: ['stattfindet', 'gewonnen wird', 'verloren wird', 'endet'],
    correctIndex: 0,
    explanation: 'Verhaltensrichtlinie 2: Vermeide Konfliktsituationen — der beste Kampf ist der, der gar nicht erst stattfindet.'
  },
  {
    id: 'm1fb6',
    type: 'fillblank',
    question: 'Beim Slide-Step kommt die ___ -Bewegung immer zuerst, dann der Schritt.',
    options: ['Gleit', 'Tritt', 'Sprung', 'Stopp'],
    correctIndex: 0,
    explanation: 'Das Grundprinzip Slide-Step: Die Gleitbewegung (Slide) geht immer dem Schritt voraus. Welcher Fuß gleitet, hängt von der Bewegungsrichtung ab.'
  },
  {
    id: 'm1fb7',
    type: 'fillblank',
    question: '"Griffbereit" bedeutet ___ bis drei Bewegungen bis zum effektiven Einsatz.',
    options: ['zwei', 'eine', 'vier', 'keine'],
    correctIndex: 0,
    explanation: 'Griffbereit = 2–3 Bewegungen. Einsatzbereit = 1 Bewegung. Ziel ist immer: so wenige Bewegungen wie möglich.'
  },
  {
    id: 'm1fb8',
    type: 'fillblank',
    question: '§ 226 Abs. 2 StGB: Bei Absicht gilt eine Mindeststrafe von ___ Jahren.',
    options: ['drei', 'einem', 'fünf', 'zehn'],
    correctIndex: 0,
    explanation: '§ 226 Abs. 2: Schwere Körperverletzung mit Absicht → mindestens 3 Jahre Freiheitsstrafe.'
  },
  {
    id: 'm1fb9',
    type: 'fillblank',
    question: 'Die Handlung beginnt ___ dem Konflikt — nicht im Konflikt.',
    options: ['vor', 'nach', 'während', 'trotz'],
    correctIndex: 0,
    explanation: 'Verhaltensrichtlinie 1: Vorbereitung erfolgt vor dem Konflikt. Handlung beginnt vor dem Konflikt — nicht erst wenn er da ist.'
  },
  {
    id: 'm1fb10',
    type: 'fillblank',
    question: '§ 228 BGB gilt für Angriffe von ___ oder ausgehende Gefahren von Sachen.',
    options: ['Tieren', 'Gruppen', 'Minderjährigen', 'Werkzeugen'],
    correctIndex: 0,
    explanation: '§ 228 BGB regelt die Notwehr gegen Tiere und Gefahren von Sachen — im Gegensatz zu § 32 StGB, der nur menschliche Angriffe erfasst.'
  },
  {
    id: 'm1fb11',
    type: 'fillblank',
    question: 'Mirror Drill ___ trainiert das Halten der Distanz zum Partner.',
    options: ['2', '1', '3', '4'],
    correctIndex: 0,
    explanation: 'Mirror Drill 1 = Schritte kopieren. Mirror Drill 2 = Distanz zum Partner halten. Beide Drills schulen Distanzgefühl und Reaktion.'
  },
  {
    id: 'm1fb12',
    type: 'fillblank',
    question: 'Strong-Side-Forward: Die ___ Seite ist vorne.',
    options: ['starke', 'schwache', 'linke', 'rechte'],
    correctIndex: 0,
    explanation: 'Strong-Side-Forward = starke (dominante) Seite vorne. Kürzerer Weg zum Ziel, universell einsetzbar mit Hand und Tool.'
  },

  // ── ERWEITERUNG: TECHNIKEN & KICKS (35 neue Fragen) ──────────────────────

  // ── RICHTIG / FALSCH — Techniken (8 neu) ─────────────────────────────────

  {
    id: 'm1tf16',
    type: 'truefalse',
    question: 'Der Fingerstich zielt primär auf das Auge, um den Gegner zu schocken und zu stoppen.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 0,
    explanation: 'Richtig. Ziel des Fingerstichs ist das Auge. Der Schockeffekt stoppt den Angriff ohne maximale Kraft — ideal als erster Angriff auf Distanz.'
  },
  {
    id: 'm1tf17',
    type: 'truefalse',
    question: 'Der Nackenzug dient hauptsächlich dazu, dem Gegner Schmerz zuzufügen.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 1,
    explanation: 'Falsch. Der Nackenzug dient primär der Kontrolle — er schränkt die Bewegung des Gegners ein und ermöglicht es, Kopf und Körper zu steuern.'
  },
  {
    id: 'm1tf18',
    type: 'truefalse',
    question: 'Knie und Ellbogen sind auf engstem Raum besonders effektiv, weil sie kurze Wege haben.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 0,
    explanation: 'Richtig. Im Infight haben Knie und Ellbogen kurze Hebelwege — sie entfalten auf engstem Raum maximale Wirkung ohne Ausholbewegung.'
  },
  {
    id: 'm1tf19',
    type: 'truefalse',
    question: 'Die Kettenfaust ist eine Einzeltechnik, die mit voller Kraft eingesetzt wird.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 1,
    explanation: 'Falsch. Die Kettenfaust ist eine Infight-Technik mit hoher Schlagfrequenz — viele schnelle Schläge in Serie, nicht ein einzelner Kraftschlag.'
  },
  {
    id: 'm1tf20',
    type: 'truefalse',
    question: 'Der Stoppkick setzt Bewegung des Gegners voraus — er stoppt den eingehenden Angriff.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 0,
    explanation: 'Richtig. Der Stoppkick trifft den Gegner im Moment seiner Vorwärtsbewegung. Er nutzt die kinetische Energie des Angreifers gegen ihn.'
  },
  {
    id: 'm1tf21',
    type: 'truefalse',
    question: 'Der Fingerstich kann ohne Nahkampferfahrung aus größerer Entfernung präzise auf das Auge treffen.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 1,
    explanation: 'Falsch. Präzision erfordert Training. Auf Distanz ist Präzision schwerer — der Fingerstich ist am effektivsten im nahen Kontaktbereich.'
  },
  {
    id: 'm1tf22',
    type: 'truefalse',
    question: 'Der Nackenzug kann den Kopf des Gegners nach unten ziehen, um Knie- oder Ellbogentechniken vorzubereiten.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 0,
    explanation: 'Richtig. Eine klassische Kombination: Nackenzug → Kopf nach unten → Knie hoch. Der Nackenzug steuert die Körperposition des Gegners.'
  },
  {
    id: 'm1tf23',
    type: 'truefalse',
    question: 'Beim Stoppkick ist das Timing unwichtig — er wirkt auch, wenn der Gegner stillsteht.',
    options: ['Richtig', 'Falsch'],
    correctIndex: 1,
    explanation: 'Falsch. Der Stoppkick lebt vom Timing. Er stoppt Bewegung — wenn der Gegner steht, fehlt die Energie, die den Kick wirksam macht.'
  },

  // ── SINGLE CHOICE — Techniken (12 neu) ───────────────────────────────────

  {
    id: 'm1sc21',
    type: 'single',
    question: 'Warum ist der Fingerstich als erster Angriff besonders wertvoll?',
    options: [
      'Er ist die stärkste aller Techniken',
      'Er schockt den Gegner und schafft Reaktionszeit',
      'Er erfordert keine Körperspannung',
      'Er ist nur gegen Untrainierte wirksam'
    ],
    correctIndex: 1,
    explanation: 'Der Fingerstich zum Auge erzeugt einen Schockmoment — reflexartige Reaktion des Gegners schafft wertvolle Zeit für weitere Aktionen oder Flucht.'
  },
  {
    id: 'm1sc22',
    type: 'single',
    question: 'Welche Körperregion wird beim Nackenzug kontrolliert?',
    options: ['Schulter', 'Nacken und Hinterkopf', 'Hüfte', 'Handgelenk'],
    correctIndex: 1,
    explanation: 'Der Nackenzug greift Nacken und Hinterkopf — von dort lässt sich der Kopf und damit der gesamte Körper des Gegners steuern.'
  },
  {
    id: 'm1sc23',
    type: 'single',
    question: 'Wann sind Knie und Ellbogen als Waffe besonders sinnvoll?',
    options: [
      'Auf weite Distanz',
      'Im engen Kontaktbereich (Clinch)',
      'Wenn man ausweichen möchte',
      'Nur auf dem Boden'
    ],
    correctIndex: 1,
    explanation: 'Im Clinch und auf engem Raum können Fäuste und Tritte nicht mehr voll entfaltet werden — hier sind Knie und Ellbogen mit kurzen Wegen ideal.'
  },
  {
    id: 'm1sc24',
    type: 'single',
    question: 'Was charakterisiert die Kettenfaust im Infight?',
    options: [
      'Ein einzelner, maximal kraftvoller Schlag',
      'Hohe Schlagfrequenz mit vielen schnellen Schlägen',
      'Schläge mit gestrecktem Arm auf weite Distanz',
      'Defensive Abwehrtechnik'
    ],
    correctIndex: 1,
    explanation: 'Kettenfaust = hohe Frequenz. Nicht ein starker Schlag, sondern eine Serie schneller Schläge — der Gegner kann nicht reagieren, weil die Schläge sich kettenartig aneinanderreihen.'
  },
  {
    id: 'm1sc25',
    type: 'single',
    question: 'In welchem Moment ist der Stoppkick am wirksamsten?',
    options: [
      'Wenn der Gegner stillsteht',
      'Wenn der Gegner sich vorwärts bewegt und angreift',
      'Wenn der Gegner sich zurückzieht',
      'Auf dem Boden liegend'
    ],
    correctIndex: 1,
    explanation: 'Der Stoppkick trifft den Gegner in seiner Vorwärtsbewegung — die eigene Kinetik des Angreifers verdoppelt die Kraftwirkung des Kicks.'
  },
  {
    id: 'm1sc26',
    type: 'single',
    question: 'Was ist die primäre Wirkung des Fingerstichs auf den Gegner?',
    options: [
      'Maximale Verletzung verursachen',
      'Den Gegner zu Boden bringen',
      'Schockreaktion auslösen und Zeit schaffen',
      'Die Distanz vergrößern'
    ],
    correctIndex: 2,
    explanation: 'Der Fingerstich zielt auf das Auge — erzeugt eine unwillkürliche Schutzreaktion und Schock. Das schafft Zeit für weitere Aktionen oder Rückzug.'
  },
  {
    id: 'm1sc27',
    type: 'single',
    question: 'Welche Kombination ist mit dem Nackenzug besonders effektiv?',
    options: [
      'Nackenzug → Schritt zurück → warten',
      'Nackenzug → Kopf nach unten → Knie hoch',
      'Nackenzug → Armhebel → Boden',
      'Nackenzug → Seitwärtsschritt → Wegrennen'
    ],
    correctIndex: 1,
    explanation: 'Klassische Kombo: Nackenzug zieht den Kopf nach unten, das Knie trifft auf den gesenkten Kopf/Rumpf. Kurze, explosive Kombination im engen Raum.'
  },
  {
    id: 'm1sc28',
    type: 'single',
    question: 'Warum ist der Ellbogen dem Faustschlag im Infight oft überlegen?',
    options: [
      'Er ist schmerzloser für den Anwender',
      'Er hat kürzere Wege und braucht weniger Ausholraum',
      'Er ist nur gegen den Kopf einsetzbar',
      'Er braucht keine Körperspannung'
    ],
    correctIndex: 1,
    explanation: 'Ellbogen haben kürzere Wege als Fäuste — auf engstem Raum kann kein Punch vollständig ausgeführt werden. Der Ellbogen trifft auch ohne Ausholbewegung mit voller Wirkung.'
  },
  {
    id: 'm1sc29',
    type: 'single',
    question: 'Was unterscheidet die Kettenfaust von einem klassischen Schlagabtausch?',
    options: [
      'Sie ist langsamer und präziser',
      'Sie setzt auf Einzelschläge mit maximaler Kraft',
      'Sie überwältigt durch hohe Frequenz, nicht durch Einzelkraft',
      'Sie ist nur für Fortgeschrittene geeignet'
    ],
    correctIndex: 2,
    explanation: 'Kettenfaust = Mentalität der Überwältigung durch Masse und Tempo, nicht durch einen einzelnen Knockout-Schlag. Der Gegner wird von der Frequenz überrollt.'
  },
  {
    id: 'm1sc30',
    type: 'single',
    question: 'Auf welcher Distanz funktioniert der Fingerstich am besten?',
    options: [
      'Lange Distanz (mehr als 2 Meter)',
      'Mittlere bis nahe Distanz',
      'Nur auf dem Boden',
      'Ausschließlich im Clinch'
    ],
    correctIndex: 1,
    explanation: 'Der Fingerstich braucht Reichweite, aber keine extreme Distanz — mittlere bis nahe Distanz, wo der ausgestreckte Arm das Auge tatsächlich erreicht.'
  },
  {
    id: 'm1sc31',
    type: 'single',
    question: 'Welcher Begriff beschreibt am besten die Funktion des Nackenzugs?',
    options: [
      'Angriffstechnik',
      'Kontroll- und Lenktechnik',
      'Würgetechnik',
      'Blocktechnik'
    ],
    correctIndex: 1,
    explanation: 'Der Nackenzug ist eine Kontroll- und Lenktechnik — er schränkt die Bewegungsfreiheit ein und erlaubt es, die Position und Richtung des Gegners zu bestimmen.'
  },
  {
    id: 'm1sc32',
    type: 'single',
    question: 'Was macht den Stoppkick zur defensiven Angriffstechnik?',
    options: [
      'Er wird nach dem Angriff eingesetzt',
      'Er stoppt den eingehenden Angriff und greift gleichzeitig an',
      'Er ist eine rein defensive Blockbewegung',
      'Er wird nur tief eingesetzt'
    ],
    correctIndex: 1,
    explanation: 'Der Stoppkick ist defensiv-offensiv: Er stoppt den Angriff des Gegners und greift gleichzeitig an. Defense und Offense in einem Moment.'
  },

  // ── MULTIPLE CHOICE — Techniken (5 neu) ──────────────────────────────────

  {
    id: 'm1mc11',
    type: 'multiple',
    question: 'Welche Aussagen zum Fingerstich sind korrekt? (Mehrere möglich)',
    options: [
      'Das Ziel ist das Auge des Gegners',
      'Er verursacht maximale dauerhafte Verletzungen',
      'Er löst eine Schockreaktion aus',
      'Er ist besonders wirksam auf mittlere bis nahe Distanz',
      'Er erfordert keine Genauigkeit'
    ],
    correctIndices: [0, 2, 3],
    explanation: 'Fingerstich: Ziel ist das Auge, Wirkung ist Schock (nicht primär Verletzung), effektiv auf mittlerer bis naher Distanz. Genauigkeit ist wichtig, aber nicht perfekt nötig.'
  },
  {
    id: 'm1mc12',
    type: 'multiple',
    question: 'Was trifft auf Knie und Ellbogen als Techniken zu? (Mehrere möglich)',
    options: [
      'Effektiv auf langer Distanz',
      'Kurze Hebelwege, daher ideal im engen Raum',
      'Harte Körperstellen, erzeugen viel Wirkung',
      'Werden nur defensiv eingesetzt',
      'Ideal im Clinch-Bereich'
    ],
    correctIndices: [1, 2, 4],
    explanation: 'Knie und Ellbogen sind harte Körperstellen mit kurzen Wegen — ideal auf engem Raum und im Clinch. Auf langer Distanz können sie ihre Kraft nicht entfalten.'
  },
  {
    id: 'm1mc13',
    type: 'multiple',
    question: 'Welche Eigenschaften beschreiben die Kettenfaust? (Mehrere möglich)',
    options: [
      'Hohe Schlagfrequenz',
      'Ein einziger maximaler Schlag',
      'Infight-Technik auf engem Raum',
      'Überwältigt durch Masse und Tempo',
      'Erfordert viel Ausholraum'
    ],
    correctIndices: [0, 2, 3],
    explanation: 'Kettenfaust: hohe Frequenz, Infight-Technik, Überwältigung durch viele schnelle Schläge — kein einzelner Kraftschlag, kein langer Ausholweg.'
  },
  {
    id: 'm1mc14',
    type: 'multiple',
    question: 'Was sind Funktionen des Nackenzugs? (Mehrere möglich)',
    options: [
      'Gegner kontrollieren',
      'Bewegungsfreiheit des Gegners einschränken',
      'Maximalen Schmerz erzeugen',
      'Kopf/Körper des Gegners steuern',
      'Distanz vergrößern'
    ],
    correctIndices: [0, 1, 3],
    explanation: 'Nackenzug: Kontrolle, Bewegungseinschränkung, Steuerung des Gegners. Schmerz ist ein Nebeneffekt, nicht das primäre Ziel. Distanz wird eher verringert.'
  },
  {
    id: 'm1mc15',
    type: 'multiple',
    question: 'Welche Bedingungen machen den Stoppkick wirkungsvoller? (Mehrere möglich)',
    options: [
      'Gegner bewegt sich vorwärts (auf dich zu)',
      'Gegner steht still',
      'Richtiges Timing im Moment des Angriffs',
      'Eigene Rückwärtsbewegung beim Kick',
      'Ziel ist die Mitte des Körpers (z.B. Oberschenkel, Hüfte)'
    ],
    correctIndices: [0, 2, 4],
    explanation: 'Stoppkick: maximale Wirkung wenn der Gegner sich nähert (Impuls), mit richtigem Timing, auf Körpermitte. Der Gegner trägt seine eigene Energie in den Kick hinein.'
  },

  // ── MATCHING — Techniken (4 neu) ─────────────────────────────────────────

  {
    id: 'm1ma9',
    type: 'matching',
    question: 'Ordne die Techniken ihrer Hauptwirkung zu:',
    pairs: [
      { left: 'Fingerstich', right: 'Schockreaktion / Auge' },
      { left: 'Nackenzug', right: 'Kontrolle & Steuerung' },
      { left: 'Kettenfaust', right: 'Hohe Frequenz / Infight' },
      { left: 'Stoppkick', right: 'Eingehenden Angriff stoppen' },
    ],
    explanation: 'Jede Technik hat ein klares Primärziel: Fingerstich → Schock, Nackenzug → Kontrolle, Kettenfaust → Frequenz, Stoppkick → Momentum stoppen.'
  },
  {
    id: 'm1ma10',
    type: 'matching',
    question: 'Ordne die Technik der optimalen Distanz/Situation zu:',
    pairs: [
      { left: 'Ellbogen', right: 'Enger Kontaktbereich' },
      { left: 'Fingerstich', right: 'Mittlere bis nahe Distanz' },
      { left: 'Stoppkick', right: 'Gegner in Vorwärtsbewegung' },
      { left: 'Kettenfaust', right: 'Clinch / enges Infight' },
    ],
    explanation: 'Jede Technik hat ihre optimale Einsatzsituation. Ellbogen & Kettenfaust = enger Raum, Fingerstich = nahe Distanz, Stoppkick = Bewegungsmoment des Gegners.'
  },
  {
    id: 'm1ma11',
    type: 'matching',
    question: 'Ordne Grundbewegungstyp seiner Haupteigenschaft zu:',
    pairs: [
      { left: 'Step & Slide', right: 'Kontrollierteste Bewegung' },
      { left: 'Push', right: 'Explosivste Bewegung' },
      { left: 'Slide-Step', right: 'Gleit kommt vor Schritt' },
      { left: 'Step', right: 'Einfachste Grundbewegung' },
    ],
    explanation: 'Step & Slide = kontrolliert, Push = explosiv, Slide-Step = Gleitprinzip zuerst, Step = Basis. Jede Bewegung hat ihren taktischen Einsatzbereich.'
  },
  {
    id: 'm1ma12',
    type: 'matching',
    question: 'Ordne die Stellung ihrer Beschreibung zu:',
    pairs: [
      { left: 'Neutral Position', right: 'Unauffällig, Alltagshaltung' },
      { left: 'Ready Position', right: 'Potenzielle Konfliktsituation' },
      { left: 'Contact Ready', right: 'Unmittelbarer Kontakt' },
      { left: 'Strong-Side-Forward', right: 'Starke Seite vorne' },
    ],
    explanation: 'Drei Ebenen der Bereitschaft: Neutral (Alltag) → Ready (Vorsicht) → Contact Ready (Kampf). Strong-Side-Forward = dominante Seite in Angriffsposition.'
  },

  // ── FILL-IN-BLANK — Techniken (6 neu) ────────────────────────────────────

  {
    id: 'm1fb13',
    type: 'fillblank',
    question: 'Der Fingerstich zielt primär auf das ___ des Gegners.',
    options: ['Auge', 'Kinn', 'Ohr', 'Hals'],
    correctIndex: 0,
    explanation: 'Das Ziel des Fingerstichs ist das Auge — ein Treffer erzeugt sofortige Schutzreaktion und Schock, unabhängig von der Körpergröße des Gegners.'
  },
  {
    id: 'm1fb14',
    type: 'fillblank',
    question: 'Der Nackenzug dient primär der ___ des Gegners.',
    options: ['Kontrolle', 'Verletzung', 'Fixierung', 'Distanzierung'],
    correctIndex: 0,
    explanation: 'Kontrolle ist das Ziel des Nackenzugs — durch Kontrolle des Kopfes wird der gesamte Körper steuerbar. Verletzung ist ein Nebeneffekt, kein Ziel.'
  },
  {
    id: 'm1fb15',
    type: 'fillblank',
    question: 'Die Kettenfaust überwältigt nicht durch Kraft, sondern durch ___.',
    options: ['Frequenz', 'Reichweite', 'Gewicht', 'Geschwindigkeit des Einzelschlags'],
    correctIndex: 0,
    explanation: 'Frequenz ist der Schlüssel der Kettenfaust — viele schnelle Schläge überlasten die Verteidigung des Gegners. Nicht ein harter Schlag, sondern ein Hagel.'
  },
  {
    id: 'm1fb16',
    type: 'fillblank',
    question: 'Der Stoppkick ist dann am stärksten, wenn der Gegner sich ___ bewegt.',
    options: ['vorwärts', 'rückwärts', 'seitwärts', 'nicht'],
    correctIndex: 0,
    explanation: 'Vorwärtsbewegung des Gegners verdoppelt die Wirkung des Stoppkicks. Seine kinetische Energie trifft auf den Kick — enormer Kraftzuwachs.'
  },
  {
    id: 'm1fb17',
    type: 'fillblank',
    question: 'Knie und Ellbogen sind besonders effektiv auf ___ Raum.',
    options: ['engem', 'weitem', 'mittlerem', 'offenem'],
    correctIndex: 0,
    explanation: 'Auf engem Raum können Fäuste und Tritte ihre Kraft nicht voll entfalten — Knie und Ellbogen haben kurze Wege und brauchen keinen Ausholraum.'
  },
  {
    id: 'm1fb18',
    type: 'fillblank',
    question: 'Verhaltensrichtlinie 1 lautet: Vermeidet ___ Situationen.',
    options: ['Konfliktsituationen', 'alle sozialen', 'Trainings-', 'Reaktions-'],
    correctIndex: 0,
    explanation: 'Verhaltensrichtlinie 1: Vermeide Konfliktsituationen. Der beste Kampf findet gar nicht statt. Deeskalation ist immer der erste Schritt.'
  },
];

// ============================================
// MODUL 2 — Mindset & Readiness
// ============================================
export const mod2Questions: QuizQuestion[] = [
  {
    id: 'm2q1',
    question: 'Was ist der erste Schritt zur Trainingsroutine?',
    options: ['Sofort intensiv trainieren', 'Feste Trainingszeiten definieren und einhalten', 'Erst alle Techniken lernen', 'Auf Motivation warten'],
    correctIndex: 1,
    explanation: 'Feste Zeiten schaffen Routine — Routine schlägt Motivation, denn Motivation ist unzuverlässig, Gewohnheit nicht.'
  },
  {
    id: 'm2q2',
    question: 'Was bedeutet "mentale Stabilität" im Kampfkontext?',
    options: ['Keine Angst zu haben', 'Handlungsfähig zu bleiben auch unter extremem Stress', 'Niemals aufzugeben', 'Immer ruhig zu wirken'],
    correctIndex: 1,
    explanation: 'Mentale Stabilität bedeutet handlungsfähig zu bleiben — Angst ist normal und nützlich, entscheidend ist ob du trotzdem reagieren kannst.'
  },
  {
    id: 'm2q3',
    question: 'Was ist "Druckannahme" im M.I. Training?',
    options: ['Das Akzeptieren von Kritik', 'Die Fähigkeit, unter Druck ruhig und handlungsfähig zu bleiben', 'Das Trainieren unter Zeitdruck', 'Psychologische Belastbarkeit am Arbeitsplatz'],
    correctIndex: 1,
    explanation: 'Druckannahme ist die trainierte Fähigkeit, auch in Hochstress-Situationen klare Entscheidungen zu treffen und zu handeln.'
  },
  {
    id: 'm2q4',
    question: 'Warum ist Durchhalten im Training so wichtig?',
    options: ['Um anderen zu imponieren', 'Weil Können durch Wiederholung entsteht, nicht durch Talent', 'Weil der Instructor es erwartet', 'Für bessere Noten'],
    correctIndex: 1,
    explanation: 'Können entsteht durch Wiederholung — Techniken werden erst unter Druck abrufbar, wenn sie tausende Male geübt wurden.'
  },
  {
    id: 'm2q5',
    question: 'Was versteht man unter "Entscheidungsfähigkeit" im Konflikt?',
    options: ['Immer die beste Option wählen', 'Schnell eine Entscheidung treffen auch wenn die Information unvollständig ist', 'Lange abwägen bevor man handelt', 'Den Gegner beobachten bis eine Lücke entsteht'],
    correctIndex: 1,
    explanation: 'In einem echten Konflikt hast du keine Zeit für lange Analysen — Entscheidungsfähigkeit heißt: schnell handeln auch mit unvollständiger Information.'
  },
  {
    id: 'm2q6',
    question: 'Was ist der Unterschied zwischen Mut und Rücksichtslosigkeit?',
    options: ['Kein Unterschied', 'Mut ist kalkuliertes Handeln trotz Angst, Rücksichtslosigkeit ignoriert Risiken', 'Mut ist ohne Angst zu handeln', 'Rücksichtslosigkeit ist effektiver'],
    correctIndex: 1,
    explanation: 'Mut bedeutet trotz Angst zu handeln und dabei Risiken einzukalkulieren. Rücksichtslosigkeit ignoriert Risiken — das ist gefährlich, nicht effektiv.'
  },
  {
    id: 'm2q7',
    question: 'Wie geht man mit "mentaler Auseinandersetzung mit Konflikten" um?',
    options: ['Konflikte gedanklich vermeiden', 'Szenarien mental durchspielen um vorbereitet zu sein', 'Nur im Training denken, nicht im Alltag', 'Konflikte als unmöglich betrachten'],
    correctIndex: 1,
    explanation: 'Mentale Auseinandersetzung bedeutet: Szenarien im Kopf durchspielen, um im Ernstfall nicht von der Situation überrascht zu werden.'
  },
  {
    id: 'm2q8',
    question: 'Was ist "Handlungsfähig bleiben" im M.I. Kontext?',
    options: ['Immer kämpfen können', 'In jeder Situation — auch nach einem Treffer — weiter agieren können', 'Keine Verletzungen zu erleiden', 'Schneller als der Gegner sein'],
    correctIndex: 1,
    explanation: 'Handlungsfähig bleiben heißt: auch nach einem Treffer, auch in Panik, auch verletzt — weiter denken und agieren können.'
  },
  {
    id: 'm2q9',
    question: 'Warum trainiert M.I. Stress-Inokulierung?',
    options: ['Für Wettkampfvorbereitung', 'Um den Körper an Stress zu gewöhnen damit er im Ernstfall nicht überfordert ist', 'Für medizinische Forschung', 'Um Schüler zu testen'],
    correctIndex: 1,
    explanation: 'Stress-Inokulierung (Training unter Druck) gewöhnt Körper und Geist an Hochstress — im echten Ernstfall reagierst du dann nicht mit Panik.'
  },
  {
    id: 'm2q10',
    question: 'Was ist die mentale Grundhaltung im M.I. System?',
    options: ['Aggression als erste Reaktion', 'Deeskalation bevorzugen, aber konsequent handeln wenn nötig', 'Immer zuerst fliehen', 'Den Gegner einschüchtern'],
    correctIndex: 1,
    explanation: 'M.I. bevorzugt Deeskalation — aber wenn die Situation eskaliert, wird konsequent und entschlossen gehandelt. Keine halben Sachen.'
  },
  {
    id: 'm2q11',
    question: 'Warum ist "Durchhalten" schwieriger als körperliches Training?',
    options: ['Es ist einfacher', 'Weil der Kopf aufgibt bevor der Körper erschöpft ist', 'Weil es keine Techniken zu lernen gibt', 'Weil die Muskeln nicht trainiert werden'],
    correctIndex: 1,
    explanation: 'Der Kopf gibt in 90% der Fälle vor dem Körper auf — mentales Training ist deshalb genauso wichtig wie physisches.'
  },
  {
    id: 'm2q12',
    question: 'Was hilft gegen Blackout-Momente in Konfliktsituationen?',
    options: ['Mehr Kraft trainieren', 'Automatisierte Reaktionen durch Wiederholungstraining', 'Tiefes Durchatmen im Moment', 'Den Gegner anschreien'],
    correctIndex: 1,
    explanation: 'Automatisierte Reaktionen (durch tausende Wiederholungen trainiert) laufen auch im Blackout ab — das Gehirn greift auf gespeicherte Muster zurück.'
  },
  {
    id: 'm2q13',
    question: 'Was ist "pre-conflict mindset"?',
    options: ['Aggressivität vor dem Kampf', 'Mentale Vorbereitung auf mögliche Konfliktsituationen im Alltag', 'Angst vor Konflikten', 'Kampfsportliche Grundhaltung'],
    correctIndex: 1,
    explanation: 'Pre-conflict mindset bedeutet: im Alltag mental vorbereitet sein, Risiken früh erkennen und Deeskalation priorisieren.'
  },
  {
    id: 'm2q14',
    question: 'Wie baut man eine nachhaltige Trainingsroutine auf?',
    options: ['So intensiv wie möglich jeden Tag', 'Mit realistischen, konsistenten Einheiten die langfristig durchzuhalten sind', 'Nur wenn Motivation vorhanden ist', 'Mit Wettbewerb gegen andere'],
    correctIndex: 1,
    explanation: 'Nachhaltigkeit schlägt Intensität — regelmäßige, realistische Einheiten über Jahre sind effektiver als intensive Bursts gefolgt von langen Pausen.'
  },
  {
    id: 'm2q15',
    question: 'Was ist der Zusammenhang zwischen Mindset und Technik?',
    options: ['Kein Zusammenhang — Technik ist alles', 'Ohne richtiges Mindset kann auch gute Technik im Ernstfall versagen', 'Mindset ist wichtiger als Technik', 'Technik ersetzt Mindset'],
    correctIndex: 1,
    explanation: 'Technik und Mindset bedingen sich gegenseitig — die beste Technik versagt ohne die mentale Fähigkeit, sie unter extremem Stress abzurufen.'
  },
];

// ============================================
// MODUL 3 — P.O.N.R. (Point of No Return)
// ============================================
export const mod3Questions: QuizQuestion[] = [
  {
    id: 'm3q1',
    question: 'Was bedeutet P.O.N.R.?',
    options: ['Point of No Retreat', 'Point of No Return', 'Preparation of Necessary Response', 'Principle of Non-Resistance'],
    correctIndex: 1,
    explanation: 'P.O.N.R. steht für "Point of No Return" — der Punkt, ab dem Handeln unausweichlich ist.'
  },
  {
    id: 'm3q2',
    question: 'Was ist die "Rote Linie" im M.I. Kontext?',
    options: ['Eine Linie auf dem Trainingsmatten', 'Deine persönliche Grenze, ab der du handelst', 'Das Maximum an erlaubter Gewalt', 'Die Grenze zwischen Conflict und Combat'],
    correctIndex: 1,
    explanation: 'Die Rote Linie ist deine persönlich definierte Grenze — wird sie überschritten, handelst du sofort und konsequent.'
  },
  {
    id: 'm3q3',
    question: 'Warum ist es wichtig, die Initiative zu übernehmen?',
    options: ['Um den Gegner zu provozieren', 'Weil wer zuerst handelt den taktischen Vorteil hat', 'Um Zeugen zu beeindrucken', 'Weil Verteidigung schwächer ist'],
    correctIndex: 1,
    explanation: 'Wer die Initiative übernimmt, bestimmt den Rhythmus der Auseinandersetzung — der Reaktive ist immer einen Schritt hinter dem Agierenden.'
  },
  {
    id: 'm3q4',
    question: 'Was passiert, wenn man "zu spät reagiert"?',
    options: ['Nichts Schlimmes', 'Der Gegner hat bereits Schaden angerichtet bevor du reagierst', 'Man verliert Punkte', 'Die Technik wird schwieriger'],
    correctIndex: 1,
    explanation: 'Zu late reaction gibt dem Gegner Zeit, Schaden anzurichten — deshalb ist das frühe Erkennen des P.O.N.R. so entscheidend.'
  },
  {
    id: 'm3q5',
    question: 'Was bedeutet "dem Gegner zuvor kommen"?',
    options: ['Ihn angreifen bevor er droht', 'Die Aktion des Gegners antizipieren und früher reagieren', 'Schneller rennen', 'Mehr Schläge landen'],
    correctIndex: 1,
    explanation: 'Dem Gegner zuvorzukommen heißt: seine Absicht früher erkennen und reagieren bevor er seine Aktion vollständig ausführen kann.'
  },
  {
    id: 'm3q6',
    question: 'Wann ist der richtige Moment um zu handeln (P.O.N.R.)?',
    options: ['Erst wenn der Gegner angreift', 'Wenn klare Anzeichen einer unmittelbaren Bedrohung vorliegen', 'Immer sofort bei jeder Bedrohung', 'Nur wenn man sicher gewinnt'],
    correctIndex: 1,
    explanation: 'Der P.O.N.R. ist erreicht, wenn klare Anzeichen einer unmittelbaren Bedrohung vorliegen — nicht zu früh (Überreaktion) und nicht zu spät.'
  },
  {
    id: 'm3q7',
    question: 'Warum muss die Rote Linie vorher definiert werden?',
    options: ['Für rechtliche Absicherung', 'Im Moment der Bedrohung ist keine Zeit für Entscheidungen', 'Für das Training', 'Wegen der Hausordnung'],
    correctIndex: 1,
    explanation: 'Im echten Bedrohungsmoment hast du keine Zeit nachzudenken — wer seine Rote Linie vorher kennt, handelt automatisch wenn sie überschritten wird.'
  },
  {
    id: 'm3q8',
    question: 'Was unterscheidet Timing von Reaktionsgeschwindigkeit?',
    options: ['Kein Unterschied', 'Timing ist das Handeln zum richtigen Zeitpunkt, Reaktion ist Schnelligkeit auf einen Reiz', 'Reaktion ist wichtiger', 'Timing ist nur für Sportler'],
    correctIndex: 1,
    explanation: 'Timing bedeutet zur richtigen Zeit handeln — nicht nur schnell reagieren. Schlechtes Timing mit schneller Reaktion kann trotzdem scheitern.'
  },
  {
    id: 'm3q9',
    question: 'Wie erkennt man den P.O.N.R. in einer echten Situation?',
    options: ['Am Ausdruck des Gesichts', 'An einer Kombination aus Körpersprache, Distanz und verbalen Signalen', 'Wenn der Gegner die Hände hebt', 'Nur wenn eine Waffe sichtbar ist'],
    correctIndex: 1,
    explanation: 'P.O.N.R. erkennen erfordert das Lesen mehrerer Signale gleichzeitig: Körpersprache, Distanz, Ton, Bewegungsrichtung — kein einzelnes Signal reicht.'
  },
  {
    id: 'm3q10',
    question: 'Was ist "situational awareness" im M.I. Kontext?',
    options: ['Kampfsituationen wahrnehmen', 'Das ständige Bewusstsein für die Umgebung und potenzielle Bedrohungen', 'Nur im Training relevant', 'Militärischer Begriff ohne Relevanz für Zivilisten'],
    correctIndex: 1,
    explanation: 'Situational Awareness ist das ständige Wahrnehmen der Umgebung — wer früh Gefahren erkennt, kann den P.O.N.R. frühzeitig identifizieren.'
  },
  {
    id: 'm3q11',
    question: 'Wie trainiert man den richtigen Umgang mit P.O.N.R.?',
    options: ['Durch Theorie alleine', 'Durch realistische Szenarien die Entscheidungsdruck simulieren', 'Durch Videoschauen', 'Durch Sparring ohne Stress'],
    correctIndex: 1,
    explanation: 'P.O.N.R.-Entscheidungen werden durch stressige, realistische Szenarien trainiert — nur so werden sie im Ernstfall automatisch.'
  },
  {
    id: 'm3q12',
    question: 'Was ist das Risiko einer zu früh definierten Roten Linie?',
    options: ['Keine Risiken', 'Überreaktion auf normale soziale Situationen', 'Zu langsame Reaktion', 'Fehlende Verteidigungsfähigkeit'],
    correctIndex: 1,
    explanation: 'Eine zu niedrig angesetzte Rote Linie führt zu Überreaktionen in normalen sozialen Situationen — das hat rechtliche und soziale Konsequenzen.'
  },
  {
    id: 'm3q13',
    question: 'Was ist das Risiko einer zu spät definierten Roten Linie?',
    options: ['Keine Risiken', 'Du handelst zu spät und der Schaden ist bereits entstanden', 'Du bist zu aggressiv', 'Du verlierst Trainingspunkte'],
    correctIndex: 1,
    explanation: 'Eine zu hoch angesetzte Rote Linie bedeutet: du handelst erst wenn der Gegner bereits Schaden angerichtet hat — dann ist es oft zu spät.'
  },
  {
    id: 'm3q14',
    question: 'Was ist "proaktives Handeln" im M.I. System?',
    options: ['Angreifen ohne Grund', 'Handeln bevor der Angriff vollständig ausgeführt wurde, aber nach klarer Bedrohungsanzeige', 'Immer der Erste sein der angreift', 'Nur defensive Aktionen'],
    correctIndex: 1,
    explanation: 'Proaktives Handeln heißt: reagieren auf klare Bedrohungsanzeichen, bevor der Angriff vollständig kommt — nicht warten bis es zu spät ist.'
  },
  {
    id: 'm3q15',
    question: 'Wie ist P.O.N.R. rechtlich einzuordnen?',
    options: ['Immer rechtswidrig', 'Bei klarer Bedrohung kann proaktives Handeln unter §32 StGB (Notwehr) fallen', 'Nur Polizisten dürfen proaktiv handeln', 'Kein rechtlicher Rahmen vorhanden'],
    correctIndex: 1,
    explanation: 'Bei einer klaren unmittelbaren Bedrohung kann proaktives Handeln unter Notwehr (§32 StGB) fallen — der Angriff muss "gegenwärtig" sein, also unmittelbar bevorstehen.'
  },
];

// ============================================
// MODUL 4 — R.C.A.T.
// ============================================
export const mod4Questions: QuizQuestion[] = [
  {
    id: 'm4q1',
    question: 'Wofür steht R.C.A.T.?',
    options: ['React, Counter, Attack, Terminate', 'Redirect, Control, Attack, Takeaway', 'Respond, Contain, Assess, Terminate', 'Redirect, Counter, Absorb, Takedown'],
    correctIndex: 1,
    explanation: 'R.C.A.T. steht für: Redirect (Angriff umleiten), Control (Kontrolle herstellen), Attack (kontern), Takeaway (beenden/abschließen).'
  },
  {
    id: 'm4q2',
    question: 'Was bedeutet "Redirect" im R.C.A.T.-System?',
    options: ['Den Angriff ignorieren', 'Den Angriff in eine sichere Richtung umleiten', 'Weglaufen', 'Den Gegner anschreien'],
    correctIndex: 1,
    explanation: 'Redirect bedeutet: den eingehenden Angriff so umleiten, dass er keine Wirkung hat — Energie nutzen statt ihr entgegenstehen.'
  },
  {
    id: 'm4q3',
    question: 'Was bedeutet "Control" im R.C.A.T.?',
    options: ['Den Gegner einschüchtern', 'Eine Kontrollposition herstellen um den Gegner zu neutralisieren', 'Die eigene Emotion kontrollieren', 'Die Situation beobachten'],
    correctIndex: 1,
    explanation: 'Control bedeutet: nach dem Redirect eine Position einnehmen, von der aus du den Gegner kontrollierst und weitere Aktionen verhinderst.'
  },
  {
    id: 'm4q4',
    question: 'Wann kommt "Attack" im R.C.A.T.?',
    options: ['Als erste Aktion', 'Nach Redirect und Control als Konter', 'Nur wenn nötig', 'Niemals — M.I. ist defensiv'],
    correctIndex: 1,
    explanation: 'Attack (Konter) kommt nach dem Redirect und Control — erst wenn du sicher positioniert bist, ist der Konter effektiv und sicher.'
  },
  {
    id: 'm4q5',
    question: 'Was bedeutet "Takeaway" im R.C.A.T.?',
    options: ['Eine Waffe entwenden', 'Die Situation beenden und sicher abschließen', 'Das Training beenden', 'Den Gegner wegtragen'],
    correctIndex: 1,
    explanation: 'Takeaway bedeutet die Situation zu beenden — entweder durch Kontrolle, Flucht, oder das Sicherstellen dass keine weitere Bedrohung besteht.'
  },
  {
    id: 'm4q6',
    question: 'Warum ist die Reihenfolge R → C → A → T wichtig?',
    options: ['Sie ist nicht wichtig — man kann sie variieren', 'Jeder Schritt schafft die Voraussetzung für den nächsten', 'Weil es im Lehrplan steht', 'Für bessere Bewertungen'],
    correctIndex: 1,
    explanation: 'Jeder Schritt bereitet den nächsten vor: Redirect → sichere Position → Control → effektiver Konter → Attack → sicheres Beenden → Takeaway.'
  },
  {
    id: 'm4q7',
    question: 'Was ist der Vorteil von Redirect gegenüber direktem Blocken?',
    options: ['Kein Vorteil', 'Redirect nutzt die Energie des Angriffs, Blocken kämpft dagegen an', 'Redirect ist schneller', 'Blocken ist gefährlicher'],
    correctIndex: 1,
    explanation: 'Redirect nutzt die Energie des Angreifers — du lenkst sie um statt Kraft gegen Kraft zu setzen. Das funktioniert auch gegen stärkere Gegner.'
  },
  {
    id: 'm4q8',
    question: 'Welche Module bauen auf R.C.A.T. auf?',
    options: ['Kein weiteres Modul', 'Fast alle fortgeschrittenen Module — R.C.A.T. ist das Grundprinzip', 'Nur Modul 5', 'Nur Waffenmodule'],
    correctIndex: 1,
    explanation: 'R.C.A.T. ist das grundlegende Handlungsprinzip — alle fortgeschrittenen Techniken folgen dieser Logik, auch wenn sie komplexer werden.'
  },
  {
    id: 'm4q9',
    question: 'Was ist der Hauptunterschied zwischen "Control" und "Attack" in R.C.A.T.?',
    options: ['Control ist passiv, Attack ist aktiv', 'Control sichert die Position, Attack ist der Konter aus der gesicherten Position', 'Kein wesentlicher Unterschied', 'Attack kommt zuerst'],
    correctIndex: 1,
    explanation: 'Control = sichere Position einnehmen. Attack = von dieser sicheren Position aus kontern. Ohne Control ist Attack ineffektiv und riskant.'
  },
  {
    id: 'm4q10',
    question: 'Wie endet eine R.C.A.T.-Sequenz optimal?',
    options: ['Mit dem stärksten Schlag', 'Mit einem klaren Abschluss der die Bedrohung neutralisiert und Flucht ermöglicht', 'Mit dem Niederschlagen des Gegners', 'Mit Festhalten bis Hilfe kommt'],
    correctIndex: 1,
    explanation: 'Optimal endet R.C.A.T. mit einem klaren Abschluss (Takeaway) der die Bedrohung neutralisiert und die Möglichkeit zur Flucht gibt.'
  },
  {
    id: 'm4q11',
    question: 'Was macht R.C.A.T. zu einem System anstatt einer einzelnen Technik?',
    options: ['Es hat 4 Buchstaben', 'Es ist ein universelles Prinzip das auf viele verschiedene Angriffe anwendbar ist', 'Es wird nur von Profis angewendet', 'Es ist ein militärisches System'],
    correctIndex: 1,
    explanation: 'R.C.A.T. ist ein Prinzip, kein Ablauf — das Grundkonzept (umleiten, kontrollieren, kontern, beenden) gilt für viele verschiedene Situationen.'
  },
  {
    id: 'm4q12',
    question: 'Wann kann man R.C.A.T. auf mehrere Gegner anwenden?',
    options: ['Niemals', 'R.C.A.T.-Prinzipien helfen auch bei mehreren Gegnern: Redirect vom einen, Control Position gegen den zweiten', 'Nur wenn man kampfsporterfahren ist', 'R.C.A.T. funktioniert nur 1 gegen 1'],
    correctIndex: 1,
    explanation: 'Die R.C.A.T.-Prinzipien gelten auch bei mehreren Gegnern — Redirect nutzen um Position zu gewinnen, Control um einen zu neutralisieren während man auf den nächsten reagiert.'
  },
  {
    id: 'm4q13',
    question: 'Was ist "Angriff stoppen" in R.C.A.T.?',
    options: ['Den Gegner aufhalten zu kämpfen', 'Die konkrete eingehende Aktion zu neutralisieren (Redirect)', 'Den Gegner physisch zu stoppen', 'Eine verbale Deeskalation'],
    correctIndex: 1,
    explanation: '"Angriff stoppen" entspricht dem Redirect — die eingehende Aktion so neutralisieren, dass sie keine Wirkung entfalten kann.'
  },
  {
    id: 'm4q14',
    question: 'Warum ist "Beenden" (Takeaway) so wichtig?',
    options: ['Für die Statistik', 'Weil unkontrollierte Situationen weitere Gefahren bergen', 'Für das Grading', 'Wegen der Zeugen'],
    correctIndex: 1,
    explanation: 'Ohne klares Beenden bleibt die Situation offen — der Gegner kann erneut angreifen, weitere Beteiligte können eingreifen. Takeaway schließt die Situation.'
  },
  {
    id: 'm4q15',
    question: 'Welches Problem löst R.C.A.T. gegenüber einfachem Block-Konter?',
    options: ['Kein Problem — Block-Konter ist genauso gut', 'R.C.A.T. gibt jedem Moment eine klare Funktion und verhindert Handlungslosigkeit', 'R.C.A.T. ist schneller', 'Block-Konter ist gefährlicher'],
    correctIndex: 1,
    explanation: 'R.C.A.T. gibt Struktur: kein "Was jetzt?" nach dem Block. Jeder Schritt hat eine klare Funktion — das reduziert Zögern unter Stress.'
  },
];

// ============================================
// MODUL 5 — Backup Insurance I (Stand)
// ============================================
export const mod5Questions: QuizQuestion[] = [
  {
    id: 'm5q1',
    question: 'Was ist das Hauptthema von Modul 5 (Backup Insurance I)?',
    options: ['Bodenkampf', 'Längerer Konflikt im Stand', 'Waffenverteidigung', 'Mentales Training'],
    correctIndex: 1,
    explanation: 'BUI I behandelt den längeren Konflikt im Stand — wenn ein einmaliger Austausch nicht ausreicht und die Auseinandersetzung fortbesteht.'
  },
  {
    id: 'm5q2',
    question: 'Was ist eine "Schlag- & Konterstruktur"?',
    options: ['Ein System aus Schlägen und Blöcken in fester Reihenfolge', 'Ein strukturierter Ablauf aus Angriff und Gegenangriff der situationsabhängig angewendet wird', 'Nur Boxen', 'Techniken für den Boden'],
    correctIndex: 1,
    explanation: 'Eine Schlag- & Konterstruktur gibt dir einen strukturierten Rahmen für den Austausch — kein Chaos, sondern geordnete Reaktionen auf Aktionen des Gegners.'
  },
  {
    id: 'm5q3',
    question: 'Was bedeutet "stabil bleiben unter Druck"?',
    options: ['Nicht fallen', 'Stellung und Struktur auch bei Gegenschlägen und Druck behalten', 'Nicht schreien', 'Langsam atmen'],
    correctIndex: 1,
    explanation: 'Stabil bleiben bedeutet: auch wenn der Gegner zurückschlägt oder dich unter Druck setzt, behältst du Stellung, Gleichgewicht und Struktur.'
  },
  {
    id: 'm5q4',
    question: 'Warum ist "längerer Konflikt" eine eigene Kategorie?',
    options: ['Weil er häufiger vorkommt', 'Weil andere physische und mentale Ressourcen gebraucht werden als bei einem kurzen Austausch', 'Weil er gefährlicher ist', 'Für Fortgeschrittene nur'],
    correctIndex: 1,
    explanation: 'Ein längerer Konflikt erschöpft anders als ein kurzer — Kondition, Stressmanagement und Entscheidungen unter Müdigkeit werden kritisch.'
  },
  {
    id: 'm5q5',
    question: 'Wie verändert sich eine Konterstruktur bei einem müden Gegner?',
    options: ['Sie bleibt gleich', 'Möglichkeiten und Timing ändern sich — ein müder Gegner bietet andere Öffnungen', 'Sie wird weniger wichtig', 'Man hört auf zu kontern'],
    correctIndex: 1,
    explanation: 'Ein müder Gegner bewegt sich langsamer, lässt Deckung sinken, macht mehr Fehler — das ändert welche Konter möglich und sinnvoll sind.'
  },
  {
    id: 'm5q6',
    question: 'Was ist der Unterschied zwischen BUI I (Stand) und BUI II (Ground)?',
    options: ['Kein Unterschied', 'BUI I ist für den Kampf im Stehen, BUI II für Bodensituationen', 'BUI II ist fortgeschrittener', 'BUI I ist defensiver'],
    correctIndex: 1,
    explanation: 'BUI I (Stand) behandelt längere Auseinandersetzungen im Stehen, BUI II (Ground) bereitet auf Bodensituationen vor — beides sind essentielle Szenarien.'
  },
  {
    id: 'm5q7',
    question: 'Wie behalte ich meine Struktur nach einem Treffer?',
    options: ['Schmerz ignorieren', 'Schnell zurück in die Grundstellung, Gleichgewicht wiederherstellen, dann reagieren', 'Sofort angreifen', 'Pause machen'],
    correctIndex: 1,
    explanation: 'Nach einem Treffer: schnell zurück in die Grundstellung. Nur wer seine Struktur behält, kann effektiv weiter reagieren.'
  },
  {
    id: 'm5q8',
    question: 'Was ist "pressure testing" im Stand?',
    options: ['Den Gegner unter Druck setzen', 'Techniken unter realistischem Druck testen um ihre Wirksamkeit zu prüfen', 'Kraft messen', 'Sparring mit Regeln'],
    correctIndex: 1,
    explanation: 'Pressure testing bedeutet: Techniken unter realem Druck ausprobieren — nicht in kontrollierten Übungen, sondern in stressigen Szenarien.'
  },
  {
    id: 'm5q9',
    question: 'Welche Rolle spielt Atemkontrolle im Stand-Konflikt?',
    options: ['Keine Rolle', 'Atemkontrolle verhindert frühzeitige Erschöpfung und hält den Kopf klar', 'Nur für Zen-Meditation relevant', 'Ist zu komplex um es zu trainieren'],
    correctIndex: 1,
    explanation: 'Kontrolliertes Atmen verhindert Hyperventilation und frühzeitige Erschöpfung — auch unter Adrenalinstoß können trainierte Menschen ihre Atmung regulieren.'
  },
  {
    id: 'm5q10',
    question: 'Was ist "Kadenz" im Schlagaustausch?',
    options: ['Schlaggeschwindigkeit', 'Der Rhythmus und das Timing des Austauschs', 'Anzahl der Schläge', 'Schlagkraft'],
    correctIndex: 1,
    explanation: 'Kadenz ist der Rhythmus des Austauschs — wer die Kadenz kontrolliert, bestimmt Tempo und Timing und hat den taktischen Vorteil.'
  },
  {
    id: 'm5q11',
    question: 'Warum ist eine gute Deckung im Stand so wichtig?',
    options: ['Für Punkte im Wettkampf', 'Weil sie Treffer reduziert und Konter ermöglicht ohne Position zu verlieren', 'Für besseres Aussehen', 'Nur für Profis relevant'],
    correctIndex: 1,
    explanation: 'Eine gute Deckung reduziert Treffer und ermöglicht gleichzeitig Konter — ohne Deckung ist man ständig reaktiv und verliert schnell die Kontrolle.'
  },
  {
    id: 'm5q12',
    question: 'Was ist das Ziel der Schlag-Konter-Struktur?',
    options: ['Möglichst viele Schläge landen', 'Durch strukturierten Austausch die Initiative behalten und den Gegner dominieren', 'Den Gegner K.O. schlagen', 'Punkte sammeln'],
    correctIndex: 1,
    explanation: 'Das Ziel ist Initiative und Kontrolle — nicht blindes Draufschlagen, sondern strukturierter Austausch der den Gegner auf den hinteren Fuß bringt.'
  },
  {
    id: 'm5q13',
    question: 'Wann ist es sinnvoll, im Stand zu bleiben statt Distanz zu schaffen?',
    options: ['Niemals — immer Distanz schaffen', 'Wenn die Innen-Position gehalten werden kann um Konter und Kontrolle zu maximieren', 'Immer — Distanz ist gefährlich', 'Nur bei kleinen Gegnern'],
    correctIndex: 1,
    explanation: 'Im Stand zu bleiben ist sinnvoll, wenn du die Innen-Position kontrollierst — dann sind Konter effektiver als Distanz zu schaffen.'
  },
  {
    id: 'm5q14',
    question: 'Was ist "Structural Integrity" im Stand?',
    options: ['Die Festigkeit des Gebäudes', 'Die Körperhaltung und -spannung die Kraft überträgt und Stabilität gibt', 'Knochenstruktur', 'Muskelaufbau'],
    correctIndex: 1,
    explanation: 'Structural Integrity ist die Körperspannung und -ausrichtung die maximale Kraftübertragung ermöglicht und gleichzeitig Stabilität gegen Gegenkraft gibt.'
  },
  {
    id: 'm5q15',
    question: 'Warum ist BUI I (Stand) Voraussetzung für höhere Module?',
    options: ['Weil es im Lehrplan steht', 'Weil alle anderen Kampfsituationen vom Stand ausgehen oder darauf zurückführen', 'Für das Grading', 'Weil es das einfachste ist'],
    correctIndex: 1,
    explanation: 'Fast jede Konfliktsituation beginnt im Stand — ohne solide Stand-Kompetenz sind alle anderen Fertigkeiten auf wackligem Fundament gebaut.'
  },
];

// ============================================
// MODUL 6 — Backup Insurance II (Ground)
// ============================================
export const mod6Questions: QuizQuestion[] = [
  {
    id: 'm6q1',
    question: 'Was ist das primäre Ziel bei Bodensituationen?',
    options: ['Den Gegner am Boden zu dominieren', 'Schnellstmöglich zurück in die Vertikale (aufstehen)', 'Das Boden-Grappling zu gewinnen', 'Kontrolle im Bodenkampf zu halten'],
    correctIndex: 1,
    explanation: 'Im zivilen Kontext ist das primäre Ziel: so schnell wie möglich wieder aufzustehen. Auf dem Boden bist du verletzlicher gegenüber weiteren Gegnern, Tritten und Boden selbst.'
  },
  {
    id: 'm6q2',
    question: 'Warum ist "richtig Fallen" eine Technik?',
    options: ['Für Shows', 'Weil unkontrolliertes Fallen Verletzungen verursacht die den Kampf beenden können', 'Für den Sport', 'Nur bei Würfen relevant'],
    correctIndex: 1,
    explanation: 'Richtiges Fallen (Breakfalls) verteilt den Aufprall und verhindert Verletzungen am Kopf und Gelenken — unkontrolliertes Fallen kann kampfunfähig machen.'
  },
  {
    id: 'm6q3',
    question: 'Wie wehrt man Tritte gegen eine am Boden liegende Person ab?',
    options: ['Gar nicht — einfach aufstehen', 'Durch Schutzhaltung, Rollen und Orientierung zum Gegner', 'Nur durch schnelles Aufstehen', 'Durch Festhalten der Beine'],
    correctIndex: 1,
    explanation: 'Trittabwehr am Boden: Schutzhaltung für Kopf und Organe, Orientierung zum Gegner, Rollen um Trefferfläche zu reduzieren, dann aufstehen.'
  },
  {
    id: 'm6q4',
    question: 'Was ist "Positionswechsel" im Bodenkampf?',
    options: ['Den Platz wechseln', 'Kontrollierte Übergänge zwischen verschiedenen Bodenpositionen', 'Aufstehen', 'Den Gegner umdrehen'],
    correctIndex: 1,
    explanation: 'Positionswechsel sind kontrollierte Übergänge — von defensiv zu offensiv, von unten nach oben, von einer Kontrollposition zur nächsten.'
  },
  {
    id: 'm6q5',
    question: 'Was bedeutet "Bodensituationen überleben"?',
    options: ['Nicht sterben', 'Verletzungen vermeiden, Kontrolle behalten und Aufstehmöglichkeit schaffen', 'Den Gegner am Boden schlagen', 'Möglichst lange am Boden bleiben'],
    correctIndex: 1,
    explanation: 'Überleben am Boden bedeutet: Verletzungen durch Tritte/Schläge vermeiden, Kontrolle über die eigene Position behalten, Aufstehgelegenheit schaffen.'
  },
  {
    id: 'm6q6',
    question: 'Warum ist eine Schutzhaltung am Boden wichtig?',
    options: ['Für das Grading', 'Sie schützt Kopf und lebenswichtige Organe bis du aufstehen kannst', 'Für bessere Optik', 'Nur im Sport relevant'],
    correctIndex: 1,
    explanation: 'Die Schutzhaltung am Boden schützt Kopf (Knockout-Gefahr) und lebenswichtige Organe vor Tritten — das sind die kritischsten Trefferzonen.'
  },
  {
    id: 'm6q7',
    question: 'Was ist der "Technical Stand-Up" (kip-up oder geordnetes Aufstehen)?',
    options: ['Ein akrobatischer Move', 'Ein kontrollierter Aufstehvorgang der Deckung behält und Gegenangriff ermöglicht', 'Schnellstmöglich aufspringen', 'Den Gegner wegstoßen und aufstehen'],
    correctIndex: 1,
    explanation: 'Der Technical Stand-Up ist ein kontrollierter Aufstehvorgang — du behältst Deckung und Orientierung zum Gegner statt blind aufzuspringen.'
  },
  {
    id: 'm6q8',
    question: 'Wann sollte man nicht sofort aufstehen?',
    options: ['Niemals — immer sofort aufstehen', 'Wenn der Gegner direkt über dir ist und aufstehen eine Lücke öffnet', 'Bei Erschöpfung', 'Wenn Schmerzen vorhanden sind'],
    correctIndex: 1,
    explanation: 'Wenn der Gegner direkt über dir ist, kann blindes Aufstehen eine Lücke öffnen — manchmal ist eine Bodentechnik zuerst nötig um eine Aufstehgelegenheit zu schaffen.'
  },
  {
    id: 'm6q9',
    question: 'Was ist der Unterschied zwischen Sport-Grappling und BUI II?',
    options: ['Kein Unterschied', 'Sport-Grappling fokussiert Submission-Siege, BUI II fokussiert Überleben und Aufstehen', 'BUI II ist einfacher', 'Sport-Grappling ist gefährlicher'],
    correctIndex: 1,
    explanation: 'Sport-Grappling = Submission gewinnen. BUI II = Überleben, Verletzungen vermeiden, aufstehen. Andere Ziele, andere Strategien.'
  },
  {
    id: 'm6q10',
    question: 'Warum ist Bodenkampf im Straßen-Kontext gefährlicher als im Sport?',
    options: ['Kein Unterschied', 'Mehrere Gegner, harte Oberflächen, Waffen, keine Regeln', 'Der Boden ist schmutziger', 'Weniger Platz'],
    correctIndex: 1,
    explanation: 'Auf der Straße: möglicherweise mehrere Gegner die treten können, harte/gefährliche Oberflächen (Beton, Kanten), mögliche Waffen — völlig anderes Risikoprofil als im Sport.'
  },
  {
    id: 'm6q11',
    question: 'Wie verhindert man eine Bodensituation?',
    options: ['Durch gute Balance', 'Durch Distanzkontrolle, Gleichgewicht und das Erkennen von Wurf/Takedown-Einleitungen', 'Durch Stärke', 'Durch Fliehen'],
    correctIndex: 1,
    explanation: 'Bodensituationen verhindern: Distanzkontrolle, gutes Gleichgewicht, frühes Erkennen von Wurf- und Takedown-Versuchen — Prävention vor Reaktion.'
  },
  {
    id: 'm6q12',
    question: 'Was ist "Guard" im Bodenkampf?',
    options: ['Bewachen des Eingangs', 'Eine Bodenposition wo du mit den Beinen den Gegner kontrollierst', 'Deckung am Boden', 'Schutz durch andere Personen'],
    correctIndex: 1,
    explanation: 'Guard ist eine Bodenposition wo du mit deinen Beinen den Gegner umschließt und kontrollierst — gibt relative Kontrolle auch von der Unterposition.'
  },
  {
    id: 'm6q13',
    question: 'Warum trainiert M.I. das Fallen so ausführlich?',
    options: ['Für Akrobatik', 'Weil jeder irgendwann fällt und richtiges Fallen schwere Verletzungen verhindert', 'Für Filmaufnahmen', 'Nur für Judoka'],
    correctIndex: 1,
    explanation: 'Fallen ist unvermeidlich — entweder durch eigenes Stolpern, einen Wurf oder Takedown. Richtiges Fallen (Breakfall) ist lebensrettend auf hartem Untergrund.'
  },
  {
    id: 'm6q14',
    question: 'Was macht den Unterschied zwischen kontrolliertem und unkontrolliertem Aufstehen?',
    options: ['Geschwindigkeit', 'Kontinuierliche Deckung und Orientierung zum Gegner während des Aufstehens', 'Kondition', 'Gleichgewicht'],
    correctIndex: 1,
    explanation: 'Kontrolliertes Aufstehen behält Deckung und Sichtkontakt zum Gegner — unkontrolliertes Aufspringen lässt Lücken die der Gegner nutzen kann.'
  },
  {
    id: 'm6q15',
    question: 'Wie lange sollte man eine Bodensituation im zivilen Kontext maximal aushalten wollen?',
    options: ['So lange wie nötig', 'So kurz wie möglich — Ziel ist immer möglichst schnell aufzustehen', 'Mindestens 30 Sekunden', 'Bis der Gegner aufgibt'],
    correctIndex: 1,
    explanation: 'Im zivilen Kontext gilt: so kurz wie möglich am Boden. Jede Sekunde am Boden erhöht das Risiko durch weitere Gegner, Tritte oder gefährliche Umgebung.'
  },
];

// ============================================
// MODUL 7 — Backup Insurance III (Infight)
// ============================================
export const mod7Questions: QuizQuestion[] = [
  {
    id: 'm7q1',
    question: 'Was ist der "Clinch"?',
    options: ['Ein Aufwärmübung', 'Nahkampf-Kontrollposition mit Körper-an-Körper-Kontakt', 'Eine Greiftechnik', 'Das Festhalten des Gegners'],
    correctIndex: 1,
    explanation: 'Der Clinch ist eine Nahkampf-Kontrollposition mit direktem Körperkontakt — von hier aus sind Knie, Ellbogen, Würfe und Kontrollen möglich.'
  },
  {
    id: 'm7q2',
    question: 'Was ist "Trapping" im Kampfsport?',
    options: ['Den Gegner in eine Falle locken', 'Kontrolle und Neutralisierung der Arme/Hände des Gegners um Angriffe zu ermöglichen', 'Festhalten', 'Schlagen'],
    correctIndex: 1,
    explanation: 'Trapping bedeutet, die Arme des Gegners zu kontrollieren und zu neutralisieren — dadurch öffnen sich Lücken für Schläge, Ellbogen oder andere Aktionen.'
  },
  {
    id: 'm7q3',
    question: 'Wie befreit man sich aus einem Würgegriff?',
    options: ['Den Griff wegziehen', 'Durch kombinierte Techniken: Armposition, Körperdrehung, Gegenangriff auf schwache Punkte', 'Schreien', 'Warten bis der Druck nachlässt'],
    correctIndex: 1,
    explanation: 'Würgegriff-Befreiung kombiniert: richtige Armposition (unter den Armen des Gegners), Körperdrehung, und gleichzeitiger Gegenangriff auf schwache Punkte.'
  },
  {
    id: 'm7q4',
    question: 'Was bedeutet "Strukturdominanz in Nahdistanz"?',
    options: ['Größer und stärker sein', 'Die Körperstruktur so ausrichten dass maximale Kraft erzeugt und Gegenkraft absorbiert wird', 'Den Gegner wegstoßen', 'Immer die Außenposition halten'],
    correctIndex: 1,
    explanation: 'Strukturdominanz bedeutet: die eigene Körperstruktur (Hüfte, Rücken, Gewicht) so ausrichten, dass man in Nahdistanz immer im Vorteil ist — unabhängig von reiner Körperkraft.'
  },
  {
    id: 'm7q5',
    question: 'Warum ist der Clinch wichtig für den zivilen Kontext?',
    options: ['Er ist nicht wichtig', 'Weil viele echte Konflikte in Nahdistanz enden wo Clinch-Kontrolle entscheidend ist', 'Nur für Sport relevant', 'Wegen der Schulterwürfe'],
    correctIndex: 1,
    explanation: 'Viele echte Konflikte eskalieren zu Nahdistanz — im Clinch entscheidet sich, wer die Kontrolle hat und Schaden anrichten oder fliehen kann.'
  },
  {
    id: 'm7q6',
    question: 'Was ist eine "Greifbefreiung"?',
    options: ['Den Gegner losgelassen', 'Das Befreien aus einem Griff des Gegners ohne Kraftaufwand gegen den Griff', 'Eine Hebeltechnik', 'Weglaufen aus einem Griff'],
    correctIndex: 1,
    explanation: 'Greifbefreiung nutzt Biomechanik statt Kraft — du bewegst dich entlang der schwächsten Achse des Griffs, nicht dagegen. Effektiv auch gegen stärkere Gegner.'
  },
  {
    id: 'm7q7',
    question: 'Welche Waffen sind im Clinch am effektivsten?',
    options: ['Fäuste', 'Ellbogen und Knie', 'Tritte', 'Kopfstöße'],
    correctIndex: 1,
    explanation: 'Im Clinch sind Ellbogen und Knie am effektivsten — sie sind kurz, kraftvoll und funktionieren in Nahdistanz wo Schläge keine Reichweite haben.'
  },
  {
    id: 'm7q8',
    question: 'Was ist der Unterschied zwischen Trapping und Festhalten?',
    options: ['Kein Unterschied', 'Trapping ist kurze Neutralisierung zum Öffnen von Lücken, Festhalten ist statisches Kontrollieren', 'Festhalten ist effektiver', 'Trapping ist nur für Experten'],
    correctIndex: 1,
    explanation: 'Trapping ist kurz und dynamisch — kurze Kontrolle der Hände/Arme um Angriffslücken zu öffnen. Festhalten ist statisch und erschöpfend. Trapping ist effizienter.'
  },
  {
    id: 'm7q9',
    question: 'Wie schützt man sich vor Würgegriffen präventiv?',
    options: ['Immer einen Schal tragen', 'Distanzkontrolle und Kinnschutz — Kinn senken macht Würgegriff schwieriger', 'Durch Stärke', 'Durch Schreien'],
    correctIndex: 1,
    explanation: 'Kinn senken und Schultern hochziehen macht einen Würgegriff am Hals schwieriger anzulegen — Prävention durch Körperhaltung ist einfacher als Befreiung danach.'
  },
  {
    id: 'm7q10',
    question: 'Was ist "Nahdistanz" und wann ist sie aktiv?',
    options: ['Weniger als 1 Meter', 'Der Kampfbereich wo konventionelle Schläge keine Wirkung mehr haben und Ellbogen/Knie dominieren', 'Körperkontakt', 'Clinch-Distanz'],
    correctIndex: 1,
    explanation: 'Nahdistanz ist der Bereich wo normale Schläge keinen Raum mehr haben — hier dominieren Ellbogen, Knie, Clinch und kurze Kontrollen.'
  },
  {
    id: 'm7q11',
    question: 'Warum ist Clinch-Training oft vernachlässigt?',
    options: ['Weil er nicht wichtig ist', 'Weil er unbequem und technisch anspruchsvoll ist, aber in der Realität häufig vorkommt', 'Wegen Verletzungsgefahr', 'Nur Ringkämpfer brauchen es'],
    correctIndex: 1,
    explanation: 'Clinch ist unbequem und technisch — deshalb wird er oft vernachlässigt. In echten Konflikten ist er aber häufig die Realität, die Kampf oder Flucht entscheidet.'
  },
  {
    id: 'm7q12',
    question: 'Was ist "Strukturdominanz" konkret?',
    options: ['Größer sein', 'Hüfte, Gewicht und Körperlinie so ausrichten dass man mechanisch im Vorteil ist', 'Stärker sein', 'Schneller sein'],
    correctIndex: 1,
    explanation: 'Strukturdominanz ist Physik: Hüfte tief, Gewicht auf dem Gegner, eigene Linie stärker als seine — das funktioniert unabhängig von reiner Körperkraft.'
  },
  {
    id: 'm7q13',
    question: 'Wie endet eine Infight-Situation optimal?',
    options: ['Mit K.O.', 'Mit Kontrolle, Abstand schaffen und Flucht oder klarer Neutralisierung', 'Mit Festhalten bis Hilfe kommt', 'Mit weiteren Schlägen'],
    correctIndex: 1,
    explanation: 'Optimal: Kontrolle gewinnen, dann Abstand schaffen und fliehen oder die Bedrohung klar neutralisieren. Dauerhafter Nahkampf erschöpft und ist riskant.'
  },
  {
    id: 'm7q14',
    question: 'Warum ist Körperspannung im Clinch wichtig?',
    options: ['Für gutes Aussehen', 'Weil Körperspannung Struktur gibt die Gegendruck absorbiert und eigene Kraft überträgt', 'Um Verletzungen zu vermeiden', 'Wegen der Regeln'],
    correctIndex: 1,
    explanation: 'Körperspannung im Clinch ist die Basis für Kraft-Übertragung und Struktur — ohne sie verlierst du Position und kannst weder Druck ausüben noch absorbieren.'
  },
  {
    id: 'm7q15',
    question: 'Was ist BUI III (Infight) im Verhältnis zu BUI I und II?',
    options: ['Eine leichtere Version', 'Der dritte Kampfbereich — nach Stand und Boden ist Infight die kritische Nahzone', 'Eine Alternative', 'Nur für Fortgeschrittene'],
    correctIndex: 1,
    explanation: 'BUI III schließt die Lücke zwischen Stand und Boden — Infight (Nahdistanz, Clinch) ist die Zone wo viele echte Konflikte entschieden werden.'
  },
];

// ============================================
// MODUL 8 — Weapons I (Non-Lethal Tools)
// ============================================
export const mod8Questions: QuizQuestion[] = [
  {
    id: 'm8q1',
    question: 'Was ist ein "Improvised Tool" im M.I. Kontext?',
    options: ['Eine selbst gebastelte Waffe', 'Ein Alltagsgegenstand der zur Selbstverteidigung genutzt werden kann', 'Verbotene Waffen', 'Militärisches Equipment'],
    correctIndex: 1,
    explanation: 'Improvised Tools sind Alltagsgegenstände — Schlüssel, Regenschirm, Rucksack, Zeitung — die situativ zur Selbstverteidigung eingesetzt werden können.'
  },
  {
    id: 'm8q2',
    question: 'Wie funktioniert Pfefferspray korrekt?',
    options: ['Augen direkt anzielen von nah', 'Kurzer Sprühstoß in Augenbereich, dann sofort Abstand schaffen und fliehen', 'Langer Sprühstoß für maximale Wirkung', 'Aus großer Distanz sprühen'],
    correctIndex: 1,
    explanation: 'Kurzer, gezielter Sprühstoß in den Augenbereich — dann sofort Abstand schaffen und fliehen. Langes Sprühen verschwendet Inhalt und belastet auch dich.'
  },
  {
    id: 'm8q3',
    question: 'Was ist ein Tactical Pen?',
    options: ['Ein sehr stabiler Kugelschreiber zum Schreiben', 'Ein verstärkter Stift der als Selbstverteidigungswerkzeug genutzt werden kann', 'Eine versteckte Waffe', 'Ein militärisches Werkzeug'],
    correctIndex: 1,
    explanation: 'Ein Tactical Pen ist ein verstärkter Stift (oft aus Metall/Hartplastik) der legal unauffällig getragen und im Notfall zur Selbstverteidigung eingesetzt werden kann.'
  },
  {
    id: 'm8q4',
    question: 'Was ist die rechtliche Einordnung von Pfefferspray in Deutschland?',
    options: ['Verboten für Zivilisten', 'Erlaubt als "Tierabwehrspray" — muss entsprechend gekennzeichnet sein', 'Nur mit Waffenschein', 'Für alle frei erhältlich ohne Einschränkungen'],
    correctIndex: 1,
    explanation: 'Pfefferspray ist in Deutschland legal als "Tierabwehrspray" (mit PTB-Zeichen) — als Waffenspray (CS-Gas) ist es ohne Waffenschein nicht erlaubt für Zivilisten.'
  },
  {
    id: 'm8q5',
    question: 'Was ist "Distanz & Zugriff" im Kontext von non-lethal Tools?',
    options: ['Die Reichweite einer Waffe', 'Das Wissen wann und wie man das Tool einsetzt relativ zur Distanz zum Gegner', 'Wie man ein Tool versteckt', 'Die Zeit zum Ziehen einer Waffe'],
    correctIndex: 1,
    explanation: 'Distanz & Zugriff: das richtige Tool für die richtige Distanz, und die Fähigkeit es schnell und sicher einzusetzen — bevor der Gegner eingreifen kann.'
  },
  {
    id: 'm8q6',
    question: 'Welcher Alltagsgegenstand eignet sich gut als Schlagschutz?',
    options: ['Smartphone', 'Regenschirm, Rucksack oder Ordner als Schild', 'Geldbörse', 'Schlüssel als Schlagring'],
    correctIndex: 1,
    explanation: 'Regenschirm (Schlag/Distanz), Rucksack (Schild gegen Messer), Ordner (Schlagschutz) — praktische Alltagsgegenstände mit Verteidigungspotential.'
  },
  {
    id: 'm8q7',
    question: 'Was ist das Ziel beim Einsatz von Pfefferspray?',
    options: ['Den Gegner dauerhaft zu schädigen', 'Kurzzeitige Incapacitation um Zeit für Flucht zu gewinnen', 'Den Angreifer zu bestrafen', 'Als erste Maßnahme in jeder Bedrohungslage'],
    correctIndex: 1,
    explanation: 'Pfefferspray schafft kurzzeitige Handlungsunfähigkeit — das Ziel ist Zeit für Flucht zu gewinnen, nicht dauerhafte Schädigung oder Bestrafung.'
  },
  {
    id: 'm8q8',
    question: 'Was bedeutet "Anwendung im realistischen Kontext"?',
    options: ['Im Wettkampf anwenden', 'Das Einüben von Tools in stressigen, realistischen Szenarien nicht nur als isolierte Technik', 'Nur in Theorie kennen', 'In Filmen beobachten'],
    correctIndex: 1,
    explanation: 'Realistischer Kontext = unter Druck, in Bewegung, mit einem Gegner der reagiert — nicht nur das isolierte Sprühen oder Halten eines Tools.'
  },
  {
    id: 'm8q9',
    question: 'Was sind die Grenzen von non-lethal Tools?',
    options: ['Sie haben keine Grenzen', 'Verhältnismäßigkeit, Legalität und Situation — ein Tool das zu viel Schaden anrichtet kann rechtliche Konsequenzen haben', 'Nur physische Grenzen (Reichweite, Menge)', 'Sie sind immer erlaubt in Notwehr'],
    correctIndex: 1,
    explanation: 'Non-lethal Tools unterliegen dem Verhältnismäßigkeitsprinzip — der Einsatz muss zur Bedrohung proportional sein, sonst entstehen rechtliche Konsequenzen.'
  },
  {
    id: 'm8q10',
    question: 'Wann ist der richtige Moment Pfefferspray einzusetzen?',
    options: ['Sofort bei jeder Bedrohung', 'Wenn eine klare unmittelbare Bedrohung vorliegt und andere Optionen nicht möglich sind', 'Als Warnung für den Gegner', 'Immer als erste Option'],
    correctIndex: 1,
    explanation: 'Pfefferspray bei klarer unmittelbarer Bedrohung wo andere Optionen nicht möglich sind — nicht als Warnung oder präventiv, sondern als letztes Mittel vor körperlichem Kontakt.'
  },
  {
    id: 'm8q11',
    question: 'Was ist der Unterschied zwischen Tactical Pen und normaler Selbstverteidigung mit Schlüsseln?',
    options: ['Kein Unterschied', 'Tactical Pen ist speziell dafür konzipiert und strukturell stabiler; Schlüssel können brechen und Verletzungen am eigenen Handrücken verursachen', 'Schlüssel sind effektiver', 'Tactical Pen ist illegal'],
    correctIndex: 1,
    explanation: 'Tactical Pens sind strukturell für diesen Zweck gemacht — Schlüssel können brechen, schneiden die eigene Hand und sind biomechanisch ungünstiger.'
  },
  {
    id: 'm8q12',
    question: 'Was ist "Distanzmanagement" mit non-lethal Tools?',
    options: ['Auf Distanz bleiben', 'Das Tool so einsetzen dass man außerhalb der Schlagreichweite des Gegners bleibt', 'Den Abstand messen', 'Nur auf kurze Distanz anwenden'],
    correctIndex: 1,
    explanation: 'Gutes Distanzmanagement mit Tools: den Gegner auf Distanz halten (z.B. Regenschirm als Distanzhalter) und das Tool sicher einsetzen ohne in Nahkampf-Reichweite zu geraten.'
  },
  {
    id: 'm8q13',
    question: 'Welche Körperstellen sind effektive Ziele bei non-lethal Tools?',
    options: ['Nur der Kopf', 'Augen (Spray), Schläfen/Kinn (Pen), Rippen/Schien (Schlag) — je nach Tool und Distanz', 'Der Magen', 'Die Beine'],
    correctIndex: 1,
    explanation: 'Je nach Tool: Spray → Augen; Pen → Schläfen, Kinn, Kehle (vorsichtig!); Improvised Weapon → Rippen, Schienbein. Immer verhältnismäßig.'
  },
  {
    id: 'm8q14',
    question: 'Warum ist Training mit Tools wichtig und nicht nur das Besitzen?',
    options: ['Für das Grading', 'Weil unter Stress nur trainierte Handlungen abrufbar sind — ein Tool das man nie geübt hat zu benutzen hilft im Ernstfall nicht', 'Für die Versicherung', 'Weil es Vorschrift ist'],
    correctIndex: 1,
    explanation: 'Ein Tool im Rucksack nützt nichts wenn man nicht trainiert hat es schnell und sicher zu benutzen — unter Stress ist nur Trainiertes abrufbar.'
  },
  {
    id: 'm8q15',
    question: 'Was ist die erste Reaktion nach erfolgreichem Pfefferspray-Einsatz?',
    options: ['Den Gegner beobachten', 'Sofort Abstand schaffen und fliehen', 'Weitere Maßnahmen einleiten', 'Die Polizei anrufen'],
    correctIndex: 1,
    explanation: 'Sofort Abstand schaffen und fliehen — das ist das Ziel des Einsatzes. Nicht warten, beobachten oder weitere Aktionen, sondern die gewonnene Zeit zur Flucht nutzen.'
  },
];

// ============================================
// MODUL 9 — Weapons II (Edged & Impact)
// ============================================
export const mod9Questions: QuizQuestion[] = [
  {
    id: 'm9q1',
    question: 'Was ist das primäre Ziel bei einer Messerbedrohung?',
    options: ['Das Messer entwaffnen', 'Treffer vermeiden, Distanz schaffen, fliehen', 'Das Messer festhalten', 'Den Angreifer überwältigen'],
    correctIndex: 1,
    explanation: 'Bei Messerbedrohung: primäres Ziel ist Treffer vermeiden — kein Messerangriff ist "gewonnen", du nimmst immer ein Risiko. Fliehen ist immer die beste Option.'
  },
  {
    id: 'm9q2',
    question: 'Was sind "Hiebwaffen" im M.I. Kontext?',
    options: ['Pistolen', 'Schlagwaffen wie Stöcke, Rohre, Riemen', 'Klingen', 'Improvised Tools'],
    correctIndex: 1,
    explanation: 'Hiebwaffen sind Schlagwaffen (Stock, Rohr, Kette, Riemen) — im Gegensatz zu Stichwaffen (Messer). Andere Angriffswinkel, andere Verteidigungsstrategien.'
  },
  {
    id: 'm9q3',
    question: 'Was ist "Winkelarbeit" bei der Waffen-Verteidigung?',
    options: ['Das Abmessen von Winkeln', 'Bewegung aus der Angriffslinie heraus durch Seitwärts- oder Diagonalbewegung', 'Eine Hebeltechnik', 'Das Deflektieren von Schlägen'],
    correctIndex: 1,
    explanation: 'Winkelarbeit bedeutet: sich aus der direkten Angriffslinie bewegen — seitwärts oder diagonal — damit der Angriff ins Leere geht oder umgelenkt werden kann.'
  },
  {
    id: 'm9q4',
    question: 'Warum ist Distanzmanagement bei Waffen besonders kritisch?',
    options: ['Wegen der Reichweite', 'Weil Waffen die Reichweite verlängern und außerhalb der Waffen-Reichweite zu sein lebensrettend ist', 'Für technische Präzision', 'Wegen der Regeln'],
    correctIndex: 1,
    explanation: 'Eine Waffe verlängert die effektive Reichweite des Angreifers erheblich — außerhalb dieser Reichweite zu sein ist die sicherste Position überhaupt.'
  },
  {
    id: 'm9q5',
    question: 'Was ist das "Dry Side" Prinzip bei Messerverteidigung?',
    options: ['Die unbewaffnete Seite', 'Die Seite des Angreifers die keine Waffe hält — dort ist die Verteidigung sicherer', 'Trockentraining', 'Die defensive Seite'],
    correctIndex: 1,
    explanation: 'Die "Dry Side" ist die waffenfreie Seite des Angreifers — Bewegung auf diese Seite gibt dir relative Sicherheit da die Waffe weiter entfernt ist.'
  },
  {
    id: 'm9q6',
    question: 'Was ist das größte Missverständnis bei der Messerabwehr?',
    options: ['Dass es einfach ist', 'Dass man das Messer "entwaffnen" kann ohne sich dabei zu schneiden', 'Dass Fliehen möglich ist', 'Dass Distanz hilft'],
    correctIndex: 1,
    explanation: 'Das größte Missverständnis: man kann das Messer sauber entwaffnen. In Wirklichkeit wird man bei einem echten Messerangriff fast immer Schnittwunden erleiden — das Ziel ist, diese minimal zu halten.'
  },
  {
    id: 'm9q7',
    question: 'Was sind "technische Verteidigungsprinzipien" bei Waffen?',
    options: ['Feste Techniken für jede Situation', 'Grundprinzipien wie Winkelarbeit, Distanz, Deflection die auf viele Waffen-Situationen anwendbar sind', 'Nur für Spezialisten', 'Militärische Taktiken'],
    correctIndex: 1,
    explanation: 'Technische Prinzipien (Winkelarbeit, Distanz, Deflection) sind universell — sie gelten für Messer, Stock und andere Waffen, anstatt separate Techniken für jede Waffe.'
  },
  {
    id: 'm9q8',
    question: 'Was sollte man tun wenn man eine Messerbedrohung von weitem erkennt?',
    options: ['Direkt konfrontieren', 'Sofort Distanz schaffen und fliehen bevor eine echte Gefahrensituation entsteht', 'Zeuge suchen', 'Laut rufen'],
    correctIndex: 1,
    explanation: 'Frühe Erkennung = frühe Reaktion. Wenn das Messer gesehen wird bevor man in Reichweite ist — fliehen. Das ist immer die beste Option.'
  },
  {
    id: 'm9q9',
    question: 'Warum sind improvisierte Schilde effektiv gegen Messer?',
    options: ['Sie stoppen das Messer komplett', 'Sie absorbieren oder deflektieren den Stich/Schnitt und schützen kritische Körperstellen', 'Sie sind stabiler als Unterarme', 'Für psychologischen Effekt'],
    correctIndex: 1,
    explanation: 'Ein Rucksack, eine Jacke, ein Brett — alles was zwischen Messer und Körper kommt kann Stiche absorbieren und gibt dir Zeit und Distanz.'
  },
  {
    id: 'm9q10',
    question: 'Was ist der Unterschied zwischen einer Messer-Bedrohung und einem Messer-Angriff?',
    options: ['Kein Unterschied', 'Bei Bedrohung wird das Messer gezeigt ohne direkten Angriff — bei Angriff bewegt sich das Messer auf dich zu', 'Bedrohung ist gefährlicher', 'Angriff ist seltener'],
    correctIndex: 1,
    explanation: 'Bedrohung = Messer sichtbar, kein direkter Angriff (z.B. Raubüberfall). Angriff = das Messer kommt auf dich zu. Sehr unterschiedliche Reaktionen notwendig.'
  },
  {
    id: 'm9q11',
    question: 'Was sind "Deflection"-Techniken?',
    options: ['Das Messer wegstoßen', 'Das Umlenken der Angriffswaffe von der eigenen Körperlinie ohne direkten Gegenstopp', 'Blocken der Waffe', 'Ausweichen'],
    correctIndex: 1,
    explanation: 'Deflection = die Waffe umlenken statt dagegenstoppen — du reduzierst Kraft gegen Kraft und nutzt die Energie des Angriffs um die Waffe an dir vorbeizuführen.'
  },
  {
    id: 'm9q12',
    question: 'Wann ist eine Messerabwehr-Technik angemessen zu verteidigen?',
    options: ['Niemals — immer fliehen', 'Wenn Flucht nicht möglich ist und ein direkter Angriff stattfindet', 'Immer wenn ein Messer sichtbar ist', 'Nur für trainierte Kämpfer'],
    correctIndex: 1,
    explanation: 'Abwehrtechnik nur wenn Flucht NICHT möglich ist — Messerabwehr ist immer riskant. Wenn Flucht möglich ist, ist das immer die bessere Option.'
  },
  {
    id: 'm9q13',
    question: 'Was ist ein "Mata Angin" oder Winkelschlag bei Stockwaffen?',
    options: ['Ein Schlag von oben', 'Angriffe aus verschiedenen Winkeln (diagonal, horizontal, vertikal) die unterschiedliche Abwehrstrategien erfordern', 'Ein Spezialterminus aus Eskrima', 'Ein defensiver Block'],
    correctIndex: 1,
    explanation: 'Winkelschläge kommen aus verschiedenen Richtungen — das Verteidigungsprinzip muss für jeden Winkel angepasst werden. Das ist die Basis des Eskrima-basierten Stockkampfs.'
  },
  {
    id: 'm9q14',
    question: 'Was ist das Hauptprinzip der Messerverteidigung laut M.I.?',
    options: ['Niemals ausweichen', 'Weg von der Waffe, Deflection, minimaler Körperschaden, dann Flucht', 'Immer angreifen', 'Kontrolle über das Messer gewinnen'],
    correctIndex: 1,
    explanation: 'Das Hauptprinzip: Weg von der Waffe (Winkelarbeit), Deflection des Angriffs, dann sofort Flucht. Minimaler Kontakt mit der Waffe, kein heroisches Entwaffnen.'
  },
  {
    id: 'm9q15',
    question: 'Warum ist M.I. Modul 9 auf Tactical Level?',
    options: ['Weil es schwierig ist', 'Weil Waffen-Verteidigung fortgeschrittene Grundlagen erfordert und für ernste Situationen gilt', 'Wegen der Verletzungsgefahr im Training', 'Weil es teuer zu unterrichten ist'],
    correctIndex: 1,
    explanation: 'Waffenverteidigung erfordert solide Grundlagen aus Conflict und Combat — Winkelarbeit, Distanz, Clinch, Bodenkampf-Prävention sind Voraussetzungen für effektive Waffenverteidigung.'
  },
];

// ============================================
// MODUL 10 — Tactics & Survival
// ============================================
export const mod10Questions: QuizQuestion[] = [
  {
    id: 'm10q1',
    question: 'Was ist das Ziel von Modul 10 "Tactics & Survival"?',
    options: ['Alle Techniken nochmal üben', 'Kombination aller Module in komplexen Szenarien unter extremem Entscheidungsdruck', 'Das finale Grading vorbereiten', 'Neue Techniken lernen'],
    correctIndex: 1,
    explanation: 'Modul 10 kombiniert alles — alle Module werden in komplexen, variierenden Szenarien unter realem Entscheidungsdruck integriert. Das Finale des Trainingskonzepts.'
  },
  {
    id: 'm10q2',
    question: 'Was sind "Szenarien" im M.I. Training?',
    options: ['Theaterstücke', 'Realistische Rollenspiele die echte Konfliktsituationen simulieren', 'Gefahrenanalysen', 'Prüfungssituationen'],
    correctIndex: 1,
    explanation: 'Szenarien sind realistische Simulationen echter Konfliktsituationen — in der Straße, im Fahrzeug, mit Waffen, mit mehreren Gegnern — um Entscheidungsdruck zu trainieren.'
  },
  {
    id: 'm10q3',
    question: 'Was bedeutet "Kombination aller Module"?',
    options: ['Alle Techniken in einem Kampf nutzen', 'Flexibler Wechsel zwischen den Fähigkeiten aller Module je nach Situationsanforderung', 'Die Module in Reihenfolge anwenden', 'Module 1-9 nacheinander wiederholen'],
    correctIndex: 1,
    explanation: 'Kombination bedeutet: situationsadaptiv zwischen Stand, Boden, Waffen, Clinch, Tools wechseln — nicht starr an eine Methode gebunden sein.'
  },
  {
    id: 'm10q4',
    question: 'Was ist "Entscheidungsdruck" im Training?',
    options: ['Stress beim Grading', 'Simulierter Zeitdruck und Komplexität die echte Entscheidungssituationen nachbildet', 'Wettkampfdruck', 'Instructor-Bewertungsdruck'],
    correctIndex: 1,
    explanation: 'Entscheidungsdruck wird simuliert: Zeitdruck, mehrere Optionen, unvollständige Information, Stressfaktoren — damit echte Reaktionen im Ernstfall automatisch werden.'
  },
  {
    id: 'm10q5',
    question: 'Was ist "Stop the Bleed" und warum ist es in Modul 10?',
    options: ['Ein Kampfprinzip', 'Erste-Hilfe-Kenntnisse für lebensbedrohliche Blutungen — nach einem Konflikt kann Erstversorgung entscheidend sein', 'Eine Defensivtechnik', 'Ein psychologisches Konzept'],
    correctIndex: 1,
    explanation: '"Stop the Bleed" sind Erste-Hilfe-Kenntnisse für unkontrollierte Blutungen. Nach einem Konflikt können Verletzungen auftreten die sofortige Erstversorgung erfordern.'
  },
  {
    id: 'm10q6',
    question: 'Was bedeutet "Verhalten nach Gewalt"?',
    options: ['Einen Arzt aufsuchen', 'Psychologische und rechtliche Konsequenzen kennen und richtig reagieren nach einer Konfliktsituation', 'Die Polizei anrufen', 'Zeugen befragen'],
    correctIndex: 1,
    explanation: 'Verhalten nach Gewalt umfasst: Notruf, Zeugen sichern, keine Aussagen ohne Anwalt, psychologische Verarbeitung — das wird oft ignoriert aber ist rechtlich und mental entscheidend.'
  },
  {
    id: 'm10q7',
    question: 'Was sind "verschiedene Umgebungen" im Kontext von Modul 10?',
    options: ['Verschiedene Trainingshallen', 'Training in verschiedenen realen Settings: enge Gänge, Treppen, Fahrzeug, öffentliche Orte', 'Internationale Trainingsstandorte', 'Outdoor vs. Indoor'],
    correctIndex: 1,
    explanation: 'Verschiedene Umgebungen: enger Flur, Treppe, Auto, Supermarkt — jede Umgebung verändert Taktik und mögliche Techniken. Situationsangepasstes Training.'
  },
  {
    id: 'm10q8',
    question: 'Warum ist Training bei sich ändernden Lichtverhältnissen wichtig?',
    options: ['Für Nachtschichten', 'Weil echte Konflikte oft bei schlechtem Licht stattfinden (Nacht, dunkle Parkhäuser)', 'Für Filmaufnahmen', 'Nur für Polizisten'],
    correctIndex: 1,
    explanation: 'Viele echte Übergriffe finden bei Dunkelheit oder schlechtem Licht statt — Training nur im hellen Trainingssaal bereitet nicht auf diese Realität vor.'
  },
  {
    id: 'm10q9',
    question: 'Was ist das "After-Action Review" Prinzip?',
    options: ['Eine Prüfung nach dem Training', 'Analyse von Szenarien direkt nach der Durchführung um Lerneffekte zu maximieren', 'Ein militärischer Begriff ohne Relevanz', 'Feedback vom Instructor'],
    correctIndex: 1,
    explanation: 'After-Action Review: direkt nach einem Szenario analysieren — was funktioniert hat, was nicht, was man anders tun würde. Das maximiert den Lerneffekt von Szenarien.'
  },
  {
    id: 'm10q10',
    question: 'Warum ist Modul 10 das letzte im Tactical-Level?',
    options: ['Weil es am schwierigsten ist', 'Weil alle Vorkenntnisse der Module 1-9 als Grundlage benötigt werden', 'Wegen der Reihenfolge im Lehrplan', 'Weil es am meisten Zeit braucht'],
    correctIndex: 1,
    explanation: 'Modul 10 ist die Integration aller vorherigen Module — ohne solide Grundlagen aus Modulen 1-9 sind die komplexen Szenarien von Modul 10 nicht sinnvoll trainierbar.'
  },
  {
    id: 'm10q11',
    question: 'Was ist die wichtigste Lektion von "Verhalten nach Gewalt" rechtlich?',
    options: ['Sofort alles erklären', 'Keine Aussagen ohne Anwalt — auch wenn man im Recht war', 'Zeugen sammeln', 'Den Angreifer nicht anzeigen'],
    correctIndex: 1,
    explanation: 'Keine Aussagen ohne Anwalt — auch nach rechtmäßiger Notwehr kann jede Aussage gegen einen verwendet werden. Das ist eines der wichtigsten rechtlichen Grundprinzipien.'
  },
  {
    id: 'm10q12',
    question: 'Was ist "Force Continuum" im M.I. Kontext?',
    options: ['Dauerhafte Gewaltanwendung', 'Die abgestufte Eskalation von Reaktionen entsprechend der Bedrohung', 'Militärisches Konzept', 'Nur für Polizei relevant'],
    correctIndex: 1,
    explanation: 'Force Continuum bedeutet: die Reaktion ist proportional zur Bedrohung. Von verbaler Deeskalation → non-lethal → Notwehr. Überschreitung hat rechtliche Konsequenzen.'
  },
  {
    id: 'm10q13',
    question: 'Warum werden Szenarien mit mehreren Gegnern trainiert?',
    options: ['Weil sie häufig sind', 'Weil mehrere Gegner fundamental andere Taktik erfordern als 1-gegen-1', 'Für Fortgeschrittene nur', 'Wegen des Trends im Kampfsport'],
    correctIndex: 1,
    explanation: 'Mehrere Gegner erfordern komplett andere Taktik: nie in die Mitte geraten, immer Positionierung nutzen, schnell entscheiden wer priorisiert wird — dafür braucht es spezifisches Training.'
  },
  {
    id: 'm10q14',
    question: 'Was ist die psychologische Komponente von Modul 10?',
    options: ['Keine', 'Verarbeitung des Erlebten — Szenarien können psychisch belastend sein und das Verhalten danach trainiert wird', 'Mentaltraining', 'Stressabbau'],
    correctIndex: 1,
    explanation: 'Realistische Szenarien können psychisch belastend sein — Modul 10 trainiert auch die Verarbeitung des Erlebten und das psychologisch richtige Verhalten nach einem echten Konflikt.'
  },
  {
    id: 'm10q15',
    question: 'Was ist der Unterschied zwischen Taktik und Technik?',
    options: ['Kein Unterschied', 'Technik ist das "Wie" einer Bewegung; Taktik ist das "Wann, Wo und Warum" des Handelns', 'Taktik ist fortgeschrittener', 'Technik ist für Anfänger'],
    correctIndex: 1,
    explanation: 'Technik = die Ausführung (wie du blockst, schlägst, falls). Taktik = die Entscheidung (wann du handelst, wo du dich positionierst, welche Technik die Situation verlangt).'
  },
];

// ============================================
// EXPORT: Alle Fragen nach Modul-ID
// ============================================
export const MODULE_QUIZ_DATA: Record<string, QuizQuestion[]> = {
  'mod-1': mod1Questions,
  'mod-2': mod2Questions,
  'mod-3': mod3Questions,
  'mod-4': mod4Questions,
  'mod-5': mod5Questions,
  'mod-6': mod6Questions,
  'mod-7': mod7Questions,
  'mod-8': mod8Questions,
  'mod-8-adv': mod8Questions, // Selbe Fragen für Advanced-Version
  'mod-9': mod9Questions,
  'mod-10': mod10Questions,
};
