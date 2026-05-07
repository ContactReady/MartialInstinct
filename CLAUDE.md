# MI Member Plattform JKD

## Tech Stack
- React + Vite + TypeScript
- Tailwind CSS
- Supabase (Auth + Datenbank)

## Projekt-Kontext
Mitglieder-Verwaltungsplattform für Martial Instinct Köln.
Kampfsport-Schule mit JKD, Eskrima, Selbstverteidigung.
Zielgruppe: Mitglieder, Trainer, Admins.

## Design-Regeln
- Nutze IMMER den frontend-design Skill für UI-Entscheidungen
- Nutze IMMER den UI/UX Pro Max Skill für Design-System-Generierung
- Branche: Kampfsport / Martial Arts / Premium
- Stil: dunkel, kraftvoll, professionell — kein generischer KI-Look
- Keine generischen AI-Aesthetics
- Mobile-first

## Arbeitsweise
- Vor größeren Änderungen: Planmodus nutzen
- Stelle Rückfragen bevor du implementierst
- Arbeitssprache: Deutsch
- Erkläre was du tust und warum
- CRITICAL: Wenn der User sagt "erst bestätigen", "erst antworten", "bevor du umsetzt" o.ä. → NIEMALS direkt implementieren. Immer warten bis der User explizit grünes Licht gibt. Das gilt auch nach Session-Komprimierung.

## Arbeitsablauf

### Schritt 1 — Abhängigkeiten prüfen
Bevor irgendeine Änderung gemacht wird:

- Welche bestehenden Funktionen oder Komponenten sind betroffen?
- Welche Komponenten, Daten oder Systeme hängen daran?
- Was könnte dadurch kaputtgehen?

NIEMALS blind ändern.
Bei Unsicherheit zuerst fragen.

---

### Schritt 2 — Plan erstellen
Erst wenn Abhängigkeiten klar sind:

- Was genau wird geändert?
- Welche Schritte in welcher Reihenfolge?
- Was ist das Endergebnis?

NIEMALS implementieren ohne vorherigen Plan.
NIEMALS eigenmächtige Verbesserungen außerhalb des Plans.

---

### Schritt 3 — Umsetzen
Erst nach Bestätigung des Plans:

- Schritt für Schritt nach Plan
- Keine Architekturänderungen ohne Absprache
- Keine funktionierenden Features unnötig anfassen
- Keine Änderungen außerhalb des aktuellen Scopes oder Plans

---

### Schritt 4 — Testen
Nach jeder Änderung:

- Funktioniert die neue Funktion?
- Funktionieren alle bestehenden Funktionen noch?
- Gibt es Bugs oder Nebenwirkungen?
- Keine Live-Änderung ohne vollständigen Test

---

## Sicherheit

KRITISCH — gilt absolut und ohne Ausnahme:

- NIEMALS API Keys, Tokens, Secrets oder Zugangsdaten direkt im Code speichern
- NIEMALS Supabase Keys, Auth Tokens oder sonstige Credentials hardcoden
- Alle Secrets ausschließlich über `.env` Dateien verwalten
- NIEMALS Secrets committen oder im Frontend exponieren

