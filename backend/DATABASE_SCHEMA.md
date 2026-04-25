# Database Schema Reference

## Collections Overview

### 1. Roles Collection
Stores available roles in the system.

```
{
  _id: String (UUID),
  roleName: String (SUPER_ADMIN | INSTITUTE_ADMIN | TEACHER | STUDENT),
  scope: String (GLOBAL | INSTITUTE),
  description: String,
  permissions: [String],
  active: Boolean,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- roleName (unique)

**Default Roles:**
- SUPER_ADMIN (GLOBAL)
- INSTITUTE_ADMIN (INSTITUTE)
- TEACHER (INSTITUTE)
- STUDENT (INSTITUTE)

---

### 2. Users Collection
Stores user account information.

```
{
  _id: String (UUID),
  instituteId: String (ref: Institute),
  firstName: String,
  lastName: String,
  email: String,
  mobileNo: String,
  profileImage: String,
  passwordHash: String (bcrypt hashed),
  isApproved: Boolean (default: false),
  active: Boolean (default: true),
  isDeleted: Boolean (default: false, soft delete),
  lastLogin: DateTime,
  failedAttempts: Number (default: 0),
  isLocked: Boolean (default: false),
  lockedUntil: DateTime,
  createdBy: String (user ID),
  updatedBy: String (user ID),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- (email, instituteId) - unique
- instituteId
- isDeleted

**Notes:**
- Account is locked after 5 failed login attempts for 30 minutes
- All users start as STUDENT with PENDING approval
- Password is automatically hashed before saving

---

### 3. UserRoles Collection
Junction table for users and their roles.

```
{
  _id: String (UUID),
  userId: String (ref: User),
  roleId: String (ref: Role),
  instituteId: String (ref: Institute),
  active: Boolean (default: true),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- userId
- roleId
- (userId, roleId) - unique

---

### 4. Institutes Collection
Stores organization information.

```
{
  _id: String (UUID),
  name: String,
  email: String (unique),
  mobileNo: String,
  adminId: String (ref: User),
  country: String,
  state: String,
  city: String,
  pincode: String,
  address: String,
  logo: String (URL),
  active: Boolean (default: true),
  isDeleted: Boolean (default: false),
  createdBy: String (user ID),
  updatedBy: String (user ID),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- email (unique)
- adminId
- isDeleted

**Notes:**
- Only SUPER_ADMIN can create institutes
- Multiple institutes supported (multi-tenant)

---

### 5. Sessions Collection
Stores user session and refresh tokens.

```
{
  _id: String (UUID),
  userId: String (ref: User),
  refreshToken: String (unique),
  expiresAt: DateTime,
  ipAddress: String,
  userAgent: String,
  active: Boolean (default: true),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- userId
- refreshToken (unique)
- expiresAt (TTL index - auto-expires after date)

**Notes:**
- Refresh token valid for 7 days
- TTL index automatically removes expired sessions

---

### 6. Approvals Collection
Tracks user registration approvals.

```
{
  _id: String (UUID),
  userId: String (ref: User),
  instituteId: String (ref: Institute),
  status: String (PENDING | APPROVED | REJECTED),
  approvedBy: String (ref: User),
  remarks: String,
  rejectionReason: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- userId
- status
- instituteId

**Workflow:**
1. User registers → status: PENDING, isApproved: false
2. Admin approves → status: APPROVED, isApproved: true
3. Admin rejects → status: REJECTED, active: false

---

### 7. Courses Collection
Stores course information.

```
{
  _id: String (UUID),
  instituteId: String (ref: Institute),
  courseName: String,
  description: String,
  courseThumbnail: String (URL),
  duration: Number (hours),
  level: String (BEGINNER | INTERMEDIATE | ADVANCED),
  active: Boolean (default: true),
  isDeleted: Boolean (default: false),
  createdBy: String (user ID),
  updatedBy: String (user ID),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- instituteId
- isDeleted

**Hierarchy:**
- Course (1) → SubCourse (many)
- SubCourse (1) → Module (many)
- Module (1) → Content (many)

---

### 8. SubCourses Collection
Stores subcourse/section information.

```
{
  _id: String (UUID),
  courseId: String (ref: Course),
  instituteId: String (ref: Institute),
  subCourseName: String,
  description: String,
  sequenceNo: Number,
  active: Boolean (default: true),
  isDeleted: Boolean (default: false),
  createdBy: String (user ID),
  updatedBy: String (user ID),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- courseId
- instituteId
- isDeleted

---

### 9. Modules Collection
Stores module/chapter information.

```
{
  _id: String (UUID),
  courseId: String (ref: Course),
  subCourseId: String (ref: SubCourse),
  instituteId: String (ref: Institute),
  moduleName: String,
  description: String,
  sequenceNo: Number,
  duration: Number (minutes),
  active: Boolean (default: true),
  isDeleted: Boolean (default: false),
  createdBy: String (user ID),
  updatedBy: String (user ID),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- courseId
- subCourseId
- instituteId
- isDeleted

---

### 10. Content Collection
Stores learning content (videos, PDFs, quizzes, etc.).

```
{
  _id: String (UUID),
  moduleId: String (ref: Module),
  instituteId: String (ref: Institute),
  title: String,
  description: String,
  contentType: String (VIDEO | PDF | QUIZ | ASSIGNMENT | LIVE_SESSION | DOCUMENT),
  url: String,
  fileSize: Number (bytes),
  duration: Number (minutes, for videos),
  orderIndex: Number,
  isPreview: Boolean (default: false),
  isPublished: Boolean (default: true),
  isDeleted: Boolean (default: false),
  createdBy: String (user ID),
  updatedBy: String (user ID),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- moduleId
- instituteId
- isDeleted

---

### 11. Batches Collection
Stores batch/class information.

```
{
  _id: String (UUID),
  instituteId: String (ref: Institute),
  courseId: String (ref: Course),
  subCourseId: String (ref: SubCourse),
  batchName: String,
  description: String,
  startDate: DateTime,
  endDate: DateTime,
  capacity: Number,
  schedule: Mixed (flexible scheduling info),
  active: Boolean (default: true),
  isDeleted: Boolean (default: false),
  createdBy: String (user ID),
  updatedBy: String (user ID),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- instituteId
- courseId
- isDeleted

**Schedule Example:**
```json
{
  "days": ["Monday", "Wednesday", "Friday"],
  "time": "10:00-11:00",
  "timezone": "IST"
}
```

---

### 12. UserBatches Collection
Junction table for users in batches (can be STUDENT or TEACHER).

```
{
  _id: String (UUID),
  instituteId: String (ref: Institute),
  userId: String (ref: User),
  batchId: String (ref: Batch),
  roleInBatch: String (STUDENT | TEACHER),
  active: Boolean (default: true),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- userId
- batchId
- instituteId
- (userId, batchId) - unique

---

### 13. Enrollments Collection
Stores course enrollment records.

```
{
  _id: String (UUID),
  instituteId: String (ref: Institute),
  userId: String (ref: User),
  courseId: String (ref: Course),
  subCourseId: String (ref: SubCourse),
  batchId: String (ref: Batch, optional),
  enrollmentStatus: String (ENROLLED | COMPLETED | DROPPED | PENDING),
  completionPercentage: Number (0-100),
  certificateIssued: Boolean (default: false),
  certificateUrl: String,
  completedAt: DateTime,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- userId
- courseId
- instituteId
- (userId, courseId) - unique

---

### 14. Progress Collection
Tracks user progress in modules.

```
{
  _id: String (UUID),
  instituteId: String (ref: Institute),
  userId: String (ref: User),
  moduleId: String (ref: Module),
  contentId: String (ref: Content),
  isCompleted: Boolean (default: false),
  progressPercentage: Number (0-100),
  watchedDuration: Number (seconds, for videos),
  totalDuration: Number (seconds),
  lastAccessedAt: DateTime,
  completedAt: DateTime,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- userId
- moduleId
- instituteId
- (userId, moduleId) - unique

**Automatic Updates:**
- When progress >= 100%, auto-complete
- Enrollment completion % calculated from module progress

---

### 15. Notifications Collection
Stores user notifications.

```
{
  _id: String (UUID),
  userId: String (ref: User),
  instituteId: String (ref: Institute),
  title: String,
  message: String,
  type: String (INFO | WARNING | SUCCESS | ERROR | APPROVAL),
  isRead: Boolean (default: false),
  readAt: DateTime,
  relatedEntityType: String (User | Course | Batch | etc.),
  relatedEntityId: String,
  actionUrl: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- userId
- isRead

**Auto-Triggered For:**
- User approved/rejected
- Enrolled in course
- Batch assignment
- Progress milestones
- Certificate issued

---

### 16. ActivityLogs Collection
Audit trail for all actions.

```
{
  _id: String (UUID),
  userId: String (ref: User),
  instituteId: String (ref: Institute),
  action: String (CREATE | UPDATE | DELETE | etc.),
  entityType: String (User | Course | Batch | etc.),
  entityId: String,
  changes: Mixed,
  ipAddress: String,
  userAgent: String,
  metadata: Mixed,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Indexes:**
- userId
- instituteId
- createdAt

**Example Activity:**
```json
{
  "action": "CREATE",
  "entityType": "Course",
  "entityId": "course-uuid",
  "changes": {
    "before": {},
    "after": { "courseName": "Python", "level": "BEGINNER" }
  },
  "metadata": {
    "ipAddress": "192.168.1.1",
    "endpoint": "/api/courses"
  }
}
```

---

## Multi-Tenancy Strategy

### Institute Isolation
- Every user, course, and enrollment has `instituteId`
- Queries automatically filtered by user's institute (except SUPER_ADMIN)
- Institute admins can only access their institute data

### Query Example
```javascript
// For TEACHER in Institute 123
const courses = await Course.find({
  instituteId: "institute-123",
  isDeleted: false
});

// SUPER_ADMIN sees all
const courses = await Course.find({ isDeleted: false });
```

---

## Data Integrity

### Unique Constraints
- email (global unique)
- (email, instituteId)
- (userId, roleId)
- refreshToken
- (userId, batchId)
- (userId, courseId)
- (userId, moduleId)

### Soft Delete Strategy
- No physical deletion
- `isDeleted: true` flags data as deleted
- All queries filter `isDeleted: false`
- Data recoverable if needed

### Cascading Deletes
When deleting:
- **Course** → SubCourses, Modules, Content marked as deleted
- **SubCourse** → Modules marked as deleted
- **Module** → Content marked as deleted
- **User** → User is soft-deleted (not cascaded)

---

## Indexing Strategy

### Commonly Queried
- userId (user lookups)
- instituteId (multi-tenancy)
- isDeleted (active records)
- status fields (filtering)

### Performance Optimization
- Compound indexes for multi-field queries
- TTL index for session cleanup
- Sorted queries on createdAt optimized

---

## Migration Guide (from Schema Changes)

When modifying schema:

1. Create migration file: `src/scripts/migrate-v2.js`
2. Add field with default value
3. Run migration: `npm run migrate`
4. Update all service/controller layers
5. Test thoroughly

Example:
```javascript
// Add new field to Users collection
db.users.updateMany(
  {},
  { $set: { newField: defaultValue } }
);
```

