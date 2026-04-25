import mongoose from 'mongoose';

const userSelectedCourseSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      primary: true,
    },
    instituteId: {
      type: String,
      ref: 'Institute',
      required: true,
      index: true,
    },
    userId: {
      type: String,
      ref: 'User',
      required: true,
      index: true,
    },
    courseId: {
      type: String,
      ref: 'Course',
      required: true,
    },
    subCourseId: {
      type: String,
      ref: 'SubCourse',
      required: false,
    },
    batchId: {
      type: String,
      ref: 'Batch',
      required: false,
    },
    selectionType: {
      type: String,
      enum: ['SELF_SELECTED', 'ASSIGNED', 'RECOMMENDED'],
      default: 'SELF_SELECTED',
    },
    priority: {
      type: Number,
      default: 0,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      required: false,
    },
    completedAt: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DROPPED'],
      default: 'PENDING',
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

userSelectedCourseSchema.index({ userId: 1, courseId: 1 }, { unique: true });
userSelectedCourseSchema.index({ userId: 1, isFavorite: 1 });
userSelectedCourseSchema.index({ instituteId: 1 });

export default mongoose.model('UserSelectedCourse', userSelectedCourseSchema);
