# Complete API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /auth/register`

**Description:** Register a new user (default role: STUDENT, status: PENDING)

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password@123",
  "mobileNo": "9876543210"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Awaiting approval.",
  "data": {
    "_id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "mobileNo": "9876543210",
    "isApproved": false,
    "active": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 2. Login
**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and get tokens

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password@123",
  "instituteId": "institute-uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "roles": ["STUDENT"]
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `401 Unauthorized` - Account pending approval
- `401 Unauthorized` - Account is locked (5 failed attempts)

---

### 3. Refresh Token
**Endpoint:** `POST /auth/refresh`

**Description:** Get new access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

---

### 4. Logout
**Endpoint:** `POST /auth/logout`

**Auth Required:** Yes (Bearer Token)

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Get Current User
**Endpoint:** `GET /auth/me`

**Auth Required:** Yes (Bearer Token)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "instituteId": "institute-uuid",
    "roles": ["STUDENT"]
  }
}
```

---

## Institute Management Endpoints

### 1. Create Institute
**Endpoint:** `POST /institutes`

**Auth Required:** Yes (SUPER_ADMIN only)

**Request Body:**
```json
{
  "name": "ABC Educational Institute",
  "email": "admin@abcedu.com",
  "mobileNo": "9876543210",
  "country": "India",
  "state": "Maharashtra",
  "city": "Mumbai",
  "pincode": "400001",
  "address": "123 Main Street"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Institute created successfully",
  "data": {
    "_id": "uuid",
    "name": "ABC Educational Institute",
    "email": "admin@abcedu.com",
    /* ... other fields ... */
  }
}
```

---

### 2. Get All Institutes
**Endpoint:** `GET /institutes?page=1&limit=10`

**Auth Required:** Yes

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [ /* array of institutes */ ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### 3. Get Institute by ID
**Endpoint:** `GET /institutes/:instituteId`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": { /* institute object */ }
}
```

---

### 4. Update Institute
**Endpoint:** `PATCH /institutes/:instituteId`

**Auth Required:** Yes (INSTITUTE_ADMIN or SUPER_ADMIN)

**Request Body:**
```json
{
  "name": "Updated Institute Name",
  "mobileNo": "9876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Institute updated successfully",
  "data": { /* updated institute */ }
}
```

---

### 5. Delete Institute
**Endpoint:** `DELETE /institutes/:instituteId`

**Auth Required:** Yes (SUPER_ADMIN only)

**Response (200):**
```json
{
  "success": true,
  "message": "Institute deleted successfully"
}
```

---

### 6. Get Institute Statistics
**Endpoint:** `GET /institutes/:instituteId/stats`

**Auth Required:** Yes (INSTITUTE_ADMIN or SUPER_ADMIN)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "approvedUsers": 145,
    "pendingApprovals": 5
  }
}
```

---

## User Management Endpoints

### 1. Get All Users
**Endpoint:** `GET /users?page=1&limit=10&isApproved=true&active=true`

**Auth Required:** Yes (INSTITUTE_ADMIN or SUPER_ADMIN)

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `isApproved`: Filter by approval status
- `active`: Filter by active status

**Response (200):**
```json
{
  "success": true,
  "data": [ /* users with roles */ ],
  "pagination": { /* pagination object */ }
}
```

---

### 2. Get User by ID
**Endpoint:** `GET /users/:userId`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "roles": ["STUDENT"]
  }
}
```

---

### 3. Update User
**Endpoint:** `PATCH /users/:userId`

**Auth Required:** Yes

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "mobileNo": "9876543210",
  "profileImage": "https://example.com/image.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { /* updated user */ }
}
```

---

### 4. Delete User (Soft Delete)
**Endpoint:** `DELETE /users/:userId`

**Auth Required:** Yes (INSTITUTE_ADMIN or SUPER_ADMIN)

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### 5. Assign Role to User
**Endpoint:** `POST /users/:userId/roles`

**Auth Required:** Yes (INSTITUTE_ADMIN or SUPER_ADMIN)

**Request Body:**
```json
{
  "roleId": "TEACHER"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Role assigned successfully",
  "data": { /* user role object */ }
}
```

---

### 6. Remove Role from User
**Endpoint:** `DELETE /users/:userId/roles`

**Auth Required:** Yes (INSTITUTE_ADMIN or SUPER_ADMIN)

**Request Body:**
```json
{
  "roleId": "TEACHER"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Role removed successfully"
}
```

---

## Approval Workflow Endpoints

### 1. Get Pending Approvals
**Endpoint:** `GET /approvals/pending?page=1&limit=10`

**Auth Required:** Yes (INSTITUTE_ADMIN or SUPER_ADMIN)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "uuid",
      "userId": { /* user object */ },
      "status": "PENDING",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { /* pagination */ }
}
```

