# MERN LMS Backend - Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── config.js           # Configuration management
│   │   └── database.js         # MongoDB connection
│   ├── models/                 # Mongoose schemas
│   │   ├── Role.js
│   │   ├── User.js
│   │   ├── UserRole.js
│   │   ├── Institute.js
│   │   ├── Session.js
│   │   ├── Approval.js
│   │   ├── Course.js
│   │   ├── SubCourse.js
│   │   ├── Module.js
│   │   ├── Content.js
│   │   ├── Batch.js
│   │   ├── UserBatch.js
│   │   ├── Enrollment.js
│   │   ├── Progress.js
│   │   ├── Notification.js
│   │   └── ActivityLog.js
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   ├── authorization.js    # RBAC authorization
│   │   ├── errorHandler.js     # Global error handling
│   │   └── activityLogger.js   # Activity logging
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── instituteController.js
│   │   ├── userController.js
│   │   ├── approvalController.js
│   │   ├── courseController.js
│   │   ├── batchController.js
│   │   ├── enrollmentController.js
│   │   ├── progressController.js
│   │   └── notificationController.js
│   ├── services/
│   │   ├── AuthService.js
│   │   ├── InstituteService.js
│   │   ├── UserService.js
│   │   ├── ApprovalService.js
│   │   ├── CourseService.js
│   │   ├── BatchService.js
│   │   ├── EnrollmentService.js
│   │   ├── ProgressService.js
│   │   └── NotificationService.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── instituteRoutes.js
│   │   ├── userRoutes.js
│   │   ├── approvalRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── batchRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── progressRoutes.js
│   │   └── notificationRoutes.js
│   ├── validations/
│   │   ├── authValidation.js
│   │   ├── instituteValidation.js
│   │   ├── courseValidation.js
│   │   ├── batchValidation.js
│   │   ├── approvalValidation.js
│   │   └── enrollmentValidation.js
│   ├── utils/
│   │   ├── logger.js           # Logging utility
│   │   ├── errors.js           # Custom error classes
│   │   └── helpers.js          # Helper functions
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
├── .env.example                # Environment variables example
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Setup

1. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

2. Update MongoDB URI and JWT secrets in `.env`

3. Start development server:
   ```bash
   npm run dev
   ```

   Or start production server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user (default: STUDENT role, status: PENDING)
- `POST /api/auth/login` - User login (requires approval)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Institutes (SUPER_ADMIN only)
- `POST /api/institutes` - Create institute
- `GET /api/institutes` - List institutes
- `GET /api/institutes/:id` - Get institute
- `PATCH /api/institutes/:id` - Update institute
- `DELETE /api/institutes/:id` - Delete institute
- `GET /api/institutes/:id/stats` - Get statistics

### Users
- `GET /api/users` - List users (INSTITUTE_ADMIN/SUPER_ADMIN)
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (soft delete)
- `POST /api/users/:id/roles` - Assign role
- `DELETE /api/users/:id/roles` - Remove role
- `GET /api/users/approvals/pending` - Get pending approvals

### Approvals
- `GET /api/approvals/pending` - Get pending user approvals
- `POST /api/approvals/:id/approve` - Approve user
- `POST /api/approvals/:id/reject` - Reject user
- `GET /api/approvals/:userId/status` - Check approval status

### Courses
- `POST /api/courses` - Create course
- `GET /api/courses` - List courses
- `GET /api/courses/:id` - Get course
- `PATCH /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/subcourses` - Create subcourse
- `GET /api/courses/:id/subcourses` - List subcourses
- `POST /api/courses/modules` - Create module
- `GET /api/courses/modules/:id` - Get module
- `POST /api/courses/content` - Create content
- `GET /api/courses/content/module/:id` - Get module content

### Batches
- `POST /api/batches` - Create batch
- `GET /api/batches` - List batches
- `GET /api/batches/:id` - Get batch
- `PATCH /api/batches/:id` - Update batch
- `DELETE /api/batches/:id` - Delete batch
- `POST /api/batches/:id/assign` - Assign user to batch
- `DELETE /api/batches/:id/users/:userId` - Remove user from batch
- `GET /api/batches/:id/members` - Get batch members

### Enrollments
- `POST /api/enrollments` - Enroll student
- `GET /api/enrollments` - List enrollments
- `GET /api/enrollments/student/:id` - Get student enrollments
- `PATCH /api/enrollments/:id/status` - Update enrollment status
- `GET /api/enrollments/stats` - Get statistics
- `POST /api/enrollments/:id/certificate` - Issue certificate

### Progress
- `POST /api/progress/:userId/update` - Update progress
- `GET /api/progress/:userId` - Get student progress
- `GET /api/progress/:userId/module/:moduleId` - Get module progress
- `GET /api/progress/:userId/course/:courseId` - Get course progress
- `GET /api/progress/batch/:batchId` - Get batch progress

### Notifications
- `GET /api/notifications` - List notifications
- `GET /api/notifications/unread/count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/mark-all/read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Key Features

✅ Multi-tenant architecture  
✅ Role-based access control (RBAC)  
✅ JWT authentication with refresh tokens  
✅ User approval workflow  
✅ Course hierarchy (Course → SubCourse → Module → Content)  
✅ Batch management with student/teacher assignment  
✅ Progress tracking and analytics  
✅ Enrollment system  
✅ Certificate management  
✅ Notification system  
✅ Activity logging  
✅ Soft delete support  
✅ Comprehensive error handling  
✅ Request validation  
✅ Pagination support  

## Security

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control
- Account lockout after failed attempts
- Session management
- CORS protection
- Helmet security headers
- Input validation

## Error Handling

The API uses custom error classes:
- `AppError` - Base error
- `ValidationError` - 400
- `UnauthorizedError` - 401
- `ForbiddenError` - 403
- `NotFoundError` - 404
- `ConflictError` - 409
- `InternalServerError` - 500

## Testing

```bash
npm run test
npm run test:watch
```

## Linting

```bash
npm run lint
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure all environment variables
3. Use production MongoDB URI
4. Set strong JWT secrets
5. Enable CORS for frontend domain
6. Use reverse proxy (nginx)
7. Enable HTTPS
8. Monitor logs and errors
