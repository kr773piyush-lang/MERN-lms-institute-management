import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      primary: true,
    },
    defaultInstituteId: {
      type: String,
      ref: 'Institute',
      required: false,
    },
    allowMultiTenant: {
      type: Boolean,
      default: true,
    },
    maxUsers: {
      type: Number,
      required: false,
    },
    maxInstitutes: {
      type: Number,
      required: false,
    },
    allowPublicRegistration: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceMessage: {
      type: String,
      required: false,
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

export default mongoose.model('SystemSetting', systemSettingSchema);
