import { Injectable } from '@nestjs/common';

import { PrescriptionRepository } from '../../../domain/ports/prescription.repository';
import { PrescriptionItemRepository } from '../../../domain/ports/prescription-item.repository';
import type { Prescription } from '../../../domain/types/prescription.types';

export type Props = Pick<Prescription, 'doctorId' | 'patientId' | 'notes' | 'items'>;

@Injectable()
export class CreatePrescriptionUseCase {
  constructor(
    private readonly prescriptionRepo: PrescriptionRepository,
    private readonly prescriptionItemRepo: PrescriptionItemRepository,
  ) {}

  public async execute(data: Props): Promise<Prescription> {}
}
