import { catchAsync } from '../utils/errors.js';
import StudentSubmissionService from '../services/StudentSubmissionService.js';
import Joi from 'joi';

// Validations
const submitAssignmentValidation = Joi.object({
  contentId: Joi.string().required(),
  userId: Joi.string().required(),
  responseType: Joi.string().valid('TEXT', 'URL', 'FILE').required(),
  responseText: Joi.string().when('responseType', {
    is: 'TEXT',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  responseUrl: Joi.string().uri().when('responseType', {
    is: 'URL',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

const gradeSubmissionValidation = Joi.object({
  score: Joi.number().min(0).max(100).required(),
  feedback: Joi.string().optional(),
  status: Joi.string().valid('GRADED', 'UNDER_REVIEW', 'RETURNED').optional(),
});

/**
 * Submit assignment
 */
export const submitAssignment = catchAsync(async (req, res) => {
  const { error, value } = submitAssignmentValidation.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
      statusCode: 400,
    });
  }

  const submission = await StudentSubmissionService.submitAssignment(
    value,
    req.user.instituteId
  );

  res.status(201).json({
    success: true,
    message: 'Assignment submitted successfully',
    data: submission,
    statusCode: 201,
  });
});

/**
 * Get submissions by content
 */
export const getSubmissionsByContent = catchAsync(async (req, res) => {
  const { contentId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const result = await StudentSubmissionService.getSubmissionsByContent(
    contentId,
    req.user.instituteId,
    parseInt(page),
    parseInt(limit)
  );

  res.status(200).json({
    success: true,
    message: 'Submissions retrieved successfully',
    data: result,
    statusCode: 200,
  });
});

/**
 * Get student's submissions
 */
export const getStudentSubmissions = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { courseId } = req.query;

  const submissions = await StudentSubmissionService.getStudentSubmissions(
    userId,
    req.user.instituteId,
    courseId
  );

  res.status(200).json({
    success: true,
    message: 'Student submissions retrieved successfully',
    data: submissions,
    statusCode: 200,
  });
});

/**
 * Grade submission
 */
export const gradeSubmission = catchAsync(async (req, res) => {
  const { submissionId } = req.params;

  const { error, value } = gradeSubmissionValidation.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
      statusCode: 400,
    });
  }

  const submission = await StudentSubmissionService.gradeSubmission(
    submissionId,
    value,
    req.user.userId
  );

  res.status(200).json({
    success: true,
    message: 'Submission graded successfully',
    data: submission,
    statusCode: 200,
  });
});

/**
 * Get submission details
 */
export const getSubmissionById = catchAsync(async (req, res) => {
  const { submissionId } = req.params;

  const submission = await StudentSubmissionService.getSubmissionById(submissionId);

  res.status(200).json({
    success: true,
    message: 'Submission retrieved successfully',
    data: submission,
    statusCode: 200,
  });
});

/**
 * Delete submission
 */
export const deleteSubmission = catchAsync(async (req, res) => {
  const { submissionId } = req.params;

  await StudentSubmissionService.deleteSubmission(submissionId);

  res.status(200).json({
    success: true,
    message: 'Submission deleted successfully',
    statusCode: 200,
  });
});

/**
 * Get pending grading submissions
 */
export const getPendingGradingSubmissions = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await StudentSubmissionService.getPendingGradingSubmissions(
    req.user.instituteId,
    parseInt(page),
    parseInt(limit)
  );

  res.status(200).json({
    success: true,
    message: 'Pending submissions retrieved successfully',
    data: result,
    statusCode: 200,
  });
});
