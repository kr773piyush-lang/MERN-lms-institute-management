import Institute from '../models/Institute.js';
import User from '../models/User.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { generateId, paginationHelper, buildPaginatedResponse } from '../utils/helpers.js';

export class InstituteService {
  async createInstitute(instituteData, createdBy) {
    try {
      // Check if email already exists
      const existingInstitute = await Institute.findOne({
        email: instituteData.email,
      });

      if (existingInstitute) {
        throw new ConflictError('Institute with this email already exists');
      }

      const institute = new Institute({
        _id: generateId(),
        name: instituteData.name,
        email: instituteData.email,
        mobileNo: instituteData.mobileNo,
        country: instituteData.country,
        state: instituteData.state,
        city: instituteData.city,
        pincode: instituteData.pincode,
        address: instituteData.address,
        createdBy,
      });

      await institute.save();
      return institute.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getInstitutes(page, limit, filters = {}) {
    try {
      const { skip, limit: pageLimit } = paginationHelper(page, limit);

      const query = { isDeleted: false, ...filters };
      const institutes = await Institute.find(query)
        .skip(skip)
        .limit(pageLimit)
        .lean();

      const total = await Institute.countDocuments(query);

      return buildPaginatedResponse(institutes, total, page, pageLimit);
    } catch (error) {
      throw error;
    }
  }

  async getInstituteById(instituteId) {
    try {
      const institute = await Institute.findById(instituteId).lean();

      if (!institute || institute.isDeleted) {
        throw new NotFoundError('Institute not found');
      }

      return institute;
    } catch (error) {
      throw error;
    }
  }

  async updateInstitute(instituteId, updateData, updatedBy) {
    try {
      // Check if email already exists (if being updated)
      if (updateData.email) {
        const existingInstitute = await Institute.findOne({
          email: updateData.email,
          _id: { $ne: instituteId },
        });

        if (existingInstitute) {
          throw new ConflictError('Email already in use by another institute');
        }
      }

      const institute = await Institute.findByIdAndUpdate(
        instituteId,
        { ...updateData, updatedBy },
        { new: true, runValidators: true }
      ).lean();

      if (!institute) {
        throw new NotFoundError('Institute not found');
      }

      return institute;
    } catch (error) {
      throw error;
    }
  }

  async deleteInstitute(instituteId) {
    try {
      const institute = await Institute.findByIdAndUpdate(
        instituteId,
        { isDeleted: true },
        { new: true }
      ).lean();

      if (!institute) {
        throw new NotFoundError('Institute not found');
      }

      return { message: 'Institute deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getInstituteStats(instituteId) {
    try {
      const totalUsers = await User.countDocuments({
        instituteId,
        isDeleted: false,
      });

      const approvedUsers = await User.countDocuments({
        instituteId,
        isApproved: true,
        isDeleted: false,
      });

      const pendingApprovals = await User.countDocuments({
        instituteId,
        isApproved: false,
        isDeleted: false,
      });

      return {
        totalUsers,
        approvedUsers,
        pendingApprovals,
      };
    } catch (error) {
      throw error;
    }
  }
}
