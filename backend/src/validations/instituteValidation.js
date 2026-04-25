import Joi from 'joi';

export const createInstituteValidation = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Institute name is required',
  }),
  email: Joi.string().email().required().lowercase().messages({
    'string.email': 'Invalid email address',
    'string.empty': 'Email is required',
  }),
  mobileNo: Joi.string().required().messages({
    'string.empty': 'Mobile number is required',
  }),
  adminId: Joi.string().optional(),
  country: Joi.string().optional(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  pincode: Joi.string().optional(),
  address: Joi.string().optional(),
});

export const updateInstituteValidation = Joi.object({
  name: Joi.string().trim().optional(),
  email: Joi.string().email().lowercase().optional(),
  mobileNo: Joi.string().optional(),
  country: Joi.string().optional(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  pincode: Joi.string().optional(),
  address: Joi.string().optional(),
  active: Joi.boolean().optional(),
});
