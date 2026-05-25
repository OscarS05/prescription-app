import { Injectable } from '@nestjs/common';

import { PrescriptionRepository } from '../../../domain/ports/prescription.repository';
import { PrescriptionItemRepository } from '../../../domain/ports/prescription-item.repository';
import type { Prescription } from '../../../domain/types/prescription.types';
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';
import {
  DomainInternalError,
  PrescriptionCodeError,
} from '../../../domain/errors/prescription.errors';

export type Props = Pick<Prescription, 'doctorId' | 'patientId' | 'notes' | 'items'>;

@Injectable()
export class CreatePrescriptionUseCase {
  constructor(
    private readonly prescriptionRepo: PrescriptionRepository,
    private readonly prescriptionItemRepo: PrescriptionItemRepository,
  ) {}

  public async execute(data: Props): Promise<Prescription> {
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const newPrescription = await this.prescriptionRepo.create({
          ...data,
          code: await this.buildCode(),
          status: PrescriptionStatus.PENDING,
        });

        if (data?.items?.length) {
          const newItems = await this.prescriptionItemRepo.create(data.items);
          newPrescription.items = newItems;
        }

        return newPrescription;
      } catch (error) {
        if (!(error instanceof PrescriptionCodeError)) throw error;
        if (attempt == 5) throw error;
      }
    }

    throw new DomainInternalError();
  }

  private async buildCode(): Promise<string> {
    const lastCode: string = await this.prescriptionRepo.findTheLastCode();
    const [year, numeral]: string[] = lastCode.split('-');

    const currentYear: string = new Date().getFullYear().toString();
    const newNumeral: number = year === currentYear ? Number(numeral) + 1 : 1;

    return currentYear + '-' + newNumeral;
  }
}
