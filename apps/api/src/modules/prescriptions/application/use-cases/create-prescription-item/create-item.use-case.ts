import { Injectable } from '@nestjs/common';

import { PrescriptionRepository } from '../../../domain/ports/prescription.repository';
import { PrescriptionItemRepository } from '../../../domain/ports/prescription-item.repository';
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';
import {
  CannotCreateItemInAConsumedPrescriptionError,
  PrescriptionDoesNotBelongToDoctorError,
} from '../../../domain/errors/prescription.errors';
import {
  CreatePrescriptionItem,
  PrescriptionItem,
} from '../../../domain/types/prescription-items.type';

@Injectable()
export class CreatePrescriptionItemUseCase {
  constructor(
    private readonly prescriptionRepo: PrescriptionRepository,
    private readonly prescriptionItemRepo: PrescriptionItemRepository,
  ) {}

  public async execute(
    doctorId: string,
    data: CreatePrescriptionItem,
  ): Promise<PrescriptionItem> {
    const prescription = await this.prescriptionRepo.findOneOrFail(
      data.prescriptionId,
      false,
    );

    if (prescription.doctorId !== doctorId) {
      throw new PrescriptionDoesNotBelongToDoctorError();
    }

    if (prescription.status === PrescriptionStatus.CONSUMED) {
      throw new CannotCreateItemInAConsumedPrescriptionError();
    }

    const [newItem] = await this.prescriptionItemRepo.create([data]);
    return newItem;
  }
}
