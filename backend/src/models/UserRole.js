import mongoose from 'mongoose';

const userRoleSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    roleId: {
      type: String,
      ref: 'Role',
      required: true,
    },
    instituteId: {
      type: String,
      ref: 'Institute',
      required: false,
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

userRoleSchema.index({ userId: 1 });
userRoleSchema.index({ roleId: 1 });
userRoleSchema.index({ userId: 1, roleId: 1 }, { unique: true });

export default mongoose.model('UserRole', userRoleSchema);
