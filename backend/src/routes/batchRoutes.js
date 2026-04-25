import express from 'express';
import {
  createBatch,
  getBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  assignUserToBatch,
  removeUserFromBatch,
  getBatchMembers,
} from '../controllers/batchController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/authorization.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'), createBatch);
router.get('/', authenticate, getBatches);
router.get('/:batchId', authenticate, getBatchById);
router.patch('/:batchId', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'), updateBatch);
router.delete('/:batchId', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'), deleteBatch);
router.post('/:batchId/assign', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'), assignUserToBatch);
router.delete('/:batchId/users/:userId', authenticate, authorizeRoles('INSTITUTE_ADMIN', 'SUPER_ADMIN'), removeUserFromBatch);
router.get('/:batchId/members', authenticate, getBatchMembers);

export default router;
