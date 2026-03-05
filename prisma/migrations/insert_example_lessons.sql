-- Step 8: Insert example lesson data
-- Run this in Neon SQL Editor after setting up the backend

-- Example: System Design - What is System Design lesson
UPDATE lessons
SET 
  video_url = 'https://www.youtube.com/watch?v=UzLMhqg3_Wc',
  duration = 600
WHERE title = 'What is System Design';

-- Example: Full-Stack - HTML Introduction lesson  
UPDATE lessons
SET 
  video_url = 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
  duration = 600
WHERE title = 'HTML Introduction';

-- Example: DSA - Introduction to Arrays lesson
UPDATE lessons
SET 
  video_url = 'https://www.youtube.com/watch?v=QJNwK2uJyGs',
  duration = 600
WHERE title = 'Introduction to Arrays';

-- Verify the updates
SELECT 
  l.title,
  l.video_url,
  l.duration,
  s.title as section_name,
  sub.title as subject_name
FROM lessons l
JOIN sections s ON l.section_id = s.id
JOIN subjects sub ON s.subject_id = sub.id
WHERE l.video_url IS NOT NULL
ORDER BY sub.title, s.title, l.position;
