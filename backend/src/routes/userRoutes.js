import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignRole,
  removeRole,
  getPendingApprovals,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import {
  authorizeRoles,
  authorizeInstituteAdmin,
  validateInstitute,
} from '../middleware/authorization.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'),
  getUsers
);
router.get(
  '/:userId',
  authenticate,
  getUserById
);
router.patch(
  '/:userId',
  authenticate,
  updateUser
);
router.delete(
  '/:userId',
  authenticate,
  authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'),
  deleteUser
);
router.post(
  '/:userId/roles',
  authenticate,
  authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'),
  assignRole
);
router.delete(
  '/:userId/roles',
  authenticate,
  authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'),
  removeRole
);
router.get(
  '/approvals/pending',
  authenticate,
  authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'),
  getPendingApprovals
);

export default router;
