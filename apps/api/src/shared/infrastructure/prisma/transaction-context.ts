import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaTransactionContext {
  private readonly storage = new AsyncLocalStorage<Prisma.TransactionClient>();

  run<T>(tx: Prisma.TransactionClient, callback: () => Promise<T>): Promise<T> {
    return this.storage.run(tx, callback);
  }

  getClient(): Prisma.TransactionClient | undefined {
    return this.storage.getStore();
  }
}
