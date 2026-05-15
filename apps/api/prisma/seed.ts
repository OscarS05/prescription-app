import '../src/shared/infrastructure/env/env';
import { prisma, runSeeds } from './main.seed';

runSeeds()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
