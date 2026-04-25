import Joi from 'joi';

export const createCourseValidation = Joi.object({
  courseName: Joi.string().trim().required().messages({
    'string.empty': 'Course name is required',
  }),
  description: Joi.string().optional(),
  duration: Joi.number().optional(),
  level: Joi.string()
    .valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED')
    .optional(),
});

export const createSubCourseValidation = Joi.object({
  courseId: Joi.string().required().messages({
    'string.empty': 'Course ID is required',
  }),
  subCourseName: Joi.string().trim().required().messages({
    'string.empty': 'Sub-course name is required',
  }),
  description: Joi.string().optional(),
  sequenceNo: Joi.number().optional(),
});

export const createModuleValidation = Joi.object({
  courseId: Joi.string().required(),
  subCourseId: Joi.string().required(),
  moduleName: Joi.string().trim().required().messages({
    'string.empty': 'Module name is required',
  }),
  description: Joi.string().optional(),
  sequenceNo: Joi.number().optional(),
  duration: Joi.number().optional(),
});

export const createContentValidation = Joi.object({
  moduleId: Joi.string().required(),
  title: Joi.string().trim().required(),
  description: Joi.string().optional(),
  contentType: Joi.string()
    .valid('VIDEO', 'PDF', 'QUIZ', 'ASSIGNMENT', 'LIVE_SESSION', 'DOCUMENT')
    .required(),
  url: Joi.string().optional(),
  fileSize: Joi.number().optional(),
  duration: Joi.number().optional(),
  orderIndex: Joi.number().optional(),
  isPreview: Joi.boolean().optional(),
});

export const updateCourseValidation = Joi.object({
  courseName: Joi.string().trim().optional(),
  description: Joi.string().optional(),
  duration: Joi.number().optional(),
  level: Joi.string()
    .valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED')
    .optional(),
  active: Joi.boolean().optional(),
});
