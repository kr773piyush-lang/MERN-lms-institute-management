import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
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
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    mobileNo: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      required: false,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    lockedUntil: {
      type: Date,
      required: false,
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

// Index for unique email + instituteId
userSchema.index({ email: 1, instituteId: 1 }, { unique: true });
userSchema.index({ instituteId: 1 });
userSchema.index({ isDeleted: 1 });
userSchema.index({ isApproved: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.passwordHash = await bcryptjs.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcryptjs.compare(candidatePassword, this.passwordHash);
};

// Method to hide sensitive fields
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.failedAttempts;
  delete user.isLocked;
  delete user.__v;
  return user;
};

export default mongoose.model('User', userSchema);
