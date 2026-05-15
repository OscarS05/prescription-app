export interface Env {
  // App
  PORT: number;
  APP_ORIGIN: string;

  // DB
  DATABASE_URL: string;

  // JWT
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_TTL: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_TTL: string;
}
