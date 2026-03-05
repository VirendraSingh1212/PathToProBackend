-- Step 2: Seed Course Content
-- Run this SQL script in your Neon database console

-- ========================================
-- Full-Stack Development Masterclass
-- Subject ID: ec264424-a538-49b5-879e-4187561142ab
-- ========================================

-- Insert sections for Full-Stack Development
INSERT INTO sections (id, subject_id, title, order_index, created_at, updated_at)
VALUES
(gen_random_uuid(), 'ec264424-a538-49b5-879e-4187561142ab', 'HTML Basics', 1, NOW(), NOW()),
(gen_random_uuid(), 'ec264424-a538-49b5-879e-4187561142ab', 'CSS Fundamentals', 2, NOW(), NOW()),
(gen_random_uuid(), 'ec264424-a538-49b5-879e-4187561142ab', 'JavaScript Essentials', 3, NOW(), NOW());

-- Insert lessons for Full-Stack Development
INSERT INTO lessons (id, section_id, title, video_url, duration, position, is_preview, created_at)
SELECT 
    gen_random_uuid(), 
    s.id, 
    l.title, 
    l.video, 
    l.duration,
    l.pos, 
    l.preview,
    NOW()
FROM sections s
CROSS JOIN LATERAL (
    VALUES
    -- HTML Basics (Section 1)
    ('HTML Introduction', 'https://www.youtube.com/embed/pQN-pnXPaVg', 600, 1, true),
    ('HTML Tags Explained', 'https://www.youtube.com/embed/UB1O30fR-EE', 900, 2, false),
    ('Forms and Inputs', 'https://www.youtube.com/embed/fNcJuPIZ2WE', 1200, 3, false),
    
    -- CSS Fundamentals (Section 2)
    ('CSS Introduction', 'https://www.youtube.com/embed/1PnVor36_40', 720, 1, true),
    ('Flexbox Layout', 'https://www.youtube.com/embed/JJSoEo8JSnc', 1080, 2, false),
    ('Responsive Design', 'https://www.youtube.com/embed/srvUrASNj0s', 1500, 3, false),
    
    -- JavaScript Essentials (Section 3)
    ('JavaScript Basics', 'https://www.youtube.com/embed/W6NZfCO5SIk', 840, 1, true),
    ('DOM Manipulation', 'https://www.youtube.com/embed/0ik6X4DJKCc', 960, 2, false),
    ('Async JavaScript', 'https://www.youtube.com/embed/PoRJizFvM7s', 1140, 3, false)
) AS l(title, video, duration, pos, preview)
WHERE s.subject_id = 'ec264424-a538-49b5-879e-4187561142ab'
AND s.order_index = ((l.pos - 1) / 3) + 1;

-- ========================================
-- System Design Fundamentals
-- Subject ID: 5ea04861-3287-4870-8ff6-07344554bc54
-- ========================================

-- Insert sections for System Design
INSERT INTO sections (id, subject_id, title, order_index, created_at, updated_at)
VALUES
(gen_random_uuid(), '5ea04861-3287-4870-8ff6-07344554bc54', 'System Design Basics', 1, NOW(), NOW()),
(gen_random_uuid(), '5ea04861-3287-4870-8ff6-07344554bc54', 'Scalability Fundamentals', 2, NOW(), NOW()),
(gen_random_uuid(), '5ea04861-3287-4870-8ff6-07344554bc54', 'Databases & Storage', 3, NOW(), NOW()),
(gen_random_uuid(), '5ea04861-3287-4870-8ff6-07344554bc54', 'Caching & Performance', 4, NOW(), NOW());

-- Insert lessons for System Design
INSERT INTO lessons (id, section_id, title, video_url, duration, position, is_preview, created_at)
SELECT 
    gen_random_uuid(), 
    s.id, 
    l.title, 
    l.video, 
    l.duration,
    l.pos, 
    l.preview,
    NOW()
