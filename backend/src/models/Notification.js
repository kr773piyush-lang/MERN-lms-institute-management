import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => require('uuid').v4(),
    },
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    instituteId: {
      type: String,
      ref: 'Institute',
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['INFO', 'WARNING', 'SUCCESS', 'ERROR', 'APPROVAL'],
      default: 'INFO',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      required: false,
    },
    relatedEntityType: {
      type: String,
      required: false,
    },
    relatedEntityId: {
      type: String,
      required: false,
    },
    actionUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

notificationSchema.index({ userId: 1 });
notificationSchema.index({ isRead: 1 });

export default mongoose.model('Notification', notificationSchema);
