import Notification from '../models/Notification.js';
import { paginationHelper, buildPaginatedResponse } from '../utils/helpers.js';

export class NotificationService {
  async getNotifications(userId, page, limit) {
    try {
      const { skip, limit: pageLimit } = paginationHelper(page, limit);

      const notifications = await Notification.find({ userId })
        .skip(skip)
        .limit(pageLimit)
        .sort({ createdAt: -1 })
        .lean();

      const total = await Notification.countDocuments({ userId });

      return buildPaginatedResponse(notifications, total, page, pageLimit);
    } catch (error) {
      throw error;
    }
  }

  async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({
        userId,
        isRead: false,
      });

      return { unreadCount: count };
    } catch (error) {
      throw error;
    }
  }

  async markAsRead(notificationId) {
    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true, readAt: new Date() },
        { new: true }
      ).lean();

      return notification;
    } catch (error) {
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      return { message: 'All notifications marked as read' };
    } catch (error) {
      throw error;
    }
  }

  async deleteNotification(notificationId) {
    try {
      await Notification.findByIdAndDelete(notificationId);
      return { message: 'Notification deleted' };
    } catch (error) {
      throw error;
    }
  }
}
