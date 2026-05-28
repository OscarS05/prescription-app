/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';
import {
  CannotDeleteConsumedPrescriptionError,
  PrescriptionDoesNotBelongToDoctorError,
  PrescriptionNotFound,
} from '../../../domain/errors/prescription.errors';
import { PrescriptionItem } from '../../../domain/types/prescription-items.type';
import { Prescription } from '../../../domain/types/prescription.types';
import { DeletePrescriptionUseCase } from './delete-prescription.use-case';

describe('DeletePrescriptionUseCase', () => {
  let useCase: DeletePrescriptionUseCase;

  const prescriptionRepo = {
    delete: jest.fn(),
    findOneOrFail: jest.fn(),
  };

  const prescriptionId = 'prescription-id';
  const doctorId = 'doctor-id';

  const useCaseResponse: Prescription = {
    id: prescriptionId,
    code: '2026-124',
    doctorId: doctorId,
    patientId: '456',
    notes: 'notes updated',
    status: PrescriptionStatus.PENDING,
    updatedAt: new Date(),
    consumedAt: new Date(),
    createdAt: new Date(),
  };

  const item: PrescriptionItem = {
    id: 'diuu',
    prescriptionId: useCaseResponse.id,
    name: 'Prescription name',
    dosage: 'dosage',
    instructions: 'lorem ipsum',
    quantity: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new DeletePrescriptionUseCase(prescriptionRepo as any);
  });

  describe('Successful cases', () => {
    it('should delete the prescription without items', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue(useCaseResponse);
      prescriptionRepo.delete.mockResolvedValue(useCaseResponse);

      const result = await useCase.execute(prescriptionId, doctorId);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.delete).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should delete the prescription with items', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...useCaseResponse,
        items: [item, item],
      });
      prescriptionRepo.delete.mockResolvedValue(useCaseResponse);

      const result = await useCase.execute(prescriptionId, doctorId);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.delete).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });

  describe('Fail cases', () => {
    it('should fail if the prescription was not found', async () => {
      prescriptionRepo.findOneOrFail.mockRejectedValue(new PrescriptionNotFound());

      await expect(useCase.execute(prescriptionId, doctorId)).rejects.toThrow(
        PrescriptionNotFound,
      );

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.delete).not.toHaveBeenCalled();
    });

    it(`should fail if the prescription have the status: "consumed"`, async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...useCaseResponse,
        status: 'consumed',
      });

      await expect(useCase.execute(prescriptionId, doctorId)).rejects.toThrow(
        CannotDeleteConsumedPrescriptionError,
      );

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.delete).not.toHaveBeenCalled();
    });

    it('should fail if the doctorId does not match with prescription stored', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...useCaseResponse,
        doctorId: 'wrong-id',
      });

      await expect(useCase.execute(prescriptionId, doctorId)).rejects.toThrow(
        PrescriptionDoesNotBelongToDoctorError,
      );

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionRepo.delete).not.toHaveBeenCalled();
    });
  });
});
