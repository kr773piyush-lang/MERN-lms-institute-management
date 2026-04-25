import { UserService } from '../services/UserService.js';
import { catchAsync } from '../utils/errors.js';
import { updateUserValidation } from '../validations/authValidation.js';

const userService = new UserService();

export const getUsers = catchAsync(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const filters = {
    ...(req.query.isApproved && { isApproved: req.query.isApproved === 'true' }),
    ...(req.query.active && { active: req.query.active === 'true' }),
  };

  const result = await userService.getUsers(
    req.user.instituteId,
    page,
    limit,
    filters
  );

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const { error, value } = updateUserValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const user = await userService.updateUser(req.params.userId, {
    ...value,
    updatedBy: req.user.userId,
  });

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  const result = await userService.deleteUser(req.params.userId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const assignRole = catchAsync(async (req, res) => {
  const { roleId } = req.body;

  if (!roleId) {
    return res.status(400).json({
      success: false,
      message: 'Role ID is required',
    });
  }

  const userRole = await userService.assignRole(
    req.params.userId,
    roleId,
    req.user.instituteId
  );

  res.status(201).json({
    success: true,
    message: 'Role assigned successfully',
    data: userRole,
  });
});

export const removeRole = catchAsync(async (req, res) => {
  const { roleId } = req.body;

  if (!roleId) {
    return res.status(400).json({
      success: false,
      message: 'Role ID is required',
    });
  }

  const result = await userService.removeRole(req.params.userId, roleId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const getPendingApprovals = catchAsync(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const result = await userService.getUserApprovals(
    req.user.instituteId,
    page,
    limit
  );

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});
