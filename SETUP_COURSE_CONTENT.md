# 🚀 Backend Setup Guide - Course Content with YouTube Integration

This guide walks you through setting up the complete backend for course content with automatic YouTube URL conversion.

---

## 📋 Overview

### What This Adds
- ✅ YouTube URL converter (watch → embed format)
- ✅ Lesson repository for database queries
- ✅ Course tree service with URL conversion
- ✅ Subject tree endpoint with automatic embed URLs
- ✅ Database migrations for video_url and duration columns

### File Structure
```
backend/
├── src/
│   ├── controllers/
│   │   └── subject.controller.ts          # New
│   ├── db/
│   │   └── index.ts                       # Already exists
│   ├── repositories/
│   │   └── lesson.repository.ts           # New
│   ├── routes/
│   │   └── subject.routes.ts              # New
│   ├── services/
│   │   └── course.service.ts              # New
│   └── utils/
│       └── youtube.ts                     # New
└── prisma/migrations/
    ├── add_lesson_columns.sql             # New
    └── insert_example_lessons.sql         # New
```

---

## 🔧 Step-by-Step Setup

### Step 1: Database Migration (Neon SQL)

**Run this first in Neon SQL Editor:**

```sql
-- Add video_url column
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add duration column (optional but recommended)
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS duration INT;

-- Verify
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'lessons'
  AND column_name IN ('video_url', 'duration')
ORDER BY column_name;
```

**File:** `prisma/migrations/add_lesson_columns.sql`

---

### Step 2: Verify Database Connection

**File:** `src/db/index.ts`

Already configured! Just verify your `.env` has:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require
```

The pool is already configured with SSL for production.

---

### Step 3: YouTube URL Converter (Automatic)

**File:** `src/utils/youtube.ts` ✅ Created

This helper automatically converts:
- `https://www.youtube.com/watch?v=VIDEO_ID` → `https://www.youtube.com/embed/VIDEO_ID`
- `https://youtu.be/VIDEO_ID` → `https://www.youtube.com/embed/VIDEO_ID`

**Usage:**
```typescript
import { convertToEmbed } from '../utils/youtube';

const embedUrl = convertToEmbed('https://www.youtube.com/watch?v=abc123');
// Returns: https://www.youtube.com/embed/abc123
```

---

### Step 4: Lesson Repository

**File:** `src/repositories/lesson.repository.ts` ✅ Created

Provides functions:
- `getLessonsBySection(sectionId)` - Get all lessons in a section
- `getLessonById(lessonId)` - Get single lesson details

---

### Step 5: Course Tree Service

**File:** `src/services/course.service.ts` ✅ Created

Main function:
- `getSubjectTree(subjectId)` - Returns complete subject with sections and lessons
- **Automatically converts all YouTube URLs to embed format**

**Response Format:**
```json
{
  "id": "subject-id",
  "title": "Full-Stack Development",
  "slug": "full-stack-masterclass",
  "description": "...",
  "sections": [
    {
      "id": "section-id",
      "title": "HTML Basics",
      "position": 1,
      "lessons": [
        {
          "id": "lesson-id",
          "title": "HTML Introduction",
          "videoUrl": "https://www.youtube.com/embed/abc123",
          "duration": 600,
          "position": 1,
          "isPreview": true
        }
      ]
    }
  ]
}
```

---

### Step 6: Controller

**File:** `src/controllers/subject.controller.ts` ✅ Created

Handles the HTTP request/response for the subject tree endpoint.

**Features:**
- Error handling
- 404 for missing subjects
- Automatic YouTube URL conversion

---

### Step 7: Route

**File:** `src/routes/subject.routes.ts` ✅ Created

**Endpoint:**
```
GET /api/subjects/:subjectId/tree
```

**Registered in:** `src/routes/index.ts` ✅ Updated

---

### Step 8: Insert Example Data (Optional)

**Run this in Neon SQL Editor:**

```sql
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
```

**File:** `prisma/migrations/insert_example_lessons.sql`

---

## 🧪 Testing

### 1. Start the Backend

```bash
cd backend
npm run dev
```

### 2. Test the Endpoint

```bash
# Replace with actual subject ID
curl http://localhost:3000/api/subjects/ec264424-a538-49b5-879e-4187561142ab/tree | jq
```

### 3. Expected Response

```json
{
  "success": true,
  "data": {
    "id": "ec264424-a538-49b5-879e-4187561142ab",
    "title": "Full-Stack Development Masterclass",
    "slug": "full-stack-masterclass",
    "description": "Complete development roadmap...",
    "sections": [
      {
        "id": "...",
        "title": "HTML Basics",
        "position": 1,
        "lessons": [
          {
            "id": "...",
            "title": "HTML Introduction",
            "videoUrl": "https://www.youtube.com/embed/pQN-pnXPaVg",
            "duration": 600,
            "position": 1,
            "isPreview": true
          }
        ]
      }
    ]
  }
}
```

---

## 🎯 Frontend Integration

### Using the Video URL in iframe

```jsx
// React Component Example
function VideoPlayer({ lesson }) {
  return (
    <iframe
      width="560"
      height="315"
      src={lesson.videoUrl}  // Already in embed format!
      title={lesson.title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

// Usage
<CourseTree subjectId={subjectId}>
  {(sections) => sections.map(section => (
    <div key={section.id}>
      <h2>{section.title}</h2>
      {section.lessons.map(lesson => (
        <VideoPlayer key={lesson.id} lesson={lesson} />
      ))}
    </div>
  ))}
</CourseTree>
```

---

## 🔄 Complete Flow

```
1. Lesson stored in Neon DB
   video_url: "https://www.youtube.com/watch?v=abc123"
   
        ↓
   
2. GET /api/subjects/:id/tree
   
        ↓
   
3. course.service.ts calls convertToEmbed()
   
        ↓
   
4. API returns embed URL
   videoUrl: "https://www.youtube.com/embed/abc123"
   
        ↓
   
5. Frontend iframe loads video ✅
```

---

## 📊 Database Schema

### Lessons Table (Updated)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| section_id | UUID | Foreign key to sections |
| title | TEXT | Lesson title |
| video_url | TEXT | YouTube URL (any format) |
| duration | INT | Duration in seconds |
| position | INT | Order within section |
| is_preview | BOOLEAN | Free preview flag |
| created_at | TIMESTAMP | Creation date |

---

## 🛠️ Troubleshooting

### Issue: Columns don't exist
**Solution:** Run Step 1 migration in Neon SQL Editor

### Issue: Videos not playing
**Solution:** Check that URLs are converted to `/embed/` format

### Issue: 404 on endpoint
**Solution:** Ensure route is registered in `src/routes/index.ts`

### Issue: Database connection error
**Solution:** Verify `DATABASE_URL` in `.env` includes `?sslmode=require`

---

## ✅ Checklist

- [ ] Run database migration (Step 1)
- [ ] Verify `.env` has correct `DATABASE_URL`
- [ ] All new files created
- [ ] Route registered in `index.ts`
- [ ] Backend starts without errors
- [ ] Test endpoint returns embed URLs
- [ ] Frontend can load videos in iframe

---

## 🎉 Result

Your LMS now supports:
- ✅ YouTube iframe playback
- ✅ Automatic URL conversion
- ✅ Neon PostgreSQL storage
- ✅ Safe API responses
- ✅ No authentication changes needed
- ✅ Works with existing seed data

**Next:** Seed your course content using the seeding scripts! 🚀
