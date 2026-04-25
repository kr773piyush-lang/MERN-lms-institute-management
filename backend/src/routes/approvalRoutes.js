import express from 'express';
import {
  getPendingApprovals,
  approveUser,
  rejectUser,
  getApprovalStatus,
} from '../controllers/approvalController.js';
import { authenticate } from '../middleware/auth.js';
import {
  authorizeRoles,
  validateInstitute,
} from '../middleware/authorization.js';

const router = express.Router();

router.get(
  '/pending',
  authenticate,
  authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'),
  getPendingApprovals
);
router.post(
  '/:approvalId/approve',
  authenticate,
  authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'),
  approveUser
);
router.post(
  '/:approvalId/reject',
  authenticate,
  authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'),
  rejectUser
);
router.get(
  '/:userId/status',
  authenticate,
  getApprovalStatus
);

export default router;
