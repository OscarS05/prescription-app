import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { DoctorSignatureRepository } from '../../domain/ports/signature.repository';
import { DoctorSignature } from '../../domain/types/signatures.types';
import { PrismaRepository } from '../../../../shared/infrastructure/prisma/base.repository';
import { PrismaTransactionContext } from '../../../../shared/infrastructure/prisma/transaction-context';

@Injectable()
export class DoctorSignatureRepositoryPrismaAdapter
  extends PrismaRepository
  implements DoctorSignatureRepository
{
  constructor(prisma: PrismaService, txContext: PrismaTransactionContext) {
    super(prisma, txContext);
  }

  async findByDoctorId(id: string, isActive: boolean): Promise<DoctorSignature | null> {
    //
  }
}
