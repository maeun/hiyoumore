-- =====================================================
-- HiYouMore - Comments System Migration
-- Phase 1: Community Features Implementation
-- =====================================================
-- CRITICAL: Uses quiz_index (INTEGER) NOT quiz_id (SERIAL)
-- Reason: Existing shared URLs use ?num=<index> pattern
-- =====================================================

-- 1. Comments Table
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- CRITICAL: Use quiz_index to match shared URL pattern
  -- Matches: Quiz.js line 91 (?num=${quiz_num})
  -- Matches: SharedQuiz.js line 98-101 (.eq('index', parseInt(num)))
  quiz_index INTEGER NOT NULL,

  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL CHECK (char_length(comment_text) BETWEEN 1 AND 500),
  likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
  is_pinned BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foreign key to quizzes.index (not quizzes.id!)
ALTER TABLE quiz_comments
  ADD CONSTRAINT fk_quiz_index
  FOREIGN KEY (quiz_index)
  REFERENCES quizzes(index)
  ON DELETE CASCADE;

-- Indexes for performance
-- Partial index: Only non-hidden comments for faster queries
CREATE INDEX idx_quiz_comments_quiz_created
  ON quiz_comments(quiz_index, created_at DESC)
  WHERE is_hidden = FALSE;

CREATE INDEX idx_quiz_comments_user_id
  ON quiz_comments(user_id);

CREATE INDEX idx_quiz_comments_created
  ON quiz_comments(created_at DESC);


-- 2. Comment Likes Table
-- =====================================================
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES quiz_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate likes from same user
  UNIQUE(comment_id, user_id)
);

CREATE INDEX idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user ON comment_likes(user_id);


-- 3. Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on quiz_comments
ALTER TABLE quiz_comments ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view non-hidden comments (including anonymous)
CREATE POLICY "Comments are viewable by everyone"
  ON quiz_comments
  FOR SELECT
  USING (is_hidden = FALSE);

-- Policy: Authenticated users can insert their own comments
CREATE POLICY "Users can insert own comments"
  ON quiz_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON quiz_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Enable RLS on comment_likes
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view likes
CREATE POLICY "Likes are viewable by everyone"
  ON comment_likes
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert their own likes
CREATE POLICY "Users can insert own likes"
  ON comment_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own likes (unlike)
CREATE POLICY "Users can delete own likes"
  ON comment_likes
  FOR DELETE
  USING (auth.uid() = user_id);


-- 4. Database Triggers - Auto-increment/decrement like counts
-- =====================================================

-- Function: Increment likes_count when a like is added
CREATE OR REPLACE FUNCTION increment_comment_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE quiz_comments
  SET likes_count = likes_count + 1
  WHERE id = NEW.comment_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: After inserting a like
CREATE TRIGGER on_comment_liked
  AFTER INSERT ON comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_comment_likes();

-- Function: Decrement likes_count when a like is removed
CREATE OR REPLACE FUNCTION decrement_comment_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE quiz_comments
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = OLD.comment_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger: After deleting a like
CREATE TRIGGER on_comment_unliked
  AFTER DELETE ON comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_comment_likes();


-- 5. Helper View - Comments with User Profiles
-- =====================================================
-- Efficient joined query for displaying comments with user info
CREATE OR REPLACE VIEW comments_with_profiles AS
SELECT
  c.id,
  c.quiz_index,
  c.comment_text,
  c.likes_count,
  c.is_pinned,
  c.created_at,
  c.updated_at,
  c.user_id,
  COALESCE(p.nickname, p.name, '익명') as nickname,
  p.profile_image_url
FROM quiz_comments c
LEFT JOIN user_profiles p ON c.user_id = p.id
WHERE c.is_hidden = FALSE
ORDER BY c.is_pinned DESC, c.created_at DESC;

-- Grant access to view
GRANT SELECT ON comments_with_profiles TO anon, authenticated;


-- 6. Insert Test Data (5 sample comments)
-- =====================================================
-- Note: Replace user_id with actual auth.users UUIDs after running
-- These will fail if no users exist - that's OK, just for testing

DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Get first user from auth.users (or create a dummy)
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;

  -- Only insert if user exists
  IF test_user_id IS NOT NULL THEN
    INSERT INTO quiz_comments (quiz_index, user_id, comment_text, likes_count) VALUES
      (1, test_user_id, '와 이거 진짜 어려웠어요! 😅', 5),
      (1, test_user_id, '재미있네요! 친구한테 공유했어요 ㅎㅎ', 3),
      (2, test_user_id, '이 문제는 쉬웠어요~', 1),
      (3, test_user_id, '몰랐던 사실이네요! 유익해요 👍', 8),
      (5, test_user_id, '정답 보고 깜짝 놀랐어요 ㅋㅋ', 2)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Test comments inserted successfully';
  ELSE
    RAISE NOTICE 'No users found - skipping test data insertion';
  END IF;
END $$;


-- 7. Verification Queries
-- =====================================================
-- Run these after migration to verify everything works

-- Check tables exist
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('quiz_comments', 'comment_likes');

-- Check foreign key constraint
-- SELECT constraint_name, table_name, column_name
-- FROM information_schema.key_column_usage
-- WHERE table_name = 'quiz_comments'
-- AND constraint_name = 'fk_quiz_index';

-- Check RLS policies
-- SELECT tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('quiz_comments', 'comment_likes');

-- Check view exists
-- SELECT * FROM comments_with_profiles LIMIT 5;

-- Check test data
-- SELECT quiz_index, comment_text, likes_count FROM quiz_comments;


-- =====================================================
-- Migration Complete
-- =====================================================
-- Next Steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify tables, indexes, and RLS policies
-- 3. Test with anonymous and authenticated sessions
-- 4. Proceed to Day 2: BottomSheet Component
-- =====================================================
