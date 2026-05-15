import dotenv from 'dotenv';

const envFile = (() => {
  switch (process.env.NODE_ENV) {
    case 'test':
      return '.env.test';
    case 'production':
      return '.env.production';
    default:
      return '.env';
  }
})();

dotenv.config({ path: envFile });
