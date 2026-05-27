import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/infrastructure/prisma/base.repository';
import { PrescriptionRepository } from '../../domain/ports/prescription.repository';

@Injectable()
export class PrismaPrescriptionRepository
  extends PrismaRepository
  implements PrescriptionRepository
{
  async delete(id: string): Promise<void> {
    await this.client.prescription.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
