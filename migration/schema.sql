-- ============================================
-- SUPABASE DATABASE SCHEMA FOR HIYOUMORE
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- QUIZZES TABLE (replaces qa_db)
-- ============================================
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  index INTEGER UNIQUE NOT NULL,  -- Preserve for shared URLs
  question TEXT NOT NULL,
  answer TEXT NOT NULL,

  -- Category flags (binary for minimal code changes)
  category_my_pick BOOLEAN DEFAULT FALSE,
  category_eng BOOLEAN DEFAULT FALSE,
  category_animal BOOLEAN DEFAULT FALSE,
  category_king BOOLEAN DEFAULT FALSE,
  category_plant BOOLEAN DEFAULT FALSE,
  category_food BOOLEAN DEFAULT FALSE,
  category_english BOOLEAN DEFAULT FALSE,
  category_religion BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast category queries
CREATE INDEX idx_quizzes_index ON quizzes(index);
CREATE INDEX idx_quizzes_my_pick ON quizzes(category_my_pick) WHERE category_my_pick = TRUE;
CREATE INDEX idx_quizzes_eng ON quizzes(category_eng) WHERE category_eng = TRUE;
CREATE INDEX idx_quizzes_animal ON quizzes(category_animal) WHERE category_animal = TRUE;
CREATE INDEX idx_quizzes_king ON quizzes(category_king) WHERE category_king = TRUE;
CREATE INDEX idx_quizzes_plant ON quizzes(category_plant) WHERE category_plant = TRUE;
CREATE INDEX idx_quizzes_food ON quizzes(category_food) WHERE category_food = TRUE;
CREATE INDEX idx_quizzes_english ON quizzes(category_english) WHERE category_english = TRUE;
CREATE INDEX idx_quizzes_religion ON quizzes(category_religion) WHERE category_religion = TRUE;

-- ============================================
-- USER PROFILES TABLE (replaces sign_up_db)
-- ============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  oauth_provider TEXT NOT NULL,
  oauth_user_id TEXT UNIQUE NOT NULL,
  nickname TEXT,
  email TEXT,
  name TEXT,
  phone_number TEXT,
  profile_image_url TEXT,
  connected_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_oauth_id ON user_profiles(oauth_user_id);

-- ============================================
-- LOGIN/LOGOUT LOGS (replaces log_in_out_db)
-- ============================================
CREATE TABLE login_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  oauth_user_id TEXT NOT NULL,
  login_platform TEXT NOT NULL,
  login_time TIMESTAMPTZ NOT NULL,
  access_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX idx_login_logs_date ON login_logs(DATE(login_time AT TIME ZONE 'Asia/Seoul'));

CREATE TABLE logout_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  oauth_user_id TEXT NOT NULL,
  logout_platform TEXT NOT NULL,
  logout_time TIMESTAMPTZ NOT NULL,
  access_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_logout_logs_user_id ON logout_logs(user_id);
CREATE INDEX idx_logout_logs_date ON logout_logs(DATE(logout_time AT TIME ZONE 'Asia/Seoul'));

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Quizzes: Public read access
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quizzes are viewable by everyone" ON quizzes
  FOR SELECT USING (true);

-- User profiles: Users can view/update own profile
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Login/logout logs: Users can insert own logs
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own login logs" ON login_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE logout_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own logout logs" ON logout_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- DATABASE TRIGGER FOR AUTO USER PROFILE
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, oauth_provider, oauth_user_id, email, created_at)
  VALUES (
    NEW.id,
    NEW.raw_app_meta_data->>'provider',
    NEW.raw_user_meta_data->>'provider_id',
    NEW.email,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after importing quiz data to verify

-- Check quiz count
-- SELECT COUNT(*) FROM quizzes;

-- Check index uniqueness (should return 0 rows)
-- SELECT index, COUNT(*) FROM quizzes GROUP BY index HAVING COUNT(*) > 1;

-- Check category distribution
-- SELECT
--   COUNT(*) FILTER (WHERE category_animal = true) AS animal,
--   COUNT(*) FILTER (WHERE category_eng = true) AS eng,
--   COUNT(*) FILTER (WHERE category_king = true) AS king
-- FROM quizzes;

-- Test public read access (RLS)
-- SELECT * FROM quizzes LIMIT 1;
