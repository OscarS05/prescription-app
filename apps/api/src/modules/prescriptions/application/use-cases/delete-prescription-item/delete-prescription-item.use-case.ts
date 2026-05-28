import { Injectable } from '@nestjs/common';
import { PrescriptionItemRepository } from '../../../domain/ports/prescription-item.repository';
import { PrescriptionRepository } from '../../../domain/ports/prescription.repository';
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';
import {
  CannotDeleteConsumedPrescriptionError,
  PrescriptionDoesNotBelongToDoctorError,
} from '../../../domain/errors/prescription.errors';
import {
  PrescriptionItemConflictError,
  PrescriptionItemNotFound,
} from '../../../domain/errors/prescription-item.errors';

@Injectable()
export class DeletePrescriptionItemUseCase {
  constructor(
    private readonly prescriptionRepo: PrescriptionRepository,
    private readonly prescriptionItemRepo: PrescriptionItemRepository,
  ) {}

  public async execute(
    doctorId: string,
    prescriptionId: string,
    itemIds: string[],
  ): Promise<void> {
    const prescription = await this.prescriptionRepo.findOneOrFail(prescriptionId);

    if (prescription.doctorId !== doctorId) {
      throw new PrescriptionDoesNotBelongToDoctorError();
    }

    if (prescription.status === PrescriptionStatus.CONSUMED) {
      throw new CannotDeleteConsumedPrescriptionError();
    }

    if (!prescription.items || prescription.items?.length === 0) {
      throw new PrescriptionItemNotFound();
    }

    const ids = new Set(itemIds);
    const allItemsBelongToPrescription = prescription.items?.every((item) =>
      ids.has(item.id),
    );
    if (!allItemsBelongToPrescription) {
      throw new PrescriptionItemConflictError();
    }

    await this.prescriptionItemRepo.delete([...ids]);
  }
}
