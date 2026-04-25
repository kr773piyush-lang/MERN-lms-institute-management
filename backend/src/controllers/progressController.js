import { ProgressService } from '../services/ProgressService.js';
import { catchAsync } from '../utils/errors.js';
import { updateProgressValidation } from '../validations/enrollmentValidation.js';

const progressService = new ProgressService();

export const updateProgress = catchAsync(async (req, res) => {
  const { error, value } = updateProgressValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const progress = await progressService.updateProgress(
    { ...value, userId: req.params.userId },
    req.user.instituteId
  );

  res.status(200).json({
    success: true,
    message: 'Progress updated successfully',
    data: progress,
  });
});

export const getModuleProgress = catchAsync(async (req, res) => {
  const progress = await progressService.getModuleProgress(
    req.params.userId,
    req.params.moduleId
  );

  res.status(200).json({
    success: true,
    data: progress,
  });
});

export const getStudentProgress = catchAsync(async (req, res) => {
  const progress = await progressService.getStudentProgress(
    req.params.userId
  );

  res.status(200).json({
    success: true,
    data: progress,
  });
});

export const getCourseProgress = catchAsync(async (req, res) => {
  const progress = await progressService.getCourseProgress(
    req.params.userId,
    req.params.courseId
  );

  res.status(200).json({
    success: true,
    data: progress,
  });
});

export const getBatchProgress = catchAsync(async (req, res) => {
  const progress = await progressService.getBatchProgress(req.params.batchId);

  res.status(200).json({
    success: true,
    data: progress,
  });
});
