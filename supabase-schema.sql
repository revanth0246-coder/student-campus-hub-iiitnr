-- ==============================================================
-- IIIT-NR Student Campus Hub - Production Hardened Supabase Schema
-- Target Platform: Supabase (PostgreSQL 15+)
-- File: supabase-schema.sql (Version 7 - Production Hardening & Idempotent Migration)
-- ==============================================================
-- MIGRATION & IDEMPOTENCY SPECIFICATION:
-- 1. SAFE TO RERUN REPEATEDLY (Zero Data Loss):
--    - Extensions: CREATE EXTENSION IF NOT EXISTS.
--    - Tables: CREATE TABLE IF NOT EXISTS preserves all existing data.
--    - Column Additions: ALTER TABLE ... ADD COLUMN IF NOT EXISTS ensures newer
--      columns (e.g. author_roll, is_verified, status) exist without dropping data.
--    - Seeds: INSERT INTO system_settings ... ON CONFLICT DO NOTHING.
--    - Indexes: CREATE INDEX IF NOT EXISTS.
--    - Functions: CREATE OR REPLACE FUNCTION updates logic in-place.
--    - Triggers: DROP TRIGGER IF EXISTS followed by CREATE TRIGGER.
--    - Policies: Explicit DROP POLICY IF EXISTS precedes every CREATE POLICY,
--      preventing PostgreSQL 42710 ('policy already exists') errors and safely
--      pruning obsolete legacy policies.
--    - Grants & Revocations: REVOKE and GRANT statements are fully idempotent.
-- 2. WHEN A FRESH PROJECT OR MANUAL MIGRATION IS REQUIRED:
--    - If an existing database contains legacy mock records whose values violate
--      column CHECK constraints (e.g., non-conforming category or meal_type values).
--    - If table columns were previously created with incompatible data types.
--    - Renaming existing columns or dropping unused tables (this script intentionally
--      avoids destructive DROP TABLE or DROP COLUMN statements).
--
-- AUDIT REVISIONS (v7):
-- 1. RESOURCE UPDATE PROTECTION & VERIFICATION INTEGRITY:
--    - Added protect_resource_fields() trigger: prevents authors from altering
--      author identity (created_by, author_id, author_name, author_roll, contributor),
--      counters (notes_count, papers_count), audit timestamps, or toggling
--      is_verified (restricted to administrators only).
--    - Preserves legitimate author updates to subject, title, type, semester, unit,
--      link, and description.
--    - Added RLS UPDATE & DELETE policies allowing resource authors to manage their uploads.
-- 2. HARDENED MARKETPLACE INQUIRY UPDATES:
--    - Added status column to marketplace_inquiries ('sent', 'seen', 'replied', 'closed').
--    - Added protect_marketplace_inquiry_fields() trigger: prevents participants from
--      altering id, listing_id, sender_id, sender_name, sender_roll, message, or created_at.
--    - Senders can update contact_info and mark status = 'closed'.
--    - Sellers (listing owners) can update status to 'seen', 'replied', 'closed'.
--    - Non-participants are completely blocked.
-- 3. EMAIL CONFIRMATION, EMAIL-CHANGE & DUPLICATE-ROLL INTEGRITY:
--    - handle_new_user() derives a roll ONLY if email is confirmed at signup,
--      domain is institutional, and prefix is strictly numeric student format (^[0-9]+$).
--    - Duplicate roll collision check on signup leaves roll = NULL pending admin review,
--      preventing Auth signup crashes.
--    - Upgraded handle_auth_user_updated() trigger firing AFTER UPDATE OF email,
--      email_confirmed_at ON auth.users: synchronizes email to public.profiles,
--      assigns verified roll upon confirmation (with duplicate collision guard),
--      and clears auto-derived student roll if confirmed email changes to a non-institutional domain.
-- 4. PRIVILEGED FUNCTION AUTHORIZATION & SQL EDITOR COMPATIBILITY:
--    - bootstrap_initial_admin() and admin_provision_student() strictly require
--      session_user IN ('postgres', 'supabase_admin') OR current_setting('request.jwt.claim.role', true) = 'service_role'.
--    - protect_profile_fields() checks genuine session user and service_role JWT claim.
--      Untrusted web callers cannot bypass academic field protections.
-- 5. RESOURCE REPORTS PRIVACY & INTEGRITY:
--    - Added set_resource_report_identity() trigger: forces reporter_id to auth.uid(),
--      derives student_roll from profile, and forces status = 'pending'.
-- 6. SCOPED GRANTS & REVOCATIONS:
--    - Scoped strictly to Campus Hub tables (17) and functions (23) by explicit name.
-- ==============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================
-- 1. SYSTEM CONFIGURATION & BASE TABLES
-- ==============================================================

-- --------------------------------------------------------------
-- 1.1 SYSTEM SETTINGS TABLE (Configurable Portal Policies)
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp()
);

COMMENT ON TABLE public.system_settings IS 'Portal-wide configuration flags (e.g. directory visibility).';

-- Seed default setting for student directory privacy
INSERT INTO public.system_settings (key, value, description)
VALUES 
  ('directory_public_to_students', 'true', 'When true, authenticated campus users can view non-sensitive student directory profiles. When false, directory is admin-only.')
ON CONFLICT (key) DO NOTHING;

-- --------------------------------------------------------------
-- 1.2 PROFILES TABLE (Linked 1:1 with auth.users)
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  roll TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('admin', 'student')),
  branch TEXT DEFAULT 'Data Science & AI',
  year TEXT DEFAULT '1st Year',
  semester TEXT DEFAULT 'Semester 1',
  cgpa TEXT DEFAULT '8.0',
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces',
  batch TEXT DEFAULT '2026 - 2030',
  department TEXT,
  designation TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp(),
  updated_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp()
);

-- Idempotent column additions for existing schema upgrades
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roll TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS branch TEXT DEFAULT 'Data Science & AI';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS year TEXT DEFAULT '1st Year';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS semester TEXT DEFAULT 'Semester 1';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cgpa TEXT DEFAULT '8.0';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS batch TEXT DEFAULT '2026 - 2030';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS designation TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

COMMENT ON TABLE public.profiles IS 'Campus user profiles linked 1:1 with auth.users. Contains academic & contact info.';

-- --------------------------------------------------------------
-- 1.3 TIMETABLE TABLE
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.timetable (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  branch TEXT NOT NULL DEFAULT 'Data Science & AI',
  day TEXT NOT NULL CHECK(day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  time_slot TEXT NOT NULL,
  subject TEXT NOT NULL,
  room TEXT DEFAULT '203',
  slot_type TEXT DEFAULT 'm',
  updated_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp(),
  UNIQUE(branch, day, time_slot)
);

COMMENT ON TABLE public.timetable IS 'Weekly schedule slots categorized by branch, day, and time slot.';

-- --------------------------------------------------------------
-- 1.4 STUDY RESOURCES TABLE
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY DEFAULT ('res_' || pg_catalog.substring(pg_catalog.gen_random_uuid()::TEXT, 1, 8)),
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('Notes', 'Previous Papers', 'Reference Books', 'Important Links')),
  semester TEXT DEFAULT 'Sem 1',
  unit TEXT DEFAULT 'Unit 1-4',
  link TEXT NOT NULL,
  description TEXT,
  contributor TEXT DEFAULT 'Admin / Academic Affairs',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  author_roll TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  notes_count INTEGER DEFAULT 12,
  papers_count INTEGER DEFAULT 6,
  created_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp(),
  updated_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp()
);

-- Idempotent column additions for existing schema upgrades
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS author_roll TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp();

COMMENT ON TABLE public.resources IS 'Curated syllabus notes, PYQs, and drive links contributed by students and faculty.';

-- --------------------------------------------------------------
-- 1.5 RESOURCE BOOKMARKS & REPORTS
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resource_bookmarks (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_roll TEXT NOT NULL,
  resource_id TEXT NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp(),
  UNIQUE(student_roll, resource_id)
);

