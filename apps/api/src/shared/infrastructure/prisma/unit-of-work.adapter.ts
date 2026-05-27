import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UnitOfWorkService } from '../../domain/ports/unit-of-work.service';
import { PrismaTransactionContext } from './transaction-context';

@Injectable()
export class PrismaUnitOfWork extends UnitOfWorkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txContext: PrismaTransactionContext,
  ) {
    super();
  }

  async execute<T>(work: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return this.txContext.run(tx, work);
    });
  }
}
