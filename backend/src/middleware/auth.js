import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { UnauthorizedError } from '../utils/errors.js';
import User from '../models/User.js';
import UserRole from '../models/UserRole.js';
import Role from '../models/Role.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await User.findById(decoded.userId).lean();
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (user.isDeleted) {
      throw new UnauthorizedError('User account is deleted');
    }

    if (!user.active) {
      throw new UnauthorizedError('User account is inactive');
    }

    if (!user.isApproved) {
      throw new UnauthorizedError('User account is not approved');
    }

    // Get user roles with role details
    const userRoles = await UserRole.find({ userId: decoded.userId })
      .populate('roleId', 'roleName scope')
      .lean();

    const roles = userRoles.map((ur) => ur.roleId.roleName);

    req.user = {
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      instituteId: user.instituteId,
      roles,
      userRoles,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Token expired'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Invalid token'));
    }
    next(error);
  }
};

export const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

    const user = await User.findById(decoded.userId).lean();
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (user.isDeleted || !user.active || !user.isApproved) {
      throw new UnauthorizedError('User account is not valid');
    }

    req.user = {
      userId: user._id,
      email: user.email,
      instituteId: user.instituteId,
    };

    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid refresh token'));
  }
};