COMMENT ON TABLE public.resource_bookmarks IS 'User-specific saved/bookmarked academic resources.';

CREATE TABLE IF NOT EXISTS public.resource_reports (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  student_roll TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp(),
  updated_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp()
);

ALTER TABLE public.resource_reports ADD COLUMN IF NOT EXISTS details TEXT;
ALTER TABLE public.resource_reports ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.resource_reports ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp();

COMMENT ON TABLE public.resource_reports IS 'Moderation queue for broken, outdated, or policy-violating resources.';

-- --------------------------------------------------------------
-- 1.6 ACADEMIC ASSIGNMENTS TABLE
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assignments (
  id TEXT PRIMARY KEY DEFAULT ('asgn_' || pg_catalog.substring(pg_catalog.gen_random_uuid()::TEXT, 1, 8)),
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  due_date TEXT NOT NULL,
  time_slot TEXT DEFAULT '23:59',
  description TEXT,
  max_marks INTEGER DEFAULT 100,
  branch TEXT DEFAULT 'Data Science & AI',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp()
);

COMMENT ON TABLE public.assignments IS 'Course coursework deadlines and submission tasks.';

-- --------------------------------------------------------------
-- 1.7 ASSIGNMENT COMPLETIONS (Student Checklist Tracking)
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assignment_completions (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  assignment_id TEXT NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_roll TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT TRUE,
  completed_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp(),
  UNIQUE(assignment_id, user_id)
);

COMMENT ON TABLE public.assignment_completions IS 'Personal assignment completion checkmarks per student.';

-- --------------------------------------------------------------
-- 1.8 EXAMS & SYLLABUS PLANNER
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exams (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  subject TEXT NOT NULL,
  exam_type TEXT NOT NULL CHECK(exam_type IN ('Mid-Sem', 'End-Sem', 'Quiz', 'Lab Exam', 'Practical')),
  exam_date DATE NOT NULL,
  exam_time TEXT NOT NULL,
  room TEXT DEFAULT '203',
  syllabus TEXT,
  branch TEXT DEFAULT 'Data Science & AI',
  created_by TEXT DEFAULT 'Academic Affairs',
  created_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp()
);

COMMENT ON TABLE public.exams IS 'Institute examination schedules and seating locations.';

-- --------------------------------------------------------------
-- 1.9 CAMPUS ANNOUNCEMENTS TABLE
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK(category IN ('general', 'academic', 'hostel', 'sports', 'cultural', 'placement', 'emergency')),
  priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
  author_name TEXT DEFAULT 'Administration',
  pinned BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp()
);

COMMENT ON TABLE public.announcements IS 'Campus-wide official circulars and notices.';

-- --------------------------------------------------------------
-- 1.10 CAMPUS EVENTS & HACKATHONS
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  venue TEXT NOT NULL,
  category TEXT DEFAULT 'technical' CHECK(category IN ('technical', 'cultural', 'sports', 'workshop', 'webinar', 'hackathon', 'other')),
  organizer TEXT NOT NULL,
  poster_url TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  created_by TEXT DEFAULT 'Administration',
  created_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp()
);

COMMENT ON TABLE public.events IS 'Extracurricular activities, hackathons, and guest seminars.';

-- --------------------------------------------------------------
-- 1.11 EVENT REGISTRATIONS TABLE
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_roll TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp(),
  attendance_status TEXT DEFAULT 'registered' CHECK(attendance_status IN ('registered', 'attended', 'cancelled')),
  UNIQUE(event_id, user_id)
);

COMMENT ON TABLE public.event_registrations IS 'Student event RSVPs and attendance status.';

-- --------------------------------------------------------------
-- 1.12 HOSTEL MESS MENU TABLE
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mess_menu (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  day TEXT NOT NULL CHECK(day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  meal_type TEXT NOT NULL CHECK(meal_type IN ('breakfast', 'lunch', 'snacks', 'dinner')),
  items TEXT[] NOT NULL DEFAULT '{}',
  special_item TEXT,
  timing TEXT,
  updated_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp(),
  UNIQUE(day, meal_type)
);

COMMENT ON TABLE public.mess_menu IS 'Weekly hostel catering menu schedule.';

-- --------------------------------------------------------------
-- 1.13 MESS MEAL FEEDBACK & RATINGS TABLE
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mess_feedback (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_roll TEXT NOT NULL,
  student_name TEXT NOT NULL,
  meal_type TEXT NOT NULL CHECK(meal_type IN ('breakfast', 'lunch', 'snacks', 'dinner')),
  date DATE NOT NULL DEFAULT pg_catalog.current_date,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp()
);

COMMENT ON TABLE public.mess_feedback IS 'Daily student dining reviews and meal ratings.';

-- --------------------------------------------------------------
-- 1.14 CAMPUS EXCHANGE / MARKETPLACE LISTINGS
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id TEXT PRIMARY KEY DEFAULT ('item_' || pg_catalog.substring(pg_catalog.gen_random_uuid()::TEXT, 1, 8)),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK(price >= 0),
  category TEXT NOT NULL CHECK(category IN ('books', 'electronics', 'cycles', 'hostel_essentials', 'notes', 'clothing', 'other')),
  condition TEXT NOT NULL CHECK(condition IN ('brand_new', 'like_new', 'good', 'fair', 'poor')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_roll TEXT NOT NULL,
  user_name TEXT NOT NULL,
  contact_pref TEXT DEFAULT 'In-App Message',
  image_url TEXT,
  location TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'pending_exchange', 'sold', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp(),
  updated_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp()
);

ALTER TABLE public.marketplace_listings ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.marketplace_listings ADD COLUMN IF NOT EXISTS user_roll TEXT;
ALTER TABLE public.marketplace_listings ADD COLUMN IF NOT EXISTS contact_pref TEXT DEFAULT 'In-App Message';
ALTER TABLE public.marketplace_listings ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.marketplace_listings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp();

COMMENT ON TABLE public.marketplace_listings IS 'Student marketplace buy/sell, lost and found listings.';

-- --------------------------------------------------------------
-- 1.15 CAMPUS EXCHANGE INQUIRIES
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_inquiries (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_roll TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  contact_info TEXT,
  status TEXT DEFAULT 'sent' CHECK(status IN ('sent', 'seen', 'replied', 'closed')),
  created_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp(),
  updated_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp()
);

ALTER TABLE public.marketplace_inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sent' CHECK(status IN ('sent', 'seen', 'replied', 'closed'));
ALTER TABLE public.marketplace_inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp();

COMMENT ON TABLE public.marketplace_inquiries IS 'Buyer-to-seller item exchange messages.';

-- --------------------------------------------------------------
-- 1.16 NOTIFICATIONS TABLE
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_roll TEXT,
  target_branch TEXT,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_view TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT pg_catalog.clock_timestamp()
);

ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS target_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS target_branch TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

COMMENT ON TABLE public.notifications IS 'Targeted user notifications and broadcast campus alerts.';

-- ==============================================================
-- 2. SECURITY DEFINER HELPER & RPC FUNCTIONS
-- ==============================================================

-- --------------------------------------------------------------
-- 2.1 is_admin(): Check if caller has verified admin privileges
-- --------------------------------------------------------------
-- Database-backed verification inspecting public.profiles.role.
-- Never uses CURRENT_USER or client-supplied claims.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- --------------------------------------------------------------
-- 2.2 get_auth_roll(): Get verified student roll of authenticated user
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_auth_roll()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_roll TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT roll INTO v_roll
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN v_roll;
END;
$$;

