-- Step 1: Add video_url column to lessons table
-- Run this in Neon SQL Editor first

ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Optional: Add duration column if it doesn't exist
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS duration INT;

-- Verify columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'lessons'
  AND column_name IN ('video_url', 'duration')
ORDER BY column_name;
