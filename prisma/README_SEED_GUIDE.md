# 🎓 Course Content Seeding - Complete Guide

Welcome! This guide will help you seed your LMS with complete course content including videos, sections, and lessons.

---

## 📋 What You'll Get

After following this guide, your LMS will have:

✅ **3 Complete Courses**
- Full-Stack Development Masterclass (9 lessons)
- System Design Fundamentals (12 lessons)
- Data Structures & Algorithms (9 lessons)

✅ **Features**
- YouTube video embeds (iframe compatible)
- Preview lessons (free access)
- Organized sections
- Duration metadata
- Position ordering

✅ **API Endpoint Ready**
- `/api/subjects/:subjectId/tree` returns complete course structure
- Perfect for frontend consumption

---

## 🚀 Quick Start (Choose One Method)

### Method 1: Prisma Seed (Development - Recommended)

**Best for:** Local development, testing

```bash
cd backend

# Step 1: Create subjects (skip if already exist)
npx ts-node prisma/seed.ts

# Step 2: Seed all course content
npx ts-node prisma/seedAllContent.ts

# Step 3: Test the results
./prisma/testSeeding.sh
```

### Method 2: Direct SQL (Production - Recommended)

**Best for:** Production deployments, one-time setup

```bash
# Step 1: Open Neon Console
# Go to: https://console.neon.tech/

# Step 2: Run the SQL script
# Copy entire content of: prisma/seedCourseContent.sql
# Paste into Neon Console and execute

# Step 3: Verify using test script
./prisma/testSeeding.sh
```

---

## 📁 Files Overview

### Modified Files
- **`prisma/seedAllContent.ts`** - Updated with new content structure

### Created Files

#### SQL Scripts
1. **`prisma/addVideoUrlColumn.sql`** 
   - Ensures `video_url` column exists (already in schema)
   - Safe to run multiple times

2. **`prisma/seedCourseContent.sql`**
   - Complete SQL script for direct database seeding
   - Includes verification query
   - Use in production environments

#### Documentation
3. **`prisma/QUICK_START.md`**
   - Quick reference guide
   - Command examples
   - Expected output

4. **`prisma/SEED_INSTRUCTIONS.md`**
   - Detailed step-by-step instructions
   - Troubleshooting guide
   - Content structure tables

5. **`prisma/IMPLEMENTATION_SUMMARY.md`**
   - What was changed
   - Statistics and metrics
   - Next steps

6. **`prisma/README_SEED_GUIDE.md`**
   - This file - comprehensive overview

#### Testing
7. **`prisma/testSeeding.sh`**
   - Automated test script
   - Verifies API endpoints
   - Makes sure everything works

---

## 🎯 Detailed Steps (Method 1 - Prisma)

### Step 1: Verify Database Connection

Make sure your database is running:
```bash
# Check .env file has correct DATABASE_URL
cat .env | grep DATABASE_URL
```

### Step 2: Seed Subjects

```bash
npx ts-node prisma/seed.ts
```

**Expected Output:**
```
🌱 Seeding subjects...
✅ Created: Full-Stack Development Masterclass
✅ Created: System Design Fundamentals
✅ Created: Data Structures & Algorithms
🎉 Seeding completed successfully!
```

### Step 3: Seed Course Content

```bash
npx ts-node prisma/seedAllContent.ts
```

**Expected Output:**
```
🌱 Seeding course content for ALL subjects...
✅ Found 3 published subjects

📚 Seeding: Full-Stack Development Masterclass
   Creating Full-Stack sections...
   ✅ Full-Stack content created (3 sections, 9 lessons)

📚 Seeding: System Design Fundamentals
   Creating System Design sections...
   ✅ System Design content created (4 sections, 12 lessons)

📚 Seeding: Data Structures & Algorithms
   Creating DSA sections...
   ✅ DSA content created (4 sections, 9 lessons)

🎉 All course content seeding completed!
```

### Step 4: Verify via API

```bash
# Start your server first
npm run dev

# In another terminal, run tests
./prisma/testSeeding.sh
```

---

## 🎯 Detailed Steps (Method 2 - Direct SQL)

### Step 1: Add video_url Column