-- --------------------------------------------------------------
-- 2.3 get_student_directory(): Safe Configurable Directory RPC
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_student_directory()
RETURNS TABLE (
  name TEXT,
  roll TEXT,
  branch TEXT,
  year TEXT,
  semester TEXT,
  batch TEXT,
  avatar TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
DECLARE
  v_is_public BOOLEAN := TRUE;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  SELECT (value = 'true') INTO v_is_public
  FROM public.system_settings
  WHERE key = 'directory_public_to_students';

  IF v_is_public IS FALSE AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Student directory is restricted to institute administration.';
  END IF;

  RETURN QUERY
  SELECT 
    p.name,
    p.roll,
    p.branch,
    p.year,
    p.semester,
    p.batch,
    p.avatar
  FROM public.profiles p
  WHERE p.role = 'student' AND p.roll IS NOT NULL
  ORDER BY p.roll ASC;
END;
$$;

-- --------------------------------------------------------------
-- 2.4 get_mess_feedback_summary(): Safe Aggregate Ratings RPC
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_mess_feedback_summary()
RETURNS TABLE (
  meal_type TEXT,
  avg_rating NUMERIC,
  feedback_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT 
    meal_type,
    ROUND(AVG(rating)::numeric, 1) AS avg_rating,
    COUNT(id) AS feedback_count
  FROM public.mess_feedback
  WHERE date >= (pg_catalog.current_date - INTERVAL '7 days')
  GROUP BY meal_type;
$$;

-- --------------------------------------------------------------
-- 2.5 get_email_for_roll(): Administrative Roll Resolver
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_email_for_roll(p_roll TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
DECLARE
  v_email TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Administrator privileges required.';
  END IF;

  SELECT email INTO v_email
  FROM public.profiles
  WHERE roll = pg_catalog.upper(pg_catalog.trim(p_roll));

  RETURN v_email;
END;
$$;

-- --------------------------------------------------------------
-- 2.6 bootstrap_initial_admin(): Safe First-Admin Setup Procedure
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.bootstrap_initial_admin(admin_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_caller_role TEXT;
BEGIN
  v_caller_role := pg_catalog.current_setting('request.jwt.claim.role', true);

  -- Strict invocation check: only direct postgres session or service_role JWT
  IF NOT (
    pg_catalog.session_user IN ('postgres', 'supabase_admin') OR
    v_caller_role = 'service_role'
  ) THEN
    RAISE EXCEPTION 'Forbidden: bootstrap_initial_admin can only be executed directly in SQL Editor or via service_role.';
  END IF;

  -- Set session flag for the trigger to allow this trusted bootstrap update
  PERFORM pg_catalog.set_config('app.bootstrap_admin', 'true', true);

  SELECT id INTO v_user_id
  FROM public.profiles
  WHERE pg_catalog.lower(email) = pg_catalog.lower(pg_catalog.trim(admin_email));

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User profile with email % not found. The user must sign up or be provisioned in Auth first.', admin_email;
  END IF;

  UPDATE public.profiles
  SET role = 'admin', updated_at = pg_catalog.clock_timestamp()
  WHERE id = v_user_id;

  RETURN 'Success: Account ' || admin_email || ' elevated to Administrator.';
END;
$$;

-- --------------------------------------------------------------
-- 2.7 promote_user_to_admin(): Admin-to-Admin Promotion
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Forbidden: Only existing administrators can promote accounts to admin.';
  END IF;

  UPDATE public.profiles
  SET role = 'admin', updated_at = pg_catalog.clock_timestamp()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile with ID % not found.', target_user_id;
  END IF;
END;
$$;

-- --------------------------------------------------------------
-- 2.8 admin_provision_student(): Trusted Academic Provisioning Flow
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_provision_student(
  p_user_id UUID,
  p_roll TEXT,
  p_name TEXT DEFAULT NULL,
  p_branch TEXT DEFAULT 'Data Science & AI',
  p_year TEXT DEFAULT '1st Year',
  p_semester TEXT DEFAULT 'Semester 1',
  p_cgpa TEXT DEFAULT '8.0',
  p_batch TEXT DEFAULT '2026 - 2030'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_normalized_roll TEXT;
BEGIN
  IF NOT (
    public.is_admin() OR
    pg_catalog.session_user IN ('postgres', 'supabase_admin') OR
    pg_catalog.current_setting('request.jwt.claim.role', true) = 'service_role'
  ) THEN
    RAISE EXCEPTION 'Forbidden: Only administrators or service_role can provision verified student records.';
  END IF;

  v_normalized_roll := pg_catalog.upper(pg_catalog.trim(p_roll));

  -- Ensure roll number is not already assigned to another user
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE roll = v_normalized_roll AND id != p_user_id
  ) THEN
    RAISE EXCEPTION 'Roll number % is already assigned to another profile.', p_roll;
  END IF;

  UPDATE public.profiles
  SET 
    roll = v_normalized_roll,
    name = COALESCE(p_name, name),
    branch = p_branch,
    year = p_year,
    semester = p_semester,
    cgpa = p_cgpa,
    batch = p_batch,
    updated_at = pg_catalog.clock_timestamp()
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile with ID % not found.', p_user_id;
  END IF;
END;
$$;

-- ==============================================================
-- 3. INTEGRITY & SECURITY TRIGGERS
-- ==============================================================

-- --------------------------------------------------------------
-- 3.1 handle_new_user(): Trustworthy Identity Provisioning
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_email_domain TEXT;
  v_email_local TEXT;
  v_verified_roll TEXT := NULL;
  v_verified_name TEXT;
  v_is_trusted_service BOOLEAN := FALSE;
  v_roll_conflict BOOLEAN := FALSE;
BEGIN
  v_email_domain := pg_catalog.lower(pg_catalog.split_part(NEW.email, '@', 2));
  v_email_local := pg_catalog.split_part(NEW.email, '@', 1);

  -- Cryptographic / session trust check
  IF pg_catalog.current_setting('request.jwt.claim.role', true) = 'service_role' OR
     pg_catalog.session_user IN ('postgres', 'supabase_admin') THEN
    v_is_trusted_service := TRUE;
  END IF;

  -- 1. ROLL VERIFICATION:
  -- Only assign roll at signup if trusted service role provisioned it OR email is pre-confirmed
  IF v_is_trusted_service AND NEW.raw_user_meta_data->>'roll' IS NOT NULL THEN
    v_verified_roll := pg_catalog.upper(pg_catalog.trim(NEW.raw_user_meta_data->>'roll'));
  ELSIF NEW.email_confirmed_at IS NOT NULL AND 
        v_email_domain IN ('iiitnr.edu.in', 'iiitnr.ac.in') AND 
        v_email_local ~ '^[0-9]+$' THEN
    -- Check for duplicate roll collision before assigning
    SELECT EXISTS (
      SELECT 1 FROM public.profiles WHERE roll = v_email_local
    ) INTO v_roll_conflict;

    IF NOT v_roll_conflict THEN
      v_verified_roll := v_email_local;
    ELSE
      v_verified_roll := NULL;
      RAISE WARNING 'Roll collision on signup for user %: Roll % already assigned.', NEW.id, v_email_local;
    END IF;
  ELSE
    -- Unconfirmed email, external address, or non-numeric prefix: roll remains NULL
    v_verified_roll := NULL;
  END IF;

  v_verified_name := COALESCE(pg_catalog.nullif(pg_catalog.trim(NEW.raw_user_meta_data->>'name'), ''), 'Student');

  -- 2. INSERT PROFILE WITH SAFE ACADEMIC DEFAULTS:
  INSERT INTO public.profiles (
    id,
    roll,
    name,
    email,
    role,
    branch,
    year,
    semester,
    cgpa,
    avatar,
    batch,
    department,
    designation
  ) VALUES (
    NEW.id,
    v_verified_roll,
    v_verified_name,
    NEW.email,
    'student', -- ALWAYS student. Privilege escalation blocked.
    CASE WHEN v_is_trusted_service AND NEW.raw_user_meta_data->>'branch' IS NOT NULL 
         THEN NEW.raw_user_meta_data->>'branch' ELSE 'Data Science & AI' END,
    CASE WHEN v_is_trusted_service AND NEW.raw_user_meta_data->>'year' IS NOT NULL 
         THEN NEW.raw_user_meta_data->>'year' ELSE '1st Year' END,
    CASE WHEN v_is_trusted_service AND NEW.raw_user_meta_data->>'semester' IS NOT NULL 
         THEN NEW.raw_user_meta_data->>'semester' ELSE 'Semester 1' END,
    '8.0', -- Standard initial baseline
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces',
    '2026 - 2030',
    NULL,
    NULL
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = pg_catalog.clock_timestamp();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------
-- 3.2 handle_auth_user_updated(): Post-Verification Roll & Email Sync
-- --------------------------------------------------------------
-- Replaces handle_user_email_confirmed:
-- 1. Syncs email from auth.users to public.profiles.
-- 2. Assigns verified roll upon email confirmation (with collision guard).
-- 3. Clears auto-derived student roll if confirmed email switches to non-institutional domain.
CREATE OR REPLACE FUNCTION public.handle_auth_user_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_email_domain TEXT;
  v_email_local TEXT;
  v_verified_roll TEXT;
  v_conflict BOOLEAN := FALSE;
BEGIN
  -- 1. Synchronize email changes from auth.users to public.profiles
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    UPDATE public.profiles
    SET email = NEW.email, updated_at = pg_catalog.clock_timestamp()
    WHERE id = NEW.id;
  END IF;

  -- 2. Handle roll assignment / revocation on confirmation or email change
  IF NEW.email_confirmed_at IS NOT NULL THEN
    v_email_domain := pg_catalog.lower(pg_catalog.split_part(NEW.email, '@', 2));
    v_email_local := pg_catalog.split_part(NEW.email, '@', 1);

    IF v_email_domain IN ('iiitnr.edu.in', 'iiitnr.ac.in') AND v_email_local ~ '^[0-9]+$' THEN
      v_verified_roll := v_email_local;

      -- Check for duplicate roll collision before updating
      SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE roll = v_verified_roll AND id != NEW.id
      ) INTO v_conflict;

      IF NOT v_conflict THEN
        UPDATE public.profiles
        SET 
          roll = v_verified_roll,
          updated_at = pg_catalog.clock_timestamp()
        WHERE id = NEW.id AND (profiles.roll IS NULL OR profiles.roll != v_verified_roll);
      ELSE
        RAISE WARNING 'Roll collision: Roll % is already assigned to another profile. Skipping automatic assignment for user %.', v_verified_roll, NEW.id;
      END IF;
    ELSIF v_email_domain NOT IN ('iiitnr.edu.in', 'iiitnr.ac.in') THEN
      -- If user transitioned from an institutional email to an external personal email,
      -- clear auto-derived numeric roll to prevent keeping institutional identity on external address
      UPDATE public.profiles
      SET roll = NULL, updated_at = pg_catalog.clock_timestamp()
      WHERE id = NEW.id AND role = 'student' AND roll ~ '^[0-9]+$' AND roll = pg_catalog.split_part(OLD.email, '@', 1);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email, email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_updated();

-- Compatibility shim for handle_user_email_confirmed
CREATE OR REPLACE FUNCTION public.handle_user_email_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN public.handle_auth_user_updated();
END;
$$;

-- --------------------------------------------------------------
-- 3.3 protect_profile_fields(): Lock Academic & Identity Fields
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_caller_role TEXT;
  v_is_bootstrap TEXT;
BEGIN
  -- 1. Authenticated web administrators can update all fields
  IF public.is_admin() THEN
    NEW.updated_at := pg_catalog.clock_timestamp();
    RETURN NEW;
  END IF;

  v_caller_role := pg_catalog.current_setting('request.jwt.claim.role', true);
  v_is_bootstrap := pg_catalog.current_setting('app.bootstrap_admin', true);

  -- 2. Explicit bootstrap session flag (honored only for postgres / service_role)
  IF v_is_bootstrap = 'true' AND (
    pg_catalog.session_user IN ('postgres', 'supabase_admin') OR v_caller_role = 'service_role'
  ) THEN
    NEW.updated_at := pg_catalog.clock_timestamp();
    RETURN NEW;
  END IF;

  -- 3. Direct non-web database sessions (SQL Editor as postgres or service_role)
  IF auth.uid() IS NULL AND (
    pg_catalog.session_user IN ('postgres', 'supabase_admin') OR
    v_caller_role = 'service_role'
  ) THEN
    NEW.updated_at := pg_catalog.clock_timestamp();
    RETURN NEW;
  END IF;

  -- 4. NON-ADMIN STUDENTS: Avatar is the ONLY permitted field mutation
  IF NEW.role IS DISTINCT FROM OLD.role OR
     NEW.roll IS DISTINCT FROM OLD.roll OR
     NEW.email IS DISTINCT FROM OLD.email OR
     NEW.id IS DISTINCT FROM OLD.id OR
     NEW.name IS DISTINCT FROM OLD.name OR
     NEW.branch IS DISTINCT FROM OLD.branch OR
     NEW.year IS DISTINCT FROM OLD.year OR
     NEW.semester IS DISTINCT FROM OLD.semester OR
     NEW.cgpa IS DISTINCT FROM OLD.cgpa OR
     NEW.batch IS DISTINCT FROM OLD.batch OR
     NEW.department IS DISTINCT FROM OLD.department OR
     NEW.designation IS DISTINCT FROM OLD.designation THEN
    RAISE EXCEPTION 'Unauthorized: Students may only update their profile avatar. Academic records (CGPA, semester, branch, year) and identity fields (role, roll, name, email) can only be updated by the administration.';
  END IF;

  NEW.updated_at := pg_catalog.clock_timestamp();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_fields();

-- --------------------------------------------------------------
-- 3.4 set_resource_identity(): Author Binding & Initial Sanitization
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_resource_identity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_name TEXT;
  v_roll TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    SELECT name, roll INTO v_name, v_roll FROM public.profiles WHERE id = auth.uid();
    IF v_roll IS NULL THEN
      RAISE EXCEPTION 'Unauthorized: An active student profile with a verified roll number is required to contribute resources.';
    END IF;

    NEW.created_by := auth.uid();
    NEW.author_id := auth.uid();
    NEW.author_name := COALESCE(v_name, 'Campus Student');
    NEW.author_roll := v_roll;
    NEW.contributor := COALESCE(v_name, 'Campus Student') || ' (' || v_roll || ')';
    NEW.is_verified := FALSE;
  ELSE
    NEW.created_by := COALESCE(NEW.created_by, auth.uid());
    NEW.author_id := COALESCE(NEW.author_id, auth.uid());
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_resource_identity ON public.resources;
CREATE TRIGGER trg_set_resource_identity
  BEFORE INSERT ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.set_resource_identity();

-- --------------------------------------------------------------
-- 3.5 protect_resource_fields(): Protect Identity & Verification Fields
-- --------------------------------------------------------------
-- REVISION (v7): Prevents authors from modifying author identity, verification status,
-- counters, or creation timestamp. Preserves legitimate edits to subject, title, type,
-- semester, unit, link, and description.
CREATE OR REPLACE FUNCTION public.protect_resource_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'Unauthorized: Resource ID cannot be changed.';
    END IF;
    IF NEW.created_by IS DISTINCT FROM OLD.created_by OR NEW.author_id IS DISTINCT FROM OLD.author_id THEN
      RAISE EXCEPTION 'Unauthorized: Resource author ID cannot be transferred.';
    END IF;
    IF NEW.author_name IS DISTINCT FROM OLD.author_name OR 
       NEW.author_roll IS DISTINCT FROM OLD.author_roll OR 
       NEW.contributor IS DISTINCT FROM OLD.contributor THEN
      RAISE EXCEPTION 'Unauthorized: Resource contributor identity fields cannot be modified.';
    END IF;
    IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
      RAISE EXCEPTION 'Unauthorized: Only administrators can verify or unverify resources.';
    END IF;
    IF NEW.notes_count IS DISTINCT FROM OLD.notes_count OR NEW.papers_count IS DISTINCT FROM OLD.papers_count THEN
      RAISE EXCEPTION 'Unauthorized: Resource counters are managed administratively.';
    END IF;
    IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
      RAISE EXCEPTION 'Unauthorized: Resource creation timestamp cannot be modified.';
    END IF;
  END IF;

  NEW.updated_at := pg_catalog.clock_timestamp();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_resource_fields ON public.resources;
CREATE TRIGGER trg_protect_resource_fields
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_resource_fields();

-- --------------------------------------------------------------
-- 3.6 set_resource_report_identity(): Enforce Reporter Identity
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_resource_report_identity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_roll TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    SELECT roll INTO v_roll FROM public.profiles WHERE id = auth.uid();
    IF v_roll IS NULL THEN
      RAISE EXCEPTION 'Unauthorized: An active student profile with a verified roll number is required to report resources.';
    END IF;

    NEW.user_id := auth.uid();
    NEW.student_roll := v_roll;
    NEW.status := 'pending';
    NEW.admin_notes := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_resource_report_identity ON public.resource_reports;
CREATE TRIGGER trg_set_resource_report_identity
  BEFORE INSERT ON public.resource_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.set_resource_report_identity();

-- --------------------------------------------------------------
-- 3.7 set_marketplace_listing_identity(): Enforce Verified Name & Roll
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_marketplace_listing_identity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_roll TEXT;
  v_name TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    SELECT roll, name INTO v_roll, v_name FROM public.profiles WHERE id = auth.uid();
    IF v_roll IS NULL THEN
      RAISE EXCEPTION 'Unauthorized: An active student profile with a verified roll number is required to post listings.';
    END IF;

    NEW.user_id := auth.uid();
    NEW.user_roll := v_roll;
    NEW.user_name := COALESCE(v_name, 'Campus Student');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_marketplace_listing_identity ON public.marketplace_listings;
CREATE TRIGGER trg_set_marketplace_listing_identity
  BEFORE INSERT ON public.marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_marketplace_listing_identity();

-- --------------------------------------------------------------
-- 3.8 protect_marketplace_listing_fields(): Immutable Listing Ownership
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_marketplace_listing_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'Unauthorized: Listing user_id cannot be changed.';
    END IF;
    IF NEW.user_roll IS DISTINCT FROM OLD.user_roll THEN
      RAISE EXCEPTION 'Unauthorized: Listing user_roll cannot be changed.';
    END IF;
    IF NEW.user_name IS DISTINCT FROM OLD.user_name THEN
      RAISE EXCEPTION 'Unauthorized: Listing user_name cannot be changed.';
    END IF;
    IF NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'Unauthorized: Listing ID cannot be changed.';
    END IF;
    IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
      RAISE EXCEPTION 'Unauthorized: Listing creation timestamp cannot be changed.';
    END IF;
  END IF;

  NEW.updated_at := pg_catalog.clock_timestamp();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_marketplace_listing_fields ON public.marketplace_listings;
CREATE TRIGGER trg_protect_marketplace_listing_fields
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_marketplace_listing_fields();

-- --------------------------------------------------------------
-- 3.9 set_marketplace_inquiry_identity(): Enforce Verified Sender Name
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_marketplace_inquiry_identity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_roll TEXT;
  v_name TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    SELECT roll, name INTO v_roll, v_name FROM public.profiles WHERE id = auth.uid();
    IF v_roll IS NULL THEN
      RAISE EXCEPTION 'Unauthorized: An active student profile with a verified roll number is required to send inquiries.';
    END IF;

    NEW.sender_id := auth.uid();
    NEW.sender_roll := v_roll;
    NEW.sender_name := COALESCE(v_name, 'Campus Student');
    NEW.status := 'sent';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_marketplace_inquiry_identity ON public.marketplace_inquiries;
CREATE TRIGGER trg_set_marketplace_inquiry_identity
  BEFORE INSERT ON public.marketplace_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.set_marketplace_inquiry_identity();

-- --------------------------------------------------------------
-- 3.10 protect_marketplace_inquiry_fields(): Harden Inquiry Updates
-- --------------------------------------------------------------
-- REVISION (v7): Prevents tampering with id, listing_id, sender identity, message,
-- or creation timestamp.
-- Sender can update contact_info and mark status = 'closed'.
-- Seller (listing owner) can update status to 'seen', 'replied', or 'closed'.
CREATE OR REPLACE FUNCTION public.protect_marketplace_inquiry_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_listing_owner UUID;
  v_caller UUID;
BEGIN
  IF public.is_admin() THEN
    NEW.updated_at := pg_catalog.clock_timestamp();
    RETURN NEW;
  END IF;

  v_caller := auth.uid();

  -- Immutable fields for all non-admin participants
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Unauthorized: Inquiry ID cannot be changed.';
  END IF;
  IF NEW.listing_id IS DISTINCT FROM OLD.listing_id THEN
    RAISE EXCEPTION 'Unauthorized: Inquiry listing association cannot be changed.';
  END IF;
  IF NEW.sender_id IS DISTINCT FROM OLD.sender_id THEN
    RAISE EXCEPTION 'Unauthorized: Inquiry sender ID cannot be changed.';
  END IF;
  IF NEW.sender_roll IS DISTINCT FROM OLD.sender_roll THEN
    RAISE EXCEPTION 'Unauthorized: Inquiry sender roll cannot be changed.';
  END IF;
  IF NEW.sender_name IS DISTINCT FROM OLD.sender_name THEN
    RAISE EXCEPTION 'Unauthorized: Inquiry sender name cannot be changed.';
  END IF;
  IF NEW.message IS DISTINCT FROM OLD.message THEN
    RAISE EXCEPTION 'Unauthorized: Inquiry message text cannot be modified once sent.';
  END IF;
  IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Unauthorized: Inquiry creation timestamp cannot be modified.';
  END IF;

  -- Determine listing seller
  SELECT user_id INTO v_listing_owner
  FROM public.marketplace_listings
  WHERE id = OLD.listing_id;

  -- Check participant status transition permissions
  IF v_caller = OLD.sender_id THEN
    -- Inquirer (Sender) can update contact_info or mark status = 'closed'
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      IF NEW.status != 'closed' THEN
        RAISE EXCEPTION 'Unauthorized: Inquiry sender can only transition status to closed.';
      END IF;
    END IF;
  ELSIF v_caller = v_listing_owner THEN
    -- Seller (Listing owner) cannot change contact_info of sender, but can mark status = 'seen', 'replied', 'closed'
    IF NEW.contact_info IS DISTINCT FROM OLD.contact_info THEN
      RAISE EXCEPTION 'Unauthorized: Listing owner cannot alter sender contact information.';
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      IF NEW.status NOT IN ('seen', 'replied', 'closed') THEN
        RAISE EXCEPTION 'Unauthorized: Listing owner can only transition status to seen, replied, or closed.';
      END IF;
    END IF;
  ELSE
    RAISE EXCEPTION 'Unauthorized: Only the inquiry sender, listing owner, or administrators may update this inquiry.';
  END IF;

  NEW.updated_at := pg_catalog.clock_timestamp();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_marketplace_inquiry_fields ON public.marketplace_inquiries;
CREATE TRIGGER trg_protect_marketplace_inquiry_fields
  BEFORE UPDATE ON public.marketplace_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_marketplace_inquiry_fields();

-- --------------------------------------------------------------
-- 3.11 handle_marketplace_inquiry_notification(): In-App Inquiry Alert
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_marketplace_inquiry_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_owner_roll TEXT;
  v_owner_id UUID;
  v_title TEXT;
BEGIN
  SELECT user_id, user_roll, title INTO v_owner_id, v_owner_roll, v_title
  FROM public.marketplace_listings
  WHERE id = NEW.listing_id;

  IF v_owner_id IS NOT NULL AND v_owner_id != NEW.sender_id THEN
    INSERT INTO public.notifications (
      target_user_id,
      user_roll,
      type,
      title,
      message,
      link_view,
      created_by
    ) VALUES (
      v_owner_id,
      v_owner_roll,
      'exchange',
      'New Inquiry on "' || v_title || '"',
      NEW.sender_name || ' (' || NEW.sender_roll || ') sent you a message: "' || pg_catalog.substring(NEW.message, 1, 80) || '"',
      'exchange',
      NEW.sender_id
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_marketplace_inquiry ON public.marketplace_inquiries;
CREATE TRIGGER trg_on_marketplace_inquiry
  AFTER INSERT ON public.marketplace_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_marketplace_inquiry_notification();

-- --------------------------------------------------------------
-- 3.12 protect_notification_fields(): Restrict Notification Mutation
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_notification_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.id IS DISTINCT FROM OLD.id OR
       NEW.target_user_id IS DISTINCT FROM OLD.target_user_id OR
       NEW.user_roll IS DISTINCT FROM OLD.user_roll OR
       NEW.target_branch IS DISTINCT FROM OLD.target_branch OR
       NEW.type IS DISTINCT FROM OLD.type OR
       NEW.title IS DISTINCT FROM OLD.title OR
       NEW.message IS DISTINCT FROM OLD.message OR
       NEW.link_view IS DISTINCT FROM OLD.link_view OR
       NEW.created_by IS DISTINCT FROM OLD.created_by OR
       NEW.created_at IS DISTINCT FROM OLD.created_at THEN
      RAISE EXCEPTION 'Unauthorized: Students may only modify the is_read status of personal notifications.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_notification_fields ON public.notifications;
CREATE TRIGGER trg_protect_notification_fields
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_notification_fields();

-- --------------------------------------------------------------
-- 3.13 set_mess_feedback_identity(): Enforce Feedback Ownership
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_mess_feedback_identity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_roll TEXT;
  v_name TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    SELECT roll, name INTO v_roll, v_name FROM public.profiles WHERE id = auth.uid();
    IF v_roll IS NULL THEN
      RAISE EXCEPTION 'Unauthorized: An active student profile with a verified roll number is required to submit meal feedback.';
    END IF;

    NEW.user_id := auth.uid();
    NEW.student_roll := v_roll;
    NEW.student_name := COALESCE(v_name, 'Campus Student');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_mess_feedback_identity ON public.mess_feedback;
CREATE TRIGGER trg_set_mess_feedback_identity
  BEFORE INSERT ON public.mess_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.set_mess_feedback_identity();

-- --------------------------------------------------------------
-- 3.14 protect_mess_feedback_fields(): Immutable Dining Reviews
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_mess_feedback_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Mess feedback entries cannot be modified once submitted.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_mess_feedback_fields ON public.mess_feedback;
CREATE TRIGGER trg_protect_mess_feedback_fields
  BEFORE UPDATE ON public.mess_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_mess_feedback_fields();

-- ==============================================================
-- 4. PERFORMANCE INDEXES
-- ==============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_roll ON public.profiles(roll);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_timetable_branch_day ON public.timetable(branch, day);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON public.resources(subject);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_author ON public.resources(created_by);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.resource_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_resource ON public.resource_reports(resource_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.resource_reports(status);
CREATE INDEX IF NOT EXISTS idx_assignments_branch_due ON public.assignments(branch, due_date);
CREATE INDEX IF NOT EXISTS idx_assignment_completions_user ON public.assignment_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_exams_branch_date ON public.exams(branch, exam_date);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned_created ON public.announcements(pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_event_reg_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_user ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_mess_menu_day ON public.mess_menu(day);
CREATE INDEX IF NOT EXISTS idx_mess_feedback_date ON public.mess_feedback(date);
CREATE INDEX IF NOT EXISTS idx_mess_feedback_user ON public.mess_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON public.marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_user ON public.marketplace_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_cat ON public.marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_inquiries_listing ON public.marketplace_inquiries(listing_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_sender ON public.marketplace_inquiries(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_roll ON public.notifications(user_roll);
CREATE INDEX IF NOT EXISTS idx_notifications_target_user ON public.notifications(target_user_id);

-- ==============================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================

-- Enable RLS across all tables
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------
-- CLEAN UP OBSOLETE LEGACY POLICIES (FROM EARLIER SCHEMA ITERATIONS)
-- --------------------------------------------------------------
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Timetable is viewable by everyone" ON public.timetable;
DROP POLICY IF EXISTS "Timetable modifiable by admins only" ON public.timetable;
DROP POLICY IF EXISTS "Resources viewable by everyone" ON public.resources;
DROP POLICY IF EXISTS "Resources insertable by authenticated users" ON public.resources;
DROP POLICY IF EXISTS "Marketplace listings viewable by everyone" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Active listings are viewable by everyone" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Inquiries viewable by sender or listing owner" ON public.marketplace_inquiries;
DROP POLICY IF EXISTS "Inquiries updatable by participants" ON public.marketplace_inquiries;
DROP POLICY IF EXISTS "Inquiries status updatable by participants" ON public.marketplace_inquiries;
DROP POLICY IF EXISTS "Notifications viewable by targeted users" ON public.notifications;
DROP POLICY IF EXISTS "Students can mark notifications as read" ON public.notifications;

-- --------------------------------------------------------------
-- 5.0 SYSTEM SETTINGS POLICIES
-- --------------------------------------------------------------
DROP POLICY IF EXISTS "System settings are viewable by authenticated users" ON public.system_settings;
CREATE POLICY "System settings are viewable by authenticated users"
  ON public.system_settings FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can update system settings" ON public.system_settings;
CREATE POLICY "Admins can update system settings"
  ON public.system_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- --------------------------------------------------------------
-- 5.1 PROFILES POLICIES (STRICT PRIVATE PROFILES)
-- --------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own profile or admin can view all" ON public.profiles;
CREATE POLICY "Users can view their own profile or admin can view all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Users can update their own profile or admin can update all" ON public.profiles;
CREATE POLICY "Users can update their own profile or admin can update all"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete profiles" ON public.profiles;
CREATE POLICY "Only admins can delete profiles"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- --------------------------------------------------------------
-- 5.2 TIMETABLE POLICIES
-- --------------------------------------------------------------
DROP POLICY IF EXISTS "Timetable is viewable by everyone" ON public.timetable;
CREATE POLICY "Timetable is viewable by everyone"
  ON public.timetable FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert timetable slots" ON public.timetable;
CREATE POLICY "Admins can insert timetable slots"
  ON public.timetable FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update timetable slots" ON public.timetable;
CREATE POLICY "Admins can update timetable slots"
  ON public.timetable FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete timetable slots" ON public.timetable;
CREATE POLICY "Admins can delete timetable slots"
  ON public.timetable FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- --------------------------------------------------------------
-- 5.3 RESOURCES POLICIES
-- --------------------------------------------------------------
DROP POLICY IF EXISTS "Resources are viewable by everyone" ON public.resources;
CREATE POLICY "Resources are viewable by everyone"
  ON public.resources FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can contribute resources" ON public.resources;
CREATE POLICY "Authenticated users can contribute resources"
  ON public.resources FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin() OR 
    (
      (auth.uid() = created_by OR auth.uid() = author_id) AND 
      public.get_auth_roll() IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Admins can update resources" ON public.resources;
DROP POLICY IF EXISTS "Authors or admins can update resources" ON public.resources;
CREATE POLICY "Authors or admins can update resources"
  ON public.resources FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    (author_id IS NOT NULL AND author_id = auth.uid()) OR
    public.is_admin()
  )
  WITH CHECK (
    created_by = auth.uid() OR
    (author_id IS NOT NULL AND author_id = auth.uid()) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can delete resources" ON public.resources;
DROP POLICY IF EXISTS "Authors or admins can delete resources" ON public.resources;
CREATE POLICY "Authors or admins can delete resources"
  ON public.resources FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    (author_id IS NOT NULL AND author_id = auth.uid()) OR
    public.is_admin()
  );

-- --------------------------------------------------------------
-- 5.4 RESOURCE BOOKMARKS & REPORTS POLICIES
-- --------------------------------------------------------------
DROP POLICY IF EXISTS "Students can view their own bookmarks" ON public.resource_bookmarks;
CREATE POLICY "Students can view their own bookmarks"
  ON public.resource_bookmarks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR student_roll = public.get_auth_roll());

DROP POLICY IF EXISTS "Students can insert their own bookmarks" ON public.resource_bookmarks;
CREATE POLICY "Students can insert their own bookmarks"
  ON public.resource_bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid() AND student_roll = public.get_auth_roll()) OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Students can delete their own bookmarks" ON public.resource_bookmarks;
CREATE POLICY "Students can delete their own bookmarks"
  ON public.resource_bookmarks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR student_roll = public.get_auth_roll() OR public.is_admin());

-- Reports (Privacy Minimization: Only Admin or Reporter)
DROP POLICY IF EXISTS "Reports are viewable by admins or reporter" ON public.resource_reports;
CREATE POLICY "Reports are viewable by admins or reporter"
  ON public.resource_reports FOR SELECT
  TO authenticated
  USING (public.is_admin() OR user_id = auth.uid());

DROP POLICY IF EXISTS "Students can report resources with verified roll" ON public.resource_reports;
CREATE POLICY "Students can report resources with verified roll"
  ON public.resource_reports FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid() AND student_roll = public.get_auth_roll()) OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can update reports" ON public.resource_reports;
CREATE POLICY "Admins can update reports"
  ON public.resource_reports FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete reports" ON public.resource_reports;
CREATE POLICY "Admins can delete reports"
  ON public.resource_reports FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- --------------------------------------------------------------
-- 5.5 ASSIGNMENTS & COMPLETIONS POLICIES
-- --------------------------------------------------------------
DROP POLICY IF EXISTS "Assignments are viewable by authenticated users" ON public.assignments;
CREATE POLICY "Assignments are viewable by authenticated users"
  ON public.assignments FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert assignments" ON public.assignments;
CREATE POLICY "Admins can insert assignments"
  ON public.assignments FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update assignments" ON public.assignments;
CREATE POLICY "Admins can update assignments"
  ON public.assignments FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete assignments" ON public.assignments;
CREATE POLICY "Admins can delete assignments"
  ON public.assignments FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Completions (Personal Tracking per Student)
DROP POLICY IF EXISTS "Students can view their assignment completions" ON public.assignment_completions;
CREATE POLICY "Students can view their assignment completions"
  ON public.assignment_completions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR student_roll = public.get_auth_roll());

DROP POLICY IF EXISTS "Students can toggle their assignment completion" ON public.assignment_completions;
CREATE POLICY "Students can toggle their assignment completion"
  ON public.assignment_completions FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid() AND student_roll = public.get_auth_roll()) OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Students can remove their assignment completion" ON public.assignment_completions;
CREATE POLICY "Students can remove their assignment completion"
  ON public.assignment_completions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR student_roll = public.get_auth_roll() OR public.is_admin());

-- --------------------------------------------------------------
-- 5.6 EXAMS POLICIES
-- --------------------------------------------------------------
DROP POLICY IF EXISTS "Exams are viewable by everyone" ON public.exams;
CREATE POLICY "Exams are viewable by everyone"
  ON public.exams FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert exams" ON public.exams;
CREATE POLICY "Admins can insert exams"
  ON public.exams FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update exams" ON public.exams;
CREATE POLICY "Admins can update exams"
  ON public.exams FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete exams" ON public.exams;
CREATE POLICY "Admins can delete exams"
  ON public.exams FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- --------------------------------------------------------------
-- 5.7 ANNOUNCEMENTS POLICIES
-- --------------------------------------------------------------
DROP POLICY IF EXISTS "Announcements are viewable by everyone" ON public.announcements;
CREATE POLICY "Announcements are viewable by everyone"
  ON public.announcements FOR SELECT
  TO anon, authenticated
  USING (expires_at IS NULL OR expires_at > pg_catalog.clock_timestamp());

DROP POLICY IF EXISTS "Admins can publish announcements" ON public.announcements;
CREATE POLICY "Admins can publish announcements"
  ON public.announcements FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update announcements" ON public.announcements;
CREATE POLICY "Admins can update announcements"
  ON public.announcements FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete announcements" ON public.announcements;
CREATE POLICY "Admins can delete announcements"
  ON public.announcements FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- --------------------------------------------------------------
-- 5.8 EVENTS & EVENT REGISTRATIONS POLICIES
-- --------------------------------------------------------------
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can publish events" ON public.events;
CREATE POLICY "Admins can publish events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Registrations
DROP POLICY IF EXISTS "Students can view their own event registrations" ON public.event_registrations;
CREATE POLICY "Students can view their own event registrations"
  ON public.event_registrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR student_roll = public.get_auth_roll() OR public.is_admin());

DROP POLICY IF EXISTS "Students can register for events" ON public.event_registrations;
CREATE POLICY "Students can register for events"
  ON public.event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid() AND student_roll = public.get_auth_roll()) OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Students can cancel event registrations" ON public.event_registrations;
