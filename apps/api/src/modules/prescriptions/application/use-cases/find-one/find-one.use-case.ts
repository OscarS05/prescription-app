import { Injectable } from '@nestjs/common';
import { PrescriptionRepository } from '../../../domain/ports/prescription.repository';
import { Prescription } from '../../../domain/types/prescription.types';

@Injectable()
export class FindOnePrescriptionUseCase {
  constructor(private readonly prescriptionRepo: PrescriptionRepository) {}

  public execute(id: string): Promise<Prescription> {
    return this.prescriptionRepo.findOneOrFail(id, true);
  }
}
