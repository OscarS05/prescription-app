import { defineConfig } from 'prisma/config';
import './src/shared/infrastructure/env/env';

export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    seed: 'tsx prisma/seed.ts',
    path: 'prisma/migrations',
  },

  datasource: {
    url: process.env.DATABASE_URL,
  },
});
