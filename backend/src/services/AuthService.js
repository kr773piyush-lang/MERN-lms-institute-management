import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../models/User.js';
import UserRole from '../models/UserRole.js';
import Session from '../models/Session.js';
import Approval from '../models/Approval.js';
import Role from '../models/Role.js';
import Institute from '../models/Institute.js';
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../utils/errors.js';
import { generateId } from '../utils/helpers.js';

export class AuthService {
  async register(registerData, instituteId) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        email: registerData.email,
        instituteId,
      });

      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      // Create new user with STUDENT role by default
      const userId = generateId();
      const user = new User({
        _id: userId,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        mobileNo: registerData.mobileNo,
        passwordHash: registerData.password,
        instituteId,
        isApproved: false,
      });

      await user.save();

      // Assign STUDENT role
      const studentRole = await Role.findOne({ roleName: 'STUDENT' });
      if (!studentRole) {
        throw new NotFoundError('STUDENT role not found');
      }

      await UserRole.create({
        _id: generateId(),
        userId,
        roleId: studentRole._id,
        instituteId,
      });

      // Create approval record
      await Approval.create({
        _id: generateId(),
        userId,
        instituteId,
        status: 'PENDING',
      });

      return { user: user.toJSON(), message: 'Registration successful. Awaiting approval.' };
    } catch (error) {
      throw error;
    }
  }

  async login(email, password, instituteId) {
    try {
      const user = await User.findOne({
        email,
        instituteId,
        isDeleted: false,
      });

      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      if (!user.isApproved) {
        throw new UnauthorizedError('Account pending approval');
      }

      if (!user.active) {
        throw new UnauthorizedError('Account is inactive');
      }

      if (user.isLocked) {
        throw new UnauthorizedError('Account is locked');
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        user.failedAttempts += 1;
        if (user.failedAttempts >= 5) {
          user.isLocked = true;
          user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
        }
        await user.save();
        throw new UnauthorizedError('Invalid email or password');
      }

      // Reset failed attempts
      user.failedAttempts = 0;
      user.isLocked = false;
      user.lastLogin = new Date();
      await user.save();

      // Get user roles
      const userRoles = await UserRole.find({ userId: user._id })
        .populate('roleId', 'roleName')
        .lean();
      const roles = userRoles.map((ur) => ur.roleId.roleName);

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user._id, email: user.email, roles, instituteId },
        config.jwt.secret,
        { expiresIn: config.jwt.expire }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpire }
      );

      // Save session
      await Session.create({
        _id: generateId(),
        userId: user._id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return {
        user: user.toJSON(),
        accessToken,
        refreshToken,
        roles,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

      const session = await Session.findOne({ refreshToken });
      if (!session || !session.active) {
        throw new UnauthorizedError('Invalid session');
      }

      if (session.expiresAt < new Date()) {
        throw new UnauthorizedError('Refresh token expired');
      }

      const user = await User.findById(decoded.userId);
      if (!user || user.isDeleted || !user.active) {
        throw new UnauthorizedError('User not valid');
      }

      // Get user roles
      const userRoles = await UserRole.find({ userId: user._id })
        .populate('roleId', 'roleName')
        .lean();
      const roles = userRoles.map((ur) => ur.roleId.roleName);

      // Generate new access token
      const newAccessToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          roles,
          instituteId: user.instituteId,
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expire }
      );

      return {
        accessToken: newAccessToken,
        refreshToken,
        roles,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(userId) {
    try {
      await Session.updateMany({ userId }, { active: false });
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw error;
    }
  }
}
