# 🥋 MARTIAL INSTINCT - Deployment Guide

## 🚀 Quick Launch (Kostenlos)

### Voraussetzungen
- ✅ Domain vorhanden
- ✅ E-Mail-Hosting vorhanden
- ✅ Supabase Account (kostenlos)

---

## 📋 SCHRITT-FÜR-SCHRITT

### 1️⃣ Supabase Datenbank einrichten (10 Minuten)

1. **Einloggen** bei [supabase.com](https://supabase.com)
2. **Projekt öffnen**: `ujrbmxwobrpkpsyktpqi`
3. **SQL Editor** öffnen (linke Sidebar)
4. **Schema ausführen**:
   - Öffne die Datei `supabase-schema.sql`
   - Kopiere den gesamten Inhalt
   - Füge ihn im SQL Editor ein
   - Klicke auf "Run"

✅ Alle Tabellen sind jetzt erstellt!

---

### 2️⃣ Environment Variablen setzen (2 Minuten)

Erstelle eine `.env` Datei im Projekt-Root:

```bash
VITE_SUPABASE_URL=https://ujrbmxwobrpkpsyktpqi.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_aNUcwK5iLhiT350jgvZNvw_ArVPUlq8
```

---

### 3️⃣ Vercel Deployment (5 Minuten)

**Option A: Über Vercel CLI**

```bash
# Installieren
npm install -g vercel

# Einloggen
vercel login

# Deployen
vercel --prod
```

**Option B: Über GitHub**

1. Repository auf GitHub erstellen
2. Code hochladen:
   ```bash
   git init
   git add .
   git commit -m "Martial Instinct Portal"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```
3. Bei Vercel mit GitHub verbinden
4. Automatic Deployment ist aktiv!

---

### 4️⃣ Domain verbinden (5 Minuten)

1. **Vercel Dashboard** → Dein Projekt → **Settings** → **Domains**
2. **Domain hinzufügen**: z.B. `portal.martialinstinct.de`
3. **DNS Record** bei deinem Domain-Provider setzen:
   ```
   Type: CNAME
   Name: portal
   Value: cname.vercel-dns.com
   ```
4. **Warten** (5-30 Minuten für DNS Propagation)

✅ SSL wird automatisch erstellt!

---

### 5️⃣ Testen

1. Öffne `https://portal.martialinstinct.de`
2. Teste mit diesen Accounts:

| Email | Passwort | Rolle |
|-------|----------|-------|
| max@email.de | member123 | Member |
| anna@email.de | member123 | Advanced |
| marcus@martialinstinct.de | owner123 | Owner |

---

## 🗄️ SUPABASE KONFIGURATION

### Row Level Security (RLS)

Die Policies sind im Schema enthalten. Wichtig:
- Members sehen nur ihre eigenen Daten
- Instructors sehen alle Members
- Owner sehen alles

### Storage Buckets

Im Supabase Dashboard unter **Storage**:

1. **Neuer Bucket**: `profile-pictures` (Public)
2. **Neuer Bucket**: `technique-videos` (Public)
3. **Neuer Bucket**: `certificates` (Private)

---

## 📊 NÄCHSTE SCHRITTE

### Phase 1: Testing (1 Woche)
- [ ] Mit 2-3 Instructors testen
- [ ] Check-in Flow prüfen
- [ ] Bewertungen testen
- [ ] Bugs melden

### Phase 2: Beta (2 Wochen)
- [ ] Alle Instructors onboarden
- [ ] 10-20 Members einladen
- [ ] Feedback sammeln
- [ ] Anpassungen vornehmen

### Phase 3: Launch (Woche 4)
- [ ] Alle Members einladen
- [ ] Begrüßungs-E-Mail senden
- [ ] Support bereitstellen

---

## 🔧 WARTUNG

### Backups
- Supabase macht automatische Backups
- Zusätzlich: Export über Dashboard möglich

### Updates
```bash
git pull
npm install
npm run build
vercel --prod
```

### Monitoring
- Vercel Analytics (gratis)
- Supabase Logs (gratis)

---

## 💰 KOSTEN

| Service | Plan | Kosten |
|---------|------|--------|
| Vercel | Free | €0 |
| Supabase | Free | €0 |
| Domain | Vorhanden | €0 |
| E-Mail | Vorhanden | €0 |
| **GESAMT** | | **€0/Monat** |

**Limits Free Tier:**
- Vercel: 100GB Bandbreite/Monat
- Supabase: 500MB Datenbank, 50k Requests/Monat
- Reicht für ~500 Members!

---

## 🆘 SUPPORT

### Häufige Probleme

**Build failed?**
```bash
npm run build
# Fehler lokal beheben
```

**Domain funktioniert nicht?**
- DNS Propagation dauert bis zu 24h
- Cache leeren: Strg+F5

**Datenbank-Verbindung fehlt?**
- `.env` Datei prüfen
- Keys korrekt kopiert?

---

## 📞 KONTAKT

Bei Fragen zum Deployment oder Anpassungen.

---

**Viel Erfolg mit Martial Instinct! 🥋**
