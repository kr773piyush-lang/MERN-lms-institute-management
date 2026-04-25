import mongoose from 'mongoose';

const contentProfileSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      primary: true,
    },
    contentId: {
      type: String,
      ref: 'Content',
      required: true,
      unique: true,
    },
    instituteId: {
      type: String,
      ref: 'Institute',
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['VIDEO', 'PDF', 'QUIZ', 'ASSIGNMENT', 'LIVE_SESSION', 'DOCUMENT', 'INTERACTIVE'],
      required: true,
    },
    bodyText: {
      type: String,
      required: false,
    },
    instructions: {
      type: String,
      required: false,
    },
    downloadable: {
      type: Boolean,
      default: false,
    },
    responseType: {
      type: String,
      enum: ['TEXT', 'URL', 'FILE', 'MULTIPLE_CHOICE', 'NONE'],
      required: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

contentProfileSchema.index({ contentId: 1 });
contentProfileSchema.index({ instituteId: 1 });

export default mongoose.model('ContentProfile', contentProfileSchema);
