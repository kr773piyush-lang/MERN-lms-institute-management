import mongoose from 'mongoose';

const studentSubmissionSchema = new mongoose.Schema(
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
    contentId: {
      type: String,
      ref: 'Content',
      required: true,
    },
    userId: {
      type: String,
      ref: 'User',
      required: true,
      index: true,
    },
    responseType: {
      type: String,
      enum: ['TEXT', 'URL', 'FILE'],
      required: true,
    },
    responseText: {
      type: String,
      required: false,
    },
    responseUrl: {
      type: String,
      required: false,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    feedback: {
      type: String,
      required: false,
    },
    score: {
      type: Number,
      required: false,
      min: 0,
    },
    gradedBy: {
      type: String,
      ref: 'User',
      required: false,
    },
    gradedAt: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER_REVIEW', 'GRADED', 'RETURNED'],
      default: 'SUBMITTED',
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

studentSubmissionSchema.index({ userId: 1, contentId: 1 });
studentSubmissionSchema.index({ instituteId: 1 });
studentSubmissionSchema.index({ contentId: 1 });
studentSubmissionSchema.index({ submittedAt: -1 });

export default mongoose.model('StudentSubmission', studentSubmissionSchema);
