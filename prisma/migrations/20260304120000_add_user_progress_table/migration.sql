-- User Progress Tracking Migration
-- Tracks lesson completion for resume learning

CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT NOT NULL,
  lesson_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_progress_user
ON user_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_progress_subject
ON user_progress(subject_id);

CREATE INDEX IF NOT EXISTS idx_progress_lesson
ON user_progress(lesson_id);

COMMENT ON TABLE user_progress IS 'Tracks user lesson completion for course progress and resume learning';
COMMENT ON COLUMN user_progress.user_id IS 'References users table (BigInt for compatibility)';
COMMENT ON COLUMN user_progress.lesson_id IS 'References lessons table';
COMMENT ON COLUMN user_progress.subject_id IS 'References subjects table for quick filtering';
COMMENT ON COLUMN user_progress.completed IS 'Whether lesson is completed';
COMMENT ON COLUMN user_progress.completed_at IS 'Timestamp of completion';
