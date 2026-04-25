# Quick Start Guide

## Prerequisites

- Node.js v14 or higher
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Environment
NODE_ENV=development
PORT=5000

# Database - Use MongoDB Atlas or Local MongoDB
MONGODB_URI=mongodb://localhost:27017/lms_db
DB_NAME=lms_db

# JWT Secrets - Change these in production!
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=15m
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_change_this
REFRESH_TOKEN_EXPIRE=7d

# URLs
API_BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# MongoDB should be running as a service
```

**Option B: MongoDB Atlas (Cloud)**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get connection string and update `MONGODB_URI` in `.env`

### 4. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

Check server status:
```
GET http://localhost:5000/health
```

---

## API Workflow Example

### Step 1: Create Super Admin (via Database)

Since there's no default super admin, you need to create one:

```javascript
// Use MongoDB Compass or CLI
// Create in Users collection
{
  "_id": "manually-generated-uuid",
  "firstName": "Admin",
  "lastName": "Super",
  "email": "superadmin@example.com",
  "passwordHash": "hashed-password-bcrypt",
  "isApproved": true,
  "active": true,
  "instituteId": "default"
}

// Create in UserRoles collection
{
  "_id": "uuid",
  "userId": "admin-user-id",
  "roleId": "SUPER_ADMIN"
}
```

Or use this code snippet in Node.js:

```javascript
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const salt = await bcryptjs.genSalt(10);
const hashedPassword = await bcryptjs.hash('your-password-here', salt);

const userId = uuidv4();
console.log(`User ID: ${userId}`);
console.log(`Hashed Password: ${hashedPassword}`);

// Then insert manually into MongoDB
```

### Step 2: Login as Super Admin

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "superadmin@example.com",
  "password": "your-password-here",
  "instituteId": "default"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "roles": ["SUPER_ADMIN"]
  }
}
```

### Step 3: Create an Institute

```bash
POST http://localhost:5000/api/institutes
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

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

### Step 4: Create an Institute Admin User

First, register the user:

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "Institute",
  "lastName": "Admin",
  "email": "institutead@abcedu.com",
  "password": "password@123",
  "mobileNo": "9876543211",
  "instituteId": "<INSTITUTE_UUID>"
}
```

Then approve via Super Admin:

```bash
# Get pending approvals
GET http://localhost:5000/api/approvals/pending
Authorization: Bearer <SUPER_ADMIN_TOKEN>

# Approve user
POST http://localhost:5000/api/approvals/<APPROVAL_ID>/approve
Authorization: Bearer <SUPER_ADMIN_TOKEN>
Content-Type: application/json

{
  "remarks": "Approved"
}
```

Then assign INSTITUTE_ADMIN role:

```bash
POST http://localhost:5000/api/users/<USER_ID>/roles
Authorization: Bearer <SUPER_ADMIN_TOKEN>
Content-Type: application/json

{
  "roleId": "INSTITUTE_ADMIN"
}
```

### Step 5: Register a Student

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password@123",
  "mobileNo": "9876543212",
  "instituteId": "<INSTITUTE_UUID>"
}
```

### Step 6: Approve Student

Institute admin approves student:

```bash
GET http://localhost:5000/api/approvals/pending
Authorization: Bearer <INSTITUTE_ADMIN_TOKEN>

POST http://localhost:5000/api/approvals/<APPROVAL_ID>/approve
Authorization: Bearer <INSTITUTE_ADMIN_TOKEN>
Content-Type: application/json

{
  "remarks": "Student approved"
}
```

### Step 7: Create Course

```bash
POST http://localhost:5000/api/courses
Authorization: Bearer <TEACHER_TOKEN>
Content-Type: application/json

{
  "courseName": "Python Programming",
  "description": "Learn Python from scratch",
  "duration": 40,
  "level": "BEGINNER"
}
```

### Step 8: Create SubCourse and Modules

```bash
# Create SubCourse
POST http://localhost:5000/api/courses/<COURSE_ID>/subcourses
Authorization: Bearer <TEACHER_TOKEN>

{
  "subCourseName": "Python Basics",
  "description": "Fundamentals of Python",
  "sequenceNo": 1
}

