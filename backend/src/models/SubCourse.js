import mongoose from 'mongoose';

const subCourseSchema = new mongoose.Schema(
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
    instituteId: {
      type: String,
      ref: 'Institute',
      required: true,
    },
    subCourseName: {
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

subCourseSchema.index({ courseId: 1 });
subCourseSchema.index({ instituteId: 1 });
subCourseSchema.index({ isDeleted: 1 });

export default mongoose.model('SubCourse', subCourseSchema);
