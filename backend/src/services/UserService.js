import User from '../models/User.js';
import UserRole from '../models/UserRole.js';
import Role from '../models/Role.js';
import Approval from '../models/Approval.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { generateId, paginationHelper, buildPaginatedResponse } from '../utils/helpers.js';

export class UserService {
  async getUsers(instituteId, page, limit, filters = {}) {
    try {
      const { skip, limit: pageLimit } = paginationHelper(page, limit);

      const query = {
        instituteId,
        isDeleted: false,
        ...filters,
      };

      const users = await User.find(query)
        .skip(skip)
        .limit(pageLimit)
        .select('-passwordHash')
        .lean();

      const total = await User.countDocuments(query);

      // Enrich users with roles
      const usersWithRoles = await Promise.all(
        users.map(async (user) => {
          const userRoles = await UserRole.find({ userId: user._id })
            .populate('roleId', 'roleName')
            .lean();
          return {
            ...user,
            roles: userRoles.map((ur) => ur.roleId.roleName),
          };
        })
      );

      return buildPaginatedResponse(usersWithRoles, total, page, pageLimit);
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-passwordHash').lean();

      if (!user || user.isDeleted) {
        throw new NotFoundError('User not found');
      }

      const userRoles = await UserRole.find({ userId })
        .populate('roleId', 'roleName')
        .lean();

      return {
        ...user,
        roles: userRoles.map((ur) => ur.roleId.roleName),
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { ...updateData, updatedBy: updateData.updatedBy },
        { new: true, runValidators: true }
      )
        .select('-passwordHash')
        .lean();

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isDeleted: true },
        { new: true }
      ).lean();

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return { message: 'User deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async assignRole(userId, roleId, instituteId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const role = await Role.findById(roleId);
      if (!role) {
        throw new NotFoundError('Role not found');
      }

      const existingUserRole = await UserRole.findOne({ userId, roleId });
      if (existingUserRole) {
        return { message: 'User already has this role' };
      }

      const userRole = new UserRole({
        _id: generateId(),
        userId,
        roleId,
        instituteId,
      });

      await userRole.save();
      return userRole.toObject();
    } catch (error) {
      throw error;
    }
  }

  async removeRole(userId, roleId) {
    try {
      const result = await UserRole.findOneAndDelete({
        userId,
        roleId,
      });

      if (!result) {
        throw new NotFoundError('UserRole not found');
      }

      return { message: 'Role removed successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getUserApprovals(instituteId, page, limit) {
    try {
      const { skip, limit: pageLimit } = paginationHelper(page, limit);

      const query = { instituteId, status: 'PENDING' };
      const approvals = await Approval.find(query)
        .skip(skip)
        .limit(pageLimit)
        .populate('userId', 'firstName lastName email mobileNo')
        .lean();

      const total = await Approval.countDocuments(query);

      return buildPaginatedResponse(approvals, total, page, pageLimit);
    } catch (error) {
      throw error;
    }
  }

  async getPendingApprovals(instituteId) {
    try {
      const approvals = await Approval.find({
        instituteId,
        status: 'PENDING',
      })
        .populate('userId', 'firstName lastName email')
        .lean();

      return approvals;
    } catch (error) {
      throw error;
    }
  }
}
