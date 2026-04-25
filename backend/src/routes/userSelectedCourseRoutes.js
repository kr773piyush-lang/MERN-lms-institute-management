import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles, validateInstitute } from '../middleware/authorization.js';
import * as userSelectedCourseController from '../controllers/userSelectedCourseController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * Select course for user
 * POST /selected-courses/:userId/select
 */
router.post(
  '/:userId/select',
  authorizeRoles('STUDENT', 'INSTITUTE_ADMIN'),
  validateInstitute,
  userSelectedCourseController.selectCourse
);

/**
 * Get user's selected courses
 * GET /selected-courses/:userId
 */
router.get(
  '/:userId',
  authorizeRoles('STUDENT', 'INSTITUTE_ADMIN', 'TEACHER'),
  userSelectedCourseController.getSelectedCourses
);

/**
 * Get user's favorite courses
 * GET /selected-courses/:userId/favorites
 */
router.get(
  '/:userId/favorites',
  authorizeRoles('STUDENT', 'INSTITUTE_ADMIN'),
  userSelectedCourseController.getFavoriteCourses
);

/**
 * Toggle favorite course
 * PATCH /selected-courses/:selectionId/favorite
 */
router.patch(
  '/:selectionId/favorite',
  authorizeRoles('STUDENT'),
  userSelectedCourseController.toggleFavorite
);

/**
 * Update selection status
 * PATCH /selected-courses/:selectionId/status
 */
router.patch(
  '/:selectionId/status',
  authorizeRoles('STUDENT', 'INSTITUTE_ADMIN'),
  userSelectedCourseController.updateSelectionStatus
);

/**
 * Update selection priority
 * PATCH /selected-courses/:selectionId/priority
 */
router.patch(
  '/:selectionId/priority',
  authorizeRoles('STUDENT'),
  userSelectedCourseController.updatePriority
);

/**
 * Remove course selection
 * DELETE /selected-courses/:selectionId
 */
router.delete(
  '/:selectionId',
  authorizeRoles('STUDENT', 'INSTITUTE_ADMIN'),
  userSelectedCourseController.removeSelection
);

/**
 * Get course selection statistics
 * GET /selected-courses/stats/:courseId
 */
router.get(
  '/stats/:courseId',
  authorizeRoles('INSTITUTE_ADMIN', 'TEACHER'),
  validateInstitute,
  userSelectedCourseController.getCourseSelectionStats
);

export default router;
