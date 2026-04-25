import Approval from '../models/Approval.js';
import User from '../models/User.js';
import UserRole from '../models/UserRole.js';
import Role from '../models/Role.js';
import Notification from '../models/Notification.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { generateId } from '../utils/helpers.js';

export class ApprovalService {
  async getPendingApprovals(instituteId, page, limit) {
    try {
      const skip = (page - 1) * limit;
      const approvals = await Approval.find({
        instituteId,
        status: 'PENDING',
      })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'firstName lastName email mobileNo')
        .lean();

      const total = await Approval.countDocuments({
        instituteId,
        status: 'PENDING',
      });

      return { approvals, total, page, limit, pages: Math.ceil(total / limit) };
    } catch (error) {
      throw error;
    }
  }

  async approveUser(approvalId, approvedBy, remarks) {
    try {
      const approval = await Approval.findById(approvalId);

      if (!approval) {
        throw new NotFoundError('Approval not found');
      }

      if (approval.status !== 'PENDING') {
        throw new ValidationError('Approval already processed');
      }

      // Update user
      const user = await User.findByIdAndUpdate(
        approval.userId,
        { isApproved: true },
        { new: true }
      );

      // Update approval
      approval.status = 'APPROVED';
      approval.approvedBy = approvedBy;
      approval.remarks = remarks;
      await approval.save();

      // Send notification
      await Notification.create({
        _id: generateId(),
        userId: approval.userId,
        instituteId: approval.instituteId,
        title: 'Account Approved',
        message: 'Your account has been approved. You can now login.',
        type: 'SUCCESS',
        relatedEntityType: 'User',
        relatedEntityId: approval.userId,
      });

      return approval.toObject();
    } catch (error) {
      throw error;
    }
  }

  async rejectUser(approvalId, rejectedBy, rejectionReason) {
    try {
      const approval = await Approval.findById(approvalId);

      if (!approval) {
        throw new NotFoundError('Approval not found');
      }

      if (approval.status !== 'PENDING') {
        throw new ValidationError('Approval already processed');
      }

      // Update user
      const user = await User.findByIdAndUpdate(
        approval.userId,
        { active: false },
        { new: true }
      );

      // Update approval
      approval.status = 'REJECTED';
      approval.approvedBy = rejectedBy;
      approval.rejectionReason = rejectionReason;
      await approval.save();

      // Send notification
      await Notification.create({
        _id: generateId(),
        userId: approval.userId,
        instituteId: approval.instituteId,
        title: 'Account Rejected',
        message: `Your account has been rejected. Reason: ${rejectionReason}`,
        type: 'ERROR',
        relatedEntityType: 'User',
        relatedEntityId: approval.userId,
      });

      return approval.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getApprovalStatus(userId) {
    try {
      const approval = await Approval.findOne({ userId }).lean();

      if (!approval) {
        throw new NotFoundError('Approval record not found');
      }

      return approval;
    } catch (error) {
      throw error;
    }
  }
}
