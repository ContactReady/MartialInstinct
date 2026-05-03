// ============================================
// MODUL-THEMEN — Theorie-Abschnitte pro Modul
// Admin kann Texte bearbeiten (nicht flaggbar durch Member)
// ============================================

export interface ModuleTopic {
  id: string;         // Slug, z.B. 'paragraphen'
  moduleId: string;   // z.B. 'mod-1'
  title: string;      // Anzeige-Titel
  icon: string;       // Emoji-Icon
  order: number;
  theoryText: string; // Markdown-artiger Fließtext (Admin-editierbar)
}

// ── MODUL 1 — Mission Begins ─────────────────────────────────────────────────

export const MOD1_TOPICS: ModuleTopic[] = [

  // ── 1. § Paragraphen ──────────────────────────────────────────────────────
  {
    id: 'paragraphen',
    moduleId: 'mod-1',
    title: '§ Gesetzliche Grundlagen',
    icon: '⚖️',
    order: 1,
    theoryText: `## Gesetzliche Grundlagen der Selbstverteidigung

~DISCLAIMER
Die in diesem Modul vermittelten rechtlichen Inhalte dienen ausschließlich der allgemeinen Orientierung und dem grundlegenden Verständnis von Selbstverteidigungs- und Notwehrsituationen, damit du nicht nur Gefahren, sondern auch rechtliche Folgen besser einschätzen kannst.

Sie stellen keine Rechtsberatung dar und ersetzen keine individuelle juristische Beratung durch einen qualifizierten Rechtsanwalt.

Es wird keine Gewähr für Vollständigkeit, Aktualität oder rechtliche Verbindlichkeit übernommen, da sich Gesetze jederzeit ändern können. Die Anwendung erfolgt auf eigene Verantwortung.

**Im Einzelfall gilt: Konsultiere einen Rechtsanwalt.**

---

### § 32 StGB — Notwehr

**„Wer eine Tat begeht, die durch Notwehr geboten ist, handelt nicht rechtswidrig."**

Notwehr ist die Verteidigung, die erforderlich ist, um einen **gegenwärtigen, rechtswidrigen Angriff** von sich oder einem anderen abzuwenden.

**Wichtig:** § 32 StGB gilt **nur bei Angriffen von Menschen**. Für Tierangriffe oder Gefahren durch Sachen gilt § 228 BGB.

**Drei Grundvoraussetzungen der Strafbarkeit:**
1. **Tatbestand** — Die Handlung ist im Gesetz als Straftat beschrieben
2. **Rechtswidrigkeit** — Es liegt kein Rechtfertigungsgrund vor (z.B. Notwehr)
3. **Schuld** — Der Täter ist schuldfähig

---

### § 33 StGB — Überschreitung der Notwehr

Wer die Grenzen der Notwehr aus **Verwirrung, Furcht oder Schrecken** überschreitet, wird **nicht bestraft**.

Das bedeutet: Wenn du im Moment extremen Stresses mehr tust als nötig — weil du Angst hattest — bist du strafrechtlich geschützt. Dieser Paragraph ist dein Sicherheitsnetz.

---

### § 34 StGB — Rechtfertigender Notstand

Handelt jemand in einer **Notstandslage**, um eine Gefahr für sich oder andere abzuwenden, handelt er nicht rechtswidrig — **wenn das geschützte Rechtsgut wesentlich höherwertig ist als der entstandene Schaden**.

Beispiel: Einschlagen einer Autoscheibe, um ein eingesperrtes Kind zu retten.

---

### § 227 BGB — Notwehr (Zivilrecht)

Entspricht inhaltlich § 32 StGB — gilt ebenfalls **nur für menschliche Angriffe**.

---

### § 228 BGB — Notstand (Tierangriff / Sachgefahr)

Greift ein **Tier** an oder geht eine Gefahr von einer **Sache** aus, gilt § 228 BGB als Rechtsgrundlage für Selbstschutz. Nicht § 32 StGB.

---

### § 223 StGB — Einfache Körperverletzung

**Strafe:** Bis zu 5 Jahre Freiheitsstrafe oder Geldstrafe.

**„Wer eine andere Person körperlich misshandelt oder an der Gesundheit schädigt, wird bestraft."**

Abs. 2: **„Der Versuch ist strafbar."** — auch ein Angriff der nicht trifft kann strafbar sein.

---

### § 224 StGB — Gefährliche Körperverletzung

**Strafe:** Freiheitsstrafe von **6 Monaten bis 10 Jahren**.

Merkmale (5 alternative Tatbestandsvarianten):
- Durch **Gift** oder gesundheitsschädliche Stoffe
- Mittels einer **Waffe oder eines Werkzeugs**
- Durch einen **hinterlistigen Überfall**
- **Gemeinschaftlich** mit anderen
- Auf eine das **Leben gefährdende** Weise

---

### § 226 StGB — Schwere Körperverletzung

**Strafe:** Freiheitsstrafe von **1 bis 10 Jahren**. Bei Absicht: mindestens **3 Jahre**.

Gilt bei dauerhaften schweren Folgen:
- Verlust des **Sehvermögens** (ein oder beide Augen)
- Verlust des **Gehörs** oder der Sprache
- Verlust eines **Körperteils**
- Dauerhafte **Entstellung**
- Schwere Behinderung, Geisteskrankheit, Lähmung

---

### § 323c StGB — Unterlassene Hilfeleistung

**Strafe:** Bis zu **1 Jahr** Freiheitsstrafe oder Geldstrafe.

Wer bei einem **Unglücksfall, einer gemeinen Gefahr oder Not** keine Hilfe leistet, obwohl dies **möglich und zumutbar** war, macht sich strafbar.

**Relevanz für uns:** Nach einem Konflikt bist du u.U. verpflichtet, dem Verletzten Hilfe zu leisten — auch wenn er der Angreifer war.

---

### Putativnotwehr

**Irrtümliche Notwehr** — der Täter glaubt fälschlicherweise, dass die Voraussetzungen der Notwehr vorliegen, obwohl das tatsächlich nicht so ist.

Beispiel: Jemand greift nach einer Plastikpistole — du siehst nur die Pistole und reagierst mit Notwehr. Strafbarkeit wird hier individuell bewertet.`,
  },

  // ── 2. Verhaltensrichtlinien ───────────────────────────────────────────────
  {
    id: 'verhaltensrichtlinien',
    moduleId: 'mod-1',
    title: '7 Verhaltensrichtlinien',
    icon: '📋',
    order: 2,
    theoryText: `## Die 7 Verhaltensrichtlinien

Diese 7 Regeln sind die Grundlage jedes Handelns im M.I. System. Nicht als Einschränkung — sondern als Kompass.

---

### Richtlinie 1 — Sei vorbereitet

Vorbereitung beginnt **vor** dem Konflikt — nicht wenn er bereits da ist.

**Die vier Vorbereitungsebenen:**

1. **Physisch** — Kraft- und Selbstverteidigungstraining. Dein Körper ist dein wichtigstes Werkzeug.
2. **Mental** — Routine und regelmäßiges Training. Mentale Stärke entsteht durch Wiederholung, nicht durch Talent.
3. **Emotional** — Sparring und Stresstraining. Lerne, unter Druck zu funktionieren, bevor du es im Ernstfall musst.
4. **Taktisch** — Umgang mit Tools: Pfefferspray, Tactical Pen, Messer, Stock. Handlung beginnt vor dem Konflikt.

---

### Richtlinie 2 — Vermeide Konfliktsituationen

**„Der beste Kampf ist der, der nicht stattfindet."**

- Meide Orte mit hohem Konfliktpotenzial
- Erkenne Gefahren frühzeitig (Situational Awareness)
- Handle deeskalierend — Sprache ist deine erste Waffe
- Flucht ist keine Niederlage — sie ist die intelligentere Option

---

### Richtlinie 3 — Halte deine Waffe einsatzbereit

Wenn du eine Waffe bei dir trägst, muss sie **einsatzbereit** sein — nicht irgendwo versteckt oder gesichert.

**Definitionen:**
- **Einsatzbereit** = Eine Bewegung bis zum effektiven Einsatz
- **Griffbereit** = Zwei bis drei Bewegungen bis zum effektiven Einsatz

Dein Ziel: So wenige Bewegungen wie möglich zwischen dir und der Handlungsfähigkeit.

---

### Richtlinie 4 — Kontrolliere die Distanz

**„Wer die Distanz kontrolliert, kontrolliert das Geschehen."**

Du bestimmst die Distanz — nicht dein Gegner. Die Distanz entscheidet:
- Ob der Gegner überhaupt angreifen kann
- Welche Techniken er einsetzen kann
- Welche Techniken du einsetzen kannst

Distanzmanagement ist keine Defensive — es ist Dominanz.

---

### Richtlinie 5 — Rechne damit, verletzt zu werden

Dies ist eine der wichtigsten mentalen Vorbereitung überhaupt.

**Worum geht es?**
- Mentale Vorbereitung darauf, getroffen zu werden
- Training unter Druck und realem Schmerz
- Stresssituationen erleben, bevor sie echt werden
- Mit Schmerz umgehen können, ohne handlungsunfähig zu werden

Wer noch nie unter Druck geübt hat, wird im Ernstfall einfrieren. Wer es kennt, reagiert.

---

### Richtlinie 6 — Wenn du getroffen wirst: mach weiter

**Kämpfe weiter. Reagiere weiter. Oder flieh.**

Der Gegner macht nach einem Treffer auch weiter — das musst du verinnerlichen.

Ein Treffer ist kein Ende. Ein Treffer ist Feedback. Verarbeite ihn und handle.

- Kein Innehalten
- Kein Zögern
- Kein Schock-Freeze

Dein Körper kann mehr als dein Kopf im Moment glaubt.

---

### Richtlinie 7 — Prüfe dich nach dem Konflikt

**„Geh NICHT davon aus, dass alles okay ist."**

Nach einem Konflikt:
1. **Körper aktiv abtasten** — von Kopf bis Fuß
2. **Auf Blut achten** — auch unter der Kleidung
3. **Stop the Bleed anwenden** wenn nötig

Adrenalin maskiert Schmerz. Du kannst schwer verletzt sein und es erst nach Minuten oder Stunden bemerken. Handle sofort.`,
  },

  // ── 3. Stellungen ─────────────────────────────────────────────────────────
  {
    id: 'stellungen',
    moduleId: 'mod-1',
    title: 'Stellungen & Positionen',
    icon: '🥋',
    order: 3,
    theoryText: `## Stellungen & Positionen

Die vier Grundstellungen im M.I. System sind keine starren Posen — sie sind dynamische Bereitschaftsstufen. Du wechselst zwischen ihnen je nach Situation.

---

### Neutrale Position

**Alltagshaltung** — unauffällig, entspannt, kein Signal an die Umgebung.

Keine kampfsportliche Grundstellung. Du stehst wie jeder andere Mensch. Diese Position signalisiert weder Konfliktbereitschaft noch Unterwerfung.

**Einsatz:** Alltag, soziale Interaktionen, öffentliche Orte.

---

### Ready Position

**Potenzielle Konfliktsituation** — du bist vorbereitet, ohne Aggression zu signalisieren.

Die Ready Position ist subtil:
- Körper leicht gedreht (kleinere Zielscheibe)
- Hände neutral aber verfügbar
- Füße positioniert für sofortige Reaktion
- Mentaler Zustand: aufmerksam, nicht reaktiv

**Einsatz:** Wenn etwas nicht stimmt. Wenn du eine Bedrohung spürst, aber noch kein direkter Kontakt besteht.

---

### Contact Ready Position

**Tatsächlicher oder unmittelbar bevorstehender Kontakt.**

**Kernregel:** Sobald Kontakt entsteht → Contact Ready.

Merkmale:
- **Tieferer Körperschwerpunkt** — mehr Stabilität
- **Hände höher und kampfbereiter** — sofort verfügbar
- **Füße klar versetzt** — für Beweglichkeit und Balance
- Auf Stabilität, Agilität und sofortige Handlungsfähigkeit ausgelegt

Diese Stellung ist auf **tatsächlichen Kampf** ausgelegt — keine halben Maßnahmen.

**Einsatz:** Sobald Kontakt entsteht oder unmittelbar bevorsteht.

---

### Strong-Side-Forward

**Die starke (dominante) Seite ist vorne.**

Das klingt kontraintuitiv — die meisten Kampfsportarten halten die starke Hand hinten für mehr Kraftaufbau. M.I. geht den anderen Weg.

**Warum?**
- Kürzerer Weg zum Ziel → schnellere Aktion
- Mehr Überraschungseffekt
- Universell einsetzbar: mit blöder Hand UND mit Tool (Pfefferspray, Messer, Stock)

**Einsatz:** Wenn mit Werkzeug oder dominanter Hand angegriffen/verteidigt wird.`,
  },

  // ── 4. Eingänge & Auslagenwechsel ─────────────────────────────────────────
  {
    id: 'eingaenge',
    moduleId: 'mod-1',
    title: 'Eingänge & Auslagenwechsel',
    icon: '↔️',
    order: 4,
    theoryText: `## Eingänge & Auslagenwechsel

Eingänge beschreiben, **wie du in die Contact Ready Position eintrittst**. Auslagenwechsel beschreiben, **wie du deine führende Seite wechselst**.

---

## Eingänge in die Contact Ready Position

### Defensiver Eingang

**Schritt zurück** — Übergang in Contact Ready durch Rückwärtsbewegung.

Du schaffst Distanz und nimmst gleichzeitig die kampfbereite Position ein. Ideal wenn der Gegner vorwärts kommt und du Zeit brauchst.

### Offensiver Eingang

**Schritt nach vorne** — Übergang in Contact Ready durch Vorwärtsbewegung.

Du verkürzt die Distanz aktiv und greifst die Initiative. Für den offensiven Einstieg in eine Situation.

### Aggressiver Eingang

**Schritt nach vorne + sofortiger Angriff** — kein Zögern, direkter Einstieg.

Du bewegst dich nicht nur vorwärts — du kombinierst die Bewegung direkt mit einer Technik. Die Aktion beginnt mit der Bewegung.

---

## Die 4 Auslagenwechsel

Auslagenwechsel ermöglichen es, die führende Seite zu wechseln — taktisch, um die starke Seite nach vorne zu bringen oder den Gegner zu täuschen.

---

### Vorderer Wechsel

- Der **vordere Fuß** leitet den Wechsel ein
- Danach wird der hintere Fuß passend nachgeführt
- Nacheinander, kontrolliert

**Einsatz:** Kontrollierter Wechsel wenn Zeit vorhanden.

---

### Hinterer Wechsel

- Der **hintere Fuß** leitet den Wechsel ein
- Danach folgt der vordere Fuß in die neue Position
- Nacheinander, reaktiv

**Einsatz:** Reaktiver Wechsel, oft nach einer Bewegung initiiert.

---

### Switch

- **Beide Füße nahezu gleichzeitig** — schnell und explosiv
- Maximale Geschwindigkeit, minimale Bodenhaftungsphase

**Einsatz:** Schneller Wechsel unter Zeitdruck oder als Täuschungsmanöver.

---

### Schritt (Step)

- Ein Fuß geht am anderen **vorbei nach vorne**
- Kontrolliert, nacheinander
- Der kontrollierteste Wechsel

**Einsatz:** Wenn Kontrolle über Geschwindigkeit geht.

---

**Faustregel:** Switch = explosiv, Schritt = kontrolliert. Beide haben ihren Platz — kenne den Unterschied.`,
  },

  // ── 5. Distanzmanagement ──────────────────────────────────────────────────
  {
    id: 'distanz',
    moduleId: 'mod-1',
    title: 'Distanzmanagement',
    icon: '📏',
    order: 5,
    theoryText: `## Distanzmanagement

**„Wer die Distanz kontrolliert, kontrolliert das Geschehen."**

Distanzmanagement ist eine der wichtigsten Fähigkeiten im M.I. System. Es geht nicht darum, weit weg zu bleiben — es geht darum, **die Distanz zu bestimmen**: wann du nah bist, wann du Abstand schaffst, und wie du das kontrolliert tust.

---

## Die 3 Grundbewegungen

### Step & Slide

**Kontrollierte, stabile Bewegung.**

- Zuerst ein Schritt in die gewünschte Richtung
- Dann wird der andere Fuß nachgezogen (Slide)
- Füße bleiben immer auf Schulterbreite
- Kreuzen der Füße wird vermieden

**Eigenschaft:** Kontrollierteste und stabilste Bewegung — für Situationen wo Präzision wichtiger ist als Geschwindigkeit.

**Einsatz:** Seitliche Bewegung, Positionieren, kontrollierter Rückzug.

---

### Slide-Step

**Schnelle, reaktive Bewegung.**

**Das unveränderliche Grundprinzip:** Die **Gleitbewegung (Slide) kommt immer zuerst** — dann folgt der Schritt (Step).

- **Vorwärts:** Der hintere Fuß gleitet zuerst, dann folgt der vordere
- **Rückwärts:** Der vordere Fuß gleitet aus der Gefahrenzone (Slide), dann folgt der hintere (Step)

**Eigenschaft:** Schneller als Step & Slide — ideal für reaktive Defensive.

**Einsatz:** Ausweichen, reaktive Distanzveränderung.

---

### Push

**Explosive, maximale Distanzveränderung.**

Kein "Gehen" — ein explosiver Abdrück-Impuls der dich oder deinen Gegner sofort bewegt. Der Push kommt zum Einsatz, wenn **Zeit ein kritischer Faktor** ist.

**Eigenschaft:** Explosivste Bewegung im System — für sofortige Reaktion.

**Einsatz:** Wenn du keine Zeit hast zu "gehen" — du brauchst sofort Distanz oder willst sofort verkürzen.

---

## Mirror Drills — Distanzgefühl trainieren

### Mirror Drill 1

Partner kopiert die **Schritte** des Führenden. Ziel: Reaktion auf Bewegungen trainieren, Fußarbeit koordinieren.

### Mirror Drill 2

Ziel: die **Distanz zum Partner halten** — egal wie er sich bewegt. Wenn er vorwärts kommt, du zurück. Wenn er zurückgeht, du vor.

Mirror Drill 2 trainiert das Herzstück des Distanzmanagements: automatisches, unbewusstes Distanzgefühl.

---

## Zusammenfassung

| Bewegung | Eigenschaft | Einsatz |
|---|---|---|
| Step & Slide | Kontrolliert & stabil | Positionieren |
| Slide-Step | Schnell & reaktiv | Ausweichen |
| Push | Explosiv & maximal | Sofortreaktion |`,
  },

  // ── 6. Grundtechniken / Angriffe ──────────────────────────────────────────
  {
    id: 'angriffe',
    moduleId: 'mod-1',
    title: 'Grundtechniken & Angriffe',
    icon: '👊',
    order: 6,
    theoryText: `## Grundtechniken & Angriffe

Die Grundtechniken des M.I. Systems sind praxiserprobt und auf **reale Konfliktsituationen** ausgelegt — nicht auf Sport oder Wettkampf. Jede Technik hat einen klaren Zweck.

---

## Hand- und Armtechniken

### Jab
Schneller, direkter Schlag mit der vorderen Hand. Kein Kraftschlag — ein Abstandshalter, Störer und Einleitung für Kombinationen. Der Jab schafft Zeit und setzt Marken.

### Cross (Gegengerade)
Kraftschlag mit der hinteren Hand. Volle Körperdrehung, maximale Kraftentfaltung. Der Cross ist der Finisher — er kommt nach dem Jab.

### Slap (Ohrfeige / Flachhand)
Offene Hand, Schlag auf Ohr oder Kopfseite. Erzeugt Schock durch Druckwelle im Ohr. Auf kurze Distanz effektiv.

### Fingerstich

**Ziel:** Das Auge des Gegners.

Der Fingerstich ist kein Kraftangriff — er ist ein **Schockauslöser**. Ein Treffer am Auge erzeugt eine unwillkürliche Schutzreaktion: der Gegner schließt die Augen, dreht den Kopf weg, verliert kurz die Orientierung.

**Das schafft Zeit** — für weitere Aktionen, für Flucht, für den nächsten Angriff.

**Wichtig:**
- Effektiv auf **mittlerer bis naher Distanz**
- Präzision wird durch Training verbessert
- Nicht aus großer Entfernung einsetzen ohne Training

### Ellbogen (Elle)

Im Infight — auf **engem Raum** — ist der Ellbogen dem Faustschlag überlegen.

**Warum?**
- Kurze Wege — keine große Ausholbewegung nötig
- Harte Aufprallfläche
- Kann im Clinch voll eingesetzt werden

Einsatz: Kinnhaken-ähnlich horizontal, seitlicher Aufwärtshaken, rückwärts (Rückstoß).

### Haken

Bogenförmiger Schlag seitlich auf Kinn, Schläfe oder Rippen. Kommt von der Seite — schwerer zu sehen als Jab oder Cross.

### Uppercut

Aufwärtsschlag unter das Kinn oder in den Solar Plexus. Auf kurze Distanz — hebt den Gegner leicht an und erschüttert die Wirbelsäule.

---

## Kontroll- und Greiftechniken

### Nackenzug

**Primärziel:** Kontrolle — nicht Schmerz.

Der Nackenzug greift **Nacken und Hinterkopf**. Von dort lässt sich der gesamte Körper des Gegners steuern: Kopf nach unten, Körper folgt.

**Klassische Kombo:** Nackenzug → Kopf nach unten → Knie hoch. Kurz, explosiv, effektiv.

### Clinch

Nahkampf-Körperkontakt — beide Körper sind ineinander. Im Clinch:
- Fäuste und Kicks können nicht mehr voll ausgeführt werden
- Knie und Ellbogen sind die dominanten Waffen
- Kontrolle über Gleichgewicht und Position entscheidet

---

## Knie-Techniken

**Knie** sind auf **engem Raum** besonders wirksam — kurze Wege, harte Aufprallfläche, maximale Wirkung ohne Ausholraum.

Kombination mit Nackenzug ist klassisch: Kopf wird durch Nackenzug nach unten gezogen, Knie kommt entgegen.

---

## Kick-Techniken

### Stoppkick (vorne und hinten)

**Der Stoppkick ist defensiv-offensiv.** Er stoppt den eingehenden Angriff UND greift gleichzeitig an.

**Schlüsselprinzip:** Der Stoppkick lebt vom **Timing**. Er trifft den Gegner **im Moment seiner Vorwärtsbewegung** — die kinetische Energie des Angreifers wird gegen ihn genutzt.

- Wenn der Gegner steht: normale Wirkung
- Wenn der Gegner vorwärtsläuft: Wirkung verdoppelt sich durch seinen eigenen Impuls

Ziel: Oberschenkel, Hüfte, Körpermitte. Tief und stabil.

### Weitere Kicks (Kick 2–7)

Variationen von Seiten-, Aufwärts- und Rückwärtskicks für unterschiedliche Distanzen und Winkel. Werden in den späteren Technikanteilen des Moduls vertieft.`,
  },
];

