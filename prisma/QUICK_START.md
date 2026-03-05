# Quick Start - Seed Course Content

## Option 1: Using Prisma (Recommended for Development)

### Step 1: Seed subjects (if they don't exist)
```bash
cd backend
npx ts-node prisma/seed.ts
```

### Step 2: Seed course content
```bash
npx ts-node prisma/seedAllContent.ts
```

### Step 3: Verify via API
```bash
# Get Full-Stack course tree
curl http://localhost:3000/api/subjects/ec264424-a538-49b5-879e-4187561142ab/tree

# Get System Design course tree
curl http://localhost:3000/api/subjects/5ea04861-3287-4870-8ff6-07344554bc54/tree

# Get DSA course tree
curl http://localhost:3000/api/subjects/d3529755-2fd8-4c3e-95b6-77c5496dff0b/tree
```

---

## Option 2: Direct SQL (Recommended for Production)

### Step 1: Add video_url column (run once)
Open Neon Console and run:
```sql
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_url TEXT;
```

### Step 2: Seed all content
Copy and paste the entire `prisma/seedCourseContent.sql` file into Neon Console and execute.

### Step 3: Verify
Run the verification query at the end of the SQL script.

---

## What You're Adding

### 📚 Full-Stack Development Masterclass
- Subject ID: `ec264424-a538-49b5-879e-4187561142ab`
- 3 sections, 9 lessons
- Preview lessons: HTML Intro, CSS Intro, JS Basics

### 🏗️ System Design Fundamentals
- Subject ID: `5ea04861-3287-4870-8ff6-07344554bc54`
- 4 sections, 12 lessons
- Preview lessons: What is System Design, Scaling, SQL vs NoSQL

### 💻 Data Structures & Algorithms
- Subject ID: `d3529755-2fd8-4c3e-95b6-77c5496dff0b`
- 4 sections, 9 lessons
- Preview lessons: Arrays, Linked Lists, Binary Trees, Graph BFS

---

## Expected Output

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

---

## Files Modified/Created

### Modified:
- `prisma/seedAllContent.ts` - Updated with new content structure

### Created:
- `prisma/addVideoUrlColumn.sql` - Step 1 SQL
- `prisma/seedCourseContent.sql` - Step 2 SQL (direct seeding)
- `prisma/SEED_INSTRUCTIONS.md` - Detailed guide
- `prisma/QUICK_START.md` - This file

---

## Need Help?

See `prisma/SEED_INSTRUCTIONS.md` for detailed instructions and troubleshooting.