1. Open [Neon Console](https://console.neon.tech/)
2. Select your database
3. Open SQL Editor
4. Run:

```sql
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS video_url TEXT;
```

**Note:** This column likely already exists from your migration, but running this ensures it's there.

### Step 2: Seed All Content

1. Open `prisma/seedCourseContent.sql` in your editor
2. Copy the **entire** file content
3. Paste into Neon Console
4. Execute

**What it does:**
- Creates 11 sections across 3 subjects
- Creates 30 lessons with proper positioning
- Sets preview flags
- Adds YouTube embed URLs
- Includes timestamps

### Step 3: Verify

The SQL file includes a verification query at the end that shows:
- Subject name
- Number of sections
- Number of lessons

---

## 📊 Content Breakdown

### Full-Stack Development Masterclass
**Subject ID:** `ec264424-a538-49b5-879e-4187561142ab`

| Section | Lessons | Preview |
|---------|---------|---------|
| HTML Basics | 3 | ✅ HTML Introduction |
| CSS Fundamentals | 3 | ✅ CSS Introduction |
| JavaScript Essentials | 3 | ✅ JavaScript Basics |

**Total:** 3 sections, 9 lessons

### System Design Fundamentals
**Subject ID:** `5ea04861-3287-4870-8ff6-07344554bc54`

| Section | Lessons | Preview |
|---------|---------|---------|
| System Design Basics | 4 | ✅ What is System Design |
| Scalability Fundamentals | 4 | ✅ Vertical vs Horizontal Scaling |
| Databases & Storage | 3 | ✅ SQL vs NoSQL |
| Caching & Performance | 1 | ❌ None |

**Total:** 4 sections, 12 lessons

### Data Structures & Algorithms
**Subject ID:** `d3529755-2fd8-4c3e-95b6-77c5496dff0b`

| Section | Lessons | Preview |
|---------|---------|---------|
| Arrays & Strings | 3 | ✅ Introduction to Arrays |
| Linked Lists | 2 | ✅ Linked List Basics |
| Trees | 2 | ✅ Binary Trees |
| Graph Algorithms | 2 | ✅ Graph BFS |

**Total:** 4 sections, 9 lessons

---

## 🧪 Testing & Verification

### Automated Tests

Run the test script:
```bash
./prisma/testSeeding.sh
```

**Expected Output:**
```
🧪 Testing Course Content API
======================================

📚 Testing Full-Stack Development Masterclass...
   ✅ Full-Stack course tree loaded successfully

🏗️  Testing System Design Fundamentals...
   ✅ System Design course tree loaded successfully

💻 Testing Data Structures & Algorithms...
   ✅ DSA course tree loaded successfully

======================================
✅ Testing complete!
```

### Manual Testing

Test individual endpoints:

```bash
# Full-Stack
curl http://localhost:3000/api/subjects/ec264424-a538-49b5-879e-4187561142ab/tree | jq

# System Design
curl http://localhost:3000/api/subjects/5ea04861-3287-4870-8ff6-07344554bc54/tree | jq

# DSA
curl http://localhost:3000/api/subjects/d3529755-2fd8-4c3e-95b6-77c5496dff0b/tree | jq
```

### Expected Response Structure

```json
{
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
```

---

## 🔍 Troubleshooting

### Issue: "Subjects already exist"
**Solution:** This is normal if you've seeded before. The script skips existing content. To reset:
```sql
DELETE FROM lessons;
DELETE FROM sections;
-- Then re-run seed
```

### Issue: "video_url column does not exist"
**Solution:** Run the SQL from Step 1:
```sql
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_url TEXT;
```

### Issue: "Cannot find module '../src/config/prisma'"
**Solution:** Make sure you're in the `backend` directory:
```bash
cd backend
npx ts-node prisma/seedAllContent.ts
```

### Issue: Videos not playing in frontend
**Solution:** Ensure URLs use `/embed/` format:
- ✅ `https://www.youtube.com/embed/VIDEO_ID`
- ❌ `https://www.youtube.com/watch?v=VIDEO_ID`

### Issue: Duplicate content
**Solution:** The seed scripts check for existing content. If you want to reset completely:
```sql
-- Warning: This deletes all content!
DELETE FROM video_progress;
DELETE FROM lessons;
DELETE FROM sections;
DELETE FROM enrollments;
DELETE FROM subjects;
```

---

## 🎨 Frontend Integration

### Display Course Tree

```javascript
// Fetch course data
const response = await fetch('/api/subjects/SUBJECT_ID/tree');
const course = await response.json();

// Display sections and lessons
course.sections.forEach(section => {
  console.log(`Section: ${section.title}`);
  section.lessons.forEach(lesson => {
    console.log(`  - ${lesson.title} (${lesson.isPreview ? 'FREE' : 'PAID'})`);
  });
});

// Embed video in iframe
<iframe 
  src={lesson.videoUrl} 
  title={lesson.title}
  width="560" 
  height="315"
  frameBorder="0"
  allowFullScreen
/>;
```

---

## 📝 Additional Resources

### Documentation Files
- **QUICK_START.md** - Fast reference
- **SEED_INSTRUCTIONS.md** - Detailed guide
- **IMPLEMENTATION_SUMMARY.md** - What changed
- **README_SEED_GUIDE.md** - This file

### SQL Files
- **addVideoUrlColumn.sql** - Column migration
- **seedCourseContent.sql** - Direct seeding

### TypeScript Files
- **seed.ts** - Creates subjects
- **seedAllContent.ts** - Creates sections & lessons

### Test Files
- **testSeeding.sh** - Automated verification

---

## ✅ Checklist

Before you finish, make sure:

- [ ] Database is running
- [ ] Subjects exist (run `seed.ts`)
- [ ] Course content seeded (run `seedAllContent.ts` or SQL)
- [ ] API endpoint returns data
- [ ] Video URLs use `/embed/` format
- [ ] Preview lessons are marked correctly
- [ ] All tests pass (`testSeeding.sh`)

---

## 🎉 Success!

If you've followed this guide, your LMS now has:

✅ 3 complete courses  
✅ 11 sections  
✅ 30+ video lessons  
✅ YouTube embed support  
✅ Preview lesson system  
✅ Fully functional API  

**Next Steps:** Connect your frontend and start building amazing learning experiences! 🚀

---

## 📞 Need Help?

1. Check the troubleshooting section above
2. Review `SEED_INSTRUCTIONS.md` for detailed help
3. Run `testSeeding.sh` to diagnose issues
4. Check your database connection

Good luck! 🌟
