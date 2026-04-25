import mongoose from 'mongoose';

const instituteSchema = new mongoose.Schema(
    {
        // _id: {
        //   type: String,
        //   default: () => crypto.randomUUID(),
        // },
        name: {
            type: String,
            required: false,
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
            required: true,
        },

        adminId: {
            type: String,
            ref: 'User',
            required: true,
        },

        country: {
            type: String,
            required: false,
        },

        state: {
            type: String,
            required: false,
        },

        city: {
            type: String,
            required: false,
        },

        pincode: {
            type: String,
            required: false,
        },

        address: {
            type: String,
            required: false,
        },
        logo: {
            type: String,
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

instituteSchema.index({ email: 1 }, { unique: true });
instituteSchema.index({ adminId: 1 });
instituteSchema.index({ isDeleted: 1 });

export default mongoose.model('Institute', instituteSchema);
