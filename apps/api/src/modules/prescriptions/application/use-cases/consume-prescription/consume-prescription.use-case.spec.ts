/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { UserRole } from '../../../../../shared/domain/enums/roles.enum';
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';
import {} from '../../../domain/errors/prescription-item.errors';
import {
  OnlyPatientsCanConsumePrescriptions,
  PrescriptionDoesNotBelongToPatientError,
  PrescriptionHasAlreadyConsumed,
  PrescriptionNotFound,
} from '../../../domain/errors/prescription.errors';
import { Prescription } from '../../../domain/types/prescription.types';
import { ConsumePrescriptionUseCase } from './consume-prescription.use-case';

describe('ConsumePrescriptionUseCase', () => {
  let useCase: ConsumePrescriptionUseCase;

  const prescriptionRepo = {
    findOneOrFail: jest.fn(),
    markAsConsumed: jest.fn(),
  };

  const patientId = '123';
  const prescriptionId = 'prescription-id';

  const prescription: Prescription = {
    id: prescriptionId,
    code: '2026-124',
    doctorId: 'doctorId',
    patientId: patientId,
    notes: 'notes updated',
    status: PrescriptionStatus.PENDING,
    updatedAt: new Date(),
    consumedAt: new Date(),
    createdAt: new Date(),
  };

  const payload = {
    role: UserRole.PATIENT,
    sub: patientId,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new ConsumePrescriptionUseCase(prescriptionRepo as any);
  });

  describe('Successful cases', () => {
    it('should update the prescription', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue(prescription);

      const result = await useCase.execute(payload, prescriptionId);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.markAsConsumed).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });

  describe('Fail cases', () => {
    it('should fail if the user is not a patient', async () => {
      await expect(
        useCase.execute({ ...payload, role: UserRole.DOCTOR }, prescriptionId),
      ).rejects.toThrow(OnlyPatientsCanConsumePrescriptions);

      expect(prescriptionRepo.findOneOrFail).not.toHaveBeenCalled();
      expect(prescriptionRepo.markAsConsumed).not.toHaveBeenCalled();
    });

    it('should fail if the prescription was not found', async () => {
      prescriptionRepo.findOneOrFail.mockRejectedValue(new PrescriptionNotFound());

      await expect(useCase.execute(payload, prescriptionId)).rejects.toThrow(
        PrescriptionNotFound,
      );

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.markAsConsumed).not.toHaveBeenCalled();
    });

    it('should fail if the prescription does not belong to the userId provided', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({ ...prescription, patientId: '789' });

      await expect(useCase.execute(payload, prescriptionId)).rejects.toThrow(
        PrescriptionDoesNotBelongToPatientError,
      );

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.markAsConsumed).not.toHaveBeenCalled();
    });

    it('should fail if the prescription has already consumed', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...prescription,
        status: PrescriptionStatus.CONSUMED,
      });

      await expect(useCase.execute(payload, prescriptionId)).rejects.toThrow(
        PrescriptionHasAlreadyConsumed,
      );

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.markAsConsumed).not.toHaveBeenCalled();
    });
  });
});
