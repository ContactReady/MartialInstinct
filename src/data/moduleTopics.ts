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

// ── Lookup-Helper ────────────────────────────────────────────────────────────

export const ALL_MODULE_TOPICS: ModuleTopic[] = [
  ...MOD1_TOPICS,
  // Weitere Module folgen
];

export function getTopicsForModule(moduleId: string): ModuleTopic[] {
  return ALL_MODULE_TOPICS
    .filter(t => t.moduleId === moduleId)
    .sort((a, b) => a.order - b.order);
}

export function getTopicById(topicId: string, moduleId: string): ModuleTopic | undefined {
  return ALL_MODULE_TOPICS.find(t => t.id === topicId && t.moduleId === moduleId);
}
