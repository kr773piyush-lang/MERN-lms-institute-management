import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/database.js';
import config from './config/config.js';
import Logger from './utils/logger.js';
import Role from './models/Role.js';
import { generateId } from './utils/helpers.js';

dotenv.config();

const logger = new Logger('Server');

const startServer = async () => {
  try {
    // Connect to database
    logger.info('Connecting to MongoDB...');
    await connectDB();
    logger.info('✅ MongoDB connected successfully');

    // Initialize default roles
    await initializeRoles();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
      logger.info(`Environment: ${config.env}`);
      logger.info(`API Base URL: ${config.apiBaseUrl}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

const initializeRoles = async () => {
  try {
    const roles = [
      {
        _id: 'SUPER_ADMIN',
        roleName: 'SUPER_ADMIN',
        scope: 'GLOBAL',
        description: 'Global admin with full access',
        permissions: ['*'],
        active: true,
      },
      {
        _id: 'INSTITUTE_ADMIN',
        roleName: 'INSTITUTE_ADMIN',
        scope: 'INSTITUTE',
        description: 'Institute admin with institute-level access',
        permissions: ['manage_institute', 'manage_users', 'manage_courses', 'manage_batches'],
        active: true,
      },
      {
        _id: 'TEACHER',
        roleName: 'TEACHER',
        scope: 'INSTITUTE',
        description: 'Teacher with course and student management',
        permissions: ['manage_courses', 'manage_content', 'view_progress', 'create_batches'],
        active: true,
      },
      {
        _id: 'STUDENT',
        roleName: 'STUDENT',
        scope: 'INSTITUTE',
        description: 'Student with learning access',
        permissions: ['view_courses', 'view_content', 'view_progress', 'submit_assignments'],
        active: true,
      },
    ];

    for (const role of roles) {
      const existingRole = await Role.findById(role._id);
      if (!existingRole) {
        await Role.create(role);
        logger.info(`✅ Role created: ${role.roleName}`);
      }
    }
  } catch (error) {
    logger.warn(`Role initialization: ${error.message}`);
  }
};

startServer();
