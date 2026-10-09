-- ==============================================================
-- IIIT-NR Student Campus Hub - Relational Database Schema
-- Database Engine: SQLite 3
-- Path: backend/database/campus_hub.sqlite
-- ==============================================================

PRAGMA foreign_keys = ON;

-- 1. Users Table (Students & Administration)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  roll TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'student')),
  branch TEXT,
  year TEXT,
  semester TEXT,
  cgpa TEXT,
  avatar TEXT,
  batch TEXT,
  department TEXT,
  designation TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Auth Sessions Table (Bearer Token Authentication)
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Timetable Table (Section 1 Room 203 w.e.f. 24/08/2026)
CREATE TABLE IF NOT EXISTS timetable (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  subject TEXT NOT NULL,
  room TEXT DEFAULT '203',
  slot_type TEXT DEFAULT 'm',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(day, time_slot)
);

-- 4. Study Resources Table (Notes, PYQs, Links - Admin Only)
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  semester TEXT DEFAULT 'Sem 1',
  link TEXT NOT NULL,
  description TEXT,
  contributor TEXT DEFAULT 'Admin / Academic Affairs',
  notes_count INTEGER DEFAULT 12,
  papers_count INTEGER DEFAULT 6,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Academic Assignments Table (Admin Only)
CREATE TABLE IF NOT EXISTS assignments (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  due_date TEXT NOT NULL,
  faculty TEXT DEFAULT 'Admin / Academic Affairs',
  is_broadcast INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Assignment Completions Table (Student Checklist Tracking)
CREATE TABLE IF NOT EXISTS assignment_completions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assignment_id TEXT NOT NULL,
  student_roll TEXT NOT NULL,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(assignment_id, student_roll),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
);

-- 7. Announcements Table (Campus Circulars - Admin Only)
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT DEFAULT 'Academic',
  urgent INTEGER DEFAULT 0,
  author TEXT DEFAULT 'Dean Academic Office',
  date_str TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Campus Events Table (Fests, Sports, Hackathons - Admin Only)
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date_str TEXT NOT NULL,
  venue TEXT NOT NULL,
  category TEXT DEFAULT 'Hackathon',
  description TEXT,
  badge_color TEXT DEFAULT 'bg-indigo-600',
  banner TEXT,
  created_by TEXT DEFAULT 'Administration',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. Event Registrations Table (Student Registration Tracking)
CREATE TABLE IF NOT EXISTS event_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL,
  student_roll TEXT NOT NULL,
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, student_roll),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Indexes for high-performance lookup
CREATE INDEX IF NOT EXISTS idx_users_roll ON users(roll);
CREATE INDEX IF NOT EXISTS idx_timetable_day ON timetable(day);
CREATE INDEX IF NOT EXISTS idx_assignment_completions_student ON assignment_completions(student_roll);
CREATE INDEX IF NOT EXISTS idx_event_registrations_student ON event_registrations(student_roll);