CREATE POLICY "Students can cancel event registrations"
  ON public.event_registrations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR student_roll = public.get_auth_roll() OR public.is_admin());

-- --------------------------------------------------------------
-- 5.9 HOSTEL MESS POLICIES
-- --------------------------------------------------------------
DROP POLICY IF EXISTS "Mess menu is viewable by everyone" ON public.mess_menu;
CREATE POLICY "Mess menu is viewable by everyone"
  ON public.mess_menu FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert mess menu" ON public.mess_menu;
CREATE POLICY "Admins can insert mess menu"
  ON public.mess_menu FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update mess menu" ON public.mess_menu;
CREATE POLICY "Admins can update mess menu"
  ON public.mess_menu FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete mess menu" ON public.mess_menu;
CREATE POLICY "Admins can delete mess menu"
  ON public.mess_menu FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Mess Feedback (Strict Privacy: Student sees own, Admin sees all)
DROP POLICY IF EXISTS "Students see own feedback, admins see all" ON public.mess_feedback;
CREATE POLICY "Students see own feedback, admins see all"
  ON public.mess_feedback FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    student_roll = public.get_auth_roll() OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Students can submit mess feedback" ON public.mess_feedback;
CREATE POLICY "Students can submit mess feedback"
  ON public.mess_feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid() AND student_roll = public.get_auth_roll()) OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Students can update their own mess feedback" ON public.mess_feedback;
