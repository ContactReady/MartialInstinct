// ============================================
// INSTRUCTOR-CURRICULUM
// Basiert auf dem Martial Instinct Trainer-Leitfaden v2.3 (06.03.2025)
// 4 Tracks — 28 Lektionen gesamt
// ============================================

import { InstructorTrack } from '../types';

export const INSTRUCTOR_TRACKS: InstructorTrack[] = [
  // ==========================================
  // TRACK A: DIDAKTIK & TRAININGSFÜHRUNG
  // ==========================================
  {
    id: 'didaktik',
    title: 'Didaktik & Trainingsführung',
    icon: '📚',
    description: 'Grundlagen effektiver Trainingsführung, Lerntypen, Erklärungsmethoden und Center Operations.',
    lessons: [
      {
        id: 'a1',
        trackId: 'didaktik',
        title: 'Die 3 Erfolgsfaktoren',
        order: 1,
        estimatedMinutes: 10,
        content: `Ein erfolgreiches Training basiert auf drei gleichwertigen Säulen, die zusammen wirken müssen.

**1. Lernbereitschaft des Schülers**
Der Schüler muss offen sein, etwas Neues zu lernen. Kein Instructor kann jemanden zwingen zu lernen — aber wir können die richtige Umgebung schaffen, die Lernbereitschaft fördert.

**2. Trainerkompetenz**
Du als Instructor musst fachlich kompetent, methodisch sicher und kommunikativ stark sein. Fachkompetenz alleine reicht nicht — du musst Inhalte auch vermitteln können.

**3. Trainingskonzept**
Ein durchdachtes Konzept sorgt dafür, dass jede Einheit einen klaren roten Faden hat. Spontane Trainings ohne Plan führen zu ungleichmäßigem Lernfortschritt bei den Schülern.`,
        keyPoints: [
          'Lernbereitschaft: Der Schüler muss offen für Neues sein',
          'Trainerkompetenz: Fachliches Wissen + Vermittlungsfähigkeit',
          'Trainingskonzept: Strukturierter Aufbau jeder Einheit',
          'Alle 3 Faktoren müssen gleichzeitig stimmen',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'a1q1',
              question: 'Welcher der folgenden ist KEIN Erfolgsfaktor im M.I. Trainingsmodell?',
              options: ['Lernbereitschaft des Schülers', 'Trainerkompetenz', 'Trainingskonzept', 'Trainingsraum-Größe'],
              correctIndex: 3,
              explanation: 'Die 3 Erfolgsfaktoren sind Lernbereitschaft, Trainerkompetenz und Trainingskonzept. Die Größe des Raumes ist kein eigenständiger Erfolgsfaktor.',
            },
            {
              id: 'a1q2',
              question: 'Was versteht man unter "Trainerkompetenz" im M.I. Kontext?',
              options: [
                'Nur das Beherrschen der Techniken',
                'Fachliches Wissen UND die Fähigkeit, Inhalte zu vermitteln',
                'Die Anzahl der Trainerjahre',
                'Das Absolvieren aller Module als Schüler',
              ],
              correctIndex: 1,
              explanation: 'Trainerkompetenz ist mehr als nur Fachkompetenz. Du musst Inhalte auch methodisch korrekt vermitteln können.',
            },
            {
              id: 'a1q3',
              question: 'Warum ist ein Trainingskonzept wichtig?',
              options: [
                'Es ist gesetzlich vorgeschrieben',
                'Es sorgt für gleichmäßigen Lernfortschritt bei allen Schülern',
                'Es ersetzt die Trainerkompetenz',
                'Es ist nur bei großen Gruppen nötig',
              ],
              correctIndex: 1,
              explanation: 'Ein durchdachtes Konzept gibt jeder Einheit einen roten Faden und sichert gleichmäßigen Lernfortschritt.',
            },
          ],
        },
      },
      {
        id: 'a2',
        trackId: 'didaktik',
        title: 'Die 4 KO-Kriterien',
        order: 2,
        estimatedMinutes: 12,
        content: `Als Instructor musst du vier Kernkompetenzen erfüllen. Fehlt eine davon, kannst du nicht effektiv unterrichten.

**1. Fachkompetenz**
Du musst die Techniken nicht nur kennen, sondern auf hohem Niveau beherrschen. Schüler merken sofort, wenn ein Instructor eine Technik selbst nicht sauber ausführen kann.

**2. Autorität**
Schüler lernen nur von jemandem, dem sie Respekt entgegenbringen. Autorität entsteht nicht durch Lautstärke oder Dominanz, sondern durch Kompetenz und Haltung.

**3. Positives Denken**
Deine innere Einstellung überträgt sich direkt auf die Gruppe. Negatives, frustriertes oder unmotiviertes Auftreten vergiftet die Trainingsatmosphäre. Komm immer vorbereitet und mental stark.

**4. Lernfähigkeit**
Auch als Instructor lernst du nie aus. Wer aufhört zu lernen, beginnt zu stagnieren. Nutze jede Gelegenheit, dich weiterzuentwickeln — in der Technik, der Methodik und im Business.`,
        keyPoints: [
          'Fachkompetenz: Techniken auf hohem Niveau beherrschen',
          'Autorität: Durch Kompetenz und Haltung, nicht durch Druck',
          'Positives Denken: Deine Einstellung überträgt sich auf die Gruppe',
          'Lernfähigkeit: Auch als Instructor ständig weiterentwickeln',
        ],
        quiz: {
          passingScore: 75,
          questions: [
            {
              id: 'a2q1',
              question: 'Wie entsteht Autorität als Instructor laut M.I. Leitfaden?',
              options: [
                'Durch lautes und dominantes Auftreten',
                'Durch Kompetenz und Haltung',
                'Durch das eigene Gürtelrangsystem',
                'Durch die Anzahl der Trainerjahre',
              ],
              correctIndex: 1,
              explanation: 'Autorität entsteht nicht durch Lautstärke oder Dominanz, sondern durch Kompetenz und Haltung.',
            },
            {
              id: 'a2q2',
              question: 'Warum ist "Positives Denken" ein KO-Kriterium?',
              options: [
                'Weil Schüler positives Denken mögen',
                'Weil deine innere Einstellung sich direkt auf die Gruppe überträgt',
                'Weil der Leitfaden es vorschreibt',
                'Weil es für Marketing wichtig ist',
              ],
              correctIndex: 1,
              explanation: 'Deine innere Einstellung überträgt sich direkt auf die Gruppe — negatives Auftreten vergiftet die Trainingsatmosphäre.',
            },
            {
              id: 'a2q3',
              question: 'Was bedeutet "Lernfähigkeit" als Instructor?',
              options: [
                'Dass du schnell lernst',
                'Dass du dich selbst ständig weiterzuentwickelst',
                'Dass du deinen Schülern das Lernen beibringst',
                'Dass du alle Module bestanden hast',
              ],
              correctIndex: 1,
              explanation: 'Auch als Instructor lernst du nie aus. Wer aufhört zu lernen, beginnt zu stagnieren.',
            },
            {
              id: 'a2q4',
              question: 'Was ist der Unterschied zwischen "Fachkompetenz" und "Lernfähigkeit"?',
              options: [
                'Es gibt keinen — beide bedeuten dasselbe',
                'Fachkompetenz ist der aktuelle Stand, Lernfähigkeit ist die Bereitschaft sich weiterzuentwickeln',
                'Fachkompetenz gilt nur für Techniken, Lernfähigkeit für Business',
                'Lernfähigkeit ist wichtiger als Fachkompetenz',
              ],
              correctIndex: 1,
              explanation: 'Fachkompetenz ist dein aktuelles Niveau. Lernfähigkeit ist die Bereitschaft, dieses Niveau kontinuierlich zu erhöhen.',
            },
          ],
        },
      },
      {
        id: 'a3',
        trackId: 'didaktik',
        title: 'Autoritätsformen',
        order: 3,
        estimatedMinutes: 10,
        content: `Im Training gibt es drei Formen von Autorität, die du als Instructor aufbauen und einsetzen kannst.

**1. Amts-Autorität**
Diese Autorität ergibt sich aus deiner Position und deinem Rang. Als zertifizierter M.I. Instructor hast du eine formale Autorität, die dir von der Organisation verliehen wird. Schüler erkennen und respektieren diese Rolle.

*Wichtig:* Amts-Autorität alleine reicht nicht. Sie ist der Startpunkt, keine Dauerlösung.

**2. Taktile Autorität**
Diese entsteht durch körperliche Kompetenz. Wenn du eine Technik sauber, kraftvoll und präzise demonstrierst, erzeugt das automatisch Respekt. Schüler sehen, dass du es wirklich kannst.

Taktile Autorität ist die stärkste Form im Kampfsport-Kontext, weil sie sich nicht simulieren lässt.

**3. Beispiel-Autorität**
Du lebst vor, was du verlangst. Pünktlichkeit, Vorbereitung, Selbstdisziplin, Respekt gegenüber anderen — das alles beobachten Schüler sehr genau. Wer von Schülern Disziplin einfordert, selbst aber unvorbereitet erscheint, verliert schnell an Glaubwürdigkeit.`,
        keyPoints: [
          'Amts-Autorität: durch offizielle Rolle/Rang als zertifizierter Instructor',
          'Taktile Autorität: durch körperliche Kompetenz und saubere Technikdemonstration',
          'Beispiel-Autorität: du lebst vor, was du von Schülern verlangst',
          'Alle drei Formen ergänzen sich — keine alleine ist ausreichend',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'a3q1',
              question: 'Welche Autoritätsform basiert auf körperlicher Kompetenz und Demonstration?',
              options: ['Amts-Autorität', 'Taktile Autorität', 'Beispiel-Autorität', 'Soziale Autorität'],
              correctIndex: 1,
              explanation: 'Taktile Autorität entsteht durch körperliche Kompetenz. Wenn du eine Technik sauber demonstrierst, erzeugt das automatisch Respekt.',
            },
            {
              id: 'a3q2',
              question: 'Warum reicht Amts-Autorität alleine nicht aus?',
              options: [
                'Weil sie nicht anerkannt wird',
                'Weil sie nur der Startpunkt ist und nicht dauerhaft trägt',
                'Weil sie bei M.I. nicht existiert',
                'Weil Schüler keine Hierarchien akzeptieren',
              ],
              correctIndex: 1,
              explanation: 'Amts-Autorität ist der Startpunkt. Ohne Fachkompetenz und Vorbildfunktion verliert sie schnell ihre Wirkung.',
            },
            {
              id: 'a3q3',
              question: 'Ein Instructor fordert von Schülern Pünktlichkeit, kommt selbst aber oft zu spät. Welche Autoritätsform gefährdet er damit?',
              options: ['Amts-Autorität', 'Taktile Autorität', 'Beispiel-Autorität', 'Alle drei'],
              correctIndex: 2,
              explanation: 'Beispiel-Autorität beruht darauf, dass du vorlebst, was du verlangst. Wer Pünktlichkeit fordert, selbst aber unpünktlich ist, verliert diese Autorität.',
            },
          ],
        },
      },
      {
        id: 'a4',
        trackId: 'didaktik',
        title: 'Lerntypen im Training',
        order: 4,
        estimatedMinutes: 12,
        content: `Menschen nehmen Informationen auf unterschiedliche Wege auf. Als Instructor musst du alle drei Lerntypen ansprechen, um niemanden abzuhängen.

**Auditiver Lerntyp (Hören)**
Dieser Typ lernt am besten durch verbale Erklärungen. Er will verstehen, *warum* eine Technik so funktioniert.
→ Erkläre laut und klar. Nutze Schlüsselwörter. Beschreibe die Bewegung in Worten.

**Visueller Lerntyp (Sehen)**
Dieser Typ muss es sehen, bevor er es versteht. Er orientiert sich an Demonstrationen und Körpersprache.
→ Demonstriere jede Technik sauber und mehrfach. Zeige es aus verschiedenen Winkeln. Nutze visuelle Hilfsmittel.

**Haptischer/Taktiler Lerntyp (Fühlen)**
Dieser Typ lernt am besten durch eigenes Ausprobieren und korrigierende Berührung. Er versteht durch Muskelmemory.
→ Lass ihn früh selbst üben. Korrigiere durch sanfte Körperkontakt-Korrekturen. Gib ihm Zeit für Wiederholungen.

**In der Praxis:** Die meisten Menschen sind eine Mischung aus zwei Typen. Als guter Instructor sprichst du in jeder Einheit alle drei Kanäle an — erkläre, demonstriere, lass üben.`,
        keyPoints: [
          'Auditiv: lernt durch Erklärungen und Beschreibungen',
          'Visuell: lernt durch Demonstration und Beobachtung',
          'Haptisch/Taktil: lernt durch Ausprobieren und körperliche Korrektur',
          'Sprich in jeder Einheit alle drei Lerntypen an',
          'Meisten Menschen sind eine Mischung aus zwei Typen',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'a4q1',
              question: 'Wie lernst du einen haptischen Lerntyp am effektivsten?',
              options: [
                'Durch ausführliche verbale Erklärung',
                'Durch mehrfache Demonstration aus verschiedenen Winkeln',
                'Durch frühes Ausprobieren und körperliche Korrektur',
                'Durch Lesen des Curriculums',
              ],
              correctIndex: 2,
              explanation: 'Haptische Lerntypen lernen durch Muskelmemory — sie brauchen eigene Übung und korrigierende Berührung.',
            },
            {
              id: 'a4q2',
              question: 'Ein Schüler versteht eine Technik erst, nachdem du sie aus drei verschiedenen Winkeln gezeigt hast. Welcher Lerntyp ist er wahrscheinlich?',
              options: ['Auditiv', 'Visuell', 'Haptisch', 'Keiner davon'],
              correctIndex: 1,
              explanation: 'Visuelle Lerntypen brauchen Demonstrationen und orientieren sich an dem, was sie sehen.',
            },
            {
              id: 'a4q3',
              question: 'Wie sollte ein guter Instructor mit Lerntypen umgehen?',
              options: [
                'Den dominanten Lerntyp der Gruppe identifizieren und nur den bedienen',
                'Alle drei Kanäle in jeder Einheit ansprechen',
                'Lerntypen ignorieren — alle lernen gleich',
                'Lerntypen-Tests vor dem Training durchführen',
              ],
              correctIndex: 1,
              explanation: 'In jeder Einheit alle drei Kanäle ansprechen — erklären, demonstrieren, üben lassen — sichert, dass niemand abgehängt wird.',
            },
          ],
        },
      },
      {
        id: 'a5',
        trackId: 'didaktik',
        title: 'Die Erklärungs-Matrix',
        order: 5,
        estimatedMinutes: 15,
        content: `Die Erklärungs-Matrix ist das Kernwerkzeug für strukturierte Technikvermittlung. Sie besteht aus vier Schritten, die immer in dieser Reihenfolge durchgeführt werden.

**Schritt 1: WAS**
Nenne klar, was du gleich zeigst. Gib der Technik einen Namen und erkläre kurz ihren Kontext.
Beispiel: *"Wir üben jetzt den Außenblock gegen einen geraden Angriff."*

**Schritt 2: WIE**
Demonstriere die Technik langsam und klar, Schritt für Schritt. Erkläre dabei jeden Bewegungsabschnitt.
Beispiel: *"Arm geht nach außen, Hüfte dreht mit, Gewicht bleibt hinten."*

**Schritt 3: WARUM**
Erkläre die Logik hinter der Technik. Warum genau so? Was passiert, wenn man es anders macht?
Beispiel: *"Das Mitdrehen der Hüfte verdoppelt die Kraft und schützt gleichzeitig deine Mittellinie."*

**Schritt 4: ROLLENTAUSCH**
Der Schüler erklärt dir die Technik zurück — oder demonstriert sie, während er erklärt. Das verfestigt das Verständnis und zeigt dir, was er wirklich verstanden hat.
Beispiel: *"Zeig mir die Technik und erkläre mir, was du dabei tust."*

**Warum dieser Ablauf?**
Jeder Schritt hat eine andere Funktion: Orientierung geben (WAS) → Muskelmemory aufbauen (WIE) → Verständnis vertiefen (WARUM) → Wissen verankern (ROLLENTAUSCH).`,
        keyPoints: [
          'WAS: Technik benennen und kontextualisieren',
          'WIE: Schrittweise demonstrieren und erklären',
          'WARUM: Logik und Wirkungsweise erklären',
          'ROLLENTAUSCH: Schüler erklärt/demonstriert zurück',
          'Immer in dieser Reihenfolge — keine Schritte überspringen',
        ],
        quiz: {
          passingScore: 75,
          questions: [
            {
              id: 'a5q1',
              question: 'Was ist der Zweck des ROLLENTAUSCH-Schritts?',
              options: [
                'Zeitersparnis im Training',
                'Wissen durch Rückerklärung verankern und Verständnis prüfen',
                'Schüler zu motivieren',
                'Fehler des Instructors zu korrigieren',
              ],
              correctIndex: 1,
              explanation: 'Beim Rollentausch erklärt der Schüler die Technik zurück. Das verankert das Wissen und zeigt dir, was wirklich verstanden wurde.',
            },
            {
              id: 'a5q2',
              question: 'In welchem Schritt erklärst du die Logik und den Nutzen einer Technik?',
              options: ['WAS', 'WIE', 'WARUM', 'ROLLENTAUSCH'],
              correctIndex: 2,
              explanation: 'Im WARUM-Schritt erklärst du, wieso die Technik genau so funktioniert und was passiert, wenn man sie anders ausführt.',
            },
            {
              id: 'a5q3',
              question: 'Du erklärst eine Technik und beginnst sofort mit der Demonstration ohne vorher zu sagen, was du zeigst. Welchen Schritt hast du übersprungen?',
              options: ['WAS', 'WIE', 'WARUM', 'ROLLENTAUSCH'],
              correctIndex: 0,
              explanation: 'Der WAS-Schritt gibt Orientierung. Ohne ihn wissen Schüler nicht, worauf sie achten sollen.',
            },
            {
              id: 'a5q4',
              question: 'Warum ist die Reihenfolge WAS → WIE → WARUM → ROLLENTAUSCH wichtig?',
              options: [
                'Sie ist nicht wichtig — die Reihenfolge kann variieren',
                'Jeder Schritt hat eine andere Funktion, die auf dem vorherigen aufbaut',
                'Weil es im Leitfaden so steht',
                'Nur bei komplexen Techniken relevant',
              ],
              correctIndex: 1,
              explanation: 'Jeder Schritt hat eine spezifische Funktion: Orientierung → Muskelmemory → Verständnis → Verankerung. Die Reihenfolge ist nicht zufällig.',
            },
          ],
        },
      },
      {
        id: 'a6',
        trackId: 'didaktik',
        title: 'Die Übungs-Matrix',
        order: 6,
        estimatedMinutes: 12,
        content: `Die Übungs-Matrix beschreibt, wie eine Technik nach der Erklärung systematisch trainiert wird. Sie hat drei Stufen.

**Stufe 1: ZERLEGT**
Die Technik wird in ihre Einzelteile aufgesplittet. Jeder Teil wird einzeln geübt, langsam und bewusst.
→ Ziel: Saubere Grundform, keine schlechten Gewohnheiten einüben.
Beispiel: Erst nur die Armbewegung, dann nur die Hüftrotation, dann erst kombiniert.

**Stufe 2: KOMBINIERT**
Die Einzelteile werden zur vollständigen Technik zusammengesetzt. Das Tempo steigert sich graduell.
→ Ziel: Flüssige Ausführung der Gesamttechnik.
Beispiel: Block + Gegenangriff in einer Bewegung, zunächst langsam dann schneller.

**Stufe 3: IMPROVISIERT**
Die Technik wird in variierenden Szenarien eingesetzt. Schüler reagieren auf unvorhergesehene Angriffe.
→ Ziel: Belastungsresistenz — die Technik funktioniert auch unter Druck.
Beispiel: Freies Sparring-Szenario wo die Technik angewendet werden muss.

**Wichtig:** Niemals zu schnell von Stufe zu Stufe springen. Schüler, die Stufe 1 nicht sauber beherrschen, bauen auf schlechten Grundlagen auf.`,
        keyPoints: [
          'ZERLEGT: Technik in Einzelteile aufteilen, langsam und bewusst üben',
          'KOMBINIERT: Einzelteile zur Gesamttechnik zusammensetzen, Tempo steigern',
          'IMPROVISIERT: Technik in variierenden Szenarien anwenden',
          'Nur zur nächsten Stufe, wenn die aktuelle sauber beherrscht wird',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'a6q1',
              question: 'Warum beginnt die Übungs-Matrix mit ZERLEGT statt direkt mit der vollständigen Technik?',
              options: [
                'Um Zeit zu sparen',
                'Um saubere Grundform zu sichern und schlechte Gewohnheiten zu vermeiden',
                'Weil Schüler überfordert werden würden',
                'Weil es im Curriculum so vorgeschrieben ist',
              ],
              correctIndex: 1,
              explanation: 'Durch das Zerteilen können einzelne Bewegungsabschnitte gezielt korrigiert werden, bevor schlechte Gewohnheiten entstehen.',
            },
            {
              id: 'a6q2',
              question: 'In welcher Stufe reagiert der Schüler auf unvorhergesehene Angriffe?',
              options: ['ZERLEGT', 'KOMBINIERT', 'IMPROVISIERT', 'In keiner — das ist Sparring'],
              correctIndex: 2,
              explanation: 'IMPROVISIERT bedeutet: die Technik in variierenden, unvorhersehbaren Szenarien anwenden — das trainiert Belastungsresistenz.',
            },
            {
              id: 'a6q3',
              question: 'Was ist das Ziel der Stufe KOMBINIERT?',
              options: [
                'Die Technik in Stresssituationen anwenden',
                'Flüssige Ausführung der Gesamttechnik',
                'Fehler des Schülers identifizieren',
                'Das Tempo maximal steigern',
              ],
              correctIndex: 1,
              explanation: 'In der KOMBINIERT-Stufe werden die Einzelteile zur vollständigen Technik zusammengesetzt — mit graduell steigendem Tempo.',
            },
          ],
        },
      },
      {
        id: 'a7',
        trackId: 'didaktik',
        title: 'Center Operations',
        order: 7,
        estimatedMinutes: 15,
        content: `Als Instructor bist du verantwortlich für den reibungslosen Ablauf des Centers. Das beinhaltet konkrete Aufgaben vor, während und nach dem Training.

**Vor dem Training:**
- Trainingsraum öffnen und lüften
- Matten und Ausrüstung auf Sauberkeit und Sicherheit prüfen
- Anwesenheitsliste vorbereiten
- Trainingsplan für die Einheit festlegen
- Eigene Ausrüstung vorbereiten

**Während des Trainings:**
- Pünktlicher Start und Ende (Zeitdisziplin)
- Auf Check-ins der Schüler reagieren
- Sicherheit der Schüler im Auge behalten
- Anwesenheit dokumentieren
- Bei Verletzungen: First Aid Kit nutzen, Vorfall dokumentieren

**Nach dem Training:**
- Matten und Ausrüstung reinigen
- Trainingsraum in Ausgangszustand versetzen
- Feedback-Runde mit Schülern (optional, aber empfohlen)
- Trainingsdokumentation aktualisieren (App)
- Sicherheitsprüfung vor dem Schließen

**Schließen des Centers:**
- Alle Fenster und Türen schließen
- Elektrische Geräte ausschalten
- Alarm aktivieren (sofern vorhanden)
- Schlüssel sichern`,
        keyPoints: [
          'Vor Training: Sicherheitsprüfung, Vorbereitung, Trainingsplan',
          'Während Training: Pünktlichkeit, Sicherheit, Dokumentation',
          'Nach Training: Reinigung, Feedback, App-Dokumentation',
          'Schließen: Sicherheitsroutine vollständig durchführen',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'a7q1',
              question: 'Was gehört zu den Pflichten vor dem Training?',
              options: [
                'Anwesenheitsliste ausfüllen und Schüler auswerten',
                'Matten prüfen, Trainingsplan festlegen und Ausrüstung vorbereiten',
                'Feedback-Runde durchführen',
                'Center abschließen und Alarm aktivieren',
              ],
              correctIndex: 1,
              explanation: 'Vor dem Training: Raum öffnen, Ausrüstung prüfen, Anwesenheitsliste vorbereiten, Trainingsplan festlegen.',
            },
            {
              id: 'a7q2',
              question: 'Was ist bei einer Verletzung während des Trainings zu tun?',
              options: [
                'Training sofort abbrechen und alle nach Hause schicken',
                'First Aid Kit nutzen und den Vorfall dokumentieren',
                'Den Schüler bitten, nächstes Mal vorsichtiger zu sein',
                'Training weitermachen — kleine Verletzungen ignorieren',
              ],
              correctIndex: 1,
              explanation: 'Bei Verletzungen: First Aid Kit nutzen und den Vorfall dokumentieren. Dokumentation ist rechtlich wichtig.',
            },
          ],
        },
      },
      {
        id: 'a8',
        trackId: 'didaktik',
        title: 'Hausordnung & Trainingsregeln',
        order: 8,
        estimatedMinutes: 8,
        content: `Eine klare Hausordnung schützt alle Beteiligten und schafft eine professionelle Trainingsumgebung.

**Allgemeine Regeln:**
- Pünktlichkeit (Training beginnt ohne Wartezeit)
- Saubere Sportkleidung und Hygiene (Nägel kurz, kein Schmuck)
- Gegenseitiger Respekt — kein verbaler oder körperlicher Missbrauch
- Handys während des Trainings auf lautlos und weggelegt
- Alkohol oder Drogen: sofortiger Ausschluss

**Sicherheitsregeln:**
- Anweisungen des Instructors ohne Diskussion befolgen
- Verletzungen sofort melden
- Bei Unsicherheit zur Technikausführung: nachfragen, nicht raten
- Auf das Sicherheitswort / Abklopfzeichen achten

**Kommunikation:**
- Respektvoller Umgang auch außerhalb des Trainings (Social Media, etc.)
- Probleme direkt und konstruktiv ansprechen
- Keine Gerüchte oder negative Stimmung im Center verbreiten

**Konsequenzen bei Verstößen:**
- 1. Verstoß: Ermahnung
- 2. Verstoß: Gespräch mit dem Head Instructor
- 3. Verstoß: Ausschluss vom Training`,
        keyPoints: [
          'Pünktlichkeit, Hygiene, Respekt sind nicht verhandelbar',
          'Handys weg, kein Alkohol/Drogen — sofortiger Ausschluss bei Verstoß',
          'Verletzungen sofort melden, Anweisungen ohne Diskussion befolgen',
          '3-Stufen-System bei Verstößen: Ermahnung → Gespräch → Ausschluss',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'a8q1',
              question: 'Was passiert beim ersten Regelverstoß laut dem 3-Stufen-System?',
              options: [
                'Ausschluss vom Training',
                'Gespräch mit Head Instructor',
                'Ermahnung',
                'Nichts — ein Verstoß wird ignoriert',
              ],
              correctIndex: 2,
              explanation: 'Das 3-Stufen-System: 1. Ermahnung → 2. Gespräch mit Head Instructor → 3. Ausschluss.',
            },
            {
              id: 'a8q2',
              question: 'Welche Situation führt zum sofortigen Ausschluss?',
              options: [
                'Zu spät kommen',
                'Handy klingelt einmal',
                'Alkohol oder Drogen',
                'Vergessene Sportausrüstung',
              ],
              correctIndex: 2,
              explanation: 'Alkohol oder Drogen im Training führen zum sofortigen Ausschluss — keine Ausnahmen.',
            },
          ],
        },
      },
    ],
  },

  // ==========================================
  // TRACK B: TECHNISCHE INHALTE
  // ==========================================
  {
    id: 'technik',
    title: 'Technische Inhalte',
    icon: '🥋',
    description: 'JKD-Prinzipien, Kampfstrategien, Schlüsselpositionen und rechtliche Grundlagen für Instructoren.',
    lessons: [
      {
        id: 'b1',
        trackId: 'technik',
        title: 'JKD-Prinzipien & 4 Kampfprinzipien',
        order: 1,
        estimatedMinutes: 15,
        content: `Jeet Kune Do (JKD) ist keine starre Stilrichtung, sondern eine Philosophie des direkten Ausdrucks in der Kampfkunst. Als Instructor musst du diese Grundlage verstehen und vermitteln können.

**Die JKD-Philosophie:**
- "Absorb what is useful, discard what is useless, add what is specifically your own" — Bruce Lee
- Keine dogmatischen Stile, sondern funktionale Effektivität
- Ständige Anpassung an den Gegner und die Situation

**Die 4 Kampfprinzipien im M.I. System:**

**1. Direktheit**
Der kürzeste Weg zwischen zwei Punkten ist eine gerade Linie. Angriffe und Verteidigungen sind direkt und ohne Umwege. Keine verschwendeten Bewegungen.

**2. Einfachheit**
Komplexe Techniken versagen unter Stress. Das M.I. System bevorzugt einfache, effektive Bewegungen, die auch unter Druck abrufbar sind.

**3. Simultanität**
Blockieren und Kontern passieren gleichzeitig — nicht nacheinander. Das spart Zeit und erhöht die Effizienz.

**4. Anpassungsfähigkeit**
Kein Plan übersteht den ersten Kontakt. Der M.I. Kämpfer passt sich dynamisch an die Situation an.`,
        keyPoints: [
          'JKD ist eine Philosophie, kein starrer Stil',
          'Direktheit: kürzester Weg, keine verschwendeten Bewegungen',
          'Einfachheit: einfache Techniken funktionieren unter Stress',
          'Simultanität: Blocken und Kontern gleichzeitig',
          'Anpassungsfähigkeit: dynamisch auf die Situation reagieren',
        ],
        quiz: {
          passingScore: 75,
          questions: [
            {
              id: 'b1q1',
              question: 'Was bedeutet "Simultanität" als Kampfprinzip?',
              options: [
                'Zwei Angriffe gleichzeitig ausführen',
                'Blocken und Kontern passieren gleichzeitig',
                'Beide Hände gleichzeitig einsetzen',
                'Mit einem Partner gleichzeitig trainieren',
              ],
              correctIndex: 1,
              explanation: 'Simultanität bedeutet: Blockieren und Kontern passieren in einer Bewegung, nicht nacheinander — das spart Zeit.',
            },
            {
              id: 'b1q2',
              question: 'Warum bevorzugt das M.I. System einfache Techniken?',
              options: [
                'Weil sie leichter zu lernen sind',
                'Weil sie auch unter Stress und Druck abrufbar bleiben',
                'Weil komplexe Techniken verboten sind',
                'Weil einfach = schnell',
              ],
              correctIndex: 1,
              explanation: 'Komplexe Techniken versagen unter Stress. Einfache Bewegungen sind zuverlässig auch in echten Konfliktsituationen.',
            },
            {
              id: 'b1q3',
              question: 'Was beschreibt JKD am besten?',
              options: [
                'Ein starrer Kampfstil mit festen Regeln',
                'Eine Philosophie des direkten, anpassungsfähigen Ausdrucks',
                'Das gleiche wie Kickboxen',
                'Eine japanische Kampfkunst',
              ],
              correctIndex: 1,
              explanation: 'JKD ist keine starre Stilrichtung — es ist eine Philosophie der funktionalen Effektivität und ständigen Anpassung.',
            },
          ],
        },
      },
      {
        id: 'b2',
        trackId: 'technik',
        title: '5 Strategien & Kampfdistanzen',
        order: 2,
        estimatedMinutes: 15,
        content: `Effektives Kampfen erfordert ein Verständnis für Distanz und Strategie. Als Instructor musst du diese Konzepte klar erklären können.

**Die 5 M.I. Strategien:**

**1. Präventionsstrategie**
Den Konflikt verhindern, bevor er entsteht. Körpersprache, Deeskalation, Flucht.

**2. Distanzstrategie**
Die richtige Distanz kontrollieren — weder zu nah noch zu weit. Wer die Distanz kontrolliert, kontrolliert den Kampf.

**3. Defensivstrategie**
Angriffe abwehren, kontern, abwehren. Reaktiv, aber effizient.

**4. Offensivstrategie**
Initiative übernehmen, angreifen, Gegner auf den hinteren Fuß bringen.

**5. Kombinationsstrategie**
Strategien situationsabhängig kombinieren und wechseln.

**Die Kampfdistanzen:**

| Distanz | Bezeichnung | Typische Techniken |
|---------|-------------|---------------------|
| Außendistanz | Kicking Range | Tritte, lange Schläge |
| Mitteldistanz | Punching Range | Schläge, kurze Tritte |
| Nahkampfdistanz | Trapping Range | Ellbogen, Knie, Trapping |
| Bodenkampf | Grappling Range | Würgegriffe, Hebel |`,
        keyPoints: [
          '5 Strategien: Prävention → Distanz → Defensiv → Offensiv → Kombination',
          'Wer die Distanz kontrolliert, kontrolliert den Kampf',
          '4 Kampfdistanzen: Kicking, Punching, Trapping, Grappling',
          'Distanzwechsel ist eine strategische Entscheidung',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'b2q1',
              question: 'In welcher Distanz sind Ellbogen und Knie die effektivsten Werkzeuge?',
              options: ['Kicking Range', 'Punching Range', 'Trapping Range', 'Grappling Range'],
              correctIndex: 2,
              explanation: 'Die Trapping Range (Nahkampfdistanz) ist der Bereich für Ellbogen, Knie und Trapping-Techniken.',
            },
            {
              id: 'b2q2',
              question: 'Was ist das Ziel der Präventionsstrategie?',
              options: [
                'Den Gegner präventiv anzugreifen',
                'Den Konflikt verhindern, bevor er entsteht',
                'Defensiv zu bleiben und abzuwarten',
                'Die Distanz zu kontrollieren',
              ],
              correctIndex: 1,
              explanation: 'Prävention bedeutet: Konflikt verhindern durch Deeskalation, Körpersprache und wenn möglich Flucht.',
            },
          ],
        },
      },
      {
        id: 'b3',
        trackId: 'technik',
        title: 'Schlüsselpositionen 1-10',
        order: 3,
        estimatedMinutes: 20,
        content: `Die 10 Schlüsselpositionen bilden das Rückgrat des M.I. Streetdefense-Systems. Als Instructor musst du alle 10 Positionen perfekt beherrschen und erklären können.

**Schlüsselposition 1: Neutrale Position**
Alltägliche Körperhaltung — keine kampfbereite Haltung. Dient der Deeskalation und Unvoreingenommenheit.

**Schlüsselposition 2: Ready Position**
Kampfbereite Grundhaltung. Füße schulterbreit, dominanter Fuß hinten, Hände auf Brusthöhe.

**Schlüsselposition 3: Defensive Guard**
Erhöhte Deckung, Kinn gesenkt, Körper leicht rotiert. Minimiert Trefferfläche.

**Schlüsselposition 4: Offensive Guard**
Aggressive Vorwärtsbewegung, Gewicht vorne, bereit für Schlag.

**Schlüsselposition 5: Clinch**
Nahkampf-Kontrollposition, Körper-an-Körper. Ermöglicht Knie, Würfe, Kontrolle.

**Schlüsselpositionen 6-10:** (Technical — Hebelkette Stand & Boden)
Kontrollpositionen für Hebeltechniken, Würfe und Bodenkampf-Übergänge.

*Detaillierte Ausführung der Positionen 6-10 wird in der Praxis vermittelt.*`,
        keyPoints: [
          'SP1: Neutral — alltäglich, deeskalierend',
          'SP2: Ready — kampfbereit, Grundstellung',
          'SP3: Defensive Guard — minimale Trefferfläche',
          'SP4: Offensive Guard — Angriffsvorbereitung',
          'SP5: Clinch — Nahkampfkontrolle',
          'SP6-10: Hebelkette und Bodenkampf-Übergänge',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'b3q1',
              question: 'Warum beginnt das System mit der Neutralen Position (SP1)?',
              options: [
                'Weil sie die einfachste Position ist',
                'Weil Deeskalation vor Eskalation kommt und die neutrale Haltung Konflikte vermeiden kann',
                'Weil sie im Bodenkampf wichtig ist',
                'Weil Anfänger damit beginnen müssen',
              ],
              correctIndex: 1,
              explanation: 'Die Neutrale Position unterstützt Deeskalation. Sie zeigt keine Aggressivität und lässt Konflikte oft gar nicht eskalieren.',
            },
            {
              id: 'b3q2',
              question: 'Was unterscheidet SP3 (Defensive Guard) von SP4 (Offensive Guard)?',
              options: [
                'Der Fußstand',
                'SP3 minimiert Trefferfläche, SP4 ist für Angriffsvorbereitung ausgerichtet',
                'Die Handposition',
                'SP4 ist nur für fortgeschrittene Schüler',
              ],
              correctIndex: 1,
              explanation: 'Defensive Guard schützt durch minimale Trefferfläche. Offensive Guard positioniert dich für einen Angriff.',
            },
          ],
        },
      },
      {
        id: 'b4',
        trackId: 'technik',
        title: 'Hebelkette Stand & Boden',
        order: 4,
        estimatedMinutes: 20,
        content: `Die Hebelkette umfasst 60 Techniken, die systematisch im Stand- und Bodenkampf eingesetzt werden. Als Instructor musst du die Grundstruktur erklären und die Schlüsseltechniken demonstrieren können.

**Aufbau der Hebelkette:**
Die 60 Techniken sind in logischen Ketten aufgebaut — jede Technik führt zur nächsten, abhängig von der Reaktion des Gegners.

**Stand-Techniken (Auswahl):**
- Außenblock mit Konter
- Armhebel aus dem Clinch
- Würfe und Takedown-Einleitungen
- Kinn-Kontrollgriff

**Boden-Techniken (Auswahl):**
- Mount-Control
- Guard-Positionen
- Arm Triangle
- Rear Naked Choke (RNC)
- Heel Hook (nur in kontrollierten Trainingsumgebungen)

**Wichtig beim Lehren:**
- Immer mit einem Partner üben, nie alleine
- Sicherheits-Abklopfzeichen klar kommunizieren
- Langsam beginnen — Schnelligkeit kommt mit Erfahrung
- Bei Würgetechniken: Druck sofort loslassen wenn abgeklopft wird`,
        keyPoints: [
          '60 Techniken in logischen Ketten aufgebaut',
          'Stand: Außenblöcke, Armhebel, Würfe, Kontrollen',
          'Boden: Mount, Guard, Würgetechniken',
          'Abklopfzeichen klar kommunizieren — sofortige Reaktion',
          'Sicherheit hat absoluten Vorrang beim Lehren',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'b4q1',
              question: 'Was ist beim Lehren von Würgetechniken die wichtigste Regel?',
              options: [
                'Nur fortgeschrittene Schüler dürfen dabei zuschauen',
                'Das Abklopfzeichen klar kommunizieren und sofort loslassen wenn es gegeben wird',
                'Würgetechniken erst ab Tactical Level zeigen',
                'Immer Schutzausrüstung tragen',
              ],
              correctIndex: 1,
              explanation: 'Das Abklopfzeichen ist das Sicherheitssignal — sofortige Reaktion darauf ist nicht verhandelbar.',
            },
            {
              id: 'b4q2',
              question: 'Wie ist die Hebelkette strukturiert?',
              options: [
                'Zufällig — Techniken werden situativ gewählt',
                'In logischen Ketten, wo jede Technik zur nächsten führt abhängig von der Reaktion des Gegners',
                'Alphabetisch nach Technikname',
                'Nach Schwierigkeitsgrad, von leicht zu schwer',
              ],
              correctIndex: 1,
              explanation: 'Die Hebelkette ist so aufgebaut, dass jede Technik die nächste einleitet — abhängig davon, wie der Gegner reagiert.',
            },
          ],
        },
      },
      {
        id: 'b5',
        trackId: 'technik',
        title: 'Relevante Gesetze (Notwehr & Co.)',
        order: 5,
        estimatedMinutes: 18,
        content: `Als M.I. Instructor bist du verpflichtet, deine Schüler über die rechtlichen Grenzen der Selbstverteidigung aufzuklären. Unwissenheit schützt nicht vor Strafe.

**§32 StGB — Notwehr**
"Wer eine Tat begeht, die durch Notwehr geboten ist, handelt nicht rechtswidrig."
Notwehr ist die Verteidigung gegen einen gegenwärtigen, rechtswidrigen Angriff.
- *Gegenwärtig:* Der Angriff findet gerade statt (nicht in der Vergangenheit oder Zukunft)
- *Rechtswidrig:* Der Angreifer hat kein Recht dazu

**§33 StGB — Notwehrexzess**
Überschreitung der Notwehr aus Verwirrung, Furcht oder Schrecken. Kann strafmildernd wirken.

**§34 StGB — Rechtfertigender Notstand**
Gefahr für sich oder andere abwenden — auch wenn dabei ein (geringeres) Rechtsgut verletzt wird.

**§223/224 StGB — Körperverletzung**
Auch Selbstverteidigung kann zur Körperverletzung werden, wenn sie unverhältnismäßig ist. Verhältnismäßigkeit ist entscheidend.

**§226 StGB — Schwere Körperverletzung**
Permanente Schäden (Verlust eines Sinnesorgans, bleibende Entstellung). Besondere Vorsicht bei Techniken, die dies verursachen können.

**§323c StGB — Unterlassene Hilfeleistung**
Wer Hilfe leisten kann und es nicht tut, macht sich strafbar.

**Wichtig für Schüler zu verstehen:**
Verhältnismäßigkeit ist der Schlüsselbegriff. Die Abwehr darf nicht stärker sein als der Angriff es erfordert.`,
        keyPoints: [
          '§32: Notwehr — gegenwärtiger, rechtswidriger Angriff',
          '§33: Notwehrexzess — Überschreitung aus Panik kann strafmildernd sein',
          '§34: Rechtfertigender Notstand',
          '§223/224: Körperverletzung — Verhältnismäßigkeit beachten',
          '§323c: Hilfeleistungspflicht bei Unfällen',
          'Verhältnismäßigkeit ist der Schlüsselbegriff',
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'b5q1',
              question: 'Was macht einen Angriff zu einem Notwehr-Fall nach §32 StGB?',
              options: [
                'Der Angreifer ist größer und stärker',
                'Der Angriff ist gegenwärtig und rechtswidrig',
                'Der Angegriffene hatte keine andere Wahl',
                'Es gibt Zeugen',
              ],
              correctIndex: 1,
              explanation: 'Notwehr nach §32 erfordert: der Angriff ist gegenwärtig (findet gerade statt) und rechtswidrig (der Angreifer hat kein Recht dazu).',
            },
            {
              id: 'b5q2',
              question: 'Was ist "Verhältnismäßigkeit" in der Notwehr-Situation?',
              options: [
                'Die Gegenwehr darf nicht stärker sein als der Angriff es erfordert',
                'Man darf sich nur mit gleichen Mitteln wehren',
                'Verhältnismäßigkeit gilt nur bei Waffen',
                'Man muss zuerst fliehen versuchen',
              ],
              correctIndex: 0,
              explanation: 'Verhältnismäßigkeit bedeutet: Die Abwehr darf nicht unverhältnismäßig stärker sein als der Angriff. Das ist der Kern-Beurteilungsmaßstab.',
            },
            {
              id: 'b5q3',
              question: 'Was regelt §323c StGB?',
              options: [
                'Schwere Körperverletzung',
                'Notwehr',
                'Unterlassene Hilfeleistung',
                'Notwehrexzess',
              ],
              correctIndex: 2,
              explanation: '§323c StGB: Wer einem Verletzten Hilfe leisten kann und es nicht tut, macht sich der unterlassenen Hilfeleistung strafbar.',
            },
            {
              id: 'b5q4',
              question: 'Warum muss ein M.I. Instructor seine Schüler über Notwehrrecht aufklären?',
              options: [
                'Weil es vorgeschrieben ist',
                'Damit Schüler die rechtlichen Grenzen kennen und nicht versehentlich zu weit gehen',
                'Damit Schüler die Polizei besser informieren können',
                'Das ist keine Aufgabe des Instructors',
              ],
              correctIndex: 1,
              explanation: 'Schüler müssen wissen, wo die rechtlichen Grenzen der Selbstverteidigung liegen — Unwissenheit schützt nicht vor Strafe.',
            },
          ],
        },
      },
      {
        id: 'b6',
        trackId: 'technik',
        title: 'Stop The Bleed — Erste Hilfe im Training',
        order: 6,
        estimatedMinutes: 12,
        content: `Als Instructor trägst du Verantwortung für die Sicherheit deiner Schüler. Das "Stop The Bleed"-Konzept ist ein US-amerikanisches Erste-Hilfe-Programm, das sich auf Blutstillungsmaßnahmen konzentriert.

**Grundprinzip:**
Unkontrollierte Blutungen sind die häufigste vermeidbare Todesursache nach einem Trauma. Mit den richtigen Kenntnissen kann jeder in den ersten Minuten Leben retten.

**Die 3 wichtigsten Maßnahmen:**

**1. Tourniquet anlegen**
Bei starken Blutungen an Armen oder Beinen: Tourniquet oberhalb der Wunde anlegen und fest zuziehen. Zeit notieren. Nicht wieder lockern.

**2. Wunde packen und drücken (Wound Packing)**
Bei Wunden, wo kein Tourniquet möglich ist (Leiste, Achselhöhle): Mit Verbandsmaterial fest ausfüllen und Druck ausüben.

**3. Direkte Wundkompression**
Feste, dauerhafte Kompression auf die Wunde ausüben bis Rettungsdienst eintrifft.

**Im Trainingskontext:**
- First Aid Kit immer griffbereit haben
- Inhalt regelmäßig prüfen (Datum, Vollständigkeit)
- Notfallnummern bekannt: 112 (Europa), Standort des Centers kennen
- Jeden Vorfall dokumentieren

**M.I. empfiehlt:** Alle Instructoren absolvieren einen "Stop The Bleed"-Kurs (ca. 2 Stunden).`,
        keyPoints: [
          'Unkontrollierte Blutungen sind die häufigste vermeidbare Todesursache',
          'Tourniquet: oberhalb der Wunde, fest, Zeit notieren',
          'Wound Packing: bei Wunden wo kein Tourniquet möglich',
          'Direkte Kompression bis Rettungsdienst kommt',
          'First Aid Kit immer griffbereit und geprüft',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'b6q1',
              question: 'Wo wird ein Tourniquet angelegt?',
              options: [
                'Direkt auf der Wunde',
                'Unterhalb der Wunde',
                'Oberhalb der Wunde',
                'Möglichst weit von der Wunde entfernt',
              ],
              correctIndex: 2,
              explanation: 'Das Tourniquet wird oberhalb der Wunde angelegt, um den Blutfluss zur Wunde zu unterbrechen.',
            },
            {
              id: 'b6q2',
              question: 'Wann nutzt man Wound Packing statt eines Tourniquets?',
              options: [
                'Wenn kein Tourniquet vorhanden ist',
                'Bei Wunden an Stellen wo kein Tourniquet möglich ist (z.B. Leiste, Achselhöhle)',
                'Nur bei kleinen Wunden',
                'Bei allen Wunden — Wound Packing ist immer vorzuziehen',
              ],
              correctIndex: 1,
              explanation: 'Wound Packing ist für Körperstellen geeignet, wo ein Tourniquet nicht angelegt werden kann (Leiste, Achselhöhle).',
            },
          ],
        },
      },
    ],
  },

  // ==========================================
  // TRACK C: BUSINESS & VERTRIEB
  // ==========================================
  {
    id: 'business',
    title: 'Business & Vertrieb',
    icon: '💼',
    description: 'Interessentengewinnung, Verkaufsgespräche, Vertragsabschluss und Community-Aufbau.',
    lessons: [
      {
        id: 'c1',
        trackId: 'business',
        title: 'Interessenten-Gewinnung',
        order: 1,
        estimatedMinutes: 12,
        content: `Jeder Instructor trägt Verantwortung für das Wachstum seines Centers. Interessenten-Gewinnung ist keine Aufgabe von Marketing-Spezialisten alleine.

**Die 2 Ziele der Interessenten-Gewinnung:**

**Ziel 1: Probetraining buchen**
Das erste konkrete Ziel ist immer, den Interessenten für ein Probetraining zu gewinnen. Nicht verkaufen — erst einladen.

**Ziel 2: Lead generieren**
Wer sich nicht sofort für ein Probetraining entscheidet: Kontaktdaten + Erlaubnis zum Nachfassen sichern.

**Wege zur Interessenten-Gewinnung:**
- Persönliche Weiterempfehlung (stärkster Kanal — aktiviere deine Schüler)
- Social Media (Instagram, TikTok — Techniken zeigen, Persönlichkeit zeigen)
- Events und Schnupperkurse
- Kooperationen (Fitnessstudios, Schulen, Vereine)
- Online-Bewertungen (Google, Facebook)

**Der M.I. Ansatz:**
Wir verkaufen nicht "Kampfsport" — wir verkaufen Sicherheit, Selbstbewusstsein und Community. Das ist das Ergebnis, das Menschen wirklich wollen.`,
        keyPoints: [
          'Ziel 1: Probetraining buchen — nicht sofort verkaufen',
          'Ziel 2: Lead sichern wenn kein Probetraining möglich',
          'Stärkster Kanal: persönliche Weiterempfehlung durch Schüler',
          'M.I. verkauft das Ergebnis: Sicherheit, Selbstbewusstsein, Community',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'c1q1',
              question: 'Was ist das primäre Ziel beim ersten Kontakt mit einem Interessenten?',
              options: [
                'Einen Vertrag abschließen',
                'Ein Probetraining buchen',
                'Die Preise erklären',
                'Die Module vorstellen',
              ],
              correctIndex: 1,
              explanation: 'Das erste Ziel ist immer: das Probetraining buchen. Noch kein Verkauf — erst einladen.',
            },
            {
              id: 'c1q2',
              question: 'Was verkauft M.I. laut dem PREMIUM-Prinzip wirklich?',
              options: [
                'Kampfsport und Selbstverteidigungstechniken',
                'Das Ergebnis: Sicherheit, Selbstbewusstsein und Community',
                'Mitgliedschaften und Trainingszeiten',
                'Gürtel und Zertifikate',
              ],
              correctIndex: 1,
              explanation: 'M.I. verkauft das Ergebnis — nicht den Sport. Menschen wollen Sicherheit, Selbstbewusstsein und eine starke Community.',
            },
          ],
        },
      },
      {
        id: 'c2',
        trackId: 'business',
        title: 'Probeschüler-Typen',
        order: 2,
        estimatedMinutes: 15,
        content: `Nicht jeder Interessent ist gleich. M.I. unterscheidet 5 Probeschüler-Typen, auf die du unterschiedlich eingehen musst.

**Gruppe 1a — Der Begeisterte**
Kommt motiviert, ist von Anfang an dabei. Will schnell starten.
→ Enthusiasmus aufgreifen, schnell zum Vertragsabschluss kommen.

**Gruppe 1b — Der Skeptiker**
Hat Vorbehalte, fragt kritisch. Braucht Vertrauen und Belege.
→ Fragen ernst nehmen, nicht unter Druck setzen, Erfahrungsberichte nutzen.

**Gruppe 2 — Der Vergleicher**
Hat bereits andere Studios besucht oder recherchiert intensiv.
→ M.I. Alleinstellungsmerkmale klar kommunizieren. Kein Schlechtreden der Konkurrenz.

**Gruppe 3 — Der Zögerer**
Interessiert, aber unsicher. Braucht Zeit und sanfte Führung.
→ Geduld zeigen, Bedenken aufnehmen, klare nächste Schritte benennen.

**Gruppe 4 — Der Mitgebrachte**
Wurde von jemand anderem mitgebracht, nicht aus eigenem Antrieb.
→ Eigene Motivation wecken. Nicht auf die andere Person verweisen. Ihn direkt ansprechen.`,
        keyPoints: [
          'Gruppe 1a: Begeisterte — schnell handeln, Enthusiasmus aufgreifen',
          'Gruppe 1b: Skeptiker — Vertrauen aufbauen, nicht drängen',
          'Gruppe 2: Vergleicher — USPs kommunizieren',
          'Gruppe 3: Zögerer — Geduld, klare nächste Schritte',
          'Gruppe 4: Mitgebrachte — eigene Motivation wecken',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'c2q1',
              question: 'Wie gehst du mit einem "Vergleicher" (Gruppe 2) um?',
              options: [
                'Andere Studios schlecht reden um besser dazustehen',
                'M.I. Alleinstellungsmerkmale klar kommunizieren ohne Konkurrenz schlecht zu reden',
                'Den Preis reduzieren um ihn zu gewinnen',
                'Ihn in Ruhe lassen bis er sich entschieden hat',
              ],
              correctIndex: 1,
              explanation: 'Beim Vergleicher: M.I. USPs klar kommunizieren. Kein Schlechtreden der Konkurrenz — das wirkt unprofessionell.',
            },
            {
              id: 'c2q2',
              question: 'Was ist das Wichtigste beim "Mitgebrachten" (Gruppe 4)?',
              options: [
                'Ihn durch die Person überzeugen lassen, die ihn mitgebracht hat',
                'Ihn direkt ansprechen und seine eigene Motivation wecken',
                'Ihn zuerst zum Probetraining einladen',
                'Auf ihn warten bis er selbst Fragen stellt',
              ],
              correctIndex: 1,
              explanation: 'Den Mitgebrachten direkt ansprechen — er braucht seine eigene Motivation, nicht die der Person die ihn mitgebracht hat.',
            },
          ],
        },
      },
      {
        id: 'c3',
        trackId: 'business',
        title: 'Setting Call & Qualifizierungsgespräch',
        order: 3,
        estimatedMinutes: 15,
        content: `Der Setting Call ist das erste strukturierte Gespräch mit einem Interessenten — oft telefonisch oder per Video. Ziel: Qualifizieren und ein Probetraining vereinbaren.

**Ziele des Setting Calls:**
1. Herausfinden, ob der Interessent wirklich passt (Qualifizierung)
2. Probetraining terminieren
3. Vorfreude und Erwartung aufbauen

**Typischer Ablauf:**
1. Kurze Begrüßung + Vorstellung
2. Fragen stellen (nicht reden — zuhören!)
   - "Was hat dich dazu gebracht, dich zu melden?"
   - "Was möchtest du erreichen?"
   - "Hast du schon Erfahrungen mit Kampfsport?"
3. M.I. kurz vorstellen (2-3 Sätze)
4. Probetraining konkret terminieren: "Wann hast du diese Woche Zeit?"

**Fehler vermeiden:**
- Zu früh zu viel über Preise reden
- Den Interessenten mit Informationen überfluten
- Kein konkretes Ziel (Termin) am Ende des Gesprächs

**Goldene Regel:** Wer fragt, führt. Stelle mehr Fragen als du Aussagen machst.`,
        keyPoints: [
          'Ziel: Qualifizieren + Probetraining terminieren',
          'Mehr zuhören als reden — wer fragt, führt',
          'Nicht zu früh über Preise reden',
          'Konkreter Termin als Ergebnis des Gesprächs',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'c3q1',
              question: 'Was ist die "goldene Regel" im Setting Call?',
              options: [
                'Immer den Preis nennen bevor der Interessent fragt',
                'Wer fragt, führt — mehr Fragen stellen als Aussagen machen',
                'Das Gespräch unter 5 Minuten halten',
                'Den Interessenten erst qualifizieren, dann kontaktieren',
              ],
              correctIndex: 1,
              explanation: 'Wer fragt, führt. Im Setting Call zuhören und verstehen — nicht sofort präsentieren.',
            },
            {
              id: 'c3q2',
              question: 'Was ist das konkrete Ergebnis eines erfolgreichen Setting Calls?',
              options: [
                'Der Interessent hat alle Preise verstanden',
                'Ein gebuchter Probetraining-Termin',
                'Der Interessent hat die Hausordnung akzeptiert',
                'Ein unterschriebener Vertrag',
              ],
              correctIndex: 1,
              explanation: 'Das Ziel ist ein gebuchter Probetraining-Termin — nicht Informationsübermittlung oder Vertragsabschluss.',
            },
          ],
        },
      },
      {
        id: 'c4',
        trackId: 'business',
        title: 'Bedarfsanalyse',
        order: 4,
        estimatedMinutes: 15,
        content: `Die Bedarfsanalyse ist das Herzstück des Verkaufsgesprächs. Sie findet beim oder nach dem Probetraining statt und gibt dir die Informationen, die du für ein maßgeschneidertes Angebot brauchst.

**Das Zeitlinien-Modell:**
Die Bedarfsanalyse folgt drei zeitlichen Ebenen:

**Vergangenheit → Gegenwart → Zukunft**

**Vergangenheit erfragen:**
"Wie bist du zu uns gekommen?" / "Was hat dich am Selbstverteidigen/Kampfsport bisher interessiert?"
→ Verstehe den Hintergrund und mögliche frühere Erfahrungen.

**Gegenwart erfragen:**
"Wo stehst du gerade?" / "Was ist deine aktuelle Situation?"
→ Aktuelle Schmerzen, Unsicherheiten, Motivatoren.

**Zukunft erfragen:**
"Was möchtest du erreichen?" / "Wie soll dein Leben in einem Jahr aussehen?"
→ Das echte Ziel hinter dem Training. Hier liegt die echte Kaufmotivation.

**Warum ist das wichtig?**
Menschen kaufen keine Trainingseinheiten — sie kaufen das Ergebnis. Wer das Ziel kennt, kann zeigen, wie M.I. dieses Ziel erreicht.

**Aktives Zuhören:**
Nicken, Zusammenfassen ("Wenn ich dich richtig verstehe..."), Nachfragen. Nie unterbrechen.`,
        keyPoints: [
          'Drei Zeitebenen: Vergangenheit → Gegenwart → Zukunft',
          'In der Zukunft liegt die echte Kaufmotivation',
          'Aktives Zuhören: zusammenfassen, nachfragen, nie unterbrechen',
          'Menschen kaufen das Ergebnis — nicht das Produkt',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'c4q1',
              question: 'Wo liegt in der Bedarfsanalyse die echte Kaufmotivation des Interessenten?',
              options: ['In der Vergangenheit', 'In der Gegenwart', 'In der Zukunft', 'In allen drei gleich'],
              correctIndex: 2,
              explanation: 'Die Zukunft — das Ziel und das gewünschte Ergebnis — enthält die echte Kaufmotivation. "Was möchtest du in einem Jahr erreicht haben?"',
            },
            {
              id: 'c4q2',
              question: 'Was bedeutet "aktives Zuhören" in der Bedarfsanalyse?',
              options: [
                'Schnell reagieren und Lösungen anbieten',
                'Nicken, zusammenfassen und nachfragen — nie unterbrechen',
                'Notizen machen und alles aufschreiben',
                'Augenkontakt halten und lächeln',
              ],
              correctIndex: 1,
              explanation: 'Aktives Zuhören: zusammenfassen ("wenn ich dich richtig verstehe..."), nachfragen und nie unterbrechen.',
            },
          ],
        },
      },
      {
        id: 'c5',
        trackId: 'business',
        title: 'Angebotspräsentation & Closing',
        order: 5,
        estimatedMinutes: 18,
        content: `Nach der Bedarfsanalyse weißt du, was der Interessent wirklich will. Jetzt präsentierst du das Angebot und führst zum Abschluss.

**Grundprinzip: Nutzen vor Preis**
Präsentiere immer zuerst den Nutzen, dann den Preis. Nie umgekehrt.

"Du hast gesagt, du möchtest mehr Selbstvertrauen und dich sicherer fühlen. Genau das bietet unser [Paket]: [Nutzen 1], [Nutzen 2], [Nutzen 3]."

**Die Ja-Kette:**
Eine Serie von Fragen, auf die der Interessent "Ja" antwortet, bevor die finale Frage kommt.

Beispiel:
- "Du möchtest regelmäßig trainieren?" — "Ja"
- "2-3 mal pro Woche wäre für dich ideal?" — "Ja"
- "Und du hast gesagt, du möchtest in 6 Monaten [Ziel] erreichen?" — "Ja"
- "Dann ist unser [Paket] genau das Richtige für dich. Fangen wir heute an?"

**Einwände behandeln:**
- "Zu teuer": Nutzen bekräftigen, nicht Preis senken. "Lass uns schauen was das für dich bedeutet..."
- "Muss noch mal nachdenken": "Was hält dich noch davon ab, heute zu starten?"
- "Kein Vertrag": Optionen zeigen, Sicherheit geben.

**Schweigegebot:**
Nach der finalen Frage: Nicht reden. Wer zuerst spricht, verliert. Warte auf die Antwort.`,
        keyPoints: [
          'Nutzen vor Preis — immer in dieser Reihenfolge',
          'Ja-Kette: kleine Ja-Antworten führen zum großen Ja',
          'Einwände nicht bekämpfen — verstehen und bekräftigen',
          'Nach der finalen Frage: Schweigen. Wer zuerst spricht, verliert.',
        ],
        quiz: {
          passingScore: 75,
          questions: [
            {
              id: 'c5q1',
              question: 'Was ist das "Schweigegebot" nach der finalen Closing-Frage?',
              options: [
                'Der Instructor darf nichts sagen bevor der Vertrag unterschrieben ist',
                'Nach der finalen Frage nicht reden — wer zuerst spricht, verliert',
                'Nur flüstern um die Atmosphäre zu intensivieren',
                'Den Interessenten in Ruhe lassen und den Raum verlassen',
              ],
              correctIndex: 1,
              explanation: 'Nach der finalen Frage schweigen — die Stille zieht eine Antwort hervor. Wer zuerst spricht, verliert die Gesprächsführung.',
            },
            {
              id: 'c5q2',
              question: 'Ein Interessent sagt "Das ist zu teuer". Was tust du?',
              options: [
                'Den Preis sofort reduzieren',
                'Den Nutzen bekräftigen und nicht auf den Preis eingehen',
                'Das günstigste Paket anbieten',
                'Das Gespräch beenden',
              ],
              correctIndex: 1,
              explanation: 'Bei Preis-Einwand: Nutzen bekräftigen, nicht Preis senken. "Lass uns anschauen, was das für dich bedeutet..."',
            },
            {
              id: 'c5q3',
              question: 'Was ist das Prinzip der Ja-Kette?',
              options: [
                'Den Interessenten zu Ja-Antworten zwingen',
                'Mit kleinen Ja-Antworten auf eine finale Ja-Entscheidung hinführen',
                'Nur Fragen stellen die mit Ja beantwortet werden müssen',
                'Das Gespräch möglichst kurz halten',
              ],
              correctIndex: 1,
              explanation: 'Die Ja-Kette führt durch eine Serie von kleinen Ja-Antworten zur finalen Kaufentscheidung — psychologisch aufbauend.',
            },
          ],
        },
      },
      {
        id: 'c6',
        trackId: 'business',
        title: 'Vertragsgespräch & Onboarding',
        order: 6,
        estimatedMinutes: 12,
        content: `Nach dem Closing folgen zwei wichtige Schritte: das Vertragsgespräch und das Onboarding. Beide entscheiden über langfristige Mitgliederbindung.

**Vertragsgespräch:**
- AGB klar und verständlich erklären — nicht nur "unterschreiben Sie hier"
- DSGVO-Einwilligung einholen und erklären (Datenschutz)
- Zahlungsmodalitäten klar kommunizieren
- Kündigungsfristen erläutern
- Fragen beantworten — nie unter Zeitdruck setzen

**Wichtig:** Ein Mitglied, das den Vertrag nicht versteht, ist ein Mitglied, das bei der ersten Unannehmlichkeit kündigt.

**Onboarding-Gespräch:**
Das Onboarding findet in den ersten 1-2 Wochen nach Vertragsabschluss statt.

Ziele des Onboardings:
1. Erwartungen alignieren ("Du hast gesagt du möchtest X — so erreichen wir das")
2. Training-Frequenz festlegen
3. Erste Ziele setzen (3-Monats-Ziel)
4. Schüler der Community vorstellen
5. App und Tools erklären

**Goldene Regel des Onboardings:**
Ein Schüler, der in den ersten 30 Tagen Freunde im Center findet, bleibt durchschnittlich 3x länger.`,
        keyPoints: [
          'AGB, DSGVO und Zahlungsmodalitäten verständlich erklären',
          'Vertrag ohne Zeitdruck unterschreiben lassen',
          'Onboarding: Erwartungen alignieren + Ziele setzen',
          'Schüler mit Community verbinden — erhöht Bindung massiv',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'c6q1',
              question: 'Warum ist es wichtig, dass ein neues Mitglied den Vertrag wirklich versteht?',
              options: [
                'Aus rechtlichen Gründen',
                'Weil ein nicht verstandener Vertrag bei der ersten Unannehmlichkeit zur Kündigung führt',
                'Damit er keine Fragen mehr stellen muss',
                'Weil das im Leitfaden steht',
              ],
              correctIndex: 1,
              explanation: 'Verständnis schafft Commitment. Ein Mitglied das nicht weiß, was es unterschrieben hat, kündigt bei der ersten Schwierigkeit.',
            },
            {
              id: 'c6q2',
              question: 'Was erhöht laut Leitfaden die Mitgliederbindung massiv?',
              options: [
                'Günstige Vertragskonditionen',
                'Ein Schüler findet in den ersten 30 Tagen Freunde im Center',
                'Häufige Trainingseinheiten',
                'Schnelle Fortschritte bei den Techniken',
              ],
              correctIndex: 1,
              explanation: 'Schüler die in den ersten 30 Tagen Freunde finden, bleiben durchschnittlich 3x länger. Community ist der stärkste Bindungsfaktor.',
            },
          ],
        },
      },
      {
        id: 'c7',
        trackId: 'business',
        title: 'Communitybuilding — Die 5 Steps',
        order: 7,
        estimatedMinutes: 10,
        content: `Eine starke Community ist das stärkste Bindungsinstrument. Sie macht aus Trainingspartnern Freunde und aus Kunden loyale Markenbotschafter.

**Step 1: Gemeinsame Identität schaffen**
M.I. ist mehr als ein Kampfsport-Studio — es ist eine Bewegung. Gib deinen Mitgliedern das Gefühl, Teil von etwas Bedeutungsvollem zu sein.

**Step 2: Rituale einführen**
Wiederkehrende Rituale schaffen Zugehörigkeit: gemeinsames Warm-up, Abschlussritual, Geburtstags-Tradition.

**Step 3: Mitglieder untereinander verbinden**
Schaffe Gelegenheiten für Gespräche außerhalb des Trainings. Wer mit einem Mitglied befreundet ist, kündigt nicht.

**Step 4: Erfolge feiern**
Öffentliches Loben (in der Gruppe, in der App, auf Social Media — mit Erlaubnis). Erfolge sichtbar machen motiviert alle.

**Step 5: Eigenverantwortung der Mitglieder stärken**
Gib erfahrenen Mitgliedern Aufgaben (Anfänger betreuen, Events organisieren). Wer Verantwortung trägt, bleibt.`,
        keyPoints: [
          'Step 1: Gemeinsame Identität — M.I. ist eine Bewegung',
          'Step 2: Rituale schaffen Zugehörigkeit',
          'Step 3: Mitglieder untereinander verbinden',
          'Step 4: Erfolge öffentlich feiern',
          'Step 5: Verantwortung an Mitglieder übergeben',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'c7q1',
              question: 'Warum ist Community der stärkste Bindungsfaktor?',
              options: [
                'Weil Freundschaften stärker sind als Vertragsklauseln',
                'Weil Community Marketing macht',
                'Weil es im Leitfaden so steht',
                'Weil gemeinsames Training effektiver ist',
              ],
              correctIndex: 0,
              explanation: 'Wer Freunde im Center hat, kündigt nicht. Freundschaften sind stärker als jede vertragliche Bindung.',
            },
            {
              id: 'c7q2',
              question: 'Was erreicht man durch das Übertragen von Verantwortung an erfahrene Mitglieder?',
              options: [
                'Weniger Arbeit für den Instructor',
                'Stärkere Bindung — wer Verantwortung trägt, bleibt',
                'Günstigere Personalkosten',
                'Schnellere Fortschritte bei Anfängern',
              ],
              correctIndex: 1,
              explanation: 'Wer Verantwortung trägt — Anfänger betreuen, Events organisieren — fühlt sich als Teil des Systems und bleibt.',
            },
          ],
        },
      },
    ],
  },

  // ==========================================
  // TRACK D: INSTRUCTOR-KARRIERE
  // ==========================================
  {
    id: 'karriere',
    title: 'Instructor-Karrierepfad',
    icon: '🎓',
    description: 'Die 5 Instructor-Stufen von Assistant bis Business Owner — Anforderungen, Rechte und Möglichkeiten.',
    lessons: [
      {
        id: 'd1',
        trackId: 'karriere',
        title: 'Stufe 1: Assistant Instructor',
        order: 1,
        estimatedMinutes: 10,
        content: `Der Einstieg in die Instructor-Karriere bei M.I. Die Grundlage wird hier gelegt.

**Voraussetzungen:**
- Module 1-5 (Conflict Ready) als Schüler abgeschlossen
- Bedarfsanalyse mit dem Head Instructor
- Bewerbungsgespräch bestätigt
- Basis-Ausbildung abgeschlossen (Didaktik Track A)

**Was du als Assistant Instructor tust:**
- Anfängergruppen bei der Aufwärmphase unterstützen
- Grundtechniken (Module 1-3) unter Aufsicht vermitteln
- Neue Mitglieder im Onboarding begleiten
- Check-ins koordinieren

**Was du NICHT tust:**
- Eigenständig Techniken bewerten oder als bestanden markieren
- Prüfungen abnehmen
- Eigenständig Kurse leiten ohne Supervision

**Deine Rechte in der App:**
- Conflict-Level Techniken unterstützen (nicht prüfen)
- Check-ins koordinieren

**Typische Dauer:** 3-6 Monate bis zur nächsten Stufe, abhängig von Engagement und Fortschritt.`,
        keyPoints: [
          'Voraussetzung: Module 1-5 + Bewerbung + Basis-Ausbildung',
          'Aufgaben: Anfänger unterstützen, unter Aufsicht unterrichten',
          'Keine eigenständigen Prüfungen oder Bewertungen',
          'Typisch 3-6 Monate bis zur nächsten Stufe',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'd1q1',
              question: 'Was darf ein Assistant Instructor NICHT tun?',
              options: [
                'Anfänger beim Aufwärmen unterstützen',
                'Grundtechniken unter Aufsicht zeigen',
                'Eigenständig Techniken als bestanden markieren',
                'Neue Mitglieder onboarden',
              ],
              correctIndex: 2,
              explanation: 'Assistant Instructors dürfen keine Prüfungen abnehmen oder Techniken eigenständig als bestanden markieren — nur mit Supervision.',
            },
          ],
        },
      },
      {
        id: 'd2',
        trackId: 'karriere',
        title: 'Stufe 2: Instructor',
        order: 2,
        estimatedMinutes: 10,
        content: `Als vollwertiger Instructor übernimmst du eigenständige Verantwortung für Trainingsgruppen.

**Voraussetzungen:**
- Stufe 1 mindestens 3 Monate
- Module 6-10 (Combat Ready) als Schüler abgeschlossen
- Track A + B des Instructor-Curriculums abgeschlossen
- Head Instructor Beurteilung: positiv

**Was du als Instructor tust:**
- Eigenständige Leitung von Conflict und Combat Trainings
- Memberkurse führen und Stundenplanung gestalten
- Conflict Ready Techniken prüfen und bestätigen
- Schüler-Entwicklung eigenständig tracken
- Option auf eigene Selbstständigkeit im M.I. Kosmos

**Deine Rechte in der App:**
- Conflict-Level Techniken prüfen
- Schüler-Fortschritt einsehen und kommentieren

**Meilenstein:** Als Instructor kannst du erstmals eigenständig und ohne dauernde Supervision unterrichten. Das ist der Einstieg in die Selbstständigkeit.`,
        keyPoints: [
          'Voraussetzung: Stufe 1 + Module 6-10 + Track A+B abgeschlossen',
          'Eigenständige Leitung von Conflict und Combat Trainings',
          'Kann Conflict Ready Techniken prüfen',
          'Erste Option auf Selbstständigkeit im M.I. Kosmos',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'd2q1',
              question: 'Was ist der wichtigste Unterschied zwischen Stufe 1 (Assistant) und Stufe 2 (Instructor)?',
              options: [
                'Der Instructor verdient mehr',
                'Der Instructor unterrichtet eigenständig ohne dauerhafte Supervision',
                'Der Instructor darf alle Level prüfen',
                'Der Instructor hat mehr Schüler',
              ],
              correctIndex: 1,
              explanation: 'Als Instructor übernimmst du eigenständige Verantwortung — keine dauerhafte Supervision mehr notwendig.',
            },
          ],
        },
      },
      {
        id: 'd3',
        trackId: 'karriere',
        title: 'Stufe 3: Full Instructor',
        order: 3,
        estimatedMinutes: 10,
        content: `Als Full Instructor hast du die vollständige Lehr-Kompetenz und die Basis für ein eigenes Business.

**Voraussetzungen:**
- Stufe 2 mindestens 6 Monate aktiv
- Tactical Ready als Schüler abgeschlossen
- Track C (Business & Vertrieb) abgeschlossen
- Mindestens 10 eigene Schüler erfolgreich betreut

**Was du als Full Instructor tust:**
- Alle Levels bis Tactical unterrichten
- Eigenes Business im M.I. Franchise-System führen
- Neue Assistant Instructors ausbilden und mentoren
- Events und Seminare eigenständig organisieren
- Combat Ready Techniken prüfen

**Business-Option:**
Als Full Instructor kannst du ein eigenes M.I. Center eröffnen oder ein bestehendes Center übernehmen. M.I. stellt Infrastruktur, Curriculum und Brand.

**Deine Rechte in der App:**
- Conflict + Combat Techniken prüfen
- Eigene Schüler und Kurse verwalten`,
        keyPoints: [
          'Voraussetzung: 6+ Monate Stufe 2 + Tactical Level + Track C',
          'Unterrichtet alle Levels bis Tactical',
          'Option auf eigenes M.I. Center oder Franchise',
          'Mentort neue Assistant Instructors',
        ],
        quiz: {
          passingScore: 67,
          questions: [
            {
              id: 'd3q1',
              question: 'Was ermöglicht Stufe 3 (Full Instructor) wirtschaftlich?',
              options: [
                'Ein höheres Gehalt als Angestellter',
                'Ein eigenes M.I. Center oder Franchise',
                'Prüfberechtigung für alle Level',
                'Zugang zum Head Instructor Board',
              ],
              correctIndex: 1,
              explanation: 'Als Full Instructor kannst du ein eigenes M.I. Center eröffnen oder übernehmen — die wirtschaftliche Selbstständigkeit beginnt hier.',
            },
          ],
        },
      },
      {
        id: 'd4',
        trackId: 'karriere',
        title: 'Stufe 4: Head Instructor',
        order: 4,
        estimatedMinutes: 10,
        content: `Der Head Instructor ist die höchste technische Autorität an einem Standort.

**Voraussetzungen:**
- Stufe 3 mindestens 12 Monate
- Contact Ready als Schüler (oder Equivalent)
- Vollständiges Instructor-Curriculum abgeschlossen (alle 4 Tracks)
- Nominierung durch Owner oder Admin
- Mindestens 3 eigene Instructors ausgebildet

**Was du als Head Instructor tust:**
- Technische Gesamtverantwortung für deinen Standort
- Alle Level bis Tactical prüfen und bestätigen
- Neue Instructors zertifizieren (bis Stufe 2)
- Qualitätskontrolle am Standort
- Strategische Standortentwicklung

**Prüfberechtigung:**
Conflict, Combat und Tactical Level — die drei Kernstufen des M.I. Schülerprogramms.

**Keine Berechtigung:**
Contact Ready, Assistant Instructor und Instructor Level — diese Zertifizierungen liegen beim Owner.`,
        keyPoints: [
          'Höchste technische Autorität am Standort',
          'Prüfberechtigung: Conflict, Combat, Tactical',
          'Kann neue Instructors bis Stufe 2 zertifizieren',
          'Nominierung durch Owner oder Admin erforderlich',
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'd4q1',
              question: 'Welche Level darf ein Head Instructor prüfen?',
              options: [
                'Alle Level einschließlich Contact Ready',
                'Nur Conflict Level',
                'Conflict, Combat und Tactical',
                'Alle Level außer Instructor Level',
              ],
              correctIndex: 2,
              explanation: 'Head Instructor darf Conflict, Combat und Tactical prüfen. Contact Ready und höher liegen beim Owner.',
            },
            {
              id: 'd4q2',
              question: 'Wie wird man Head Instructor?',
              options: [
                'Durch das Bestehen einer Prüfung',
                'Durch Nominierung des Owners oder Admins nach Erfüllung der Voraussetzungen',
                'Durch Mehrheitsentscheidung der Instructoren',
                'Automatisch nach 2 Jahren als Full Instructor',
              ],
              correctIndex: 1,
              explanation: 'Head Instructor wird man durch Nominierung des Owners oder Admins — nicht automatisch oder durch Prüfung alleine.',
            },
          ],
        },
      },
      {
        id: 'd5',
        trackId: 'karriere',
        title: 'Stufe 5: Business Owner',
        order: 5,
        estimatedMinutes: 10,
        content: `Der Business Owner ist die höchste Autorität im M.I. System. Er trägt die Gesamtverantwortung für sein Center und das darin ausgebildete Instructor-Team.

**Voraussetzungen:**
- Stufe 4 aktiv
- Vollständige Business-Kompetenz bewiesen
- Eigenes, erfolgreiches Center führt
- Genehmigung durch M.I. Zentrale

**Was du als Business Owner tust:**
- Contact Ready und Instructor-Level-Zertifizierungen freigeben
- Instructor-Stufenaufstiege bis Head Instructor genehmigen
- Systemautorität für deinen Standort und Bereich
- Strategische Expansion und Franchise-Entwicklung
- Qualitätssicherung im M.I. Kosmos

**Systemautorität:**
Als Owner bist du die oberste Instanz für deinen Standort. Du entscheidest über:
- Contact Ready Bewerbungen
- Assistant Instructor Zertifizierungen
- Ausschlüsse von Instructors oder Mitgliedern

**Prüfberechtigung:**
Alle Level: Conflict, Combat, Tactical, Contact, Assistant Instructor, Instructor Level.

**Verantwortung:**
Mit der Autorität kommt maximale Verantwortung — für die Qualität des Unterrichts, die Sicherheit der Schüler und das Ansehen von M.I. insgesamt.`,
        keyPoints: [
          'Höchste Autorität im M.I. System am Standort',
          'Prüfberechtigung für alle Level',
          'Genehmigt Contact Ready und Instructor-Zertifizierungen',
          'Systemautorität: Ausschlüsse, strategische Entscheidungen',
          'Maximale Verantwortung für Qualität und Sicherheit',
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'd5q1',
              question: 'Was unterscheidet die Prüfberechtigung eines Business Owners von der eines Head Instructors?',
              options: [
                'Kein Unterschied — beide haben die gleichen Rechte',
                'Der Owner darf zusätzlich Contact Ready, Assistant Instructor und Instructor Level zertifizieren',
                'Der Owner darf keine technischen Prüfungen abnehmen',
                'Der Owner prüft nur Business-Kompetenzen',
              ],
              correctIndex: 1,
              explanation: 'Der Owner hat Prüfberechtigung für alle Level. Der Head Instructor endet bei Tactical — Contact Ready und höher liegt beim Owner.',
            },
            {
              id: 'd5q2',
              question: 'Was kommt laut Leitfaden mit der maximalen Autorität des Business Owners?',
              options: [
                'Maximale Freiheit ohne Rechenschaftspflicht',
                'Maximale Verantwortung für Qualität, Sicherheit und Ansehen von M.I.',
                'Das Recht, alle Regeln anzupassen',
                'Automatische finanzielle Absicherung durch M.I. Zentrale',
              ],
              correctIndex: 1,
              explanation: 'Autorität und Verantwortung gehen Hand in Hand. Als Owner trägst du maximale Verantwortung für Qualität, Sicherheit und das Ansehen von M.I. insgesamt.',
            },
          ],
        },
      },
    ],
  },
];
