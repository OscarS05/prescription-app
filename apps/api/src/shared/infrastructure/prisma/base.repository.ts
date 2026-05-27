import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { PrismaTransactionContext } from './transaction-context';

export abstract class PrismaRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly txContext: PrismaTransactionContext,
  ) {}

  protected get client(): Prisma.TransactionClient | PrismaService {
    return this.txContext.getClient() ?? this.prisma;
  }
}