---

### 2. Approve User
**Endpoint:** `POST /approvals/:approvalId/approve`

**Auth Required:** Yes (INSTITUTE_ADMIN or SUPER_ADMIN)

**Request Body:**
```json
{
  "remarks": "User approved"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User approved successfully",
  "data": { /* approval object with status: APPROVED */ }
}
```

---

### 3. Reject User
**Endpoint:** `POST /approvals/:approvalId/reject`

**Auth Required:** Yes (INSTITUTE_ADMIN or SUPER_ADMIN)

**Request Body:**
```json
{
  "rejectionReason": "Incomplete information provided"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User rejected successfully",
  "data": { /* approval object with status: REJECTED */ }
}
```

---

### 4. Check Approval Status
**Endpoint:** `GET /approvals/:userId/status`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "uuid",
    "userId": "uuid",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Course Management Endpoints

### 1. Create Course
**Endpoint:** `POST /courses`

**Auth Required:** Yes (TEACHER, INSTITUTE_ADMIN, SUPER_ADMIN)

**Request Body:**
```json
{
  "courseName": "Introduction to Python",
  "description": "Learn Python basics",
  "duration": 40,
  "level": "BEGINNER"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": { /* course object */ }
}
```

---

### 2. Get All Courses
**Endpoint:** `GET /courses?page=1&limit=10`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": [ /* courses */ ],
  "pagination": { /* pagination */ }
}
```

---

### 3. Create SubCourse
**Endpoint:** `POST /courses/:courseId/subcourses`

**Auth Required:** Yes (TEACHER, INSTITUTE_ADMIN, SUPER_ADMIN)

**Request Body:**
```json
{
  "subCourseName": "Variables and Data Types",
  "description": "Learn about variables",
  "sequenceNo": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "SubCourse created successfully",
  "data": { /* subcourse object */ }
}
```

---

### 4. Create Module
**Endpoint:** `POST /courses/modules`

**Auth Required:** Yes (TEACHER, INSTITUTE_ADMIN, SUPER_ADMIN)

**Request Body:**
```json
{
  "courseId": "course-uuid",
  "subCourseId": "subcourse-uuid",
  "moduleName": "String Variables",
  "description": "Understanding strings",
  "sequenceNo": 1,
  "duration": 30
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Module created successfully",
  "data": { /* module object */ }
}
```

---

### 5. Create Content
**Endpoint:** `POST /courses/content`

**Auth Required:** Yes (TEACHER, INSTITUTE_ADMIN, SUPER_ADMIN)

**Request Body:**
```json
{
  "moduleId": "module-uuid",
  "title": "String Basics Video",
  "description": "Video tutorial on strings",
  "contentType": "VIDEO",
  "url": "https://example.com/video.mp4",
  "fileSize": 104857600,
  "duration": 15,
  "orderIndex": 1,
  "isPreview": false
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Content created successfully",
  "data": { /* content object */ }
}
```

---

## Batch Management Endpoints

### 1. Create Batch
**Endpoint:** `POST /batches`

**Auth Required:** Yes (INSTITUTE_ADMIN, SUPER_ADMIN)

**Request Body:**
```json
{
  "courseId": "course-uuid",
  "subCourseId": "subcourse-uuid",
  "batchName": "Batch-2024-January",
  "description": "January 2024 batch",
  "startDate": "2024-01-15",
  "endDate": "2024-03-15",
  "capacity": 50,
  "schedule": {
    "days": ["Monday", "Wednesday", "Friday"],
    "time": "10:00-11:00"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Batch created successfully",
  "data": { /* batch object */ }
}
```

---

### 2. Assign User to Batch
**Endpoint:** `POST /batches/:batchId/assign`

**Auth Required:** Yes (INSTITUTE_ADMIN, SUPER_ADMIN)

**Request Body:**
```json
{
  "userId": "user-uuid",
  "roleInBatch": "STUDENT"
}
```

**Note:** `roleInBatch` can be "STUDENT" or "TEACHER"

**Response (201):**
```json
{
  "success": true,
  "message": "User assigned to batch successfully",
  "data": { /* user batch object */ }
}
```

---

### 3. Get Batch Members
**Endpoint:** `GET /batches/:batchId/members?page=1&limit=10`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": [ /* batch members */ ],
  "pagination": { /* pagination */ }
}
```

---

## Enrollment Endpoints

### 1. Enroll Student
**Endpoint:** `POST /enrollments`

**Auth Required:** Yes (INSTITUTE_ADMIN, SUPER_ADMIN)

**Request Body:**
```json
{
  "userId": "user-uuid",
  "courseId": "course-uuid",
  "subCourseId": "subcourse-uuid",
  "batchId": "batch-uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Student enrolled successfully",
  "data": {
    "_id": "uuid",
    "userId": "user-uuid",
    "courseId": "course-uuid",
    "enrollmentStatus": "ENROLLED",
    "completionPercentage": 0
  }
}
```

---

### 2. Get All Enrollments
**Endpoint:** `GET /enrollments?page=1&limit=10&enrollmentStatus=ENROLLED`

**Auth Required:** Yes (INSTITUTE_ADMIN, SUPER_ADMIN)

**Response (200):**
```json
{
  "success": true,
  "data": [ /* enrollments */ ],
  "pagination": { /* pagination */ }
}
```

---

### 3. Get Student Enrollments
**Endpoint:** `GET /enrollments/student/:userId`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "uuid",
      "courseId": { /* course */ },
      "enrollmentStatus": "ENROLLED",
      "completionPercentage": 45
    }
  ]
}
```

---

### 4. Update Enrollment Status
**Endpoint:** `PATCH /enrollments/:enrollmentId/status`

**Auth Required:** Yes (INSTITUTE_ADMIN, SUPER_ADMIN)

**Request Body:**
```json
{
  "enrollmentStatus": "COMPLETED"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Enrollment status updated",
  "data": { /* updated enrollment */ }
}
```

---

### 5. Issue Certificate
**Endpoint:** `POST /enrollments/:enrollmentId/certificate`

**Auth Required:** Yes (INSTITUTE_ADMIN, SUPER_ADMIN)

**Request Body:**
```json
{
  "certificateUrl": "https://example.com/certificates/cert-123.pdf"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Certificate issued",
  "data": { /* enrollment with certificate */ }
}
```

---

## Progress Tracking Endpoints

### 1. Update Progress
**Endpoint:** `POST /progress/:userId/update`

**Auth Required:** Yes

**Request Body:**
```json
{
  "moduleId": "module-uuid",
  "contentId": "content-uuid",
  "isCompleted": false,
  "progressPercentage": 50,
  "watchedDuration": 450
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Progress updated successfully",
  "data": { /* progress object */ }
}
```

---

### 2. Get Student Progress
**Endpoint:** `GET /progress/:userId`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalModules": 5,
    "completedModules": 2,
    "averageProgress": 40,
    "modules": [ /* progress per module */ ]
  }
}
```

