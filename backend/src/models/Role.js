import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {

    roleName: {
      type: String,
      enum: ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'TEACHER', 'STUDENT'],
      required: true,
      unique: true,
    },
    scope: {
      type: String,
      enum: ['GLOBAL', 'INSTITUTE'],
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    permissions: [String],
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

// roleSchema.index({ roleName: 1 });

export default mongoose.model('Role', roleSchema);
