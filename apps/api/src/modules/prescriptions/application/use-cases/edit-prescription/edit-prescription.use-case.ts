import { Injectable } from '@nestjs/common';

import { PrescriptionRepository } from '../../../domain/ports/prescription.repository';
import { PrescriptionItemRepository } from '../../../domain/ports/prescription-item.repository';
import type {
  Prescription,
  UpdatePrescription,
} from '../../../domain/types/prescription.types';
import { PrescriptionItem } from '../../../domain/types/prescription-items.type';
import { DoctorIdDoesNotBelongError } from '../../../domain/errors/prescription.errors';
import {
  PrescriptionItemConflictError,
  PrescriptionItemIdDoesNotMatchError,
} from '../../../domain/errors/prescription-item.errors';

type Props = UpdatePrescription & {
  items?: Partial<Omit<PrescriptionItem, 'prescriptionId'>>[];
};

@Injectable()
export class EditPrescriptionUseCase {
  constructor(
    private readonly prescriptionRepo: PrescriptionRepository,
    private readonly prescriptionItemRepo: PrescriptionItemRepository,
  ) {}

  public async execute(id: string, doctorId: string, changes: Props): Promise<Prescription> {
    const prescription = await this.prescriptionRepo.findOneOrFail(id);
    if (prescription.doctorId !== doctorId) throw new DoctorIdDoesNotBelongError();
    if (!prescription.items && changes?.items?.length) {
      throw new PrescriptionItemConflictError();
    }

    const dbItemIds = new Set(prescription.items?.map((item) => item.id));
    const hasInvalidIds = changes.items?.some((item) => item.id && !dbItemIds.has(item.id));
    if (hasInvalidIds) throw new PrescriptionItemIdDoesNotMatchError();

    if (changes.notes) {
      await this.prescriptionRepo.update(id, { notes: changes.notes });
    }

    if (changes.items?.length) {
      await this.prescriptionItemRepo.update(changes.items);
    }

    return await this.prescriptionRepo.findOneOrFail(id);
  }
}
