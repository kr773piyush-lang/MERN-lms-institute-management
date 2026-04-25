import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Database
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/lms_db',
    name: process.env.DB_NAME || 'lms_db',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret',
    expire: process.env.JWT_EXPIRE || '15m',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_secret',
    refreshExpire: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  },

  // File Upload
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'),
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,xls,xlsx,ppt,pptx,mp4,avi,mov').split(','),
  },

  // CORS
  cors: {
    // origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    origin: "*",
    credentials: true,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },

  // Session
  session: {
    timeout: process.env.SESSION_TIMEOUT || '24h',
  },
};

export default config;
