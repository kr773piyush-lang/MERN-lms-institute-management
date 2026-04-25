import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/config.js';
import Logger from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { activityLogger } from './middleware/activityLogger.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import instituteRoutes from './routes/instituteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import batchRoutes from './routes/batchRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import studentSubmissionRoutes from './routes/studentSubmissionRoutes.js';
import userSelectedCourseRoutes from './routes/userSelectedCourseRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

const logger = new Logger('App');
const app = express();

// Middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(activityLogger);

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Multi-Tenant LMS API',
    });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Version
app.get('/api/version', (req, res) => {
  res.status(200).json({
    success: true,
    version: '1.0.0',
    api: 'Multi-Tenant LMS API',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/submissions', studentSubmissionRoutes);
app.use('/api/selected-courses', userSelectedCourseRoutes);

app.use('/api/public', publicRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

logger.info('Express app configured successfully');

export default app;
