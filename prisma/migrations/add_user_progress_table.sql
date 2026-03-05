-- =====================================================
-- PROGRESS TRACKING ENHANCEMENT MIGRATION
-- Adds user_progress table for subject-level tracking
-- =====================================================

-- User Progress Table for Subject-Level Tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  last_lesson_id TEXT REFERENCES lessons(id),
  completed_video_ids TEXT[] DEFAULT '{}',
  progress_percent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, subject_id)
);

-- Indexes for Fast Lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_user_subject 
ON user_progress(user_id, subject_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_last_lesson 
ON user_progress(last_lesson_id);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_progress_timestamp ON user_progress;

CREATE TRIGGER trg_update_progress_timestamp
BEFORE UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION update_progress_timestamp();

-- Verification query
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_progress'
ORDER BY ordinal_position;
