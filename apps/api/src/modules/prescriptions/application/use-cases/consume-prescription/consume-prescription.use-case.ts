import { Injectable } from '@nestjs/common';
import { PrescriptionRepository } from '../../../domain/ports/prescription.repository';
import { PayloadToken } from '../../../../identity/domain/types/auth.types';
import { UserRole } from '../../../../../shared/domain/enums/roles.enum';
import {
  OnlyPatientsCanConsumePrescriptions,
  PrescriptionDoesNotBelongToPatientError,
  PrescriptionHasAlreadyConsumed,
} from '../../../domain/errors/prescription.errors';
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';

@Injectable()
export class ConsumePrescriptionUseCase {
  constructor(private readonly prescriptionRepo: PrescriptionRepository) {}

  public async execute(payload: PayloadToken, prescriptionId: string): Promise<void> {
    if (payload.role !== UserRole.PATIENT) {
      throw new OnlyPatientsCanConsumePrescriptions();
    }

    const prescription = await this.prescriptionRepo.findOneOrFail(prescriptionId, false);

    if (prescription.patientId !== payload.sub) {
      throw new PrescriptionDoesNotBelongToPatientError();
    }

    if (prescription.status === PrescriptionStatus.CONSUMED) {
      throw new PrescriptionHasAlreadyConsumed();
    }

    await this.prescriptionRepo.markAsConsumed(prescriptionId);
  }
}
