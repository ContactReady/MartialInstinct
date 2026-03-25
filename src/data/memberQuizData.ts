// ============================================
// MEMBER QUIZ-FRAGEN — Wissen aus den 10 Modulen
// Jeder Fragenpool pro Modul: mindestens 15 Fragen
// Quiz-Engine wählt immer 10 zufällig aus (mit Wiederholung)
// ============================================

import { QuizQuestion } from '../types';

// ============================================
// MODUL 1 — Mission Begins (Grundlagen)
// ============================================
export const mod1Questions: QuizQuestion[] = [
  {
    id: 'm1q1',
    question: 'Welche drei Grundstellungen unterscheidet das M.I. System?',
    options: [
      'Angriffs-, Verteidigungs- und Fluchthaltung',
      'Ready Position, Contact Ready Position und Neutrale Stellung',
      'Kampfstellung, Ruhehaltung und Laufposition',
      'Offensiv-, Defensiv- und Neutralhaltung'
    ],
    correctIndex: 1,
    explanation: 'Das M.I. System unterscheidet drei Grundstellungen: die Ready Position (Bereitschaftsstellung), die Contact Ready Position (Konfliktstellung) und die Neutrale Stellung.'
  },
  {
    id: 'm1q2',
    question: 'Wofür dient die Ready-Position?',
    options: ['Für den Angriff', 'Als Deeskalations- und Alarmbereitschaftshaltung', 'Nur für das Sparring', 'Als Ruhehaltung zwischen Techniken'],
    correctIndex: 1,
    explanation: 'Die Ready-Position ist eine Deeskalations- und Alarmbereitschaftshaltung — sie signalisiert keine Aggressivität, hält dich aber kampfbereit.'
  },
  {
    id: 'm1q3',
    question: 'Was versteht man unter "Distanzgefühl"?',
    options: ['Die Fähigkeit, Entfernungen zu schätzen', 'Das Gefühl für Raum und Reichweite im Kampf', 'Den Abstand zum nächsten Ausgang', 'Die Laufgeschwindigkeit'],
    correctIndex: 1,
    explanation: 'Distanzgefühl ist das Gespür für Raum und Reichweite — du weißt intuitiv, wann du in Reichweite eines Angriffs bist und wann nicht.'
  },
  {
    id: 'm1q4',
    question: 'Warum sind Grundbewegungen so wichtig?',
    options: ['Für besseres Aussehen beim Training', 'Für sichere Fortbewegung in alle Richtungen unter Druck', 'Nur für Wettkampfsport relevant', 'Um schneller laufen zu können'],
    correctIndex: 1,
    explanation: 'Grundbewegungen ermöglichen sichere Fortbewegung in alle Richtungen — auch unter Druck, wenn der Kopf nicht mehr klar denkt.'
  },
  {
    id: 'm1q5',
    question: 'Was umfasst "Mobility" im Kontext des M.I. Trainings?',
    options: ['Das Tragen von Handys', 'Stretching, Dehnen und Stabilität', 'Schnelle Beinarbeit', 'Beweglichkeit der Hände'],
    correctIndex: 1,
    explanation: 'Mobility umfasst Stretching, Dehnen und Stabilität — die Grundlage für verletzungsfreies und effektives Training.'
  },
  {
    id: 'm1q6',
    question: 'Welcher Fuß steht im M.I. System in der Regel vorne?',
    options: [
      'Immer der schwache Fuß — der starke Fuß generiert Kraft von hinten',
      'Beide Füße stehen parallel — es gibt keine Vorgabe',
      'In der Regel der starke Fuß, wenn die Situation es erlaubt — aber situativ kann auch der schwache Fuß vorne sein',
      'Immer der linke Fuß, unabhängig von der Dominanz'
    ],
    correctIndex: 2,
    explanation: 'Trainiert wird hauptsächlich Strong Side Forward — starker Fuß vorne. Das ist die bevorzugte Ausgangsposition. In der Realität kann man das jedoch nicht immer steuern: die Situation zwingt einen manchmal in die andere Auslage. Daher muss man beide Seiten kennen.'
  },
  {
    id: 'm1q7',
    question: 'Was ist der Zweck von kampfkunstspezifischer Fitness?',
    options: ['Muskeln aufbauen für besseres Aussehen', 'Die Kondition für realistische Konfliktsituationen aufbauen', 'Marathon-Vorbereitung', 'Gewichtheben lernen'],
    correctIndex: 1,
    explanation: 'Kampfkunstspezifische Fitness bereitet dich auf die körperlichen Anforderungen in echten Konfliktsituationen vor — Ausdauer, Explosivität, Belastbarkeit.'
  },
  {
    id: 'm1q8',
    question: 'Was ist der Unterschied zwischen Ready Position und Contact Ready Position?',
    options: [
      'Kein Unterschied — beide sind identisch',
      'Ready Position ist die Bereitschaftsstellung zur Deeskalation; Contact Ready Position ist die Konfliktstellung wenn Kontakt unmittelbar bevorsteht',
      'Die Contact Ready Position ist defensiver als die Ready Position',
      'Die Ready Position wird nur im Sparring verwendet'
    ],
    correctIndex: 1,
    explanation: 'Die Ready Position (Bereitschaftsstellung) signalisiert keine Aggression und hält dich kampfbereit. Die Contact Ready Position (Konfliktstellung) ist die aktivere Stellung, wenn physischer Kontakt unmittelbar bevorsteht oder bereits stattfindet.'
  },
  {
    id: 'm1q9',
    question: 'Warum müssen Grundbewegungen zur Gewohnheit werden?',
    options: ['Für bessere Noten beim Grading', 'Weil unter Stress nur automatisierte Bewegungen funktionieren', 'Um Zeit im Training zu sparen', 'Weil der Instructor es verlangt'],
    correctIndex: 1,
    explanation: 'Unter echtem Stress greift das Gehirn auf automatisierte Bewegungen zurück. Wenn Grundbewegungen nicht zur Gewohnheit wurden, versagen sie im Ernstfall.'
  },
  {
    id: 'm1q10',
    question: 'Was ist die wichtigste Eigenschaft guter Grundbewegungen?',
    options: ['Schnelligkeit', 'Sicherheit und Kontrolle in alle Richtungen', 'Geräuschlosigkeit', 'Eleganz'],
    correctIndex: 1,
    explanation: 'Gute Grundbewegungen sind sicher und kontrolliert in alle Richtungen — du kannst angreifen, ausweichen und fliehen ohne die Stellung zu verlieren.'
  },
  {
    id: 'm1q11',
    question: 'Wie oft sollten Mobility-Übungen durchgeführt werden?',
    options: ['Nur vor Wettkämpfen', 'Regelmäßig als Teil jeder Trainingseinheit', 'Einmal pro Monat', 'Nur wenn Schmerzen vorhanden sind'],
    correctIndex: 1,
    explanation: 'Mobility ist ein regelmäßiger Bestandteil jeder Trainingseinheit — nur durch Kontinuität verbessert sich Beweglichkeit und Verletzungsprävention.'
  },
  {
    id: 'm1q12',
    question: 'Wofür steht Modul 1 "Mission Begins"?',
    options: ['Der erste Kampf', 'Das Fundament aller weiteren Techniken und Fähigkeiten', 'Die Einführung in den Wettkampf', 'Die theoretische Ausbildung'],
    correctIndex: 1,
    explanation: 'Mission Begins legt das Fundament — alle weiteren Module bauen auf den hier gelernten Grundlagen auf.'
  },
  {
    id: 'm1q13',
    question: 'Was passiert, wenn das Distanzgefühl fehlt?',
    options: ['Nichts — Distanz ist unwichtig', 'Du bist zu nah oder zu weit — Angriffe treffen oder du kannst nicht kontern', 'Du wirst müde', 'Du verlierst die Balance'],
    correctIndex: 1,
    explanation: 'Ohne Distanzgefühl kannst du weder sicher angreifen noch verteidigen — du befindest dich ständig in der falschen Position.'
  },
  {
    id: 'm1q14',
    question: 'Was ist der Unterschied zwischen Fitness und Mobility im Training?',
    options: ['Kein Unterschied — beides ist dasselbe', 'Fitness = Kondition/Kraft; Mobility = Beweglichkeit/Stabilität', 'Fitness ist für Anfänger, Mobility für Fortgeschrittene', 'Mobility ist optionales Extra'],
    correctIndex: 1,
    explanation: 'Fitness bezieht sich auf Kondition und Kraft; Mobility auf Beweglichkeit, Dehnung und Gelenkstabilität. Beide sind essentiell und ergänzen sich.'
  },
  {
    id: 'm1q15',
    question: 'Warum ist die Schulterbreite beim Stand wichtig?',
    options: ['Für besseres Aussehen', 'Für optimale Stabilität und Gleichgewicht', 'Vorschrift laut Hausordnung', 'Für schnelleres Laufen'],
    correctIndex: 1,
    explanation: 'Schulterbreiter Stand gibt maximale Stabilität und Gleichgewicht — schmal = leicht umzuwerfen, zu breit = langsam und unbeweglich.'
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
