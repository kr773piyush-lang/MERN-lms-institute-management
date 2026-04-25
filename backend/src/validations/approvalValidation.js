import Joi from 'joi';

export const createApprovalValidation = Joi.object({
  userId: Joi.string().required(),
});

export const approveUserValidation = Joi.object({
  remarks: Joi.string().optional(),
});

export const rejectUserValidation = Joi.object({
  rejectionReason: Joi.string().required(),
});
