import { ForbiddenError } from '../utils/errors.js';

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('User not authenticated'));
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return next(
        new ForbiddenError(
          `Access denied. Required roles: ${allowedRoles.join(', ')}`
        )
      );
    }

    next();
  };
};

export const authorizeInstituteAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ForbiddenError('User not authenticated'));
  }

  if (req.user.roles.includes('SUPER_ADMIN')) {
    return next();
  }

  if (!req.user.roles.includes('INSTITUTE_ADMIN')) {
    return next(new ForbiddenError('Only institute admin can access'));
  }

  // Verify institute ownership
  if (req.params.instituteId && req.params.instituteId !== req.user.instituteId) {
    if (!req.user.roles.includes('SUPER_ADMIN')) {
      return next(new ForbiddenError('Cannot access other institutes'));
    }
  }

  next();
};

export const authorizeSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ForbiddenError('User not authenticated'));
  }

  if (!req.user.roles.includes('SUPER_ADMIN')) {
    return next(new ForbiddenError('Only super admin can access'));
  }

  next();
};

export const validateInstitute = (req, res, next) => {
  if (!req.user) {
    return next(new ForbiddenError('User not authenticated'));
  }

  const instituteIdParam = req.params.instituteId || req.body.instituteId;

  if (!req.user.roles.includes('SUPER_ADMIN') && instituteIdParam) {
    if (instituteIdParam !== req.user.instituteId) {
      return next(new ForbiddenError('Cannot access other institutes'));
    }
  }

  next();
};
