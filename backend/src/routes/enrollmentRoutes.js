import express from 'express';
import {
  enrollStudent,
  getEnrollments,
  getStudentEnrollments,
  updateEnrollmentStatus,
  getEnrollmentStats,
  issueCertificate,
} from '../controllers/enrollmentController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/authorization.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'), enrollStudent);
router.get('/', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'), getEnrollments);
router.get('/student/:userId', authenticate, getStudentEnrollments);
router.patch('/:enrollmentId/status', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'), updateEnrollmentStatus);
router.get('/stats', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'), getEnrollmentStats);
router.post('/:enrollmentId/certificate', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'), issueCertificate);

export default router;
