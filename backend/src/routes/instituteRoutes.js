import express from 'express';
import {
  createInstitute,
  getInstitutes,
  getInstituteById,
  updateInstitute,
  deleteInstitute,
  getInstituteStats,
} from '../controllers/instituteController.js';
import {
  authenticate,
} from '../middleware/auth.js';
import {
  authorizeSuperAdmin,
  authorizeInstituteAdmin,
  validateInstitute,
} from '../middleware/authorization.js';

const router = express.Router();

router.post('/', authenticate, authorizeSuperAdmin, createInstitute);
router.get('/', authenticate, getInstitutes);
router.get('/:instituteId', authenticate, validateInstitute, getInstituteById);
router.patch('/:instituteId', authenticate, authorizeInstituteAdmin, validateInstitute, updateInstitute);
router.delete('/:instituteId', authenticate, authorizeSuperAdmin, deleteInstitute);
router.get('/:instituteId/stats', authenticate, authorizeInstituteAdmin, getInstituteStats);

export default router;
