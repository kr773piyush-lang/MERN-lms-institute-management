import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles, validateInstitute } from '../middleware/authorization.js';
import * as studentSubmissionController from '../controllers/studentSubmissionController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * Submit assignment
 * POST /submissions/submit
 */
router.post(
  '/submit',
  authorizeRoles('STUDENT'),
  studentSubmissionController.submitAssignment
);

/**
 * Get submissions by content
 * GET /submissions/content/:contentId
 */
router.get(
  '/content/:contentId',
  authorizeRoles('TEACHER', 'INSTITUTE_ADMIN'),
  validateInstitute,
  studentSubmissionController.getSubmissionsByContent
);

/**
 * Get student's submissions
 * GET /submissions/student/:userId
 */
router.get(
  '/student/:userId',
  studentSubmissionController.getStudentSubmissions
);

/**
 * Get pending grading submissions
 * GET /submissions/pending
 */
router.get(
  '/pending',
  authorizeRoles('TEACHER', 'INSTITUTE_ADMIN'),
  studentSubmissionController.getPendingGradingSubmissions
);

/**
 * Get submission details
 * GET /submissions/:submissionId
 */
router.get(
  '/:submissionId',
  studentSubmissionController.getSubmissionById
);

/**
 * Grade submission
 * POST /submissions/:submissionId/grade
 */
router.post(
  '/:submissionId/grade',
  authorizeRoles('TEACHER', 'INSTITUTE_ADMIN'),
  validateInstitute,
  studentSubmissionController.gradeSubmission
);

/**
 * Delete submission
 * DELETE /submissions/:submissionId
 */
router.delete(
  '/:submissionId',
  authorizeRoles('TEACHER', 'INSTITUTE_ADMIN', 'SUPER_ADMIN'),
  studentSubmissionController.deleteSubmission
);

export default router;
