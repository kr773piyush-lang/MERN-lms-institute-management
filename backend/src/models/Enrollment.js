import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => require('uuid').v4(),
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
    courseId: {
      type: String,
      ref: 'Course',
      required: true,
    },
    subCourseId: {
      type: String,
      ref: 'SubCourse',
      required: true,
    },
    batchId: {
      type: String,
      ref: 'Batch',
      required: false,
    },
    enrollmentStatus: {
      type: String,
      enum: ['ENROLLED', 'COMPLETED', 'DROPPED', 'PENDING'],
      default: 'ENROLLED',
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateUrl: {
      type: String,
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

enrollmentSchema.index({ userId: 1 });
enrollmentSchema.index({ courseId: 1 });
enrollmentSchema.index({ instituteId: 1 });
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