# Create Module
POST http://localhost:5000/api/courses/modules
Authorization: Bearer <TEACHER_TOKEN>

{
  "courseId": "<COURSE_ID>",
  "subCourseId": "<SUBCOURSE_ID>",
  "moduleName": "Introduction",
  "description": "Get started with Python",
  "sequenceNo": 1,
  "duration": 60
}

# Create Content
POST http://localhost:5000/api/courses/content
Authorization: Bearer <TEACHER_TOKEN>

{
  "moduleId": "<MODULE_ID>",
  "title": "Python Intro Video",
  "contentType": "VIDEO",
  "url": "https://example.com/video.mp4",
  "duration": 15,
  "orderIndex": 1
}
```

### Step 9: Create Batch

```bash
POST http://localhost:5000/api/batches
Authorization: Bearer <INSTITUTE_ADMIN_TOKEN>

{
  "courseId": "<COURSE_ID>",
  "subCourseId": "<SUBCOURSE_ID>",
  "batchName": "Batch-January-2024",
  "description": "January batch",
  "startDate": "2024-01-15",
  "endDate": "2024-03-15",
  "capacity": 50
}
```

### Step 10: Assign Users to Batch

```bash
POST http://localhost:5000/api/batches/<BATCH_ID>/assign
Authorization: Bearer <INSTITUTE_ADMIN_TOKEN>

{
  "userId": "<STUDENT_USER_ID>",
  "roleInBatch": "STUDENT"
}
```

### Step 11: Enroll Student

```bash
POST http://localhost:5000/api/enrollments
Authorization: Bearer <INSTITUTE_ADMIN_TOKEN>

{
  "userId": "<STUDENT_USER_ID>",
  "courseId": "<COURSE_ID>",
  "subCourseId": "<SUBCOURSE_ID>",
  "batchId": "<BATCH_ID>"
}
```

### Step 12: Track Progress

Student updates progress:

```bash
POST http://localhost:5000/api/progress/<STUDENT_USER_ID>/update
Authorization: Bearer <STUDENT_TOKEN>

{
  "moduleId": "<MODULE_ID>",
  "progressPercentage": 50,
  "watchedDuration": 450
}
```

Get student progress:

```bash
GET http://localhost:5000/api/progress/<STUDENT_USER_ID>
Authorization: Bearer <STUDENT_TOKEN>
```

---

## Testing with Postman/Insomnia

1. Import the API_DOCUMENTATION.md into Postman
2. Set variables:
   - `baseUrl`: http://localhost:5000
   - `accessToken`: Token from login response
   - `instituteId`: Institute UUID
   - etc.

---

## Common Issues

### 1. "Cannot find module 'express'"
```bash
npm install
```

### 2. "MongoDB connection failed"
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For Atlas: ensure IP is whitelisted

### 3. "EADDRINUSE - Port 5000 already in use"
```bash
# Kill process on port 5000
# macOS/Linux
lsof -ti :5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### 4. "Invalid token" error
- Token might be expired, use refresh token to get new one
- Ensure token is in Authorization header as "Bearer <TOKEN>"

### 5. "Account pending approval"
- User must be approved by INSTITUTE_ADMIN before login
- Check approval status and approve from admin panel

---

## Useful Commands

```bash
# Development
npm run dev          # Start with nodemon (hot reload)

# Production
npm start            # Start server

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode

# Linting
npm run lint         # Lint code

# View logs
tail -f logs/app.log
```

---

## Next Steps

1. Create frontend application
2. Connect frontend to backend API
3. Implement UI for all workflows
4. Setup deployment (Heroku, AWS, DigitalOcean, etc.)
5. Configure production environment
6. Setup SSL certificates
7. Configure CI/CD pipeline

---

## Production Checklist

- [ ] Change all JWT secrets
- [ ] Set NODE_ENV=production
- [ ] Use production MongoDB connection
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Setup environment-specific .env
- [ ] Enable monitoring and logging
- [ ] Setup backup strategy
- [ ] Configure rate limiting
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Test all workflows
- [ ] Setup CI/CD pipeline
- [ ] Configure reverse proxy (nginx)
- [ ] Setup SSL certificates
- [ ] Enable security headers
- [ ] Setup firewall rules

