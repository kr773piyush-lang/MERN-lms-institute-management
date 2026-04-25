import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
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
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      required: true,
    },
    entityId: {
      type: String,
      required: true,
    },
    changes: mongoose.Schema.Types.Mixed,
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
    _id: false,
  }
);

activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ instituteId: 1 });
activityLogSchema.index({ createdAt: 1 });

export default mongoose.model('ActivityLog', activityLogSchema);