---

### 3. Get Course Progress
**Endpoint:** `GET /progress/:userId/course/:courseId`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "courseId": "course-uuid",
    "totalModules": 5,
    "completedModules": 2,
    "averageProgress": 40
  }
}
```

---

### 4. Get Batch Progress
**Endpoint:** `GET /progress/batch/:batchId`

**Auth Required:** Yes (TEACHER, INSTITUTE_ADMIN, SUPER_ADMIN)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "userId": "user-uuid",
      "totalModules": 5,
      "completedModules": 3,
      "averageProgress": 60
    }
  ]
}
```

---

## Notification Endpoints

### 1. Get Notifications
**Endpoint:** `GET /notifications?page=1&limit=10`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "uuid",
      "title": "Course Enrollment",
      "message": "You have been enrolled in Python Basics",
      "type": "INFO",
      "isRead": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { /* pagination */ }
}
```

---

### 2. Get Unread Count
**Endpoint:** `GET /notifications/unread/count`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

---

### 3. Mark Notification as Read
**Endpoint:** `PATCH /notifications/:notificationId/read`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": { /* updated notification */ }
}
```

---

### 4. Mark All Notifications as Read
**Endpoint:** `PATCH /notifications/mark-all/read`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token or user not authenticated"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Required roles: TEACHER"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Resource already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Authentication

All authenticated endpoints require an `Authorization` header with a Bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Pagination

Endpoints that support pagination use these parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response includes pagination metadata:
```json
{
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```
