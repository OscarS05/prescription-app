export interface Env {
  // App
  PORT: number;
  FRONTEND_URL: string;

  // DB
  DATABASE_URL: string;

  // JWT
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_TTL: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_TTL: string;

  // Rate limiting
  THROTTLE_GLOBAL_TTL: number;
  THROTTLER_GLOBAL_LIMIT: number;
  THROTTLE_AUTH_TTL: number;
  THROTTLER_AUTH_LIMIT: number;
}
