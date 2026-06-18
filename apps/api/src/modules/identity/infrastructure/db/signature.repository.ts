import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { DoctorSignatureRepository } from '../../domain/ports/signature.repository';
import { CreateSignature, DoctorSignature } from '../../domain/types/signatures.types';
import { PrismaRepository } from '../../../../shared/infrastructure/prisma/base.repository';
import { PrismaTransactionContext } from '../../../../shared/infrastructure/prisma/transaction-context';
import { DoctorSignatureMapper } from '../mappers/doctor-signature.mapper';

@Injectable()
export class SignatureRepositoryPrismaAdapter
  extends PrismaRepository
  implements DoctorSignatureRepository
{
  constructor(prisma: PrismaService, txContext: PrismaTransactionContext) {
    super(prisma, txContext);
  }

  async findByDoctorId(id: string, isActive: boolean): Promise<DoctorSignature | null> {
    const result = await this.client.doctorSignature.findFirst({
      where: { doctorId: id, isActive },
    });

    return result ? DoctorSignatureMapper.toDomain(result) : null;
  }

  async deactivateAll(userId: string): Promise<void> {
    await this.client.doctorSignature.updateMany({
      where: { doctorId: userId },
      data: { isActive: false },
    });
  }

  async create(data: CreateSignature): Promise<DoctorSignature> {
    const result = await this.client.doctorSignature.create({ data });
    return DoctorSignatureMapper.toDomain(result);
  }

  async delete(id: string): Promise<void> {
    await this.client.doctorSignature.delete({ where: { id } });
  }
}
