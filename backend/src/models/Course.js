import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    instituteId: {
      type: String,
      ref: 'Institute',
      required: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    courseThumbnail: {
      type: String,
      required: false,
    },

    subCourses: [
      {
        type: String,
        ref: 'SubCourse',
      },
    ],

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

courseSchema.index({ instituteId: 1 });
courseSchema.index({ isDeleted: 1 });

export default mongoose.model('Course', courseSchema);
