import { BatchService } from '../services/BatchService.js';
import { catchAsync } from '../utils/errors.js';
import {
  createBatchValidation,
  updateBatchValidation,
  assignUserToBatchValidation,
} from '../validations/batchValidation.js';

const batchService = new BatchService();

export const createBatch = catchAsync(async (req, res) => {
  const { error, value } = createBatchValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const batch = await batchService.createBatch(
    value,
    req.user.instituteId,
    req.user.userId
  );

  res.status(201).json({
    success: true,
    message: 'Batch created successfully',
    data: batch,
  });
});

export const getBatches = catchAsync(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const result = await batchService.getBatches(
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

export const getBatchById = catchAsync(async (req, res) => {
  const batch = await batchService.getBatchById(req.params.batchId);

  res.status(200).json({
    success: true,
    data: batch,
  });
});

export const updateBatch = catchAsync(async (req, res) => {
  const { error, value } = updateBatchValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const batch = await batchService.updateBatch(req.params.batchId, value);

  res.status(200).json({
    success: true,
    message: 'Batch updated successfully',
    data: batch,
  });
});

export const deleteBatch = catchAsync(async (req, res) => {
  const result = await batchService.deleteBatch(req.params.batchId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const assignUserToBatch = catchAsync(async (req, res) => {
  const { error, value } = assignUserToBatchValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const userBatch = await batchService.assignUserToBatch(
    req.params.batchId,
    value.userId,
    value.roleInBatch,
    req.user.instituteId
  );

  res.status(201).json({
    success: true,
    message: 'User assigned to batch successfully',
    data: userBatch,
  });
});

export const removeUserFromBatch = catchAsync(async (req, res) => {
  const result = await batchService.removeUserFromBatch(
    req.params.batchId,
    req.params.userId
  );

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const getBatchMembers = catchAsync(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const result = await batchService.getBatchMembers(
    req.params.batchId,
    page,
    limit
  );

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});
