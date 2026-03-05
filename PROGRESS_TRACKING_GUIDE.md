# 📊 Progress Tracking API - Complete Guide

## Overview

Enhanced progress tracking system with lesson-level completion tracking and resume functionality.

---

## 🗄️ Database Schema

### user_progress Table

```sql
CREATE TABLE user_progress (
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
```

### Indexes
```sql
CREATE INDEX idx_user_progress_user_subject ON user_progress(user_id, subject_id);
CREATE INDEX idx_user_progress_last_lesson ON user_progress(last_lesson_id);
```

### Auto-update Trigger
```sql
CREATE TRIGGER trg_update_progress_timestamp
BEFORE UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION update_progress_timestamp();
```

---

## 🚀 API Endpoints

### 1. GET /api/progress/subject/:subjectId

**Purpose:** Fetch user's progress for a specific subject (used by resume feature)

**Headers:**
```
Authorization: Bearer <token>
```

**Params:**
- `subjectId` (UUID)

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "subjectId": "abc-123",
    "lastLessonId": "lesson-5-id",
    "completedVideoIds": ["lesson-1-id", "lesson-2-id"],
    "progressPercent": 38,
    "totalLessons": 13,
    "completedLessons": 5
  }
}
```

**Response (Not Found):**
```json
{
  "success": true,
  "data": null
}
```

---

### 2. POST /api/progress/mark-complete

**Purpose:** Mark a lesson as complete and update progress

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subjectId": "abc-123",
  "lessonId": "lesson-5-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subjectId": "abc-123",
    "lessonId": "lesson-5-id",
    "progressPercent": 46,
    "completedVideoIds": ["lesson-1-id", "lesson-2-id", "lesson-5-id"]
  }
}
```

---

### 3. PUT /api/progress/last-lesson

**Purpose:** Update the last watched lesson without marking complete

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subjectId": "abc-123",
  "lessonId": "lesson-5-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subjectId": "abc-123",
    "lastLessonId": "lesson-5-id"
  }
}
```

---

## 💻 Frontend Integration

### On Course Page Load (Fetch Initial Progress)

```javascript
import { useEffect, useState } from 'react';

