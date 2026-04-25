import Joi from 'joi';

export const createBatchValidation = Joi.object({
  courseId: Joi.string().required(),
  subCourseId: Joi.string().required(),
  batchName: Joi.string().trim().required(),
  description: Joi.string().optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().optional(),
  capacity: Joi.number().optional(),
  schedule: Joi.object().optional(),
});

export const updateBatchValidation = Joi.object({
  batchName: Joi.string().trim().optional(),
  description: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  capacity: Joi.number().optional(),
  schedule: Joi.object().optional(),
  active: Joi.boolean().optional(),
});

export const assignUserToBatchValidation = Joi.object({
  userId: Joi.string().required(),
  roleInBatch: Joi.string().valid('STUDENT', 'TEACHER').required(),
});