CREATE POLICY "Students can update their own mess feedback"
  ON public.mess_feedback FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Students can delete their own mess feedback" ON public.mess_feedback;
CREATE POLICY "Students can delete their own mess feedback"
  ON public.mess_feedback FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- --------------------------------------------------------------
-- 5.10 CAMPUS MARKETPLACE LISTINGS & INQUIRIES POLICIES
-- --------------------------------------------------------------
-- Anonymous visitors: read active listings without evaluating is_admin()
DROP POLICY IF EXISTS "Active marketplace listings viewable by anonymous visitors" ON public.marketplace_listings;
CREATE POLICY "Active marketplace listings viewable by anonymous visitors"
  ON public.marketplace_listings FOR SELECT
  TO anon
  USING (status = 'active');

-- Authenticated users: read active listings, own draft/sold listings, or admin all
DROP POLICY IF EXISTS "Marketplace listings viewable by authenticated users" ON public.marketplace_listings;
CREATE POLICY "Marketplace listings viewable by authenticated users"
  ON public.marketplace_listings FOR SELECT
  TO authenticated
  USING (
    status = 'active' OR
    user_id = auth.uid() OR
    user_roll = public.get_auth_roll() OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "Authenticated users can create listings with verified identity" ON public.marketplace_listings;
CREATE POLICY "Authenticated users can create listings with verified identity"
  ON public.marketplace_listings FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.uid() = user_id AND user_roll = public.get_auth_roll())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Owners or admins can update listings" ON public.marketplace_listings;