FROM sections s
CROSS JOIN LATERAL (
    VALUES
    -- System Design Basics (Section 1)
    ('What is System Design', 'https://www.youtube.com/embed/UzLMhqg3_Wc', 600, 1, true),
    ('Client Server Architecture', 'https://www.youtube.com/embed/ZgdS0EUmn70', 700, 2, false),
    ('Monolith vs Microservices', 'https://www.youtube.com/embed/CZ3wIuvmHeM', 650, 3, false),
    ('Load Balancers Explained', 'https://www.youtube.com/embed/K0Ta65OqQkY', 680, 4, false),
    
    -- Scalability Fundamentals (Section 2)
    ('Vertical vs Horizontal Scaling', 'https://www.youtube.com/embed/xpDnVSmNFX0', 720, 1, true),
    ('Database Scaling', 'https://www.youtube.com/embed/bUHFg8CZFws', 840, 2, false),
    ('Replication and Sharding', 'https://www.youtube.com/embed/5faMjKuB9bc', 900, 3, false),
    ('CAP Theorem', 'https://www.youtube.com/embed/k-Yaq8AHlFA', 780, 4, false),
    
    -- Databases & Storage (Section 3)
    ('SQL vs NoSQL', 'https://www.youtube.com/embed/QC3h-9t6w5o', 660, 1, true),
    ('Database Indexing', 'https://www.youtube.com/embed/FS1A1yS9OQ8', 720, 2, false),
    ('Data Partitioning', 'https://www.youtube.com/embed/tXH8rWqYcAU', 780, 3, false),
    
    -- Caching & Performance (Section 4)
    ('Caching Strategies', 'https://www.youtube.com/embed/6V9UkX7yVqA', 840, 1, false)
) AS l(title, video, duration, pos, preview)
WHERE s.subject_id = '5ea04861-3287-4870-8ff6-07344554bc54'
AND (
    (s.order_index = 1 AND l.pos BETWEEN 1 AND 4) OR
    (s.order_index = 2 AND l.pos BETWEEN 5 AND 8) OR
    (s.order_index = 3 AND l.pos BETWEEN 9 AND 11) OR
    (s.order_index = 4 AND l.pos = 12)
);

-- ========================================
-- Data Structures & Algorithms
-- Subject ID: d3529755-2fd8-4c3e-95b6-77c5496dff0b
-- ========================================

-- Insert sections for DSA
INSERT INTO sections (id, subject_id, title, order_index, created_at, updated_at)
VALUES
(gen_random_uuid(), 'd3529755-2fd8-4c3e-95b6-77c5496dff0b', 'Arrays & Strings', 1, NOW(), NOW()),
(gen_random_uuid(), 'd3529755-2fd8-4c3e-95b6-77c5496dff0b', 'Linked Lists', 2, NOW(), NOW()),
(gen_random_uuid(), 'd3529755-2fd8-4c3e-95b6-77c5496dff0b', 'Trees', 3, NOW(), NOW()),
(gen_random_uuid(), 'd3529755-2fd8-4c3e-95b6-77c5496dff0b', 'Graph Algorithms', 4, NOW(), NOW());

-- Insert lessons for DSA
INSERT INTO lessons (id, section_id, title, video_url, duration, position, is_preview, created_at)
SELECT 
    gen_random_uuid(), 
    s.id, 
    l.title, 
    l.video, 
    l.duration,
    l.pos, 
    l.preview,
    NOW()
FROM sections s
CROSS JOIN LATERAL (
    VALUES
    -- Arrays & Strings (Section 1)
    ('Introduction to Arrays', 'https://www.youtube.com/embed/QJNwK2uJyGs', 600, 1, true),
    ('Two Pointer Technique', 'https://www.youtube.com/embed/JXk4C8vYbFQ', 650, 2, false),
    ('Sliding Window', 'https://www.youtube.com/embed/MK-NZ4hN7rs', 630, 3, false),
    
    -- Linked Lists (Section 2)
    ('Linked List Basics', 'https://www.youtube.com/embed/SMIq13-FZSE', 720, 1, true),
    ('Reverse Linked List', 'https://www.youtube.com/embed/O0By4Zq0OFc', 660, 2, false),
    
    -- Trees (Section 3)
    ('Binary Trees', 'https://www.youtube.com/embed/oSWTXtMglKE', 780, 1, true),
    ('Tree Traversal', 'https://www.youtube.com/embed/9RHO6jU--GU', 840, 2, false),
    
    -- Graph Algorithms (Section 4)
    ('Graph BFS', 'https://www.youtube.com/embed/pcKY4hjDrxk', 900, 1, true),
    ('Graph DFS', 'https://www.youtube.com/embed/7fujbpJ0LB4', 720, 2, false)
) AS l(title, video, duration, pos, preview)
WHERE s.subject_id = 'd3529755-2fd8-4c3e-95b6-77c5496dff0b'
AND (
    (s.order_index = 1 AND l.pos BETWEEN 1 AND 3) OR
    (s.order_index = 2 AND l.pos BETWEEN 4 AND 5) OR
    (s.order_index = 3 AND l.pos BETWEEN 6 AND 7) OR
    (s.order_index = 4 AND l.pos BETWEEN 8 AND 9)
);

-- Verification query
SELECT 
    sub.title as subject,
    COUNT(DISTINCT sec.id) as sections,
    COUNT(DISTINCT les.id) as lessons
FROM subjects sub
LEFT JOIN sections sec ON sec.subject_id = sub.id
LEFT JOIN lessons les ON les.section_id = sec.id
WHERE sub.id IN (
    'ec264424-a538-49b5-879e-4187561142ab',
    '5ea04861-3287-4870-8ff6-07344554bc54',
    'd3529755-2fd8-4c3e-95b6-77c5496dff0b'
)
GROUP BY sub.title;
