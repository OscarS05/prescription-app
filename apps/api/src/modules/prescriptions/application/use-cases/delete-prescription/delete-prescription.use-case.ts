import { Injectable } from '@nestjs/common';
import { PrescriptionRepository } from '../../../domain/ports/prescription.repository';
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';
import {
  CannotDeleteConsumedPrescriptionError,
  PrescriptionDoesNotBelongToDoctorError,
} from '../../../domain/errors/prescription.errors';
import { PrescriptionItemRepository } from '../../../domain/ports/prescription-item.repository';
import { UnitOfWorkService } from '../../../../../shared/domain/ports/unit-of-work.service';

@Injectable()
export class DeletePrescriptionUseCase {
  constructor(
    private readonly prescriptionRepo: PrescriptionRepository,
    private readonly prescriptionItemRepo: PrescriptionItemRepository,
    private readonly transaction: UnitOfWorkService,
  ) {}

  public async execute(id: string, doctorId: string): Promise<void> {
    const prescription = await this.prescriptionRepo.findOneOrFail(id, true);

    if (prescription.doctorId !== doctorId) {
      throw new PrescriptionDoesNotBelongToDoctorError();
    }

    if (prescription.status === PrescriptionStatus.CONSUMED) {
      throw new CannotDeleteConsumedPrescriptionError();
    }

    await this.transaction.execute(async () => {
      await this.prescriptionRepo.delete(id);

      if (prescription.items?.length) {
        await this.prescriptionItemRepo.delete(prescription.items?.map((item) => item.id));
      }
    });
  }
}
