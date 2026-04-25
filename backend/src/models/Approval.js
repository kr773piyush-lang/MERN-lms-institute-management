import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => require('uuid').v4(),
    },
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    instituteId: {
      type: String,
      ref: 'Institute',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    approvedBy: {
      type: String,
      ref: 'User',
      required: false,
    },
    remarks: {
      type: String,
      required: false,
    },
    rejectionReason: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

approvalSchema.index({ userId: 1 });
approvalSchema.index({ status: 1 });
approvalSchema.index({ instituteId: 1 });

export default mongoose.model('Approval', approvalSchema);
