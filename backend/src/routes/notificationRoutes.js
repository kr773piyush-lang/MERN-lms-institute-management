import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getNotifications);
router.get('/unread/count', authenticate, getUnreadCount);
router.patch('/:notificationId/read', authenticate, markAsRead);
router.patch('/mark-all/read', authenticate, markAllAsRead);
router.delete('/:notificationId', authenticate, deleteNotification);

export default router;