// ── MODUL 2 — Be Ready! ──────────────────────────────────────────────────────

export const MOD2_TOPICS: ModuleTopic[] = [

  // ── 1. 🧠 Empty Your Mind ────────────────────────────────────────────────
  {
    id: 'empty-your-mind',
    moduleId: 'mod-2',
    title: 'Empty Your Mind',
    icon: '🧠',
    order: 1,
    theoryText: `## Empty Your Mind

Wenn du bei uns ins Training kommst, bringst du automatisch ein eigenes Denk- und Verhaltensmuster mit.

Dieses Muster hat dich bis hierhin gebracht.

Wenn dieses Muster bereits zu dem Punkt geführt hätte, an dem du sein willst, würdest du nicht hier stehen und trainieren.

Das bedeutet: Dein bisheriges Denken und Handeln hat nicht ausgereicht, um dein Ziel zu erreichen.

Genau deshalb beginnt das Training nicht nur auf körperlicher Ebene – sondern im Kopf.

---

### Was „Empty Your Mind" bedeutet

„Empty Your Mind" bedeutet nicht, dass du aufhörst zu denken.

Es bedeutet, dass du dein bisheriges Denken zunächst zurückstellst und dich auf das System einlässt.

Das heißt konkret:

- Du setzt die Inhalte so um, wie sie im Training vermittelt werden
- Du vermeidest es, Dinge direkt zu verändern oder anzupassen
- Du vertraust darauf, dass das System funktioniert

Ziel ist, eine klare Basis zu schaffen, auf der alles Weitere aufbauen kann.

---

### Vertrauen in das Training

Damit du Fortschritte machst, brauchst du Vertrauen:

- Vertrauen in den Trainer
- Vertrauen in das Trainerteam
- Vertrauen in das Trainingssystem

Du musst nicht alles sofort verstehen.
Aber du musst bereit sein, die Dinge umzusetzen.

**Der Fortschritt entsteht durch Umsetzung – nicht durch Diskussion.**

---

### Warum eigene Anpassungen problematisch sind

Viele machen den Fehler, Inhalte sofort mit ihrem eigenen Wissen zu vergleichen oder anzupassen.

Das Problem dabei: Dein aktuelles Denk- und Handlungsmuster ist genau das, was dich bisher nicht weitergebracht hat.

Wenn du neue Inhalte direkt veränderst:

- verfälschst du die Technik
- verlierst du die Struktur
- entstehen Fehler, die sich festsetzen

**Erst umsetzen. Dann verstehen. Dann bewerten.**

---

### Alles baut aufeinander auf

Unser Training ist strukturiert aufgebaut.

Jede Technik, jede Bewegung und jedes Prinzip baut auf vorherigen Inhalten auf.

Wenn du am Anfang Dinge falsch umsetzt oder veränderst, entstehen später Probleme:

- Verbindungen zwischen Techniken funktionieren nicht
- Abläufe werden unsauber
- Fortschritt wird langsamer

Deshalb ist es entscheidend, von Anfang an sauber zu arbeiten.

---

### Umgang mit Unsicherheit

Es ist normal, dass du nicht alles sofort verstehst.

Wichtig ist, wie du damit umgehst:

- Stelle Fragen, wenn etwas unklar ist
- Hole dir Feedback vom Trainer
- Improvisiere nicht eigenständig

Unsicherheit ist kein Problem. Falsche Eigenlösungen sind es.

---

### Entwicklung braucht Zeit

Dein Mindset verändert sich nicht von heute auf morgen. Es ist ein Prozess.

Du wirst Abläufe Schritt für Schritt verinnerlichen, sicherer werden und zunehmend verstehen, warum die Dinge so gemacht werden, wie sie gemacht werden.

Das braucht:

- Geduld
- Wiederholung
- konsequente Umsetzung

---

### Dein eigenes Tempo

Jeder lernt unterschiedlich schnell.

Deshalb gilt:

- Vergleiche dich nicht mit anderen
- Konzentriere dich auf deinen Fortschritt
- Arbeite in deinem Tempo

Techniken dürfen langsam gelernt werden – solange sie korrekt umgesetzt werden.

---

### Kernaussage

**„Empty Your Mind" bedeutet:**

Du lässt dein altes Muster nicht dein neues Lernen blockieren.

1. Du setzt um, was dir gezeigt wird.
2. Du vertraust dem Prozess.
3. Du gibst dir die Zeit, besser zu werden.`,
  },

  // ── 2. 🎯 Dein Zielsetzungsmindset ──────────────────────────────────────
  {
    id: 'zielsetzungsmindset',
    moduleId: 'mod-2',
    title: 'Dein Zielsetzungsmindset',
    icon: '🎯',
    order: 3,
    theoryText: `## Dein Zielsetzungsmindset

Bevor du langfristig Fortschritte machen kannst, muss klar sein, wohin du überhaupt willst.

Viele starten mit Aussagen wie:

- „Ich will fitter werden"
- „Ich will mich sicherer fühlen"
- „Ich will mal was Neues ausprobieren"

Das ist ein Anfang – aber noch kein klares Ziel.

Vielleicht hast du dich gerade in einer dieser Aussagen wiedererkannt.

Genau deshalb gibt es dieses Kapitel.

---

### Schritt 1: Verstehe das System

Bevor du dir ein Ziel setzt, musst du verstehen, was du überhaupt trainierst.

Unser Training besteht aus 10 Modulen, die aufeinander aufbauen:

**1. Mission Begins**

In diesem Modul lernst du die ersten Grundlagen, damit du überhaupt sinnvoll am Training teilnehmen kannst.

- richtige Stellung
- Beinarbeit / Schrittarbeit
- erste Schlagtechniken
- erste Angriffstechniken
- erste Verteidigungstechniken
- Grundbewegungen
- Steigerung deiner Fitness
- Mobility, Dehnung und körperliche Vorbereitung

Ziel: Du bekommst eine körperliche und technische Basis, um aktiv am Unterricht teilnehmen und die ersten Abläufe sauber umsetzen zu können.

---

**2. Mindset & Readiness**

In diesem Modul geht es um deine innere Einstellung zum Training und zu Konflikten.

- Trainingsroutine aufzubauen
- dranzubleiben
- mit Druck besser umzugehen
- mehr Selbstvertrauen zu entwickeln
- im Alltag selbstsicherer aufzutreten
- Konflikte mental besser einzuordnen
- handlungsfähig zu bleiben

Ziel: Du entwickelst ein stabiles Mindset, mehr Selbstsicherheit und eine bessere Trainingshaltung.

---

**3. P.O.N.R. – Point of No Return**

Der Moment, an dem eine Situation kurz davor ist zu eskalieren und du nicht mehr einfach abwarten kannst.

- deine rote Linie zu definieren
- deinen persönlichen Point of No Return zu erkennen
- Konflikte frühzeitig zu identifizieren
- zu verstehen, wann eine Situation kippt
- nicht zu lange zu warten
- dem Gegner zuvorzukommen
- eine Situation schnell zu beenden, bevor sie vollständig eskaliert

Ziel: Du lernst, rechtzeitig zu handeln, deine rote Linie klar zu erkennen und dem Gegner zuvorzukommen.

---

**4. R.C.A.T. – Redirect, Control, Attack, Takeaway**

Dieses Modul greift, wenn eine Situation bereits eskaliert ist.

- Redirect – den Angriff umlenken oder stoppen
- Control – Kontrolle über die Situation herstellen
- Attack – aktiv kontern und Druck aufbauen
- Takeaway – die Gefahr beenden und dich lösen

Ziel: Du lernst, eine eskalierte Situation schnell zu stoppen, zu kontrollieren und zu beenden.

---

**5. Backup Insurance I – Stand**

Wenn du die Situation nicht innerhalb weniger Sekunden beenden konntest, brauchst du eine Backup-Lösung.

- Distanz
- Schläge
- Tritte
- Verteidigung
- Stabilität

Ziel: Du bleibst im Stand handlungsfähig, auch wenn die Situation länger dauert.

---

**6. Backup Insurance II – Ground**

Dieses Modul greift, wenn du auf dem Boden landest.

- dich am Boden zu orientieren
- dich zu schützen
- aufzustehen
- dich aus ungünstigen Positionen zu befreien

Ziel: Du kannst Bodensituationen überstehen und schnellstmöglich wieder aufstehen.

---

**7. Backup Insurance III – Infight**

Hier geht es um sehr enge Distanzen – jemand packt, würgt oder hält dich fest.

Du lernst, in dieser Distanz handlungsfähig zu bleiben und dich zu befreien.

Ziel: Du lernst, dich aus Nahdistanz-Situationen zu lösen und die Kontrolle zurückzugewinnen.

---

**8. Weapons I – Non-Lethal & Improvised Tools**

- Pfefferspray
- Tactical Pen
- Kugelschreiber
- Schlüssel
- andere improvisierte Gegenstände

Ziel: Du verstehst, wie du Hilfsmittel sinnvoll einsetzen kannst, um deine Handlungsmöglichkeiten zu erweitern.

---

**9. Weapons II – Edged & Impact Weapon Defense**

- Distanzverhalten
- Winkelarbeit
- typische Angriffslinien
- grundlegende Verteidigungsprinzipien

Ziel: Du wirst auf extreme Situationen vorbereitet und lernst, handlungsfähig zu bleiben.

---

**10. Tactics & Survival**

Hier wird alles miteinander kombiniert.

- Stand, Boden und Infight
- Hilfsmittel und Waffen
- verschiedene Umgebungen und enge Räume
- unterschiedliche Lichtverhältnisse und Szenarien
- Stop the Bleed – Erstversorgung bei Verletzungen

Ziel: Du lernst, Inhalte unter realistischen Bedingungen anzuwenden und in komplexen Situationen zu handeln.

---

### Schritt 2: Bestimme deinen aktuellen Stand

Jetzt kommt der entscheidende Punkt:

Wo stehst du aktuell?

Frag dich:

- In welchem Modul bewege ich mich gerade?
- Was kann ich schon?
- Wo habe ich Lücken?

Wenn du das beantworten kannst: sehr gut.
Wenn nicht: beginnt hier deine Mitarbeit.

---

### Schritt 3: Definiere dein Ziel

Jetzt setzt du dir ein erstes Ziel.

Nicht perfekt – aber klar.

Beispiele:

- „Ich will mich im Stand sicher fühlen"
- „Ich will am Boden nicht hilflos sein"
- „Ich will lernen, mit Drucksituationen umzugehen"

Dein Ziel ist dein Ausgangspunkt.

---

### Schritt 4: Werde aktiv

Jetzt gehst du aktiv auf einen Trainer zu.

Nicht andersrum.

Warum?

- weil dein Fortschritt von dir ausgeht
- weil du von Anfang an in die Eigenverantwortung gehst

Du sollst nicht in die Haltung kommen:
„Mein Trainer wird das schon für mich machen."

Sondern du machst dir selbst Gedanken:

- Wo stehe ich aktuell?
- Wo will ich hin?
- Was ist mein nächster Schritt?

Und genau mit diesen Gedanken gehst du ins Gespräch.

Das Gespräch dient nicht dazu, dir die Arbeit abzunehmen – sondern dazu, deine Überlegungen zu schärfen und klarer zu machen.

**Das ist kein einmaliges Gespräch.**

Du sollst regelmäßig:

- deinen Stand reflektieren
- dein Ziel überprüfen
- Feedback einholen
- den nächsten Schritt klären

Wenn du einfach nur zum Training kommst und hoffst, dass „das schon alles wird", bleibst du passiv.

**Und passives Training führt zu passiven Ergebnissen.**

---

### Schritt 5: Nutze die Roadmap

Die Roadmap entsteht aus:

- deinem Verständnis
- deinem Ziel
- deinem Gespräch mit dem Trainer

Sie zeigt dir:

- deinen nächsten sinnvollen Schritt
- deinen Fokus
- deinen Weg durch das System

---

### Kernaussage

Du bist nicht hier, um einfach nur mitzumachen.

Du bist hier, um besser zu werden.

Und das bedeutet:

**Verantwortung übernehmen. Selbst denken. Aktiv handeln.**

Martial Instinct bedeutet für uns nicht nur die Techniken, die du lernst.

Es ist das Gesamtsystem – inklusive deiner inneren Haltung.

Und diese Haltung bedeutet:

👉 Eigenverantwortung statt Abwarten
👉 Aktivität statt Passivität
👉 Entwicklung statt Stillstand

Dein Trainer unterstützt dich.
**Aber dein Fortschritt beginnt bei dir.**`,
  },

  // ── 3. 🔥 Motivation & Commitment ───────────────────────────────────────
  {
    id: 'motivation-commitment',
    moduleId: 'mod-2',
    title: 'Motivation & Commitment',
    icon: '🔥',
    order: 4,
    theoryText: `## Motivation & Commitment

Um hier eins direkt klarzustellen:
Mein Trainerteam und ich sind nicht hier, um dich zu motivieren.

Vielleicht denkst du jetzt:
„Was soll das denn heißen?"
„Warum wollen sie mich nicht motivieren?"

Wie fühlt sich das an, was du gerade gelesen hast?
Fühl mal kurz rein und denk darüber nach, bevor du weiterlesen.
Was hast du gerade für ein Gefühl?

Okay.
Lass mich dir kurz erklären, was wir damit meinen.

**Motivation ist nichts, was wir dir geben können.**

Motivation entsteht immer aus dir selbst.
Und zwar aus deinem Motiv.

---

### Der häufigste Denkfehler

Viele Menschen verwechseln Motivation mit einem guten Gefühl.

Sie denken:
„Ich bin motiviert, wenn ich Lust habe."
„Ich bin motiviert, wenn ich mich gut fühle."
„Ich bin demotiviert, weil ich mich gerade nicht danach fühle."

Das ist falsch. Das ist keine Motivation.

Das ist:

- Stimmung
- Euphorie
- ein kurzfristiges Hochgefühl

Und darauf kannst du dich nicht verlassen.

---

### Was Motivation wirklich ist

Motivation basiert immer auf einem Motiv.

- Dein Motiv ist der Grund, warum du etwas tust.
- Deine Motivation ist die Energie, die daraus entsteht.

Und auf diese Motivation kannst du dich verlassen –
wenn dein Motiv stark genug ist.

---

### Beispiel: Unter Wasser

Stell dir vor, jemand drückt deinen Kopf unter Wasser.

Du bekommst keine Luft mehr.
Dein Körper kämpft.

In diesem Moment hast du keine gute Stimmung.
Keine Euphorie. Kein „ich hab Lust".

Du hast ein Motiv:

- Du willst Luft.
- Du willst überleben.

Und daraus entsteht sofort Motivation.

---

### Beispiel: Kind auf der Straße

Stell dir vor, du siehst, wie ein Kind auf der Straße spielt.

In einiger Entfernung kommt ein LKW angerast.

In diesem Moment ist es egal:

- wie du dich fühlst
- ob du müde bist
- ob du Lust hast

Du wirst handeln.

Warum? Weil du ein klares Motiv hast:

- Du willst das Kind von der Straße holen.
- Du willst verhindern, dass etwas passiert.

Und genau daraus entsteht deine Motivation – unabhängig davon, wie deine Stimmung gerade ist.

---

### Übertragung auf dein Training

Natürlich ist Training keine Lebensgefahr.

Aber das Prinzip ist das gleiche:

Wenn dein Motiv schwach ist:

- trainierst du nur, wenn du Lust hast
- bleibst du unregelmäßig
- hörst du irgendwann auf

Wenn dein Motiv stark ist:

- trainierst du auch ohne Lust
- bleibst du konstant
- entwickelst dich weiter

Unabhängig von deiner Stimmung.

---

### Dein echtes Motiv im Training

Frag dich ehrlich:

- Warum bist du hier?
- Was willst du wirklich verändern?
- Wo fühlst du dich unsicher?
- Was stört dich an deiner aktuellen Situation?

Ein starkes Motiv im Training ist zum Beispiel:

- du willst dich sicher fühlen
- du willst dich nicht hilflos fühlen
- du willst abends entspannt nach Hause gehen
- du willst dich nicht ständig unsicher fühlen

Das ist kein kleines Ziel.

Das ist Lebensqualität. Das ist Selbstsicherheit. Das ist Freiheit.

---

### Der entscheidende Unterschied

**Stimmung sagt:** „Ich hab heute keine Lust."
**Motiv sagt:** „Ich zieh es trotzdem durch."

Und daraus entsteht Motivation.

---

### Commitment

Commitment bedeutet:

Du hast dein Motiv erkannt und triffst eine Entscheidung:

**Ich ziehe das durch.**

Unabhängig davon:

- wie du dich fühlst
- wie der Tag läuft
- ob es gerade leicht ist oder nicht

---

### Kernaussage

Motivation ist nichts, was dir jemand geben kann.

Motivation entsteht immer aus deinem Motiv.

Und wenn dein Motiv stark genug ist,
wirst du handeln – unabhängig von deiner Stimmung.

👉 Stimmung sagt: „Ich hab keine Lust."
👉 Motiv sagt: „Ich zieh es durch."
👉 Commitment sagt: „Ich hab entschieden."`,
  },

  // ── 4. 📚 Konzept der Lernbereitschaft ──────────────────────────────────
  {
    id: 'lernbereitschaft',
    moduleId: 'mod-2',
    title: 'Konzept der Lernbereitschaft',
    icon: '📚',
    order: 2,
    theoryText: `## Konzept der Lernbereitschaft

### Was entscheidet über deinen Trainingserfolg?

Es gibt drei Faktoren, die deinen Trainingserfolg beeinflussen:

1. Deine Lernbereitschaft
2. Die Trainerqualität
3. Das Trainingskonzept

Und genau in dieser Reihenfolge ist es für dich relevant.

Der Grund ist einfach:

Du kannst nur einen dieser Faktoren wirklich beeinflussen: **Deine Lernbereitschaft.**

Und genau darauf sollte dein Fokus liegen:
auf einer dauerhaft hohen Lernbereitschaft.

---

### Trainingskonzept – was du verstehen musst

Unser Trainingskonzept ist darauf ausgelegt, in der Realität zu funktionieren.

Nicht:

- was sich gut anfühlt
- was man sich vorstellt
- was moralisch „richtig" wirkt

Sondern: was in realen Konflikten funktioniert.

Dieses Konzept basiert auf:

- eigenen Erfahrungen
- Erfahrungen anderer
- Analyse realer Situationen
- strukturierter Auswertung
- Anpassung und Weiterentwicklung

---

### Anpassung: Konzept vs. Du

Was oft missverstanden wird:

Viele glauben, dass sich das Trainingskonzept oder der Stil an den Schüler anpassen muss.

Das stimmt so nicht.

Unserer Meinung nach sollte es wie folgt sein:

**Du passt dich an ein System an, das darauf ausgelegt ist, in der Realität und im Ernstfall zu funktionieren.**

Es bringt nichts, dich an einen Stil anzupassen, der nicht funktioniert – genauso wenig, ein funktionierendes System so zu verändern, bis es sich für dich angenehm anfühlt.

**Warum ist das wichtig?**

Viele Menschen, die sich unsicher fühlen oder lernen wollen, sich zu verteidigen, haben einen sehr starken moralischen Kompass und wollen natürlich niemanden verletzen.

Das ist grundsätzlich nichts Schlechtes.

Das Problem dabei:

Dieser moralische Kompass steht dir im Ernstfall oft im Weg.

Denn genau hier entsteht der Nachteil:

- du zögerst
- du handelst unentschlossen
- du denkst darüber nach, wie du dich verteidigen kannst, ohne die andere Person dabei zu verletzen

Das führt dazu, dass du unterlegen bist, bevor die Situation überhaupt richtig begonnen hat.

Denn der Gegner hat diesen Gedanken nicht.
Im Gegenteil: Er ist fest entschlossen, sein Ding durchzuziehen.

Und deshalb brauchst du ein System:

- das unabhängig von moralischen Vorstellungen funktioniert
- das unabhängig von Wunschdenken funktioniert
- das dir erlaubt, in der Realität handlungsfähig zu bleiben

Und genau das bietet dir dieses Trainingskonzept.

---

### Trainerqualität – objektiv vs. subjektiv

Ein Trainer hat in relativ kurzer Zeit mit sehr vielen Menschen zu tun.
Das macht ihn zu einem Multiplikator, der mit seinem Verhalten viele Menschen beeinflusst.

Damit geht eine große Verantwortung einher.

Gleichzeitig werden Erwartungen an den Trainer gestellt. Diese lassen sich in zwei Kategorien unterteilen:

**Subjektive Erwartungen**

Hier geht es um persönliche Vorstellungen, die nichts mit der Qualität des Trainings zu tun haben.

Zum Beispiel:

- Sympathie
- persönliche Ansichten
- Auftreten
- individuelle Erwartungen an Kommunikation oder Stil

Diese Erwartungen entstehen aus deiner eigenen Einstellung.

Ein Trainer kann es nicht allen recht machen.
Subjektive Erwartungen werden daher nie vollständig erfüllt.

**Objektive Erwartungen**

Hier geht es um das, was wirklich zählt:

- Fachkompetenz
- Struktur im Training
- klare Vermittlung der Inhalte
- Einhaltung von Prinzipien, Regeln und Abläufen

Diese Faktoren bilden die Grundlage für die Autorität eines Trainers.

Genau darauf legen wir den Fokus.

Das Training folgt klaren Strukturen, Richtlinien und Prinzipien sowie einem definierten Trainingsplan.

Das ist der Standard, nach dem hier trainiert wird.

---

### Der entscheidende Faktor: Deine Lernbereitschaft

Jetzt kommt der wichtigste Punkt:

Alles steht und fällt mit deiner Lernbereitschaft.

**Das beste Konzept + gute Trainer = kein Fortschritt**

wenn du nicht bereit bist:

- zuzuhören
- umzusetzen
- dich anzupassen

---

### Kernaussage

**Dein Trainingserfolg hängt davon ab, wie lernbereit du bist.**

---

### Deine Aufgabe

Frag dich jetzt ehrlich:

- Setze ich wirklich das um, was im Training gezeigt wird — oder mache ich mein eigenes Ding?
- Bin ich offen für neue Dinge — oder halte ich an dem fest, was ich schon kann?

Und dann:

- Geh aktiv auf einen Trainer zu.
- Hol dir regelmäßiges Feedback.
- Arbeite bewusst an deiner Lernbereitschaft.`,
  },

];

// ── Lookup-Helper ────────────────────────────────────────────────────────────

export const ALL_MODULE_TOPICS: ModuleTopic[] = [
  ...MOD1_TOPICS,
  ...MOD2_TOPICS,
];

export function getTopicsForModule(moduleId: string): ModuleTopic[] {
  return ALL_MODULE_TOPICS
    .filter(t => t.moduleId === moduleId)
    .sort((a, b) => a.order - b.order);
}

export function getTopicById(topicId: string, moduleId: string): ModuleTopic | undefined {
  return ALL_MODULE_TOPICS.find(t => t.id === topicId && t.moduleId === moduleId);
}
