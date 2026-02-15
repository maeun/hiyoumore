-- =====================================================
-- HiYouMore - Bookmarks & Flip History System
-- Personal Collection Management (No Leaderboard)
-- =====================================================
-- Users can:
-- 1. Bookmark favorite quizzes
-- 2. View bookmark collection in Mypage
-- 3. Track which quizzes they've flipped (for stats)
-- =====================================================

-- 1. User Bookmarks Table
-- =====================================================
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate bookmarks
  UNIQUE(user_id, quiz_index)
);

-- Foreign key to quizzes.index (matching shared URL pattern)
ALTER TABLE user_bookmarks
  ADD CONSTRAINT fk_bookmark_quiz_index
  FOREIGN KEY (quiz_index)
  REFERENCES quizzes(index)
  ON DELETE CASCADE;

-- Indexes for performance
CREATE INDEX idx_user_bookmarks_user
  ON user_bookmarks(user_id, created_at DESC);

CREATE INDEX idx_user_bookmarks_quiz
  ON user_bookmarks(quiz_index);


-- 2. User Flip History Table
-- =====================================================
-- Tracks which quizzes user has viewed (for stats)
CREATE TABLE IF NOT EXISTS user_flip_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_index INTEGER NOT NULL,
  first_flipped_at TIMESTAMPTZ DEFAULT NOW(),
  last_flipped_at TIMESTAMPTZ DEFAULT NOW(),
  flip_count INTEGER DEFAULT 1 CHECK (flip_count >= 1),

  -- One record per user per quiz
  UNIQUE(user_id, quiz_index)
);

-- Foreign key to quizzes.index
ALTER TABLE user_flip_history
  ADD CONSTRAINT fk_flip_history_quiz_index
  FOREIGN KEY (quiz_index)
  REFERENCES quizzes(index)
  ON DELETE CASCADE;

-- Indexes for performance
CREATE INDEX idx_user_flip_history_user
  ON user_flip_history(user_id, last_flipped_at DESC);

CREATE INDEX idx_user_flip_history_quiz
  ON user_flip_history(quiz_index);


-- 3. Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on user_bookmarks
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON user_bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON user_bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON user_bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on user_flip_history
ALTER TABLE user_flip_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own flip history
CREATE POLICY "Users can view own history"
  ON user_flip_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own flip history
CREATE POLICY "Users can insert own history"
  ON user_flip_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own flip history (for flip_count increment)
CREATE POLICY "Users can update own history"
  ON user_flip_history
  FOR UPDATE
  USING (auth.uid() = user_id);


-- 4. Helper View - Bookmarks with Quiz Details
-- =====================================================
-- Efficient joined query for displaying bookmarked quizzes
-- Note: This is a simplified version that returns '기타' for category
-- We'll update it after confirming the actual column names
CREATE OR REPLACE VIEW bookmarks_with_quizzes AS
SELECT
  b.id,
  b.user_id,
  b.quiz_index,
  b.created_at,
  q.question,
  q.answer,
  q.index,
  '기타' as category  -- Temporary: will be updated with correct category logic
FROM user_bookmarks b
JOIN quizzes q ON b.quiz_index = q.index
ORDER BY b.created_at DESC;

-- Grant access to view (only authenticated users)
GRANT SELECT ON bookmarks_with_quizzes TO authenticated;


-- 5. Function - Increment Flip Count (for UPSERT logic)
-- =====================================================
-- When user flips a quiz, either insert new record or increment flip_count
CREATE OR REPLACE FUNCTION upsert_flip_history(
  p_user_id UUID,
  p_quiz_index INTEGER
)
RETURNS void AS $$
BEGIN
  INSERT INTO user_flip_history (user_id, quiz_index, first_flipped_at, last_flipped_at, flip_count)
  VALUES (p_user_id, p_quiz_index, NOW(), NOW(), 1)
  ON CONFLICT (user_id, quiz_index)
  DO UPDATE SET
    last_flipped_at = NOW(),
    flip_count = user_flip_history.flip_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6. Test Data (Optional - for development)
-- =====================================================
-- Uncomment to insert test bookmarks/history

-- DO $$
-- DECLARE
--   test_user_id UUID;
-- BEGIN
--   -- Get first user
--   SELECT id INTO test_user_id FROM auth.users LIMIT 1;

--   IF test_user_id IS NOT NULL THEN
--     -- Insert test bookmarks
--     INSERT INTO user_bookmarks (user_id, quiz_index) VALUES
--       (test_user_id, 1),
--       (test_user_id, 5),
--       (test_user_id, 10)
--     ON CONFLICT DO NOTHING;

--     -- Insert test flip history
--     INSERT INTO user_flip_history (user_id, quiz_index, flip_count) VALUES
--       (test_user_id, 1, 3),
--       (test_user_id, 2, 1),
--       (test_user_id, 5, 2)
--     ON CONFLICT DO NOTHING;

--     RAISE NOTICE 'Test data inserted successfully';
--   ELSE
--     RAISE NOTICE 'No users found - skipping test data';
--   END IF;
-- END $$;


-- 7. Verification Queries
-- =====================================================
-- Run these after migration to verify everything works

-- Check tables exist
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('user_bookmarks', 'user_flip_history');

-- Check RLS policies
-- SELECT tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE tablename IN ('user_bookmarks', 'user_flip_history');

-- Check view
-- SELECT * FROM bookmarks_with_quizzes LIMIT 5;

-- Test bookmark count per user
-- SELECT user_id, COUNT(*) as bookmark_count
-- FROM user_bookmarks
-- GROUP BY user_id;

-- Test flip history count per user
-- SELECT user_id,
--        COUNT(*) as unique_quizzes_flipped,
--        SUM(flip_count) as total_flips
-- FROM user_flip_history
-- GROUP BY user_id;


-- =====================================================
-- Migration Complete
-- =====================================================
-- Next Steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify tables, indexes, and RLS policies
-- 3. Test with authenticated user session
-- 4. Proceed to implement bookmarkUtils.js
-- =====================================================