function CoursePage({ subjectId }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    async function loadProgress() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/progress/subject/${subjectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (data.data) {
          setProgress(data.data);
          
          // Show "Resume" banner if there's progress
          if (data.data.lastLessonId) {
            showResumeBanner(data.data.lastLessonId);
          }
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
    
    loadProgress();
  }, [subjectId]);

  return (
    <div>
      {progress && (
        <div className="progress-banner">
          <p>Progress: {progress.progressPercent}%</p>
          <p>Completed: {progress.completedLessons}/{progress.totalLessons}</p>
          {progress.lastLessonId && (
            <button onClick={() => resumeLesson(progress.lastLessonId)}>
              Resume from Last Lesson
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### When User Clicks "Mark as Complete"

```javascript
async function markLessonComplete(subjectId, lessonId) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/progress/mark-complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        subjectId,
        lessonId
      })
    });

    const data = await res.json();
    
    if (data.success) {
      // Update UI with new progress
      setProgress({
        progressPercent: data.data.progressPercent,
        completedVideoIds: data.data.completedVideoIds,
        completedLessons: data.data.completedVideoIds.length
      });
      
      // Show success message
      toast.success('Lesson marked as complete!');
    }
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    toast.error('Failed to mark lesson as complete');
  }
}
```

---

### When Video Starts Playing (Update Last Lesson)

```javascript
function VideoPlayer({ subjectId, lessonId }) {
  const videoRef = useRef(null);

  const handleVideoPlay = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Update last watched without marking complete
      await fetch('/api/progress/last-lesson', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subjectId,
          lessonId
        })
      });
    } catch (error) {
      console.error('Error updating last lesson:', error);
    }
  };

  return (
    <video 
      ref={videoRef}
      onPlay={handleVideoPlay}
      // ... other props
    />
  );
}
```

---

### Complete Example Component

```javascript
import { useEffect, useState } from 'react';

function CourseTracker({ subjectId }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, [subjectId]);

  async function loadProgress() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/progress/subject/${subjectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.data) {
        setProgress(data.data);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkComplete(lessonId) {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/progress/mark-complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ subjectId, lessonId })
    });
    
    const data = await res.json();
    if (data.success) {
      setProgress(prev => ({
        ...prev,
        progressPercent: data.data.progressPercent,
        completedVideoIds: data.data.completedVideoIds,
        completedLessons: data.data.completedVideoIds.length
      }));
    }
  }

  async function handleUpdateLastLesson(lessonId) {
    const token = localStorage.getItem('token');
    await fetch('/api/progress/last-lesson', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ subjectId, lessonId })
    });
  }

  if (loading) return <div>Loading progress...</div>;
  if (!progress) return <div>No progress yet. Start learning!</div>;

  return (
    <div className="course-tracker">
      <h3>Your Progress</h3>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress.progressPercent}%` }}
        />
        <span>{progress.progressPercent}%</span>
      </div>

      <p>
        {progress.completedLessons} of {progress.totalLessons} lessons completed
      </p>

      {progress.lastLessonId && (
        <button onClick={() => handleUpdateLastLesson(progress.lastLessonId)}>
          Resume from Last Lesson
        </button>
      )}

      <div className="completed-lessons">
        <h4>Completed Lessons:</h4>
        <ul>
          {progress.completedVideoIds.map(lessonId => (
            <li key={lessonId}>{lessonId}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

---

## 🔧 Setup Instructions

### Step 1: Run Database Migration

Open Neon SQL Editor and run:

```bash
# From backend directory
psql $DATABASE_URL -f prisma/migrations/add_user_progress_table.sql
```

Or copy-paste the contents of `prisma/migrations/add_user_progress_table.sql` into Neon Console.

### Step 2: Verify Tables Created

```sql
SELECT 
  table_name, 
  column_name, 
  data_type
FROM information_schema.columns
WHERE table_name = 'user_progress'
ORDER BY ordinal_position;
```

### Step 3: Test Endpoints

```bash
# Get subject progress
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/progress/subject/SUBJECT_ID

# Mark lesson complete
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subjectId":"SUBJECT_ID","lessonId":"LESSON_ID"}' \
  http://localhost:3000/api/progress/mark-complete

# Update last lesson
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subjectId":"SUBJECT_ID","lessonId":"LESSON_ID"}' \
  http://localhost:3000/api/progress/last-lesson
```

---

## 🎯 When to Call Each Endpoint

| User Action | Endpoint | Purpose |
|-------------|----------|---------|
| Opens course page | `GET /api/progress/subject/:id` | Load initial progress |
| Completes lesson | `POST /api/progress/mark-complete` | Mark as done & update % |
| Starts watching video | `PUT /api/progress/last-lesson` | Set resume point |
| Checks progress bar | `GET /api/progress/subject/:id` | Refresh data |

---

## 🔒 Security Considerations

✅ All endpoints require authentication (`requireAuth` middleware)  
✅ User can only access their own progress (`WHERE user_id = req.user.id`)  
✅ Input validation on lessonId and subjectId  
✅ SQL injection prevention (parameterized queries)  
✅ Rate limiting recommended on write operations  

---

## 📊 Response Format Standard

All responses follow this format:

```json
{
  "success": boolean,
  "data": object | null,
  "message": string (optional)
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🧪 Testing Checklist

- [ ] GET `/api/progress/subject/:id` returns correct progress
- [ ] POST `/api/progress/mark-complete` updates progress correctly
- [ ] PUT `/api/progress/last-lesson` updates without marking complete
- [ ] Progress calculates percentage correctly
- [ ] Completed lessons array doesn't have duplicates
- [ ] Authentication required for all endpoints
- [ ] Returns null for non-existent progress (not 404)
- [ ] Handles concurrent updates safely
- [ ] Database trigger updates `updated_at` automatically

---

## 📈 Optional Enhancements

### A. Track Watch Time

```sql
ALTER TABLE user_progress 
ADD COLUMN video_watch_history JSONB DEFAULT '{}';
-- Stores: { "lesson-id": { watchedSeconds: 120, totalSeconds: 300 } }
```

### B. Add Soft Deletes

```sql
ALTER TABLE user_progress 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
```

### C. Batch Update Endpoint

```javascript
// POST /api/progress/batch-update
// Update multiple lessons at once
```

---

## 🐛 Troubleshooting

### Issue: "relation user_progress does not exist"
**Solution:** Run the migration SQL script in Neon Console

### Issue: "duplicate key value violates unique constraint"
**Solution:** This is expected - use UPDATE or ON CONFLICT clause

### Issue: Progress not updating
**Solution:** Check database trigger is working, verify userId is correct

### Issue: Null response instead of progress data
**Solution:** This means no progress record exists yet - normal behavior

---

## ✅ Summary

Your LMS now has:
- ✅ Subject-level progress tracking
- ✅ Lesson completion tracking
- ✅ Resume functionality (last lesson watched)
- ✅ Progress percentage calculation
- ✅ Duplicate prevention
- ✅ Automatic timestamp updates
- ✅ Secure, authenticated endpoints
- ✅ TypeScript type safety

**Backend Stack:** Node.js + Express + PostgreSQL  
**Authentication:** JWT Bearer tokens  
**Response Format:** JSON API standard
