import { InstituteService } from '../services/InstituteService.js';
import { catchAsync } from '../utils/errors.js';
import {
  createInstituteValidation,
  updateInstituteValidation,
} from '../validations/instituteValidation.js';

const instituteService = new InstituteService();

export const createInstitute = catchAsync(async (req, res) => {
  const { error, value } = createInstituteValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const institute = await instituteService.createInstitute(
    value,
    req.user.userId
  );

  res.status(201).json({
    success: true,
    message: 'Institute created successfully',
    data: institute,
  });
});

export const getInstitutes = catchAsync(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const result = await instituteService.getInstitutes(page, limit);

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getInstituteById = catchAsync(async (req, res) => {
  const institute = await instituteService.getInstituteById(
    req.params.instituteId
  );

  res.status(200).json({
    success: true,
    data: institute,
  });
});

export const updateInstitute = catchAsync(async (req, res) => {
  const { error, value } = updateInstituteValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const institute = await instituteService.updateInstitute(
    req.params.instituteId,
    value,
    req.user.userId
  );

  res.status(200).json({
    success: true,
    message: 'Institute updated successfully',
    data: institute,
  });
});

export const deleteInstitute = catchAsync(async (req, res) => {
  const result = await instituteService.deleteInstitute(
    req.params.instituteId
  );

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const getInstituteStats = catchAsync(async (req, res) => {
  const stats = await instituteService.getInstituteStats(
    req.params.instituteId
  );

  res.status(200).json({
    success: true,
    data: stats,
  });
});
