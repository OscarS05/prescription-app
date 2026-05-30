import { Module } from '@nestjs/common';

import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module';
import { PrescriptionRepository } from './domain/ports/prescription.repository';
import { PrismaPrescriptionRepository } from './infrastructure/repositories/prescription.repository';
import { PrescriptionItemRepository } from './domain/ports/prescription-item.repository';
import { PrismaPrescriptionItemRepository } from './infrastructure/repositories/prescription-item.repository';
import { CreatePrescriptionUseCase } from './application/use-cases/create-prescription/create-prescription.use-case';
import { ConsumePrescriptionUseCase } from './application/use-cases/consume-prescription/consume-prescription.use-case';
import { DeletePrescriptionUseCase } from './application/use-cases/delete-prescription/delete-prescription.use-case';
import { DeletePrescriptionItemUseCase } from './application/use-cases/delete-prescription-item/delete-prescription-item.use-case';
import { EditPrescriptionUseCase } from './application/use-cases/edit-prescription/edit-prescription.use-case';
import { FindAllPrescriptionsUseCase } from './application/use-cases/find-all-prescriptions/find-all.use-case';
import { FindOnePrescriptionUseCase } from './application/use-cases/find-one/find-one.use-case';
import { UnitOfWorkService } from '../../shared/domain/ports/unit-of-work.service';
import { PrismaUnitOfWork } from '../../shared/infrastructure/prisma/unit-of-work.adapter';
import { PrescriptionController } from './infrastructure/controllers/prescription.controller';
import { PrescriptionItemController } from './infrastructure/controllers/prescription-item.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PrescriptionController, PrescriptionItemController],
  providers: [
    { provide: UnitOfWorkService, useClass: PrismaUnitOfWork },
    { provide: PrescriptionRepository, useClass: PrismaPrescriptionRepository },
    { provide: PrescriptionItemRepository, useClass: PrismaPrescriptionItemRepository },
    CreatePrescriptionUseCase,
    ConsumePrescriptionUseCase,
    DeletePrescriptionUseCase,
    DeletePrescriptionItemUseCase,
    EditPrescriptionUseCase,
    FindAllPrescriptionsUseCase,
    FindOnePrescriptionUseCase,
  ],
})
export class PrescriptionModule {}
