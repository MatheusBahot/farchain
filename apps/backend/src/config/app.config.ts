import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.BACKEND_PORT || '3001', 10),
  apiPrefix: process.env.API_PREFIX || 'api/v1',

  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_dev_only',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  blockchain: {
    difficulty: parseInt(process.env.BLOCKCHAIN_DIFFICULTY || '2', 10),
    genesisData: process.env.BLOCKCHAIN_GENESIS_DATA || 'FarChain_Genesis',
  },

  qrCode: {
    baseUrl: process.env.QR_BASE_URL || 'http://localhost:5173/rastreio',
  },

  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),
  },

  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
}));
