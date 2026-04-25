import { AuthService } from '../services/AuthService.js';
import { catchAsync } from '../utils/errors.js';
import { registerValidation, loginValidation, refreshTokenValidation } from '../validations/authValidation.js';

const authService = new AuthService();

export const register = catchAsync(async (req, res) => {
  const { error, value } = registerValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const instituteId = req.body.instituteId || req.user?.instituteId;

  const result = await authService.register(value, instituteId);

  res.status(201).json({
    success: true,
    message: result.message,
    data: result.user,
  });
});

export const login = catchAsync(async (req, res) => {
  const { error, value } = loginValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const instituteId = req.body.instituteId || 'default';

  const result = await authService.login(value.email, value.password, instituteId);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      roles: result.roles,
    },
  });
});

export const refreshToken = catchAsync(async (req, res) => {
  const { error, value } = refreshTokenValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const result = await authService.refreshToken(value.refreshToken);

  res.status(200).json({
    success: true,
    message: 'Token refreshed',
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

export const logout = catchAsync(async (req, res) => {
  const result = await authService.logout(req.user.userId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const getCurrentUser = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
