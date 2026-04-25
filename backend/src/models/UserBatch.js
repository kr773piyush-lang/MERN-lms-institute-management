import mongoose from 'mongoose';

const userBatchSchema = new mongoose.Schema(
  {

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
    batchId: {
      type: String,
      ref: 'Batch',
      required: true,
    },
    roleInBatch: {
      type: String,
      enum: ['STUDENT', 'TEACHER'],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

userBatchSchema.index({ userId: 1 });
userBatchSchema.index({ batchId: 1 });
userBatchSchema.index({ instituteId: 1 });
userBatchSchema.index({ userId: 1, batchId: 1 }, { unique: true });

export default mongoose.model('UserBatch', userBatchSchema);
