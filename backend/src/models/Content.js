import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => require('uuid').v4(),
    },
    moduleId: {
      type: String,
      ref: 'Module',
      required: true,
    },
    instituteId: {
      type: String,
      ref: 'Institute',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    contentType: {
      type: String,
      enum: ['VIDEO', 'PDF', 'QUIZ', 'ASSIGNMENT', 'LIVE_SESSION', 'DOCUMENT'],
      required: true,
    },
    url: {
      type: String,
      required: false,
    },
    fileSize: {
      type: Number, // in bytes
      required: false,
    },
    duration: {
      type: Number, // in minutes (for videos)
      required: false,
    },
    orderIndex: {
      type: Number,
      required: false,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      required: false,
    },
    updatedBy: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

contentSchema.index({ moduleId: 1 });
contentSchema.index({ instituteId: 1 });
contentSchema.index({ isDeleted: 1 });

export default mongoose.model('Content', contentSchema);
