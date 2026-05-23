import Joi from 'joi';

export const validationSchema = Joi.object({
  // App
  PORT: Joi.number().required(),
  APP_ORIGIN: Joi.string().required(),

  // DB
  DATABASE_URL: Joi.string().required(),

  // JWT
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_TTL: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_TTL: Joi.string().required(),

  // Rate limiting
  THROTTLE_GLOBAL_TTL: Joi.number().required(),
  THROTTLER_GLOBAL_LIMIT: Joi.number().required(),
  THROTTLE_AUTH_TTL: Joi.number().required(),
  THROTTLER_AUTH_LIMIT: Joi.number().required(),
});
