import express from 'express';
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  createSubCourse,
  getSubCourses,
  updateSubCourse,
  createModule,
  getModules,
  getModuleById,
  updateModule,
  createContent,
  getContentByModule,
  updateContent,
  deleteContent,
} from '../controllers/courseController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles, validateInstitute } from '../middleware/authorization.js';

const router = express.Router();

// Course routes
router.post('/', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'TEACHER', 'SUPER_ADMIN'), createCourse);
router.get('/', authenticate, getCourses);
router.get('/:courseId', authenticate, getCourseById);
router.patch('/:courseId', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'TEACHER', 'SUPER_ADMIN'), updateCourse);
router.delete('/:courseId', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'), deleteCourse);

// SubCourse routes
router.post('/:courseId/subcourses', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'TEACHER', 'SUPER_ADMIN'), createSubCourse);
router.get('/:courseId/subcourses', authenticate, getSubCourses);
router.patch('/subcourses/:subCourseId', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'TEACHER', 'SUPER_ADMIN'), updateSubCourse);

// Module routes
router.post('/modules', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'TEACHER', 'SUPER_ADMIN'), createModule);
router.get('/modules/subcourse/:subCourseId', authenticate, getModules);
router.get('/modules/:moduleId', authenticate, getModuleById);
router.patch('/modules/:moduleId', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'TEACHER', 'SUPER_ADMIN'), updateModule);

// Content routes
router.post('/content', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'TEACHER', 'SUPER_ADMIN'), createContent);
router.get('/content/module/:moduleId', authenticate, getContentByModule);
router.patch('/content/:contentId', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'TEACHER', 'SUPER_ADMIN'), updateContent);
router.delete('/content/:contentId', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'), deleteContent);

export default router;
