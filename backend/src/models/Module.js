import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => require('uuid').v4(),
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
    instituteId: {
      type: String,
      ref: 'Institute',
      required: true,
    },
    moduleName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    sequenceNo: {
      type: Number,
      required: false,
    },
    duration: {
      type: Number, // in minutes
      required: false,
    },
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

moduleSchema.index({ courseId: 1 });
moduleSchema.index({ subCourseId: 1 });
moduleSchema.index({ instituteId: 1 });
moduleSchema.index({ isDeleted: 1 });

export default mongoose.model('Module', moduleSchema);
