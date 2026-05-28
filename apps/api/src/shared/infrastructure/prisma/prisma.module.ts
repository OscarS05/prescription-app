import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaUnitOfWork } from './unit-of-work.adapter';
import { PrismaTransactionContext } from './transaction-context';

@Global()
@Module({
  providers: [PrismaService, PrismaUnitOfWork, PrismaTransactionContext],
  exports: [PrismaService, PrismaTransactionContext, PrismaUnitOfWork],
})
export class PrismaModule {}
