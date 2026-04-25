import { catchAsync } from '../utils/errors.js';
import UserSelectedCourseService from '../services/UserSelectedCourseService.js';
import Joi from 'joi';

// Validations
const selectCourseValidation = Joi.object({
  courseId: Joi.string().required(),
  subCourseId: Joi.string().optional(),
  batchId: Joi.string().optional(),
  selectionType: Joi.string().valid('SELF_SELECTED', 'ASSIGNED', 'RECOMMENDED').optional(),
  notes: Joi.string().optional(),
});

const updateSelectionStatusValidation = Joi.object({
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DROPPED').required(),
});

const updatePriorityValidation = Joi.object({
  priority: Joi.number().integer().min(0).required(),
});

/**
 * Select course
 */
export const selectCourse = catchAsync(async (req, res) => {
  const { error, value } = selectCourseValidation.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
      statusCode: 400,
    });
  }

  const selection = await UserSelectedCourseService.selectCourse(
    value,
    req.user.instituteId,
    req.params.userId || req.user.userId
  );

  res.status(201).json({
    success: true,
    message: 'Course selected successfully',
    data: selection,
    statusCode: 201,
  });
});

/**
 * Get student's selected courses
 */
export const getSelectedCourses = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;

  const selections = await UserSelectedCourseService.getStudentSelectedCourses(
    userId,
    req.user.instituteId,
    status
  );

  res.status(200).json({
    success: true,
    message: 'Selected courses retrieved successfully',
    data: selections,
    statusCode: 200,
  });
});

/**
 * Get favorite courses
 */
export const getFavoriteCourses = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const favorites = await UserSelectedCourseService.getFavoriteCourses(
    userId,
    req.user.instituteId
  );

  res.status(200).json({
    success: true,
    message: 'Favorite courses retrieved successfully',
    data: favorites,
    statusCode: 200,
  });
});

/**
 * Toggle favorite
 */
export const toggleFavorite = catchAsync(async (req, res) => {
  const { selectionId } = req.params;
  const { isFavorite } = req.body;

  const selection = await UserSelectedCourseService.toggleFavorite(selectionId, isFavorite);

  res.status(200).json({
    success: true,
    message: 'Favorite status updated successfully',
    data: selection,
    statusCode: 200,
  });
});

/**
 * Update selection status
 */
export const updateSelectionStatus = catchAsync(async (req, res) => {
  const { selectionId } = req.params;

  const { error, value } = updateSelectionStatusValidation.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
      statusCode: 400,
    });
  }

  const selection = await UserSelectedCourseService.updateSelectionStatus(
    selectionId,
    value.status
  );

  res.status(200).json({
    success: true,
    message: 'Selection status updated successfully',
    data: selection,
    statusCode: 200,
  });
});

/**
 * Remove selection
 */
export const removeSelection = catchAsync(async (req, res) => {
  const { selectionId } = req.params;

  await UserSelectedCourseService.removeSelection(selectionId);

  res.status(200).json({
    success: true,
    message: 'Course removed from selections',
    statusCode: 200,
  });
});

/**
 * Update priority
 */
export const updatePriority = catchAsync(async (req, res) => {
  const { selectionId } = req.params;

  const { error, value } = updatePriorityValidation.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
      statusCode: 400,
    });
  }

  const selection = await UserSelectedCourseService.updatePriority(selectionId, value.priority);

  res.status(200).json({
    success: true,
    message: 'Priority updated successfully',
    data: selection,
    statusCode: 200,
  });
});

/**
 * Get course selection statistics
 */
export const getCourseSelectionStats = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const stats = await UserSelectedCourseService.getCourseSelectionStats(
    courseId,
    req.user.instituteId
  );

  res.status(200).json({
    success: true,
    message: 'Course statistics retrieved successfully',
    data: stats,
    statusCode: 200,
  });
});
