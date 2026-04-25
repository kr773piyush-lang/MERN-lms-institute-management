import { NotificationService } from '../services/NotificationService.js';
import { catchAsync } from '../utils/errors.js';

const notificationService = new NotificationService();

export const getNotifications = catchAsync(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const result = await notificationService.getNotifications(
    req.user.userId,
    page,
    limit
  );

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getUnreadCount = catchAsync(async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user.userId);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(
    req.params.notificationId
  );

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});

export const markAllAsRead = catchAsync(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.userId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const deleteNotification = catchAsync(async (req, res) => {
  const result = await notificationService.deleteNotification(
    req.params.notificationId
  );

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
