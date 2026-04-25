import Logger from '../utils/logger.js';

const logger = new Logger('ErrorHandler');

export const errorHandler = (err, req, res, next) => {
  // Operational errors
  if (err.isOperational) {
    logger.error(`Operational Error: ${err.message}`, {
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    logger.error(`Validation Error: ${err.message}`, {
      errors: Object.values(err.errors).map((e) => e.message),
    });

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map((e) => e.message),
      statusCode: 400,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    logger.error(`Duplicate key error: ${field}`, { field });

    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      statusCode: 409,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    logger.error(`JWT Error: ${err.message}`);

    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      statusCode: 401,
    });
  }

  if (err.name === 'TokenExpiredError') {
    logger.error('Token expired');

    return res.status(401).json({
      success: false,
      message: 'Token expired',
      statusCode: 401,
    });
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    logger.error(`Cast Error: ${err.message}`);

    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      statusCode: 400,
    });
  }

  // Unknown errors
  logger.error(`Unknown Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
  });

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    statusCode: 500,
  });
};

export const notFoundHandler = (req, res, next) => {
  logger.warn(`Route not found: ${req.path}`);

  res.status(404).json({
    success: false,
    message: 'Route not found',
    statusCode: 404,
  });
};
