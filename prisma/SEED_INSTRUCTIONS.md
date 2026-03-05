# Course Content Seeding Instructions

This guide will help you add all course content to your LMS system.

## Overview

You're adding:
- **3 courses** (Full-Stack, System Design, DSA)
- **11 sections** total
- **30+ lessons** with YouTube video embeds
- Preview lessons for each course
- Fully playable iframe content

## Prerequisites

✅ Database is running (Neon PostgreSQL)  
✅ Subjects already exist with the following IDs:
- `ec264424-a538-49b5-879e-4187561142ab` - Full-Stack Development
- `5ea04861-3287-4870-8ff6-07344554bc54` - System Design Fundamentals
- `d3529755-2fd8-4c3e-95b6-77c5496dff0b` - Data Structures & Algorithms

---

## Step 1 — Ensure Lessons Table Has video_url Column

Run this SQL command **once** in your Neon database console:

```sql
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS video_url TEXT;
```

> ✅ **Note:** This column already exists in your Prisma schema from migration `20260304113719_add_lessons_table`, but running this ensures it exists in your database.

**File:** `prisma/addVideoUrlColumn.sql`

---

## Step 2 — Seed Course Content (Choose One Method)

### Method A: Run SQL Script Directly (Recommended for Production)

1. Open your **Neon Console** or database client
2. Copy and paste the entire contents of `prisma/seedCourseContent.sql`
3. Execute the script
4. Verify the results using the included verification query

**File:** `prisma/seedCourseContent.sql`

### Method B: Use Prisma Seed Command (Recommended for Development)

1. First, ensure subjects exist by running:
   ```bash
   npx ts-node prisma/seed.ts
   ```

2. Then seed all course content:
   ```bash
   npx ts-node prisma/seedAllContent.ts
   ```

This will automatically detect existing content and skip re-seeding.

**Files:** 
- `prisma/seed.ts` - Creates subjects
- `prisma/seedAllContent.ts` - Creates sections and lessons

---

## Content Structure

### Full-Stack Development Masterclass
**Subject ID:** `ec264424-a538-49b5-879e-4187561142ab`

| Section | Lessons | Preview Lesson |
|---------|---------|----------------|
| HTML Basics | 3 | HTML Introduction |
| CSS Fundamentals | 3 | CSS Introduction |
| JavaScript Essentials | 3 | JavaScript Basics |

**Total:** 3 sections, 9 lessons

### System Design Fundamentals
**Subject ID:** `5ea04861-3287-4870-8ff6-07344554bc54`

| Section | Lessons | Preview Lesson |
|---------|---------|----------------|
| System Design Basics | 4 | What is System Design |
| Scalability Fundamentals | 4 | Vertical vs Horizontal Scaling |
| Databases & Storage | 3 | SQL vs NoSQL |
| Caching & Performance | 1 | Caching Strategies |

**Total:** 4 sections, 12 lessons

### Data Structures & Algorithms
**Subject ID:** `d3529755-2fd8-4c3e-95b6-77c5496dff0b`

| Section | Lessons | Preview Lesson |
|---------|---------|----------------|
| Arrays & Strings | 3 | Introduction to Arrays |
| Linked Lists | 2 | Linked List Basics |
| Trees | 2 | Binary Trees |
| Graph Algorithms | 2 | Graph BFS |

**Total:** 4 sections, 9 lessons

---

## Step 3 — Verify Endpoint

Test that the content is accessible via API:

### Request
```bash
GET /api/subjects/:subjectId/tree
```

Example (replace with actual subject ID):
```bash
curl http://localhost:3000/api/subjects/ec264424-a538-49b5-879e-4187561142ab/tree
```

### Expected Response Structure
```json
{
  "id": "ec264424-a538-49b5-879e-4187561142ab",
  "title": "Full-Stack Development Masterclass",
  "slug": "full-stack-masterclass",
  "description": "...",
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
        },
        // ... more lessons
      ]
    }
    // ... more sections
  ]
}
```

---

## Video URL Format

All video URLs use the **embed format** for iframe compatibility:
- ✅ Correct: `https://www.youtube.com/embed/VIDEO_ID`
- ❌ Incorrect: `https://www.youtube.com/watch?v=VIDEO_ID`

This ensures videos can be played directly in your frontend application.

---

## Troubleshooting

### Issue: Subjects don't exist
**Solution:** Run `npx ts-node prisma/seed.ts` first to create the subjects.

### Issue: Content already exists error
**Solution:** The seed scripts check for existing content and skip if found. To reset:
1. Delete existing sections/lessons from database
2. Re-run the seed script

### Issue: video_url column doesn't exist
**Solution:** Run the SQL from Step 1 in your Neon console.

### Issue: Videos not playing
**Solution:** Ensure URLs use `/embed/` format, not `/watch?v=` format.

---

## Database Cleanup (Optional)

To remove all content and start fresh:

```sql
-- Delete all lessons
DELETE FROM lessons;

-- Delete all sections
DELETE FROM sections;

-- Reset subjects (optional)
DELETE FROM subjects;
```

Then re-run the seeding process.

---

## Summary

After completing these steps, your LMS will have:

✅ 3 complete courses  
✅ 11 sections total  
✅ 30+ video lessons  
✅ YouTube embed support  
✅ Preview lesson flags  
✅ Fully functional `/api/subjects/:id/tree` endpoint  

**Next Steps:** Connect your frontend to display the course content tree!
