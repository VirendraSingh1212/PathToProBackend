-- Step 1: Ensure lessons table has video_url column
-- Run this once in your Neon database

ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- This migration is already applied in your schema, 
-- but this SQL ensures it exists in your database
