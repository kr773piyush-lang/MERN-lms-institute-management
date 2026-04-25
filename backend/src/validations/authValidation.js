import Joi from 'joi';

export const registerValidation = Joi.object({
  firstName: Joi.string().trim().required().messages({
    'string.empty': 'First name is required',
  }),
  lastName: Joi.string().trim().required().messages({
    'string.empty': 'Last name is required',
  }),
  email: Joi.string().email().required().lowercase().messages({
    'string.email': 'Invalid email address',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.empty': 'Password is required',
  }),
  mobileNo: Joi.string().optional(),
  instituteId: Joi.string().optional(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required().lowercase().messages({
    'string.email': 'Invalid email address',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

export const updateUserValidation = Joi.object({
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  mobileNo: Joi.string().optional(),
  profileImage: Joi.string().optional(),
});

export const refreshTokenValidation = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token is required',
  }),
});
