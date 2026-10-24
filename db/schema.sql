-- ==============================================================
-- IIIT-NR Student Campus Hub - PostgreSQL Relational Schema
-- Compatible with PostgreSQL 14+, Neon Serverless, Render, Supabase
-- ==============================================================

-- 1. Users Table (Students & Administration)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  roll VARCHAR(50) UNIQUE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK(role IN ('admin', 'student')),
  branch VARCHAR(100),
  year VARCHAR(50),
  semester VARCHAR(50),
  cgpa VARCHAR(20),
  avatar TEXT,
  batch VARCHAR(50) DEFAULT '2024 - 2028',
  department VARCHAR(100),
  designation VARCHAR(100),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Auth Sessions Table (Bearer Token Authentication)
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Timetable Table (Branch-Aware Weekly Schedule with SERIAL ID)
CREATE TABLE IF NOT EXISTS timetable (
  id SERIAL PRIMARY KEY,
  branch VARCHAR(100) NOT NULL DEFAULT 'Data Science & AI',
  day VARCHAR(20) NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  subject VARCHAR(150) NOT NULL,
  room VARCHAR(50) DEFAULT '203',
  slot_type VARCHAR(50) DEFAULT 'm',
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(branch, day, time_slot)
);

-- 4. Study Resources Table (Notes, PYQs, Reference Links)
CREATE TABLE IF NOT EXISTS resources (
  id VARCHAR(100) PRIMARY KEY,
  subject VARCHAR(150) NOT NULL,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  semester VARCHAR(50) DEFAULT 'Sem 1',
  unit VARCHAR(50) DEFAULT 'Unit 1-4',
  link TEXT NOT NULL,
  description TEXT,
  contributor VARCHAR(150) DEFAULT 'Admin / Academic Affairs',
  notes_count INTEGER DEFAULT 12,
  papers_count INTEGER DEFAULT 6,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Academic Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id VARCHAR(100) PRIMARY KEY,
  subject VARCHAR(150) NOT NULL,
  title VARCHAR(255) NOT NULL,
  due_date VARCHAR(50) NOT NULL,
  priority VARCHAR(20) DEFAULT 'Medium',
  status VARCHAR(20) DEFAULT 'Pending',
  description TEXT,
  faculty VARCHAR(150) DEFAULT 'Admin / Academic Affairs',
  student_id VARCHAR(100),
  is_broadcast INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Assignment Completions Table (Student Checklist Tracking)
CREATE TABLE IF NOT EXISTS assignment_completions (
  id SERIAL PRIMARY KEY,
  assignment_id VARCHAR(100) NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_roll VARCHAR(50) NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(assignment_id, student_roll)
);

-- 7. Announcements Table (Campus Notices & Circulars)
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'Academic',
  urgent INTEGER DEFAULT 0,
  author VARCHAR(150) DEFAULT 'Dean Academic Office',
  date_str VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Campus Events Table (Fests, Sports, Hackathons)
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date_str VARCHAR(50) NOT NULL,
  venue VARCHAR(150) NOT NULL,
  category VARCHAR(50) DEFAULT 'Hackathon',
  description TEXT,
  badge_color VARCHAR(50) DEFAULT 'bg-indigo-600',
  banner TEXT,
  created_by VARCHAR(150) DEFAULT 'Administration',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Event Registrations Table (Student RSVP Tracking)
CREATE TABLE IF NOT EXISTS event_registrations (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(100) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_roll VARCHAR(50) NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, student_roll)
);

-- 10. Exams Table (Exams & Syllabus Schedule)
CREATE TABLE IF NOT EXISTS exams (
  id VARCHAR(100) PRIMARY KEY,
  subject VARCHAR(150) NOT NULL,
  title VARCHAR(255) NOT NULL,
  exam_date VARCHAR(50) NOT NULL,
  exam_time VARCHAR(50) DEFAULT '10:00 AM - 01:00 PM',
  room VARCHAR(50) DEFAULT 'Room 203',
  syllabus TEXT,
  created_by VARCHAR(150) DEFAULT 'Academic Affairs',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Mess Menu Table (Hostel Weekly Dining Schedule)
CREATE TABLE IF NOT EXISTS mess_menu (
  id SERIAL PRIMARY KEY,
  day_of_week VARCHAR(20) NOT NULL UNIQUE,
  breakfast TEXT NOT NULL,
  lunch TEXT NOT NULL,
  snacks TEXT NOT NULL,
  dinner TEXT NOT NULL,
  special_note TEXT,
  updated_by VARCHAR(150) DEFAULT 'Hostel Mess Committee',
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. Mess Meal Feedback Table (Student Dining Ratings)
CREATE TABLE IF NOT EXISTS mess_feedback (
  id SERIAL PRIMARY KEY,
  student_roll VARCHAR(50) NOT NULL,
  student_name VARCHAR(150),
  meal_type VARCHAR(50) NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. Campus Exchange Listings (Marketplace & Lost-Found)
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100),
  user_name VARCHAR(150) NOT NULL,
  user_roll VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK(type IN ('sell', 'lost', 'found')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'General',
  price VARCHAR(50),
  location VARCHAR(100),
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK(status IN ('active', 'sold', 'resolved')),
  contact_pref VARCHAR(50) DEFAULT 'In-App Message',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. Campus Exchange Inquiries (Buyer-Seller Messages)
CREATE TABLE IF NOT EXISTS marketplace_inquiries (
  id SERIAL PRIMARY KEY,
  listing_id VARCHAR(100) NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  sender_roll VARCHAR(50) NOT NULL,
  sender_name VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  contact_info VARCHAR(150),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 15. Resource Bookmarks Table
CREATE TABLE IF NOT EXISTS resource_bookmarks (
  id SERIAL PRIMARY KEY,
  student_roll VARCHAR(50) NOT NULL,
  resource_id VARCHAR(100) NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_roll, resource_id)
);

-- 16. Resource Reports Table (Flagged Links & Inaccuracies)
CREATE TABLE IF NOT EXISTS resource_reports (
  id SERIAL PRIMARY KEY,
  resource_id VARCHAR(100) NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  student_roll VARCHAR(50) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 17. Centralized Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_roll VARCHAR(50),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link_view VARCHAR(50),
  is_read INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_roll ON users(roll);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_timetable_branch_day ON timetable(branch, day);
CREATE INDEX IF NOT EXISTS idx_assignment_completions_student ON assignment_completions(student_roll);
CREATE INDEX IF NOT EXISTS idx_event_registrations_student ON event_registrations(student_roll);
CREATE INDEX IF NOT EXISTS idx_exchange_type ON marketplace_listings(type);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_roll);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON resources(subject);
