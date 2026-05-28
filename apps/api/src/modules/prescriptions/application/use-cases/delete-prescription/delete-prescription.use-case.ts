import { Injectable } from '@nestjs/common';
import { PrescriptionRepository } from '../../../domain/ports/prescription.repository';
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';
import {
  CannotDeleteConsumedPrescriptionError,
  PrescriptionDoesNotBelongToDoctorError,
} from '../../../domain/errors/prescription.errors';

@Injectable()
export class DeletePrescriptionUseCase {
  constructor(private readonly prescriptionRepo: PrescriptionRepository) {}

  public async execute(id: string, doctorId: string): Promise<void> {
    const prescription = await this.prescriptionRepo.findOneOrFail(id, true);

    if (prescription.doctorId !== doctorId) {
      throw new PrescriptionDoesNotBelongToDoctorError();
    }

    if (prescription.status === PrescriptionStatus.CONSUMED) {
      throw new CannotDeleteConsumedPrescriptionError();
    }

    // Only delete the prescription because the precription item model does not have soft delete
    await this.prescriptionRepo.delete(id);
  }
}
