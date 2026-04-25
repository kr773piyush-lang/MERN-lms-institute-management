import { v4 as uuidv4 } from 'uuid';

export const generateId = () => uuidv4();

export const formatResponse = (success = true, message = '', data = null, statusCode = 200) => {
  return {
    success,
    message,
    data,
    statusCode,
    timestamp: new Date().toISOString(),
  };
};

export const paginationHelper = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, parseInt(limit) || 10);
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
};

export const buildPaginatedResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.passwordHash;
  delete userObj.__v;
  return userObj;
};

export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const hasPermission = (userRoles, requiredRoles) => {
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  return userRoles.some((role) => requiredRoles.includes(role));
};
