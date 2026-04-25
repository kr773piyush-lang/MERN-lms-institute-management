import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
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
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

sessionSchema.index({ userId: 1 });
// sessionSchema.index({ refreshToken: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export default mongoose.model('Session', sessionSchema);
