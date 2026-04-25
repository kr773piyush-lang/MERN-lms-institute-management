import Logger from '../utils/logger.js';

const logger = new Logger('ActivityLog');

export const activityLogger = async (req, res, next) => {
  // Skip logging for GET requests
  if (req.method === 'GET') {
    return next();
  }

  const originalSend = res.send;

  res.send = function (data) {
    res.send = originalSend;

    // Store activity info for use in controllers
    req.activityLog = {
      method: req.method,
      path: req.path,
      timestamp: new Date(),
    };

    return res.send(data);
  };

  next();
};
