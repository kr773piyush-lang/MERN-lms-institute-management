import express from 'express';
import {
  updateProgress,
  getModuleProgress,
  getStudentProgress,
  getCourseProgress,
  getBatchProgress,
} from '../controllers/progressController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/authorization.js';

const router = express.Router();

router.post('/:userId/update', authenticate, updateProgress);
router.get('/:userId/module/:moduleId', authenticate, getModuleProgress);
router.get('/:userId', authenticate, getStudentProgress);
router.get('/:userId/course/:courseId', authenticate, getCourseProgress);
router.get('/batch/:batchId', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'TEACHER', 'SUPER_ADMIN'), getBatchProgress);

export default router;
