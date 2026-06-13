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
import { CreatePrescriptionItemUseCase } from './application/use-cases/create-prescription-item/create-item.use-case';
import { PdfGenerator } from './domain/ports/pdf.port';
import { PuppeteerPdfGenerator } from './infrastructure/pdf/puppeteer-generator.pdf';
import { GeneratePrescriptionPdfUseCase } from './application/use-cases/generate-pdf/generate-prescription-pdf.use-case';
import { UserRepository } from '../identity/domain/ports/user.repository';
import { UserRepositoryPrismaAdapter } from '../identity/infrastructure/db/user.repository';
import { TemplateService } from './infrastructure/services/templates.service';
import { ConfigService as ConfigServiceDomain } from '../../shared/domain/ports/config.service';
import { ConfigService } from '@nestjs/config';
import { QrService } from '../../shared/domain/ports/qr.service';
import { QrCodeGenerator } from '../../shared/infrastructure/services/qr.service';
import { PuppeteerService } from './infrastructure/services/puppeteer.service';
import { DoctorSignatureRepository } from '../identity/domain/ports/signature.repository';
import { DoctorSignatureRepositoryPrismaAdapter } from '../identity/infrastructure/db/doctor-signature.repository';
import { FakePuppeteerPdfGenerator } from '../../../test/__mocks__/fake-puppeteer-generator.pdf';

@Module({
  imports: [PrismaModule],
  controllers: [PrescriptionController, PrescriptionItemController],
  providers: [
    { provide: UnitOfWorkService, useClass: PrismaUnitOfWork },
    { provide: UserRepository, useClass: UserRepositoryPrismaAdapter },
    { provide: PrescriptionRepository, useClass: PrismaPrescriptionRepository },
    { provide: PrescriptionItemRepository, useClass: PrismaPrescriptionItemRepository },
    { provide: DoctorSignatureRepository, useClass: DoctorSignatureRepositoryPrismaAdapter },
    {
      provide: PdfGenerator,
      useClass:
        process.env.NODE_ENV === 'test' ? FakePuppeteerPdfGenerator : PuppeteerPdfGenerator,
    },
    { provide: ConfigServiceDomain, useClass: ConfigService },
    { provide: QrService, useClass: QrCodeGenerator },
    PuppeteerService,
    TemplateService,
    CreatePrescriptionUseCase,
    CreatePrescriptionItemUseCase,
    ConsumePrescriptionUseCase,
    DeletePrescriptionUseCase,
    DeletePrescriptionItemUseCase,
    EditPrescriptionUseCase,
    FindAllPrescriptionsUseCase,
    FindOnePrescriptionUseCase,
    GeneratePrescriptionPdfUseCase,
  ],
})
export class PrescriptionModule {}
