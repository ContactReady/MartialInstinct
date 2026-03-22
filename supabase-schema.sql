-- MARTIAL INSTINCT - Supabase Database Schema
-- Dieses Schema in Supabase SQL Editor ausführen

-- ============================================
-- 1. TABLES ERSTELLEN
-- ============================================

-- Standorte
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Benutzer (Members & Instructors)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'member',
  location_id UUID REFERENCES locations(id),
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_block TEXT DEFAULT 'conflict_ready',
  streak_weeks INTEGER DEFAULT 0,
  streak_best INTEGER DEFAULT 0,
  bandaids INTEGER DEFAULT 0,
  last_checkin TIMESTAMP WITH TIME ZONE,
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  ban_until TIMESTAMP WITH TIME ZONE,
  skills TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blöcke & Module
CREATE TABLE blocks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  color TEXT,
  icon TEXT,
  min_xp INTEGER DEFAULT 0
);

CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  block_id TEXT REFERENCES blocks(id),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  position INTEGER
);

-- Techniken
CREATE TABLE techniques (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES modules(id),
  name TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  xp_value INTEGER DEFAULT 25,
  position INTEGER
);

-- Technik-Status pro User
CREATE TABLE user_techniques (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  technique_id INTEGER REFERENCES techniques(id),
  status TEXT NOT NULL DEFAULT 'not_tested',
  evaluated_by UUID REFERENCES users(id),
  evaluated_at TIMESTAMP WITH TIME ZONE,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, technique_id)
);

-- Check-ins / Sessions
CREATE TABLE checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id),
  checkin_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  checkout_time TIMESTAMP WITH TIME ZONE,
  confirmed_by UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending'
);

-- Prüfungsanfragen
CREATE TABLE exam_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  technique_id INTEGER REFERENCES techniques(id),
  request_type TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  feedback TEXT,
  evaluated_by UUID REFERENCES users(id),
  evaluated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bewerbungen (Contact Ready & Instructor)
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  motivation TEXT,
  experience TEXT,
  availability TEXT,
  team_skills TEXT,
  stress_management TEXT,
  status TEXT DEFAULT 'pending',
  feedback TEXT,
  evaluated_by UUID REFERENCES users(id),
  evaluated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Portal
CREATE TABLE job_postings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  required_skills TEXT[],
  created_by UUID REFERENCES users(id),
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

-- Instructor Board Nachrichten
CREATE TABLE board_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Benachrichtigungen
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. INDEXES FÜR PERFORMANCE
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users(location_id);
CREATE INDEX idx_user_techniques_user ON user_techniques(user_id);
CREATE INDEX idx_checkins_user ON checkins(user_id);
CREATE INDEX idx_exam_requests_user ON exam_requests(user_id);
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ============================================
-- 3. INITIAL DATA
-- ============================================

-- Blöcke
INSERT INTO blocks (id, name, subtitle, color, icon, min_xp) VALUES
('conflict_ready', 'CONFLICT READY', 'Beginner', '#9CA3AF', '⚪', 0),
('combat_ready', 'COMBAT READY', 'Advanced', '#1F2937', '⚫', 800),
('tactical_ready', 'TACTICAL READY', 'Specialist', '#DC2626', '🔴', 2000),
('contact_ready', 'CONTACT READY', 'Operator', '#7F1D1D', '☠️', 4000),
('assistant_instructor', 'ASSISTANT INSTRUCTOR', 'Ausbilder', '#F59E0B', '🎓', 2000);

-- Standard Standorte
INSERT INTO locations (name, address) VALUES
('Headquarters', 'Hauptstandort'),
('Branch North', 'Nord Standorte'),
('Branch South', 'Süd Standorte');

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users können ihre eigenen Daten sehen
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Instructors können alle Users sehen
CREATE POLICY "Instructors can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid()::text 
      AND u.role IN ('instructor', 'tactical_instructor', 'head_instructor', 'owner')
    )
  );

-- ============================================
-- 5. FUNCTIONS & TRIGGERS
-- ============================================

-- Automatische updated_at Aktualisierung
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. STORAGE BUCKETS (für Bilder/Videos)
-- ============================================

-- In Supabase Dashboard unter Storage -> New Bucket:
-- Name: 'profile-pictures', Public: true
-- Name: 'technique-videos', Public: true
-- Name: 'certificates', Public: false