CREATE POLICY "Owners or admins can update listings"
  ON public.marketplace_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Owners or admins can delete listings" ON public.marketplace_listings;
CREATE POLICY "Owners or admins can delete listings"
  ON public.marketplace_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- Inquiries: Sender, Listing Owner, or Admin can read
DROP POLICY IF EXISTS "Inquiries viewable by sender, listing owner, or admin" ON public.marketplace_inquiries;
CREATE POLICY "Inquiries viewable by sender, listing owner, or admin"
  ON public.marketplace_inquiries FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid() OR
    sender_roll = public.get_auth_roll() OR
    EXISTS (
      SELECT 1 FROM public.marketplace_listings ml
      WHERE ml.id = marketplace_inquiries.listing_id 
        AND (ml.user_id = auth.uid() OR ml.user_roll = public.get_auth_roll())
    ) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "Students can send inquiries with verified identity" ON public.marketplace_inquiries;
CREATE POLICY "Students can send inquiries with verified identity"
  ON public.marketplace_inquiries FOR INSERT
  TO authenticated
  WITH CHECK (
    (
      sender_id = auth.uid() AND 
      sender_roll = public.get_auth_roll() AND
      auth.uid() != (SELECT user_id FROM public.marketplace_listings WHERE id = listing_id)
    ) OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Participants or admins can update inquiries" ON public.marketplace_inquiries;
CREATE POLICY "Participants or admins can update inquiries"
  ON public.marketplace_inquiries FOR UPDATE
  TO authenticated
  USING (
    sender_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.marketplace_listings ml
      WHERE ml.id = marketplace_inquiries.listing_id 
        AND ml.user_id = auth.uid()
    ) OR
    public.is_admin()
  )
  WITH CHECK (
    sender_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.marketplace_listings ml
      WHERE ml.id = marketplace_inquiries.listing_id 
        AND ml.user_id = auth.uid()
    ) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "Senders or admins can delete inquiries" ON public.marketplace_inquiries;
