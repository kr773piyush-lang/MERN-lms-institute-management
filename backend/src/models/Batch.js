import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
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
    batchName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    capacity: {
      type: Number,
      required: false,
    },
    schedule: mongoose.Schema.Types.Mixed, // Stores schedule info
    active: {
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

batchSchema.index({ instituteId: 1 });
batchSchema.index({ courseId: 1 });
batchSchema.index({ isDeleted: 1 });

export default mongoose.model('Batch', batchSchema);
