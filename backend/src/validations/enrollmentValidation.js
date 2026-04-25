import Joi from 'joi';

export const enrollmentValidation = Joi.object({
  userId: Joi.string().required(),
  courseId: Joi.string().required(),
  subCourseId: Joi.string().required(),
  batchId: Joi.string().optional(),
});

export const updateProgressValidation = Joi.object({
  moduleId: Joi.string().required(),
  contentId: Joi.string().optional(),
  isCompleted: Joi.boolean().optional(),
  progressPercentage: Joi.number().min(0).max(100).optional(),
  watchedDuration: Joi.number().optional(),
});
