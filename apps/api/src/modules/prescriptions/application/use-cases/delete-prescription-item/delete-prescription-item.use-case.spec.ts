/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PrescriptionStatus } from '../../../domain/enums/prescription-status.enum';
import {
  PrescriptionItemConflictError,
  PrescriptionItemNotFound,
} from '../../../domain/errors/prescription-item.errors';
import {
  CannotDeleteConsumedPrescriptionError,
  PrescriptionDoesNotBelongToDoctorError,
  PrescriptionNotFound,
} from '../../../domain/errors/prescription.errors';
import { PrescriptionItem } from '../../../domain/types/prescription-items.type';
import { Prescription } from '../../../domain/types/prescription.types';
import { DeletePrescriptionItemUseCase } from './delete-prescription-item.use-case';

describe('DeletePrescriptionItemUseCase', () => {
  let useCase: DeletePrescriptionItemUseCase;

  const prescriptionRepo = {
    findOneOrFail: jest.fn(),
  };

  const prescriptionItemRepo = {
    delete: jest.fn(),
  };

  const itemId = 'item-id';
  const anotherItemId = 'item-id-2';
  const prescriptionId = 'prescription-id';
  const doctorId = 'doctorId';

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
    id: itemId,
    prescriptionId: useCaseResponse.id,
    name: 'Prescription name',
    dosage: 'dosage',
    instructions: 'lorem ipsum',
    quantity: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new DeletePrescriptionItemUseCase(
      prescriptionRepo as any,
      prescriptionItemRepo as any,
    );
  });

  describe('Successful cases', () => {
    it('should only delete one prescription item', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...useCaseResponse,
        items: [item, { ...item, id: anotherItemId }, { ...item, id: '567' }],
      });
      prescriptionItemRepo.delete.mockResolvedValue(true);

      const result = await useCase.execute(doctorId, prescriptionId, [itemId]);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.delete).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.delete).toHaveBeenCalledWith([itemId]);
      expect(result).toBeUndefined();
    });

    it('should delete several prescription items', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...useCaseResponse,
        items: [item, { ...item, id: anotherItemId }],
      });
      prescriptionItemRepo.delete.mockResolvedValue(useCaseResponse);

      const result = await useCase.execute(doctorId, prescriptionId, [itemId, anotherItemId]);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.delete).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.delete).toHaveBeenCalledWith([itemId, anotherItemId]);
      expect(result).toBeUndefined();
    });
  });

  describe('Fail cases', () => {
    it('should fail if the prescription was not found', async () => {
      prescriptionRepo.findOneOrFail.mockRejectedValue(new PrescriptionNotFound());

      await expect(useCase.execute(doctorId, prescriptionId, [itemId])).rejects.toThrow(
        PrescriptionNotFound,
      );

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.delete).not.toHaveBeenCalled();
    });

    it(`should fail if the prescription have the status: "consumed"`, async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...useCaseResponse,
        status: 'consumed',
      });

      await expect(useCase.execute(doctorId, prescriptionId, [itemId])).rejects.toThrow(
        CannotDeleteConsumedPrescriptionError,
      );

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.delete).not.toHaveBeenCalled();
    });

    it('should fail if the doctorId does not match with prescription stored', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...useCaseResponse,
        doctorId: 'wrong-id',
      });

      await expect(useCase.execute(doctorId, prescriptionId, [itemId])).rejects.toThrow(
        PrescriptionDoesNotBelongToDoctorError,
      );

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.delete).not.toHaveBeenCalled();
    });

    it('should fail if the prescription has not items', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue(useCaseResponse);

      await expect(useCase.execute(doctorId, prescriptionId, [itemId])).rejects.toThrow(
        PrescriptionItemNotFound,
      );

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.delete).not.toHaveBeenCalled();
    });

    it('should fail if the prescription items do not match the itemIds provided', async () => {
      prescriptionRepo.findOneOrFail.mockResolvedValue({
        ...useCaseResponse,
        items: [itemId, itemId],
      });

      await expect(
        useCase.execute(doctorId, prescriptionId, [itemId, anotherItemId]),
      ).rejects.toThrow(PrescriptionItemConflictError);

      expect(prescriptionRepo.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(prescriptionItemRepo.delete).not.toHaveBeenCalled();
    });
  });
});
