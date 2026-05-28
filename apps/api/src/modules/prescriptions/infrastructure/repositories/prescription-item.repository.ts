import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/infrastructure/prisma/base.repository';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { PrismaTransactionContext } from '../../../../shared/infrastructure/prisma/transaction-context';
import { PrescriptionItemRepository } from '../../domain/ports/prescription-item.repository';
import {
  CreatePrescriptionItem,
  PrescriptionItem,
  UpdatePrescriptionItem,
} from '../../domain/types/prescription-items.type';
import { PrescriptionItemMapper } from '../mappers/prescription-item.mapper';

@Injectable()
export class PrismaPrescriptionItemRepository
  extends PrismaRepository
  implements PrescriptionItemRepository
{
  constructor(prisma: PrismaService, txContext: PrismaTransactionContext) {
    super(prisma, txContext);
  }

  async create(data: CreatePrescriptionItem[]): Promise<PrescriptionItem[]> {
    const result = await this.client.prescriptionItem.createManyAndReturn({ data });
    return result.map((item) => PrescriptionItemMapper.toDomain(item));
  }

  async update(data: UpdatePrescriptionItem[]): Promise<PrescriptionItem[]> {
    const result = await Promise.all(
      data.map((item) =>
        this.client.prescriptionItem.update({
          where: {
            id: item.id,
          },
          data: {
            name: item.name,
            dosage: item.dosage,
            quantity: item.quantity,
            instructions: item.instructions,
          },
        }),
      ),
    );

    return result.map((item) => PrescriptionItemMapper.toDomain(item));
  }

  async delete(ids: string[]): Promise<void> {
    await this.client.prescriptionItem.deleteMany({
      where: { id: { in: ids } },
      limit: ids.length,
    });
  }
}
