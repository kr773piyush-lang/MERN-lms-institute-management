import Batch from '../models/Batch.js';
import UserBatch from '../models/UserBatch.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors.js';
import { generateId, paginationHelper, buildPaginatedResponse } from '../utils/helpers.js';

export class BatchService {
  async createBatch(batchData, instituteId, createdBy) {
    try {
      const batch = new Batch({
        _id: generateId(),
        instituteId,
        courseId: batchData.courseId,
        subCourseId: batchData.subCourseId,
        batchName: batchData.batchName,
        description: batchData.description,
        startDate: batchData.startDate,
        endDate: batchData.endDate,
        capacity: batchData.capacity,
        schedule: batchData.schedule,
        createdBy,
      });

      await batch.save();
      return batch.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getBatches(instituteId, page, limit) {
    try {
      const { skip, limit: pageLimit } = paginationHelper(page, limit);

      const batches = await Batch.find({
        instituteId,
        isDeleted: false,
      })
        .skip(skip)
        .limit(pageLimit)
        .lean();

      const total = await Batch.countDocuments({
        instituteId,
        isDeleted: false,
      });

      return buildPaginatedResponse(batches, total, page, pageLimit);
    } catch (error) {
      throw error;
    }
  }

  async getBatchById(batchId) {
    try {
      const batch = await Batch.findById(batchId).lean();

      if (!batch || batch.isDeleted) {
        throw new NotFoundError('Batch not found');
      }

      // Get batch members
      const members = await UserBatch.find({
        batchId,
      })
        .populate('userId', 'firstName lastName email')
        .lean();

      return { ...batch, members };
    } catch (error) {
      throw error;
    }
  }

  async updateBatch(batchId, updateData) {
    try {
      const batch = await Batch.findByIdAndUpdate(
        batchId,
        updateData,
        { new: true }
      ).lean();

      if (!batch) {
        throw new NotFoundError('Batch not found');
      }

      return batch;
    } catch (error) {
      throw error;
    }
  }

  async deleteBatch(batchId) {
    try {
      const batch = await Batch.findByIdAndUpdate(
        batchId,
        { isDeleted: true },
        { new: true }
      ).lean();

      if (!batch) {
        throw new NotFoundError('Batch not found');
      }

      return { message: 'Batch deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async assignUserToBatch(batchId, userId, roleInBatch, instituteId) {
    try {
      const batch = await Batch.findById(batchId);
      if (!batch) {
        throw new NotFoundError('Batch not found');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Check if already assigned
      const existing = await UserBatch.findOne({ batchId, userId });
      if (existing) {
        throw new ConflictError('User already assigned to this batch');
      }

      const userBatch = new UserBatch({
        _id: generateId(),
        instituteId,
        userId,
        batchId,
        roleInBatch,
      });

      await userBatch.save();

      // Send notification
      await Notification.create({
        _id: generateId(),
        userId,
        instituteId,
        title: 'Batch Assignment',
        message: `You have been assigned to batch: ${batch.batchName}`,
        type: 'INFO',
        relatedEntityType: 'Batch',
        relatedEntityId: batchId,
      });

      return userBatch.toObject();
    } catch (error) {
      throw error;
    }
  }

  async removeUserFromBatch(batchId, userId) {
    try {
      const result = await UserBatch.findOneAndDelete({
        batchId,
        userId,
      });

      if (!result) {
        throw new NotFoundError('User not found in batch');
      }

      return { message: 'User removed from batch' };
    } catch (error) {
      throw error;
    }
  }

  async getBatchMembers(batchId, page, limit) {
    try {
      const { skip, limit: pageLimit } = paginationHelper(page, limit);

      const members = await UserBatch.find({ batchId })
        .skip(skip)
        .limit(pageLimit)
        .populate('userId', 'firstName lastName email')
        .lean();

      const total = await UserBatch.countDocuments({ batchId });

      return buildPaginatedResponse(members, total, page, pageLimit);
    } catch (error) {
      throw error;
    }
  }
}