CREATE POLICY "Senders or admins can delete inquiries"
  ON public.marketplace_inquiries FOR DELETE
  TO authenticated
  USING (
    sender_id = auth.uid() OR public.is_admin()
  );

-- --------------------------------------------------------------
-- 5.11 NOTIFICATIONS POLICIES
-- --------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (
    (target_user_id IS NULL AND user_roll IS NULL AND target_branch IS NULL) OR
    target_user_id = auth.uid() OR
    (user_roll IS NOT NULL AND user_roll = public.get_auth_roll()) OR
    (
      target_branch IS NOT NULL AND 
      target_branch = (SELECT branch FROM public.profiles WHERE id = auth.uid())
    ) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;
CREATE POLICY "Admins can create notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Users can mark their personal notifications as read" ON public.notifications;
CREATE POLICY "Users can mark their personal notifications as read"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (
    target_user_id = auth.uid() OR
    (user_roll IS NOT NULL AND user_roll = public.get_auth_roll()) OR 
    public.is_admin()
  )
  WITH CHECK (
    target_user_id = auth.uid() OR
    (user_roll IS NOT NULL AND user_roll = public.get_auth_roll()) OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can delete notifications" ON public.notifications;
CREATE POLICY "Admins can delete notifications"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ==============================================================
-- 6. PRIVILEGE CONFIGURATION & LEAST-PRIVILEGE GRANTS
-- ==============================================================

-- 6.1 SCOPED TABLE-LEVEL PRIVILEGES
-- Explicitly revoke all privileges ONLY on Campus Hub tables
REVOKE ALL ON TABLE 
  public.system_settings,
  public.profiles,
  public.timetable,
  public.resources,
  public.resource_bookmarks,
  public.resource_reports,
  public.assignments,
  public.assignment_completions,
  public.exams,
  public.announcements,
  public.events,
  public.event_registrations,
  public.mess_menu,
  public.mess_feedback,
  public.marketplace_listings,
  public.marketplace_inquiries,
  public.notifications
FROM PUBLIC, anon, authenticated;

-- Grant database administrators & service role full control on Campus Hub tables
GRANT ALL ON TABLE 
  public.system_settings,
  public.profiles,
  public.timetable,
  public.resources,
  public.resource_bookmarks,
  public.resource_reports,
  public.assignments,
  public.assignment_completions,
  public.exams,
  public.announcements,
  public.events,
  public.event_registrations,
  public.mess_menu,
  public.mess_feedback,
  public.marketplace_listings,
  public.marketplace_inquiries,
  public.notifications
TO service_role, postgres;

-- Authenticated Users: Grant required verbs per table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.timetable TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.resource_bookmarks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resource_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignments TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.assignment_completions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exams TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.event_registrations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mess_menu TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mess_feedback TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_listings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketplace_inquiries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;

-- Anonymous Users: Strictly read-only for public campus content
GRANT SELECT ON public.timetable TO anon;
GRANT SELECT ON public.resources TO anon;
GRANT SELECT ON public.exams TO anon;
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.mess_menu TO anon;
GRANT SELECT ON public.marketplace_listings TO anon;

-- 6.2 SCOPED FUNCTION-LEVEL PRIVILEGES
-- Explicitly revoke execution rights ONLY on Campus Hub functions by name
REVOKE ALL ON FUNCTION
  public.is_admin(),
  public.get_auth_roll(),
  public.get_student_directory(),
  public.get_mess_feedback_summary(),
  public.get_email_for_roll(TEXT),
  public.promote_user_to_admin(UUID),
  public.admin_provision_student(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT),
  public.bootstrap_initial_admin(TEXT),
  public.handle_new_user(),
  public.handle_auth_user_updated(),
  public.handle_user_email_confirmed(),
  public.protect_profile_fields(),
  public.set_resource_identity(),
  public.protect_resource_fields(),
  public.set_resource_report_identity(),
  public.set_marketplace_listing_identity(),
  public.protect_marketplace_listing_fields(),
  public.set_marketplace_inquiry_identity(),
  public.protect_marketplace_inquiry_fields(),
  public.handle_marketplace_inquiry_notification(),
  public.protect_notification_fields(),
  public.set_mess_feedback_identity(),
  public.protect_mess_feedback_fields()
FROM PUBLIC, anon, authenticated;

-- Grant execute only to necessary roles
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_auth_roll() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_student_directory() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_mess_feedback_summary() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_email_for_roll(TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_provision_student(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.bootstrap_initial_admin(TEXT) TO postgres, service_role;

-- Trigger functions: only need execute from postgres, service_role, and authenticated triggers
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.handle_auth_user_updated() TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.handle_user_email_confirmed() TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.protect_profile_fields() TO postgres, service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.set_resource_identity() TO postgres, service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.protect_resource_fields() TO postgres, service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.set_resource_report_identity() TO postgres, service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.set_marketplace_listing_identity() TO postgres, service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.protect_marketplace_listing_fields() TO postgres, service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.set_marketplace_inquiry_identity() TO postgres, service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.protect_marketplace_inquiry_fields() TO postgres, service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_marketplace_inquiry_notification() TO postgres, service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.protect_notification_fields() TO postgres, service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.set_mess_feedback_identity() TO postgres, service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.protect_mess_feedback_fields() TO postgres, service_role, authenticated;
