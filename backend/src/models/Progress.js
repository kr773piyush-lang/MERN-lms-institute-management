import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => crypto.randomUUID(),
    },
    instituteId: {
      type: String,
      ref: 'Institute',
      required: true,
    },
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    moduleId: {
      type: String,
      ref: 'Module',
      required: true,
    },
    contentId: {
      type: String,
      ref: 'Content',
      required: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    watchedDuration: {
      type: Number, // in seconds
      required: false,
    },
    totalDuration: {
      type: Number, // in seconds
      required: false,
    },
    lastAccessedAt: {
      type: Date,
      required: false,
    },
    completedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

progressSchema.index({ userId: 1 });
progressSchema.index({ moduleId: 1 });
progressSchema.index({ instituteId: 1 });
progressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);
